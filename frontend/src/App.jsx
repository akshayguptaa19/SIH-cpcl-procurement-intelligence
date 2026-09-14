import React, { useState } from "react";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation, 
  Link 
} from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import { ToastProvider } from "./components/common/ToastProvider.jsx";
import ProcurementDashboard from "./components/dashboard/ProcurementDashboard.jsx";
import TenderList from "./components/tenders/TenderList.jsx";
import BidderList from "./components/bidders/BidderList.jsx";
import DocumentVerification from "./components/verification/DocumentVerification.jsx";
import ComplianceChecks from "./components/compliance/ComplianceChecks.jsx";
import RiskAnalysis from "./components/risk/RiskAnalysis.jsx";
import AIInsights from "./components/ai/AIInsights.jsx";
import AIAssistant from "./components/ai/AIAssistant.jsx";
import AIBidAnalyzer from "./components/ai/AIBidAnalyzer.jsx";
import AuditTrail from "./components/audit/AuditTrail.jsx";
import ReportsAnalytics from "./components/reports/ReportsAnalytics.jsx";
import NotificationsView from "./components/notifications/NotificationsView.jsx";
import GovernmentIntegrations from "./components/integrations/GovernmentIntegrations.jsx";
import BidderComparison from "./components/bidders/BidderComparison.jsx";
import UserManagement from "./components/admin/UserManagement.jsx";
import MasterData from "./components/admin/MasterData.jsx";
import ComplianceRulesEngine from "./components/admin/ComplianceRulesEngine.jsx";
import SystemSettings from "./components/admin/SystemSettings.jsx";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ProcurementProvider, useProcurement } from "./context/ProcurementContext.jsx";
import BidderPortal from "./components/roles/BidderPortal.jsx";

// Public Landing & Unified Auth Screens
import LandingPage from "./components/public/LandingPage.jsx";
import AuthPage from "./components/auth/AuthPage.jsx";
import { Landmark, ArrowLeft, ShieldAlert } from "lucide-react";

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 64;
const TOPBAR_HEIGHT = 60;

// Loading Screen
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid #E4E7EC", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: "16px" }}></div>
      <p style={{ fontSize: "13px", fontWeight: 600, color: "#475467", letterSpacing: "0.02em" }}>
        Loading GeM BidVerify AI Session...
      </p>
    </div>
  );
}

// Protected Route for Officers & Admins
function ProtectedOfficerRoute({ children }) {
  const { isAuthenticated, isOfficer, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) {
    return <Navigate to="/officer/login" replace />;
  }
  return children;
}

// Protected Route for Bidders
function ProtectedBidderRoute({ children }) {
  const { isAuthenticated, isBidder, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) {
    return <Navigate to="/bidder/login" replace />;
  }
  return children;
}

