import { useState } from 'react';
import { BasicVisualization } from './components/BasicVisualization';
import { AdvancedVisualization } from './components/AdvancedVisualization';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20">
      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8">
        
        {/* Header */}
        <header className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              HTTP Request Lifecycle
            </h1>
            <p className="text-white/40 font-mono text-sm md:text-base">
              Visualize what happens when you type a URL.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10">
            <button
              onClick={() => setActiveTab('basic')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                activeTab === 'basic' ? "text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              Basic View
              {activeTab === 'basic' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative",
                activeTab === 'advanced' ? "text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              Advanced Infrastructure
              {activeTab === 'advanced' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <div>
          {activeTab === 'basic' ? <BasicVisualization /> : <AdvancedVisualization />}
        </div>

      </div>
    </div>
  );
}
