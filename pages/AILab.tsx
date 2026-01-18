import React, { useState, useRef, useEffect } from 'react';
import { Camera, Send, Loader2, Info, Sparkles, Upload, BrainCircuit, HelpCircle, GraduationCap } from 'lucide-react';
import { Level, ChatMessage } from '../types';
import { getTutorResponse, scanProblem, generatePracticeQuestion } from '../services/geminiService';
import MathRenderer from '../components/MathRenderer';

interface AILabProps {
  userLevel: Level;
}

const AILab: React.FC<AILabProps> = ({ userLevel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Salut ! Je suis ton tuteur MathPech. 🧠\n\nJe suis là pour t'aider à comprendre, pas juste te donner les réponses. Pose-moi une question ou envoie une photo !`, timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await getTutorResponse(userLevel, history, textToSend);
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Oups, je n'ai pas pu traiter ta demande. Réessaie !", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: 'test' | 'explain' | 'hint') => {
    if (isLoading) return;

    let prompt = "";
    if (action === 'test') {
      prompt = "Teste-moi sur le sujet dont on vient de parler.";
    } else if (action === 'explain') {
      prompt = "Peux-tu m'expliquer ça plus simplement, comme si j'avais 10 ans ?";
    } else if (action === 'hint') {
      prompt = "Donne-moi juste un indice, pas la réponse.";
    }

    await handleSend(prompt);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    // Read file as base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await scanProblem(userLevel, base64);
        const resultMsg = `🔎 **Analyse terminée !**\n\nVoici un indice pour te débloquer :\n"${result.hint}"\n\n**Formules utiles :**\n${result.formulas.map(f => `- $${f}$`).join('\n')}\n\nEssaye de résoudre l'exercice avec ça et dis-moi ce que tu trouves !`;
        setMessages(prev => [...prev, { role: 'model', text: resultMsg, timestamp: Date.now() }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'model', text: "Désolé, je n'ai pas pu analyser cette image. Assure-toi que l'énoncé est bien lisible.", timestamp: Date.now() }]);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-6rem)]">
      <header className="mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-indigo-500" /> Laboratoire IA
        </h2>
        <p className="text-slate-500 text-sm">Ton tuteur personnel qui s'adapte à ton rythme.</p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  <MathRenderer content={msg.text} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.role === 'model' ? 'Tuteur MathPech' : 'Toi'}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-slate-50 rounded-2xl p-4 rounded-tl-none border border-slate-100 flex items-center gap-2">
                <Loader2 className="animate-spin text-indigo-600" size={18} />
                <span className="text-slate-500 text-sm font-medium">Je réfléchis à la meilleure explication...</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar & Input */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-3">
          
          {/* Quick Actions Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => handleQuickAction('hint')}
              disabled={isLoading || messages.length < 2}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              <HelpCircle size={14} /> Un indice ?
            </button>
            <button 
              onClick={() => handleQuickAction('explain')}
              disabled={isLoading || messages.length < 2}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              <BrainCircuit size={14} /> Simplifie l'explication
            </button>
            <button 
              onClick={() => handleQuickAction('test')}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              <GraduationCap size={14} /> Teste-moi !
            </button>
          </div>

          <div className="flex gap-2 items-center bg-white border border-slate-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-sm">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning || isLoading}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50"
              title="Scanner un exercice"
            >
              {isScanning ? <Loader2 className="animate-spin text-indigo-600" /> : <Camera />}
            </button>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pose ta question ou décris ton blocage..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-1 placeholder:text-slate-400"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:bg-slate-300 shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <Info size={12} /> L'IA tuteur peut faire des erreurs. Vérifie toujours tes résultats.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AILab;