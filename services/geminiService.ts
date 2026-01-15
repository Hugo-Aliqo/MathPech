
import { GoogleGenAI, Part, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTutorResponse = async (level: string, history: { role: 'user' | 'model'; text: string }[], message: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: `Tu es un professeur de mathématiques français bienveillant nommé "MathPech Bot". 
      Niveau de l'élève: ${level}. 
      OBJECTIF: Aide l'élève à comprendre sans donner directement la réponse. 
      Utilise le format LaTeX pour les formules (ex: $x^2$). 
      Reste pédagogique, encourageant et concis.`,
      temperature: 0.7,
    }
  });

  return response.text || "Désolé, je rencontre une petite difficulté technique.";
};

export const explainMistake = async (level: string, question: string, correctAnswer: string, userAnswer: string): Promise<string> => {
  const prompt = `L'élève (niveau ${level}) a répondu "${userAnswer}" à la question "${question}". La réponse correcte est "${correctAnswer}". 
  Explique pourquoi sa réponse est probablement fausse et quels sont les pièges classiques associés à ce type de question. Sois encourageant.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: "Tu es un tuteur en mathématiques spécialisé dans la remédiation scolaire. Ton but est d'expliquer l'origine de l'erreur d'un élève de manière pédagogique.",
    }
  });

  return response.text || "Il semble y avoir une erreur de calcul. Reprends les étapes doucement !";
};

export const scanProblem = async (level: string, base64Image: string): Promise<{ hint: string; formulas: string[] }> => {
  const imagePart: Part = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart: Part = {
    text: `Analyse cette image d'exercice de mathématiques pour un élève de ${level}. 
    Donne un indice pour commencer et liste les formules clés nécessaires. 
    NE DONNE PAS LA RÉPONSE FINALE. 
    Réponds au format JSON: { "hint": "...", "formulas": ["...", "..."] }`
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
    return { hint: "Je n'ai pas pu lire l'image correctement.", formulas: [] };
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
