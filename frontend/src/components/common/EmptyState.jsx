import React from "react";
import { FolderSearch, AlertCircle } from "lucide-react";

export default function EmptyState({
  icon: Icon = FolderSearch,
  title = "No records found",
  description = "No items match your current filter or search criteria.",
  actionLabel,
  onAction,
  style = {}
}) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px dashed #e2e8f0",
        ...style
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          marginBottom: 12
        }}
      >
        <Icon size={20} />
      </div>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
        {title}
      </h4>
      <p style={{ fontSize: 12.5, color: "#64748b", maxWidth: 360, lineHeight: 1.45, marginBottom: actionLabel ? 16 : 0 }}>
        {description}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="btn btn-secondary btn-sm"
          style={{ marginTop: 6 }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
