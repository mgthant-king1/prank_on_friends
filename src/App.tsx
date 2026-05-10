import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, 
  User, 
  Cpu, 
  AlertTriangle, 
  Target, 
  Zap, 
  Coffee, 
  Share2, 
  RefreshCw,
  Search,
  Dna,
  ShieldAlert,
  Ghost
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { analyzeVibe, VibeResult } from './services/geminiService';

const SCAN_MESSAGES = [
  "Initializing Quantum Interface...",
  "Searching Social Digital Footprints...",
  "Decoding Memory Patterns...",
  "ဦးနှောက်ထဲက အကြွေးစာရင်းတွေကို ရှာဖွေနေသည်...",
  "Analyzing Cringe Level...",
  "Searching Deleted Browsing History...",
  "ရေမချိုးတာ ဘယ်နှစ်ရက်ရှိပြီလဲ တွက်ချက်နေသည်...",
  "Detecting Hidden Snacks Inventory...",
  "Analyzing why you're still single...",
  "Calculating Potential Laziness Matrix...",
  "Connecting to your last brain cell... (Searching...)...",
  "Crush ဆီက Reply မရရခြင်း အကြောင်းရင်းကို AI က သုံးသပ်နေသည်...",
  "Measuring your laziness in Giga-Sloths...",
  "Detecting levels of 'Main Character' energy...",
  "Locating the exact coordinates of your common sense...",
  "ဗိုက်ခေါက် အထပ်အရေအတွက်ကို တိုင်းတာနေသည်...",
  "Scanning Front Camera (Ugly Face Detected)...",
  "သူငယ်ချင်းတွေဆီက ပိုက်ဆံချေးပြီး မဆပ်တဲ့ စံချိန်ကို စစ်ဆေးနေသည်...",
  "Syncing with your FBI agent's surveillance camera...",
  "Downloading your secret bathroom singing records...",
  "ညဘက်တွေမှာ ဘယ်သူ့ကို လွမ်းနေလဲ AI က ရှာဖွေနေသည်..."
];

