/**
 * Voice Service — ElevenLabs TTS integration + Web Speech API STT
 * Demo: functional with API key, graceful fallback without.
 */

const getKey = () => {
  try { const k = localStorage.getItem('prism_elevenlabs_key'); if (k) return k; } catch {}
  return (import.meta as any).env?.VITE_ELEVENLABS_API_KEY || '';
};
const getDefaultVoice = () => {
  try { const v = localStorage.getItem('prism_elevenlabs_voice'); if (v) return v; } catch {}
  return (import.meta as any).env?.VITE_ELEVENLABS_PRISM_VOICE_ID || '';
};

/** Convert text to speech via ElevenLabs, or browser fallback */
export async function textToSpeech(text: string, voiceId?: string): Promise<ArrayBuffer | null> {
  const key = getKey();
  if (!key) return null;

  const id = voiceId || getDefaultVoice();
  if (!id) return null;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/yRnjtyFFRfGe0o4QjDzT/stream`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
    return response.arrayBuffer();
  } catch (err) {
    console.warn('ElevenLabs TTS failed:', err);
    return null;
  }
}

/** Speak text using browser's built-in speech synthesis (zero config, works everywhere) */
export function speakWithBrowser(text: string, onEnd?: () => void): { cancel: () => void } | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 0.9;
  utterance.volume = 1;

  // Try to pick a natural-sounding voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
    || voices.find(v => v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen'))
    || voices.find(v => v.lang.startsWith('en') && v.localService)
    || voices[0];
  if (preferred) utterance.voice = preferred;

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);

  return {
    cancel: () => {
      window.speechSynthesis.cancel();
      onEnd?.();
    },
  };
}

/** Play an audio buffer */
export function playAudio(buffer: ArrayBuffer): Promise<void> {
  return new Promise((resolve) => {
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
    audio.play().catch(() => resolve());
  });
}

/** Start speech recognition via Web Speech API */
export function startSpeechRecognition(
  onResult: (text: string, isFinal: boolean) => void,
  onEnd?: () => void,
): { stop: () => void } | null {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }
    if (final) onResult(final, true);
    else if (interim) onResult(interim, false);
  };

  recognition.onend = () => onEnd?.();
  recognition.start();

  return { stop: () => recognition.stop() };
}

/** Check if speech recognition is supported */
export function isSpeechRecognitionSupported(): boolean {
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}
