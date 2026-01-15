
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_EXERCISES, MOCK_LESSONS } from '../constants';
import { ChevronLeft, BrainCircuit, CheckCircle2, XCircle, Sparkles, Loader2, ArrowRight, Trophy, Info, Lightbulb } from 'lucide-react';
import MathRenderer from '../components/MathRenderer';
import { getTutorResponse, explainMistake } from '../services/geminiService';
import { Level } from '../types';

interface ExerciseSessionProps {
  onComplete: (xp: number) => void;
  userLevel: Level;
}

const ExerciseSession: React.FC<ExerciseSessionProps> = ({ onComplete, userLevel }) => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const exercises = MOCK_EXERCISES[lessonId || ''] || [];
  const lesson = MOCK_LESSONS.find(l => l.id === lessonId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mistakeAnalysis, setMistakeAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const currentEx = exercises[currentIndex];

  if (!currentEx) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
        <Trophy size={64} className="text-yellow-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Exercices à venir !</h2>
        <p className="text-slate-500 mb-8">Nous préparons de nouveaux défis pour ce chapitre de {userLevel}.</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Retour</button>
      </div>
    );
  }

  const handleCheck = async () => {
    const cleanAnswer = userAnswer.replace(/\s/g, '').toLowerCase();
    const cleanSolution = currentEx.solution.replace(/\s/g, '').toLowerCase();

    if (cleanAnswer === cleanSolution) {
      setFeedback('correct');
      setScore(s => s + 50);
    } else {
      setFeedback('wrong');
      // On demande à l'IA d'analyser l'erreur spécifique
      setIsAiLoading(true);
      try {
        const analysis = await explainMistake(userLevel, currentEx.question, currentEx.solution, userAnswer);
        setMistakeAnalysis(analysis);
      } catch (e) {
        setMistakeAnalysis("Oups, l'IA tuteur n'a pas pu analyser ton erreur, mais voici la correction ci-dessous.");
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setFeedback(null);
      setMistakeAnalysis(null);
    } else {
      setFinished(true);
      onComplete(score);
    }
  };

  if (finished) {
    return (
      <div className="max-w-md mx-auto p-10 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold">Bien joué !</h2>
        <p className="text-slate-500">Tu as terminé la série de {userLevel} sur <strong>{lesson?.title}</strong>.</p>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="text-sm font-bold text-slate-400 uppercase">Points gagnés</div>
          <div className="text-4xl font-black text-indigo-600">+{score} XP</div>
        </div>
        <button 
          onClick={() => navigate('/courses')} 
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
        >
          Retour aux cours
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
          <ChevronLeft size={20} /> Abandonner
        </button>
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-slate-400 uppercase">Ex {currentIndex + 1} / {exercises.length}</div>
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500" 
              style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className={`p-4 flex justify-between items-center ${
          currentEx.difficulty === 'Bronze' ? 'bg-orange-50 text-orange-700' : 
          currentEx.difficulty === 'Argent' ? 'bg-slate-50 text-slate-700' : 'bg-yellow-50 text-yellow-700'
        }`}>
          <span className="text-xs font-bold uppercase tracking-widest">{currentEx.difficulty}</span>
          <span className="text-xs font-bold">+50 XP</span>
        </div>

        <div className="p-8 flex-1 space-y-8">
          <div className="text-xl md:text-2xl font-medium text-slate-800">
            <MathRenderer content={currentEx.question} />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={feedback !== null}
                onKeyDown={(e) => e.key === 'Enter' && !feedback && handleCheck()}
                placeholder="Ta réponse..."
                className={`w-full p-5 text-lg font-mono rounded-2xl border-2 outline-none transition-all ${
                  feedback === 'correct' ? 'border-green-500 bg-green-50' : 
                  feedback === 'wrong' ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-indigo-500 bg-slate-50'
                }`}
              />
              {feedback === 'correct' && <CheckCircle2 className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500" />}
              {feedback === 'wrong' && <XCircle className="absolute right-5 top-1/2 -translate-y-1/2 text-red-500" />}
            </div>

            {feedback === 'wrong' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-red-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-2 font-bold">
                    <Info size={20} /> Correction
                  </div>
                  <p className="mb-2">La réponse correcte était :</p>
                  <div className="bg-white/20 p-3 rounded-xl inline-block font-mono text-xl">
                    <MathRenderer content={currentEx.solution} />
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                   <div className="flex items-center gap-3 mb-3 text-indigo-900 font-bold">
                      <BrainCircuit size={20} /> Analyse du tuteur IA
                   </div>
                   {isAiLoading ? (
                     <div className="flex items-center gap-2 text-indigo-400 italic text-sm">
                       <Loader2 size={16} className="animate-spin" /> Analyse de ton erreur en cours...
                     </div>
                   ) : (
                     <div className="text-sm text-indigo-800 leading-relaxed prose prose-sm">
                        <MathRenderer content={mistakeAnalysis || "Ton erreur semble être une faute d'attention."} />
                     </div>
                   )}
                </div>

                <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl">
                   <div className="flex items-center gap-3 mb-2 text-yellow-900 font-bold">
                      <Lightbulb size={20} /> Rappel de la méthode
                   </div>
                   <div className="text-sm text-yellow-800 italic">
                      <MathRenderer content={currentEx.explanation} />
                   </div>
                </div>
              </div>
            )}

            {feedback === 'correct' && (
              <div className="bg-green-100 text-green-800 p-6 rounded-2xl flex items-center gap-4 animate-in bounce-in">
                <Sparkles className="text-green-600" />
                <div>
                  <div className="font-bold">Excellent !</div>
                  <div className="text-sm">Tu as parfaitement maîtrisé cette notion. +50 XP</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
          {feedback !== null ? (
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Passer à l'exercice suivant <ArrowRight size={20} />
            </button>
          ) : (
            <button 
              onClick={handleCheck}
              disabled={!userAnswer.trim() || isAiLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAiLoading && <Loader2 size={20} className="animate-spin" />} Vérifier ma réponse
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSession;
