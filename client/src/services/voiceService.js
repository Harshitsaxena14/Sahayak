/**
 * Abstracted Voice Service for Web Speech API (STT & TTS)
 * Safely handles SpeechRecognition and SpeechSynthesis across browsers.
 */

class VoiceService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.synthesis = window.speechSynthesis || null;
    this.isListening = false;
  }

  isSupported() {
    return !!this.recognition;
  }

  startListening({ onResult, onError, onEnd, language = 'hi-IN' }) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) {
          if (event.error === 'no-speech') {
            onError("I couldn't hear that clearly. Please try speaking again.");
          } else if (event.error === 'not-allowed') {
            onError("Microphone access was denied. Please allow microphone permissions in your browser.");
          } else {
            onError(`Voice error: ${event.error}. Click retry to speak again.`);
          }
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
    } catch (err) {
      this.isListening = false;
      if (onError) onError(err.message || 'Failed to start microphone');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text, { language = 'hi', enabled = true } = {}) {
    if (!this.synthesis || !enabled) return;

    // Stop any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly calmer speaking rate for accessibility

    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();
