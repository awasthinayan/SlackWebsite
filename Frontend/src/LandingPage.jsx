import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import { motion as Motion } from "framer-motion";

const LandingPage = () => {
  const svgRef = useRef(null);
  const startBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // palette + helpers
    const palette = [
      "#f94144",
      "#f3722c",
      "#f9844a",
      "#f9c74f",
      "#90be6d",
      "#43aa8b",
      "#4cc9f0",
      "#577590",
      "#ff6f91",
      "#ffc75f",
      "#6a4c93",
    ];
    const rand = (min, max) => Math.random() * (max - min) + min;
    function mush(t, freq = 1, phase = 0) {
      return (
        Math.sin((t + phase) * freq) * 0.6 +
        Math.sin((t + phase) * 0.7 * freq) * 0.4
      );
    }

    const svgEl = svgRef.current;
    if (!svgEl) {
      // If svg isn't mounted for some reason, bail out safely.
      console.warn("svgRef not ready");
      return;
    }

    const svg = d3.select(svgEl);
    let dots = [];
    let circlesSelection = null;
    let animationId = null;

    // state used inside animation
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let amp = 10,
      growth = 0.12;
    const pushRadius = 200;
    const t0 = performance.now();

    function build() {
      // clear
      svg.selectAll("*").remove();

      const g = svg.append("g");
      const { width: w, height: h } = svg.node().getBoundingClientRect();
      svg.attr("viewBox", `0 0 ${w} ${h}`);

      const cx = w / 2;
      const cy = h / 2;
      const N = 150;

      dots = [];
      let placed = 0;
      let ring = 0;
      const rSmall = 10;
      const rMedium = 18;

      while (placed < N) {
        let rCircle = Math.random() > 0.5 ? rSmall : rMedium;
        if (ring === 0) {
          dots.push({
            x: cx,
            y: cy,
            baseX: cx,
            baseY: cy,
            r: rCircle,
            c: palette[placed % palette.length],
            phase: rand(0, Math.PI * 2),
          });
          placed++;
        } else {
          const radius = ring * (rMedium * 2);
          const circumference = 2 * Math.PI * radius;
          const avgDiameter = rSmall + rMedium;
          const count = Math.max(
            1,
            Math.floor(circumference / (avgDiameter * 2))
          );
          for (let j = 0; j < count && placed < N; j++) {
            rCircle = Math.random() > 0.5 ? rSmall : rMedium;
            const angle = (j / count) * 2 * Math.PI;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            dots.push({
              x,
              y,
              baseX: x,
              baseY: y,
              r: rCircle,
              c: palette[placed % palette.length],
              phase: rand(0, Math.PI * 2),
            });
            placed++;
          }
        }
        ring++;
      }

      // bind and keep selection reference
      circlesSelection = g
        .selectAll("circle")
        .data(dots)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.r)
        .attr("fill", (d) => d.c)
        .attr("opacity", 0.95);
    }

    function tick(now) {
      // compute time
      const t = (now - t0) / 1000;
      if (!circlesSelection) {
        animationId = requestAnimationFrame(tick);
        return;
      }

      circlesSelection.each(function (d) {
        const wob = amp * mush(t + d.phase, 1.2, d.phase);
        const wobY = amp * 1.1 * mush(t + d.phase, 0.5, d.phase);

        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < pushRadius) {
          const force = (pushRadius - dist) / pushRadius;
          const angle = Math.atan2(dy, dx);
          d.x += Math.cos(angle) * force * 8;
          d.y += Math.sin(angle) * force * 8;
        } else {
          d.x += (d.baseX - d.x) * 0.05;
          d.y += (d.baseY - d.y) * 0.05;
        }

        const rPulse = d.r * (1 + growth * Math.sin(t * 0.8 + d.phase));

        d3.select(this)
          .attr("cx", d.x + wob)
          .attr("cy", d.y + wobY)
          .attr("r", rPulse);
      });

      animationId = requestAnimationFrame(tick);
    }

    // attach global mousemove for attraction
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Setup start button handlers if present (do NOT block animation if missing)
    const startBtn = startBtnRef.current;
    let handleMouseEnter, handleMouseLeave, handleClick;
    if (startBtn) {
      handleMouseEnter = () => {
        amp = 16;
        growth = 0.18;
      };
      handleMouseLeave = () => {
        amp = 10;
        growth = 0.12;
      };
      handleClick = () => {
        startBtn.textContent = "Loading…";
        startBtn.disabled = true;
        setTimeout(() => {
          startBtn.textContent = "Start";
          startBtn.disabled = false;
          alert("Please Register yourself to proceed further!");
        }, 500);
      };

      startBtn.addEventListener("mouseenter", handleMouseEnter);
      startBtn.addEventListener("mouseleave", handleMouseLeave);
      startBtn.addEventListener("click", handleClick);
    }

    // Resize observer to rebuild layout
    const ro = new ResizeObserver(() => {
      // stop current animation frames (so selection isn't stale), rebuild, restart tick
      if (animationId) cancelAnimationFrame(animationId);
      build();
      // small timeout to ensure DOM updated then start tick immediately
      animationId = requestAnimationFrame(tick);
    });

    // start
    build();
    animationId = requestAnimationFrame(tick);

    // observe svg element so build runs on resize
    ro.observe(svgEl);

    // debug helper: confirm animation started
    console.log("D3 animation initialized");

    // cleanup
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      ro.disconnect();

      if (startBtn) {
        startBtn.removeEventListener("mouseenter", handleMouseEnter);
        startBtn.removeEventListener("mouseleave", handleMouseLeave);
        startBtn.removeEventListener("click", handleClick);
      }
      // remove circles to free DOM
      svg.selectAll("*").remove();
    };
  }, []); // run once

  return (
    <div className="hero relative w-full h-screen flex flex-col justify-center items-center bg-black overflow-hidden">
      {/* SVG dots behind content */}
      <svg
        ref={svgRef}
        id="dots-layer"
        className="absolute inset-0 w-full h-full z-0"
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Overlay content (gradient + motion elements) */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(135deg,#4f46e5,#9333ea,#ec4899)] bg-[length:200%_200%] animate-gradientMove opacity-60 z-10" />

        {/* floating blobs */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Motion.div
            initial={{ x: -200, y: -100, opacity: 0 }}
            animate={{ x: [0, 120, 0], y: [0, 60, 0], opacity: 0.35 }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-96 h-96 bg-pink-400/40 rounded-full blur-3xl top-10 left-10"
          />
          <Motion.div
            initial={{ x: 200, y: 150, opacity: 0 }}
            animate={{ x: [-120, 0, -120], y: [60, -30, 60], opacity: 0.35 }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-96 h-96 bg-indigo-500/40 rounded-full blur-3xl bottom-10 right-10"
          />
        </div>

        {/* main content */}
        <Motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-30 text-7xl font-bold text-white drop-shadow-lg mb-8 "
        >
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
            Our App
          </span>
        </Motion.h1>

        <Motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-30 text-3xl font-bold text-red-200 drop-shadow-lg mb-5 text-center"
        >
          “Our App is a smart and seamless platform designed to simplify your{" "}
          <br />
          daily digital experience. Whether you're exploring new features,
          <br />
          managing your account, or connecting with others — we make it easy,
          <br />
          fast, and secure. Join us today and discover a better way to stay
          connected!”
        </Motion.h1>

        <Motion.div className="relative z-30 flex gap-6">
          <Motion.button
            ref={startBtnRef}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-8 py-3 text-white text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg hover:cursor-pointer"
          >
            Login
          </Motion.button>

          <Motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/register")}
            className="px-8 py-3 text-white text-lg bg-pink-600 hover:bg-pink-700 rounded-lg shadow-lg hover:cursor-pointer"
          >
            Register
          </Motion.button>
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-30 mt-10 py-4 text-center text-white border-t border-pink-400/30 bg-transparent"
        >
          <Motion.span
            animate={{
              x: ["100%", "-100%"], // scroll from right to left
            }}
            transition={{
              repeat: Infinity,
              duration: 10, // control speed (lower = faster)
              ease: "linear",
            }}
            className="inline-block"
          >
            <p className="text-3xl opacity-90">
              Thank you for visiting{" "}
              <span className="font-semibold text-pink-300">Our App</span>. 💜
            </p>
          </Motion.span>
        </Motion.h1>
      </div>
    </div>
  );
};

export default LandingPage;
