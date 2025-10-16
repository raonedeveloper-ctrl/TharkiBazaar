'use client';

import { ReactNode, useEffect, useRef } from 'react';

const POPUNDER_SRC = 'https://pl27733128.revenuecpmgate.com/aa/5f/65/aa5f65bd170576514aff7ed9f749c09c.js';

type PopunderAdProps = {
  children: ReactNode;
};

export function PopunderAd({ children }: PopunderAdProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;

    function injectScript() {
      if (firedRef.current) return;
      firedRef.current = true;
      const script = document.createElement('script');
      script.src = POPUNDER_SRC;
      script.async = true;
      document.body.appendChild(script);
      window.removeEventListener('click', injectScript);
      window.removeEventListener('scroll', injectScript);
    }

    window.addEventListener('click', injectScript, { once: true });
    window.addEventListener('scroll', injectScript, { once: true });

    return () => {
      window.removeEventListener('click', injectScript);
      window.removeEventListener('scroll', injectScript);
    };
  }, []);

  return <>{children}</>;
}
