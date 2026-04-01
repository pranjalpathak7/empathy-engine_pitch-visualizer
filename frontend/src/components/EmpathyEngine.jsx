import { useState } from 'react';
import axios from 'axios';
import { Activity, Volume2, Code2, Play, Loader2, FileText } from 'lucide-react';

export default function EmpathyEngine() {
  const [voiceText, setVoiceText] = useState('');
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [voiceResult, setVoiceResult] = useState(null);

  const sampleVoiceTexts = [
    "I absolutely hate you for what you did! This is entirely your fault.",
    "We just secured the biggest enterprise contract in the company's history!",
    "My dog passed away last night. I am completely heartbroken."
  ];

  const handleGenerateVoice = async () => {
    if (!voiceText.trim()) return;
    setVoiceLoading(true); setVoiceError(''); setVoiceResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/generate-voice', { text: voiceText });
      setVoiceResult(response.data);
    } catch (err) {
      setVoiceError('System Failure: Unable to connect to Empathy Engine backend.');
    } finally {
      setVoiceLoading(false);
    }
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: 'bg-emerald-500', anger: 'bg-rose-500', sadness: 'bg-blue-500',
      surprise: 'bg-amber-500', fear: 'bg-purple-500', neutral: 'bg-slate-500'
    };
    return colors[emotion] || colors.neutral;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* LEFT COLUMN: Input */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText size={18} className="text-indigo-400"/> Source Narrative
            </h2>
          </div>
          <textarea 
            className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none min-h-[120px]"
            placeholder="Enter a highly emotional sequence..."
            value={voiceText} onChange={(e) => setVoiceText(e.target.value)}
          />
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {sampleVoiceTexts.map((sample, idx) => (
              <button key={idx} onClick={() => setVoiceText(sample)} className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-xs hover:bg-slate-700 hover:text-white transition-colors">
                Test {idx + 1}
              </button>
            ))}
          </div>
          <button onClick={handleGenerateVoice} disabled={voiceLoading || !voiceText} className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all disabled:opacity-50">
            {voiceLoading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} fill="currentColor" />}
            {voiceLoading ? 'Synthesizing Neural Audio...' : 'Execute Audio Pipeline'}
          </button>
          {voiceError && <p className="mt-4 text-sm text-rose-400 bg-rose-400/10 p-3 rounded-lg border border-rose-400/20">{voiceError}</p>}
        </div>

        {voiceResult && (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Code2 size={18} className="text-indigo-400"/> Generated SSML Payload
            </h2>
            <div className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800 overflow-x-auto">
              <pre className="text-sm font-mono text-emerald-400/90 leading-relaxed">{voiceResult.metadata.ssml_generated}</pre>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Output */}
      <div className="lg:col-span-5 space-y-6">
        {voiceResult ? (
          <>
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Volume2 size={18} className="text-indigo-400"/> Audio Output
              </h2>
              <div className="p-4 bg-[#0B0F19] rounded-xl border border-slate-800 flex flex-col items-center">
                <audio controls src={`data:audio/mp3;base64,${voiceResult.audio_data}`} className="w-full h-10 outline-none" autoPlay />
              </div>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity size={18} className="text-indigo-400"/> Emotion Distribution
                </h2>
                <span className="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 text-slate-300 uppercase tracking-wider">
                  Intensity: {(voiceResult.metadata.intensity_score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="space-y-5">
                {voiceResult.metadata.emotion_distribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300 capitalize font-medium">{item.label}</span>
                      <span className="text-slate-500 font-mono">{(item.score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div className={`h-2.5 rounded-full ${getEmotionColor(item.label)} transition-all`} style={{ width: `${item.score * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#111827]/50 border border-slate-800/50 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <Activity size={48} className="text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-400">Awaiting Audio Input</h3>
          </div>
        )}
      </div>
    </div>
  );
}