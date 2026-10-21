"use client";

const PALETTE = ["#fb923c", "#fdba74", "#f97316", "#a78bfa", "#34d399", "#fafafa"];

/** Lazy-loads canvas-confetti so it never touches the server bundle. */
export async function fireConfetti(kind: "success" | "achievement" | "module" = "success") {
  if (typeof window === "undefined") return;
  const confetti = (await import("canvas-confetti")).default;
  const base = { colors: PALETTE, disableForReducedMotion: true, zIndex: 9999 };

  if (kind === "achievement") {
    confetti({ ...base, particleCount: 90, spread: 100, startVelocity: 38, origin: { x: 0.5, y: 0.25 }, shapes: ["star", "circle"], scalar: 1.1 });
    return;
  }

  // Two cannons from the sides
  const fire = (ratio: number, opts: Parameters<typeof confetti>[0]) =>
    confetti({ ...base, ...opts, particleCount: Math.floor(220 * ratio) });

  fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.2, y: 0.9 }, angle: 60 });
  fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.8, y: 0.9 }, angle: 120 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9, origin: { x: 0.5, y: 0.6 } });

  if (kind === "module") {
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({ ...base, particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
      confetti({ ...base, particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }
}
