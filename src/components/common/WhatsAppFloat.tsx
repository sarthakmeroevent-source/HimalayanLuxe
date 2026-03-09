import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

const FALLBACK_NUMBER = '9779818184797';

export default function WhatsAppFloat() {
    const { data: settings } = useQuery({
        queryKey: ['site-settings-public'],
        queryFn: async () => {
            const { data } = await supabase.from('site_settings').select('whatsapp_number').maybeSingle();
            return data as { whatsapp_number: string | null } | null;
        },
        staleTime: 1000 * 60 * 30,
    });

    const number = settings?.whatsapp_number || FALLBACK_NUMBER;

    return (
        <a
            href={`https://wa.me/${number}?text=${encodeURIComponent('Hi, I would like to know more about Himalayan Luxe services.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
            title="Chat on WhatsApp"
            style={{ pointerEvents: 'auto' }}
        >
            <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
                <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.95 2.042-3.21 2.312-.864.182-1.99.328-5.786-1.244-4.856-2.012-7.978-6.932-8.22-7.254-.232-.322-1.95-2.6-1.95-4.96s1.232-3.518 1.67-3.998c.438-.48.956-.6 1.274-.6.318 0 .636.002.914.016.294.016.688-.112 1.076.82.396.952 1.352 3.312 1.47 3.552.118.24.198.52.04.84-.158.318-.238.518-.478.798-.24.28-.504.626-.72.84-.24.24-.49.5-.21.98.28.48 1.244 2.054 2.672 3.328 1.838 1.638 3.386 2.146 3.866 2.386.48.24.76.2 1.04-.12.28-.318 1.196-1.396 1.514-1.876.318-.48.636-.398 1.076-.238.438.158 2.794 1.318 3.274 1.558.48.24.798.358.916.558.118.198.118 1.156-.278 2.272z"/>
            </svg>
        </a>
    );
}
