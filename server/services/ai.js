const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

let groq = null;
if (process.env.GROQ_API_KEY) {
  try {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } catch (e) {
    console.warn("Groq initialization warning:", e.message);
  }
}

const SCHEME_DATA_PATH = path.join(__dirname, "../data/schemes.json");

function getSchemesData() {
  try {
    const raw = fs.readFileSync(SCHEME_DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return { schemes: [], grievances: [], applications: [] };
  }
}

const UNDERSTAND_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    intent: {
      type: "string",
      enum: [
        "scheme_discovery",
        "scheme_eligibility",
        "scheme_application",
        "grievance_registration",
        "grievance_tracking",
        "general_query"
      ]
    },
    language: {
      type: "string",
      enum: ["hindi", "hinglish", "english", "other"]
    },
    category: {
      type: "string"
    },
    entities: {
      type: "object",
      additionalProperties: false,
      properties: {
        user_type: { type: "string" },
        need: { type: "string" },
        scheme_name: { type: "string" },
        age: { type: "string" },
        annual_income: { type: "string" },
        location: { type: "string" },
        problem: { type: "string" },
        duration: { type: "string" },
        department: { type: "string" },
        priority: { type: "string" }
      },
      required: [
        "user_type",
        "need",
        "scheme_name",
        "age",
        "annual_income",
        "location",
        "problem",
        "duration",
        "department",
        "priority"
      ]
    }
  },
  required: ["intent", "language", "category", "entities"]
};

// Fallback heuristic classification when LLM API is unavailable
function fallbackHeuristicClassify(query) {
  const q = query.toLowerCase();
  let intent = "general_query";
  let language = "hindi";

  if (/[a-zA-Z]/.test(query) && !/[hi|mujhe|kya|hai|nahi|kaise|karo|batao]/i.test(query)) {
    language = "english";
  } else if (/[a-zA-Z]/.test(query)) {
    language = "hinglish";
  }

  if (q.includes("apply") || q.includes("आवेदन") || q.includes("फॉर्म")) {
    intent = "scheme_application";
  } else if (q.includes("grv-") || q.includes("track") || q.includes("स्थिति") || q.includes("status")) {
    intent = "grievance_tracking";
  } else if (q.includes("shikayat") || q.includes("शिकायत") || q.includes("problem") || q.includes("water") || q.includes("paani") || q.includes("bijli") || q.includes("pothole") || q.includes("road") || q.includes("garbage")) {
    intent = "grievance_registration";
  } else if (q.includes("scheme") || q.includes("योजना") || q.includes("kisan") || q.includes("ayushman") || q.includes("awas") || q.includes("scholarship")) {
    intent = "scheme_discovery";
  }

  return {
    intent,
    language,
    category: "general",
    entities: {
      user_type: "not_provided",
      need: "not_provided",
      scheme_name: q.includes("kisan") ? "PM-KISAN" : q.includes("ayushman") ? "Ayushman Bharat" : "not_provided",
      age: "not_provided",
      annual_income: "not_provided",
      location: "not_provided",
      problem: "not_provided",
      duration: "not_provided",
      department: "not_provided",
      priority: "not_provided"
    }
  };
}

async function processQuery(query) {
  if (!query || typeof query !== "string") {
    throw new Error("Query is required");
  }

  if (!groq) {
    return fallbackHeuristicClassify(query);
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      reasoning_effort: "low",
      include_reasoning: false,
      messages: [
        {
          role: "system",
          content: `You are SAHAYAK, an Indian government services AI assistant.
Identify intent (scheme_discovery, scheme_eligibility, scheme_application, grievance_registration, grievance_tracking, general_query), language, and entities.`
        },
        { role: "user", content: query }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sahayak_understanding",
          strict: true,
          schema: UNDERSTAND_SCHEMA
        }
      },
      max_completion_tokens: 500
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.warn("Groq API error, using heuristic fallback:", err.message);
    return fallbackHeuristicClassify(query);
  }
}

