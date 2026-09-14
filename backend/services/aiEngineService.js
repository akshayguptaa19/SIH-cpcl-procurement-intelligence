import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');
const runAnalysisScript = path.join(backendRoot, 'ai_engine', 'run_analysis.py');

/**
 * Standard Demo / Mock Verification Portal Results
 * Explicitly labeled as Demo/Mock to never misrepresent simulated checks as real government API gateways.
 */
export function getDefaultPortalResults(overrides = {}) {
  const defaults = {
    gst: {
      status: 'verified',
      source: 'GSTN Gateway (Demo/Mock Verification)',
      is_mock: true,
      timestamp: new Date().toISOString(),
      note: 'Simulated statutory verification against active GSTN database'
    },
    pan: {
      status: 'verified',
      source: 'Income Tax Department (Demo/Mock Verification)',
      is_mock: true,
      timestamp: new Date().toISOString(),
      note: 'Simulated PAN entity linkage and status check'
    },
    udyam_msme: {
      status: 'verified',
      source: 'Ministry of MSME Udyam Portal (Demo/Mock Verification)',
      is_mock: true,
      timestamp: new Date().toISOString(),
      note: 'Simulated Udyam Registration validity'
    },
    blacklisting: {
      status: 'clear',
      source: 'Central Public Procurement Portal Debarment Registry (Demo/Mock Verification)',
      is_mock: true,
      timestamp: new Date().toISOString(),
      note: 'No debarment record found across MoPNG / CPPP lists'
    },
    epfo: {
      status: 'verified',
      source: 'EPFO Unified Portal (Demo/Mock Verification)',
      is_mock: true,
      timestamp: new Date().toISOString()
    },
    esic: {
      status: 'verified',
      source: 'ESIC Shram Suvidha Gateway (Demo/Mock Verification)',
      is_mock: true,
      timestamp: new Date().toISOString()
    },
    mca: {
      status: 'verified',
      source: 'MCA21 Sovereign Registry (Demo/Mock Verification)',
      is_mock: true,
      timestamp: new Date().toISOString()
    },
    make_in_india: {
      status: 'review',
      source: 'Self-Certification Review (Demo/Mock)',
      is_mock: true,
      timestamp: new Date().toISOString(),
      note: 'Local content % extracted via document text; pending officer review'
    }
  };

  return { ...defaults, ...(overrides || {}) };
}

/**
 * Executes the Python AI Engine analyze_bid_from_file via child process bridge.
 * 
 * @param {Object} params
 * @param {string} params.tenderTitle
 * @param {string} params.tenderDescription
 * @param {string} params.bidderDocumentPath - Absolute or relative path to PDF/image
 * @param {Object} [params.portalResults] - Custom or simulated portal verification states
 * @param {boolean} [params.runDocumentStructure=false] - Whether to execute LayoutLMv3
 * @param {number} [params.timeoutMs=60000] - Process timeout in ms
 * @returns {Promise<Object>} AI analysis output JSON
 */
export function runAiAnalysis({
  tenderTitle = '',
  tenderDescription = '',
  bidderDocumentPath,
  portalResults = null,
  runDocumentStructure = false,
  timeoutMs = 60000
}) {
  return new Promise((resolve, reject) => {
    if (!bidderDocumentPath) {
      return reject(new Error('Bidder document path is required for AI analysis.'));
    }

    const resolvedDocPath = path.resolve(bidderDocumentPath);
    if (!fs.existsSync(resolvedDocPath)) {
      return reject(new Error(`Bidder document not found on server at: ${resolvedDocPath}`));
    }

    const effectivePortalResults = portalResults || getDefaultPortalResults();

    const payload = {
      tender_title: tenderTitle || '',
      tender_description: tenderDescription || '',
      bidder_document_path: resolvedDocPath,
      portal_results: effectivePortalResults,
      run_document_structure: Boolean(runDocumentStructure)
    };

    const pythonBin = process.env.PYTHON_BIN || 'python';
    const pyProcess = spawn(pythonBin, [runAnalysisScript], {
      cwd: backendRoot,
      env: {
        ...process.env,
        PYTHONPATH: backendRoot,
        PYTHONWARNINGS: 'ignore'
      },
      windowsHide: true
    });

    let stdoutData = '';
    let stderrData = '';
    let isCompleted = false;

    const timer = setTimeout(() => {
      if (!isCompleted) {
        isCompleted = true;
        pyProcess.kill();
        reject(new Error(`AI Analysis timed out after ${timeoutMs / 1000}s. Document may be too large or unreadable.`));
      }
    }, timeoutMs);

    pyProcess.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    pyProcess.on('error', (err) => {
      if (!isCompleted) {
        isCompleted = true;
        clearTimeout(timer);
        reject(new Error(`Failed to start AI Python subagent: ${err.message}`));
      }
    });

    pyProcess.on('close', (code) => {
      if (isCompleted) return;
      isCompleted = true;
      clearTimeout(timer);

      // Attempt to extract JSON from stdout lines
      try {
        const lines = stdoutData.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        let parsed = null;

        // Search backward for the JSON response line
        for (let i = lines.length - 1; i >= 0; i--) {
          const line = lines[i];
          if ((line.startsWith('{') && line.endsWith('}')) || (line.startsWith('{"success":'))) {
            try {
              parsed = JSON.parse(line);
              break;
            } catch (e) {
              // try next candidate
            }
          }
        }

        if (!parsed && stdoutData.trim()) {
          const firstBrace = stdoutData.indexOf('{');
          const lastBrace = stdoutData.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            parsed = JSON.parse(stdoutData.substring(firstBrace, lastBrace + 1));
          }
        }

        if (!parsed) {
          throw new Error(
            `Invalid JSON response from AI module (exit code ${code}). Stderr: ${stderrData || 'None'}. Stdout: ${stdoutData.substring(0, 300)}`
          );
        }

        if (parsed.success === false) {
          const error = new Error(parsed.error || 'AI Analysis failed');
          error.details = parsed.details;
          return reject(error);
        }

        return resolve(parsed.data);
      } catch (parseErr) {
        const error = new Error(`AI processing failure: ${parseErr.message}`);
        error.stderr = stderrData;
        error.stdout = stdoutData;
        return reject(error);
      }
    });

    // Write input JSON safely to stdin
    try {
      pyProcess.stdin.write(JSON.stringify(payload));
      pyProcess.stdin.end();
    } catch (writeErr) {
      if (!isCompleted) {
        isCompleted = true;
        clearTimeout(timer);
        reject(new Error(`Failed to send data to AI Engine: ${writeErr.message}`));
      }
    }
  });
}
