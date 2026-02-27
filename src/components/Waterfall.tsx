import { motion } from 'motion/react';
import { LifecycleStep, STEPS } from '../types';
import { cn } from '../lib/utils';

interface WaterfallProps {
  currentStep: LifecycleStep;
  completedSteps: LifecycleStep[];
}

export function Waterfall({ currentStep, completedSteps }: WaterfallProps) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 w-full">
      <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-6">Timing Waterfall</h3>
      
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const isVisible = completedSteps.includes(step.id) || currentStep === step.id;
          const isActive = currentStep === step.id;
          
          // Calculate delay offset for visualization
          // In a real waterfall, these stack. Here we'll just stagger them visually based on index.
          const leftOffset = index * 12; 

          return (
            <div key={step.id} className="grid grid-cols-[80px_1fr_60px] gap-4 items-center h-6">
              <span className={cn(
                "text-[10px] font-mono uppercase text-right",
                isVisible ? "text-white/60" : "text-white/10"
              )}>
                {step.id}
              </span>
              
              <div className="relative h-full w-full bg-white/5 rounded-sm overflow-hidden">
                {/* Background track lines */}
                <div className="absolute inset-0 flex justify-between opacity-10">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-px h-full bg-white" />
                  ))}
                </div>

                {isVisible && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ 
                      width: isActive ? "60%" : "100%", // Pulse width when active
                      opacity: 1 
                    }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "h-full rounded-sm relative",
                      isActive && "animate-pulse"
                    )}
                    style={{ 
                      marginLeft: `${leftOffset}%`,
                      width: `calc(${100 - leftOffset}% - 20px)`, // Simplified width logic for demo
                      maxWidth: '200px'
                    }}
                  >
                    <div className={cn("absolute inset-0 opacity-80", step.bgColor)} />
                    {isActive && (
                      <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                    )}
                  </motion.div>
                )}
              </div>

              <span className={cn(
                "text-[10px] font-mono text-right",
                isVisible ? step.color : "text-transparent"
              )}>
                ~{step.duration}ms
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-[10px] font-mono text-white/30">
        <span>0ms</span>
        <span>Total: ~{STEPS.reduce((acc, s) => acc + s.duration, 0)}ms</span>
      </div>
    </div>
  );
}
