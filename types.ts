
export type Level = '6eme' | '5eme' | '4eme' | '3eme' | '2nde' | '1ere' | 'Terminale';

export interface UserProfile {
  email: string;
  name: string;
  level: Level;
  xp: number;
  badges: string[];
  strengths: Record<string, number>; // 0 to 100
}

export interface Lesson {
  id: string;
  title: string;
  level: Level;
  category: 'Algebre' | 'Geometrie' | 'Analyse' | 'Probabilites' | 'Statistiques';
  summary: string;
  content: string; // Markdown/KaTeX
  videoUrl?: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  difficulty: 'Bronze' | 'Argent' | 'Or';
  question: string;
  hints: string[];
  solution: string;
  explanation: string; // Explication détaillée de la solution
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
