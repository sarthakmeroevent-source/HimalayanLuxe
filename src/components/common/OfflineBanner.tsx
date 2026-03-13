import { useState, useEffect } from 'react';

export default function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const goOffline = () => setIsOffline(true);
        const goOnline = () => setIsOffline(false);

        window.addEventListener('offline', goOffline);
        window.addEventListener('online', goOnline);
        return () => {
            window.removeEventListener('offline', goOffline);
            window.removeEventListener('online', goOnline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center py-3 px-6 bg-black/90 backdrop-blur-md border-b border-gold/20">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold/60 animate-pulse" />
                <span className="text-white/70 text-xs tracking-[0.15em] uppercase font-medium">
                    You appear to be offline — some content may be unavailable
                </span>
            </div>
        </div>
    );
}
