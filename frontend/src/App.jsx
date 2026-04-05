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

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("hv_user") || "null"); }
  catch { return null; }
};

export default function App() {
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem("hv_user", JSON.stringify(userData));
    setUser(userData);
    setAuthMode(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("hv_user");
    localStorage.removeItem("hv_token");
    setUser(null);
  };

  const renderView = () => {
    if (user?.role === "tenant") return <TenantDashboard user={user} onLogout={handleLogout} />;
    if (user?.role === "owner")  return <OwnerDashboard  user={user} onLogout={handleLogout} />;
    if (user?.role === "admin")  return <AdminDashboard  user={user} onLogout={handleLogout} />;

    // Landing page
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
            onClose={()   => setAuthMode(null)}
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