import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Globe, Clock } from 'lucide-react';
import { Pipeline } from './Pipeline';
import { Waterfall } from './Waterfall';
import { DetailCard } from './DetailCard';
import { LifecycleStep, STEPS } from '../types';
import { cn } from '../lib/utils';

export function BasicVisualization() {
  const [url, setUrl] = useState('https://example.com/index.html');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState<LifecycleStep>('idle');
  const [completedSteps, setCompletedSteps] = useState<LifecycleStep[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [speed, setSpeed] = useState(1); // 1x speed
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs for accessing state inside the async loop
  const isPausedRef = useRef(false);
  const isSimulatingRef = useRef(false);
  const speedRef = useRef(1);

  // Sync refs
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  // Auto-scroll logs container only
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setIsPaused(false);
    isSimulatingRef.current = false;
    isPausedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setCurrentStep('idle');
    setCompletedSteps([]);
    setLogs([]);
    setElapsedTime(0);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const startSimulation = async () => {
    if (isSimulating) return;
    
    stopSimulation(); // Ensure clean state
    setIsSimulating(true);
    isSimulatingRef.current = true;
    
    addLog(`Initializing request to ${url}`);
    startTimeRef.current = Date.now();
    
    // Start timer for UI
    timerRef.current = window.setInterval(() => {
      if (!isPausedRef.current) {
        setElapsedTime(prev => prev + 50);
      }
    }, 50);

    for (const step of STEPS) {
      if (!isSimulatingRef.current) break;

      setCurrentStep(step.id);
      addLog(`[${step.code}] Starting ${step.label}...`);
      
      for (const detail of step.details) {
        if (!isSimulatingRef.current) break;

        // Pause Check
        while (isPausedRef.current && isSimulatingRef.current) {
          await new Promise(r => setTimeout(r, 100));
        }

        // Dynamic speed calculation for each sub-step
        const currentSpeed = speedRef.current;
        const subStepDelay = (step.duration * (1/currentSpeed)) / step.details.length;

        await new Promise(r => setTimeout(r, subStepDelay));
        
        if (Math.random() > 0.1) {
           addLog(`[${step.code}] ${detail.label}: ${detail.value}`);
        }
      }

      setCompletedSteps(prev => [...prev, step.id]);
    }

    if (isSimulatingRef.current) {
      setCurrentStep('complete');
      addLog('Request lifecycle completed successfully.');
      setIsSimulating(false);
      isSimulatingRef.current = false;
    }
    
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="space-y-8">
      {/* Controls & URL Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* URL Input Group */}
        <div className="relative group flex-grow">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Globe className={cn("w-5 h-5 transition-colors", isSimulating ? "text-blue-500 animate-pulse" : "text-white/20")} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isSimulating}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-4 pl-12 pr-24 font-mono text-sm text-white focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
          />
          <div className="absolute inset-y-0 right-4 flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded-md">
                <Clock className="w-3 h-3" />
                <span>{(elapsedTime / 1000).toFixed(2)}s</span>
              </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/10 rounded-xl p-2 self-start md:self-auto">
            {/* Speed Toggles */}
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              {[0.25, 0.5, 1].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[10px] font-mono transition-all min-w-[40px]",
                    speed === s ? "bg-white text-black font-bold shadow-sm" : "text-white/40 hover:text-white/70"
                  )}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="w-px h-8 bg-white/10 mx-1" />

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              {isSimulating ? (
                <>
                  <button
                    onClick={togglePause}
                    className={cn(
                      "h-10 px-4 rounded-lg font-medium flex items-center gap-2 transition-all border",
                      isPaused 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                    )}
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span className="text-xs uppercase tracking-wider font-bold">Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span className="text-xs uppercase tracking-wider font-bold">Pause</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={stopSimulation}
                    className="h-10 w-10 rounded-lg flex items-center justify-center transition-all bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                    title="Stop Simulation"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                </>
              ) : (
                <button
                  onClick={startSimulation}
                  className="h-10 px-6 rounded-lg font-medium flex items-center gap-2 transition-all bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span className="text-xs uppercase tracking-wider font-bold">Start</span>
                </button>
              )}
            </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/20 pl-1">Pipeline</h3>
          <Pipeline currentStep={currentStep} completedSteps={completedSteps} />
        </div>
        
        <DetailCard currentStep={currentStep} logs={logs} />
        
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/20 pl-1">Timing Waterfall</h3>
          <Waterfall currentStep={currentStep} completedSteps={completedSteps} />
        </div>

        <div className="space-y-2">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/20 pl-1">Log</h3>
          <div 
            ref={logContainerRef}
            className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 h-32 overflow-y-auto font-mono text-[10px] text-white/50 space-y-1 scrollbar-thin scrollbar-thumb-white/10"
          >
              {logs.map((log, i) => (
                <div key={i} className="border-l border-white/10 pl-2">
                  {log}
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
