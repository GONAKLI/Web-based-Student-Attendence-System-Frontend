import { useEffect, useRef, useState } from "react";
import { Home } from "lucide-react";

const MESSAGES = [
  "Measuring twice…",
  "Cutting once…",
  "Tightening the bolts…",
  "Aligning the pixels…",
  "Sanding the edges…",
  "Almost there…",
];

const CYCLE_MS = 1700; // duration of one hammer swing loop
const STRIKE_AT = Math.round(CYCLE_MS * 0.58); // when the hammer actually lands

export default function UnderConstruction() {
  const [progress, setProgress] = useState(9);
  const [hit, setHit] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const idRef = useRef(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion.current) {
      setProgress(64);
      return;
    }

    const interval = setInterval(() => {
      const strikeTimeout = setTimeout(() => {
        setHit(true);
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setProgress((p) => (p >= 91 ? 91 : Math.min(91, p + 4 + Math.round(Math.random() * 4))));

        const batch = Array.from({ length: 7 }).map(() => {
          idRef.current += 1;
          const angle = -40 + Math.random() * 80; // spread of sparks
          const dist = 26 + Math.random() * 26;
          return {
            id: idRef.current,
            kind: Math.random() > 0.35 ? "spark" : "dust",
            tx: Math.cos((angle * Math.PI) / 180) * dist,
            ty: -Math.abs(Math.sin((angle * Math.PI) / 180) * dist) - 8,
            rot: Math.random() * 360,
            delay: Math.random() * 40,
          };
        });
        setParticles((prev) => [...prev, ...batch]);

        setTimeout(() => setHit(false), 220);
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => !batch.some((b) => b.id === p.id)));
        }, 650);
      }, STRIKE_AT);

      return () => clearTimeout(strikeTimeout);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, []);

  const heading = "UNDER CONSTRUCTION";

  return (
    <div className="uc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');

        .uc-root, .uc-root * { box-sizing: border-box; }

        .uc-root {
          --navy: #0e1f3d;
          --navy-deep: #081427;
          --orange: #ff6b35;
          --yellow: #ffc93c;
          --teal: #5fb49c;
          --ink: #f4f1ea;
          --muted: #8fa3c7;
          --grid-line: rgba(255,255,255,0.055);

          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 20px 40px;
          overflow: hidden;
          background-color: var(--navy);
          background-image:
            radial-gradient(ellipse at 50% 0%, rgba(143,163,199,0.16), transparent 55%),
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: auto, 42px 42px, 42px 42px;
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--ink);
          isolation: isolate;
        }

        /* ambient diagonal scan light */
        .uc-scan {
          position: absolute;
          inset: -20% -60%;
          background: linear-gradient(100deg, transparent 42%, rgba(255,255,255,0.07) 50%, transparent 58%);
          animation: uc-scan-move 7s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes uc-scan-move {
          0% { transform: translateX(-15%); }
          100% { transform: translateX(15%); }
        }

        /* floating ambient glyphs */
        .uc-float {
          position: absolute;
          font-size: 28px;
          opacity: 0.16;
          filter: grayscale(0.2);
          animation: uc-bob 6s ease-in-out infinite;
          z-index: 0;
          user-select: none;
        }
        @keyframes uc-bob {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-16px) rotate(4deg); }
        }

        .uc-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 560px;
          background: linear-gradient(180deg, #16294b 0%, #11203f 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          padding: 64px 36px 40px;
          box-shadow:
            0 30px 60px -20px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,255,255,0.02) inset;
          text-align: center;
        }
        .uc-card.uc-hit { animation: uc-card-shake 0.22s ease; }
        @keyframes uc-card-shake {
          0%   { transform: translate(0,0) rotate(0); }
          20%  { transform: translate(-3px, 2px) rotate(-0.4deg); }
          45%  { transform: translate(3px, -2px) rotate(0.5deg); }
          70%  { transform: translate(-2px, 1px) rotate(-0.3deg); }
          100% { transform: translate(0,0) rotate(0); }
        }

        /* caution strip along the top edge of the card */
        .uc-strip {
          position: absolute;
          top: 0; left: 14px; right: 14px;
          height: 10px;
          border-radius: 4px;
          background: repeating-linear-gradient(
            135deg,
            var(--yellow) 0 14px,
            var(--navy-deep) 14px 28px
          );
          background-size: 200% 100%;
          animation: uc-strip-move 3.5s linear infinite;
          opacity: 0.9;
        }
        @keyframes uc-strip-move {
          to { background-position: -56px 0; }
        }

        /* ----- robot ----- */
        .uc-robot-wrap {
          position: absolute;
          top: -78px;
          right: 8%;
          width: 132px;
          height: 150px;
          z-index: 2;
          filter: drop-shadow(0 10px 12px rgba(0,0,0,0.35));
        }
        .uc-robot-wrap svg { width: 100%; height: 100%; overflow: visible; }

        .uc-eye { animation: uc-blink 4.4s ease-in-out infinite; transform-origin: center; }
        @keyframes uc-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.12); }
        }
        .uc-antenna-light { animation: uc-pulse 1.1s ease-in-out infinite; }
        @keyframes uc-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .uc-hammer-arm {
          transform-origin: 86px 78px;
          animation: uc-swing ${CYCLE_MS}ms cubic-bezier(.45,.05,.55,.95) infinite;
        }
        @keyframes uc-swing {
          0%   { transform: rotate(-58deg); }
          34%  { transform: rotate(-78deg); }
          58%  { transform: rotate(28deg); }
          72%  { transform: rotate(8deg); }
          100% { transform: rotate(-58deg); }
        }

        .uc-root.uc-reduced .uc-hammer-arm { animation: none; transform: rotate(-20deg); }
        .uc-root.uc-reduced .uc-eye,
        .uc-root.uc-reduced .uc-antenna-light,
        .uc-root.uc-reduced .uc-strip,
        .uc-root.uc-reduced .uc-scan,
        .uc-root.uc-reduced .uc-float { animation: none; }

        /* impact particles */
        .uc-impact {
          position: absolute;
          top: 14px;
          right: 13%;
          width: 2px; height: 2px;
          z-index: 3;
        }
        .uc-particle {
          position: absolute;
          left: 0; top: 0;
          border-radius: 50%;
          animation: uc-fly 0.6s ease-out forwards;
        }
        .uc-particle.spark { width: 6px; height: 6px; background: var(--yellow); box-shadow: 0 0 6px var(--orange); }
        .uc-particle.dust { width: 10px; height: 10px; background: rgba(244,241,234,0.5); border-radius: 50%; }
        @keyframes uc-fly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; }
        }

        /* heading made of "planks" sliding into place */
        .uc-heading {
          margin: 22px 0 4px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(28px, 6vw, 40px);
          letter-spacing: 0.02em;
          line-height: 1.1;
        }
        .uc-heading span {
          display: inline-block;
          opacity: 0;
          transform: translateY(18px) rotate(-6deg);
          animation: uc-letter-in 0.5s cubic-bezier(.2,1.4,.4,1) forwards;
        }
        .uc-word { display: inline-block; white-space: nowrap; }
        @keyframes uc-letter-in {
          to { opacity: 1; transform: translateY(0) rotate(0); }
        }

        .uc-tagline {
          margin: 14px auto 0;
          max-width: 420px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
        }

        .uc-bubble-row {
          margin-top: 18px;
          height: 20px;
        }
        .uc-bubble {
          display: inline-block;
          font-family: 'Space Mono', monospace;
          font-size: 12.5px;
          color: var(--orange);
          animation: uc-bubble-in 0.4s ease;
        }
        @keyframes uc-bubble-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* progress / tape measure */
        .uc-progress-wrap { margin: 30px 0 8px; text-align: left; }
        .uc-progress-label {
          display: flex;
          justify-content: space-between;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--muted);
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .uc-progress-label b {
          color: var(--ink);
          font-size: 13px;
        }
        .uc-track {
          position: relative;
          height: 16px;
          border-radius: 8px;
          background:
            repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 1px, transparent 1px 10px),
            #0a1830;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .uc-fill {
          position: absolute;
          inset: 0;
          width: var(--w);
          border-radius: 8px 0 0 8px;
          background: linear-gradient(90deg, var(--teal), #7fd1bb);
          transition: width 0.5s cubic-bezier(.3,1,.4,1);
          box-shadow: 0 0 14px rgba(95,180,156,0.55);
        }

        /* home button */
        .uc-actions { margin-top: 30px; }
        .uc-home-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 26px;
          border-radius: 12px;
          background: var(--orange);
          color: #1a1206;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 0 #c7491b, 0 10px 18px rgba(0,0,0,0.35);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .uc-home-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 0 #c7491b, 0 14px 20px rgba(0,0,0,0.4); }
        .uc-home-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 #c7491b, 0 4px 10px rgba(0,0,0,0.3); }
        .uc-home-btn:focus-visible { outline: 3px solid var(--yellow); outline-offset: 3px; }

        @media (prefers-reduced-motion: reduce) {
          .uc-heading span { animation: none; opacity: 1; transform: none; }
          .uc-card.uc-hit { animation: none; }
        }

        @media (max-width: 480px) {
          .uc-robot-wrap { right: 6%; width: 104px; height: 120px; top: -62px; }
          .uc-card { padding: 56px 22px 32px; }
        }
      `}</style>

      <div className="uc-scan" />
      <span className="uc-float" style={{ top: "12%", left: "8%", animationDelay: "0s" }}>⚙️</span>
      <span className="uc-float" style={{ top: "70%", left: "10%", animationDelay: "1.5s", fontSize: 22 }}>🔩</span>
      <span className="uc-float" style={{ top: "20%", right: "6%", animationDelay: "0.8s", fontSize: 22 }}>📐</span>
      <span className="uc-float" style={{ top: "78%", right: "10%", animationDelay: "2.2s" }}>🧱</span>

      <div className={`uc-card ${hit ? "uc-hit" : ""}`}>
        <div className="uc-strip" />

        <div className="uc-robot-wrap" aria-hidden="true">
          <svg viewBox="0 0 132 150" fill="none">
            {/* tread / base */}
            <rect x="22" y="124" width="80" height="16" rx="8" fill="#0a1830" />
            <rect x="22" y="124" width="80" height="16" rx="8" fill="#16294b" opacity="0.5" />

            {/* static arm */}
            <rect x="30" y="78" width="14" height="38" rx="6" fill="#33476f" />
            <circle cx="37" cy="118" r="7" fill="#28395c" />

            {/* body */}
            <rect x="36" y="68" width="60" height="58" rx="14" fill="#3a4a6b" />
            <rect x="48" y="80" width="36" height="22" rx="6" fill="#243559" />
            <circle cx="66" cy="91" r="6" fill="#ff6b35" className="uc-antenna-light" />

            {/* head */}
            <rect x="42" y="22" width="48" height="40" rx="12" fill="#4c5e85" />
            <circle cx="56" cy="42" r="5.5" fill="#bfe3ff" className="uc-eye" />
            <circle cx="76" cy="42" r="5.5" fill="#bfe3ff" className="uc-eye" />
            <rect x="63" y="8" width="4" height="16" rx="2" fill="#4c5e85" />
            <circle cx="65" cy="8" r="5" fill="#ffc93c" className="uc-antenna-light" />

            {/* hammer arm (rotates) */}
            <g className="uc-hammer-arm">
              <rect x="78" y="72" width="15" height="34" rx="6" fill="#33476f" />
              <circle cx="85" cy="106" r="8" fill="#28395c" />
              <g transform="translate(76 102) rotate(-18)">
                <rect x="-4" y="-2" width="9" height="46" rx="3" fill="#c98a4e" />
                <rect x="-16" y="-22" width="34" height="20" rx="5" fill="#7d8aa0" />
                <rect x="-16" y="-22" width="34" height="7" rx="3" fill="#9aa6ba" />
              </g>
            </g>
          </svg>
        </div>

        <div className="uc-impact">
          {particles.map((p) => (
            <span
              key={p.id}
              className={`uc-particle ${p.kind}`}
              style={{
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`,
                animationDelay: `${p.delay}ms`,
              }}
            />
          ))}
        </div>

        <h1 className="uc-heading">
          {heading.split(" ").flatMap((word, wi, arr) => {
            const wordEl = (
              <span className="uc-word" key={`w-${wi}`}>
                {word.split("").map((ch, i) => (
                  <span key={i} style={{ animationDelay: `${(wi * 7 + i) * 0.035 + 0.15}s` }}>
                    {ch}
                  </span>
                ))}
              </span>
            );
            return wi < arr.length - 1 ? [wordEl, " "] : [wordEl];
          })}
        </h1>

        <p className="uc-tagline">
          This page is being assembled by hand — well, by one very enthusiastic robot.
          Every hit you see below nudges things a little closer to done.
        </p>

        <div className="uc-bubble-row">
          <span className="uc-bubble" key={msgIndex}>{MESSAGES[msgIndex]}</span>
        </div>

        <div className="uc-progress-wrap">
          <div className="uc-progress-label">
            <span>Construction progress</span>
            <b>{progress}%</b>
          </div>
          <div className="uc-track">
            <div className="uc-fill" style={{ "--w": `${progress}%` }} />
          </div>
        </div>

        <div className="uc-actions">
          <a className="uc-home-btn" href="/">
            <Home size={18} strokeWidth={2.4} />
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}