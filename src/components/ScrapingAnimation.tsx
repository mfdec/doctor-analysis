import { useState, useEffect } from 'react';
import { Loader2, Globe, Database, FileSearch, Shield } from 'lucide-react';
import { SCRAPING_STEPS } from '../utils/doctorAnalysis';

interface ScrapingAnimationProps {
  doctorName: string;
  medication: string;
}

export default function ScrapingAnimation({ doctorName, medication }: ScrapingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 400;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (prev < SCRAPING_STEPS.length) {
          setCompletedSteps(s => [...s, SCRAPING_STEPS[prev]]);
        }
        if (next >= SCRAPING_STEPS.length) {
          clearInterval(interval);
          return prev;
        }
        return next;
      });
      setProgress(prev => Math.min(100, prev + 100 / SCRAPING_STEPS.length));
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const getSourceIcon = (step: string) => {
    if (step.includes('CPSO') || step.includes('College') || step.includes('Health Canada')) return <Shield className="w-4 h-4 text-green-400" />;
    if (step.includes('RateMDs') || step.includes('Healthgrades')) return <FileSearch className="w-4 h-4 text-blue-400" />;
    if (step.includes('Reddit') || step.includes('community')) return <Globe className="w-4 h-4 text-orange-400" />;
    return <Database className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 animate-pulse">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white">Analyzing Doctor Profile</h2>
        <p className="text-slate-400">
          Searching for <span className="text-blue-300 font-medium">Dr. {doctorName}</span> • 
          Medication: <span className="text-purple-300 font-medium">{medication}</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Scraping progress</span>
          <span className="text-blue-300 font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2 mt-4 max-h-80 overflow-y-auto">
          {completedSteps.map((step, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 text-sm animate-fade-in"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-300">{step}</span>
              <span className="text-xs text-green-400 ml-auto">Done</span>
            </div>
          ))}
          {currentStep < SCRAPING_STEPS.length && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
              </div>
              <span className="text-blue-300">{SCRAPING_STEPS[currentStep]}</span>
              <span className="text-xs text-blue-400 ml-auto animate-pulse">Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Sources being searched */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['CPSO Registry', 'RateMDs', 'Healthgrades', 'Reddit'].map((source, i) => (
          <div 
            key={source}
            className={`bg-white/5 border rounded-xl p-3 text-center transition-all duration-500 ${
              completedSteps.length > i * 2 
                ? 'border-green-500/30 bg-green-500/5' 
                : 'border-white/10'
            }`}
          >
            <div className="mb-1">
              {completedSteps.length > i * 2 ? (
                <svg className="w-5 h-5 text-green-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <Loader2 className="w-5 h-5 text-blue-400 mx-auto animate-spin" />
              )}
            </div>
            <p className="text-xs text-slate-400">{source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
