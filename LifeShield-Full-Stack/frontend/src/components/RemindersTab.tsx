import React, { useState } from 'react';
import { ReminderCategory, ReminderItem } from '../types';
import {
  Bell,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Syringe,
  Activity,
  HeartPulse,
  Trash2,
  X,
  RotateCw,
  Sparkles,
  Check
} from 'lucide-react';

interface RemindersTabProps {
  reminders: ReminderItem[];
  onAddReminder: (reminder: ReminderItem) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onSnoozeReminder: (id: string, days: number) => void;
}

export const RemindersTab: React.FC<RemindersTabProps> = ({
  reminders,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  onSnoozeReminder
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | ReminderCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Reminder Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ReminderCategory>('wellness');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newNotes, setNewNotes] = useState('');

  const filteredReminders = reminders.filter(r => {
    if (filterCategory === 'all') return true;
    return r.category === filterCategory;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const item: ReminderItem = {
      id: `rem-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      date: newDate,
      time: newTime,
      completed: false,
      notes: newNotes.trim()
    };

    onAddReminder(item);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewNotes('');
  };

  const handleAddPreset = (title: string, category: ReminderCategory, daysAhead = 1, time = '09:00 AM') => {
    const futureDate = new Date(Date.now() + daysAhead * 86400000).toISOString().split('T')[0];
    const item: ReminderItem = {
      id: `rem-${Date.now()}`,
      title,
      category,
      date: futureDate,
      time,
      completed: false
    };
    onAddReminder(item);
  };

  const getCategoryIcon = (category: ReminderCategory) => {
    switch (category) {
      case 'vaccination':
        return <Syringe className="w-4 h-4 text-rose-600" />;
      case 'checkup':
        return <HeartPulse className="w-4 h-4 text-teal-600" />;
      case 'wellness':
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getCategoryColor = (category: ReminderCategory) => {
    switch (category) {
      case 'vaccination':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'checkup':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'wellness':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Preventive Health &amp; Wellness Reminders</h1>
          </div>
          <p className="text-xs text-slate-500">
            Schedule vaccination alerts, routine physician check-ups, and daily hydration/movement prompts.
          </p>
        </div>

        <button
          id="btn-open-add-reminder"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Reminder
        </button>
      </div>

      {/* Quick Reminder Presets */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          1-Click Preventive Reminder Templates:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAddPreset('Midday Hydration & Posture Reset (500ml)', 'wellness', 0, '01:00 PM')}
            className="text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
          >
            + Hydration Break Today (1:00 PM)
          </button>
          <button
            onClick={() => handleAddPreset('Annual Preventive Physical & Fasting Blood Panel', 'checkup', 14, '08:30 AM')}
            className="text-xs bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
          >
            + Annual Check-up in 2 Weeks
          </button>
          <button
            onClick={() => handleAddPreset('Seasonal Influenza Immunization', 'vaccination', 30, '10:00 AM')}
            className="text-xs bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
          >
            + Seasonal Flu Shot Next Month
          </button>
          <button
            onClick={() => handleAddPreset('Brisk 30-min Evening Cardio Walk', 'wellness', 0, '06:00 PM')}
            className="text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
          >
            + Evening Cardio Today (6:00 PM)
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'All Categories' },
          { id: 'vaccination', label: 'Vaccinations' },
          { id: 'checkup', label: 'Health Check-ups' },
          { id: 'wellness', label: 'Daily Wellness' }
        ].map(tab => (
          <button
            key={tab.id}
            id={`btn-rem-filter-${tab.id}`}
            onClick={() => setFilterCategory(tab.id as 'all' | ReminderCategory)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterCategory === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length > 0 ? (
          filteredReminders.map(rem => (
            <div
              key={rem.id}
              className={`p-4 rounded-xl border bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
                rem.completed ? 'border-slate-200 bg-slate-50/50 opacity-70' : 'border-slate-200 hover:border-teal-200'
              }`}
            >
              {/* Left details */}
              <div className="flex items-start gap-3.5">
                <button
                  id={`btn-rem-toggle-${rem.id}`}
                  onClick={() => onToggleReminder(rem.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    rem.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 hover:border-teal-600 text-transparent hover:text-teal-600 bg-white'
                  }`}
                  title={rem.completed ? 'Mark pending' : 'Mark completed'}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${rem.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {rem.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${getCategoryColor(
                        rem.category
                      )}`}
                    >
                      {rem.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {rem.date}
                    </span>
                    {rem.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {rem.time}
                      </span>
                    )}
                  </div>

                  {rem.notes && <p className="text-[11px] text-slate-400 mt-0.5">{rem.notes}</p>}
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {!rem.completed && (
                  <button
                    id={`btn-snooze-${rem.id}`}
                    onClick={() => onSnoozeReminder(rem.id, 1)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Snooze +1 Day"
                  >
                    <RotateCw className="w-3 h-3" />
                    +1 Day
                  </button>
                )}

                <button
                  id={`btn-delete-rem-${rem.id}`}
                  onClick={() => onDeleteReminder(rem.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No reminders found in this category.</p>
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Create New Reminder</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Schedule Lipid Panel, Hydration Check..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as ReminderCategory)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="wellness">Daily Wellness (Water, Sleep, Exercise)</option>
                  <option value="checkup">Health Check-up (Physical, Blood, Vision)</option>
                  <option value="vaccination">Vaccination (Booster, Immunization)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    placeholder="e.g. 09:30 AM"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preparation / Clinic Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="e.g. Fast 10 hours prior, bring ID card"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
