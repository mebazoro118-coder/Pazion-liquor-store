import React, { useState } from 'react';
import { useAgeVerification } from '../context/AgeVerificationContext';
import { ShieldAlert, Check, Wine } from 'lucide-react';

export const AgeVerificationModal: React.FC = () => {
  const { isAgeVerified, verifyAge, declineAge, legalAge, jurisdiction, updateJurisdictionSettings } =
    useAgeVerification();
  const [showConfig, setShowConfig] = useState(false);
  const [tempAge, setTempAge] = useState(legalAge);
  const [tempLoc, setTempLoc] = useState(jurisdiction);

  if (isAgeVerified) return null;

  return (
    <div
      id="age-verification-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md px-4"
    >
      <div
        id="age-verification-card"
        className="w-full max-w-lg bg-white border border-stone-200 shadow-2xl p-8 sm:p-10 text-center relative"
      >
        {/* Brand Monogram */}
        <div className="w-14 h-14 mx-auto mb-6 bg-stone-900 text-stone-100 flex items-center justify-center">
          <Wine className="w-7 h-7 stroke-[1.5]" />
        </div>

        <p className="text-[11px] uppercase tracking-[0.25em] font-medium text-stone-500 mb-2">
          Pazion Liquor Store
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4 tracking-tight">
          Verify Your Age to Enter
        </h2>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
          You must be of legal drinking age ({legalAge}+ in {jurisdiction}) to browse, order, and indulge in our curated spirits and fine wines collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            id="age-verify-accept-btn"
            onClick={verifyAge}
            className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 text-sm font-medium tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Yes, I Am {legalAge} or Older
          </button>
          <button
            id="age-verify-decline-btn"
            onClick={declineAge}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-medium tracking-wide uppercase transition-colors cursor-pointer"
          >
            Exit Store
          </button>
        </div>

        {/* Responsible Notice */}
        <div className="pt-4 border-t border-stone-100 text-[12px] text-stone-600 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-stone-500" />
          <span>Please enjoy our fine beverages responsibly. Valid ID required at delivery.</span>
        </div>

        {/* Jurisdiction Switcher Trigger */}
        <div className="mt-4">
          <button
            id="change-jurisdiction-toggle"
            onClick={() => setShowConfig(!showConfig)}
            className="text-[11px] text-stone-600 hover:text-stone-900 underline tracking-wider"
          >
            {showConfig ? 'Hide jurisdiction settings' : `Current jurisdiction: ${jurisdiction} (Change)`}
          </button>
        </div>

        {showConfig && (
          <div className="mt-4 p-4 bg-stone-50 border border-stone-200 text-left text-xs">
            <label className="block text-stone-700 font-medium mb-1">
              Select Jurisdiction & Legal Age
            </label>
            <div className="flex gap-2 mb-2">
              <select
                className="w-full bg-white border border-stone-300 p-2 text-stone-800"
                value={tempAge}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTempAge(val);
                  if (val === 21) setTempLoc('United States (21+)');
                  else if (val === 18) setTempLoc('UK / Europe / Australia (18+)');
                  else if (val === 19) setTempLoc('Canada (19+)');
                }}
              >
                <option value={21}>United States / Int’l (21+)</option>
                <option value={18}>UK / Europe / Australia / Int’l (18+)</option>
                <option value={19}>Canada / Regional (19+)</option>
              </select>
            </div>
            <button
              onClick={() => {
                updateJurisdictionSettings(tempAge, tempLoc);
                setShowConfig(false);
              }}
              className="px-3 py-1.5 bg-stone-800 text-white text-[11px] uppercase font-medium"
            >
              Update Jurisdiction
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
