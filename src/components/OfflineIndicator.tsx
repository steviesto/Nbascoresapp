import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 text-center font-semibold transition-all ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
      }`}
      style={{ 
        animation: 'slideDown 0.3s ease-out',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}
    >
      {isOnline ? (
        <div className="flex items-center justify-center gap-2">
          <span>✅ Back online</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <WifiOff size={20} />
          <span>Offline - Showing cached data</span>
        </div>
      )}
    </div>
  );
}
