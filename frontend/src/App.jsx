import { useState } from 'react';
import { Cpu, Volume2, Layout } from 'lucide-react';
import EmpathyEngine from './components/EmpathyEngine';
import PitchVisualizer from './components/PitchVisualizer';

function App() {
  const [activeTab, setActiveTab] = useState('visualizer');

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-300 p-4 md:p-8 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Global Navigation */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
              <Cpu size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Darwix AI: <span className="text-indigo-400">Unified Platform</span>
              </h1>
              <p className="text-slate-500 text-sm font-medium tracking-wide">Internship Assessment Architecture</p>
            </div>
          </div>

          <div className="flex bg-[#111827] p-1.5 rounded-xl border border-slate-800 relative z-50">
            <button 
              onClick={() => setActiveTab('empathy')}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'empathy' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Volume2 size={16} /> Empathy Engine
            </button>
            <button 
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'visualizer' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layout size={16} /> Pitch Visualizer
            </button>
          </div>
        </header>

        {/* State-Preservation Rendering: 
          Instead of unmounting the component, we hide it with CSS. 
          This prevents React from destroying the loaded data when switching tabs.
        */}
        <div className={activeTab === 'empathy' ? 'block' : 'hidden'}>
          <EmpathyEngine />
        </div>
        <div className={activeTab === 'visualizer' ? 'block' : 'hidden'}>
          <PitchVisualizer />
        </div>

      </div>
    </div>
  );
}

export default App;