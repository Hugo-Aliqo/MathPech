
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_LESSONS, MOCK_EXERCISES } from '../constants';
import { ChevronLeft, Play, FileText, CheckCircle2, Pause, Volume2, Loader2, Sparkles, Brain, Trophy, Star, ArrowRight, XCircle, Lightbulb, BookOpenCheck } from 'lucide-react';
import MathRenderer from '../components/MathRenderer';
import { generateLessonAudio, explainMistake } from '../services/geminiService';

interface LessonDetailProps {
  onProgressUpdate: (progress: number) => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ onProgressUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = MOCK_LESSONS.find(l => l.id === id);
  const exercises = MOCK_EXERCISES[id || ''] || [];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const [quickQuizStep, setQuickQuizStep] = useState<'idle' | 'answering' | 'feedback'>('idle');
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    onProgressUpdate(progress);
    return () => onProgressUpdate(0);
  }, [progress, onProgressUpdate]);

  const startLesson = async () => {
    if (audioBase64) {
      setIsPlaying(true);
      audioRef.current?.play();
      return;
    }
    setIsLoadingAudio(true);
    const audioData = await generateLessonAudio(lesson?.title || '', lesson?.content || '');
    if (audioData) {
      setAudioBase64(audioData);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
    setIsLoadingAudio(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioBase64 && !isLoadingAudio) {
        startLesson();
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (audioBase64 && audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${audioBase64}`;
      audioRef.current.play();
    }
  }, [audioBase64]);

  useEffect(() => {
    let interval: number;
    if (isPlaying && progress < 100) {
      interval = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return p + 0.2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  const handleQuickQuiz = async () => {
    if (quickQuizStep === 'idle') {
      setQuickQuizStep('answering');
      return;
    }
    const firstEx = exercises[0];
    if (!firstEx) return;
    const cleanUser = quizAnswer.replace(/\s/g, '').toLowerCase();
    const cleanSol = firstEx.solution.replace(/\s/g, '').toLowerCase();
    if (cleanUser === cleanSol) {
      setQuizFeedback('correct');
      setQuickQuizStep('feedback');
    } else {
      setQuizFeedback('wrong');
      setQuickQuizStep('feedback');
      setIsAiExplaining(true);
      const explanation = await explainMistake(lesson?.level || '3eme', firstEx.question, firstEx.solution, quizAnswer);
      setAiExplanation(explanation);
      setIsAiExplaining(false);
    }
  };

  if (!lesson) return <div className="p-10 text-center text-slate-500 font-bold">Cours introuvable.</div>;

  const demoExercise = exercises.find(e => e.difficulty === 'Bronze') || exercises[0];

  const exerciseCountByDifficulty = {
    Bronze: exercises.filter(e => e.difficulty === 'Bronze').length,
    Argent: exercises.filter(e => e.difficulty === 'Argent').length,
    Or: exercises.filter(e => e.difficulty === 'Or').length,
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
          <ChevronLeft size={20} /> Retour aux cours
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-50">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tight">{lesson.category}</span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tight">Niveau {lesson.level}</span>
            </div>
            <h1 className="text-3xl font-poppins font-bold text-slate-800">{lesson.title}</h1>
          </div>

          <div className="aspect-video bg-slate-900 relative group overflow-hidden border-b-4 border-indigo-500">
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} onTimeUpdate={(e) => setProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100)} />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              {!isPlaying && progress === 0 ? (
                <div className="text-center">
                  <button onClick={startLesson} disabled={isLoadingAudio} className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white scale-100 hover:scale-110 transition-all shadow-2xl relative z-10">
                    {isLoadingAudio ? <Loader2 className="animate-spin" size={40} /> : <Play size={40} fill="white" />}
                  </button>
                  <p className="text-white/60 mt-4 font-medium text-sm">Lancer l'explication vocale IA</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative">
                    <Sparkles className="absolute -top-4 -right-4 text-yellow-400 animate-pulse" size={32} />
                    <div className="min-h-[120px] flex items-center justify-center text-center">
                      <MathRenderer content={progress < 40 ? lesson.title : lesson.content.split('\n')[0]} className="text-white text-xl md:text-3xl font-medium" block />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform flex items-center gap-4 text-white">
              <button onClick={togglePlay}>{isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}</button>
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex items-center gap-2 text-indigo-400">
                <Volume2 size={18} />
                <span className="text-[10px] font-mono font-bold uppercase">IA Audio</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="text-indigo-500" size={24} /> Fiche Synthétique
              </h3>
              <div className="prose prose-slate max-w-none bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                <MathRenderer content={lesson.content} />
              </div>
            </section>

            {/* CAS PRATIQUE / EXEMPLE RÉSOLU */}
            {demoExercise && (
              <section className="bg-indigo-50/50 rounded-3xl p-8 border-2 border-dashed border-indigo-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                    <BookOpenCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-indigo-900">Cas Pratique : Exemple Résolu</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Énoncé</p>
                    <MathRenderer content={demoExercise.question} className="text-lg font-medium text-slate-800" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                      <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Solution</p>
                      <MathRenderer content={demoExercise.solution} className="text-xl font-bold text-green-700" />
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Lightbulb size={12} /> Explication détaillée
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        <MathRenderer content={demoExercise.explanation} />
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* SECTION EXERCICES INTERACTIFS */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-poppins font-bold text-slate-800 flex items-center gap-3">
            <Brain className="text-indigo-600" size={28} /> Entraînement Interactif
          </h2>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{exercises.length} Exercices dispos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Bronze', 'Argent', 'Or'] as const).map((diff) => {
            const count = exerciseCountByDifficulty[diff];
            const isAvailable = count > 0;
            const theme = {
              Bronze: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', icon: <Star className="fill-orange-500" />, desc: 'Bases et applications directes' },
              Argent: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600', icon: <Trophy className="fill-slate-400" />, desc: 'Réflexion et calculs complexes' },
              Or: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', icon: <Trophy className="fill-yellow-500" />, desc: 'Défis de logique et expert' },
            }[diff];

            return (
              <div key={diff} className={`bg-white rounded-3xl p-6 border-2 shadow-sm flex flex-col transition-all ${isAvailable ? `hover:shadow-lg ${theme.border} cursor-pointer group` : 'opacity-60 grayscale'}`}>
                <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {theme.icon}
                </div>
                <h5 className="font-bold text-slate-800 text-lg mb-1">Niveau {diff}</h5>
                <p className="text-xs text-slate-400 mb-2 font-medium">{theme.desc}</p>
                <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight text-slate-400">
                    <span>{count} questions</span>
                    <span>+50 XP / ex</span>
                  </div>
                  {isAvailable ? (
                    <Link to={`/exercise/${lesson.id}`} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors">
                      Démarrer <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 italic text-center">Bientôt disponible</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
