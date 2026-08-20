"use client";

import * as React from "react";

interface CodeToken3D {
  text: string;
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  floatSpeed: number;
  phaseX: number;
  phaseY: number;
  phaseZ: number;
  color: string;
  badgeBg: string;
  borderColor: string;
  dotColor: string;
  type: "tag" | "fn" | "keyword" | "var" | "bracket" | "tech";
}

interface FloatingGlyph3D {
  symbol: string;
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  size: number;
  color: string;
  floatSpeed: number;
  phase: number;
}

interface DataPulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface AmbientOrb {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

const CODE_SNIPPETS = [
  { text: "<Component />", type: "tag" as const },
  { text: "const [state, set]", type: "var" as const },
  { text: "async function()", type: "fn" as const },
  { text: "import { motion }", type: "keyword" as const },
  { text: "npm i @jakdev/ui", type: "tech" as const },
  { text: "flex items-center", type: "keyword" as const },
  { text: "export default", type: "keyword" as const },
  { text: "{ children }", type: "bracket" as const },
  { text: "Tailwind CSS", type: "tech" as const },
  { text: "TypeScript 5.x", type: "tech" as const },
  { text: "Next.js 15", type: "tech" as const },
  { text: "git push origin", type: "tech" as const },
  { text: "<HeroSection />", type: "tag" as const },
  { text: "bg-white/80", type: "var" as const },
  { text: "useEffect(() => {})", type: "fn" as const },
  { text: "shadow-soft-2xl", type: "var" as const },
  { text: "01001010 01100001", type: "bracket" as const },
  { text: "() => void", type: "fn" as const },
  { text: "<Navbar sticky />", type: "tag" as const },
  { text: "backdrop-blur-md", type: "var" as const },
  { text: "props: Props", type: "var" as const },
  { text: "200 OK", type: "tech" as const },
  { text: "React.FC", type: "tech" as const },
];

const GLYPHS = ["{ }", "</>", "=>", "[ ]", "//", "&&", "*", "::", "~"];

export function AmbientBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // High DPI Resolution Setup
    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const displayWidth = parent?.clientWidth || window.innerWidth;
      const displayHeight = parent?.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = displayWidth;
      height = displayHeight;

      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse Tracking in Normalized Coordinates (-1 to 1)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let rawMouseX = -9999;
    let rawMouseY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rawMouseX = x;
      rawMouseY = y;
      targetMouseX = (x - width / 2) / (width / 2);
      targetMouseY = (y - height / 2) / (height / 2);
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
      rawMouseX = -9999;
      rawMouseY = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // IntersectionObserver to pause rendering when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Ambient Luminous Color Orbs (Soft Gradient Bokeh in 3D Depth)
    const orbs: AmbientOrb[] = [
      { x: width * 0.2, y: height * 0.3, radius: 260, color: "rgba(186, 232, 232, 0.35)", vx: 0.15, vy: 0.1 },
      { x: width * 0.8, y: height * 0.7, radius: 300, color: "rgba(227, 246, 245, 0.45)", vx: -0.12, vy: 0.08 },
      { x: width * 0.5, y: height * 0.5, radius: 220, color: "rgba(255, 216, 3, 0.12)", vx: 0.08, vy: -0.14 },
    ];

    // Initialize 3D Code Tokens
    const focalLength = 340;
    const isMobile = width < 640;
    const tokenCount = isMobile ? 10 : width < 1024 ? 15 : 22;
    const tokens: CodeToken3D[] = [];

    for (let i = 0; i < tokenCount; i++) {
      const snippet = CODE_SNIPPETS[i % CODE_SNIPPETS.length];
      const z = Math.random() * 500 - 150; // -150 (close) to 350 (far)
      const x = (Math.random() - 0.5) * (width * 1.25);
      const y = (Math.random() - 0.5) * (height * 1.15);

      const dotColor =
        snippet.type === "tech" ? "#FFD803" : snippet.type === "tag" ? "#0D6E6E" : "#272343";

      tokens.push({
        text: snippet.text,
        type: snippet.type,
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        floatSpeed: 0.0008 + Math.random() * 0.0012,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        color: snippet.type === "tech" ? "#0D6E6E" : snippet.type === "tag" ? "#272343" : "#2D334A",
        badgeBg: "rgba(255, 255, 255, 0.88)",
        borderColor: "rgba(186, 232, 232, 0.9)",
        dotColor,
      });
    }

