
import React, { useState } from 'react';
import { Level } from '../types';
import { MOCK_LESSONS, LEVELS } from '../constants';
import { Search, BookOpen, GraduationCap, X, ChevronRight, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface CoursesProps {
  userLevel: Level;
}

const Courses: React.FC<CoursesProps> = ({ userLevel }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllLevels, setShowAllLevels] = useState(false);
  
  const categories = Array.from(new Set(MOCK_LESSONS.map(l => l.category)));
  const currentLevelLabel = LEVELS.find(l => l.value === userLevel)?.label || userLevel;

  const filteredLessons = MOCK_LESSONS.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         l.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? l.category === selectedCategory : true;
    const matchesLevel = showAllLevels ? true : l.level === userLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Bibliothèque de {showAllLevels ? "tous les niveaux" : currentLevelLabel}</h2>
          <p className="text-slate-500">Parcours ton programme officiel et progresse à ton rythme.</p>
        </div>
        <button 
          onClick={() => setShowAllLevels(!showAllLevels)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${showAllLevels ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'}`}
        >
          <Filter size={16} />
          {showAllLevels ? "Filtrer par mon niveau" : "Voir tous les niveaux"}
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center sticky top-0 md:relative z-10 bg-slate-50 py-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une notion (ex: Pythagore, Dérivée)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
          {selectedCategory && (
            <button onClick={() => setSelectedCategory(null)} className="p-2.5 bg-red-50 text-red-600 rounded-xl">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {!showAllLevels && filteredLessons.length === 0 && (
         <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl text-center">
            <p className="text-indigo-900 font-bold mb-2">Tu as déjà tout exploré pour ton niveau ({userLevel}) ?</p>
            <p className="text-indigo-600 text-sm mb-4">Essaye d'explorer les niveaux supérieurs pour prendre de l'avance !</p>
            <button 
              onClick={() => setShowAllLevels(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md"
            >
              Passer au niveau supérieur
            </button>
         </div>
      )}

      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLessons.map(lesson => (
            <Link 
              key={lesson.id} 
              to={`/lesson/${lesson.id}`}
              className="flex gap-4 p-5 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${lesson.level === userLevel ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                <BookOpen size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">{lesson.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${lesson.level === userLevel ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                    {LEVELS.find(lvl => lvl.value === lesson.level)?.label}
                  </span>
                </div>
                <h3 className="font-bold text-lg group-hover:text-indigo-600 transition-colors truncate">{lesson.title}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{lesson.summary}</p>
                <div className="flex items-center gap-2 mt-4 text-xs font-bold text-indigo-600">
                   Étudier ce cours <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium mb-4">Aucun cours ne correspond à ta recherche.</p>
          <button 
            onClick={() => {setSearchTerm(''); setSelectedCategory(null);}}
            className="text-indigo-600 font-bold hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;
