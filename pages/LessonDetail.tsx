
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_LESSONS, MOCK_EXERCISES } from '../constants';
import { ChevronLeft, Play, FileText, CheckCircle2, Pause, SkipForward, Volume2, Loader2, Sparkles, Brain, Trophy, Star, ArrowRight, XCircle, Info, Lightbulb } from 'lucide-react';
import MathRenderer from '../components/MathRenderer';
import { generateLessonAudio, explainMistake } from '../services/geminiService';

const LessonDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = MOCK_LESSONS.find(l => l.id === id);
  const exercises = MOCK_EXERCISES[id || ''] || [];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  // State for the quick mini-quiz
  const [quickQuizStep, setQuickQuizStep] = useState<'idle' | 'answering' | 'feedback'>('idle');
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const getWhiteboardContent = () => {
    if (progress < 10) return "";
    if (progress < 40) return lesson.title;
    if (progress < 70) return lesson.content.split('\n')[0];
    return lesson.content;
  };

  const exerciseCountByDifficulty = {
    Bronze: exercises.filter(e => e.difficulty === 'Bronze').length,
    Argent: exercises.filter(e => e.difficulty === 'Argent').length,
    Or: exercises.filter(e => e.difficulty === 'Or').length,
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="space-y-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
        >
          <ChevronLeft size={20} /> Retour aux cours
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-50">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tight">
                {lesson.category}
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tight">
                Niveau {lesson.level}
              </span>
            </div>
            <h1 className="text-3xl font-poppins font-bold text-slate-800">{lesson.title}</h1>
          </div>

          <div className="aspect-video bg-slate-900 relative group overflow-hidden border-b-4 border-indigo-500">
            <audio 
              ref={audioRef} 
              onEnded={() => setIsPlaying(false)} 
              onTimeUpdate={(e) => {
                const el = e.currentTarget;
                setProgress((el.currentTime / el.duration) * 100);
              }}
            />
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
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
                    <div className="text-white font-poppins text-center mb-6 opacity-40 text-xs uppercase tracking-widest">Explication en cours...</div>
                    <div className="min-h-[120px] flex items-center justify-center text-center">
                      <MathRenderer content={getWhiteboardContent()} className="text-white text-xl md:text-3xl font-medium leading-relaxed" block />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 space-y-4 translate-y-2 group-hover:translate-y-0 transition-transform">
              <div className="flex items-center gap-4 text-white">
                <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
                  {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                </button>
                <div className="flex-1 h-2 bg-white/20 rounded-full relative cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const newProgress = ((e.clientX - rect.left) / rect.width);
                  if (audioRef.current) audioRef.current.currentTime = newProgress * audioRef.current.duration;
                  setProgress(newProgress * 100);
                }}>
                  <div className="absolute h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.8)]" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex items-center gap-2 text-indigo-400">
                  <Volume2 size={18} />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">IA Audio</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="text-indigo-500" size={24} /> Fiche Synthétique
              </h3>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                <MathRenderer content={lesson.content} />
              </div>
            </section>

            <section className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-indigo-600" /> Ce qu'il faut retenir
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-indigo-800 text-sm font-medium">
                  <span className="text-indigo-400 shrink-0">•</span>
                  Vérifie toujours l'ordre des termes avant d'appliquer les formules.
                </li>
                <li className="flex gap-3 text-indigo-800 text-sm font-medium">
                  <span className="text-indigo-400 shrink-0">•</span>
                  Le signe "-" devant une parenthèse inverse tous les signes à l'intérieur.
                </li>
              </ul>
            </section>
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

        {/* 1. Mini Quiz Immédiat */}
        {exercises.length > 0 && (
          <div className="bg-white rounded-3xl border-2 border-indigo-100 p-8 shadow-xl shadow-indigo-50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-1 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white p-2 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900">Vérifie ta compréhension</h4>
                  <p className="text-xs text-slate-500">Un mini-test pour voir si tu as bien suivi.</p>
                </div>
              </div>

              {quickQuizStep === 'idle' ? (
                <div className="flex items-center justify-between gap-4">
                  <p className="text-slate-600 text-sm font-medium italic">"Prêt pour une petite question rapide sur cette leçon ?"</p>
                  <button onClick={() => setQuickQuizStep('answering')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-all shrink-0">
                    C'est parti !
                  </button>
                </div>
              ) : quickQuizStep === 'answering' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-lg font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <MathRenderer content={exercises[0].question} />
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Ta réponse..." 
                      value={quizAnswer}
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleQuickQuiz()}
                      className="flex-1 p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <button onClick={handleQuickQuiz} className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                      Vérifier
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-in zoom-in duration-300 space-y-4">
                  <div className={`flex items-center gap-3 p-4 rounded-2xl ${quizFeedback === 'correct' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {quizFeedback === 'correct' ? <CheckCircle2 /> : <XCircle />}
                    <span className="font-bold">{quizFeedback === 'correct' ? 'Bravo ! Tu as bien compris.' : 'Pas tout à fait...'}</span>
                  </div>

                  {quizFeedback === 'wrong' && (
                    <div className="space-y-4">
                      <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                        <div className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
                          <Brain size={18} /> L'analyse du tuteur IA :
                        </div>
                        {isAiExplaining ? (
                          <div className="flex items-center gap-2 text-indigo-400 text-sm italic">
                            <Loader2 className="animate-spin" size={14} /> Analyse en cours...
                          </div>
                        ) : (
                          <div className="text-sm text-indigo-800 italic leading-relaxed">
                             <MathRenderer content={aiExplanation} />
                          </div>
                        )}
                      </div>
                      <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100">
                         <div className="flex items-center gap-2 font-bold text-yellow-900 mb-1">
                            <Lightbulb size={18} /> La bonne méthode :
                         </div>
                         <div className="text-sm text-yellow-800">
                            <MathRenderer content={exercises[0].explanation} />
                         </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setQuickQuizStep('idle'); setQuizAnswer(''); setQuizFeedback(null); }} className="px-4 py-2 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors">
                      Réessayer
                    </button>
                    <button onClick={() => setQuickQuizStep('idle')} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Défis par Niveau (Selection) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Bronze', 'Argent', 'Or'] as const).map((diff) => {
            const count = exerciseCountByDifficulty[diff];
            const isAvailable = count > 0;
            const theme = {
              Bronze: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600', icon: <Star className="fill-orange-500" /> },
              Argent: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600', icon: <Trophy className="fill-slate-400" /> },
              Or: { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-600', icon: <Trophy className="fill-yellow-500" /> },
            }[diff];

            return (
              <div key={diff} className={`bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center transition-all ${isAvailable ? 'hover:shadow-md hover:border-indigo-200 cursor-pointer group' : 'opacity-60 grayscale'}`}>
                <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {theme.icon}
                </div>
                <h5 className="font-bold text-slate-800 mb-1">Niveau {diff}</h5>
                <p className="text-xs text-slate-400 mb-6 font-medium uppercase tracking-tight">{count} exercices disponibles</p>
                
                {isAvailable ? (
                  <Link 
                    to={`/exercise/${lesson.id}`} 
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors"
                  >
                    Démarrer <ArrowRight size={14} />
                  </Link>
                ) : (
                  <span className="text-[10px] font-bold text-slate-300 italic">Bientôt disponible</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-10 flex flex-col sm:flex-row gap-4">
        <button onClick={() => navigate('/courses')} className="flex-1 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
           Plus de cours
        </button>
        <Link 
          to="/ai-lab" 
          className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all text-center flex items-center justify-center gap-2"
        >
          Demander au Tuteur IA <Brain size={18} />
        </Link>
      </div>
    </div>
  );
};

export default LessonDetail;
