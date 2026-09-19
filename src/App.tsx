import { useState, useEffect } from 'react';
import { Search, Pill, Stethoscope, Shield, AlertTriangle, Monitor, Download, Terminal, FolderOpen } from 'lucide-react';
import SearchForm from './components/SearchForm';
import ScrapingAnimation from './components/ScrapingAnimation';
import Results from './components/Results';
import { analyzeDoctor, DoctorResult } from './utils/doctorAnalysis';

type AppState = 'idle' | 'scraping' | 'results';

// Type for electron API (optional, only available in electron)
declare global {
  interface Window {
    electronAPI?: {
      onNewSearch: (callback: () => void) => void;
      platform: string;
    };
  }
}

export default function App() {
  const [state, setState] = useState<AppState>('idle');
  const [result, setResult] = useState<DoctorResult | null>(null);
  const [doctorName, setDoctorName] = useState('');
  const [medication, setMedication] = useState('');
  const [isElectron, setIsElectron] = useState(false);

  // Detect if running in Electron
  useEffect(() => {
    setIsElectron(!!window.electronAPI);
    if (window.electronAPI) {
      window.electronAPI.onNewSearch(() => {
        handleReset();
      });
    }
  }, []);

  const handleSearch = (name: string, med: string) => {
    setDoctorName(name);
    setMedication(med);
    setState('scraping');

    const analysisTime = 3000 + Math.random() * 2000;
    setTimeout(() => {
      const analysis = analyzeDoctor(name, med);
      setResult(analysis);
      setState('results');
    }, analysisTime);
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MedScript Analytics</h1>
              <p className="text-xs text-blue-300">Ontario Doctor Prescription Research Tool</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {isElectron ? (
              <>
                <Monitor className="w-3 h-3" />
                <span>Desktop v1.0</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3" />
                <span>Web Preview</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {state === 'idle' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-300">
                <Shield className="w-4 h-4" />
                Ontario, Canada — {isElectron ? 'Offline Desktop App' : 'Desktop Application'}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Doctor Prescription Research
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Enter a doctor's name and medication to analyze local data and estimate 
                prescription likelihood based on specialty, practice patterns, and regional guidelines.
              </p>
            </div>

            {/* Desktop App Banner (only shown in web preview) */}
            {!isElectron && (
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600/30 p-2.5 rounded-lg flex-shrink-0">
                    <Download className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">Build as Desktop App</h3>
                    <p className="text-sm text-slate-300 mb-3">
                      This tool is designed to run as a standalone desktop executable (no web required). 
                      Build it locally using the instructions below.
                    </p>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-green-300 space-y-1">
                      <p className="text-slate-500"># Install dependencies</p>
                      <p>npm install</p>
                      <p className="text-slate-500 mt-2"># Build the desktop executable</p>
                      <p>node build-desktop.js</p>
                      <p className="text-slate-500 mt-2"># Or run in dev mode</p>
                      <p>node run-electron.js --dev</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded bg-white/10 text-slate-300 flex items-center gap-1">
                        <Terminal className="w-3 h-3" /> Windows (.exe)
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-white/10 text-slate-300 flex items-center gap-1">
                        <Terminal className="w-3 h-3" /> macOS (.dmg)
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-white/10 text-slate-300 flex items-center gap-1">
                        <Terminal className="w-3 h-3" /> Linux (.AppImage)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Form */}
            <SearchForm onSearch={handleSearch} />

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-12">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="bg-green-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <FolderOpen className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Local Database Search</h3>
                <p className="text-sm text-slate-400">
                  Queries local databases including CPSO registry data, patient reviews, and prescribing patterns.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="bg-blue-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Pill className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Medication Analysis</h3>
                <p className="text-sm text-slate-400">
                  Analyzes prescribing patterns based on doctor specialty, medication class, and Ontario regulations.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">Fully Offline</h3>
                <p className="text-sm text-slate-400">
                  Desktop app runs entirely on your machine. No internet connection required. Complete privacy.
                </p>
              </div>
            </div>
          </div>
        )}

        {state === 'scraping' && (
          <ScrapingAnimation doctorName={doctorName} medication={medication} />
        )}

        {state === 'results' && result && (
          <Results result={result} onReset={handleReset} />
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <AlertTriangle className="w-4 h-4 text-yellow-500/70 mt-0.5 flex-shrink-0" />
            <p>
              <strong className="text-slate-400">Disclaimer:</strong> This tool is for informational purposes only and does not constitute medical advice. 
              Results are generated from local data and should not be relied upon for medical decisions. 
              Always consult directly with healthcare professionals. This application does not access private medical records.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
