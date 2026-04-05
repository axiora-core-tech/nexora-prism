/**
 * Avatar Service — D-ID Talks API
 * Generates talking-head video from photo + text.
 */

const getKey = () => {
  try { const k = localStorage.getItem('prism_did_key'); if (k) return k; } catch {}
  const envKey = (import.meta as any).env?.VITE_DID_API_KEY || '';
  return envKey.includes('your-key') ? '' : envKey;
};

const API = 'https://api.d-id.com';

export async function createTalkingVideo(photoUrl: string, text: string, voiceId?: string): Promise<string | null> {
  const key = getKey();
  if (!key) { console.log('[D-ID] No API key'); return null; }
  try {
    console.log('[D-ID] Creating talk...');
    const res = await fetch(`${API}/talks`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_url: 'https://res.cloudinary.com/drflqs5jo/image/upload/v1775416042/Axiora_BO_olkl2n.jpg',
        script: { type: 'text', input: text, provider: { type: 'microsoft', voice_id: voiceId || 'en-US-GuyNeural' } },
        config: { fluent: true, stitch: true },
      }),
    });
    if (!res.ok) { console.warn('[D-ID] Create failed:', res.status); return null; }
    const { id } = await res.json();
    console.log('[D-ID] Polling for', id);
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const poll = await fetch(`${API}/talks/${id}`, { headers: { 'Authorization': `Basic ${key}` } });
      const data = await poll.json();
      if (data.status === 'done' && data.result_url) { console.log('[D-ID] Video ready'); return data.result_url; }
      if (data.status === 'error') { console.warn('[D-ID] Error:', data); return null; }
    }
    return null;
  } catch (err) { console.warn('[D-ID]', err); return null; }
}

export function isDIDConfigured(): boolean { return !!getKey(); }
