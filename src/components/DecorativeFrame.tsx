const DecorativeFrame = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 400 500"
    preserveAspectRatio="none"
    fill="none"
    aria-hidden="true"
  >
    {/* Vine curves along edges */}
    <path
      d="M20 20 Q200 5 380 20 Q395 250 380 480 Q200 495 20 480 Q5 250 20 20Z"
      stroke="hsl(140,35%,65%)"
      strokeWidth="1.2"
      strokeDasharray="6 4"
      opacity="0.4"
    />
    {/* Small leaves along the vine */}
    {[
      { x: 60, y: 14, r: -30 }, { x: 150, y: 8, r: 15 }, { x: 280, y: 10, r: -10 }, { x: 340, y: 16, r: 25 },
      { x: 388, y: 100, r: 80 }, { x: 392, y: 220, r: 95 }, { x: 390, y: 380, r: 100 },
      { x: 340, y: 488, r: 210 }, { x: 200, y: 494, r: 190 }, { x: 80, y: 490, r: 160 },
      { x: 10, y: 400, r: -80 }, { x: 6, y: 250, r: -95 }, { x: 8, y: 120, r: -100 },
    ].map(({ x, y, r }, i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
        <path d="M0 0C3-5 8-6 10-3C12 0 8 4 5 6C2 8-2 4 0 0Z" fill="hsl(140,40%,55%)" opacity="0.35" />
      </g>
    ))}
    {/* Tiny flowers at corners */}
    {[
      { cx: 24, cy: 24 }, { cx: 376, cy: 24 }, { cx: 24, cy: 476 }, { cx: 376, cy: 476 },
    ].map(({ cx, cy }, i) => (
      <g key={i}>
        {[0, 72, 144, 216, 288].map(a => (
          <ellipse key={a} cx={cx} cy={cy} rx="3" ry="7" fill="hsl(340,60%,75%)" opacity="0.4"
            transform={`rotate(${a} ${cx} ${cy}) translate(0 -4)`} />
        ))}
        <circle cx={cx} cy={cy} r="2.5" fill="hsl(45,80%,65%)" opacity="0.5" />
      </g>
    ))}
  </svg>
);

export default DecorativeFrame;
