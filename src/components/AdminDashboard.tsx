'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AnalyticsSnapshot } from '../hooks/use-analytics';
import { Download, LogOut, RotateCcw } from 'lucide-react';

type AdminDashboardProps = {
  stats: AnalyticsSnapshot;
  onExport: () => void;
  onReset: () => void;
  onLock: () => void;
};

function renderMetric(label: string, value: number | string) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard({ stats, onExport, onReset, onLock }: AdminDashboardProps) {
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-5xl rounded-2xl border border-primary/20 bg-background/95 p-4 shadow-2xl backdrop-blur">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-wide">Admin Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Stats are stored locally in this browser session. Use export to backup before reset.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Stats
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Stats
            </Button>
            <Button variant="destructive" size="sm" onClick={onLock}>
              <LogOut className="mr-2 h-4 w-4" />
              Exit Admin
            </Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {renderMetric('Visits', stats.visits ?? 0)}
          {renderMetric('Downloads', Object.values(stats.downloads ?? {}).reduce((sum, count) => sum + count, 0))}
          {renderMetric('Outbound Clicks', stats.outboundClicks ?? 0)}
          {renderMetric(
            'Ad Impressions',
            Object.values(stats.adImpressions ?? {}).reduce((sum, count) => sum + count, 0),
          )}
          {renderMetric('Ad Clicks', Object.values(stats.adClicks ?? {}).reduce((sum, count) => sum + count, 0))}
          {renderMetric('Last Update', stats.updated ? new Date(stats.updated).toLocaleString() : '—')}
        </div>
      </div>
    </div>
  );
}
