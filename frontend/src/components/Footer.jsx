const FOOTER_COLS = [
  { title:"Platform", links:["Browse Properties","List Property","How It Works","Pricing"] },
  { title:"Company",  links:["About Us","Careers","Press","Contact"] },
  { title:"Legal",    links:["Privacy Policy","Terms of Use","Cookie Policy","Support"] },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/8 pt-14 pb-8 px-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <div className="font-display text-[22px] font-bold text-white mb-4">
              Heaven <span style={{background:"linear-gradient(135deg,#E8621A,#F5874A)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Village</span>
            </div>
            <p className="font-body text-sm text-white/40 leading-relaxed max-w-[280px]">
              India's most trusted rental platform connecting verified owners with quality tenants.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="font-body text-[11px] font-bold tracking-[0.12em] text-orange uppercase mb-5">{col.title}</div>
              {col.links.map((link) => (
                <a key={link} href="#"
                  className="block font-body text-sm text-white/40 mb-2.5 hover:text-orange transition-colors duration-200">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/8 pt-7 flex items-center justify-between">
          <p className="font-body text-sm text-white/25">© 2025 Heaven Village. All rights reserved.</p>
          <p className="font-body text-sm text-white/25">Made with ♥ in India</p>
        </div>
      </div>
    </footer>
  );
}
