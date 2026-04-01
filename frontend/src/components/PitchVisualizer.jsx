import { useState } from 'react';
import axios from 'axios';
import { Activity, Code2, Loader2, FileText, Image as ImageIcon, Layout, Palette, Sparkles } from 'lucide-react';

export default function PitchVisualizer() {
  const [storyText, setStoryText] = useState('');
  const [storyStyle, setStoryStyle] = useState('Cinematic lighting, photorealistic, 8k resolution, highly detailed');
  const [isCustomStyle, setIsCustomStyle] = useState(false); // Tracks if user is typing a custom prompt
  
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyError, setStoryError] = useState('');
  const [storyResult, setStoryResult] = useState(null);

  const sampleStoryText = "The client was drowning in manual data entry, losing dozens of hours a week. Frustration was at an all-time high, and morale was completely broken. Then, they deployed the Darwix AI platform. Within a week, the automated pipelines cleared the backlog, and the team finally had time to focus on creative strategy.";

  const visualStyles = [
    { label: "Cinematic Photorealism", value: "Cinematic lighting, photorealistic, 8k resolution, highly detailed" },
    { label: "Cyberpunk Neon", value: "Cyberpunk style, neon lighting, futuristic, dark sci-fi, digital art" },
    { label: "Watercolor Illustration", value: "Watercolor painting style, dreamy, soft edges, artistic illustration" },
    { label: "Corporate Vector Art", value: "Flat vector art, corporate tech style, clean lines, minimalist, modern" }
  ];

  const handleGenerateStoryboard = async () => {
    if (!storyText.trim()) return;
    setStoryLoading(true); setStoryError(''); setStoryResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/generate-storyboard', { 
        text: storyText,
        style: storyStyle // Sends whatever is currently active (preset or custom)
      });
      setStoryResult(response.data);
    } catch (err) {
      setStoryError('System Failure: Unable to execute LLM Segmentation or Diffusion generation.');
    } finally {
      setStoryLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Input & Configuration Panel */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden z-30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Narrative Input */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText size={18} className="text-purple-400"/> Pitch Narrative
            </h2>
            <textarea 
              className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none min-h-[140px]"
              placeholder="Paste a customer success story or sales pitch here..."
              value={storyText} onChange={(e) => setStoryText(e.target.value)}
            />
            <button onClick={() => setStoryText(sampleStoryText)} className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">
              Load sample pitch
            </button>
          </div>

          {/* Configuration & Custom Style */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Palette size={18} className="text-purple-400"/> Visual Consistency Style
              </h2>
              
              {/* Presets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {visualStyles.map((style, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setStoryStyle(style.value);
                      setIsCustomStyle(false);
                    }}
                    className={`p-3 text-left rounded-xl border text-sm transition-all ${
                      !isCustomStyle && storyStyle === style.value 
                      ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                      : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>

              {/* Custom Input Block */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sparkles size={16} className={isCustomStyle ? "text-purple-400" : "text-slate-600"} />
                </div>
                <input 
                  type="text"
                  placeholder="Or enter a custom thematic prompt (e.g., 'Retro 80s anime, vibrant colors...')"
                  value={isCustomStyle ? storyStyle : ''}
                  onChange={(e) => {
                    setStoryStyle(e.target.value);
                    setIsCustomStyle(true);
                  }}
                  onClick={() => setIsCustomStyle(true)}
                  className={`w-full bg-[#0B0F19] border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none transition-all ${
                    isCustomStyle 
                    ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)] ring-1 ring-purple-500/50' 
                    : 'border-slate-800 hover:border-slate-600'
                  }`}
                />
              </div>

            </div>

            {/* Execute Button */}
            <button onClick={handleGenerateStoryboard} disabled={storyLoading || !storyText} className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 mt-4">
              {storyLoading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
              {storyLoading ? 'Gemini Segmenting & Generating...' : 'Generate Connected Storyboard'}
            </button>
          </div>
        </div>
        {storyError && <p className="mt-4 text-sm text-rose-400 bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">{storyError}</p>}
      </div>

      {/* CONNECTED HORIZONTAL GRID */}
      {storyResult && (
        <div className="relative pt-6 pb-12">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-10 pl-2">
            <Layout className="text-purple-400"/> Rendered Storyboard
          </h2>

          <div className="relative">
            {/* The Horizontal Glowing Beam */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-0 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {storyResult.storyboard.map((panel, idx) => (
                <div key={idx} className="bg-[#111827]/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-2 transition-all duration-300 flex flex-col group relative h-full">
                  
                  {/* Connection Pin */}
                  <div className="hidden lg:flex absolute top-24 -translate-y-1/2 -left-3 w-6 h-6 bg-purple-600 rounded-full border-4 border-[#111827] shadow-[0_0_10px_rgba(168,85,247,0.8)] z-20"></div>

                  {/* Fixed Height Image Container */}
                  <div className="h-48 bg-[#0B0F19] relative overflow-hidden flex items-center justify-center border-b border-slate-700/50 rounded-t-2xl shrink-0">
                    {panel.image_base64 ? (
                      <img 
                        src={`data:image/png;base64,${panel.image_base64}`} 
                        alt={panel.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-slate-600 flex flex-col items-center"><Activity className="mb-2 opacity-50"/> Image Gen Failed</div>
                    )}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-md border border-white/10 uppercase tracking-widest shadow-lg">
                      Scene 0{idx + 1}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                    <p className="text-slate-200 text-sm leading-relaxed border-l-2 border-purple-500 pl-3 font-medium">
                      "{panel.caption}"
                    </p>
                    
                    {/* Compact Prompt Dropdown */}
                    <div className="bg-[#0B0F19] rounded-lg p-3 border border-slate-800 group/prompt cursor-help transition-all hover:bg-slate-800/50 mt-auto">
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1"><Code2 size={12}/> Gemini Prompt</span>
                        <span className="text-purple-500/50 group-hover/prompt:text-purple-400 transition-colors">Hover to expand</span>
                      </p>
                      <p className="text-[11px] text-purple-300/70 line-clamp-1 group-hover/prompt:line-clamp-none transition-all duration-300">
                        {panel.image_prompt}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}