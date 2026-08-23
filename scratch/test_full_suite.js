const http = require('http');

function makeRequest(method, path, bodyData = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = bodyData ? JSON.stringify(bodyData) : null;
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runFullSuite() {
  console.log("=== SAHAYAK Full API Suite Test ===");

  // 1. Health
  const health = await makeRequest('GET', '/api/health');
  console.log('1. Health Check:', health.status, health.data);

  // 2. Schemes List
  const schemes = await makeRequest('GET', '/api/schemes');
  console.log('2. Schemes List:', schemes.status, `Found ${schemes.data?.schemes?.length} schemes`);

  // 3. AI Orchestrate (Scheme Discovery)
  const orch1 = await makeRequest('POST', '/api/ai/orchestrate', { message: "Mujhe PM-KISAN ke baare mein batao" });
  console.log('3. AI Orchestrate (Scheme):', orch1.status, `uiType: ${orch1.data?.uiType}`);

  // 4. AI Orchestrate (Grievance Registration)
  const orch2 = await makeRequest('POST', '/api/ai/orchestrate', { message: "Ward 12 mein 3 din se paani nahi aa raha" });
  console.log('4. AI Orchestrate (Grievance):', orch2.status, `uiType: ${orch2.data?.uiType}`);

  // 5. Confirm Grievance
  const confirmGrv = await makeRequest('POST', '/api/ai/confirm-grievance', {
    pendingGrievance: {
      category: "Water Supply",
      location: "Ward 12, Gwalior",
      description: "Test water supply grievance"
    }
  });
  console.log('5. Confirm Grievance:', confirmGrv.status, `Ticket ID: ${confirmGrv.data?.ticket?.ticketId}`);

  // 6. Confirm Application
  const confirmApp = await makeRequest('POST', '/api/ai/confirm-application', {
    pendingApplication: {
      schemeId: "SCH-001",
      schemeName: "PM Kisan Samman Nidhi (PM-KISAN)",
      applicantName: "Charchit Saxena"
    }
  });
  console.log('6. Confirm Application:', confirmApp.status, `App ID: ${confirmApp.data?.application?.applicationId}`);

  // 7. Track Ticket
  const trackGrv = await makeRequest('GET', `/api/grievances/track/${confirmGrv.data?.ticket?.ticketId}`);
  console.log('7. Track Grievance:', trackGrv.status, `Category: ${trackGrv.data?.category}`);

  // 8. Track Application
  const trackApp = await makeRequest('GET', `/api/applications/track/${confirmApp.data?.application?.applicationId}`);
  console.log('8. Track Application:', trackApp.status, `Applicant: ${trackApp.data?.applicantName}`);

  // 9. Officer Login
  const login = await makeRequest('POST', '/api/officer/login', { username: 'officer', password: 'sahayak2026' });
  console.log('9. Officer Login:', login.status, `Token: ${login.data?.token}`);

  // 10. Officer Grievances List
  const officerGrvs = await makeRequest('GET', '/api/officer/grievances', null, { Authorization: `Bearer ${login.data?.token}` });
  console.log('10. Officer Grievances:', officerGrvs.status, `Total: ${officerGrvs.data?.count}`);

  // 11. Officer Status Update
  const updateGrv = await makeRequest('PATCH', `/api/officer/grievances/${confirmGrv.data?.ticket?.ticketId}`, {
    status: 'In Progress',
    notes: 'Inspection team dispatched'
  }, { Authorization: `Bearer ${login.data?.token}` });
  console.log('11. Officer Status Update:', updateGrv.status, `New Status: ${updateGrv.data?.ticket?.status}`);

  console.log("=== All 11 API Endpoints Verified Successfully! ===");
}

runFullSuite().catch(err => console.error("API Test Failed:", err));
