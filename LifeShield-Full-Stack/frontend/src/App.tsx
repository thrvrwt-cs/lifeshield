import React, { useState, useEffect, useMemo } from 'react';
import {
  AssessmentResult,
  DailyLog,
  DayMetricPoint,
  ReminderItem,
  UserProfile,
  VaccineRecord
} from './types';
import { AGE_GROUP_CONFIG } from './data/initialData';
import {
  calculateBMI,
  calculateVaccineStatus,
  calculateWellnessScore,
  getAgeGroup
} from './utils/healthCalculations';
import {
  loadAssessments,
  loadDailyLog,
  loadReminders,
  loadUserProfile,
  loadVaccines,
  loadWeeklyHistory,
  saveAssessmentResult,
  saveDailyLog,
  saveReminders,
  saveUserProfile,
  saveVaccines,
  saveWeeklyHistory,
  syncWithBackend
} from './utils/storage';
import { Navbar, NavTab } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { OverviewTab } from './components/OverviewTab';
import { DailyTrackerTab } from './components/DailyTrackerTab';
import { WeeklyAnalyticsTab } from './components/WeeklyAnalyticsTab';
import { AssessmentTab } from './components/AssessmentTab';
import { VaccinationTab } from './components/VaccinationTab';
import { RemindersTab } from './components/RemindersTab';
import { EmergencyTab } from './components/EmergencyTab';
import { ProfileModal } from './components/ProfileModal';
import { EmergencyCardModal } from './components/EmergencyCardModal';
import { Shield, Heart, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { AuthPages } from './AuthPages';

export default function App() {
  const [authUser, setAuthUser] = useState<{name:string;email:string} | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    fetch('http://localhost:8080/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(user => {
        if (user?.email) {
          localStorage.setItem('lifeshield_active_email', user.email);
          setAuthUser(user);
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const handleAuthenticated = (user: { name: string; email: string }) => {
    localStorage.setItem('lifeshield_active_email', user.email);
    setAuthUser(user);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.warn('Logout request could not reach the backend.', error);
    } finally {
      localStorage.removeItem('lifeshield_active_email');
      setAuthUser(null);
      setAuthChecked(true);
    }
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Persistent Domain States
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [dailyLog, setDailyLog] = useState<DailyLog>(() => loadDailyLog());
  const [history, setHistory] = useState<DayMetricPoint[]>(() => loadWeeklyHistory());
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(() => loadVaccines());
  const [reminders, setReminders] = useState<ReminderItem[]>(() => loadReminders());
  const [assessments, setAssessments] = useState<AssessmentResult[]>(() => loadAssessments());

  // On startup, prefer the PostgreSQL-backed API when available; otherwise keep local data.
  useEffect(() => {
    let active = true;
    syncWithBackend().then(() => {
      if (!active) return;
      setProfile(loadUserProfile());
      setDailyLog(loadDailyLog());
      setHistory(loadWeeklyHistory());
      setVaccines(loadVaccines());
      setReminders(loadReminders());
      setAssessments(loadAssessments());
    }).catch(() => {
      console.info('LifeShield API unavailable; continuing with browser localStorage.');
    });
    return () => { active = false; };
  }, [authUser?.email]);

  // Automatic Age-Based Personalization
  const ageGroupKey = useMemo(() => getAgeGroup(profile.age), [profile.age]);
  const ageGroupInfo = useMemo(() => AGE_GROUP_CONFIG[ageGroupKey], [ageGroupKey]);

  // Adjust daily goals dynamically if user hasn't explicitly set custom goals
  useEffect(() => {
    setDailyLog(prev => ({
      ...prev,
      waterGoalLiters: prev.waterGoalLiters || ageGroupInfo.waterGoalLiters,
      sleepGoalHours: prev.sleepGoalHours || ageGroupInfo.sleepGoalHours,
      activityGoalMinutes: prev.activityGoalMinutes || ageGroupInfo.activityGoalMinutes
    }));
  }, [ageGroupInfo]);

  // Automatically compute BMI from height and weight
  const bmiData = useMemo(
    () => calculateBMI(profile.heightCm, profile.weightKg),
    [profile.heightCm, profile.weightKg]
  );

  // Automatically compute 0–100 Wellness Score
  const wellnessScore = useMemo(
    () => calculateWellnessScore(bmiData.value, dailyLog, profile.age),
    [bmiData.value, dailyLog, profile.age]
  );

  // Persistence Handlers
  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    saveUserProfile(updated);
  };

  const handleUpdateDailyLog = (updated: DailyLog) => {
    setDailyLog(updated);
    saveDailyLog(updated);
  };

  const handleSyncTodayToHistory = () => {
    const todayScore = wellnessScore.score;
    const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const todayIso = new Date().toISOString().split('T')[0];

    const updatedHistory = [...history];
    const lastIndex = updatedHistory.length - 1;

    if (lastIndex >= 0) {
      updatedHistory[lastIndex] = {
        day: currentDayName,
        date: todayIso,
        water: dailyLog.waterIntakeLiters,
        sleep: dailyLog.sleepHours,
        activity: dailyLog.physicalActivityMinutes,
        wellnessScore: todayScore
      };
    }

    setHistory(updatedHistory);
    saveWeeklyHistory(updatedHistory);
  };

  const handleAddVaccine = (vac: VaccineRecord) => {
    const updated = [vac, ...vaccines];
    setVaccines(updated);
    saveVaccines(updated);
  };

  const handleUpdateVaccine = (vac: VaccineRecord) => {
    const updated = vaccines.map(v => (v.id === vac.id ? vac : v));
    setVaccines(updated);
    saveVaccines(updated);
  };

  const handleDeleteVaccine = (id: string) => {
    const updated = vaccines.filter(v => v.id !== id);
    setVaccines(updated);
    saveVaccines(updated);
  };

  const handleAddReminder = (rem: ReminderItem) => {
    const updated = [rem, ...reminders];
    setReminders(updated);
    saveReminders(updated);
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => (r.id === id ? { ...r, completed: !r.completed } : r));
    setReminders(updated);
    saveReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    saveReminders(updated);
  };

  const handleSnoozeReminder = (id: string, days: number) => {
    const target = reminders.find(r => r.id === id);
    if (!target) return;

    const [y, m, d] = target.date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    const newDateStr = dateObj.toISOString().split('T')[0];

    const updated = reminders.map(r => (r.id === id ? { ...r, date: newDateStr } : r));
    setReminders(updated);
    saveReminders(updated);
  };

  const handleSaveAssessment = (result: AssessmentResult) => {
    setAssessments(prev => [result, ...prev]);
    saveAssessmentResult(result);
  };

  // Live counts for Navbar badges
  const pendingRemindersCount = useMemo(
    () => reminders.filter(r => !r.completed).length,
    [reminders]
  );

  const overdueVaccinesCount = useMemo(
    () =>
      vaccines.filter(
        v => !v.completed && calculateVaccineStatus(v.dueDate, v.completed) === 'overdue'
      ).length,
    [vaccines]
  );

  if (!authChecked) return <div className="min-h-screen grid place-items-center text-teal-700">Loading LifeShield…</div>;
  if (!authUser) return <AuthPages onAuthenticated={handleAuthenticated} />;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Medical Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Primary Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        profile={profile}
        ageGroupInfo={ageGroupInfo}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        pendingRemindersCount={pendingRemindersCount}
        overdueVaccinesCount={overdueVaccinesCount}
        onLogout={handleLogout}
        authUser={authUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewTab
            profile={profile}
            ageGroupInfo={ageGroupInfo}
            bmiData={bmiData}
            wellnessScore={wellnessScore}
            dailyLog={dailyLog}
            onUpdateDailyLog={handleUpdateDailyLog}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            vaccines={vaccines}
            onSelectTab={setActiveTab}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            authUser={authUser}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'daily' && (
          <DailyTrackerTab
            dailyLog={dailyLog}
            onUpdateDailyLog={handleUpdateDailyLog}
            ageGroupInfo={ageGroupInfo}
          />
        )}

        {activeTab === 'analytics' && (
          <WeeklyAnalyticsTab
            history={history}
            dailyLog={dailyLog}
            onSyncTodayToHistory={handleSyncTodayToHistory}
            wellnessScore={wellnessScore.score}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentTab
            profile={profile}
            ageGroupInfo={ageGroupInfo}
            assessments={assessments}
            onSaveAssessment={handleSaveAssessment}
          />
        )}

        {activeTab === 'vaccines' && (
          <VaccinationTab
            vaccines={vaccines}
            onAddVaccine={handleAddVaccine}
            onUpdateVaccine={handleUpdateVaccine}
            onDeleteVaccine={handleDeleteVaccine}
            ageGroupInfo={ageGroupInfo}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersTab
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            onSnoozeReminder={handleSnoozeReminder}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyTab
            profile={profile}
            onOpenEditProfile={() => setIsProfileModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 text-sm">LifeShield Health</span>
              <span className="text-slate-400">|</span>
              <span>Preventive Lifestyle &amp; Wellness Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              <span className="text-slate-500">
                Signed in as <strong className="text-slate-700">{authUser?.email}</strong>
              </span>
              <button
                id="btn-footer-logout"
                onClick={handleLogout}
                className="text-rose-600 hover:text-rose-700 font-bold transition-colors"
              >
                Sign out
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className="hover:text-teal-700 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('assessment')}
                className="hover:text-teal-700 transition-colors"
              >
                Health Assessment
              </button>
              <button
                onClick={() => setActiveTab('vaccines')}
                className="hover:text-teal-700 transition-colors"
              >
                Vaccine Tracker
              </button>
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Emergency QR ID
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              LifeShield is designed solely for educational wellness self-tracking. It does not provide medical diagnosis, treatment recommendations, or emergency response dispatch.
            </p>
            <p>Data saved in your browser and synced to the LifeShield API when available.</p>
          </div>
        </div>
      </footer>

      {/* Editable User Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleUpdateProfile}
        authUser={authUser}
        onLogout={handleLogout}
      />

      {/* Scannable Emergency Health Card Modal */}
      <EmergencyCardModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        profile={profile}
      />
    </div>
  );
}
