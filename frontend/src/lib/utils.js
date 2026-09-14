export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
export function getStatusBadgeClass(status) {
  const s = status.toLowerCase();
  if (s.includes("verified") || s.includes("compliant") || s.includes("pass") || s.includes("online") || s.includes("active") || s.includes("completed")) return "badge badge-green";
  if (s.includes("review") || s.includes("pending") || s.includes("warning") || s.includes("medium")) return "badge badge-amber";
  if (s.includes("fail") || s.includes("reject") || s.includes("critical") || s.includes("mismatch") || s.includes("risk") || s.includes("not found")) return "badge badge-red";
  if (s.includes("info") || s.includes("published") || s.includes("evaluation")) return "badge badge-blue";
  if (s.includes("ai") || s.includes("processing")) return "badge badge-purple";
  return "badge badge-gray";
}
export function getRiskColor(level) {
  switch (level.toLowerCase()) {
    case "low":
      return { text: "#15803d", bg: "#dcfce7", border: "#86efac" };
    case "medium":
      return { text: "#b45309", bg: "#fef3c7", border: "#fcd34d" };
    case "high":
      return { text: "#b91c1c", bg: "#fee2e2", border: "#fca5a5" };
    case "critical":
      return { text: "#7f1d1d", bg: "#fee2e2", border: "#ef4444" };
    default:
      return { text: "#64748b", bg: "#f1f5f9", border: "#e2e8f0" };
  }
}
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
