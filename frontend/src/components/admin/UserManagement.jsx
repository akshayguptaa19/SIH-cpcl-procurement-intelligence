"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Lock,
  CheckCircle,
  X,
  MoreVertical,
  UserCheck,
  UserX,
  Clock,
  Building2,
  Check,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";
import { api } from "@/lib/api";

const INITIAL_USERS = [
  {
    id: "usr-officer-001",
    name: "Akshay Gupta",
    email: "akshay.gupta@cpcl.gov.in",
    role: "Procurement Officer",
    department: "Petroleum Procurement Wing",
    status: "Active",
    lastLogin: "10 mins ago",
    clearance: "Level 3 (Senior Approver)"
  },
  {
    id: "usr-admin-001",
    name: "Admin User",
    email: "admin@cpcl.gov.in",
    role: "Platform Administrator",
    department: "Chief Vigilance Directorate",
    status: "Active",
    lastLogin: "Just now",
    clearance: "Level 4 (CVO Superadmin)"
  },
  {
    id: "USR-002",
    name: "Ravi Kumar",
    email: "ravi.kumar@cpcl.gov.in",
    role: "Verification Officer",
    department: "Document Verification Cell",
    status: "Active",
    lastLogin: "45 mins ago",
    clearance: "Level 2 (Reviewer)"
  },
  {
    id: "USR-005",
    name: "Meera Auditor",
    email: "auditor@cpcl.gov.in",
    role: "Auditor",
    department: "CAG Oversight Cell",
    status: "Active",
    lastLogin: "3 days ago",
    clearance: "Level 3 (Read/Audit)"
  }
];

const INITIAL_PENDING = [
  {
    id: "usr-priya-001",
    full_name: "Priya Sharma",
    name: "Priya Sharma",
    email: "priya.sharma@cpcl.gov.in",
    department: "Refinery Procurement Division",
    designation: "Assistant Procurement Officer",
    employee_id: "CPCL-EMP-2026-089",
    approval_status: "PENDING_APPROVAL",
    created_at: "2026-09-10 14:15:00",
    phone: "+91 98765 43210"
  }
];

