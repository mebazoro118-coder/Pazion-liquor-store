import React, { createContext, useContext, useEffect, useState } from 'react';
import { safeLocalStorage } from '../lib/storage';

interface AgeVerificationContextType {
  isAgeVerified: boolean;
  legalAge: number;
  jurisdiction: string;
  verifyAge: () => void;
  declineAge: () => void;
  resetVerification: () => void;
  updateJurisdictionSettings: (age: number, location: string) => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

export const AgeVerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    return safeLocalStorage.getItem('pazion_age_verified') === 'true';
  });
  const [legalAge, setLegalAge] = useState<number>(() => {
    const saved = safeLocalStorage.getItem('pazion_legal_age');
    return saved ? parseInt(saved, 10) : 21; // standard default
  });
  const [jurisdiction, setJurisdiction] = useState<string>(() => {
    return safeLocalStorage.getItem('pazion_jurisdiction') || 'United States (21+)';
  });

  const verifyAge = () => {
    safeLocalStorage.setItem('pazion_age_verified', 'true');
    setIsAgeVerified(true);
  };

  const declineAge = () => {
    safeLocalStorage.removeItem('pazion_age_verified');
    setIsAgeVerified(false);
    try {
      window.location.href = 'https://www.responsibility.org/';
    } catch (e) {
      // safe fallback in iframe
    }
  };

  const resetVerification = () => {
    safeLocalStorage.removeItem('pazion_age_verified');
    setIsAgeVerified(false);
  };

  const updateJurisdictionSettings = (age: number, location: string) => {
    setLegalAge(age);
    setJurisdiction(location);
    safeLocalStorage.setItem('pazion_legal_age', age.toString());
    safeLocalStorage.setItem('pazion_jurisdiction', location);
  };

  return (
    <AgeVerificationContext.Provider
      value={{
        isAgeVerified,
        legalAge,
        jurisdiction,
        verifyAge,
        declineAge,
        resetVerification,
        updateJurisdictionSettings,
      }}
    >
      {children}
    </AgeVerificationContext.Provider>
  );
};

export const useAgeVerification = () => {
  const ctx = useContext(AgeVerificationContext);
  if (!ctx) throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  return ctx;
};
