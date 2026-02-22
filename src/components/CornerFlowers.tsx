const Tulip = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 60" className={className} width="40" height="60" fill="none">
    <path d="M20 58V30" stroke="hsl(140,45%,42%)" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 35c-6-2-12 0-14 4" stroke="hsl(140,40%,50%)" strokeWidth="1.5" fill="none" />
    <path d="M10 20c0-10 5-18 10-18s10 8 10 18c0 6-4 12-10 12s-10-6-10-12z" fill="hsl(340,72%,58%)" />
    <path d="M15 18c0-6 2-12 5-12s5 6 5 12c0 4-2 8-5 8s-5-4-5-8z" fill="hsl(340,72%,65%)" opacity="0.6" />
  </svg>
);

const Daisy = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} width="36" height="36" fill="none">
    {[0, 60, 120, 180, 240, 300].map(a => (
      <ellipse key={a} cx="18" cy="18" rx="4" ry="10" fill="hsl(0,0%,100%)" stroke="hsl(340,20%,85%)" strokeWidth="0.5"
        transform={`rotate(${a} 18 18) translate(0 -6)`} />
    ))}
    <circle cx="18" cy="18" r="4" fill="hsl(45,90%,60%)" />
  </svg>
);

const Leaf = ({ className, flip }: { className?: string; flip?: boolean }) => (
  <svg viewBox="0 0 24 40" className={className} width="24" height="40" fill="none"
    style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M12 38C12 38 2 28 2 18C2 8 12 2 12 2C12 2 22 8 22 18C22 28 12 38 12 38Z"
      fill="hsl(140,40%,55%)" opacity="0.7" />
    <path d="M12 36V6" stroke="hsl(140,35%,40%)" strokeWidth="1" />
  </svg>
);

const CornerFlowers = () => (
  <div className="fixed inset-0 pointer-events-none z-10" aria-hidden="true">
    {/* Top-left */}
    <div className="absolute top-3 left-3 flex items-end gap-1.5 opacity-80">
      <Tulip className="w-9 h-auto -rotate-12" />
      <Daisy className="w-8 h-8 -mb-1" />
      <Leaf className="w-5 h-auto rotate-12" />
    </div>
    {/* Top-right */}
    <div className="absolute top-3 right-3 flex items-end gap-1.5 opacity-80">
      <Leaf className="w-5 h-auto -rotate-12" flip />
      <Daisy className="w-8 h-8 -mb-1" />
      <Tulip className="w-9 h-auto rotate-12" />
    </div>
    {/* Bottom-left */}
    <div className="absolute bottom-8 left-3 flex items-start gap-1.5 opacity-60">
      <Daisy className="w-7 h-7" />
      <Leaf className="w-5 h-auto rotate-45" />
    </div>
    {/* Bottom-right */}
    <div className="absolute bottom-8 right-3 flex items-start gap-1.5 opacity-60">
      <Leaf className="w-5 h-auto -rotate-45" flip />
      <Daisy className="w-7 h-7" />
    </div>
    {/* Left edge accent */}
    <div className="absolute left-2 top-[42%] flex flex-col items-center gap-2 opacity-60">
      <Daisy className="w-5 h-5 -rotate-6" />
      <Leaf className="w-4 h-auto" />
    </div>
    {/* Right edge accent */}
    <div className="absolute right-2 top-[38%] flex flex-col items-center gap-2 opacity-60">
      <Leaf className="w-4 h-auto" flip />
      <Daisy className="w-5 h-5 rotate-6" />
    </div>
  </div>
);

export default CornerFlowers;
