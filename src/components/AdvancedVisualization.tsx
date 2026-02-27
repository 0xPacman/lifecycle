import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, Globe, Clock, Server, Database, Network, Shield, Cpu, Layers, Zap, Layout, Lock, Route, Terminal } from 'lucide-react';
import { LifecycleStep, StepConfig } from '../types';
import { AdvancedPipeline } from './AdvancedPipeline';
import { cn } from '../lib/utils';

// Define Advanced Steps
const ADVANCED_STEPS: StepConfig[] = [
  {
    id: 'client',
    code: 'CLI',
    label: 'Client Browser',
    description: 'Initiating Request',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400',
    borderColor: 'border-gray-400',
    duration: 200,
    details: [
      { label: 'User Action', value: 'Enter URL' },
      { label: 'Browser', value: 'Chrome/Edge' },
      { label: 'OS', value: 'Windows/Mac' }
    ]
  },
  {
    id: 'dns',
    code: 'DNS',
    label: 'DNS Resolution',
    description: 'Finding the server',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    borderColor: 'border-orange-500',
    duration: 400,
    details: [
      { label: 'Recursive Query', value: 'ISP DNS' },
      { label: 'Root NS', value: 'Found' },
      { label: 'Authoritative NS', value: 'Route53' },
      { label: 'A Record', value: 'Resolved' }
    ]
  },
  {
    id: 'cdn',
    code: 'CDN',
    label: 'CDN Edge',
    description: 'Content Delivery Network',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    borderColor: 'border-purple-500',
    duration: 300,
    details: [
      { label: 'Location', value: 'Edge Pop' },
      { label: 'Cache Check', value: 'MISS' },
      { label: 'Optimization', value: 'Compressed' },
      { label: 'Routing', value: 'To Origin' }
    ]
  },
  {
    id: 'waf',
    code: 'WAF',
    label: 'Web App Firewall',
    description: 'Security Filtering',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-500',
    duration: 250,
    details: [
      { label: 'Rule Set', value: 'OWASP Top 10' },
      { label: 'IP Check', value: 'Allowed' },
      { label: 'Bot Protection', value: 'Human' },
      { label: 'Verdict', value: 'Allow' }
    ]
  },
  {
    id: 'lb',
    code: 'LB',
    label: 'Load Balancer',
    description: 'Traffic Distribution',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
    duration: 200,
    details: [
      { label: 'Algorithm', value: 'Round Robin' },
      { label: 'Health Check', value: 'Healthy' },
      { label: 'SSL Termination', value: 'Decrypted' },
      { label: 'Target Group', value: 'API-Gateway' }
    ]
  },
  {
    id: 'api_gateway',
    code: 'GW',
    label: 'API Gateway',
    description: 'Request Routing',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    borderColor: 'border-cyan-500',
    duration: 250,
    details: [
      { label: 'Rate Limit', value: 'Under Limit' },
      { label: 'Auth', value: 'JWT Verified' },
      { label: 'Route', value: '/api/v1/*' },
      { label: 'Transformation', value: 'None' }
    ]
  },
  {
    id: 'web_server',
    code: 'WEB',
    label: 'Web Server',
    description: 'Serving Static Content',
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    borderColor: 'border-green-500',
    duration: 300,
    details: [
      { label: 'Software', value: 'Nginx' },
      { label: 'OS', value: 'Ubuntu Linux' },
      { label: 'Static Assets', value: 'Served' },
      { label: 'Proxy', value: 'To App Server' }
    ]
  },
  {
    id: 'app_server',
    code: 'APP',
    label: 'App Server',
    description: 'Business Logic',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-500',
    duration: 800,
    details: [
      { label: 'Runtime', value: 'Node.js' },
      { label: 'Process', value: 'PM2 Cluster' },
      { label: 'Logic', value: 'Auth Check' },
      { label: 'API', value: 'Processing' }
    ]
  },
  {
    id: 'cache',
    code: 'CCH',
    label: 'Cache Layer',
    description: 'In-Memory Store',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400',
    borderColor: 'border-pink-400',
    duration: 100,
    details: [
      { label: 'Store', value: 'Redis' },
      { label: 'Key', value: 'user:123' },
      { label: 'Hit/Miss', value: 'MISS' }
    ]
  },
  {
    id: 'database',
    code: 'DB',
    label: 'Database',
    description: 'Persistent Storage',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500',
    borderColor: 'border-indigo-500',
    duration: 500,
    details: [
      { label: 'Engine', value: 'PostgreSQL' },
      { label: 'Type', value: 'Primary' },
      { label: 'Query', value: 'SELECT *' },
      { label: 'Replication', value: 'Sync' }
    ]
  },
  {
    id: 'browser_render',
    code: 'RND',
    label: 'Browser Render',
    description: 'Final Page Assembly',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    duration: 1500,
    details: [
      { label: 'DOM', value: 'Constructed' },
      { label: 'CSSOM', value: 'Applied' },
      { label: 'JS', value: 'Hydrated' },
      { label: 'Paint', value: 'Complete' }
    ]
  }
];

