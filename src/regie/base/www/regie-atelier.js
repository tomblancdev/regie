/* regie-atelier — L'Atelier des palettes (La Régie 0.25, the store since 0.42):
 * a window that opens from a button on Réglages to edit a palette in full, or
 * the day's rules, with a colour ring, a level curve and chips for the signs of
 * life. Shipped by the product into the brain's own www/, loaded as a Lovelace
 * resource (never an extra module: the registry polyfill).
 *
 * TWO SOURCES, TWO DOORS. A KEPT PALETTE is a document in the component's own
 * store, read and written through four websocket commands —
 * regie/palettes/list · save · delete · random. There is no slot and no
 * ceiling: « Nouvelle » and « Enregistrer sous » both save a new document,
 * « Supprimer » deletes one, and no helper is left behind. THE DAY'S RULES are
 * still the family's helpers, read and written through the `hass` object every
 * card is handed (V8b moves them into the same store).
 *
 * The week strip under the rules draws with the product's own arithmetic
 * (palette.py) ported here — the same seven draws in the same order. It is a
 * PREVIEW: it must follow a slider as the finger moves, faster than a sensor
 * recomputed on the helper's echo. What the house wears is never drawn here —
 * that is sensor.house_palette's word, and the component's alone. */
(function () {
  "use strict";
  const M = 2147483647, A = 16807;
  const HARMONIES = { degrade: [100, 150], duo: [30, 50], uni: [15, 25], libre: [150, 220] };
  const ORDER = ["degrade", "duo", "uni", "libre"];
  const COLD = [150, 300], WARM_ACCENT = [345, 60], COLD_ACCENT = [170, 50];
  const PERIODS = ["morning", "day", "evening", "night"];
  // --- a kept palette: the document the store holds, and the flat values the controls edit ---
  function valuesOf(doc) {
    const band = doc.band || [200, 320], level = doc.level || {}, curve = level.curve || {}, life = doc.life || null;
    const lo = ((band[0] % 360) + 360) % 360;
    const v = {
      label: doc.label || "", start: lo,
      width: ((((band[1] - band[0]) % 360) + 360) % 360) || 360,
      accent: doc.accent === null || doc.accent === undefined ? lo : doc.accent,
      saturation: doc.saturation === undefined ? 100 : doc.saturation,
      white: doc.white || "warm", jitter: level.jitter || 0,
      alive: doc.alive === "all" ? 0 : (doc.alive || 0), alive_all: doc.alive === "all",
      shapes: life && life.shapes ? life.shapes.slice() : [],
      every_min: life && life.every ? life.every[0] : 120,
      every_max: life && life.every ? life.every[1] : 600,
    };
    for (const p of PERIODS) v[`curve_${p}`] = curve[p] === undefined ? 100 : curve[p];
    return v;
  }
  function docOf(v) {
    const doc = {
      label: v.label, band: [Math.round(v.start) % 360, Math.round(v.start + v.width) % 360],
      accent: Math.round(v.accent), saturation: Math.round(v.saturation), white: v.white || "warm",
    };
    const curve = {}, level = {};
    let moved = false;
    for (const p of PERIODS) { curve[p] = Math.round(v[`curve_${p}`]); if (curve[p] !== 100) moved = true; }
    if (moved) level.curve = curve;
    if (v.jitter) level.jitter = Math.round(v.jitter);
    if (Object.keys(level).length) doc.level = level;
    if (v.alive_all) doc.alive = "all";
    else if (v.alive) doc.alive = Math.round(v.alive);
    if (v.shapes && v.shapes.length) doc.life = { shapes: v.shapes.slice(), every: [Math.round(v.every_min), Math.round(v.every_max)] };
    return doc;
  }

  // --- the product's draw, ported ----------------------------------------------------
  function draw(day, roll, salt, rules) {
    let x = (day * 7919 + roll * 104729 + salt) % M;
    if (x <= 0) x = 1;
    const r = [];
    for (let i = 0; i < 7; i++) { x = (x * A) % M; r.push(x / M); }
    const [h, w, s, a, sat, j, lf] = r;
    const total = ORDER.reduce((t, n) => t + (rules.harmonies[n] || 0), 0);
    let acc = 0, harmony = "degrade";
    for (const n of ORDER) { acc += rules.harmonies[n] || 0; if (h * total < acc) { harmony = n; break; } }
    const [w0, w1] = HARMONIES[harmony];
    const width = w0 + w * (w1 - w0);
    const [av0, av1] = rules.avoid;
    const free = (((av0 - av1) % 360) + 360) % 360 || 360;   // the avoided arc may wrap through 0°
    const start = av1 + s * (free - width);
    const mid = (start + width / 2) % 360;
    const cold = COLD[0] <= mid && mid <= COLD[1];
    const accent = cold ? (WARM_ACCENT[0] + a * WARM_ACCENT[1]) % 360 : COLD_ACCENT[0] + a * COLD_ACCENT[1];
    const [s0, s1] = rules.saturation;
    const jit = rules.jitter || [0, 0];
    const life = rules.life && rules.life.shapes.length && lf * 100 < rules.life.chance;
    return {
      harmony, lo: Math.floor(start % 360 + 0.5) % 360, hi: Math.floor((start + width) % 360 + 0.5) % 360,
      width: Math.floor(width + 0.5), accent: Math.floor(accent + 0.5) % 360,
      saturation: Math.floor(s0 + sat * (s1 - s0) + 0.5), white: cold ? "neutral" : "warm",
      jitter: Math.floor(jit[0] + j * (jit[1] - jit[0]) + 0.5), life: !!life,
    };
  }

  const css = `
    :host { display: block; }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; }
    .row .name { font-weight: 500; }
    .row .sub { color: var(--secondary-text-color); font-size: .9em; }
    button.open, .btn { font: inherit; border: 1px solid var(--primary-color); color: var(--primary-color); background: transparent; border-radius: 8px; padding: 6px 12px; cursor: pointer; }
    .btn.solid { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .btn.danger { border-color: var(--error-color, #c0392b); color: var(--error-color, #c0392b); }
    .btn:disabled { opacity: .4; cursor: default; }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 16px; overflow: auto; }
    .win { background: var(--card-background-color, #1c1c1c); color: var(--primary-text-color); border-radius: 14px; width: min(760px, 100%); box-shadow: 0 24px 80px rgba(0,0,0,.5); padding: 16px 18px 20px; box-sizing: border-box; }
    .head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .head h2 { margin: 0; font-size: 1.1em; letter-spacing: .04em; }
    .close { font: inherit; background: none; border: 0; color: var(--secondary-text-color); font-size: 1.4em; cursor: pointer; }
    .tabs { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 14px; }
    .tab { font: inherit; font-size: .85em; padding: 5px 11px; border-radius: 999px; border: 1px solid var(--divider-color, #444); background: transparent; color: var(--secondary-text-color); cursor: pointer; }
    .tab.on { border-color: var(--primary-color); color: var(--primary-text-color); background: var(--secondary-background-color, #2a2a2a); }
    .tab.ro { opacity: .7; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 22px; }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
    .field { font-size: .85em; color: var(--secondary-text-color); margin-bottom: 8px; }
    .field .lab { display: flex; justify-content: space-between; margin-bottom: 2px; }
    .field .lab b { color: var(--primary-text-color); font-weight: 500; font-variant-numeric: tabular-nums; }
    input[type=range] { width: 100%; accent-color: var(--primary-color); }
    input[type=text], input[type=number] { font: inherit; width: 100%; box-sizing: border-box; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--divider-color, #444); background: var(--secondary-background-color, #2a2a2a); color: var(--primary-text-color); }
    input[type=number] { width: 5.5em; }
    .pair { display: flex; gap: 8px; align-items: center; }
    .ring { position: relative; width: 190px; height: 190px; margin: 4px auto 8px; touch-action: none; }
    .wheel { position: absolute; inset: 16px; border-radius: 50%; background: conic-gradient(from 0deg, hsl(0 95% 55%), hsl(30 95% 55%), hsl(60 95% 55%), hsl(90 95% 50%), hsl(120 95% 45%), hsl(150 95% 45%), hsl(180 95% 50%), hsl(210 95% 55%), hsl(240 95% 60%), hsl(270 95% 60%), hsl(300 95% 60%), hsl(330 95% 58%), hsl(360 95% 55%)); -webkit-mask: radial-gradient(circle, transparent 58%, #000 59%); mask: radial-gradient(circle, transparent 58%, #000 59%); }
    .ring svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .ring circle.h { cursor: grab; }
    .curve { width: 100%; height: auto; display: block; touch-action: none; }
    .curve circle { cursor: grab; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 8px; }
    .chip { font: inherit; font-size: .8em; padding: 3px 9px; border-radius: 999px; border: 1px solid var(--divider-color, #444); background: transparent; color: var(--secondary-text-color); cursor: pointer; }
    .chip.on { border-color: var(--primary-color); color: var(--primary-text-color); }
    .sel { display: flex; gap: 6px; flex-wrap: wrap; }
    .sel button { font: inherit; font-size: .8em; padding: 3px 9px; border-radius: 6px; border: 1px solid var(--divider-color, #444); background: transparent; color: var(--secondary-text-color); cursor: pointer; }
    .sel button.on { border-color: var(--primary-text-color); color: var(--primary-text-color); }
    .week { display: grid; gap: 4px; margin: 6px 0 4px; }
    .week div { height: 12px; border-radius: 3px; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
    .note { font-size: .8em; color: var(--secondary-text-color); margin-top: 8px; }
    .swatch { display: inline-block; width: 14px; height: 14px; border-radius: 50%; vertical-align: middle; margin-right: 6px; border: 1px solid rgba(255,255,255,.2); }
  `;

  class RegiePaletteAtelier extends HTMLElement {
    setConfig(config) {
      if (!config || !config.select || !config.rules) throw new Error("regie-palette-atelier: the card wants select and rules");
      this._config = config;
      this._tab = null;
      this._open = false;
      this._pending = {};
      this._docs = {};   // the store, read when the window opens
      this._read = false;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      this._render();
    }
    set hass(hass) {
      this._hass = hass;
      if (!this.shadowRoot) return;
      this._render();
      if (this._open && !this._dragging && !this._editing()) {
        // the house moves all day: only what the window SHOWS may redraw it
        const sig = this._signature();
        if (sig !== this._sig) { this._sig = sig; this._renderWindow(true); }
      }
    }
    _editing() {
      const a = this.shadowRoot.activeElement;
      return !!a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA");
    }
    _signature() {
      // what the WINDOW shows: the store's documents (they change on our own
      // saves and on another phone's) and, on the rules tab, their helpers
      const c = this._config, parts = [this._tab || "", JSON.stringify(this._docs)];
      if (this._tab === "today") {
        const px = c.rules.prefix;
        const keys = ORDER.map((h) => `input_number.${px}_weight_${h}`).concat(
          ["avoid_from", "avoid_to", "saturation_min", "saturation_max", "jitter_min", "jitter_max", "alive_min", "alive_max", "every_min", "every_max", "chance"].map((k) => `input_number.${px}_${k}`),
          PERIODS.map((p) => `input_number.${px}_curve_${p}`),
          [`input_boolean.${px}_alive_all`, `input_text.${px}_shapes`, "counter.house_palette_roll", "input_datetime.house_palette_turns"]);
        for (const e of keys) parts.push(this.st(e, ""));
      }
      return parts.join("|");
    }
    getCardSize() { return 1; }

    // --- the brain -----------------------------------------------------------------
    st(entity, fallback) {
      const s = this._hass && this._hass.states[entity];
      if (!s || s.state === "unknown" || s.state === "unavailable") return fallback;
      return s.state;
    }
    num(entity, fallback) { const v = parseFloat(this.st(entity, NaN)); return isNaN(v) ? fallback : v; }
    call(domain, service, data) { return this._hass.callService(domain, service, data); }
    setNumber(entity, value) {
      // a slider fires many times a second: the brain hears the last value only
      clearTimeout(this._pending[entity]);
      this._pending[entity] = setTimeout(() => this.call("input_number", "set_value", { entity_id: entity, value: Math.round(value) }), 120);
    }
    setText(entity, value) { return this.call("input_text", "set_value", { entity_id: entity, value }); }
    setBool(entity, on) { return this.call("input_boolean", on ? "turn_on" : "turn_off", { entity_id: entity }); }
    setSelect(entity, option) { return this.call("input_select", "select_option", { entity_id: entity, option }); }
    press(entity) { return this.call("input_button", "press", { entity_id: entity }); }

    // --- the store (0.42): the component's four doors ------------------------------
    ws(type, extra) { return this._hass.callWS({ type, ...(extra || {}) }); }
    fetch() {
      return this.ws("regie/palettes/list")
        .then((r) => { this._docs = r.palettes || {}; this._read = true; })
        .catch((e) => { this._docs = {}; this._read = true; this._error = String((e && e.message) || e); });
    }
    stores() {
      return Object.keys(this._docs).sort().map((id) => ({ id, name: this._docs[id].label || id }));
    }
    storeValues(id) { return valuesOf(this._docs[id] || {}); }
    saveDoc(id, doc) {
      return this.ws("regie/palettes/save", { ...(id ? { palette_id: id } : {}), palette: doc })
        .then((r) => { this._docs[r.palette_id] = r.palette; return r.palette_id; })
        .catch((e) => { this._note(String((e && e.message) || e)); return null; });
    }
    // a slider fires many times a second: the store hears the last document only
    edit(id, mutate) {
      const v = this.storeValues(id);
      mutate(v);
      this._docs[id] = docOf(v);
      clearTimeout(this._pending[id]);
      this._pending[id] = setTimeout(() => this.saveDoc(id, this._docs[id]), 150);
    }
    rulesValues() {
      const px = this._config.rules.prefix, n = (k, d) => this.num(`input_number.${px}_${k}`, d);
      return {
        harmonies: Object.fromEntries(ORDER.map((h) => [h, n(`weight_${h}`, 0)])),
        avoid: [n("avoid_from", 45), n("avoid_to", 105)],
        saturation: [n("saturation_min", 85), n("saturation_max", 100)],
        jitter: [n("jitter_min", 0), n("jitter_max", 0)],
        curve: Object.fromEntries(PERIODS.map((p) => [p, n(`curve_${p}`, 100)])),
        alive: [n("alive_min", 0), n("alive_max", 0)],
        alive_all: this.st(`input_boolean.${px}_alive_all`, "off") === "on",
        shapes: (this.st(`input_text.${px}_shapes`, "") || "").split(/[,;]/).map((s) => s.trim()).filter(Boolean),
        every: [n("every_min", 120), n("every_max", 600)],
        chance: n("chance", 0),
      };
    }

    // --- the card's face -----------------------------------------------------------------
    _render() {
      const c = this._config, L = c.labels || {};
      const sensor = this._hass && this._hass.states["sensor.house_palette"];
      const label = sensor ? (sensor.attributes.label || sensor.state) : "—";
      const p = sensor && sensor.attributes.palette;
      const sw = p ? `<span class="swatch" style="background:linear-gradient(90deg,${this._gradient(p.lo, p.width, p.saturation, 3)})"></span>` : "";
      if (!this._card) {
        this.shadowRoot.innerHTML = `<style>${css}</style><ha-card><div class="row"><div><div class="name"></div><div class="sub"></div></div><button class="open"></button></div></ha-card><div class="host"></div>`;
        this._card = this.shadowRoot.querySelector("ha-card");
        this.shadowRoot.querySelector("button.open").addEventListener("click", () => {
          this._open = true; this._tab = this._tab || "today"; this._renderWindow();
          this.fetch().then(() => this._renderWindow());   // the store, read once per opening
        });
      }
      const nameEl = this._card.querySelector(".name"), html = `${sw}${label}`;
      if (nameEl.innerHTML !== html) nameEl.innerHTML = html;
      this._card.querySelector(".sub").textContent = L.subtitle || "";
      this._card.querySelector("button.open").textContent = L.open || "Ouvrir";
    }
    _gradient(lo, width, sat, n) {
      const stops = [];
      for (let i = 0; i <= n; i++) stops.push(`hsl(${Math.round((lo + width * i / n) % 360)} ${sat}% 55%) ${Math.round(i * 100 / n)}%`);
      return stops.join(", ");
    }

    // --- the window ----------------------------------------------------------------------
    _renderWindow(refresh) {
      const host = this.shadowRoot.querySelector(".host");
      if (!this._open) { host.innerHTML = ""; this._sig = null; return; }
      if (this._dragging) return; // a drag redraws itself; the brain's echo must not fight it
      const c = this._config, L = c.labels || {};
      const stores = this.stores();
      const tabs = [{ id: "today", label: L.rules || "Du jour · les règles" }]
        .concat(c.named.map((n) => ({ id: `named:${n.id}`, label: n.label, ro: true })))
        .concat(stores.map((st) => ({ id: `store:${st.id}`, label: st.name })))
        .concat([{ id: "new", label: "+ " + (L.new || "Nouvelle") }]);
      if (!tabs.some((t) => t.id === this._tab)) this._tab = "today";
      if (!host.querySelector(".win")) {
        // the shell, once: the overlay keeps its scroll across refreshes
        host.innerHTML = `<div class="overlay"><div class="win">
          <div class="head"><h2>${L.title || "L'Atelier des palettes"}</h2><button class="close" aria-label="close">✕</button></div>
          <div class="tabs"></div>
          <div class="body"></div>
        </div></div>`;
        host.querySelector(".close").addEventListener("click", () => { this._open = false; this._renderWindow(); });
        host.querySelector(".overlay").addEventListener("click", (e) => { if (e.target === e.currentTarget) { this._open = false; this._renderWindow(); } });
      }
      const tabsEl = host.querySelector(".tabs");
      tabsEl.innerHTML = tabs.map((t) => `<button class="tab${t.id === this._tab ? " on" : ""}${t.ro ? " ro" : ""}" data-tab="${t.id}">${t.label}</button>`).join("");
      tabsEl.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => {
        const id = b.dataset.tab;
        if (id === "new") { this._new(); return; }
        this._tab = id; this._renderWindow();
      }));
      const body = host.querySelector(".body");
      if (this._tab === "today") this._renderRules(body);
      else if (this._tab.startsWith("named:")) this._renderNamed(body, c.named.find((n) => `named:${n.id}` === this._tab));
      else if (this._tab.startsWith("store:")) this._renderStore(body, stores.find((st) => `store:${st.id}` === this._tab));
      this._sig = this._signature();
    }

    // « Nouvelle » (0.24, the card's own since 0.42): a copy of the palette IN
    // FORCE, under a name to change; the select takes it
    _new() {
      const L = this._config.labels || {};
      const sensor = this._hass && this._hass.states["sensor.house_palette"];
      const p = (sensor && sensor.attributes.palette) || { lo: 200, width: 120, accent: 30, saturation: 90, white: "warm" };
      const taken = new Set(this.stores().map((st) => st.name));
      let name = L.new || "Nouvelle", n = 1;
      while (taken.has(name)) { n += 1; name = `${L.new || "Nouvelle"} ${n}`; }
      this._keepAs(this._flatOf(p), name);
    }
    // a palette the sensor carries (a draw, a file's, a kept one) as the flat values
    _flatOf(p) {
      const curve = p.curve || {};
      return {
        start: p.lo, width: p.width, accent: p.accent === null || p.accent === undefined ? p.lo : p.accent,
        saturation: p.saturation, white: p.white, jitter: p.jitter || 0,
        curve_morning: curve.morning === undefined ? 100 : curve.morning,
        curve_day: curve.day === undefined ? 100 : curve.day,
        curve_evening: curve.evening === undefined ? 100 : curve.evening,
        curve_night: curve.night === undefined ? 100 : curve.night,
        alive: typeof p.alive === "number" ? p.alive : 0, alive_all: p.alive === "all",
        shapes: p.life ? p.life.shapes : [], every_min: p.life ? p.life.every[0] : 120, every_max: p.life ? p.life.every[1] : 600,
      };
    }

    // a kept palette: every part of it, edited in place
    _renderStore(body, st) {
      if (!st) return;
      const L = this._config.labels || {}, id = st.id, v = this.storeValues(id);
      body.innerHTML = `
        <div class="field"><div class="lab"><span>${L.name || "Nom"}</span></div><input type="text" class="name" value="${this._esc(st.name)}" maxlength="40"></div>
        <div class="grid">
          <div>
            <div class="ring"><div class="wheel"></div><svg viewBox="0 0 190 190"></svg></div>
            ${this._slider("saturation", L.saturation || "Saturation", v.saturation, 0, 100, 1)}
            ${this._slider("jitter", L.jitter || "Éparpillement ±%", v.jitter, 0, 30, 1)}
            <div class="field"><div class="lab"><span>${L.white || "Blanc"}</span></div><div class="sel white">${this._config.rules.whites.map((w) => `<button data-w="${w}" class="${w === v.white ? "on" : ""}">${w}</button>`).join("")}</div></div>
          </div>
          <div>
            <div class="field"><div class="lab"><span>${L.curve || "Niveau · la courbe du jour"}</span></div><svg class="curve" viewBox="0 0 300 110"></svg></div>
            <div class="field"><div class="lab"><span>${L.alive || "Vives · par pièce"}</span></div><div class="pair"><input type="number" class="alive" min="0" max="40" value="${v.alive}" ${v.alive_all ? "disabled" : ""}><button class="chip all ${v.alive_all ? "on" : ""}">${L.all || "toutes"}</button></div></div>
            <div class="field"><div class="lab"><span>${L.shapes || "Vie · les formes"}</span></div><div class="chips shapes">${this._config.shapes.map((s) => `<button class="chip ${v.shapes.includes(s) ? "on" : ""}" data-s="${s}">${s}</button>`).join("")}</div></div>
            <div class="field"><div class="lab"><span>${L.every || "Vie · toutes les (s)"}</span></div><div class="pair"><input type="number" class="emin" min="60" max="3600" step="10" value="${v.every_min}"><span>–</span><input type="number" class="emax" min="60" max="3600" step="10" value="${v.every_max}"></div></div>
          </div>
        </div>
        <div class="actions">
          <button class="btn solid try">${L.try || "Essayer"}</button>
          <button class="btn random">${L.random || "Au hasard"}</button>
          <button class="btn saveas">${L.saveas || "Enregistrer sous…"}</button>
          <button class="btn danger delete">${L.delete || "Supprimer"}</button>
        </div>`;
      this._ring(body, { lo: v.start, width: v.width, accent: v.accent, sat: v.saturation }, {
        onArc: (lo, width) => this.edit(id, (x) => { x.start = lo; x.width = width; }),
        onAccent: (h) => this.edit(id, (x) => { x.accent = h; }),
        avoid: this.rulesValues().avoid,
      });
      this._curve(body, PERIODS.map((p) => v[`curve_${p}`]), (i, val) => this.edit(id, (x) => { x[`curve_${PERIODS[i]}`] = val; }));
      this._bindSlider(body, "saturation", (val) => this.edit(id, (x) => { x.saturation = val; }));
      this._bindSlider(body, "jitter", (val) => this.edit(id, (x) => { x.jitter = val; }));
      body.querySelectorAll(".sel.white button").forEach((b) => b.addEventListener("click", () => this.edit(id, (x) => { x.white = b.dataset.w; })));
      // the NAME is the face: the select's options follow it, the component keeps
      // this palette selected across the rename (set_options would drop it)
      body.querySelector("input.name").addEventListener("change", (e) => {
        const name = e.target.value.trim();
        if (!name) return;
        this._docs[id] = docOf({ ...v, label: name });
        this.saveDoc(id, this._docs[id]).then(() => this._renderWindow());
      });
      body.querySelector("input.alive").addEventListener("change", (e) => this.edit(id, (x) => { x.alive = parseInt(e.target.value || "0", 10); }));
      body.querySelector(".chip.all").addEventListener("click", () => this.edit(id, (x) => { x.alive_all = !v.alive_all; }));
      body.querySelectorAll(".chips.shapes .chip").forEach((b) => b.addEventListener("click", () => {
        const s = b.dataset.s;
        this.edit(id, (x) => { x.shapes = v.shapes.includes(s) ? v.shapes.filter((y) => y !== s) : v.shapes.concat([s]); });
        this._renderWindow();
      }));
      body.querySelector("input.emin").addEventListener("change", (e) => this.edit(id, (x) => { x.every_min = parseInt(e.target.value || "60", 10); }));
      body.querySelector("input.emax").addEventListener("change", (e) => this.edit(id, (x) => { x.every_max = parseInt(e.target.value || "600", 10); }));
      body.querySelector(".try").addEventListener("click", () => this.setSelect(this._config.select, st.name));
      body.querySelector(".random").addEventListener("click", () => this.ws("regie/palettes/random", { palette_id: id })
        .then((r) => { this._docs[id] = r.palette; this._renderWindow(); })
        .catch((e) => this._note(String((e && e.message) || e))));
      body.querySelector(".saveas").addEventListener("click", () => this._saveAs(v, st.name + " 2"));
      const del = body.querySelector(".delete");
      del.addEventListener("click", () => {
        if (del.dataset.armed) {
          this.ws("regie/palettes/delete", { palette_id: id })
            .then(() => { delete this._docs[id]; this._tab = "today"; this._renderWindow(); })
            .catch((e) => this._note(String((e && e.message) || e)));
        } else { del.dataset.armed = "1"; del.textContent = (L.confirm || "Confirmer") + " ?"; setTimeout(() => { delete del.dataset.armed; del.textContent = L.delete || "Supprimer"; }, 4000); }
      });
    }

    // a file's palette: read-only, with « Dupliquer »
    _renderNamed(body, n) {
      if (!n) return;
      const L = this._config.labels || {}, p = n.palette;
      body.innerHTML = `
        <div class="grid">
          <div><div class="ring"><div class="wheel"></div><svg viewBox="0 0 190 190"></svg></div></div>
          <div class="field">
            <div class="lab"><span>${L.arc || "Arc"}</span><b>${p.lo}° → ${p.hi}°</b></div>
            <div class="lab"><span>${L.accent || "Accent"}</span><b>${p.accent === null ? "—" : p.accent + "°"}</b></div>
            <div class="lab"><span>${L.saturation || "Saturation"}</span><b>${p.saturation}</b></div>
            <div class="lab"><span>${L.white || "Blanc"}</span><b>${p.white}</b></div>
            <div class="lab"><span>${L.alive || "Vives"}</span><b>${p.alive === null || p.alive === undefined ? "—" : p.alive}</b></div>
            <div class="lab"><span>${L.shapes || "Vie"}</span><b>${p.life ? p.life.shapes.join(", ") + " · " + p.life.every.join("–") + " s" : "—"}</b></div>
            <div class="note">${L.file_note || "Écrite dans le fichier : dupliquez-la pour l'éditer."}</div>
          </div>
        </div>
        <div class="actions"><button class="btn solid try">${L.try || "Essayer"}</button><button class="btn dup">${L.duplicate || "Dupliquer"}</button></div>`;
      this._ring(body, { lo: p.lo, width: p.width, accent: p.accent, sat: p.saturation }, { readonly: true, avoid: this.rulesValues().avoid });
      body.querySelector(".try").addEventListener("click", () => this.setSelect(this._config.select, n.label));
      body.querySelector(".dup").addEventListener("click", () => this._saveAs(this._flatOf(p), n.label + " 2"));
    }

    // the day's rules, and the week they give
    _renderRules(body) {
      const L = this._config.labels || {}, px = this._config.rules.prefix, r = this.rulesValues();
      body.innerHTML = `
        <div class="grid">
          <div>
            <div class="ring"><div class="wheel"></div><svg viewBox="0 0 190 190"></svg></div>
            <div class="note">${L.avoid_note || "Le quart grisé n'est jamais traversé : tirez ses deux poignées."}</div>
            ${ORDER.map((h) => this._slider(`weight_${h}`, (L.weight || "Poids") + " · " + (L[`harmony_${h}`] || h), r.harmonies[h], 0, 20, 1)).join("")}
            <div class="field"><div class="lab"><span>${L.saturation || "Saturation"}</span></div><div class="pair"><input type="number" class="n" data-k="saturation_min" min="0" max="100" value="${r.saturation[0]}"><span>–</span><input type="number" class="n" data-k="saturation_max" min="0" max="100" value="${r.saturation[1]}"></div></div>
            <div class="field"><div class="lab"><span>${L.jitter || "Éparpillement ±%"}</span></div><div class="pair"><input type="number" class="n" data-k="jitter_min" min="0" max="30" value="${r.jitter[0]}"><span>–</span><input type="number" class="n" data-k="jitter_max" min="0" max="30" value="${r.jitter[1]}"></div></div>
          </div>
          <div>
            <div class="field"><div class="lab"><span>${L.curve || "Niveau · la courbe du jour"}</span></div><svg class="curve" viewBox="0 0 300 110"></svg></div>
            <div class="field"><div class="lab"><span>${L.alive || "Vives · par pièce"}</span></div><div class="pair"><input type="number" class="n" data-k="alive_min" min="0" max="40" value="${r.alive[0]}"><span>–</span><input type="number" class="n" data-k="alive_max" min="0" max="40" value="${r.alive[1]}" ${r.alive_all ? "disabled" : ""}><button class="chip all ${r.alive_all ? "on" : ""}">${L.all || "toutes"}</button></div></div>
            <div class="field"><div class="lab"><span>${L.shapes || "Vie · les formes"}</span></div><div class="chips shapes">${this._config.shapes.map((s) => `<button class="chip ${r.shapes.includes(s) ? "on" : ""}" data-s="${s}">${s}</button>`).join("")}</div></div>
            <div class="field"><div class="lab"><span>${L.every || "Vie · toutes les (s)"}</span></div><div class="pair"><input type="number" class="n" data-k="every_min" min="60" max="3600" step="10" value="${r.every[0]}"><span>–</span><input type="number" class="n" data-k="every_max" min="60" max="3600" step="10" value="${r.every[1]}"></div></div>
            ${this._slider("chance", L.chance || "Vie · part des jours (%)", r.chance, 0, 100, 5)}
            <div class="field"><div class="lab"><span>${L.week || "La semaine, avec ces règles"}</span></div><div class="week"></div></div>
          </div>
        </div>
        <div class="actions"><button class="btn solid try">${L.try_today || "Essayer le jour"}</button><button class="btn another">${L.another || "Une autre"}</button></div>`;
      this._ring(body, { lo: 0, width: 0, accent: null, sat: 90 }, {
        avoid: r.avoid, avoidHandles: true,
        onAvoid: (from, to) => { this.setNumber(`input_number.${px}_avoid_from`, from); this.setNumber(`input_number.${px}_avoid_to`, to); },
      });
      this._curve(body, PERIODS.map((p) => r.curve[p]), (i, val) => this.setNumber(`input_number.${px}_curve_${PERIODS[i]}`, val));
      for (const h of ORDER) this._bindSlider(body, `weight_${h}`, (val) => this.setNumber(`input_number.${px}_weight_${h}`, val));
      this._bindSlider(body, "chance", (val) => this.setNumber(`input_number.${px}_chance`, val));
      body.querySelectorAll("input.n").forEach((i) => i.addEventListener("change", (e) => this.setNumber(`input_number.${px}_${e.target.dataset.k}`, parseFloat(e.target.value || "0"))));
      body.querySelector(".chip.all").addEventListener("click", () => this.setBool(`input_boolean.${px}_alive_all`, !r.alive_all));
      body.querySelectorAll(".chips.shapes .chip").forEach((b) => b.addEventListener("click", () => {
        const s = b.dataset.s, next = r.shapes.includes(s) ? r.shapes.filter((x) => x !== s) : r.shapes.concat([s]);
        this.setText(`input_text.${px}_shapes`, next.join(", "));
      }));
      body.querySelector(".try").addEventListener("click", () => this.setSelect(this._config.select, this._config.auto_label));
      body.querySelector(".another").addEventListener("click", () => this.press("input_button.house_palette_another"));
      // the coming week, drawn with these rules
      const week = body.querySelector(".week"), salt = this._config.salt, turns = (this.st("input_datetime.house_palette_turns", "06:30") || "06:30").split(":");
      const tsec = parseInt(turns[0], 10) * 3600 + parseInt(turns[1], 10) * 60;
      const now = new Date(), offset = -now.getTimezoneOffset() * 60;
      const day0 = Math.floor((now.getTime() / 1000 + offset - tsec) / 86400);
      const roll = this.num("counter.house_palette_roll", 0);
      const rules = { harmonies: r.harmonies, avoid: r.avoid, saturation: r.saturation, jitter: r.jitter, life: { shapes: r.shapes, chance: r.chance } };
      for (let i = 0; i < 7; i++) {
        const p = draw(day0 + i, i === 0 ? roll : 0, salt, rules), d = new Date(now.getTime() + i * 86400000);
        const bar = document.createElement("div");
        bar.style.background = `linear-gradient(90deg, ${this._gradient(p.lo, p.width, p.saturation, 8)})`;
        bar.title = `${d.toLocaleDateString()} · ${L[`harmony_${p.harmony}`] || p.harmony} ${p.lo}→${p.hi}° · accent ${p.accent}° · ${p.white}${p.life ? " · vie" : ""}`;
        week.appendChild(bar);
      }
    }

    _saveAs(v, suggested) {
      const L = this._config.labels || {}, body = this.shadowRoot.querySelector(".body");
      let ask = body.querySelector(".ask");
      if (!ask) {
        // the name asked inline: a webview may swallow prompt()
        ask = document.createElement("div"); ask.className = "field ask";
        ask.innerHTML = `<div class="lab"><span>${L.saveas_prompt || "Le nom de la nouvelle palette"}</span></div><div class="pair"><input type="text" maxlength="40" value="${this._esc(suggested || "")}"><button class="btn solid ok">OK</button></div>`;
        body.appendChild(ask);
        ask.querySelector("input").focus();
        ask.querySelector(".ok").addEventListener("click", () => { const name = ask.querySelector("input").value.trim(); ask.remove(); if (name) this._keepAs(v, name); });
        return;
      }
    }
    // « Enregistrer sous » and « Nouvelle »: one more document, no ceiling (0.42)
    _keepAs(v, name) {
      this.saveDoc(null, docOf({ ...v, label: name })).then((id) => {
        if (!id) return;
        this._tab = `store:${id}`;
        this._renderWindow();
        this.setSelect(this._config.select, name);
      });
    }
    _note(text) {
      const body = this.shadowRoot.querySelector(".body");
      let n = body.querySelector(".note.said");
      if (!n) { n = document.createElement("div"); n.className = "note said"; body.appendChild(n); }
      n.textContent = text;
    }

    // --- controls -------------------------------------------------------------------------
    _slider(key, label, value, min, max, step) {
      return `<div class="field"><div class="lab"><span>${label}</span><b class="v-${key}">${Math.round(value)}</b></div><input type="range" class="s-${key}" min="${min}" max="${max}" step="${step}" value="${value}"></div>`;
    }
    _bindSlider(body, key, onChange) {
      const s = body.querySelector(`.s-${key}`), v = body.querySelector(`.v-${key}`);
      s.addEventListener("input", () => { v.textContent = s.value; this._dragging = true; onChange(parseFloat(s.value)); });
      s.addEventListener("change", () => { this._dragging = false; });
    }
    _esc(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

    // the ring: the arc's two handles, the accent dot, the avoided quarter
    _ring(body, p, opts) {
      const svg = body.querySelector(".ring svg"), ns = "http://www.w3.org/2000/svg", cx = 95, cy = 95, R = 79;
      const pt = (deg, r) => { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
      const arc = (a0, a1, r) => { const p0 = pt(a0, r), p1 = pt(a1, r), large = ((a1 - a0) % 360 + 360) % 360 > 180 ? 1 : 0; return `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 ${large} 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`; };
      const el = (tag, attrs) => { const e = document.createElementNS(ns, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); svg.appendChild(e); return e; };
      const state = { lo: p.lo, width: p.width, accent: p.accent, avoid: opts.avoid.slice() };
      const paint = () => {
        svg.innerHTML = "";
        el("path", { d: arc(state.avoid[0], state.avoid[1], 70), fill: "none", stroke: "rgba(60,60,60,.85)", "stroke-width": 20 });
        if (opts.avoidHandles) {
          for (const i of [0, 1]) { const q = pt(state.avoid[i], 70); el("circle", { class: "h avoid", "data-i": i, cx: q[0], cy: q[1], r: 8, fill: "#8a8a8a", stroke: "#111", "stroke-width": 2 }); }
        }
        if (state.width > 0) {
          el("path", { d: arc(state.lo, state.lo + state.width, R + 6), fill: "none", stroke: "#fff", "stroke-width": 4, "stroke-linecap": "round" });
          if (!opts.readonly) {
            const a = pt(state.lo, R + 6), b = pt(state.lo + state.width, R + 6);
            el("circle", { class: "h lo", cx: a[0], cy: a[1], r: 8, fill: "#fff", stroke: "#111", "stroke-width": 2 });
            el("circle", { class: "h hi", cx: b[0], cy: b[1], r: 8, fill: "#fff", stroke: "#111", "stroke-width": 2 });
          }
        }
        if (state.accent !== null && state.accent !== undefined) {
          const q = pt(state.accent, R - 14);
          el("circle", { class: opts.readonly ? "" : "h accent", cx: q[0], cy: q[1], r: 9, fill: `hsl(${state.accent} 100% 55%)`, stroke: "#111", "stroke-width": 2 });
        }
        const t = el("text", { x: cx, y: cy + 4, "text-anchor": "middle", fill: "currentColor", "font-size": "11" });
        t.textContent = state.width > 0 ? `${Math.round(state.lo) % 360}° → ${Math.round(state.lo + state.width) % 360}°` : `${Math.round(state.avoid[0])}–${Math.round(state.avoid[1])}°`;
      };
      paint();
      if (opts.readonly) return;
      const angleOf = (e) => { const b = svg.getBoundingClientRect(); const x = e.clientX - b.left - b.width / 2, y = e.clientY - b.top - b.height / 2; return ((Math.atan2(y, x) * 180 / Math.PI) + 90 + 360) % 360; };
      let drag = null;
      svg.addEventListener("pointerdown", (e) => {
        const h = e.target.closest("circle.h"); if (!h) return;
        drag = h.classList.contains("lo") ? "lo" : h.classList.contains("hi") ? "hi" : h.classList.contains("accent") ? "accent" : "avoid" + h.dataset.i;
        this._dragging = true; svg.setPointerCapture(e.pointerId); e.preventDefault();
      });
      svg.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const ang = angleOf(e);
        if (drag === "lo") state.lo = ang;
        else if (drag === "hi") { state.width = ((ang - state.lo) % 360 + 360) % 360 || 360; if (state.width < 5) state.width = 5; }
        else if (drag === "accent") state.accent = ang;
        else if (drag === "avoid0") { const span = ((state.avoid[1] - ang) % 360 + 360) % 360; if (span >= 10 && span <= 350) state.avoid[0] = ang; }
        else if (drag === "avoid1") { const span = ((ang - state.avoid[0]) % 360 + 360) % 360; if (span >= 10 && span <= 350) state.avoid[1] = ang; }
        paint();
        if (drag === "lo" || drag === "hi") opts.onArc(Math.round(state.lo) % 360, Math.round(state.width));
        else if (drag === "accent") opts.onAccent(Math.round(state.accent) % 360);
        else opts.onAvoid(Math.round(state.avoid[0]), Math.round(state.avoid[1]));
      });
      const end = () => { drag = null; this._dragging = false; };
      svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
    }

    // the level curve: four points on the periods, dragged up and down
    _curve(body, values, onChange) {
      const svg = body.querySelector(".curve"), ns = "http://www.w3.org/2000/svg";
      const X = (i) => 30 + i * 80, Y = (v) => 96 - v * 0.44;
      const vals = values.slice();
      const paint = () => {
        svg.innerHTML = "";
        const el = (tag, attrs) => { const e = document.createElementNS(ns, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); svg.appendChild(e); return e; };
        for (const g of [0, 100, 200]) el("path", { d: `M30 ${Y(g)} L270 ${Y(g)}`, stroke: "rgba(128,128,128,.35)", "stroke-width": 1 });
        el("path", { d: vals.map((v, i) => `${i ? "L" : "M"}${X(i)} ${Y(v)}`).join(" "), fill: "none", stroke: "var(--primary-color)", "stroke-width": 2 });
        vals.forEach((v, i) => {
          el("circle", { class: "p", "data-i": i, cx: X(i), cy: Y(v), r: 7, fill: "var(--card-background-color, #222)", stroke: "var(--primary-color)", "stroke-width": 2 });
          const t = el("text", { x: X(i), y: 108, "text-anchor": "middle", fill: "currentColor", "font-size": "9" }); t.textContent = PERIODS[i];
          const n = el("text", { x: X(i), y: Y(v) - 11, "text-anchor": "middle", fill: "currentColor", "font-size": "9" }); n.textContent = `${Math.round(v)} %`;
        });
      };
      paint();
      let drag = null;
      svg.addEventListener("pointerdown", (e) => { const c = e.target.closest("circle.p"); if (!c) return; drag = parseInt(c.dataset.i, 10); this._dragging = true; svg.setPointerCapture(e.pointerId); e.preventDefault(); });
      svg.addEventListener("pointermove", (e) => {
        if (drag === null) return;
        const b = svg.getBoundingClientRect(), y = (e.clientY - b.top) * 110 / b.height;
        vals[drag] = Math.max(0, Math.min(200, Math.round((96 - y) / 0.44 / 5) * 5));
        paint(); onChange(drag, vals[drag]);
      });
      const end = () => { drag = null; this._dragging = false; };
      svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
    }
  }

  if (!customElements.get("regie-palette-atelier")) customElements.define("regie-palette-atelier", RegiePaletteAtelier);
  window.customCards = window.customCards || [];
  window.customCards.push({ type: "regie-palette-atelier", name: "La Régie — L'Atelier des palettes", description: "a window to edit a palette in full, or the day's rules" });
})();
