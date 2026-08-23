const http = require('http');

function testOrchestrate(message, conversationState = {}, language = 'hi') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ message, conversationState, language });
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/ai/orchestrate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log("Testing /api/ai/orchestrate live...");
  
  const test1 = await testOrchestrate("Mujhe PM-KISAN ke baare mein batao");
  console.log("Test 1 (Scheme Discovery):", test1.uiType, test1.textResponse ? test1.textResponse.substring(0, 50) + "..." : test1);

  const test2 = await testOrchestrate("Mere area mein 5 din se paani nahi aa raha, main Thatipur Gwalior mein rehta hoon");
  console.log("Test 2 (Grievance Intent):", test2.uiType, test2.complaintPreview ? test2.complaintPreview.category : test2);

  const test3 = await testOrchestrate("Mujhe PM-KISAN ke liye apply karna hai");
  console.log("Test 3 (Apply Intent):", test3.uiType, test3.textResponse ? test3.textResponse.substring(0, 50) + "..." : test3);

  console.log("Live Orchestration Tests Complete!");
}

run();
