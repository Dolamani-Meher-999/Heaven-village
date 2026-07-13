import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OFFICES = [
  { city: "Bhubaneswar", address: "Plot No. 42, Saheed Nagar, Bhubaneswar, Odisha 751007", phone: "+91 674 235 8800", email: "bbsr@heavenvillage.in" },
  { city: "Mumbai",      address: "Level 8, One BKC, Bandra Kurla Complex, Mumbai 400051",  phone: "+91 22 4890 3300",  email: "mumbai@heavenvillage.in" },
  { city: "Bengaluru",   address: "Tower B, RMZ Infinity, Old Madras Rd, Bengaluru 560016", phone: "+91 80 6741 2200",  email: "blr@heavenvillage.in" },
];

const FAQ = [
  { q: "How long does it take to list a property?",    a: "Your listing goes live within 24 hours after admin approval. You'll receive an email notification once it's approved." },
  { q: "Is Heaven Village available outside India?",    a: "Currently we operate exclusively across major Indian cities, with expansion plans underway for 2026." },
  { q: "How do I report a fraudulent listing?",        a: "Use the 'Report' button on any property card, or email us at safety@heavenvillage.in. We investigate within 12 hours." },
  { q: "Can I list multiple properties?",              a: "Yes — owners can list unlimited properties from their dashboard. Each listing is reviewed individually." },
];

export default function ContactPage({ onLogin, onRegister }) {
  const [form,    setForm]    = useState({ name: "", email: "", subject: "", message: "" });
  const [sent,    setSent]    = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar onLogin={onLogin} onRegister={onRegister} />

      {/* Hero */}
      <section className="pt-32 pb-20 px-8" style={{ background: "linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%)" }}>
        <div className="max-w-[1100px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(232,98,26,0.15)", border: "1px solid rgba(232,98,26,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange" />
            <span className="font-body text-xs font-bold uppercase tracking-[0.18em] text-orange">Get In Touch</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-5 leading-tight">
            We're Here to <span style={{ color: "#F5874A" }}>Help You</span>
          </h1>
          <p className="font-body text-lg text-white/45 max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or need assistance? Our team typically responds within 2 business hours.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="max-w-[1100px] mx-auto px-8 -mt-10 mb-16">
        <div className="grid grid-cols-3 gap-5">
          {[
            { icon: "📞", label: "Call Us",       value: "+91 1800 123 4567",       sub: "Mon–Sat, 9 AM – 7 PM IST", color: "#E8621A" },
            { icon: "✉️", label: "Email Us",      value: "support@heavenvillage.in", sub: "Reply within 2 hours",       color: "#4F46E5" },
            { icon: "💬", label: "Live Chat",     value: "Start a conversation",     sub: "Available 24 × 7",           color: "#059669" },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-card-hover"
              style={{ border: "1px solid rgba(26,26,46,0.07)", boxShadow: "0 2px 16px rgba(26,26,46,0.06)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                style={{ background: `${c.color}18` }}>
                {c.icon}
              </div>
              <div className="font-body text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-2">{c.label}</div>
              <div className="font-display text-base font-bold text-charcoal mb-1">{c.value}</div>
              <div className="font-body text-xs text-charcoal/40">{c.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="max-w-[1100px] mx-auto px-8 mb-20">
        <div className="grid grid-cols-[1.2fr_1fr] gap-10">

          {/* Form */}
          <div className="bg-white rounded-3xl p-8"
            style={{ border: "1px solid rgba(26,26,46,0.07)", boxShadow: "0 2px 20px rgba(26,26,46,0.06)" }}>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
              <h2 className="font-display text-2xl font-bold text-charcoal">Send a Message</h2>
            </div>

            {sent ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg,#D1FAE5,#A7F3D0)" }}>✅</div>
                <h3 className="font-display text-xl font-bold text-charcoal mb-2">Message Sent!</h3>
                <p className="font-body text-sm text-charcoal/45">We'll get back to you at <strong>{form.email}</strong> within 2 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name:"", email:"", subject:"", message:"" }); }}
                  className="mt-6 font-body text-sm font-semibold text-orange border-b border-orange/30 hover:border-orange transition-colors">
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key:"name",    label:"Full Name",      type:"text",  placeholder:"Ravi Kumar"            },
                    { key:"email",   label:"Email Address",  type:"email", placeholder:"ravi@example.com"      },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block font-body text-xs font-bold uppercase tracking-wider text-charcoal/50 mb-2">{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        required
                        className="w-full px-4 py-3 rounded-xl font-body text-sm text-charcoal bg-cream focus:outline-none focus:ring-2 focus:ring-orange/20"
                        style={{ border: "1px solid rgba(26,26,46,0.1)" }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block font-body text-xs font-bold uppercase tracking-wider text-charcoal/50 mb-2">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} required
                    className="w-full px-4 py-3 rounded-xl font-body text-sm text-charcoal bg-cream focus:outline-none focus:ring-2 focus:ring-orange/20"
                    style={{ border: "1px solid rgba(26,26,46,0.1)" }}>
                    <option value="">Select a topic…</option>
                    {["Property Listing Issue","Rent Request Help","Account & Billing","Report a Listing","General Enquiry"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs font-bold uppercase tracking-wider text-charcoal/50 mb-2">Message</label>
                  <textarea rows={5} placeholder="Describe your issue or question…" value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl font-body text-sm text-charcoal bg-cream focus:outline-none focus:ring-2 focus:ring-orange/20 resize-none"
                    style={{ border: "1px solid rgba(26,26,46,0.1)" }}
                  />
                </div>
                <button type="submit"
                  className="w-full py-3.5 rounded-xl font-body text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)", boxShadow: "0 8px 24px rgba(232,98,26,0.3)" }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
              <h2 className="font-display text-2xl font-bold text-charcoal">Frequently Asked</h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden transition-all"
                  style={{ border: "1px solid rgba(26,26,46,0.07)", boxShadow: "0 1px 8px rgba(26,26,46,0.04)" }}>
                  <button className="w-full flex items-center justify-between px-6 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-body text-sm font-semibold text-charcoal pr-4">{item.q}</span>
                    <span className="font-body text-lg text-orange flex-shrink-0 transition-transform duration-200"
                      style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="font-body text-sm text-charcoal/55 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Office locations */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
                <h2 className="font-display text-xl font-bold text-charcoal">Our Offices</h2>
              </div>
              <div className="space-y-3">
                {OFFICES.map((o) => (
                  <div key={o.city} className="bg-white rounded-2xl p-5"
                    style={{ border: "1px solid rgba(26,26,46,0.07)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)" }}>
                        <span className="text-white font-bold text-xs">{o.city[0]}</span>
                      </div>
                      <div>
                        <div className="font-display text-sm font-bold text-charcoal mb-1">{o.city}</div>
                        <div className="font-body text-xs text-charcoal/45 leading-relaxed mb-1">{o.address}</div>
                        <div className="font-body text-xs text-orange">{o.phone} · {o.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
