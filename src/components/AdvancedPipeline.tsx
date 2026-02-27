import { motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { LifecycleStep, StepConfig } from '../types';
import { cn } from '../lib/utils';

interface AdvancedPipelineProps {
  steps: StepConfig[];
  currentStep: LifecycleStep;
  completedSteps: LifecycleStep[];
}

export function AdvancedPipeline({ steps, currentStep, completedSteps }: AdvancedPipelineProps) {
  // Calculate progress percentage
  const totalSteps = steps.length;
  // Find the index of the current step
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  // If current step is found, progress is up to that step. If complete, it's 100%.
  // If idle, 0%.
  let progress = 0;
  if (currentStep === 'complete') {
    progress = 100;
  } else if (currentIndex !== -1) {
    progress = (currentIndex / (totalSteps - 1)) * 100;
  }

  return (
    <div className="w-full py-8 px-6 overflow-x-auto">
      <div className="min-w-[800px] relative">
        {/* Connecting Line Background */}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-white/5 -z-10 rounded-full" />
        
        {/* Progress Line */}
        <motion.div 
          className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 -z-10 rounded-full" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        <div className="flex justify-between items-start">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = currentStep === step.id;
            const isPast = isCompleted || isActive;

            return (
              <div key={step.id} className="flex flex-col items-center gap-3 relative group w-20">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isActive ? '#000' : '#0A0A0A',
                    borderColor: isActive ? 'var(--active-color)' : isPast ? '#333' : '#111',
                  }}
                  style={{ '--active-color': step.color ? step.color.replace('text-', '').replace('bg-', '') : '#fff' } as any}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300",
                    isActive && "shadow-[0_0_20px_rgba(255,255,255,0.1)] border-white"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : isActive ? (
                    <Loader2 className={cn("w-4 h-4 animate-spin", step.color)} />
                  ) : (
                    <span className={cn(
                      "text-[10px] font-mono font-bold uppercase",
                      "text-white/20"
                    )}>
                      {step.code}
                    </span>
                  )}
                </motion.div>
                
                <div className="flex flex-col items-center text-center space-y-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider transition-colors duration-300",
                    isActive ? "text-white" : isCompleted ? "text-white/50" : "text-white/10"
                  )}>
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[9px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded"
                    >
                      Running
                    </motion.span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