export function AdvancedVisualization() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState<LifecycleStep>('idle');
  const [activeSteps, setActiveSteps] = useState<LifecycleStep[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [speed, setSpeed] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  const isPausedRef = useRef(false);
  const isSimulatingRef = useRef(false);
  const speedRef = useRef(1);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

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
    setActiveSteps([]);
    setLogs([]);
    setElapsedTime(0);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const startSimulation = async () => {
    if (isSimulating) return;
    
    stopSimulation();
    setIsSimulating(true);
    isSimulatingRef.current = true;
    
    addLog(`Initializing advanced infrastructure simulation...`);
    startTimeRef.current = Date.now();
    
    timerRef.current = window.setInterval(() => {
      if (!isPausedRef.current) {
        setElapsedTime(prev => prev + 50);
      }
    }, 50);

    for (const step of ADVANCED_STEPS) {
      if (!isSimulatingRef.current) break;

      setCurrentStep(step.id);
      setActiveSteps(prev => [...prev, step.id]);
      addLog(`[${step.code}] Accessing ${step.label}...`);
      
      for (const detail of step.details) {
        if (!isSimulatingRef.current) break;

        while (isPausedRef.current && isSimulatingRef.current) {
          await new Promise(r => setTimeout(r, 100));
        }

        const currentSpeed = speedRef.current;
        const subStepDelay = (step.duration * (1/currentSpeed)) / step.details.length;

        await new Promise(r => setTimeout(r, subStepDelay));
        
        if (Math.random() > 0.1) {
           addLog(`[${step.code}] ${detail.label}: ${detail.value}`);
        }
      }
    }

    if (isSimulatingRef.current) {
      setCurrentStep('complete');
      addLog('Transaction completed successfully.');
      setIsSimulating(false);
      isSimulatingRef.current = false;
    }
    
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-xs font-mono text-white/30 bg-white/5 px-3 py-1.5 rounded-md">
             <Clock className="w-4 h-4" />
             <span>{(elapsedTime / 1000).toFixed(2)}s</span>
           </div>
           
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
        </div>

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

      {/* Pipeline */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/20 pl-1">Infrastructure Pipeline</h3>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
          <AdvancedPipeline 
            steps={ADVANCED_STEPS} 
            currentStep={currentStep} 
            completedSteps={activeSteps} 
          />
        </div>
      </div>

      {/* Active Step Detail */}
      <div className="max-w-3xl mx-auto w-full min-h-[400px]">
        <AnimatePresence mode="wait">
          {(() => {
            const activeStep = ADVANCED_STEPS.find(s => s.id === currentStep);
            const stepToShow = activeStep || (currentStep === 'complete' ? ADVANCED_STEPS[ADVANCED_STEPS.length - 1] : null);
            
            if (!stepToShow) {
               return (
                 <motion.div 
                   key="idle"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-white/20 h-full min-h-[400px]"
                 >
                   <Terminal className="w-16 h-16 mb-6 opacity-30" />
                   <p className="font-mono text-sm uppercase tracking-widest">System Idle</p>
                   <p className="text-xs text-white/10 mt-2">Ready to simulate infrastructure</p>
                 </motion.div>
               );
            }

            if (stepToShow.id === 'browser_render') {
              return (
                <motion.div
                  key="browser-render"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="absolute inset-0 bg-pink-500/5 animate-pulse pointer-events-none" />
                  
                  <div className="relative z-10 w-full max-w-2xl">
                    <div className="flex items-center gap-4 mb-8 justify-center">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center bg-white/5",
                        stepToShow.color
                      )}>
                        <Layout className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <h3 className={cn("text-xl font-bold", stepToShow.color)}>
                          {stepToShow.label}
                        </h3>
                        <p className="text-sm text-white/30 font-mono">{stepToShow.description}</p>
                      </div>
                    </div>

                    {/* Browser Preview Animation */}
                    <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                      {/* Browser Chrome */}
                      <div className="bg-[#222] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/50" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                          <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="flex-1 bg-[#111] rounded-md px-4 py-1.5 text-xs text-white/30 font-mono ml-4 flex items-center gap-2">
                          <Lock className="w-3 h-3" />
                          https://example.com/index.html
                        </div>
                      </div>
                      
                      {/* Browser Content */}
                      <div className="p-8 h-64 flex flex-col items-center justify-center gap-4 relative bg-[#050505]">
                        {/* Skeleton Loading State */}
                        <AnimatePresence mode="wait">
                          {currentStep === 'browser_render' && (
                            <motion.div 
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="w-full space-y-4 max-w-md"
                            >
                              <motion.div 
                                initial={{ width: "30%" }}
                                animate={{ width: "60%" }}
                                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                                className="h-6 bg-white/10 rounded w-1/2 mx-auto" 
                              />
                              <div className="grid grid-cols-3 gap-4 mt-8">
                                {[1,2,3].map(i => (
                                  <motion.div 
                                    key={i}
                                    initial={{ opacity: 0.3 }}
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                                    className="h-32 bg-white/5 rounded-lg"
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Final Content State */}
                          {currentStep === 'complete' && (
                            <motion.div 
                              key="content"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center"
                            >
                              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe className="w-10 h-10 text-emerald-500" />
                              </div>
                              <h1 className="text-3xl font-bold text-white mb-3">Welcome to Example.com</h1>
                              <p className="text-white/50 max-w-md mx-auto">
                                Content successfully delivered via global CDN edge location.
                                <br/>
                                <span className="text-emerald-500 text-xs font-mono mt-2 block">Status: 200 OK • Time: {(elapsedTime/1000).toFixed(2)}s</span>
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={stepToShow.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden relative min-h-[400px]"
              >
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.02]">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 shadow-inner",
                      stepToShow.color
                    )}>
                      {getIconForStep(stepToShow.id)}
                    </div>
                    <div>
                      <h2 className={cn("text-2xl font-bold text-white/90 tracking-tight", stepToShow.color)}>
                        {stepToShow.label}
                      </h2>
                      <p className="text-sm text-white/40 font-mono mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                        {stepToShow.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", stepToShow.bgColor)} />
                    <span className="text-xs font-mono text-white/60 uppercase tracking-wider font-bold">
                      {currentStep === 'complete' ? 'Completed' : 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Content Rows */}
                <div className="p-8 space-y-3">
                  {stepToShow.details.map((detail, i) => (
                    <motion.div
                      key={detail.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                      className="flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group hover:border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-2 h-2 rounded-full opacity-40 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_currentColor]", stepToShow.color)} />
                        <span className="text-sm text-white/60 font-medium group-hover:text-white/90 transition-colors">{detail.label}</span>
                      </div>
                      
                      <div className="flex-1 mx-8 border-b border-dashed border-white/5 h-px opacity-30" />
                      
                      <span className={cn("text-sm font-mono font-bold tracking-wide", stepToShow.color)}>
                        {detail.value}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Background Ambient Glow */}
                <div className={cn(
                  "absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-screen",
                  stepToShow.bgColor
                )} style={{ filter: 'blur(120px)' }} />
                
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      {/* Logs */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/20 pl-1">Infrastructure Log</h3>
        <div 
          ref={logContainerRef}
          className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 h-48 overflow-y-auto font-mono text-[10px] text-white/50 space-y-1 scrollbar-thin scrollbar-thumb-white/10"
        >
            {logs.map((log, i) => (
              <div key={i} className="border-l border-white/10 pl-2">
                {log}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function getIconForStep(stepId: string) {
  switch (stepId) {
    case 'client': return <Globe className="w-4 h-4" />;
    case 'dns': return <Network className="w-4 h-4" />;
    case 'cdn': return <Zap className="w-4 h-4" />;
    case 'waf': return <Shield className="w-4 h-4" />;
    case 'lb': return <Layers className="w-4 h-4" />;
    case 'api_gateway': return <Route className="w-4 h-4" />;
    case 'web_server': return <Server className="w-4 h-4" />;
    case 'app_server': return <Cpu className="w-4 h-4" />;
    case 'database': return <Database className="w-4 h-4" />;
    case 'cache': return <Zap className="w-4 h-4" />; // Reusing Zap or maybe another icon? Let's stick to Zap for speed/cache or maybe Layers?
    case 'browser_render': return <Layout className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
}
