import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import QRCode from 'qrcode';
import {
  ShieldAlert,
  QrCode,
  Heart,
  Phone,
  User,
  AlertOctagon,
  Download,
  Printer,
  RefreshCw,
  CheckCircle2,
  Edit3
} from 'lucide-react';

interface EmergencyTabProps {
  profile: UserProfile;
  onOpenEditProfile: () => void;
}

export const EmergencyTab: React.FC<EmergencyTabProps> = ({ profile, onOpenEditProfile }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string>('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const generateEmergencyPayload = (): string => {
    const allergiesText = profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None Reported';
    return [
      '=== LIFESHIELD EMERGENCY HEALTH CARD ===',
      `NAME: ${profile.name}`,
      `BLOOD GROUP: ${profile.bloodGroup}`,
      `ALLERGIES: ${allergiesText}`,
      `EMERGENCY CONTACT: ${profile.emergencyContactName} (${profile.emergencyContactRelation || 'Emergency Contact'})`,
      `CONTACT PHONE: ${profile.emergencyContactPhone}`,
      `CRITICAL NOTES: ${profile.medicalNotes || 'No chronic medical alerts noted.'}`,
      `UPDATED: ${new Date().toLocaleDateString()}`
    ].join('\n');
  };

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    try {
      const payload = generateEmergencyPayload();
      const url = await QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'M',
        margin: 2,
        scale: 8,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
      setLastGeneratedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to generate QR code', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerateQR();
  }, [profile]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `LifeShield_Emergency_QR_${profile.name.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const payload = generateEmergencyPayload();
    navigator.clipboard.writeText(payload);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-red-50 text-red-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Emergency Health Card &amp; QR Identifier</h1>
          </div>
          <p className="text-xs text-slate-500">
            Rapid triage emergency information formatted for first responders, paramedics, and ER staff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-tab-edit-profile"
            onClick={onOpenEditProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Emergency Info
          </button>
        </div>
      </div>

      {/* Primary Emergency Card Container */}
      <div className="bg-white rounded-2xl border-2 border-red-300 shadow-md overflow-hidden">
        {/* Top Emergency Red Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-red-600 flex items-center justify-center font-black text-xl shadow-xs">
              +
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-red-100 block leading-none">
                LIFESHIELD EMERGENCY RESCUE CARD
              </span>
              <span className="text-sm font-bold text-white">Critical Medical &amp; Allergen Identity</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-black self-start sm:self-auto">
            <Heart className="w-4 h-4 fill-current text-white" />
            <span>BLOOD TYPE: {profile.bloodGroup}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Information Fields (8 cols) */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
                <span className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-red-600" />
                  {profile.name}
                </span>
                <span className="text-xs text-slate-500">
                  {profile.age} years old • {profile.gender}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Height &amp; Weight</span>
                <span className="text-sm font-bold text-slate-800">
                  {profile.heightCm} cm • {profile.weightKg} kg
                </span>
                <span className="text-[11px] text-slate-500 block">
                  BMI: {(profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <span className="text-[11px] uppercase font-black text-rose-700 block mb-1.5 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                Documented Allergies &amp; Contraindications:
              </span>
              {profile.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.allergies.map(a => (
                    <span
                      key={a}
                      className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2.5 py-1 rounded-md text-xs shadow-2xs"
                    >
                      ⚠️ {a}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic">No drug, environmental, or food allergies reported.</span>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="p-3.5 bg-red-50/70 border border-red-200/80 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-red-900 block mb-1">
                Primary Emergency Proxy Contact
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">{profile.emergencyContactName}</p>
                  <p className="text-xs text-slate-600">{profile.emergencyContactRelation || 'Designated Contact'}</p>
                </div>
                <a
                  href={`tel:${profile.emergencyContactPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call: {profile.emergencyContactPhone}
                </a>
              </div>
            </div>

            {/* Medical Notes */}
            {profile.medicalNotes && (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950">
                <span className="text-[10px] uppercase font-bold text-amber-900 block mb-0.5">
                  Critical Medical Alerts &amp; Directives
                </span>
                <p className="font-medium leading-relaxed">{profile.medicalNotes}</p>
              </div>
            )}
          </div>

          {/* Real Scannable QR Code (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="LifeShield Emergency QR Code"
                className="w-44 h-44 object-contain rounded-lg shadow-xs bg-white p-1"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center bg-white text-slate-400 text-xs rounded-lg">
                Generating QR...
              </div>
            )}
            <div className="text-center mt-3">
              <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-red-600" />
                Scan With Any Camera
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">Instant offline text rescue payload</p>
              {lastGeneratedAt && (
                <span className="text-[9px] text-slate-400 block mt-1">Generated at {lastGeneratedAt}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            id="btn-tab-update-qr"
            onClick={handleGenerateQR}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            Generate / Update QR Code
          </button>

          <div className="flex items-center gap-2">
            <button
              id="btn-tab-copy-emergency-info"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            >
              {copiedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Copied Text
                </>
              ) : (
                <>Copy Summary</>
              )}
            </button>

            <button
              id="btn-tab-download-qr-image"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download QR Image
            </button>

            <button
              id="btn-tab-print-emergency-card"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
