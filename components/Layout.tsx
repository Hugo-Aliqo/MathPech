import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, BrainCircuit, User, GraduationCap, Trophy, Microscope, LogOut } from 'lucide-react';
import { Level } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userLevel: Level;
  lessonProgress?: number;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userLevel, lessonProgress = 0, onLogout }) => {
  const location = useLocation();
  
  // Theme logic: Lycée (2nde to Terminale) is more "sober", College is more "playful"
  const isLycee = ['2nde', '1ere', 'Terminale'].includes(userLevel);
  const themeClass = isLycee ? 'bg-indigo-900' : 'bg-orange-500';
  const accentClass = isLycee ? 'text-indigo-600' : 'text-orange-600';
  const progressBarColor = isLycee ? 'bg-indigo-600' : 'bg-orange-500';

  const navItems = [
    { icon: <Home size={20} />, label: 'Accueil', path: '/' },
    { icon: <BookOpen size={20} />, label: 'Cours', path: '/courses' },
    { icon: <Microscope size={20} />, label: 'Labo', path: '/simulations' },
    { icon: <BrainCircuit size={20} />, label: 'Aide IA', path: '/ai-lab' },
    { icon: <Trophy size={20} />, label: 'Défis', path: '/challenges' },
    { icon: <User size={20} />, label: 'Profil', path: '/profile' },
  ];

  const isAtLesson = location.pathname.startsWith('/lesson/');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <header className={`md:hidden ${themeClass} text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md`}>
        <div className="flex items-center gap-2">
            <GraduationCap size={28} />
            <h1 className="text-xl font-poppins font-bold">MathPech</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {userLevel}
          </div>
          <button 
            onClick={onLogout}
            className="p-1 bg-white/10 rounded-full hover:bg-white/30 transition-colors"
            title="Déconnexion"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Sidebar Navigation (Desktop) */}
      <nav className={`hidden md:flex flex-col w-64 ${themeClass} text-white p-6 sticky top-0 h-screen shadow-xl`}>
        <div className="flex items-center gap-3 mb-10">
          <GraduationCap size={32} />
          <h1 className="text-2xl font-poppins font-bold">MathPech</h1>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path ? 'bg-white/20 font-bold' : 'hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-4 space-y-4">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all text-sm font-medium"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>

            <div className="p-4 bg-white/10 rounded-2xl">
              <div className="text-xs opacity-70 mb-1">Progression Semaine</div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4"></div>
              </div>
              <div className="text-right text-xs mt-1">750 XP</div>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex flex-col z-50">
        {/* Lesson Progress Indicator */}
        {isAtLesson && (
          <div className="w-full h-[3px] bg-slate-100 overflow-hidden">
            <div 
              className={`h-full ${progressBarColor} transition-all duration-300 ease-out`}
              style={{ width: `${lessonProgress}%` }}
            ></div>
          </div>
        )}
        
        <div className="flex justify-around p-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all ${
                location.pathname === item.path ? accentClass : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;