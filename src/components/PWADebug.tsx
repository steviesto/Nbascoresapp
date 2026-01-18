import { useState, useEffect } from 'react';

export function PWADebug() {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isStandaloneNav = (window.navigator as any).standalone === true;
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // Check service worker
    const checkSW = async () => {
      let swStatus = 'Not supported';
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        swStatus = registration ? 'Registered ✓' : 'Not registered ✗';
      }
      
      setInfo({
        isStandalone,
        isStandaloneNav,
        iOS,
        serviceWorker: swStatus,
        displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 
                     window.matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' :
                     window.matchMedia('(display-mode: minimal-ui)').matches ? 'minimal-ui' : 'browser',
        userAgent: navigator.userAgent,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
      });
    };
    
    checkSW();
  }, []);

  // Only show in development or when you add ?debug=1 to URL
  const showDebug = new URLSearchParams(window.location.search).get('debug') === '1';
  
  if (!showDebug) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10001] bg-yellow-500 text-black p-2 text-xs font-mono overflow-auto max-h-[200px]">
      <div><strong>PWA Debug Info:</strong></div>
      <div>Display Mode: {info.displayMode}</div>
      <div>Standalone (matchMedia): {String(info.isStandalone)}</div>
      <div>Standalone (navigator): {String(info.isStandaloneNav)}</div>
      <div>iOS: {String(info.iOS)}</div>
      <div>Service Worker: {info.serviceWorker}</div>
      <div>Viewport: {info.viewportWidth}x{info.viewportHeight}</div>
      <div className="truncate">UA: {info.userAgent}</div>
      <div className="mt-2">
        <a href="/pwa-check.html" className="underline font-bold">→ Full PWA Check</a>
      </div>
    </div>
  );
}