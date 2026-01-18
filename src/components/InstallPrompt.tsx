import { useState, useEffect } from 'react';
import { X, Share } from 'lucide-react';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Check if running in standalone mode (PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    // Check if user has dismissed the prompt before
    const hasSeenPrompt = localStorage.getItem('installPromptDismissed') === 'true';
    
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Debug info
    setDebugInfo(`Standalone: ${isStandalone}, iOS: ${iOS}, Dismissed: ${hasSeenPrompt}`);
    console.log('PWA Debug:', { isStandalone, iOS, hasSeenPrompt });
    
    // Only show prompt if not in standalone mode, user hasn't dismissed it, and on iOS
    if (!isStandalone && !hasSeenPrompt && iOS) {
      // Show after a short delay
      setTimeout(() => setShowPrompt(true), 2000);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] animate-slide-up">
      <div className="bg-[#1c1c1e] border-t border-[#2c2c2e] mx-auto max-w-[393px] px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Share className="w-4 h-4 text-[#0a84ff]" />
              <p className="text-white text-sm font-semibold">Install sqorz</p>
            </div>
            <p className="text-[#8e8e93] text-xs">
              {isIOS 
                ? "Tap the Share button and select 'Add to Home Screen' for a full-screen experience"
                : "Install this app for a better experience"}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#2c2c2e] transition-colors flex-shrink-0 bg-transparent border-none cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-[#8e8e93]" />
          </button>
        </div>
      </div>
    </div>
  );
}