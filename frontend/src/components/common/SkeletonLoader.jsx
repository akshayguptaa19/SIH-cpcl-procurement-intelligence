import React from "react";

export function SkeletonBox({ width = "100%", height = "16px", borderRadius = "6px", style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}

export function SkeletonTableRow({ columns = 5 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: "16px" }}>
          <SkeletonBox height="14px" width={i === 0 ? "70%" : "50%"} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard({ height = "120px" }) {
  return (
    <div className="card" style={{ padding: "16px", height }}>
      <SkeletonBox width="40%" height="14px" style={{ marginBottom: "12px" }} />
      <SkeletonBox width="60%" height="28px" style={{ marginBottom: "8px" }} />
      <SkeletonBox width="30%" height="12px" />
    </div>
  );
}

export default {
  SkeletonBox,
  SkeletonTableRow,
  SkeletonCard
};