// Layout wrapper for Authenticated Officer / Admin Console
function OfficerLayout({ children, section }) {
  const { logout, user } = useAuth();
  const { role } = useProcurement();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [navParams, setNavParams] = useState(location.state || null);

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  const activeSection = section || location.pathname.replace(/^\//, '').split('/')[0] || 'dashboard';

  const handleNavigate = (newSection, params = null) => {
    if (newSection === 'landing' || newSection === 'home') {
      navigate('/home');
      return;
    }
    setNavParams(params);
    navigate(`/${newSection}`, { state: params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F7FA", position: "relative" }}>

      {/* Modern Sidebar */}
      <Sidebar
        role={role}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: sidebarWidth,
          transition: "margin-left 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Top Bar Header */}
        <TopBar
          role={role}
          section={activeSection}
          sidebarWidth={sidebarWidth}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        {/* Page Body */}
        <main
          className="app-main"
          style={{
            marginTop: TOPBAR_HEIGHT,
            padding: "24px 28px 36px",
            minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
            maxWidth: "1600px",
            marginRight: "auto"
          }}
        >
          {React.cloneElement(children, { onNavigate: handleNavigate, navParams })}
        </main>
      </div>
    </div>
  );
}

// Layout wrapper for Authenticated Bidder Experience
function BidderLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (newSection) => {
    if (newSection === 'landing' || newSection === 'home') {
      navigate('/home');
      return;
    }
    navigate(`/${newSection}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", position: "relative" }}>

      <TopBar
        role="bidder"
        section="bidder-portal"
        sidebarWidth={0}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main
        className="app-main"
        style={{
          marginTop: TOPBAR_HEIGHT,
          padding: "24px 28px 36px",
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          maxWidth: "1600px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1
        }}
      >
        {React.cloneElement(children, { onNavigate: handleNavigate })}
      </main>
    </div>
  );
}

// 404 Sovereign Error Page
function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-6 text-center text-slate-300 selection:bg-cyan-500/30">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400 shadow-xl shadow-cyan-500/10">
        <Landmark className="w-8 h-8" />
      </div>
      <span className="px-3 py-1 bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 rounded-full text-xs font-mono mb-4">
        HTTP 404 · SOVEREIGN ROUTE NOT FOUND
      </span>
      <h1 className="text-3xl font-bold text-white mb-2">Endpoint or Module Not Located</h1>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The requested procurement route does not match any registered official CPCL Directorate module or public tender view.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate('/home')}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sovereign Portal (Home)
        </button>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-all"
        >
          Sign In to Portal
        </button>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, isOfficer, isBidder } = useAuth();

  return (
    <Routes>
      {/* Root redirects to /home or dashboard */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isBidder ? <Navigate to="/bidder-portal" replace /> : <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />

      {/* Public Routes */}
      <Route path="/home" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage initialRole="officer" initialMode="login" />} />
      <Route path="/signup" element={<AuthPage initialRole="bidder" initialMode="register" />} />
      <Route path="/register" element={<AuthPage initialRole="bidder" initialMode="register" />} />

      {/* Dedicated Role Auth Routes */}
      <Route path="/officer/login" element={<AuthPage initialRole="officer" initialMode="login" />} />
      <Route path="/officer/register" element={<AuthPage initialRole="officer" initialMode="register" />} />
      <Route path="/bidder/login" element={<AuthPage initialRole="bidder" initialMode="login" />} />
      <Route path="/bidder/register" element={<AuthPage initialRole="bidder" initialMode="register" />} />

      {/* Authenticated Bidder Routes */}
      <Route
        path="/bidder-portal"
        element={
          <ProtectedBidderRoute>
            <BidderLayout>
              <BidderPortal />
            </BidderLayout>
          </ProtectedBidderRoute>
        }
      />
      <Route path="/portal" element={<Navigate to="/bidder-portal" replace />} />

      {/* Authenticated Officer / Admin Console Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="dashboard">
              <ProcurementDashboard />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/tenders"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="tenders">
              <TenderList />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/bidders"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="bidders">
              <BidderList />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/bidder-comparison"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="bidder-comparison">
              <BidderComparison />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/document-verification"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="document-verification">
              <DocumentVerification />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route path="/verification" element={<Navigate to="/document-verification" replace />} />

      <Route
        path="/compliance-checks"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="compliance-checks">
              <ComplianceChecks />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route path="/compliance" element={<Navigate to="/compliance-checks" replace />} />

      <Route
        path="/risk-analysis"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="risk-analysis">
              <RiskAnalysis />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route path="/risk" element={<Navigate to="/risk-analysis" replace />} />

      <Route
        path="/ai-insights"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="ai-insights">
              <AIInsights />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="ai-assistant">
              <AIAssistant />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/ai-analyzer"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="ai-analyzer">
              <AIBidAnalyzer />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route path="/ai-bid-analyzer" element={<Navigate to="/ai-analyzer" replace />} />
      <Route
        path="/audit-trail"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="audit-trail">
              <AuditTrail />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route path="/audit" element={<Navigate to="/audit-trail" replace />} />

      <Route
        path="/reports"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="reports">
              <ReportsAnalytics />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="notifications">
              <NotificationsView />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/integrations"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="integrations">
              <GovernmentIntegrations />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/users-roles"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="users-roles">
              <UserManagement />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route path="/users" element={<Navigate to="/users-roles" replace />} />

      <Route
        path="/master-data"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="master-data">
              <MasterData />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/compliance-rules"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="compliance-rules">
              <ComplianceRulesEngine />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route
        path="/system-settings"
        element={
          <ProtectedOfficerRoute>
            <OfficerLayout section="system-settings">
              <SystemSettings />
            </OfficerLayout>
          </ProtectedOfficerRoute>
        }
      />
      <Route path="/settings" element={<Navigate to="/system-settings" replace />} />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProcurementProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </ProcurementProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
