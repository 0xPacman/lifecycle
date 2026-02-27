import { motion, AnimatePresence } from 'motion/react';
import { LifecycleStep, STEPS } from '../types';
import { cn } from '../lib/utils';
import { Terminal } from 'lucide-react';

interface DetailCardProps {
  currentStep: LifecycleStep;
  logs: string[];
}

export function DetailCard({ currentStep }: DetailCardProps) {
  const activeStepConfig = STEPS.find(s => s.id === currentStep);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {activeStepConfig ? (
          <motion.div
            key={activeStepConfig.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#080808] border border-white/10 rounded-2xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <span className={cn("text-lg font-bold font-mono uppercase", activeStepConfig.color)}>
                  {activeStepConfig.code}
                </span>
                <div>
                  <h2 className={cn("text-sm font-bold text-white/90")}>
                    {activeStepConfig.label}
                  </h2>
                  <p className="text-[10px] text-white/40 font-mono">
                    {activeStepConfig.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", activeStepConfig.bgColor)} />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider border border-white/10 rounded-full px-2 py-0.5 bg-white/5">
                  in progress
                </span>
              </div>
            </div>

            {/* Content Rows */}
            <div className="p-2">
              {activeStepConfig.details.map((detail, i) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-1 h-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity", activeStepConfig.bgColor)} />
                    <span className="text-xs text-white/70 font-medium">{detail.label}</span>
                  </div>
                  
                  {/* Dotted Line Spacer - hidden on very small screens if needed, but good for this layout */}
                  <div className="flex-1 mx-4 border-b border-dashed border-white/5 h-px opacity-50" />
                  
                  <span className={cn("text-xs font-mono opacity-60", activeStepConfig.color)}>
                    {detail.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Background Ambient Glow */}
            <div className={cn(
              "absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none",
              activeStepConfig.bgColor
            )} style={{ filter: 'blur(80px)' }} />
            
          </motion.div>
        ) : (
          <div className="bg-[#080808] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-white/20 min-h-[240px]">
            <Terminal className="w-8 h-8 mb-4 opacity-50" />
            <p className="font-mono text-xs uppercase tracking-widest">System Idle</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
