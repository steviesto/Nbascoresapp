import { useState, useEffect } from 'react';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warn' | 'info';
  message: string;
  details?: string;
}

export function PWADiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setIsRunning(true);

    // 1. Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    addResult({
      name: 'iOS Detection',
      status: isIOS ? 'pass' : 'info',
      message: isIOS ? 'Running on iOS device' : 'Not an iOS device',
      details: navigator.userAgent
    });

    // 2. Check if standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    addResult({
      name: 'Standalone Mode',
      status: isStandalone ? 'pass' : 'warn',
      message: isStandalone ? 'App running in standalone mode' : 'App running in browser mode',
      details: isStandalone ? 'PWA is installed' : 'Need to Add to Home Screen'
    });

    // 3. Check HTTPS
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    addResult({
      name: 'HTTPS',
      status: isSecure ? 'pass' : 'fail',
      message: isSecure ? 'Running on secure connection' : 'PWA requires HTTPS',
      details: window.location.protocol
    });

    // 4. Check Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const state = registration.active?.state || 'not active';
          addResult({
            name: 'Service Worker',
            status: state === 'activated' ? 'pass' : 'warn',
            message: `Service Worker ${state}`,
            details: registration.scope
          });
        } else {
          addResult({
            name: 'Service Worker',
            status: 'fail',
            message: 'Service Worker not registered',
            details: 'Refresh the page to register SW'
          });
        }
      } catch (e) {
        addResult({
          name: 'Service Worker',
          status: 'fail',
          message: 'Service Worker check failed',
          details: (e as Error).message
        });
      }
    } else {
      addResult({
        name: 'Service Worker',
        status: 'fail',
        message: 'Service Worker not supported',
        details: 'Browser does not support Service Workers'
      });
    }

    // 5. Check Manifest
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestLink) {
      try {
        const response = await fetch(manifestLink.href);
        const manifest = await response.json();
        const hasRequiredFields = manifest.display === 'standalone' && 
                                 manifest.icons && 
                                 manifest.icons.length > 0;
        addResult({
          name: 'Manifest',
          status: hasRequiredFields ? 'pass' : 'warn',
          message: hasRequiredFields ? 'Manifest valid' : 'Manifest missing required fields',
          details: `Display: ${manifest.display}, Icons: ${manifest.icons?.length || 0}`
        });
      } catch (e) {
        addResult({
          name: 'Manifest',
          status: 'fail',
          message: 'Manifest load failed',
          details: (e as Error).message
        });
      }
    } else {
      addResult({
        name: 'Manifest',
        status: 'fail',
        message: 'No manifest link found',
        details: 'Missing <link rel="manifest">'
      });
    }

    // 6. Check Icons
    const iconSizes = [180, 192, 512];
    for (const size of iconSizes) {
      try {
        const response = await fetch(`/icon-${size}.png`, { cache: 'no-store' });
        const contentType = response.headers.get('content-type');
        const isPng = contentType?.includes('image/png');
        
        if (response.ok && isPng) {
          const blob = await response.blob();
          addResult({
            name: `Icon ${size}x${size}`,
            status: 'pass',
            message: `Icon loaded successfully`,
            details: `${blob.size} bytes, ${contentType}`
          });
        } else {
          addResult({
            name: `Icon ${size}x${size}`,
            status: 'fail',
            message: `Icon request failed`,
            details: `Status: ${response.status}, Type: ${contentType}`
          });
        }
      } catch (e) {
        addResult({
          name: `Icon ${size}x${size}`,
          status: 'fail',
          message: 'Icon fetch error',
          details: (e as Error).message
        });
      }
    }

    // 7. Check Meta Tags
    const requiredMeta = [
      'apple-mobile-web-app-capable',
      'apple-mobile-web-app-status-bar-style',
      'apple-mobile-web-app-title'
    ];

    requiredMeta.forEach(name => {
      const tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      addResult({
        name: `Meta: ${name}`,
        status: tag ? 'pass' : 'fail',
        message: tag ? 'Present' : 'Missing',
        details: tag?.content
      });
    });

    // 8. Check Apple Touch Icon
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    addResult({
      name: 'Apple Touch Icon',
      status: appleTouchIcon ? 'pass' : 'fail',
      message: appleTouchIcon ? 'Link present' : 'Link missing',
      details: appleTouchIcon?.href
    });

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const statusColors = {
    pass: 'text-green-500',
    fail: 'text-red-500',
    warn: 'text-yellow-500',
    info: 'text-blue-500'
  };

  const statusIcons = {
    pass: '✅',
    fail: '❌',
    warn: '⚠️',
    info: 'ℹ️'
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warnCount = results.filter(r => r.status === 'warn').length;

  return (
    <div className="min-h-screen bg-[#141415] text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">PWA Diagnostic Report</h1>

        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-500/10 p-4 rounded-lg">
              <div className="text-3xl text-green-500">{passCount}</div>
              <div className="text-sm text-gray-400">Passed</div>
            </div>
            <div className="bg-red-500/10 p-4 rounded-lg">
              <div className="text-3xl text-red-500">{failCount}</div>
              <div className="text-sm text-gray-400">Failed</div>
            </div>
            <div className="bg-yellow-500/10 p-4 rounded-lg">
              <div className="text-3xl text-yellow-500">{warnCount}</div>
              <div className="text-sm text-gray-400">Warnings</div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] rounded-lg p-4 border-l-4"
              style={{
                borderLeftColor: 
                  result.status === 'pass' ? '#10b981' :
                  result.status === 'fail' ? '#ef4444' :
                  result.status === 'warn' ? '#f59e0b' :
                  '#3b82f6'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{statusIcons[result.status]}</span>
                    <span className="font-semibold">{result.name}</span>
                  </div>
                  <div className={`text-sm ${statusColors[result.status]}`}>
                    {result.message}
                  </div>
                  {result.details && (
                    <div className="text-xs text-gray-500 mt-2 font-mono break-all">
                      {result.details}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
          {failCount > 0 ? (
            <div className="space-y-2 text-sm">
              <p className="text-red-400">❌ There are {failCount} critical issues preventing PWA installation.</p>
              <p>Focus on fixing the failed items above, especially:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-400">
                {results.filter(r => r.status === 'fail').map((r, i) => (
                  <li key={i}>{r.name}</li>
                ))}
              </ul>
            </div>
          ) : warnCount > 0 ? (
            <div className="space-y-2 text-sm">
              <p className="text-yellow-400">⚠️ All critical checks passed, but there are warnings.</p>
              <p>The PWA might work, but review the warnings above for optimal experience.</p>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="text-green-400">✅ All checks passed! Your PWA is properly configured.</p>
              <p className="text-gray-400">To install:</p>
              <ol className="list-decimal list-inside ml-4 space-y-1 text-gray-400">
                <li>Tap the Share button in Safari</li>
                <li>Select "Add to Home Screen"</li>
                <li>Check that the icon preview shows "sq" on dark background</li>
                <li>Tap "Add"</li>
                <li>Open from your home screen (not Safari)</li>
              </ol>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {isRunning ? 'Running...' : '🔄 Re-run Diagnostics'}
          </button>
          <button
            onClick={() => window.location.href = '/debug.html'}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            🔬 Advanced Debug
          </button>
          <button
            onClick={() => window.location.href = '/icon-generator.html'}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            🎨 Icon Generator
          </button>
        </div>
      </div>
    </div>
  );
}
