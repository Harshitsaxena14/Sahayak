import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { ChatMessage } from '../components/chat/ChatMessage';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { ComplaintPreview } from '../components/grievances/ComplaintPreview';
import { TicketCard } from '../components/grievances/TicketCard';
import { StatusTimeline } from '../components/grievances/StatusTimeline';
import { SahayakVoiceOrb } from '../components/voice/SahayakVoiceOrb';
import { AIStateTracker } from '../components/chat/AIStateTracker';
import { Send, Info } from 'lucide-react';

export const ConversationPage = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const hasInitializedRef = useRef(false);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationState, setConversationState] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [aiStage, setAiStage] = useState('understanding');
  const [voiceState, setVoiceState] = useState('idle');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, aiStage]);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const welcome = {
      id: 1,
      sender: 'ai',
      text: language === 'hi'
        ? "नमस्ते! मैं आपका सहायक हूँ। आप मुझसे अपनी भाषा में सरकारी योजनाओं के बारे में पूछ सकते हैं या कोई शिकायत दर्ज करवा सकते हैं।"
        : "Hello! I am your Sahayak AI Assistant. You can ask me about government schemes, eligibility, or register a grievance in natural language.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([welcome]);

    if (location.state?.initialMessage) {
      handleSend(location.state.initialMessage);
    }
  }, [location.state, language]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage.trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    // Simulate explicit AI state transitions
    setAiStage('understanding');
    setTimeout(() => setAiStage('finding'), 500);
    setTimeout(() => setAiStage('checking'), 900);

    try {
      const response = await apiClient.orchestrate({
        message: query,
        conversationState,
        language
      });

      setAiStage('ready');
      setConversationState(response.conversationState || {});

      let responseChildren = null;

      if (response.uiType === 'SCHEME_RESULTS' && response.schemes) {
        responseChildren = (
          <div className="space-y-3">
            {response.schemes.map((s) => (
              <SchemeCard key={s.schemeId} scheme={s} />
            ))}
          </div>
        );
      } else if (response.uiType === 'COMPLAINT_PREVIEW' && response.complaintPreview) {
        responseChildren = (
          <ComplaintPreview
            preview={response.complaintPreview}
            onConfirm={handleConfirmGrievance}
            onEdit={(edited) => handleConfirmGrievance(edited)}
          />
        );
      } else if (response.uiType === 'TICKET_STATUS' && response.ticket) {
        responseChildren = <StatusTimeline ticket={response.ticket} />;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.textResponse,
        children: responseChildren,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Error: ${err.message || 'Unable to connect to assistant service. Please check backend.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmGrievance = async (pendingGrievance) => {
    setIsLoading(true);
    try {
      const result = await apiClient.confirmGrievance(pendingGrievance);
      if (result.success) {
        const ticketMsg = {
          id: Date.now(),
          sender: 'ai',
          text: language === 'hi'
            ? "आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है। आपका आधिकारिक टिकट विवरण नीचे दिया गया है:"
            : "Your complaint has been successfully registered! Here is your official ticket confirmation:",
          children: <TicketCard ticket={result.ticket} />,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, ticketMsg]);
        setConversationState({});
      }
    } catch (err) {
      const errMs = {
        id: Date.now(),
        sender: 'ai',
        text: `Submission Error: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMs]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)]">
      {/* Refined Demo Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200/80 text-amber-900 text-xs px-3.5 py-1.5 rounded-xl mb-4 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-semibold">Demo Mode · Prototype uses simulated government workflows</span>
        </div>
        <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded-full font-bold">SIH 2026</span>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="max-w-md my-3">
            <AIStateTracker currentStage={aiStage} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Chat Input Controls */}
      <div className="mt-4 pt-3 border-t border-gov-border bg-gov-bg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="flex-1 px-4 py-3.5 bg-white border border-slate-300 focus:border-gov-navy rounded-2xl text-base font-medium shadow-2xs min-h-touch"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-5 py-3.5 bg-gov-navy hover:bg-gov-primary disabled:opacity-50 text-white font-bold text-sm rounded-2xl transition-colors flex items-center gap-2 min-h-touch"
            aria-label="Send message"
          >
            <span>{t('chat.send')}</span>
            <Send className="w-4 h-4 text-gov-accent" />
          </button>

          <div className="hidden sm:block">
            <SahayakVoiceOrb
              state={voiceState}
              setState={setVoiceState}
              onTranscript={(text) => handleSend(text)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
