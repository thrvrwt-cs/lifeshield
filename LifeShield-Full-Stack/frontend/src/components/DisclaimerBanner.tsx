import React, { useState } from 'react';
import { ShieldAlert, X, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>LifeShield is a preventive wellness platform — not medical diagnosis or clinical care.</span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="underline font-medium hover:text-amber-900 transition-colors ml-2"
        >
          View Notice
        </button>
      </div>
    );
  }

  return (
    <aside
      id="preventive-disclaimer-banner"
      aria-label="Preventive Health Notice"
      className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1 bg-amber-100 rounded text-amber-700 flex-shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-amber-950">Preventive Wellness Notice: </span>
            <span className="text-amber-800">
              LifeShield is an educational lifestyle tracking and preventive health platform. It does
              <strong> not</strong> diagnose medical conditions, prescribe medication, or replace a licensed physician.
              In case of a medical emergency, immediately contact your local emergency helpline (e.g. 911 / 112).
            </span>
          </div>
        </div>
        <button
          id="btn-dismiss-disclaimer"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss disclaimer banner"
          className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-100 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
