import { AgeGroupInfo, AgeGroupKey, DailyLog, DayMetricPoint, ReminderItem, UserProfile, VaccineRecord } from '../types';

export const AGE_GROUP_CONFIG: Record<AgeGroupKey, AgeGroupInfo> = {
  children: {
    key: 'children',
    label: 'Children (0–12 yrs)',
    rangeLabel: '0–12 Years',
    tagline: 'Growth, immunity development, and active play',
    waterGoalLiters: 1.6,
    sleepGoalHours: 10,
    activityGoalMinutes: 60,
    focusAreas: [
      'Nutritional adequacy for skeletal growth',
      'Timely routine pediatric immunizations',
      'Vision checks and dental sealants',
      'Screen-time limits & structured outdoor play'
    ],
    preventiveTips: [
      'Ensure 9–11 hours of uninterrupted sleep for growth hormone release.',
      'Provide iron- and calcium-rich whole foods for bone and brain development.',
      'Maintain an active play routine of at least 60 minutes daily.'
    ],
    recommendedVaccines: [
      'MMR (Measles, Mumps, Rubella)',
      'DTaP Booster',
      'Polio (IPV)',
      'Hepatitis A & B',
      'Varicella (Chickenpox)'
    ]
  },
  students: {
    key: 'students',
    label: 'Students / Young Adults (13–24 yrs)',
    rangeLabel: '13–24 Years',
    tagline: 'Peak cognitive performance, stress resilience, & posture balance',
    waterGoalLiters: 2.5,
    sleepGoalHours: 8.5,
    activityGoalMinutes: 45,
    focusAreas: [
      'Circadian rhythm stabilization during exams',
      'Ergonomics & blue-light hygiene during study',
      'Mental well-being & emotional stress balancing',
      'Pre-college / sports immunization boosters'
    ],
    preventiveTips: [
      'Limit late-night digital screens at least 45 minutes before sleep.',
      'Combine aerobic cardio with dynamic stretching to counteract long study seating.',
      'Maintain consistent hydration (2.5L) for cognitive clarity and sustained energy.'
    ],
    recommendedVaccines: [
      'Meningococcal Conjugate (MenACWY / MenB)',
      'HPV (Human Papillomavirus)',
      'Tdap Booster (Tetanus, Diphtheria, Pertussis)',
      'Annual Influenza'
    ]
  },
  adults: {
    key: 'adults',
    label: 'Adults (25–59 yrs)',
    rangeLabel: '25–59 Years',
    tagline: 'Cardiometabolic vitality, posture integrity, & work-life balance',
    waterGoalLiters: 2.8,
    sleepGoalHours: 7.5,
    activityGoalMinutes: 35,
    focusAreas: [
      'Blood pressure & lipid metabolic surveillance',
      'Desk-bound sedentary posture rehabilitation',
      'Cardio-respiratory endurance & strength training',
      'Periodic preventive comprehensive blood panels'
    ],
    preventiveTips: [
      'Aim for 150 minutes of moderate or 75 minutes of vigorous exercise each week.',
      'Schedule periodic lipid and fasting blood glucose screenings.',
      'Take 2-minute movement breaks every 45 minutes of sedentary desk work.'
    ],
    recommendedVaccines: [
      'Tdap Booster (Every 10 years)',
      'Annual Influenza',
      'Hepatitis B (if indicated)',
      'COVID-19 Booster'
    ]
  },
  seniors: {
    key: 'seniors',
    label: 'Senior Citizens (60+ yrs)',
    rangeLabel: '60+ Years',
    tagline: 'Joint mobility, bone density, cardiovascular care, & fall prevention',
    waterGoalLiters: 2.2,
    sleepGoalHours: 7.5,
    activityGoalMinutes: 30,
    focusAreas: [
      'Balance training & fall risk reduction',
      'Joint preservation & low-impact aerobic health',
      'Annual vision, hearing & bone density (DEXA) scans',
      'Pneumococcal & shingles protective immunizations'
    ],
    preventiveTips: [
      'Practice balance drills (tandem stands, heel-toe walking) 3 times weekly.',
      'Drink water consistently through the day even if thirst perception is diminished.',
      'Discuss Vitamin D3, calcium status, and annual bone density checks with your physician.'
    ],
    recommendedVaccines: [
      'Shingrix (Herpes Zoster / Shingles)',
      'Pneumococcal Conjugate (PCV20 / PPSV23)',
      'High-Dose Annual Influenza',
      'RSV (Respiratory Syncytial Virus)'
    ]
  }
};

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  age: 29,
  gender: 'Male',
  bloodGroup: 'O+',
  heightCm: 178,
  weightKg: 72,
  emergencyContactName: 'Dr. Sarah Johnson',
  emergencyContactPhone: '+1 (555) 234-5678',
  emergencyContactRelation: 'Spouse / Emergency Proxy',
  allergies: ['Penicillin', 'Peanuts (Mild)'],
  medicalNotes: 'No chronic cardiac or metabolic conditions. Carries rescue inhaler during seasonal pollen peaks.'
};

