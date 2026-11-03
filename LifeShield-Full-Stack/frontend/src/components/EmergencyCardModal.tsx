import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import QRCode from 'qrcode';
import { X, QrCode, ShieldAlert, Phone, Heart, Download, Printer, RefreshCw, CheckCircle2, User, AlertOctagon } from 'lucide-react';

interface EmergencyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const EmergencyCardModal: React.FC<EmergencyCardModalProps> = ({ isOpen, onClose, profile }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string>('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Format emergency payload containing ONLY emergency information
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
    if (isOpen) {
      handleGenerateQR();
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

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
    <div
      id="emergency-card-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="emergency-card-modal-content"
        className="bg-white rounded-2xl shadow-2xl border border-red-200 max-w-xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with High-Visibility Emergency Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                Emergency Health ID Card
              </h2>
              <p className="text-xs text-red-100">For first responders, triage nurses, &amp; medical emergencies</p>
            </div>
          </div>
          <button
            id="btn-close-emergency-modal"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable/Scannable Card Container */}
        <div className="p-6 space-y-6">
          {/* Card Visual Badge */}
          <div
            id="printable-emergency-card"
            className="border-2 border-red-300 rounded-2xl p-5 bg-gradient-to-br from-rose-50/70 via-white to-red-50/30 relative overflow-hidden shadow-sm"
          >
            {/* Top Red Cross Ribbon */}
            <div className="flex items-center justify-between border-b border-red-200 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-red-600 text-white rounded-lg flex items-center justify-center font-black text-sm">
                  +
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-red-900 block leading-none">
                    LIFESHIELD EMERGENCY CARD
                  </span>
                  <span className="text-[10px] text-red-600">Scannable Medical Rescue Information</span>
                </div>
              </div>

              {/* Big Blood Group Badge */}
              <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>BLOOD {profile.bloodGroup}</span>
              </div>
            </div>

            {/* Split: Information & QR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
              {/* Emergency Text Details (2 cols) */}
              <div className="sm:col-span-2 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
                  <span className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-red-600" />
                    {profile.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Age: {profile.age} • Gender: {profile.gender}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Known Allergies</span>
                  {profile.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.allergies.map(a => (
                        <span
                          key={a}
                          className="bg-red-100/80 text-red-800 font-semibold px-2 py-0.5 rounded text-[11px] border border-red-200 flex items-center gap-1"
                        >
                          <AlertOctagon className="w-3 h-3 text-red-600" />
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-600 font-medium text-xs">No known drug or food allergies</span>
                  )}
                </div>

                <div className="pt-1 border-t border-red-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Emergency Contact</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <div>
                      <p className="font-semibold text-slate-800">{profile.emergencyContactName}</p>
                      <p className="text-[11px] text-slate-500">{profile.emergencyContactRelation || 'Primary Contact'}</p>
                    </div>
                    <a
                      href={`tel:${profile.emergencyContactPhone}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      {profile.emergencyContactPhone}
                    </a>
                  </div>
                </div>

                {profile.medicalNotes && (
                  <div className="pt-1 border-t border-red-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Critical Medical Notes</span>
                    <p className="text-[11px] text-slate-700 leading-snug font-medium mt-0.5 bg-amber-50/70 p-1.5 rounded border border-amber-200/60">
                      {profile.medicalNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Real Scannable QR Code (1 col) */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-inner">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="LifeShield Emergency Health QR Code"
                    className="w-36 h-36 object-contain rounded"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center bg-slate-100 text-slate-400 text-xs text-center p-2 rounded">
                    Generating QR...
                  </div>
                )}
                <span className="text-[10px] font-semibold text-slate-500 mt-2 flex items-center gap-1 text-center">
                  <QrCode className="w-3 h-3 text-red-600" />
                  Scan with any phone
                </span>
                {lastGeneratedAt && (
                  <span className="text-[9px] text-slate-400">Updated {lastGeneratedAt}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              id="btn-update-qr"
              onClick={handleGenerateQR}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate / Update QR Code
            </button>

            <div className="flex items-center gap-2">
              <button
                id="btn-copy-emergency-info"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                {copiedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>Copy Text Summary</>
                )}
              </button>

              <button
                id="btn-download-qr-image"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download QR
              </button>

              <button
                id="btn-print-emergency-card"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
