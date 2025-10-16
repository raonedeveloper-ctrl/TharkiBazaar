'use client';

import { useEffect, useRef } from 'react';
import { useAnalyticsContext } from '../contexts/AnalyticsProvider';

type HighPerformanceConfig = {
  key: string;
  width: number;
  height: number;
};

type NativeConfig = {
  scriptSrc: string;
  containerId: string;
};

type AdSlotProps =
  | {
      slotId: string;
      type: 'highperformance';
      config: HighPerformanceConfig;
    }
  | {
      slotId: string;
      type: 'native';
      config: NativeConfig;
    };

export function AdSlot(props: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const impressionTracked = useRef(false);
  const { trackAdImpression, trackAdClick } = useAnalyticsContext();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = '';

    const dispose: Array<() => void> = [];

    if (props.type === 'highperformance') {
      const { width, height, key } = props.config;
      const iframe = document.createElement('iframe');
      iframe.width = String(width);
      iframe.height = String(height);
      iframe.style.width = '100%';
      iframe.style.maxWidth = `${width}px`;
      iframe.style.border = '0';
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('title', `Advertisement ${props.slotId}`);
      el.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`<!doctype html>
<html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent;}</style></head>
<body>
<script>var atOptions={key:"${key}",format:"iframe",height:${height},width:${width},params:{}};</script>
<script src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
</body></html>`);
        doc.close();
      }
    } else {
      const wrapper = document.createElement('div');
      wrapper.id = props.config.containerId;
      el.appendChild(wrapper);

      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = props.config.scriptSrc;
      el.appendChild(script);

      dispose.push(() => {
        script.remove();
      });
    }

    const handleClick = () => trackAdClick(props.slotId);
    el.addEventListener('click', handleClick, { passive: true });
    dispose.push(() => el.removeEventListener('click', handleClick));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !impressionTracked.current) {
            impressionTracked.current = true;
            trackAdImpression(props.slotId);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '0px', threshold: 0.15 },
    );
    observer.observe(el);
    dispose.push(() => observer.disconnect());

    return () => {
      dispose.forEach((fn) => fn());
      el.innerHTML = '';
      impressionTracked.current = false;
    };
  }, [
    props.slotId,
    props.type,
    props.type === 'highperformance' ? props.config.key : undefined,
    props.type === 'highperformance' ? props.config.height : undefined,
    props.type === 'highperformance' ? props.config.width : undefined,
    props.type === 'native' ? props.config.scriptSrc : undefined,
    props.type === 'native' ? props.config.containerId : undefined,
    trackAdClick,
    trackAdImpression,
  ]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-[60px] items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40"
      data-ad-slot={props.slotId}
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Loading Ad…</span>
    </div>
  );
}
