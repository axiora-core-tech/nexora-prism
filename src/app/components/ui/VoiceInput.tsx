/**
 * VoiceInput — Shared mic button + live waveform + transcript
 * Uses Web Speech API for STT. Chrome recommended.
 */
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrismVoice, PrismVoiceOff, PrismLoader } from './PrismIcons';
import { startSpeechRecognition, isSpeechRecognitionSupported } from '../../services/voiceService';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onListeningChange?: (listening: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  accent?: string;
  className?: string;
}

export function VoiceInput({ onTranscript, onListeningChange, size = 'md', accent = '#38bdf8', className = '' }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const supported = isSpeechRecognitionSupported();

  const iconSize = size === 'lg' ? 24 : size === 'md' ? 18 : 14;
  const btnSize = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-11 h-11' : 'w-8 h-8';

  const toggle = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setListening(false);
      onListeningChange?.(false);
      setInterim('');
    } else {
      const rec = startSpeechRecognition(
        (text, isFinal) => {
          if (isFinal) {
            onTranscript(text);
            setInterim('');
          } else {
            setInterim(text);
          }
        },
        () => {
          setListening(false);
          onListeningChange?.(false);
        }
      );
      if (rec) {
        recognitionRef.current = rec;
        setListening(true);
        onListeningChange?.(true);
      }
    }
  }, [listening, onTranscript, onListeningChange]);

  if (!supported) {
    return (
      <div className={`flex items-center gap-2 text-xs p-text-ghost ${className}`}>
        <PrismVoiceOff size={12} /> Voice input requires Chrome
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.92 }}
        className={`${btnSize} rounded-full flex items-center justify-center transition-all relative`}
        style={{
          background: listening ? `${accent}20` : 'var(--p-bg-card)',
          border: `1px solid ${listening ? accent + '40' : 'var(--p-border)'}`,
          color: listening ? accent : 'var(--p-text-dim)',
        }}
        data-cursor={listening ? 'Stop' : 'Speak'}
      >
        {listening ? <PrismVoice size={iconSize} /> : <PrismVoice size={iconSize} />}
        {/* Pulse ring when listening */}
        <AnimatePresence>
          {listening && (
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${accent}` }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Live waveform bars */}
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-0.5 h-6 overflow-hidden"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 12 + Math.random() * 8, 4] }}
                transition={{ duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }}
                className="w-0.5 rounded-full"
                style={{ background: accent, minHeight: 4 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interim transcript */}
      {interim && (
        <span className="text-xs p-text-dim font-mono truncate max-w-[200px]">{interim}</span>
      )}
    </div>
  );
}
