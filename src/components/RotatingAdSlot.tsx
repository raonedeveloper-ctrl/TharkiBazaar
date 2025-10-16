'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdSlot } from './AdSlot';

type RotationItem = {
  key: string;
  width: number;
  height: number;
};

type RotatingAdSlotProps = {
  slotId: string;
  items: RotationItem[];
  interval?: number;
};

export function RotatingAdSlot({ slotId, items, interval = 30000 }: RotatingAdSlotProps) {
  const [index, setIndex] = useState(0);
  const configs = useMemo(() => items.filter(Boolean), [items]);

  useEffect(() => {
    if (configs.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % configs.length);
    }, interval);
    return () => clearInterval(timer);
  }, [configs.length, interval]);

  if (configs.length === 0) {
    return null;
  }

  const current = configs[index];

  return (
    <AdSlot
      key={`${slotId}-${current.key}`}
      slotId={slotId}
      type="highperformance"
      config={{ key: current.key, width: current.width, height: current.height }}
    />
  );
}
