import React from "react";

export default function PageHeader({
  badge,
  title,
  subtitle,
  children,
  breadcrumbs
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
        marginBottom: "20px",
        flexWrap: "wrap"
      }}
    >
      <div>
        {breadcrumbs && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11.5px",
              color: "#64748b",
              marginBottom: "4px"
            }}
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "#1d4ed8",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontSize: "11.5px"
                    }}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span style={{ color: idx === breadcrumbs.length - 1 ? "#0f172a" : "#64748b", fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400 }}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h1 className="page-title">{title}</h1>
          {badge && <span className="badge badge-blue">{badge}</span>}
        </div>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {children && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {children}
        </div>
      )}
    </div>
  );
}
