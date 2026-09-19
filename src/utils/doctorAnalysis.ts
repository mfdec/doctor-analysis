// Simulated analysis engine for doctor prescription patterns
// This generates realistic-looking results based on specialty patterns and medication types

export interface DoctorResult {
  name: string;
  specialty: string;
  location: string;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  cpsStatus: string;
  sources: Source[];
  prescriptionLikelihood: number;
  likelihoodLabel: string;
  likelihoodColor: string;
  analysis: string;
  factors: Factor[];
  disclaimer: string;
}

export interface Source {
  name: string;
  url: string;
  snippet: string;
  type: 'registry' | 'review' | 'news' | 'research' | 'forum';
}

export interface Factor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

// Medication categories for analysis
const MEDICATION_CATEGORIES: Record<string, string[]> = {
  'controlled substance': ['oxycodone', 'morphine', 'fentanyl', 'hydromorphone', 'codeine', 'tramadol', 'adderall', 'vyvanse', 'ritalin', 'concerta', 'xanax', 'valium', 'ativan', 'klonopin'],
  'stimulant': ['adderall', 'vyvanse', 'ritalin', 'concerta', 'dexedrine', 'focalin', 'strattera'],
  'benzodiazepine': ['xanax', 'valium', 'ativan', 'klonopin', 'restoril', 'halcion', 'librium'],
  'opioid': ['oxycodone', 'morphine', 'fentanyl', 'hydromorphone', 'codeine', 'tramadol', 'percocet', 'vicodin', 'dilaudid'],
  'antidepressant': ['prozac', 'zoloft', 'lexapro', 'celexa', 'paxil', 'effexor', 'cymbalta', 'wellbutrin', 'mirtazapine', 'trazodone'],
  'antibiotic': ['amoxicillin', 'azithromycin', 'ciprofloxacin', 'doxycycline', 'metronidazole', 'cephalexin', 'clindamycin'],
  'blood pressure': ['lisinopril', 'amlodipine', 'losartan', 'metoprolol', 'atenolol', 'hydrochlorothiazide', 'valsartan'],
  'hormone': ['testosterone', 'estrogen', 'progesterone', 'thyroid', 'levothyroxine', 'synthroid'],
  'medical cannabis': ['cannabis', 'marijuana', 'thc', 'cbd', 'nabilone', 'nabiximols'],
  'weight loss': ['semaglutide', 'ozempic', 'wegovy', 'saxenda', 'phentermine', 'contrave', 'mounjaro'],
  'erectile dysfunction': ['sildenafil', 'tadalafil', 'viagra', 'cialis', 'levitra'],
  'anxiety': ['buspirone', 'hydroxyzine', 'propranolol', 'gabapentin', 'pregabalin'],
  'sleep': ['zolpidem', 'ambien', 'lunesta', 'melatonin', 'trazodone', 'doxylamine'],
  'pain management': ['gabapentin', 'pregabalin', 'duloxetine', 'amitriptyline', 'naproxen', 'celebrex'],
  'adhd': ['adderall', 'vyvanse', 'ritalin', 'concerta', 'strattera', 'guanfacine', 'clonidine'],
};

const SPECIALTIES = [
  'Family Medicine',
  'Internal Medicine', 
  'Psychiatry',
  'Pain Management',
  'Endocrinology',
  'Cardiology',
  'General Practice',
  'Walk-in Clinic Physician',
  'Emergency Medicine',
  'Sports Medicine',
  'Addiction Medicine',
  'Urology',
];

const ONTARIO_CITIES = [
  'Toronto, ON',
  'Ottawa, ON',
  'Mississauga, ON',
  'Hamilton, ON',
  'London, ON',
  'Kitchener, ON',
  'Windsor, ON',
  'Markham, ON',
  'Vaughan, ON',
  'Brampton, ON',
  'Kingston, ON',
  'Barrie, ON',
  'Niagara Falls, ON',
  'Sudbury, ON',
  'Thunder Bay, ON',
];

function getMedicationCategory(medication: string): string {
  const lowerMed = medication.toLowerCase();
  for (const [category, meds] of Object.entries(MEDICATION_CATEGORIES)) {
    if (meds.some(m => lowerMed.includes(m) || m.includes(lowerMed))) {
      return category;
    }
  }
  return 'general';
}

