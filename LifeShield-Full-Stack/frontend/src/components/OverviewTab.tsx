import React, { useState } from 'react';
import {
  AgeGroupInfo,
  BMIData,
  DailyLog,
  ExerciseStatus,
  ReminderItem,
  UserProfile,
  VaccineRecord
} from '../types';
import { WellnessScoreBreakdown } from '../utils/healthCalculations';
import {
  HeartPulse,
  Droplets,
  Moon,
  Footprints,
  Dumbbell,
  ShieldCheck,
  QrCode,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Syringe,
  Check,
  LogOut
} from 'lucide-react';
import { NavTab } from './Navbar';

interface OverviewTabProps {
  profile: UserProfile;
  ageGroupInfo: AgeGroupInfo;
  bmiData: BMIData;
  wellnessScore: WellnessScoreBreakdown;
  dailyLog: DailyLog;
  onUpdateDailyLog: (log: DailyLog) => void;
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  vaccines: VaccineRecord[];
  onSelectTab: (tab: NavTab) => void;
  onOpenProfile: () => void;
  onOpenEmergencyModal: () => void;
  authUser?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  profile,
  ageGroupInfo,
  bmiData,
  wellnessScore,
  dailyLog,
  onUpdateDailyLog,
  reminders,
  onToggleReminder,
  vaccines,
  onSelectTab,
  onOpenProfile,
  onOpenEmergencyModal,
  authUser,
  onLogout
}) => {
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  // Quick daily actions
  const handleQuickAddWater = (amountLiters: number) => {
    const updatedWater = Math.round((dailyLog.waterIntakeLiters + amountLiters) * 10) / 10;
    onUpdateDailyLog({
      ...dailyLog,
      waterIntakeLiters: Math.max(0, updatedWater)
    });
  };

  const handleSetExercise = (status: ExerciseStatus) => {
    onUpdateDailyLog({
      ...dailyLog,
      exerciseStatus: status
    });
  };

  // Calculate vaccine stats
  const completedVaccines = vaccines.filter(v => v.completed).length;
  const overdueVaccines = vaccines.filter(v => !v.completed && v.dueDate < new Date().toISOString().split('T')[0]).length;
  const upcomingVaccines = vaccines.filter(v => !v.completed && v.dueDate >= new Date().toISOString().split('T')[0]).length;

  const pendingReminders = reminders.filter(r => !r.completed).slice(0, 3);

  // Calculate percentages for progress bars
  const waterPct = Math.min(100, Math.round((dailyLog.waterIntakeLiters / (dailyLog.waterGoalLiters || 2.5)) * 100));
  const sleepPct = Math.min(100, Math.round((dailyLog.sleepHours / (dailyLog.sleepGoalHours || 8)) * 100));
  const activityPct = Math.min(100, Math.round((dailyLog.physicalActivityMinutes / (dailyLog.activityGoalMinutes || 35)) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Age-Based Personalized Hero Banner */}
      <section
        id="age-personalized-banner"
        className="rounded-2xl p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 via-emerald-400/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full text-xs font-semibold text-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Age-Tailored Health Blueprint: {ageGroupInfo.label}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-teal-100/90 leading-relaxed">
              {ageGroupInfo.tagline}. Your daily hydration goal is <strong>{ageGroupInfo.waterGoalLiters}L</strong>,
              sleep target is <strong>{ageGroupInfo.sleepGoalHours}h</strong>, and target activity is{' '}
              <strong>{ageGroupInfo.activityGoalMinutes} mins</strong>.
            </p>

            {/* Personalized Preventive Tips list */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              {ageGroupInfo.preventiveTips.slice(0, 2).map((tip, idx) => (
                <span
                  key={idx}
                  className="bg-white/10 backdrop-blur-xs text-white/90 px-2.5 py-1 rounded-lg border border-white/10"
                >
                  💡 {tip}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              id="btn-hero-edit-profile"
              onClick={onOpenProfile}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-teal-900 hover:bg-teal-50 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
            >
              Update Profile ({profile.age}y • {profile.bloodGroup})
            </button>
            <button
              id="btn-hero-emergency-card"
              onClick={onOpenEmergencyModal}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
            >
              <QrCode className="w-4 h-4" />
              View Emergency QR Card
            </button>
          </div>
        </div>
      </section>

      {/* 2. Top Metric Dual-Cards: Wellness Score & BMI Calculator */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Health Score Card (7 cols) */}
        <div
          id="wellness-score-card"
          className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                    <HeartPulse className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Daily Wellness Score</h2>
                    <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                      Preventive Metric • NOT A Medical Diagnosis
                    </span>
                  </div>
                </div>
              </div>

              {/* Tier Badge */}
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: wellnessScore.tierColor }}
              >
                {wellnessScore.tier}
              </span>
            </div>

            {/* Score Ring + Breakdown Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-2">
              {/* Radial Number Display */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#f1f5f9"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={wellnessScore.tierColor}
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - wellnessScore.score / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 leading-none">
                      {wellnessScore.score}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">/ 100</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700 mt-2">Preventive Index</span>
              </div>

              {/* Summary & Factor Bars */}
              <div className="sm:col-span-8 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {wellnessScore.summary}
                </p>

                {/* Score Factor Chips */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">BMI Stability</span>
                    <span className="font-bold text-slate-800">{wellnessScore.bmiScore} / 25 pts</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Sleep Duration</span>
                    <span className="font-bold text-slate-800">{wellnessScore.sleepScore} / 25 pts</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Water Intake</span>
                    <span className="font-bold text-slate-800">{wellnessScore.waterScore} / 20 pts</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Activity &amp; Exercise</span>
                    <span className="font-bold text-slate-800">
                      {wellnessScore.activityScore + wellnessScore.exerciseScore} / 30 pts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Calculation Factors */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              id="btn-toggle-score-breakdown"
              onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1"
            >
              {showScoreBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showScoreBreakdown ? 'Hide factor formula' : 'How is this calculated?'}
            </button>

            <button
              id="btn-overview-to-analytics"
              onClick={() => onSelectTab('analytics')}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1"
            >
              View 7-day trend
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {showScoreBreakdown && (
            <div className="mt-3 p-3 bg-teal-50/70 border border-teal-200/70 rounded-xl text-xs text-teal-950 space-y-1.5 animate-in fade-in duration-150">
              <div className="font-bold text-teal-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-700" />
                Score Calculation Formula (0–100 Max):
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-teal-800 text-[11px]">
                <li><strong>BMI (25 pts):</strong> Evaluates weight-to-height balance vs. clinical reference ranges.</li>
                <li><strong>Sleep (25 pts):</strong> Evaluates sleep against age-recommended recovery hours ({ageGroupInfo.sleepGoalHours}h).</li>
                <li><strong>Hydration (20 pts):</strong> Compares daily water logged against daily hydration target ({ageGroupInfo.waterGoalLiters}L).</li>
                <li><strong>Physical Activity (20 pts):</strong> Measures active cardio minutes against daily goal ({ageGroupInfo.activityGoalMinutes}m).</li>
                <li><strong>Exercise Habit (10 pts):</strong> Awards points for completed, light, or scheduled rest workouts.</li>
              </ul>
              <p className="text-[10px] text-teal-700 italic pt-1 border-t border-teal-200/60">
                Notice: Designed strictly for educational lifestyle tracking. Does not substitute diagnostic bloodwork or physician evaluation.
              </p>
            </div>
          )}
        </div>

        {/* 2. BMI Calculator Card (5 cols) */}
        <div
          id="bmi-calculator-card"
          className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">BMI Calculator</h2>
                  <span className="text-[11px] text-slate-500 font-mono">
                    weight(kg) / height(m)²
                  </span>
                </div>
              </div>

              {/* BMI Category Pill */}
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: bmiData.bgColor,
                  color: bmiData.textColor,
                  border: `1px solid ${bmiData.color}40`
                }}
              >
                {bmiData.category}
              </span>
            </div>

            {/* Value Display */}
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-4xl font-black text-slate-900 tracking-tight">
                {bmiData.value > 0 ? bmiData.value.toFixed(1) : '--'}
              </span>
              <span className="text-xs font-semibold text-slate-500">kg/m²</span>
              <span className="text-xs text-slate-400">
                ({profile.heightCm} cm • {profile.weightKg} kg)
              </span>
            </div>

            {/* Clinical Range Meter */}
            <div className="space-y-1.5 mb-4">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-amber-400 w-[18.5%]" title="Underweight (<18.5)"></div>
                <div className="h-full bg-emerald-500 w-[24.9%]" title="Normal (18.5 - 24.9)"></div>
                <div className="h-full bg-orange-400 w-[29.9%]" title="Overweight (25.0 - 29.9)"></div>
                <div className="h-full bg-rose-500 flex-1" title="Obese (≥30.0)"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>16.0</span>
                <span className="text-emerald-700 font-bold">18.5 (Normal)</span>
                <span className="text-orange-700 font-bold">25.0</span>
                <span>30.0+</span>
              </div>
            </div>

            {/* Wellness Explanation */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed mb-3">
              <p>{bmiData.explanation}</p>
            </div>

            {/* Reference Weight Guidance */}
            <div className="text-[11px] text-slate-500 flex items-center justify-between bg-white border border-slate-100 p-2.5 rounded-lg">
              <span>Healthy reference weight for {profile.heightCm}cm:</span>
              <span className="font-bold text-slate-800">
                {bmiData.healthyWeightRange.min} – {bmiData.healthyWeightRange.max} kg
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              id="btn-edit-height-weight"
              onClick={onOpenProfile}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1"
            >
              Update Height &amp; Weight
            </button>
            <span className="text-[11px] text-slate-400">Auto-calculated</span>
          </div>
        </div>
      </section>

      {/* 3. Daily Tracking Live Progress Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Preventive Daily Tracking</h2>
              <span className="text-xs text-slate-500">Live progress towards age-tailored daily goals</span>
            </div>
          </div>
          <button
            id="btn-view-full-daily-tracker"
            onClick={() => onSelectTab('daily')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
          >
            Open Full Tracker
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Water Card */}
          <div className="bg-white rounded-xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Droplets className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {waterPct}%
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 block">Water Intake</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-slate-900">{dailyLog.waterIntakeLiters.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-medium">/ {dailyLog.waterGoalLiters} L</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${waterPct}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
              <button
                id="btn-quick-water-250"
                onClick={() => handleQuickAddWater(0.25)}
                className="flex-1 py-1 px-2 text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors text-center"
              >
                +250ml
              </button>
              <button
                id="btn-quick-water-500"
                onClick={() => handleQuickAddWater(0.5)}
                className="flex-1 py-1 px-2 text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors text-center"
              >
                +500ml
              </button>
            </div>
          </div>

          {/* Sleep Card */}
          <div className="bg-white rounded-xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Moon className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {sleepPct}%
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 block">Sleep Rest</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-slate-900">{dailyLog.sleepHours.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-medium">/ {dailyLog.sleepGoalHours} hrs</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${sleepPct}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span>Goal: {ageGroupInfo.sleepGoalHours}h ({ageGroupInfo.label.split(' ')[0]})</span>
              <button
                id="btn-quick-sleep-adjust"
                onClick={() => onSelectTab('daily')}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Adjust
              </button>
            </div>
          </div>

          {/* Physical Activity Card */}
          <div className="bg-white rounded-xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Footprints className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  {activityPct}%
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 block">Physical Activity</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-slate-900">{dailyLog.physicalActivityMinutes}</span>
                <span className="text-xs text-slate-400 font-medium">/ {dailyLog.activityGoalMinutes} mins</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${activityPct}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span>Est. ~{(dailyLog.physicalActivityMinutes * 110).toLocaleString()} steps</span>
              <button
                id="btn-quick-activity-log"
                onClick={() => onSelectTab('daily')}
                className="text-amber-600 hover:text-amber-800 font-semibold"
              >
                Log Mins
              </button>
            </div>
          </div>

          {/* Exercise Status Card */}
          <div className="bg-white rounded-xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Dumbbell className="w-4 h-4" />
                </span>
                <span className="capitalize text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {dailyLog.exerciseStatus}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 block">Exercise Status</span>
              <div className="mt-1">
                <span className="text-base font-bold text-slate-900 capitalize">
                  {dailyLog.exerciseStatus === 'completed'
                    ? 'Workout Done 🎉'
                    : dailyLog.exerciseStatus === 'light'
                    ? 'Light Movement'
                    : dailyLog.exerciseStatus === 'rest'
                    ? 'Rest & Recovery'
                    : 'Planned Today'}
                </span>
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="grid grid-cols-4 gap-1 mt-4 pt-3 border-t border-slate-100">
              {(['completed', 'light', 'rest', 'planned'] as ExerciseStatus[]).map(status => (
                <button
                  key={status}
                  id={`btn-status-${status}`}
                  onClick={() => handleSetExercise(status)}
                  className={`py-1 text-[10px] font-bold uppercase rounded transition-all ${
                    dailyLog.exerciseStatus === status
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={status}
                >
                  {status.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Row: Reminders & Vaccination Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reminders Snapshot */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <Calendar className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upcoming Reminders</h3>
                  <span className="text-xs text-slate-500">Scheduled checks, wellness &amp; vaccines</span>
                </div>
              </div>
              <button
                id="btn-overview-all-reminders"
                onClick={() => onSelectTab('reminders')}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1"
              >
                View all ({reminders.length})
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {pendingReminders.length > 0 ? (
              <div className="space-y-2.5">
                {pendingReminders.map(rem => (
                  <div
                    key={rem.id}
                    className="p-3 rounded-xl border border-slate-200 hover:border-teal-200 transition-all flex items-start justify-between gap-3 bg-slate-50/50"
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        id={`btn-check-rem-${rem.id}`}
                        onClick={() => onToggleReminder(rem.id)}
                        className="mt-0.5 w-5 h-5 rounded-md border border-slate-300 hover:border-teal-500 flex items-center justify-center text-transparent hover:text-teal-600 transition-colors"
                        title="Mark Completed"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{rem.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          📅 {rem.date} {rem.time ? `at ${rem.time}` : ''} •{' '}
                          <span className="capitalize font-semibold text-slate-600">{rem.category}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">
                      Upcoming
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All scheduled reminders are completed!
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onSelectTab('reminders')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              Schedule new reminder
            </button>
            <span className="text-[11px] text-slate-400">{pendingReminders.length} active</span>
          </div>
        </div>

        {/* Vaccination Status Snapshot */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                  <Syringe className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Immunization Status</h3>
                  <span className="text-xs text-slate-500">Auto-calculated from current date</span>
                </div>
              </div>
              <button
                id="btn-overview-all-vaccines"
                onClick={() => onSelectTab('vaccines')}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1"
              >
                Manage Records
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Status Counters */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3 text-center">
                <span className="text-2xl font-black text-emerald-700 block">{completedVaccines}</span>
                <span className="text-[11px] font-semibold text-emerald-800">Completed</span>
              </div>
              <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-3 text-center">
                <span className="text-2xl font-black text-blue-700 block">{upcomingVaccines}</span>
                <span className="text-[11px] font-semibold text-blue-800">Upcoming</span>
              </div>
              <div className="bg-rose-50/70 border border-rose-200/70 rounded-xl p-3 text-center">
                <span className="text-2xl font-black text-rose-700 block">{overdueVaccines}</span>
                <span className="text-[11px] font-semibold text-rose-800">Overdue</span>
              </div>
            </div>

            {/* Age Group Recommended Immunizations */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Recommended for {ageGroupInfo.label.split(' ')[0]}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ageGroupInfo.recommendedVaccines.slice(0, 3).map((vac, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                  >
                    {vac}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onSelectTab('vaccines')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              Add vaccine log
            </button>
            {overdueVaccines > 0 && (
              <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {overdueVaccines} overdue action needed
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 8. Active Account & Cloud Session Section */}
      <section
        id="account-session-card"
        className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            {(authUser?.name || profile.name).charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900">{authUser?.name || profile.name}</h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Account
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full border border-slate-200">
                PostgreSQL Synced
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Signed in as <strong className="text-slate-700">{authUser?.email || 'Active User'}</strong> • All wellness entries, vaccines, and metrics are saved to your account.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenProfile}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Edit Profile
          </button>
          {onLogout && (
            <button
              id="btn-overview-logout"
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors shadow-xs"
              title="Log out of LifeShield"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
