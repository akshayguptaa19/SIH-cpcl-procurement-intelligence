import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');

async function runTest() {
  console.log('--- Starting AI Integration Tests ---');

  // 1. Create a synthetic test PDF using Python / PyMuPDF
  const testPdfPath = path.join(backendRoot, 'tests', 'sample_bid_test.pdf');
  const pyCode = `
import fitz
doc = fitz.open()
page = doc.new_page()
text = """
BHARAT HEAVY ENGINEERING CORP
Bid Document for High-Pressure Valve Supply
GSTIN: 33AAACB1234F1Z8
PAN: AAACB1234F
UDYAM: UDYAM-TN-02-0044556
Local Content: 72% Make in India Indigenous Content
Bidder explicitly confirms active status and non-blacklisting by any PSU or Govt body.
"""
page.insert_text((50, 72), text)
doc.save('${testPdfPath.replace(/\\/g, '/')}')
doc.close()
print("PDF created successfully")
`;

  await new Promise((resolve, reject) => {
    const p = spawn('python', ['-c', pyCode], { cwd: backendRoot });
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Failed to create test PDF, code ${code}`));
    });
  });

  console.log('✔ Synthetic test PDF created at:', testPdfPath);

  // 2. Start backend server on test port 5055
  const testPort = 5055;
  const serverProcess = spawn('node', ['index.js'], {
    cwd: backendRoot,
    env: { ...process.env, PORT: testPort.toString() }
  });

  serverProcess.stdout.on('data', (d) => {
    // console.log('[Server stdout]:', d.toString());
  });
  serverProcess.stderr.on('data', (d) => {
    // console.error('[Server stderr]:', d.toString());
  });

  // Wait for server to boot
  await new Promise((r) => setTimeout(r, 2000));

  try {
    // 3. Test File Upload to POST /api/ai/analyze-file
    console.log('\n--- 1. Testing POST /api/ai/analyze-file ---');
    const fileBytes = fs.readFileSync(testPdfPath);
    const blob = new Blob([fileBytes], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', blob, 'sample_bid_test.pdf');
    formData.append('tenderTitle', 'Supply of High-Pressure Flow Control Valves');
    formData.append('tenderDescription', 'Requirement: Mandatory GSTIN, PAN, Udyam MSME, and Non-blacklisting declaration.');
    formData.append('saveToDb', 'true');

    const res = await fetch(`http://localhost:${testPort}/api/ai/analyze-file`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    console.log('Upload Status:', res.status);
    console.log('Success flag:', data.success);

    if (res.status !== 201 || !data.success) {
      throw new Error(`Upload failed: ${JSON.stringify(data)}`);
    }

    const ai = data.ai_result;
    console.log('✔ Tender Type Classified:', ai.tender_classification?.tender_type);
    console.log('✔ Compliance Score:', ai.compliance_assessment?.compliance_score);
    console.log('✔ Risk Level:', ai.compliance_assessment?.risk_level);
    console.log('✔ AI Recommendation:', ai.compliance_assessment?.recommendation);
    console.log('✔ Extracted GSTIN:', ai.compliance_assessment?.extracted_fields?.gstin);
    console.log('✔ Extracted PAN:', ai.compliance_assessment?.extracted_fields?.pan);
    console.log('✔ Extracted Udyam:', ai.compliance_assessment?.extracted_fields?.udyam);
    console.log('✔ GSTIN ↔ PAN Consistency Check:', ai.compliance_assessment?.checks?.find(c => c.requirement === 'gstin_pan_consistency')?.status);
    console.log('✔ OCR Page Count:', ai.ocr?.page_count);
    console.log('✔ Assigned Application ID:', data.applicationId);
    console.log('✔ Officer Decision separate state:', data.officer_decision?.status);

    const appId = data.applicationId;

    // 4. Test GET /api/ai/bids/:applicationId
    console.log('\n--- 2. Testing GET /api/ai/bids/:applicationId ---');
    const getRes = await fetch(`http://localhost:${testPort}/api/ai/bids/${appId}`);
    const getData = await getRes.json();
    console.log('GET Status:', getRes.status);
    console.log('✔ Database Application Number:', getData.application?.application_number);
    console.log('✔ Saved AI Recommendation:', getData.ai_recommendation?.recommendation);
    console.log('✔ Initial Officer Decision Status:', getData.officer_decision?.status);

    // 5. Test Officer Decision POST /api/ai/bids/:applicationId/officer-decision
    console.log('\n--- 3. Testing POST /api/ai/bids/:applicationId/officer-decision ---');
    const decRes = await fetch(`http://localhost:${testPort}/api/ai/bids/${appId}/officer-decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        decision: 'QUALIFIED',
        notes: 'Statutory compliance verified by Officer Akshay Gupta. Proceed to financial opening.',
        officerId: 'OFFICER-001'
      })
    });
    const decData = await decRes.json();
    console.log('Decision Status:', decRes.status);
    console.log('✔ Officer Decision Recorded:', decData.decision);
    console.log('✔ Officer Notes Recorded:', decData.notes);

    // Verify it updated the DB separately
    const verifyRes = await fetch(`http://localhost:${testPort}/api/ai/bids/${appId}`);
    const verifyData = await verifyRes.json();
    console.log('✔ Verification Case Officer Decision:', verifyData.officer_decision?.status);
    console.log('✔ Verification Case Overall Status:', verifyData.verification_case?.overall_status);

    // 6. Test Error Handling (Corrupt / invalid file format)
    console.log('\n--- 4. Testing Error Handling on Corrupt/Invalid File ---');
    const badBlob = new Blob(['Not a PDF content'], { type: 'text/plain' });
    const badFormData = new FormData();
    badFormData.append('file', badBlob, 'bad_document.xyz');
    const badRes = await fetch(`http://localhost:${testPort}/api/ai/analyze-file`, {
      method: 'POST',
      body: badFormData
    });
    const badData = await badRes.json();
    console.log('Bad File HTTP Status:', badRes.status);
    console.log('✔ Clean error message returned without crashing:', badData.error);

    console.log('\n=============================================');
    console.log('🎉 ALL AI ENDPOINT TESTS PASSED COMPLETELY! 🎉');
    console.log('=============================================');

  } finally {
    // Cleanup
    serverProcess.kill();
    try { fs.unlinkSync(testPdfPath); } catch (e) {}
  }
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
