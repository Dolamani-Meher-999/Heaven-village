export default function CTA({ onRegister }) {
  return (
    <section className="relative py-24 px-12 overflow-hidden bg-charcoal">
      <div className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80)" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,98,26,0.12)_0%,transparent_70%)]" />
      <div className="relative z-10 max-w-[700px] mx-auto text-center">
        <div className="w-[60px] h-px bg-gradient-to-r from-transparent via-orange to-transparent mx-auto mb-8" />
        <h2 className="font-display text-5xl font-bold text-white mb-5 leading-[1.15]">
          Ready to Find Your<br />
          <span style={{background:"linear-gradient(135deg,#E8621A,#F5874A)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Dream Home?</span>
        </h2>
        <p className="font-body text-[17px] text-white/50 leading-relaxed mb-10 max-w-lg mx-auto">
          Join thousands of tenants and owners who trust Heaven Village for their rental journey. Free to start.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={onRegister}
            className="orange-gradient px-10 py-4 rounded-xl text-white text-[15px] font-bold font-body tracking-wide shadow-orange hover:opacity-90 transition-opacity">
            Register as Tenant
          </button>
          <button className="bg-transparent border border-white/20 px-10 py-4 rounded-xl text-white/80 text-[15px] font-body font-semibold hover:bg-white/8 transition-colors">
            List Your Property
          </button>
        </div>
      </div>
    </section>
  );
}
