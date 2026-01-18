import React, { useState } from 'react';
import { GraduationCap, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { Level } from '../types';
import { LEVELS } from '../constants';

interface LoginProps {
  onLogin: (email: string, level: Level) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState<Level>('3eme');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email, level);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
            <GraduationCap size={48} />
          </div>
          <h1 className="text-3xl font-poppins font-bold text-slate-800">MathPech</h1>
          <p className="text-slate-500 text-sm mt-2 text-center italic">Connecte-toi pour retrouver ta progression.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Adresse Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: eleve@mathpech.fr"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Niveau (pour l'inscription)</label>
            <select 
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {LEVELS.map(lvl => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label} ({lvl.cycle})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 italic">Si tu as déjà un compte, ton niveau sauvegardé sera chargé.</p>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            Se connecter <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          <ShieldCheck size={14} /> Données sauvegardées localement
        </div>
      </div>
    </div>
  );
};

export default Login;