import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { LifecycleStep, STEPS } from '../types';
import { cn } from '../lib/utils';

interface PipelineProps {
  currentStep: LifecycleStep;
  completedSteps: LifecycleStep[];
}

export function Pipeline({ currentStep, completedSteps }: PipelineProps) {
  return (
    <div className="w-full py-4 px-2">
      <div className="flex justify-between items-center relative">
        {/* Connecting Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10" />
        
        {/* Progress Line - Simplified for now, could be dynamic */}
        <div className="absolute top-1/2 left-0 h-[1px] bg-white/20 -z-10 transition-all duration-500" 
             style={{ width: `${(completedSteps.length / (STEPS.length - 1)) * 100}%` }} />

        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isActive ? '#000' : '#050505',
                  borderColor: isActive ? 'var(--active-color)' : isCompleted ? '#222' : '#111',
                }}
                style={{ '--active-color': isActive ? getStepColorHex(step.id) : '#333' } as any}
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center z-10 transition-colors duration-300",
                  isActive && "shadow-[0_0_20px_rgba(var(--active-color),0.3)] border-2"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white/30" />
                ) : (
                  <span className={cn(
                    "text-[10px] md:text-xs font-mono font-bold uppercase",
                    isActive ? step.color : "text-white/20"
                  )}>
                    {step.code}
                  </span>
                )}
              </motion.div>
              
              <div className="absolute top-14 flex flex-col items-center w-20 text-center">
                <span className={cn(
                  "text-[9px] font-mono uppercase tracking-wider transition-colors duration-300",
                  isActive ? step.color : "text-transparent"
                )}>
                  {step.label.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStepColorHex(stepId: string): string {
  switch (stepId) {
    case 'dns': return '#f97316'; // orange-500
    case 'tcp': return '#eab308'; // yellow-500
    case 'tls': return '#a855f7'; // purple-500
    case 'request': return '#3b82f6'; // blue-500
    case 'response': return '#10b981'; // emerald-500
    case 'render': return '#ec4899'; // pink-500
    default: return '#ffffff';
  }
}
