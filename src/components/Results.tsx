import { 
  ArrowLeft, MapPin, Star, Clock, Shield, 
  TrendingUp, TrendingDown, Minus, AlertTriangle,
  FileText, MessageSquare, Globe, Database, BookOpen
} from 'lucide-react';
import { DoctorResult, Source } from '../utils/doctorAnalysis';

interface ResultsProps {
  result: DoctorResult;
  onReset: () => void;
}

export default function Results({ result, onReset }: ResultsProps) {
  const getLikelihoodBarColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-400';
    if (score >= 60) return 'from-green-400 to-lime-400';
    if (score >= 40) return 'from-yellow-400 to-yellow-500';
    if (score >= 20) return 'from-orange-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'registry': return <Shield className="w-4 h-4 text-green-400" />;
      case 'review': return <Star className="w-4 h-4 text-blue-400" />;
      case 'news': return <FileText className="w-4 h-4 text-red-400" />;
      case 'research': return <Database className="w-4 h-4 text-purple-400" />;
      case 'forum': return <MessageSquare className="w-4 h-4 text-orange-400" />;
      default: return <Globe className="w-4 h-4 text-slate-400" />;
    }
  };

  const getFactorIcon = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        New Search
      </button>

      {/* Doctor Profile Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {result.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-white">{result.name}</h2>
              <p className="text-blue-300">{result.specialty}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                {result.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                {result.yearsOfExperience} years experience
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500" />
                {result.rating}/5 ({result.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-500" />
                {result.cpsStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Likelihood Score */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Prescription Likelihood Analysis
        </h3>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Score Circle */}
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${result.prescriptionLikelihood * 2.64} 264`}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={result.prescriptionLikelihood >= 60 ? '#22c55e' : result.prescriptionLikelihood >= 40 ? '#eab308' : '#ef4444'} />
                  <stop offset="100%" stopColor={result.prescriptionLikelihood >= 60 ? '#4ade80' : result.prescriptionLikelihood >= 40 ? '#facc15' : '#f87171'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{result.prescriptionLikelihood}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 space-y-3">
            <div className={`text-2xl font-bold ${result.likelihoodColor}`}>
              {result.likelihoodLabel}
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getLikelihoodBarColor(result.prescriptionLikelihood)} rounded-full transition-all duration-1000`}
                style={{ width: `${result.prescriptionLikelihood}%` }}
              />
            </div>
            <p className="text-sm text-slate-400">
              Based on specialty alignment, regional prescribing patterns, and publicly available data analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Text */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Analysis Summary
        </h3>
        <p className="text-slate-300 leading-relaxed">{result.analysis}</p>
      </div>

      {/* Contributing Factors */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-400" />
          Contributing Factors
        </h3>
        <div className="space-y-3">
          {result.factors.map((factor, index) => (
            <div key={index} className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex-shrink-0 mt-0.5">
                {getFactorIcon(factor.impact)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white text-sm">{factor.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{factor.description}</p>
              </div>
              <div className="flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  factor.impact === 'positive' ? 'bg-green-500/20 text-green-400' :
                  factor.impact === 'negative' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {factor.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-400" />
          Data Sources Referenced ({result.sources.length})
        </h3>
        <div className="space-y-3">
          {result.sources.map((source, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getSourceIcon(source.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white text-sm">{source.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400 capitalize">
                      {source.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{source.snippet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-300 text-sm mb-1">Important Disclaimer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{result.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Search Another Doctor
        </button>
      </div>
    </div>
  );
}
