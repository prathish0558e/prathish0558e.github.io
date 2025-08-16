import React, { useEffect, useMemo, useRef, useState } from "react"; import { motion, AnimatePresence } from "framer-motion"; import { Heart, Music2, Pause, Sparkles, PartyPopper, Gift, Stars } from "lucide-react";

// ============================= // 💜 ULTRA-MODERN BIRTHDAY SITE // Single-file React component // TailwindCSS + Framer Motion animations // No extra setup besides Tailwind. // =============================

// ======= QUICK SETUP ======= // 1) Replace the values in CONFIG below. // 2) Drop this component into any React/Vite/Next app page. // 3) Deploy free on Netlify/Vercel/GitHub Pages. // ===========================

const CONFIG = { crushName: "Your Crush", // 👉 Replace with her name yourName: "Your Name",   // 👉 Replace with your name heroOneLiner: "You make the ordinary look like magic ✨", longNote: "Every second with you feels like a beautiful song—soft, timeless, and full of little fireworks. I hope today wraps you in smiles, sparkles, and all the love you deserve.", songUrl: "", // Optional: link to an mp3 (e.g., from your own hosting). Leave empty to disable. gallery: [ // 👉 Add 3–8 image URLs of her/you-two/memories (public links). These are placeholders. "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1600&auto=format&fit=crop", "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=1600&auto=format&fit=crop", "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=1600&auto=format&fit=crop", ], highlights: [ "Your smile = instant sunshine", "The way you care for people", "Your cute laugh (I’m a fan)", "Brains + kindness = unbeatable", "You make tough days lighter", "You notice little details 💫", "Your vibe is pure gold", "You’re effortlessly stylish", "You inspire me to grow", "You’re one of a kind", ], };

// === Utility: confetti burst (lazy import) === const useConfetti = () => { const burst = async (opts = {}) => { try { const confetti = (await import("canvas-confetti")).default; confetti({ particleCount: 180, spread: 85, startVelocity: 45, scalar: 0.9, origin: { y: 0.6 }, ticks: 250, ...opts, }); } catch (_) { // silently ignore if library not available } }; return { burst }; };

// === Background: floating hearts === const FloatingHearts = () => { const hearts = new Array(18).fill(0).map((_, i) => i); return ( <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"> {hearts.map((i) => ( <motion.div key={i} initial={{ y: "100%", opacity: 0, scale: 0.6 }} animate={{ y: ["100%", "-10%"], opacity: [0, 1, 0.2, 0], scale: [0.6, 1, 1.2] }} transition={{ duration: 10 + (i % 6), repeat: Infinity, delay: i * 0.35, ease: "easeOut" }} className="absolute" style={{ left: ${(i * 123) % 100}% }} > <Heart className="w-6 h-6 text-pink-500/60 drop-shadow" /> </motion.div> ))} </div> ); };

// === Background: fireworks canvas === const Fireworks = ({ active }) => { const ref = useRef(null); useEffect(() => { if (!active) return; const canvas = ref.current; const ctx = canvas.getContext("2d"); let w = (canvas.width = window.innerWidth); let h = (canvas.height = window.innerHeight); let then = performance.now();

const onResize = () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
};
window.addEventListener("resize", onResize);

// simple fireworks particles
const particles = [];
const rand = (min, max) => Math.random() * (max - min) + min;
const spawn = () => {
  const x = rand(w * 0.1, w * 0.9);
  const y = rand(h * 0.1, h * 0.5);
  const count = 60;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = rand(1, 5);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: rand(60, 120),
      age: 0,
    });
  }
};

let ticker = 0;
const loop = (now) => {
  const dt = now - then;
  then = now;
  ticker += dt;
  if (ticker > 1200) {
    spawn();
    ticker = 0;
  }

  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, w, h);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02; // gravity
    p.age++;
    const alpha = Math.max(0, 1 - p.age / p.life);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
    ctx.fill();
  });

  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].age > particles[i].life) particles.splice(i, 1);
  }

  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);

return () => window.removeEventListener("resize", onResize);

}, [active]);

return <canvas ref={ref} className="fixed inset-0 -z-10" />; };

// === Typewriter === const Typewriter = ({ text, speed = 35, className = "" }) => { const [out, setOut] = useState(""); useEffect(() => { setOut(""); let i = 0; const t = setInterval(() => { setOut((s) => s + text[i]); i++; if (i >= text.length) clearInterval(t); }, speed); return () => clearInterval(t); }, [text, speed]); return <span className={className}>{out}</span>; };

// === Cute Balloon === const Balloon = ({ delay = 0 }) => ( <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: -120, opacity: 1 }} transition={{ repeat: Infinity, repeatType: "mirror", duration: 6, delay }} className="w-10 h-14 rounded-full bg-gradient-to-b from-pink-400 to-fuchsia-500 shadow-xl relative"

> 

<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-white/60" />

</motion.div> );

