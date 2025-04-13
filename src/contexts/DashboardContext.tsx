
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserLevel } from '@/types/user';

/**
 * Interfaccia per gli stati condivisi tra componenti della dashboard
 */
interface DashboardContextState {
  userLevel: UserLevel | null;
  totalInvestment: number;
  portfolioAllocation: any[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

/**
 * Interfaccia per il contesto della dashboard
 */
interface DashboardContextValue {
  state: DashboardContextState;
  setUserLevel: (level: UserLevel | null) => void;
  setTotalInvestment: (amount: number) => void;
  setPortfolioAllocation: (data: any[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (hasError: boolean, message?: string) => void;
  clearError: () => void;
}

// Stato iniziale del contesto
const initialState: DashboardContextState = {
  userLevel: null,
  totalInvestment: 0,
  portfolioAllocation: [],
  isLoading: false,
  hasError: false,
  errorMessage: null
};

// Creazione del contesto
const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

/**
 * Provider del contesto della dashboard
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardContextState>(initialState);

  // Funzioni per aggiornare lo stato
  const setUserLevel = (level: UserLevel | null) => {
    setState(prev => ({ ...prev, userLevel: level }));
  };

  const setTotalInvestment = (amount: number) => {
    setState(prev => ({ ...prev, totalInvestment: amount }));
  };

  const setPortfolioAllocation = (data: any[]) => {
    setState(prev => ({ ...prev, portfolioAllocation: data }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setError = (hasError: boolean, message?: string) => {
    setState(prev => ({ 
      ...prev, 
      hasError, 
      errorMessage: message || null 
    }));
  };

  const clearError = () => {
    setState(prev => ({ 
      ...prev, 
      hasError: false, 
      errorMessage: null 
    }));
  };

  // Valore del contesto da passare ai componenti figli
  const value: DashboardContextValue = {
    state,
    setUserLevel,
    setTotalInvestment,
    setPortfolioAllocation,
    setLoading,
    setError,
    clearError
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

/**
 * Hook per utilizzare il contesto della dashboard
 */
export function useDashboard() {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
}
