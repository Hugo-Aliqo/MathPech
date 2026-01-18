import React from 'react';
import { UserProfile, Level } from '../types';
import { LEVELS } from '../constants';
import { Settings, LogOut, Bell, ShieldCheck, Mail, User } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  onLevelChange: (level: Level) => void;
  onNameChange: (name: string) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onLevelChange, onNameChange, onLogout }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
          {profile.name[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-3xl font-bold">{profile.name}</h2>
          <div className="flex items-center gap-2 text-slate-500">
            <Mail size={14} /> {profile.email}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Settings */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 h-fit">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Settings size={22} className="text-slate-400" /> Paramètres du Compte
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Pseudo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Ton pseudo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mon Niveau Actuel</label>
              <select 
                value={profile.level}
                onChange={(e) => onLevelChange(e.target.value as Level)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {LEVELS.map(lvl => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label} ({lvl.cycle})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-2">
                Le contenu de l'application s'adapte à ton niveau : <strong>{profile.level}</strong>.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-slate-400" />
                  <span className="text-sm font-medium">Notifications</span>
                </div>
                <div className="w-10 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-slate-400" />
                  <span className="text-sm font-medium">Confidentialité (RGPD)</span>
                </div>
              </button>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 text-red-600 font-bold bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
              >
                <LogOut size={20} /> Déconnexion
              </button>
            </div>
          </div>
        </section>

        {/* Gamification / Stats */}
        <section className="space-y-6">
          <div className="bg-indigo-600 text-white rounded-3xl p-6 shadow-xl shadow-indigo-100">
            <h3 className="text-lg font-bold mb-4">Statistiques Globales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                <div className="text-3xl font-bold">0h</div>
                <div className="text-xs opacity-70">Temps d'étude</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <div className="text-3xl font-bold">{profile.xp}</div>
                <div className="text-xs opacity-70">Total XP</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;