export default function EpicBirthdaySite() { const { crushName, yourName, heroOneLiner, longNote, gallery, highlights, songUrl } = CONFIG; const [opened, setOpened] = useState(false); const [showNote, setShowNote] = useState(false); const audioRef = useRef(null); const [musicOn, setMusicOn] = useState(false); const { burst } = useConfetti();

useEffect(() => { if (opened) { burst(); // auto show note after a beat const t = setTimeout(() => setShowNote(true), 1800); return () => clearTimeout(t); } }, [opened]);

useEffect(() => { if (!audioRef.current) return; if (musicOn) audioRef.current.play().catch(() => {}); else audioRef.current.pause(); }, [musicOn]);

const year = new Date().getFullYear();

return ( <div className="relative min-h-screen text-white overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"> <FloatingHearts /> <Fireworks active={opened} />

{/* Music Toggle */}
  {songUrl && (
    <button
      onClick={() => setMusicOn((s) => !s)}
      className="fixed z-50 top-4 right-4 backdrop-blur bg-white/10 hover:bg-white/20 transition-colors rounded-full p-3 shadow-lg"
      aria-label={musicOn ? "Pause music" : "Play music"}
    >
      {musicOn ? <Pause className="w-5 h-5" /> : <Music2 className="w-5 h-5" />}
    </button>
  )}

  <audio ref={audioRef} src={songUrl || undefined} loop preload="none" />

  {/* GATE */}
  <AnimatePresence>
    {!opened && (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 z-40 flex items-center justify-center"
      >
        <div className="relative max-w-xl text-center p-8 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 100, damping: 12 }}>
            <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
              <Sparkles className="w-6 h-6" />
              <span>Special Delivery</span>
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="mt-3 opacity-90">A secret wish crafted just for <span className="text-pink-300 font-semibold">{crushName}</span>.</p>
            <motion.button
              onClick={() => setOpened(true)}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-pink-500/90 hover:bg-pink-500 text-white font-medium shadow-[0_10px_30px_rgba(236,72,153,0.45)]"
            >
              <PartyPopper className="w-5 h-5" /> Tap to open
            </motion.button>
            <div className="absolute -z-10 -inset-1 rounded-3xl blur-2xl bg-gradient-to-r from-fuchsia-500/30 to-pink-500/30" />
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* HERO */}
  <section className="relative px-6 pt-24 pb-12 sm:pb-20 flex flex-col items-center">
    <motion.h1
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      className="text-center text-4xl sm:text-6xl font-black tracking-tight"
    >
      Happy Birthday, <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-rose-200 to-fuchsia-300">{crushName}</span>! 🎂
    </motion.h1>
    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-4 max-w-2xl text-center text-white/90"
    >
      <Typewriter text={heroOneLiner} />
    </motion.p>

    {/* Balloons */}
    <div className="mt-10 flex gap-6 items-end">
      {[0, 0.6, 1.2, 1.8].map((d, i) => (
        <Balloon key={i} delay={d} />
      ))}
    </div>

    {/* Sub badges */}
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {[
        "Wishing you joy",
        "More smiles, more magic",
        "You are brilliant",
        `From ${yourName} — ${year}`,
      ].map((t, i) => (
        <span key={i} className="text-xs sm:text-sm px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur">
          {t}
        </span>
      ))}
    </div>
  </section>

  {/* GALLERY */}
  {gallery?.length > 0 && (
    <section className="relative px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-2"><Stars className="w-5 h-5" /><h2 className="text-xl sm:text-2xl font-semibold">Little Moments, Big Smiles</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <img src={src} alt={`memory-${i}`} className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )}

  {/* HIGHLIGHTS MARQUEE */}
  <section className="relative py-6">
    <div className="[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] overflow-hidden">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: [0, -1200] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        className="flex gap-4 whitespace-nowrap"
      >
        {highlights.map((h, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur">
            <Heart className="w-4 h-4 text-pink-300" /> {h}
          </span>
        ))}
      </motion.div>
    </div>
  </section>

  {/* LETTER CARD */}
  <section className="relative px-6 py-10">
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ rotateX: -90, opacity: 0 }}
        whileInView={{ rotateX: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
        className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-3 text-pink-200"><Gift className="w-5 h-5" /><span className="font-semibold">A note for you</span></div>
        <AnimatePresence>
          {showNote ? (
            <motion.p
              key="note"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="text-base sm:text-lg leading-7 text-white/95"
            >
              {longNote}
            </motion.p>
          ) : (
            <motion.div key="placeholder" className="h-16 bg-white/5 rounded-xl" initial={{ opacity: 0.4 }} animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} />
          )}
        </AnimatePresence>
        <div className="mt-6 text-sm text-white/70">With lots of love, <span className="text-pink-200 font-medium">{yourName}</span></div>
      </motion.div>
    </div>
  </section>

  {/* CTA: CONFETTI BLAST */}
  <section className="relative px-6 pb-24">
    <div className="mx-auto max-w-xl text-center">
      <motion.button
        onClick={() => burst({ particleCount: 260, spread: 100, origin: { y: 0.5 } })}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold shadow-[0_20px_60px_rgba(236,72,153,0.45)]"
      >
        Send more sparkles <Sparkles className="w-5 h-5" />
      </motion.button>
      <p className="mt-3 text-white/80 text-sm">Tap again if you want a mega blast 🤫</p>
    </div>
  </section>

  {/* Footer */}
  <footer className="relative px-6 pb-12 text-center text-xs text-white/60">
    Made with <span className="text-pink-300">♥</span> for {crushName}. All smiles reserved.
  </footer>
</div>

); }

      
