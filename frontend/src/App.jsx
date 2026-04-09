import { useState } from "react";
import Navbar             from "./components/Navbar";
import Hero               from "./components/Hero";
import Stats              from "./components/Stats";
import PropertyTypes      from "./components/PropertyTypes";
import FeaturedProperties from "./components/FeaturedProperties";
import HowItWorks         from "./components/HowItWorks";
import CTA                from "./components/CTA";
import Footer             from "./components/Footer";
import AuthModal          from "./components/AuthModal";
import TenantDashboard    from "./pages/TenantDashboard";
import OwnerDashboard     from "./pages/OwnerDashboard";
import AdminDashboard     from "./pages/AdminDashboard";
import PageOverlay        from "./components/PageOverlay";

// ── Restore session only if JWT token exists and hasn't expired ──────────────
const getStoredUser = () => {
  try {
    const token    = localStorage.getItem("hv_token");
    const userData = localStorage.getItem("hv_user");

    if (!token || !userData) return null;

    // Decode JWT payload (no library needed — just base64 decode the middle part)
    const payload   = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp && payload.exp * 1000 < Date.now();

    if (isExpired) {
      // Token expired — wipe storage and fall through to landing page
      localStorage.removeItem("hv_token");
      localStorage.removeItem("hv_user");
      return null;
    }

    return JSON.parse(userData);
  } catch {
    // Malformed token — wipe and show landing page
    localStorage.removeItem("hv_token");
    localStorage.removeItem("hv_user");
    return null;
  }
};

export default function App() {
  const [authMode, setAuthMode] = useState(null);

  // null  → landing page
  // valid user object → dashboard
  // getStoredUser only returns non-null if token is valid & not expired
  const [user, setUser] = useState(getStoredUser);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem("hv_user", JSON.stringify(userData));
    setUser(userData);
    setAuthMode(null);
  };

  const handleLogout = () => {
    // Clear this user's saved properties so they don't appear for the next login
    const uid = user?._id || user?.id;
    if (uid) localStorage.removeItem(`hv_saved_${uid}`);

    localStorage.removeItem("hv_user");
    localStorage.removeItem("hv_token");
    setUser(null); // → back to landing page
  };

  const renderView = () => {
    if (user?.role === "tenant") return <TenantDashboard user={user} onLogout={handleLogout} />;
    if (user?.role === "owner")  return <OwnerDashboard  user={user} onLogout={handleLogout} />;
    if (user?.role === "admin")  return <AdminDashboard  user={user} onLogout={handleLogout} />;

    // ── Landing page ────────────────────────────────────────────────────────
    return (
      <>
        <Navbar
          onLogin={()    => setAuthMode("login")}
          onRegister={()  => setAuthMode("register")}
        />
        <Hero onRegister={() => setAuthMode("register")} />
        <Stats />
        <PropertyTypes />
        <FeaturedProperties />
        <HowItWorks />
        <CTA onRegister={() => setAuthMode("register")} />
        <Footer />

        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={()  => setAuthMode(null)}
            onSwitch={()  => setAuthMode((m) => m === "login" ? "register" : "login")}
            onSuccess={handleAuthSuccess}
          />
        )}
      </>
    );
  };

  return (
    <>
      {renderView()}
      <PageOverlay />
    </>
  );
}