export const INITIAL_DAILY_LOG: DailyLog = {
  date: new Date().toISOString().split('T')[0],
  waterIntakeLiters: 2.2,
  waterGoalLiters: 2.8,
  sleepHours: 7.5,
  sleepGoalHours: 8.0,
  physicalActivityMinutes: 35,
  activityGoalMinutes: 40,
  exerciseStatus: 'completed',
  notes: 'Brisk 30 min morning jog and hydration on track.'
};

export const INITIAL_WEEKLY_HISTORY: DayMetricPoint[] = [
  { day: 'Mon', date: '2026-09-11', water: 2.4, sleep: 7.2, activity: 30, wellnessScore: 82 },
  { day: 'Tue', date: '2026-09-12', water: 2.8, sleep: 8.0, activity: 45, wellnessScore: 88 },
  { day: 'Wed', date: '2026-09-13', water: 2.1, sleep: 6.5, activity: 25, wellnessScore: 74 },
  { day: 'Thu', date: '2026-09-14', water: 2.9, sleep: 7.8, activity: 50, wellnessScore: 91 },
  { day: 'Fri', date: '2026-09-15', water: 2.6, sleep: 7.4, activity: 40, wellnessScore: 85 },
  { day: 'Sat', date: '2026-09-16', water: 3.1, sleep: 8.5, activity: 60, wellnessScore: 94 },
  { day: 'Sun', date: '2026-09-17', water: 2.2, sleep: 7.5, activity: 35, wellnessScore: 86 }
];

export const INITIAL_VACCINES: VaccineRecord[] = [
  {
    id: 'vac-1',
    name: 'Tdap (Tetanus, Diphtheria, Pertussis)',
    targetDisease: 'Tetanus & Whooping Cough Booster',
    dueDate: '2026-06-15',
    completed: true,
    completedDate: '2026-06-10',
    notes: 'Administered at Metro Community Clinic. Valid for 10 years.',
    doseNumber: 'Decennial Booster'
  },
  {
    id: 'vac-2',
    name: 'Annual Quadrivalent Influenza',
    targetDisease: 'Seasonal Flu (A & B Strains)',
    dueDate: '2026-10-15',
    completed: false,
    notes: 'Recommended before autumn flu surge.',
    doseNumber: '2026 Season'
  },
  {
    id: 'vac-3',
    name: 'Hepatitis B Booster',
    targetDisease: 'Hepatitis B Virus',
    dueDate: '2026-08-20',
    completed: false,
    notes: 'Scheduled for travel clearance.',
    doseNumber: 'Dose 3 of 3'
  },
  {
    id: 'vac-4',
    name: 'COVID-19 Variant Booster',
    targetDisease: 'Severe Acute Respiratory Coronavirus',
    dueDate: '2026-11-05',
    completed: false,
    notes: 'Updated sublineage formulation.',
    doseNumber: 'Annual Booster'
  }
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Flu Shot Appointment at HealthMart Pharmacy',
    category: 'vaccination',
    date: '2026-10-15',
    time: '10:30 AM',
    completed: false,
    notes: 'Bring vaccination pass & insurance card'
  },
  {
    id: 'rem-2',
    title: 'Annual Preventive Wellness Lab Blood Panel',
    category: 'checkup',
    date: '2026-09-28',
    time: '08:00 AM',
    completed: false,
    notes: 'Requires 10-hour fasting prior to lipid draw'
  },
  {
    id: 'rem-3',
    title: 'Midday 500ml Hydration & Posture Reset',
    category: 'wellness',
    date: '2026-09-17',
    time: '01:30 PM',
    completed: false,
    notes: '2-minute neck and hamstring stretching'
  },
  {
    id: 'rem-4',
    title: 'Brisk 35-min Evening Cardio Session',
    category: 'wellness',
    date: '2026-09-17',
    time: '06:00 PM',
    completed: false,
    notes: 'Target heart rate zone 2 (115-135 bpm)'
  }
];
