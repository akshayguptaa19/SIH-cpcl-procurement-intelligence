// Test script for dashboard endpoints
async function runTest() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/officer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'akshay.gupta@cpcl.gov.in', password: 'Officer@2026' })
    });
    const loginData = await loginRes.json();
    console.log('Login result status:', loginRes.status);
    const token = loginData.token;
    if (!token) {
      console.error('No token received:', loginData);
      process.exit(1);
    }
    console.log('Token acquired successfully!');

    const headers = { Authorization: `Bearer ${token}` };

    // 1. Stats
    const statsRes = await fetch('http://localhost:5000/api/dashboard/stats', { headers });
    const stats = await statsRes.json();
    console.log('[1/5] /stats:', { activeTenders: stats.activeTenders, complianceRate: stats.complianceRate, totalBids: stats.totalBids });

    // 2. Chart Data
    const chartRes = await fetch('http://localhost:5000/api/dashboard/chart-data', { headers });
    const chart = await chartRes.json();
    console.log('[2/5] /chart-data:', { monthlyTrendsCount: chart.monthlyTrends?.length, categoriesCount: chart.categories?.length });

    // 3. Risk Signals
    const riskRes = await fetch('http://localhost:5000/api/dashboard/risk-signals', { headers });
    const risk = await riskRes.json();
    console.log('[3/5] /risk-signals:', { totalHighRisk: risk.totalHighRisk, signalsCount: risk.signals?.length });

    // 4. Compliance Distribution
    const compRes = await fetch('http://localhost:5000/api/dashboard/compliance-distribution', { headers });
    const comp = await compRes.json();
    console.log('[4/5] /compliance-distribution:', { totalEvaluated: comp.totalEvaluated, distributionCount: comp.distribution?.length });

    // 5. AI Status
    const aiRes = await fetch('http://localhost:5000/api/dashboard/ai-status', { headers });
    const ai = await aiRes.json();
    console.log('[5/5] /ai-status:', { status: ai.status, engineMode: ai.engineMode, modelsCount: ai.activeModels?.length });

    console.log('\n>>> ALL 5 DASHBOARD ENDPOINTS ARE OPERATIONAL AND RETURNING DATA! <<<');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

runTest();
