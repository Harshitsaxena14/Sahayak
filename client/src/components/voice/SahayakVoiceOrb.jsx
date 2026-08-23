import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RotateCcw, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { voiceService } from '../../services/voiceService';
import { useLanguage } from '../../context/LanguageContext';

export const SahayakVoiceOrb = ({ state = 'idle', setState, onTranscript, onError, size = 'normal' }) => {
  const { language, t } = useLanguage();
  const [amplitude, setAmplitude] = useState(0);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);

  const normalizedState = state === 'recording' ? 'listening' : state;

  // Web Audio API amplitude analyzer for Listening state
  useEffect(() => {
    if (normalizedState === 'listening') {
      let isSubscribed = true;

      const initAudio = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (!isSubscribed) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }
          streamRef.current = stream;

          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioCtxRef.current = ctx;
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            analyserRef.current = analyser;

            const source = ctx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateVolume = () => {
              if (!isSubscribed) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              const norm = Math.min(1, avg / 128);
              setAmplitude(norm);
              animFrameRef.current = requestAnimationFrame(updateVolume);
            };

            updateVolume();
          }
        } catch (e) {
          // Silent fallback if Web Audio mic inspection is blocked
        }
      };

      initAudio();

      return () => {
        isSubscribed = false;
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close().catch(() => {});
        }
        setAmplitude(0);
      };
    } else {
      setAmplitude(0);
    }
  }, [normalizedState]);

  const handleToggleVoice = () => {
    if (normalizedState === 'listening') {
      voiceService.stopListening();
      if (setState) setState('processing');
    } else {
      if (setState) setState('listening');
      voiceService.startListening({
        language,
        onResult: (text) => {
          if (setState) setState('understanding');
          if (onTranscript) onTranscript(text);
        },
        onError: (errMessage) => {
          if (setState) setState('error');
          if (onError) onError(errMessage);
        },
        onEnd: () => {
          if (normalizedState === 'listening' && setState) {
            setState('idle');
          }
        }
      });
    }
  };

  const isHeroSize = size === 'hero';
  const containerSize = isHeroSize ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-12 h-12 sm:w-14 sm:h-14';
  const iconSize = isHeroSize ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-5 h-5 sm:w-6 sm:h-6';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        {/* Outward Sonar Rings for Listening */}
        {normalizedState === 'listening' && (
          <>
            <div
              className="absolute inset-0 rounded-full border-2 border-sahayak-primary/40 animate-ping opacity-75"
              style={{ transform: `scale(${1.2 + amplitude * 0.4})` }}
            />
            <div
              className="absolute -inset-4 rounded-full bg-sahayak-primary/20 blur-sm transition-all duration-75"
              style={{ transform: `scale(${1 + amplitude * 0.5})` }}
            />
          </>
        )}

        {/* Ambient Breathing Ring for Idle */}
        {normalizedState === 'idle' && (
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-sahayak-intelligence/20 to-sahayak-primary/20 animate-orb-pulse blur-xs" />
        )}

        {/* Rotating Conic Gradient Ring for Processing */}
        {normalizedState === 'processing' && (
          <div className="absolute -inset-2 rounded-full animate-spin bg-[conic-gradient(from_0deg,#6D5BD0,#A99BEB,transparent,#6D5BD0)] p-0.5 blur-xs" />
        )}

        {/* Inward Pulsing Rings for Understanding */}
        {normalizedState === 'understanding' && (
          <div className="absolute -inset-3 rounded-full border-2 border-dashed border-sahayak-intelligence animate-spin" />
        )}

        {/* Responding Soft Glow Pulse */}
        {normalizedState === 'responding' && (
          <div className="absolute -inset-3 rounded-full bg-sahayak-success/30 animate-pulse blur-sm" />
        )}

        {/* Core Orb Button */}
        <button
          type="button"
          onClick={handleToggleVoice}
          disabled={normalizedState === 'processing' || normalizedState === 'understanding'}
          className={`relative z-10 ${containerSize} rounded-full flex flex-col items-center justify-center font-bold text-white shadow-sahayak-card transition-all duration-300 transform active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-sahayak-primary ${
            normalizedState === 'listening'
              ? 'bg-sahayak-primary scale-105 shadow-sahayak-float border-2 border-amber-200'
              : normalizedState === 'error'
              ? 'bg-sahayak-warningBg text-sahayak-warning border-2 border-amber-400 animate-orb-shake shadow-none'
              : normalizedState === 'processing'
              ? 'bg-sahayak-intelligence border-2 border-sahayak-intelligenceSoft'
              : normalizedState === 'understanding'
              ? 'bg-sahayak-intelligence text-white border-2 border-white'
              : normalizedState === 'responding'
              ? 'bg-sahayak-success text-white border-2 border-emerald-300'
              : 'bg-sahayak-ink hover:bg-sahayak-primary text-white shadow-sahayak-card border border-sahayak-border'
          }`}
          aria-label={
            normalizedState === 'listening'
              ? 'Stop voice input'
              : 'Start voice input'
          }
        >
          {normalizedState === 'listening' ? (
            <MicOff className={`${iconSize} text-white animate-pulse`} />
          ) : normalizedState === 'error' ? (
            <RotateCcw className={`${iconSize} text-sahayak-warning`} />
          ) : normalizedState === 'processing' ? (
            <Loader2 className={`${iconSize} text-white animate-spin`} />
          ) : normalizedState === 'understanding' ? (
            <Sparkles className={`${iconSize} text-white animate-pulse`} />
          ) : normalizedState === 'responding' ? (
            <div className="flex items-end gap-0.5 h-6">
              <span className="w-1 bg-white animate-bounce h-4 rounded-full" />
              <span className="w-1 bg-white animate-bounce h-6 rounded-full delay-75" />
              <span className="w-1 bg-white animate-bounce h-3 rounded-full delay-150" />
            </div>
          ) : (
            <Mic className={`${iconSize} text-white`} />
          )}
        </button>
      </div>

      {/* State Text Label */}
      <span className="text-[11px] font-bold text-sahayak-inkSoft text-center tracking-tight">
        {normalizedState === 'idle' && (language === 'hi' ? 'बोलकर पूछें' : 'Tap to speak')}
        {normalizedState === 'listening' && (language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...')}
        {normalizedState === 'processing' && (language === 'hi' ? 'आवाज़ संसाधित की जा रही है...' : 'Processing audio...')}
        {normalizedState === 'understanding' && (language === 'hi' ? 'समझ रहा हूँ...' : 'Understanding intent...')}
        {normalizedState === 'responding' && (language === 'hi' ? 'उत्तर दिया जा रहा है...' : 'Responding...')}
        {normalizedState === 'error' && (language === 'hi' ? 'पुनः प्रयास करें' : 'Tap to retry')}
      </span>
    </div>
  );
};
