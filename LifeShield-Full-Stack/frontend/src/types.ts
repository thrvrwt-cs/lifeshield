export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

export type AgeGroupKey = 'children' | 'students' | 'adults' | 'seniors';

export interface AgeGroupInfo {
  key: AgeGroupKey;
  label: string;
  rangeLabel: string;
  tagline: string;
  waterGoalLiters: number;
  sleepGoalHours: number;
  activityGoalMinutes: number;
  focusAreas: string[];
  preventiveTips: string[];
  recommendedVaccines: string[];
}

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  heightCm: number;
  weightKg: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  allergies: string[];
  medicalNotes: string;
}

export interface BMIData {
  value: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity';
  color: string;
  bgColor: string;
  textColor: string;
  explanation: string;
  healthyWeightRange: { min: number; max: number };
}

export type ExerciseStatus = 'completed' | 'light' | 'rest' | 'planned';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  waterIntakeLiters: number;
  waterGoalLiters: number;
  sleepHours: number;
  sleepGoalHours: number;
  physicalActivityMinutes: number;
  activityGoalMinutes: number;
  exerciseStatus: ExerciseStatus;
  notes?: string;
}

export interface DayMetricPoint {
  day: string; // Mon, Tue, etc.
  date: string;
  water: number; // Liters
  sleep: number; // Hours
  activity: number; // Minutes
  wellnessScore: number; // 0-100
}

export type VaccineStatus = 'completed' | 'upcoming' | 'overdue';

export interface VaccineRecord {
  id: string;
  name: string;
  targetDisease: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  completedDate?: string;
  notes?: string;
  doseNumber?: string;
}

export type ReminderCategory = 'vaccination' | 'checkup' | 'wellness';

export interface ReminderItem {
  id: string;
  title: string;
  category: ReminderCategory;
  date: string; // YYYY-MM-DD
  time?: string;
  completed: boolean;
  notes?: string;
}

export interface HealthAssessmentAnswer {
  questionId: string;
  selectedOptionIndex: number;
  score: number;
}

export interface AssessmentResult {
  id: string;
  date: string;
  totalScore: number; // 0-100
  tier: 'Optimal' | 'Good' | 'Moderate Attention' | 'Needs Focused Care';
  summary: string;
  categoryScores: {
    nutrition: number;
    activity: number;
    sleepRecovery: number;
    stressMental: number;
    preventiveHabits: number;
  };
  recommendations: string[];
}
