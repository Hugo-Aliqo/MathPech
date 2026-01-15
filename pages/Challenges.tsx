
import React from 'react';
import { UserProfile } from '../types';
import { Trophy, Star, Target, Zap, Clock, Medal } from 'lucide-react';

interface ChallengesProps {
  profile: UserProfile;
}

const Challenges: React.FC<ChallengesProps> = ({ profile }) => {
  const dailyChallenges = [
    { title: "Calcul Rapide", desc: "Fais 3 exercices sans erreur", progress: 2, total: 3, xp: 100 },
    { title: "Explorateur", desc: "Regarde 2 vidéos de cours", progress: 1, total: 2, xp: 50 },
    { title: "Tuteur IA", desc: "Pose 1 question au chatbot", progress: 0, total: 1, xp: 30 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="text-yellow-500" size={32} /> Centre de Défis
        </h2>
        <p className="text-slate-500">Gagne des récompenses et progresse dans le classement.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Défis Quotidiens */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Clock className="text-indigo-500" size={20} /> Défis du jour</h3>
          <div className="grid gap-4">
            {dailyChallenges.map((challenge, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{challenge.title}</h4>
                    <p className="text-sm text-slate-500">{challenge.desc}</p>
                  </div>
                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                    +{challenge.xp} XP
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Progression</span>
                    <span>{challenge.progress} / {challenge.total}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classement / Badges */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><Medal className="text-yellow-500" size={20} /> Tes Badges</h3>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {profile.badges.map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                  <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Star size={32} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{badge}</span>
                </div>
              ))}
              <div className="flex flex-col items-center text-center p-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 opacity-50">
                <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-3">
                  <Target size={32} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">À débloquer</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-6 text-white text-center">
            <Zap className="mx-auto mb-4 text-yellow-400" size={40} />
            <h4 className="text-xl font-bold mb-2">Boost de Weekend !</h4>
            <p className="text-indigo-200 text-sm mb-6">Tes gains d'XP seront doublés ce samedi et dimanche.</p>
            <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm">Activer le rappel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
