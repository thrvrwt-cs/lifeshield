import React, { useState } from 'react';
import { AgeGroupInfo, AssessmentResult, UserProfile } from '../types';
import {
  ClipboardCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';

interface AssessmentTabProps {
  profile: UserProfile;
  ageGroupInfo: AgeGroupInfo;
  assessments: AssessmentResult[];
  onSaveAssessment: (result: AssessmentResult) => void;
}

interface Question {
  id: string;
  category: 'nutrition' | 'activity' | 'sleepRecovery' | 'stressMental' | 'preventiveHabits';
  title: string;
  subtitle: string;
  options: { text: string; points: number }[];
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'nutrition',
    title: 'Whole Foods & Nutrition Diversity',
    subtitle: 'How frequently do your meals consist of fresh vegetables, whole grains, and lean proteins?',
    options: [
      { text: 'Daily: balanced whole foods at virtually every meal', points: 12.5 },
      { text: 'Often: 4–5 days weekly with occasional processed meals', points: 9 },
      { text: 'Sometimes: predominantly convenient or fast foods with few greens', points: 5 },
      { text: 'Rarely: heavy processed foods, sugary drinks, minimal fiber', points: 2 }
    ]
  },
  {
    id: 'q2',
    category: 'nutrition',
    title: 'Hydration Consistency',
    subtitle: 'Do you routinely reach your daily hydration benchmark (water or herbal infusions)?',
    options: [
      { text: 'Consistently drink 2.0L–3.0L throughout the entire day', points: 12.5 },
      { text: 'Drink mostly when thirsty, averaging ~1.5L daily', points: 8.5 },
      { text: 'Rely heavily on caffeinated beverages or sodas over water', points: 4 },
      { text: 'Chronic low fluid intake (<1.0L daily)', points: 1 }
    ]
  },
  {
    id: 'q3',
    category: 'activity',
    title: 'Aerobic & Cardio Movement',
    subtitle: 'How much sustained moderate-to-vigorous exercise (brisk walk, running, cycling, sports) do you get?',
    options: [
      { text: '150+ minutes per week (meets or exceeds WHO guidelines)', points: 12.5 },
      { text: '75–120 minutes weekly of purposeful movement', points: 9 },
      { text: '30–60 minutes weekly, mostly incidental walking', points: 5 },
      { text: 'Virtually sedentary (under 30 minutes weekly)', points: 1.5 }
    ]
  },
  {
    id: 'q4',
    category: 'activity',
    title: 'Sedentary Screen Breaks & Posture',
    subtitle: 'During prolonged desk seating or screen time, do you interrupt sitting with posture breaks?',
    options: [
      { text: 'Yes, stand and stretch every 45–60 minutes consistently', points: 12.5 },
      { text: 'Occasionally take breaks every 2 hours', points: 8 },
      { text: 'Often sit continuously for 3–4 hours without moving', points: 4 },
      { text: 'Sit stationary all day with posture soreness or stiff joints', points: 1 }
    ]
  },
  {
    id: 'q5',
    category: 'sleepRecovery',
    title: 'Sleep Regularity & Morning Restedness',
    subtitle: 'Do you maintain a steady sleep-wake schedule and wake up feeling mentally and physically refreshed?',
    options: [
      { text: 'Consistently 7.5–9 hours with consistent bedtime and high energy', points: 12.5 },
      { text: 'Usually 6.5–7.5 hours, occasionally feel tired in afternoons', points: 9 },
      { text: 'Irregular bedtimes, frequent nocturnal awakenings, groggy mornings', points: 5 },
      { text: 'Chronic sleep deficit (<6 hours) and high daytime fatigue', points: 1.5 }
    ]
  },
  {
    id: 'q6',
    category: 'stressMental',
    title: 'Stress Regulation & Decompression',
    subtitle: 'How effectively do you manage daily cognitive demands, work pressures, or emotional stress?',
    options: [
      { text: 'Proactive decompression: mindfulness, exercise, hobbies, strong boundaries', points: 12.5 },
      { text: 'Manageable stress levels with occasional overwhelmed periods', points: 8.5 },
      { text: 'Frequent tension, difficulty unwinding in the evenings', points: 4.5 },
      { text: 'Chronic acute burnout, anxiety, or emotional fatigue', points: 1 }
    ]
  },
  {
    id: 'q7',
    category: 'preventiveHabits',
    title: 'Routine Preventive Health Screenings',
    subtitle: 'Have you had routine age-appropriate biometric screenings (blood pressure, fasting labs, dental)?',
    options: [
      { text: 'Fully up-to-date with annual physical, dental, and blood screenings', points: 12.5 },
      { text: 'Screened within the last 2 years, everything is generally stable', points: 8.5 },
      { text: 'Over 2–3 years since last physician checkup or basic lab check', points: 4 },
      { text: 'Have not had clinical screening or preventive check in 4+ years', points: 1 }
    ]
  },
  {
    id: 'q8',
    category: 'preventiveHabits',
    title: 'Lifestyle Risk Factor Management',
    subtitle: 'What is your status regarding tobacco, vaping, and moderate alcohol guidelines?',
    options: [
      { text: 'Zero tobacco/vaping, alcohol is absent or strictly moderate (<3 drinks/wk)', points: 12.5 },
      { text: 'Non-smoker, moderate social drinking', points: 9 },
      { text: 'Occasional social smoking/vaping or frequent weekend alcohol consumption', points: 4.5 },
      { text: 'Daily smoking/vaping or heavy alcohol intake', points: 1 }
    ]
  }
];