async function orchestrateTurn({ message, conversationState = {}, language = "hi" }) {
  const classification = await processQuery(message);
  const detectedLang = classification.language || (language === "hi" ? "hindi" : "english");
  const isHindi = detectedLang === "hindi" || detectedLang === "hinglish" || language === "hi";

  let currentState = { ...conversationState };
  let responseUiType = null;
  let textResponse = "";
  let schemesResult = null;
  let applicationPreview = null;
  let complaintPreview = null;
  let ticketResult = null;

  const dataStore = getSchemesData();
  const lowerMsg = message.toLowerCase();

  // Cancel / Reset check
  if (lowerMsg.includes("cancel") || lowerMsg.includes("रद्द")) {
    return {
      textResponse: isHindi ? "वर्तमान प्रक्रिया रद्द कर दी गई है। मैं आपकी क्या सहायता कर सकता हूँ?" : "The current workflow has been cancelled. How else can I assist you?",
      conversationState: {}
    };
  }

  // 1. If currently in GRIEVANCE workflow
  if (currentState.workflow === "GRIEVANCE") {
    const collected = currentState.collectedData || {};
    
    if (!collected.category) {
      if (lowerMsg.includes("water") || lowerMsg.includes("पानी")) collected.category = "Water Supply";
      else if (lowerMsg.includes("bijli") || lowerMsg.includes("electricity") || lowerMsg.includes("बिजली")) collected.category = "Electricity";
      else if (lowerMsg.includes("road") || lowerMsg.includes("pothole") || lowerMsg.includes("सड़क")) collected.category = "Roads & Potholes";
      else if (lowerMsg.includes("garbage") || lowerMsg.includes("safai") || lowerMsg.includes("कचरा")) collected.category = "Sanitation & Garbage";
      else collected.category = message.trim();
    } else if (!collected.location) {
      collected.location = message.trim();
    } else if (!collected.description) {
      collected.description = message.trim();
    }

    currentState.collectedData = collected;

    if (!collected.category) {
      textResponse = isHindi ? "कृपया अपनी शिकायत की श्रेणी बताएं (जैसे: जल आपूर्ति, बिजली, सड़क, सफाई):" : "Please specify the category of your grievance (e.g., Water Supply, Electricity, Roads, Sanitation):";
    } else if (!collected.location) {
      textResponse = isHindi ? "कृपया घटना या समस्या का सटीक स्थान/वार्ड/लैंडमार्क दर्ज करें:" : "Please enter the exact location/ward/landmark of the issue:";
    } else if (!collected.description) {
      textResponse = isHindi ? "कृपया समस्या का विवरण दर्ज करें:" : "Please describe the problem in detail:";
    } else {
      let dept = "Municipal Services";
      if (collected.category.includes("Water")) dept = "Municipal Jal Board";
      else if (collected.category.includes("Electr")) dept = "State DISCOM";
      else if (collected.category.includes("Road")) dept = "Public Works Department (PWD)";
      else if (collected.category.includes("Sanitat")) dept = "Municipal Sanitation Department";

      complaintPreview = {
        category: collected.category,
        department: dept,
        location: collected.location,
        duration: collected.duration || "Recent",
        description: collected.description,
        priority: "Medium",
        photoAttachment: message.includes("Photo") ? "attached_photo.jpg" : null
      };
      responseUiType = "COMPLAINT_PREVIEW";
      textResponse = isHindi ? "मैंने आपकी शिकायत का विवरण तैयार कर लिया है। कृपया समीक्षा करें और पुष्टि करें:" : "I have generated your complaint preview. Please review and confirm below:";
    }

    return {
      uiType: responseUiType,
      complaintPreview,
      textResponse,
      conversationState: currentState
    };
  }

  // 2. If currently in SCHEME_APPLICATION workflow
  if (currentState.workflow === "SCHEME_APPLICATION") {
    const collected = currentState.collectedData || {};
    const schemeName = currentState.schemeName || "PM Kisan Samman Nidhi (PM-KISAN)";

    if (!collected.applicantName) {
      collected.applicantName = message.trim();
    } else if (!collected.aadhaarNumber) {
      collected.aadhaarNumber = message.trim();
    } else if (!collected.bankAccount) {
      collected.bankAccount = message.trim();
    } else if (!collected.ifscCode) {
      collected.ifscCode = message.trim();
    }

    currentState.collectedData = collected;

    if (!collected.applicantName) {
      textResponse = isHindi ? `कृपया ${schemeName} आवेदन के लिए आवेदक का पूरा नाम दर्ज करें:` : `Please enter the applicant's full name for ${schemeName}:`;
    } else if (!collected.aadhaarNumber) {
      textResponse = isHindi ? "कृपया आधार कार्ड नंबर दर्ज करें:" : "Please enter the Aadhaar Card number:";
    } else if (!collected.bankAccount) {
      textResponse = isHindi ? "कृपया बैंक खाता संख्या दर्ज करें:" : "Please enter the Bank Account number:";
    } else if (!collected.ifscCode) {
      textResponse = isHindi ? "कृपया बैंक IFSC कोड दर्ज करें:" : "Please enter the Bank IFSC code:";
    } else {
      applicationPreview = {
        schemeId: currentState.schemeId || "SCH-001",
        schemeName,
        applicantName: collected.applicantName,
        aadhaarNumber: collected.aadhaarNumber,
        bankAccount: collected.bankAccount,
        ifscCode: collected.ifscCode,
        sections: [
          {
            sectionLabel: isHindi ? "आवेदक विवरण" : "Applicant Details",
            fields: [
              { id: "applicantName", label: isHindi ? "आवेदक का नाम" : "Applicant Name", value: collected.applicantName },
              { id: "aadhaarNumber", label: isHindi ? "आधार संख्या" : "Aadhaar Number", value: collected.aadhaarNumber }
            ]
          },
          {
            sectionLabel: isHindi ? "बैंक खाता विवरण" : "Bank Account Details",
            fields: [
              { id: "bankAccount", label: isHindi ? "खाता संख्या" : "Bank Account No.", value: collected.bankAccount },
              { id: "ifscCode", label: isHindi ? "IFSC कोड" : "IFSC Code", value: collected.ifscCode }
            ]
          }
        ]
      };
      responseUiType = "SCHEME_APPLICATION_PREVIEW";
      textResponse = isHindi ? "आपके आवेदन का विवरण तैयार है। सबमिट करने से पहले कृपया समीक्षा करें:" : "Your application preview is ready. Please review details before final submission:";
    }

    return {
      uiType: responseUiType,
      applicationPreview,
      textResponse,
      conversationState: currentState
    };
  }

  // 3. New Intent Routing

  // Intent: Grievance Tracking
  if (classification.intent === "grievance_tracking" || lowerMsg.includes("grv-") || lowerMsg.includes("app-") || lowerMsg.includes("track")) {
    const match = message.match(/(GRV-\d{4}-\d{6}|APP-\d{4}-\d{6})/i);
    const searchId = match ? match[0].toUpperCase() : "GRV-2026-894102";

    let ticket = dataStore.grievances.find(g => g.ticketId.toUpperCase() === searchId);
    if (ticket) {
      return {
        uiType: "TICKET_STATUS",
        ticket,
        textResponse: isHindi ? `टिकट ${searchId} की वर्तमान स्थिति नीचे दी गई है:` : `Here is the current timeline status for ticket ${searchId}:`,
        conversationState: {}
      };
    } else {
      textResponse = isHindi ? `टिकट ID ${searchId} नहीं मिला। कृपया अपना सही टिकट ID जांचें।` : `Ticket ID ${searchId} was not found. Please verify your tracking number.`;
      return { textResponse, conversationState: {} };
    }
  }

  // Intent: Grievance Registration
  if (classification.intent === "grievance_registration" || lowerMsg.includes("shikayat") || lowerMsg.includes("शिकायत") || lowerMsg.includes("problem") || lowerMsg.includes("paani") || lowerMsg.includes("water") || lowerMsg.includes("bijli") || lowerMsg.includes("road")) {
    currentState = {
      workflow: "GRIEVANCE",
      collectedData: {},
      missingFields: ["category", "location", "description"]
    };

    // Pre-fill if present in message
    if (lowerMsg.includes("water") || lowerMsg.includes("पानी")) currentState.collectedData.category = "Water Supply";
    else if (lowerMsg.includes("bijli") || lowerMsg.includes("electricity") || lowerMsg.includes("बिजली")) currentState.collectedData.category = "Electricity";
    else if (lowerMsg.includes("road") || lowerMsg.includes("pothole") || lowerMsg.includes("सड़क")) currentState.collectedData.category = "Roads & Potholes";
    else if (lowerMsg.includes("garbage") || lowerMsg.includes("कचरा")) currentState.collectedData.category = "Sanitation & Garbage";

    if (classification.entities && classification.entities.location !== "not_provided") {
      currentState.collectedData.location = classification.entities.location;
    }
    if (classification.entities && classification.entities.problem !== "not_provided") {
      currentState.collectedData.description = classification.entities.problem;
    }

    if (!currentState.collectedData.category) {
      textResponse = isHindi ? "मैं आपकी शिकायत दर्ज करने में मदद करूँगा। कृपया अपनी समस्या की श्रेणी (जैसे: पानी, बिजली, सड़क, सफाई) बताएं:" : "I will assist you in registering a complaint. Please state the category (e.g. Water, Electricity, Roads, Sanitation):";
    } else if (!currentState.collectedData.location) {
      textResponse = isHindi ? `श्रेणी: ${currentState.collectedData.category}। कृपया समस्या का स्थान या वार्ड दर्ज करें:` : `Category: ${currentState.collectedData.category}. Please specify the location or ward:`;
    } else if (!currentState.collectedData.description) {
      textResponse = isHindi ? "कृपया समस्या का विवरण लिखें:" : "Please describe the problem in detail:";
    } else {
      complaintPreview = {
        category: currentState.collectedData.category,
        department: "Municipal Services",
        location: currentState.collectedData.location,
        duration: "Recent",
        description: currentState.collectedData.description,
        priority: "Medium"
      };
      responseUiType = "COMPLAINT_PREVIEW";
      textResponse = isHindi ? "आपकी शिकायत का विवरण तैयार है:" : "Here is your complaint preview:";
    }

    return {
      uiType: responseUiType,
      complaintPreview,
      textResponse,
      conversationState: currentState
    };
  }

  // Intent: Scheme Application
  if (classification.intent === "scheme_application" || lowerMsg.includes("apply") || lowerMsg.includes("आवेदन")) {
    let targetScheme = dataStore.schemes.find(s => lowerMsg.includes(s.name.toLowerCase()) || lowerMsg.includes(s.schemeId.toLowerCase())) || dataStore.schemes[0];
    
    currentState = {
      workflow: "SCHEME_APPLICATION",
      schemeId: targetScheme.schemeId,
      schemeName: targetScheme.name,
      collectedData: {},
      missingFields: ["applicantName", "aadhaarNumber", "bankAccount", "ifscCode"]
    };

    textResponse = isHindi
      ? `सहायक से ${targetScheme.name} में आवेदन शुरू किया जा रहा है। कृपया आवेदक का पूरा नाम बताएं:`
      : `Starting application for ${targetScheme.name}. Please enter the applicant's full name:`;

    return {
      textResponse,
      conversationState: currentState
    };
  }

  // Intent: Scheme Discovery / Eligibility
  if (classification.intent === "scheme_discovery" || classification.intent === "scheme_eligibility" || lowerMsg.includes("scheme") || lowerMsg.includes("योजना") || lowerMsg.includes("kisan") || lowerMsg.includes("ayushman") || lowerMsg.includes("awas") || lowerMsg.includes("scholarship") || lowerMsg.includes("pension") || lowerMsg.includes("vendor")) {
    let filtered = dataStore.schemes;

    if (lowerMsg.includes("kisan") || lowerMsg.includes("farmer") || lowerMsg.includes("किसान")) {
      filtered = dataStore.schemes.filter(s => s.schemeId === "SCH-001");
    } else if (lowerMsg.includes("ayushman") || lowerMsg.includes("health") || lowerMsg.includes("स्वास्थ्य")) {
      filtered = dataStore.schemes.filter(s => s.schemeId === "SCH-002");
    } else if (lowerMsg.includes("awas") || lowerMsg.includes("house") || lowerMsg.includes("आवास")) {
      filtered = dataStore.schemes.filter(s => s.schemeId === "SCH-003");
    } else if (lowerMsg.includes("scholarship") || lowerMsg.includes("student") || lowerMsg.includes("छात्रवृत्ति")) {
      filtered = dataStore.schemes.filter(s => s.schemeId === "SCH-004");
    } else if (lowerMsg.includes("vendor") || lowerMsg.includes("svanidhi") || lowerMsg.includes("रेहड़ी")) {
      filtered = dataStore.schemes.filter(s => s.schemeId === "SCH-005");
    } else if (lowerMsg.includes("sukanya") || lowerMsg.includes("girl") || lowerMsg.includes("कन्या")) {
      filtered = dataStore.schemes.filter(s => s.schemeId === "SCH-006");
    } else if (lowerMsg.includes("pension") || lowerMsg.includes("old age") || lowerMsg.includes("पेंशन")) {
      filtered = dataStore.schemes.filter(s => s.schemeId === "SCH-007");
    }

    textResponse = isHindi
      ? `आपकी आवश्यकता के अनुसार ${filtered.length} उपयुक्त योजनाएं मिली हैं. विस्तृत जानकारी के लिए कार्ड देखें:`
      : `Based on your query, here are ${filtered.length} matching government schemes for you:`;

    return {
      uiType: "SCHEME_RESULTS",
      schemes: filtered,
      textResponse,
      conversationState: {}
    };
  }

  // Fallback General Response
  textResponse = isHindi
    ? "नमस्ते! मैं आपका सहायक AI हूँ। आप मुझसे सरकारी योजनाओं की जानकारी प्राप्त कर सकते हैं, योजना के लिए आवेदन कर सकते हैं या किसी भी नागरिक समस्या की शिकायत दर्ज कर सकते हैं।"
    : "Hello! I am your Sahayak AI Assistant. You can discover government schemes, apply directly inside Sahayak, or register civil grievances in natural language.";

  return {
    textResponse,
    conversationState: {}
  };
}

module.exports = {
  processQuery,
  orchestrateTurn
};