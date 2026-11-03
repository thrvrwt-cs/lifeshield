import React, { useState } from 'react';
import { DailyLog, DayMetricPoint } from '../types';
import {
  BarChart3,
  Droplets,
  Moon,
  Footprints,
  HeartPulse,
  TrendingUp,
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface WeeklyAnalyticsTabProps {
  history: DayMetricPoint[];
  dailyLog: DailyLog;
  onSyncTodayToHistory: () => void;
  wellnessScore: number;
}

type ActiveChart = 'all' | 'water' | 'sleep' | 'activity' | 'score';

export const WeeklyAnalyticsTab: React.FC<WeeklyAnalyticsTabProps> = ({
  history,
  dailyLog,
  onSyncTodayToHistory,
  wellnessScore
}) => {
  const [activeChart, setActiveChart] = useState<ActiveChart>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{ chart: string; index: number } | null>(null);

  // Compute averages
  const avgWater = Math.round((history.reduce((acc, p) => acc + p.water, 0) / history.length) * 10) / 10;
  const avgSleep = Math.round((history.reduce((acc, p) => acc + p.sleep, 0) / history.length) * 10) / 10;
  const totalActivity = history.reduce((acc, p) => acc + p.activity, 0);
  const avgActivity = Math.round(totalActivity / history.length);
  const avgScore = Math.round(history.reduce((acc, p) => acc + p.wellnessScore, 0) / history.length);

  // Find max values for chart scale
  const maxWater = Math.max(4.0, ...history.map(p => p.water));
  const maxSleep = Math.max(10.0, ...history.map(p => p.sleep));
  const maxActivity = Math.max(70, ...history.map(p => p.activity));

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">7-Day Preventive Wellness Analytics</h1>
          </div>
          <p className="text-xs text-slate-500">
            Track weekly habit consistency, circadian sleep trends, hydration, and overall wellness score trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-sync-analytics-today"
            onClick={onSyncTodayToHistory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Today's Metrics
          </button>
        </div>
      </div>

      {/* 4 Top 7-Day Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avg Water */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-xs font-bold text-slate-500">7-Day Avg Water</span>
            <Droplets className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{avgWater}</span>
            <span className="text-xs text-slate-400">L / day</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {avgWater >= (dailyLog.waterGoalLiters || 2.5) ? '✓ Meets hydration target' : 'Slightly under goal'}
          </span>
        </div>

        {/* Avg Sleep */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-bold text-slate-500">7-Day Avg Sleep</span>
            <Moon className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{avgSleep}</span>
            <span className="text-xs text-slate-400">hrs / night</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
            {avgSleep >= 7.0 ? '✓ Restful recovery' : 'Below 7h benchmark'}
          </span>
        </div>

        {/* Total Active Mins */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-bold text-slate-500">Weekly Active Time</span>
            <Footprints className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{totalActivity}</span>
            <span className="text-xs text-slate-400">mins total</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            ~{avgActivity} mins daily average
          </span>
        </div>

        {/* Avg Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-teal-600 mb-1">
            <span className="text-xs font-bold text-slate-500">Avg Wellness Score</span>
            <HeartPulse className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-teal-700">{avgScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Stable Preventive Trend
          </span>
        </div>
      </div>

      {/* Chart View Filter Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <span className="text-xs font-semibold text-slate-500 mr-2">Display Charts:</span>
        {[
          { id: 'all', label: 'All 4 Metrics' },
          { id: 'score', label: 'Wellness Score' },
          { id: 'water', label: 'Water Intake' },
          { id: 'sleep', label: 'Sleep Hours' },
          { id: 'activity', label: 'Physical Activity' }
        ].map(tab => (
          <button
            key={tab.id}
            id={`btn-chart-tab-${tab.id}`}
            onClick={() => setActiveChart(tab.id as ActiveChart)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeChart === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Wellness Score Trend */}
        {(activeChart === 'all' || activeChart === 'score') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                  <HeartPulse className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Weekly Wellness Score Trajectory</h2>
                  <span className="text-[11px] text-slate-400">0–100 Lifestyle Score Index</span>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Latest: {wellnessScore}/100
              </span>
            </div>

            {/* Line/Area SVG Chart */}
            <div className="relative h-48 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                {/* Horizontal gridlines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="400" y2="140" stroke="#cbd5e1" strokeWidth="1" />

                {/* Score path calculation */}
                {(() => {
                  const points = history.map((pt, i) => {
                    const x = 30 + i * 55;
                    // Y: 100 score is y=20, 0 score is y=140
                    const y = 140 - (pt.wellnessScore / 100) * 120;
                    return { x, y, pt, i };
                  });

                  const pathD = points.reduce((acc, p, idx) => {
                    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                  }, '');

                  const areaD = `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

                  return (
                    <>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d={areaD} fill="url(#scoreGradient)" />
                      <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />

                      {/* Points */}
                      {points.map(({ x, y, pt, i }) => (
                        <g key={i}>
                          <circle
                            cx={x}
                            cy={y}
                            r={hoveredPoint?.chart === 'score' && hoveredPoint.index === i ? 6 : 4}
                            fill="#0d9488"
                            stroke="#ffffff"
                            strokeWidth="2"
                            className="cursor-pointer transition-all hover:scale-125"
                            onMouseEnter={() => setHoveredPoint({ chart: 'score', index: i })}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          <text
                            x={x}
                            y="155"
                            textAnchor="middle"
                            className="text-[11px] fill-slate-400 font-semibold"
                          >
                            {pt.day}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>

              {/* Tooltip */}
              {hoveredPoint?.chart === 'score' && (
                <div
                  className="absolute top-2 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-lg shadow-lg pointer-events-none"
                  style={{ left: `${25 + hoveredPoint.index * 13}%` }}
                >
                  <span className="font-bold">{history[hoveredPoint.index].day}: </span>
                  <span>{history[hoveredPoint.index].wellnessScore} pts</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Goal Baseline: 80+ Optimal Tier</span>
              <span>7-Day Average: {avgScore} pts</span>
            </div>
          </div>
        )}

        {/* Chart 2: Water Intake Bar Chart */}
        {(activeChart === 'all' || activeChart === 'water') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <Droplets className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Daily Hydration Log (Liters)</h2>
                  <span className="text-[11px] text-slate-400">Target: {dailyLog.waterGoalLiters}L per day</span>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Avg: {avgWater}L
              </span>
            </div>

            {/* Bar SVG */}
            <div className="relative h-48 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                {/* Goal reference line */}
                {(() => {
                  const goalY = 140 - (dailyLog.waterGoalLiters / maxWater) * 120;
                  return (
                    <g>
                      <line x1="15" y1={goalY} x2="385" y2={goalY} stroke="#3b82f6" strokeDasharray="4 4" strokeWidth="1.5" />
                      <text x="385" y={goalY - 4} textAnchor="end" className="text-[10px] fill-blue-600 font-bold">
                        Target {dailyLog.waterGoalLiters}L
                      </text>
                    </g>
                  );
                })()}

                <line x1="0" y1="140" x2="400" y2="140" stroke="#cbd5e1" strokeWidth="1" />

                {history.map((pt, i) => {
                  const x = 30 + i * 52;
                  const barHeight = Math.min(125, (pt.water / maxWater) * 120);
                  const y = 140 - barHeight;
                  const isHovered = hoveredPoint?.chart === 'water' && hoveredPoint.index === i;

                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint({ chart: 'water', index: i })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <rect
                        x={x - 12}
                        y={y}
                        width="24"
                        height={barHeight}
                        rx="5"
                        fill={isHovered ? '#1d4ed8' : '#3b82f6'}
                        className="transition-all"
                      />
                      <text
                        x={x}
                        y={y - 5}
                        textAnchor="middle"
                        className="text-[10px] fill-slate-700 font-bold"
                      >
                        {pt.water.toFixed(1)}
                      </text>
                      <text
                        x={x}
                        y="155"
                        textAnchor="middle"
                        className="text-[11px] fill-slate-400 font-semibold"
                      >
                        {pt.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Blue bar represents fluid volume</span>
              <span>Dashed line is age target ({dailyLog.waterGoalLiters}L)</span>
            </div>
          </div>
        )}

        {/* Chart 3: Sleep Rest Duration */}
        {(activeChart === 'all' || activeChart === 'sleep') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Moon className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Sleep Rest Duration (Hours)</h2>
                  <span className="text-[11px] text-slate-400">Target: {dailyLog.sleepGoalHours}h nightly</span>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                Avg: {avgSleep}h
              </span>
            </div>

            {/* Bar SVG */}
            <div className="relative h-48 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                {/* 7h-8.5h Healthy band */}
                {(() => {
                  const yTop = 140 - (8.5 / maxSleep) * 120;
                  const yBottom = 140 - (7.0 / maxSleep) * 120;
                  return (
                    <rect
                      x="10"
                      y={yTop}
                      width="380"
                      height={yBottom - yTop}
                      fill="#e0e7ff"
                      opacity="0.4"
                    />
                  );
                })()}

                <line x1="0" y1="140" x2="400" y2="140" stroke="#cbd5e1" strokeWidth="1" />

                {history.map((pt, i) => {
                  const x = 30 + i * 52;
                  const barHeight = Math.min(125, (pt.sleep / maxSleep) * 120);
                  const y = 140 - barHeight;
                  const isHovered = hoveredPoint?.chart === 'sleep' && hoveredPoint.index === i;

                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint({ chart: 'sleep', index: i })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <rect
                        x={x - 12}
                        y={y}
                        width="24"
                        height={barHeight}
                        rx="5"
                        fill={isHovered ? '#4338ca' : '#6366f1'}
                        className="transition-all"
                      />
                      <text
                        x={x}
                        y={y - 5}
                        textAnchor="middle"
                        className="text-[10px] fill-slate-700 font-bold"
                      >
                        {pt.sleep.toFixed(1)}h
                      </text>
                      <text
                        x={x}
                        y="155"
                        textAnchor="middle"
                        className="text-[11px] fill-slate-400 font-semibold"
                      >
                        {pt.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Shaded band shows optimal circadian recovery range</span>
              <span>7-Day Sleep Total: {Math.round(history.reduce((a, b) => a + b.sleep, 0))}h</span>
            </div>
          </div>
        )}

        {/* Chart 4: Physical Activity Minutes */}
        {(activeChart === 'all' || activeChart === 'activity') && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <Footprints className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Physical Activity Minutes</h2>
                  <span className="text-[11px] text-slate-400">Cardio movement &amp; endurance</span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Total: {totalActivity}m
              </span>
            </div>

            {/* Bar SVG */}
            <div className="relative h-48 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                {/* 30m goal line */}
                {(() => {
                  const goalY = 140 - (dailyLog.activityGoalMinutes / maxActivity) * 120;
                  return (
                    <g>
                      <line x1="15" y1={goalY} x2="385" y2={goalY} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1.5" />
                      <text x="385" y={goalY - 4} textAnchor="end" className="text-[10px] fill-amber-600 font-bold">
                        Target {dailyLog.activityGoalMinutes}m
                      </text>
                    </g>
                  );
                })()}

                <line x1="0" y1="140" x2="400" y2="140" stroke="#cbd5e1" strokeWidth="1" />

                {history.map((pt, i) => {
                  const x = 30 + i * 52;
                  const barHeight = Math.min(125, (pt.activity / maxActivity) * 120);
                  const y = 140 - barHeight;
                  const isHovered = hoveredPoint?.chart === 'activity' && hoveredPoint.index === i;

                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint({ chart: 'activity', index: i })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <rect
                        x={x - 12}
                        y={y}
                        width="24"
                        height={barHeight}
                        rx="5"
                        fill={isHovered ? '#b45309' : '#f59e0b'}
                        className="transition-all"
                      />
                      <text
                        x={x}
                        y={y - 5}
                        textAnchor="middle"
                        className="text-[10px] fill-slate-700 font-bold"
                      >
                        {pt.activity}m
                      </text>
                      <text
                        x={x}
                        y="155"
                        textAnchor="middle"
                        className="text-[11px] fill-slate-400 font-semibold"
                      >
                        {pt.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Goal: 150 mins moderate activity weekly (WHO guidelines)</span>
              <span className="text-emerald-600 font-bold">
                {totalActivity >= 150 ? '✓ Goal Exceeded' : `${150 - totalActivity} mins to goal`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