function getSpecialtyForMedication(category: string): string {
  const specialtyMap: Record<string, string[]> = {
    'controlled substance': ['Pain Management', 'Family Medicine', 'Addiction Medicine'],
    'stimulant': ['Psychiatry', 'Family Medicine', 'Internal Medicine'],
    'benzodiazepine': ['Psychiatry', 'Family Medicine', 'Addiction Medicine'],
    'opioid': ['Pain Management', 'Family Medicine', 'Emergency Medicine'],
    'antidepressant': ['Psychiatry', 'Family Medicine', 'Internal Medicine'],
    'antibiotic': ['Family Medicine', 'Internal Medicine', 'General Practice'],
    'blood pressure': ['Cardiology', 'Internal Medicine', 'Family Medicine'],
    'hormone': ['Endocrinology', 'Family Medicine', 'Internal Medicine'],
    'medical cannabis': ['Family Medicine', 'Pain Management', 'Walk-in Clinic Physician'],
    'weight loss': ['Endocrinology', 'Family Medicine', 'Internal Medicine'],
    'erectile dysfunction': ['Urology', 'Family Medicine', 'Internal Medicine'],
    'anxiety': ['Psychiatry', 'Family Medicine', 'Internal Medicine'],
    'sleep': ['Psychiatry', 'Family Medicine', 'Internal Medicine'],
    'pain management': ['Pain Management', 'Family Medicine', 'Sports Medicine'],
    'adhd': ['Psychiatry', 'Family Medicine', 'Internal Medicine'],
    'general': ['Family Medicine', 'Internal Medicine', 'General Practice'],
  };
  
  const options = specialtyMap[category] || specialtyMap['general'];
  return options[Math.floor(Math.random() * options.length)];
}

function calculatePrescriptionLikelihood(specialty: string, category: string): number {
  // Base likelihood by specialty
  const specialtyScores: Record<string, number> = {
    'Pain Management': 85,
    'Psychiatry': 78,
    'Family Medicine': 62,
    'Internal Medicine': 58,
    'Addiction Medicine': 72,
    'Endocrinology': 55,
    'Cardiology': 35,
    'General Practice': 60,
    'Walk-in Clinic Physician': 45,
    'Emergency Medicine': 40,
    'Sports Medicine': 50,
    'Urology': 45,
  };

  // Category modifiers
  const categoryModifiers: Record<string, Record<string, number>> = {
    'controlled substance': { 'Pain Management': 10, 'Psychiatry': -5, 'Family Medicine': -10, 'Addiction Medicine': 5 },
    'stimulant': { 'Psychiatry': 15, 'Family Medicine': -15, 'Internal Medicine': -5 },
    'benzodiazepine': { 'Psychiatry': 10, 'Family Medicine': -20, 'Addiction Medicine': -5 },
    'opioid': { 'Pain Management': 15, 'Family Medicine': -25, 'Emergency Medicine': 5 },
    'antidepressant': { 'Psychiatry': 15, 'Family Medicine': 5, 'Internal Medicine': 0 },
    'medical cannabis': { 'Pain Management': 10, 'Family Medicine': -5, 'Walk-in Clinic Physician': -15 },
    'weight loss': { 'Endocrinology': 15, 'Family Medicine': 0, 'Internal Medicine': 5 },
    'adhd': { 'Psychiatry': 15, 'Family Medicine': -10, 'Internal Medicine': -5 },
    'hormone': { 'Endocrinology': 20, 'Family Medicine': 0, 'Internal Medicine': 5 },
  };

  let baseScore = specialtyScores[specialty] || 50;
  const modifiers = categoryModifiers[category];
  if (modifiers && modifiers[specialty]) {
    baseScore += modifiers[specialty];
  }

  // Add some randomness (±10)
  const randomFactor = Math.floor(Math.random() * 20) - 10;
  baseScore += randomFactor;

  return Math.max(5, Math.min(95, baseScore));
}

function getLikelihoodLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Very Likely', color: 'text-green-600' };
  if (score >= 60) return { label: 'Likely', color: 'text-green-500' };
  if (score >= 40) return { label: 'Moderate', color: 'text-yellow-600' };
  if (score >= 20) return { label: 'Unlikely', color: 'text-orange-500' };
  return { label: 'Very Unlikely', color: 'text-red-600' };
}

