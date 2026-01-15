
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Send, Loader2, Info, Sparkles, Upload } from 'lucide-react';
import { Level, ChatMessage } from '../types';
import { getTutorResponse, scanProblem } from '../services/geminiService';
import MathRenderer from '../components/MathRenderer';

interface AILabProps {
  userLevel: Level;
}

const AILab: React.FC<AILabProps> = ({ userLevel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Salut ! Je suis ton tuteur MathPech. Quel exercice te pose problème aujourd'hui ? Tu peux m'écrire ou me scanner ton énoncé ! 📐`, timestamp: Date.now() }
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

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await getTutorResponse(userLevel, messages.map(m => ({ role: m.role, text: m.text })), inputValue);
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Oups, je n'ai pas pu traiter ta demande. Réessaie !", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
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
        const resultMsg = `D'après ton scan, voici un indice pour t'aider :\n\n${result.hint}\n\n**Formules utiles :**\n${result.formulas.map(f => `- $${f}$`).join('\n')}`;
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
        <p className="text-slate-500 text-sm">Scanner un problème ou discuter avec ton tuteur personnalisé.</p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                <MathRenderer content={msg.text} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl p-4 rounded-tl-none border border-slate-200 flex items-center gap-2">
                <Loader2 className="animate-spin text-slate-400" size={18} />
                <span className="text-slate-400 text-sm italic">MathPech réfléchit...</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex gap-2 items-center bg-white border border-slate-300 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-inner">
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
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              title="Scanner un problème"
            >
              {isScanning ? <Loader2 className="animate-spin" /> : <Camera />}
            </button>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pose ta question ici..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-1"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:bg-slate-300"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center flex items-center justify-center gap-1">
            <Info size={12} /> L'IA peut faire des erreurs. Vérifie toujours tes résultats.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AILab;
