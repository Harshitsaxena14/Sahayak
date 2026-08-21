const { searchSchemeKnowledgeBase } = require('./knowledgeBaseRetrievalService');
const { generateLLMResponse } = require('./aiProvider');
const Grievance = require('../models/Grievance');
const { getIsConnected, getMemoryStore } = require('../config/db');
const { seedGrievances } = require('../data/seedData');

/**
 * SAHAYAK Orchestration Service V2
 * Addresses Issues 1-4:
 * 1. Uses knowledgeBaseRetrievalService.
 * 2. Zero location guessing.
 * 3. Zero duration inventing.
 * 4. Scheme-specific eligibility logic.
 */

const generateTicketId = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GRV-2026-${random}`;
};

const processCitizenTurn = async ({ message, conversationState = {}, language = 'en' }) => {
  const text = message.trim();
  const lowerText = text.toLowerCase();

  // Detect Intent
  let intent = conversationState.currentIntent || null;

  if (!intent) {
    if (lowerText.match(/grv-\d+|ticket|status|kya hua|track|shikayat status|my complaint/i)) {
      intent = 'TRACKING';
    } else if (lowerText.match(/paani|water|light|bijli|electricity|sadak|road|pothole|gaddi|kachra|garbage|safai|sanitation|complaint|shikayat|problem|samasya|issue/i)) {
      intent = 'GRIEVANCE';
    } else if (lowerText.match(/scheme|yojana|sarkari|government|benefit|labh|paisa|farmer|kisan|hospital|swasthya|beti|pension|scholarship|eligib/i)) {
      intent = 'SCHEME';
    } else {
      intent = 'SCHEME'; // Default intent
    }
  }

  if (intent === 'TRACKING') {
    return await handleTrackingWorkflow({ text, conversationState, language });
  }

  if (intent === 'GRIEVANCE') {
    return await handleGrievanceWorkflow({ text, conversationState, language });
  }

  return await handleSchemeWorkflow({ text, conversationState, language });
};

/**
 * Pillar 1: Scheme Workflow Handler with Scheme-Specific Eligibility Rules (Issue 4)
 */
const handleSchemeWorkflow = async ({ text, conversationState, language }) => {
  const slots = conversationState.slots || {};
  const lowerText = text.toLowerCase();

  // Detect Candidate Scheme Target
  let candidateScheme = conversationState.candidateScheme || null;

  if (!candidateScheme) {
    if (lowerText.includes('kisan') || lowerText.includes('farmer') || lowerText.includes('kheti')) {
      candidateScheme = 'PM-KISAN';
    } else if (lowerText.includes('scholarship') || lowerText.includes('padhai') || lowerText.includes('student')) {
      candidateScheme = 'SCHOLARSHIP';
    } else if (lowerText.includes('beti') || lowerText.includes('sukanya') || lowerText.includes('daughter')) {
      candidateScheme = 'SUKANYA';
    } else if (lowerText.includes('vendor') || lowerText.includes('dukan') || lowerText.includes('rehari') || lowerText.includes('loan')) {
      candidateScheme = 'SVANIDHI';
    } else if (lowerText.includes('pension') || lowerText.includes('senior') || lowerText.includes('elderly')) {
      candidateScheme = 'PENSION';
    } else if (lowerText.includes('health') || lowerText.includes('swasthya') || lowerText.includes('hospital') || lowerText.includes('ayushman')) {
      candidateScheme = 'PM-JAY';
    }
  }

  // Scheme-Specific Single Question Logic (Issue 4)
  if (candidateScheme === 'PM-KISAN' && !slots.landOwnership && !slots.askedLand) {
    slots.askedLand = true;
    const question = language === 'hi'
      ? "क्या आपके पास अपने नाम पर कृषि योग्य भूमि (खतौनी/ज़मीन का स्वामित्व) है?"
      : "Do you hold cultivable agricultural land registered in your name?";
    return {
      textResponse: question,
      workflow: 'SCHEME',
      conversationState: { currentIntent: 'SCHEME', candidateScheme, slots },
      nextStepQuestion: question,
      uiType: 'QUESTION'
    };
  }

  if (candidateScheme === 'SCHOLARSHIP' && !slots.educationLevel && !slots.askedEducation) {
    slots.askedEducation = true;
    const question = language === 'hi'
      ? "आप या आपका बच्चा अभी किस कक्षा या कॉलेज कोर्स में पढ़ाई कर रहे हैं?"
      : "Which class or college degree program are you/your child currently pursuing?";
    return {
      textResponse: question,
      workflow: 'SCHEME',
      conversationState: { currentIntent: 'SCHEME', candidateScheme, slots },
      nextStepQuestion: question,
      uiType: 'QUESTION'
    };
  }

  if (candidateScheme === 'SUKANYA' && !slots.childAge && !slots.askedChildAge) {
    slots.askedChildAge = true;
    const question = language === 'hi'
      ? "आपकी बालिका (बेटी) की वर्तमान आयु कितनी है?"
      : "What is the current age of your girl child?";
    return {
      textResponse: question,
      workflow: 'SCHEME',
      conversationState: { currentIntent: 'SCHEME', candidateScheme, slots },
      nextStepQuestion: question,
      uiType: 'QUESTION'
    };
  }

  // Record answered slot details from current text
  if (lowerText.includes('haa') || lowerText.includes('yes') || lowerText.includes('hai')) {
    slots.landOwnership = true;
  }
  const ageMatch = text.match(/\b(\d{1,2})\b/);
  if (ageMatch) slots.age = ageMatch[1];

  // Query Knowledge Base Retrieval Service (Issue 1)
  const ragResults = await searchSchemeKnowledgeBase(text, slots);

  let responseText = "";
  if (language === 'hi') {
    responseText = ragResults.found
      ? "आपकी आवश्यकता के आधार पर, आधिकारिक ज्ञानकोष से सत्यापित योजनाएं दी गई हैं:"
      : "मुझे आपकी सटीक आवश्यकता से मेल खाती योजना की सत्यापित जानकारी नहीं मिली, लेकिन आप निम्नलिखित प्रमुख योजनाओं की जांच कर सकते हैं:";
  } else {
    responseText = ragResults.found
      ? "Based on your requirement, here are the official government schemes grounded in our verified repository:"
      : "I couldn't find an exact match in our verified database, but here are closely related government schemes you may check:";
  }

  return {
    textResponse: responseText,
    workflow: 'SCHEME',
    conversationState: { currentIntent: null, slots: {} },
    schemes: ragResults.schemes.map(item => ({
      ...item.scheme.toObject ? item.scheme.toObject() : item.scheme,
      eligibilityBadge: item.eligibilityBadge,
      explanation: item.explanation,
      citationSource: item.citationSource
    })),
    note: ragResults.note,
    uiType: 'SCHEME_RESULTS'
  };
};

/**
 * Pillar 2: Grievance Workflow Handler (Issues 2 & 3: Zero Location Guessing & Zero Duration Inventing)
 */
const handleGrievanceWorkflow = async ({ text, conversationState, language }) => {
  const entities = conversationState.grievanceEntities || {};
  const lowerText = text.toLowerCase();

  // Category Extraction
  if (!entities.category) {
    if (lowerText.match(/paani|water|jal/i)) entities.category = "Water Supply";
    else if (lowerText.match(/bijli|electricity|light|power/i)) entities.category = "Electricity";
    else if (lowerText.match(/sadak|road|pothole|gaddi/i)) entities.category = "Roads & Potholes";
    else if (lowerText.match(/kachra|garbage|safai|sanitation/i)) entities.category = "Sanitation & Garbage";
    else if (lowerText.match(/bus|transport|traffic/i)) entities.category = "Public Transport";
    else entities.category = "Municipal Services";
  }

  // Location Extraction — ISSUE 2 FIX: Never guess location using raw text slice!
  if (!entities.location) {
    const locMatch = text.match(/(ward\s*\d+|sector\s*\d+|colony|nagar|block\s*[a-z0-9]+|mohalla|street\s*\d+|locality|market|village|gaon)/i);
    if (locMatch) {
      entities.location = locMatch[0];
    } else {
      entities.location = null; // Explicitly set to null if not provided
    }
  }

  // Duration Extraction — ISSUE 3 FIX: Never invent duration!
  if (!entities.duration) {
    const durMatch = text.match(/(\d+\s*(din|days|hours|ghante|weeks|hafte|months|mahine))/i);
    if (durMatch) {
      entities.duration = durMatch[0];
    } else if (lowerText.includes('kal') || lowerText.includes('yesterday')) {
      entities.duration = "Since yesterday";
    } else if (lowerText.includes('aaj') || lowerText.includes('today')) {
      entities.duration = "Today";
    } else {
      entities.duration = null; // Explicitly set to null if not provided
    }
  }

  // Description
  entities.description = entities.description ? `${entities.description} ${text}` : text;

  // Single Question 1: Ask for Location if missing (Issue 2)
  if (!entities.location) {
    const askLocationMsg = language === 'hi'
      ? "आप किस गाँव, वार्ड नंबर, कॉलोनी या लैंडमार्क पर यह समस्या का सामना कर रहे हैं?"
      : "Which village, ward number, colony or landmark is facing this issue?";

    return {
      textResponse: askLocationMsg,
      workflow: 'GRIEVANCE',
      conversationState: { currentIntent: 'GRIEVANCE', grievanceEntities: entities },
      nextStepQuestion: askLocationMsg,
      uiType: 'QUESTION'
    };
  }

  // Single Question 2: Ask for Duration if missing (Issue 3)
  if (!entities.duration) {
    const askDurationMsg = language === 'hi'
      ? "आप कितने दिनों या समय से इस समस्या का सामना कर रहे हैं?"
      : "Since how many days or hours have you been facing this problem?";

    return {
      textResponse: askDurationMsg,
      workflow: 'GRIEVANCE',
      conversationState: { currentIntent: 'GRIEVANCE', grievanceEntities: entities },
      nextStepQuestion: askDurationMsg,
      uiType: 'QUESTION'
    };
  }

  // Department Mapping
  let department = "Municipal Corporation";
  if (entities.category === "Water Supply") department = "Municipal Jal Board";
  else if (entities.category === "Electricity") department = "State Power Distribution Corporation (DISCOM)";
  else if (entities.category === "Roads & Potholes") department = "Public Works Department (PWD)";
  else if (entities.category === "Sanitation & Garbage") department = "Municipal Sanitation Department";

  const previewSummary = {
    category: entities.category,
    department: department,
    location: entities.location,
    duration: entities.duration,
    description: entities.description
  };

  const confirmPrompt = language === 'hi'
    ? "मैंने आपकी शिकायत का निम्नलिखित विवरण तैयार किया है। कृपया शिकायत दर्ज करने से पहले इसकी पुष्टि करें:"
    : "I have prepared the following summary of your grievance. Please confirm the details before submitting:";

  return {
    textResponse: confirmPrompt,
    workflow: 'GRIEVANCE',
    conversationState: { currentIntent: 'GRIEVANCE_CONFIRM', pendingGrievance: previewSummary },
    complaintPreview: previewSummary,
    uiType: 'COMPLAINT_PREVIEW'
  };
};

const submitConfirmedGrievance = async (pendingGrievance) => {
  const ticketId = generateTicketId();

  const newTicket = {
    ticketId,
    category: pendingGrievance.category,
    department: pendingGrievance.department,
    location: pendingGrievance.location,
    duration: pendingGrievance.duration,
    description: pendingGrievance.description,
    status: 'Registered',
    priority: 'Medium',
    assignedOfficer: 'Unassigned',
    history: [
      {
        status: 'Registered',
        updatedAt: new Date(),
        notes: 'Complaint registered via Sahayak Voice & AI Assistant',
        updatedBy: 'Citizen via Sahayak AI'
      }
    ]
  };

  if (getIsConnected()) {
    try {
      await Grievance.create(newTicket);
    } catch (err) {
      getMemoryStore().grievances.unshift(newTicket);
    }
  } else {
    getMemoryStore().grievances.unshift(newTicket);
  }

  return {
    success: true,
    ticket: newTicket
  };
};

const handleTrackingWorkflow = async ({ text, language }) => {
  const ticketMatch = text.match(/GRV-2026-\w{6}/i);
  let ticket = null;

  let allGrievances = [];
  if (getIsConnected()) {
    try {
      allGrievances = await Grievance.find({});
    } catch (err) {
      allGrievances = [...seedGrievances];
    }
  } else {
    const memory = getMemoryStore();
    allGrievances = memory.grievances.length > 0 ? memory.grievances : [...seedGrievances];
  }

  if (ticketMatch) {
    const searchId = ticketMatch[0].toUpperCase();
    ticket = allGrievances.find(g => g.ticketId.toUpperCase() === searchId);
  } else {
    ticket = allGrievances[0];
  }

  if (!ticket) {
    return {
      textResponse: language === 'hi'
        ? "क्षमा करें, मुझे इस शिकायत संख्या से जुड़ी कोई शिकायत नहीं मिली। कृपया अपनी 13-अंकों की शिकायत आईडी (उदा. GRV-2026-894102) की जांच करें।"
        : "Sorry, I couldn't find a grievance record matching that Ticket ID. Please verify your ticket ID (e.g. GRV-2026-894102).",
      workflow: 'TRACKING',
      conversationState: { currentIntent: null },
      uiType: 'TEXT'
    };
  }

  const responseMsg = language === 'hi'
    ? `आपकी शिकायत संख्या ${ticket.ticketId} की वर्तमान स्थिति "${ticket.status}" है:`
    : `Here is the current status for your ticket ${ticket.ticketId}:`;

  return {
    textResponse: responseMsg,
    workflow: 'TRACKING',
    conversationState: { currentIntent: null },
    ticket: ticket.toObject ? ticket.toObject() : ticket,
    uiType: 'TICKET_STATUS'
  };
};

module.exports = {
  processCitizenTurn,
  submitConfirmedGrievance
};
