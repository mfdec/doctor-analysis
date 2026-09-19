import { useState } from 'react';
import { Search, User, Pill, MapPin } from 'lucide-react';

interface SearchFormProps {
  onSearch: (doctorName: string, medication: string) => void;
}

const POPULAR_MEDICATIONS = [
  'Adderall', 'Ritalin', 'Vyvanse',
  'Oxycodone', 'Tramadol', 'Gabapentin',
  'Xanax', 'Valium', 'Ativan',
  'Zoloft', 'Prozac', 'Lexapro',
  'Semaglutide (Ozempic)', 'Testosterone',
  'Medical Cannabis', 'Sildenafil',
];

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [doctorName, setDoctorName] = useState('');
  const [medication, setMedication] = useState('');
  const [errors, setErrors] = useState<{ doctor?: string; medication?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { doctor?: string; medication?: string } = {};

    if (!doctorName.trim()) {
      newErrors.doctor = 'Please enter a doctor\'s name';
    }
    if (!medication.trim()) {
      newErrors.medication = 'Please enter a medication name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSearch(doctorName.trim(), medication.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm space-y-6">
        {/* Doctor Name Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <User className="w-4 h-4 text-blue-400" />
            Doctor's Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={doctorName}
              onChange={(e) => { setDoctorName(e.target.value); setErrors(prev => ({ ...prev, doctor: undefined })); }}
              placeholder="e.g., John Smith"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              Ontario
            </div>
          </div>
          {errors.doctor && <p className="text-red-400 text-xs">{errors.doctor}</p>}
        </div>

        {/* Medication Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Pill className="w-4 h-4 text-purple-400" />
            Medication Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={medication}
              onChange={(e) => { setMedication(e.target.value); setErrors(prev => ({ ...prev, medication: undefined })); }}
              placeholder="e.g., Adderall, Oxycodone, Medical Cannabis..."
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
          </div>
          {errors.medication && <p className="text-red-400 text-xs">{errors.medication}</p>}
          
          {/* Quick select chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-slate-500">Quick select:</span>
            {POPULAR_MEDICATIONS.slice(0, 8).map((med) => (
              <button
                key={med}
                type="button"
                onClick={() => setMedication(med)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  medication === med
                    ? 'bg-purple-500/30 border-purple-500/50 text-purple-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-300'
                }`}
              >
                {med}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          <Search className="w-5 h-5" />
          Search & Analyze
        </button>

        <p className="text-center text-xs text-slate-500">
          Searches CPSO registry, patient reviews, health directories & community forums
        </p>
      </div>
    </form>
  );
}
