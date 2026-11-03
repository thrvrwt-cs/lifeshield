import { AgeGroupKey, BMIData, DailyLog, ExerciseStatus, VaccineStatus } from '../types';

/**
 * Determine age group according to specifications:
 * 0–12 → Children
 * 13–24 → Students/Young Adults
 * 25–59 → Adults
 * 60+ → Senior Citizens
 */
export function getAgeGroup(age: number): AgeGroupKey {
  if (age <= 12) return 'children';
  if (age <= 24) return 'students';
  if (age <= 59) return 'adults';
  return 'seniors';
}

/**
 * BMI Calculator:
 * Formula: BMI = weight(kg) / height(m)^2
 */
export function calculateBMI(heightCm: number, weightKg: number): BMIData {
  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
    return {
      value: 0,
      category: 'Normal weight',
      color: '#10b981',
      bgColor: '#ecfdf5',
      textColor: '#047857',
      explanation: 'Please provide valid height and weight in your profile.',
      healthyWeightRange: { min: 50, max: 75 }
    };
  }

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const roundedBmi = Math.round(rawBmi * 10) / 10;

  const minHealthyWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxHealthyWeight = Math.round(24.9 * heightM * heightM * 10) / 10;

  if (roundedBmi < 18.5) {
    return {
      value: roundedBmi,
      category: 'Underweight',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      textColor: '#b45309',
      explanation: 'Your BMI indicates a body weight below the standard reference range. Focus on nutrient-dense meals, wholesome proteins, and healthy fats.',
      healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight }
    };
  }

  if (roundedBmi <= 24.9) {
    return {
      value: roundedBmi,
      category: 'Normal weight',
      color: '#10b981',
      bgColor: '#ecfdf5',
      textColor: '#047857',
      explanation: 'Your BMI is in the optimal healthy weight bracket. Continue balanced nutrition, consistent hydration, and regular cardiovascular exercise.',
      healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight }
    };
  }

  if (roundedBmi <= 29.9) {
    return {
      value: roundedBmi,
      category: 'Overweight',
      color: '#f97316',
      bgColor: '#fff7ed',
      textColor: '#c2410c',
      explanation: 'Your BMI is slightly above the reference baseline. Incorporating daily brisk walks, portion awareness, and strength conditioning can support cardiometabolic fitness.',
      healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight }
    };
  }

  return {
    value: roundedBmi,
    category: 'Obesity',
    color: '#ef4444',
    bgColor: '#fef2f2',
    textColor: '#b91c1c',
    explanation: 'Your BMI is in the elevated range. Sustainable lifestyle pacing—like daily movement, reduced ultra-processed foods, and consistent sleep—promotes long-term vitality.',
    healthyWeightRange: { min: minHealthyWeight, max: maxHealthyWeight }
  };
}

export interface WellnessScoreBreakdown {
  score: number; // 0-100
  tier: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  tierColor: string;
  bmiScore: number; // max 25
  sleepScore: number; // max 25
  waterScore: number; // max 20
  activityScore: number; // max 20
  exerciseScore: number; // max 10
  summary: string;
}

/**
 * 0–100 wellness score based on available wellness inputs:
 * - BMI
 * - Sleep
 * - Water intake
 * - Physical activity
 * - Exercise status
 * Clearly labeled as a wellness score, NOT a medical diagnosis.
 */
export function calculateWellnessScore(
  bmiValue: number,
  dailyLog: DailyLog,
  age: number
): WellnessScoreBreakdown {
  // 1. BMI Score (max 25)
  let bmiScore = 20;
  if (bmiValue >= 18.5 && bmiValue <= 24.9) {
    bmiScore = 25;
  } else if ((bmiValue >= 17.5 && bmiValue < 18.5) || (bmiValue > 24.9 && bmiValue <= 27.5)) {
    bmiScore = 20;
  } else if ((bmiValue >= 16.0 && bmiValue < 17.5) || (bmiValue > 27.5 && bmiValue <= 32.0)) {
    bmiScore = 15;
  } else if (bmiValue > 0) {
    bmiScore = 10;
  }

  // 2. Sleep Score (max 25)
  // Optimal sleep depends loosely on age
  const targetSleep = age <= 12 ? 10 : age <= 24 ? 8.5 : 7.5;
  const sleepRatio = dailyLog.sleepHours / targetSleep;
  let sleepScore = 20;
  if (sleepRatio >= 0.9 && sleepRatio <= 1.15) {
    sleepScore = 25;
  } else if (sleepRatio >= 0.75 && sleepRatio < 0.9) {
    sleepScore = 20;
  } else if (sleepRatio >= 0.6 && sleepRatio < 0.75) {
    sleepScore = 14;
  } else {
    sleepScore = Math.max(5, Math.round(sleepRatio * 15));
  }

  // 3. Water Intake Score (max 20)
  const targetWater = dailyLog.waterGoalLiters > 0 ? dailyLog.waterGoalLiters : 2.5;
  const waterRatio = Math.min(1.2, dailyLog.waterIntakeLiters / targetWater);
  const waterScore = Math.round(waterRatio * 20);

  // 4. Physical Activity (max 20)
  const targetActivity = dailyLog.activityGoalMinutes > 0 ? dailyLog.activityGoalMinutes : 35;
  const activityRatio = Math.min(1.2, dailyLog.physicalActivityMinutes / targetActivity);
  const activityScore = Math.round(activityRatio * 20);

  // 5. Exercise Status (max 10)
  const exerciseScoreMap: Record<ExerciseStatus, number> = {
    completed: 10,
    light: 8,
    rest: 7, // Rest days are healthy and intentional
    planned: 5
  };
  const exerciseScore = exerciseScoreMap[dailyLog.exerciseStatus] ?? 5;

  const rawTotal = bmiScore + sleepScore + waterScore + activityScore + exerciseScore;
  const score = Math.max(10, Math.min(100, Math.round(rawTotal)));

  let tier: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' = 'Good';
  let tierColor = '#10b981';
  let summary = 'Solid daily wellness habits with balanced hydration and activity.';

  if (score >= 85) {
    tier = 'Excellent';
    tierColor = '#059669';
    summary = 'Optimal preventive lifestyle metrics! Consistent hydration, restful sleep, and regular physical movement.';
  } else if (score >= 70) {
    tier = 'Good';
    tierColor = '#0284c7';
    summary = 'Steady daily routine. Minor boosts to sleep regularity or hydration can further elevate vitality.';
  } else if (score >= 50) {
    tier = 'Fair';
    tierColor = '#d97706';
    summary = 'Moderate wellness metrics. Prioritizing consistent bedtimes and hitting daily water targets will yield quick gains.';
  } else {
    tier = 'Needs Attention';
    tierColor = '#dc2626';
    summary = 'Lifestyle metrics are below recommended preventive targets. Focus on gradual, sustainable habit increments.';
  }

  return {
    score,
    tier,
    tierColor,
    bmiScore,
    sleepScore,
    waterScore,
    activityScore,
    exerciseScore,
    summary
  };
}

/**
 * Calculates vaccine status automatically from the current date.
 */
export function calculateVaccineStatus(dueDateStr: string, completed: boolean): VaccineStatus {
  if (completed) return 'completed';

  const todayStr = new Date().toISOString().split('T')[0];
  if (dueDateStr < todayStr) {
    return 'overdue';
  }
  return 'upcoming';
}
