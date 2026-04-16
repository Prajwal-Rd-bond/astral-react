import "./IntroScreen.css";
import { useEffect, useRef, useState } from "react";

export default function IntroScreen({ onEnter }) {
  const canvasRef = useRef(null);
  const sunRef = useRef(null);
  const nebulaRef = useRef(null);
  const [activeNav, setActiveNav] = useState(0);
  const animRef = useRef(null);
  const starsRef = useRef([]);
  const tRef = useRef(0);

  // ⭐ Starfield
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((W * H) / 1200);
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.7,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      tRef.current += 0.02;

      for (const s of starsRef.current) {
        ctx.globalAlpha = s.alpha * (0.6 + 0.4 * Math.sin(tRef.current));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  // 🖱️ Parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;

      if (sunRef.current) {
        sunRef.current.style.transform = `translateX(calc(-50% + ${
          cx * 20
        }px)) translateY(${cy * 10}px)`;
      }

      if (nebulaRef.current) {
        nebulaRef.current.style.transform = `translate(${cx * 10}px, ${
          cy * 8
        }px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="ae-root">
      <canvas ref={canvasRef} className="ae-canvas" />

      <div ref={nebulaRef} className="ae-nebula" />

      <div className="ae-orbit-ring" />
      <div className="ae-orbit-ring ae-orbit-ring-2" />

      <div ref={sunRef} className="ae-sun-wrap">
        <div className="ae-sun-corona-2" />
        <div className="ae-sun-corona" />
        <div className="ae-sun-body" />
      </div>

      <div className="ae-horizon" />

      <div className="ae-content">
        <div className="ae-eyebrow">A Journey Beyond</div>

        <h1 className="ae-title">
          ASTRAL
          <span className="ae-title-sub">EXPLORER</span>
        </h1>

        <div className="ae-divider" />

        <p className="ae-tagline">
          Navigate the cosmos. Discover every world orbiting our star — from
          scorched rock to frozen giant.
        </p>

        <div className="ae-cta-wrap">
          <button className="ae-cta" onClick={onEnter}>
            BEGIN EXPLORATION
            <span className="ae-cta-arrow" />
          </button>
        </div>
      </div>

      <div className="ae-nav-dots">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            className={`ae-dot ${activeNav === i ? "ae-dot-active" : ""}`}
            onClick={() => setActiveNav(i)}
          />
        ))}
      </div>
    </div>
  );
}