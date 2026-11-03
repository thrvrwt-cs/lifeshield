import React, { useState } from 'react';
import { BloodGroup, Gender, UserProfile } from '../types';
import { getAgeGroup } from '../utils/healthCalculations';
import { AGE_GROUP_CONFIG } from '../data/initialData';
import { X, User, HeartPulse, Phone, AlertTriangle, Save, Sparkles, LogOut } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  authUser?: { name: string; email: string } | null;
  onLogout?: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const GENDERS: Gender[] = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const COMMON_ALLERGIES = ['Penicillin', 'Sulfa Drugs', 'Aspirin', 'Peanuts', 'Tree Nuts', 'Shellfish', 'Latex', 'Bee Stings'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  authUser,
  onLogout
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [allergyInput, setAllergyInput] = useState('');

  if (!isOpen) return null;

  const currentAgeGroupKey = getAgeGroup(Number(formData.age) || 0);
  const ageGroupInfo = AGE_GROUP_CONFIG[currentAgeGroupKey];

  const handleAddAllergy = (allergy: string) => {
    const trimmed = allergy.trim();
    if (trimmed && !formData.allergies.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, trimmed]
      }));
    }
    setAllergyInput('');
  };

  const handleRemoveAllergy = (allergyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergyToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      id="profile-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="profile-modal-content"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-xs">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Edit Health Profile</h2>
              <p className="text-xs text-teal-100">Updates sync in real-time across your wellness score, BMI &amp; emergency card</p>
            </div>
          </div>
          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Dynamic Age Group Indicator */}
          <div className="bg-teal-50/80 border border-teal-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-1.5 bg-teal-100 text-teal-700 rounded-lg flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-teal-950">Age-Based Persona:</span>
                <span className="bg-teal-600 text-white font-medium px-2 py-0.5 rounded-full text-[11px]">
                  {ageGroupInfo.label}
                </span>
              </div>
              <p className="text-teal-800 mt-1">{ageGroupInfo.tagline}</p>
            </div>
          </div>

          {/* Account & Session / Logout Section */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                {(authUser?.name || formData.name).charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{authUser?.name || formData.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Active Session
                  </span>
                </div>
                <p className="text-xs text-slate-500">{authUser?.email || 'Authenticated User'}</p>
              </div>
            </div>
            {onLogout && (
              <button
                id="btn-profile-logout"
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Log Out of LifeShield</span>
              </button>
            )}
          </div>

          {/* Core Personal Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              General Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  id="input-profile-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g. Alex Johnson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
                <input
                  id="input-profile-age"
                  type="number"
                  min="0"
                  max="120"
                  required
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  id="select-profile-gender"
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                >
                  {GENDERS.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  id="select-profile-bloodgroup"
                  value={formData.bloodGroup}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white font-medium text-red-600"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Biometrics for BMI */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
              Biometrics (For Automated BMI)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                <div className="relative">
                  <input
                    id="input-profile-height"
                    type="number"
                    min="40"
                    max="250"
                    step="0.5"
                    required
                    value={formData.heightCm}
                    onChange={e => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pr-12"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">cm</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Converted: {(formData.heightCm / 100).toFixed(2)} meters
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                <div className="relative">
                  <input
                    id="input-profile-weight"
                    type="number"
                    min="2"
                    max="300"
                    step="0.1"
                    required
                    value={formData.weightKg}
                    onChange={e => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pr-12"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">kg</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Formula: weight (kg) / [height (m)]²
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              Emergency Contact (Embedded in QR Card)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
                <input
                  id="input-profile-contact-name"
                  type="text"
                  required
                  value={formData.emergencyContactName}
                  onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g. Dr. Sarah Johnson"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  id="input-profile-contact-phone"
                  type="tel"
                  required
                  value={formData.emergencyContactPhone}
                  onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g. +1 (555) 234-5678"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship / Role</label>
                <input
                  id="input-profile-contact-relation"
                  type="text"
                  value={formData.emergencyContactRelation}
                  onChange={e => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g. Spouse / Primary Emergency Proxy"
                />
              </div>
            </div>
          </div>

          {/* Allergies & Emergency Notes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Allergies &amp; Important Medical Notes
            </h3>
            
            {/* Tag List */}
            <div className="mb-2.5 flex flex-wrap gap-2">
              {formData.allergies.map(allergy => (
                <span
                  key={allergy}
                  className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-md text-xs font-medium"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(allergy)}
                    className="text-rose-400 hover:text-rose-700"
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.allergies.length === 0 && (
                <span className="text-xs text-slate-400 italic">No known allergies logged</span>
              )}
            </div>

            {/* Quick Add */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={allergyInput}
                onChange={e => setAllergyInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAllergy(allergyInput);
                  }
                }}
                placeholder="Type allergy and press Add..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => handleAddAllergy(allergyInput)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                Add Allergy
              </button>
            </div>

            {/* Common Allergy Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="text-[11px] text-slate-400 mr-1">Quick Select:</span>
              {COMMON_ALLERGIES.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAddAllergy(item)}
                  disabled={formData.allergies.includes(item)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                    formData.allergies.includes(item)
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white hover:bg-rose-50 text-slate-600 border-slate-200 hover:border-rose-200'
                  }`}
                >
                  + {item}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Important Emergency / Medical Notes (Shown on Emergency QR Card)
              </label>
              <textarea
                id="textarea-profile-notes"
                rows={2}
                value={formData.medicalNotes}
                onChange={e => setFormData({ ...formData, medicalNotes: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g. Carries rescue inhaler, diabetic on insulin, pacemaker, organ donor..."
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-profile"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-save-profile"
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
