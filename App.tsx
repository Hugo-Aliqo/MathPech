import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Level, UserProfile } from './types';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import AILab from './pages/AILab';
import Profile from './pages/Profile';
import LessonDetail from './pages/LessonDetail';
import Simulations from './pages/Simulations';
import ExerciseSession from './pages/ExerciseSession';
import Challenges from './pages/Challenges';
import Login from './pages/Login';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mathpech_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeLessonProgress, setActiveLessonProgress] = useState(0);

  // Sauvegarde à chaque changement du profil
  useEffect(() => {
    if (profile) {
      // 1. Sauvegarde de la session active
      localStorage.setItem('mathpech_profile', JSON.stringify(profile));
      // 2. Sauvegarde persistante des données de cet utilisateur spécifique (simulation BDD)
      localStorage.setItem(`mathpech_user_${profile.email}`, JSON.stringify(profile));
    }
  }, [profile]);

  // Streak logic on mount
  useEffect(() => {
    if (profile) {
      const today = new Date().toDateString();
      const lastActive = profile.lastActiveDate ? new Date(profile.lastActiveDate).toDateString() : null;

      if (lastActive !== today) {
        let newStreak = profile.streak;
        
        if (lastActive) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = yesterday.toDateString();

          if (lastActive === yesterdayString) {
            newStreak += 1;
          } else {
            newStreak = 1; // Reset streak if missed a day
          }
        } else {
          newStreak = 1;
        }

        setProfile(prev => prev ? ({
          ...prev,
          streak: newStreak,
          lastActiveDate: new Date().toISOString()
        }) : null);
      }
    }
  }, []);

  const handleLogin = (email: string, level: Level) => {
    // Vérifier si un compte existe déjà pour cet email
    const existingData = localStorage.getItem(`mathpech_user_${email}`);
    
    if (existingData) {
      // Connexion : on restaure les données
      const userData = JSON.parse(existingData);
      // Mise à jour éventuelle du niveau si l'utilisateur l'a changé dans le formulaire de login, 
      // ou on garde l'ancien. Ici on privilégie la continuité mais on met à jour la date.
      setProfile({
        ...userData,
        lastActiveDate: new Date().toISOString()
      });
    } else {
      // Inscription : création d'un nouveau profil
      setProfile({
        email,
        name: email.split('@')[0],
        level,
        xp: 0,
        streak: 1,
        lastActiveDate: new Date().toISOString(),
        badges: ['Bienvenue'],
        strengths: {
          'Algèbre': 50,
          'Géométrie': 50,
          'Probabilités': 50,
          'Statistiques': 50
        }
      });
    }
  };

  const handleLevelChange = (newLevel: Level) => {
    if (profile) setProfile(prev => prev ? ({ ...prev, level: newLevel }) : null);
  };

  const handleNameChange = (newName: string) => {
    if (profile) setProfile(prev => prev ? ({ ...prev, name: newName }) : null);
  };

  const addXP = (amount: number) => {
    if (profile) setProfile(prev => prev ? ({ ...prev, xp: prev.xp + amount }) : null);
  };

  const handleLogout = () => {
    localStorage.removeItem('mathpech_profile'); // Supprime seulement la session active
    setProfile(null);
  };

  if (!profile) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout userLevel={profile.level} lessonProgress={activeLessonProgress} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard profile={profile} />} />
          <Route path="/courses" element={<Courses userLevel={profile.level} />} />
          <Route 
            path="/lesson/:id" 
            element={<LessonDetail onProgressUpdate={setActiveLessonProgress} />} 
          />
          <Route path="/exercise/:lessonId" element={<ExerciseSession onComplete={(xp) => addXP(xp)} userLevel={profile.level} />} />
          <Route path="/simulations" element={<Simulations />} />
          <Route path="/ai-lab" element={<AILab userLevel={profile.level} />} />
          <Route path="/challenges" element={<Challenges profile={profile} />} />
          <Route path="/profile" element={<Profile profile={profile} onLevelChange={handleLevelChange} onNameChange={handleNameChange} onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;