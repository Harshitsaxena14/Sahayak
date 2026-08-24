const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const prisma = require("../lib/prisma");

const { processQuery, orchestrateTurn } = require("../services/ai");


const DATA_PATH = path.join(__dirname, "../data/schemes.json");

function readJsonData() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return { schemes: [], grievances: [], applications: [] };
  }
}

function writeJsonData(data) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing schemes.json:", err.message);
  }
}

// POST /api/ai/understand
router.post("/understand", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }
    const result = await processQuery(message);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("AI Understand Error:", error);
    res.status(500).json({ success: false, error: "AI processing failed" });
  }
});

// POST /api/ai/orchestrate
router.post("/orchestrate", async (req, res) => {
  try {
    const { message, conversationState, language } = req.body;
    if (!message && !conversationState) {
      return res.status(400).json({ success: false, error: "Message or state is required" });
    }

    const result = await orchestrateTurn({
      message: message || "",
      conversationState: conversationState || {},
      language: language || "hi"
    });

    res.json(result);
  } catch (error) {
    console.error("AI Orchestrate Error:", error);
    res.status(500).json({ success: false, error: "Orchestration failed" });
  }
});

// POST /api/ai/confirm-grievance
router.post("/confirm-grievance", async (req, res) => {
  try {
    const { pendingGrievance } = req.body;
    const ticketId = `GRV-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket = {
      ticketId,
      category: pendingGrievance?.category || "General Service",
      department: pendingGrievance?.department || "Municipal Services",
      location: pendingGrievance?.location || "Ward 1",
      duration: pendingGrievance?.duration || "Recent",
      description: pendingGrievance?.description || "Civil grievance submitted via Sahayak AI Assistant",
      citizenPhone: pendingGrievance?.citizenPhone || "+91 98765 00000",
      status: "Registered",
      priority: pendingGrievance?.priority || "Medium",
      assignedOfficer: "Unassigned",
      history: [
        {
          status: "Registered",
          updatedAt: new Date().toISOString(),
          notes: "Complaint registered via Sahayak AI Assistant",
          updatedBy: "System"
        }
      ],
      resolutionNotes: ""
    };

    await prisma.grievance.create({
  data: {
    ticketId: newTicket.ticketId,
    category: newTicket.category,
    department: newTicket.department,
    location: newTicket.location,
    duration: newTicket.duration,
    description: newTicket.description,
    citizenPhone: newTicket.citizenPhone,
    status: newTicket.status,
    priority: newTicket.priority,
    assignedOfficer: newTicket.assignedOfficer,
    history: newTicket.history,
    resolutionNotes: newTicket.resolutionNotes
  }
});

    res.json({ success: true, ticket: newTicket });
  } catch (error) {
    console.error("Confirm Grievance Error:", error);
    res.status(500).json({ success: false, error: "Failed to confirm grievance" });
  }
});

// POST /api/ai/confirm-application
router.post("/confirm-application", async (req, res) => {
  try {
    const { pendingApplication } = req.body;
    const applicationId = `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newApp = {
      applicationId,
      schemeId: pendingApplication?.schemeId || "SCH-001",
      schemeName: pendingApplication?.schemeName || "PM Kisan Samman Nidhi (PM-KISAN)",
      applicantName: pendingApplication?.applicantName || "Citizen",
      details: pendingApplication || {},
      status: "Submitted",
      history: [
        {
          status: "Submitted",
          updatedAt: new Date().toISOString(),
          notes: "Scheme application submitted directly via Sahayak",
          updatedBy: "Citizen"
        }
      ]
    };

  await prisma.application.create({
  data: {
    applicationId: newApp.applicationId,
    schemeId: newApp.schemeId,
    schemeName: newApp.schemeName,
    applicantName: newApp.applicantName,
    details: newApp.details,
    status: newApp.status,
    history: newApp.history
  }
});

    res.json({ success: true, application: newApp });
  } catch (error) {
    console.error("Confirm Application Error:", error);
    res.status(500).json({ success: false, error: "Failed to confirm application" });
  }
});

module.exports = router;