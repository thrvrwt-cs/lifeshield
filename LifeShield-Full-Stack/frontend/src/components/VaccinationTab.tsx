import React, { useState } from 'react';
import { AgeGroupInfo, VaccineRecord, VaccineStatus } from '../types';
import { calculateVaccineStatus } from '../utils/healthCalculations';
import {
  Syringe,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  X,
  Trash2,
  Sparkles,
  Search,
  Check
} from 'lucide-react';

interface VaccinationTabProps {
  vaccines: VaccineRecord[];
  onAddVaccine: (vaccine: VaccineRecord) => void;
  onUpdateVaccine: (vaccine: VaccineRecord) => void;
  onDeleteVaccine: (id: string) => void;
  ageGroupInfo: AgeGroupInfo;
}

type VaccineFilter = 'all' | 'upcoming' | 'overdue' | 'completed';

export const VaccinationTab: React.FC<VaccinationTabProps> = ({
  vaccines,
  onAddVaccine,
  onUpdateVaccine,
  onDeleteVaccine,
  ageGroupInfo
}) => {
  const [filter, setFilter] = useState<VaccineFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Vaccine Form State
  const [newVacName, setNewVacName] = useState('');
  const [newVacTarget, setNewVacTarget] = useState('');
  const [newVacDate, setNewVacDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [newVacDose, setNewVacDose] = useState('Dose 1');
  const [newVacNotes, setNewVacNotes] = useState('');

  // Status computation for all items
  const processedVaccines = vaccines.map(vac => ({
    ...vac,
    status: calculateVaccineStatus(vac.dueDate, vac.completed)
  }));

  const upcomingCount = processedVaccines.filter(v => v.status === 'upcoming').length;
  const overdueCount = processedVaccines.filter(v => v.status === 'overdue').length;
  const completedCount = processedVaccines.filter(v => v.status === 'completed').length;

  const filteredVaccines = processedVaccines.filter(vac => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'upcoming'
        ? vac.status === 'upcoming'
        : filter === 'overdue'
        ? vac.status === 'overdue'
        : vac.status === 'completed';

    const matchesSearch =
      vac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vac.targetDisease.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleToggleCompleted = (vac: VaccineRecord) => {
    const updated: VaccineRecord = {
      ...vac,
      completed: !vac.completed,
      completedDate: !vac.completed ? new Date().toISOString().split('T')[0] : undefined
    };
    onUpdateVaccine(updated);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacName.trim() || !newVacDate) return;

    const record: VaccineRecord = {
      id: `vac-${Date.now()}`,
      name: newVacName.trim(),
      targetDisease: newVacTarget.trim() || 'General Immunization',
      dueDate: newVacDate,
      completed: false,
      doseNumber: newVacDose.trim() || 'Annual / Booster',
      notes: newVacNotes.trim()
    };

    onAddVaccine(record);
    setIsAddModalOpen(false);
    setNewVacName('');
    setNewVacTarget('');
    setNewVacNotes('');
  };

  const handleQuickAddRecommended = (recName: string) => {
    const record: VaccineRecord = {
      id: `vac-${Date.now()}`,
      name: recName,
      targetDisease: `Recommended Immunization for ${ageGroupInfo.label}`,
      dueDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      completed: false,
      doseNumber: 'Routine Booster'
    };
    onAddVaccine(record);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <Syringe className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Vaccination &amp; Immunization Tracker</h1>
          </div>
          <p className="text-xs text-slate-500">
            Automated status tracking (Upcoming, Overdue, Completed) calculated against the current calendar date.
          </p>
        </div>

        <button
          id="btn-open-add-vaccine"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Vaccine Record
        </button>
      </div>

      {/* Age Group Recommendations Box */}
      <div className="bg-gradient-to-r from-rose-50/80 via-white to-teal-50/60 p-4.5 rounded-2xl border border-rose-200/80 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Clinical Guidelines for {ageGroupInfo.label}
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Click to schedule 1-click:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {ageGroupInfo.recommendedVaccines.map((v, i) => (
            <button
              key={i}
              onClick={() => handleQuickAddRecommended(v)}
              className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 font-medium transition-colors shadow-2xs"
            >
              <Plus className="w-3 h-3 text-rose-600" />
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Status Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Records', count: processedVaccines.length, color: 'bg-slate-800 text-white' },
            { id: 'upcoming', label: 'Upcoming', count: upcomingCount, color: 'bg-blue-600 text-white' },
            { id: 'overdue', label: 'Overdue', count: overdueCount, color: 'bg-rose-600 text-white' },
            { id: 'completed', label: 'Completed', count: completedCount, color: 'bg-emerald-600 text-white' }
          ].map(tab => (
            <button
              key={tab.id}
              id={`btn-vac-filter-${tab.id}`}
              onClick={() => setFilter(tab.id as VaccineFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === tab.id
                  ? `${tab.color} shadow-xs`
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filter === tab.id ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search vaccine name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>
      </div>

      {/* Vaccines List */}
      <div className="space-y-3">
        {filteredVaccines.length > 0 ? (
          filteredVaccines.map(vac => {
            const isCompleted = vac.status === 'completed';
            const isOverdue = vac.status === 'overdue';

            return (
              <div
                key={vac.id}
                className={`p-4 rounded-xl border bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
                  isOverdue
                    ? 'border-rose-300 bg-rose-50/20'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/15'
                    : 'border-slate-200 hover:border-teal-200'
                }`}
              >
                {/* Left details */}
                <div className="flex items-start gap-3.5">
                  <button
                    id={`btn-vac-toggle-${vac.id}`}
                    onClick={() => handleToggleCompleted(vac)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border-2 border-slate-300 hover:border-emerald-500 text-transparent hover:text-emerald-500 bg-white'
                    }`}
                    title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {vac.name}
                      </h3>
                      {vac.doseNumber && (
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {vac.doseNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{vac.targetDisease}</p>
                    {vac.notes && <p className="text-[11px] text-slate-400 italic mt-0.5">{vac.notes}</p>}
                  </div>
                </div>

                {/* Right status & actions */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isOverdue
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </>
                      ) : isOverdue ? (
                        <>
                          <AlertCircle className="w-3 h-3" /> Overdue
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Upcoming
                        </>
                      )}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      {isCompleted && vac.completedDate
                        ? `Administered: ${vac.completedDate}`
                        : `Due: ${vac.dueDate}`}
                    </span>
                  </div>

                  <button
                    id={`btn-delete-vac-${vac.id}`}
                    onClick={() => onDeleteVaccine(vac.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-2">
            <Syringe className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No vaccines match the current filter.</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-teal-600 hover:underline font-semibold"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Add Vaccine Modal */}
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
                <div className="p-1.5 bg-rose-50 text-rose-700 rounded-lg">
                  <Syringe className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Vaccine Record</h3>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vaccine Name</label>
                <input
                  type="text"
                  required
                  value={newVacName}
                  onChange={e => setNewVacName(e.target.value)}
                  placeholder="e.g. Tdap Booster, Annual Flu, Shingrix"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Disease / Indication</label>
                <input
                  type="text"
                  value={newVacTarget}
                  onChange={e => setNewVacTarget(e.target.value)}
                  placeholder="e.g. Tetanus, Diphtheria, Pertussis"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newVacDate}
                    onChange={e => setNewVacDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dose / Schedule</label>
                  <input
                    type="text"
                    value={newVacDose}
                    onChange={e => setNewVacDose(e.target.value)}
                    placeholder="e.g. Dose 1, Booster"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Clinic Location</label>
                <input
                  type="text"
                  value={newVacNotes}
                  onChange={e => setNewVacNotes(e.target.value)}
                  placeholder="e.g. Scheduled at Community Health Center"
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
                  Save Vaccine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
