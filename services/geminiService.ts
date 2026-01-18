import { GoogleGenAI, Part, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Chat interactif principal.
 * Utilise une méthode Socratique : guide l'élève par des questions plutôt que de donner la solution.
 */
export const getTutorResponse = async (level: string, history: { role: 'user' | 'model'; text: string }[], message: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: `Tu es "MathPech Bot", un tuteur de mathématiques expert et bienveillant pour un élève de niveau ${level}.

      RÈGLES PÉDAGOGIQUES STRICTES :
      1. NE DONNE JAMAIS la réponse finale directement.
      2. Utilise la méthode Socratique : pose des questions pour guider l'élève vers la solution.
      3. Si l'élève fait une erreur, ne dis pas juste "c'est faux". Explique le concept mal compris et donne un contre-exemple simple.
      4. Sois encourageant, utilise des emojis avec parcimonie pour rendre le dialogue chaleureux.
      5. Utilise le format LaTeX pour les mathématiques (ex: $x^2 + y = 2$).
      6. Si l'élève demande "Teste-moi", génère un petit exercice adapté au sujet de la conversation précédente.
      
      Ta mission est de construire la confiance de l'élève en lui faisant trouver la solution par lui-même.`,
      temperature: 0.7,
    }
  });

  return response.text || "Désolé, je rencontre une petite difficulté technique.";
};

/**
 * Analyse spécifique d'une erreur textuelle pour donner un feedback détaillé.
 */
export const explainMistake = async (level: string, question: string, correctAnswer: string, userAnswer: string): Promise<string> => {
  const prompt = `Contexte : Élève de niveau ${level}.
  Question : "${question}"
  Réponse attendue : "${correctAnswer}"
  Réponse de l'élève : "${userAnswer}"
  
  Tâche :
  1. Identifie le type d'erreur (erreur de calcul, confusion de concept, erreur d'inattention, etc.).
  2. Explique pourquoi ce raisonnement mène à ce résultat incorrect.
  3. Donne une astuce mnémotechnique ou une méthode pour ne plus faire cette erreur.
  4. Reste bref et encourageant.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: "Tu es un spécialiste de la remédiation cognitive en mathématiques.",
    }
  });

  return response.text || "Il semble y avoir une erreur. Vérifions les étapes ensemble.";
};

/**
 * Génère une question d'entraînement basée sur le contexte.
 */
export const generatePracticeQuestion = async (level: string, topicContext: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: `Génère une question d'entraînement courte et stimulante sur ce sujet : "${topicContext}". Niveau : ${level}.` }] }],
    config: {
      systemInstruction: "Tu es un générateur de quiz. Pose une seule question claire. N'inclus pas la réponse, attends que l'élève réponde.",
    }
  });
  
  return response.text || "Prêt pour un petit défi ? Calcule $12 \\times 12$.";
}

/**
 * Analyse d'image avec vision par ordinateur (Gemini).
 */
export const scanProblem = async (level: string, base64Image: string): Promise<{ hint: string; formulas: string[] }> => {
  const imagePart: Part = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart: Part = {
    text: `Agis comme un tuteur expert pour un élève de ${level}.
    Analyse cette image d'exercice de maths.
    
    Tâche :
    1. Identifie le concept clé (Thalès, Dérivée, Fraction, etc.).
    2. Donne un "indice de démarrage" sans résoudre l'exercice (ex: "Commence par isoler x...").
    3. Liste les formules exactes nécessaires.
    
    Réponds UNIQUEMENT au format JSON : { "hint": "...", "formulas": ["...", "..."] }`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: 'application/json'
    }
  });

  try {
    const text = response.text || '{}';
    const data = JSON.parse(text);
    return {
      hint: data.hint || "Regarde bien l'énoncé pour identifier la notion clé.",
      formulas: Array.isArray(data.formulas) ? data.formulas : []
    };
  } catch (e) {
    console.error("JSON Parse error", e);
    return { hint: "Je n'ai pas pu lire l'image correctement. Essaye de prendre une photo plus nette.", formulas: [] };
  }
};

/**
 * Génère une narration audio pour une leçon donnée.
 */
export const generateLessonAudio = async (title: string, content: string): Promise<string | null> => {
  try {
    const prompt = `Explique pédagogiquement et calmement cette leçon de mathématiques intitulée "${title}". 
    Voici le contenu : ${content}. 
    Fais une explication courte de 30 secondes maximum pour un élève. 
    Ne lis pas les symboles LaTeX de manière brute, dis par exemple "a au carré" pour a^2.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Voix claire et posée
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};