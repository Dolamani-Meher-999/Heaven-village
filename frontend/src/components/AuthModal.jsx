import { useState } from "react";

export default function AuthModal({ mode, onClose, onSwitch, onSuccess }) {
  const [form, setForm]     = useState({ name:"", email:"", password:"", role:"tenant" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const isLogin = mode === "login";

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Email and password are required"); return; }
    if (!isLogin && !form.name)        { setError("Name is required"); return; }
    setLoading(true);
    try {
      const url  = `http://localhost:5000/api/auth/${isLogin ? "login" : "register"}`;
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role: form.role };
      const res  = await fetch(url, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      localStorage.setItem("hv_token", data.token);
      localStorage.setItem("hv_user",  JSON.stringify(data.user));
      onSuccess?.(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-charcoal/60 backdrop-blur-sm flex items-center justify-center animate-fadeIn p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative bg-white rounded-2xl shadow-[0_40px_120px_rgba(26,26,46,0.2)] w-full max-w-[440px] animate-slideUp overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full orange-gradient" />

        <div className="p-10">
          <button onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 text-charcoal/40 hover:bg-gray-200 transition-colors flex items-center justify-center text-sm">
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl orange-gradient flex items-center justify-center text-xl font-black text-white mx-auto mb-4">H</div>
            <h2 className="font-display text-[26px] font-bold text-charcoal mb-2">
              {isLogin ? "Welcome Back" : "Join Heaven Village"}
            </h2>
            <p className="font-body text-sm text-charcoal/45">
              {isLogin ? "Sign in to your account" : "Create your free account today"}
            </p>
          </div>

          {/* Role toggle */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {["tenant","owner"].map((r) => (
                <button key={r} onClick={() => setForm((f) => ({ ...f, role: r }))}
                  className={`py-2.5 rounded-xl font-body text-sm font-semibold capitalize cursor-pointer transition-all duration-200 ${
                    form.role === r
                      ? "orange-gradient text-white shadow-orange"
                      : "bg-gray-50 border border-gray-200 text-charcoal/50 hover:border-orange/30"
                  }`}>
                  {r === "tenant" ? "🏠 Tenant" : "🏢 Owner"}
                </button>
              ))}
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-3.5">
            {!isLogin && (
              <input placeholder="Full Name" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-charcoal text-sm font-body focus:border-orange/50 focus:bg-white transition-all" />
            )}
            <input type="email" placeholder="Email Address" value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-charcoal text-sm font-body focus:border-orange/50 focus:bg-white transition-all" />
            <input type="password" placeholder="Password" value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-charcoal text-sm font-body focus:border-orange/50 focus:bg-white transition-all" />
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-500 text-sm font-body">{error}</div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-6 orange-gradient py-4 rounded-xl text-white text-[15px] font-bold font-body tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 shadow-orange">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>

          <p className="text-center mt-5 font-body text-sm text-charcoal/40">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={onSwitch} className="text-orange font-semibold cursor-pointer hover:underline">
              {isLogin ? "Register" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
