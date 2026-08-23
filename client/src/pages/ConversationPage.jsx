import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { ChatMessage } from '../components/chat/ChatMessage';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { ComplaintPreview } from '../components/grievances/ComplaintPreview';
import { TicketCard } from '../components/grievances/TicketCard';
import { StatusTimeline } from '../components/grievances/StatusTimeline';
import { ApplicationPreviewCard } from '../components/schemes/ApplicationPreviewCard';
import { ApplicationConfirmationCard } from '../components/schemes/ApplicationConfirmationCard';
import { SahayakVoiceOrb } from '../components/voice/SahayakVoiceOrb';
import { AIStateTracker } from '../components/chat/AIStateTracker';
import { ContextChip } from '../components/common/ContextChip';
import { StepProgressBar } from '../components/common/StepProgressBar';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Send, Info, XCircle, PlayCircle, Camera, ArrowRight, Trash2, RefreshCw } from 'lucide-react';

const ConversationPageContent = () => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const hasInitializedRef = useRef(false);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationState, setConversationState] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [aiStage, setAiStage] = useState('understanding');
  const [voiceState, setVoiceState] = useState('idle');
  const [apiError, setApiError] = useState(null);

  // Attached Image state for camera upload
  const [attachedImage, setAttachedImage] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, aiStage, attachedImage]);

  // Safe Session Storage Initialization
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    let savedState = null;
    let savedMessages = null;
    try {
      const rawState = sessionStorage.getItem('sahayak_active_state');
      const rawMessages = sessionStorage.getItem('sahayak_chat_history');
      if (rawState) savedState = JSON.parse(rawState);
      if (rawMessages) savedMessages = JSON.parse(rawMessages);
    } catch (e) {
      console.warn("Session storage parsing safely handled:", e.message);
    }

    if (savedMessages && Array.isArray(savedMessages) && savedMessages.length > 0) {
      setMessages(savedMessages);
      if (savedState && typeof savedState === 'object') {
        setConversationState(savedState);
      }
    } else {
      const welcome = {
        id: 1,
        sender: 'ai',
        text: language === 'hi'
          ? "नमस्ते! मैं आपका सहायक हूँ। आप मुझसे अपनी भाषा में सरकारी योजनाओं की जानकारी ले सकते हैं, सीधे 'Apply with Sahayak' से आवेदन कर सकते हैं या शिकायत दर्ज कर सकते हैं।"
          : "Hello! I am your Sahayak AI Assistant. You can discover government schemes, apply directly inside Sahayak, or register a grievance in natural language.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcome]);
    }

    if (location.state?.initialMessage) {
      handleSend(location.state.initialMessage);
    }
  }, [location.state, language]);

  // Persist session state safely
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('sahayak_chat_history', JSON.stringify(messages));
        sessionStorage.setItem('sahayak_active_state', JSON.stringify(conversationState));
      } catch (e) {}
    }
  }, [messages, conversationState]);

  const handleImageCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage({
          name: file.name,
          previewUrl: reader.result,
          file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancelApplication = () => {
    sessionStorage.removeItem('sahayak_active_state');
    handleSend('Cancel Application');
  };

  const handleResumeApplication = () => {
    handleSend('Resume');
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage.trim();
    if (!query && !attachedImage) return;

    setApiError(null);
    const finalMsgText = attachedImage
      ? `${query ? query + ' ' : ''}[Attached Photo: ${attachedImage.name}]`
      : query;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: finalMsgText,
      attachedImagePreview: attachedImage?.previewUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    setAiStage('understanding');
    setTimeout(() => setAiStage('finding'), 400);
    setTimeout(() => setAiStage('checking'), 800);

    try {
      const response = await apiClient.orchestrate({
        message: finalMsgText,
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
      } else if (response.uiType === 'SCHEME_APPLICATION_PREVIEW' && response.applicationPreview) {
        responseChildren = (
          <ApplicationPreviewCard
            preview={response.applicationPreview}
            onConfirm={handleConfirmApplication}
            onEditField={(fieldId, val) => handleSendFieldEdit(fieldId, val)}
          />
        );
      } else if (response.uiType === 'COMPLAINT_PREVIEW' && response.complaintPreview) {
        const previewWithPhoto = attachedImage
          ? { ...response.complaintPreview, attachedImagePreview: attachedImage.previewUrl, photoAttachment: attachedImage.name }
          : response.complaintPreview;

        responseChildren = (
          <ComplaintPreview
            preview={previewWithPhoto}
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
      setAttachedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setApiError(err.message || 'Unable to connect to assistant service.');
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: language === 'hi'
          ? "सेवा से कनेक्ट होने में समस्या आई। कृपया फिर से कोशिश करें।"
          : `Error: ${err.message || 'Unable to connect to assistant service. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFieldEdit = (fieldId, newValue) => {
    setConversationState((prev) => ({
      ...prev,
      editingField: fieldId
    }));
    handleSend(newValue);
  };

  const handleConfirmApplication = async (pendingApplication) => {
    setIsLoading(true);
    try {
      const result = await apiClient.confirmApplication(pendingApplication);
      if (result.success) {
        const appMsg = {
          id: Date.now(),
          sender: 'ai',
          text: language === 'hi'
            ? "आपका योजना आवेदन सफलतापूर्वक सबमिट कर दिया गया है! आपका आधिकारिक आवेदन विवरण नीचे दिया गया है:"
            : "Your scheme application has been successfully submitted! Here is your official application confirmation:",
          children: <ApplicationConfirmationCard application={result.application} />,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, appMsg]);
        setConversationState({});
        sessionStorage.removeItem('sahayak_active_state');
      }
    } catch (err) {
      const errMs = {
        id: Date.now(),
        sender: 'ai',
        text: `Application Submission Error: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMs]);
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
        sessionStorage.removeItem('sahayak_active_state');
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

  const isApplicationActive = conversationState.workflow === 'SCHEME_APPLICATION';
  const isGrievanceActive = conversationState.workflow === 'GRIEVANCE';
  const isApplicationPaused = !!conversationState.pausedWorkflow;

  const collectedData = conversationState.collectedData || {};
  const collectedEntries = Object.entries(collectedData);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 flex flex-col h-[calc(100dvh-135px)] md:h-[calc(100dvh-85px)]">
      {/* Title Header & Step Progress Bar */}
      {(isApplicationActive || isGrievanceActive) && (
        <div className="mb-2 space-y-1 text-center">
          <h2 className="text-base sm:text-lg font-black text-sahayak-ink">
            {isApplicationActive
              ? (language === 'hi' ? `सहायक से आवेदन: ${conversationState.schemeName || 'PM-KISAN'}` : `Applying with Sahayak: ${conversationState.schemeName || 'PM-KISAN'}`)
              : (language === 'hi' ? "सहायक से शिकायत दर्ज करें" : "Applying with Sahayak: Grievance")}
          </h2>
          {isApplicationActive && <StepProgressBar currentStep={6 - (conversationState.missingFields?.length || 4)} totalSteps={6} />}
        </div>
      )}

      {/* Context Chips Top Bar */}
      {collectedEntries.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2 px-2 py-1 bg-sahayak-surfaceWarm/80 rounded-full border border-sahayak-border shadow-xs">
          {collectedEntries.map(([key, val]) => (
            <ContextChip key={key} label={key} value={String(val)} isChecked={true} />
          ))}
        </div>
      )}

      {/* Banner for Active Exit / Resume */}
      <div className="bg-sahayak-surfaceWarm border border-sahayak-border text-sahayak-ink text-xs px-3.5 py-1.5 rounded-xl mb-2 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sahayak-primary shrink-0" />
          <span className="font-semibold text-[11px] sm:text-xs">
            {isApplicationActive
              ? t('chat.activeWorkflow')
              : isGrievanceActive
              ? t('chat.activeGrievance')
              : isApplicationPaused
              ? t('chat.pausedWorkflow')
              : "Demo Mode · Prototype uses simulated government workflows"}
          </span>
        </div>

        {isApplicationActive || isGrievanceActive ? (
          <button
            type="button"
            onClick={handleCancelApplication}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-sahayak-error bg-sahayak-errorBg hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors min-h-touch"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{t('chat.cancelWorkflow')}</span>
          </button>
        ) : isApplicationPaused ? (
          <button
            type="button"
            onClick={handleResumeApplication}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-sahayak-success bg-sahayak-successBg hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors min-h-touch"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>{t('chat.resumeWorkflow')}</span>
          </button>
        ) : null}
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

        {apiError && (
          <div className="p-3 bg-sahayak-errorBg border border-red-200 rounded-2xl text-xs text-sahayak-error flex items-center justify-between gap-2">
            <span>{apiError}</span>
            <button
              type="button"
              onClick={() => handleSend(inputMessage)}
              className="px-3 py-1 bg-sahayak-error text-white rounded-lg font-bold text-[11px] flex items-center gap-1 min-h-touch"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attached Photo Thumbnail Card */}
      {attachedImage && (
        <div className="my-1.5 p-2 bg-sahayak-surfaceWarm border border-sahayak-border rounded-2xl flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <img src={attachedImage.previewUrl} alt="Captured preview" className="w-10 h-10 object-cover rounded-xl border border-amber-300" />
            <div className="text-left">
              <span className="text-[10px] font-extrabold text-sahayak-primary uppercase block">{t('chat.photoAttached')}</span>
              <span className="text-xs font-semibold text-sahayak-ink truncate max-w-[180px] sm:max-w-xs block">{attachedImage.name}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="p-1.5 text-sahayak-error hover:bg-sahayak-errorBg rounded-xl transition-colors min-h-touch min-w-touch flex items-center justify-center"
            title={t('chat.removePhoto')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        className="hidden"
      />

      {/* Sticky Bottom Input Composer */}
      <div className="mt-1 pt-1.5 border-t border-sahayak-border pb-[env(safe-area-inset-bottom)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-2.5 bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl shadow-sahayak-card space-y-2"
        >
          <textarea
            rows={2}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              isApplicationActive
                ? (language === 'hi' ? "अनुरोधित विवरण दर्ज करें..." : "Provide requested details...")
                : isGrievanceActive
                ? (language === 'hi' ? "समस्या का विवरण लिखें..." : "Describe the issue here...")
                : t('chat.placeholder')
            }
            className="w-full px-3 py-1 bg-transparent text-xs sm:text-sm font-medium text-sahayak-ink focus:outline-none placeholder:text-sahayak-inkMuted resize-none"
          />

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-sahayak-border/60">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-full transition-colors min-h-touch min-w-touch flex items-center justify-center ${
                  attachedImage ? 'text-sahayak-primary bg-sahayak-surfaceWarm' : 'text-sahayak-inkMuted hover:text-sahayak-ink hover:bg-sahayak-canvas'
                }`}
                title={t('chat.attachPhoto')}
              >
                <Camera className="w-4 h-4" />
              </button>

              <SahayakVoiceOrb
                state={voiceState}
                setState={setVoiceState}
                onTranscript={(text) => handleSend(text)}
                size="normal"
              />
            </div>

            <button
              type="submit"
              disabled={(!inputMessage.trim() && !attachedImage) || isLoading}
              className="px-5 py-2.5 bg-sahayak-primary hover:bg-sahayak-primaryHover disabled:opacity-40 text-white font-extrabold text-xs rounded-full transition-all flex items-center gap-1.5 min-h-touch shadow-sahayak-float active:scale-97"
            >
              <span>{t('chat.process')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ConversationPage = () => (
  <ErrorBoundary>
    <ConversationPageContent />
  </ErrorBoundary>
);
