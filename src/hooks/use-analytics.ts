'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'tharkiBazaar.analytics';
const ADMIN_SESSION_KEY = 'tharkiBazaar.admin';
const ADMIN_PASSWORD = 'Raone';

export type DownloadStats = Record<string, number>;
export type AdStats = Record<string, number>;

export type AnalyticsSnapshot = {
  visits: number;
  downloads: DownloadStats;
  outboundClicks: number;
  adImpressions: AdStats;
  adClicks: AdStats;
  updated?: string;
};

export type AnalyticsContextValue = {
  stats: AnalyticsSnapshot;
  adminMode: boolean;
  trackDownload: (id: string) => void;
  trackOutbound: (href: string) => void;
  trackAdImpression: (slotId: string) => void;
  trackAdClick: (slotId: string) => void;
  promptAdminLogin: () => boolean;
  lockAdmin: () => void;
  resetStats: () => void;
  exportStats: () => void;
};

const defaultStats: AnalyticsSnapshot = {
  visits: 0,
  downloads: {},
  outboundClicks: 0,
  adImpressions: {},
  adClicks: {},
};

function loadFromStorage(): AnalyticsSnapshot {
  if (typeof window === 'undefined') {
    return defaultStats;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultStats;
    }
    const parsed = JSON.parse(raw) as AnalyticsSnapshot;
    return { ...defaultStats, ...parsed };
  } catch (err) {
    console.warn('Failed to parse analytics snapshot', err);
    return defaultStats;
  }
}

function persist(stats: AnalyticsSnapshot) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn('Analytics persist error', err);
  }
}

export function useAnalytics(): AnalyticsContextValue {
  const [stats, setStats] = useState<AnalyticsSnapshot>(() => loadFromStorage());
  const [adminMode, setAdminMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
  });
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    setStats((prev) => {
      const next = loadFromStorage();
      const updated: AnalyticsSnapshot = {
        ...next,
        visits: (next.visits ?? 0) + 1,
        updated: new Date().toISOString(),
      };
      persist(updated);
      return updated;
    });
  }, []);

  const updateStats = useCallback((updater: (current: AnalyticsSnapshot) => AnalyticsSnapshot) => {
    setStats((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const trackDownload = useCallback(
    (id: string) => {
      updateStats((current) => {
        const downloads = { ...current.downloads };
        downloads[id] = (downloads[id] ?? 0) + 1;
        return {
          ...current,
          downloads,
          updated: new Date().toISOString(),
        };
      });
    },
    [updateStats],
  );

  const trackOutbound = useCallback(
    (_href: string) => {
      updateStats((current) => ({
        ...current,
        outboundClicks: (current.outboundClicks ?? 0) + 1,
        updated: new Date().toISOString(),
      }));
    },
    [updateStats],
  );

  const trackAdImpression = useCallback(
    (slotId: string) => {
      updateStats((current) => {
        const adImpressions = { ...current.adImpressions };
        adImpressions[slotId] = (adImpressions[slotId] ?? 0) + 1;
        return {
          ...current,
          adImpressions,
          updated: new Date().toISOString(),
        };
      });
    },
    [updateStats],
  );

  const trackAdClick = useCallback(
    (slotId: string) => {
      updateStats((current) => {
        const adClicks = { ...current.adClicks };
        adClicks[slotId] = (adClicks[slotId] ?? 0) + 1;
        return {
          ...current,
          adClicks,
          updated: new Date().toISOString(),
        };
      });
    },
    [updateStats],
  );

  const promptAdminLogin = useCallback((): boolean => {
    if (adminMode) return true;
    if (typeof window === 'undefined') return false;
    const passphrase = window.prompt('Enter admin passphrase:');
    if (!passphrase) return false;
    if (passphrase === ADMIN_PASSWORD) {
      setAdminMode(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
      return true;
    }
    window.alert('Incorrect passphrase.');
    return false;
  }, [adminMode]);

  const lockAdmin = useCallback(() => {
    setAdminMode(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, []);

  const resetStats = useCallback(() => {
    const reset: AnalyticsSnapshot = {
      ...defaultStats,
      visits: 0,
      updated: new Date().toISOString(),
    };
    persist(reset);
    setStats(reset);
  }, []);

  const exportStats = useCallback(() => {
    if (typeof window === 'undefined') return;
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'tharkibazaar-stats.json';
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      anchor.remove();
      URL.revokeObjectURL(url);
    }, 0);
  }, [stats]);

  return useMemo(
    () => ({
      stats,
      adminMode,
      trackDownload,
      trackOutbound,
      trackAdImpression,
      trackAdClick,
      promptAdminLogin,
      lockAdmin,
      resetStats,
      exportStats,
    }),
    [
      stats,
      adminMode,
      trackDownload,
      trackOutbound,
      trackAdImpression,
      trackAdClick,
      promptAdminLogin,
      lockAdmin,
      resetStats,
      exportStats,
    ],
  );
}
