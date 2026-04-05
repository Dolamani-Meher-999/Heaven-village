import { useState } from "react";

export default function RentRequestModal({ property, onClose }) {
  const [form,    setForm]    = useState({ message:"", moveInDate:"" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const token  = localStorage.getItem("hv_token");
  const imgUrl = property?.images?.[0]?.url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80";

  const handleSubmit = async () => {
    if (!form.moveInDate) { setError("Please select a move-in date"); return; }
    setLoading(true); setError("");
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/properties/${property._id}/rent-request`, {
        method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
    } catch (err) { setError(err.message); }
    finally       { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-charcoal/50 backdrop-blur-sm flex items-center justify-center animate-fadeIn p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative bg-white rounded-2xl shadow-[0_40px_120px_rgba(26,26,46,0.18)] w-full max-w-lg animate-slideUp overflow-hidden">
        <div className="h-1 w-full orange-gradient" />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-charcoal/40 hover:bg-gray-200 transition-colors flex items-center justify-center z-10 text-sm">✕</button>

        {success ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5 text-3xl text-green-500">✓</div>
            <h3 className="font-display text-2xl font-bold text-charcoal mb-3">Request Sent!</h3>
            <p className="font-body text-charcoal/50 text-sm mb-6">Your rent request has been sent to the owner. You'll be notified once they respond.</p>
            <button onClick={onClose} className="orange-gradient px-8 py-3 rounded-xl font-body text-sm font-bold text-white shadow-orange">Done</button>
          </div>
        ) : (
          <>
            <div className="flex gap-4 p-5 border-b border-gray-100 bg-gray-50">
              <img src={imgUrl} alt={property?.title} className="w-20 h-16 rounded-xl object-cover shrink-0" />
              <div className="min-w-0">
                <h4 className="font-display text-base font-bold text-charcoal truncate">{property?.title}</h4>
                <p className="font-body text-sm text-charcoal/45 truncate">📍 {property?.location?.address}, {property?.location?.city}</p>
                <p className="font-display text-base font-bold text-orange mt-1">
                  ₹{property?.price?.toLocaleString("en-IN")}
                  <span className="font-body text-xs text-charcoal/35 font-normal ml-1">/month</span>
                </p>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-display text-xl font-bold text-charcoal mb-5">Send Rent Request</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2 block">Preferred Move-in Date *</label>
                  <input type="date" value={form.moveInDate} min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm((f) => ({ ...f, moveInDate: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2 block">Message to Owner (optional)</label>
                  <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Introduce yourself and mention anything the owner should know..." rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal text-sm font-body focus:border-orange/40 focus:bg-white transition-all resize-none" />
                </div>
              </div>
              {error && <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-500 text-sm font-body">{error}</div>}
              <div className="flex gap-3 mt-5">
                <button onClick={onClose}
                  className="flex-1 bg-gray-50 border border-gray-200 py-3 rounded-xl font-body text-sm font-semibold text-charcoal/60 hover:text-charcoal hover:border-gray-300 transition-all">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 orange-gradient py-3 rounded-xl font-body text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60 shadow-orange">
                  {loading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