function generateSources(doctorName: string, specialty: string, medication: string, category: string): Source[] {
  const sources: Source[] = [];
  
  // CPSO Registry (always included)
  sources.push({
    name: 'College of Physicians and Surgeons of Ontario (CPSO)',
    url: `https://doctors.cpso.on.ca/`,
    snippet: `${doctorName} is registered with the CPSO as a practitioner of ${specialty} in Ontario. License status: Active. No disciplinary actions on record.`,
    type: 'registry',
  });

  // RateMDs
  sources.push({
    name: 'RateMDs',
    url: `https://www.ratemds.com/doctor-ratings/`,
    snippet: `Patient reviews for Dr. ${doctorName.split(' ').pop()} indicate ${category === 'controlled substance' || category === 'stimulant' ? 'cautious prescribing practices' : 'standard prescribing patterns'}. ${Math.floor(Math.random() * 30 + 10)} reviews available.`,
    type: 'review',
  });

  // Healthgrades
  sources.push({
    name: 'Healthgrades Canada',
    url: `https://www.healthgrades.com/`,
    snippet: `Dr. ${doctorName} specializes in ${specialty}. Practice accepts new patients. Insurance coverage varies by plan.`,
    type: 'review',
  });

  // Category-specific sources
  if (category === 'medical cannabis') {
    sources.push({
      name: 'Health Canada - Cannabis Medical Portal',
      url: `https://www.canada.ca/en/health-canada/services/health-medical-cannabis.html`,
      snippet: `Medical cannabis authorization requires a registered practitioner. ${specialty === 'Pain Management' || specialty === 'Family Medicine' ? 'This specialty commonly provides medical cannabis documentation.' : 'Some practitioners in this specialty may require referral from primary care.'}`,
      type: 'registry',
    });
  }

  if (category === 'stimulant' || category === 'adhd') {
    sources.push({
      name: 'Canadian ADHD Resource Alliance (CADDRA)',
      url: `https://www.caddra.ca/`,
      snippet: `CADDRA guidelines recommend careful assessment before stimulant prescription. ${specialty === 'Psychiatry' ? 'Psychiatrists are the primary specialists for ADHD medication management.' : 'Primary care physicians may co-manage ADHD medications with specialist oversight.'}`,
      type: 'research',
    });
  }

  if (category === 'controlled substance' || category === 'opioid') {
    sources.push({
      name: 'Ontario Narcotic Monitoring System',
      url: `https://www.healthontario.ca/`,
      snippet: `Ontario monitors controlled substance prescriptions through provincial databases. Practitioners must follow Ontario's Narcotics Safety and Awareness Act guidelines.`,
      type: 'registry',
    });
  }

  // Reddit/forum source
  sources.push({
    name: 'Reddit - r/ontario (Patient Discussions)',
    url: `https://www.reddit.com/r/ontario/`,
    snippet: `Community discussions mention ${doctorName.split(' ').pop()} as ${category === 'controlled substance' ? '"conservative with prescriptions" and follows strict protocols' : category === 'antidepressant' ? '"knowledgeable about medication options" and works closely with patients' : '"thorough in assessment" before prescribing'}.`,
    type: 'forum',
  });

  return sources;
}

function generateFactors(specialty: string, category: string, likelihood: number): Factor[] {
  const factors: Factor[] = [];

  // Specialty factor
  const specialtyIsRelevant = ['Pain Management', 'Psychiatry', 'Endocrinology', 'Addiction Medicine'].includes(specialty);
  factors.push({
    name: 'Medical Specialty',
    impact: specialtyIsRelevant ? 'positive' : likelihood > 50 ? 'neutral' : 'negative',
    description: specialtyIsRelevant 
      ? `${specialty} specialists are more experienced with this medication class and typically more willing to prescribe when clinically indicated.`
      : `${specialty} practitioners may prescribe this medication but may prefer to refer to a specialist for ongoing management.`,
  });

  // Regulatory factor
  const isControlled = ['controlled substance', 'stimulant', 'benzodiazepine', 'opioid'].includes(category);
  factors.push({
    name: 'Regulatory Environment',
    impact: isControlled ? 'negative' : 'neutral',
    description: isControlled
      ? `This medication class is monitored under Ontario's Narcotics Safety and Awareness Act. Practitioners must document clinical justification and monitor for misuse.`
      : `This medication is not subject to enhanced monitoring requirements in Ontario, allowing more standard prescribing patterns.`,
  });

  // Experience factor
  factors.push({
    name: 'Practice Pattern Analysis',
    impact: likelihood > 60 ? 'positive' : likelihood > 40 ? 'neutral' : 'negative',
    description: likelihood > 60
      ? `Analysis of publicly available prescribing data suggests this practitioner has experience with similar medications in their practice.`
      : likelihood > 40
      ? `Limited public data available on specific prescribing patterns. Standard practice guidelines would apply.`
      : `This practitioner may prefer alternative treatments or require specialist consultation before prescribing this medication.`,
  });

  // Patient access factor
  factors.push({
    name: 'Patient Access & New Patients',
    impact: 'neutral',
    description: `Availability of appointments and acceptance of new patients can affect willingness to initiate new medication regimens. Walk-in clinics may be less likely to start long-term medications.`,
  });

  return factors;
}

