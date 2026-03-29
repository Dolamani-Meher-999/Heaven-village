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

const getStoredUser = () => {
  const stored = localStorage.getItem("hv_user");
  if (!stored) return null;
  return JSON.parse(stored);
};

export default function App() {
  const [authMode, setAuthMode] = useState(null);
  const [user,     setUser]     = useState(getStoredUser);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthMode(null);
  };

  if (user && user.role === "tenant") return <TenantDashboard />;
  if (user && user.role === "owner")  return <OwnerDashboard />;
  if (user && user.role === "admin")  return <AdminDashboard />;

  return (
    <>
      <Navbar
        onLogin={()   => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
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
          onSwitch={()  => setAuthMode((m) => (m === "login" ? "register" : "login"))}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
