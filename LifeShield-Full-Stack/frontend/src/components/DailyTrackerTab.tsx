import React, { useState } from 'react';
import { AgeGroupInfo, DailyLog, ExerciseStatus } from '../types';
import {
  Droplets,
  Moon,
  Footprints,
  Dumbbell,
  RotateCcw,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
  Info
} from 'lucide-react';

interface DailyTrackerTabProps {
  dailyLog: DailyLog;
  onUpdateDailyLog: (log: DailyLog) => void;
  ageGroupInfo: AgeGroupInfo;
}

export const DailyTrackerTab: React.FC<DailyTrackerTabProps> = ({
  dailyLog,
  onUpdateDailyLog,
  ageGroupInfo
}) => {
  const [customWater, setCustomWater] = useState('');
  const [saveBanner, setSaveBanner] = useState(false);

  const triggerSaveNotification = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  const handleAdjustWater = (delta: number) => {
    const updated = Math.max(0, Math.round((dailyLog.waterIntakeLiters + delta) * 10) / 10);
    onUpdateDailyLog({ ...dailyLog, waterIntakeLiters: updated });
    triggerSaveNotification();
  };

  const handleAddCustomWater = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customWater);
    if (!isNaN(parsed) && parsed > 0) {
      handleAdjustWater(parsed);
      setCustomWater('');
    }
  };

  const handleAdjustSleep = (delta: number) => {
    const updated = Math.max(0, Math.min(18, Math.round((dailyLog.sleepHours + delta) * 10) / 10));
    onUpdateDailyLog({ ...dailyLog, sleepHours: updated });
    triggerSaveNotification();
  };

  const handleAdjustActivity = (delta: number) => {
    const updated = Math.max(0, Math.round(dailyLog.physicalActivityMinutes + delta));
    onUpdateDailyLog({ ...dailyLog, physicalActivityMinutes: updated });
    triggerSaveNotification();
  };

  const handleSetExercise = (status: ExerciseStatus) => {
    onUpdateDailyLog({ ...dailyLog, exerciseStatus: status });
    triggerSaveNotification();
  };

  const handleResetDefaults = () => {
    onUpdateDailyLog({
      ...dailyLog,
      waterIntakeLiters: 0,
      sleepHours: ageGroupInfo.sleepGoalHours,
      physicalActivityMinutes: 0,
      exerciseStatus: 'planned'
    });
    triggerSaveNotification();
  };

  // Calculations
  const waterPct = Math.min(150, Math.round((dailyLog.waterIntakeLiters / (dailyLog.waterGoalLiters || 2.5)) * 100));
  const sleepPct = Math.min(150, Math.round((dailyLog.sleepHours / (dailyLog.sleepGoalHours || 8)) * 100));
  const activityPct = Math.min(150, Math.round((dailyLog.physicalActivityMinutes / (dailyLog.activityGoalMinutes || 35)) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Droplets className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Daily Wellness Tracker</h1>
          </div>
          <p className="text-xs text-slate-500">
            Log your daily hydration, sleep duration, physical activity, and exercise status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveBanner && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              Synced &amp; Saved
            </span>
          )}
          <button
            id="btn-reset-daily-log"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Today
          </button>
        </div>
      </div>

      {/* Age Recommendation Prompt */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/70 p-4 rounded-xl flex items-start gap-3">
        <div className="p-2 bg-teal-100 text-teal-800 rounded-lg flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-teal-950">
            Target Goals for {ageGroupInfo.label}:
          </span>
          <p className="text-teal-800 mt-0.5">
            Hydration: <strong>{ageGroupInfo.waterGoalLiters} L/day</strong> • Sleep: <strong>{ageGroupInfo.sleepGoalHours} hrs/night</strong> • Physical Activity: <strong>{ageGroupInfo.activityGoalMinutes} mins/day</strong>.
          </p>
        </div>
      </div>

      {/* 4 Interactive Tracker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Water Intake */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Droplets className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Water Intake</h2>
                <span className="text-xs text-slate-500">Fluid balance &amp; cell hydration</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{dailyLog.waterIntakeLiters.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-medium"> / {dailyLog.waterGoalLiters} L</span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600">Daily Target Progress</span>
              <span className="text-blue-600 font-bold">{waterPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, waterPct)}%` }}
              ></div>
            </div>
          </div>

          {/* Steppers & Quick Adds */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">Quick Adjust</span>
              <div className="flex items-center gap-2">
                <button
                  id="btn-water-minus-250"
                  onClick={() => handleAdjustWater(-0.25)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-800 min-w-[50px] text-center">
                  {dailyLog.waterIntakeLiters.toFixed(2)} L
                </span>
                <button
                  id="btn-water-plus-250"
                  onClick={() => handleAdjustWater(0.25)}
                  className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick volume buttons */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleAdjustWater(0.25)}
                className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors text-center"
              >
                +250 ml
              </button>
              <button
                onClick={() => handleAdjustWater(0.5)}
                className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors text-center"
              >
                +500 ml
              </button>
              <button
                onClick={() => handleAdjustWater(0.75)}
                className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors text-center"
              >
                +750 ml
              </button>
              <button
                onClick={() => handleAdjustWater(1.0)}
                className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors text-center"
              >
                +1.0 L
              </button>
            </div>

            {/* Custom input */}
            <form onSubmit={handleAddCustomWater} className="flex gap-2 pt-1">
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Custom Liters (e.g. 0.3)"
                value={customWater}
                onChange={e => setCustomWater(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* 2. Sleep Hours */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Moon className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Sleep Duration</h2>
                <span className="text-xs text-slate-500">Neurological recovery &amp; repair</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{dailyLog.sleepHours.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-medium"> / {dailyLog.sleepGoalHours} hrs</span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600">Rest Sufficiency</span>
              <span className="text-indigo-600 font-bold">{sleepPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, sleepPct)}%` }}
              ></div>
            </div>
          </div>

          {/* Steppers & Presets */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">Log Sleep</span>
              <div className="flex items-center gap-2">
                <button
                  id="btn-sleep-minus"
                  onClick={() => handleAdjustSleep(-0.5)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-800 min-w-[50px] text-center">
                  {dailyLog.sleepHours.toFixed(1)} h
                </span>
                <button
                  id="btn-sleep-plus"
                  onClick={() => handleAdjustSleep(0.5)}
                  className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider */}
            <div>
              <input
                id="range-sleep-hours"
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={dailyLog.sleepHours}
                onChange={e => {
                  onUpdateDailyLog({ ...dailyLog, sleepHours: parseFloat(e.target.value) || 0 });
                  triggerSaveNotification();
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0h</span>
                <span>4h</span>
                <span className="font-bold text-indigo-700">7.5h - 8.5h (Target)</span>
                <span>12h+</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
              <span>Age Group Target:</span>
              <span className="font-bold text-slate-800">{ageGroupInfo.sleepGoalHours} hours nightly</span>
            </div>
          </div>
        </div>

        {/* 3. Physical Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Footprints className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Physical Activity</h2>
                <span className="text-xs text-slate-500">Active movement &amp; cardio output</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">{dailyLog.physicalActivityMinutes}</span>
              <span className="text-xs text-slate-400 font-medium"> / {dailyLog.activityGoalMinutes} mins</span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600">Active Goal Progress</span>
              <span className="text-amber-600 font-bold">{activityPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, activityPct)}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Mins Increments */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">Quick Log</span>
              <div className="flex items-center gap-2">
                <button
                  id="btn-activity-minus-5"
                  onClick={() => handleAdjustActivity(-5)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-800 min-w-[50px] text-center">
                  {dailyLog.physicalActivityMinutes} m
                </span>
                <button
                  id="btn-activity-plus-5"
                  onClick={() => handleAdjustActivity(5)}
                  className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleAdjustActivity(10)}
                className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs rounded-lg transition-colors text-center"
              >
                +10 min walk
              </button>
              <button
                onClick={() => handleAdjustActivity(20)}
                className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs rounded-lg transition-colors text-center"
              >
                +20 min jog
              </button>
              <button
                onClick={() => handleAdjustActivity(30)}
                className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs rounded-lg transition-colors text-center"
              >
                +30 min gym
              </button>
              <button
                onClick={() => handleAdjustActivity(45)}
                className="py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors text-center"
              >
                +45 min sports
              </button>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
              <span>Estimated Movement:</span>
              <span className="font-bold text-slate-800">
                ~{(dailyLog.physicalActivityMinutes * 110).toLocaleString()} steps
              </span>
            </div>
          </div>
        </div>

        {/* 4. Exercise Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Dumbbell className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Exercise Status</h2>
                <span className="text-xs text-slate-500">Planned vs. Completed routine</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full capitalize">
              {dailyLog.exerciseStatus}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Consistent physical conditioning protects cardiometabolic health and muscular posture. Select your status for today:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {[
              { id: 'completed', label: 'Completed', desc: 'Workout finished today', color: 'emerald' },
              { id: 'light', label: 'Light', desc: 'Stretching or mobility', color: 'teal' },
              { id: 'rest', label: 'Rest Day', desc: 'Intentional muscle repair', color: 'blue' },
              { id: 'planned', label: 'Planned', desc: 'Scheduled for later today', color: 'slate' }
            ].map(item => {
              const isSelected = dailyLog.exerciseStatus === item.id;
              return (
                <button
                  key={item.id}
                  id={`btn-daily-exercise-${item.id}`}
                  onClick={() => handleSetExercise(item.id as ExerciseStatus)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Optional Daily Note */}
          <div className="pt-2">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Daily Wellness Reflection Note
            </label>
            <input
              type="text"
              placeholder="e.g. Energy felt high, drank water before coffee..."
              value={dailyLog.notes || ''}
              onChange={e => {
                onUpdateDailyLog({ ...dailyLog, notes: e.target.value });
              }}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Wellness Tip Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
        <p>
          <strong>Preventive Habit Consistency:</strong> Logging your water, sleep, and physical activity daily automatically fine-tunes your 0–100 LifeShield Wellness Score and reflects in your 7-day trend analytics.
        </p>
      </div>
    </div>
  );
};