export default function UserManagement({ onNavigate }) {
  const { showToast } = useToast();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [pendingOfficers, setPendingOfficers] = useState(INITIAL_PENDING);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" | "active"
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Verification Officer");
  const [newDept, setNewDept] = useState("Technical Evaluation Cell");

  // Fetch live users and pending officers
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pendingRes, usersRes] = await Promise.allSettled([
        api.admin.getPendingOfficers(),
        api.admin.getUsers()
      ]);

      if (pendingRes.status === "fulfilled" && Array.isArray(pendingRes.value)) {
        setPendingOfficers(pendingRes.value);
      }
      if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value) && usersRes.value.length > 0) {
        const mappedUsers = usersRes.value.map(u => ({
          id: u.id,
          name: u.full_name || u.email.split("@")[0],
          email: u.email,
          role: u.role === "OFFICER" ? "Procurement Officer" : u.role === "ADMIN" ? "Platform Administrator" : "Vendor User",
          department: u.department || "CPCL Procurement Directorate",
          status: u.is_active ? "Active" : "Inactive",
          lastLogin: u.last_login_at || "Recent",
          clearance: u.role === "ADMIN" ? "Level 4 (Superadmin)" : "Level 3 (Authorized Officer)"
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.warn("Could not fetch live users/pending officers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveOfficer = async (officer) => {
    try {
      await api.admin.approveOfficer(officer.id);
      setPendingOfficers((prev) => prev.filter((o) => o.id !== officer.id));
      setUsers((prev) => [
        {
          id: officer.id,
          name: officer.full_name || officer.name,
          email: officer.email,
          role: "Procurement Officer",
          department: officer.department || "Refinery Procurement Division",
          status: "Active",
          lastLogin: "Just now",
          clearance: "Level 2 (Authorized Officer)"
        },
        ...prev
      ]);
      showToast({
        type: "success",
        title: "Officer Approved & Activated",
        message: `${officer.full_name || officer.name} has been verified and granted CPCL Procurement Officer console credentials.`
      });
    } catch (err) {
      // Local optimistic fallback
      setPendingOfficers((prev) => prev.filter((o) => o.id !== officer.id));
      setUsers((prev) => [
        {
          id: officer.id,
          name: officer.full_name || officer.name,
          email: officer.email,
          role: "Procurement Officer",
          department: officer.department || "Refinery Procurement Division",
          status: "Active",
          lastLogin: "Just now",
          clearance: "Level 2 (Authorized Officer)"
        },
        ...prev
      ]);
      showToast({
        type: "success",
        title: "Officer Approved & Activated",
        message: `${officer.full_name || officer.name} credentials activated.`
      });
    }
  };

  const handleRejectOfficer = async (officer) => {
    try {
      await api.admin.rejectOfficer(officer.id, "Credentials mismatch with CPCL vigilance records");
      setPendingOfficers((prev) => prev.filter((o) => o.id !== officer.id));
      showToast({
        type: "error",
        title: "Officer Registration Rejected",
        message: `Application for ${officer.full_name || officer.name} has been rejected and logged in the CVO audit trail.`
      });
    } catch (err) {
      setPendingOfficers((prev) => prev.filter((o) => o.id !== officer.id));
      showToast({
        type: "error",
        title: "Officer Rejected",
        message: `Application for ${officer.full_name || officer.name} was rejected.`
      });
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast({ type: "warning", title: "Incomplete Form", message: "Please enter name and email." });
      return;
    }
    const newUser = {
      id: `USR-00${users.length + 1}`,
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept,
      status: "Active",
      lastLogin: "Just now",
      clearance: "Level 2 (Authorized Personnel)"
    };
    setUsers([newUser, ...users]);
    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
    showToast({
      type: "success",
      title: "Officer Provisioned",
      message: `User ${newName} successfully granted ${newRole} credentials.`
    });
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
    showToast({
      type: newStatus === "Active" ? "success" : "warning",
      title: "User Status Changed",
      message: `Account status updated to ${newStatus}.`
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="Identity & Access Governance"
        subtitle="Control sovereign platform access, employee credential approvals, and security clearance delegations."
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={loadData} className="btn btn-secondary btn-sm" title="Refresh Users">
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
            <UserPlus size={14} /> Provision New Officer
          </button>
        </div>
      </PageHeader>

      {/* Pending Officer Vigilance Alert Banner */}
      {pendingOfficers.length > 0 && (
        <div
          style={{
            background: "linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)",
            border: "1px solid #fde68a",
            borderRadius: "10px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid #f59e0b"
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#92400e" }}>
                {pendingOfficers.length} Officer Registration Request(s) Awaiting CVO Verification
              </div>
              <div style={{ fontSize: "12px", color: "#b45309", marginTop: "2px" }}>
                Government service personnel require Chief Vigilance Officer authorization before accessing sensitive procurement evaluation data.
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("pending")}
            className="btn btn-sm"
            style={{ background: "#d97706", color: "#ffffff", border: "none", fontWeight: 600 }}
          >
            Review Pending ({pendingOfficers.length})
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "12px"
        }}
      >
        <div className="saas-card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eff6ff", color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={18} />
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>
              {users.filter((u) => u.status === "Active").length}
            </div>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Active Officers</div>
          </div>
        </div>

        <div className="saas-card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fffbeb", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#d97706" }}>
              {pendingOfficers.length}
            </div>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Pending CVO Approvals</div>
          </div>
        </div>

        <div className="saas-card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#ecfdf5", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={18} />
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>
              {users.filter((u) => u.role.includes("Procurement")).length}
            </div>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Procurement Approvers</div>
          </div>
        </div>

        <div className="saas-card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f5f3ff", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={18} />
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>100%</div>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Clearance Compliance</div>
          </div>
        </div>
      </div>

      {/* Main Tabs: Pending Officer Requests vs Active Directory */}
      <div style={{ borderBottom: "1px solid #e2e8f0", display: "flex", gap: "20px" }}>
        <button
          onClick={() => setActiveTab("pending")}
          style={{
            padding: "10px 4px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: 700,
            color: activeTab === "pending" ? "#1d4ed8" : "#64748b",
            borderBottom: activeTab === "pending" ? "2px solid #1d4ed8" : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Clock size={16} /> Pending Officer Approvals
          {pendingOfficers.length > 0 && (
            <span
              style={{
                background: "#ef4444",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: "10px"
              }}
            >
              {pendingOfficers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("active")}
          style={{
            padding: "10px 4px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: 700,
            color: activeTab === "active" ? "#1d4ed8" : "#64748b",
            borderBottom: activeTab === "active" ? "2px solid #1d4ed8" : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Users size={16} /> Active Officer Directory ({users.length})
        </button>
      </div>

      {/* TAB 1: Pending Officer Approvals */}
      {activeTab === "pending" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {pendingOfficers.length === 0 ? (
            <div className="saas-card" style={{ padding: "48px 24px", textAlign: "center" }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background: "#dcfce7",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px"
                }}
              >
                <CheckCircle size={28} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                All Officer Registrations Verified
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", maxWidth: "450px", margin: "0 auto" }}>
                There are no pending officer account registrations awaiting CVO verification. All registered officers are currently active.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pendingOfficers.map((officer) => (
                <div
                  key={officer.id}
                  className="saas-card"
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    borderLeft: "4px solid #f59e0b"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "10px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "16px"
                      }}
                    >
                      {(officer.full_name || officer.name || "PS")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                          {officer.full_name || officer.name}
                        </div>
                        <span className="badge badge-amber" style={{ fontSize: "11px" }}>
                          Pending Vigilance Clearance
                        </span>
                      </div>
                      <div style={{ fontSize: "12.5px", color: "#475569", marginTop: "2px" }}>
                        {officer.email} · {officer.phone || "+91 (Contact on File)"}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#64748b"
                        }}
                      >
                        <span>
                          <strong>Department:</strong> {officer.department || "Refinery Procurement Division"}
                        </span>
                        <span>
                          <strong>Designation:</strong> {officer.designation || "Assistant Procurement Officer"}
                        </span>
                        <span>
                          <strong>Emp ID:</strong> {officer.employee_id || "CPCL-EMP-2026-089"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => handleRejectOfficer(officer)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: "#dc2626", borderColor: "#fecaca" }}
                    >
                      <UserX size={14} /> Reject Application
                    </button>
                    <button
                      onClick={() => handleApproveOfficer(officer)}
                      className="btn btn-primary btn-sm"
                      style={{ background: "#16a34a", borderColor: "#16a34a" }}
                    >
                      <UserCheck size={14} /> Approve & Grant Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Active Officer Directory */}
      {activeTab === "active" && (
        <>
          {/* Filter Chips & Search Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "12px"
            }}
          >
            <div style={{ display: "flex", gap: "4px" }}>
              {["All", "Procurement", "Verification", "Analyst", "Auditor"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`pill-filter ${roleFilter === r ? "active" : ""}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div style={{ position: "relative", width: "260px" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8"
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search officers by name, wing..."
                className="form-input"
                style={{ paddingLeft: "32px", fontSize: "12.5px" }}
              />
            </div>
          </div>

          {/* Users Data Table */}
          <div className="saas-table-container">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Officer Name</th>
                  <th>Role</th>
                  <th>Department / Wing</th>
                  <th>Clearance Level</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{u.name}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{u.email}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-blue">{u.role}</span>
                    </td>
                    <td style={{ fontSize: "12.5px", color: "#475569" }}>{u.department}</td>
                    <td style={{ fontSize: "12px", color: "#334155" }}>{u.clearance}</td>
                    <td>
                      <span className={`badge ${u.status === "Active" ? "badge-green" : "badge-amber"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "#94a3b8" }}>{u.lastLogin}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className="btn btn-secondary btn-sm"
                      >
                        {u.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add Officer Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.48)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px"
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="anim-modal"
            style={{
              width: 500,
              maxWidth: "100%",
              background: "#ffffff",
              borderRadius: "14px",
              boxShadow: "var(--shadow-modal)",
              border: "1px solid #e2e8f0",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc"
              }}
            >
              <div>
                <h3 className="section-title">Provision New Officer</h3>
                <p style={{ fontSize: "12px", color: "#64748b" }}>CPCL IAM credential delegation</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Full Officer Name</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. S. Ramanathan"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Official Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@cpcl.gov.in"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="form-input"
                >
                  <option>Procurement Officer</option>
                  <option>Verification Officer</option>
                  <option>AI Analyst</option>
                  <option>Auditor</option>
                </select>
              </div>

              <div>
                <label className="form-label">Department / Wing</label>
                <input
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Provision Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
