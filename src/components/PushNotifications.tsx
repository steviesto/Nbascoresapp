import { useState, useEffect } from 'react';

export function PushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    const isSupported = 'Notification' in window && 
                       'serviceWorker' in navigator && 
                       'PushManager' in window;
    
    setSupported(isSupported);
    
    if (isSupported) {
      setPermission(Notification.permission);
      
      // Check if already subscribed
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
        });
      });
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        await subscribeToPush();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // This is a public VAPID key - in production, you'd use your own
      const publicVapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmThLB_VpQ_c7LWxCQ5YOmRPBr9KjOCuGkqGXD8O8vJ8LOWjD_VA';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
      
      setSubscription(subscription);
      
      // In production, send this subscription to your server
      console.log('Push subscription:', JSON.stringify(subscription));
      
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  };

  const unsubscribe = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('sqorz Test', {
          body: 'Push notifications are working! 🏀',
          icon: 'https://via.placeholder.com/192x192/141415/FFFFFF?text=sq',
          badge: 'https://via.placeholder.com/96x96/141415/FFFFFF?text=sq',
          vibrate: [200, 100, 200],
          tag: 'test-notification',
          requireInteraction: false
        });
      });
    }
  };

  // Helper function to convert VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if (!supported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-[#1a1a1a] border border-[#333] rounded-lg p-4 max-w-xs shadow-lg z-50">
      <h3 className="text-white font-semibold mb-2">🔔 Push Notifications</h3>
      
      {permission === 'default' && (
        <div>
          <p className="text-sm text-gray-400 mb-3">
            Enable notifications to get game updates
          </p>
          <button
            onClick={requestPermission}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Enable Notifications
          </button>
        </div>
      )}
      
      {permission === 'denied' && (
        <div>
          <p className="text-sm text-red-400 mb-2">
            Notifications blocked. Enable in Settings → Safari → sqorz
          </p>
        </div>
      )}
      
      {permission === 'granted' && (
        <div className="space-y-2">
          <p className="text-sm text-green-400 mb-2">
            ✅ Notifications enabled
          </p>
          
          {!subscription ? (
            <button
              onClick={subscribeToPush}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
            >
              Subscribe to Updates
            </button>
          ) : (
            <>
              <button
                onClick={sendTestNotification}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition mb-2"
              >
                Send Test Notification
              </button>
              <button
                onClick={unsubscribe}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
              >
                Unsubscribe
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
