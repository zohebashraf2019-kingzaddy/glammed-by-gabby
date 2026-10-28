/* Glammed By Gabby — site scripts */
(() => {
  /* ===== EDIT HERE =====
     BOOK_URL: every "Book" button on the site uses this one link.
     Swap it for Gabby's personal booking link (or Square later). */
  const CONFIG = {
    BOOK_URL: "https://www.fresha.com/a/glammed-by-gabby-reno-320-broadway-boulevard-zktyishz/booking?menu=true&share=true&pId=723674&dppub=true&employeeId=2009095",
    FORM_ENDPOINT: "https://formsubmit.co/ajax/glammed.by.gabby07@gmail.com",
    EMAIL: "glammed.by.gabby07@gmail.com"
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // booking links
  $$(".js-book").forEach(a => { a.href = CONFIG.BOOK_URL; a.target = "_blank"; a.rel = "noopener"; });
  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  // header + mobile bar
  const hdr = $("#hdr"), mbar = $("#mbar");
  const onScroll = () => {
    const y = window.scrollY;
    hdr && hdr.classList.toggle("scrolled", y > 30);
    mbar && mbar.classList.toggle("show", y > 500);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // drawer
  const drawer = $("#drawer"), menuBtn = $("#menuBtn");
  const setDrawer = open => {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", !open);
    menuBtn && menuBtn.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  menuBtn && menuBtn.addEventListener("click", () => setDrawer(true));
  $("#drawerClose") && $("#drawerClose").addEventListener("click", () => setDrawer(false));
  $$("#drawer a").forEach(a => a.addEventListener("click", () => setDrawer(false)));

  // reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  // services search + chips
  const grid = $("#svcGrid");
  if (grid) {
    const input = $("#svcSearch"), chips = $$(".chip"), items = $$(".svc", grid), cats = $$(".svc-cat", grid), empty = $("#svcEmpty");
    let cat = "all";
    const filter = () => {
      const q = (input.value || "").trim().toLowerCase();
      let shown = 0;
      items.forEach(it => {
        const ok = (cat === "all" || it.dataset.cat === cat) && (!q || it.textContent.toLowerCase().includes(q));
        it.classList.toggle("hide", !ok); if (ok) shown++;
      });
      cats.forEach(c => c.classList.toggle("hide", !items.some(i => i.dataset.cat === c.dataset.cat && !i.classList.contains("hide"))));
      empty.style.display = shown ? "none" : "block";
    };
    input.addEventListener("input", filter);
    chips.forEach(ch => ch.addEventListener("click", () => { chips.forEach(c => c.classList.remove("on")); ch.classList.add("on"); cat = ch.dataset.cat; filter(); }));
  }

  // lash finder
  const styles = [
    { name: "Lash Lift", desc: "Your own lashes, lifted and tinted. A soft, wide-awake curl with zero extensions to maintain.", feel: "Barely-there", fills: "6–8 wks", from: "Lift & tint", n: 26, len: 34, spread: 0, w: 1.6 },
    { name: "Classic", desc: "One extension per natural lash. Clean, defined and closest to wearing mascara every day.", feel: "Natural", fills: "2–3 wks", from: "$70 fill", n: 32, len: 44, spread: 0, w: 2 },
    { name: "Hybrid", desc: "Classic lashes blended with light volume fans. Texture and fluff without going full drama.", feel: "Soft glam", fills: "2–3 wks", from: "Live price", n: 40, len: 50, spread: 2, w: 2 },
    { name: "Wet Set", desc: "Spiky, glossy and defined — the ‘just out of the pool’ look everyone is asking for.", feel: "Editorial", fills: "2 wks", from: "$175 set", n: 30, len: 56, spread: 0, w: 3.4 },
    { name: "Volume", desc: "Handmade fans for full, dark, dramatic lashes that still feel lightweight. Be bold.", feel: "Full drama", fills: "2–3 wks", from: "$175 set", n: 34, len: 62, spread: 4, w: 1.4 }
  ];
  const lashG = $("#lashes"), range = $("#lashRange"), card = $("#styleCard"), tabs = $$("#styleTabs button");
  const drawLashes = s => {
    if (!lashG) return;
    let out = "";
    const P = t => { // quadratic bezier from (60,170) ctrl (260,40) to (460,170)
      const x = (1 - t) ** 2 * 60 + 2 * (1 - t) * t * 260 + t * t * 460;
      const y = (1 - t) ** 2 * 170 + 2 * (1 - t) * t * 40 + t * t * 170;
      const dx = 2 * (1 - t) * 200 + 2 * t * 200, dy = 2 * (1 - t) * -130 + 2 * t * 130;
      return { x, y, nx: dy, ny: -dx };
    };
    for (let i = 0; i < s.n; i++) {
      const t = .06 + (i / (s.n - 1)) * .88;
      const p = P(t), m = Math.hypot(p.nx, p.ny);
      let nx = p.nx / m, ny = p.ny / m; if (ny > 0) { nx = -nx; ny = -ny; }
      const prof = Math.sin(Math.PI * Math.min(1, t * 1.05)) * .55 + .45; // longer toward outer corner
      const L = s.len * (.55 + prof * .6) * (t > .5 ? 1 + (t - .5) * .5 : 1);
      const fans = s.spread ? 3 : 1;
      for (let f = 0; f < fans; f++) {
        const ang = (f - (fans - 1) / 2) * s.spread * .045 + (t - .5) * .5;
        const cx = nx * Math.cos(ang) - ny * Math.sin(ang), cy = nx * Math.sin(ang) + ny * Math.cos(ang);
        const ex = p.x + cx * L, ey = p.y + cy * L;
        const qx = p.x + cx * L * .5 + (t - .5) * 14, qy = p.y + cy * L * .5 + 6;
        out += `<path d="M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke-width="${s.w}" opacity="${f ? .7 : 1}"/>`;
      }
    }
    lashG.innerHTML = out;
  };
  const setStyle = i => {
    const s = styles[i];
    if (!card) return;
    tabs.forEach((t, k) => t.classList.toggle("on", k === i));
    range.value = i; range.style.setProperty("--p", (i / 4 * 100) + "%");
    card.classList.remove("fade-swap"); void card.offsetWidth; card.classList.add("fade-swap");
    card.innerHTML = `<h3>${s.name}</h3><p>${s.desc}</p>
      <div class="style-stats"><div><small>Feel</small><b>${s.feel}</b></div><div><small>${i === 0 ? "Lasts" : "Fills"}</small><b>${s.fills}</b></div><div><small>From</small><b>${s.from}</b></div></div>
      <a class="btn btn-rose" href="${CONFIG.BOOK_URL}" target="_blank" rel="noopener">Book ${s.name} <span class="arr">→</span></a>`;
    drawLashes(s);
  };
  if (range) {
    range.addEventListener("input", () => setStyle(+range.value));
    tabs.forEach((t, k) => t.addEventListener("click", () => setStyle(k)));
    setStyle(1);
  }

  // before/after sliders
  $$("[data-ba]").forEach(ba => {
    const set = pct => { pct = Math.max(2, Math.min(98, pct)); ba.style.setProperty("--x", pct + "%"); ba.setAttribute("aria-valuenow", Math.round(pct)); };
    const fromEvt = e => { const r = ba.getBoundingClientRect(); set(((e.clientX ?? e.touches[0].clientX) - r.left) / r.width * 100); };
    let drag = false;
    ba.addEventListener("pointerdown", e => { drag = true; ba.setPointerCapture(e.pointerId); fromEvt(e); });
    ba.addEventListener("pointermove", e => drag && fromEvt(e));
    ba.addEventListener("pointerup", () => drag = false);
    ba.addEventListener("keydown", e => {
      const v = parseFloat(getComputedStyle(ba).getPropertyValue("--x")) || 50;
      if (e.key === "ArrowLeft") { set(v - 5); e.preventDefault(); }
      if (e.key === "ArrowRight") { set(v + 5); e.preventDefault(); }
    });
    // gentle intro wiggle
    const wio = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; wio.disconnect();
      let t = 0; const id = setInterval(() => { t += .05; set(50 + Math.sin(t * 3) * 18 * (1 - t)); if (t >= 1) { clearInterval(id); set(50); } }, 30);
    }), { threshold: .6 });
    wio.observe(ba);
  });

  // reels
  const reels = $$(".reel");
  reels.forEach(reel => {
    const v = $("video", reel), play = $(".play", reel), snd = $(".sound", reel);
    play.addEventListener("click", () => {
      if (v.paused) {
        reels.forEach(r => { if (r !== reel) { $("video", r).pause(); r.classList.remove("playing"); } });
        v.muted = false; snd.textContent = "🔊"; v.play(); reel.classList.add("playing");
      } else { v.pause(); reel.classList.remove("playing"); }
    });
    snd.addEventListener("click", e => { e.stopPropagation(); v.muted = !v.muted; snd.textContent = v.muted ? "🔇" : "🔊"; });
  });

  // lightbox
  const lb = $("#lightbox");
  if (lb) {
    const figs = $$("#gallery .g"), img = $("img", lb), cap = $(".lb-cap", lb);
    let idx = 0;
    const show = i => { idx = (i + figs.length) % figs.length; const f = figs[idx], im = $("img", f); img.src = im.src; img.alt = im.alt; cap.textContent = $("figcaption", f).textContent.replace(/([a-z])([A-Z])/, "$1 · $2"); };
    const open = i => { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; $(".lb-close", lb).focus(); };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; figs[idx].focus(); };
    figs.forEach((f, i) => { f.addEventListener("click", () => open(i)); f.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); } }); });
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    addEventListener("keydown", e => { if (!lb.classList.contains("open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
  }

  // hours / open now (Reno time)
  const hoursT = $("#hours");
  if (hoursT) {
    const sched = { 1: [[570, 900], [990, 1080]], 2: [[570, 900], [990, 1080]], 3: [[570, 900], [990, 1080]], 4: [[570, 900], [990, 1080]], 5: [[570, 900], [990, 1080]], 6: [[570, 900]], 0: [] };
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
    $$("tr", hoursT).forEach(tr => tr.classList.toggle("today", +tr.dataset.d === d));
    const open = sched[d].some(([a, b]) => m >= a && m < b);
    const pill = $("#openPill");
    pill.classList.toggle("is-open", open);
    const next = sched[d].find(([a]) => a > m);
    $("span", pill).textContent = open ? "Open now" : next ? `Closed · opens ${fmt(next[0])} today` : "Closed now · book online anytime";
    function fmt(x) { const h = Math.floor(x / 60), mm = x % 60; return `${(h % 12) || 12}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; }
  }

  // contact form
  const form = $("#contactForm");
  if (form) {
    const status = $("#formStatus");
    const dateIn = $("#f-date"); if (dateIn) dateIn.min = new Date().toISOString().slice(0, 10);
    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.className = "form-status";
      if (!form.name.value.trim() || !form.email.checkValidity() || !form.email.value) {
        status.textContent = "Please add your name and a valid email."; status.classList.add("err"); return;
      }
      if (form._honey.value) return;
      const data = Object.fromEntries(new FormData(form));
      delete data._honey;
      data._subject = `New ${data.reason.toLowerCase()} — ${data.name} (Glammed By Gabby site)`;
      data._template = "table"; data._captcha = "false";
      const btn = $("button[type=submit]", form); btn.disabled = true; btn.style.opacity = .6;
      status.textContent = "Sending…";
      try {
        const r = await fetch(CONFIG.FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
        form.reset(); status.textContent = "Sent! Gabby will text or email you back soon 💕"; status.classList.add("ok");
      } catch (err) {
        const body = Object.entries(data).filter(([k]) => !k.startsWith("_")).map(([k, v]) => `${k}: ${v}`).join("\n");
        status.innerHTML = `Couldn’t send right now — <a href="mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(data._subject)}&body=${encodeURIComponent(body)}" style="text-decoration:underline">email it instead</a> or text 775.501.2386.`;
        status.classList.add("err");
      } finally { btn.disabled = false; btn.style.opacity = ""; }
    });
  }
})();
