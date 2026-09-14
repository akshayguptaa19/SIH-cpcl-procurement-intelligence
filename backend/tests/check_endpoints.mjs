import fs from 'node:fs';

const endpoints = [
  { path: '/api', method: 'GET', auth: false },
  { path: '/api/system/health', method: 'GET', auth: false },
  { path: '/api/tenders', method: 'GET', auth: false },
  { path: '/api/bidders', method: 'GET', auth: true },
  { path: '/api/applications', method: 'GET', auth: true },
  { path: '/api/documents', method: 'GET', auth: true },
  { path: '/api/verification/queue', method: 'GET', auth: true },
  { path: '/api/verification/cases', method: 'GET', auth: true },
  { path: '/api/clarifications', method: 'GET', auth: true },
  { path: '/api/compliance', method: 'GET', auth: true },
  { path: '/api/compliance/rules', method: 'GET', auth: true },
  { path: '/api/risk/overview', method: 'GET', auth: true },
  { path: '/api/risk/summary', method: 'GET', auth: true },
  { path: '/api/insights', method: 'GET', auth: true },
  { path: '/api/insights/patterns', method: 'GET', auth: true },
  { path: '/api/reports', method: 'GET', auth: true },
  { path: '/api/reports/turnover-distribution', method: 'GET', auth: true },
  { path: '/api/reports/executive-summary', method: 'GET', auth: true },
  { path: '/api/audit', method: 'GET', auth: true },
  { path: '/api/dashboard/stats', method: 'GET', auth: true },
  { path: '/api/dashboard/recent-activity', method: 'GET', auth: true },
  { path: '/api/dashboard/risk-signals', method: 'GET', auth: true },
  { path: '/api/notifications', method: 'GET', auth: true }
];

async function checkAll() {
  console.log('--- 1. Authenticating as Officer Akshay Gupta ---');
  let token = null;
  try {
    const loginRes = await fetch('http://127.0.0.1:5000/api/auth/officer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'akshay.gupta@cpcl.gov.in',
        password: 'Officer@2026'
      })
    });
    const loginData = await loginRes.json();
    if (loginData.token) {
      token = loginData.token;
      console.log(`[SUCCESS] Authenticated! User: ${loginData.user?.full_name} (${loginData.user?.role})\n`);
    } else {
      console.log('[WARN] Login did not return token:', loginData);
    }
  } catch (err) {
    console.error('[ERROR] Authentication failed:', err.message);
  }

  console.log('--- 2. Verifying All Backend Endpoints ---');
  let pass = 0;
  let fail = 0;

  for (const ep of endpoints) {
    try {
      const headers = {};
      if (ep.auth && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`http://127.0.0.1:5000${ep.path}`, {
        method: ep.method,
        headers
      });

      if (res.ok) {
        console.log(`[PASS ${res.status}] ${ep.path}`);
        pass++;
      } else {
        const text = await res.text();
        console.log(`[FAIL ${res.status}] ${ep.path} -> ${text.slice(0, 120)}`);
        fail++;
      }
    } catch (err) {
      console.log(`[ERR] ${ep.path} -> ${err.message}`);
      fail++;
    }
  }

  console.log(`\nEndpoint Results: ${pass} passed, ${fail} failed.`);

  console.log('\n--- 3. Testing Live AI Bid Analysis Integration ---');
  try {
    const aiRes = await fetch('http://127.0.0.1:5000/api/ai/analyze-bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenderTitle: 'Supply of Industrial High Pressure Ball Valves',
        tenderDescription: 'Refinery Grade Valves with statutory GST and PAN checks',
        bidderDocumentPath: 'backend/uploads/Apex_Mismatch_Anomaly_Bid_1789418024207_322983.pdf'
      })
    });
    const aiData = await aiRes.json();
    if (aiData.success && aiData.ai_result) {
      const classification = aiData.ai_result.tender_classification;
      const compliance = aiData.ai_result.compliance_assessment;
      console.log(`[PASS] AI Analysis Success!`);
      console.log(`       Tender Classification Model: ${classification?.model}`);
      console.log(`       Predicted Tender Type: ${classification?.tender_type}`);
      console.log(`       Compliance Score: ${compliance?.compliance_score}% (Risk: ${compliance?.risk_level})`);
      console.log(`       Checks Run: ${compliance?.checks?.length} checks`);
    } else {
      console.log('[FAIL] AI Analysis response:', aiData);
    }
  } catch (err) {
    console.error('[ERR] AI Analysis failed:', err.message);
  }
}

checkAll();
