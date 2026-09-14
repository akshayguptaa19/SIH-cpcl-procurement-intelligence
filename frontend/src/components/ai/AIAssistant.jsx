"use client";
import { useState } from "react";
import { Brain, Send, User, AlertCircle } from "lucide-react";
const PRESET_QUESTIONS = [
  "Why is Noble Industrials high risk?",
  "Which mandatory documents are missing?",
  "Compare ABC Engineering and Noble Industrials",
  "Which bidders failed turnover requirements?",
  "Show all PAN-GST mismatches"
];
const DEMO_ANSWERS = {
  "Why is Noble Industrials high risk?": {
    content: `Noble Industrials has been flagged as **Critical Risk** due to 4 major findings:

**1. PAN-GST Name Mismatch (Confidence: 98%)**
\u2022 PAN Name: "Noble Industrials Ltd"
\u2022 GST Name: "XYZ Industrial Solutions Pvt Ltd"
\u2022 These are critically different entities. Possible identity fraud.

**2. Past Debarment Record (Confidence: 99%)**
\u2022 CERSAI registry shows debarment by Ministry of Defence (2022\u20132024)
\u2022 Period has expired but record exists and must be reviewed

**3. OEM Authorization Missing (Confidence: 100%)**
\u2022 The tender requires OEM authorization for petroleum equipment
\u2022 No such document was submitted or detected

**4. Blacklisting Alert (Confidence: 99%)**
\u2022 Cross-referenced with multiple ministry blacklisting databases
\u2022 Record found in MCA compliance database

\u26A0\uFE0F **Important:** These are AI findings. The Procurement Officer must review all evidence before making a final qualification or disqualification decision.`,
    sources: ["CERSAI API Response", "GST Certificate.pdf", "PAN Card.pdf", "OEM Document Review"],
    confidence: 97
  },
  "Which mandatory documents are missing?": {
    content: `Based on my analysis of all current bidder submissions, the following **mandatory documents are missing or incomplete**:

**High Priority (Missing):**
\u2022 Noble Industrials \u2014 OEM Authorization Letter (MANDATORY)
\u2022 Precision Tools Ltd \u2014 Valid EPFO Certificate (MANDATORY)
\u2022 Metaflow Engineering \u2014 Updated GST Certificate (MANDATORY)

**Under Review (Low Confidence):**
\u2022 Shakti Enterprises \u2014 Udyam Certificate (name mismatch detected)
\u2022 Precision Tools Ltd \u2014 ITR Acknowledgement FY2024 (OCR confidence: 64%)

**Total: 3 missing, 2 under review**

Recommended action: Send document request notices to the 3 bidders with missing mandatory documents.`,
    sources: ["Document Checklist Analysis", "OCR Processing Reports", "Government Verification Responses"],
    confidence: 100
  }
};
export default function AIAssistant({ onNavigate }) {
  const [messages, setMessages] = useState([{
    id: "welcome",
    role: "assistant",
    content: "Hello! I'm your AI Procurement Assistant. I can help you analyze bidder compliance, identify risks, and review evidence across all tenders. Ask me anything about the current procurement cases.\n\n**Important:** I only use verified platform data and evidence. I do not make final procurement decisions \u2014 those are always made by you, the Procurement Officer.",
    confidence: 100
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const demoAnswer = DEMO_ANSWERS[text];
    const assistantMsg = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: demoAnswer?.content || `I found relevant information about "${text}". Based on the platform data, I can see this relates to compliance requirements across multiple tenders. Please check the AI Insights section for detailed findings with evidence.

**Note:** This is a simulated response for demo purposes. In production, I would query the full platform database and government verification responses.`,
      sources: demoAnswer?.sources || ["Platform Database", "Compliance Records"],
      confidence: demoAnswer?.confidence || 85
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };
  const formatContent = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <div key={i} style={{ fontWeight: 700, color: "#0f172a", marginTop: i > 0 ? 10 : 0, marginBottom: 2 }}>{line.replace(/\*\*/g, "")}</div>;
      }
      if (line.startsWith("\u2022 ")) {
        return <div key={i} style={{ paddingLeft: 16, color: "#334155", fontSize: 12.5, marginBottom: 2 }}>• {line.slice(2)}</div>;
      }
      if (line.includes("**")) {
        const parts = line.split("**");
        return <div key={i} style={{ marginBottom: 2 }}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : <span key={j}>{p}</span>)}
        </div>;
      }
      return line ? <div key={i} style={{ marginBottom: 4 }}>{line}</div> : <div key={i} style={{ height: 6 }} />;
    });
  };
  return <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={18} style={{ color: "white" }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>AI Procurement Assistant</h2>
          <span style={{ fontSize: 10.5, fontWeight: 700, background: "#ede9fe", color: "#6d28d9", padding: "2px 8px", borderRadius: 99 }}>Beta</span>
        </div>
        <p style={{ fontSize: 13, color: "#64748b" }}>Ask questions about bidder compliance, risk analysis, and verification status using platform data and evidence</p>
      </div>

      {
    /* Human-in-loop notice */
  }
      <div style={{
    background: "#fef3c7",
    border: "1px solid #fcd34d",
    borderRadius: 10,
    padding: "10px 16px",
    marginBottom: 16,
    display: "flex",
    gap: 8,
    alignItems: "center",
    fontSize: 12,
    color: "#78350f"
  }}>
        <AlertCircle size={14} style={{ flexShrink: 0 }} />
        <span>AI Assistant provides evidence-based analysis only. <strong>Final procurement decisions are always made by the Procurement Officer.</strong></span>
      </div>

      {
    /* Chat area */
  }
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, height: "calc(100vh - 280px)" }}>
        {
    /* Messages */
  }
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: "4px 0", marginBottom: 12 }}>
            {messages.map((msg) => <div key={msg.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                {
    /* Avatar */
  }
                <div style={{
    width: 32,
    height: 32,
    borderRadius: "50%",
    flexShrink: 0,
    background: msg.role === "user" ? "#1d4ed8" : "linear-gradient(135deg, #7c3aed, #1d4ed8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
                  {msg.role === "user" ? <User size={14} style={{ color: "white" }} /> : <Brain size={14} style={{ color: "white" }} />}
                </div>
                {
    /* Bubble */
  }
                <div style={{ maxWidth: "80%" }}>
                  <div style={{
    background: msg.role === "user" ? "#1d4ed8" : "white",
    color: msg.role === "user" ? "white" : "#334155",
    borderRadius: msg.role === "user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
    padding: "12px 16px",
    fontSize: 13,
    lineHeight: 1.6,
    border: msg.role === "assistant" ? "1px solid #e2e8f0" : "none",
    boxShadow: msg.role === "assistant" ? "0 2px 8px rgba(0,0,0,0.05)" : "none"
  }}>
                    {formatContent(msg.content)}
                    {
    /* Sources */
  }
                    {msg.sources && <div style={{ marginTop: 12, borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Sources Used</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {msg.sources.map((s, i) => <span key={i} style={{ fontSize: 10.5, background: "#ede9fe", color: "#6d28d9", padding: "2px 7px", borderRadius: 99 }}>
                              {s}
                            </span>)}
                        </div>
                      </div>}
                    {msg.confidence && <div style={{ marginTop: 6, fontSize: 10.5, color: "#94a3b8" }}>
                        AI Confidence: <strong style={{ color: "#7c3aed" }}>{msg.confidence}%</strong>
                      </div>}
                  </div>
                </div>
              </div>)}
            {loading && <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={14} style={{ color: "white" }} />
                </div>
                <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "4px 12px 12px 12px", padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map((i) => <div key={i} style={{
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#7c3aed",
    animation: `pulse-slow 1s ${i * 0.2}s ease-in-out infinite`
  }} />)}
                  </div>
                </div>
              </div>}
          </div>

          {
    /* Input */
  }
          <div style={{
    display: "flex",
    gap: 8,
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "8px 12px",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.03)"
  }}>
            <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
    placeholder="Ask about compliance, risk, missing documents..."
    style={{ flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent" }}
  />
            <button
    onClick={() => sendMessage(input)}
    style={{
      width: 34,
      height: 34,
      borderRadius: 8,
      background: "#1d4ed8",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }}
  >
              <Send size={14} style={{ color: "white" }} />
            </button>
          </div>
        </div>

        {
    /* Presets sidebar */
  }
        <div>
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
              Quick Questions
            </div>
            {PRESET_QUESTIONS.map((q, i) => <button key={i} onClick={() => sendMessage(q)} style={{
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "white",
    cursor: "pointer",
    fontSize: 12.5,
    color: "#334155",
    marginBottom: 8,
    lineHeight: 1.4,
    fontWeight: 500
  }}>
                {q}
              </button>)}
          </div>

          <div className="card" style={{ padding: "16px", marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 10 }}>
              Capabilities
            </div>
            {[
    { icon: "\u2705", text: "Evidence-based answers only" },
    { icon: "\u{1F4C4}", text: "Document analysis & comparison" },
    { icon: "\u26A0\uFE0F", text: "Risk identification" },
    { icon: "\u{1F4CA}", text: "Compliance summary" },
    { icon: "\u{1F50D}", text: "Bidder cross-comparison" },
    { icon: "\u274C", text: "Cannot make final decisions" }
  ].map((c, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 12, color: c.icon === "\u274C" ? "#dc2626" : "#334155" }}>
                <span>{c.icon}</span> {c.text}
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}
