/**
 * Avatar Service — D-ID Talks API
 * Generates talking-head video with ElevenLabs voice (synced lips).
 * D-ID calls ElevenLabs server-side — no CORS issues.
 */

const getKey = () => {
  try { const k = localStorage.getItem('prism_did_key'); if (k) return k; } catch {}
  const envKey = (import.meta as any).env?.VITE_DID_API_KEY || '';
  return envKey.includes('your-key') ? '' : envKey;
};

const getElevenLabsVoiceId = () => {
  try { const v = localStorage.getItem('prism_elevenlabs_voice'); if (v) return v; } catch {}
  return (import.meta as any).env?.VITE_ELEVENLABS_PRISM_VOICE_ID || '';
};

const getElevenLabsKey = () => {
  try { const k = localStorage.getItem('prism_elevenlabs_key'); if (k) return k; } catch {}
  return (import.meta as any).env?.VITE_ELEVENLABS_API_KEY || '';
};

const API = 'https://api.d-id.com';

export async function createTalkingVideo(photoUrl: string, text: string): Promise<string | null> {
  const key = getKey();
  if (!key) { console.log('[D-ID] No API key'); return null; }

  // Build voice provider — ElevenLabs if configured, Microsoft fallback
  const elVoice = getElevenLabsVoiceId();
  const elKey = getElevenLabsKey();
  let provider: any;

  if (elVoice && elKey) {
    provider = { type: 'elevenlabs', voice_id: elVoice, voice_config: { api_key: elKey } };
    console.log('[D-ID] Using ElevenLabs voice:', elVoice.slice(0, 8) + '...');
  } else if (elVoice) {
    // Voice ID set but no key — D-ID might have ElevenLabs configured in dashboard
    provider = { type: 'elevenlabs', voice_id: elVoice };
    console.log('[D-ID] Using ElevenLabs voice (dashboard key):', elVoice.slice(0, 8) + '...');
  } else {
    provider = { type: 'microsoft', voice_id: 'en-US-GuyNeural' };
    console.log('[D-ID] Using Microsoft TTS (no ElevenLabs voice configured)');
  }

  try {
    console.log('[D-ID] Creating talk...');
    const res = await fetch(`${API}/talks`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_url: 'https://res.cloudinary.com/drflqs5jo/image/upload/v1775416042/Axiora_BO_olkl2n.jpg',
        script: { type: 'text', input: text, provider: { type: 'elevenlabs', voice_id: 'yRnjtyFFRfGe0o4QjDzT' } },
        config: { fluent: true, stitch: true },
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.warn('[D-ID] Create failed:', res.status, errText.slice(0, 200));
      return null;
    }
    const { id } = await res.json();
    console.log('[D-ID] Talk created:', id, '— polling...');
    for (let i = 0; i < 45; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const poll = await fetch(`${API}/talks/${id}`, { headers: { 'Authorization': `Basic ${key}` } });
      const data = await poll.json();
      if (data.status === 'done' && data.result_url) { console.log('[D-ID] Video ready'); return data.result_url; }
      if (data.status === 'error') { console.warn('[D-ID] Error:', data); return null; }
    }
    console.warn('[D-ID] Timed out after 45s');
    return null;
  } catch (err) { console.warn('[D-ID]', err); return null; }
}

export function isDIDConfigured(): boolean { return !!getKey(); }
