const { orchestrateTurn } = require('../server/services/ai');

async function test() {
  console.log("Testing orchestrateTurn logic...");

  const res1 = await orchestrateTurn({ message: "Mujhe PM-KISAN ke baare mein batao" });
  console.log("Test 1 (Scheme Discovery):", res1.uiType, "| Text:", res1.textResponse?.substring(0, 50));

  const res2 = await orchestrateTurn({ message: "Mere area mein 3 din se paani nahi aa raha" });
  console.log("Test 2 (Grievance Intent):", res2.uiType, "| Category:", res2.complaintPreview?.category || "In Progress Workflow");

  const res3 = await orchestrateTurn({ message: "GRV-2026-894102 status" });
  console.log("Test 3 (Tracking):", res3.uiType, "| Ticket:", res3.ticket?.ticketId);

  console.log("Direct AI Orchestration Tests Passed!");
}

test();