export const AssessmentTab: React.FC<AssessmentTabProps> = ({
  profile,
  ageGroupInfo,
  assessments,
  onSaveAssessment
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(
    assessments.length > 0 ? assessments[0] : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const isComplete = ASSESSMENT_QUESTIONS.every(q => answers[q.id] !== undefined);

  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    setIsSubmitting(true);

    // Calculate score
    let totalScore = 0;
    const catScores = {
      nutrition: 0,
      activity: 0,
      sleepRecovery: 0,
      stressMental: 0,
      preventiveHabits: 0
    };

    ASSESSMENT_QUESTIONS.forEach(q => {
      const selectedIndex = answers[q.id];
      const pts = q.options[selectedIndex].points;
      totalScore += pts;
      catScores[q.category] += pts;
    });

    const roundedScore = Math.min(100, Math.max(10, Math.round(totalScore)));

    let tier: 'Optimal' | 'Good' | 'Moderate Attention' | 'Needs Focused Care' = 'Good';
    let summary = 'Your daily habits show strong preventive fundamentals.';

    if (roundedScore >= 85) {
      tier = 'Optimal';
      summary = 'Exceptional preventive lifestyle habits! You maintain exemplary consistency across nutrition, exercise, sleep hygiene, and stress regulation.';
    } else if (roundedScore >= 70) {
      tier = 'Good';
      summary = 'Solid lifestyle foundation. Targeted improvements to hydration consistency and routine screening intervals will elevate your vitality score.';
    } else if (roundedScore >= 50) {
      tier = 'Moderate Attention';
      summary = 'Several daily lifestyle markers show opportunity for enhancement, specifically in sleep restoration and regular physical activity.';
    } else {
      tier = 'Needs Focused Care';
      summary = 'Your lifestyle markers suggest significant areas for preventive attention. Prioritize gradual, sustainable changes in sleep, hydration, and daily movement.';
    }

    // Personalized recommendations based on age group and weak areas
    const recommendations: string[] = [];

    if (catScores.nutrition < 16) {
      recommendations.push('Increase fiber intake by adding leafy greens, berries, legumes, and unsalted seeds to your daily meals.');
      recommendations.push(`Reach for ${ageGroupInfo.waterGoalLiters}L of water daily to support cellular hydration and metabolic function.`);
    }

    if (catScores.activity < 16) {
      recommendations.push(`Target at least ${ageGroupInfo.activityGoalMinutes} minutes of moderate activity daily (e.g. brisk walking, cycling, or swimming).`);
      recommendations.push('Break up sedentary screen time by standing and doing gentle hamstring and spinal stretches every 45 minutes.');
    }

    if (catScores.sleepRecovery < 10) {
      recommendations.push(`Aim for ${ageGroupInfo.sleepGoalHours} hours of uninterrupted sleep nightly by maintaining a fixed bedtime and powering down screens 45 minutes prior.`);
    }

    if (catScores.preventiveHabits < 16) {
      recommendations.push('Schedule an annual preventive wellness consultation and routine blood panel with your primary care provider.');
      recommendations.push(`Review immunizations recommended for ${ageGroupInfo.label}, including ${ageGroupInfo.recommendedVaccines.slice(0, 2).join(' and ')}.`);
    }

    // Ensure at least 3 tips
    if (recommendations.length < 3) {
      recommendations.push(...ageGroupInfo.preventiveTips);
    }

    const newResult: AssessmentResult = {
      id: `assess-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      totalScore: roundedScore,
      tier,
      summary,
      categoryScores: catScores,
      recommendations: recommendations.slice(0, 5)
    };

    onSaveAssessment(newResult);
    setCurrentResult(newResult);
    setIsSubmitting(false);

    // Smooth scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Preventive Health &amp; Lifestyle Assessment</h1>
          </div>
          <p className="text-xs text-slate-500">
            Interactive lifestyle evaluation providing personalized preventive wellness recommendations.
          </p>
        </div>

        {currentResult && (
          <button
            id="btn-retake-assessment"
            onClick={handleRetake}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Assessment
          </button>
        )}
      </div>

      {/* Strict Preventive Notice */}
      <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-900">
          <span className="font-bold">Medical Disclaimer: </span>
          This assessment analyzes self-reported lifestyle habits (nutrition, activity, sleep, and preventive checkups). It does <strong>not</strong> screen for, diagnose, or treat any medical conditions. Always discuss your health indicators with a certified healthcare practitioner.
        </div>
      </div>

      {/* Result Display if completed */}
      {currentResult && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                Assessment Completed • {currentResult.date}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Preventive Wellness Status: {currentResult.tier}
              </h2>
              <span className="text-xs text-teal-700 font-semibold">
                Personalized for {profile.name} ({ageGroupInfo.label})
              </span>
            </div>

            {/* Score Ring / Pill */}
            <div className="flex items-center gap-3 bg-teal-50 border border-teal-200/80 px-4 py-3 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
                {currentResult.totalScore}
              </div>
              <div>
                <span className="text-xs font-bold text-teal-950 block">Wellness Index</span>
                <span className="text-[11px] text-teal-700">out of 100 max</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
            <p className="font-medium">{currentResult.summary}</p>
          </div>

          {/* Recommendations list */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Tailored Preventive Lifestyle Recommendations
            </h3>
            <div className="space-y-2.5">
              {currentResult.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white border border-teal-100 rounded-xl flex items-start gap-3 shadow-xs hover:border-teal-300 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Past Assessment History */}
          {assessments.length > 1 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Previous Assessment Records
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {assessments.slice(1, 5).map(item => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{item.date}</span>
                      <span className="text-[11px] text-slate-500 block">{item.tier}</span>
                    </div>
                    <span className="font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                      {item.totalScore}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Assessment Form */}
      {(!currentResult || isComplete) && (
        <form onSubmit={handleSubmitAssessment} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                8 Lifestyle Questions
              </span>
              <span className="text-xs font-bold text-teal-700">
                {Object.keys(answers).length} of {ASSESSMENT_QUESTIONS.length} Answered
              </span>
            </div>

            {ASSESSMENT_QUESTIONS.map((q, qIndex) => (
              <div key={q.id} className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{q.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{q.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = answers[q.id] === optIndex;
                    return (
                      <button
                        key={optIndex}
                        type="button"
                        id={`btn-q-${q.id}-opt-${optIndex}`}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/70 shadow-xs ring-1 ring-teal-600 text-teal-950 font-semibold'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="leading-snug">{opt.text}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                {isComplete
                  ? '✓ All questions answered. Ready to generate recommendations.'
                  : `Please answer the remaining ${ASSESSMENT_QUESTIONS.length - Object.keys(answers).length} questions to submit.`}
              </span>

              <button
                id="btn-submit-assessment"
                type="submit"
                disabled={!isComplete || isSubmitting}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all shadow-sm ${
                  isComplete && !isSubmitting
                    ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer hover:scale-[1.02]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Calculate Assessment &amp; Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