export default function App() {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [scanMessageIndex, setScanMessageIndex] = useState(0);
  const [result, setResult] = useState<VibeResult | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = (type: 'scan' | 'success' | 'alert' | 'glitch' | 'divine') => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtx.current;
    const now = ctx.currentTime;

    const createOsc = (freq: number, oscType: OscillatorType, startTime: number, duration: number, vol: number, sweepFreq?: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, startTime);
      if (sweepFreq) {
        osc.frequency.exponentialRampToValueAtTime(sweepFreq, startTime + duration);
      }
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    };

    switch (type) {
      case 'scan':
        // Modern techno-chirp
        createOsc(150 + Math.random() * 50, 'square', now, 0.12, 0.03, 40);
        break;
      case 'alert':
        // Dramatic dystopian siren
        for(let i = 0; i < 4; i++) {
          createOsc(250, 'sawtooth', now + i * 0.15, 0.35, 0.08, 120);
        }
        break;
      case 'glitch':
        // Sharp digital artifacts
        createOsc(1200 + Math.random() * 800, 'square', now, 0.04, 0.02);
        createOsc(400 + Math.random() * 400, 'sawtooth', now + 0.02, 0.04, 0.03);
        break;
      case 'divine':
        // Shimmering celestial atmosphere
        const celestial = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        celestial.forEach((f, i) => {
          createOsc(f, 'sine', now + i * 0.06, 3.5, 0.1 / celestial.length, f * 1.005);
          // Higher harmonic for "shine"
          createOsc(f * 2.002, 'sine', now + i * 0.06 + 0.1, 2.5, 0.04 / celestial.length);
        });
        break;
      case 'success':
        // Professional digital success flourish
        const melody = [523.25, 659.25, 783.99, 1046.50];
        melody.forEach((f, i) => {
          createOsc(f, 'triangle', now + i * 0.08, 1.2, 0.08, f * 1.01);
          createOsc(f * 0.5, 'sine', now + i * 0.08, 1.5, 0.05); // Bass depth
        });
        break;
    }
  };

  useEffect(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setScanMessageIndex((prev) => {
          if (prev % 2 === 0) playSound('scan');
          else playSound('glitch');
          
          if (prev >= SCAN_MESSAGES.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 700);

      // Perform AI Analysis in background
      if (!result) {
        analyzeVibe(name || "Your Friend").then((res) => {
          setResult(res);
        });
      }

      // Finish scanning after all messages
      const timeout = setTimeout(() => {
        setStep('result');
        const isSpecial = name.toLowerCase().includes("khaing min thant") || name.includes("ခိုင်မင်းသန့်");
        if (isSpecial) {
          playSound('divine');
        } else if (result && result.lazinessLevel > 80) {
          playSound('alert');
        } else {
          playSound('success');
        }
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [result?.colorTheme || '#ff4e00', '#ffffff', '#4422ff']
        });
      }, SCAN_MESSAGES.length * 800 + 500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step, name, result]);

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setResult(null);
    setImageLoaded(false);
    setScanMessageIndex(0);
    setStep('scanning');
  };

  const handleReset = () => {
    setStep('idle');
    setName('');
    setResult(null);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
      <div 
        className="atmosphere" 
        style={step === 'result' && result ? {
          background: `
            radial-gradient(circle at 50% -20%, ${result.colorTheme}44 0%, transparent 60%),
            radial-gradient(circle at 0% 100%, #1a1a2e 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, #0f172a 0%, transparent 50%)
          `
        } : {}}
      />
      <div className="grid-overlay" />
      
      <AnimatePresence mode="wait">
        {step === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-lg glass-card p-10 text-center space-y-10 relative z-10 border-t border-white/20"
          >
            <div className="flex justify-center mb-4">
              <motion.div 
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="p-6 rounded-full bg-orange-500/10 border-2 border-orange-500/20 relative"
              >
                <div className="absolute inset-0 rounded-full border-t-2 border-orange-500 animate-[spin_3s_linear_infinite]" />
                <Scan className="w-16 h-16 text-orange-500" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tighter text-white">
                VIBE INSPECTOR
              </h1>
              <p className="text-orange-200/60 font-mono text-xs uppercase tracking-[0.2em]">
                Advanced Digital Aura Analyzer
              </p>
            </div>

            <p className="text-lg text-white/80 leading-relaxed">
              သူငယ်ချင်းရဲ့ နာမည်ကို ရိုက်ထည့်လိုက်ပါ။ <br/>
              သူ့ရဲ့ ကွယ်ဝှက်ထားတဲ့ <span className="text-orange-400 font-bold italic">Vibes</span> တွေနဲ့ <span className="text-orange-400 font-bold italic">လျှို့ဝှက်ချက်</span> တွေကို AI နဲ့ စစ်ဆေးပေးပါမယ်။
            </p>

            <form onSubmit={handleStartScan} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-orange-400 transition-colors" />
                <input
                  id="friend-name"
                  type="text"
                  placeholder="နာမည်ရိုက်ပါ..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-lg text-white placeholder:text-white/20"
                  required
                />
              </div>
              <button
                id="scan-button"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-5 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-orange-900/20 flex items-center justify-center gap-3 overflow-hidden group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Cpu className="w-6 h-6" />
                စစ်ဆေးပါ (START SCAN)
              </button>
            </form>

            <div className="pt-4 flex items-center justify-center gap-6 opacity-30">
              <ShieldAlert className="w-4 h-4" />
              <Search className="w-4 h-4" />
              <Dna className="w-4 h-4" />
            </div>
          </motion.div>
        )}

        {step === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            className="w-full max-w-xl glass-card p-12 text-center space-y-12 relative overflow-hidden border border-orange-500/20 shadow-[0_0_50px_rgba(249,115,22,0.1)]"
          >
            <motion.div 
              className="scan-line"
              animate={{ top: ['-10%', '110%', '-10%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative">
              <div className="mx-auto w-56 h-56 rounded-full flex items-center justify-center relative">
                {/* Concentric rotating rings */}
                <motion.div 
                  className="absolute inset-0 border-2 border-dashed border-orange-500/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-4 border-2 border-orange-500 border-t-transparent border-b-transparent rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="bg-orange-500/5 inset-8 absolute rounded-full blur-xl animate-pulse" />
                <User className="w-24 h-24 text-orange-500" />
              </div>
              
              <div className="pt-8 space-y-4">
                <h2 className="text-2xl font-mono text-orange-400 animate-pulse">
                  SCANNING: {name}
                </h2>
                <motion.p 
                  key={scanMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white/60 font-mono text-sm h-6"
                >
                  {SCAN_MESSAGES[scanMessageIndex]}
                </motion.p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 px-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 rounded-full bg-white/10"
                  animate={{ 
                    backgroundColor: i <= (scanMessageIndex / (SCAN_MESSAGES.length / 5)) ? '#f97316' : '#ffffff20'
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
              <AlertTriangle className="w-3 h-3" />
              Unauthorized access to system logs...
            </div>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            className="w-full max-w-md perspective-[1000px] relative"
          >
            <div className="glass-card badge-glow p-1 border border-white/10 shadow-2xl relative overflow-hidden rounded-[32px]">
              {/* Color Aura */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-24 -left-24 w-80 h-80 blur-[100px] pointer-events-none rounded-full"
                style={{ backgroundColor: result.colorTheme }}
              />

              <div className="bg-zinc-900/40 rounded-[30px] p-8 relative z-10 space-y-8 backdrop-blur-xl">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-xl p-2 border border-white/5">
                      <Ghost className="w-8 h-8" style={{ color: result.colorTheme }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: result.colorTheme }}>Classified Result</p>
                      <p className="text-[10px] font-mono text-white/30 truncate max-w-[120px]">REF: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-1 bg-white/20 animate-bounce" />
                  </div>
                </div>

              <div className="space-y-4">
                {result.imageUrl && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 group relative bg-zinc-800/50 float-animation"
                  >
                    {!imageLoaded && (
                      <div className="absolute inset-0 shimmer bg-zinc-800 flex items-center justify-center">
                        <motion.div
                          animate={{ opacity: [0.2, 0.4, 0.2] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Search className="w-10 h-10 text-white/10" />
                        </motion.div>
                      </div>
                    )}
                    <img 
                      src={result.imageUrl} 
                      alt="Funny Vibe"
                      className={`w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-all duration-700 relative z-10 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      referrerPolicy="no-referrer"
                      onLoad={() => setImageLoaded(true)}
                    />
                  </motion.div>
                )}
                
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-3xl font-serif font-black italic tracking-tight leading-tight text-white uppercase">
                    {result.title}
                  </h3>
                  {result.categoryDescription && (
                    <span 
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 bg-white/5"
                      style={{ color: result.colorTheme, borderColor: `${result.colorTheme}44` }}
                    >
                      {result.categoryDescription}
                    </span>
                  )}
                </div>
                <p className="text-white/50 text-sm font-light">Analyzed Subject: <span className="text-white font-medium">{name}</span></p>
              </div>

              <div className="space-y-6">
                {/* Stats */}
                <div className="space-y-4">
                  <StatRow icon={<Zap />} label="ENERGY" value={result.energyLevel} color={result.colorTheme} />
                  <StatRow icon={<Target />} label="LUCK" value={result.luckLevel} color={result.colorTheme} />
                  <StatRow icon={<Coffee />} label="LAZINESS" value={result.lazinessLevel} color={result.colorTheme} />
                </div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-zinc-800/30 rounded-3xl p-6 border border-white/5 space-y-4 relative overflow-hidden group secret-skill-glow cursor-default transition-colors hover:bg-zinc-800/50"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Zap className="w-12 h-12" style={{ color: result.colorTheme }} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: result.colorTheme }} />
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold" style={{ color: result.colorTheme }}>Secret Skill Detected</p>
                  </div>
                  
                  <div className="relative">
                    <p className="text-xl font-medium text-white italic leading-relaxed animate-reveal">
                      "{result.secretSkill}"
                    </p>
                    <div 
                      className="absolute bottom-0 left-0 h-[1px] w-full origin-left bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{ scaleX: 0 }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-white/20" />
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">Neural Match: 99.8%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-white/20" />
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">Status: Classified</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-center gap-2">
                    <Dna className="w-3 h-3 text-white/40" />
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">AI Verified Verdict</p>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -2 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center relative overflow-hidden group shadow-inner cursor-default"
                  >
                    <div 
                      className="absolute top-0 left-0 w-full h-[1px] opacity-30"
                      style={{ background: `linear-gradient(90deg, transparent, ${result.colorTheme}, transparent)` }}
                    />
                    <p className="text-lg text-white/90 font-medium leading-relaxed italic relative z-10">
                      "{result.funnyVerdict}"
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4">
                <button
                  id="reset-button"
                  onClick={handleReset}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  ပထမစာမျက်နှာ
                </button>
                <button
                  id="share-button"
                  onClick={() => {
                    const text = `Vibe Inspector က စစ်ဆေးလိုက်တဲ့ ${name} ရဲ့ ရလဒ်ကတော့ "${result.title}" တဲ့! စစ်ကြည့်ချင်ရင် ဒီမှာနှိပ်: ${window.location.href}`;
                    if (navigator.share) {
                      navigator.share({ title: 'Vibe Result', text, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(text);
                      alert('Copied to clipboard! Share it with your friend!');
                    }
                  }}
                  className="bg-white text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-200"
                >
                  <Share2 className="w-4 h-4" />
                  စနောက်ကြမယ်
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center space-y-1 opacity-20 hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-[10px] font-mono text-white uppercase tracking-[0.4em]">Proprietary Prank Matrix v2.0</p>
        <p className="text-[8px] font-mono text-white italic">No personal data was actually searched... maybe.</p>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3">{icon}</span>
          {label}
        </div>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