    // Initialize 3D Floating Glyphs
    const glyphCount = isMobile ? 4 : 8;
    const glyphs: FloatingGlyph3D[] = [];
    for (let i = 0; i < glyphCount; i++) {
      const symbol = GLYPHS[i % GLYPHS.length];
      const z = Math.random() * 450 - 100;
      const x = (Math.random() - 0.5) * (width * 1.3);
      const y = (Math.random() - 0.5) * (height * 1.2);

      glyphs.push({
        symbol,
        x,
        y,
        z,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.004,
        vRotY: (Math.random() - 0.5) * 0.005,
        vRotZ: (Math.random() - 0.5) * 0.003,
        size: 18 + Math.random() * 16,
        color: i % 2 === 0 ? "rgba(13, 110, 110, 0.28)" : "rgba(255, 216, 3, 0.35)",
        floatSpeed: 0.0006 + Math.random() * 0.0008,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Data Pulses traveling between connected nodes in 3D
    const pulses: DataPulse[] = [];
    for (let i = 0; i < 4; i++) {
      pulses.push({
        fromIndex: Math.floor(Math.random() * tokens.length),
        toIndex: Math.floor(Math.random() * tokens.length),
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008,
        color: i % 2 === 0 ? "#FFD803" : "#0D6E6E",
      });
    }

    let time = 0;

    // Main Render Loop
    const render = (timestamp: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time = timestamp;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation (Lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // 1. Draw Ambient Luminous Bokeh Orbs in Background
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        if (!prefersReducedMotion) {
          orb.x += orb.vx;
          orb.y += orb.vy;
          if (orb.x < -100) orb.x = width + 100;
          if (orb.x > width + 100) orb.x = -100;
          if (orb.y < -100) orb.y = height + 100;
          if (orb.y > height + 100) orb.y = -100;
        }

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Dynamic 3D Spatial Angles with Mouse Parallax + Subtle Organic Breathing
      const rotY = currentMouseX * 0.3 + Math.sin(time * 0.0004) * 0.04;
      const rotX = -currentMouseY * 0.25 + Math.cos(time * 0.0003) * 0.03;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // 2. Render Floating 3D Geometric Glyphs
      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        if (!prefersReducedMotion) {
          g.rotX += g.vRotX;
          g.rotY += g.vRotY;
          g.rotZ += g.vRotZ;
          g.y += Math.sin(time * g.floatSpeed + g.phase) * 0.3;
          g.x += Math.cos(time * g.floatSpeed * 0.8 + g.phase) * 0.25;
        }

        const x1 = g.x * cosY - g.z * sinY;
        const z1 = g.z * cosY + g.x * sinY;
        const y1 = g.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + g.y * sinX;

        const camZ = z2 + focalLength;
        if (camZ <= 20) continue;

        const scale = focalLength / camZ;
        const px = x1 * scale + width / 2;
        const py = y1 * scale + height / 2;

        const normalizedZ = (z2 + 100) / 450;
        const alpha = Math.max(0.08, Math.min(0.4, 1 - normalizedZ * 0.8));

        ctx.save();
        ctx.translate(px, py);
        ctx.scale(scale, scale);
        ctx.rotate(g.rotZ);
        ctx.globalAlpha = alpha;
        ctx.font = `700 ${g.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = g.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(g.symbol, 0, 0);
        ctx.restore();
      }

      // 3. Compute and Project 3D Code Tokens
      interface ProjectedToken {
        token: CodeToken3D;
        originalIndex: number;
        px: number;
        py: number;
        pz: number;
        scale: number;
        alpha: number;
        isHoveredNear: boolean;
      }

      const projected: ProjectedToken[] = [];

      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];

        if (!prefersReducedMotion) {
          // Harmonic multi-axis oscillation (Zero-gravity organic float)
          t.x = t.baseX + Math.sin(time * t.floatSpeed + t.phaseX) * 22;
          t.y = t.baseY + Math.cos(time * t.floatSpeed * 1.2 + t.phaseY) * 18;
          t.z = t.baseZ + Math.sin(time * t.floatSpeed * 0.7 + t.phaseZ) * 26;
        }

        // Apply 3D rotation matrix
        const x1 = t.x * cosY - t.z * sinY;
        const z1 = t.z * cosY + t.x * sinY;
        const y1 = t.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + t.y * sinX;

        const cameraZ = z2 + focalLength;
        if (cameraZ <= 20) continue;

        const scale = focalLength / cameraZ;
        let px = x1 * scale + width / 2;
        let py = y1 * scale + height / 2;

        // Interactive Magnetic Cursor Elastic Repulsion
        let isHoveredNear = false;
        if (rawMouseX > 0 && rawMouseY > 0) {
          const mouseDistX = px - rawMouseX;
          const mouseDistY = py - rawMouseY;
          const mouseDist = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);
          const maxRepelDist = 120;

          if (mouseDist < maxRepelDist && mouseDist > 0) {
            isHoveredNear = true;
            const force = (1 - mouseDist / maxRepelDist) * 18 * scale;
            px += (mouseDistX / mouseDist) * force;
            py += (mouseDistY / mouseDist) * force;
          }
        }

        // Depth of field alpha
        const normalizedZ = (z2 + 150) / 500;
        const alpha = Math.max(0.18, Math.min(0.95, 1 - normalizedZ * 0.75));

        projected.push({
          token: t,
          originalIndex: i,
          px,
          py,
          pz: z2,
          scale,
          alpha: isHoveredNear ? Math.min(1, alpha + 0.25) : alpha,
          isHoveredNear,
        });
      }

      // Sort tokens from farthest to nearest (Painter's algorithm)
      projected.sort((a, b) => b.pz - a.pz);

      // 4. Draw 3D Ast Syntax Constellation Connection Beams
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist2D = Math.sqrt(dx * dx + dy * dy);
          const distZ = Math.abs(p1.pz - p2.pz);

          if (dist2D < 170 && distZ < 150) {
            const lineAlpha = (1 - dist2D / 170) * Math.min(p1.alpha, p2.alpha) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(186, 232, 232, ${lineAlpha})`;
            ctx.lineWidth = Math.max(0.7, (p1.scale + p2.scale) * 0.5);
            ctx.stroke();
          }
        }
      }

      // 5. Draw Animated Data Pulses Traveling Along Active Beams
      if (!prefersReducedMotion) {
        for (let i = 0; i < pulses.length; i++) {
          const pulse = pulses[i];
          pulse.progress += pulse.speed;

          if (pulse.progress >= 1) {
            pulse.progress = 0;
            pulse.fromIndex = Math.floor(Math.random() * projected.length);
            pulse.toIndex = Math.floor(Math.random() * projected.length);
          }

          const pFrom = projected.find((p) => p.originalIndex === pulse.fromIndex);
          const pTo = projected.find((p) => p.originalIndex === pulse.toIndex);

          if (pFrom && pTo) {
            const curX = pFrom.px + (pTo.px - pFrom.px) * pulse.progress;
            const curY = pFrom.py + (pTo.py - pFrom.py) * pulse.progress;
            const pulseScale = pFrom.scale + (pTo.scale - pFrom.scale) * pulse.progress;

            ctx.beginPath();
            ctx.arc(curX, curY, 2.8 * pulseScale, 0, Math.PI * 2);
            ctx.fillStyle = pulse.color;
            ctx.shadowColor = pulse.color;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 6. Draw 3D Code Badges with Crisp Typography & Soft Shadows
      for (let i = 0; i < projected.length; i++) {
        const { token, px, py, scale, alpha, isHoveredNear } = projected[i];

        ctx.save();
        ctx.translate(px, py);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;

        const fontSize = 11;
        ctx.font = `600 ${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
        const textMetrics = ctx.measureText(token.text);
        const textWidth = textMetrics.width;
        const paddingX = 11;
        const paddingY = 6;
        const pillWidth = textWidth + paddingX * 2 + 12;
        const pillHeight = fontSize + paddingY * 2;
        const pillX = -pillWidth / 2;
        const pillY = -pillHeight / 2;
        const radius = pillHeight / 2;

        // Soft Drop Shadow
        ctx.shadowColor = isHoveredNear ? "rgba(13, 110, 110, 0.22)" : "rgba(39, 35, 67, 0.08)";
        ctx.shadowBlur = isHoveredNear ? 12 : 6;
        ctx.shadowOffsetY = isHoveredNear ? 4 : 2;

        // Draw Pill Badge Background
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, radius);
        ctx.fillStyle = isHoveredNear ? "rgba(255, 255, 255, 0.98)" : token.badgeBg;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Draw Pill Badge Border
        ctx.lineWidth = isHoveredNear ? 1.5 : 1;
        ctx.strokeStyle = isHoveredNear ? "#0D6E6E" : token.borderColor;
        ctx.stroke();

        // Draw Code Type Accent Dot
        ctx.beginPath();
        ctx.arc(pillX + 11, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = token.dotColor;
        ctx.fill();

        // Draw Syntax Code Text
        ctx.fillStyle = token.color;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(token.text, pillX + 19, 0.5);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
