'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  ArrowRightLeft,
  Terminal,
  Zap,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

interface SolveResponse {
  success: boolean;
  path?: string[];
  error?: string;
}

const PRESETS = [
  { start: 'poop', target: 'loop' },
  { start: 'cold', target: 'warm' },
  { start: 'lead', target: 'gold' },
  { start: 'head', target: 'tail' },
  { start: 'play', target: 'stop' },
  { start: 'work', target: 'play' },
];

export default function Home() {
  const [startWord, setStartWord] = useState<string>('poop');
  const [targetWord, setTargetWord] = useState<string>('loop');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SolveResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSolve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!startWord || !targetWord) return;

    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: startWord.trim().toLowerCase(),
          target: targetWord.trim().toLowerCase(),
        }),
      });

      const data: SolveResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({
        success: false,
        error: 'Failed to connect to solver server.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = startWord;
    setStartWord(targetWord);
    setTargetWord(temp);
    setResult(null);
  };

  const applyPreset = (preset: { start: string; target: string }) => {
    setStartWord(preset.start);
    setTargetWord(preset.target);
    setResult(null);
  };

  const handleCopyPath = () => {
    if (result?.path) {
      navigator.clipboard.writeText(result.path.join(' -> '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to highlight changed letter between word step and previous word
  const getLetterDiffIndex = (current: string, prev: string) => {
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== prev[i]) return i;
    }
    return -1;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 scanline-bg">
      {/* Background ambient glow spheres */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="w-full max-w-4xl text-center my-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 glass-panel text-xs tracking-wider text-cyan-400 font-pixel">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>ALGORITHM VERSION 1.0</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-pixel-title tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 drop-shadow-[0_4px_10px_rgba(56,189,248,0.3)]">
          POOPLE SOLVER
        </h1>
        
        <p className="text-xl text-slate-300 font-pixel mt-2 tracking-wide">
          Minimalist 4-Letter Word Transformation Solver
        </p>
      </header>

      {/* Main Solver Card */}
      <main className="w-full max-w-2xl flex flex-col gap-6">
        <div className="glass-panel p-6 sm:p-8 rounded-none relative">
          {/* Decorative pixel corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-cyan-400" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-cyan-400" />
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-cyan-400" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-400" />

          <form onSubmit={handleSolve} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
              {/* Start Word Input */}
              <div className="sm:col-span-5 flex flex-col gap-2">
                <label className="text-sm text-cyan-400 font-pixel tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> START WORD
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={startWord}
                  onChange={(e) => setStartWord(e.target.value.toLowerCase())}
                  placeholder="WORD"
                  className="pixel-input text-center text-2xl py-3 px-4 uppercase"
                  required
                />
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center sm:pt-6">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Words"
                  className="p-2.5 glass-panel text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Target Word Input */}
              <div className="sm:col-span-5 flex flex-col gap-2">
                <label className="text-sm text-cyan-400 font-pixel tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> TARGET WORD
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={targetWord}
                  onChange={(e) => setTargetWord(e.target.value.toLowerCase())}
                  placeholder="POOP"
                  className="pixel-input text-center text-2xl py-3 px-4 uppercase"
                  required
                />
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-400 font-pixel">TRY PRESETS:</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="pixel-tag px-2.5 py-1 text-sm font-pixel text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
                  >
                    {preset.start} ➔ {preset.target}
                  </button>
                ))}
              </div>
            </div>

            {/* Solve Button */}
            <button
              type="submit"
              disabled={loading || startWord.length !== 4 || targetWord.length !== 4}
              className="pixel-button py-4 text-lg font-pixel-title text-white tracking-widest flex items-center justify-center gap-3 mt-2"
            >
              {loading ? (
                <>
                  <span className="animate-pulse">FINDING PATH...</span>
                </>
              ) : (
                <>
                  <span>SOLVE LADDER</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading State Display */}
        {loading && (
          <div className="glass-panel p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent animate-spin" />
            <p className="font-pixel text-cyan-300 text-lg tracking-widest animate-pulse">
              CALCULATING SHORTEST DIJKSTRA PATH...
            </p>
          </div>
        )}

        {/* Error Display */}
        {result && !result.success && (
          <div className="glass-panel p-6 border-red-500/50 bg-red-950/30 text-red-300 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h3 className="font-pixel-title text-sm text-red-400">PATH SEARCH FAILED</h3>
              <p className="font-pixel text-lg">{result.error}</p>
            </div>
          </div>
        )}

        {/* Path Results Display */}
        {result && result.success && result.path && (
          <div className="glass-panel p-6 sm:p-8 flex flex-col gap-6 animate-fadeIn">
            {/* Result Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <div>
                <span className="text-xs text-cyan-400 font-pixel block">RESULT FOUND</span>
                <h2 className="text-2xl font-pixel text-slate-100">
                  {result.path.length - 1} STEP{result.path.length - 1 === 1 ? '' : 'S'} TRANSFORMATION
                </h2>
              </div>
              
              <button
                type="button"
                onClick={handleCopyPath}
                className="glass-panel px-3 py-2 text-sm font-pixel flex items-center gap-2 text-slate-200 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY PATH</span>
                  </>
                )}
              </button>
            </div>

            {/* Step-by-Step Pixel Tiles */}
            <div className="flex flex-wrap items-center justify-start gap-3">
              {result.path.map((word, idx) => {
                const prevWord = idx > 0 ? result.path![idx - 1] : null;
                const changedIdx = prevWord ? getLetterDiffIndex(word, prevWord) : -1;

                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <div className="glass-panel p-3 min-w-[100px] flex flex-col items-center gap-1 border-cyan-500/30">
                      <span className="text-[10px] text-cyan-400 font-pixel tracking-widest">
                        [{String(idx).padStart(2, '0')}]
                      </span>
                      <div className="flex items-center gap-1 text-2xl font-pixel-title tracking-wider text-slate-100">
                        {word.split('').map((char, charIdx) => {
                          const isChanged = charIdx === changedIdx;
                          return (
                            <span
                              key={charIdx}
                              className={
                                isChanged
                                  ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] font-bold'
                                  : 'text-slate-200'
                              }
                            >
                              {char.toUpperCase()}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* How It Works Card */}
        <div className="glass-panel p-6 flex flex-col gap-3">
          <h3 className="font-pixel-title text-xs text-cyan-400 tracking-widest flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> HOW POOPLE SOLVER WORKS
          </h3>
          <p className="font-pixel text-lg text-slate-300 leading-relaxed">
            The solver finds the shortest transformation ladder between two 4-letter words. 
            Each step changes exactly 1 letter while ensuring every intermediate word is a valid entry in the English dictionary. 
            Powered by Dijkstra's shortest path algorithm over a connected graph of 7,000+ words.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center my-6 text-sm font-pixel text-slate-500">
        Poople Solver &bull; Next.js Pixel + Glassmorphism Interface
      </footer>
    </div>
  );
}
