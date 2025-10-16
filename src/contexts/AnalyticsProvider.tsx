'use client';

import { createContext, ReactNode, useContext, useEffect } from 'react';
import { AnalyticsContextValue, useAnalytics } from '../hooks/use-analytics';
import { AdminDashboard } from '../components/AdminDashboard';

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

type AnalyticsProviderProps = {
  children: ReactNode;
};

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const analytics = useAnalytics();

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        analytics.promptAdminLogin();
      }
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        analytics.lockAdmin();
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [analytics]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
      {analytics.adminMode ? (
        <AdminDashboard
          stats={analytics.stats}
          onExport={analytics.exportStats}
          onReset={analytics.resetStats}
          onLock={analytics.lockAdmin}
        />
      ) : null}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
  }
  return ctx;
}
