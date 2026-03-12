import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

function getSessionId(): string {
  let id = sessionStorage.getItem('hlx_sid');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('hlx_sid', id);
  }
  return id;
}

export default function PageViewTracker() {
  const location = useLocation();
  const lastPath = useRef('');

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;

    const sessionId = getSessionId();
    const today = new Date().toISOString().split('T')[0];

    // Try to increment existing row, or insert new one
    supabase.rpc('track_page_view', {
      p_date: today,
      p_path: path,
      p_session: sessionId,
    }).then(({ error }) => {
      if (error) console.error('[PageViewTracker]', error.message);
    });
  }, [location.pathname]);

  return null;
}