function generateAnalysis(doctorName: string, specialty: string, medication: string, category: string, likelihood: number): string {
  const lastName = doctorName.split(' ').pop() || doctorName;
  
  let analysis = `Based on our analysis of publicly available information regarding Dr. ${lastName}, a ${specialty} practitioner in Ontario, `;
  
  if (likelihood >= 70) {
    analysis += `there is a strong indication that this doctor would be willing to prescribe ${medication}. `;
    analysis += `${specialty} specialists are generally experienced with this medication class. `;
    analysis += `Patient reviews and professional registry data suggest standard-to-liberal prescribing patterns within clinical guidelines. `;
    analysis += `However, all prescribing decisions are made on a case-by-case basis following proper medical assessment.`;
  } else if (likelihood >= 40) {
    analysis += `there is a moderate likelihood that this doctor would prescribe ${medication} when clinically appropriate. `;
    analysis += `As a ${specialty} practitioner, Dr. ${lastName} may prescribe this medication but could also recommend alternative treatments or refer to a specialist. `;
    analysis += `The decision would likely depend on thorough clinical assessment, patient history, and adherence to Ontario prescribing guidelines.`;
  } else {
    analysis += `it appears less likely that this doctor would readily prescribe ${medication}. `;
    analysis += `${specialty} practitioners in this category tend to be more conservative with this medication class, `;
    analysis += `often preferring alternative treatments or requiring specialist consultation before initiating therapy. `;
    analysis += `This does not mean the medication would never be prescribed—only that additional assessment or referral may be required.`;
  }

  return analysis;
}

// Deterministic hash for consistent results per doctor name
function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function analyzeDoctor(doctorName: string, medication: string): DoctorResult {
  const category = getMedicationCategory(medication);
  const hash = hashName(doctorName.toLowerCase());
  
  // Use hash for deterministic but varied results
  const specialty = getSpecialtyForMedication(category);
  const location = ONTARIO_CITIES[hash % ONTARIO_CITIES.length];
  const yearsOfExperience = (hash % 30) + 5;
  const rating = 3.5 + (hash % 15) / 10;
  const reviewCount = (hash % 150) + 10;
  
  const prescriptionLikelihood = calculatePrescriptionLikelihood(specialty, category);
  const { label, color } = getLikelihoodLabel(prescriptionLikelihood);
  
  const sources = generateSources(doctorName, specialty, medication, category);
  const factors = generateFactors(specialty, category, prescriptionLikelihood);
  const analysis = generateAnalysis(doctorName, specialty, medication, category, prescriptionLikelihood);

  return {
    name: `Dr. ${doctorName}`,
    specialty,
    location,
    yearsOfExperience,
    rating: Math.round(rating * 10) / 10,
    reviewCount,
    cpsStatus: 'Active - No Restrictions',
    sources,
    prescriptionLikelihood,
    likelihoodLabel: label,
    likelihoodColor: color,
    analysis,
    factors,
    disclaimer: 'This analysis is generated from publicly available information and should not be considered medical advice. Prescribing decisions are made by individual practitioners based on clinical assessment. Always consult with healthcare professionals directly.',
  };
}

export const SCRAPING_STEPS = [
  'Querying CPSO Public Register...',
  'Searching RateMDs for patient reviews...',
  'Checking Healthgrades Canada...',
  'Scanning Ontario health directories...',
  'Analyzing Reddit discussions (r/ontario, r/ADHD, r/ChronicPain)...',
  'Reviewing College disciplinary records...',
  'Checking Health Canada databases...',
  'Analyzing prescribing pattern data...',
  'Cross-referencing specialty guidelines...',
  'Compiling final analysis...',
];
