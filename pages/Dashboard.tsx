import React from 'react';
import { UserProfile } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Play, Flame, Award, ArrowRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_LESSONS } from '../constants';

interface DashboardProps {
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const radarData = Object.entries(profile.strengths).map(([subject, value]) => ({
    subject,
    value,
    fullMark: 100,
  }));

  const isLycee = ['2nde', '1ere', 'Terminale'].includes(profile.level);
  const primaryColor = isLycee ? '#4f46e5' : '#f97316';

  // Filtrer les cours pour le niveau de l'utilisateur
  const levelAppropriateLessons = MOCK_LESSONS.filter(l => l.level === profile.level);
  const displayLessons = levelAppropriateLessons.length > 0 ? levelAppropriateLessons : MOCK_LESSONS;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-poppins font-bold text-slate-800">Salut, {profile.name} ! 👋</h2>
          <p className="text-slate-500 mt-1">Niveau actuel : <span className="font-bold text-indigo-600">{profile.level}</span></p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
            <Flame className="text-orange-500 fill-orange-500" size={20} />
            <span className="font-bold">{profile.streak} {profile.streak > 1 ? 'Jours' : 'Jour'}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
            <Award className="text-yellow-500" size={20} />
            <span className="font-bold">{profile.xp} XP</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart Analysis */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">Tes compétences en {profile.level}</h3>
          {/* Ajout de min-w-0 et relative pour la stabilité du conteneur */}
          <div className="h-64 w-full min-w-0 relative">
            {/* Ajout de minWidth={0} et minHeight={0} pour supprimer les avertissements Recharts */}
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Radar
                  name="Maitrise"
                  dataKey="value"
                  stroke={primaryColor}
                  fill={primaryColor}
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
            <p className="text-sm text-slate-600">
              💡 <strong>Astuce :</strong> Ton profil montre une bonne maîtrise. Continue tes efforts en {profile.level} pour débloquer le badge Or !
            </p>
          </div>
        </div>

        {/* Recent Badges */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">Succès récents</h3>
          <div className="space-y-4">
            {profile.badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <Trophy size={24} />
                </div>
                <div>
                  <div className="font-bold text-sm">{badge}</div>
                  <div className="text-xs text-slate-500">Débloqué récemment</div>
                </div>
              </div>
            ))}
            <Link to="/challenges" className="block w-full py-3 text-center text-sm font-bold text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
              Voir tous les badges
            </Link>
          </div>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Recommandé pour ta classe ({profile.level})</h3>
          <Link to="/courses" className={`text-sm font-bold flex items-center gap-1 ${isLycee ? 'text-indigo-600' : 'text-orange-600'}`}>
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayLessons.slice(0, 3).map((lesson) => (
            <Link 
              to={`/lesson/${lesson.id}`} 
              key={lesson.id} 
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full tracking-wider">
                  {lesson.category}
                </span>
                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  <Play size={18} className={isLycee ? 'text-indigo-600' : 'text-orange-600'} />
                </div>
              </div>
              <h4 className="font-bold text-lg mb-2">{lesson.title}</h4>
              <p className="text-slate-500 text-sm line-clamp-2">{lesson.summary}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">Progression : 0%</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${lesson.level === profile.level ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {lesson.level}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;