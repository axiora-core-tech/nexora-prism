/**
 * Avatar Service — D-ID / HeyGen video generation
 * Demo: placeholder with animated geometric form. Production: real avatar API.
 */

const getKey = () => (import.meta as any).env?.VITE_DID_API_KEY || '';

export interface AvatarVideoRequest {
  photoUrl: string;
  audioUrl: string;
  text?: string;
}

/** Generate avatar video from photo + audio */
export async function generateAvatarVideo(request: AvatarVideoRequest): Promise<string | null> {
  const key = getKey();
  if (!key) {
    console.info('D-ID API key not configured — using default Prism avatar');
    return null;
  }

  try {
    const response = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_url: request.photoUrl,
        script: request.audioUrl
          ? { type: 'audio', audio_url: request.audioUrl }
          : { type: 'text', input: request.text || '' },
      }),
    });
    const data = await response.json();
    return data.result_url || null;
  } catch (err) {
    console.warn('D-ID avatar generation failed:', err);
    return null;
  }
}

/** Check if avatar service is configured */
export function isAvatarServiceConfigured(): boolean {
  return !!getKey();
}

/** Get the default Prism avatar type (geometric form) */
export function getDefaultAvatarType(): 'geometric' | 'photo' {
  return getKey() ? 'photo' : 'geometric';
}
