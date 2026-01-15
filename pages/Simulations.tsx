
import React, { useState, useMemo } from 'react';
import { Microscope, Activity, Navigation2, Square, Info } from 'lucide-react';
import MathRenderer from '../components/MathRenderer';

const Simulations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'functions' | 'vectors' | 'geometry'>('functions');

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Microscope className="text-indigo-600" size={32} /> Labo Interactif
        </h2>
        <p className="text-slate-500">Expérimente les concepts mathématiques par la manipulation.</p>
      </header>

      {/* Tab Navigation */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('functions')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all text-sm min-w-[120px] ${
            activeTab === 'functions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Activity size={18} /> Fonctions
        </button>
        <button
          onClick={() => setActiveTab('vectors')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all text-sm min-w-[120px] ${
            activeTab === 'vectors' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Navigation2 size={18} /> Vecteurs
        </button>
        <button
          onClick={() => setActiveTab('geometry')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all text-sm min-w-[120px] ${
            activeTab === 'geometry' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Square size={18} /> Géométrie
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'functions' && <FunctionSim />}
        {activeTab === 'vectors' && <VectorSim />}
        {activeTab === 'geometry' && <GeometrySim />}
      </div>
    </div>
  );
};

/* --- FUNCTION SIMULATION --- */
const FunctionSim: React.FC = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);

  const points = useMemo(() => {
    const arr = [];
    for (let x = -10; x <= 10; x += 0.5) {
      const y = a * x * x + b;
      // Map math coordinates to SVG coordinates (ViewBox is 200x200, center is 100x100)
      arr.push(`${100 + x * 10},${100 - y * 10}`);
    }
    return arr.join(' ');
  }, [a, b]);

  return (
    <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Fonction du second degré</h4>
          <MathRenderer content={`f(x) = ${a.toFixed(1)}x^2 + ${b.toFixed(1)}`} className="text-2xl font-bold text-indigo-900" />
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-3">
              <label className="font-bold text-slate-700">Paramètre $a$ (Courbure)</label>
              <span className="text-indigo-600 font-bold">{a.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="-5" max="5" step="0.1" value={a} 
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <label className="font-bold text-slate-700">Paramètre $b$ (Translation)</label>
              <span className="text-indigo-600 font-bold">{b.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="-50" max="50" step="1" value={b} 
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-3 text-sm text-indigo-700">
          <Info size={18} className="shrink-0" />
          <p>Observez comment le signe de $a$ change le sens de la parabole. Si $a > 0$, elle est tournée vers le haut !</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[400px]">
          {/* Grid lines */}
          <line x1="0" y1="100" x2="200" y2="100" stroke="#cbd5e1" strokeWidth="0.5" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="#cbd5e1" strokeWidth="0.5" />
          {/* Axis markers */}
          <text x="190" y="95" fontSize="6" fill="#94a3b8">x</text>
          <text x="105" y="10" fontSize="6" fill="#94a3b8">y</text>
          {/* Parabola */}
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
            points={points}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

/* --- VECTOR SIMULATION --- */
const VectorSim: React.FC = () => {
  const [ux, setUx] = useState(4);
  const [uy, setUy] = useState(2);
  const [vx, setVx] = useState(2);
  const [vy, setVy] = useState(4);

  return (
    <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            {/* Fix: Using MathRenderer with explicit string content to prevent compiler from interpreting $\vec{u}$ as variable/template sequence */}
            <MathRenderer content="Vecteur $\\vec{u}$" className="text-[10px] font-bold text-blue-400 uppercase mb-2" />
            <div className="flex gap-4">
              <input type="number" value={ux} onChange={(e) => setUx(Number(e.target.value))} className="w-full bg-transparent border-b border-blue-200 focus:outline-none font-bold" />
              <input type="number" value={uy} onChange={(e) => setUy(Number(e.target.value))} className="w-full bg-transparent border-b border-blue-200 focus:outline-none font-bold" />
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
            {/* Fix: Using MathRenderer with explicit string content to prevent "Cannot find name 'v'" error */}
            <MathRenderer content="Vecteur $\\vec{v}$" className="text-[10px] font-bold text-red-400 uppercase mb-2" />
            <div className="flex gap-4">
              <input type="number" value={vx} onChange={(e) => setVx(Number(e.target.value))} className="w-full bg-transparent border-b border-red-200 focus:outline-none font-bold" />
              <input type="number" value={vy} onChange={(e) => setVy(Number(e.target.value))} className="w-full bg-transparent border-b border-red-200 focus:outline-none font-bold" />
            </div>
          </div>
        </div>

        <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
          {/* Fix: Using MathRenderer to resolve "Cannot find name 'w', 'u', 'v'" errors arising from '$' and '\\' characters in JSX text */}
          <MathRenderer content="Somme $\\vec{w} = \\vec{u} + \\vec{v}$" className="text-xs opacity-50 uppercase font-bold mb-2" />
          <div className="text-2xl font-bold flex gap-4">
             <span>x = {ux + vx}</span>
             <span>y = {uy + vy}</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-500">Utilisez les curseurs pour voir comment la somme évolue :</p>
          <input type="range" min="-10" max="10" value={ux} onChange={(e) => setUx(Number(e.target.value))} className="w-full accent-blue-600" />
          <input type="range" min="-10" max="10" value={vx} onChange={(e) => setVx(Number(e.target.value))} className="w-full accent-red-600" />
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[400px]">
          <defs>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" /></marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" /></marker>
            <marker id="arrow-indigo" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" /></marker>
          </defs>
          <line x1="0" y1="180" x2="200" y2="180" stroke="#cbd5e1" strokeWidth="0.5" />
          <line x1="20" y1="0" x2="20" y2="200" stroke="#cbd5e1" strokeWidth="0.5" />
          
          {/* Vector U */}
          <line x1="20" y1="180" x2={20 + ux * 10} y2={180 - uy * 10} stroke="#2563eb" strokeWidth="3" markerEnd="url(#arrow-blue)" />
          {/* Vector V attached to U */}
          <line x1={20 + ux * 10} y1={180 - uy * 10} x2={20 + (ux + vx) * 10} y2={180 - (uy + vy) * 10} stroke="#dc2626" strokeWidth="3" markerEnd="url(#arrow-red)" />
          {/* Resultant Vector W */}
          <line x1="20" y1="180" x2={20 + (ux + vx) * 10} y2={180 - (uy + vy) * 10} stroke="#4f46e5" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrow-indigo)" />
        </svg>
      </div>
    </div>
  );
};

/* --- GEOMETRY SIMULATION (Pythagoras) --- */
const GeometrySim: React.FC = () => {
  const [base, setBase] = useState(60);
  const [height, setHeight] = useState(80);

  const hypotenuse = Math.sqrt(base * base + height * height);

  return (
    <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Théorème de Pythagore</h3>
        <div className="p-6 bg-slate-900 rounded-2xl text-white font-mono text-center">
          <div className="mb-2 text-indigo-400">a² + b² = c²</div>
          <div className="text-xl">
            {base}² + {height}² = {Math.round(hypotenuse * 100) / 100}²
          </div>
          <div className="text-xs mt-2 text-slate-500">
            {base * base} + {height * height} = {Math.round(hypotenuse * hypotenuse)}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block font-bold mb-2">Base (a) : {base}</label>
            <input type="range" min="20" max="120" value={base} onChange={(e) => setBase(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div>
            <label className="block font-bold mb-2">Hauteur (b) : {height}</label>
            <input type="range" min="20" max="120" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center relative min-h-[300px]">
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[400px]">
           {/* Triangle */}
           <path 
             d={`M 40,160 L ${40 + base},160 L 40,${160 - height} Z`} 
             fill="#4f46e5" 
             fillOpacity="0.1" 
             stroke="#4f46e5" 
             strokeWidth="3" 
           />
           {/* Right angle marker */}
           <rect x="40" y={160 - 10} width="10" height="10" fill="none" stroke="#4f46e5" strokeWidth="1" />
           
           {/* Labels */}
           <text x={40 + base / 2} y="175" textAnchor="middle" fontSize="10" className="fill-slate-600 font-bold">a = {base}</text>
           <text x="25" y={160 - height / 2} textAnchor="middle" fontSize="10" transform={`rotate(-90, 25, ${160 - height / 2})`} className="fill-slate-600 font-bold">b = {height}</text>
           <text x={45 + base / 2} y={155 - height / 2} textAnchor="middle" fontSize="10" transform={`rotate(${Math.atan2(-height, base) * (180 / Math.PI)}, ${45 + base / 2}, ${155 - height / 2})`} className="fill-indigo-600 font-bold">c ≈ {Math.round(hypotenuse)}</text>
        </svg>
      </div>
    </div>
  );
};

export default Simulations;
