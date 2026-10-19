/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xi = globalThis, co = xi.ShadowRoot && (xi.ShadyCSS === void 0 || xi.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ho = Symbol(), Qo = /* @__PURE__ */ new WeakMap();
let Fa = class {
  constructor(t, i, n) {
    if (this._$cssResult$ = !0, n !== ho) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (co && t === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (t = Qo.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && Qo.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Li = (e) => new Fa(typeof e == "string" ? e : e + "", void 0, ho), Re = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((n, o, r) => n + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[r + 1], e[0]);
  return new Fa(i, e, ho);
}, Xl = (e, t) => {
  if (co) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const n = document.createElement("style"), o = xi.litNonce;
    o !== void 0 && n.setAttribute("nonce", o), n.textContent = i.cssText, e.appendChild(n);
  }
}, Jo = co ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const n of t.cssRules) i += n.cssText;
  return Li(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Yl, defineProperty: Zl, getOwnPropertyDescriptor: Ql, getOwnPropertyNames: Jl, getOwnPropertySymbols: ec, getPrototypeOf: tc } = Object, nn = globalThis, er = nn.trustedTypes, ic = er ? er.emptyScript : "", nc = nn.reactiveElementPolyfillSupport, Ht = (e, t) => e, Fi = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ic : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, po = (e, t) => !Yl(e, t), tr = { attribute: !0, type: String, converter: Fi, reflect: !1, useDefault: !1, hasChanged: po };
Symbol.metadata ??= Symbol("metadata"), nn.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let mt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = tr) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const n = Symbol(), o = this.getPropertyDescriptor(t, n, i);
      o !== void 0 && Zl(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, i, n) {
    const { get: o, set: r } = Ql(this.prototype, t) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: o, set(a) {
      const s = o?.call(this);
      r?.call(this, a), this.requestUpdate(t, s, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ht("elementProperties"))) return;
    const t = tc(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ht("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ht("properties"))) {
      const i = this.properties, n = [...Jl(i), ...ec(i)];
      for (const o of n) this.createProperty(o, i[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [n, o] of i) this.elementProperties.set(n, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, n] of this.elementProperties) {
      const o = this._$Eu(i, n);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const o of n) i.unshift(Jo(o));
    } else t !== void 0 && i.push(Jo(t));
    return i;
  }
  static _$Eu(t, i) {
    const n = i.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const n of i.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Xl(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, n) {
    this._$AK(t, n);
  }
  _$ET(t, i) {
    const n = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, n);
    if (o !== void 0 && n.reflect === !0) {
      const r = (n.converter?.toAttribute !== void 0 ? n.converter : Fi).toAttribute(i, n.type);
      this._$Em = t, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const n = this.constructor, o = n._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const r = n.getPropertyOptions(o), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Fi;
      this._$Em = o;
      const s = a.fromAttribute(i, r.type);
      this[o] = s ?? this._$Ej?.get(o) ?? s, this._$Em = null;
    }
  }
  requestUpdate(t, i, n, o = !1, r) {
    if (t !== void 0) {
      const a = this.constructor;
      if (o === !1 && (r = this[t]), n ??= a.getPropertyOptions(t), !((n.hasChanged ?? po)(r, i) || n.useDefault && n.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, n)))) return;
      this.C(t, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: n, reflect: o, wrapped: r }, a) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? i ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (i = void 0), this._$AL.set(t, i)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [o, r] of n) {
        const { wrapped: a } = r, s = this[o];
        a !== !0 || this._$AL.has(o) || s === void 0 || this.C(o, void 0, r, s);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((n) => n.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
mt.elementStyles = [], mt.shadowRootOptions = { mode: "open" }, mt[Ht("elementProperties")] = /* @__PURE__ */ new Map(), mt[Ht("finalized")] = /* @__PURE__ */ new Map(), nc?.({ ReactiveElement: mt }), (nn.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const uo = globalThis, ir = (e) => e, Di = uo.trustedTypes, nr = Di ? Di.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Da = "$lit$", Ne = `lit$${Math.random().toFixed(9).slice(2)}$`, Ra = "?" + Ne, oc = `<${Ra}>`, ct = document, Gt = () => ct.createComment(""), Kt = (e) => e === null || typeof e != "object" && typeof e != "function", fo = Array.isArray, rc = (e) => fo(e) || typeof e?.[Symbol.iterator] == "function", En = `[ 	
\f\r]`, zt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, or = /-->/g, rr = />/g, Ye = RegExp(`>|${En}(?:([^\\s"'>=/]+)(${En}*=${En}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ar = /'/g, sr = /"/g, Ha = /^(?:script|style|textarea|title)$/i, Na = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), v = Na(1), _ = Na(2), Pe = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), lr = /* @__PURE__ */ new WeakMap(), it = ct.createTreeWalker(ct, 129);
function ja(e, t) {
  if (!fo(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nr !== void 0 ? nr.createHTML(t) : t;
}
const ac = (e, t) => {
  const i = e.length - 1, n = [];
  let o, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = zt;
  for (let s = 0; s < i; s++) {
    const l = e[s];
    let c, p, d = -1, h = 0;
    for (; h < l.length && (a.lastIndex = h, p = a.exec(l), p !== null); ) h = a.lastIndex, a === zt ? p[1] === "!--" ? a = or : p[1] !== void 0 ? a = rr : p[2] !== void 0 ? (Ha.test(p[2]) && (o = RegExp("</" + p[2], "g")), a = Ye) : p[3] !== void 0 && (a = Ye) : a === Ye ? p[0] === ">" ? (a = o ?? zt, d = -1) : p[1] === void 0 ? d = -2 : (d = a.lastIndex - p[2].length, c = p[1], a = p[3] === void 0 ? Ye : p[3] === '"' ? sr : ar) : a === sr || a === ar ? a = Ye : a === or || a === rr ? a = zt : (a = Ye, o = void 0);
    const u = a === Ye && e[s + 1].startsWith("/>") ? " " : "";
    r += a === zt ? l + oc : d >= 0 ? (n.push(c), l.slice(0, d) + Da + l.slice(d) + Ne + u) : l + Ne + (d === -2 ? s : u);
  }
  return [ja(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class Xt {
  constructor({ strings: t, _$litType$: i }, n) {
    let o;
    this.parts = [];
    let r = 0, a = 0;
    const s = t.length - 1, l = this.parts, [c, p] = ac(t, i);
    if (this.el = Xt.createElement(c, n), it.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (o = it.nextNode()) !== null && l.length < s; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const d of o.getAttributeNames()) if (d.endsWith(Da)) {
          const h = p[a++], u = o.getAttribute(d).split(Ne), f = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: r, name: f[2], strings: u, ctor: f[1] === "." ? lc : f[1] === "?" ? cc : f[1] === "@" ? dc : on }), o.removeAttribute(d);
        } else d.startsWith(Ne) && (l.push({ type: 6, index: r }), o.removeAttribute(d));
        if (Ha.test(o.tagName)) {
          const d = o.textContent.split(Ne), h = d.length - 1;
          if (h > 0) {
            o.textContent = Di ? Di.emptyScript : "";
            for (let u = 0; u < h; u++) o.append(d[u], Gt()), it.nextNode(), l.push({ type: 2, index: ++r });
            o.append(d[h], Gt());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Ra) l.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = o.data.indexOf(Ne, d + 1)) !== -1; ) l.push({ type: 7, index: r }), d += Ne.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const n = ct.createElement("template");
    return n.innerHTML = t, n;
  }
}
function kt(e, t, i = e, n) {
  if (t === Pe) return t;
  let o = n !== void 0 ? i._$Co?.[n] : i._$Cl;
  const r = Kt(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== r && (o?._$AO?.(!1), r === void 0 ? o = void 0 : (o = new r(e), o._$AT(e, i, n)), n !== void 0 ? (i._$Co ??= [])[n] = o : i._$Cl = o), o !== void 0 && (t = kt(e, o._$AS(e, t.values), o, n)), t;
}
class sc {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: n } = this._$AD, o = (t?.creationScope ?? ct).importNode(i, !0);
    it.currentNode = o;
    let r = it.nextNode(), a = 0, s = 0, l = n[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let c;
        l.type === 2 ? c = new At(r, r.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (c = new hc(r, this, t)), this._$AV.push(c), l = n[++s];
      }
      a !== l?.index && (r = it.nextNode(), a++);
    }
    return it.currentNode = ct, o;
  }
  p(t) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, i), i += n.strings.length - 2) : n._$AI(t[i])), i++;
  }
}
class At {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, n, o) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = n, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = kt(this, t, i), Kt(t) ? t === m || t == null || t === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : t !== this._$AH && t !== Pe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : rc(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== m && Kt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(ct.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: n } = t, o = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = Xt.createElement(ja(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === o) this._$AH.p(i);
    else {
      const r = new sc(o, this), a = r.u(this.options);
      r.p(i), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let i = lr.get(t.strings);
    return i === void 0 && lr.set(t.strings, i = new Xt(t)), i;
  }
  k(t) {
    fo(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, o = 0;
    for (const r of t) o === i.length ? i.push(n = new At(this.O(Gt()), this.O(Gt()), this, this.options)) : n = i[o], n._$AI(r), o++;
    o < i.length && (this._$AR(n && n._$AB.nextSibling, o), i.length = o);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const n = ir(t).nextSibling;
      ir(t).remove(), t = n;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class on {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, n, o, r) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = t, this.name = i, this._$AM = o, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = m;
  }
  _$AI(t, i = this, n, o) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = kt(this, t, i, 0), a = !Kt(t) || t !== this._$AH && t !== Pe, a && (this._$AH = t);
    else {
      const s = t;
      let l, c;
      for (t = r[0], l = 0; l < r.length - 1; l++) c = kt(this, s[n + l], i, l), c === Pe && (c = this._$AH[l]), a ||= !Kt(c) || c !== this._$AH[l], c === m ? t = m : t !== m && (t += (c ?? "") + r[l + 1]), this._$AH[l] = c;
    }
    a && !o && this.j(t);
  }
  j(t) {
    t === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class lc extends on {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === m ? void 0 : t;
  }
}
class cc extends on {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== m);
  }
}
class dc extends on {
  constructor(t, i, n, o, r) {
    super(t, i, n, o, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = kt(this, t, i, 0) ?? m) === Pe) return;
    const n = this._$AH, o = t === m && n !== m || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, r = t !== m && (n === m || o);
    o && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class hc {
  constructor(t, i, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    kt(this, t);
  }
}
const pc = { I: At }, uc = uo.litHtmlPolyfillSupport;
uc?.(Xt, At), (uo.litHtmlVersions ??= []).push("3.3.3");
const Wa = (e, t, i) => {
  const n = i?.renderBefore ?? t;
  let o = n._$litPart$;
  if (o === void 0) {
    const r = i?.renderBefore ?? null;
    n._$litPart$ = o = new At(t.insertBefore(Gt(), r), r, void 0, i ?? {});
  }
  return o._$AI(e), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mo = globalThis;
let Ue = class extends mt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Wa(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Pe;
  }
};
Ue._$litElement$ = !0, Ue.finalized = !0, mo.litElementHydrateSupport?.({ LitElement: Ue });
const fc = mo.litElementPolyfillSupport;
fc?.({ LitElement: Ue });
(mo.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rn = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mc = { attribute: !0, type: String, converter: Fi, reflect: !1, hasChanged: po }, gc = (e = mc, t, i) => {
  const { kind: n, metadata: o } = i;
  let r = globalThis.litPropertyMetadata.get(o);
  if (r === void 0 && globalThis.litPropertyMetadata.set(o, r = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), n === "accessor") {
    const { name: a } = i;
    return { set(s) {
      const l = t.get.call(this);
      t.set.call(this, s), this.requestUpdate(a, l, e, !0, s);
    }, init(s) {
      return s !== void 0 && this.C(a, void 0, e, s), s;
    } };
  }
  if (n === "setter") {
    const { name: a } = i;
    return function(s) {
      const l = this[a];
      t.call(this, s), this.requestUpdate(a, l, e, !0, s);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function G(e) {
  return (t, i) => typeof i == "object" ? gc(e, t, i) : ((n, o, r) => {
    const a = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, n), a ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function F(e) {
  return G({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yc = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function go(e, t) {
  return (i, n, o) => {
    const r = (a) => a.renderRoot?.querySelector(e) ?? null;
    return yc(i, n, { get() {
      return r(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bc = { CHILD: 2 }, an = (e) => (...t) => ({ _$litDirective$: e, values: t });
let sn = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, i, n) {
    this._$Ct = t, this._$AM = i, this._$Ci = n;
  }
  _$AS(t, i) {
    return this.update(t, i);
  }
  update(t, i) {
    return this.render(...i);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: vc } = pc, cr = (e) => e, dr = () => document.createComment(""), Ot = (e, t, i) => {
  const n = e._$AA.parentNode, o = t === void 0 ? e._$AB : t._$AA;
  if (i === void 0) {
    const r = n.insertBefore(dr(), o), a = n.insertBefore(dr(), o);
    i = new vc(r, a, e, e.options);
  } else {
    const r = i._$AB.nextSibling, a = i._$AM, s = a !== e;
    if (s) {
      let l;
      i._$AQ?.(e), i._$AM = e, i._$AP !== void 0 && (l = e._$AU) !== a._$AU && i._$AP(l);
    }
    if (r !== o || s) {
      let l = i._$AA;
      for (; l !== r; ) {
        const c = cr(l).nextSibling;
        cr(n).insertBefore(l, o), l = c;
      }
    }
  }
  return i;
}, Ze = (e, t, i = e) => (e._$AI(t, i), e), wc = {}, Ba = (e, t = wc) => e._$AH = t, xc = (e) => e._$AH, An = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const hr = (e, t, i) => {
  const n = /* @__PURE__ */ new Map();
  for (let o = t; o <= i; o++) n.set(e[o], o);
  return n;
}, Ee = an(class extends sn {
  constructor(e) {
    if (super(e), e.type !== bc.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, i) {
    let n;
    i === void 0 ? i = t : t !== void 0 && (n = t);
    const o = [], r = [];
    let a = 0;
    for (const s of e) o[a] = n ? n(s, a) : a, r[a] = i(s, a), a++;
    return { values: r, keys: o };
  }
  render(e, t, i) {
    return this.dt(e, t, i).values;
  }
  update(e, [t, i, n]) {
    const o = xc(e), { values: r, keys: a } = this.dt(t, i, n);
    if (!Array.isArray(o)) return this.ut = a, r;
    const s = this.ut ??= [], l = [];
    let c, p, d = 0, h = o.length - 1, u = 0, f = r.length - 1;
    for (; d <= h && u <= f; ) if (o[d] === null) d++;
    else if (o[h] === null) h--;
    else if (s[d] === a[u]) l[u] = Ze(o[d], r[u]), d++, u++;
    else if (s[h] === a[f]) l[f] = Ze(o[h], r[f]), h--, f--;
    else if (s[d] === a[f]) l[f] = Ze(o[d], r[f]), Ot(e, l[f + 1], o[d]), d++, f--;
    else if (s[h] === a[u]) l[u] = Ze(o[h], r[u]), Ot(e, o[d], o[h]), h--, u++;
    else if (c === void 0 && (c = hr(a, u, f), p = hr(s, d, h)), c.has(s[d])) if (c.has(s[h])) {
      const g = p.get(a[u]), y = g !== void 0 ? o[g] : null;
      if (y === null) {
        const b = Ot(e, o[d]);
        Ze(b, r[u]), l[u] = b;
      } else l[u] = Ze(y, r[u]), Ot(e, o[d], y), o[g] = null;
      u++;
    } else An(o[h]), h--;
    else An(o[d]), d++;
    for (; u <= f; ) {
      const g = Ot(e, l[f + 1]);
      Ze(g, r[u]), l[u++] = g;
    }
    for (; d <= h; ) {
      const g = o[d++];
      g !== null && An(g);
    }
    return this.ut = a, Ba(e, l), Pe;
  }
});
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ua = an(class extends sn {
  constructor() {
    super(...arguments), this.key = m;
  }
  render(e, t) {
    return this.key = e, t;
  }
  update(e, [t, i]) {
    return t !== this.key && (Ba(e), this.key = t), i;
  }
});
function Va(e) {
  const t = (o, r) => {
    const a = o;
    if (a && typeof a.y == "number" && Number.isFinite(a.y)) return;
    const s = a && (Object.prototype.hasOwnProperty.call(a, "true") ? "true" : Object.prototype.hasOwnProperty.call(a, "Y") ? "Y" : void 0), l = s ? ` Replace the "${s}" key with quoted lowercase 'y' in YAML (for example, 'y': 141).` : " In YAML, quote the lowercase key (for example, 'y': 141).";
    throw new Error(`Invalid configuration: ${r}.y must be a finite number.${l}`);
  }, i = (o, r) => {
    if (!o || typeof o != "object") return;
    const a = o;
    for (const s of ["openings", "items", "texts", "furniture", "trackers"]) {
      const l = a[s];
      Array.isArray(l) && l.forEach((c, p) => t(c, `${r}${s}[${p}]`));
    }
    Array.isArray(a.areas) && a.areas.forEach((s, l) => {
      Array.isArray(s?.points) && s.points.forEach((c, p) => t(c, `${r}areas[${l}].points[${p}]`));
    });
  };
  Array.isArray(e.floors) && e.floors.length ? e.floors.forEach((o, r) => i(o, `floors[${r}].`)) : i(e, "");
  const n = e.floorSwitcher;
  n && (Object.prototype.hasOwnProperty.call(n, "true") || Object.prototype.hasOwnProperty.call(n, "Y")) && t(n, "floorSwitcher");
}
function qa(e) {
  const t = e.floorSwitcher?.layout;
  return `${t === "horizontal" || t !== "vertical" && e.compactHeader === !0 ? "row" : ""} ${e.floorSwitcher?.style === "buttons" ? "buttons" : ""}`;
}
const Ga = Re`
  .floor-switcher {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--fp-floor-switcher-gap, var(--_fp-floor-gap, 4px));
    max-width: calc(100% - 16px);
  }
  .floor-switcher.row {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .floor-switcher.buttons {
    --_fp-floor-gap: 8px;
    --_fp-floor-radius: var(--ha-card-border-radius, 12px);
    --_fp-floor-padding: 10px 16px;
    --_fp-floor-font-size: 14px;
    --_fp-floor-font-weight: 500;
    --_fp-floor-min-height: 44px;
    --_fp-floor-shadow: none;
    --_fp-floor-background: var(--ha-card-background, var(--card-background-color, #fff));
    --_fp-floor-color: var(--primary-text-color, #212121);
    --_fp-floor-border: var(--ha-card-border-color, var(--divider-color, #ccc));
    --_fp-floor-accent: var(--primary-color, #03a9f4);
    --_fp-floor-accent-ink: var(--text-primary-color, #fff);
  }
  :where(.floor-switcher) .floor-button {
    box-sizing: border-box;
    border: var(--fp-floor-switcher-border-width, 1px) solid
      var(--fp-floor-switcher-border-color, var(--_fp-floor-border, var(--fp-skin-badge-border, var(--divider-color, #ccc))));
    background: var(--fp-floor-switcher-background, var(--_fp-floor-background, var(--fp-skin-badge-bg, var(--card-background-color, #fff))));
    color: var(--fp-floor-switcher-color, var(--_fp-floor-color, var(--fp-skin-text, var(--primary-text-color))));
    border-radius: var(--fp-floor-switcher-border-radius, var(--_fp-floor-radius, 6px));
    padding: var(--fp-floor-switcher-padding, var(--_fp-floor-padding, 4px 8px));
    font-size: var(--fp-floor-switcher-font-size, var(--_fp-floor-font-size, 12px));
    font-weight: var(--fp-floor-switcher-font-weight, var(--_fp-floor-font-weight, 400));
    line-height: 1;
    min-height: var(--fp-floor-switcher-min-height, var(--_fp-floor-min-height, 0px));
    box-shadow: var(--fp-floor-switcher-box-shadow, var(--_fp-floor-shadow, 0 1px 3px rgba(0, 0, 0, 0.2)));
    max-width: var(--fp-floor-switcher-max-width, 120px);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .floor-switcher.buttons .floor-button {
    font-family: inherit;
  }
  :where(.floor-switcher) .floor-button:where(.active) {
    background: var(--fp-floor-switcher-active-background, var(--fp-floor-accent, var(--_fp-floor-accent, var(--fp-skin-accent, var(--primary-color, #03a9f4)))));
    color: var(--fp-floor-switcher-active-color, var(--_fp-floor-accent-ink, var(--fp-skin-accent-ink, var(--text-primary-color, #fff))));
    border-color: var(--fp-floor-switcher-active-border-color, var(--fp-floor-switcher-active-background, var(--fp-floor-accent, var(--_fp-floor-accent, var(--fp-skin-accent, var(--primary-color, #03a9f4))))));
  }
`;
class pr {
  constructor(t) {
    this._hass = t;
  }
  getEntityState(t) {
    return this._hass.states[t];
  }
}
class _c {
  constructor(t, i, n) {
    this._historyService = t, this._fallback = i, this._timestamp = n, this._historicalStates = this._historyService.getStateAt(this._timestamp);
  }
  getEntityState(t) {
    const i = this._historicalStates.get(t);
    if (i) return i;
    const n = this._fallback.getEntityState(t);
    return n ? { ...n, attributes: { ...n.attributes ?? {} } } : void 0;
  }
}
function $c(e, t, i, n) {
  return e ? i ? new _c(t, new pr(e), n) : new pr(e) : { getEntityState: () => {
  } };
}
function kc(e, t, i, n, o) {
  if (!e) return;
  const r = $c(e, i, n, o), a = {};
  for (const s of t)
    a[s] = r.getEntityState(s);
  return {
    states: a,
    formatEntityState: (s) => e.formatEntityState(s),
    formatEntityAttributeValue: e.formatEntityAttributeValue ? (s, l) => e.formatEntityAttributeValue(s, l) : void 0
  };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Sc = {}, ur = an(class extends sn {
  constructor() {
    super(...arguments), this.ot = Sc;
  }
  render(e, t) {
    return t();
  }
  update(e, [t, i]) {
    if (Array.isArray(t)) {
      if (Array.isArray(this.ot) && this.ot.length === t.length && t.every((n, o) => n === this.ot[o])) return Pe;
    } else if (this.ot === t) return Pe;
    return this.ot = Array.isArray(t) ? Array.from(t) : t, this.render(t, i);
  }
}), Mc = /* @__PURE__ */ new Set([
  // colour
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "color",
  "color-mix",
  "light-dark",
  // custom properties / environment
  "var",
  "env",
  // maths (calc & friends can appear inside colour components)
  "calc",
  "clamp",
  "min",
  "max",
  "abs",
  "round",
  "mod",
  "rem",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "atan2",
  "pow",
  "sqrt",
  "hypot",
  "log",
  "exp",
  // gradients (valid for the stage `background`)
  "linear-gradient",
  "radial-gradient",
  "conic-gradient",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
  "repeating-conic-gradient"
]), Ec = /^[a-z0-9#%.,/_() +*-]+$/i, Ac = /([a-z][a-z0-9-]*)\s*\(/gi;
function R(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  if (!t || !Ec.test(t) || t.includes("/*") || t.includes("*/") || !/^[a-z#]/i.test(t)) return;
  let i = 0;
  for (let o = 0; o < t.length; o++) {
    const r = t[o];
    if (r === "(") i++;
    else if (r === ")" && --i < 0) return;
  }
  if (i !== 0) return;
  const n = new RegExp(Ac.source, "gi");
  for (let o; o = n.exec(t); )
    if (!Mc.has(o[1].toLowerCase())) return;
  return t;
}
function fe(e, t) {
  return R(e) ?? t;
}
function O(e, t) {
  if (e == null || typeof e == "string" && e.trim() === "") return t;
  const i = typeof e == "number" ? e : Number(e);
  return Number.isFinite(i) ? i : t;
}
function pe(e) {
  if (typeof e != "string") return;
  const t = e.trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return t === "" ? void 0 : t;
}
const Tc = {
  white: [255, 255, 255],
  black: [0, 0, 0],
  red: [255, 0, 0],
  green: [0, 128, 0],
  lime: [0, 255, 0],
  blue: [0, 0, 255],
  navy: [0, 0, 128],
  yellow: [255, 255, 0],
  orange: [255, 165, 0],
  gold: [255, 215, 0],
  purple: [128, 0, 128],
  pink: [255, 192, 203],
  brown: [165, 42, 42],
  maroon: [128, 0, 0],
  olive: [128, 128, 0],
  teal: [0, 128, 128],
  cyan: [0, 255, 255],
  aqua: [0, 255, 255],
  magenta: [255, 0, 255],
  fuchsia: [255, 0, 255],
  silver: [192, 192, 192],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  lightgray: [211, 211, 211],
  lightgrey: [211, 211, 211],
  darkgray: [169, 169, 169],
  darkgrey: [169, 169, 169],
  transparent: [255, 255, 255]
};
function Cc(e) {
  const t = e.trim().toLowerCase(), i = Tc[t];
  if (i) return i;
  const n = /^#([0-9a-f]{3,8})$/i.exec(t);
  if (n) {
    const r = n[1];
    return r.length === 3 || r.length === 4 ? [0, 1, 2].map((a) => parseInt(r[a] + r[a], 16)) : r.length === 6 || r.length === 8 ? [0, 2, 4].map((a) => parseInt(r.slice(a, a + 2), 16)) : void 0;
  }
  const o = /^rgba?\(([^)]*)\)$/.exec(t);
  if (o) {
    const r = o[1].split(/[\s,/]+/).filter((s) => s !== "");
    if (r.length < 3) return;
    const a = r.slice(0, 3).map((s) => {
      if (s.endsWith("%")) {
        const l = Number(s.slice(0, -1));
        return Number.isFinite(l) ? l / 100 * 255 : NaN;
      }
      return Number(s);
    });
    return a.some((s) => !Number.isFinite(s)) ? void 0 : a.map((s) => Math.max(0, Math.min(255, s)));
  }
}
function yo([e, t, i]) {
  const n = (o) => {
    const r = o / 255;
    return r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * n(e) + 0.7152 * n(t) + 0.0722 * n(i);
}
const Ic = "#212121", Pc = "#ffffff", zc = yo([33, 33, 33]), Oc = yo([255, 255, 255]);
function Ka(e) {
  if (typeof e != "string") return;
  const t = Cc(e);
  if (!t) return;
  const i = yo(t), n = (o) => (Math.max(i, o) + 0.05) / (Math.min(i, o) + 0.05);
  return n(zc) >= n(Oc) ? Ic : Pc;
}
const Lc = /^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/i;
function Nt(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  return Lc.test(t) ? t : void 0;
}
function Ve(e) {
  if (typeof e != "string") return;
  const t = e.trim().replace(/[^a-zA-Z0-9_.-]/g, "");
  return t === "" ? void 0 : t;
}
const ln = "default", Xa = 10, Ri = [
  {
    id: ln,
    label: "Default",
    description: "Follows your Home Assistant theme",
    vars: {}
  },
  {
    id: "odnetnin",
    label: "Odnetnin",
    description: "Playful and chunky — thick outlines on warm paper",
    vars: {
      "--fp-skin-bg": "#fffdf7",
      "--fp-skin-card-bg": "#fffdf7",
      "--fp-skin-wall": "#3b3b3b",
      "--fp-skin-wall-width": "10",
      "--fp-skin-wall-filter": "none",
      "--fp-skin-accent": "#e4444c",
      // White, not the charcoal ink: on this red it reads at 4.0 where the
      // charcoal manages 2.8. The skin whose accent is dark enough to want
      // dark ink is the one that would get this wrong by reusing active-ink.
      "--fp-skin-accent-ink": "#ffffff",
      "--fp-skin-active": "#ffcb05",
      "--fp-skin-active-ink": "#3b3b3b",
      "--fp-skin-text": "#3b3b3b",
      "--fp-skin-badge-bg": "#ffffff",
      "--fp-skin-badge-border": "#3b3b3b",
      "--fp-skin-badge-border-width": "2px",
      // Rounded square rather than a circle, and a hard offset shadow instead
      // of a blur — the two together are what read as "printed sticker".
      "--fp-skin-badge-radius": "30%",
      "--fp-skin-badge-shadow": "0 2px 0 #3b3b3b",
      "--fp-skin-furniture": "#b9b3a7",
      "--fp-skin-glow": "#ffe9a8"
    }
  },
  {
    id: "pastel",
    label: "Pastel",
    description: "Soft and low-contrast — muted mauve on blush",
    vars: {
      "--fp-skin-bg": "#fdf7f9",
      "--fp-skin-card-bg": "#fdf7f9",
      "--fp-skin-wall": "#8b8296",
      "--fp-skin-wall-width": "7",
      "--fp-skin-wall-filter": "none",
      "--fp-skin-accent": "#a8c8ec",
      "--fp-skin-accent-ink": "#4a4453",
      "--fp-skin-active": "#ffd6a5",
      "--fp-skin-active-ink": "#4a4453",
      "--fp-skin-text": "#4a4453",
      "--fp-skin-badge-bg": "#ffffff",
      "--fp-skin-badge-border": "#e6dced",
      "--fp-skin-badge-border-width": "1.5px",
      "--fp-skin-badge-radius": "50%",
      "--fp-skin-badge-shadow": "0 1px 4px rgba(120, 100, 130, 0.18)",
      "--fp-skin-furniture": "#d8cfe0",
      "--fp-skin-glow": "#ffe8d6"
    }
  },
  {
    id: "tron",
    label: "Tron",
    description: "Neon lines on near-black — thin walls that glow",
    vars: {
      "--fp-skin-bg": "#05080c",
      "--fp-skin-card-bg": "#05080c",
      "--fp-skin-wall": "#7de3ff",
      // Thin, because a neon line is the light rather than the mass. The glow
      // does the work the width would have done.
      "--fp-skin-wall-width": "5",
      "--fp-skin-wall-filter": "drop-shadow(0 0 4px #22d3ee)",
      "--fp-skin-accent": "#22d3ee",
      "--fp-skin-accent-ink": "#05080c",
      "--fp-skin-active": "#ff9f1c",
      "--fp-skin-active-ink": "#05080c",
      "--fp-skin-text": "#cdf6ff",
      "--fp-skin-badge-bg": "#0b1220",
      "--fp-skin-badge-border": "#22d3ee",
      "--fp-skin-badge-border-width": "1.5px",
      "--fp-skin-badge-radius": "50%",
      "--fp-skin-badge-shadow": "0 0 8px rgba(34, 211, 238, 0.5)",
      "--fp-skin-furniture": "#1e4b57",
      "--fp-skin-glow": "#7de3ff"
    }
  }
], oi = "var(--fp-skin-bg, var(--card-background-color, #fff))", bo = "var(--fp-skin-wall, var(--primary-text-color))", Ya = "var(--fp-skin-text, var(--primary-text-color))", Q = "var(--fp-skin-accent, var(--primary-color, #03a9f4))", Tn = "var(--fp-skin-active, var(--state-light-active-color, var(--state-active-color, #fdd835)))", Qe = "var(--fp-skin-badge-bg, var(--card-background-color, #fff))";
function vo(e) {
  if (typeof e == "string")
    return Ri.find((t) => t.id === e);
}
function Fc(e) {
  const t = vo(e);
  return t ? Object.entries(t.vars).map(([i, n]) => `${i}:${n};`).join("") : "";
}
function Dc(e) {
  const t = vo(e);
  return t && t.id !== ln ? t.id : void 0;
}
const Rc = Li(
  Ri.filter((e) => e.id !== ln).map(
    (e) => `:host([data-skin="${e.id}"]){` + Object.entries(e.vars).map(([t, i]) => `${t}:${i};`).join("") + "}"
  ).join(`
`)
), Za = Re`
  :host {
    --fp-skin-bg: var(--card-background-color, #fff);
    --fp-skin-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
    --fp-skin-wall: var(--primary-text-color);
    --fp-skin-wall-width: 8;
    --fp-skin-wall-filter: none;
    --fp-skin-accent: var(--primary-color, #03a9f4);
    --fp-skin-accent-ink: var(--text-primary-color, #fff);
    --fp-skin-active: var(--state-light-active-color, var(--state-active-color, #fdd835));
    --fp-skin-active-ink: var(--text-primary-color, #212121);
    --fp-skin-text: var(--primary-text-color);
    --fp-skin-badge-bg: var(--card-background-color, #fff);
    --fp-skin-badge-border: var(--divider-color, #ccc);
    --fp-skin-badge-border-width: 1.5px;
    --fp-skin-badge-radius: 50%;
    --fp-skin-badge-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    --fp-skin-furniture: #9e9e9e;
    --fp-skin-glow: #ffd9a0;
  }
`, Hc = 6e4, Nc = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function Qa(e) {
  return Nc.has(e);
}
function wo(e) {
  if (e === "") return;
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}
function Ja(e) {
  let t = 0;
  for (const i of e)
    if (!Qa(i.newState)) {
      if (wo(i.newState) === void 0) return !1;
      t++;
    }
  return t > 0;
}
function jc(e, t, i) {
  const n = e.map((c) => wo(c.newState)), o = n.filter((c) => c !== void 0);
  if (!o.length) return e;
  const r = (Math.max(...o) - Math.min(...o)) / t;
  if (!(r > 0) && !e.some((c) => Qa(c.newState)))
    return e.length ? [e[0], e[e.length - 1]] : [];
  const a = [e[0]];
  let s = n[0], l = e[0].timestamp;
  for (let c = 1; c < e.length - 1; c++) {
    const p = n[c];
    if (p === void 0) {
      a.push(e[c]), s = void 0, l = e[c].timestamp;
      continue;
    }
    if (s === void 0) {
      a.push(e[c]), s = p, l = e[c].timestamp;
      continue;
    }
    const d = n[c - 1], h = n[c + 1], u = d !== void 0 && h !== void 0 && (p > d && p >= h || p < d && p <= h);
    (Math.abs(p - s) >= r || u && Math.abs(p - s) >= r / 2 || e[c].timestamp - l >= i) && (a.push(e[c]), s = p, l = e[c].timestamp);
  }
  return e.length > 1 && a.push(e[e.length - 1]), a;
}
function Wc(e, t = {}) {
  const i = t.numericSteps ?? 0;
  return !(i > 0) || e.length < 3 || !Ja(e) ? e : jc(e, i, t.maxGapMs ?? Hc);
}
function Bc(e, t = {}) {
  if (!(t.numericSteps ?? 0) || e.length === 0) return e;
  const i = /* @__PURE__ */ new Map();
  for (const o of e) {
    const r = i.get(o.entityId);
    r ? r.push(o) : i.set(o.entityId, [o]);
  }
  const n = /* @__PURE__ */ new Set();
  for (const o of i.values())
    for (const r of Wc(o, t)) n.add(r);
  return e.filter((o) => n.has(o));
}
function Uc(e, t) {
  if (!(t > 2) || e.length <= t || !Ja(e)) return e;
  const i = e.map((a) => wo(a.newState)), n = /* @__PURE__ */ new Set([0, e.length - 1]);
  for (let a = 0; a < e.length; a++)
    i[a] === void 0 && n.add(a);
  const o = [];
  let r;
  for (let a = 0; a < e.length; a++) {
    const s = i[a];
    if (s === void 0) {
      r = void 0;
      continue;
    }
    a > 0 && a < e.length - 1 && r !== void 0 && o.push({ i: a, delta: Math.abs(s - r) }), r = s;
  }
  o.sort((a, s) => s.delta - a.delta);
  for (const { i: a } of o) {
    if (n.size >= t) break;
    n.add(a);
  }
  return e.filter((a, s) => n.has(s));
}
function Yt(e) {
  const t = typeof e.color == "string" ? R(e.color) : void 0;
  if (t) return t;
  const i = e.attributes?.color, n = typeof i == "string" ? R(i) : void 0;
  if (n) return n;
  const o = String(e.newState ?? "").trim().toLowerCase();
  return e.entityId.startsWith("light.") ? o === "off" ? Qe : Tn : e.entityId.startsWith("cover.") ? o === "closed" ? Qe : Q : e.entityId.startsWith("sensor.") || e.entityId.startsWith("binary_sensor.") ? o === "off" ? Qe : Q : e.entityId.startsWith("fan.") ? o === "off" ? Qe : Tn : e.entityId.startsWith("media_player.") ? o === "idle" ? Qe : Tn : o === "on" || o === "open" || o === "playing" || o === "home" || o === "locked" || o === "unlocked" ? Q : Qe;
}
class Vc {
  constructor(t = {}) {
    this._cache = /* @__PURE__ */ new Map(), this._events = [], this._eventsByEntity = /* @__PURE__ */ new Map(), this._maxCacheEntries = 8, this._loadCommitId = 0, this._loader = t.loader ?? (async () => []);
  }
  configure(t = {}) {
    this._context = t;
  }
  async loadHistory(t, i, n = {}) {
    const o = ++this._loadCommitId, r = n.scopeKey ?? "all", a = `${t}:${i}:${r}:${n.numericSteps ?? 0}`;
    if (this._cache.has(a)) {
      if (o === this._loadCommitId) {
        const h = this._cache.get(a);
        this._events = h, this._eventsByEntity = this._groupEventsByEntity(h);
      }
      return;
    }
    const s = n.hass ?? this._context?.hass, l = n.watched ?? this._context?.watched, p = (s && Array.isArray(l) ? await this._loadFromHass(s, t, i, l) : await this._loader(t, i, { ...this._context, ...n, hass: s, watched: l })).slice().sort((h, u) => h.timestamp - u.timestamp).map((h) => ({
      ...h,
      attributes: h.attributes ?? {}
    })), d = Bc(p, { numericSteps: n.numericSteps });
    if (o === this._loadCommitId) {
      if (this._cache.set(a, d), this._cache.size > this._maxCacheEntries) {
        const h = this._cache.keys().next().value;
        h && this._cache.delete(h);
      }
      this._events = d, this._eventsByEntity = this._groupEventsByEntity(d);
    }
  }
  async loadFromHass(t, i, n, o) {
    return this._loadFromHass(t, i, n, o);
  }
  async _loadFromHass(t, i, n, o) {
    if (!o.length) return [];
    const r = t.callWS, a = t.callApi, s = new Date(i * 1e3).toISOString(), l = new Date(n * 1e3).toISOString(), c = new Set(o), p = {
      type: "history/history_during_period",
      start_time: s,
      end_time: l,
      minimal_response: !1,
      no_attributes: !1,
      significant_changes_only: !1,
      entity_ids: o
    };
    let d;
    if (typeof r == "function")
      try {
        d = await r(p);
      } catch (h) {
        console.warn("[easy-floorplan] Replay WS history query failed", { startTime: s, endTime: l, watchedCount: o.length, error: h });
      }
    if (!d && typeof a == "function")
      try {
        d = await a("GET", `history/period/${encodeURIComponent(s)}`, {
          end_time: l,
          filter_entity_id: o.join(","),
          minimal_response: !1,
          no_attributes: !1,
          significant_changes_only: !1
        });
      } catch (h) {
        console.warn("[easy-floorplan] Replay REST history query failed", { startTime: s, endTime: l, watchedCount: o.length, error: h });
      }
    if (!d)
      throw new Error(`Unable to load history via websocket or REST API (ws:${typeof r == "function" ? "yes" : "no"}, api:${typeof a == "function" ? "yes" : "no"}).`);
    return this._normalizeHistoryPayload(d, i, n, c);
  }
  _normalizeHistoryPayload(t, i, n, o) {
    const r = /* @__PURE__ */ new Map(), a = (h, u) => {
      if (typeof h == "number")
        return Number.isFinite(h) ? h > 1e12 ? h / 1e3 : h : Number.NaN;
      if (typeof h == "string") {
        const f = Number(h);
        if (Number.isFinite(f)) return f > 1e12 ? f / 1e3 : f;
        const g = Date.parse(h) / 1e3;
        return Number.isFinite(g) ? g : Number.NaN;
      }
      return Date.parse(u) / 1e3;
    }, s = (h, u) => {
      for (const f of u) {
        const g = h[f];
        if (g !== void 0) return g;
      }
    }, l = (h, u) => {
      const f = u.filter((g) => !!g && typeof g == "object");
      f.length && r.set(h, f.map((g) => {
        const y = s(g, ["state", "s"]), b = s(g, ["attributes", "a"]), k = s(g, ["last_updated", "lu"]), S = s(g, ["last_changed", "lc"]);
        return {
          state: typeof y == "string" || typeof y == "number" || typeof y == "boolean" ? String(y) : void 0,
          attributes: b && typeof b == "object" ? b : void 0,
          last_updated: typeof k == "string" || typeof k == "number" ? k : void 0,
          last_changed: typeof S == "string" || typeof S == "number" ? S : void 0
        };
      }));
    };
    if (Array.isArray(t))
      for (const h of t) {
        if (!h || typeof h != "object") continue;
        const u = h, f = typeof u.entity_id == "string" ? u.entity_id : void 0, g = Array.isArray(u.states) ? u.states : Array.isArray(u.history) ? u.history : [];
        f && g.length && l(f, g);
      }
    else if (t && typeof t == "object")
      for (const [h, u] of Object.entries(t)) {
        if (Array.isArray(u) && u.length) {
          l(h, u);
          continue;
        }
        if (u && typeof u == "object") {
          const f = u;
          Array.isArray(f.states) && f.states.length && l(h, f.states);
        }
      }
    if (!r.size)
      throw new Error("History payload contained no parseable state rows.");
    const c = [], p = new Date(n * 1e3).toISOString();
    for (const [h, u] of r.entries())
      if (u.length && o.has(h)) {
        if (u.length === 1) {
          const f = u[0], g = a(f.last_updated ?? f.last_changed, p);
          if (!Number.isFinite(g) || g < i || g > n)
            continue;
          c.push({
            timestamp: g,
            entityId: h,
            oldState: f.state ?? "unknown",
            newState: f.state ?? "unknown",
            attributes: f.attributes ?? {}
          });
          continue;
        }
        for (let f = 1; f < u.length; f += 1) {
          const g = u[f - 1], y = u[f], b = a(g.last_updated ?? g.last_changed, p), k = a(y.last_updated ?? y.last_changed, p);
          if (!Number.isFinite(b) || !Number.isFinite(k) || k < i || b > n)
            continue;
          const S = g.state !== y.state, x = !this._attributesEqual(g.attributes ?? {}, y.attributes ?? {});
          !S && !x || c.push({
            timestamp: k,
            entityId: h,
            oldState: g.state ?? "unknown",
            newState: y.state ?? "unknown",
            attributes: {
              ...g.attributes ?? {},
              ...y.attributes ?? {}
            }
          });
        }
      }
    return c.sort((h, u) => h.timestamp - u.timestamp);
  }
  _attributesEqual(t, i) {
    if (t === i) return !0;
    if (!t || !i) return !t && !i;
    if (typeof t != typeof i) return !1;
    if (Array.isArray(t) || Array.isArray(i)) {
      if (!Array.isArray(t) || !Array.isArray(i) || t.length !== i.length) return !1;
      for (let s = 0; s < t.length; s += 1)
        if (!this._attributesEqual(t[s], i[s])) return !1;
      return !0;
    }
    if (typeof t != "object") return !1;
    const n = t, o = i, r = Object.keys(n), a = Object.keys(o);
    if (r.length !== a.length) return !1;
    for (const s of r)
      if (!(s in o) || !this._attributesEqual(n[s], o[s])) return !1;
    return !0;
  }
  clearCache() {
    this._loadCommitId += 1, this._cache.clear(), this._events = [], this._eventsByEntity.clear();
  }
  getStateAt(t) {
    const i = /* @__PURE__ */ new Map();
    for (const [n, o] of this._eventsByEntity.entries()) {
      const r = this._findLastEventAtOrBefore(o, t);
      if (r) {
        i.set(n, this._toHassEntity(n, r.newState, r.attributes, r.timestamp));
        continue;
      }
      const a = o[0];
      a && i.set(n, this._toHassEntity(n, a.oldState, a.attributes, 0));
    }
    return i;
  }
  _groupEventsByEntity(t) {
    const i = /* @__PURE__ */ new Map();
    for (const n of t) {
      const o = i.get(n.entityId) ?? [];
      o.push(n), i.set(n.entityId, o);
    }
    for (const n of i.values())
      n.sort((o, r) => o.timestamp - r.timestamp);
    return i;
  }
  _findLastEventAtOrBefore(t, i) {
    let n = 0, o = t.length - 1, r;
    for (; n <= o; ) {
      const a = n + o >> 1, s = t[a];
      s.timestamp <= i ? (r = s, n = a + 1) : o = a - 1;
    }
    return r;
  }
  _toHassEntity(t, i, n, o) {
    const r = Number.isFinite(o) ? o : Date.now() / 1e3;
    return {
      entity_id: t,
      state: i,
      attributes: n ?? {},
      last_changed: new Date(r * 1e3).toISOString(),
      last_updated: new Date(r * 1e3).toISOString(),
      context: { id: "history", parent_id: null, user_id: null }
    };
  }
  getEvents() {
    return this._events.slice();
  }
  getEventBefore(t) {
    if (!this._events.length) return;
    let i = 0, n = this._events.length - 1, o = -1;
    for (; i <= n; ) {
      const r = i + n >> 1;
      this._events[r].timestamp <= t ? (o = r, i = r + 1) : n = r - 1;
    }
    return o >= 0 ? this._events[o] : void 0;
  }
  getEventAfter(t) {
    if (!this._events.length) return;
    let i = 0, n = this._events.length - 1, o = this._events.length;
    for (; i <= n; ) {
      const r = i + n >> 1;
      this._events[r].timestamp >= t ? (o = r, n = r - 1) : i = r + 1;
    }
    return o < this._events.length ? this._events[o] : void 0;
  }
}
var qc = Object.defineProperty, Gc = Object.getOwnPropertyDescriptor, dt = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Gc(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && qc(t, i, o), o;
};
let _e = class extends Ue {
  constructor() {
    super(...arguments), this.events = [], this.startTime = 0, this.endTime = 0, this.currentTime = 0, this.expanded = !1, this._dragging = !1, this._hidden = /* @__PURE__ */ new Set();
  }
  _toggleLane(e) {
    const t = new Set(this._hidden);
    t.delete(e) || t.add(e), this._hidden = t;
  }
  _showAllLanes() {
    this._hidden = /* @__PURE__ */ new Set();
  }
  _seek(e) {
    this.dispatchEvent(new CustomEvent("seek", { detail: { timestamp: e }, bubbles: !0, composed: !0 }));
  }
  _formatTimestamp(e) {
    return Number.isFinite(e) ? new Intl.DateTimeFormat(void 0, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(e * 1e3)) : "—";
  }
  _getMarkerLeft(e) {
    return `${(e - this.startTime) / Math.max(1, this.endTime - this.startTime) * 100}%`;
  }
  /**
   * Keep markers visually centered while preventing edge overflow that can
   * trigger horizontal scrollbars in tight containers.
   */
  _getMarkerLeftClamped(e, t) {
    const i = this._getMarkerLeft(e);
    return `clamp(${t}px, ${i}, calc(100% - ${t}px))`;
  }
  /** This timestamp as a 0-100 position in the window, unitless for calc(). */
  _pct(e) {
    return (e - this.startTime) / Math.max(1, this.endTime - this.startTime) * 100;
  }
  _markerStyle(e, t = "0px") {
    const i = Yt(e), n = `left:${this._getMarkerLeftClamped(e.timestamp, 7)};--stack-offset:${t};--marker-pct:${this._pct(e.timestamp)};`;
    return i ? `${n}background:${i};box-shadow:0 0 0 2px ${i}22;` : n;
  }
  _formatEventTitle(e) {
    return `${this._formatTimestamp(e.timestamp)} · ${e.entityId}: ${e.oldState} → ${e.newState}`;
  }
  _formatClusterTitle(e) {
    return e.map((t) => this._formatEventTitle(t)).join(`
`);
  }
  _visibleEvents() {
    if (!this.events.length) return [];
    const e = this.startTime, t = this.endTime;
    return this.events.filter((i) => i.timestamp >= e && i.timestamp <= t);
  }
  /**
   * The events this timeline draws — every discrete state change, and the
   * largest moves of each numeric sensor up to what a lane can show. Replay
   * itself still reads the full series; this only decides what gets a marker.
   */
  /** Each entity's lane, display-thinned. Hidden lanes are still in here, so
   *  the expanded view can keep their label on screen to switch back on. */
  _laneSeries() {
    const e = /* @__PURE__ */ new Map();
    for (const t of this._visibleEvents()) {
      const i = e.get(t.entityId);
      i ? i.push(t) : e.set(t.entityId, [t]);
    }
    for (const [t, i] of e)
      e.set(t, Uc(i, _e.MAX_MARKERS_PER_LANE));
    return e;
  }
  /**
   * What the summary bar draws: every lane that is switched on. Hiding a lane
   * takes its events out of here too, which is the point — a summary that
   * still counted a lane you had switched off would not be a summary of what
   * you are looking at.
   */
  _drawnEvents() {
    const e = [];
    for (const [t, i] of this._laneSeries())
      this._hidden.has(t) || e.push(...i);
    return e.sort((t, i) => t.timestamp - i.timestamp);
  }
  _groupEventsByTimestamp() {
    const e = this._drawnEvents(), t = /* @__PURE__ */ new Map();
    for (const i of e) {
      const n = t.get(i.timestamp);
      n ? n.push(i) : t.set(i.timestamp, [i]);
    }
    return Array.from(t.entries()).map(([i, n]) => ({
      timestamp: i,
      events: n,
      left: this._getMarkerLeft(i)
    }));
  }
  _getEntityLabel(e) {
    const t = e.attributes ?? {};
    return ((typeof t.friendly_name == "string" ? t.friendly_name : void 0)?.trim() || e.entityId).replace(/^./, (o) => o.toUpperCase());
  }
  _seekFromClientX(e) {
    const t = this.expanded ? ".timeline-track-overlay" : ".timeline", i = this.shadowRoot?.querySelector(t)?.getBoundingClientRect();
    if (!i) return;
    const n = Math.max(1, this.endTime - this.startTime), o = Math.min(1, Math.max(0, (e - i.left) / i.width)), r = Math.round(this.startTime + o * n);
    this._seek(r);
  }
  _handleTimelineClick(e) {
    this._seekFromClientX(e.clientX);
  }
  _handleKeyDown(e) {
    const t = Math.max(1, this.endTime - this.startTime), i = Math.max(1, Math.round(t / 100));
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        this._seek(Math.max(this.startTime, this.currentTime - i)), e.preventDefault();
        break;
      case "ArrowRight":
      case "ArrowUp":
        this._seek(Math.min(this.endTime, this.currentTime + i)), e.preventDefault();
        break;
      case "Home":
        this._seek(this.startTime), e.preventDefault();
        break;
      case "End":
        this._seek(this.endTime), e.preventDefault();
        break;
    }
  }
  /**
   * The way back. Switching a lane off in the expanded view and then
   * collapsing would otherwise strand it: the summary bar has no labels to
   * click, so nothing on screen would say anything was missing.
   */
  _renderHiddenNotice() {
    if (!this._hidden.size) return m;
    const e = this._hidden.size;
    return v`
      <div class="lanes-hidden">
        <span>${e} lane${e === 1 ? "" : "s"} hidden</span>
        <button class="lanes-hidden-show" @click=${() => this._showAllLanes()}>Show all</button>
      </div>
    `;
  }
  _renderExpandedTimeline(e) {
    const t = this._laneSeries(), i = Array.from(t.keys()), n = (this.currentTime - this.startTime) / e * 100;
    return v`
      <div
        class="timeline-expanded timeline-interactive"
        style="--playhead-pct:${this._pct(this.currentTime)}"
        role="slider"
        tabindex="0"
        aria-label="Replay timeline"
        aria-valuemin=${this.startTime}
        aria-valuemax=${this.endTime}
        aria-valuenow=${this.currentTime}
        aria-valuetext=${this._formatTimestamp(this.currentTime)}
        @click=${(o) => this._handleTimelineClick(o)}
        @pointerdown=${(o) => this._handlePointerDown(o)}
        @pointermove=${(o) => this._handlePointerMove(o)}
        @pointerup=${(o) => this._handlePointerUp(o)}
        @pointerleave=${(o) => this._handlePointerUp(o)}
        @keydown=${this._handleKeyDown}
      >
        <div class="timeline-track-overlay" style="grid-row:1 / span ${i.length};" aria-hidden="true">
          <div class="playhead playhead-expanded" style="left:${n}%">
            <span class="playhead-time">${this._formatTimestamp(this.currentTime)}</span>
          </div>
        </div>
        ${ur([this.events, this.startTime, this.endTime, this._hidden], () => i.map((o, r) => {
      const a = t.get(o) ?? [], s = r + 1, l = this._getEntityLabel(a[0]), c = this._hidden.has(o);
      return v`
            <button
              class="lane-label ${c ? "lane-off" : ""}"
              style="grid-row:${s};"
              aria-pressed=${c ? "false" : "true"}
              title=${c ? `Show ${l} on the timeline` : `Hide ${l} from the timeline`}
              @click=${(p) => {
        p.stopPropagation(), this._toggleLane(o);
      }}
            ><span class="lane-dot" aria-hidden="true"></span><span class="lane-name">${l}</span></button>
            <div class="lane lane-track ${c ? "lane-off" : ""}" style="grid-row:${s};">
              ${(c ? [] : a).map((p) => {
        const d = Yt(p), h = this._getMarkerLeftClamped(p.timestamp, 4);
        return v`
                  <button
                    class="marker"
                    style=${`left:${h};--marker-pct:${this._pct(p.timestamp)};${d ? `background:${d};box-shadow:0 0 0 2px ${d}22;` : ""}`}
                    title=${this._formatEventTitle(p)}
                    @click=${(u) => {
          u.stopPropagation(), this._seek(p.timestamp);
        }}
                  ></button>
                `;
      })}
            </div>
          `;
    }))}
      </div>
    `;
  }
  _handlePointerDown(e) {
    this._dragging = !0, this._updateFromPointer(e);
  }
  _handlePointerMove(e) {
    this._dragging && this._updateFromPointer(e);
  }
  _handlePointerUp(e) {
    this._dragging && (this._dragging = !1, this._updateFromPointer(e));
  }
  _updateFromPointer(e) {
    this._seekFromClientX(e.clientX);
  }
  render() {
    if (!this.events.length)
      return v`<div class="timeline-empty">No history available.</div>`;
    const e = Math.max(1, this.endTime - this.startTime);
    return this.expanded ? v`${this._renderHiddenNotice()}${this._renderExpandedTimeline(e)}` : v`
      ${this._renderHiddenNotice()}
      <div
        class="timeline timeline-interactive"
        style="--playhead-pct:${this._pct(this.currentTime)}"
        role="slider"
        tabindex="0"
        aria-label="Replay timeline"
        aria-valuemin=${this.startTime}
        aria-valuemax=${this.endTime}
        aria-valuenow=${this.currentTime}
        aria-valuetext=${this._formatTimestamp(this.currentTime)}
        @click=${(t) => this._handleTimelineClick(t)}
        @pointerdown=${(t) => this._handlePointerDown(t)}
        @pointermove=${(t) => this._handlePointerMove(t)}
        @pointerup=${(t) => this._handlePointerUp(t)}
        @pointerleave=${(t) => this._handlePointerUp(t)}
        @keydown=${this._handleKeyDown}
      >
        <div class="track"></div>
        <div class="playhead" style="left:${this._pct(this.currentTime)}%">
          <span class="playhead-time">${this._formatTimestamp(this.currentTime)}</span>
        </div>
        ${ur([this.events, this.startTime, this.endTime], () => this._groupEventsByTimestamp().map((t) => v`
          <div
            class="marker-cluster"
            style="left:${this._getMarkerLeftClamped(t.timestamp, 7)};--marker-pct:${this._pct(t.timestamp)};"
            title=${this._formatClusterTitle(t.events)}
            @click=${(i) => {
      i.stopPropagation(), this._seek(t.timestamp);
    }}
          >
            ${t.events.map((i, n) => {
      const o = n === 0 ? "-2px" : n === 1 ? "2px" : n === 2 ? "-4px" : "4px";
      return v`
                <button
                  class="marker"
                  style=${this._markerStyle(i, o)}
                  title=${this._formatEventTitle(i)}
                  @click=${(r) => {
        r.stopPropagation(), this._seek(i.timestamp);
      }}
                ></button>
              `;
    })}
          </div>
        `))}
      </div>
    `;
  }
};
_e.MAX_MARKERS_PER_LANE = 150;
_e.styles = Re`
    :host { display: block; }
    .timeline { position: relative; height: 24px; margin: 8px 0; cursor: pointer; }
    .timeline-expanded {
      position: relative;
      display: grid;
      grid-template-columns: minmax(90px, 140px) 1fr;
      column-gap: 8px;
      row-gap: 6px;
      margin: 8px 0;
      cursor: pointer;
      align-items: center;
    }
    .timeline-track-overlay {
      grid-column: 2;
      grid-row: 1 / -1;
      position: relative;
      align-self: stretch;
      pointer-events: none;
      z-index: 0;
    }
    .timeline-interactive { touch-action: none; }
    .lane {
      position: relative;
      z-index: 1;
      grid-column: 2;
      width: 100%;
      min-width: 0;
    }
    /*
     * The lane label is the switch for its lane, so it has to look like one
     * before it is hovered: a button box, a pointer cursor, and a dot standing
     * in for the lane's markers that fills when the lane is on and hollows out
     * when it is off. Discoverability is the whole point — a bare text label
     * that happens to be clickable is not discoverable.
     */
    .lane-label {
      grid-column: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      font: inherit;
      font-size: 11px;
      text-align: left;
      color: var(--secondary-text-color, #666);
      background: none;
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 1px 4px;
      margin: 0;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      min-width: 0;
    }
    .lane-name {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .lane-dot {
      flex: none;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      border: 1px solid currentColor;
      background: currentColor;
    }
    .lane-label:hover,
    .lane-label:focus-visible {
      color: var(--primary-text-color);
      border-color: var(--divider-color, #ccc);
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    }
    /* Switched off: the row stays, so there is something to click to get it
       back, but it reads as absent rather than empty. */
    .lane-label.lane-off {
      opacity: 0.55;
      text-decoration: line-through;
    }
    .lane-label.lane-off .lane-dot {
      background: transparent;
    }
    .lane-track.lane-off {
      opacity: 0.35;
    }
    .lanes-hidden {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      font-size: 11px;
      color: var(--secondary-text-color, #666);
    }
    .lanes-hidden-show {
      font: inherit;
      cursor: pointer;
      padding: 1px 6px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .lane-track {
      position: relative;
      height: 14px;
      border-radius: 999px;
      background: var(--divider-color, #ddd);
    }
    .track { position: absolute; inset: 0; border-radius: 999px; background: var(--divider-color, #ddd); }
    .playhead { position: absolute; top: -2px; width: 2px; height: calc(100% + 4px); background: ${Li(Q)}; }
    .playhead-expanded { top: 0; bottom: 0; height: auto; transform: translateX(-50%); }
    /*
     * The clock rides the playhead rather than sitting in the header: while a
     * replay runs this is the only part of the card the eye is on, and a time
     * three inches away from it does not read as "where we are now".
     */
    .playhead-time {
      position: absolute;
      bottom: calc(100% + 4px);
      left: 50%;
      transform: translateX(-50%);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      pointer-events: none;
      background: ${Li(Q)};
      color: var(--fp-skin-accent-ink, var(--text-primary-color, #fff));
    }
    .marker-cluster {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 14px;
      height: 20px;
      cursor: pointer;
      pointer-events: auto;
    }
    .marker {
      position: absolute;
      left: 50%;
      top: calc(50% + var(--stack-offset, 0px));
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: none;
      background: var(--divider-color, #bbb);
      padding: 0;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
    }
    /*
     * "Passed" — a marker the playhead has already crossed — used to be a class
     * written per marker, which meant every one of them re-rendered on every
     * frame of playback: 8,000 nodes rebuilt 20 times a second. Both numbers
     * are now plain custom properties, so the whole effect is one variable
     * written on the container and the markers themselves never change.
     *
     * clamp() is doing the comparison: the difference is scaled far past 1, so
     * it saturates to exactly 1 when the playhead is ahead of the marker and 0
     * when it is behind — a step function built out of arithmetic, because CSS
     * has no way to ask whether one length is greater than another.
     */
    .marker,
    .marker-cluster {
      --passed: clamp(0, (var(--playhead-pct, 0) - var(--marker-pct, 0) + 0.000001) * 1000000, 1);
    }
    .marker {
      transform: translate(-50%, -50%) scale(calc(1 + 0.2 * var(--passed)));
    }
    .timeline-empty { font-size: 12px; color: var(--secondary-text-color, #666); }
  `;
dt([
  G({ attribute: !1 })
], _e.prototype, "events", 2);
dt([
  G({ type: Number })
], _e.prototype, "startTime", 2);
dt([
  G({ type: Number })
], _e.prototype, "endTime", 2);
dt([
  G({ type: Number })
], _e.prototype, "currentTime", 2);
dt([
  G({ type: Boolean })
], _e.prototype, "expanded", 2);
dt([
  F()
], _e.prototype, "_hidden", 2);
_e = dt([
  rn("easy-floorplan-history-timeline")
], _e);
function ie(e) {
  return e.type === "skylight";
}
function xe(e) {
  return e.type === "passage";
}
const ze = ["top", "right", "bottom", "left"];
function fr(e) {
  return !!e?.haArea && (e.filterEntities ?? !0);
}
const at = -6, Wn = 6, xo = 0.45, Hi = 1, es = "scale", ts = "dim", mr = 0.92, gr = 80, yr = 260, Bn = 0.25, Un = 4, is = 10, Vn = 1, _o = 14, Kc = 3, cn = 140, $o = 4, br = 160, ns = "var(--fp-skin-glow, #ffd9a0)", vr = 0.18, Ni = 0.6, wr = 0.5, xr = 0.45, Xc = 0.5, ko = 14, je = 34, vt = 34, jt = 16, dn = 80, hn = 0, pn = 360, os = "var(--fp-skin-furniture, #9e9e9e)", be = 1e3, we = 600, So = 20, _r = 50;
function Yc(e, t) {
  return e ?? t;
}
function $r(e, t) {
  return t <= 0 ? 100 : Math.round(e / t * 100);
}
function Cn(e, t) {
  return Math.max(1, Math.round(t * e / 100));
}
function kr(e) {
  const t = e?.floors;
  return !t || typeof t != "object" ? [] : Object.values(t).filter((i) => !!i && typeof i.floor_id == "string" && typeof i.name == "string").sort((i, n) => (i.level ?? 0) - (n.level ?? 0) || i.name.localeCompare(n.name));
}
function Zc(e) {
  const t = e?.areas;
  return !t || typeof t != "object" ? [] : Object.values(t).filter((i) => !!i && typeof i.area_id == "string" && typeof i.name == "string").sort((i, n) => i.name.localeCompare(n.name));
}
function Qc(e, t) {
  if (!("name" in e)) return e;
  const i = (e.name ?? "").toString().trim(), n = Jc(t, i);
  return { ...e, name: n ? n.name : i || void 0, haArea: n?.area_id };
}
function Jc(e, t) {
  const i = (t ?? "").trim();
  if (!i) return;
  const n = e.find((s) => s.name === i);
  if (n) return n;
  const o = i.toLowerCase(), r = e.find((s) => s.name.toLowerCase() === o);
  if (r) return r;
  const a = o.replace(/\s+/g, " ");
  return e.find((s) => s.name.trim().toLowerCase().replace(/\s+/g, " ") === a);
}
function ed(e, t) {
  const i = e, n = i?.entities?.[t];
  return n ? n.area_id ? n.area_id : (n.device_id ? i?.devices?.[n.device_id] : void 0)?.area_id ?? void 0 : void 0;
}
function In(e, t) {
  const n = e?.entities;
  return !n || typeof n != "object" ? [] : Object.keys(n).filter((o) => ed(e, o) === t);
}
function td(e) {
  return {
    type: e,
    width: be,
    height: we,
    grid: So,
    walls: [],
    openings: [],
    items: [],
    texts: [],
    furniture: [],
    trackers: [],
    areas: []
  };
}
function id() {
  return { overlayScale: "plan", showViewControls: !0 };
}
function ae(e) {
  return `${e}_${Math.random().toString(36).slice(2, 9)}`;
}
function qn(e, t) {
  if (e === t) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return !Array.isArray(e) || !Array.isArray(t) || e.length !== t.length ? !1 : e.every((o, r) => qn(o, t[r]));
  if (typeof e != "object" || typeof t != "object" || e === null || t === null) return !1;
  const i = e, n = t;
  for (const o of /* @__PURE__ */ new Set([...Object.keys(i), ...Object.keys(n)]))
    if (!qn(i[o], n[o])) return !1;
  return !0;
}
function nd(e, t = []) {
  return {
    id: ae("floor"),
    name: e,
    walls: t,
    openings: [],
    items: [],
    texts: [],
    furniture: [],
    trackers: [],
    areas: []
  };
}
function od(e) {
  return {
    ...e,
    walls: e.walls ?? [],
    openings: e.openings ?? [],
    items: e.items ?? [],
    texts: e.texts ?? [],
    furniture: e.furniture ?? [],
    trackers: e.trackers ?? [],
    areas: e.areas ?? []
  };
}
function rd(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((i, n) => {
    let o = i.id || `floor_${n + 1}`;
    for (; t.has(o); ) o = `${o}_${n + 1}`;
    return t.add(o), o === i.id ? i : { ...i, id: o };
  });
}
function ad(e, t, i) {
  const n = e.findIndex((s) => s.id === t), o = n + i;
  if (n < 0 || o < 0 || o >= e.length) return null;
  const r = [...e], [a] = r.splice(n, 1);
  return r.splice(o, 0, a), r;
}
function Ce(e) {
  return e.floors && e.floors.length ? rd(e.floors.map(od)) : [
    {
      id: "floor_main",
      name: "Floor 1",
      walls: e.walls ?? [],
      openings: e.openings ?? [],
      items: e.items ?? [],
      texts: e.texts ?? [],
      furniture: e.furniture ?? [],
      trackers: e.trackers ?? [],
      areas: e.areas ?? []
    }
  ];
}
function ji(e, t) {
  if (!t) return null;
  const i = e?.[t.entity]?.state;
  if (i == null || i === "unavailable" || i === "unknown") return !1;
  const n = i === "on" || i === "open" || i === "home" || i === "detected";
  return t.invert ? !n : n;
}
function Sr(e, t) {
  if (!e || t == null || !Number.isFinite(t)) return null;
  const i = e.max - e.min;
  if (i === 0) return null;
  const n = (t - e.min) / i, o = Math.max(0, Math.min(1, n));
  return e.invert ? 1 - o : o;
}
const rs = 500, Mr = {
  now: () => performance.now(),
  request: (e) => requestAnimationFrame(e),
  cancel: (e) => cancelAnimationFrame(e)
};
function as(e) {
  if (!(e > 0)) return 0;
  if (e >= 1) return 1;
  const t = 0.25, i = 0.1, n = 0.25, o = 1, r = (p, d, h) => ((1 - p) * (1 - p) * 3 * d + (1 - p) * p * 3 * h + p * p) * p, a = (p, d, h) => 3 * (1 - p) * (1 - p) * d + 6 * (1 - p) * p * (h - d) + 3 * p * p * (1 - h);
  let s = 0, l = 1, c = e;
  for (let p = 0; p < 8; p++) {
    const d = r(c, t, n) - e;
    if (Math.abs(d) < 1e-6) break;
    d > 0 ? l = c : s = c;
    const h = a(c, t, n), u = h > 1e-6 ? c - d / h : (s + l) / 2;
    c = u > s && u < l ? u : (s + l) / 2;
  }
  return r(c, i, o);
}
class sd {
  constructor(t, i, n = rs) {
    this.frames = t, this.onFrame = i, this._travels = /* @__PURE__ */ new Map(), this._handle = null, this._duration = n;
  }
  /** Zero animates nothing, which is what prefers-reduced-motion asks for. */
  setDuration(t) {
    this._duration = Math.max(0, t);
  }
  /**
   * What to draw for `key` right now, easing toward `target` and asking for
   * another frame while it has not arrived.
   *
   * A key seen for the first time takes its target outright: a card that has
   * just loaded shows the house as it is, rather than playing every door open
   * at once.
   */
  value(t, i) {
    const n = this.frames.now(), o = this._travels.get(t);
    if (!o)
      return this._travels.set(t, { from: i, to: i, start: n }), i;
    o.to !== i && (o.from = this._at(o, n), o.to = i, o.start = n);
    const r = this._at(o, n);
    return r !== o.to && this._schedule(), r;
  }
  /** Stop asking for frames — the card is going away, or the view is flat. */
  stop() {
    this._handle !== null && this.frames.cancel(this._handle), this._handle = null;
  }
  /** True while at least one panel is still travelling. */
  get running() {
    return this._handle !== null;
  }
  _at(t, i) {
    if (this._duration <= 0) return t.to;
    const n = i - t.start;
    return n > 0 ? n >= this._duration ? t.to : t.from + (t.to - t.from) * as(n / this._duration) : t.from;
  }
  _schedule() {
    this._handle === null && (this._handle = this.frames.request(() => {
      this._handle = null, this.onFrame();
    }));
  }
}
function un(e) {
  const t = (e % 360 + 360) % 360;
  switch (t) {
    case 0:
      return { cos: 1, sin: 0 };
    case 90:
      return { cos: 0, sin: 1 };
    case 180:
      return { cos: -1, sin: 0 };
    case 270:
      return { cos: 0, sin: -1 };
    default:
      return { cos: Math.cos(t * Math.PI / 180), sin: Math.sin(t * Math.PI / 180) };
  }
}
const Er = 450, Pn = (e) => (e % 360 + 360) % 360;
class ld {
  constructor(t, i) {
    this.frames = t, this.changed = i, this._value = 0, this._from = 0, this._target = 0, this._start = 0, this._duration = Er;
  }
  get value() {
    return this._value;
  }
  get target() {
    return Pn(this._target);
  }
  get running() {
    return this._handle !== void 0;
  }
  turn(t, i) {
    const n = this.frames.now();
    this._sample(n);
    const o = this._target + t;
    if (!i) {
      this.jump(o);
      return;
    }
    if (this._from = this._value, this._target = o, this._start = n, this._duration = Er * Math.min(2, Math.abs(o - this._from) / 90), this._duration === 0) {
      this.finish();
      return;
    }
    this._schedule(), this.changed();
  }
  /** Reset, reduced motion, a changed projection or teardown cancels the RAF. */
  jump(t) {
    this._handle !== void 0 && this.frames.cancel(this._handle), this._handle = void 0, this._value = this._from = this._target = Pn(t), this.changed();
  }
  finish() {
    this.jump(this._target);
  }
  _sample(t) {
    if (!this.running) return;
    const i = Math.min(1, Math.max(0, (t - this._start) / this._duration));
    this._value = this._from + (this._target - this._from) * as(i);
  }
  _schedule() {
    this._handle === void 0 && (this._handle = this.frames.request(() => {
      this._sample(this.frames.now()), this._handle = void 0, this.frames.now() - this._start >= this._duration ? this._value = this._from = this._target = Pn(this._target) : this._schedule(), this.changed();
    }));
  }
}
const cd = "airHandler", dd = "air handler", hd = "utility", pd = [
  "hvac",
  "ahu",
  "furnace",
  "ventilation"
], ud = {
  w: 60,
  h: 56
}, fd = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 7.142857
  },
  {
    line: [
      8,
      8,
      92,
      92
    ],
    role: "detail",
    opacity: 0.8
  },
  {
    line: [
      8,
      92,
      92,
      8
    ],
    role: "detail",
    opacity: 0.8
  }
], md = {
  id: cd,
  name: dd,
  category: hd,
  keywords: pd,
  size: ud,
  parts: fd
}, gd = "bathtub", yd = "bathtub", bd = "bath", vd = [
  "bath",
  "tub"
], wd = {
  w: 150,
  h: 76
}, xd = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 5.263158
  },
  {
    rect: [
      6,
      12,
      88,
      76
    ],
    rx: 12,
    role: "line"
  },
  {
    circle: [
      14,
      50,
      5.5
    ],
    role: "thin"
  }
], _d = {
  id: gd,
  name: yd,
  category: bd,
  keywords: vd,
  size: wd,
  parts: xd
}, $d = "bed", kd = "bed", Sd = "bedroom", Md = [
  "double",
  "mattress",
  "sleep"
], Ed = {
  w: 150,
  h: 200
}, Ad = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 2.666667
  },
  {
    line: [
      0,
      26,
      100,
      26
    ],
    role: "line"
  },
  {
    rect: [
      10,
      6,
      34,
      14
    ],
    rx: 2,
    role: "thin"
  },
  {
    rect: [
      56,
      6,
      34,
      14
    ],
    rx: 2,
    role: "thin"
  }
], Td = {
  id: $d,
  name: kd,
  category: Sd,
  keywords: Md,
  size: Ed,
  parts: Ad
}, Cd = "bookcase", Id = "bookcase", Pd = "living", zd = [
  "bookshelf",
  "books",
  "shelving",
  "shelves",
  "billy",
  "library",
  "reol",
  "bogreol"
], Od = {
  w: 80,
  h: 40
}, Ld = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    role: "body"
  },
  {
    rect: [
      7,
      6,
      86,
      88
    ],
    role: "line"
  },
  {
    repeat: 2,
    step: [
      0,
      30
    ],
    part: {
      line: [
        7,
        34,
        93,
        34
      ]
    }
  },
  {
    repeat: 3,
    step: [
      13,
      0
    ],
    part: {
      rect: [
        13,
        12,
        10,
        22
      ],
      role: "thin"
    }
  },
  {
    polygon: [
      [
        61,
        15
      ],
      [
        70,
        12
      ],
      [
        82,
        31
      ],
      [
        73,
        34
      ]
    ],
    role: "thin"
  },
  {
    repeat: 3,
    step: [
      13,
      0
    ],
    part: {
      rect: [
        48,
        41,
        10,
        23
      ],
      role: "thin"
    }
  },
  {
    rect: [
      14,
      83,
      34,
      11
    ],
    role: "thin"
  },
  {
    line: [
      14,
      88,
      48,
      88
    ],
    role: "detail"
  },
  {
    rect: [
      66,
      72,
      13,
      22
    ],
    role: "thin"
  }
], Fd = {
  id: Cd,
  name: Id,
  category: Pd,
  keywords: zd,
  size: Od,
  parts: Ld
}, Dd = "chair", Rd = "chair", Hd = "living", Nd = [
  "seat"
], jd = {
  w: 44,
  h: 44
}, Wd = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 9.090909
  },
  {
    line: [
      0,
      22,
      100,
      22
    ],
    role: "line"
  }
], Bd = {
  id: Dd,
  name: Rd,
  category: Hd,
  keywords: Nd,
  size: jd,
  parts: Wd
}, Ud = "cornerShowerCurved", Vd = "curved corner shower", qd = "bath", Gd = [
  "shower",
  "corner",
  "cubicle",
  "stall",
  "dusche",
  "glass",
  "enclosure",
  "bruseafskærmning"
], Kd = {
  w: 100,
  h: 100
}, Xd = [
  {
    path: [
      [
        "M",
        100,
        0
      ],
      [
        "L",
        100,
        100
      ],
      [
        "L",
        94,
        100
      ],
      [
        "C",
        47,
        105,
        -5,
        53,
        0,
        6
      ],
      [
        "L",
        0,
        0
      ],
      [
        "Z"
      ]
    ],
    role: "body"
  },
  {
    path: [
      [
        "M",
        6,
        8
      ],
      [
        "C",
        6,
        30,
        15,
        51,
        30,
        66
      ]
    ],
    role: "thin"
  },
  {
    path: [
      [
        "M",
        34,
        70
      ],
      [
        "C",
        50,
        85,
        71,
        94,
        92,
        94
      ]
    ],
    role: "thin"
  },
  {
    rect: [
      2,
      2,
      8,
      7
    ],
    role: "body"
  },
  {
    rect: [
      91,
      90,
      7,
      8
    ],
    role: "body"
  },
  {
    path: [
      [
        "M",
        26.301,
        61.587
      ],
      [
        "Q",
        27.29,
        60.743,
        28.939,
        60.52
      ],
      [
        "Q",
        28.27,
        59.119,
        26.993,
        58.237
      ],
      [
        "Q",
        26.511,
        59.83,
        25.522,
        60.674
      ],
      [
        "Z"
      ]
    ],
    role: "solid"
  },
  {
    path: [
      [
        "M",
        25.844,
        61.976
      ],
      [
        "Q",
        24.855,
        62.82,
        24.373,
        64.413
      ],
      [
        "Q",
        23.096,
        63.531,
        22.427,
        62.13
      ],
      [
        "Q",
        24.076,
        61.907,
        25.065,
        61.063
      ],
      [
        "Z"
      ]
    ],
    role: "solid"
  },
  {
    path: [
      [
        "M",
        39.6,
        74.462
      ],
      [
        "Q",
        40.42,
        73.453,
        42.001,
        72.934
      ],
      [
        "Q",
        41.089,
        71.678,
        39.672,
        71.043
      ],
      [
        "Q",
        39.488,
        72.697,
        38.668,
        73.706
      ],
      [
        "Z"
      ]
    ],
    role: "solid"
  },
  {
    path: [
      [
        "M",
        39.222,
        74.928
      ],
      [
        "Q",
        38.402,
        75.937,
        38.218,
        77.591
      ],
      [
        "Q",
        36.801,
        76.956,
        35.889,
        75.7
      ],
      [
        "Q",
        37.47,
        75.181,
        38.29,
        74.172
      ],
      [
        "Z"
      ]
    ],
    role: "solid"
  },
  {
    rect: [
      69,
      20,
      12,
      12
    ],
    rx: 1,
    role: "detail"
  },
  {
    repeat: 3,
    step: [
      3,
      0
    ],
    part: {
      line: [
        72,
        23,
        72,
        29
      ],
      role: "hint"
    }
  }
], Yd = {
  id: Ud,
  name: Vd,
  category: qd,
  keywords: Gd,
  size: Kd,
  parts: Xd
}, Zd = "desk", Qd = "desk", Jd = "living", eh = [
  "office",
  "workstation"
], th = {
  w: 120,
  h: 60
}, ih = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 6.666667
  },
  {
    line: [
      0,
      55,
      100,
      55
    ],
    role: "detail"
  }
], nh = {
  id: Zd,
  name: Qd,
  category: Jd,
  keywords: eh,
  size: th,
  parts: ih
}, oh = "dishwasher", rh = "dishwasher", ah = "kitchen", sh = [
  "dishes"
], lh = {
  w: 60,
  h: 60
}, ch = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 6.666667
  },
  {
    rect: [
      10,
      24,
      80,
      62
    ],
    rx: 5,
    role: "detail",
    opacity: 0.8
  },
  {
    line: [
      6,
      88,
      94,
      88
    ],
    role: "line"
  }
], dh = {
  id: oh,
  name: rh,
  category: ah,
  keywords: sh,
  size: lh,
  parts: ch
}, hh = "dresser", ph = "dresser", uh = "bedroom", fh = [
  "IKEA MALM",
  "chest of drawers",
  "low wide low & wide",
  "double dresser",
  "kommode",
  "lav bred",
  "skuffer",
  "154x50"
], mh = {
  w: 154,
  h: 50
}, gh = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    role: "body"
  },
  {
    line: [
      0,
      8,
      100,
      8
    ],
    role: "thin"
  },
  {
    line: [
      50,
      8,
      50,
      93
    ],
    role: "thin"
  },
  {
    repeat: 3,
    step: [
      0,
      28
    ],
    part: {
      rect: [
        2,
        11,
        46,
        24
      ],
      role: "thin"
    }
  },
  {
    repeat: 3,
    step: [
      0,
      28
    ],
    part: {
      rect: [
        52,
        11,
        46,
        24
      ],
      role: "thin"
    }
  },
  {
    line: [
      2,
      94,
      98,
      94
    ],
    role: "detail"
  }
], yh = {
  id: hh,
  name: ph,
  category: uh,
  keywords: fh,
  size: mh,
  parts: gh
}, bh = "dryer", vh = "dryer", wh = "utility", xh = [
  "tumble dryer",
  "laundry"
], _h = {
  w: 60,
  h: 62
}, $h = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 6.666667
  },
  {
    line: [
      6,
      18,
      94,
      18
    ],
    role: "detail"
  },
  {
    circle: [
      50,
      56,
      30
    ],
    role: "line"
  },
  {
    circle: [
      50,
      56,
      13.5
    ],
    role: "detail"
  }
], kh = {
  id: bh,
  name: vh,
  category: wh,
  keywords: xh,
  size: _h,
  parts: $h
}, Sh = "fishTank", Mh = "fish tank", Eh = "living", Ah = [
  "aquarium",
  "fish",
  "water"
], Th = {
  w: 100,
  h: 40
}, Ch = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 10
  },
  {
    rect: [
      5,
      12,
      90,
      76
    ],
    role: "hint"
  },
  {
    ellipse: [
      32,
      40,
      7,
      9
    ],
    role: "thin"
  },
  {
    path: [
      [
        "M",
        39,
        40
      ],
      [
        "L",
        44,
        32
      ],
      [
        "L",
        44,
        48
      ],
      [
        "Z"
      ]
    ],
    role: "solid"
  },
  {
    ellipse: [
      68,
      60,
      7,
      9
    ],
    role: "thin"
  },
  {
    path: [
      [
        "M",
        61,
        60
      ],
      [
        "L",
        56,
        52
      ],
      [
        "L",
        56,
        68
      ],
      [
        "Z"
      ]
    ],
    role: "solid"
  },
  {
    circle: [
      82,
      32,
      4
    ],
    role: "hint"
  }
], Ih = {
  id: Sh,
  name: Mh,
  category: Eh,
  keywords: Ah,
  size: Th,
  parts: Ch
}, Ph = "fridge", zh = "fridge", Oh = "kitchen", Lh = [
  "refrigerator",
  "freezer"
], Fh = {
  w: 60,
  h: 64
}, Dh = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 6.666667
  },
  {
    line: [
      0,
      40,
      100,
      40
    ],
    role: "line"
  },
  {
    line: [
      84,
      12,
      84,
      30
    ],
    role: "line"
  },
  {
    line: [
      84,
      50,
      84,
      84
    ],
    role: "line"
  }
], Rh = {
  id: Ph,
  name: zh,
  category: Oh,
  keywords: Lh,
  size: Fh,
  parts: Dh
}, Hh = "hotTub", Nh = "hot tub", jh = "bath", Wh = [
  "jacuzzi",
  "spa",
  "whirlpool"
], Bh = {
  w: 120,
  h: 120
}, Uh = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 3.333333
  },
  {
    circle: [
      50,
      50,
      36
    ],
    role: "line"
  },
  {
    circle: [
      27.68,
      27.68,
      5
    ],
    role: "hint",
    space: "square"
  },
  {
    circle: [
      72.32,
      27.68,
      5
    ],
    role: "hint",
    space: "square"
  },
  {
    circle: [
      27.68,
      72.32,
      5
    ],
    role: "hint",
    space: "square"
  },
  {
    circle: [
      72.32,
      72.32,
      5
    ],
    role: "hint",
    space: "square"
  }
], Vh = {
  id: Hh,
  name: Nh,
  category: jh,
  keywords: Wh,
  size: Bh,
  parts: Uh
}, qh = "indoorPalm", Gh = "indoor palm", Kh = "living", Xh = [
  "palm",
  "houseplant",
  "potted plant",
  "tree",
  "foliage",
  "stuepalme",
  "palme",
  "plante",
  "potte"
], Yh = {
  w: 40,
  h: 40
}, Zh = [
  {
    circle: [
      50,
      57,
      21
    ],
    role: "body"
  },
  {
    circle: [
      50,
      57,
      17
    ],
    role: "detail"
  },
  {
    path: [
      [
        "M",
        50,
        57
      ],
      [
        "Q",
        32,
        62,
        24,
        43
      ]
    ],
    role: "detail"
  },
  {
    path: [
      [
        "M",
        50,
        57
      ],
      [
        "Q",
        47,
        34,
        65,
        27
      ]
    ],
    role: "detail"
  },
  {
    path: [
      [
        "M",
        50,
        57
      ],
      [
        "Q",
        56,
        60,
        62,
        70
      ]
    ],
    role: "detail"
  },
  {
    path: [
      [
        "M",
        24,
        43
      ],
      [
        "Q",
        33.75,
        48.02,
        43.97,
        44.05
      ],
      [
        "Q",
        33.88,
        45.52,
        24,
        43
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        24,
        43
      ],
      [
        "Q",
        29.74,
        49.29,
        34.7,
        56.21
      ],
      [
        "Q",
        31.68,
        47.72,
        24,
        43
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        24,
        43
      ],
      [
        "Q",
        13.37,
        50.83,
        12.36,
        63.99
      ],
      [
        "Q",
        15.56,
        52.04,
        24,
        43
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        24,
        43
      ],
      [
        "Q",
        13.79,
        41.56,
        4.11,
        45.09
      ],
      [
        "Q",
        14.05,
        44.05,
        24,
        43
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        24,
        43
      ],
      [
        "Q",
        16.96,
        37.19,
        12.19,
        29.42
      ],
      [
        "Q",
        15.08,
        38.83,
        24,
        43
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        24,
        43
      ],
      [
        "Q",
        31.05,
        33.27,
        31.49,
        21.25
      ],
      [
        "Q",
        28.69,
        32.45,
        24,
        43
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        65,
        27
      ],
      [
        "Q",
        77.76,
        34.31,
        92.39,
        32.82
      ],
      [
        "Q",
        78.28,
        31.87,
        65,
        27
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        65,
        27
      ],
      [
        "Q",
        71.35,
        36.6,
        76.85,
        46.71
      ],
      [
        "Q",
        73.49,
        35.31,
        65,
        27
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        65,
        27
      ],
      [
        "Q",
        56.46,
        33.9,
        58.19,
        44.74
      ],
      [
        "Q",
        58.79,
        34.79,
        65,
        27
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        65,
        27
      ],
      [
        "Q",
        52.27,
        27.6,
        40.74,
        33.05
      ],
      [
        "Q",
        52.87,
        30.02,
        65,
        27
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        65,
        27
      ],
      [
        "Q",
        56.59,
        22.33,
        50.03,
        15.3
      ],
      [
        "Q",
        55.05,
        24.3,
        65,
        27
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        65,
        27
      ],
      [
        "Q",
        67.07,
        15.16,
        62.2,
        4.17
      ],
      [
        "Q",
        64.59,
        15.46,
        65,
        27
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        65,
        27
      ],
      [
        "Q",
        76.92,
        21.13,
        82.37,
        9.02
      ],
      [
        "Q",
        75.12,
        19.4,
        65,
        27
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        62,
        70
      ],
      [
        "Q",
        72.65,
        76.24,
        84.72,
        73.6
      ],
      [
        "Q",
        73.05,
        73.77,
        62,
        70
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        62,
        70
      ],
      [
        "Q",
        66.58,
        80.01,
        70.24,
        90.4
      ],
      [
        "Q",
        68.9,
        79.08,
        62,
        70
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        62,
        70
      ],
      [
        "Q",
        51.6,
        71.75,
        48.42,
        81.81
      ],
      [
        "Q",
        53.24,
        73.64,
        62,
        70
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        62,
        70
      ],
      [
        "Q",
        56.01,
        64.14,
        47.74,
        62.74
      ],
      [
        "Q",
        54.87,
        66.37,
        62,
        70
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  },
  {
    path: [
      [
        "M",
        62,
        70
      ],
      [
        "Q",
        62.61,
        59.91,
        66.16,
        50.44
      ],
      [
        "Q",
        60.17,
        59.39,
        62,
        70
      ],
      [
        "Z"
      ]
    ],
    role: "body",
    width: 0.8,
    fillOpacity: 0.18
  }
], Qh = {
  id: qh,
  name: Gh,
  category: Kh,
  keywords: Xh,
  size: Yh,
  parts: Zh
}, Jh = "ladderShelf", ep = "ladder shelf", tp = "living", ip = [
  "shelving",
  "shelves",
  "rack",
  "open",
  "cross brace",
  "reol",
  "stigereol"
], np = {
  w: 80,
  h: 40
}, op = [
  {
    line: [
      10,
      8,
      90,
      92
    ],
    role: "detail"
  },
  {
    line: [
      90,
      8,
      10,
      92
    ],
    role: "detail"
  },
  {
    rect: [
      3,
      0,
      7,
      100
    ],
    role: "body"
  },
  {
    rect: [
      90,
      0,
      7,
      100
    ],
    role: "body"
  },
  {
    repeat: 3,
    step: [
      0,
      36
    ],
    part: {
      rect: [
        10,
        16,
        80,
        5
      ],
      role: "body"
    }
  }
], rp = {
  id: Jh,
  name: ep,
  category: tp,
  keywords: ip,
  size: np,
  parts: op
}, ap = "piano", sp = "piano", lp = "living", cp = [
  "upright",
  "keyboard",
  "music"
], dp = {
  w: 140,
  h: 60
}, hp = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 6.666667
  },
  {
    line: [
      4,
      70,
      96,
      70
    ],
    role: "thin"
  },
  {
    repeat: 7,
    step: [
      12.5,
      0
    ],
    part: {
      line: [
        12.5,
        70,
        12.5,
        94
      ],
      role: "hint"
    }
  },
  {
    line: [
      4,
      22,
      96,
      22
    ],
    role: "hint",
    opacity: 0.5
  }
], pp = {
  id: ap,
  name: sp,
  category: lp,
  keywords: cp,
  size: dp,
  parts: hp
}, up = "plant", fp = "plant", mp = "living", gp = [
  "pot",
  "tree",
  "greenery"
], yp = {
  w: 44,
  h: 44
}, bp = "ellipse", vp = [
  {
    ellipse: [
      50,
      50,
      50,
      50
    ],
    role: "body"
  },
  {
    circle: [
      50,
      38,
      18
    ],
    role: "thin"
  },
  {
    circle: [
      34,
      58,
      18
    ],
    role: "thin"
  },
  {
    circle: [
      66,
      58,
      18
    ],
    role: "thin"
  }
], wp = {
  id: up,
  name: fp,
  category: mp,
  keywords: gp,
  size: yp,
  footprint: bp,
  parts: vp
}, xp = "quarterTub", _p = "corner hot tub", $p = "bath", kp = [
  "hottub",
  "jacuzzi",
  "corner",
  "quarter",
  "spa",
  "whirlpool"
], Sp = {
  w: 140,
  h: 140
}, Mp = [
  {
    path: [
      [
        "M",
        100,
        0
      ],
      [
        "L",
        100,
        96
      ],
      [
        "Q",
        100,
        100,
        96,
        100
      ],
      [
        "C",
        43,
        98,
        2,
        57,
        0,
        4
      ],
      [
        "Q",
        0,
        0,
        4,
        0
      ],
      [
        "Z"
      ]
    ],
    role: "body"
  },
  {
    path: [
      [
        "M",
        17,
        7
      ],
      [
        "L",
        76,
        7
      ],
      [
        "Q",
        90,
        8,
        93,
        24
      ],
      [
        "L",
        93,
        83
      ],
      [
        "Q",
        93,
        93,
        83,
        92
      ],
      [
        "C",
        44,
        87,
        13,
        56,
        8,
        17
      ],
      [
        "Q",
        7,
        7,
        17,
        7
      ],
      [
        "Z"
      ]
    ],
    role: "line"
  },
  {
    path: [
      [
        "M",
        62,
        8
      ],
      [
        "Q",
        61,
        24,
        69,
        31
      ],
      [
        "Q",
        76,
        39,
        92,
        38
      ]
    ],
    role: "detail"
  },
  {
    path: [
      [
        "M",
        32,
        28
      ],
      [
        "C",
        47,
        20,
        75,
        45,
        77,
        65
      ],
      [
        "C",
        76,
        78,
        58,
        76,
        42,
        60
      ],
      [
        "C",
        26,
        44,
        23,
        33,
        32,
        28
      ]
    ],
    role: "detail"
  },
  {
    circle: [
      36,
      15,
      2
    ],
    role: "hint"
  },
  {
    circle: [
      51,
      16,
      2
    ],
    role: "hint"
  },
  {
    circle: [
      84,
      49,
      2
    ],
    role: "hint"
  },
  {
    circle: [
      85,
      64,
      2
    ],
    role: "hint"
  },
  {
    circle: [
      23,
      42,
      2
    ],
    role: "hint"
  },
  {
    circle: [
      32,
      57,
      2
    ],
    role: "hint"
  },
  {
    circle: [
      43,
      68,
      2
    ],
    role: "hint"
  },
  {
    circle: [
      58,
      77,
      2
    ],
    role: "hint"
  },
  {
    circle: [
      70,
      40,
      2
    ],
    role: "hint"
  },
  {
    circle: [
      76,
      47,
      3
    ],
    role: "detail"
  },
  {
    circle: [
      76,
      47,
      1.2
    ],
    role: "hint"
  },
  {
    polyline: [
      [
        96,
        26
      ],
      [
        89,
        26
      ],
      [
        89,
        30
      ]
    ],
    role: "thin"
  },
  {
    circle: [
      97,
      36,
      1.5
    ],
    role: "solid"
  },
  {
    circle: [
      97,
      42,
      1.5
    ],
    role: "solid"
  },
  {
    path: [
      [
        "M",
        27.759,
        67.291
      ],
      [
        "L",
        32.709,
        72.241
      ],
      [
        "Q",
        33.063,
        72.594,
        33.416,
        72.241
      ],
      [
        "L",
        33.841,
        71.816
      ],
      [
        "Q",
        34.194,
        71.463,
        33.841,
        71.109
      ],
      [
        "L",
        28.891,
        66.159
      ],
      [
        "Q",
        28.537,
        65.806,
        28.184,
        66.159
      ],
      [
        "L",
        27.759,
        66.584
      ],
      [
        "Q",
        27.406,
        66.937,
        27.759,
        67.291
      ],
      [
        "Z"
      ]
    ],
    role: "thin"
  },
  {
    line: [
      29.386,
      67.786,
      32.214,
      70.614
    ],
    role: "hint"
  }
], Ep = {
  id: xp,
  name: _p,
  category: $p,
  keywords: kp,
  size: Sp,
  parts: Mp
}, Ap = "roundTable", Tp = "round table", Cp = "living", Ip = [
  "dining",
  "circular"
], Pp = {
  w: 100,
  h: 100
}, zp = "ellipse", Op = [
  {
    ellipse: [
      50,
      50,
      50,
      50
    ],
    role: "body"
  }
], Lp = {
  id: Ap,
  name: Tp,
  category: Cp,
  keywords: Ip,
  size: Pp,
  footprint: zp,
  parts: Op
}, Fp = "rug", Dp = "rug", Rp = "living", Hp = [
  "carpet",
  "mat"
], Np = {
  w: 180,
  h: 120
}, jp = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 12,
    role: "body",
    fillOpacity: 0.08,
    dash: [
      8,
      5
    ]
  },
  {
    rect: [
      10,
      10,
      80,
      80
    ],
    rx: 8,
    role: "detail",
    opacity: 0.6
  }
], Wp = {
  id: Fp,
  name: Dp,
  category: Rp,
  keywords: Hp,
  size: Np,
  parts: jp
}, Bp = "sectional", Up = "sectional (L)", Vp = "living", qp = [
  "couch",
  "sofa",
  "corner",
  "chaise"
], Gp = {
  w: 230,
  h: 180
}, Kp = [
  {
    polygon: [
      [
        0,
        0
      ],
      [
        100,
        0
      ],
      [
        100,
        100
      ],
      [
        58,
        100
      ],
      [
        58,
        55
      ],
      [
        0,
        55
      ]
    ],
    role: "body"
  },
  {
    line: [
      0,
      16,
      100,
      16
    ],
    role: "line"
  },
  {
    line: [
      9,
      16,
      9,
      55
    ],
    role: "line"
  },
  {
    line: [
      58,
      16,
      58,
      100
    ],
    role: "line"
  }
], Xp = {
  id: Bp,
  name: Up,
  category: Vp,
  keywords: qp,
  size: Gp,
  parts: Kp
}, Yp = "sink", Zp = "sink", Qp = "kitchen", Jp = [
  "basin",
  "tap",
  "faucet"
], eu = {
  w: 64,
  h: 48
}, tu = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 8.333333
  },
  {
    rect: [
      12,
      18,
      76,
      50
    ],
    rx: 8.333333,
    role: "line"
  },
  {
    circle: [
      50,
      10,
      5
    ],
    role: "line"
  }
], iu = {
  id: Yp,
  name: Zp,
  category: Qp,
  keywords: Jp,
  size: eu,
  parts: tu
}, nu = "sofa", ou = "sofa", ru = "living", au = [
  "couch",
  "settee",
  "seat"
], su = {
  w: 170,
  h: 72
}, lu = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 5.555556
  },
  {
    line: [
      0,
      30,
      100,
      30
    ],
    role: "line"
  },
  {
    line: [
      12,
      30,
      12,
      100
    ],
    role: "line"
  },
  {
    line: [
      88,
      30,
      88,
      100
    ],
    role: "line"
  }
], cu = {
  id: nu,
  name: ou,
  category: ru,
  keywords: au,
  size: su,
  parts: lu
}, du = "stairs", hu = "stairs", pu = "utility", uu = [
  "steps",
  "staircase"
], fu = {
  w: 90,
  h: 170
}, mu = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 4.444444
  },
  {
    repeat: 6,
    step: [
      0,
      14.285714
    ],
    part: {
      line: [
        0,
        14.285714,
        100,
        14.285714
      ],
      role: "thin"
    }
  },
  {
    line: [
      50,
      96.470588,
      50,
      3.529412
    ],
    role: "thin"
  },
  {
    path: [
      [
        "M",
        38,
        16
      ],
      [
        "L",
        50,
        2.352941
      ],
      [
        "L",
        62,
        16
      ]
    ],
    role: "thin"
  }
], gu = {
  id: du,
  name: hu,
  category: pu,
  keywords: uu,
  size: fu,
  parts: mu
}, yu = "stove", bu = "stove", vu = "kitchen", wu = [
  "cooker",
  "hob",
  "oven",
  "range"
], xu = {
  w: 64,
  h: 64
}, _u = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 6.25
  },
  {
    circle: [
      28,
      28,
      16
    ],
    role: "line"
  },
  {
    circle: [
      72,
      28,
      16
    ],
    role: "line"
  },
  {
    circle: [
      28,
      72,
      16
    ],
    role: "line"
  },
  {
    circle: [
      72,
      72,
      16
    ],
    role: "line"
  }
], $u = {
  id: yu,
  name: bu,
  category: vu,
  keywords: wu,
  size: xu,
  parts: _u
}, ku = "table", Su = "table", Mu = "living", Eu = [
  "dining"
], Au = {
  w: 120,
  h: 80
}, Tu = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 5
  }
], Cu = {
  id: ku,
  name: Su,
  category: Mu,
  keywords: Eu,
  size: Au,
  parts: Tu
}, Iu = "tallDresser", Pu = "tall dresser", zu = "bedroom", Ou = [
  "IKEA MALM",
  "chest of drawers",
  "tall narrow tall & narrow",
  "tallboy",
  "kommode",
  "høj smal",
  "skuffer",
  "80x48"
], Lu = {
  w: 80,
  h: 48
}, Fu = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    role: "body"
  },
  {
    line: [
      0,
      6,
      100,
      6
    ],
    role: "thin"
  },
  {
    rect: [
      3,
      10,
      46,
      13
    ],
    role: "thin"
  },
  {
    rect: [
      51,
      10,
      46,
      13
    ],
    role: "thin"
  },
  {
    repeat: 4,
    step: [
      0,
      17
    ],
    part: {
      rect: [
        3,
        27,
        94,
        13
      ],
      role: "thin"
    }
  },
  {
    line: [
      3,
      95,
      97,
      95
    ],
    role: "detail"
  }
], Du = {
  id: Iu,
  name: Pu,
  category: zu,
  keywords: Ou,
  size: Lu,
  parts: Fu
}, Ru = "toilet", Hu = "toilet", Nu = "bath", ju = [
  "wc",
  "loo",
  "lavatory"
], Wu = {
  w: 48,
  h: 68
}, Bu = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 8.333333
  },
  {
    rect: [
      10,
      0,
      80,
      22
    ],
    rx: 6.25,
    role: "line"
  },
  {
    ellipse: [
      50,
      68,
      34,
      30
    ],
    role: "line"
  }
], Uu = {
  id: Ru,
  name: Hu,
  category: Nu,
  keywords: ju,
  size: Wu,
  parts: Bu
}, Vu = "tv", qu = "tv", Gu = "living", Ku = [
  "television",
  "screen",
  "media"
], Xu = {
  w: 110,
  h: 18
}, Yu = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 22.222222
  },
  {
    line: [
      32,
      100,
      68,
      200
    ],
    role: "line"
  }
], Zu = {
  id: Vu,
  name: qu,
  category: Gu,
  keywords: Ku,
  size: Xu,
  parts: Yu
}, Qu = "vanity", Ju = "vanity", ef = "bath", tf = [
  "washbasin",
  "sink",
  "bathroom"
], nf = {
  w: 110,
  h: 55
}, of = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 7.272727
  },
  {
    ellipse: [
      50,
      56,
      20,
      26
    ],
    role: "line"
  },
  {
    circle: [
      50,
      14,
      5
    ],
    role: "thin"
  }
], rf = {
  id: Qu,
  name: Ju,
  category: ef,
  keywords: tf,
  size: nf,
  parts: of
}, af = "wardrobe", sf = "wardrobe", lf = "bedroom", cf = [
  "closet",
  "armoire",
  "cupboard"
], df = {
  w: 120,
  h: 55
}, hf = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 7.272727
  },
  {
    line: [
      50,
      0,
      50,
      100
    ],
    role: "line"
  },
  {
    line: [
      44,
      40,
      44,
      60
    ],
    role: "line"
  },
  {
    line: [
      56,
      40,
      56,
      60
    ],
    role: "line"
  }
], pf = {
  id: af,
  name: sf,
  category: lf,
  keywords: cf,
  size: df,
  parts: hf
}, uf = "washer", ff = "washer", mf = "utility", gf = [
  "washing machine",
  "laundry"
], yf = {
  w: 60,
  h: 62
}, bf = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 6.666667
  },
  {
    line: [
      6,
      18,
      94,
      18
    ],
    role: "detail"
  },
  {
    circle: [
      50,
      56,
      30
    ],
    role: "line"
  },
  {
    circle: [
      16,
      9,
      4.5
    ],
    role: "thin"
  }
], vf = {
  id: uf,
  name: ff,
  category: mf,
  keywords: gf,
  size: yf,
  parts: bf
}, wf = "waterHeater", xf = "water heater", _f = "utility", $f = [
  "boiler",
  "cylinder",
  "tank"
], kf = {
  w: 52,
  h: 52
}, Sf = "ellipse", Mf = [
  {
    ellipse: [
      50,
      50,
      50,
      50
    ],
    role: "body"
  },
  {
    circle: [
      50,
      50,
      17
    ],
    role: "thin"
  }
], Ef = {
  id: wf,
  name: xf,
  category: _f,
  keywords: $f,
  size: kf,
  footprint: Sf,
  parts: Mf
}, Gn = [
  "living",
  "bedroom",
  "kitchen",
  "bath",
  "utility",
  "other"
], fn = (e) => Object.assign(/* @__PURE__ */ Object.create(null), e), Mo = (e, t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0, Ar = fn({
  body: { width: 2, opacity: 1, fillOpacity: 0.12 },
  line: { width: 2, opacity: 1, fillOpacity: 0 },
  thin: { width: 1.5, opacity: 1, fillOpacity: 0 },
  detail: { width: 1.5, opacity: 0.7, fillOpacity: 0 },
  hint: { width: 1, opacity: 0.6, fillOpacity: 0 },
  solid: { width: 0, opacity: 0.7, fillOpacity: 1 }
}), Af = [0, 0, 100, 100], Tf = 64, ss = 256, Cf = 256, If = 0.25, Tr = 8, Le = (e) => typeof e == "number" && Number.isFinite(e) ? e : null, gt = (e, t, i) => Math.min(i, Math.max(t, e));
function We(e, t) {
  if (!Array.isArray(e) || e.length !== t) return null;
  const i = [];
  for (const n of e) {
    const o = Le(n);
    if (o === null) return null;
    i.push(o);
  }
  return i;
}
function Pf(e) {
  if (!Array.isArray(e) || e.length < 2 || e.length > ss) return null;
  const t = [];
  for (const i of e) {
    const n = We(i, 2);
    if (!n) return null;
    t.push([n[0], n[1]]);
  }
  return t;
}
const zf = fn({ M: 2, L: 2, Q: 4, C: 6, Z: 0 });
function Of(e) {
  if (!Array.isArray(e) || !e.length || e.length > Cf) return null;
  const t = [];
  for (const i of e) {
    if (!Array.isArray(i) || typeof i[0] != "string") return null;
    const n = i[0].toUpperCase(), o = Mo(zf, n);
    if (o === void 0) return null;
    const r = We(i.slice(1), o);
    if (!r) return null;
    t.push([n, ...r]);
  }
  return t[0]?.[0] !== "M" ? null : t;
}
function pt(e, t) {
  const i = Mo(Ar, e.role) ? e.role : t, n = Ar[i], o = Le(e.width), r = Le(e.opacity), a = Le(e.fillOpacity), s = Array.isArray(e.dash) ? e.dash.map(Le) : null, l = s && s.length && s.length <= 8 && s.every((c) => c !== null) ? s.map((c) => gt(c, 0, 100)) : void 0;
  return {
    role: i,
    width: o === null ? n.width : i === "solid" ? gt(o, 0, Tr) : gt(o, If, Tr),
    opacity: r === null ? n.opacity : gt(r, 0, 1),
    fillOpacity: a === null ? n.fillOpacity : gt(a, 0, 1),
    dash: l
  };
}
function Cr(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, i = t.space === "square" ? "square" : "box";
  if ("line" in t) {
    const n = We(t.line, 4);
    return n ? { kind: "line", a: [n[0], n[1]], b: [n[2], n[3]], space: i, style: pt(t, "line") } : null;
  }
  if ("rect" in t) {
    const n = We(t.rect, 4);
    return !n || n[2] < 0 || n[3] < 0 ? null : {
      kind: "rect",
      x: n[0],
      y: n[1],
      w: n[2],
      h: n[3],
      rx: Math.max(0, Le(t.rx) ?? 0),
      space: i,
      style: pt(t, "body")
    };
  }
  if ("circle" in t) {
    const n = We(t.circle, 3);
    return !n || n[2] < 0 ? null : { kind: "circle", cx: n[0], cy: n[1], r: n[2], space: i, style: pt(t, "line") };
  }
  if ("ellipse" in t) {
    const n = We(t.ellipse, 4);
    return !n || n[2] < 0 || n[3] < 0 ? null : {
      kind: "ellipse",
      cx: n[0],
      cy: n[1],
      rx: n[2],
      ry: n[3],
      space: i,
      style: pt(t, "line")
    };
  }
  if ("polygon" in t || "polyline" in t) {
    const n = "polygon" in t, o = Pf(n ? t.polygon : t.polyline);
    return o ? { kind: "poly", closed: n, pts: o, space: i, style: pt(t, n ? "body" : "line") } : null;
  }
  if ("path" in t) {
    const n = Of(t.path);
    return n ? { kind: "path", cmds: n, space: i, style: pt(t, "line") } : null;
  }
  return null;
}
function Lf(e, t, i) {
  switch (e.kind) {
    case "line":
      return { ...e, a: [e.a[0] + t, e.a[1] + i], b: [e.b[0] + t, e.b[1] + i] };
    case "rect":
      return { ...e, x: e.x + t, y: e.y + i };
    case "circle":
      return { ...e, cx: e.cx + t, cy: e.cy + i };
    case "ellipse":
      return { ...e, cx: e.cx + t, cy: e.cy + i };
    case "poly":
      return { ...e, pts: e.pts.map(([n, o]) => [n + t, o + i]) };
    case "path":
      return {
        ...e,
        cmds: e.cmds.map((n) => {
          if (n[0] === "Z") return n;
          const o = n.slice(1).map((r, a) => r + (a % 2 === 0 ? t : i));
          return [n[0], ...o];
        })
      };
  }
}
function Ff(e) {
  if (e && typeof e == "object" && "repeat" in e) {
    const i = e, n = Le(i.repeat), o = We(i.step, 2), r = Cr(i.part);
    if (n === null || !o || !r) return [];
    const a = gt(Math.round(n), 1, Tf);
    return Array.from({ length: a }, (s, l) => Lf(r, o[0] * l, o[1] * l));
  }
  const t = Cr(e);
  return t ? [t] : [];
}
function mn(e, t, i) {
  const n = (h) => (i?.push(h), null);
  if (!e || typeof e != "object" || Array.isArray(e))
    return n("A symbol has to be a JSON object.");
  const o = e, r = typeof o.id == "string" && o.id.trim() ? o.id.trim() : t, a = pe(r);
  if (!a || a !== r)
    return n('`id` is missing, or uses characters a CSS class cannot: letters, digits, "-" and "_" only.');
  if (!Array.isArray(o.parts)) return n("`parts` has to be an array of shapes.");
  const s = [];
  for (const h of o.parts)
    for (const u of Ff(h)) {
      if (s.length >= ss) break;
      s.push(u);
    }
  if (!s.length)
    return n(
      "No drawable parts. Each one needs a known shape (line, rect, circle, ellipse, polygon, polyline, path) with the right number of finite numbers."
    );
  const l = o.size && typeof o.size == "object" ? o.size : {}, c = Le(l.w), p = Le(l.h), d = We(o.viewBox, 4);
  return {
    id: a,
    name: typeof o.name == "string" && o.name.trim() ? o.name.trim().slice(0, 60) : a,
    category: typeof o.category == "string" && Gn.includes(o.category) ? o.category : "other",
    keywords: Array.isArray(o.keywords) ? o.keywords.filter((h) => typeof h == "string").slice(0, 12) : [],
    size: { w: c && c > 0 ? c : 60, h: p && p > 0 ? p : 60 },
    viewBox: d && d[2] > 0 && d[3] > 0 ? d : Af,
    footprint: o.footprint === "ellipse" ? "ellipse" : "rect",
    parts: s
  };
}
const ls = mn({
  id: "unknown",
  name: "unknown",
  size: { w: 60, h: 60 },
  parts: [{ rect: [0, 0, 100, 100], rx: 6.666667 }]
}), $e = (() => {
  const e = /* @__PURE__ */ Object.assign({ "../furniture/airHandler.json": md, "../furniture/bathtub.json": _d, "../furniture/bed.json": Td, "../furniture/bookcase.json": Fd, "../furniture/chair.json": Bd, "../furniture/cornerShowerCurved.json": Yd, "../furniture/desk.json": nh, "../furniture/dishwasher.json": dh, "../furniture/dresser.json": yh, "../furniture/dryer.json": kh, "../furniture/fishTank.json": Ih, "../furniture/fridge.json": Rh, "../furniture/hotTub.json": Vh, "../furniture/indoorPalm.json": Qh, "../furniture/ladderShelf.json": rp, "../furniture/piano.json": pp, "../furniture/plant.json": wp, "../furniture/quarterTub.json": Ep, "../furniture/roundTable.json": Lp, "../furniture/rug.json": Wp, "../furniture/sectional.json": Xp, "../furniture/sink.json": iu, "../furniture/sofa.json": cu, "../furniture/stairs.json": gu, "../furniture/stove.json": $u, "../furniture/table.json": Cu, "../furniture/tallDresser.json": Du, "../furniture/toilet.json": Uu, "../furniture/tv.json": Zu, "../furniture/vanity.json": rf, "../furniture/wardrobe.json": pf, "../furniture/washer.json": vf, "../furniture/waterHeater.json": Ef }), t = fn({});
  for (const [i, n] of Object.entries(e)) {
    const o = mn(n, i.split("/").pop()?.replace(/\.json$/, ""));
    o && (t[o.id] = o);
  }
  return t;
})();
function ri(e, t) {
  return Mo(e, t);
}
let Ir, Pr = $e;
function Wt(e) {
  if (!e || typeof e != "object") return $e;
  if (e === Ir) return Pr;
  const t = fn({});
  Object.assign(t, $e);
  for (const [i, n] of Object.entries(e)) {
    const o = mn(n, i);
    o && (t[o.id] = o);
  }
  return Ir = e, Pr = t, t;
}
function Df(e) {
  const t = (i) => {
    const n = Gn.indexOf(i);
    return n < 0 ? Gn.length : n;
  };
  return Object.values(e).sort(
    (i, n) => t(i.category) - t(n.category) || i.name.localeCompare(n.name)
  );
}
function Rf(e, t) {
  const i = t.trim().toLowerCase();
  return i ? e.id.toLowerCase().includes(i) || e.name.toLowerCase().includes(i) || e.category.includes(i) || e.keywords.some((n) => n.toLowerCase().includes(i)) : !0;
}
function zr(e, t = $e) {
  return ri(t, e)?.size ?? { w: 60, h: 60 };
}
function Or(e, t, i, n) {
  const [o, r, a, s] = e.viewBox, l = n === "square" ? Math.min(t, i) : t, c = n === "square" ? Math.min(t, i) : i, p = l / a, d = c / s;
  return {
    x: (h) => (h - o) * p - l / 2,
    y: (h) => (h - r) * d - c / 2,
    len: (h) => h * Math.min(p, d),
    sx: (h) => h * p,
    sy: (h) => h * d
  };
}
const te = (e) => Number.isFinite(e) ? e : 0;
function Hf(e, t) {
  const i = e.fillOpacity > 0 ? t : "none", n = e.role === "solid" ? "none" : t;
  return { fill: i, stroke: n, style: e };
}
function Nf(e, t, i, n) {
  const { fill: o, stroke: r, style: a } = Hf(e.style, i), s = n ?? o, l = a.opacity < 1 ? a.opacity : m, c = a.dash?.length ? a.dash.join(" ") : m, p = a.fillOpacity > 0 && a.fillOpacity < 1 ? a.fillOpacity : m, d = a.role === "solid" ? m : a.width;
  switch (e.kind) {
    case "line":
      return _`<line x1=${te(t.x(e.a[0]))} y1=${te(t.y(e.a[1]))}
                       x2=${te(t.x(e.b[0]))} y2=${te(t.y(e.b[1]))}
                       fill="none" stroke=${r} stroke-width=${d}
                       stroke-dasharray=${c} opacity=${l} />`;
    case "rect":
      return _`<rect x=${te(t.x(e.x))} y=${te(t.y(e.y))}
                       width=${te(t.sx(e.w))} height=${te(t.sy(e.h))}
                       rx=${e.rx > 0 ? te(t.len(e.rx)) : m}
                       fill=${s} fill-opacity=${p}
                       stroke=${r} stroke-width=${d}
                       stroke-dasharray=${c} opacity=${l} />`;
    case "circle":
      return _`<circle cx=${te(t.x(e.cx))} cy=${te(t.y(e.cy))} r=${te(t.len(e.r))}
                         fill=${s} fill-opacity=${p}
                         stroke=${r} stroke-width=${d} opacity=${l} />`;
    case "ellipse":
      return _`<ellipse cx=${te(t.x(e.cx))} cy=${te(t.y(e.cy))}
                          rx=${te(t.sx(e.rx))} ry=${te(t.sy(e.ry))}
                          fill=${s} fill-opacity=${p}
                          stroke=${r} stroke-width=${d} opacity=${l} />`;
    case "poly": {
      const h = e.pts.map(([u, f]) => `${te(t.x(u))},${te(t.y(f))}`).join(" ");
      return e.closed ? _`<polygon points=${h}
                       fill=${s} fill-opacity=${p}
                       stroke=${r} stroke-width=${d}
                       stroke-linejoin="round" opacity=${l} />` : _`<polyline points=${h} fill="none"
                        stroke=${r} stroke-width=${d}
                        stroke-linejoin="round" opacity=${l} />`;
    }
    case "path": {
      const h = e.cmds.map(
        (u) => u[0] === "Z" ? "Z" : `${u[0]} ${u.slice(1).map((f, g) => g % 2 === 0 ? te(t.x(f)) : te(t.y(f))).join(" ")}`
      ).join(" ");
      return _`<path d=${h}
                       fill=${o} fill-opacity=${p}
                       stroke=${r} stroke-width=${d}
                       stroke-linejoin="round" opacity=${l} />`;
    }
  }
}
function cs(e, t, i, n, o) {
  const r = Or(e, t, i, "box"), a = Or(e, t, i, "square");
  return e.parts.map((s) => Nf(s, s.space === "square" ? a : r, n, o));
}
const jf = /* @__PURE__ */ new Set(["light", "switch", "fan", "input_boolean"]);
function _i(e) {
  const t = e?.split(".")[0] ?? "";
  return jf.has(t) ? { action: "toggle" } : { action: "more-info" };
}
function Me(e) {
  return e !== void 0 && e.action !== "none";
}
function ds(e, t) {
  return t === "tap" ? e.tap_action ?? _i(e.entity) : t === "hold" ? e.hold_action : e.double_tap_action;
}
function Eo(e, t) {
  if (!t || t.action === "none") return !1;
  switch (t.action) {
    case "toggle":
      return !!e.entity;
    case "more-info":
      return !!(t.entity ?? e.entity);
    case "navigate":
      return !!t.navigation_path;
    case "url":
      return !!t.url_path;
    case "perform-action":
    case "call-service":
      return ps(t) !== null;
    case "fire-dom-event":
      return !0;
    default:
      return !1;
  }
}
function hs(e, t) {
  if (!(!t || !Eo(e, t)))
    switch (t.action) {
      case "toggle":
        return e.entity;
      case "more-info":
        return t.entity ?? e.entity;
      default:
        return;
    }
}
function Wf(e) {
  return ["tap", "hold", "double_tap"].some(
    (t) => Eo(e, ds(e, t))
  );
}
function ps(e) {
  const t = e.perform_action ?? e.service;
  if (!t || !t.includes(".")) return null;
  const [i, n] = t.split(".", 2);
  return { domain: i, service: n, data: e.data ?? e.service_data, target: e.target };
}
function ut(e, t, i, n) {
  if (!(!n || n.action === "none")) {
    if (n.confirmation) {
      const o = typeof n.confirmation == "object" && n.confirmation.text || `Are you sure you want to ${n.action}?`;
      if (!globalThis.confirm?.(o)) return;
    }
    switch (n.action) {
      case "toggle":
        i.entity && t.callService("homeassistant", "toggle", { entity_id: i.entity });
        break;
      case "more-info": {
        const o = n.entity ?? i.entity;
        o && e.dispatchEvent(
          new CustomEvent("hass-more-info", { detail: { entityId: o }, bubbles: !0, composed: !0 })
        );
        break;
      }
      case "navigate":
        if (n.navigation_path) {
          history.pushState(null, "", n.navigation_path);
          const o = new Event("location-changed");
          o.detail = { replace: !1 }, window.dispatchEvent(o);
        }
        break;
      case "url":
        n.url_path && window.open(n.url_path);
        break;
      case "perform-action":
      case "call-service": {
        const o = ps(n);
        o && t.callService(o.domain, o.service, o.data, o.target);
        break;
      }
      case "fire-dom-event":
        e.dispatchEvent(new CustomEvent("ll-custom", { detail: n, bubbles: !0, composed: !0 }));
        break;
    }
  }
}
const le = 0.75, ke = 8, Bf = 400;
function zn(e, t) {
  return typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t;
}
function wt(e) {
  let t = 0;
  for (let i = 0, n = e.length - 1; i < e.length; n = i++)
    t += e[n].x * e[i].y - e[i].x * e[n].y;
  return t / 2;
}
function Uf(e, t, i, n) {
  const o = n.x - i.x, r = n.y - i.y, a = o * o + r * r;
  if (a === 0) return Math.hypot(e - i.x, t - i.y);
  let s = ((e - i.x) * o + (t - i.y) * r) / a;
  return s = Math.max(0, Math.min(1, s)), Math.hypot(e - (i.x + s * o), t - (i.y + s * r));
}
function Ao(e, t) {
  const i = [];
  for (let n = 0; n < e.length; n++) {
    const o = e[n], r = o.b.x - o.a.x, a = o.b.y - o.a.y, s = Math.hypot(r, a);
    if (s <= t) continue;
    const l = [0, 1], c = t / s;
    for (let p = 0; p < e.length; p++) {
      if (p === n) continue;
      const d = e[p], h = d.b.x - d.a.x, u = d.b.y - d.a.y, f = r * u - a * h;
      if (Math.abs(f) > 1e-9) {
        const g = ((d.a.x - o.a.x) * u - (d.a.y - o.a.y) * h) / f, y = ((d.a.x - o.a.x) * a - (d.a.y - o.a.y) * r) / f, b = t / Math.max(Math.hypot(h, u), 1e-9);
        g > c && g < 1 - c && y >= -b && y <= 1 + b && l.push(g);
        continue;
      }
      for (const g of [d.a, d.b]) {
        const y = ((g.x - o.a.x) * r + (g.y - o.a.y) * a) / (s * s);
        if (y <= c || y >= 1 - c) continue;
        const b = o.a.x + y * r, k = o.a.y + y * a;
        Math.hypot(g.x - b, g.y - k) <= t && l.push(y);
      }
    }
    l.sort((p, d) => p - d);
    for (let p = 1; p < l.length; p++) {
      const d = l[p - 1], h = l[p];
      h - d <= c || i.push({
        a: { x: o.a.x + d * r, y: o.a.y + d * a },
        b: { x: o.a.x + h * r, y: o.a.y + h * a }
      });
    }
  }
  return i;
}
function Vf(e, t) {
  const i = [], n = /* @__PURE__ */ new Map(), o = (c) => Math.floor(c / t), r = (c) => {
    const p = o(c.x), d = o(c.y);
    for (let g = -1; g <= 1; g++)
      for (let y = -1; y <= 1; y++)
        for (const b of n.get(`${p + g}:${d + y}`) ?? [])
          if (Math.hypot(i[b].x - c.x, i[b].y - c.y) <= t) return b;
    const h = i.push({ x: c.x, y: c.y }) - 1, u = `${p}:${d}`, f = n.get(u);
    return f ? f.push(h) : n.set(u, [h]), h;
  }, a = /* @__PURE__ */ new Map(), s = (c) => {
    let p = a.get(c);
    return p || a.set(c, p = /* @__PURE__ */ new Set()), p;
  };
  for (const c of e) {
    const p = r(c.a), d = r(c.b);
    p !== d && (s(p).add(d), s(d).add(p));
  }
  const l = i.map(
    (c, p) => [...a.get(p) ?? []].sort(
      (d, h) => Math.atan2(i[d].y - c.y, i[d].x - c.x) - Math.atan2(i[h].y - c.y, i[h].x - c.x)
    )
  );
  return { points: i, neighbors: l };
}
function us(e, t) {
  const { points: i, neighbors: n } = Vf(e, t), o = /* @__PURE__ */ new Set(), r = [];
  for (let a = 0; a < i.length; a++)
    for (const s of n[a]) {
      if (o.has(`${a}>${s}`)) continue;
      const l = [];
      let c = a, p = s, d = !1;
      for (let h = 0; h <= i.length * i.length + 4; h++) {
        o.add(`${c}>${p}`), l.push(c);
        const u = n[p], f = u.indexOf(c), g = u[(f - 1 + u.length) % u.length];
        if (c = p, p = g, c === a && p === s) {
          d = !0;
          break;
        }
      }
      d && l.length >= 3 && r.push(l.map((h) => ({ x: i[h].x, y: i[h].y })));
    }
  return r;
}
function qf(e, t, i) {
  for (let n = 0, o = e.length - 1; n < e.length; o = n++)
    for (const r of t)
      if (!ie(r) && Uf(r.x, r.y, e[o], e[n]) <= i)
        return !0;
  return !1;
}
function Gf(e, t, i = {}) {
  const n = zn(i.weldEps, le), o = zn(i.openingEps, ke), r = zn(i.minArea, Bf);
  if (e.length < 3) return [];
  const a = Ao(
    e.map((l) => ({ a: { x: l.x1, y: l.y1 }, b: { x: l.x2, y: l.y2 } })),
    n
  );
  return us(a, n).map((l) => ({ ring: l, area: wt(l) })).filter((l) => l.area >= r && !qf(l.ring, t, o)).sort((l, c) => c.area - l.area).map((l) => l.ring);
}
const Lr = /* @__PURE__ */ new WeakMap();
function fs(e, t) {
  const i = Lr.get(e);
  if (i && i.openings === t) return i.out;
  const n = Gf(e, t);
  return Lr.set(e, { openings: t, out: n }), n;
}
function Kf(e, t = () => !0) {
  const i = Ao(e.map((s) => ({ a: { x: s.x1, y: s.y1 }, b: { x: s.x2, y: s.y2 } })), le), n = [], o = (s) => {
    const l = n.find((p) => Math.hypot(s.x - p.p.x, s.y - p.p.y) <= le);
    if (l) return l;
    const c = { p: s, rays: [] };
    return n.push(c), c;
  }, r = /* @__PURE__ */ new Set(), a = [];
  for (const s of i) {
    const l = e.find((y) => {
      const b = y.x2 - y.x1, k = y.y2 - y.y1, S = Math.hypot(b, k);
      return S ? [s.a, s.b].every((x) => {
        const $ = ((x.x - y.x1) * b + (x.y - y.y1) * k) / S;
        return $ >= -le && $ <= S + le && Math.abs((x.x - y.x1) * k - (x.y - y.y1) * b) / S <= le;
      }) : !1;
    });
    if (!l) continue;
    const c = o(s.a), p = o(s.b);
    if (c === p) continue;
    const d = [n.indexOf(c), n.indexOf(p)].sort((y, b) => y - b).join(":");
    if (r.has(d)) continue;
    r.add(d);
    const h = { ...l, x1: c.p.x, y1: c.p.y, x2: p.p.x, y2: p.p.y }, u = Math.hypot(h.x2 - h.x1, h.y2 - h.y1), f = (h.x2 - h.x1) / u, g = (h.y2 - h.y1) / u;
    c.rays.push({ wall: h, start: !0, dx: f, dy: g, half: h.thickness / 2 }), p.rays.push({ wall: h, start: !1, dx: -f, dy: -g, half: h.thickness / 2 }), a.push(h);
  }
  for (const { p: s, rays: l } of n) for (const c of new Set(l.map((p) => p.wall.kind ?? "wall"))) {
    const p = l.filter((f) => (f.wall.kind ?? "wall") === c && t(f.wall, f.start));
    if (p.length < 2) continue;
    p.sort((f, g) => Math.atan2(f.dy, f.dx) - Math.atan2(g.dy, g.dx));
    const d = (f, g) => {
      const y = { x: s.x - f.dy * f.half, y: s.y + f.dx * f.half }, b = { x: s.x + g.dy * g.half, y: s.y - g.dx * g.half }, k = f.dx * g.dy - f.dy * g.dx;
      if (Math.abs(k) > 1e-6) {
        const S = ((b.x - y.x) * g.dy - (b.y - y.y) * g.dx) / k, x = { x: y.x + f.dx * S, y: y.y + f.dy * S };
        if (Math.hypot(x.x - s.x, x.y - s.y) <= 4 * Math.max(f.half, g.half)) return x;
      }
      return { x: (y.x + b.x) / 2, y: (y.y + b.y) / 2 };
    }, h = p.map((f, g) => d(f, p[(g + 1) % p.length])), u = h.reduce((f, g) => ({ x: f.x + g.x / h.length, y: f.y + g.y / h.length }), { x: 0, y: 0 });
    p.forEach((f, g) => {
      const y = h[g], b = h[(g + p.length - 1) % p.length], k = p.length > 2 ? [u] : [];
      f.start ? f.wall.start = [y, ...k, b] : f.wall.end = [b, ...k, y];
    });
  }
  return a;
}
function Xf(e) {
  return e.base.reduce((t, i) => t + i.x + i.y, 0) / (e.base.length || 1);
}
const Z = 1e-7, ms = (e, t) => e.x * t.x + e.y * t.y + e.z * t.z;
function Yf(e) {
  return e.vertices ?? e.base.flatMap((t) => [{ ...t, z: e.z0 }, { ...t, z: e.z1 }]);
}
function Zf(e) {
  const t = [...e].sort((o, r) => o.x - r.x || o.y - r.y), i = (o, r, a) => (r.x - o.x) * (a.y - o.y) - (r.y - o.y) * (a.x - o.x), n = (o) => {
    const r = [];
    for (const a of o) {
      for (; r.length > 1 && i(r[r.length - 2], r[r.length - 1], a) <= Z; ) r.pop();
      r.push(a);
    }
    return r.slice(0, -1);
  };
  return [...n(t), ...n(t.reverse())];
}
function Fr(e, t) {
  const i = e.map((n) => ms(n, t));
  return [Math.min(...i), Math.max(...i)];
}
function Qf(e) {
  const t = [{ x: 0, y: 0, z: 1 }];
  for (let i = 0; i < e.base.length; i++) {
    const n = e.base[i], o = e.base[(i + 1) % e.base.length];
    t.push({ x: o.y - n.y, y: n.x - o.x, z: 0 });
  }
  if (e.vertices && e.vertices.length >= 3) {
    const [i, n, o] = e.vertices, r = { x: n.x - i.x, y: n.y - i.y, z: n.z - i.z }, a = { x: o.x - i.x, y: o.y - i.y, z: o.z - i.z };
    t.push({ x: r.y * a.z - r.z * a.y, y: r.z * a.x - r.x * a.z, z: r.x * a.y - r.y * a.x });
  }
  return t.filter((i) => Math.hypot(i.x, i.y, i.z) > Z).map((i) => {
    const n = Math.hypot(i.x, i.y, i.z);
    return { x: i.x / n, y: i.y / n, z: i.z / n };
  });
}
function gs(e, t) {
  if (e.length < 3 || t.length < 3) return !1;
  for (const i of [e, t]) for (let n = 0; n < i.length; n++) {
    const o = i[n], r = i[(n + 1) % i.length], a = r.y - o.y, s = o.x - r.x, l = e.map((p) => p.x * a + p.y * s), c = t.map((p) => p.x * a + p.y * s);
    if (Math.max(...l) <= Math.min(...c) + Z || Math.max(...c) <= Math.min(...l) + Z) return !1;
  }
  return !0;
}
function Jf(e) {
  const t = (n, o) => n.map((r) => ({ ...r, z: o })), i = [];
  if (e.kind === "glass" || e.kind === "panel" || e.kind === "opening-hit") {
    const [n, o] = e.base;
    i.push(e.vertices ?? [
      { ...n, z: e.z0 },
      { ...o, z: e.z0 },
      { ...o, z: e.z1 },
      { ...n, z: e.z1 }
    ]);
  } else {
    i.push(t(e.base, e.z1));
    const n = e.base.reduce((o, r) => ({ x: o.x + r.x / e.base.length, y: o.y + r.y / e.base.length }), { x: 0, y: 0 });
    for (let o = 0; o < e.base.length; o++) {
      if (e.hiddenEdges?.includes(o)) continue;
      const r = e.base[o], a = e.base[(o + 1) % e.base.length];
      let s = a.y - r.y, l = r.x - a.x;
      s * (n.x - r.x) + l * (n.y - r.y) > 0 && (s = -s, l = -l), s + l > 0 && i.push([...t([r, a], e.z0), ...t([a, r], e.z1)]);
    }
  }
  return i.flatMap((n) => {
    if (n.length < 3) return [];
    const [o, r, a] = n, s = { x: r.x - o.x, y: r.y - o.y, z: r.z - o.z }, l = { x: a.x - o.x, y: a.y - o.y, z: a.z - o.z }, c = { x: s.y * l.z - s.z * l.y, y: s.z * l.x - s.x * l.z, z: s.x * l.y - s.y * l.x }, p = c.x + c.y + c.z;
    return Math.abs(p) <= Z ? [] : [{
      polygon: n.map((d) => ({ x: d.x - d.z, y: d.y - d.z })),
      normal: c,
      distance: ms(c, o),
      toward: p
    }];
  });
}
function em(e, t) {
  let i = e;
  const n = t.reduce((o, r, a) => {
    const s = t[(a + 1) % t.length];
    return o + r.x * s.y - r.y * s.x;
  }, 0);
  for (let o = 0; o < t.length && i.length; o++) {
    const r = t[o], a = t[(o + 1) % t.length], s = (c) => Math.sign(n) * ((a.x - r.x) * (c.y - r.y) - (a.y - r.y) * (c.x - r.x)), l = [];
    for (let c = 0; c < i.length; c++) {
      const p = i[c], d = i[(c + 1) % i.length], h = s(p), u = s(d);
      if (h >= -Z && l.push(p), h > Z && u < -Z || h < -Z && u > Z) {
        const f = h / (h - u);
        l.push({ x: p.x + (d.x - p.x) * f, y: p.y + (d.y - p.y) * f });
      }
    }
    i = l;
  }
  return i;
}
function tm(e, t) {
  let i = 0;
  const n = (o, r) => (o.distance - o.normal.x * r.x - o.normal.y * r.y) / o.toward;
  for (const o of e) for (const r of t) {
    if (!gs(o.polygon, r.polygon)) continue;
    const a = em(o.polygon, r.polygon);
    if (a.length < 3) continue;
    const s = a.map((d) => n(o, d) - n(r, d)), l = Math.min(...s), c = Math.max(...s);
    if (l < -Z && c > Z) return 0;
    const p = l < -Z ? 1 : c > Z ? -1 : 0;
    if (p && i && i !== p) return 0;
    i ||= p;
  }
  return i;
}
function im(e) {
  const t = e.map((o, r) => {
    const a = Yf(o), s = Zf(a.map((l) => ({ x: l.x - l.z, y: l.y - l.z })));
    return {
      s: o,
      i: r,
      vs: a,
      shadow: s,
      axes: Qf(o),
      faces: Jf(o),
      next: /* @__PURE__ */ new Set(),
      incoming: 0,
      depth: Xf(o),
      xmin: Math.min(...s.map((l) => l.x)),
      xmax: Math.max(...s.map((l) => l.x)),
      ymin: Math.min(...s.map((l) => l.y)),
      ymax: Math.max(...s.map((l) => l.y))
    };
  });
  for (let o = 0; o < t.length; o++) for (let r = o + 1; r < t.length; r++) {
    const a = t[o], s = t[r];
    if (a.xmax <= s.xmin + Z || s.xmax <= a.xmin + Z || a.ymax <= s.ymin + Z || s.ymax <= a.ymin + Z || !gs(a.shadow, s.shadow)) continue;
    let l = 0;
    for (const c of [...a.axes, ...s.axes]) {
      const p = c.x + c.y + c.z;
      if (Math.abs(p) <= Z) continue;
      const [d, h] = Fr(a.vs, c), [u, f] = Fr(s.vs, c);
      if (!(h - d <= Z && f - u <= Z && Math.abs(d - u) <= Z) && (l = h <= u + Z ? p : f <= d + Z ? -p : 0, !!l))
        break;
    }
    if (l ||= tm(a.faces, s.faces), l) {
      const [c, p] = l > 0 ? [a, s] : [s, a];
      c.next.add(p.i), p.incoming++;
    }
  }
  const i = [...t].sort((o, r) => o.depth - r.depth || o.i - r.i), n = [];
  for (; i.length; ) {
    const o = i.findIndex((a) => a.incoming === 0), [r] = i.splice(o < 0 ? 0 : o, 1);
    n.push(r.s);
    for (const a of r.next) t[a].incoming--;
  }
  return n;
}
const ys = 60, To = 400, Kn = 0.4, nm = 0.5, Xn = 0.35, Yn = 0.85, om = 32, rm = 0.18, am = 0.34, St = Math.sqrt(3) / 2, Zt = 0.5, bs = 0.26;
function Qt(e) {
  return e === "iso" || e === "3d" ? "iso" : "plan";
}
function De(e, t = ys) {
  return Math.min(To, Math.max(0, O(e, t)));
}
function Co(e, t) {
  const i = De(t);
  return De(e.height, i) * (e.kind === "railing" ? nm : 1);
}
function vs(e, t) {
  const i = De(e);
  return Math.max(i, ...t.map((n) => Co(n, i)));
}
function ws(e) {
  return Math.min(1, Math.max(0, O(e, 1)));
}
function xt(e) {
  if (e.projection !== "iso") return { w: e.w, h: e.h };
  const t = e.orbitSpan ?? e.w + e.h;
  return { w: t * St + 2 * (e.padding ?? 0), h: t * Zt + e.wallHeight + 2 * (e.padding ?? 0) };
}
function Mt(e, t, i, n = 0) {
  if (i.projection !== "iso") return { x: e, y: t };
  const o = ((i.orbitSpan ?? i.w + i.h) - i.w - i.h) / 2;
  return {
    x: (e - t) * St + (i.h + o) * St + (i.padding ?? 0),
    y: (e + t + o) * Zt + i.wallHeight - n + (i.padding ?? 0)
  };
}
function sm(e, t, i) {
  if (i.projection !== "iso") return { x: e, y: t };
  const n = (e - t) * St, o = (e + t) * Zt, r = Math.hypot(n, o) || 1;
  return { x: n / r, y: o / r };
}
function xs(e) {
  if (e.projection !== "iso") return "";
  const t = (n) => String(+n.toFixed(6)), i = Mt(0, 0, e);
  return `matrix(${t(St)} ${t(Zt)} ${t(-St)} ${t(Zt)} ${t(i.x)} ${t(i.y)})`;
}
function me(e, t) {
  return { x: e.x - t, y: e.y - t };
}
function _s(e, t) {
  switch (t) {
    case 90:
      return { x: -e, y: e };
    case 180:
      return { x: e, y: e };
    case 270:
      return { x: e, y: -e };
    default: {
      const { cos: i, sin: n } = un(t);
      return { x: -e * (i + n), y: e * (n - i) };
    }
  }
}
function lm(e, t) {
  if (e.type === "skylight") return;
  const i = e.angle * Math.PI / 180;
  let n, o = -1 / 0;
  for (const r of t) {
    const a = r.x2 - r.x1, s = r.y2 - r.y1, l = Math.hypot(a, s);
    if (!(l > 1e-6)) continue;
    const c = { x: a / l, y: s / l };
    if (Math.abs(c.x * Math.sin(i) - c.y * Math.cos(i)) > bs) continue;
    const d = e.x - r.x1, h = e.y - r.y1, u = d * c.x + h * c.y;
    if (u < -e.length / 2 || u > l + e.length / 2) continue;
    if (Math.abs(d * -c.y + h * c.x) <= ke) {
      const g = Math.min(l, u + e.length / 2) - Math.max(0, u - e.length / 2);
      g > o && (o = g, n = r);
    }
  }
  return n;
}
function $s(e, t, i) {
  const n = De(i), o = lm(e, t);
  return o ? Co(o, n) : n;
}
function Dr(e, t, i, n) {
  const o = [];
  for (const a of t) {
    if (ie(a)) continue;
    const s = a.angle * Math.PI / 180;
    if (Math.abs(i.x * Math.sin(s) - i.y * Math.cos(s)) > bs) continue;
    const c = a.x - e.x1, p = a.y - e.y1, d = c * i.x + p * i.y;
    if (Math.abs(c * -i.y + p * i.x) > ke) continue;
    const u = Math.max(0, d - a.length / 2), f = Math.min(n, d + a.length / 2);
    f - u <= 0 || o.push({ s0: u, s1: f, type: a.type === "window" ? "window" : "door" });
  }
  o.sort((a, s) => a.s0 - s.s0);
  const r = [];
  for (const a of o) {
    const s = r[r.length - 1];
    s && a.s0 <= s.s1 ? s.s1 = Math.max(s.s1, a.s1) : r.push({ ...a });
  }
  return r;
}
function ks(e, t, i, n = !0) {
  const o = De(i), r = [], a = Kf(e, (s, l) => {
    const c = Math.hypot(s.x2 - s.x1, s.y2 - s.y1), p = { x: (s.x2 - s.x1) / c, y: (s.y2 - s.y1) / c };
    return !Dr(s, t, p, c).some((d) => l ? d.s0 <= 1e-6 : d.s1 >= c - 1e-6);
  });
  for (const s of a) {
    const l = s.x2 - s.x1, c = s.y2 - s.y1, p = Math.hypot(l, c);
    if (!(p > 1e-6)) continue;
    const d = Co(s, o), h = s.kind === "railing" ? "railing" : "wall", u = { x: l / p, y: c / p }, f = { x: -u.y, y: u.x }, g = s.thickness / 2, y = (M) => ({ x: s.x1 + u.x * M, y: s.y1 + u.y * M }), b = (M, P) => {
      const A = y(M), I = y(P), C = M <= 0 && s.start ? s.start : [
        { x: A.x + f.x * g, y: A.y + f.y * g },
        { x: A.x - f.x * g, y: A.y - f.y * g }
      ], L = P >= p && s.end ? s.end : [
        { x: I.x + f.x * g, y: I.y + f.y * g },
        { x: I.x - f.x * g, y: I.y - f.y * g }
      ];
      return {
        base: [C[0], ...L, ...C.slice(1).reverse()],
        endEdges: L.slice(1).map((B, j) => j + 1),
        startEdges: C.slice(1).map((B, j) => L.length + 1 + j)
      };
    }, k = (M, P, A, I, C = 0) => {
      const L = Math.max(1, Math.ceil((P - M) / om)), B = (P - M) / L;
      for (let j = 0; j < L; j++) {
        const q = b(M + B * j, M + B * (j + 1));
        r.push({
          kind: I,
          id: s.id,
          base: q.base,
          z0: C,
          z1: A,
          hiddenEdges: [
            ...j < L - 1 || P >= p && s.end ? q.endEdges : [],
            ...j > 0 || M <= 0 && s.start ? q.startEdges : []
          ]
        });
      }
    }, S = Dr(s, t, u, p);
    let x = 0;
    const $ = s.kind !== "railing" && d > ys;
    for (const M of S) {
      if (M.s0 > x && k(x === 0 ? -g : x, M.s0, d, h), M.type === "window" && (k(M.s0, M.s1, d * Xn, "sill"), n && r.push({
        kind: "glass",
        id: s.id,
        base: [y(M.s0), y(M.s1)],
        z0: d * Xn,
        z1: d * Yn
      })), $) {
        const P = d * Yn;
        d > P + 1e-4 && k(M.s0, M.s1, d, h, P);
      }
      x = M.s1;
    }
    x < p && k(x === 0 ? -g : x, p + g, d, h);
  }
  return r;
}
function Ss(e, t, i, n, o) {
  const r = (e.angle ?? 0) * Math.PI / 180, a = Math.cos(r), s = Math.sin(r), l = e.w / 2, c = e.h / 2, p = [
    [-l, -c],
    [l, -c],
    [l, c],
    [-l, c]
  ].map(([d, h]) => t(e.x + d * a - h * s, e.y + d * s + h * a));
  return { kind: "furniture", id: e.id, base: p, z0: 0, z1: i, color: n, top: o };
}
const Rr = (e) => String(Math.round(e * 100) / 100), On = (e) => e.map((t) => `${Rr(t.x)},${Rr(t.y)}`).join(" ");
function Ms(e, t = (i, n) => n) {
  return _`<g class="fp-iso">${im(e).map((i) => t(i, cm(i)))}</g>`;
}
function cm(e) {
  const t = pe(e.id) ?? m;
  if (e.kind === "glass" || e.kind === "panel" || e.kind === "opening-hit") {
    const [s, l] = e.base;
    return _`<polygon class=${`fp-iso-${e.kind}${e.glazed ? " fp-iso-glazed" : ""}`} data-id=${t}
                        style=${e.color ? `--fp-iso-color:${e.color}` : m}
                        points=${On(e.vertices ? e.vertices.map((c) => me(c, c.z)) : [me(s, e.z0), me(l, e.z0), me(l, e.z1), me(s, e.z1)])} />`;
  }
  const i = e.base.length;
  let n = 0, o = 0;
  for (const s of e.base)
    n += s.x / i, o += s.y / i;
  const r = [];
  for (let s = 0; s < i; s++) {
    if (e.hiddenEdges?.includes(s)) continue;
    const l = e.base[s], c = e.base[(s + 1) % i];
    let p = c.y - l.y, d = -(c.x - l.x);
    p * (n - l.x) + d * (o - l.y) > 0 && (p = -p, d = -d), !(p + d <= 0) && r.push({
      pts: On([me(l, e.z0), me(c, e.z0), me(c, e.z1), me(l, e.z1)]),
      shade: Math.abs(p) >= Math.abs(d) ? rm : am
    });
  }
  const a = On(e.base.map((s) => me(s, e.z1)));
  return _`<g class=${`fp-iso-solid fp-iso-${e.kind}`} data-id=${t}
                style=${e.color ? `--fp-iso-color:${e.color}` : m}>
    ${r.map(
    (s) => _`<polygon class="fp-iso-face" points=${s.pts} /><polygon class="fp-iso-shade" points=${s.pts} opacity=${s.shade} />`
  )}
    <polygon class="fp-iso-face fp-iso-top" points=${a} />
    ${e.top ?? m}
  </g>`;
}
const he = Math.PI / 180, dm = 864e5, hm = 2440588, pm = 2451545, hi = 23.4397 * he, Hr = 149598e3, um = 6378.14;
function Es(e) {
  return e / dm - 0.5 + hm - pm;
}
function As(e, t) {
  return {
    ra: Math.atan2(
      Math.sin(e) * Math.cos(hi) - Math.tan(t) * Math.sin(hi),
      Math.cos(e)
    ),
    dec: Math.asin(
      Math.sin(t) * Math.cos(hi) + Math.cos(t) * Math.sin(hi) * Math.sin(e)
    )
  };
}
function fm(e) {
  const t = (357.5291 + 0.98560028 * e) * he, i = (1.9148 * Math.sin(t) + 0.02 * Math.sin(2 * t) + 3e-4 * Math.sin(3 * t)) * he, n = 102.9372 * he;
  return As(t + i + n + Math.PI, 0);
}
function Ts(e) {
  const t = (218.316 + 13.176396 * e) * he, i = (134.963 + 13.064993 * e) * he, n = (93.272 + 13.22935 * e) * he, o = (297.85 + 12.190749 * e) * he, r = (357.5291 + 0.98560028 * e) * he, [a, s, l] = [i, n, o], c = t + he * (6.289 * Math.sin(a) + 1.274 * Math.sin(2 * l - a) + 0.658 * Math.sin(2 * l) + 0.214 * Math.sin(2 * a) - 0.186 * Math.sin(r) - 0.114 * Math.sin(2 * s)), p = he * (5.128 * Math.sin(s) + 0.281 * Math.sin(a + s) + 0.278 * Math.sin(a - s) + 0.173 * Math.sin(2 * l - s));
  return {
    ...As(c, p),
    distance: 385001 - 20905 * Math.cos(a) - 3699 * Math.cos(2 * l - a) - 2956 * Math.cos(2 * l)
  };
}
function mm(e, t, i) {
  const n = Es(e), o = t * he, r = Ts(n), a = (280.16 + 360.9856235 * n) * he + i * he - r.ra, s = Math.asin(
    Math.sin(o) * Math.sin(r.dec) + Math.cos(o) * Math.cos(r.dec) * Math.cos(a)
  ), l = s - Math.asin(um / r.distance) * Math.cos(s), c = Math.max(0, l), p = 2967e-7 / Math.tan(c + 312536e-8 / (c + 0.08901179));
  return {
    bearing: ((Math.atan2(
      Math.sin(a),
      Math.cos(a) * Math.sin(o) - Math.tan(r.dec) * Math.cos(o)
    ) / he + 180) % 360 + 360) % 360,
    altitude: (l + p) / he
  };
}
function gm(e) {
  const t = Es(e), i = fm(t), n = Ts(t), o = Math.acos(
    Math.sin(i.dec) * Math.sin(n.dec) + Math.cos(i.dec) * Math.cos(n.dec) * Math.cos(i.ra - n.ra)
  ), r = Math.atan2(
    Hr * Math.sin(o),
    n.distance - Hr * Math.cos(o)
  );
  return (1 + Math.cos(r)) / 2;
}
const X = 8, Cs = 0.05, Bt = "—";
function Jt(e, t) {
  if (!t || !e) return Bt;
  const i = e.states[t];
  return i ? e.formatEntityState(i) : Bt;
}
function Is(e, t, i) {
  if (e.formatEntityState !== t.formatEntityState || e.formatEntityAttributeValue !== t.formatEntityAttributeValue) return !0;
  for (const n of i)
    if (e.states[n] !== t.states[n]) return !0;
  return !1;
}
function ym(e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of Ce(e))
    for (const n of i.furniture ?? [])
      for (const o of ["tap", "hold", "double_tap"]) {
        const r = Vt(n, o), a = r && hs({ entity: r.entity }, r.config);
        a && t.add(a);
      }
  return t;
}
function yt(e) {
  const t = /* @__PURE__ */ new Set();
  (e.sunDimming || e.ambientDaylight || e.sunlight && !ht(e)) && t.add("sun.sun");
  const i = ti(e);
  i && t.add(i);
  for (const n of Ce(e)) {
    for (const o of n.openings)
      o.entity && t.add(o.entity), o.shutterEntity && t.add(o.shutterEntity), o.secondaryEntity && t.add(o.secondaryEntity), o.shutterSecondaryEntity && t.add(o.shutterSecondaryEntity);
    for (const o of n.items) {
      o.entity && t.add(o.entity), o.hideEntity && t.add(o.hideEntity), o.hideStateEntity && t.add(o.hideStateEntity), o.hideBadgeEntity && t.add(o.hideBadgeEntity);
      for (const r of Ge(o)) r.entity && t.add(r.entity);
    }
    for (const o of n.texts)
      o.entity && t.add(o.entity);
    for (const o of n.furniture)
      o.entity && t.add(o.entity);
    for (const o of n.areas)
      o.entity && t.add(o.entity);
    for (const o of n.trackers)
      for (const r of [o.xSensor, o.ySensor])
        r?.entity && t.add(r.entity), r?.presence?.entity && t.add(r.presence.entity);
  }
  return t;
}
function Io(e, t, i) {
  if (!t || !e) return Bt;
  const n = e.states[t];
  if (!n) return Bt;
  const o = e.formatEntityAttributeValue;
  if (typeof o == "function") return o(n, i);
  const r = n.attributes?.[i];
  return r == null || r === "" ? Bt : String(r);
}
function bm(e, t, i) {
  const n = i.entity || (i.attribute ? t.entity : void 0);
  return n ? i.attribute ? Io(e, n, i.attribute) : Jt(e, n) : "";
}
function Ge(e) {
  return [...e.secondaryEntity || e.secondaryAttribute ? [{ entity: e.secondaryEntity, attribute: e.secondaryAttribute }] : [], ...e.readings ?? []];
}
function vm(e, t) {
  return t.attribute ? Io(e, t.entity, t.attribute) : Jt(e, t.entity);
}
function Po(e, t) {
  if (!t.entity) return t.text ?? "";
  const i = t.attribute ? Io(e, t.entity, t.attribute) : Jt(e, t.entity);
  return t.text ? `${t.text} ${i}` : i;
}
function gn(e, t) {
  return Ps(e, t)?.color;
}
function Ps(e, t) {
  if (!e?.length) return;
  const i = typeof t == "number" ? t : Number(t), n = typeof t != "boolean" && t !== "" && t != null && Number.isFinite(i), o = t == null ? "" : String(t).trim().toLowerCase();
  let r, a, s;
  for (const l of e)
    !l || typeof l != "object" || typeof l.color != "string" || (typeof l.state == "string" && l.state !== "" ? r === void 0 && o !== "" && l.state.trim().toLowerCase() === o && (r = l) : typeof l.above == "number" ? n && i > l.above && (!a || l.above > (a.above ?? -1 / 0)) && (a = l) : s === void 0 && (s = l));
  return r ?? a ?? s;
}
function Nr(e, t) {
  if (!e.entity) return;
  const i = gn(e.stateColor, t);
  if (i) return R(i);
  if (e.activeColor && He(e.entity, t)) return R(e.activeColor);
}
function jr(e, t) {
  if (!e.entity) return;
  const i = gn(e.stateColor, t);
  if (i) return R(i);
  if (e.activeColor && He(e.entity, t)) return R(e.activeColor);
}
function wm(e) {
  if (!e) return !1;
  const t = e.attributes ?? {}, i = t.supported_color_modes;
  if (Array.isArray(i) && i.length > 0) return !0;
  if (typeof t.unit_of_measurement == "string" && t.unit_of_measurement.length > 0 || t.hvac_modes != null) return !1;
  const n = t.device_class;
  return n === "outlet" || n === "switch" ? !0 : typeof n == "string" && n.length > 0 ? !1 : e.state === "on" || e.state === "off";
}
function Wi(e, t) {
  if (!t || t.state !== "on") return;
  const i = t.attributes ?? {}, n = i.brightness, o = typeof n == "number" && Number.isFinite(n) ? Math.max(0, Math.min(255, n)) : void 0, r = o === void 0 ? Ni : vr + (Ni - vr) * (o / 255), a = O(e.glowRadius, cn) * (o === void 0 ? 1 : wr + (1 - wr) * (o / 255)), s = i.rgb_color;
  if (Array.isArray(s) && s.length >= 3) {
    const [l, c, p] = s;
    if ([l, c, p].every((d) => typeof d == "number" && Number.isFinite(d))) {
      const d = (u) => Math.max(0, Math.min(255, Math.round(u))), h = R(`rgb(${d(l)}, ${d(c)}, ${d(p)})`);
      if (h) return { color: h, opacity: r, radius: a };
    }
  }
  return { color: fe(e.glowColor, ns), opacity: r, radius: a };
}
function zs(e) {
  if (!e || e.state !== "on") return;
  const t = e.attributes ?? {}, i = t.rgb_color;
  if (!Array.isArray(i) || i.length < 3) return;
  const [n, o, r] = i;
  if (![n, o, r].every((p) => typeof p == "number" && Number.isFinite(p))) return;
  const a = t.brightness, s = typeof a == "number" && Number.isFinite(a) ? Math.max(0, Math.min(255, a)) : void 0, l = s === void 0 ? 1 : xr + (1 - xr) * (s / 255), c = (p) => Math.max(0, Math.min(255, Math.round(p * l)));
  return R(`rgb(${c(n)}, ${c(o)}, ${c(r)})`);
}
function Wr(e, t) {
  return t ? Wi(e, t) : {
    color: fe(e.glowColor, ns),
    opacity: Ni,
    radius: O(e.glowRadius, cn)
  };
}
function yn(e, t, i) {
  const n = i.x2 - i.x1, o = i.y2 - i.y1, r = n * n + o * o, a = r === 0 ? 0 : Math.max(0, Math.min(1, ((e - i.x1) * n + (t - i.y1) * o) / r)), s = i.x1 + a * n, l = i.y1 + a * o;
  return Math.hypot(e - s, t - l);
}
function zo(e, t, i, n, o) {
  const r = o.x2 - o.x1, a = o.y2 - o.y1, s = i * a - n * r;
  if (Math.abs(s) < 1e-12) return;
  const l = o.x1 - e, c = o.y1 - t, p = (l * a - c * r) / s, d = (l * n - c * i) / s;
  if (!(p <= 1e-9 || d < 0 || d > 1))
    return p;
}
function xm(e, t, i, n, o) {
  const r = e.x2 - e.x1, a = e.y2 - e.y1, s = [-r, r, -a, a], l = [e.x1 - t, n - e.x1, e.y1 - i, o - e.y1];
  let c = 0, p = 1;
  for (let d = 0; d < 4; d++) {
    if (s[d] === 0) {
      if (l[d] < 0) return;
      continue;
    }
    const h = l[d] / s[d];
    if (s[d] < 0) {
      if (h > p) return;
      h > c && (c = h);
    } else {
      if (h < c) return;
      h < p && (p = h);
    }
  }
  return {
    ...e,
    x1: e.x1 + c * r,
    y1: e.y1 + c * a,
    x2: e.x1 + p * r,
    y2: e.y1 + p * a
  };
}
function Oo(e, t, i) {
  if (xe(e)) return 1;
  if (ne(e) === "fixed") return 0;
  const n = Math.max(0, Math.min(1, t)), o = Math.max(0, Math.min(1, i ?? t));
  if (ne(e) === "swing")
    return Fe(e) === "double" ? (n + o) / 2 : n * xn(e);
  if (ne(e) === "awning") return n;
  switch (ai(e)) {
    case "biparting":
      return (n + o) / 2;
    case "biparting-bypass":
    case "converging":
      return (n + o) / 4;
    default:
      return n;
  }
}
function Lo(e, t, i, n) {
  return n !== void 0 && n <= 0 ? [0, 0] : Yi(e) ? [0, 1] : _m(e, t, i);
}
function _m(e, t, i) {
  const n = Oo(e, t, i), o = [(1 - n) / 2, (1 + n) / 2];
  if (xn(e) < 1) {
    const l = [0, n];
    return e.flipH ? [1 - l[1], 1 - l[0]] : l;
  }
  if (ne(e) !== "swing" || Fe(e) !== "double") return o;
  const r = Math.max(0, Math.min(1, t)), a = Math.max(0, Math.min(1, i ?? t)), s = [0.5 - r / 2, 0.5 + a / 2];
  return e.flipH ? [1 - s[1], 1 - s[0]] : s;
}
function bn(e, t, i) {
  const n = [];
  for (const r of t) {
    if (ie(r)) continue;
    const a = i(r), s = (c) => Math.max(0, Math.min(1, c)), l = typeof a == "number" ? [(1 - s(a)) / 2, (1 + s(a)) / 2] : [s(Math.min(a[0], a[1])), s(Math.max(a[0], a[1]))];
    l[1] > l[0] && n.push({ o: r, span: l });
  }
  if (!n.length) return e;
  const o = [];
  for (const r of e) {
    const a = r.x2 - r.x1, s = r.y2 - r.y1, l = a * a + s * s;
    if (l === 0) {
      o.push(r);
      continue;
    }
    const c = Math.sqrt(l), p = [];
    for (const { o: y, span: b } of n) {
      if (yn(y.x, y.y, r) > ke) continue;
      const k = ((y.x - r.x1) * a + (y.y - r.y1) * s) / l, S = Math.cos(y.angle * Math.PI / 180) * a + Math.sin(y.angle * Math.PI / 180) * s >= 0 ? 1 : -1, x = (I) => S * (I - 0.5) * y.length / c, $ = k + x(b[0]), M = k + x(b[1]), P = Math.max(0, Math.min($, M)), A = Math.min(1, Math.max($, M));
      A > P && p.push([P, A]);
    }
    if (!p.length) {
      o.push(r);
      continue;
    }
    p.sort((y, b) => y[0] - b[0]);
    const d = [p[0]];
    for (const y of p.slice(1)) {
      const b = d[d.length - 1];
      y[0] <= b[1] ? b[1] = Math.max(b[1], y[1]) : d.push(y);
    }
    const h = (y) => ({ x: r.x1 + a * y, y: r.y1 + s * y });
    let u = 0, f = 0;
    const g = (y, b) => {
      if ((b - y) * c < X / 2) return;
      const k = h(y), S = h(b);
      o.push({ id: `${r.id}#${f++}`, x1: k.x, y1: k.y, x2: S.x, y2: S.y });
    };
    for (const [y, b] of d)
      g(u, y), u = b;
    g(u, 1);
  }
  return o;
}
function vn(e, t, i, n, o = X) {
  const r = n.filter((h) => {
    const u = yn(e, t, h);
    return u < i && u > o;
  });
  if (!r.length) return;
  const a = i * 1.01, s = [
    { id: "b1", x1: e - a, y1: t - a, x2: e + a, y2: t - a },
    { id: "b2", x1: e + a, y1: t - a, x2: e + a, y2: t + a },
    { id: "b3", x1: e + a, y1: t + a, x2: e - a, y2: t + a },
    { id: "b4", x1: e - a, y1: t + a, x2: e - a, y2: t - a }
  ], l = r.map((h) => xm(h, e - a, t - a, e + a, t + a)).filter((h) => h !== void 0);
  if (!l.length) return;
  const c = [...l, ...s], p = [];
  for (const h of c)
    for (const [u, f] of [
      [h.x1, h.y1],
      [h.x2, h.y2]
    ]) {
      const g = Math.atan2(f - t, u - e);
      for (const y of [g - 1e-4, g, g + 1e-4]) {
        const b = Math.cos(y), k = Math.sin(y);
        let S = 1 / 0;
        for (const x of c) {
          const $ = zo(e, t, b, k, x);
          $ !== void 0 && $ < S && (S = $);
        }
        S < 1 / 0 && p.push({ x: e + b * S, y: t + k * S, a: y });
      }
    }
  p.sort((h, u) => h.a - u.a);
  const d = (h) => Math.round(h * 100) / 100;
  return p.map(({ x: h, y: u }) => ({ x: d(h), y: d(u) }));
}
function Os(e, t, i, n) {
  const o = t.radius, r = st(e);
  if (r) {
    const l = n?.length ? Ls(r, o, n) : void 0;
    return Fs(r, o, t.color, t.opacity, i, l, "fp-glow");
  }
  const a = n?.length ? vn(e.x, e.y, o, n) : void 0, s = `${i}-clip`;
  return _`
    ${a ? _`<clipPath id=${s}>
                <polygon points=${a.map((l) => `${l.x},${l.y}`).join(" ")} />
              </clipPath>` : m}
    <radialGradient id=${i} gradientUnits="userSpaceOnUse"
                    cx=${e.x} cy=${e.y} r=${o}>
      <stop offset="0" stop-color=${t.color} stop-opacity=${t.opacity} />
      <stop offset="1" stop-color=${t.color} stop-opacity="0" />
    </radialGradient>
    <circle class="fp-glow" cx=${e.x} cy=${e.y} r=${o}
            fill=${`url(#${i})`}
            clip-path=${a ? `url(#${s})` : m} />`;
}
const V = (e) => Math.round(e * 100) / 100;
function st(e) {
  const t = O(e.stripLength, 0);
  if (!(t >= $o)) return;
  const i = O(e.stripAngle, 0) * Math.PI / 180, n = Math.cos(i), o = Math.sin(i), r = t / 2;
  return {
    x1: V(e.x - n * r),
    y1: V(e.y - o * r),
    x2: V(e.x + n * r),
    y2: V(e.y + o * r),
    dx: n,
    dy: o,
    length: t,
    side: e.stripSide === "left" || e.stripSide === "right" ? e.stripSide : "both"
  };
}
function $m(e, t, i, n) {
  const o = Math.atan2(n - t, i - e) * 180 / Math.PI;
  return {
    x: V((e + i) / 2),
    y: V((t + n) / 2),
    stripLength: V(Math.hypot(i - e, n - t)),
    stripAngle: V((o % 360 + 360) % 360)
  };
}
function wn(e) {
  return e.side === "right" ? { nx: -e.dy, ny: e.dx } : { nx: e.dy, ny: -e.dx };
}
const km = 16;
function Ls(e, t, i) {
  const n = Math.min(X * 1.5, e.length / 2), o = e.length - n * 2, r = o <= 0 ? 1 : Math.min(km, Math.ceil(o / Math.max(t / 2, X)) + 1), a = r > 1 ? o / (r - 1) : 0, s = e.side === "both" ? 0 : X, { nx: l, ny: c } = wn(e), p = t + Math.max(n, a / 2) + s, d = [];
  let h = !1;
  for (let u = 0; u < r; u++) {
    const f = r > 1 ? n + a * u : e.length / 2, g = e.x1 + e.dx * f + l * s, y = e.y1 + e.dy * f + c * s, b = vn(g, y, p, i);
    b && (h = !0), d.push(b ? { points: b } : { cx: V(g), cy: V(y), r: V(p) });
  }
  return h ? d : void 0;
}
function Fs(e, t, i, n, o, r, a) {
  const { nx: s, ny: l } = wn(e), { x1: c, y1: p, x2: d, y2: h, dx: u, dy: f } = e, g = e.side === "both", y = g ? t : 0, b = (I, C) => `${V(I)},${V(C)}`, k = [
    b(c - s * y, p - l * y),
    b(d - s * y, h - l * y),
    b(d + s * t, h + l * t),
    b(c + s * t, p + l * t)
  ].join(" "), S = (c + d) / 2, x = (p + h) / 2, $ = (I, C, L, B) => [
    b(S - s * y, x - l * y),
    b(S + s * t, x + l * t),
    b(I + s * t + L * t, C + l * t + B * t),
    b(I - s * y + L * t, C - l * y + B * t)
  ].join(" "), M = {
    x: V(Math.min(c, d) - t - 1),
    y: V(Math.min(p, h) - t - 1),
    w: V(Math.abs(d - c) + t * 2 + 2),
    h: V(Math.abs(h - p) + t * 2 + 2)
  }, P = `${o}-clip`, A = (I, C, L) => _`
    <radialGradient id=${`${o}-${I}`} gradientUnits="userSpaceOnUse"
                    cx=${C} cy=${L} r=${t}>
      <stop offset="0" stop-color="#fff" />
      <stop offset="1" stop-color="#000" />
    </radialGradient>`;
  return _`
    ${r ? _`<clipPath id=${P}>
                ${r.map(
    (I) => "points" in I ? _`<polygon points=${I.points.map((C) => `${C.x},${C.y}`).join(" ")} />` : _`<circle cx=${I.cx} cy=${I.cy} r=${I.r} />`
  )}
              </clipPath>` : m}
    <linearGradient id=${`${o}-run`} gradientUnits="userSpaceOnUse"
                    x1=${V(S - s * y)} y1=${V(x - l * y)}
                    x2=${V(S + s * t)} y2=${V(x + l * t)}>
      ${g ? _`<stop offset="0" stop-color="#000" />
                <stop offset="0.5" stop-color="#fff" />` : _`<stop offset="0" stop-color="#fff" />`}
      <stop offset="1" stop-color="#000" />
    </linearGradient>
    ${A("a", c, p)}
    ${A("b", d, h)}
    <clipPath id=${`${o}-ca`}><polygon points=${$(c, p, -u, -f)} /></clipPath>
    <clipPath id=${`${o}-cb`}><polygon points=${$(d, h, u, f)} /></clipPath>
    <mask id=${`${o}-fall`} maskUnits="userSpaceOnUse"
          x=${M.x} y=${M.y} width=${M.w} height=${M.h}>
      <circle cx=${c} cy=${p} r=${t} fill=${`url(#${o}-a)`} clip-path=${`url(#${o}-ca)`} />
      <circle cx=${d} cy=${h} r=${t} fill=${`url(#${o}-b)`} clip-path=${`url(#${o}-cb)`} />
      <polygon points=${k} fill=${`url(#${o}-run)`} />
    </mask>
    <g class=${a ?? m} clip-path=${r ? `url(#${P})` : m}>
      <rect x=${M.x} y=${M.y} width=${M.w} height=${M.h}
            fill=${i} fill-opacity=${n} mask=${`url(#${o}-fall)`} />
    </g>`;
}
function Ds(e, t) {
  const { nx: i, ny: n } = wn(e), o = e.side === "both" ? 0 : X;
  return _`<line class=${t ? "fp-strip on" : "fp-strip"}
                   x1=${V(e.x1 + i * o)} y1=${V(e.y1 + n * o)}
                   x2=${V(e.x2 + i * o)} y2=${V(e.y2 + n * o)}
                   style=${t ? `stroke: ${t}` : m} />`;
}
function Sm(e, t) {
  const { nx: i, ny: n } = wn(e), { x1: o, y1: r, x2: a, y2: s, dx: l, dy: c } = e, p = (u, f) => `${V(u)} ${V(f)}`, d = e.side === "right" ? 0 : 1, h = (u, f) => `A ${V(t)} ${V(t)} 0 0 ${d} ${p(u, f)}`;
  return e.side === "both" ? [
    `M ${p(o + i * t, r + n * t)}`,
    `L ${p(a + i * t, s + n * t)}`,
    h(a - i * t, s - n * t),
    `L ${p(o - i * t, r - n * t)}`,
    h(o + i * t, r + n * t),
    "Z"
  ].join(" ") : [
    `M ${p(o - l * t, r - c * t)}`,
    h(o + i * t, r + n * t),
    `L ${p(a + i * t, s + n * t)}`,
    h(a + l * t, s + c * t),
    "Z"
  ].join(" ");
}
function Mm(e, t, i, n, o, r, a = m) {
  const s = e.map((c) => {
    if (!c.glow) return;
    const p = Wi(c, t?.[c.entity]);
    if (p)
      return {
        // Normalized against the glow's own ceiling, so a full-brightness lamp
        // clears the dim entirely and a dim one clears proportionally.
        strength: Math.max(0, Math.min(1, p.opacity / Ni)),
        // Straight off the paint, so the clearing tracks the pool as it shrinks
        // with brightness (issue #123) instead of staying at the configured size.
        radius: p.radius
      };
  });
  if (!s.some((c) => c !== void 0) && a === m) return m;
  const l = X;
  return _`
    <defs>
      <mask id=${o} maskUnits="userSpaceOnUse"
            x=${-l} y=${-l} width=${i + l * 2} height=${n + l * 2}>
        <rect x=${-l} y=${-l} width=${i + l * 2} height=${n + l * 2}
              fill="white" />
        ${e.map((c, p) => {
    const d = s[p];
    if (d === void 0) return m;
    const { strength: h, radius: u } = d, f = `${o}-${p}`, g = st(c);
    if (g) {
      const k = r?.length ? Ls(g, u, r) : void 0;
      return Fs(g, u, "#000", h, f, k);
    }
    const y = r?.length ? vn(c.x, c.y, u, r) : void 0, b = `${f}-clip`;
    return _`
            ${y ? _`<clipPath id=${b}>
                        <polygon points=${y.map((k) => `${k.x},${k.y}`).join(" ")} />
                      </clipPath>` : m}
            <radialGradient id=${f} gradientUnits="userSpaceOnUse"
                            cx=${c.x} cy=${c.y} r=${u}>
              <stop offset="0" stop-color="#000" stop-opacity=${h} />
              <stop offset="1" stop-color="#000" stop-opacity="0" />
            </radialGradient>
            <circle cx=${c.x} cy=${c.y} r=${u} fill=${`url(#${f})`}
                    clip-path=${y ? `url(#${b})` : m} />`;
  })}
        ${a}
      </mask>
    </defs>`;
}
function Rs(e, t, i, n, o = $e) {
  const r = X;
  return _`
    <defs>
      <mask id=${n} maskUnits="userSpaceOnUse"
            x=${-r} y=${-r} width=${t + r * 2} height=${i + r * 2}>
        <rect x=${-r} y=${-r} width=${t + r * 2} height=${i + r * 2}
              fill="white" />
        ${e.map((a) => {
    const s = 1 - Xc;
    return Em(a, "#000", "#000", s, o);
  })}
      </mask>
    </defs>`;
}
function Em(e, t, i, n, o = $e) {
  const r = t;
  let a = ri(o, e.type) ?? ls;
  a = structuredClone(a), a.parts = a.parts.map((c) => (c.style.fillOpacity = Am(c) ? n : 0, c));
  const s = cs(a, e.w, e.h, r, i), l = e.hand === "left" ? " scale(-1 1)" : "";
  return _`<g class=${`fp-furniture-mask fp-furniture-mask-${pe(e.type) ?? "unknown"}`}
                transform="translate(${e.x} ${e.y}) rotate(${e.angle ?? 0})${l}">${s}</g>`;
}
function Am(e) {
  switch (e.kind) {
    case "rect":
    case "circle":
    case "ellipse":
      return !0;
    case "poly":
      return e.closed;
    case "path": {
      let t = !1;
      for (const i of e.cmds)
        if (i[0] === "M") {
          if (t) return !1;
          t = !0;
        } else i[0] === "Z" && (t = !1);
      return !t;
    }
    case "line":
      return !1;
  }
}
function Hs(e, t, i) {
  if (e.enableHideByEntity) {
    const n = e.hideEntity || e.entity;
    let o = t;
    return n && i && i.states[n] && (o = e.hideAttribute ? i.states[n].attributes[e.hideAttribute] : i.states[n].state), Fo(
      o,
      e.hideMode,
      e.hideState,
      e.hideOperator,
      e.hideThreshold,
      e.hideInvert
    );
  }
  return e.hideWhenInactive ? e.entity ? !He(e.entity, t) : !0 : !1;
}
function Tm(e, t) {
  return e.showOnlyWhenZoomed ? t ? e.area ? e.area !== t.id && e.area !== t.name : !si(t.points ?? [], e.x, e.y) : !0 : !1;
}
function Cm(e, t, i) {
  if (!e.enableHideBadgeByEntity) return !1;
  let n = t;
  if (i) {
    const o = e.hideBadgeEntity || e.entity;
    o && i.states[o] && (n = e.hideBadgeAttribute && i.states[o].attributes ? String(i.states[o].attributes[e.hideBadgeAttribute]) : i.states[o].state);
  }
  return Fo(
    n,
    e.hideBadgeMode,
    e.hideBadgeMatch,
    // Ensure this property is correctly mapped in your types, or use hideBadgeState
    e.hideBadgeOperator,
    e.hideBadgeThreshold,
    e.hideBadgeInvert
  );
}
const Ns = 12;
function js(e, t) {
  const i = [];
  if (t.showName) {
    const o = t.entity ? e?.states[t.entity]?.attributes?.friendly_name : void 0, r = t.name || o || t.entity;
    r && i.push(r);
  }
  let n = !1;
  if (t.enableHideStateByEntity && e) {
    const o = t.hideStateEntity || t.entity;
    let r;
    o && e.states[o] && (r = t.hideStateAttribute && e.states[o].attributes ? e.states[o].attributes[t.hideStateAttribute] : e.states[o].state), n = Fo(
      r,
      t.hideStateMode,
      t.hideStateMatch,
      t.hideStateOperator,
      t.hideStateThreshold,
      t.hideStateInvert
    );
  }
  if (t.entity && (t.showState ?? t.kind === "sensor") && !n && i.push(vm(e, t)), !n)
    for (const o of Ge(t)) {
      if (o.showState === !1) continue;
      const r = bm(e, t, o);
      r && i.push(r);
    }
  return i.join(" · ");
}
const Br = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function Fo(e, t = "state", i, n = "==", o, r = !1) {
  if (e == null || e === "") return !1;
  let a = !1;
  if (t === "threshold") {
    if (o == null) return !1;
    const s = Number(e);
    if (!Number.isFinite(s)) return !1;
    switch (n) {
      case "<":
        a = s < o;
        break;
      case "<=":
        a = s <= o;
        break;
      case "==":
        a = s === o;
        break;
      case "!=":
        a = s !== o;
        break;
      case ">=":
        a = s >= o;
        break;
      case ">":
        a = s > o;
        break;
      default:
        return !1;
    }
  } else {
    if (i == null || String(i).trim() === "") return !1;
    const s = String(e).trim().toLowerCase(), l = String(i).trim().toLowerCase();
    if (Br.has(s) && !Br.has(l))
      return !1;
    a = n === "!=" ? s !== l : s === l;
  }
  return r ? !a : a;
}
function Im(e) {
  return e.showName || (e.showState ?? e.kind === "sensor") ? !0 : Ge(e).some((t) => t.showState !== !1 && (t.entity || t.attribute));
}
function Bi(e) {
  const t = e.labelPosition;
  return t === "left" || t === "right" ? t : "below";
}
function Pm(e, t) {
  const i = js(e, t);
  return i ? { text: i, live: !0 } : { text: t.name || t.entity || t.kind, live: !1 };
}
function Ws(e) {
  return Math.min(40, Math.max(8, O(e, Ns)));
}
function Bs(e, t) {
  if (!e.disableLabelColor) return t;
  if (e.useCustomLabelColor)
    return R(e.labelCustomColor) ?? void 0;
}
function Us(e) {
  return Math.min(40, Math.max(8, O(e, _o)));
}
function lt(e) {
  return Math.min(Xa, Math.max(2, O(e, X)));
}
function Vs(e, t) {
  if (e === void 0) return "";
  const i = lt(e);
  return t === "railing" ? `stroke-width:${Math.round(i * Ui * 100) / 100};` : `stroke-width:${i};`;
}
function qs() {
  return "stroke-width:2; stroke-dasharray:2 12; opacity:0.7;";
}
const Ui = 0.4;
function qe(e) {
  return e.kind === "railing";
}
const Ur = /* @__PURE__ */ new WeakMap();
function Do(e) {
  if (!e.some(qe)) return e;
  let t = Ur.get(e);
  return t || (t = e.filter((i) => !qe(i)), Ur.set(e, t)), t;
}
function Vi(e) {
  return e === "plan" ? "plan" : "fixed";
}
const Gs = 4e3;
function qi(e) {
  if (typeof e != "number" && typeof e != "string") return;
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.min(t, Gs) : void 0;
}
function K(e, t) {
  return t === "plan" ? `calc(${e} * var(--fp-u, 1px))` : `${e}px`;
}
function zm(e, t) {
  return t !== "plan" && e === void 0 ? "" : `font-size:${K(Us(e), t)};`;
}
function Vr(e) {
  switch (e) {
    case "light":
      return "mdi:lightbulb";
    case "switch":
      return "mdi:toggle-switch";
    case "sensor":
      return "mdi:gauge";
    case "binary_sensor":
      return "mdi:radiobox-marked";
    case "climate":
      return "mdi:thermostat";
    case "cover":
      return "mdi:window-shutter";
    case "media_player":
      return "mdi:television";
    case "fan":
      return "mdi:fan";
    case "camera":
      return "mdi:cctv";
    case "lock":
      return "mdi:lock";
    case "humidifier":
      return "mdi:air-humidifier";
    case "vacuum":
      return "mdi:robot-vacuum";
    default:
      return "mdi:circle";
  }
}
const Om = {
  media_player: { on: "mdi:television-play", off: "mdi:television-off" },
  fan: { on: "mdi:fan", off: "mdi:fan-off" },
  lock: { on: "mdi:lock-open-variant", off: "mdi:lock" },
  camera: { on: "mdi:cctv", off: "mdi:cctv-off" },
  humidifier: { on: "mdi:air-humidifier", off: "mdi:air-humidifier-off" },
  vacuum: { on: "mdi:robot-vacuum", off: "mdi:robot-vacuum-variant" }
}, Lm = {
  paused: "mdi:television-pause",
  idle: "mdi:television"
}, Fm = {
  off: "mdi:power",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  heat_cool: "mdi:sun-snowflake-variant",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan"
}, Dm = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  exceptional: "mdi:alert-circle-outline",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant"
}, Rm = {
  battery: { on: "mdi:battery-alert", off: "mdi:battery" },
  battery_charging: { on: "mdi:battery-charging", off: "mdi:battery" },
  carbon_monoxide: { on: "mdi:smoke-detector-alert", off: "mdi:smoke-detector" },
  cold: { on: "mdi:snowflake", off: "mdi:thermometer" },
  connectivity: { on: "mdi:check-network-outline", off: "mdi:close-network-outline" },
  door: { on: "mdi:door-open", off: "mdi:door-closed" },
  garage_door: { on: "mdi:garage-open", off: "mdi:garage" },
  gas: { on: "mdi:alert-circle", off: "mdi:check-circle" },
  heat: { on: "mdi:fire", off: "mdi:thermometer" },
  light: { on: "mdi:brightness-7", off: "mdi:brightness-5" },
  lock: { on: "mdi:lock-open", off: "mdi:lock" },
  moisture: { on: "mdi:water", off: "mdi:water-off" },
  motion: { on: "mdi:motion-sensor", off: "mdi:motion-sensor-off" },
  occupancy: { on: "mdi:home", off: "mdi:home-outline" },
  opening: { on: "mdi:square-outline", off: "mdi:square" },
  plug: { on: "mdi:power-plug", off: "mdi:power-plug-off" },
  power: { on: "mdi:power-plug", off: "mdi:power-plug-off" },
  presence: { on: "mdi:home", off: "mdi:home-outline" },
  problem: { on: "mdi:alert-circle", off: "mdi:check-circle" },
  running: { on: "mdi:play", off: "mdi:stop" },
  safety: { on: "mdi:alert-circle", off: "mdi:check-circle" },
  smoke: { on: "mdi:smoke-detector-variant-alert", off: "mdi:smoke-detector-variant" },
  sound: { on: "mdi:music-note", off: "mdi:music-note-off" },
  tamper: { on: "mdi:vibrate", off: "mdi:check-circle" },
  vibration: { on: "mdi:vibrate", off: "mdi:crop-portrait" },
  window: { on: "mdi:window-open", off: "mdi:window-closed" }
}, Hm = {
  temperature: "mdi:thermometer",
  humidity: "mdi:water-percent",
  battery: "mdi:battery",
  power: "mdi:flash",
  energy: "mdi:lightning-bolt",
  illuminance: "mdi:brightness-5",
  pressure: "mdi:gauge",
  carbon_dioxide: "mdi:molecule-co2",
  pm25: "mdi:air-filter",
  signal_strength: "mdi:wifi",
  voltage: "mdi:sine-wave",
  current: "mdi:current-ac"
}, Nm = {
  garage: { on: "mdi:garage-open", off: "mdi:garage" },
  garage_door: { on: "mdi:garage-open", off: "mdi:garage" },
  door: { on: "mdi:door-open", off: "mdi:door-closed" },
  gate: { on: "mdi:gate-open", off: "mdi:gate" },
  window: { on: "mdi:window-open", off: "mdi:window-closed" },
  blind: { on: "mdi:blinds-open", off: "mdi:blinds" },
  shade: { on: "mdi:roller-shade", off: "mdi:roller-shade-closed" },
  shutter: { on: "mdi:window-shutter-open", off: "mdi:window-shutter" },
  curtain: { on: "mdi:curtains", off: "mdi:curtains-closed" },
  awning: { on: "mdi:awning-outline", off: "mdi:awning-outline" }
};
function jm(e) {
  return e === "on" || e === "open" || e === "home" || e === "playing";
}
const Wm = {
  lock: /* @__PURE__ */ new Set(["unlocked", "unlocking", "open", "opening"]),
  vacuum: /* @__PURE__ */ new Set(["cleaning", "returning"]),
  camera: /* @__PURE__ */ new Set(["recording", "streaming"]),
  // A climate entity's state *is* its HVAC mode (issue #206) — "cool",
  // "heat", "dry"… never the generic "on" the fallback test looks for, so
  // every mode but the literal "off" read as off forever: the active
  // highlight never lit, and a configured iconAnimation never played on a
  // unit that was very much running. Every mode HA's own climate.HVACMode
  // enum defines, off excluded.
  climate: /* @__PURE__ */ new Set(["auto", "cool", "dry", "fan_only", "heat", "heat_cool"]),
  // Same trap, one domain over: a paused or idle player is still switched
  // on, just not mid-playback, and "playing" alone left everything else
  // reading as off. "standby" is the one state that means the device itself
  // dropped to low power, so it stays out.
  media_player: /* @__PURE__ */ new Set(["on", "idle", "playing", "paused", "buffering"])
};
function He(e, t) {
  if (!t || t === "unavailable" || t === "unknown") return !1;
  const i = e?.split(".")[0] ?? "", n = Wm[i];
  return n ? n.has(t) : jm(t);
}
const Bm = {
  fan: "spin",
  media_player: "pulse",
  vacuum: "pulse"
};
function Ks(e) {
  return Bm[e?.split(".")[0] ?? ""];
}
const Um = /* @__PURE__ */ new Set(["idle", "off"]);
function Vm(e) {
  const t = e?.hvac_action;
  return typeof t != "string" ? !0 : !Um.has(t);
}
function Xs(e, t, i) {
  const n = e.iconAnimation ?? "auto";
  if (n !== "none" && He(e.entity, t)) {
    if (e.entity?.split(".")[0] === "climate") {
      if (!Vm(i)) return;
      if (t === "fan_only") return "spin";
    }
    return n === "spin" || n === "pulse" ? n : Ks(e.entity);
  }
}
const qm = /* @__PURE__ */ new Set(["motion", "occupancy", "presence", "vibration"]);
function Ys(e, t) {
  const i = e?.split(".")[0];
  return i === "device_tracker" || i === "person" ? !0 : i === "binary_sensor" && !!t && qm.has(t);
}
function Zs(e, t, i, n) {
  const o = e.split(".")[0];
  if (o === "climate")
    return Fm[n ?? ""] ?? (i ? "mdi:thermostat" : "mdi:power");
  if (o === "weather") return Dm[n ?? ""] ?? "mdi:weather-cloudy";
  if (o === "media_player" && n) {
    const a = Lm[n];
    if (a) return a;
  }
  const r = Om[o];
  if (r) return i ? r.on : r.off;
  if (t) {
    if (o === "binary_sensor") {
      const a = Rm[t];
      return a ? i ? a.on : a.off : void 0;
    }
    if (o === "sensor") return Hm[t];
    if (o === "cover") {
      const a = Nm[t];
      return a ? i ? a.on : a.off : void 0;
    }
  }
}
function Ro(e, t) {
  if (t)
    return e.attribute ? t.attributes?.[e.attribute] : t.state;
}
function $i(e, t, i) {
  const n = Nt(Ps(e.stateColor, Ro(e, t))?.icon);
  if (n) return n;
  const o = Nt(e.icon);
  if (o) return o;
  if (!e.entity) return Vr(e.kind);
  if (i) return i;
  const r = t?.attributes?.icon;
  return r || (Zs(
    e.entity,
    t?.attributes?.device_class,
    He(e.entity, t?.state),
    t?.state
  ) ?? Vr(e.kind));
}
function Qs(e) {
  const t = Math.round(e);
  let i = Math.round(t * 0.62);
  return i % 2 !== t % 2 && (i += 1), Math.max(2, i);
}
function ei(e) {
  return e.badgeContent === "icon" || e.badgeContent === "value" || e.badgeContent === "none" ? e.badgeContent : e.showIcon === !1 ? "none" : "icon";
}
function ki(e) {
  const t = e.pressEffect;
  return t === "scale" || t === "ripple" || t === "flash" || t === "none" ? t : es;
}
function Gm(e, t, i, n) {
  const o = t.findIndex((s) => s.id === i);
  if (o < 0) return;
  const r = e.goToFloor;
  let a;
  if (r && typeof r == "object")
    a = t.find((s) => s.id === r.floor);
  else
    switch (r) {
      case "up":
        a = t[o + 1];
        break;
      case "down":
        a = t[o - 1];
        break;
      case "top":
        a = t[t.length - 1];
        break;
      case "bottom":
        a = t[0];
        break;
      case "main":
        a = t.find((s) => s.id === n) ?? t[0];
        break;
    }
  return a && a.id !== i ? a.id : void 0;
}
function Js(e) {
  const t = e.offlineStyle;
  return t === "dim" || t === "strike" || t === "none" ? t : ts;
}
function Zn(e, t) {
  return e.entity ? t === void 0 || Tt(t) : !1;
}
const Km = {
  climate: { attribute: "current_temperature", unit: "°" },
  water_heater: { attribute: "current_temperature", unit: "°" },
  humidifier: { attribute: "current_humidity", unit: "%" }
};
function Lt(e) {
  if (e == null || typeof e == "boolean" || typeof e == "string" && e.trim() === "") return;
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : void 0;
}
function Xm(e) {
  if (typeof e != "string") return "";
  const t = e.trim();
  return t === "°C" || t === "°F" || t === "K" ? "°" : t === "ppm" || t === "ppb" ? "" : t.length <= 3 ? t : "";
}
function Si(e) {
  return Math.abs(e) < 10 && !Number.isInteger(e) ? e.toFixed(1) : String(Math.round(e));
}
function Ym(e, t) {
  return t === "W" && Math.abs(e) >= 1e3 ? { n: e / 1e3, unit: "kW" } : { n: e, unit: t };
}
function qr(e, t) {
  const i = Ym(e, Xm(t));
  return Si(i.n) + i.unit;
}
function el(e, t) {
  return il(e, t)?.text;
}
function tl(e) {
  return e === "primary" ? "primary" : e === "secondary" ? 0 : typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : void 0;
}
function il(e, t) {
  if (!e || !t.entity) return;
  const i = Ge(t), n = () => {
    const s = e.states[t.entity], l = s?.attributes, c = Km[t.entity.split(".")[0]];
    if (t.attribute) {
      const d = Lt(l?.[t.attribute]);
      if (d !== void 0)
        return Si(d) + (t.attribute === c?.attribute ? c.unit : "");
    }
    if (c) {
      const d = Lt(l?.[c.attribute]);
      if (d !== void 0) return Si(d) + c.unit;
    }
    const p = Lt(s?.state);
    return p === void 0 ? void 0 : qr(p, l?.unit_of_measurement);
  }, o = (s) => {
    const l = i[s];
    if (!l) return;
    const c = l.entity || (l.attribute ? t.entity : void 0);
    if (!c) return;
    const p = e.states[c], d = p?.attributes;
    if (l.attribute) {
      const u = Lt(d?.[l.attribute]);
      return u === void 0 ? void 0 : Si(u);
    }
    const h = Lt(p?.state);
    return h === void 0 ? void 0 : qr(h, d?.unit_of_measurement);
  }, r = tl(t.badgeEntity);
  if (r === "primary") {
    const s = n();
    return s === void 0 ? void 0 : { text: s, source: "primary" };
  }
  if (typeof r == "number") {
    const s = o(r);
    return s === void 0 ? void 0 : { text: s, source: r };
  }
  const a = n();
  if (a !== void 0) return { text: a, source: "primary" };
  for (let s = 0; s < i.length; s++) {
    const l = o(s);
    if (l !== void 0) return { text: l, source: s };
  }
}
const Zm = { ".": 0.28, "-": 0.38, "°": 0.45, "%": 1, k: 0.58 }, Qm = 0.7, Jm = 0.85;
function Gr(e) {
  let t = 0;
  for (const i of e)
    t += Zm[i] ?? (i >= "0" && i <= "9" ? Qm : Jm);
  return t;
}
function nl(e, t) {
  const i = Math.round(O(e, je)), n = Math.max(0, i - 6), o = Gr(t) > 0 ? n / Gr(t) : i;
  let r = Math.round(Math.min(i * 0.46, o));
  return r % 2 !== i % 2 && (r -= 1), Math.max(6, r);
}
function Kr(e) {
  const t = e.split(".")[0];
  switch (t) {
    case "light":
    case "switch":
    case "sensor":
    case "binary_sensor":
    case "climate":
    case "cover":
    case "media_player":
    case "fan":
    case "camera":
    case "lock":
    case "humidifier":
    case "vacuum":
      return t;
    default:
      return "generic";
  }
}
const eg = 0.62;
function Se(e) {
  if (!ie(e)) return 0;
  const t = Math.abs(e.length) * eg, i = e.width;
  return typeof i != "number" || !Number.isFinite(i) || i <= 0 ? Math.max(1, t) : Math.max(1, i);
}
function ne(e) {
  return ie(e) ? "awning" : e.motion ?? "swing";
}
function xn(e) {
  if (ne(e) !== "swing" || Fe(e) !== "single") return 1;
  const t = e.sashSpan;
  return typeof t != "number" || !Number.isFinite(t) ? 1 : Math.max(Cs, Math.min(1, t));
}
function _n(e) {
  if (xe(e)) return !0;
  const t = e.type === "door" && ne(e) === "swing";
  return e.invert ? !t : t;
}
function tg(e) {
  return { sx: e.flipH ? -1 : 1, sy: e.flipV ? -1 : 1 };
}
function ai(e) {
  return ne(e) === "slide" ? e.sliderStyle ?? "single" : "single";
}
function ol(e) {
  return e === "biparting" || e === "biparting-bypass" || e === "converging";
}
function Ut(e) {
  return xe(e) ? !1 : ne(e) === "swing" ? Fe(e) === "double" : ol(ai(e));
}
function rl(e) {
  return { ...e, entity: e.secondaryEntity };
}
function Qn(e) {
  return e === "window" ? "double" : "single";
}
function Fe(e) {
  return ne(e) === "swing" ? e.sash ?? Qn(e.type) : Qn(e.type);
}
function nt(e) {
  return e.shutterStyle === "roll" || e.shutterStyle === "swing" ? e.shutterStyle : e.shutterEntity?.split(".")[0] === "binary_sensor" ? "swing" : "roll";
}
function Te(e, t = !1) {
  if (!e || Tt(e.state)) return 0;
  const i = e.attributes?.current_position;
  if (typeof i == "number" && Number.isFinite(i)) {
    const o = Math.max(0, Math.min(1, i / 100));
    return t ? 1 - o : o;
  }
  const n = e.state === "open" || e.state === "opening" || e.state === "closing" || e.state === "on";
  return (t ? !n : n) ? 1 : 0;
}
function Mi(e, t = !1) {
  return !e || Tt(e.state) ? !1 : Te(e, t) > 0 || e.state === "opening" || e.state === "closing";
}
const ig = /* @__PURE__ */ new Set(["window", "blind", "shade", "shutter", "curtain", "awning"]), ng = /* @__PURE__ */ new Set(["blind", "shade", "curtain"]), og = /* @__PURE__ */ new Set(["garage", "garage_door", "shutter"]);
function rg(e) {
  const t = e ?? "";
  return {
    type: ig.has(t) ? "window" : "door",
    motion: og.has(t) ? "roll" : ng.has(t) ? "slide" : void 0
  };
}
function ag(e, t) {
  return t ? ie(e) ? {} : xe(e) ? {} : rg(t) : {};
}
const sg = 3;
function lg(e, t) {
  return e.split(".")[0] === "cover" && t & sg ? "cover-toggle" : "more-info";
}
function Ho(e, t, i) {
  const n = e.entity || void 0, o = e.shutterEntity || void 0, r = !!(n && o && e.tapTarget === "shutter"), a = r ? o : n ?? o, s = n && o ? r ? n : o : void 0, l = t === "tap" ? e.tap_action : t === "hold" ? e.hold_action : e.double_tap_action;
  if (l) return { entity: l.entity ?? a, config: l };
  if (t === "tap")
    return a ? {
      entity: a,
      config: {
        action: (
          // Pointing the tap at the shutter opens its dialog; it does not
          // drive the motor. Choosing *which* entity answers is not the same
          // as choosing to move hardware on a tap, and that second decision
          // stays where it is explicit — `tap_action: toggle` (issue #47).
          !r && lg(a, i(a)) === "cover-toggle" ? "toggle" : "more-info"
        )
      }
    } : void 0;
  if (t === "hold" && s) return { entity: s, config: { action: "more-info" } };
}
function Ei(e, t) {
  const i = t === "tap" ? e.tap_action : t === "hold" ? e.hold_action : e.double_tap_action;
  if (i)
    return { entity: i.entity ?? e.entity, config: i };
}
function Vt(e, t) {
  const i = t === "tap" ? e.tap_action : t === "hold" ? e.hold_action : e.double_tap_action;
  if (i)
    return { entity: i.entity ?? e.entity, config: i };
}
function cg(e, t, i = $e) {
  const n = ["tap", "hold", "double_tap"].map((r) => Vt(e, r)).map((r) => r ? hs({ entity: r.entity }, r.config) : void 0).find((r) => r) ?? e.entity;
  return (n ? t?.states[n]?.attributes?.friendly_name : void 0) || n || ri(i, e.type)?.name || dg(e.type) || "Furniture";
}
function dg(e) {
  return String(e ?? "").replace(/[-_]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().trim();
}
function hg(e) {
  return ["tap", "hold", "double_tap"].some(
    (t) => Me(Ei(e, t)?.config)
  );
}
function Xr(e, t) {
  return ["tap", "hold", "double_tap"].some(
    (i) => Me(Ho(e, i, t)?.config)
  );
}
function Tt(e) {
  return e === "unavailable" || e === "unknown";
}
function pg(e, t) {
  if (!e.entity || t === void 0) return _n(e);
  if (ug(e.entity, t)) return !1;
  const i = fg(e.entity, t);
  return e.invert ? !i : i;
}
function ug(e, t) {
  return Tt(t) ? !0 : e.split(".")[0] === "lock" && t === "jammed";
}
function fg(e, t) {
  return e.split(".")[0] === "lock" ? He(e, t) : t === "on" || t === "open" || t === "opening" || t === "closing";
}
function mg(e) {
  return e === "opening" || e === "closing";
}
function _t(e, t) {
  if (!e.entity || !t) return _n(e) ? 1 : 0;
  if (Tt(t.state)) return 0;
  const i = t.attributes?.current_position;
  if (typeof i == "number" && Number.isFinite(i)) {
    const n = Math.max(0, Math.min(1, i / 100));
    return e.invert ? 1 - n : n;
  }
  return pg(e, t.state) ? 1 : 0;
}
function Jn(e, t) {
  return !e.entity || !t || Tt(t.state) ? !1 : mg(t.state) || _t(e, t) > 0;
}
function Yr(e, t, i) {
  const n = e / 2, o = 5, r = Math.max(3, Math.round(e / 12)), a = [];
  for (let s = 1; s < r; s++) {
    const l = -n + e * s / r;
    a.push(
      _`<line x1=${l} y1=${-o / 2} x2=${l} y2=${o / 2}
            stroke=${oi} stroke-width="0.75" />`
    );
  }
  return _`<g class="fp-roll-curtain" style="transform:scaleY(${1 - i});">
      <rect x=${-n} y=${-o / 2} width=${e} height=${o}
            style="fill:${t};" />
      ${a}
    </g>`;
}
function gg(e, t, i, n) {
  const o = e / 2, r = t / 2, a = t * (1 - Math.max(0, Math.min(1, n)));
  if (a <= 0.5) return _``;
  const s = Math.max(2, Math.round(a / 7)), l = [];
  for (let c = 1; c < s; c++) {
    const p = -r + a * c / s;
    l.push(
      _`<line x1=${-o} y1=${p} x2=${o} y2=${p}
            stroke=${oi} stroke-width="0.75" />`
    );
  }
  return _`<g class="fp-skylight-blind">
      <rect x=${-o} y=${-r} width=${e} height=${a}
            style="fill:${i};" opacity="0.85" />
      ${l}
    </g>`;
}
function yg(e, t, i, n, o = 1, r = i, a = n) {
  const s = e / 2, l = 3, c = o * (t / 2 + l / 2), p = (d, h) => {
    const u = [], f = Math.max(2, Math.round(h / 14));
    for (let g = 1; g < f; g++) {
      const y = d + h * g / f;
      u.push(
        _`<line x1=${y} y1=${-l / 2} x2=${y} y2=${l / 2}
              stroke=${oi} stroke-width="0.75" />`
      );
    }
    return u;
  };
  return _`
      <g transform="translate(${-s} ${c})">
        <g class="fp-door-leaf" style="transform:rotate(${o * 90 * n}deg);">
          <rect x="0" y=${-l / 2} width=${s} height=${l} style="fill:${i};" />
          ${p(0, s)}
        </g>
      </g>
      <g transform="translate(${s} ${c})">
        <g class="fp-leaf-r" style="transform:rotate(${-o * 90 * a}deg);">
          <rect x=${-s} y=${-l / 2} width=${s} height=${l} style="fill:${r};" />
          ${p(-s, s)}
        </g>
      </g>`;
}
const Zr = 22, Gi = 14, Ki = 22, Xi = 15;
function No(e, t = 0) {
  const i = e.flipV ? -1 : 1, n = e.angle * Math.PI / 180, o = { x: -Math.sin(n) * i, y: Math.cos(n) * i };
  if (t === 90) return { x: -o.y, y: o.x };
  if (t === 180) return { x: -o.x, y: -o.y };
  if (t === 270) return { x: o.y, y: -o.x };
  const { cos: r, sin: a } = un(t);
  return { x: o.x * r - o.y * a, y: o.x * a + o.y * r };
}
function jo(e, t = al(e)) {
  const i = (e.flipV ? -1 : 1) * t, n = e.angle * Math.PI / 180;
  return { x: e.x - Math.sin(n) * i, y: e.y + Math.cos(n) * i };
}
function eo(e) {
  return {
    width: Math.abs(e.length),
    height: ie(e) ? Se(e) : X + 4
  };
}
function al(e) {
  return ie(e) ? Zr + Se(e) / 2 : Zr;
}
function Ai(e) {
  return !!e.entity;
}
function sl(e) {
  return !!e.shutterEntity && (e.showShutterIcon ?? Ai(e));
}
const bg = { on: "mdi:window-shutter-open", off: "mdi:window-shutter" }, Qr = {
  door: { on: "mdi:door-open", off: "mdi:door-closed" },
  window: { on: "mdi:window-open", off: "mdi:window-closed" },
  skylight: { on: "mdi:window-open-variant", off: "mdi:window-closed-variant" },
  // One glyph for both: a passage is never shut, so there is no pair to pick
  // from — the badge's colour still says what its entity is doing.
  passage: { on: "mdi:arrow-expand-horizontal", off: "mdi:arrow-expand-horizontal" }
};
function ll(e, t, i, n, o, r) {
  const a = Nt(t);
  if (a) return a;
  const s = Nt(r);
  if (s) return s;
  const l = Nt(i?.attributes?.icon);
  return l || (Zs(e, i?.attributes?.device_class, n) ?? (n ? o.on : o.off));
}
function cl(e, t, i, n) {
  return ll(
    e.shutterEntity ?? "",
    e.shutterIcon,
    t,
    i,
    bg,
    n
  );
}
function dl(e) {
  return !!e.entity && (e.showIcon ?? !1);
}
function hl(e, t, i, n) {
  return ll(
    e.entity ?? "",
    e.icon,
    t,
    i,
    Qr[e.type] ?? Qr.door,
    n
  );
}
function pl(e) {
  return jo(e, -al(e));
}
function ul(e, t = 0) {
  const i = No(e, t);
  return { x: -i.x, y: -i.y };
}
function Wo(e, t) {
  const { color: i, open: n = !0, active: o = !1, accent: r = Q } = t, a = e.length / 2, s = X + 4, l = R(t.inactive) ?? i, c = Math.max(0, Math.min(1, t.amount ?? (n ? 1 : 0))), p = t.second ? Math.max(0, Math.min(1, t.second.amount)) : c, d = (b, k) => fe(b ? r : k === 0 ? l : i, Q), h = d(o, c), u = t.second ? d(!!t.second.active, p) : h;
  let f;
  if (ie(e)) {
    const b = a, k = Se(e) / 2, S = Math.max(1.5, Math.min(4, Math.min(b, k) * 0.18)), x = Math.max(0.5, b - S), $ = Math.max(0.5, k - S), M = $ * 2 * (1 - c * 0.82);
    f = _`
        <!-- the kerb -->
        <rect x=${-b} y=${-k} width=${b * 2} height=${k * 2}
              fill="none" stroke=${i} stroke-width="2" />
        <!-- "above you": the plan convention for anything overhead -->
        <line x1=${-x} y1=${-$} x2=${x} y2=${$}
              stroke=${i} stroke-width="1" stroke-dasharray="4 4" opacity="0.55" />
        <line x1=${-x} y1=${$} x2=${x} y2=${-$}
              stroke=${i} stroke-width="1" stroke-dasharray="4 4" opacity="0.55" />
        <!-- the sash, foreshortening toward its hinge as it swings out -->
        <rect x=${-x} y=${-$} width=${x * 2} height=${M}
              fill="none" stroke=${h} stroke-width="1.5"
              stroke-dasharray=${c > 0.02 ? "5 4" : m} />
        <!-- the head it is hung from -->
        <line x1=${-x} y1=${-k} x2=${x} y2=${-k}
              stroke=${h} stroke-width="2.5" />`;
  } else if (xe(e))
    f = _``;
  else if (ne(e) === "swing") {
    const b = Fe(e) === "double", k = xn(e), S = b ? a : e.length * k, x = Math.PI / 2 * S, $ = (P, A, I) => _`<path class="fp-door-arc" d=${P}
              fill="none" stroke-width="1.5" stroke-dasharray=${x}
              style="stroke:${A};stroke-dashoffset:${x * (1 - I)};" />`, M = e.type === "window" ? _`
        <line x1=${-a} y1=${-s / 2} x2=${-a} y2=${s / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${a} y1=${-s / 2} x2=${a} y2=${s / 2}
              stroke=${i} stroke-width="2" />` : m;
    f = _`
        ${M}
        ${b ? (
      // Two leaves hinged at opposite jambs, meeting in the middle when
      // shut and each tracing its own quarter circle outward.
      _`${$(`M 0 0 A ${a} ${a} 0 0 0 ${-a} ${-a}`, h, c)}${$(
        `M 0 0 A ${a} ${a} 0 0 1 ${a} ${-a}`,
        u,
        p
      )}`
    ) : (
      // Hinged at the −x jamb, so the tip starts `leafW` along the wall
      // and ends `leafW` out from it. At full span that is exactly the
      // arc this drew before `sashSpan` existed.
      $(`M ${-a + S} 0 A ${S} ${S} 0 0 0 ${-a} ${-S}`, h, c)
    )}
        ${// The pane the sash does not cover: fixed glass, drawn in the base
    // colour because it never opens and so is never the active part.
    // Nothing at full span, which is every opening that predates this.
    k < 1 ? _`<line x1=${-a + S} y1="0" x2=${a} y2="0"
              stroke=${i} stroke-width=${e.type === "window" ? 1.5 : 2.5} />` : m}
        <!-- leaf hinged at the left jamb (flipH mirrors it to the right one) -->
        <g transform="translate(${-a} 0)">
          <g class="fp-door-leaf" style="transform:rotate(${-90 * c}deg);">
            <rect x="0" y="-1.25" width=${S} height="2.5" style="fill:${h};" />
          </g>
        </g>
        ${b ? (
      // The other leaf, on its own sensor when it has one (issue #159):
      // a casement pair with a contact per sash draws left-open /
      // right-shut, exactly as a two-sensor slider parts unevenly.
      _`<g transform="translate(${a} 0)">
          <g class="fp-leaf-r" style="transform:rotate(${90 * p}deg);">
            <rect x=${-a} y="-1.25" width=${a} height="2.5" style="fill:${u};" />
          </g>
        </g>`
    ) : m}
      `;
  } else if (ne(e) === "fixed") {
    const b = e.type === "window" ? 1.5 : 2.5;
    f = _`
        ${e.type === "window" ? _`
        <line x1=${-a} y1=${-s / 2} x2=${-a} y2=${s / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${a} y1=${-s / 2} x2=${a} y2=${s / 2}
              stroke=${i} stroke-width="2" />` : m}
        <line x1=${-a} y1="0" x2=${a} y2="0"
              stroke=${i} stroke-width=${b} />`;
  } else if (ne(e) === "awning") {
    const b = Math.min(12, e.length * 0.16), k = 5, S = a - b / 2 - 1, x = Math.max(0, S - b / 2), $ = Math.min(a * 0.62, 34) * c, M = Math.min($ * 0.16, x * 0.4), P = c > 0.02;
    f = _`
        <!-- jambs, as any window -->
        <line x1=${-a} y1=${-s / 2} x2=${-a} y2=${s / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${a} y1=${-s / 2} x2=${a} y2=${s / 2}
              stroke=${i} stroke-width="2" />
        <!-- The glass line: solid while the sash is shut and sitting in it,
             broken once the sash has swung out and left the gap behind. -->
        <line x1=${-a} y1="0" x2=${a} y2="0"
              stroke=${h} stroke-width="1.5"
              stroke-dasharray=${P ? "6 4" : m} />
        ${P ? (
      // A polyline, not a polygon, and that is the whole point of the
      // broken line above it. A closed shape strokes its own base back
      // along y=0 — straight over the dashes, solid — and the only
      // glass left uncovered would be the sliver outside `bx`, which
      // is exactly where the knuckles sit. The line would have been
      // dashed in the markup and solid on the screen at every size.
      _`<polyline
                    points="${-x},0 ${-x + M},${-$} ${x - M},${-$} ${x},0"
                    fill="none" stroke=${h} stroke-width="1.5"
                    stroke-linejoin="round" />`
    ) : m}
        <!-- Hinge knuckles, drawn whether or not it is open: they are what says
             this window is top-hung rather than fixed when it happens to be
             shut, and the request asked for them by name. -->
        ${[-S, S].map(
      (A) => _`
          <rect x=${A - b / 2} y=${-k / 2} width=${b} height=${k}
                fill="none" stroke=${h} stroke-width="1.25" />
          <line x1=${A} y1=${-k / 2} x2=${A} y2=${k / 2}
                stroke=${h} stroke-width="1.25" />`
    )}`;
  } else if (ne(e) === "roll")
    f = _`
        <!-- jambs -->
        <line x1=${-a} y1=${-s / 2} x2=${-a} y2=${s / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${a} y1=${-s / 2} x2=${a} y2=${s / 2}
              stroke=${i} stroke-width="2" />
        <!-- Track: stays when the curtain is up so the gap still reads as an
             opening — and wears the accent while the cover is open or moving
             (issue #154). Wide open the curtain has scaled away to nothing, so
             this line is the *only* mark left: drawn in the base colour it read
             exactly like a shut garage, which is the one thing it must not do.
             Full strength when accented, since a 0.6 tint of the accent reads
             as neither colour. -->
        <line x1=${-a} y1="0" x2=${a} y2="0"
              stroke=${h} stroke-width="0.75" opacity=${o ? 1 : 0.6} />
        ${Yr(e.length, h, c)}`;
  else {
    const b = e.type === "window" ? 1.5 : 2.5, k = _`
        <line x1=${-a} y1=${-s / 2} x2=${-a} y2=${s / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${a} y1=${-s / 2} x2=${a} y2=${s / 2}
              stroke=${i} stroke-width="2" />`, S = ai(e);
    if (S === "bypass") {
      const $ = -a * c;
      f = _`
        ${k}
        <!-- tracks -->
        <line x1=${-a} y1=${-1.75} x2=${a} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-a} y1=${1.75} x2=${a} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- fixed panel: left half, front track -->
        <rect x=${-a} y=${1.75 - b / 2} width=${a} height=${b} style="fill:${h};" />
        <!-- moving panel: right half, back track -->
        <g class="fp-slide-panel" style="transform:translateX(${$}px);">
          <rect x="0" y=${-1.75 - b / 2} width=${a} height=${b} style="fill:${h};" />
        </g>`;
    } else if (S === "biparting")
      f = _`
        ${k}
        <!-- track -->
        <line x1=${-a} y1="0" x2=${a} y2="0"
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <g class="fp-slide-panel" style="transform:translateX(${-a * c}px);">
          <rect x=${-a} y=${-b / 2} width=${a} height=${b} style="fill:${h};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${a * p}px);">
          <rect x="0" y=${-b / 2} width=${a} height=${b} style="fill:${u};" />
        </g>`;
    else if (S === "biparting-bypass") {
      const $ = a / 2;
      f = _`
        ${k}
        <!-- tracks -->
        <line x1=${-a} y1=${-1.75} x2=${a} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-a} y1=${1.75} x2=${a} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- fixed panels: outer quarters, front track. Never accented, even
             wide open — the accent marks what has moved, and lighting these
             would accent exactly the half that is still glazed shut. -->
        <rect x=${-a} y=${1.75 - b / 2} width=${$} height=${b} fill=${i} />
        <rect x=${a - $} y=${1.75 - b / 2} width=${$} height=${b} fill=${i} />
        <!-- moving panels: inner quarters, back track -->
        <g class="fp-slide-panel" style="transform:translateX(${-$ * c}px);">
          <rect x=${-$} y=${-1.75 - b / 2} width=${$} height=${b} style="fill:${h};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${$ * p}px);">
          <rect x="0" y=${-1.75 - b / 2} width=${$} height=${b} style="fill:${u};" />
        </g>`;
    } else if (S === "converging") {
      const $ = a / 2;
      f = _`
        ${k}
        <!-- tracks -->
        <line x1=${-a} y1=${-1.75} x2=${a} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-a} y1=${1.75} x2=${a} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- both panels move, so both take the accent on their own state:
             front track travels right, back track left, and they meet. -->
        <g class="fp-slide-panel" style="transform:translateX(${$ * c}px);">
          <rect x=${-a} y=${1.75 - b / 2} width=${a} height=${b} style="fill:${h};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${-$ * p}px);">
          <rect x="0" y=${-1.75 - b / 2} width=${a} height=${b} style="fill:${u};" />
        </g>`;
    } else {
      const x = e.length * c;
      f = _`
        ${k}
        <!-- track -->
        <line x1=${-a} y1="0" x2=${a} y2="0"
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <g class="fp-slide-panel" style="transform:translateX(${x}px);">
          <rect x=${-a} y=${-b / 2} width=${e.length} height=${b} style="fill:${h};" />
        </g>`;
    }
  }
  if (t.shutter) {
    const b = Math.max(0, Math.min(1, t.shutter.amount)), k = (P, A) => fe(P ? t.shutter.accent ?? r : A === 0 ? l : i, Q), S = k(t.shutter.active, b), x = t.shutter.second, $ = x ? Math.max(0, Math.min(1, x.amount)) : b, M = x ? k(x.active, $) : S;
    f = _`${f}${// A roof light's blind is neither of the wall shapes: it is neither a
    // band on the wall line nor a pair of panels beside the jambs, but a
    // sheet drawn across the aperture you are looking down into. It also
    // ignores `shutterStyle` — there is only the one way a velux blind
    // travels, and offering a hinged one would be offering a shutter that
    // folds back against a roof.
    ie(e) ? gg(e.length, Se(e), S, b) : t.shutter.style === "swing" ? yg(
      e.length,
      s,
      S,
      b,
      t.shutter.flip ? -1 : 1,
      M,
      $
    ) : Yr(e.length, S, b)}`;
  }
  const { sx: g, sy: y } = tg(e);
  return _`<g class=${`fp-opening fp-opening-${pe(e.type) ?? "unknown"}`}
                data-id=${pe(e.id) ?? m}
                data-entity=${Ve(e.entity) ?? m}
                transform="translate(${e.x} ${e.y}) rotate(${e.angle})">
      <g transform="scale(${g} ${y})">${f}</g>
    </g>`;
}
function $t(e) {
  if (typeof e != "number" || !Number.isFinite(e)) return 0;
  const t = (e % 360 + 360) % 360;
  return t === 90 || t === 180 || t === 270 ? t : 0;
}
function vg(e, t) {
  const i = $t(e.rotation);
  if (t === void 0) return i;
  const n = t ? e.rotationPortrait : e.rotationLandscape;
  return n == null ? i : $t(n);
}
function Jr(e, t) {
  return typeof e.addEventListener == "function" ? (e.addEventListener("change", t), () => e.removeEventListener?.("change", t)) : typeof e.addListener == "function" ? (e.addListener(t), () => e.removeListener?.(t)) : () => {
  };
}
function Rt(e) {
  const t = e.floorSwitcher;
  if (!t || typeof t != "object") return;
  const i = ea(t.x), n = ea(t.y);
  return i === void 0 || n === void 0 ? void 0 : { x: i, y: n };
}
function ea(e) {
  if (typeof e == "number") return Number.isFinite(e) ? e : void 0;
  if (typeof e != "string" || e.trim() === "") return;
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}
function Et(e, t, i) {
  const { cos: n, sin: o } = un(i);
  return { w: Math.abs(n) * e + Math.abs(o) * t, h: Math.abs(o) * e + Math.abs(n) * t };
}
function wg(e, t) {
  return ((O(e, 0) + t) % 360 + 360) % 360;
}
function ot(e, t, i, n, o) {
  switch (o) {
    case 90:
      return { x: n - t, y: e };
    case 180:
      return { x: i - e, y: n - t };
    case 270:
      return { x: t, y: i - e };
    case 0:
      return { x: e, y: t };
    default: {
      const { cos: r, sin: a } = un(o), s = Et(i, n, o);
      return {
        x: (e - i / 2) * r - (t - n / 2) * a + s.w / 2,
        y: (e - i / 2) * a + (t - n / 2) * r + s.h / 2
      };
    }
  }
}
function fl(e, t, i) {
  switch (i) {
    case 90:
      return `translate(${t} 0) rotate(90)`;
    case 180:
      return `translate(${e} ${t}) rotate(180)`;
    case 270:
      return `translate(0 ${e}) rotate(-90)`;
    case 0:
      return "";
    default: {
      const n = Et(e, t, i);
      return `translate(${n.w / 2} ${n.h / 2}) rotate(${i}) translate(${-e / 2} ${-t / 2})`;
    }
  }
}
function xg(e, t = xo, i = Hi) {
  const n = Math.min(t, i), o = Math.max(t, i);
  if (!(typeof e == "number" || typeof e == "string" && e.trim() !== "")) return o;
  const a = typeof e == "number" ? e : Number(e);
  if (!Number.isFinite(a)) return o;
  const s = Wn - at, l = Math.max(0, Math.min(1, (a - at) / s)), c = l * l * (3 - 2 * l);
  return n + (o - n) * c;
}
const to = 135, ta = 12;
function Ct(e) {
  if (!(typeof e == "number" || typeof e == "string" && e.trim() !== "")) return;
  const i = typeof e == "number" ? e : Number(e);
  return Number.isFinite(i) ? i : void 0;
}
function ml(e) {
  const t = Ct(e);
  if (t === void 0) return 1;
  if (t <= 0) return 0;
  if (t >= ta) return 1;
  const i = t / ta;
  return i * i * (3 - 2 * i);
}
function gl(e, t = 0) {
  const i = (e + t) * Math.PI / 180;
  return { x: Math.sin(i), y: -Math.cos(i) };
}
function _g(e, t) {
  return ht(e) ? e.sunBearing : Ct(t) ?? to;
}
function ht(e) {
  return typeof e.sunBearing == "number" && Number.isFinite(e.sunBearing);
}
function $g(e, t) {
  return ht(e) ? 1 : ml(t);
}
function kg(e, t) {
  return ht(e) ? 1 : Bo(t, yl);
}
const yl = 0.25, Sg = 0.7;
function io(e, t) {
  if (typeof e != "string" || !e) return;
  const i = t?.states[e];
  if (!i) return;
  const n = Ct(
    e.startsWith("weather.") ? i.attributes?.cloud_coverage : i.state
  );
  return n === void 0 ? void 0 : Math.max(0, Math.min(100, n)) / 100;
}
function Bo(e, t) {
  return e === void 0 ? 1 : 1 - (1 - t) * e;
}
const Mg = "var(--fp-skin-moonlight, #c4d6ff)", Eg = 0.6, Ag = 4 * 6e4;
function no(e) {
  return e.moonlight === !0 && e.sunlight === !0 && !ht(e);
}
function Tg(e) {
  const t = Ct(e);
  if (t === void 0 || t >= 0) return 0;
  if (t <= at) return 1;
  const i = t / at;
  return i * i * (3 - 2 * i);
}
function Cg(e, t, i, n, o) {
  const r = i?.latitude, a = i?.longitude;
  if (typeof r != "number" || !Number.isFinite(r) || typeof a != "number" || !Number.isFinite(a) || !Number.isFinite(t)) return;
  const s = Tg(n);
  if (!(s > 0)) return;
  const l = mm(t, r, a), c = Eg * ml(l.altitude) * gm(t) * s * Bo(o, yl);
  if (c > 0)
    return {
      dir: gl(l.bearing + 180, e.north ?? 0),
      strength: c,
      altitude: l.altitude
    };
}
function ti(e) {
  const t = typeof e.cloudCoverEntity == "string" ? e.cloudCoverEntity.trim() : "";
  if (t)
    return e.ambientDaylight || e.sunlight && !ht(e) ? t : void 0;
}
const ii = 0.34, Ig = 30, Pg = 0.95, zg = 0.16, ia = 0.37, Ti = "var(--fp-skin-sunlight, #ffd9a0)", oo = "var(--fp-skin-sunshade, #000)";
function Og(e) {
  return Math.max(0.02, Math.min(1.5, O(e, ii)));
}
const Lg = 0.55, na = 2.1, Fg = 1.5;
function Dg(e) {
  return Math.max(0, Math.min(4, O(e, Lg)));
}
function Uo(e) {
  const t = e.ceilingHeight;
  return typeof t != "number" || !Number.isFinite(t) ? 1 : Math.max(0.1, Math.min(8, t));
}
function bl(e, t = 1) {
  const i = Math.max(0, Math.min(1, t));
  return { along: Math.abs(e.length) / 2, across: Se(e) * i / 2 };
}
function vl(e, t, i, n = 1) {
  const o = i * Uo(e), r = Math.max(0, Math.min(1, n)), a = Se(e) / 2 * (1 - r) * (e.flipV ? -1 : 1), s = e.angle * Math.PI / 180;
  return {
    x: e.x + t.x * o - Math.sin(s) * a,
    y: e.y + t.y * o + Math.cos(s) * a
  };
}
function oa(e, t, i, n = 1, o = 1) {
  const r = vl(e, t, i, n), { along: a, across: s } = bl(e, n), l = e.angle * Math.PI / 180, c = Math.cos(l) * a * o, p = Math.sin(l) * a * o, d = -Math.sin(l) * s * o, h = Math.cos(l) * s * o;
  return [
    { x: r.x - c - d, y: r.y - p - h },
    { x: r.x + c - d, y: r.y + p - h },
    { x: r.x + c + d, y: r.y + p + h },
    { x: r.x - c + d, y: r.y - p + h }
  ];
}
function Rg(e, t, i, n) {
  let o = n;
  for (const r of i) {
    const a = zo(e.x, e.y, t.x, t.y, r);
    a !== void 0 && a > 1 && a < o && (o = a);
  }
  return o;
}
function ra(e) {
  const t = Ct(e);
  if (t === void 0) return 1;
  const i = (o) => o * Math.PI / 180, n = Math.tan(i(Ig)) / Math.tan(i(Math.max(1, Math.min(89, t))));
  return Math.max(0.45, Math.min(1.9, n));
}
function Hg(e, t, i) {
  return e.sunlight === !1 || i !== void 0 && i <= 0 ? 0 : ie(e) ? (Yi(e) ? 1 : Math.max(0, Math.min(1, t))) * (i === void 0 ? 1 : Math.max(0, Math.min(1, i))) : Yi(e) ? 1 : Math.max(0, Math.min(1, t));
}
function $n(e) {
  return xe(e) ? !1 : e.glazed ?? e.type !== "door";
}
function Yi(e) {
  return $n(e) && ne(e) !== "roll";
}
function wl(e) {
  const t = e.angle * Math.PI / 180, i = Math.cos(t) * e.length / 2, n = Math.sin(t) * e.length / 2;
  return [
    { x: e.x - i, y: e.y - n },
    { x: e.x + i, y: e.y + n }
  ];
}
function Ng(e) {
  return {
    id: e.id,
    type: "window",
    x: (e.x1 + e.x2) / 2,
    y: (e.y1 + e.y2) / 2,
    length: Math.hypot(e.x2 - e.x1, e.y2 - e.y1),
    angle: Math.atan2(e.y2 - e.y1, e.x2 - e.x1) * 180 / Math.PI
  };
}
function si(e, t, i) {
  let n = !1;
  for (let o = 0, r = e.length - 1; o < e.length; r = o++) {
    const a = e[o], s = e[r];
    a.y > i != s.y > i && t < (s.x - a.x) * (i - a.y) / (s.y - a.y) + a.x && (n = !n);
  }
  return n;
}
function jg(e, t, i) {
  for (const n of t) {
    const o = zo(e.x, e.y, -i.x, -i.y, n);
    if (o === void 0) continue;
    if (!(o <= ke && yn(e.x, e.y, n) <= ke)) return !1;
  }
  return !0;
}
function Wg(e, t) {
  return gl(_g(e, t) + 180, e.north ?? 0);
}
function xl(e, t, i, n) {
  return [
    e,
    t,
    { x: t.x + i.x * n, y: t.y + i.y * n },
    { x: e.x + i.x * n, y: e.y + i.y * n }
  ];
}
function Bg(e, t, i, n = 1) {
  const [o, r] = wl(e), a = Math.max(0, Math.min(1, n)), s = (o.x + r.x) / 2, l = (o.y + r.y) / 2, c = (p) => ({ x: s + (p.x - s) * a, y: l + (p.y - l) * a });
  return xl(c(o), c(r), t, i);
}
function aa(e, t, i) {
  return xl({ x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 }, t, i);
}
function Ft(e) {
  return e.map((t) => `${t.x},${t.y}`).join(" ");
}
function sa(e, t, i, n, o, r) {
  const { dir: a, openAmount: s, shutterOpen: l, strength: c = 1, railings: p = [] } = r, d = typeof r.direct == "number" && Number.isFinite(r.direct) ? Math.max(0, Math.min(1, r.direct)) : 1, h = {
    light: r.light ?? Ti,
    // `?? ` would swallow the explicit null that means "no shade at all".
    shade: r.shade === void 0 ? oo : r.shade
  };
  if (c <= 0) return m;
  const u = Math.min(i, n) * Og(r.reach), f = (E) => Hg(E, s(E), l(E)), g = bn(e, t, f), y = g.map((E) => aa(E, a, u)), b = u * Dg(r.drop), k = (E) => {
    const N = b * Uo(E) + Math.hypot(E.length, Se(E)) / 2, Y = Math.max(N, u), re = [];
    for (const W of g) {
      const w = (W.x1 - E.x) * a.x + (W.y1 - E.y) * a.y, H = (W.x2 - E.x) * a.x + (W.y2 - E.y) * a.y;
      if (Math.max(w, H) <= 0) continue;
      let se = W;
      if (Math.min(w, H) < 0) {
        const Pt = w / (w - H), di = W.x1 + (W.x2 - W.x1) * Pt, Zo = W.y1 + (W.y2 - W.y1) * Pt;
        se = w > 0 ? { ...W, x2: di, y2: Zo } : { ...W, x1: di, y1: Zo };
      }
      re.push(Ft(aa(se, a, Y)));
    }
    return re;
  }, S = p.length ? [...e, ...p] : e, x = (E, N, Y) => {
    if (!jg(E, S, a)) return;
    const re = Rg(E, a, g, u), [W, w] = wl(E), H = w.x - W.x, se = w.y - W.y, di = Math.abs(H * a.y - se * a.x) * Y / 2;
    return {
      ...N,
      sky: !1,
      // The outline runs past the falloff, so the ellipse is what bounds the
      // patch and never the polygon's flat far edge.
      points: Ft(Bg(E, a, re + E.length, Y)),
      cx: E.x,
      cy: E.y,
      along: re,
      across: Math.max(1, di * Pg),
      angle: Math.atan2(a.y, a.x) * 180 / Math.PI,
      // A beam has no edge to soften — it fades along its own length — so it
      // has no second polygon, and no shadow set of its own either: the wall
      // openings all share the one global shadow mask.
      haloPoints: "",
      halo: void 0,
      haloLightId: "",
      haloShadeId: "",
      shadows: []
    };
  }, $ = t.map((E, N) => {
    const Y = {
      lightId: `${o}-b${N}`,
      shadeId: `${o}-s${N}`,
      fadeId: `${o}-f${N}`,
      shadowMaskId: `${o}-k${N}`,
      clipId: `${o}-c${N}`
    }, re = f(E);
    if (re > 0) {
      if (ie(E)) {
        const W = vl(E, a, b, re), w = bl(E, re), H = (se) => ({
          cx: W.x,
          cy: W.y,
          angle: E.angle,
          along: Math.max(1, w.along * se),
          across: Math.max(1, w.across * se)
        });
        return {
          ...Y,
          sky: !0,
          // Its own rectangle, moved — not a sweep. See skylightPatchPolygon.
          // Twice: the patch at its true size, and the halo spilling past it,
          // which is what keeps the edge from being a hard cut. See
          // SKYLIGHT_CORE for why one gradient cannot do both jobs.
          points: Ft(oa(E, a, b, re)),
          haloPoints: Ft(oa(E, a, b, re, na)),
          // The core's own ellipse rides on the record itself, so the shared
          // gradient helper reads a skylight exactly as it reads a beam.
          ...H(Fg),
          halo: H(na),
          haloLightId: `${o}-h${N}`,
          haloShadeId: `${o}-hs${N}`,
          shadows: k(E)
        };
      }
      if (!p.some((W) => yn(E.x, E.y, W) <= ke))
        return x(E, Y, re);
    }
  }), M = p.map(
    (E, N) => x(Ng(E), {
      lightId: `${o}-rb${N}`,
      shadeId: `${o}-rs${N}`,
      fadeId: `${o}-rf${N}`,
      shadowMaskId: `${o}-rk${N}`,
      clipId: `${o}-rc${N}`
    }, 1)
  );
  if ($.push(...M), !$.some((E) => E !== void 0)) return m;
  const P = y.map(Ft), A = X, I = `${o}-shade`, C = `${o}-shadow`, L = -A, B = -A, j = i + A * 2, q = n + A * 2, J = (E, N = m) => _`<rect x=${L} y=${B} width=${j} height=${q} fill=${E}>${N}</rect>`, ye = (E, N) => _`<polygon points=${E} fill=${N} stroke=${N} stroke-width=${X} />`, ue = (E, N, Y, re = "beam", W = 1) => _`<radialGradient id=${N} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
              gradientTransform=${`translate(${E.cx} ${E.cy}) rotate(${E.angle}) scale(${E.along} ${E.across})`}>
          ${re === "core" ? (
    // Even, corner to corner: the ellipse circumscribes the
    // rectangle, so what ends this patch is the rectangle's own
    // outline. See SKYLIGHT_CORE.
    _`<stop offset="0" stop-color=${Y} stop-opacity=${W} />
          <stop offset="0.66" stop-color=${Y} stop-opacity=${0.92 * W} />
          <stop offset="1" stop-color=${Y} stop-opacity=${0.62 * W} />`
  ) : re === "halo" ? (
    // …and the spill past it, which is what keeps that outline
    // from reading as a cut. Never full strength: it is the
    // light around the patch, not the patch.
    _`<stop offset="0" stop-color=${Y} stop-opacity=${0.5 * W} />
          <stop offset="0.48" stop-color=${Y} stop-opacity=${0.38 * W} />
          <stop offset="1" stop-color=${Y} stop-opacity="0" />`
  ) : _`<stop offset="0" stop-color=${Y} stop-opacity=${W} />
          <stop offset="0.45" stop-color=${Y} stop-opacity=${0.55 * W} />
          <stop offset="1" stop-color=${Y} stop-opacity="0" />`}
        </radialGradient>`, ci = h.shade === null ? m : _`
      <!-- Where the shade shows: everywhere, minus the patches of light, plus
           back wherever a wall stands in one. The order is the whole logic. -->
      <mask id=${I} maskUnits="userSpaceOnUse" x=${L} y=${B} width=${j} height=${q}>
        ${J("#fff")}
        ${$.map(
    (E) => E ? ue(E, E.shadeId, "#000", E.sky ? "core" : "beam", d) : m
  )}
        ${$.map(
    (E) => E && E.halo ? ue(E.halo, E.haloShadeId, "#000", "halo", d) : m
  )}
        ${$.map(
    (E) => E && !E.sky ? _`<polygon points=${E.points} fill=${`url(#${E.shadeId})`} />` : m
  )}
        ${P.map((E) => ye(E, "#fff"))}
        <!-- Skylights come after the wall shade has been put back, each with
             only its OWN downwind walls restored over it. Every other wall in
             the plan is upwind of the roof light and so cannot shade it — see
             downwindShadows above.
             Each one is CLIPPED to its own halo, and that is what keeps them
             from interfering. Unclipped, a roof light's white restoration ran
             the whole width of the canvas and landed on whatever a *later*
             skylight had already punched — so a partition upwind of the lower
             of two roof lights shaded it anyway, by being downwind of the
             upper one, and swapping the two round in the openings array
             changed the drawing.
             Clipped, a skylight contributes nothing outside its own light, so
             the only arrangement left where array order decides anything is
             two patches genuinely overlapping — which is one roof light
             shining through another's floor, and has no right answer to get
             wrong. -->
        ${$.map(
    (E) => E && E.sky ? _`<g clip-path=${`url(#${E.clipId})`}>
                <polygon points=${E.haloPoints} fill=${`url(#${E.haloShadeId})`} />
                <polygon points=${E.points} fill=${`url(#${E.shadeId})`} />
                ${E.shadows.map((N) => ye(N, "#fff"))}
              </g>` : m
  )}
      </mask>`;
  return _`
    <defs>
      ${ci}
      <!-- The wall shadows again, for the warm patches themselves. -->
      <mask id=${C} maskUnits="userSpaceOnUse" x=${L} y=${B} width=${j} height=${q}>
        ${J("#fff")}
        ${P.map((E) => ye(E, "#000"))}
      </mask>
      <!-- The halo rectangle of each skylight, so its contribution to the
           shade mask above can be confined to its own light. Same reason the
           masks below are per-skylight: what one roof light does is nobody
           else's business. -->
      ${$.map(
    (E) => E && E.sky ? _`<clipPath id=${E.clipId} clipPathUnits="userSpaceOnUse">
              <polygon points=${E.haloPoints} />
            </clipPath>` : m
  )}
      <!-- …and one per skylight, carrying its downwind walls alone. A mask
           each rather than a shared one because "downwind" is measured from
           the roof light, so no two skylights have the same answer. -->
      ${$.map(
    (E) => E && E.sky ? _`<mask id=${E.shadowMaskId} maskUnits="userSpaceOnUse"
                      x=${L} y=${B} width=${j} height=${q}>
              ${J("#fff")}
              ${E.shadows.map((N) => ye(N, "#000"))}
            </mask>` : m
  )}
    </defs>
    <g class="fp-sunlight">
      ${h.shade === null ? m : _`<rect x=${L} y=${B} width=${j} height=${q}
            style=${`fill:${fe(h.shade, oo)};`}
            opacity=${zg * c} mask=${`url(#${I})`} />`}
      ${$.map(
    (E) => E ? ue(E, E.lightId, fe(h.light, Ti), E.sky ? "core" : "beam") : m
  )}
      ${$.map(
    (E) => E && E.halo ? ue(E.halo, E.haloLightId, fe(h.light, Ti), "halo") : m
  )}
      <g mask=${`url(#${C})`} opacity=${ia * c * d}>
        ${$.map(
    (E) => E && !E.sky ? _`<polygon class="fp-sunbeam" points=${E.points}
                            fill=${`url(#${E.lightId})`} />` : m
  )}
      </g>
      <!-- Each roof light through a mask of its own, carrying the walls
           downwind of it and no others — the reason spelled out above. -->
      ${$.map(
    (E) => E && E.sky ? _`<g mask=${`url(#${E.shadowMaskId})`} opacity=${ia * c * d}>
              <polygon class="fp-sunbeam fp-skylight-halo" points=${E.haloPoints}
                       fill=${`url(#${E.haloLightId})`} />
              <polygon class="fp-sunbeam fp-skylight-patch" points=${E.points}
                       fill=${`url(#${E.lightId})`} />
            </g>` : m
  )}
    </g>`;
}
function _l(e) {
  switch (e) {
    case "contain":
      return "xMidYMid meet";
    case "cover":
      return "xMidYMid slice";
    default:
      return "none";
  }
}
function Vo(e, t, i, n) {
  const o = X + 4, r = X;
  return _`
    <defs>
      <mask id=${n} maskUnits="userSpaceOnUse"
            x=${-r} y=${-r} width=${t + r * 2} height=${i + r * 2}>
        <rect x=${-r} y=${-r} width=${t + r * 2} height=${i + r * 2}
              fill="white" />
        ${e.map((a) => {
    if (ie(a)) return m;
    const s = a.length / 2;
    return _`<rect x=${a.x - s} y=${a.y - o / 2}
                           width=${a.length} height=${o} fill="black"
                           transform="rotate(${a.angle} ${a.x} ${a.y})" />`;
  })}
      </mask>
    </defs>`;
}
function qo(e) {
  if (!e.length) return { x: 0, y: 0 };
  const t = e.reduce((i, n) => ({ x: i.x + n.x, y: i.y + n.y }), { x: 0, y: 0 });
  return { x: t.x / e.length, y: t.y / e.length };
}
function Ug(e) {
  if (e.length < 3) return;
  let t = 0, i = 0, n = 0;
  for (let o = 0, r = e.length - 1; o < e.length; r = o++) {
    const a = e[o], s = e[r], l = s.x * a.y - a.x * s.y;
    t += l, i += (s.x + a.x) * l, n += (s.y + a.y) * l;
  }
  if (t !== 0)
    return { x: i / (3 * t), y: n / (3 * t) };
}
function $l(e) {
  const t = Ug(e);
  return t && si(e, t.x, t.y) ? t : qo(e);
}
const ro = { scale: 1, txPercent: 0, tyPercent: 0 };
function Vg(e, t, i, n, o = 0.15, r = Un, a, s) {
  if (!e.length) return ro;
  const l = Et(t, i, n), c = s ?? { w: l.w, h: l.h, projection: "plan", wallHeight: 0 }, p = e.map((C) => {
    const L = ot(C.x, C.y, t, i, n);
    return Mt(L.x, L.y, c);
  }), d = xt(c), h = p.map((C) => C.x), u = p.map((C) => C.y);
  let f = Math.min(...h), g = Math.max(...h), y = Math.min(...u) - (c.projection === "iso" ? c.wallHeight : 0), b = Math.max(...u);
  if (c.projection === "iso" && c.orbitSpan !== void 0) {
    const C = Math.min(...e.map((ue) => ue.x)), L = Math.max(...e.map((ue) => ue.x)), B = Math.min(...e.map((ue) => ue.y)), j = Math.max(...e.map((ue) => ue.y)), q = ot((C + L) / 2, (B + j) / 2, t, i, n), J = Mt(q.x, q.y, c), ye = xt({
      ...c,
      padding: 0,
      orbitSpan: Math.SQRT2 * Math.hypot(L - C, j - B)
    });
    f = J.x - ye.w / 2, g = J.x + ye.w / 2, y = J.y - (ye.h - c.wallHeight) / 2 - c.wallHeight, b = J.y + (ye.h - c.wallHeight) / 2;
  }
  const k = Math.max(g - f, b - y) * o, S = Math.max(g - f + k * 2, 1), x = Math.max(b - y + k * 2, 1), $ = Math.max(1, Math.min(r, Math.min(d.w / S, d.h / x))), M = a ?? $;
  if (!Number.isFinite(M)) return ro;
  const P = (f + g) / 2 / d.w, A = (y + b) / 2 / d.h, I = (C) => Math.min(0, Math.max(100 * (1 - M), C));
  return {
    scale: M,
    txPercent: I(50 - M * P * 100),
    tyPercent: I(50 - M * A * 100)
  };
}
function qg(e) {
  const t = e.zoom;
  if (!(typeof t != "number" || !Number.isFinite(t)))
    return Math.max(1, Math.min(is, t));
}
function Gg(e, t) {
  if (!Number.isFinite(e) || e <= 1 || t === "auto") return 1;
  const i = typeof t == "number" && Number.isFinite(t) && t > 0 ? t : Vn;
  return 1 / e * i;
}
const Ln = 12, Kg = 1.5, Xg = 0.4;
function kl(e) {
  return _`
    <defs>
      <pattern id=${e} width=${Ln} height=${Ln}
               patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line class="fp-dead-space-line" x1="0" y1="0" x2="0" y2=${Ln}
              stroke=${bo} stroke-width=${Kg} />
      </pattern>
    </defs>`;
}
function Sl(e, t) {
  const i = e.map((n) => `${n.x},${n.y}`).join(" ");
  return _`<polygon class="fp-dead-space" points=${i}
                      fill=${`url(#${t})`} fill-rule="nonzero"
                      fill-opacity=${Xg} stroke="none" />`;
}
function Ml(e, t) {
  const i = e.points.map((r) => `${r.x},${r.y}`).join(" "), n = t !== void 0 && (e.highlight ?? "fill") !== "border", o = n ? e.activeOpacity ?? e.opacity : e.opacity;
  return _`<polygon class="fp-area" data-id=${pe(e.id) ?? m}
                       data-entity=${Ve(e.entity) ?? m}
                       points=${i}
                       fill=${n ? t : fe(e.color, Q)}
                       fill-opacity=${O(o, Bn)}
                       stroke="none"
                       stroke-width="0" />`;
}
function El(e, t, i) {
  const n = t !== void 0 && (e.highlight ?? "fill") !== "fill", o = n ? t : e.borderColor ? fe(e.borderColor, "none") : void 0;
  if (o === void 0 || o === "none") return m;
  const r = e.points.map((s) => `${s.x},${s.y}`).join(" "), a = O(
    e.borderWidth,
    n ? X / 2 : Kc
  );
  return !n || i === void 0 ? _`<polygon class="fp-area-border" data-id=${pe(e.id) ?? m}
                        data-entity=${Ve(e.entity) ?? m}
                        points=${r} fill="none"
                        stroke=${o} stroke-width=${a} />` : _`
    <clipPath id=${i}><polygon points=${r} /></clipPath>
    <polygon class="fp-area-border" data-id=${pe(e.id) ?? m}
             data-entity=${Ve(e.entity) ?? m}
             points=${r} fill="none" clip-path=${`url(#${i})`}
             stroke=${o} stroke-width=${a * 2} />`;
}
function qt(e, t, i = $e) {
  const n = t ?? e.color ?? os, o = cs(ri(i, e.type) ?? ls, e.w, e.h, n), r = e.hand === "left" ? " scale(-1 1)" : "";
  return _`<g class=${`fp-furniture fp-furniture-${pe(e.type) ?? "unknown"}`}
                data-id=${pe(e.id) ?? m}
                data-entity=${Ve(e.entity) ?? m}
                transform="translate(${e.x} ${e.y}) rotate(${e.angle ?? 0})${r}">${o}</g>`;
}
function Zi(e, t, i, n, o, r = 3, a = "fixed") {
  function s(h) {
    return (h % 360 + 360) % 360;
  }
  function l(h, u, f) {
    return Math.max(Math.min(h, f), u);
  }
  const c = K(O(i, dn), a), p = s(O(n, hn)), d = l(O(o, pn), 0, 360);
  return v`
    <div
      class="ripple ${e ? "active" : ""}"
      style="width:${c};height:${c};--fp-ripple-color:${fe(t, Q)};--fp-ripple-direction:${p};--fp-ripple-width:${d}"
    >
      <span class="dot"></span>
      ${Array.from(
    { length: r },
    (h, u) => v`<span class="ring" style="animation-delay:${(u * 0.6).toFixed(2)}s;"></span>`
  )}
    </div>
  `;
}
function Qi(e, t) {
  if (!t || !e) return null;
  const i = e[t]?.state;
  if (i == null || i === "unavailable" || i === "unknown") return null;
  const n = Number(i);
  return Number.isFinite(n) ? n : null;
}
function Al(e, t) {
  const i = e.color ?? Q, n = (e.dotSize ?? ko) / 2, o = e.x + e.w / 2, r = e.y + e.h / 2, a = e.angle ?? 0, s = Sr(e.xSensor, t.xReading), l = Sr(e.ySensor, t.yReading), c = s != null, p = l != null, d = t.xPresent === !1 || t.yPresent === !1, h = e.w / 2, u = e.h / 2, f = t.editing ? _`<rect class="tracker-zone ${d ? "presence-gated" : ""}"
                x=${-h} y=${-u} width=${e.w} height=${e.h}
                fill=${i} fill-opacity="0.08" stroke=${i} stroke-width="1.5"
                stroke-dasharray="6 4" rx="4" pointer-events="none" />` : _``;
  let g;
  if (d)
    g = _``;
  else if (c && p) {
    const y = -h + s * e.w, b = -u + l * e.h, k = `0,${-n} ${n * 0.9},${n * 0.7} ${-n * 0.9},${n * 0.7}`, S = Math.max(n * 3.5, Math.min(e.w, e.h) * 0.45);
    g = _`
      <g class="tracker-marker" style="transform:translate(${y}px, ${b}px);">
        <circle class="tracker-ring" cx="0" cy="0" r="0"
                fill="none" stroke=${i} stroke-width="1.5"
                style="--fp-tracker-ring-max:${S}px;" />
        <circle class="tracker-ring" cx="0" cy="0" r="0"
                fill="none" stroke=${i} stroke-width="1.5"
                style="--fp-tracker-ring-max:${S}px; animation-delay:0.7s;" />
        <polygon class="tracker-dot" points=${k} fill=${i} />
      </g>`;
  } else if (c || p)
    if (c) {
      const y = -h + s * e.w;
      g = _`
        <g class="tracker-line" style="transform:translate(${y}px, 0);">
          <line class="tracker-line-stroke" x1="0" y1=${-u} x2="0" y2=${u}
                stroke=${i} stroke-width="1.5" />
          <line class="tracker-band" x1="0" y1=${-u} x2="0" y2=${u}
                stroke=${i} stroke-width="3" stroke-linecap="round" />
          <line class="tracker-band" x1="0" y1=${-u} x2="0" y2=${u}
                stroke=${i} stroke-width="3" stroke-linecap="round"
                style="animation-delay:0.8s;" />
        </g>`;
    } else {
      const y = -u + l * e.h;
      g = _`
        <g class="tracker-line tracker-line-h" style="transform:translate(0, ${y}px);">
          <line class="tracker-line-stroke" x1=${-h} y1="0" x2=${h} y2="0"
                stroke=${i} stroke-width="1.5" />
          <line class="tracker-band" x1=${-h} y1="0" x2=${h} y2="0"
                stroke=${i} stroke-width="3" stroke-linecap="round" />
          <line class="tracker-band" x1=${-h} y1="0" x2=${h} y2="0"
                stroke=${i} stroke-width="3" stroke-linecap="round"
                style="animation-delay:0.8s;" />
        </g>`;
    }
  else t.editing ? g = _`<circle class="tracker-placeholder" cx="0" cy="0" r=${n}
                          fill=${i} fill-opacity="0.25" />` : g = _``;
  return _`
    <g class="tracker fp-tracker ${t.editing ? "editing" : ""}"
       data-id=${pe(e.id) ?? m}
       transform="translate(${o} ${r}) rotate(${a})">
      ${f}${g}
    </g>`;
}
function la(e, t, i, n) {
  let o = null, r = n;
  for (const a of i) {
    const s = a.x2 - a.x1, l = a.y2 - a.y1, c = s * s + l * l;
    if (c === 0) continue;
    let p = ((e - a.x1) * s + (t - a.y1) * l) / c;
    p = Math.max(0, Math.min(1, p));
    const d = a.x1 + p * s, h = a.y1 + p * l, u = Math.hypot(e - d, t - h);
    u < r && (r = u, o = { x: d, y: h, angle: Math.atan2(l, s) * 180 / Math.PI });
  }
  return o;
}
class kn {
  static currentFloorEntityIds(t, i) {
    const n = t ? Ce(t) : [], o = n.find((l) => l.id === i) ?? n[0];
    if (!o) return [];
    const r = /* @__PURE__ */ new Set(), a = !!t?.ambientDaylight || !!t && no(t);
    a && r.add("sun.sun");
    const s = a && t ? ti(t) : void 0;
    s && r.add(s);
    for (const l of o.openings)
      l.entity && r.add(l.entity), l.secondaryEntity && r.add(l.secondaryEntity), l.shutterEntity && r.add(l.shutterEntity), l.shutterSecondaryEntity && r.add(l.shutterSecondaryEntity);
    for (const l of o.items) {
      l.entity && r.add(l.entity);
      for (const c of Ge(l))
        c.entity && r.add(c.entity);
    }
    for (const l of o.furniture)
      l.entity && r.add(l.entity);
    for (const l of o.areas)
      l.entity && r.add(l.entity);
    for (const l of o.trackers)
      for (const c of [l.xSensor, l.ySensor])
        c?.entity && r.add(c.entity), c?.presence?.entity && r.add(c.presence.entity);
    return Array.from(r).sort();
  }
  static scopeKey(t, i) {
    const n = kn.currentFloorEntityIds(t, i);
    return n.length ? n.join("|") : "none";
  }
}
function Yg(e) {
  const t = Date.now() / 1e3, i = e?.historyReplay?.lookbackSeconds, n = typeof i == "number" && Number.isFinite(i) && i > 0 ? i : 3600;
  return { start: Math.max(0, t - n), end: t };
}
function ca(e, t) {
  const i = Math.max(0, Math.min(e, t)), n = Math.max(0, Math.max(e, t));
  return {
    start: i,
    end: Math.max(i, n)
  };
}
function Zg(e, t) {
  return kn.currentFloorEntityIds(e, t);
}
function Qg(e, t) {
  return kn.scopeKey(e, t);
}
function Jg(e, t, i) {
  const o = Math.max(1, i - t) / 30, r = e?.historyReplay?.defaultSpeed;
  return Math.max(0.25, r ?? o);
}
function ey(e) {
  const t = Date.parse(e);
  return Number.isNaN(t) ? Date.now() / 1e3 : t / 1e3;
}
function da(e) {
  if (!Number.isFinite(e) || e <= 0) return "";
  const t = new Date(e * 1e3), i = t.getFullYear(), n = `${t.getMonth() + 1}`.padStart(2, "0"), o = `${t.getDate()}`.padStart(2, "0"), r = `${t.getHours()}`.padStart(2, "0"), a = `${t.getMinutes()}`.padStart(2, "0");
  return `${i}-${n}-${o}T${r}:${a}`;
}
function ty(e) {
  const t = Math.min(3, Math.max(-2, e));
  return Number((10 ** t).toPrecision(4));
}
function iy(e, t, i) {
  if (!e) return;
  if (i.has(t))
    return i.get(t);
  const n = Ce(e);
  let o;
  for (const r of n) {
    for (const a of r.items ?? [])
      if (a.entity === t)
        return o = a.activeColor ?? a.rippleColor, i.set(t, o), o;
    for (const a of r.openings ?? [])
      if (a.entity === t)
        return o = a.activeColor, i.set(t, o), o;
    for (const a of r.furniture ?? [])
      if (a.entity === t)
        return o = a.activeColor, i.set(t, o), o;
  }
  i.set(t, void 0);
}
function ny(e, t, i, n, o) {
  if (!t) return Yt(e);
  const r = R(iy(t, e.entityId, n)), a = He(e.entityId, e.newState);
  if (o && r) return a ? r : "#ffffff";
  const s = Yt(e);
  return a ? s : "#ffffff";
}
function oy(e, t) {
  if (!Number.isFinite(e)) return "—";
  try {
    return t.format(new Date(e * 1e3));
  } catch {
    return new Date(e * 1e3).toISOString();
  }
}
var ry = Object.defineProperty, ay = Object.getOwnPropertyDescriptor, oe = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? ay(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && ry(t, i, o), o;
};
function sy(e) {
  const t = e.state.playbackController, i = e.state, o = i.enabled || i.startTime > 0 ? void 0 : e.getDefaultWindow(), r = o ? o.start : i.startTime, a = o ? o.end : i.endTime, s = e.formatReplayTime(
    o ? o.end : t.currentTime
  );
  return {
    events: i.historyEvents,
    startTime: o ? o.start : t.startTime,
    endTime: o ? o.end : t.endTime,
    currentTime: o ? o.end : t.currentTime,
    visible: i.historyVisible,
    enabled: i.enabled,
    ready: i.ready,
    playing: t.playing,
    timelineExpanded: i.timelineExpanded,
    logExpanded: i.logExpanded,
    speedExpanded: i.speedExpanded,
    error: i.error,
    rangeWarning: i.rangeWarning,
    panelId: i.panelId,
    replaySpeed: t.speed,
    currentTimeLabel: s,
    startInputValue: da(r),
    endInputValue: da(a),
    onToggleVisible: (l) => e.toggleHistoryVisible(l),
    onRangeChange: (l, c) => {
      e.handleRangeChange(l, { target: { value: c } });
    },
    onZoom: (l) => e.zoomWindow(l),
    onJump: (l) => e.jumpReplay(l),
    onStep: (l) => e.stepReplay(l),
    onPlayToggle: () => t.playing ? e.pauseReplay() : e.playReplay(),
    onToggleSpeedPanel: () => e.toggleSpeedPanel(),
    onSpeedSliderInput: (l) => e.setReplaySpeed(ty(l)),
    onSpeedChange: (l) => e.setReplaySpeed(l),
    onToggleTimeline: () => e.toggleTimeline(),
    onToggleLog: () => e.toggleLog(),
    onSeek: (l) => e.seekReplay(l)
  };
}
function ly(e) {
  return v`
    <easy-floorplan-replay-panel
      .events=${e.events}
      .startTime=${e.startTime}
      .endTime=${e.endTime}
      .currentTime=${e.currentTime}
      .visible=${e.visible}
      .enabled=${e.enabled}
      .ready=${e.ready}
      .playing=${e.playing}
      .timelineExpanded=${e.timelineExpanded}
      .logExpanded=${e.logExpanded}
      .speedExpanded=${e.speedExpanded}
      .error=${e.error}
      .rangeWarning=${e.rangeWarning}
      .panelId=${e.panelId}
      .replaySpeed=${e.replaySpeed}
      .currentTimeLabel=${e.currentTimeLabel}
      .startInputValue=${e.startInputValue}
      .endInputValue=${e.endInputValue}
      @toggle-visible=${(t) => e.onToggleVisible(!!(t.detail?.visible ?? !0))}
      @range-change=${(t) => {
    const i = t.detail?.kind ?? "start";
    t.detail?.value && e.onRangeChange(i, t.detail.value);
  }}
      @zoom=${(t) => e.onZoom(t.detail?.direction ?? 1)}
      @jump=${(t) => e.onJump(t.detail?.delta ?? 0)}
      @step=${(t) => e.onStep(t.detail?.direction ?? 1)}
      @play-toggle=${() => e.onPlayToggle()}
      @toggle-speed-panel=${() => e.onToggleSpeedPanel()}
      @speed-slider-input=${(t) => {
    const i = Number(t.detail?.value ?? 0);
    Number.isFinite(i) && e.onSpeedSliderInput(i);
  }}
      @speed-change=${(t) => {
    const i = Number(t.detail?.value ?? 1);
    Number.isFinite(i) && e.onSpeedChange(i);
  }}
      @toggle-timeline=${() => e.onToggleTimeline()}
      @toggle-log=${() => e.onToggleLog()}
      @seek=${(t) => e.onSeek(t.detail?.timestamp ?? e.currentTime)}
    ></easy-floorplan-replay-panel>
  `;
}
let ee = class extends Ue {
  constructor() {
    super(...arguments), this.events = [], this.startTime = 0, this.endTime = 0, this.currentTime = 0, this.visible = !1, this.enabled = !1, this.ready = !1, this.playing = !1, this.timelineExpanded = !1, this.logExpanded = !1, this.speedExpanded = !1, this.panelId = "replay-panel", this.replaySpeed = 1, this.currentTimeLabel = "—", this.startInputValue = "", this.endInputValue = "";
  }
  updated(e) {
    super.updated(e), (e.has("events") || e.has("currentTime") || e.has("logExpanded")) && this._logRef && this._syncLogToCurrentEvent();
  }
  _dispatch(e, t) {
    this.dispatchEvent(new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 }));
  }
  _getCurrentEvent() {
    if (!this.events.length) return;
    const e = this.currentTime;
    let t = 0, i = this.events.length - 1, n = -1;
    for (; t <= i; ) {
      const o = t + i >> 1;
      this.events[o].timestamp <= e ? (n = o, t = o + 1) : i = o - 1;
    }
    return n >= 0 ? this.events[n] : void 0;
  }
  _renderEventItem(e, t) {
    const i = e.timestamp <= this.currentTime, n = (typeof e.color == "string" ? e.color : void 0) ?? (typeof e.attributes?.color == "string" ? e.attributes.color : void 0) ?? Yt(e), o = R(n), r = o ? `background:${o}; box-shadow:0 0 0 2px ${o}22;` : m;
    return v`
      <li class="replay-event-item ${i ? "replay-event-passed" : ""} ${t ? "replay-event-current" : ""}" data-timestamp=${e.timestamp}>
        <span class="replay-event-dot" style=${r}></span>
        <span class="replay-event-time">${new Date(e.timestamp * 1e3).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}</span>
        <span class="replay-event-icon"><ha-icon icon="mdi:swap-horizontal"></ha-icon></span>
        <span class="replay-event-entity">${e.entityId}</span>
        <span class="replay-event-change">${e.oldState} → ${e.newState}</span>
      </li>
    `;
  }
  _syncLogToCurrentEvent() {
    if (!this._logRef) return;
    const e = this._logRef.querySelector(".replay-event-item.replay-event-current");
    e && e.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  render() {
    if (!this.visible)
      return v`
        <div class="replay-panel-toggle">
          <button
            class="replay-show-toggle"
            aria-expanded="false"
            aria-label="Show replay history"
            aria-controls=${this.panelId}
            @click=${() => this._dispatch("toggle-visible", { visible: !0 })}
          >
            Replay
          </button>
        </div>
      `;
    const e = this._getCurrentEvent();
    return v`
      <div class="replay-panel" id=${this.panelId}>
        <!-- Closing the panel is how you get back to now, so the button says
             so. It used to say "hide", next to a separate Live button that did
             the returning; one control does both because they were never two
             things (see ReplayController.toggleHistoryVisible). -->
        <button
          class="replay-hide-toggle"
          aria-label="Close replay and return to live"
          aria-controls=${this.panelId}
          @click=${() => this._dispatch("toggle-visible", { visible: !1 })}
        >
          live
        </button>
        <div class="replay-header">
          <div class="replay-meta">
            <span class="replay-time">${this.currentTimeLabel}</span>
          </div>
          <div class="replay-status">
            ${this.error ? v`<span class="replay-error">${this.error}</span>` : m}
            ${this.rangeWarning ? v`<span class="replay-loading">${this.rangeWarning}</span>` : m}
            ${!this.ready && this.enabled && !this.error ? v`<span class="replay-loading">Loading history…</span>` : m}
          </div>
        </div>
        <div class="replay-range">
          <label class="replay-range-field">
            <span>Start</span>
            <input
              type="datetime-local"
              .value=${this.startInputValue}
              @change=${(t) => this._dispatch("range-change", { kind: "start", value: t.target.value })}
            />
          </label>
          <label class="replay-range-field">
            <span>End</span>
            <input
              type="datetime-local"
              .value=${this.endInputValue}
              @change=${(t) => this._dispatch("range-change", { kind: "end", value: t.target.value })}
            />
          </label>
          <div class="replay-range-tools">
            <button class="replay-icon-button" aria-label="Zoom out range" title="Zoom out range" @click=${() => this._dispatch("zoom", { direction: -1 })}>
              <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
            </button>
            <button class="replay-icon-button" aria-label="Zoom in range" title="Zoom in range" @click=${() => this._dispatch("zoom", { direction: 1 })}>
              <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
            </button>
          </div>
        </div>
        <div class="replay-toolbar">
          <div class="replay-transport" role="group" aria-label="Replay transport controls">
            <button class="replay-icon-button" aria-label="Jump back 30 seconds" title="Jump back 30 seconds" @click=${() => this._dispatch("jump", { delta: -30 })}>
              <ha-icon icon="mdi:rewind-30"></ha-icon>
            </button>
            <button class="replay-icon-button" aria-label="Step back one event" title="Step back" @click=${() => this._dispatch("step", { direction: -1 })}>
              <ha-icon icon="mdi:skip-previous"></ha-icon>
            </button>
            <button class="replay-run-button" title=${this.playing ? "Pause replay" : "Run replay"} @click=${() => this._dispatch("play-toggle")}>
              <ha-icon icon=${this.playing ? "mdi:pause" : "mdi:play"}></ha-icon>
              <span>${this.playing ? "Pause" : "Run"}</span>
            </button>
            <button class="replay-icon-button" aria-label="Step forward one event" title="Step forward" @click=${() => this._dispatch("step", { direction: 1 })}>
              <ha-icon icon="mdi:skip-next"></ha-icon>
            </button>
            <button class="replay-icon-button" aria-label="Jump forward 30 seconds" title="Jump forward 30 seconds" @click=${() => this._dispatch("jump", { delta: 30 })}>
              <ha-icon icon="mdi:fast-forward-30"></ha-icon>
            </button>
          </div>
          <div class="replay-toolbar-toggles">
            <button
              class="replay-speed-toggle"
              aria-expanded=${this.speedExpanded}
              @click=${() => this._dispatch("toggle-speed-panel")}
            >
              Speed ${this.replaySpeed.toFixed(2)}x
              <ha-icon icon=${this.speedExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
            </button>
          </div>
        </div>
        ${this.speedExpanded ? v`<div class="replay-speed-panel">
              <label class="replay-speed-field replay-speed-group">
                <span>Playback speed</span>
                <input
                  class="replay-speed-slider"
                  type="range"
                  min="-2"
                  max="3"
                  step="0.01"
                  .value=${String(Math.log10(this.replaySpeed || 1))}
                  @input=${(t) => this._dispatch("speed-slider-input", { value: Number(t.target.value) })}
                />
                <input
                  class="replay-speed"
                  type="number"
                  min="0.01"
                  max="1000"
                  step="0.01"
                  .value=${this.replaySpeed.toString()}
                  @change=${(t) => this._dispatch("speed-change", { value: Number(t.target.value || 1) })}
                />
              </label>
            </div>` : m}
        <div class="replay-lanes">
          <div class="replay-view-tools">
            <button class="replay-timeline-toggle" @click=${() => this._dispatch("toggle-timeline")}>
              ${this.timelineExpanded ? "Collapse lanes" : "Expand lanes"}
            </button>
          </div>
          <div class="replay-timeline-wrap">
            <easy-floorplan-history-timeline
              .events=${this.events}
              .startTime=${this.startTime}
              .endTime=${this.endTime}
              .currentTime=${this.currentTime}
              .expanded=${this.timelineExpanded}
              @seek=${(t) => this._dispatch("seek", { timestamp: t.detail.timestamp })}
            ></easy-floorplan-history-timeline>
          </div>
        </div>
        <div class=${`replay-event-log ${this.logExpanded ? "expanded" : "collapsed"}`} role="log" aria-label="Replay event log">
          <button class="replay-log-toggle" @click=${() => this._dispatch("toggle-log")}>
            ${this.logExpanded ? "Hide log" : "Show log"}
          </button>
          ${this.logExpanded ? v`<ul
                class="replay-event-list"
                ${(t) => {
      this._logRef = t instanceof HTMLUListElement ? t : void 0, this._logRef && this.events.length && this._syncLogToCurrentEvent();
    }}
              >${Ee(this.events, (t, i) => `${t.timestamp}-${t.entityId}-${t.newState}-${i}`, (t) => this._renderEventItem(t, e?.timestamp === t.timestamp))}</ul>` : m}
          ${!this.logExpanded && !this.events.length ? v`<div class="replay-empty">No history events yet.</div>` : m}
        </div>
      </div>
    `;
  }
};
ee.styles = Re`
    .replay-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 12px 10px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      overflow-x: hidden;
    }
    .replay-panel-toggle {
      display: flex;
      justify-content: flex-start;
      margin: 0 0 4px;
    }
    /* Shaped like the floor buttons, and carrying the same skin tokens, so the
       card's two bits of chrome read as one set rather than two. */
    .replay-hide-toggle,
    .replay-show-toggle {
      border: 1px solid var(--fp-skin-badge-border, var(--divider-color, #ccc));
      border-radius: 6px;
      background: var(--fp-skin-badge-bg, var(--card-background-color, #fff));
      color: var(--fp-skin-text, var(--primary-text-color));
      padding: 4px 8px;
      font-size: 12px;
      line-height: 1;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      white-space: nowrap;
    }
    .replay-hide-toggle {
      position: absolute;
      top: 6px;
      right: 6px;
      z-index: 1;
      padding: 2px 8px;
      font-size: 11px;
      text-transform: lowercase;
    }
    .replay-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding-right: 52px;
    }
    .replay-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    /*
     * The moment being drawn, painted as its own thing rather than set in a
     * line of grey text. This is the one fact the panel exists to report --
     * with the panel open the plan is always showing the past, so "where in
     * time am I" is the only question left -- and a plain timestamp beside a
     * row of controls does not read as an answer to it. Matches the clock
     * riding the timeline playhead, which wears the same accent.
     */
    .replay-time {
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      padding: 3px 9px;
      border-radius: 999px;
      background: var(--fp-skin-accent, var(--primary-color, #03a9f4));
      color: var(--fp-skin-accent-ink, var(--text-primary-color, #fff));
      font-weight: 600;
    }
    .replay-status {
      font-size: 12px;
      color: var(--secondary-text-color, #666);
    }
    .replay-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: end;
      justify-content: space-between;
    }
    .replay-toolbar-toggles {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .replay-lanes {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .replay-transport {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
    .replay-speed-toggle {
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 999px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      padding: 4px 10px;
      font-size: 12px;
      line-height: 1.2;
      cursor: pointer;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .replay-icon-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 30px;
      height: 28px;
      padding: 2px 6px;
    }
    .replay-icon-button ha-icon,
    .replay-speed-toggle ha-icon,
    .replay-run-button ha-icon {
      --mdc-icon-size: 16px;
    }
    .replay-speed-panel {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      padding: 8px 10px;
      min-width: 0;
    }
    .replay-range {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: end;
    }
    .replay-range-tools {
      display: flex;
      gap: 4px;
    }
    .replay-view-tools {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .replay-timeline-wrap {
      max-height: 220px;
      overflow-y: auto;
      overflow-x: hidden;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      min-width: 0;
    }
    .replay-range-field,
    .replay-speed-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color, #666);
    }
    .replay-range-field {
      flex: 1 1 210px;
      min-width: 180px;
    }
    .replay-speed-group {
      flex: 1 1 auto;
      min-width: 0;
      max-width: 100%;
      margin-left: 0;
    }
    .replay-range input,
    .replay-speed-slider,
    .replay-speed-field input {
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      padding: 4px 8px;
      font-size: 12px;
      min-width: 150px;
    }
    .replay-toolbar button,
    .replay-range-tools button,
    .replay-toolbar select,
    .replay-speed-field input {
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      padding: 4px 8px;
      font-size: 12px;
      line-height: 1;
    }
    .replay-speed-slider {
      padding: 0;
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }
    .replay-speed {
      width: 92px;
      min-width: 0;
      align-self: flex-start;
    }
    .replay-run-button {
      min-width: 82px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .replay-toolbar button,
    .replay-range-tools button {
      cursor: pointer;
    }
    @media (max-width: 720px) {
      .replay-toolbar {
        align-items: stretch;
      }
      .replay-speed-group {
        margin-left: 0;
        max-width: 100%;
      }
    }
    .replay-event-log {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .replay-event-log.collapsed {
      padding-bottom: 8px;
    }
    .replay-timeline-toggle,
    .replay-log-toggle {
      align-self: flex-start;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 999px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      color: var(--primary-text-color);
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
    }
    .replay-event-log ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 180px;
      overflow: auto;
      overscroll-behavior: contain;
    }
    .replay-event-item {
      display: grid;
      grid-template-columns: auto auto auto minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
      font-size: 12px;
      color: var(--secondary-text-color, #666);
      user-select: text;
      cursor: text;
      padding: 2px 0;
    }
    .replay-event-passed {
      color: var(--primary-text-color);
    }
    .replay-event-current {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      border-radius: 6px;
      padding: 4px 6px;
      margin: -4px -6px;
    }
    .replay-event-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--divider-color, #ccc);
      flex-shrink: 0;
    }
    .replay-event-time {
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
    }
    .replay-event-entity {
      color: var(--primary-text-color);
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .replay-event-icon {
      display: inline-flex;
      align-items: center;
      color: var(--secondary-text-color, #666);
    }
    .replay-event-icon ha-icon {
      --mdc-icon-size: 16px;
    }
    .replay-event-change {
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
      text-align: right;
    }
    .replay-panel-hidden {
      border: 1px dashed var(--divider-color, #ccc);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      padding: 8px 10px;
    }
    .replay-toolbar-hidden {
      justify-content: flex-end;
      margin: 0;
    }
    .replay-empty {
      font-size: 12px;
      color: var(--secondary-text-color, #666);
    }
  `;
oe([
  G({ attribute: !1 })
], ee.prototype, "events", 2);
oe([
  G({ type: Number })
], ee.prototype, "startTime", 2);
oe([
  G({ type: Number })
], ee.prototype, "endTime", 2);
oe([
  G({ type: Number })
], ee.prototype, "currentTime", 2);
oe([
  G({ type: Boolean })
], ee.prototype, "visible", 2);
oe([
  G({ type: Boolean })
], ee.prototype, "enabled", 2);
oe([
  G({ type: Boolean })
], ee.prototype, "ready", 2);
oe([
  G({ type: Boolean })
], ee.prototype, "playing", 2);
oe([
  G({ type: Boolean })
], ee.prototype, "timelineExpanded", 2);
oe([
  G({ type: Boolean })
], ee.prototype, "logExpanded", 2);
oe([
  G({ type: Boolean })
], ee.prototype, "speedExpanded", 2);
oe([
  G({ type: String })
], ee.prototype, "error", 2);
oe([
  G({ type: String })
], ee.prototype, "rangeWarning", 2);
oe([
  G({ type: String })
], ee.prototype, "panelId", 2);
oe([
  G({ type: Number })
], ee.prototype, "replaySpeed", 2);
oe([
  G({ type: String })
], ee.prototype, "currentTimeLabel", 2);
oe([
  G({ type: String })
], ee.prototype, "startInputValue", 2);
oe([
  G({ type: String })
], ee.prototype, "endInputValue", 2);
ee = oe([
  rn("easy-floorplan-replay-panel")
], ee);
const Tl = "--fp-color-", Cl = 24;
function ce(e) {
  return typeof e != "string" ? "" : e.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
}
function Il(e) {
  return Tl + ce(e);
}
function ha(e) {
  return `var(${Il(e)})`;
}
function ni(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set(), i = [];
  for (const n of e) {
    if (!n || typeof n != "object") continue;
    const { name: o, color: r } = n, a = ce(o), s = R(r);
    if (!(!a || !s || t.has(a)) && (t.add(a), i.push({ name: o.trim(), color: s }), i.length >= Cl))
      break;
  }
  return i;
}
function Pl(e) {
  return ni(e).map((t) => `${Il(t.name)}:${t.color};`).join("");
}
function zl(e) {
  return ni(e).map((t) => `${ce(t.name)}=${t.color}`).join(",");
}
const cy = /^[Vv][Aa][Rr]\(\s*--fp-color-([\p{L}\p{N}-]+)\s*(?:,((?:[^()]|\([^()]*\))*))?\)$/u;
function Ol(e) {
  return ao(e)?.slug;
}
function ao(e) {
  if (typeof e != "string") return;
  const t = cy.exec(e.trim());
  if (!t) return;
  const i = t[2]?.trim();
  return { slug: t[1], fallback: i || void 0 };
}
function Ci(e, t) {
  const i = Ol(e);
  if (!i) return e;
  const n = ni(t).find((o) => ce(o.name) === i);
  return n ? n.color : e;
}
function pa(e, t, i) {
  if (!t) return e;
  const n = (o) => {
    if (typeof o == "string") {
      const r = ao(o);
      if (r?.slug !== t) return o;
      const a = ao(i);
      return r.fallback && a && !a.fallback ? `var(${Tl}${a.slug}, ${r.fallback})` : i;
    }
    return Array.isArray(o) ? o.map(n) : o && typeof o == "object" ? Object.fromEntries(Object.entries(o).map(([r, a]) => [r, n(a)])) : o;
  };
  return n(e);
}
function Ll(e, t, i, n) {
  if (!(n > 0) || !(e.length > 0)) return [];
  if (ie(e)) return hy(e, t, i, n);
  const o = [], r = e.length / 2, a = e.type === "window" ? n * Xn : 0, s = n * Yn, l = (x) => Math.max(0, Math.min(1, O(x, 0))), c = l(t.amount ?? (t.open === !1 ? 0 : 1)), p = t.second ? l(t.second.amount) : c, d = (x, $, M = t.accent) => fe($ ? M : x === 0 ? R(t.inactive) ?? t.color : t.color, Q), h = d(c, t.active), u = t.second ? d(p, t.second.active) : h, f = $n(e), g = e.angle * Math.PI / 180, y = (x, $) => (x *= e.flipH ? -1 : 1, $ *= e.flipV ? -1 : 1, i(e.x + x * Math.cos(g) - $ * Math.sin(g), e.y + x * Math.sin(g) + $ * Math.cos(g))), b = (x, $, M, P, A = h, I = a, C = s, L = f) => {
    C <= I || o.push({ kind: "panel", id: e.id, base: [y(x, $), y(M, P)], z0: I, z1: C, color: A, glazed: L });
  }, k = (x, $, M, P, A, I = h, C = u, L = -1, B = f, j = 0) => {
    const q = P * Math.PI / 2;
    if (b(x, j, x + M * Math.cos(q), j + L * M * Math.sin(q), I, a, s, B), $ > x) {
      const J = A * Math.PI / 2;
      b($, j, $ - M * Math.cos(J), j + L * M * Math.sin(J), C, a, s, B);
    }
  };
  o.push({ kind: "opening-hit", id: e.id, base: [y(-r, 0), y(r, 0)], z0: a, z1: s });
  const S = xe(e) ? void 0 : ne(e);
  if (S === "swing") {
    const x = Fe(e) === "double", $ = x ? r : e.length * xn(e);
    k(-r, x ? r : -r, $, c, p), !x && $ < e.length && b(-r + $, 0, r, 0, R(t.color), a, s, !0);
  } else if (S === "fixed")
    b(-r, 0, r, 0, R(t.color));
  else if (S === "roll")
    b(-r, 0, r, 0, h, a + (s - a) * c, s, !1);
  else if (S === "awning") {
    const x = c * Math.PI / 2, $ = (s - a) * Math.sin(x), M = s - (s - a) * Math.cos(x), P = y(-r, -$), A = y(r, -$);
    o.push({
      kind: "panel",
      id: e.id,
      base: [P, A],
      z0: M,
      z1: s,
      color: h,
      glazed: f,
      vertices: [
        { ...P, z: M },
        { ...A, z: M },
        { ...y(r, 0), z: s },
        { ...y(-r, 0), z: s }
      ]
    });
  } else if (S === "slide") {
    const x = ai(e), $ = r / 2, M = 1.75;
    x === "bypass" ? (b(-r, M, 0, M, R(t.color)), b(-r * c, -M, r - r * c, -M)) : x === "biparting" ? (b(-r - r * c, 0, -r * c, 0), b(r * p, 0, r + r * p, 0, u)) : x === "biparting-bypass" ? (b(-r, M, -$, M, R(t.color)), b($, M, r, M, R(t.color)), b(-$ - $ * c, -M, -$ * c, -M), b($ * p, -M, $ + $ * p, -M, u)) : x === "converging" ? (b(-r + $ * c, M, $ * c, M), b(-$ * p, -M, r - $ * p, -M, u)) : b(-r + e.length * c, 0, r + e.length * c, 0);
  }
  if (t.shutter) {
    const x = t.shutter, $ = l(x.amount), M = x.second ? l(x.second.amount) : $, P = d($, x.active, x.accent ?? t.accent), A = x.second ? d(M, x.second.active, x.accent ?? t.accent) : P;
    if (x.style === "swing") {
      const I = x.flip ? -1 : 1;
      k(-r, r, r, $, M, P, A, I, !1, I * ((X + 4) / 2 + 1.5));
    } else
      b(-r, 2, r, 2, P, a + (s - a) * $, s, !1);
  }
  return o;
}
const dy = Math.PI / 3;
function hy(e, t, i, n) {
  const o = e.length / 2, r = Se(e) / 2;
  if (!(r > 0)) return [];
  const a = (M) => Math.max(0, Math.min(1, O(M, 0))), s = a(t.amount ?? (t.open === !1 ? 0 : 1)), l = (M, P, A = t.accent) => fe(P ? A : M === 0 ? R(t.inactive) ?? t.color : t.color, Q), c = e.angle * Math.PI / 180, p = (M, P) => (M *= e.flipH ? -1 : 1, P *= e.flipV ? -1 : 1, i(e.x + M * Math.cos(c) - P * Math.sin(c), e.y + M * Math.sin(c) + P * Math.cos(c))), d = (M, P) => [p(-o, M), p(o, M), p(o, P), p(-o, P)], h = d(-r, r), u = [];
  if (u.push({
    kind: "opening-hit",
    id: e.id,
    base: h,
    z0: n,
    z1: n,
    vertices: h.map((M) => ({ ...M, z: n }))
  }), t.shutter) {
    const M = a(t.shutter.amount), P = r * 2 * (1 - M);
    if (P > 0) {
      const A = d(-r, -r + P);
      u.push({
        kind: "panel",
        id: e.id,
        base: h,
        z0: n,
        z1: n,
        color: l(M, t.shutter.active, t.shutter.accent ?? t.accent),
        glazed: !1,
        vertices: A.map((I) => ({ ...I, z: n }))
      });
    }
  }
  const f = s * dy, g = r * 2, y = -r + g * Math.cos(f), b = n + g * Math.sin(f), [k, S] = [p(-o, -r), p(o, -r)], [x, $] = [p(o, y), p(-o, y)];
  return u.push({
    kind: "panel",
    id: e.id,
    base: h,
    z0: n,
    z1: b,
    color: l(s, t.active),
    glazed: $n(e),
    vertices: [{ ...k, z: n }, { ...S, z: n }, { ...x, z: b }, { ...$, z: b }]
  }), u;
}
const de = 1e-3;
function Sn(e) {
  const t = Math.min(e.x0, e.x1), i = Math.max(e.x0, e.x1), n = Math.min(e.y0, e.y1), o = Math.max(e.y0, e.y1);
  return [
    { x: t, y: n },
    { x: i, y: n },
    { x: i, y: o },
    { x: t, y: o }
  ];
}
function Ie(e) {
  if (e.length !== 4) return !1;
  const t = Ke(e);
  return Sn({
    x0: t.minX,
    y0: t.minY,
    x1: t.maxX,
    y1: t.maxY
  }).every((i, n) => i.x === e[n].x && i.y === e[n].y);
}
const py = 1;
function pi(e, t = py) {
  if (!Ie(e)) return !1;
  const i = Ke(e);
  return i.maxX - i.minX >= t && i.maxY - i.minY >= t;
}
function uy(e, t, i) {
  const n = e[(t + 2) % 4];
  return n ? Sn({ x0: n.x, y0: n.y, x1: i.x, y1: i.y }) : e.map((o) => ({ ...o }));
}
function fy(e, t, i) {
  const n = e.map((h) => ({ ...h })), o = t % 4, r = (t + 1) % 4, a = Math.abs(n[o].y - n[r].y) < de, s = n.map((h, u) => u === o || u === r ? a ? { ...h, y: i.y } : { ...h, x: i.x } : h), l = Math.min(...s.map((h) => h.x)), c = Math.max(...s.map((h) => h.x)), p = Math.min(...s.map((h) => h.y)), d = Math.max(...s.map((h) => h.y));
  return Sn({ x0: l, y0: p, x1: c, y1: d });
}
function Ke(e) {
  const t = e.map((n) => n.x), i = e.map((n) => n.y);
  return {
    minX: Math.min(...t),
    maxX: Math.max(...t),
    minY: Math.min(...i),
    maxY: Math.max(...i)
  };
}
function Fn(e, t, i = { dx: 0, dy: 0 }) {
  let n = Ke(e);
  for (const o of t) {
    const r = Ke(o.points);
    if (!(n.maxX > r.minX && n.minX < r.maxX && n.maxY > r.minY && n.minY < r.maxY)) continue;
    const s = n.maxX - n.minX, l = n.maxY - n.minY;
    i.dx > 0 ? n = { ...n, maxX: Math.min(n.maxX, r.minX) } : i.dx < 0 ? n = { ...n, minX: Math.max(n.minX, r.maxX) } : i.dy > 0 ? n = { ...n, maxY: Math.min(n.maxY, r.minY) } : i.dy < 0 ? n = { ...n, minY: Math.max(n.minY, r.maxY) } : s >= l ? n.minX < r.maxX ? n = { ...n, maxX: r.minX } : n = { ...n, minX: r.maxX } : n.minY < r.maxY ? n = { ...n, maxY: r.minY } : n = { ...n, minY: r.maxY };
  }
  return [
    { x: n.minX, y: n.minY },
    { x: n.maxX, y: n.minY },
    { x: n.maxX, y: n.maxY },
    { x: n.minX, y: n.maxY }
  ];
}
function my(e, t, i = de) {
  if (!Ie(e) || !Ie(t)) return [];
  const n = Ke(e), o = Ke(t), r = Math.min(n.maxY, o.maxY) - Math.max(n.minY, o.minY), a = Math.min(n.maxX, o.maxX) - Math.max(n.minX, o.minX), s = [];
  return Math.abs(n.maxX - o.minX) < i && r > i && s.push("right"), Math.abs(n.minX - o.maxX) < i && r > i && s.push("left"), Math.abs(n.maxY - o.minY) < i && a > i && s.push("bottom"), Math.abs(n.minY - o.maxY) < i && a > i && s.push("top"), s;
}
function gy(e, t, i, n) {
  if (!Ie(e) || !Ie(t)) return;
  const o = Ke(e), r = Ke(t), a = Math.min(o.maxY, r.maxY) - Math.max(o.minY, r.minY), s = Math.min(o.maxX, r.maxX) - Math.max(o.minX, r.minX), l = Math.abs(i.dx) > de, c = Math.abs(i.dy) > de, p = (n === void 0 || n === "right") && Math.abs(o.maxX - r.minX) < de && a > de && l, d = (n === void 0 || n === "left") && Math.abs(o.minX - r.maxX) < de && a > de && l, h = (n === void 0 || n === "bottom") && Math.abs(o.maxY - r.minY) < de && s > de && c, u = (n === void 0 || n === "top") && Math.abs(o.minY - r.maxY) < de && s > de && c;
  if (!p && !d && !h && !u) return;
  const f = e.map((y) => ({ ...y })), g = t.map((y) => ({ ...y }));
  if (p) {
    const y = o.maxX + i.dx;
    f[1] = { x: y, y: f[1].y }, f[2] = { x: y, y: f[2].y }, g[0] = { x: y, y: g[0].y }, g[3] = { x: y, y: g[3].y };
  }
  if (d) {
    const y = o.minX + i.dx;
    f[0] = { x: y, y: f[0].y }, f[3] = { x: y, y: f[3].y }, g[1] = { x: y, y: g[1].y }, g[2] = { x: y, y: g[2].y };
  }
  if (h) {
    const y = o.maxY + i.dy;
    f[2] = { x: f[2].x, y }, f[3] = { x: f[3].x, y }, g[0] = { x: g[0].x, y }, g[1] = { x: g[1].x, y };
  }
  if (u) {
    const y = o.minY + i.dy;
    f[0] = { x: f[0].x, y }, f[1] = { x: f[1].x, y }, g[2] = { x: g[2].x, y }, g[3] = { x: g[3].x, y };
  }
  return { points: f, other: g };
}
function yy(e) {
  switch (e) {
    case void 0:
    case "none":
      return "wall";
    case "wall":
      return "divider";
    case "divider":
      return "none";
    default:
      return "wall";
  }
}
function Mn(e, t, i = {}) {
  if (!Ie(t)) return [];
  const [n, o, r, a] = t, s = {
    top: { x1: n.x, y1: n.y, x2: o.x, y2: o.y },
    right: { x1: o.x, y1: o.y, x2: r.x, y2: r.y },
    bottom: { x1: r.x, y1: r.y, x2: a.x, y2: a.y },
    left: { x1: a.x, y1: a.y, x2: n.x, y2: n.y }
  };
  return ze.filter((l) => i[l] === "wall" || i[l] === "divider").map((l) => {
    const c = {
      id: Fl(e, l),
      ...s[l],
      thickness: X
    };
    return i[l] === "divider" ? { ...c, divider: !0 } : c;
  });
}
function Fl(e, t) {
  return `area-wall-${e}-${t}`;
}
const bt = 26, by = 0.75;
function vy(e, t, i, n = by) {
  const o = e.find((s) => s.id === t);
  if (!o) return;
  const r = [];
  i !== 2 && r.push({ x: o.x1, y: o.y1, which: 1 }), i !== 1 && r.push({ x: o.x2, y: o.y2, which: 2 });
  const a = [];
  for (const s of e)
    if (s.id !== o.id)
      for (const l of [1, 2]) {
        const c = l === 1 ? s.x1 : s.x2, p = l === 1 ? s.y1 : s.y2, d = r.find((h) => Math.hypot(c - h.x, p - h.y) <= n);
        d && a.push({ id: s.id, end: l, which: d.which, x0: c, y0: p });
      }
  return a.length ? a : void 0;
}
function Dl(e, t, i, n) {
  let o = null, r = n;
  for (const a of e) {
    const s = Math.hypot(t - a.x, i - a.y);
    s < r && (r = s, o = { x: a.x, y: a.y });
  }
  return o;
}
function ua(e, t, i) {
  const n = i.x2 - i.x1, o = i.y2 - i.y1, r = n * n + o * o, a = r === 0 ? 0 : Math.max(0, Math.min(1, ((e - i.x1) * n + (t - i.y1) * o) / r));
  return Math.hypot(e - (i.x1 + a * n), t - (i.y1 + a * o));
}
const Dn = 0.5;
function wy(e, t, i, n, o, r, a) {
  const s = e.find(
    (b) => ua(t, i, b) <= Dn && ua(n, o, b) <= Dn
  );
  if (!s) return;
  const l = Math.hypot(n - t, o - i);
  if (l === 0) return;
  const c = ((r.x - t) * (o - i) - (r.y - i) * (n - t)) / l;
  if (Math.abs(c) > Dn) return c > 0 ? "left" : "right";
  if (!a) return;
  const p = (o - i) / l, d = -(n - t) / l, h = (t + n) / 2, u = (i + o) / 2, f = lt(s.thickness) / 2 + X, g = a(h + p * f, u + d * f), y = a(h - p * f, u - d * f);
  return g === y ? void 0 : g ? "left" : "right";
}
function Rl(e, t, i, n) {
  const o = e.flatMap((r) => [
    { x: r.x1, y: r.y1 },
    { x: r.x2, y: r.y2 }
  ]);
  return Dl(o, t, i, n);
}
function xy(e, t, i, n, o) {
  const r = e.walls.flatMap((s) => [
    { x: s.x1, y: s.y1 },
    { x: s.x2, y: s.y2 }
  ]), a = (e.areas ?? []).flatMap(
    (s) => s.points.filter((l, c) => !(o && o.areaId === s.id && o.vertexIndex === c)).map((l) => ({ x: l.x, y: l.y }))
  );
  return Dl([...r, ...a], t, i, n);
}
function Rn(e, t, i) {
  const n = e.areas ?? [];
  for (let o = n.length - 1; o >= 0; o--)
    if (si(n[o].points, t, i)) return n[o];
}
function _y(e, t) {
  if (t <= 0) return [];
  const i = qo(e);
  if (t === 1) return [i];
  const n = e.map((d) => d.x), o = e.map((d) => d.y), r = Math.min(...n), a = Math.max(...n), s = Math.min(...o), l = Math.max(...o), c = Math.max(a - r, 1), p = Math.max(l - s, 1);
  for (let d = 1; d <= 8; d++) {
    const h = t * d, u = Math.max(1, Math.round(Math.sqrt(h * c / p))), f = Math.max(1, Math.ceil(h / u)), g = c / (u + 1), y = p / (f + 1), b = [];
    for (let k = 1; k <= f; k++)
      for (let S = 1; S <= u; S++) {
        const x = r + S * g, $ = s + k * y;
        si(e, x, $) && b.push({ x, y: $ });
      }
    if (b.length >= t)
      return Array.from(
        { length: t },
        (k, S) => b[Math.floor(S * b.length / t)]
      );
  }
  return Array.from({ length: t }, (d, h) => {
    const u = h / t * Math.PI * 2, f = Math.min(c, p) * 0.15 * (1 + Math.floor(h / 6));
    return { x: i.x + Math.cos(u) * f, y: i.y + Math.sin(u) * f };
  });
}
function $y(e, t, i, n, o, r, a, s, l = bt) {
  if (a) return { x: r(n), y: r(o) };
  const c = Rl(e, n, o, l);
  if (c) return c;
  const p = n - t, d = o - i, h = Math.tan(s * Math.PI / 180);
  return Math.abs(d) <= Math.abs(p) * h ? { x: r(n), y: i } : Math.abs(p) <= Math.abs(d) * h ? { x: t, y: r(o) } : { x: r(n), y: r(o) };
}
function ky(e, t) {
  const i = Math.min(t.x0, t.x1), n = Math.max(t.x0, t.x1), o = Math.min(t.y0, t.y1), r = Math.max(t.y0, t.y1), a = (l, c) => l >= i && l <= n && c >= o && c <= r, s = [];
  for (const l of e.walls)
    a((l.x1 + l.x2) / 2, (l.y1 + l.y2) / 2) && s.push({ kind: "wall", id: l.id });
  for (const l of e.openings) a(l.x, l.y) && s.push({ kind: "opening", id: l.id });
  for (const l of e.items) a(l.x, l.y) && s.push({ kind: "item", id: l.id });
  for (const l of e.texts) a(l.x, l.y) && s.push({ kind: "text", id: l.id });
  for (const l of e.furniture) a(l.x, l.y) && s.push({ kind: "furniture", id: l.id });
  for (const l of e.trackers ?? [])
    a(l.x + l.w / 2, l.y + l.h / 2) && s.push({ kind: "tracker", id: l.id });
  for (const l of e.areas ?? []) {
    const c = qo(l.points);
    a(c.x, c.y) && s.push({ kind: "area", id: l.id });
  }
  return s;
}
function Sy(e, t, i, n) {
  return {
    walls: e.walls.map((o) => {
      const r = n.get(`wall:${o.id}`);
      return r && r.kind === "wall" ? { ...o, x1: r.x1 + t, y1: r.y1 + i, x2: r.x2 + t, y2: r.y2 + i } : o;
    }),
    openings: e.openings.map((o) => {
      const r = n.get(`opening:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + t, y: r.y + i } : o;
    }),
    items: e.items.map((o) => {
      const r = n.get(`item:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + t, y: r.y + i } : o;
    }),
    texts: e.texts.map((o) => {
      const r = n.get(`text:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + t, y: r.y + i } : o;
    }),
    furniture: e.furniture.map((o) => {
      const r = n.get(`furniture:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + t, y: r.y + i } : o;
    }),
    trackers: (e.trackers ?? []).map((o) => {
      const r = n.get(`tracker:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + t, y: r.y + i } : o;
    }),
    areas: (e.areas ?? []).map((o) => {
      const r = n.get(`area:${o.id}`);
      return r && r.kind === "polygon" ? { ...o, points: r.points.map((a) => ({ x: a.x + t, y: a.y + i })) } : o;
    })
  };
}
const My = [
  "item",
  "text",
  "opening",
  "furniture",
  "wall",
  "tracker",
  // Room polygons are the largest thing on the plan and usually cover
  // everything else in the room, so they pick last — but they *are* in the
  // list, so cycling can still reach them.
  "area"
], Dt = {
  wall: 11,
  /** Padding around an item badge / text box so small glyphs stay grabbable. */
  pad: 4
};
function ui(e, t, i, n, o) {
  const r = -(o || 0) * Math.PI / 180, a = e - i, s = t - n;
  return { x: a * Math.cos(r) - s * Math.sin(r), y: a * Math.sin(r) + s * Math.cos(r) };
}
function Ey(e, t, i) {
  const n = i.x2 - i.x1, o = i.y2 - i.y1, r = n * n + o * o;
  if (r === 0) return Math.hypot(e - i.x1, t - i.y1);
  let a = ((e - i.x1) * n + (t - i.y1) * o) / r;
  return a = Math.max(0, Math.min(1, a)), Math.hypot(e - (i.x1 + a * n), t - (i.y1 + a * o));
}
function Ay(e, t, i, n) {
  const o = [], r = (a, s, l, c) => o.push({ sel: { kind: a, id: s }, rank: My.indexOf(a), order: l, locked: !!c });
  return e.items.forEach((a, s) => {
    const l = (a.size ?? n.itemSize) / 2 + Dt.pad;
    Math.abs(t - a.x) <= l && Math.abs(i - a.y) <= l && r("item", a.id, s, a.locked);
  }), e.texts.forEach((a, s) => {
    const l = a.size ?? n.textSize, c = l * 0.6 * Math.max(1, Po(n.hass, a).length) / 2 + Dt.pad, p = l / 2 + Dt.pad, d = ui(t, i, a.x, a.y, a.angle ?? 0);
    Math.abs(d.x) <= c && Math.abs(d.y) <= p && r("text", a.id, s, a.locked);
  }), e.openings.forEach((a, s) => {
    const l = ie(a) ? Se(a) / 2 : n.wallThickness / 2, c = ui(t, i, a.x, a.y, a.angle ?? 0);
    Math.abs(c.x) <= a.length / 2 && Math.abs(c.y) <= l + Dt.pad && r("opening", a.id, s, a.locked);
  }), e.furniture.forEach((a, s) => {
    const l = ui(t, i, a.x, a.y, a.angle ?? 0);
    Math.abs(l.x) <= a.w / 2 && Math.abs(l.y) <= a.h / 2 && r("furniture", a.id, s, a.locked);
  }), e.walls.forEach((a, s) => {
    Ey(t, i, a) <= Dt.wall && r("wall", a.id, s, a.locked);
  }), (e.trackers ?? []).forEach((a, s) => {
    const l = ui(t, i, a.x + a.w / 2, a.y + a.h / 2, a.angle ?? 0);
    Math.abs(l.x) <= a.w / 2 && Math.abs(l.y) <= a.h / 2 && r("tracker", a.id, s, a.locked);
  }), (e.areas ?? []).forEach((a, s) => {
    si(a.points, t, i) && r("area", a.id, s, a.locked);
  }), o.sort((a, s) => Number(a.locked) - Number(s.locked) || a.rank - s.rank || s.order - a.order).map((a) => a.sel);
}
function Go(e, t) {
  switch (t.kind) {
    case "wall":
      return e.walls.find((i) => i.id === t.id);
    case "opening":
      return e.openings.find((i) => i.id === t.id);
    case "item":
      return e.items.find((i) => i.id === t.id);
    case "text":
      return e.texts.find((i) => i.id === t.id);
    case "furniture":
      return e.furniture.find((i) => i.id === t.id);
    case "tracker":
      return (e.trackers ?? []).find((i) => i.id === t.id);
    case "area":
      return (e.areas ?? []).find((i) => i.id === t.id);
  }
}
function fi(e, t) {
  return !!Go(e, t)?.locked;
}
function Ty(e, t) {
  return t.filter((i) => {
    const n = Go(e, i);
    return !!n && !n.locked;
  });
}
function Cy(e, t, i) {
  if (!e.length) return null;
  if (!i || t.length !== 1) return e[0];
  const n = e.findIndex((o) => o.kind === t[0].kind && o.id === t[0].id);
  return n < 0 ? e[0] : e[(n + 1) % e.length];
}
const Ii = (e) => e === "line-art" ? e : "normal", Ae = "#28343e", Be = (e) => String(Math.round(e * 1e3) / 1e3), mi = (e, t) => `M${Be(e.x)} ${Be(e.y)}L${Be(t.x)} ${Be(t.y)}`;
function Hl(e, t = "#222222") {
  const i = /* @__PURE__ */ new Map(), n = (r, a) => `${r.kind}:${Be(r.z0)}:${Be(r.z1)}:${Be(a.x)},${Be(a.y)}`;
  for (const r of e)
    if (!(r.kind === "panel" || r.kind === "glass" || r.kind === "opening-hit"))
      for (let a = 0; a < r.base.length; a++) {
        if (r.hiddenEdges?.includes(a)) continue;
        const s = r.base[a], l = r.base[(a + 1) % r.base.length], c = Math.hypot(l.x - s.x, l.y - s.y);
        if (c < 1e-9) continue;
        const p = { x: (l.x - s.x) / c, y: (l.y - s.y) / c };
        for (const d of [s, l]) {
          const h = n(r, d), u = i.get(h) ?? [];
          u.push(p), i.set(h, u);
        }
      }
  const o = /* @__PURE__ */ new Set();
  for (const [r, a] of i) {
    const s = a[0];
    a.some((l) => Math.abs(s.x * l.y - s.y * l.x) > 1e-6) && o.add(r);
  }
  return (r) => Iy(r, t, (a) => o.has(n(r, a)));
}
function Iy(e, t, i) {
  if (e.kind === "panel" || e.kind === "glass" || e.kind === "opening-hit" || e.base.length < 3) return m;
  const n = e.base.length, o = e.base.reduce((a, s) => ({ x: a.x + s.x / n, y: a.y + s.y / n }), { x: 0, y: 0 }), r = [];
  for (let a = 0; a < n; a++) {
    if (e.hiddenEdges?.includes(a)) continue;
    const s = e.base[a], l = e.base[(a + 1) % n], c = me(s, e.z1), p = me(l, e.z1);
    r.push(mi(c, p));
    let d = l.y - s.y, h = s.x - l.x;
    if (d * (o.x - s.x) + h * (o.y - s.y) > 0 && (d = -d, h = -h), d + h <= 0) continue;
    const u = me(s, e.z0), f = me(l, e.z0);
    r.push(mi(u, f)), (!e.hiddenEdges?.includes((a + n - 1) % n) || i(s)) && r.push(mi(u, c)), (!e.hiddenEdges?.includes((a + 1) % n) || i(l)) && r.push(mi(f, p));
  }
  return _`<path class="solid-edges" d=${r.join(" ")} fill="none" stroke=${t}
    stroke-width="1" pointer-events="none" />`;
}
const Py = Re`
  .plan.line-art {
    --fp-line-ink: #28343e;
    --fp-skin-bg: #fff;
    --fp-skin-wall: var(--fp-line-ink);
    --fp-skin-wall-filter: none;
    --fp-skin-furniture: var(--fp-line-ink);
    --fp-skin-text: var(--fp-line-ink);
    --fp-skin-badge-bg: #fff;
    --fp-skin-badge-border: #c3cdd2;
    --fp-skin-badge-shadow: 0 1px 3px #152d401a;
    --primary-text-color: var(--fp-line-ink);
    --secondary-text-color: #51626d;
    --card-background-color: #fff;
    --fp-wall-opacity: 1;
  }
  .line-art .fp-floor-image { filter: grayscale(1); }
  .line-art .fp-area { stroke: var(--fp-line-ink); stroke-width: 0.6; }
  .line-art .fp-iso-face { fill: #fff; stroke: none; }
  .line-art .fp-iso-shade { display: none; }
  .line-art .fp-iso-panel, .line-art .fp-iso-glass {
    fill: #fff;
    fill-opacity: 1;
    stroke: var(--fp-iso-color, var(--fp-line-ink));
    stroke-width: 1;
  }
  .line-art .fp-furniture [fill]:not([fill="none"]):not([stroke="none"]) {
    fill: #fff;
    fill-opacity: 1;
  }
  .line-art .area-label {
    color: var(--fp-line-ink);
    text-shadow: 0 1px 2px #fff, 0 -1px 2px #fff, 1px 0 2px #fff, -1px 0 2px #fff;
  }
`, ft = "#ffffff", fa = (e) => ({
  color: Ae,
  accent: Ae,
  open: _n(e)
});
function zy(e, t, i) {
  const n = Math.max(1, O(e.width, be)), o = Math.max(1, O(e.height, we)), r = [...t.walls, ...t.areas.flatMap((A) => Mn(A.id, A.points, A.sideWalls ?? {}))], a = De(e.wallHeight), s = {
    ...Et(n, o, i),
    projection: Qt(e.view ?? e.projection),
    wallHeight: vs(e.wallHeight, r),
    padding: 2 + r.reduce((A, I) => Math.max(A, lt(I.thickness)), 8)
  }, l = xt(s), c = s.projection === "iso" && s.wallHeight > 0, p = fl(n, o, i), d = (A, I) => ot(A, I, n, o, i), h = Wt(e.symbols), u = (A) => qt(A, Ae, h), f = [];
  if (c) {
    f.push(...ks(r.filter((C) => !C.divider).map((C) => {
      const L = d(C.x1, C.y1), B = d(C.x2, C.y2);
      return {
        ...C,
        x1: L.x,
        y1: L.y,
        x2: B.x,
        y2: B.y,
        thickness: lt(C.thickness) * (qe(C) ? Ui : 1)
      };
    }), t.openings.map((C) => ({ ...C, ...d(C.x, C.y), angle: C.angle + i })), a, !1));
    for (const C of t.openings) {
      const L = $s(C, t.walls, a);
      f.push(...Ll(C, fa(C), d, L));
    }
    const A = a * Kn, I = _s(A, i);
    for (const C of t.furniture) f.push(Ss(
      C,
      d,
      A,
      ft,
      _`<g transform=${p || m}><g transform="translate(${I.x} ${I.y})">${u(C)}</g></g>`
    ));
  }
  const g = Hl(f, Ae), y = s.projection === "iso" ? "3d" : "2d", b = `${e.title ? `${e.title} — ` : ""}${t.name} (${y.toUpperCase()})`, k = 20, S = document.createElement("div");
  Wa(_`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-k} ${-k} ${l.w + k * 2} ${l.h + k * 2}"
      width=${Math.ceil(l.w + k * 2)} height=${Math.ceil(l.h + k * 2)} role="img" aria-labelledby="title description">
    <title id="title">${b}</title>
    <desc id="description">Floorplan line art. Full floor, with static opening positions. Canvas units; not a measured survey.</desc>
    <rect x=${-k} y=${-k} width=${l.w + k * 2} height=${l.h + k * 2} fill=${ft} />
    <g stroke-linejoin="round" stroke-linecap="round">
      <g transform=${xs(s) || m}>
        <g transform=${p || m}>
          ${t.areas.map((A) => _`<polygon points=${A.points.map((I) => `${I.x},${I.y}`).join(" ")}
            fill=${ft} stroke=${Ae} stroke-width="0.6" />`)}
          ${Vo(t.openings, n, o, "wall-gaps")}
          <g mask="url(#wall-gaps)">${r.filter((A) => !c || A.divider).map((A) => _`
            <line x1=${A.x1} y1=${A.y1} x2=${A.x2} y2=${A.y2} stroke=${Ae}
              stroke-width=${A.divider ? 1 : lt(A.thickness) * (qe(A) ? Ui : 1)}
              stroke-dasharray=${A.divider ? "5 4" : m} />`)}</g>
          ${c ? m : t.openings.map((A) => Wo(A, fa(A)))}
          ${c ? m : t.furniture.map(u)}
        </g>
        ${c ? Ms(f.filter((A) => A.kind !== "opening-hit"), (A, I) => _`<g>${I}${g(A)}</g>`) : m}
      </g>
      <g fill=${Ae} font-family="sans-serif" text-anchor="middle" dominant-baseline="central">
        ${t.areas.filter((A) => A.name && A.showName !== !1).map((A) => {
    const I = $l(A.points), C = d(I.x, I.y), L = Mt(C.x, C.y, s);
    return _`<text x=${L.x} y=${L.y} font-size=${Us(A.labelSize)}
            stroke=${ft} stroke-width="3" paint-order="stroke">${A.name}</text>`;
  })}
      </g>
    </g>
  </svg>`, S);
  const x = S.querySelector("svg");
  x.querySelectorAll(".fp-iso-shade").forEach((A) => A.remove()), x.querySelectorAll(".fp-iso-face, .fp-iso-panel, .fp-iso-glass").forEach((A) => {
    A.setAttribute("fill", ft), A.classList.contains("fp-iso-face") || (A.setAttribute("stroke", Ae), A.setAttribute("stroke-width", "1"));
  }), x.querySelectorAll(".fp-furniture [fill]").forEach((A) => {
    A.getAttribute("fill") !== "none" && A.getAttribute("stroke") !== "none" && (A.setAttribute("fill", ft), A.removeAttribute("fill-opacity"));
  });
  for (const A of x.querySelectorAll("*")) {
    for (const I of [...A.attributes]) I.name.startsWith("data-") && A.removeAttribute(I.name);
    A.style.transform && A.setAttribute("transform", A.style.transform.replace(/deg|px/g, "").replace(/translateX\(([^)]+)\)/g, "translate($1 0)"));
    for (const I of ["fill", "stroke", "stroke-dashoffset"]) {
      const C = A.style.getPropertyValue(I);
      C && A.setAttribute(I, C);
    }
    A.removeAttribute("style");
  }
  const $ = document.createTreeWalker(x, NodeFilter.SHOW_COMMENT), M = [];
  for (; $.nextNode(); ) M.push($.currentNode);
  M.forEach((A) => A.parentNode?.removeChild(A));
  const P = t.name.replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "floor";
  return {
    svg: `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(x)}`,
    filename: `floorplan-${P}-${y}.svg`
  };
}
function ma(e, t, i) {
  const n = zy(e, t, i), o = URL.createObjectURL(new Blob([n.svg], { type: "image/svg+xml;charset=utf-8" })), r = document.createElement("a");
  r.href = o, r.download = n.filename, document.body.append(r);
  try {
    r.click();
  } finally {
    r.remove(), window.setTimeout(() => URL.revokeObjectURL(o), 1e3);
  }
}
const ga = (e = !1) => _`<svg viewBox="0 0 24 24" aria-hidden="true">
  <g transform=${e ? "translate(24 0) scale(-1 1)" : ""}>
    <path d="M4 10a8 8 0 1 1 1.8 7.1M4 4v6h6" />
  </g></svg>`, Oy = _`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10 12 3l8 7v10h-6v-6h-4v6H4Z" /></svg>`, Ly = _`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" /></svg>`;
function Fy(e) {
  return v`<nav class="view-controls" aria-label="Floorplan display">
    <div class="view-choices">
      <div class="view-segment" role="group" aria-label="View">
        <button type="button" aria-label="2D plan" aria-pressed=${e.view === "2d"}
          @click=${() => e.setView("2d")}>2D</button>
        <button type="button" aria-label="3D isometric" aria-pressed=${e.view === "3d"}
          @click=${() => e.setView("3d")}>3D</button>
      </div>
      <div class="view-segment" role="group" aria-label="Appearance">
        <button type="button" aria-pressed=${e.appearance === "normal"}
          @click=${() => e.setAppearance("normal")}>Normal</button>
        <button type="button" aria-pressed=${e.appearance === "line-art"}
          @click=${() => e.setAppearance("line-art")}>Line art</button>
      </div>
    </div>
    <div class="view-actions">
      <div class="view-rotation" role="group" aria-label="Rotate view">
        <button type="button" aria-label="Rotate left" title="Rotate left 90°"
          @click=${() => e.rotate(-90)}>${ga()}</button>
        <output aria-live="polite" aria-label="View rotation">${e.rotation}°</output>
        <button type="button" aria-label="Rotate right" title="Rotate right 90°"
          @click=${() => e.rotate(90)}>${ga(!0)}</button>
      </div>
      <button class="view-reset" type="button" aria-label="Reset view"
        title="Restore the default view and appearance" ?disabled=${!e.canReset} @click=${e.reset}>${Oy}</button>
      ${e.exportEnabled ? v`<button class="view-download" type="button" aria-label="Download SVG"
        title="Download a static line-art SVG" @click=${e.download}>${Ly}</button>` : ""}
    </div>
  </nav>`;
}
const Dy = Re`
  .view-controls {
    /* A zoomed room may paint past the stage; controls remain above it. */
    position: relative;
    z-index: 2;
    background: var(--card-background-color, #fff);
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px 20px;
    padding: 12px;
    border-top: 1px solid var(--divider-color, #e2e7ea);
    color: var(--primary-text-color, #26343d);
  }
  .view-choices, .view-actions { display: flex; align-items: center; gap: 8px; }
  .view-choices { flex-wrap: wrap; min-width: 0; gap: 6px; }
  .view-actions { flex-wrap: wrap; justify-content: flex-end; min-width: 0; margin-left: auto; }
  .view-segment {
    display: flex;
    padding: 3px;
    gap: 2px;
    border-radius: 10px;
    background: var(--secondary-background-color, #f1f4f5);
    border: 1px solid var(--divider-color, #e2e7ea);
  }
  .view-controls button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 7px;
    padding: 8px;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
    color: inherit;
    background: transparent;
    cursor: pointer;
    touch-action: manipulation;
  }
  .view-controls button[aria-pressed="true"] {
    background: var(--card-background-color, #fff);
    border-color: var(--divider-color, #d6dfe3);
    box-shadow: 0 1px 3px #00000012;
    font-weight: 700;
  }
  .view-segment button { padding-inline: 7px; }
  @media (hover: hover) {
    .view-controls button:hover:not(:disabled) {
      border-color: var(--primary-color, #387969);
    }
  }
  .view-controls button:focus-visible {
    outline: 2px solid var(--primary-color, #387969);
    outline-offset: 2px;
  }
  .view-controls button:disabled { opacity: .35; cursor: default; }
  .view-rotation { display: flex; align-items: center; }
  .view-rotation output { width: 38px; text-align: center; font-size: 12px; font-variant-numeric: tabular-nums; }
  .view-actions button { padding: 8px; }
  .view-controls svg {
    position: static;
    inset: auto;
    flex: none;
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.65;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`, Ry = 2, Nl = 600;
function rt(e) {
  if (e === !0) return { controls: !0, intervalMs: 0 };
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const t = e, i = t.controls === void 0 ? !0 : !!t.controls, n = typeof t.interval == "number" || typeof t.interval == "string" ? Number(t.interval) : NaN, o = Number.isFinite(n) && n > 0 ? Math.min(Math.max(n, Ry), Nl) * 1e3 : 0, r = Array.isArray(t.rooms) ? t.rooms.filter((a) => typeof a == "string" && a !== "") : void 0;
  if (!(!i && o === 0))
    return { controls: i, intervalMs: o, ...r?.length ? { rooms: r } : {} };
}
function ya(e, t) {
  if (!t || !e?.length) return [];
  const i = new Set(e.map((n) => n.id));
  return t.rooms ? t.rooms.filter((n) => i.has(n)) : e.map((n) => n.id);
}
function Hy(e, t, i) {
  if (!e.length) return;
  const n = t === void 0 ? -1 : e.indexOf(t);
  return n < 0 ? i === 1 ? e[0] : e[e.length - 1] : e[(n + i + e.length) % e.length];
}
const Ny = 500, jy = 250;
class Wy extends HTMLElement {
  constructor() {
    super(...arguments), this.holdTime = Ny, this.held = !1, this.cancelled = !1;
  }
  connectedCallback() {
    Object.assign(this.style, {
      position: "fixed",
      width: "0",
      height: "0"
    }), ["touchcancel", "mouseout", "mouseup", "touchmove", "mousewheel", "wheel", "scroll"].forEach(
      (t) => {
        document.addEventListener(
          t,
          () => {
            this.cancelled = !0, this.timer && (clearTimeout(this.timer), this.timer = void 0);
          },
          { passive: !0 }
        );
      }
    );
  }
  bind(t, i = {}) {
    t.actionHandler && By(i, t.actionHandler.options) || (t.actionHandler ? (t.removeEventListener("touchstart", t.actionHandler.start), t.removeEventListener("touchend", t.actionHandler.end), t.removeEventListener("touchcancel", t.actionHandler.end), t.removeEventListener("mousedown", t.actionHandler.start), t.removeEventListener("click", t.actionHandler.end), t.removeEventListener("keydown", t.actionHandler.handleKeyDown)) : t.addEventListener("contextmenu", (n) => {
      n.preventDefault(), n.stopPropagation();
    }), t.actionHandler = { options: i }, !i.disabled && (t.actionHandler.start = () => {
      this.cancelled = !1, this.held = !1, i.hasHold && (this.timer = window.setTimeout(() => {
        this.held = !0;
      }, this.holdTime));
    }, t.actionHandler.end = (n) => {
      if (["touchend", "touchcancel"].includes(n.type) && this.cancelled) {
        this.timer && clearTimeout(this.timer), this.timer = void 0;
        return;
      }
      if ((n.type === "touchend" || n.type === "touchcancel") && (n.cancelable && n.preventDefault(), n.type === "touchcancel")) {
        this.timer && clearTimeout(this.timer), this.timer = void 0;
        return;
      }
      const o = n.target;
      i.hasHold && this.timer && (clearTimeout(this.timer), this.timer = void 0), i.hasHold && this.held ? gi(o, "hold") : i.hasDoubleClick ? n.type === "click" && n.detail < 2 || !this.dblClickTimeout ? this.dblClickTimeout = window.setTimeout(() => {
        this.dblClickTimeout = void 0, gi(o, "tap");
      }, jy) : (clearTimeout(this.dblClickTimeout), this.dblClickTimeout = void 0, gi(o, "double_tap")) : gi(o, "tap");
    }, t.actionHandler.handleKeyDown = (n) => {
      ["Enter", " "].includes(n.key) && (n.preventDefault(), n.currentTarget.actionHandler.end(n));
    }, t.addEventListener("touchstart", t.actionHandler.start, { passive: !0 }), t.addEventListener("touchend", t.actionHandler.end), t.addEventListener("touchcancel", t.actionHandler.end), t.addEventListener("mousedown", t.actionHandler.start, { passive: !0 }), t.addEventListener("click", t.actionHandler.end), t.addEventListener("keydown", t.actionHandler.handleKeyDown)));
  }
}
function By(e, t) {
  return e.hasHold === t.hasHold && e.hasDoubleClick === t.hasDoubleClick && e.disabled === t.disabled;
}
function gi(e, t) {
  e.dispatchEvent(
    new CustomEvent("action", { detail: { action: t }, bubbles: !0, composed: !0 })
  );
}
function Uy() {
  const e = document.body, t = e.querySelector("action-handler-easy-floorplan");
  if (t) return t;
  const i = document.createElement("action-handler-easy-floorplan");
  return e.appendChild(i), i;
}
customElements.get("action-handler-easy-floorplan") || customElements.define("action-handler-easy-floorplan", Wy);
const Vy = (e, t) => {
  Uy().bind(e, t);
}, Je = an(
  class extends sn {
    update(e, [t]) {
      return Vy(e.element, t), Pe;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(e) {
    }
  }
), jl = 0.28, qy = 0.8, Gy = 1.15;
function Pi(e, t) {
  return typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t;
}
function Ji(e, t) {
  return typeof e != "number" || !Number.isFinite(e) ? t : Math.max(0, Math.min(1, e));
}
function Wl(e = {}) {
  return {
    strength: Ji(e.strength, jl),
    depth: Math.max(0.05, Math.min(3, Pi(e.depth, qy))),
    spread: Math.max(0.05, Math.min(4, Pi(e.spread, Gy))),
    openingEps: Pi(e.openingEps, ke)
  };
}
function en(e, t, i) {
  const n = e.points;
  if (n.length < 3) return !1;
  let o = !1;
  for (let r = 0, a = n.length - 1; r < n.length; a = r++) {
    const s = n[r], l = n[a];
    if (!(s.y > i != l.y > i)) continue;
    const p = (l.x - s.x) * (i - s.y) / (l.y - s.y) + s.x;
    t < p && (o = !o);
  }
  return o;
}
function Ky(e, t, i, n) {
  const o = n.x - i.x, r = n.y - i.y, a = o * o + r * r;
  if (a === 0) return Math.hypot(e - i.x, t - i.y);
  let s = ((e - i.x) * o + (t - i.y) * r) / a;
  return s = Math.max(0, Math.min(1, s)), Math.hypot(e - (i.x + s * o), t - (i.y + s * r));
}
function Xy(e, t) {
  if (e.points.length < 2) return;
  let i;
  for (let n = 0; n < e.points.length; n++) {
    const o = e.points[n], r = e.points[(n + 1) % e.points.length], a = Ky(t.x, t.y, o, r);
    (!i || a < i.distance) && (i = { area: e, segmentIndex: n, distance: a });
  }
  return i;
}
function Yy(e, t, i = ke) {
  const n = Pi(i, ke);
  return t.map((o) => Xy(o, e)).filter((o) => o !== void 0 && o.distance <= n).sort((o, r) => o.distance - r.distance);
}
function Zy(e, t, i, n) {
  const o = e.area.points, r = o[e.segmentIndex], a = o[(e.segmentIndex + 1) % o.length], s = a.x - r.x, l = a.y - r.y, c = Math.hypot(s, l);
  if (!(c > 0)) return;
  const p = { x: -l / c, y: s / c }, d = { x: l / c, y: -s / c }, h = Math.max(1, n + 1), u = en(e.area, t + p.x * h, i + p.y * h), f = en(e.area, t + d.x * h, i + d.y * h);
  if (u && !f) return p;
  if (f && !u) return d;
  const g = e.area.points.reduce(
    (b, k) => ({ x: b.x + k.x / e.area.points.length, y: b.y + k.y / e.area.points.length }),
    { x: 0, y: 0 }
  ), y = { x: g.x - t, y: g.y - i };
  return p.x * y.x + p.y * y.y >= 0 ? p : d;
}
function Bl(e, t, i = {}) {
  const { openingEps: n } = Wl(i), o = [];
  for (const r of t) {
    const a = Yy(r, e, n);
    if (a.length !== 1) continue;
    const s = a[0], l = Zy(s, r.x, r.y, n);
    l && o.push({
      openingId: r.id,
      areaId: s.area.id,
      x: r.x,
      y: r.y,
      inwardX: l.x,
      inwardY: l.y,
      length: Math.max(0, r.length)
    });
  }
  return o;
}
function Qy(e, t = 0, i = 1) {
  return e.sunlight === !1 ? 0 : (Yi(e) ? 1 : Ji(t, 0)) * Ji(i, 1);
}
function Jy(e) {
  const t = Ct(e);
  if (t === void 0 || t <= at) return 0;
  if (t >= Wn) return 1;
  const i = (t - at) / (Wn - at);
  return i * i * (3 - 2 * i);
}
function eb(e) {
  if (!e.points.length) return 1;
  let t = 1 / 0, i = 1 / 0, n = -1 / 0, o = -1 / 0;
  for (const r of e.points)
    t = Math.min(t, r.x), i = Math.min(i, r.y), n = Math.max(n, r.x), o = Math.max(o, r.y);
  return Math.max(1, n - t, o - i);
}
function Ul(e, t, i, n = () => 1, o = {}) {
  const { strength: r, depth: a, spread: s } = Wl(o), l = Jy(i);
  if (!(l > 0) || !(r > 0)) return [];
  const c = eb(e) * a, p = [];
  for (const d of t) {
    if (d.areaId !== e.id) continue;
    const h = Ji(n(d.openingId), 0), u = Math.max(0, Math.min(1, r * l * h));
    if (!(u > 0)) continue;
    const f = -d.inwardY, g = d.inwardX, y = Math.max(1, d.length / 2), b = y + c * s, k = d.x + d.inwardX * c, S = d.y + d.inwardY * c;
    p.push({
      openingId: d.openingId,
      areaId: d.areaId,
      points: [
        { x: d.x - f * y, y: d.y - g * y },
        { x: d.x + f * y, y: d.y + g * y },
        { x: k + f * b, y: S + g * b },
        { x: k - f * b, y: S - g * b }
      ],
      gradientStart: { x: d.x, y: d.y },
      gradientEnd: { x: k, y: S },
      opacity: u
    });
  }
  return p;
}
const tb = "#f4f8ff", ib = 10;
function ba(e, t, i) {
  return Math.max(t, Math.min(i, e));
}
function so(e) {
  return Number.isFinite(e.x) && Number.isFinite(e.y);
}
function Hn(e) {
  return e.length < 3 || e.some((t) => !so(t)) ? "" : e.map((t) => `${t.x},${t.y}`).join(" ");
}
function yi(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return `${e.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "ambient"}-${(t >>> 0).toString(36)}`;
}
function nb(e, t, i = {}) {
  const n = Hn(e.points);
  if (!n) return null;
  const o = i.idPrefix?.trim() || "fp-ambient", r = yi(`${o}-clip-${e.id}`), a = yi(`${o}-blur-${e.id}`), s = Number.isFinite(i.blur) ? ba(i.blur, 0, 40) : ib, l = i.color?.trim() || tb, c = [];
  for (let p = 0; p < t.length; p++) {
    const d = t[p];
    if (d.areaId !== e.id) continue;
    const h = Hn(d.points);
    if (!h || !so(d.gradientStart) || !so(d.gradientEnd) || !Number.isFinite(d.opacity) || d.opacity <= 0) continue;
    const u = d.clipPoints && Hn(d.clipPoints);
    d.clipPoints && !u || c.push({
      openingId: d.openingId,
      points: h,
      gradientId: yi(`${o}-gradient-${e.id}-${d.openingId}-${p}`),
      gradientStart: d.gradientStart,
      gradientEnd: d.gradientEnd,
      opacity: ba(d.opacity, 0, 1),
      clipId: u ? yi(`${o}-wall-${e.id}-${d.openingId}-${p}`) : void 0,
      clipPoints: u || void 0
    });
  }
  return c.length ? { clipId: r, clipPoints: n, filterId: a, blur: s, color: l, patches: c } : null;
}
function va(e, t, i = {}) {
  const n = nb(e, t, i);
  return n ? _`
    <g class="fp-ambient-daylight" data-area-id=${e.id} aria-hidden="true" pointer-events="none">
      <defs>
        <clipPath id=${n.clipId}>
          <polygon points=${n.clipPoints}></polygon>
        </clipPath>
        <!-- The filter region is a proportion of the patch's own box, and a
             Gaussian tail runs to roughly 3x its deviation, so the two are
             coupled: the margin has to stay wider than the blur or the falloff
             is cut off square at the region edge — a hard line exactly where
             the softness was the point. It holds comfortably at the shipped
             blur, since a patch fans most of the way across its room while the
             blur stays in single digits. Worth sizing from the blur instead if
             it ever becomes a public knob. -->
        <filter id=${n.filterId} x="-25%" y="-25%" width="150%" height="150%"
                color-interpolation-filters="sRGB">
          <feGaussianBlur stdDeviation=${n.blur}></feGaussianBlur>
        </filter>
        ${n.patches.map(
    (o) => _`
            ${o.clipPoints ? _`<clipPath id=${o.clipId}>
              <polygon points=${o.clipPoints}></polygon>
            </clipPath>` : m}
            <linearGradient id=${o.gradientId} gradientUnits="userSpaceOnUse"
                            x1=${o.gradientStart.x} y1=${o.gradientStart.y}
                            x2=${o.gradientEnd.x} y2=${o.gradientEnd.y}>
              <stop offset="0%" stop-color=${n.color} stop-opacity="1"></stop>
              <stop offset="35%" stop-color=${n.color} stop-opacity="0.72"></stop>
              <stop offset="72%" stop-color=${n.color} stop-opacity="0.25"></stop>
              <stop offset="100%" stop-color=${n.color} stop-opacity="0"></stop>
            </linearGradient>
          `
  )}
      </defs>
      <g clip-path=${`url(#${n.clipId})`}>
        ${n.patches.map(
    (o) => _`
            <g clip-path=${o.clipId ? `url(#${o.clipId})` : m}>
            <polygon class="fp-ambient-daylight-patch"
                     data-opening-id=${o.openingId}
                     points=${o.points}
                     fill=${`url(#${o.gradientId})`}
                     opacity=${o.opacity}
                     filter=${n.blur > 0 ? `url(#${n.filterId})` : "none"}>
            </polygon>
            </g>
          `
  )}
      </g>
    </g>
  ` : _``;
}
function ob(e) {
  const t = us(Ao(e.map((o) => ({
    a: { x: o.x1, y: o.y1 },
    b: { x: o.x2, y: o.y2 }
  })), le), le), i = [], n = [];
  return t.forEach((o, r) => {
    const a = wt(o), s = { id: `wall-region-${r}`, points: o };
    a > le * le && i.push(s), a < -le * le && n.push(s);
  }), { rooms: i, shells: n.filter((o) => !n.some((r) => o !== r && Math.abs(wt(r.points)) > Math.abs(wt(o.points)) && en(r, o.points[0].x, o.points[0].y))) };
}
function rb(e, t) {
  const i = t.x2 - t.x1, n = t.y2 - t.y1, o = i * i + n * n, r = o ? Math.max(0, Math.min(
    1,
    ((e.x - t.x1) * i + (e.y - t.y1) * n) / o
  )) : 0;
  return { x: t.x1 + r * i, y: t.y1 + r * n };
}
function zi(e, t) {
  let i;
  for (const n of t) {
    if (n.x1 === n.x2 && n.y1 === n.y2) continue;
    const o = rb(e, n), r = Math.hypot(e.x - o.x, e.y - o.y);
    (!i || r < i.distance) && (i = { wall: n, point: o, distance: r });
  }
  return i;
}
function ab(e, t) {
  const i = [...e];
  return t.forEach((n, o) => {
    if (ie(n) || !(n.length > 0) || (zi(n, e)?.distance ?? 1 / 0) <= le) return;
    const r = n.angle * Math.PI / 180, a = Math.cos(r) * n.length / 2, s = Math.sin(r) * n.length / 2, l = zi({ x: n.x - a, y: n.y - s }, e), c = zi({ x: n.x + a, y: n.y + s }, e);
    !l || !c || l.distance > le || c.distance > le || i.push({ id: `ambient-opening-${o}`, x1: l.point.x, y1: l.point.y, x2: c.point.x, y2: c.point.y });
  }), i;
}
function sb(e, t) {
  const i = e.x2 - e.x1, n = e.y2 - e.y1, o = Math.hypot(i, n);
  return o > 0 && [
    { x: t.x1, y: t.y1 },
    { x: t.x2, y: t.y2 }
  ].every((r) => Math.abs((r.x - e.x1) * n - (r.y - e.y1) * i) / o <= le);
}
function lb(e, t) {
  const i = ab(e, t), n = ob(i), o = t.map((l) => {
    if (ie(l)) return;
    const c = zi(l, i);
    return c && c.distance <= ke ? c : void 0;
  }), r = t.map((l, c) => o[c] ? { ...l, ...o[c].point } : l), a = i.map((l) => r.filter((c, p) => o[p] && sb(o[p].wall, l))), s = r.map((l, c) => {
    if (!o[c]) return;
    const [p] = Bl(n.shells, [l], { openingEps: le });
    if (!p) return;
    const d = n.shells.find((f) => f.id === p.areaId), h = n.rooms.filter((f) => en(
      f,
      p.x + p.inwardX * 0.01,
      p.y + p.inwardY * 0.01
    )).sort((f, g) => Math.abs(wt(f.points)) - Math.abs(wt(g.points)))[0] ?? d, u = `opening-${c}`;
    return { source: { ...p, areaId: u }, room: { ...h, id: u }, envelope: { ...d, id: u } };
  });
  return { walls: i, openings: r, onWalls: a, regions: n, sources: s };
}
const wa = /* @__PURE__ */ new WeakMap();
function Vl(e, t) {
  const i = wa.get(e);
  if (i?.openings === t) return i.geometry;
  const n = lb(e, t);
  return wa.set(e, { openings: t, geometry: n }), n;
}
const xa = /* @__PURE__ */ new WeakMap();
function cb(e, t, i) {
  const n = Vl(e, t), o = t.map(i), r = xa.get(n);
  if (r && o.every((l, c) => l[0] === r.spans[c][0] && l[1] === r.spans[c][1])) return r.walls;
  const a = new Map(n.openings.map((l, c) => [l, o[c]])), s = n.walls.flatMap((l, c) => bn([l], n.onWalls[c], (p) => a.get(p)));
  return xa.set(n, { spans: o, walls: s }), s;
}
const _a = /* @__PURE__ */ new WeakMap();
function ql(e, t, i) {
  const n = e.x + e.inwardX * 0.01, o = e.y + e.inwardY * 0.01, r = Math.max(...t.points.map((c) => Math.hypot(c.x - n, c.y - o))) + 40;
  let a = _a.get(i);
  a || (a = /* @__PURE__ */ new WeakMap(), _a.set(i, a));
  const s = a.get(e), l = s?.radius === r ? s.points : vn(n, o, r, i, 1e-3);
  return (!s || s.radius !== r) && a.set(e, { radius: r, points: l }), l ? { ...t, clipPoints: l } : t;
}
function db(e, t, i, n, o, r) {
  const { regions: { shells: a }, sources: s } = Vl(e, t);
  if (a.length)
    return s.map((l) => {
      if (!l) return;
      const { source: c, room: p, envelope: d } = l, [h] = Ul(p, [c], n, o, { strength: r });
      if (h)
        return { area: d, patch: ql(c, h, i) };
    });
}
function hb(e) {
  return e?.ambientDaylight === !0;
}
const pb = [], $a = /* @__PURE__ */ new WeakMap();
function ub(e, t) {
  const i = e.areas.length ? e.areas : pb, n = $a.get(t);
  if (n?.input === e.walls && n.areas === i) return n.walls;
  const o = i.flatMap((a) => Mn(a.id, a.points, a.sideWalls ?? {})).filter((a) => !a.divider), r = Do([...e.walls, ...o]);
  return $a.set(t, { input: e.walls, areas: i, walls: r }), r;
}
function fb(e) {
  const t = new Set(e.map((n) => n.id)), i = /* @__PURE__ */ new Set();
  return e.map((n, o) => {
    if (!i.has(n.id))
      return i.add(n.id), n;
    let r = `${n.id}#${o}`;
    for (let a = 0; t.has(r); a++) r = `${n.id}#${o}-${a}`;
    return t.add(r), i.add(r), { ...n, id: r };
  });
}
function mb(e, t, i, n, o) {
  if (!hb(t)) return m;
  const r = new Map(e.openings.map((g) => [g.id, g])), a = (g) => {
    const y = r.get(g);
    if (!y) return 0;
    const b = Oo(
      y,
      o.amount(y),
      o.secondAmount(y)
    ), k = y.shutterEntity ? Te(i?.states[y.shutterEntity], y.shutterInvert) : 1;
    return Qy(y, b, k);
  }, s = i?.states["sun.sun"]?.attributes?.elevation, l = jl * Bo(io(ti(t), i), Sg), c = ub(e, t), p = cb(c, e.openings, (g) => g.sunlight === !1 ? [0, 0] : Lo(
    g,
    o.amount(g),
    o.secondAmount(g),
    g.shutterEntity ? Te(i?.states[g.shutterEntity], g.shutterInvert) : void 0
  )), d = db(c, e.openings, p, s, a, l);
  if (d !== void 0) {
    const g = d.map((y) => y ? va(y.area, [y.patch], { idPrefix: n }) : m);
    return g.some((y) => y !== m) ? _`${g}` : m;
  }
  const h = fb(e.areas), u = Bl(h, e.openings);
  if (u.length === 0) return m;
  const f = h.map((g) => {
    const y = Ul(g, u, s, a, { strength: l }).map((b) => ql(u.find((k) => k.openingId === b.openingId && k.areaId === b.areaId), b, p));
    return y.length ? va(g, y, { idPrefix: n }) : m;
  });
  return f.some((g) => g !== m) ? _`${f}` : m;
}
const Oe = class Oe {
  constructor(t = {}) {
    this.playing = !1, this._startTime = t.startTime ?? 0, this._endTime = t.endTime ?? Number.MAX_SAFE_INTEGER, this.currentTime = this._startTime, this.speed = this._normalizeSpeed(t.initialSpeed ?? 1);
  }
  get startTime() {
    return this._startTime;
  }
  get endTime() {
    return this._endTime;
  }
  _normalizeSpeed(t) {
    return Number.isFinite(t) ? Math.min(Oe._MAX_SPEED, Math.max(Oe._MIN_SPEED, t)) : Number.isNaN(t) ? 1 : Oe._MAX_SPEED;
  }
  play() {
    this.playing = !0;
  }
  pause() {
    this.playing = !1;
  }
  seek(t) {
    this.currentTime = this._clamp(t);
  }
  rewind(t) {
    this.seek(this.currentTime - t);
  }
  fastForward(t) {
    this.seek(this.currentTime + t);
  }
  setPlaybackSpeed(t) {
    Number.isFinite(t) && (this.speed = Math.min(Oe._MAX_SPEED, Math.max(Oe._MIN_SPEED, t)));
  }
  tick(t) {
    if (!this.playing) return;
    const i = t / 1e3;
    this.currentTime = this._clamp(this.currentTime + i * this.speed);
  }
  _clamp(t) {
    return Math.min(this._endTime, Math.max(this._startTime, t));
  }
};
Oe._MIN_SPEED = 0.01, Oe._MAX_SPEED = 1e3;
let tn = Oe, gb = 0;
class yb {
  constructor(t) {
    this._card = t, this._historyService = new Vc(), this.state = {
      playbackController: new tn(),
      configured: !1,
      enabled: !1,
      ready: !1,
      error: void 0,
      historyEvents: [],
      configuredColorCache: /* @__PURE__ */ new Map(),
      loadRequested: !1,
      startTime: 0,
      endTime: 0,
      logExpanded: !1,
      timelineExpanded: !1,
      speedExpanded: !1,
      historyVisible: !1,
      rangeWarning: void 0,
      loadToken: 0,
      uiLastUpdateFrameMs: 0,
      loopId: void 0,
      lastReplayFrame: void 0,
      panelId: `fp-replay-panel-${gb++}`
    };
  }
  logReplay(t, i) {
    this._card.getConfig()?.historyReplay?.debug && console.log(t, i ?? {});
  }
  getDefaultWindow() {
    return Yg(this._card.getConfig());
  }
  normalizeWindow(t, i) {
    return ca(t, i);
  }
  historyService() {
    return this._historyService;
  }
  clearHistoryCache() {
    this._historyService.clearCache();
  }
  syncHistoryServiceContext() {
    this._historyService.configure({
      hass: this._card.getHass(),
      watched: this.watchedEntities()
    });
  }
  watchedEntities() {
    return Zg(this._card.getConfig(), this._card.getActiveFloorId());
  }
  scopeKey() {
    return Qg(this._card.getConfig(), this._card.getActiveFloorId());
  }
  speedForRange(t, i) {
    return Jg(this._card.getConfig(), t, i);
  }
  currentTime() {
    return this.state.playbackController.currentTime;
  }
  isHistoryVisible() {
    return this.state.historyVisible;
  }
  isReplayReady() {
    return this.state.ready;
  }
  isReplayEnabled() {
    return this.state.enabled;
  }
  /**
   * Whether the replay panel is on screen: the config offers it, and it is
   * open. Both halves, because a panel that is not rendered can neither be
   * read nor closed -- so nothing behind it may draw on the plan or keep a
   * clock running.
   */
  isReplayShowing() {
    return this._replayOffered() && this.state.historyVisible;
  }
  /** Whether the config puts a replay control on the card at all. */
  _replayOffered() {
    return !!this._card.getConfig()?.historyReplay?.enabled;
  }
  /**
   * Bring replay back in line with a config that no longer offers it.
   *
   * Switching `historyReplay.enabled` off takes the panel off screen but not,
   * on its own, the state behind it: the plan went on rendering history with
   * no control left anywhere to leave it. Called from setConfig, so it also
   * covers the ordinary case of a shut panel, where it just makes sure no
   * clock is ticking against a plan nobody is replaying.
   */
  syncToConfig() {
    this.isReplayShowing() || (this.state.historyVisible = !1, this.state.playbackController.pause(), this.stopReplayLoop());
  }
  /**
   * What the plan should draw from: history at `currentTime`, or the live
   * states Home Assistant is pushing.
   *
   * The panel being open is the whole answer. Closed, replay is not a mode the
   * plan is quietly in -- it is off, whatever the controller has loaded and
   * wherever the head happens to sit, so a plan nobody has asked to rewind is
   * indistinguishable from one with the feature switched off entirely.
   *
   * "Open" means on screen, which takes the config as well as the panel --
   * see {@link isReplayShowing}.
   *
   * Deliberately blunt, because the subtle version kept failing. Replay leaked
   * into a live plan through any path that started it without anyone opening
   * the panel -- switching floors was enough, and that path parked the head at
   * the *start* of the window rather than the end -- and the symptom was
   * silent: every watched entity with a recorded state drew from an hour ago,
   * so lights that were on drew off and a presence sensor that was tripping
   * drew still, while a light toggled from the plan really did switch, because
   * the service call is live either way. Nothing on a closed panel said why
   * (issue #256).
   */
  getRenderState() {
    return {
      enabled: this.isReplayShowing() && this.state.enabled,
      currentTime: this.state.playbackController.currentTime,
      historyVisible: this.state.historyVisible
    };
  }
  clearConfigColorCache() {
    this.state.configuredColorCache.clear();
  }
  pausePlayback() {
    this.state.playbackController.pause();
  }
  formatReplayTime(t) {
    return oy(t, new Intl.DateTimeFormat(void 0, {
      dateStyle: "short",
      timeStyle: "medium"
    }));
  }
  handleRangeChange(t, i) {
    const n = i.target, o = ey(n.value);
    t === "start" ? this.state.startTime = o : this.state.endTime = o, this.updateWindow(this.state.startTime, this.state.endTime);
  }
  updateWindow(t, i) {
    const { start: n, end: o } = ca(t, i), r = o - n;
    this.state.rangeWarning = r < 60 ? "Very small replay window may hide expected transitions." : void 0;
    const a = this.state.playbackController.playing;
    this.state.startTime = n, this.state.endTime = o, this.clearHistoryCache(), this.state.playbackController.pause(), this.stopReplayLoop(), this._card.requestUpdate(), !(!this._card.getHass() || !this.state.historyVisible) && this.startReplay({ preserveCurrentTime: !0, keepPlaying: a });
  }
  resetForFloorChange() {
    this.state.historyEvents = [], this.state.enabled = !1, this.state.ready = !1, this.state.error = void 0, this.state.loadRequested = !1, this.state.loadToken += 1, this.clearHistoryCache(), this.stopReplayLoop(), this._card.requestUpdate(), this._card.getHass() && this.state.historyVisible && this.startReplay({ preserveCurrentTime: !0, keepPlaying: this.state.playbackController.playing });
  }
  zoomWindow(t) {
    const i = Math.max(60, this.state.endTime - this.state.startTime), n = this.state.playbackController.currentTime, o = t > 0 ? Math.max(60, i * 0.8) : i * 1.25, r = o / 2, a = Math.max(0, n - r), s = a + o;
    this.updateWindow(a, s);
  }
  /**
   * Opening and closing the panel is the whole of turning replay on and off.
   *
   * There is no separate enable switch and no button back to now, because
   * those used to be separate questions whose answers could disagree: the plan
   * could be showing an hour ago with nothing on screen saying so. Opening
   * loads the window and parks the head at its start, so replay begins where
   * the calendar says it does; closing stops the clock and hands the plan back
   * to Home Assistant.
   *
   * Closing is not a teardown. The window and its events stay loaded, so
   * reopening on the same range costs no second history fetch -- it just
   * cannot reach the plan while the panel is shut (see {@link getRenderState}).
   */
  toggleHistoryVisible(t) {
    const i = t && this._replayOffered();
    if (this.state.historyVisible = i, !i) {
      this.state.playbackController.pause(), this.stopReplayLoop(), this.logReplay("[easy-floorplan] Replay closed, plan is live"), this._card.requestUpdate();
      return;
    }
    this._card.requestUpdate(), this._card.getHass() && this.startReplay();
  }
  toggleSpeedPanel() {
    this.state.speedExpanded = !this.state.speedExpanded, this._card.requestUpdate();
  }
  toggleTimeline() {
    this.state.timelineExpanded = !this.state.timelineExpanded, this._card.requestUpdate();
  }
  toggleLog() {
    this.state.logExpanded = !this.state.logExpanded, this._card.requestUpdate();
  }
  async startReplay(t = {}) {
    if (!this._card.getHass() || !this._card.getConfig()?.historyReplay) return;
    const i = this.state.startTime || this.getDefaultWindow().start, n = this.state.endTime || this.getDefaultWindow().end, { start: o, end: r } = this.normalizeWindow(i, n);
    this.state.startTime = o, this.state.endTime = r, this.state.enabled = !0, this.state.loadRequested = !0, this.state.error = void 0, this.state.ready = !1;
    const a = t.preserveCurrentTime ? Math.min(r, Math.max(o, this.state.playbackController.currentTime)) : o;
    this.state.playbackController = new tn({
      startTime: o,
      endTime: r,
      initialSpeed: this.speedForRange(o, r)
    }), this.state.playbackController.seek(a), t.keepPlaying && this.state.playbackController.play();
    const s = ++this.state.loadToken;
    this.logReplay("[easy-floorplan] Starting replay", { start: o, end: r, lookback: r - o }), await this.loadReplayRange(o, r, s), t.keepPlaying && this.state.enabled && this.state.playbackController.playing && this.startReplayLoop(), this._card.requestUpdate();
  }
  async loadReplayRange(t, i, n) {
    try {
      const o = this.scopeKey();
      if (await this._historyService.loadHistory(t, i, { scopeKey: o, hass: this._card.getHass(), watched: this.watchedEntities(), numericSteps: this._card.getConfig()?.historyReplay?.numericSteps }), n !== this.state.loadToken) return;
      const r = new Set(this.watchedEntities()), a = this._historyService.getEvents();
      this.state.historyEvents = a.filter((s) => r.has(s.entityId)).map((s) => ({
        ...s,
        color: ny(s, this._card.getConfig(), this._card.getHass(), this.state.configuredColorCache, this.state.configured)
      })), this.state.ready = !0, this.state.loadRequested = !1, this.state.error = void 0, this.logReplay("[easy-floorplan] Replay history loaded", { eventCount: this.state.historyEvents.length }), this._card.requestUpdate();
    } catch (o) {
      if (n !== this.state.loadToken) return;
      this.state.ready = !1, this.state.loadRequested = !1, this.state.error = o instanceof Error ? o.message : "Unable to load history.", console.error("[easy-floorplan] Replay history loading failed", o);
    }
  }
  seekReplay(t) {
    this.state.playbackController.seek(t), this.logReplay("[easy-floorplan] Replay seek", { timestamp: t }), this._card.requestUpdate();
  }
  jumpReplay(t) {
    this.state.playbackController.seek(this.state.playbackController.currentTime + t), this.logReplay("[easy-floorplan] Replay jump", { seconds: t }), this._card.requestUpdate();
  }
  stepReplay(t) {
    if (!this.state.historyEvents.length) return;
    const i = this.state.playbackController.currentTime, n = 1e-4, o = t > 0 ? this._historyService.getEventAfter(i + n) : this._historyService.getEventBefore(i - n);
    o ? this.state.playbackController.seek(o.timestamp) : this.state.playbackController.seek(t > 0 ? this.state.playbackController.endTime : this.state.playbackController.startTime), this._card.requestUpdate();
  }
  setReplaySpeed(t) {
    this.state.playbackController.setPlaybackSpeed(t), this.logReplay("[easy-floorplan] Replay speed", { speed: t }), this._card.requestUpdate();
  }
  playReplay() {
    if (!this.state.enabled) {
      this.startReplay({ preserveCurrentTime: !0, keepPlaying: !0 });
      return;
    }
    if (!this.state.ready) {
      const t = this.state.startTime || this.state.playbackController.startTime, i = this.state.endTime || this.state.playbackController.endTime;
      this.loadReplayRange(t, i, ++this.state.loadToken);
    }
    this.state.playbackController.currentTime >= this.state.playbackController.endTime && this.state.playbackController.seek(this.state.playbackController.startTime), this.state.playbackController.play(), this.startReplayLoop(), this.logReplay("[easy-floorplan] Replay play", { currentTime: this.state.playbackController.currentTime }), this._card.requestUpdate();
  }
  pauseReplay() {
    this.state.playbackController.pause(), this.stopReplayLoop(), this.logReplay("[easy-floorplan] Replay pause", { currentTime: this.state.playbackController.currentTime }), this._card.requestUpdate();
  }
  startReplayLoop() {
    if (this.state.loopId) return;
    this.state.lastReplayFrame = void 0, this.state.uiLastUpdateFrameMs = 0;
    const t = (i) => {
      if (this.state.playbackController.playing && (this.state.lastReplayFrame === void 0 ? this.state.lastReplayFrame = i : (this.state.playbackController.tick(i - this.state.lastReplayFrame), this.state.lastReplayFrame = i, (this.state.uiLastUpdateFrameMs === 0 || i - this.state.uiLastUpdateFrameMs >= 50) && (this.state.uiLastUpdateFrameMs = i, this._card.requestUpdate())), this.state.playbackController.currentTime >= this.state.playbackController.endTime)) {
        this.pauseReplay();
        return;
      }
      this.state.loopId = window.requestAnimationFrame(t);
    };
    this.state.loopId = window.requestAnimationFrame(t);
  }
  stopReplayLoop() {
    this.state.loopId && (window.cancelAnimationFrame(this.state.loopId), this.state.loopId = void 0), this.state.lastReplayFrame = void 0;
  }
  requestUpdate() {
    this._card.requestUpdate();
  }
}
var bb = Object.defineProperty, vb = Object.getOwnPropertyDescriptor, Xe = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? vb(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && bb(t, i, o), o;
};
const ka = /* @__PURE__ */ new Map();
function Sa(e) {
  return e.map((t) => t.id).join("|");
}
let ge = class extends Ue {
  constructor() {
    super(...arguments), this._rotation = new ld(Mr, () => this.requestUpdate("_rotation")), this._focusTimerMs = 0, this._wallMaskId = `fp-wall-mask-${ge._nextWallMaskId++}`, this._openingTween = new sd(Mr, () => this.requestUpdate()), this._glowIdBase = `fp-glow-${ge._nextGlowId++}`, this._watchedEntities = /* @__PURE__ */ new Set(), this._nameEntities = /* @__PURE__ */ new Set(), this._replayController = new yb({
      getConfig: () => this._config,
      getHass: () => this.hass,
      getActiveFloorId: () => this._activeFloorId,
      requestUpdate: () => this.requestUpdate()
    }), this._onOrientation = (e) => {
      this._portrait !== e.matches && this._rotation.finish(), this._portrait = e.matches;
    }, this._onPlanKey = (e) => {
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (e.preventDefault(), this._stepFocus(1)) : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (e.preventDefault(), this._stepFocus(-1)) : e.key === "Escape" && this._zoomedAreaId !== void 0 && (e.preventDefault(), this._zoomedAreaId = void 0, this._restartFocusTimer());
    }, this._onCardActivity = () => {
      this._focusTimer && this._restartFocusTimer();
    }, this._featuresOf = (e) => this.hass?.states[e]?.attributes?.supported_features ?? 0;
  }
  _syncHistoryServiceContext() {
    this._replayController.syncHistoryServiceContext();
  }
  _replayCacheKey() {
    const e = this._config?.historyReplay;
    return JSON.stringify([
      e?.enabled ?? !1,
      e?.lookbackSeconds ?? null,
      e?.defaultSpeed ?? null,
      [...this._watchedEntities].sort()
    ]);
  }
  connectedCallback() {
    if (super.connectedCallback(), this._syncMoonClock(), typeof window > "u" || !window.matchMedia) return;
    const e = window.matchMedia("(orientation: portrait)");
    this._onOrientation(e), this._unsubscribeOrientation = Jr(e, this._onOrientation);
    const t = window.matchMedia("(prefers-reduced-motion: reduce)");
    t.matches && this._rotation.finish(), this._unsubscribeMotion = Jr(t, (i) => {
      i.matches && this._rotation.finish();
    });
  }
  setConfig(e) {
    if (!e || typeof e != "object") throw new Error("Invalid configuration");
    const t = e;
    for (const o of ["walls", "openings", "items", "texts", "furniture", "trackers", "areas", "floors"])
      if (t[o] != null && !Array.isArray(t[o]))
        throw new Error(`Invalid configuration: "${o}" must be a list`);
    for (const o of ["width", "height", "grid", "rotation", "rotationPortrait", "rotationLandscape", "wallHeight", "wallOpacity"])
      if (t[o] != null && typeof t[o] != "number")
        throw new Error(`Invalid configuration: "${o}" must be a number`);
    Va(e);
    const i = this._config;
    (i?.view !== e.view || i?.projection !== e.projection) && (this._rotation.finish(), this._viewOverride = void 0), i?.appearance !== e.appearance && (this._appearanceOverride = void 0), ["rotation", "rotationPortrait", "rotationLandscape"].some((o) => i?.[o] !== e[o]) && this._rotation.jump(0), e.showViewControls || (this._viewOverride = void 0, this._appearanceOverride = void 0, this._rotation.jump(0)), this._config = {
      ...e,
      width: e.width ?? be,
      height: e.height ?? we,
      walls: e.walls ?? [],
      openings: e.openings ?? [],
      items: e.items ?? [],
      texts: e.texts ?? [],
      furniture: e.furniture ?? []
    }, this._watchedEntities = yt(this._config), this._nameEntities = ym(this._config), this._syncMoonClock(), this._syncHistoryServiceContext(), this._replayController.clearConfigColorCache();
    const n = this._replayCacheKey();
    if (n !== this._lastReplayCacheKey && (this._lastReplayCacheKey = n, this._replayController.historyService().clearCache()), this._replayController.syncToConfig(), !this._activeFloorId) {
      const o = Ce(this._config), r = ka.get(Sa(o));
      r && o.some((a) => a.id === r) && (this._activeFloorId = r);
    }
  }
  _displayConfig() {
    const e = this._config, t = this._appearanceOverride ?? Ii(e.appearance);
    return {
      ...e,
      ...this._viewOverride ? { view: this._viewOverride } : {},
      appearance: t,
      // Architectural outlines stay readable at night. Actual light pools and
      // device/room state colours remain live; only environmental effects pause.
      ...t === "line-art" ? { sunlight: !1, sunDimming: !1, ambientDaylight: !1, moonlight: !1 } : {}
    };
  }
  _resetView() {
    this._viewOverride = void 0, this._appearanceOverride = void 0, this._rotation.jump(0), this._zoomedAreaId = void 0;
  }
  /**
   * HA pushes a fresh `hass` on every state change anywhere in the instance —
   * for most updates nothing on this plan moved. Skip those renders entirely.
   */
  shouldUpdate(e) {
    if (!(e.size === 1 && e.has("hass"))) return !0;
    const t = e.get("hass");
    if (!t || !this.hass || Is(t, this.hass, this._watchedEntities)) return !0;
    for (const i of this._nameEntities)
      if (t.states[i] !== this.hass.states[i]) return !0;
    return !1;
  }
  /**
   * Carry the skin as an attribute on the host, where `skinPalettes` picks it
   * up (issue #155). It has to be the host and not the template, because the
   * point is to sit *above* the `<ha-card>` a card-mod rule targets — see
   * skins.ts. Only ever a `findSkin` match, so an unrecognised `skin:` puts no
   * attribute on the element at all.
   */
  willUpdate(e) {
    if (e.has("_appearanceOverride") && this._syncMoonClock(), !e.has("_config")) return;
    const t = Dc(this._config?.skin);
    t ? this.setAttribute("data-skin", t) : this.removeAttribute("data-skin");
  }
  updated(e) {
    super.updated(e), (e.has("hass") || e.has("_activeFloorId")) && this._syncHistoryServiceContext();
    const t = rt(this._config?.roomFocus)?.intervalMs ?? 0;
    t ? (!this._focusTimer || t !== this._focusTimerMs) && this._restartFocusTimer() : this._stopFocusTimer();
  }
  getCardSize() {
    return 6;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => ov), document.createElement("easy-floorplan-card-editor");
  }
  static getStubConfig() {
    return id();
  }
  /**
   * Sections-view sizing (grid rows ≈ 56px): room for the 5:3 default canvas.
   * An instance method — HA calls it on the card element (getConfigElement /
   * getStubConfig are the static ones, called before any instance exists).
   */
  getGridOptions() {
    return { columns: 12, rows: 8, min_columns: 6, min_rows: 4 };
  }
  _isOn(e, t) {
    return He(e.entity, t?.states[e.entity]?.state);
  }
  /** How far open an opening should be drawn (0..1), from its entity (or default). */
  _openingAmount(e, t) {
    const i = e.entity ? t?.states[e.entity] : void 0;
    return _t(e, i);
  }
  /** Whether an opening wears its accent: drawn open, or a cover still in transit. */
  _openingActive(e, t) {
    const i = e.entity ? t?.states[e.entity] : void 0;
    return Jn(e, i);
  }
  /**
   * The second leaf's own state for an opening with a sensor on each — a
   * two-panel slider (issue #145) or a hinged double (issue #159).
   * `undefined` — no second sensor, or a shape with only one leaf — leaves both
   * on the first entity, so nothing about a single-sensor opening changes.
   */
  _openingSecond(e, t) {
    if (!e.secondaryEntity || !Ut(e)) return;
    const i = rl(e), n = t?.states[e.secondaryEntity];
    return { amount: _t(i, n), active: Jn(i, n) };
  }
  /**
   * The same for a hinged shutter's other panel (issue #159). Read from its
   * own key and its own resolvers — the shutter answers to `shutterInvert` and
   * is drawn from `shutterAmount` / `shutterActive`, not the sash's — and only
   * for a `swing` shutter, since a roll curtain has no second panel to drive.
   */
  _shutterSecond(e, t) {
    if (!e.shutterSecondaryEntity || nt(e) !== "swing") return;
    const i = t?.states[e.shutterSecondaryEntity];
    return {
      amount: Te(i, e.shutterInvert),
      active: Mi(i, e.shutterInvert)
    };
  }
  _itemIcon(e, t) {
    return $i(
      e,
      t?.states[e.entity],
      this.hass?.entities?.[e.entity]?.icon
    );
  }
  /** The floor on show: the chosen one, the configured default, or the first. */
  _activeFloor(e) {
    const t = Ce(e);
    return t.find((i) => i.id === this._activeFloorId) ?? t.find((i) => i.id === e.defaultFloor) ?? t[0];
  }
  /**
   * Walk the zoom to the next room (issue #261). The plan-zoom transition
   * animates the move, so the view travels rather than cutting — and under the
   * isometric view it frames the room where it is drawn.
   */
  _stepFocus(e) {
    const t = this._config;
    if (!t) return;
    const i = rt(t.roomFocus), n = ya(this._activeFloor(t).areas, i);
    n.length && (this._zoomedAreaId = Hy(n, this._zoomedAreaId, e), this._restartFocusTimer());
  }
  /**
   * Start the dwell again from now.
   *
   * Called on every step and on any use of the card, which is what keeps a
   * cycling plan from moving out from under someone mid-tap: the tour only
   * advances once the card has been left alone for a whole interval.
   */
  _restartFocusTimer() {
    this._stopFocusTimer();
    const e = rt(this._config?.roomFocus)?.intervalMs ?? 0;
    !e || !this.isConnected || (this._focusTimerMs = e, this._focusTimer = setTimeout(() => {
      this._focusTimer = void 0, this._stepFocus(1);
    }, e));
  }
  _stopFocusTimer() {
    this._focusTimer && clearTimeout(this._focusTimer), this._focusTimer = void 0;
  }
  _label(e, t) {
    return e.name ?? t?.states[e.entity]?.attributes?.friendly_name ?? e.entity ?? "";
  }
  disconnectedCallback() {
    this._replayController.stopReplayLoop(), this._openingTween.stop(), this._rotation.finish(), this._unsubscribeMotion?.(), this._unsubscribeMotion = void 0, this._stopFocusTimer(), this._unsubscribeOrientation?.(), this._unsubscribeOrientation = void 0, this._syncMoonClock(), super.disconnectedCallback();
  }
  _syncMoonClock() {
    const e = this.isConnected && !!this._config && no(this._displayConfig());
    e && this._moonClock === void 0 ? this._moonClock = setInterval(() => this.requestUpdate(), Ag) : !e && this._moonClock !== void 0 && (clearInterval(this._moonClock), this._moonClock = void 0);
  }
  _handleItemAction(e, t) {
    this.hass && ut(this, this.hass, t, ds(t, e.detail.action));
  }
  /** What a gesture on this opening would do, if anything. */
  _openingPress(e, t) {
    return Ho(e, t, this._featuresOf);
  }
  /**
   * Pressing an opening (issue #74 follow-up). Which entity answers — the
   * window/door or its shutter — is {@link openingActionForGesture}'s call;
   * from here it is the same Lovelace dispatch every device uses.
   */
  _onOpeningAction(e, t) {
    if (!this.hass) return;
    const i = this._openingPress(t, e.detail.action);
    i && ut(this, this.hass, { entity: i.entity }, i.config);
  }
  /**
   * The shutter badge (issue #74 follow-up): the shutter entity's own icon,
   * beside an opening that binds both a window/door and a shutter.
   *
   * HTML rather than SVG, like the device badges: it holds a real `ha-icon`.
   * And like them it follows `overlayScale` (#148) — fixed pixels by default,
   * so it stays legible whatever canvas units the author chose, or canvas
   * units under `plan`, so it shrinks with the drawing instead of towering
   * over a scaled-down one. Both offsets follow the same choice, or the badge
   * would drift off the opening at one scale and sit on it at another.
   *
   * The glyph carries the open/closed reading on its own — HA's shutter icons
   * come in pairs — and the accent says the same thing again in colour.
   *
   * Tapping it opens the shutter, whatever the opening's own tap does. That is
   * the point of drawing it: the entity the opening symbol does not lead with
   * gets a control of its own, instead of living behind a press-and-hold
   * nobody can see.
   */
  /**
   * The frame the plan is displayed in: rotated (issue #33), then projected
   * (issue #261). The SVG's transforms, every overlay anchor and the zoom's
   * framing all come from this one description, so the layers cannot drift
   * apart.
   */
  _frame(e, t) {
    const i = O(e.width, be), n = O(e.height, we), o = Et(i, n, t), r = Ce(e).flatMap((a) => a.walls);
    return {
      w: o.w,
      h: o.h,
      // A circle enclosing the unrotated rectangle has the same projected
      // bounds at every angle. Reserve it before the first turn, not mid-flight.
      orbitSpan: e.showViewControls ? Math.SQRT2 * Math.hypot(i, n) : void 0,
      projection: Qt(e.view ?? e.projection),
      wallHeight: vs(e.wallHeight, r),
      padding: 2 + Math.max(X, ...r.map((a) => lt(a.thickness)))
    };
  }
  /**
   * A plan point on the displayed canvas, with that canvas's size — what an
   * overlay anchor's left/top percentages are taken against.
   */
  _display(e, t, i, n) {
    const o = this._frame(i, n), r = ot(e, t, i.width, i.height, n);
    return { p: Mt(r.x, r.y, o), d: xt(o) };
  }
  /** A screen-space direction out of the rotated frame, turned by the projection as well. */
  _displayDirection(e, t, i) {
    return sm(e.x, e.y, this._frame(t, i));
  }
  /** Both views read opening paint and travel through this replay-aware source. */
  _openingStyle(e, t) {
    const i = this._openingAmount(e, t), n = e.shutterEntity ? t?.states[e.shutterEntity] : void 0;
    return {
      color: bo,
      // The closed tone (issue #228). Absent, the moving parts stay
      // the wall colour, which is what a closed opening always was —
      // and that is also what an opening whose contact has dropped
      // out falls back to, so a dead sensor does not draw the same
      // emphatic "shut" as a door that really is (issue #162).
      // Guarded on `hass` for the same reason the device path is:
      // before the first states arrive every opening would read as
      // offline and the closed colour would flash off on load.
      inactive: this.hass && Zn(e, e.entity ? t?.states[e.entity]?.state : void 0) ? void 0 : e.inactiveColor,
      open: i > 0,
      amount: i,
      active: this._openingActive(e, t),
      accent: e.activeColor ?? Q,
      // Per-leaf state for a two-sensor biparting slider (issue #145).
      second: this._openingSecond(e, t),
      // External roller shutter layer (issue #74). No entity bound
      // yet → previewed shut, like a static plan.
      shutter: e.shutterEntity ? {
        amount: Te(n, e.shutterInvert),
        active: Mi(n, e.shutterInvert),
        style: nt(e),
        // The shutter's own accent, falling back to the
        // opening's and then to the skin's.
        accent: e.shutterActiveColor ?? e.activeColor ?? Q,
        flip: e.shutterFlipV,
        // Per-panel state for a two-contact hinged shutter
        // (issue #159).
        second: this._shutterSecond(e, t)
      } : void 0
    };
  }
  /**
   * The same style with every travelling number eased rather than jumped
   * (issue #261 review). One key per panel that moves on its own, so the two
   * leaves of a double door and a shutter over them each keep their own clock.
   *
   * `open` is recomputed from the eased travel: a door closing is still a door
   * that is open, and dropping its panels at the first frame of the movement
   * is the jump this exists to remove.
   */
  _travelling(e, t) {
    const i = (r, a) => this._openingTween.value(`${e.id}:${r}`, a), n = i("leaf", t.amount ?? (t.open === !1 ? 0 : 1)), o = t.shutter;
    return {
      ...t,
      amount: n,
      open: n > 0,
      second: t.second ? { ...t.second, amount: i("leaf2", t.second.amount) } : void 0,
      shutter: o ? {
        ...o,
        amount: i("shutter", o.amount),
        second: o.second ? { ...o.second, amount: i("shutter2", o.second.amount) } : void 0
      } : void 0
    };
  }
  /**
   * The isometric view's standing geometry (issue #261): walls as extruded
   * boxes, cut at their doors and lowered to a sill under their windows, and
   * furniture as blocks with the plan's own glyph on top. Drawn in the
   * rotated frame, between the floor layers and the sun dimming, and painted
   * back to front so a wall hides what stands behind it.
   */
  _renderIsoLayer(e, t, i, n, o, r, a, s, l, c) {
    this._openingTween.setDuration(
      c && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? rs : 0
    );
    const p = (S, x) => ot(S, x, i.width, i.height, n), d = t.map((S) => {
      const x = p(S.x1, S.y1), $ = p(S.x2, S.y2);
      return {
        id: S.id,
        kind: S.kind,
        height: S.height,
        x1: x.x,
        y1: x.y,
        x2: $.x,
        y2: $.y,
        thickness: lt(S.thickness) * (qe(S) ? Ui : 1)
      };
    }), h = e.openings.map((S) => {
      const x = p(S.x, S.y);
      return { x: x.x, y: x.y, length: S.length, angle: S.angle + n, type: S.type };
    }), u = De(i.wallHeight), f = ks(d, h, u, !1);
    for (const S of e.openings) {
      const x = $s(S, t, u);
      f.push(...Ll(S, this._travelling(S, this._openingStyle(S, l)), p, x));
    }
    const g = u * Kn, y = _s(g, n);
    for (const S of e.furniture)
      f.push(
        Ss(
          S,
          p,
          g,
          s(S),
          _`<g transform=${r || m}>
                <g transform="translate(${y.x} ${y.y})">${a(S)}</g>
              </g>`
        )
      );
    const b = new Map(e.openings.map((S) => [S.id, S])), k = i.appearance === "line-art" ? Hl(f, Ae) : void 0;
    return Ms(f, (S, x) => {
      if (k && (x = _`${x}${k(S)}`), S.kind !== "panel" && S.kind !== "opening-hit") return x;
      const $ = b.get(S.id);
      if (!$ || !Xr($, this._featuresOf)) return x;
      const M = S.kind === "opening-hit";
      return _`<g class="fp-iso-opening-button"
          role=${M ? "button" : m} tabindex=${M ? "0" : m}
          aria-label=${M ? $.entity ? l?.states[$.entity]?.attributes?.friendly_name ?? $.entity : $.shutterEntity ?? $.type : m}
          @action=${(P) => this._onOpeningAction(P, $)}
          .actionHandler=${Je({
        hasHold: Me(this._openingPress($, "hold")?.config),
        hasDoubleClick: Me(this._openingPress($, "double_tap")?.config)
      })}>${x}</g>`;
    });
  }
  _renderShutterMark(e, t, i, n, o) {
    const r = e.shutterEntity, a = o?.states[r], s = Te(a, e.shutterInvert) > 0, l = Mi(a, e.shutterInvert), c = cl(e, a, s, this.hass?.entities?.[r]?.icon), p = R(e.shutterActiveColor ?? e.activeColor) ?? Q, d = jo(e), { p: h, d: u } = this._display(d.x, d.y, t, i), f = this._displayDirection(No(e, i), t, i), g = K(Gi, n), y = `translate(calc(${f.x} * ${g}), calc(${f.y} * ${g}))`, b = K(Ki, n), k = o?.states[r]?.attributes?.friendly_name ?? r;
    return v`
      <div
        class="shutter-mark ${l ? "on" : "off"}"
        data-entity=${Ve(r) ?? m}
        style="left:${h.x / u.w * 100}%; top:${h.y / u.h * 100}%;
               width:${b};height:${b};
               transform:translate(-50%,-50%) ${y};--fp-active:${p};"
        title="${k} · ${Jt(o, r)}"
        role="button"
        tabindex="0"
        @action=${() => {
      this.hass && ut(this, this.hass, { entity: r }, { action: "more-info" });
    }}
        .actionHandler=${Je({})}
      >
        <ha-icon
          icon=${c}
          style="--mdc-icon-size:${K(Xi, n)};"
        ></ha-icon>
      </div>
    `;
  }
  /**
   * The opening's own badge (issue #154 follow-up) — the same circle as the
   * shutter's, for the entity the opening symbol itself draws.
   *
   * Opt-in, because most symbols need no help: a leaf that has swung and a
   * panel that has slid are both still on screen, in the accent, saying so. A
   * roll-up is the one that isn't — its curtain leaves the floor plane, and
   * wide open the gap holds a single coloured line. That line is honest and
   * easy to miss, so this puts the entity's own open/closed glyph beside it.
   *
   * It sits on the far side of the wall from the shutter's badge, which is
   * what keeps the two from stacking on an opening that draws both.
   */
  _renderOpeningMark(e, t, i, n, o) {
    const r = e.entity, a = o?.states[r], s = this._openingAmount(e, o) > 0, l = this._openingActive(e, o), c = hl(e, a, s, this.hass?.entities?.[r]?.icon), p = R(e.activeColor) ?? Q, d = pl(e), { p: h, d: u } = this._display(d.x, d.y, t, i), f = this._displayDirection(ul(e, i), t, i), g = K(Gi, n), y = `translate(calc(${f.x} * ${g}), calc(${f.y} * ${g}))`, b = K(Ki, n), k = o?.states[r]?.attributes?.friendly_name ?? r;
    return v`
      <div
        class="shutter-mark ${l ? "on" : "off"}"
        data-entity=${Ve(r) ?? m}
        style="left:${h.x / u.w * 100}%; top:${h.y / u.h * 100}%;
               width:${b};height:${b};
               transform:translate(-50%,-50%) ${y};--fp-active:${p};"
        title="${k} · ${Jt(o, r)}"
        role="button"
        tabindex="0"
        @action=${() => {
      this.hass && ut(this, this.hass, { entity: r }, { action: "more-info" });
    }}
        .actionHandler=${Je({})}
      >
        <ha-icon
          icon=${c}
          style="--mdc-icon-size:${K(Xi, n)};"
        ></ha-icon>
      </div>
    `;
  }
  /**
   * Switch to a floor, from the switcher or from a staircase (issue #121).
   *
   * Shared so the two cannot drift apart on the things that are easy to
   * forget: remembering the choice for the next preview the editor builds, and
   * dropping a zoom that belonged to the floor being left.
   */
  _goToFloor(e, t) {
    const i = this._activeFloorId === t;
    this._activeFloorId = t, ka.set(Sa(e), t), this._zoomedAreaId = void 0, !(i || !this.hass || !this._config?.historyReplay?.enabled) && this._replayController.resetForFloorChange();
  }
  /** Tapping a room zooms the plan in to it; tapping the same room again zooms back out. */
  _onAreaClick(e) {
    this._zoomedAreaId = this._zoomedAreaId === e.id ? void 0 : e.id;
  }
  /**
   * A gesture on a room (issue #181): its configured action, or — for a tap
   * with nothing configured — the zoom the room has always done.
   *
   * The fallback is what keeps this backwards compatible. Every plan drawn
   * before areas had actions has three unset gestures, so every tap still
   * zooms and hold and double-tap still do nothing.
   */
  _onAreaAction(e, t) {
    const i = Ei(t, e.detail.action);
    if (!i) {
      e.detail.action === "tap" && this._onAreaClick(t);
      return;
    }
    this.hass && ut(this, this.hass, { entity: i.entity }, i.config);
  }
  /**
   * A gesture on a piece of furniture (issue #284): its configured action, or —
   * for a tap with nothing configured — the floor change it already did.
   *
   * The same shape as `_onAreaAction`, and for the same reason: every plan
   * drawn before furniture had actions has three unset gestures, so a
   * staircase still changes floor on tap and nothing else answers at all.
   */
  _onFurnitureAction(e, t, i, n) {
    const o = Vt(t, e.detail.action);
    if (!o) {
      e.detail.action === "tap" && n && this._goToFloor(i, n);
      return;
    }
    this.hass && ut(this, this.hass, { entity: o.entity }, o.config);
  }
  /** The visible control owns gestures; the furniture drawing always lets room taps through. */
  _renderFurnitureAction(e, t, i, n, o) {
    const r = Gm(e, n, o, t.defaultFloor), a = (x) => {
      const $ = Vt(e, x);
      return !!$ && Eo({ entity: $.entity }, $.config);
    }, s = a("tap"), l = a("hold"), c = a("double_tap"), p = !!r && !Vt(e, "tap");
    if (!p && !s && !l && !c) return m;
    const d = s || p, h = n.find((x) => x.id === r)?.name, u = p ? h ? `Go to ${h}` : "Go to the next floor" : cg(e, this.hass, Wt(t.symbols)), f = [d && "Tap", l && "Hold", c && "Double-tap"].filter(Boolean).join(", "), g = p ? n.findIndex((x) => x.id === r) > n.findIndex((x) => x.id === o) ? "mdi:stairs-up" : "mdi:stairs-down" : s ? "mdi:gesture-tap" : l ? "mdi:gesture-tap-hold" : "mdi:gesture-double-tap", y = this._frame(t, i), b = ot(e.x, e.y, t.width, t.height, i), k = Mt(b.x, b.y, y, De(t.wallHeight) * Kn), S = xt(y);
    return v`<div
        class="fp-furniture-link"
        data-id=${pe(e.id) ?? m}
        style="left:${k.x / S.w * 100}%;top:${k.y / S.h * 100}%;"
        title=${`${u} · ${f}`}
        role=${d ? "button" : "group"}
        tabindex=${d ? "0" : m}
        aria-label=${u}
        aria-description=${`${f} actions`}
        @action=${(x) => this._onFurnitureAction(x, e, n, r)}
        @keydown=${(x) => {
      x.key !== "Enter" && x.key !== " " || (x.preventDefault(), x.stopImmediatePropagation(), d && !x.repeat && this._onFurnitureAction(new CustomEvent("action", { detail: { action: "tap" } }), e, n, r));
    }}
        .actionHandler=${Je({ hasHold: l, hasDoubleClick: c })}>
      <ha-icon icon=${g} aria-hidden="true"></ha-icon>
    </div>`;
  }
  _renderBadge(e, t, i) {
    const n = O(e.size, je), o = K(n, t), r = e.entity ? i?.states[e.entity] : void 0, a = Xs(e, r?.state, r?.attributes), s = ei(e) === "value" ? el(i, e) : void 0;
    return v`
      <div
        class="badge"
        style="width:${o};height:${o};transform:rotate(${O(e.angle, 0)}deg);"
      >
        ${s ? v`<span
              class="badge-value"
              style="font-size:${K(nl(n, s), t)};"
              >${s}</span
            >` : v`<ha-icon
              class=${a ? `anim-${a}` : ""}
              icon=${this._itemIcon(e, i)}
              style="--mdc-icon-size:${K(Qs(n), t)};"
            ></ha-icon>`}
      </div>
    `;
  }
  /**
   * Start the ink ripple at the point that was actually touched (issue #134).
   * Positions are real screen pixels off the event, so they are unaffected by
   * overlayScale — the ink lands where the finger did at any plan scale.
   *
   * The position cannot come from CSS — only the event knows where the finger
   * landed — so it is handed over as two custom properties and the animation
   * itself stays in the stylesheet.
   *
   * Restarting needs the reflow: re-adding a class whose animation is still
   * running is a no-op, so a quick second tap would draw nothing at all.
   * Listeners are passive and only write style, so the gesture detection in
   * `actionHandler` is untouched.
   */
  _startInk(e) {
    const t = e.currentTarget, i = t?.querySelector(".press-ink");
    if (!i) return;
    const n = t.getBoundingClientRect();
    i.style.setProperty("--fp-ink-x", `${e.clientX - n.left}px`), i.style.setProperty("--fp-ink-y", `${e.clientY - n.top}px`), i.classList.remove("inking"), i.offsetWidth, i.classList.add("inking");
  }
  _renderItem(e, t, i, n, o) {
    const r = this._isOn(e, o), a = js(o, e), s = e.entity ? o?.states[e.entity] : void 0, l = Ro(e, s), c = R(gn(e.stateColor, l)), p = Bs(e, c), d = !!this.hass && Zn(e, s?.state), h = Cm(e, s?.state, o), u = ei(e) !== "none", f = e.display ?? "badge", g = zs(s), y = R(e.activeColor) ?? g, b = r || d ? void 0 : R(e.inactiveColor), k = e.rippleColor ?? c ?? e.activeColor ?? g ?? Q, S = Ka(
      Ci(
        c ?? (r ? y : b),
        this._config?.palette
      )
    ), x = e.rippleSize ?? dn, M = wg(e.rippleDirection ?? hn, i) * Math.PI / 180, P = this._displayDirection({ x: Math.sin(M), y: -Math.cos(M) }, t, i), A = (Math.atan2(P.x, -P.y) * 180 / Math.PI + 360) % 360, I = e.rippleWidth ?? pn, C = h ? "visibility: hidden; pointer-events: none;" : "";
    let L = m;
    if (f === "ripple")
      L = v`<span style="${C}">
        ${Zi(r, k, x, A, I, 3, n)}
      </span>`;
    else if (f === "iconRipple")
      L = v`<div class="stack" style="${C}">
        ${Zi(r, k, x, A, I, 3, n)}
        ${u ? v`<div class="stack-icon">${this._renderBadge(e, n, o)}</div>` : m}
      </div>`;
    else if (u)
      L = v`<span style="${C}">
        ${this._renderBadge(e, n, o)}
      </span>`;
    else if (a && Bi(e) !== "below") {
      const J = K(O(e.size, je), n);
      L = v`<span
        class="badge-space"
        aria-hidden="true"
        style="width:${J};height:${J};"
      ></span>`;
    }
    const { p: B, d: j } = this._display(e.x, e.y, t, i), q = Wf(e);
    return v`
      <div
        class="item fp-item ${r ? "on" : "off"} ${d ? "offline" : ""} ${c ? "state-colored" : ""} ${b ? "inactive-colored" : ""} ${q ? "interactive" : ""}"
        data-id=${pe(e.id) ?? m}
        data-entity=${Ve(e.entity) ?? m}
        data-kind=${pe(e.kind) ?? m}
        style="left:${B.x / j.w * 100}%; top:${B.y / j.h * 100}%;${c ? `--fp-state:${c};` : ""}${y ? `--fp-active:${y};` : ""}${b ? `--fp-inactive:${b};` : ""}${S ? `--fp-ink:${S};` : ""}"
        title=${this._label(e, o)}
        role=${q ? "button" : m}
        tabindex=${q ? "0" : m}
        @action=${(J) => this._handleItemAction(J, e)}
        .actionHandler=${Je({
      hasHold: Me(e.hold_action),
      hasDoubleClick: Me(e.double_tap_action),
      // Unbinds the gesture listeners outright, so keyboard activation
      // cannot reach an action that would do nothing.
      disabled: !q
    })}
        @pointerdown=${q && ki(t) === "ripple" ? (J) => this._startInk(J) : m}
      >
        ${L}
        ${q && ki(t) === "ripple" ? v`<span class="press-ink" aria-hidden="true"></span>` : m}
        ${a ? v`<span
              class="label ${L === m ? "inflow" : ""} label-${Bi(e)}"
              style="font-size:${K(Ws(e.labelSize), n)};${p ? `color:${p};` : ""}"
              >${a}</span
            >` : m}
      </div>
    `;
  }
  _renderAreaLabel(e, t, i, n) {
    if (!e.name || (e.showName ?? !0) === !1) return m;
    const o = $l(e.points), { p: r, d: a } = this._display(o.x, o.y, t, i), s = zm(e.labelSize, n);
    return v`
      <div
        class="area-label"
        style="left:${r.x / a.w * 100}%; top:${r.y / a.h * 100}%;${s}"
      >
        ${e.name}
      </div>
    `;
  }
  _renderText(e, t, i, n) {
    const { p: o, d: r } = this._display(e.x, e.y, t, i);
    return v`
      <div
        class="text fp-text"
        data-id=${pe(e.id) ?? m}
        style="left:${o.x / r.w * 100}%; top:${o.y / r.h * 100}%;
               font-size:${K(O(e.size, jt), n)};
               color:${fe(e.color, Ya)};
               transform:translate(-50%,-50%) scale(var(--fp-inv-zoom,1)) rotate(${O(e.angle, 0)}deg);"
      >
        ${Po(this.hass, e)}
      </div>
    `;
  }
  render() {
    if (!this._config) return v`${m}`;
    const e = this._displayConfig(), t = e.appearance === "line-art", i = this._replayController.getRenderState(), n = kc(this.hass, this._watchedEntities, this._replayController.historyService(), i.enabled, i.currentTime), o = Ce(e), r = this._activeFloor(e), a = vg(e, this._portrait), s = $t(a + this._rotation.target), l = a + this._rotation.value, c = this._frame(e, l), p = xt(c), d = fl(e.width, e.height, l), h = c.projection === "iso", u = h && c.wallHeight > 0;
    u || this._openingTween.stop();
    const f = xs(c), g = X + (h ? c.wallHeight : 0), y = (w) => qt(
      w,
      Nr(w, w.entity ? n?.states[w.entity]?.state : void 0) ?? (t ? Ae : void 0),
      Wt(e.symbols)
    ), b = (w) => Nr(w, w.entity ? n?.states[w.entity]?.state : void 0) ?? R(w.color) ?? os, k = Vi(e.overlayScale), S = k === "plan" ? qi(e.overlayMinWidth) : void 0, x = e.sunDimming ? xg(
      n?.states["sun.sun"]?.attributes?.elevation,
      O(e.sunBrightnessMin, xo),
      O(e.sunBrightnessMax, Hi)
    ) : Hi, $ = r.areas.flatMap((w) => Mn(w.id, w.points, w.sideWalls ?? {})), M = [...r.walls, ...$], P = u ? M.filter((w) => !w.divider) : [], A = u ? M.filter((w) => w.divider) : [], I = Do(
      $.some((w) => w.divider) ? M.filter((w) => !w.divider) : M
    ), C = e.showDeadSpaces ? fs(I, r.openings) : [], B = e.sunDimming || r.items.some((w) => w.glow) ? bn(
      I,
      r.openings,
      (w) => (
        // Both leaves, and the travel each style actually has (issue #145):
        // asking `entity` alone left a door whose *second* panel was open
        // still blocking light outright. Glass admits it whole regardless
        // of sash — a closed window is not a hole, but light still gets
        // through it. A shutter rolled down overrides that, same as it
        // does for sunlight.
        Lo(
          w,
          this._openingAmount(w, n),
          this._openingSecond(w, n)?.amount,
          w.shutterEntity ? Te(n?.states[w.shutterEntity], w.shutterInvert) : void 0
        )
      )
    ) : I, j = {
      // The gap each style actually clears, both leaves included — the same
      // reading the lamps get above, and for the same reason (#145): `entity`
      // alone leaves a door whose *second* panel is open reading as shut, and
      // a converging pair reading as twice as clear as it draws. Glazing and
      // shutters are applied on top of this, inside openingSunFraction.
      openAmount: (w) => Oo(
        w,
        this._openingAmount(w, n),
        this._openingSecond(w, n)?.amount
      ),
      // A shutter that is all the way down stops the light, as one does.
      // Undefined where none is bound, so an opening without a shutter is
      // judged on itself alone.
      shutterOpen: (w) => w.shutterEntity ? Te(n?.states[w.shutterEntity], w.shutterInvert) : void 0,
      // How far a skylight's patch slides from the roof light before it
      // lands. Handed on raw: it is a fraction of the reach, which already
      // carries the light's height, so scaling it here would apply 1/tan
      // twice and pin every patch under its own skylight at noon. Bounded at
      // the sink, in skylightDropFraction.
      drop: e.skylightDrop,
      // Where the light comes in over a balcony's edge rather than through
      // an opening. Kept out of blockingWallSegments, so passed on their own.
      railings: M.filter((w) => qe(w) && !w.divider)
    }, q = no(e) ? Cg(
      e,
      i.enabled ? i.currentTime * 1e3 : Date.now(),
      this.hass?.config,
      n?.states["sun.sun"]?.attributes?.elevation,
      io(ti(e), n)
    ) : void 0, J = (w, H) => q ? sa(I, r.openings, e.width, e.height, w, {
      ...j,
      dir: q.dir,
      strength: q.strength,
      // Shortened as the moon climbs, exactly as the sun's is.
      reach: O(e.sunReach, ii) * ra(q.altitude),
      light: H,
      // The night is the shade; a second one would darken it twice.
      shade: null
    }) : m, ye = `${this._glowIdBase}-sundim`, ue = e.sunDimming ? Mm(
      r.items,
      n?.states,
      e.width,
      e.height,
      ye,
      B,
      J(`${this._wallMaskId}-moondim`, "#000")
    ) : m, ci = rt(e.roomFocus), E = ya(r.areas, ci), N = r.areas?.find((w) => w.id === this._zoomedAreaId), Y = N ? Vg(
      N.points,
      e.width,
      e.height,
      l,
      void 0,
      void 0,
      // A room may say how close to go; without one the fit decides,
      // exactly as it always has (issue #222).
      qg(N),
      c
    ) : ro, re = e.compactHeader === !0, W = re && !!e.title;
    return v`
      <!-- The skin (issue #122) rides on the card rather than on .plan, so the
           floor switcher and the card's own background follow it too — a Tron
           plan floating on a white card would read as a bug. Every token the
           card draws with is declared on :host, so this only ever overrides. -->
      <!-- No skin style here: the palette comes from data-skin on the host, so
           a card-mod rule on this element still wins (issue #155). -->
      <!-- The card header is a fixed ~76px whether the title is "U8" or a
           sentence, and every part of it lives inside ha-card's shadow root
           where no rule of ours reaches. compactHeader therefore does not
           shrink it — it declines it, and draws the title inside the stage
           instead, where it costs no layout height at all (issue #152). -->
      <!-- The palette (issue #265) rides here, above everything that could
           name one of its colours — the floor switcher and the card background
           as well as the plan. Inline rather than on :host like the skin
           tokens, because unlike a skin it is per-config data and there is no
           fixed set of rules to write ahead of time. It declares only
           --fp-color-* names, so a card-mod rule on this element still owns
           every --fp-skin-* token exactly as issue #155 left it. -->
      <ha-card
        .header=${re ? m : e.title ?? m}
        style=${Pl(e.palette) || m}
        @pointerdown=${this._onCardActivity}
        @keydown=${this._onCardActivity}
      >
        <div class="card-shell ${this._replayController.isHistoryVisible() ? "replay-visible" : ""}">
          ${this._config.historyReplay?.enabled ? this._renderReplayPanel() : m}
          <div
            class="stage press-${ki(e)} offline-${Js(e)} ${W ? "compact-title" : ""}"
            style="aspect-ratio: ${p.w} / ${p.h};"
          >
          <!-- The plan box: exactly the canvas ratio, fitted inside whatever
               height the card was actually given, and centred there (closes
               #115). Sized off the container's height so it shrinks when the
               height is the binding axis — clamping a full-width box with
               max-height instead would break the ratio rather than the box.

               The stage carries the same aspect-ratio so it still has a
               definite height in a content-sized (masonry) card; without it,
               size containment leaves 100cqh with nothing to resolve against
               and the plan collapses to nothing. -->
          <div
            class="plan ${k === "plan" ? "scale-plan" : ""} ${t ? "line-art" : ""} ${this._rotation.running ? "rotating" : ""}"
            tabindex=${E.length > 1 ? "0" : m}
            role=${E.length > 1 ? "group" : m}
            aria-label=${E.length > 1 ? "Floor plan. Use the arrow keys to move between rooms, Escape to see the whole plan." : m}
            @keydown=${E.length > 1 ? this._onPlanKey : m}
            style="aspect-ratio: ${p.w} / ${p.h};
                   width: min(100%, calc(100cqh * ${p.w} / ${p.h}));
                   --fp-plan-w: ${p.w};
                   --fp-wall-opacity: ${t ? 1 : ws(e.wallOpacity)};
                   ${S === void 0 ? "" : `--fp-min-w: ${S}px;`}
                   background:${t ? "#fff" : fe(e.background, oi)};"
          >
          <!-- preserveAspectRatio="none" is correct here, and it took a wrong
               fix to see why. Fitting the plan into a card that is the wrong
               shape for it is .plan's job, not this line's (#115): .plan
               carries the canvas ratio, so the SVG's box always matches its
               viewBox, and "none" and "meet" are equivalent while that holds.

               "none" is still the deliberate choice, because it is the one
               that fails safely. The .items overlay is HTML, positioned with
               raw left/top percentages of .plan, and it does not letterbox. So
               if anything ever overrides .plan's ratio (card-mod, a grid row
               count), "meet" letterboxes the SVG away from the overlay and
               every icon drifts off the wall it was placed on, while "none"
               stretches both layers identically: distorted, but aligned. -->
          <!-- Zoom-to-room (tap an area). One wrapper around both the SVG and
               the HTML overlay so a CSS transform here reframes both layers
               identically — see areaZoomTransform. Wraps the keyed() skin
               block below rather than sitting inside it, so a skin change
               (which rebuilds that subtree) never disturbs this transform. -->
          <div
            class="plan-zoom"
            style="transform: translate(${Y.txPercent}%, ${Y.tyPercent}%) scale(${Y.scale});"
          >
          <!-- Keyed on the skin (issue #122). A skin changes custom properties on
               an ancestor, and Chromium does not repaint an SVG element whose
               colour comes from a var() inside a presentation attribute or an
               inline style unless something else about it changes — Lit writes
               the same attribute string either way, so switching skins left
               every door, window and room fill painted in the previous skin's
               colours while the computed values were already correct. Keying
               rebuilds the subtree instead, which repaints by construction.
               Only on a skin change; ordinary state updates are untouched.

               Recolouring a palette entry (issue #265) is the same change seen
               from the other end — a custom property moving under a var() in a
               presentation attribute — so it is in this key too. -->
          ${Ua(
      `${e.skin ?? ""}|${zl(e.palette)}|${e.appearance}`,
      _`<svg viewBox="0 0 ${p.w} ${p.h}" preserveAspectRatio="none">
            <g transform=${f || m}>
            <g transform=${d || m}>
            ${r.image ? _`<image class="fp-floor-image" href=${r.image} x="0" y="0" width=${e.width} height=${e.height}
                          preserveAspectRatio=${_l(r.imageFit)}
                          opacity=${r.imageOpacity ?? 1} />` : m}
            ${r.areas?.map((w) => {
        const H = hg(w);
        return _`<g class="area-tap-target"
                    role=${H ? "button" : m}
                    tabindex=${H ? "0" : m}
                    @action=${(se) => this._onAreaAction(se, w)}
                    .actionHandler=${Je({
          // Only wait out the timers when a gesture can resolve:
          // otherwise every tap on an ordinary room would sit for
          // 500ms before zooming.
          hasHold: Me(Ei(w, "hold")?.config),
          hasDoubleClick: Me(Ei(w, "double_tap")?.config)
        })}>
                  ${Ml(
          t ? {
            ...w,
            color: "#fff",
            opacity: 1,
            activeOpacity: w.activeOpacity ?? w.opacity ?? 0.25
          } : w,
          jr(w, w.entity ? n?.states[w.entity]?.state : void 0)
        )}
                </g>`;
      })}
            <!-- Diffuse sky light (PR #204). Reads its opening travel, shutter
                 state and sun elevation through the same replay-aware state
                 source as every other light layer, so a replayed plan shows the
                 daylight of the moment being replayed rather than of now. -->
            ${mb(
        r,
        e,
        n,
        `${this._wallMaskId}-ambient`,
        {
          amount: (w) => this._openingAmount(w, n),
          secondAmount: (w) => this._openingSecond(w, n)?.amount
        }
      )}
            <!-- Dead spaces (issue #88): the regions the walls seal off that no
                 door or window reaches, hatched. Above the room fills, so a
                 region someone has also drawn an area over still reads as
                 unreachable; below everything else, because it describes the
                 floor rather than anything standing on it. -->
            ${C.length ? _`${kl(`${this._wallMaskId}-dead`)}
                    ${C.map(
        (w) => Sl(w, `${this._wallMaskId}-dead`)
      )}` : m}
            <!-- Light pools (issue #6). Above the room fills but below the
                 furniture and walls, so light reads as cast onto the floor
                 rather than painted over the plan. Isolated as one layer: the
                 pools screen-blend with each other (two lamps brighten where
                 they meet) without screening against the plan beneath, which
                 would wash out on a light theme. -->
            ${Rs(
        r.furniture,
        e.width,
        e.height,
        `${this._glowIdBase}-mask`,
        Wt(e.symbols)
      )}
            <g class="fp-glows"
               mask=${r.furniture.length ? `url(#${this._glowIdBase}-mask)` : m}>
              ${r.items.map((w, H) => {
        if (!w.glow) return m;
        const se = Wi(w, n?.states[w.entity]);
        return se ? Os(w, se, `${this._glowIdBase}-${H}`, B) : m;
      })}
            </g>
            ${u ? m : r.furniture.map(y)}
            <!-- Sunlight through the openings. Under the walls on purpose:
                 light lands on the floor, and the walls stay crisp lines over
                 it rather than being tinted by the patches they let in. The
                 sun dimming further down is the whole-sky reading and still
                 has the last word — at night there is nothing to let in. -->
            ${e.sunlight ? sa(
        // The same blocking set the lamps and dead space get
        // (issue #290): generated room walls stop the sun too, and
        // a divider never does. Railings are already out, so the
        // sun passes over them (issue #182).
        I,
        r.openings,
        e.width,
        e.height,
        `${this._wallMaskId}-sun`,
        {
          // Both halves of the sun come from the same entity while
          // the plan follows it: the azimuth says where the light
          // comes from, the elevation whether there is any at all.
          // A plan that pins its own angle keeps its light on —
          // see sunlightStrengthOf.
          dir: Wg(
            e,
            n?.states["sun.sun"]?.attributes?.azimuth
          ),
          strength: $g(
            e,
            n?.states["sun.sun"]?.attributes?.elevation
          ),
          // The clouds (issue #201) thin what the sun lights and
          // leave its shade, and a pinned plan ignores them the
          // same way — see sunThroughCloud.
          direct: kg(e, io(ti(e), n)),
          // How far a patch carries, shortened as the sun climbs
          // (issue #185): a midday sun drops its light almost
          // straight down and lays a short patch, an evening one
          // rakes it across the room. A pinned bearing states a
          // picture rather than reading the sky, so it keeps the
          // plain reach — same rule as the strength above.
          // Coerced here so the elevation still scales a sane
          // base — cssNumber is what the sun brightness above
          // already uses on its own hand-edited numbers. The
          // bounds live at the sink, in sunReachFraction.
          reach: O(e.sunReach, ii) * (ht(e) ? 1 : ra(n?.states["sun.sun"]?.attributes?.elevation)),
          ...j,
          light: e.sunlightColor ?? Ti,
          shade: e.sunShade === !1 ? null : e.sunShadeColor ?? oo
        }
      ) : m}
            <!-- Moonlight (issue #201): the same light through the same
                 openings, cool rather than warm, once the sun has set. -->
            ${q ? _`<g class="fp-moonlight">${J(`${this._wallMaskId}-moon`, Mg)}</g>` : m}
            ${Vo(r.openings, e.width, e.height, this._wallMaskId)}
            ${(u ? A : M).map(
        (w) => _`
                <g class="fp-wall-neon"><line x1=${w.x1} y1=${w.y1} x2=${w.x2} y2=${w.y2}
                      class="wall fp-wall ${qe(w) ? "railing" : ""}"
                      data-id=${pe(w.id) ?? m}
                      mask=${`url(#${this._wallMaskId})`}
                      style=${w.divider ? qs() : Vs(w.thickness, w.kind)}
                      stroke-linecap="round" /></g>`
      )}
            <!-- Room outlines, above the walls they trace. An area polygon runs
                 down the centerline of the room's walls, so an outline drawn
                 with the fill is buried under the wall and never seen. Drawn
                 here it colors the wall instead. Same mask as the walls above,
                 so a doorway is a gap in the outline exactly as it is a gap in
                 the wall. Each live outline is clipped to its own room, so a
                 shared wall splits down the middle rather than going to
                 whichever area happens to sit later in the config. -->
            <g mask=${`url(#${this._wallMaskId})`}>
              ${r.areas?.map(
        (w, H) => El(
          w,
          jr(w, w.entity ? n?.states[w.entity]?.state : void 0),
          `${this._wallMaskId}-area-${H}`
        )
      )}
            </g>
            <!-- LED strips (issue #298), above the flat walls: one snapped
                 onto a wall would be buried under it. Drawn in the isometric
                 view too, on the floor where its pool is — an off strip has
                 no icon of its own to fall back on (review on #372). -->
            ${r.items.map((w) => {
        const H = w.glow ? st(w) : void 0;
        return H ? Ds(H, Wi(w, n?.states[w.entity])?.color) : m;
      })}
            ${Ee(
        // Keyed by id: switching floors must create fresh DOM nodes.
        // Unkeyed, Lit morphs floor A's openings into floor B's, and the
        // 0.5s leaf/panel transitions animate the leftover state — a
        // window briefly plays a door swing (issue #50).
        u ? [] : r.openings,
        (w, H) => w.id || H,
        (w) => {
          const H = Wo(w, this._openingStyle(w, n));
          if (!Xr(w, this._featuresOf)) return H;
          const se = eo(w);
          return _`<g class="fp-opening" role="button" tabindex="0"
                    @action=${(Pt) => this._onOpeningAction(Pt, w)}
                    .actionHandler=${Je({
            // Only wait out the hold/double-tap timers when a gesture
            // actually resolves: otherwise every tap on a plain
            // contact sensor would sit for 500ms before answering.
            hasHold: Me(this._openingPress(w, "hold")?.config),
            hasDoubleClick: Me(this._openingPress(w, "double_tap")?.config)
          })}>
                  ${H}
                  <rect class="fp-opening-hit"
                        x=${w.x - se.width / 2} y=${w.y - se.height / 2}
                        width=${se.width} height=${se.height}
                        transform="rotate(${w.angle} ${w.x} ${w.y})" />
                </g>`;
        }
      )}
            ${Ee(
        r.trackers ?? [],
        (w, H) => w.id || H,
        (w) => Al(w, {
          editing: !1,
          xReading: Qi(n?.states, w.xSensor?.entity),
          yReading: Qi(n?.states, w.ySensor?.entity),
          xPresent: ji(n?.states, w.xSensor?.presence),
          yPresent: ji(n?.states, w.ySensor?.presence)
        })
      )}
            <!-- Sun dimming (issue #113). Last inside the rotated group, so it
                 covers the whole plan; the device overlay below is HTML and
                 stays at full brightness, keeping icons and state readable at
                 night. pointer-events:none is not optional — this rect spans
                 the canvas, and without it every tappable opening underneath
                 stops responding (the lesson from #108). -->
            </g>
            ${u ? this._renderIsoLayer(
        r,
        P,
        e,
        l,
        c,
        d,
        y,
        b,
        n,
        // Scrubbing history jumps from state to state on purpose;
        // easing between them would trail the scrubber.
        !i.enabled
      ) : m}
            <g transform=${d || m}>
            ${e.sunDimming ? _`${ue}<rect class="fp-sun-dim"
                            x=${-g} y=${-g}
                            width=${e.width + g * 2}
                            height=${e.height + g * 2}
                            fill="#000"
                            mask=${ue === m ? m : `url(#${ye})`}
                            opacity=${1 - x} />` : m}
            </g>
            </g>
          </svg>`
    )}
          <div
            class="items"
            style="--fp-inv-zoom:${Gg(Y.scale, e.zoomedOverlayScale)};--fp-furniture-inv-zoom:${1 / Y.scale};"
          >
            ${r.areas?.map((w) => this._renderAreaLabel(w, e, l, k))}
            ${r.texts.map((w) => this._renderText(w, e, l, k))}
            ${Ee(
      // Keyed like the openings above: a floor switch must build fresh
      // nodes rather than morph one floor's badges into another's.
      r.openings.filter((w) => sl(w)),
      (w, H) => `${w.id || H}-shutter`,
      (w) => this._renderShutterMark(w, e, l, k, n)
    )}
            ${Ee(
      r.openings.filter((w) => dl(w)),
      (w, H) => `${w.id || H}-opening`,
      (w) => this._renderOpeningMark(w, e, l, k, n)
    )}
            ${Ee(
      r.furniture,
      (w, H) => w.id || H,
      (w) => this._renderFurnitureAction(w, e, l, o, r.id)
    )}
            ${Ee(
      // No entity filter: devices that exist physically but have no HA
      // entity still deserve their badge (issue #39). Keyed by id so a
      // floor switch builds fresh DOM (see the openings comment).
      // "Only when active" devices drop out here (issue #55), and so do
      // the ones that only show inside their own room (#222) — the
      // editor still draws them, dimmed, so they stay editable.
      r.items.filter(
        (w) => !Hs(
          w,
          w.entity ? n?.states[w.entity]?.state : void 0,
          n
        ) && !Tm(w, N)
      ),
      (w, H) => w.id || H,
      (w) => this._renderItem(w, e, l, k, n)
    )}
          </div>
          </div>
          ${Y.scale > 1 ? v`<button
                class="zoom-out"
                title="Zoom out"
                aria-label="Zoom out"
                @click=${() => this._zoomedAreaId = void 0}
              >
                <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
              </button>` : m}
          ${ci?.controls && E.length > 1 ? v`<div class="room-focus" role="group" aria-label="Move between rooms">
                <button
                  title="Previous room"
                  aria-label="Previous room"
                  @click=${() => this._stepFocus(-1)}
                >
                  <ha-icon icon="mdi:chevron-left"></ha-icon>
                </button>
                <button title="Next room" aria-label="Next room" @click=${() => this._stepFocus(1)}>
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </button>
              </div>` : m}
          ${W ? v`<div class="plan-title">${e.title}</div>` : m}
          <!-- Outside the zoom wrapper on purpose, placed or not (issue #281).
               The buttons are how you change floor, and zoom-to-room can scale
               the plan well past the card: carried along, a switcher placed in
               the hall would leave the viewport the moment you tapped a room at
               the other end, and there would be no way to change floor until
               you zoomed back out. A control you can lose is a worse failure
               than one that overlaps the drawing for as long as a zoom lasts —
               and the position is chosen against the view people spend their
               time in, which is the unzoomed one. -->
          ${o.length > 1 ? this._renderFloorSwitcher(o, r, e, l) : m}
        </div>
        </div>
        ${e.showViewControls ? Fy({
      view: h ? "3d" : "2d",
      appearance: Ii(e.appearance),
      rotation: s,
      canReset: !!(this._viewOverride || this._appearanceOverride || this._rotation.target || this._rotation.running || this._zoomedAreaId),
      exportEnabled: !!e.showExport,
      setView: (w) => {
        this._rotation.finish(), this._viewOverride = w === (Qt(this._config.view ?? this._config.projection) === "iso" ? "3d" : "2d") ? void 0 : w;
      },
      setAppearance: (w) => {
        this._appearanceOverride = w === Ii(this._config.appearance) ? void 0 : w;
      },
      rotate: (w) => this._rotation.turn(w, h && this.isConnected && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches),
      reset: () => this._resetView(),
      download: () => ma(e, r, s)
    }) : e.showExport ? v`<div class="export-bar">
          <button type="button" title=${`Download line art of ${r.name} as SVG`}
            @click=${() => ma(e, r, s)}>Export SVG</button>
        </div>` : m}
        </div>
      </ha-card>
    `;
  }
  _renderReplayPanel() {
    return ly(sy(this._replayController));
  }
  _renderFloorSwitcher(e, t, i, n = 0) {
    const o = Rt(i), r = o ? ot(o.x, o.y, O(i.width, be), O(i.height, we), n) : void 0, a = Et(O(i.width, be), O(i.height, we), n);
    return v`
      <div
        class="floor-switcher ${qa(i)} ${r ? "placed" : ""}"
        part="floor-switcher"
        role="group"
        aria-label="Select floor"
        style=${r ? `left:${r.x / a.w * 100}%; top:${r.y / a.h * 100}%;` : m}
      >
        ${e.map((s) => {
      const l = s.id === t.id ? R(s.color) : void 0;
      return v`
            <button
              type="button"
              class="floor-button ${s.id === t.id ? "active" : ""}"
              part=${s.id === t.id ? "floor-button floor-button-active" : "floor-button"}
              data-floor-id=${s.id}
              title=${s.name}
              aria-label=${s.name}
              aria-pressed=${s.id === t.id ? "true" : "false"}
              style=${l ? `--fp-floor-accent:${l};` : m}
              @click=${() => this._goToFloor(e, s.id)}
            >
              ${s.short || s.name}
            </button>
          `;
    })}
      </div>
    `;
  }
};
ge._nextWallMaskId = 0;
ge._nextGlowId = 0;
ge.styles = [
  Za,
  Rc,
  Ga,
  Re`
    ha-card {
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
      /* The skin paints the card, not just the plan: .plan is only the canvas
         box, and on a card that isn't the canvas's shape the rest would stay
         the Home Assistant theme's colour. Unskinned this is ha-card's own
         default chain, so nothing changes. */
      background: var(--fp-skin-card-bg, var(--ha-card-background, var(--card-background-color, #fff)));
      /* The title sits on that background, and ha-card colours it from this
         variable rather than inheriting — so a dark skin under a light Home
         Assistant theme would print a dark title on near-black. The default is
         ha-card's own. */
      --ha-card-header-color: var(--fp-skin-text, var(--primary-text-color));
      /* A column, so the stage takes the height left over after the card's
         own header rather than the card's whole height. With a title set, a
         full-height stage measures past the bottom of the card by exactly the
         header, and the plan is cut off by that much. */
      display: flex;
      flex-direction: column;
    }
    .card-shell {
      display: flex;
      flex-direction: column;
      gap: 12px;
      /* In fixed-height dashboards (e.g. Sections rows), replay controls can
         extend past the visible card area. Keep content reachable by letting
         this inner shell scroll inside the card instead of clipping. */
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .card-shell.replay-visible {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
    }
    .card-shell.replay-visible .stage {
      min-height: 0;
    }
    .stage {
      position: relative;
      width: 100%;
      /* Takes the space the header leaves, and may shrink below its content:
         without min-height a flex item floors at its content size and the
         plan pushes the stage past the card again. */
      flex: 1 1 auto;
      min-height: 0;
      padding: 0;
      /* Centres the plan box in whatever the card was given, and makes the
         stage's own height queryable so the plan can size against it. */
      display: flex;
      align-items: center;
      justify-content: center;
      container-type: size;
    }
    .plan {
      position: relative;
      /* Older WebViews reject the inline cqh width. With only absolutely
         positioned children, auto width collapses the plan to zero (#339). */
      width: 100%;
      height: auto;
    }
    /*
     * overlayScale: plan. The container is .plan, not .stage: since #115 the
     * stage is only the box the plan is *centred in*, and it is wider than the
     * plan on any card that isn't the canvas's ratio. Measuring the stage would
     * oversize every label by exactly the letterboxing.
     *
     * --fp-u -- one canvas unit as a length -- is declared on the overlay
     * *inside* .plan rather than on .plan itself. Both work today: --fp-u is an
     * unregistered custom property, so its value is substituted as a token
     * stream and the cqw resolves wherever it is finally used -- always a
     * descendant of .plan. Declaring it here is what stays correct if --fp-u is
     * ever registered with @property, which would resolve the cqw at the
     * declaring element instead. (.plan's own width reads 100cqh against
     * .stage, since container units look at an element's *ancestor* container;
     * adding inline-size containment to .plan doesn't disturb it.)
     *
     * inline-size containment is enough for cqw and is cheaper than the size
     * containment .stage needs; .plan's height comes from its inline
     * aspect-ratio, so nothing here depends on the overlay's own size.
     */
    .plan.scale-plan {
      container-type: inline-size;
    }
    /*
     * The unit itself, declared twice on purpose.
     *
     * The fallback in var(--fp-u, 1px) is not the safety net it looks like: it
     * fires when the property is *unset*, never when its value fails to
     * resolve. A browser with no container queries parses the calc quite
     * happily -- a custom property takes almost any token stream -- and then
     * every property using it is invalid at computed-value time, so each falls
     * back to its own initial value. Width becomes auto, and a badge collapses
     * to its borders: about 3px, with its label landing on top of it because
     * the item's box collapsed with it.
     *
     * So the plain value is declared first, and the container-query one only
     * where it can actually be computed. One pixel per canvas unit is exactly
     * what overlayScale fixed draws, which is the right thing to degrade to: a
     * plan that looks like it did before canvas units existed, rather than one
     * with 3px badges.
     *
     * The guard tests the unit as well as the property, because they are two
     * features and only one of them is what the declaration is made of. A
     * browser with container-type but no cqw would pass a check for the
     * property and then fail on the value, which is the exact collapse this is
     * here to stop. Test what is actually used; it costs one more clause.
     */
    .plan.scale-plan .items {
      --fp-u: 1px;
    }
    @supports (container-type: inline-size) and (width: 1cqw) {
      .plan.scale-plan .items {
        /* Clamp the shared unit so badges and their text keep their proportions.
           The drawing and overlay positions still follow the actual plan size. */
        --fp-u: calc(max(100cqw, var(--fp-min-w, 0px)) / var(--fp-plan-w));
      }
    }
    /* The measures that aren't config-driven, so they never reach an inline
       style. Label padding goes to em rather than canvas units because it
       should track the label's own size either way.
       Hairlines are deliberately left alone: a badge border and the label's
       drop shadow are 1px-ish either way, and scaling them with the plan puts
       them below a pixel on exactly the small cards this mode is for. Skins
       own those tokens now in any case. */
    .plan.scale-plan .label {
      padding: 0.08em 0.33em;
      border-radius: 0.33em;
    }
    .plan.scale-plan .item > .label {
      top: calc(100% + 0.17em);
    }
    /* The side positions measure their gap in em too, so it tracks the label
       with the plan exactly as the below position's does. Restating top
       because the rule above sets it for every label. */
    .plan.scale-plan .item > .label.label-left,
    .plan.scale-plan .item > .label.label-right {
      top: 50%;
    }
    .plan.scale-plan .item > .label.label-left {
      right: calc(100% + 0.33em);
    }
    .plan.scale-plan .item > .label.label-right {
      left: calc(100% + 0.33em);
    }
    .floor-switcher {
      position: absolute;
      top: 8px;
      right: 8px;
      pointer-events: auto;
      z-index: 1;
    }
    /* Placed by the author (issue #281). The corner rules above are overridden
       rather than made conditional, so a plan that sets no position emits no
       inline style and renders exactly as it always has. The right:auto is the
       load-bearing half: without it the block is pinned to both edges and the
       left the card just set does nothing but stretch it. */
    .floor-switcher.placed {
      right: auto;
      width: max-content;
      transform: translate(-50%, -50%);
    }
    /* Centred on its anchor in both axes, so the point you drop it on is the
       middle of the block rather than a corner of it — which is what makes a
       drag feel like it is holding the thing it is holding. A wrapped compact
       row centres the same way. */
    /* Compact chrome (issue #152): the buttons run across the top strip
       instead of down the side, so they share it with the title chip rather
       than each claiming their own band. Wrapped, because a plan with eight
       floors is exactly the case a row is worst at — better a second short
       row than buttons off the edge of the card. Right-aligned so the row
       grows back toward the title rather than through it. */
    /* Room for the title chip on the left, so a long floor name and a long
       title don't meet in the middle — the chip's own max-width leaves the
       same margin from the other side. Only when there *is* a chip: a compact
       card with no title has the whole strip, and reserving 44% of it would
       wrap the buttons for nothing. */
    .stage.compact-title .floor-switcher.row:not(.placed) {
      left: 44%;
    }
    .floor-switcher button {
      cursor: pointer;
    }
    .floor-switcher button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    /* The title, drawn inside the plan (issue #152). Styled as a chip rather
       than as a heading: it is sitting *on* the drawing, and 24px of bare text
       over a wall reads as part of the plan. Same tokens as the floor buttons
       beside it, so a skin carries both. */
    .plan-title {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 1;
      /* Stops short of the floor row's own edge, so a long title ellipsises
         rather than running under the buttons. */
      max-width: 40%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border: 1px solid var(--fp-skin-badge-border, var(--divider-color, #ccc));
      background: var(--fp-skin-badge-bg, var(--card-background-color, #fff));
      color: var(--fp-skin-text, var(--primary-text-color));
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 13px;
      font-weight: 500;
      line-height: 1;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    /* Zoom-to-room (tap an area). One wrapper around both the SVG and the
       HTML overlay so a transform here reframes both layers identically —
       transform-origin:0 0 matches the translate-percent math in
       areaZoomTransform(). Setting a transform (even the identity) makes this
       div establish the containing block for its absolutely-positioned
       svg/.items children, so it needs the same inset:0 they'd otherwise use. */
    /* Orbit frames already interpolate the geometry and room framing. CSS
       transitions would trail behind them and briefly detach overlay scales. */
    .rotating .plan-zoom, .rotating .item, .rotating .text,
    .rotating .area-label, .rotating .fp-furniture-link, .rotating .shutter-mark {
      transition: none;
    }
    .plan-zoom {
      position: absolute;
      inset: 0;
      transform-origin: 0 0;
      transition: transform 0.4s ease;
    }
    @media (prefers-reduced-motion: reduce) {
      .plan-zoom {
        transition: none;
      }
    }
    /* The room-focus controls (issue #261), sharing the zoom-out button's look
       and its corner — it is the same job, one room further along. */
    .room-focus {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 1;
      display: flex;
      gap: 4px;
    }
    .room-focus button {
      cursor: pointer;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 6px;
      padding: 4px;
      line-height: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .export-bar {
      position: relative;
      z-index: 2;
      background: var(--card-background-color, #fff);
      display: flex;
      flex: 0 0 auto;
      justify-content: flex-end;
      padding: 4px 8px 8px;
    }
    .export-bar button {
      font: inherit;
      font-size: 12px;
      color: var(--primary-text-color, #222);
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 6px;
      padding: 8px 12px;
      cursor: pointer;
    }
    .zoom-out {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 1;
      cursor: pointer;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 6px;
      padding: 4px;
      line-height: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    /* The compact title has that corner. The zoom-out button is the transient
       one — it exists only while a room is zoomed — so it is the one that
       moves, dropping below the chip rather than landing on top of it. */
    .stage.compact-title .zoom-out {
      top: 38px;
    }
    .area-tap-target {
      cursor: pointer;
    }
    /* Furniture surfaces always pass input to the room, including pieces with
       actions. Card-only: the editor must still select and move the drawing. */
    .fp-furniture { pointer-events: none; }
    .fp-furniture-link {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      /* The visible circle is the whole hit target. It stays finger-sized,
         independent of canvas scale, projection and room zoom. */
      box-sizing: border-box;
      width: ${vt}px;
      height: ${vt}px;
      border-radius: 50%;
      border: 1px solid var(--fp-skin-text, var(--primary-text-color, #212121));
      background: var(--fp-skin-paper, var(--card-background-color, #fff));
      color: var(--fp-skin-text, var(--primary-text-color, #212121));
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      transform: translate(-50%, -50%) scale(var(--fp-furniture-inv-zoom, 1));
      transition: transform 0.4s ease;
      pointer-events: auto;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      user-select: none;
    }
    .fp-furniture-link ha-icon {
      display: flex;
      --mdc-icon-size: 20px;
      pointer-events: none;
    }
    .fp-furniture-link:focus-visible {
      outline: 2px solid var(--fp-skin-text, var(--primary-text-color, #212121));
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .fp-furniture-link { transition: none; }
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }
    /* Sunlight through the openings. Paint only — the plan underneath stays
       pressable, which is what pointer-events:none is here for (#108). */
    .fp-sunlight {
      pointer-events: none;
    }
    /* No fill declaration here, deliberately. CSS beats the presentation attribute — the same rule the
       wall below relies on — and a patch of sunlight is filled with a
       *gradient* the renderer builds per opening. A flat colour declared here
       silently discards it: the markup keeps saying url(#…), the computed
       style says rgb(…), and the light comes out as a hard slab no matter
       what shape the falloff is given. That is issue #185, and it survived
       four rewrites of the falloff because every one of them was correct and
       none of them was ever used.

       The skin still applies: --fp-skin-sunlight is read by SUN_LIGHT_COLOR
       and lands on the gradient's own stops. */
    .wall {
      stroke: var(--fp-skin-wall, var(--primary-text-color));
      /* CSS beats the presentation attribute, so the skin sets the wall's
         weight while WALL_THICKNESS keeps owning the geometry the doorway
         mask and the opening symbols are cut from. Capped at 10 for that
         reason — see MAX_SKIN_WALL_WIDTH. */
      stroke-width: var(--fp-skin-wall-width, 8);
    }
    /* A railing (issue #182) is the same line at RAILING_WEIGHT of the weight,
       so it reads as a barrier beside the walls in every skin. An explicit
       thickness is scaled inline by wallStrokeStyle instead, which wins. */
    .wall.railing {
      stroke-width: calc(var(--fp-skin-wall-width, 8) * 0.4);
    }
    /* Neon, for the skins that want it. Everyone else gets none, which costs
       nothing.

       Two things about where this sits, and both matter.

       It is *outside* the doorway mask. CSS applies filter before mask, so a
       filter on the wall itself is computed from the uncut wall: the mask then
       removes the wall body but not the outer halo, and the leftover fringe
       runs straight through every opening. The doorway cut clears
       WALL_THICKNESS + 4 (12 units, so +-6 from the centreline) while a
       drop-shadow of blur 4 reaches about +-8.5, and that difference is
       exactly what leaked. Measured on a Tron render: 35.6 luminance inside an
       opening against a 7.8 background, versus 7.8 with the filter out here.

       It is also *per wall*, not one group around the whole collection.
       Wrapping them all together would composite the strokes before filtering,
       so two walls meeting at a corner glow once instead of twice and every
       joint quietly dims. Per-wall keeps the accumulation the card has always
       had, and keeps the editor honest, since _renderWall wraps each wall the
       same way. See issue #203. */
    .fp-wall-neon {
      filter: var(--fp-skin-wall-filter, none);
    }
    /* The isometric view (issue #261). Faces take the skin's wall colour; the
       shade laid over a side is what makes a box read as a box; a furniture
       block keeps the paper on top so its glyph still reads. Wall faces pass
       taps through; opening panels and furniture keep their own actions. */
    .fp-iso-wall polygon, .fp-iso-railing polygon, .fp-iso-sill polygon { stroke: none; }
    /* Everything standing in the wall plane fades together. A closed door leaf
       left at full opacity read as a patch of wall that had refused to turn
       transparent, which is what it looks like from the front (issue #261
       review). Glazed panels keep their own glass alpha instead. */
    .fp-iso-wall, .fp-iso-railing, .fp-iso-sill, .fp-iso-panel:not(.fp-iso-glazed) {
      opacity: var(--fp-wall-opacity, 1);
    }
    .fp-iso-panel {
      pointer-events: none;
      fill: var(--fp-iso-color, var(--fp-skin-wall, var(--primary-text-color, #212121)));
      stroke: var(--fp-iso-color, var(--fp-skin-wall, var(--primary-text-color, #212121)));
      stroke-width: 1;
      stroke-linejoin: round;
    }
    .fp-iso-glazed {
      fill: #8ec5ff;
      fill-opacity: 0.35;
    }
    .fp-iso-opening-hit {
      pointer-events: none;
      fill: transparent;
      stroke: none;
    }
    .fp-iso-opening-button { cursor: pointer; }
    .fp-iso-opening-button > polygon { pointer-events: auto; }
    .fp-iso-opening-button:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); }
    .fp-iso-face {
      fill: var(--fp-skin-wall, var(--primary-text-color, #212121));
      stroke: var(--fp-skin-wall, var(--primary-text-color, #212121));
      stroke-width: 0.6;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .fp-iso-furniture .fp-iso-face {
      fill: var(--fp-iso-color, var(--fp-skin-furniture, #9e9e9e));
      stroke: var(--fp-iso-color, var(--fp-skin-furniture, #9e9e9e));
    }
    .fp-iso-furniture .fp-iso-top {
      fill: var(--fp-skin-bg, var(--card-background-color, #fff));
    }
    .fp-iso-shade {
      fill: #000;
      /* Stroked in its own colour, like the face under it: two pieces of one
         wall meet edge to edge, and without this each anti-aliased edge shows
         through the other as a hairline. */
      stroke: #000;
      stroke-width: 0.6;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .fp-iso-glass {
      fill: #8ec5ff;
      fill-opacity: 0.35;
      stroke: var(--fp-skin-wall, var(--primary-text-color, #212121));
      stroke-width: 0.6;
      pointer-events: none;
    }
    /* Dead-space hatching (issue #88). It spans whole regions of the plan, so
       without this it swallows every tap inside one — and a sealed region is
       exactly where a tappable door might sit on the boundary. Same lesson as
       the light pools below (#108). */
    .fp-dead-space {
      pointer-events: none;
    }
    /* Sun dimming (issue #113): decoration, never a pointer target. The
       transition matters — HA steps the sun elevation every ~30s, and without
       it dusk arrives as a series of visible jumps rather than a fade. */
    .fp-sun-dim {
      pointer-events: none;
      transition: opacity 2s linear;
    }
    @media (prefers-reduced-motion: reduce) {
      .fp-sun-dim { transition: none; }
    }
    /* Light pools (issue #6). "isolation" gives the layer its own compositing
       group, so the pools blend with each other but not with the plan beneath
       — screening against a light theme's white background would wash them
       out entirely. Inside that group "screen" makes overlapping lights add,
       so two lamps brighten where they meet instead of the topmost winning. */
    .fp-glows {
      isolation: isolate;
      /* Light is decoration and must never take a click: these are filled
         circles drawn over the plan, so without this they swallow every tap
         inside the pool — devices stop responding under a lit lamp, and in
         the editor whole rooms become unselectable (issue #108). */
      pointer-events: none;
    }
    .fp-glow {
      mix-blend-mode: screen;
      /* Follow the light rather than snapping: a dimmer ramp reads as a ramp. */
      transition: opacity 0.4s ease;
    }
    @media (prefers-reduced-motion: reduce) {
      .fp-glow {
        transition: none;
      }
    }
    /* An LED strip's run (issue #298): thin and round-ended, so it never reads
       as a wall. Dashed while off, the light's own colour while on. */
    .fp-strip {
      stroke: var(--secondary-text-color, #888);
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 2 5;
      opacity: 0.7;
      pointer-events: none;
    }
    .fp-strip.on {
      stroke-dasharray: none;
      opacity: 1;
    }
    .fp-door-leaf,
    .fp-leaf-r {
      transform-box: fill-box;
      transition: transform 0.5s ease;
    }
    .fp-door-leaf {
      transform-origin: left center;
    }
    .fp-leaf-r {
      transform-origin: right center;
    }
    .fp-door-leaf rect,
    .fp-leaf-r rect {
      transition: fill 0.5s ease;
    }
    .fp-door-arc {
      transition: stroke-dashoffset 0.5s ease, stroke 0.5s ease;
    }
    .fp-opening {
      cursor: pointer;
    }
    .fp-opening-hit {
      fill: transparent;
      pointer-events: all;
    }
    /* Shutter badge (issue #74 follow-up): screen-sized, so it stays legible
       whatever canvas units the plan is drawn in — the same reason device
       badges are sized in pixels. Sits in the .items overlay, which is
       pointer-events:none, so it takes its own back. */
    .shutter-mark {
      position: absolute;
      /* transform is set inline: the pixel push along the wall normal. */
      pointer-events: auto;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      /* width/height are inline: they follow overlayScale (#148). */
      border-radius: 50%;
      background: var(--fp-skin-paper, var(--card-background-color, #fff));
      border: 1px solid var(--fp-skin-wall, var(--primary-text-color, #212121));
      color: var(--fp-skin-wall, var(--primary-text-color, #212121));
      opacity: 0.75;
      transition: color 0.3s ease, opacity 0.3s ease, border-color 0.3s ease;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      user-select: none;
    }
    /* Open: the accent, said twice — the glyph is already the "open" half of
       HA's icon pair, and the colour repeats it for a glance across the room. */
    .shutter-mark.on {
      color: var(--fp-active, var(--fp-skin-accent, var(--primary-color, #03a9f4)));
      border-color: var(--fp-active, var(--fp-skin-accent, var(--primary-color, #03a9f4)));
      opacity: 1;
    }
    .shutter-mark ha-icon {
      /* --mdc-icon-size is inline, for the same reason. */
      display: flex;
    }
    .fp-slide-panel {
      transform-box: fill-box;
      transition: transform 0.5s ease;
    }
    .fp-slide-panel rect {
      transition: fill 0.5s ease;
    }
    /* Roll-up curtain (garage / roller shutter): thins onto the track line. */
    .fp-roll-curtain {
      transform-box: fill-box;
      transform-origin: center;
      transition: transform 0.5s ease;
    }
    .fp-roll-curtain rect {
      transition: fill 0.5s ease;
    }
    .items {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    /* A device's hit area is what you can *see* of it — the badge and its
       label — not the box its decoration happens to fill.

       A presence ripple is 80–110px of mostly empty air, and the anchor grew
       to hold it: a 30px motion icon behaved like a 110px square button, which
       also swallowed taps meant for the plan underneath it. The ring is
       decoration; it says "presence here", it is not a control. So the anchor
       stops taking pointer events and the parts that are the device take them
       back. */
    .item {
      position: absolute;
      /* Counter-scaled against the zoom-to-room transform (--fp-inv-zoom,
         set on .items) so a badge stays a constant, legible screen size
         instead of ballooning with the room it's tapped into. Same duration
         and easing as .plan-zoom's own transition, so the zoom and its
         counter-scale animate in lockstep — without this the custom property
         changes in a single frame while the plan takes 0.4s to catch up, and
         every badge is briefly the wrong size mid-transition. */
      transform: translate(-50%, -50%) scale(var(--fp-inv-zoom, 1));
      transition: transform 0.4s ease;
      pointer-events: none;
      /* Not a hand: a device with nothing bound, or tap_action set to none,
         is not a button (issue #134). Only .interactive gets the pointer. */
      cursor: default;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .item .badge,
    .item .label {
      pointer-events: auto;
    }
    /* .stack-icon spans the whole ripple (inset: 0), so it has to stay out of
       the way too — the badge inside it is the target, not its wrapper. */
    .stack-icon,
    .ripple,
    .press-ink {
      pointer-events: none;
    }
    /* A ripple-only device draws no badge, so its centre has to answer for it,
       or switching the badge off would leave the device unclickable. The dot
       is 8px across; this gives it a real touch target without drawing one.
       Deliberately a fixed size, and not scaled by overlayScale (#148): a
       minimum touch target is about fingers, which do not shrink with the
       plan. */
    .item.interactive .ripple .dot {
      pointer-events: auto;
      position: relative;
    }
    .item.interactive .ripple .dot::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${vt}px;
      height: ${vt}px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
    }
    .item.interactive {
      cursor: pointer;
      /* Stops the long-press magnifier / text selection on touch from firing
         over a device you are only trying to press. */
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      user-select: none;
    }

    /* ---- Press feedback (issue #134) -------------------------------------
       Chosen plan-wide; the stage carries press-scale / press-ripple /
       press-flash / press-none and each rule below is scoped to its own.
       Only .interactive devices respond, so nothing animates that would not
       then do something. */

    /* Scale: the transform has to repeat the translate, since .item is
       centred on its own anchor and a bare scale() would drop that and jump
       the device down-right by half its size. Also has to repeat the
       zoom-to-room counter-scale (--fp-inv-zoom) and multiply rather than
       replace it — restating scale(${mr}) alone would drop the
       counter-scale along with the translate, and a badge held down at 4x
       zoom would balloon to roughly 4x its resting size instead of shrinking. */
    .press-scale .item.interactive {
      transition: transform ${yr}ms cubic-bezier(0.2, 0.8, 0.3, 1);
    }
    .press-scale .item.interactive:active {
      transform: translate(-50%, -50%) scale(calc(var(--fp-inv-zoom, 1) * ${mr}));
      transition-duration: ${gr}ms;
    }

    /* Flash: drop-shadow rather than a box-shadow or a background, so the halo
       follows whatever the device actually draws — the badge's circle, a bare
       ripple ring, the label — instead of a rectangle around it. */
    .press-flash .item.interactive {
      transition: filter ${yr}ms ease-out;
    }
    .press-flash .item.interactive:active {
      filter: drop-shadow(0 0 5px var(--fp-skin-accent, var(--primary-color, #03a9f4)));
      transition-duration: ${gr}ms;
    }

    /* Ink: a circle spreading from the touch point. Positioned by
       _startInk, which is the only thing that knows where the finger landed. */
    .press-ink {
      position: absolute;
      left: var(--fp-ink-x, 50%);
      top: var(--fp-ink-y, 50%);
      width: 0;
      height: 0;
      border-radius: 50%;
      /* Decoration: it must never swallow the tap it is reporting. */
      pointer-events: none;
      opacity: 0;
      background: currentColor;
    }
    .press-ink.inking {
      animation: fp-press-ink 520ms ease-out;
    }
    @keyframes fp-press-ink {
      from {
        width: 0;
        height: 0;
        margin: 0;
        opacity: 0.32;
      }
      to {
        width: 120px;
        height: 120px;
        margin: -60px 0 0 -60px;
        opacity: 0;
      }
    }

    /* Reduced motion keeps the feedback and drops the movement: the halo, with
       no transition. Removing the effect outright would answer an
       accessibility preference by taking the affordance away. */
    @media (prefers-reduced-motion: reduce) {
      .press-scale .item.interactive,
      .press-flash .item.interactive,
      .press-ripple .item.interactive {
        transition: none;
      }
      .press-scale .item.interactive:active {
        transform: translate(-50%, -50%) scale(var(--fp-inv-zoom, 1));
      }
      .press-scale .item.interactive:active,
      .press-ripple .item.interactive:active,
      .press-flash .item.interactive:active {
        filter: drop-shadow(0 0 5px var(--fp-skin-accent, var(--primary-color, #03a9f4)));
      }
      .press-ink.inking {
        animation: none;
      }
    }
    /*
     * The item's x/y anchors its icon, not its icon-plus-label. Were the label
     * in flow, it would make the column taller and the translate would
     * push the icon up by half the label's height -- so an item showing state
     * would sit higher than a bare one beside it, at the same y. The label hangs
     * below instead, out of flow, and every icon lands on its own y.
     */
    .item > .label {
      position: absolute;
      top: calc(100% + 2px);
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    /* Label beside the badge instead of under it (issue #180). A reading under
       a badge grows in both directions at once and meets whatever is next to
       it; hung off one side it grows one way, which is what a row of devices
       along a wall needs.

       Vertically centred on the badge rather than baseline-aligned with it:
       the label is one line and the badge is a circle, so centres are what the
       eye actually pairs up. A label-only device sits beside an empty
       .badge-space instead (issue #308), so turning the badge off does not
       move the label or change which way it grows. */
    .item > .label.label-left,
    .item > .label.label-right {
      top: 50%;
      transform: translateY(-50%);
    }
    .item > .label.label-left {
      left: auto;
      right: calc(100% + 4px);
    }
    .item > .label.label-right {
      left: calc(100% + 4px);
    }
    /* The badge's footprint with nothing in it: same box, border included, so
       a side label lands where it would beside a drawn badge. Not a tap
       target — it inherits the item's pointer-events: none. */
    .badge-space {
      border: var(--fp-skin-badge-border-width, 1.5px) solid transparent;
    }
    /* Label-only items (showIcon: false) labelled below have no badge to hang
       under, so the absolute label would drop to y + 2px on a zero-height
       item. Put it back in flow so it becomes the item's box and centers on
       (x, y) as before. */
    .label.inflow {
      position: static;
      transform: none;
    }
    .badge {
      position: relative; /* anchors the offline mark (issue #162) */
      width: 34px;
      height: 34px;
      border-radius: var(--fp-skin-badge-radius, 50%);
      background: var(--fp-skin-badge-bg, var(--card-background-color, #fff));
      border: var(--fp-skin-badge-border-width, 1.5px) solid
        var(--fp-skin-badge-border, var(--divider-color, #ccc));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--fp-skin-text, var(--primary-text-color));
      box-shadow: var(--fp-skin-badge-shadow, 0 1px 3px rgba(0, 0, 0, 0.2));
    }
    /* The reading standing in for the icon (issue #106). Inherits the badge's
       text color, so every rule that recolours a badge — active, --fp-state —
       carries the number with it and needs no counterpart here. The negative
       tracking buys back the width a 4-glyph reading like 1.2kW needs. */
    .badge-value {
      font-weight: 600;
      line-height: 1;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    /*
     * --fp-active is the item's own activeColor (issue #79) when it sets one;
     * otherwise this falls through to the theme's active color, which is
     * exactly what every badge used before the option existed.
     */
    .item.on .badge {
      background: var(--fp-active, var(--fp-skin-active, var(--state-light-active-color, var(--state-active-color, #fdd835))));
      border-color: var(--fp-active, var(--fp-skin-active, var(--state-light-active-color, var(--state-active-color, #fdd835))));
      /* --fp-ink is contrastText's answer for a colour we could read; when the
         active colour came from the skin there is no per-item colour to read,
         so the skin states its own ink. A pastel badge under a dark Home
         Assistant theme would otherwise take that theme's near-white text. */
      color: var(--fp-ink, var(--fp-skin-active-ink, var(--text-primary-color, #212121)));
    }
    /* The off colour (issue #228). Its own class rather than a var() fallback
       on the base .badge rule, so a plan that never sets one emits nothing new
       and looks exactly as it did. Declared before .state-colored, which still
       wins — a threshold rule is the more specific statement. */
    .item.inactive-colored .badge {
      background: var(--fp-inactive);
      border-color: var(--fp-inactive);
      color: var(--fp-ink, var(--text-primary-color, #212121));
    }
    /* A resolved state colour paints the badge whatever the on/off state —
       thresholds exist for sensors, which are never "on". Declared *after* the
       .on rule (equal specificity) so state rules win over the active colour. */
    .item.state-colored .badge {
      background: var(--fp-state);
      border-color: var(--fp-state);
      color: var(--fp-ink, var(--text-primary-color, #212121));
    }

    /* ---- Offline devices (issue #162) ------------------------------------
       Until now a device whose entity had dropped out was drawn exactly like
       one that is simply switched off — a dead bulb and a bulb someone turned
       off were the same picture, and the plan gave that answer confidently.
       Chosen plan-wide, so the stage carries offline-dim / offline-strike /
       offline-none, exactly as it carries the press effect.

       Nothing here recolours the badge, and nothing needs to: an offline
       entity is never entityIsActive, so it has already fallen back to the
       resting badge. What is added is the *fading*, which says "we have no
       reading" rather than "the reading is off".

       That "already fallen back" is load-bearing, and issue #228 is the first
       thing that could have broken it: inactiveColor paints on exactly the
       not-active test an offline entity also fails. It is gated on this one
       too, in _renderItem — otherwise a dead device would be drawn in the
       loudest colour on the plan, and offline-none would make it identical to
       a device that really is shut.

       offline-none declares nothing at all, which is the point of it. */
    .offline-dim .item.offline {
      opacity: 0.45;
    }
    /* Strike sits a little brighter than a plain dim, so that the mark drawn
       across it still reads as red rather than as pink: the whole device is
       one composited group, so the mark fades with everything else. */
    .offline-strike .item.offline {
      opacity: 0.6;
    }
    /* The diagonal, drawn across the badge itself rather than the item, so it
       crosses out the icon and not the label hanging underneath. A little
       wider than the badge at each end, the way the "no" symbol overhangs. A
       device drawn as a bare ripple, or as a label with no badge at all, has
       nothing to cross and keeps the fade alone. */
    .offline-strike .item.offline .badge::after {
      content: "";
      position: absolute;
      left: -12%;
      right: -12%;
      top: 50%;
      height: 2px;
      margin-top: -1px;
      border-radius: 1px;
      /* Down to the right, the way every mdi "-off" glyph and the reporter's
         own mock-up draw it. */
      transform: rotate(45deg);
      background: var(--fp-offline-mark, var(--error-color, #db4437));
    }
    ha-icon {
      --mdc-icon-size: 22px;
    }
    /* Icon motion while the entity is active (issue #48). */
    ha-icon.anim-spin {
      animation: fp-icon-spin 2s linear infinite;
    }
    ha-icon.anim-pulse {
      animation: fp-icon-pulse 1.6s ease-in-out infinite;
    }
    @keyframes fp-icon-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes fp-icon-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      ha-icon.anim-spin,
      ha-icon.anim-pulse {
        animation: none;
      }
    }
    .label {
      /* Positioning (out-of-flow anchor + inflow fallback) lives in the
         .item > .label rules above, from #41. */
      font-size: 12px;
      line-height: 1;
      padding: 1px 4px;
      border-radius: 4px;
      background: var(--fp-skin-badge-bg, var(--card-background-color, #fff));
      color: var(--fp-skin-text, var(--primary-text-color));
      white-space: nowrap;
    }
    .text {
      position: absolute;
      pointer-events: none;
      white-space: nowrap;
      font-weight: 500;
      line-height: 1;
      /* Keeps its own counter-scale (inline, see _renderText) in step with
         .plan-zoom's transition — same reasoning as .item's transform. */
      transition: transform 0.4s ease;
    }
    .area-label {
      position: absolute;
      pointer-events: none;
      white-space: nowrap;
      transform: translate(-50%, -50%) scale(var(--fp-inv-zoom, 1));
      /* Same lockstep-with-.plan-zoom reasoning as .item and .text above. */
      transition: transform 0.4s ease;
      font-weight: 600;
      /* The default size stays a normal rule so card-mod can still override it
         — room names had no config option before overlayScale landed, and this
         selector was the only way to change them. An area's own labelSize, and
         overlayScale: plan, come through as an inline style that wins over
         this. Keep in step with DEFAULT_AREA_LABEL_SIZE. */
      font-size: ${_o}px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      line-height: 1;
      color: var(--fp-skin-text, var(--primary-text-color));
      opacity: 0.7;
      text-shadow:
        0 1px 2px var(--fp-skin-bg, var(--card-background-color, #fff)),
        0 -1px 2px var(--fp-skin-bg, var(--card-background-color, #fff));
    }
    .stack {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stack-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ripple {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ripple .ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid var(--fp-ripple-color);
      opacity: 0;

      /* Keep only the angular slice the ring should travel along */
      -webkit-mask: conic-gradient(
        from calc(var(--fp-ripple-direction) * 1deg - var(--fp-ripple-width) * 1deg / 2),
        #000 0deg,
        #000 calc(var(--fp-ripple-width) * 1deg),
        transparent calc(var(--fp-ripple-width) * 1deg)
      );
      mask: conic-gradient(
        from calc(var(--fp-ripple-direction) * 1deg - var(--fp-ripple-width) * 1deg / 2),
        #000 0deg,
        #000 calc(var(--fp-ripple-width) * 1deg),
        transparent calc(var(--fp-ripple-width) * 1deg)
      );
    }
    .ripple.active .ring {
      animation: fp-ripple 1.8s ease-out infinite;
    }
    .ripple .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--fp-ripple-color);
      opacity: 0.4;
    }
    .ripple.active .dot {
      opacity: 0.9;
    }
    @keyframes fp-ripple {
      0% {
        transform: scale(0.15);
        opacity: 0.7;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
    /* === Tracker animations (live card). The zone outline is editor-only —
       renderTracker is called with editing:false here, so only the marker /
       line and ripples render. Movement transitions on the group's transform
       so the dot/triangle glides between sensor updates rather than jumping. === */
    .tracker-marker {
      transition: transform 0.4s ease-out;
    }
    .tracker-dot {
      animation: fp-tracker-pulse 1.4s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
    .tracker-ring {
      animation: fp-tracker-ring 2.2s ease-out infinite;
      opacity: 0;
    }
    .tracker-line {
      transition: transform 0.4s ease-out;
    }
    .tracker-line-stroke {
      opacity: 0.45;
      animation: fp-tracker-pulse 1.6s ease-in-out infinite;
    }
    .tracker-band {
      opacity: 0;
      animation: fp-tracker-band 2.2s ease-out infinite;
    }
    @keyframes fp-tracker-pulse {
      0%,
      100% {
        transform: scale(0.9);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
    }
    @keyframes fp-tracker-ring {
      0% {
        r: 0;
        opacity: 0.7;
      }
      100% {
        r: var(--fp-tracker-ring-max, 60px);
        opacity: 0;
      }
    }
    @keyframes fp-tracker-band {
      0% {
        opacity: 0.5;
        stroke-width: 1.5;
      }
      100% {
        opacity: 0;
        stroke-width: 14;
      }
    }
  `,
  Py,
  Dy
];
Xe([
  G({ attribute: !1 })
], ge.prototype, "hass", 2);
Xe([
  F()
], ge.prototype, "_config", 2);
Xe([
  F()
], ge.prototype, "_activeFloorId", 2);
Xe([
  F()
], ge.prototype, "_zoomedAreaId", 2);
Xe([
  F()
], ge.prototype, "_viewOverride", 2);
Xe([
  F()
], ge.prototype, "_appearanceOverride", 2);
Xe([
  F()
], ge.prototype, "_portrait", 2);
ge = Xe([
  rn("easy-floorplan-card")
], ge);
const Ma = [
  { id: "plan", label: "Plan", hint: "Canvas, floors and background image", groups: ["Project", "Floor image", "Floor switcher"] },
  { id: "colors", label: "Style", hint: "Colors, theme and named colors", groups: ["Look", "Named colors"] },
  { id: "view", label: "View", hint: "Display, scale and 3D", groups: ["Display"] },
  { id: "lighting", label: "Lighting", groups: ["Sunlight", "Night dimming"] },
  { id: "devices", label: "Devices", hint: "Device behavior", groups: ["Devices"] },
  { id: "symbols", label: "Symbols", hint: "Symbol library", groups: ["Symbols"] }
], et = { id: "properties", label: "Properties", groups: [] }, bi = { id: "actions", label: "Actions", groups: ["Behavior"] }, vi = {
  furniture: [et, { id: "sensor", label: "Sensors", hint: "Sensor and state colors", groups: ["What it reads", "Color"] }, bi],
  opening: [
    et,
    { id: "sensors", label: "Sensors", hint: "Sensors and shutter", groups: ["What it reads", "Shutter"] },
    { id: "appearance", label: "Style", hint: "Style and sunlight", groups: ["Badge", "Color", "Sunlight"] },
    bi
  ],
  item: [
    et,
    { id: "readings", label: "Readings", groups: ["What it reads"] },
    { id: "appearance", label: "Style", hint: "Labels, badges, colors and effects", groups: ["Label", "Badge", "Color", "Effects"] },
    bi,
    { id: "visibility", label: "Visibility", groups: ["Visibility"] }
  ],
  area: [et, { id: "sensor", label: "Sensors", hint: "Sensors and room devices", groups: ["What it reads", "Color", "Home Assistant area"] }, bi],
  tracker: [
    et,
    { id: "sensors", label: "Sensors", groups: ["Sensors"] },
    { id: "marker", label: "Marker", groups: ["Marker"] }
  ],
  text: [et],
  wall: [et]
}, wb = Re`
  :host { display: block; min-width: 0; }
  .editor {
    --editor-ink: var(--primary-text-color, #24323d);
    --editor-muted: var(--secondary-text-color, #586772);
    --editor-paper: var(--card-background-color, #fff);
    --editor-ground: var(--secondary-background-color, #f3f5f7);
    --editor-line: var(--divider-color, #dfe5e9);
    --editor-accent: var(--primary-color, #00897b);
    container: workspace / inline-size;
    display: flex;
    flex-direction: column;
    gap: 0;
    color: var(--editor-ink);
    background: var(--editor-paper);
    border: 1px solid var(--editor-line);
    border-radius: 12px;
    font: inherit;
    font-size: 14px;
  }
  button, input, select { font: inherit; }
  button {
    min-height: 34px;
    text-transform: none;
    transition: background-color 120ms, border-color 120ms;
  }
  button:hover:not(:disabled) { background: var(--editor-ground); }
  button:focus-visible, input:focus-visible, select:focus-visible {
    outline: 2px solid var(--editor-accent);
    outline-offset: 2px;
  }
  button.active, button.active:hover {
    color: var(--editor-accent);
    background: color-mix(in srgb, var(--editor-accent) 12%, var(--editor-paper));
    border-color: color-mix(in srgb, var(--editor-accent) 35%, var(--editor-line));
  }
  .toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 9px 12px;
    border-bottom: 1px solid var(--editor-line);
    flex: none;
  }
  .editor-brand { display: flex; flex: 1; align-items: center; gap: 8px; min-width: 0; margin-right: auto; }
  .editor-brand > ha-icon { --mdc-icon-size: 22px; color: var(--editor-accent); flex: none; }
  .editor-brand strong { font-size: 14px; font-weight: 600; max-width: 30ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .toolbar .project-settings { padding: 5px; border-color: transparent; color: var(--editor-muted); flex: none; }
  .tool-compact { display: none; }
  .toolbar .apply-error { flex-basis: 100%; font-size: 12px; color: var(--error-color, #c62828); }
  .toolbar { position: relative; }
  .toolbar > .pop-wrap { position: static; }
  .toolbar .add-pop { left: auto; right: 8px; top: calc(100% + 4px); width: min(360px, calc(100% - 16px)); min-width: 0; box-sizing: border-box; display: flex; flex-direction: column; max-height: max(120px, calc(100dvh - 170px)); overflow: auto; }
  .editor.fullscreen .toolbar .add-pop { max-height: max(120px, calc(100dvh - 126px)); }
  .add-shortcuts { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; flex: none; }
  .add-pop .furn-search { flex: none; }
  .toolbar .add-entry { justify-content: flex-start; }
  .toolbar .furn-cell { padding: 7px 3px; font-size: 12px; min-height: 70px; justify-content: flex-start; }
  .furn-cell svg { flex-shrink: 0; }
  .add-furn-scroll { scrollbar-width: thin; min-height: 0; }
  .floors .pop { left: 0; right: auto; }
  .toolbar button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 11px; }
  .toolbar button ha-icon { --mdc-icon-size: 18px; }
  .toolbar .apply-btn, .toolbar .apply-btn:hover {
    background: var(--editor-accent);
    border-color: var(--editor-accent);
    color: var(--text-primary-color, #fff);
  }
  .workspace { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0; min-width: 0; height: clamp(360px, calc(100dvh - 210px), 780px); overflow: hidden; border-radius: 0 0 12px 12px; }
  .tool-rail {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 4px;
    padding: 8px;
    border-bottom: 1px solid var(--editor-line);
    min-width: 0;
    scrollbar-width: thin;
  }
  .tool-rail button {
    display: flex;
    flex: 1 0 58px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 52px;
    padding: 8px 4px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 11px;
    color: var(--editor-muted);
    background: transparent;
  }
  .tool-rail ha-icon { --mdc-icon-size: 21px; }
  .tool-rail button.active {
    color: var(--editor-accent);
    background: color-mix(in srgb, var(--editor-accent) 12%, var(--editor-paper));
    border-color: color-mix(in srgb, var(--editor-accent) 25%, var(--editor-line));
  }
  .canvas-column { min-width: 0; display: flex; flex-direction: column; background: var(--editor-ground); }
  .canvas-heading { display: flex; align-items: center; gap: 10px; padding: 6px 12px; background: var(--editor-paper); border-bottom: 1px solid var(--editor-line); }
  .canvas-heading .spacer { flex: 1; }
  .canvas-heading .icon-btn { display: flex; align-items: center; gap: 6px; color: var(--editor-muted); border-color: transparent; }
  .canvas-heading ha-icon { --mdc-icon-size: 18px; }
  .floors { min-width: 0; gap: 6px; }
  .floors > ha-icon { color: var(--editor-muted); }
  .floors > label { display: none; }
  .floors select { max-width: 180px; min-width: 60px; font-weight: 600; border-color: transparent; background: transparent; }
  .floors > button { display: inline-flex; align-items: center; justify-content: center; width: 30px; padding: 5px; border-color: transparent; }
  .canvas-outer { padding: 12px; min-width: 0; flex: 1; min-height: 0; display: flex; flex-direction: column; }
  .canvas-wrap { width: 100%; box-sizing: border-box; min-width: 0; border-radius: 4px; border-color: var(--editor-line); flex: 1; height: auto; min-height: 0; resize: none; max-height: none; aspect-ratio: auto !important; background: var(--editor-ground); }
  .stage { box-shadow: 0 1px 6px #0000000a; }
  .grid { stroke-opacity: .11; }
  .zoom-overlay { right: 22px; bottom: 22px; gap: 0; padding: 3px; background: var(--editor-paper); border: 1px solid var(--editor-line); border-radius: 8px; box-shadow: 0 3px 10px #0000000d; }
  .zoom-overlay button { border: 0; min-height: 30px; gap: 4px; background: transparent; }
  .zoom-overlay button:hover { background: var(--editor-ground); }
  .zoom-overlay ha-icon { --mdc-icon-size: 17px; }
  .context-bar { margin: 0; padding: 7px 12px; gap: 8px; background: var(--editor-paper); border: 0; border-top: 1px solid var(--editor-line); border-radius: 0; }
  .context-bar .ctx-label { border: 0; padding: 0; text-transform: none; letter-spacing: 0; font-size: 12px; }
  .context-bar .ctx-hint { font-size: 12px; line-height: 1.5; }
  .context-bar > .snap-hint { flex: 1 1 100%; text-align: right; }
  .context-bar .ctx-divider { margin-left: auto; }
  .context-bar button { font-size: 12px; min-height: 32px; padding: 4px 8px; }
  .snap-control { display: flex; align-items: center; gap: 6px; color: var(--editor-muted); font-size: 12px; white-space: nowrap; }
  .snap-control select { min-height: 30px; padding: 3px 6px; border: 1px solid var(--editor-line); border-radius: 6px; color: var(--editor-ink); background: var(--editor-paper); }
  .ctx-count { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .context-bar .ctx-label { display: none; }
  .side { display: flex; flex-direction: column; min-width: 0; gap: 0; border-top: 1px solid var(--editor-line); background: var(--editor-paper); }
  .inspector-heading { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 0 16px; border-bottom: 1px solid var(--editor-line); }
  .inspector-tabs { display: flex; gap: 12px; }
  .inspector-tabs button { min-height: 42px; padding: 10px 2px; border: 0; border-radius: 0; border-bottom: 2px solid transparent; color: var(--editor-muted); background: transparent; font-weight: 600; }
  .inspector-tabs button[aria-selected="true"] { color: var(--editor-accent); border-bottom-color: var(--editor-accent); }
  .inspector-tabs button:hover { color: var(--editor-accent); background: transparent; }
  .canvas-jump, .preview-toggle { min-height: 44px; padding: 5px; border: 0; color: var(--editor-accent); font-size: 12px; }
  .preview-toggle { margin-left: auto; }
  .context-bar .inspector-jump { color: var(--editor-accent); margin-left: auto; }
  .edit-area, .panel { border: 0; border-radius: 0; padding: 16px; }
  .panel { border: 0; }
  .panel-body { margin-top: 0; }
  .side .rows { display: flex; flex-direction: column; gap: 0; }
  .side .rows > * { width: 100%; box-sizing: border-box; }
  .edit-head { display: grid; grid-template-columns: 28px minmax(0, 1fr) repeat(3, 32px); gap: 4px; padding-bottom: 14px; margin: 0; }
  .edit-head .head-spacer { display: none; }
  .edit-head .edit-title { font-size: 14px; white-space: normal; line-height: 1.4; }
  .selection-symbol { position: static; display: block; width: 28px; height: 32px; color: var(--editor-ink); }
  .edit-head button { min-height: 30px; padding: 5px; justify-content: center; border-color: transparent; }
  .cfg-group { width: 100%; margin: 0; padding: 16px 0 0; border: 0; }
  .cfg-group + .cfg-group { border-top: 1px solid var(--editor-line); margin-top: 12px; }
  .cfg-group-title { min-height: 0; margin: 0 0 14px; padding: 0; font-size: 14px; font-weight: 600; letter-spacing: 0; color: var(--editor-ink); }
  .settings-category { position: sticky; top: 43px; z-index: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; margin: 0 0 16px; padding: 6px 0; background: var(--editor-paper); border-bottom: 1px solid var(--editor-line); }
  .settings-category.two-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .settings-category > button { min-width: 0; min-height: 36px; padding: 7px 4px; color: var(--editor-muted); background: transparent; border: 1px solid transparent; border-radius: 6px; font-size: 13px; font-weight: 500; }
  .settings-category > button[aria-selected="true"] { color: var(--editor-accent); background: color-mix(in srgb, var(--editor-accent) 10%, var(--editor-paper)); border-color: color-mix(in srgb, var(--editor-accent) 25%, var(--editor-line)); font-weight: 600; }
  .side .row { gap: 8px; margin-bottom: 12px; }
  .side .row label { font-size: 13px; flex-basis: 94px; color: var(--editor-ink); }
  .side .row.col > label { flex-basis: auto; }
  .side .row input[type="text"], .side .row input[type="number"], .side .row select { min-height: 38px; box-sizing: border-box; padding: 7px 9px; border-radius: 6px; border-color: var(--editor-line); font-size: 14px; }
  .side .row input.num { flex: 1; width: 0; }
  .side .row input[type="range"] { flex: 1; width: 0; min-width: 0; accent-color: var(--editor-accent); }
  .side .row input[type="range"] + input.num { flex: 0 0 62px; min-width: 62px; }
  .side .hint { font-size: 12px; line-height: 1.6; }
  .inspector-empty { padding: 24px 8px 30px; display: grid; justify-items: center; text-align: center; }
  .inspector-empty > ha-icon { --mdc-icon-size: 30px; padding: 14px; background: var(--editor-ground); border-radius: 14px; color: var(--editor-muted); margin-bottom: 16px; }
  .inspector-empty strong { font-size: 14px; font-weight: 600; }
  .inspector-empty p { color: var(--editor-muted); line-height: 1.7; margin: 8px 0 16px; max-width: 26ch; }
  .inspector-empty span { color: var(--editor-muted); font-size: 11px; }
  /* The popover top layer escapes HA's transformed edit dialog. */
  .editor.fullscreen {
    position: fixed;
    inset: var(--editor-viewport-top, 0px) 0 auto;
    z-index: 100;
    width: auto;
    height: var(--editor-viewport-height, 100dvh);
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
  .editor.fullscreen .workspace { flex: 1; min-height: 0; height: auto; border-radius: 0; }
  .canvas-column { min-height: 0; }
  .side { min-height: 0; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; }
  .inspector-heading { position: sticky; top: 0; background: var(--editor-paper); z-index: 2; flex: none; }
  .essential-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 16px; }
  .essential-field { min-width: 0; }
  .essential-field.full { grid-column: 1 / -1; }
  .essential-field .row { display: flex; flex-direction: column; align-items: stretch; gap: 6px; margin: 0; }
  .essential-field .row label { flex: none; }
  .essential-field .row input.num, .essential-field .row input[type="text"], .essential-field .row select { width: 100%; min-width: 0; flex: none; }
  .essential-field .row:has(input[type="checkbox"]) { flex-direction: row; align-items: center; justify-content: space-between; min-height: 30px; }
  .essential-field .row input[type="checkbox"] { accent-color: var(--editor-accent); }
  .essential-field ha-form { display: block; min-width: 0; }
  .essential-properties > .row { flex-wrap: wrap; }
  .essential-properties > .row > label { flex-basis: 100%; }
  .essential-properties > .row input[type="text"] { flex: 1; min-width: 0; }
  .secondary-property { border-top: 1px solid var(--editor-line); padding-top: 16px; margin-top: 4px; }
  .secondary-property .essential-fields { margin-bottom: 0; }
  @container workspace (min-width: 760px) {
    .workspace {
      grid-template-columns: minmax(0, 1fr) 280px;
      grid-template-rows: minmax(0, 1fr);
      height: clamp(520px, 72dvh, 880px);
    }
    .tool-rail { display: none; }
    .side { border-top: 0; border-left: 1px solid var(--editor-line); }
    .inspector-jump, .canvas-jump, .preview-toggle { display: none; }
    .context-bar > .ctx-hint { flex: 1 1 140px; }
  }
  @container workspace (min-width: 1000px) {
    .workspace { grid-template-columns: 72px minmax(0, 1fr) 316px; grid-template-rows: minmax(0, 1fr); }
    .tool-rail { grid-column: auto; display: flex; flex-direction: column; padding: 6px; border-bottom: 0; border-right: 1px solid var(--editor-line); overflow-y: auto; overflow-x: hidden; }
    .tool-rail button { flex: 0 0 auto; min-height: 54px; padding: 6px 2px; font-size: 12px; gap: 4px; }
  }
  @container workspace (max-width: 999px) {
    .toolbar { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; padding: 8px; gap: 6px; }
    .editor-brand { grid-column: 1 / 3; grid-row: 1; margin: 0; }
    .editor-brand strong { max-width: none; }
    .toolbar .expand-toggle { grid-column: 3; grid-row: 1; }
    .toolbar .apply-btn { grid-column: 4; grid-row: 1; }
    .toolbar .history { grid-column: 1; grid-row: 2; gap: 2px; }
    .toolbar button { min-height: 40px; padding: 7px 9px; }
    .toolbar .project-settings { padding: 3px; min-height: 36px; }
    .toolbar .history button { padding: 7px; border-color: transparent; }
    .tool-compact { display: flex; align-items: center; grid-column: 2 / 4; grid-row: 2; gap: 8px; padding: 0 10px; min-width: 0; border: 1px solid var(--editor-line); border-radius: 6px; color: var(--editor-accent); background: color-mix(in srgb, var(--editor-accent) 5%, var(--editor-paper)); }
    .tool-compact ha-icon { --mdc-icon-size: 18px; flex: none; }
    .tool-compact select { flex: 1; width: 0; min-width: 0; min-height: 40px; padding: 4px 0; font-weight: 600; color: var(--editor-ink); background: transparent; border: 0; }
    .toolbar .insert-menu { grid-column: 4; grid-row: 2; }
    .toolbar .insert-menu > button { width: 100%; }
    .toolbar .apply-error { grid-column: 1 / -1; }
    .toolbar .add-pop { left: 8px; right: 8px; top: calc(100% + 4px); width: auto; min-width: 0; }
    .add-furn-scroll { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .tool-rail { display: none; }
    .canvas-heading { padding: 4px 8px; min-height: 40px; }
    .floors select { max-width: 150px; min-height: 40px; }
    .floors > button { min-height: 40px; width: 34px; }
    .canvas-heading .icon-btn { min-height: 40px; }
    .canvas-outer { padding: 8px; }
    .zoom-overlay { right: 16px; bottom: 16px; }
    .zoom-overlay button { min-height: 36px; }
    .context-bar { padding: 8px; gap: 6px; }
    .context-bar > .ctx-hint { flex: 1 1 160px; }
    .context-bar .ctx-divider { display: none; }
    .context-bar .ctx-count { flex: 1 1 100px; }
    .context-bar .inspector-jump { min-height: 40px; font-size: 12px; padding: 5px 10px; border-color: var(--editor-line); }
    .snap-control { margin-left: auto; }
    .snap-control select { min-height: 36px; }
    .side .row { flex-wrap: wrap; }
    .side .row label { flex-basis: 82px; }
    .side .row input[type="text"], .side .row input[type="number"], .side .row select { min-height: 40px; }
    .essential-field .row label { flex-basis: auto; }
    .essential-properties > .row > label { flex-basis: 100%; }
    .edit-head { grid-template-columns: 20px minmax(0, 1fr) repeat(3, 36px); }
    .edit-head button { min-height: 40px; }
  }
  @container workspace (max-width: 399px) {
    .expand-label, .floors > ha-icon { display: none; }
    .toolbar .expand-toggle { padding: 7px; }
    .editor-brand > ha-icon { display: none; }
    .floors select { max-width: 115px; }
  }
  @container workspace (max-width: 339px) {
    .tool-compact ha-icon { display: none; }
    .tool-compact { padding: 0 4px; }
    .canvas-heading .icon-btn { font-size: 0; gap: 0; width: 44px; padding: 5px; }
  }
  @container workspace (min-width: 600px) and (max-width: 999px) {
    .toolbar { display: flex; flex-wrap: nowrap; }
    .editor-brand > ha-icon { display: none; }
    .editor-brand strong { max-width: 14ch; }
    .toolbar .history, .toolbar .insert-menu, .toolbar .expand-toggle, .toolbar .apply-btn { flex-shrink: 0; }
    .tool-compact { flex: 0 1 140px; }
    .editor.fullscreen .toolbar .add-pop { max-height: calc(100dvh - 70px); }
  }
  @container workspace (max-width: 759px) {
    .toolbar button, .tool-compact select, .canvas-heading button, .floors select, .zoom-overlay button, .snap-control select, .context-bar .inspector-jump { min-height: 44px; }
    .toolbar .project-settings { min-height: 44px; min-width: 40px; }
    .toolbar .history button, .toolbar .expand-toggle, .floors > button { min-width: 44px; }
    .inspector-heading { padding: 0 12px; gap: 4px; }
    .inspector-tabs { gap: 10px; }
    .inspector-tabs button { min-height: 44px; }
    .settings-category { top: 45px; margin-bottom: 12px; }
    .settings-category > button { min-height: 44px; }
    .edit-head { grid-template-columns: 28px minmax(0, 1fr) repeat(3, 44px); }
    .edit-head button { min-height: 44px; }
    .side .row input[type="text"], .side .row input[type="number"], .side .row select { min-height: 44px; font-size: 16px; }
    .side .row label, .side .hint { font-size: 13px; }
    .side { display: none; border-top: 1px solid var(--editor-line); }
    .show-inspector .workspace { grid-template-rows: minmax(130px, .28fr) minmax(200px, .72fr); }
    .show-inspector .side { display: flex; }
    .show-inspector .canvas-heading, .show-inspector .context-bar { display: none; }
    .show-inspector .canvas-outer { padding: 6px; }
    .show-inspector .zoom-overlay { position: static; align-self: flex-end; margin-top: 4px; flex: none; box-shadow: none; }
    .show-inspector .zoom-overlay button { min-height: 36px; }
    .show-inspector .edit-area, .show-inspector .panel { padding-top: 10px; }
    .show-inspector .edit-head { padding-bottom: 8px; }
    .show-inspector.preview-collapsed .workspace, .show-inspector.keyboard-open .workspace { grid-template-rows: minmax(0, 1fr); }
    .show-inspector.preview-collapsed .canvas-column, .show-inspector.keyboard-open .canvas-column { display: none; }
    .keyboard-open .preview-toggle { display: none; }
    .keyboard-open:not(.fullscreen) .workspace { height: max(180px, calc(var(--editor-viewport-height, 100dvh) - 160px)); }
  }
  @media (max-height: 500px) {
    @container workspace (max-width: 759px) {
      .show-inspector:not(.preview-collapsed):not(.keyboard-open) .workspace { grid-template-rows: minmax(90px, .3fr) minmax(140px, .7fr); }
    }
    @container workspace (min-width: 600px) and (max-width: 759px) {
      .show-inspector:not(.preview-collapsed):not(.keyboard-open) .workspace { grid-template-columns: minmax(0, 1fr) 280px; grid-template-rows: minmax(0, 1fr); }
      .show-inspector .side { border-top: 0; border-left: 1px solid var(--editor-line); }
    }
  }
  @media (prefers-reduced-motion: reduce) { button { transition: none; } }
`, Ea = {
  request: (e) => requestAnimationFrame(e),
  cancel: (e) => cancelAnimationFrame(e)
};
class Aa {
  constructor(t, i) {
    this.frames = t, this.deliver = i, this._pending = null, this._hasPending = !1, this._handle = null;
  }
  /** True while a value is queued for delivery. */
  get pending() {
    return this._hasPending;
  }
  /** Queue a value, replacing any still waiting for this frame. */
  push(t) {
    this._pending = t, this._hasPending = !0, this._handle === null && (this._handle = this.frames.request(() => {
      this._handle = null, this._deliverPending();
    }));
  }
  /**
   * Deliver the newest queued value now. For the end of a gesture: pointerup
   * must land on the last position the pointer actually reported, not on
   * whatever the previous frame happened to catch.
   */
  settle() {
    this._cancelFrame(), this._deliverPending();
  }
  /** Drop anything queued without delivering it (the gesture was canceled). */
  cancel() {
    this._cancelFrame(), this._pending = null, this._hasPending = !1;
  }
  _cancelFrame() {
    this._handle !== null && (this.frames.cancel(this._handle), this._handle = null);
  }
  _deliverPending() {
    if (!this._hasPending) return;
    const t = this._pending;
    this._pending = null, this._hasPending = !1, this.deliver(t);
  }
}
const Ta = "Apply needs Home Assistant's card editor — use Save instead.", xb = "Save this card once first — it isn't on the dashboard yet.", _b = 200;
function $b(e) {
  let t = e;
  for (let i = 0; t && i < _b; i++) {
    const n = t;
    if (typeof n._params?.saveCardConfig == "function") return n;
    t = t.parentNode ?? t.host ?? null;
  }
  return null;
}
async function kb(e) {
  const t = $b(e);
  if (!t) return { ok: !1, error: Ta };
  if (t._params?.isNew) return { ok: !1, error: xb };
  const i = t._cardConfig;
  if (!i || typeof i != "object")
    return { ok: !1, error: Ta };
  try {
    await t._params.saveCardConfig(i);
  } catch (n) {
    return { ok: !1, error: `Could not save — ${n instanceof Error ? n.message : String(n)}` };
  }
  return typeof t._markDirtyStateClean == "function" ? t._markDirtyStateClean() : typeof t._dirty == "boolean" && (t._dirty = !1), { ok: !0 };
}
function Ca(e) {
  return "text" in e.selector || "number" in e.selector;
}
function Sb(e, t, i) {
  const n = {};
  for (const o of i)
    t[o.name] !== e[o.name] && (n[o.name] = t[o.name]);
  return n;
}
function Ia(e, t) {
  const i = {};
  for (const n of t) {
    if (!(n.name in e)) continue;
    let o = e[n.name];
    if ("text" in n.selector || "icon" in n.selector || "entity" in n.selector || "attribute" in n.selector)
      (o === "" || o == null) && (o = n.required ? "" : void 0);
    else if ("number" in n.selector) {
      const r = typeof o == "string" && o !== "" ? Number(o) : o;
      if (typeof r != "number" || !Number.isFinite(r)) {
        if (n.required) continue;
        o = void 0;
      } else {
        const a = n.selector.number;
        let s = n.name === "angle" ? (r % 360 + 360) % 360 : r;
        a.min !== void 0 && s < a.min && (s = a.min), a.max !== void 0 && s > a.max && (s = a.max), o = s;
      }
    } else "boolean" in n.selector && (o = !!o);
    i[n.name] = o;
  }
  return i;
}
const It = (e) => e, Pa = ["binary_sensor", "cover", "lock"];
function ve(e, t) {
  return { fields: t.map((n) => e.fields.find((o) => o.name === n)).filter((n) => !!n), data: e.data, toPatch: e.toPatch };
}
const li = () => ({
  name: "angle",
  label: "Angle",
  selector: { number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" } }
}), T = (e, t) => ({ value: e, label: t }), U = (...e) => ({
  select: { mode: "dropdown", options: e }
});
function Gl(e = $e) {
  return Df(e);
}
function Mb(e, t = $e) {
  return ri(t, e)?.name ?? e;
}
function Eb(e, t = () => 0) {
  const i = ne(e), n = ai(e), o = Ut(e), r = e.type === "skylight", a = xe(e), s = [
    {
      name: "type",
      label: "Type",
      selector: U(
        T("door", "Door"),
        T("passage", "Passage (no door)"),
        T("window", "Window"),
        T("skylight", "Skylight")
      )
    }
  ];
  if (!r && !a && s.push({
    name: "motion",
    label: "Motion",
    selector: U(
      T("swing", "Swing"),
      T("slide", "Slide"),
      // Not "garage / shutter": an external shutter is the Shutter field
      // below, a layer over any opening, and naming it here read as the
      // place to set one up.
      T("roll", "Roll up (garage)"),
      ...e.type === "window" ? [T("fixed", "Fixed (does not open)"), T("awning", "Top-hinged (awning)")] : []
    )
  }), s.push({
    name: "length",
    label: "Length",
    helper: r ? "The roof window's long side" : void 0,
    required: !0,
    selector: { number: { min: 1, mode: "box" } }
  }), r && (s.push({
    name: "width",
    label: "Width",
    helper: "The short side; the patch of sun it lays is this rectangle, moved",
    required: !0,
    selector: { number: { min: 1, mode: "box" } }
  }), s.push({
    name: "ceilingHeight",
    label: "Ceiling height",
    helper: "1 is an ordinary storey; higher throws the patch of sun further across the room",
    selector: { number: { min: 0.2, max: 4, step: 0.1, mode: "slider" } }
  })), !r && !a && i === "swing") {
    const l = e.type === "door";
    s.push({
      name: "sash",
      label: l ? "Leaves" : "Sashes",
      helper: l ? "Double = two leaves meeting in the middle, hinged at each jamb" : "Single = one full-width sash (issue #73)",
      selector: l ? U(T("single", "Single (one leaf)"), T("double", "Double (two leaves)")) : U(T("double", "Double (two leaves)"), T("single", "Single sash"))
    });
  }
  return !a && i === "swing" && Fe(e) === "single" && s.push({
    name: "sashSpan",
    label: e.type === "door" ? "Leaf width" : "Sash width",
    helper: e.type === "door" ? "Share of the opening that actually swings — the rest is a fixed panel" : "Share of the opening that actually opens — the rest is fixed glass",
    selector: { number: { min: Cs, max: 1, step: 0.05, mode: "slider" } }
  }), (e.type === "door" || r) && s.push({
    name: "glazed",
    label: "Glazed",
    helper: r ? "On (a roof window): only the blind stops the light. Off (a hatch): the sash does" : "Lets sunlight through even when shut — a patio or French door",
    selector: { boolean: {} }
  }), s.push({
    name: "sunlight",
    label: "Lets sunlight in",
    helper: "Off makes it wall to the sun — for a solid door the plan draws open",
    selector: { boolean: {} }
  }), !a && i === "swing" && Fe(e) === "single" && s.push({
    name: "hinge",
    label: "Hinge",
    selector: U(T("left", "Left"), T("right", "Right"))
  }), !r && !a && i === "swing" && s.push({
    name: "opens",
    label: "Opens",
    selector: U(T("this", "This side"), T("other", "Other side"))
  }), r && s.push({
    name: "opens",
    label: "Hinged at",
    helper: "Which edge the sash is hung from, and the edge its blind comes down from",
    selector: U(T("this", "Top edge"), T("other", "Bottom edge"))
  }), !r && !a && i === "slide" && (o || s.push({
    name: "slide",
    label: "Slide",
    selector: U(T("left", "To left"), T("right", "To right"))
  }), s.push({
    name: "style",
    label: "Style",
    selector: U(
      T("single", "Single"),
      T("bypass", "Bypass (stack)"),
      T("biparting", "Biparting (into the walls)"),
      T("biparting-bypass", "Biparting (over fixed panels)"),
      T("converging", "Converging (both panels stack in the middle)")
    )
  })), s.push({
    name: "entity",
    label: "Entity",
    // Says locks are usable, because nothing else would: a lock is neither a
    // contact nor a cover, and its states are `locked` / `unlocked` rather
    // than anything that looks like open/closed (issue #176).
    // The device-class promise is a wall opening's. A skylight is deliberately
    // exempt from that inference (see `editor.ts`, where the guard is) —
    // Home Assistant has no roof-window class, so a velux binds to a `cover`
    // with `device_class: window`, the very class that would turn it back into
    // one. Repeating the promise here told a skylight author the opposite of
    // what the card does.
    helper: r ? "Contact or cover for the sash. A roof window keeps its type whatever the entity's device class says" : a ? "Optional. A passage is always open, so this only badges it and takes its tap actions" : o ? "Contact, cover or lock. Drives the first leaf; type and motion follow its device class" : "Contact, cover or lock — a lock reads unlocked as open. Type and motion follow its device class",
    selector: { entity: { filter: [{ domain: Pa }] } }
  }), o && e.entity && s.push({
    name: "secondaryEntity",
    label: "Second leaf",
    helper: "Its own sensor for the other leaf — leave empty to move both together",
    selector: { entity: { filter: [{ domain: Pa }] } }
  }), s.push({
    name: "shutterEntity",
    label: r ? "Blind" : "Shutter",
    helper: r ? "Blackout blind over the glass — a cover, or a contact sensor. This is what stops the light" : "External shutter over this opening — a cover, or a contact sensor",
    selector: { entity: { filter: [{ domain: ["cover", "binary_sensor"] }] } }
  }), e.shutterEntity && (r || s.push({
    name: "shutterStyle",
    label: "Shutter type",
    helper: "Hinged panels fold back against the wall; roll-up slats disappear upward",
    selector: U(T("swing", "Hinged (louvered panels)"), T("roll", "Roll-up (slats)"))
  }), !r && nt(e) === "swing" && s.push({
    name: "shutterSide",
    label: "Shutter side",
    helper: "Which side of the wall the panels hang on",
    selector: U(T("far", "Away from the sash"), T("near", "Same side as the sash"))
  }), !r && nt(e) === "swing" && s.push({
    name: "shutterSecondaryEntity",
    label: "Second shutter panel",
    helper: "Its own contact for the other panel — leave empty to fold both together",
    selector: { entity: { filter: [{ domain: ["binary_sensor", "cover"] }] } }
  }), s.push({
    name: "shutterInvert",
    label: r ? "Invert blind animation" : "Invert shutter animation",
    selector: { boolean: {} }
  })), a || s.push({
    name: "invert",
    label: e.type === "door" ? "Invert door animation" : r ? "Invert skylight animation" : "Invert window animation",
    helper: e.entity ? void 0 : (
      // Only a swing door draws open with no sensor to ask
      // (openingDefaultOpen) — everything else, door, window or roof light,
      // draws shut.
      e.type === "door" && ne(e) === "swing" ? "No sensor bound — draws shut instead of open" : "No sensor bound — draws open instead of shut"
    ),
    selector: { boolean: {} }
  }), s.push(li()), e.entity && (s.push({
    name: "showIcon",
    label: "Show icon",
    helper: ne(e) === "roll" ? "A raised roll-up leaves only a line — this puts its state beside it, and opens its dialog when tapped" : "Shows this opening's state beside it, and opens its dialog when tapped",
    selector: { boolean: {} }
  }), e.showIcon && s.push({
    name: "icon",
    label: "Icon",
    helper: "Overrides the entity's own icon, which changes with its state",
    selector: { icon: {} }
  })), e.shutterEntity && (s.push({
    name: "showShutterIcon",
    label: "Shutter icon",
    helper: !e.entity && nt(e) === "roll" ? "A raised roll-up leaves only a line — this puts the shutter's state beside it, and opens it when tapped" : "Shows the shutter's state beside the opening, and opens it when tapped",
    selector: { boolean: {} }
  }), (e.showShutterIcon ?? Ai(e)) && s.push({
    name: "shutterIcon",
    label: "Icon",
    helper: "Overrides the shutter entity's own icon, which changes with its state",
    selector: { icon: {} }
  })), e.entity && e.shutterEntity && s.push({
    name: "tapTarget",
    label: "Tap opens",
    helper: "The other one moves to press-and-hold. Opens the dialog; use Tap action below to move the shutter itself",
    selector: U(
      T(
        "opening",
        e.type === "door" ? "The door" : r ? "The skylight" : a ? "The passage" : "The window"
      ),
      T("shutter", r ? "The blind" : "The shutter")
    )
  }), (e.entity || e.shutterEntity) && s.push(
    {
      name: "tap_action",
      label: "Tap action",
      selector: {
        ui_action: {
          default_action: Ho(e, "tap", t)?.config.action ?? "none"
        }
      }
    },
    {
      name: "hold_action",
      label: "Hold action",
      // With both bound, holding reaches whichever entity the tap does not.
      // With only one, there is nothing left for hold to open.
      helper: e.entity && e.shutterEntity ? "Opens the entity the tap doesn't" : void 0,
      selector: {
        ui_action: {
          default_action: e.entity && e.shutterEntity ? "more-info" : "none"
        }
      }
    },
    {
      name: "double_tap_action",
      label: "Double-tap action",
      selector: { ui_action: { default_action: "none" } }
    }
  ), {
    fields: s,
    data: {
      type: e.type,
      motion: i,
      length: e.length,
      // The *effective* pair, not the raw ones: a skylight placed without a
      // stated width still has one (SKYLIGHT_WIDTH_RATIO of its length), and
      // a Width box that opened empty on a rectangle plainly drawn on the
      // canvas would be a box claiming the drawing has no width.
      width: Se(e),
      ceilingHeight: Uo(e),
      hinge: e.flipH ? "right" : "left",
      opens: e.flipV ? "other" : "this",
      slide: e.flipH ? "right" : "left",
      style: n,
      sash: Fe(e),
      entity: e.entity ?? "",
      secondaryEntity: e.secondaryEntity ?? "",
      glazed: $n(e),
      sunlight: e.sunlight ?? !0,
      shutterEntity: e.shutterEntity ?? "",
      shutterSecondaryEntity: e.shutterSecondaryEntity ?? "",
      shutterStyle: nt(e),
      shutterSide: e.shutterFlipV ? "near" : "far",
      shutterInvert: e.shutterInvert ?? !1,
      showShutterIcon: e.showShutterIcon ?? Ai(e),
      shutterIcon: e.shutterIcon ?? "",
      showIcon: e.showIcon ?? !1,
      icon: e.icon ?? "",
      tapTarget: e.tapTarget ?? "opening",
      invert: e.invert ?? !1,
      angle: e.angle,
      tap_action: e.tap_action,
      hold_action: e.hold_action,
      double_tap_action: e.double_tap_action
    },
    toPatch(l) {
      const c = {};
      for (const [p, d] of Object.entries(l))
        if (p === "shutterEntity")
          c.shutterEntity = d, d || (c.shutterStyle = void 0, c.shutterFlipV = void 0, c.shutterInvert = void 0, c.shutterActiveColor = void 0, c.shutterSecondaryEntity = void 0, c.tapTarget = void 0, c.showShutterIcon = void 0, c.shutterIcon = void 0);
        else if (p === "sunlight")
          c.sunlight = d ? void 0 : !1;
        else if (p === "glazed")
          c.glazed = e.type === "door" ? d ? !0 : void 0 : r ? d ? void 0 : !1 : void 0;
        else if (p === "width")
          c.width = r && typeof d == "number" && d > 0 ? d : void 0;
        else if (p === "ceilingHeight")
          c.ceilingHeight = r && typeof d == "number" && d !== 1 ? d : void 0;
        else if (p === "entity")
          c.entity = d, d || (c.showIcon = void 0, c.icon = void 0);
        else if (p === "shutterSide") c.shutterFlipV = d === "near" || void 0;
        else if (p === "shutterInvert") c.shutterInvert = d || void 0;
        else if (p === "tapTarget") c.tapTarget = d === "shutter" ? "shutter" : void 0;
        else {
          if (p === "showShutterIcon") continue;
          if (p === "showIcon")
            c.showIcon = d ? !0 : void 0, d || (c.icon = void 0);
          else if (p === "motion") {
            const h = d === "slide" || d === "roll" || d === "fixed" || d === "awning" ? d : void 0;
            c.motion = h, d !== "slide" && (c.sliderStyle = void 0), d !== "swing" && (c.sashSpan = void 0), Ut({
              ...e,
              motion: h,
              sliderStyle: d === "slide" ? e.sliderStyle : void 0
            }) || (c.secondaryEntity = void 0);
          } else p === "sashSpan" ? c.sashSpan = typeof d == "number" && d < 1 ? d : void 0 : p === "sash" ? (c.sash = d === Qn(e.type) ? void 0 : d, Ut({ ...e, sash: d }) || (c.secondaryEntity = void 0), d === "double" && (c.sashSpan = void 0)) : p === "shutterStyle" ? (c.shutterStyle = d, d !== "swing" && (c.shutterSecondaryEntity = void 0)) : p === "hinge" || p === "slide" ? c.flipH = d === "right" || void 0 : p === "opens" ? c.flipV = d === "other" || void 0 : p === "style" ? (c.sliderStyle = d === "single" ? void 0 : d, ol(d) || (c.secondaryEntity = void 0)) : p === "invert" ? c.invert = d || void 0 : p === "type" ? (c.type = d, d === "skylight" ? (c.motion = void 0, c.sliderStyle = void 0, c.sashSpan = void 0, c.sash = void 0, c.secondaryEntity = void 0, c.shutterStyle = void 0, c.shutterFlipV = void 0, c.shutterSecondaryEntity = void 0, c.glazed = void 0) : r && (c.width = void 0, c.ceilingHeight = void 0, c.glazed = void 0, c.motion = void 0, c.sliderStyle = void 0, c.sashSpan = void 0, c.sash = void 0, c.secondaryEntity = void 0, c.shutterStyle = void 0, c.shutterFlipV = void 0, c.shutterSecondaryEntity = void 0), (d === "passage" || a) && (c.motion = void 0, c.sliderStyle = void 0, c.sashSpan = void 0, c.sash = void 0, c.secondaryEntity = void 0, c.glazed = void 0, c.invert = void 0)) : c[p] = d;
        }
      if (!("shutterEntity" in l && !l.shutterEntity)) {
        const p = { entity: "entity" in c ? c.entity : e.entity }, d = Ai(p);
        if ("showShutterIcon" in l) {
          const h = !!l.showShutterIcon;
          c.showShutterIcon = h === d ? void 0 : h, h || (c.shutterIcon = void 0);
        } else "entity" in c && (e.showShutterIcon === d && (c.showShutterIcon = void 0), e.shutterIcon && !(e.showShutterIcon ?? d) && (c.shutterIcon = void 0));
      }
      return c;
    }
  };
}
function Ko(e, t) {
  return e?.entities.length ? { entity: { include_entities: t && !e.entities.includes(t) ? [...e.entities, t] : e.entities } } : { entity: {} };
}
function Xo(e, t) {
  if (!e?.entities.length) return t;
  const n = `Only entities in ${e.name ? `the ${e.name} area` : "this area"} — turn off “Filter entities” on the area to see all`;
  return t ? `${t}. ${n}` : n;
}
function Oi(e) {
  if ((e.display ?? "badge") === "ripple") return "none";
  const t = ei(e);
  if (t !== "icon") return t;
  const i = e.iconAnimation ?? "auto";
  return i === "spin" || i === "pulse" ? i : i === "auto" ? Ks(e.entity) ?? "icon" : "icon";
}
function Yo(e) {
  return (e.display ?? "badge") !== "badge";
}
function Kl(e, t) {
  const i = {
    badgeContent: e === "value" ? "value" : e === "none" ? "none" : "icon",
    // Touching the badge retires the `showIcon` boolean it replaced (issue
    // #106), so a migrated config carries one setting rather than two that
    // could later be edited into disagreeing. Configs nobody touches keep
    // working through badgeContentOf's fallback.
    showIcon: void 0,
    display: t ? e === "none" ? "ripple" : "iconRipple" : "badge"
  };
  return e !== "value" && e !== "none" && (i.iconAnimation = e === "icon" ? "none" : e), i;
}
function za(e, t) {
  return {
    fields: [
      {
        name: "entity",
        label: "Entity",
        required: !0,
        helper: Xo(t),
        selector: Ko(t, e.entity)
      },
      {
        name: "attribute",
        label: "Attribute",
        helper: "Show this attribute instead of the state (e.g. current_temperature)",
        selector: { attribute: { entity_id: e.entity } }
      }
    ],
    data: { entity: e.entity ?? "", attribute: e.attribute ?? "" },
    toPatch: It
  };
}
function Ab(e) {
  return {
    fields: [
      { name: "name", label: "Name", selector: { text: {} } },
      {
        name: "showName",
        label: "Show name",
        helper: "Adds the name to the label line",
        selector: { boolean: {} }
      }
    ],
    data: { name: e.name ?? "", showName: e.showName ?? !1 },
    toPatch: It
  };
}
function Tb(e) {
  return {
    fields: [
      {
        name: "showState",
        label: "Show state",
        helper: "Adds this entity's own state to the label line",
        selector: { boolean: {} }
      }
    ],
    data: { showState: e.showState ?? e.kind === "sensor" },
    toPatch: It
  };
}
function Cb(e) {
  const t = [
    {
      name: "labelPosition",
      label: "Label position",
      helper: "Beside the badge instead of under it — a long reading then grows one way only",
      selector: U(T("below", "Below"), T("left", "Left"), T("right", "Right"))
    },
    {
      name: "labelSize",
      label: "Label size",
      selector: { number: { min: 8, max: 40, step: 1, mode: "slider", unit_of_measurement: "px" } }
    },
    {
      name: "disableLabelColor",
      label: "Disable label color",
      helper: "Keeps the text in its default color even if the icon changes color",
      selector: { boolean: {} }
    }
  ];
  return e.disableLabelColor && t.push({
    name: "useCustomLabelColor",
    label: "Own color",
    helper: "Override the theme default with a fixed custom color",
    selector: { boolean: {} }
  }), {
    fields: t,
    data: {
      labelPosition: Bi(e),
      labelSize: e.labelSize ?? Ns,
      disableLabelColor: e.disableLabelColor ?? !1,
      useCustomLabelColor: e.useCustomLabelColor ?? !1,
      labelCustomColor: e.labelCustomColor ?? ""
    },
    toPatch: (i) => {
      const n = { ...i }, o = n.disableLabelColor ?? e.disableLabelColor ?? !1, r = n.useCustomLabelColor ?? e.useCustomLabelColor ?? !1;
      return n.labelPosition === "below" && (n.labelPosition = void 0), n.disableLabelColor === !1 && (n.disableLabelColor = void 0), n.useCustomLabelColor === !1 && (n.useCustomLabelColor = void 0), o ? r || (n.labelCustomColor = void 0) : (n.useCustomLabelColor = void 0, n.labelCustomColor = void 0), n.labelCustomColor === "" && (n.labelCustomColor = void 0), n;
    }
  };
}
function Oa(e, t) {
  const i = [
    {
      name: "badgeMode",
      label: "Badge shows",
      helper: "Animations play only while the entity is active. Value puts the reading in the badge, falling back to the icon when there is no number",
      selector: U(
        T("icon", "Icon, still"),
        T("spin", "Icon, spinning"),
        T("pulse", "Icon, pulsing"),
        T("value", "Value"),
        T("none", "Nothing")
      )
    }
  ], n = Ge(e);
  return Oi(e) === "value" && n.length && i.push({
    name: "badgeEntity",
    label: "Badge reads",
    helper: "Which of this device's readings the badge shows",
    selector: U(
      T("primary", t?.primaryLabel || e.entity || "Main entity"),
      ...n.map(
        (o, r) => T(
          String(r),
          t?.readingLabels?.[r] || o.entity || (o.attribute ? `${e.entity || "this device"} · ${o.attribute}` : `Reading ${r + 1}`)
        )
      )
    )
  }), i.push(
    {
      name: "size",
      label: "Size",
      selector: { number: { min: 16, max: 160, step: 2, mode: "slider", unit_of_measurement: "px" } }
    },
    li()
  ), {
    fields: i,
    data: {
      badgeMode: Oi(e),
      // The dropdown's values are strings, so the stored index (or the legacy
      // "secondary") is spelled the same way here; toPatch turns it back into
      // a number. Opens on what the badge is *actually* reading when nothing
      // is chosen, which is the whole point of badgeSource (issue #136).
      badgeEntity: String(tl(e.badgeEntity) ?? t?.source ?? "primary"),
      size: e.size ?? je,
      angle: e.angle ?? 0
    },
    // "Badge shows" is the editor's spelling of three config keys (issue
    // #127) — expand it back, carrying the ripple state off the item since
    // that control lives in another group now.
    toPatch: (o) => {
      let r = o;
      if ("badgeEntity" in r && typeof r.badgeEntity == "string" && r.badgeEntity !== "primary" && (r = { ...r, badgeEntity: Number(r.badgeEntity) }), !("badgeMode" in r)) return r;
      const { badgeMode: a, ...s } = r;
      return {
        ...s,
        ...Kl(a ?? Oi(e), Yo(e))
      };
    }
  };
}
function Ib(e, t, i) {
  const n = Yo(e), o = Ys(e.entity, t), r = wm(i) || !!e.glow;
  if (!o && !r) return;
  const a = st(e) !== void 0, s = [];
  return o && (s.push({
    name: "ripple",
    label: "Ripple",
    // "Detected" rather than "the sensor is on": this is offered to a
    // device_tracker and a person too, and neither of those is a sensor.
    // It stays vague about *what* is detected because a vibration sensor
    // rings for a knock, not for presence (issue #202).
    helper: "Draws a pulsing ring while this device detects something",
    selector: { boolean: {} }
  }), n && (s.push({
    name: "rippleSize",
    label: "Ripple size",
    selector: {
      number: { min: 40, max: 400, step: 4, mode: "slider", unit_of_measurement: "px" }
    }
  }), s.push({
    name: "rippleDirection",
    label: "Ripple direction",
    selector: {
      number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" }
    }
  }), s.push({
    name: "rippleWidth",
    label: "Ripple width",
    selector: {
      number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" }
    }
  }))), r && (s.push({
    name: "glow",
    label: "Cast light",
    helper: "Pools the light's own color onto the plan; overlapping lights mix",
    selector: { boolean: {} }
  }), e.glow && (s.push(
    {
      name: "glowRadius",
      label: "Light radius",
      selector: { number: { min: 20, max: 600, step: 10, mode: "slider" } }
    },
    {
      name: "glowColor",
      label: "Light color",
      helper: "Only for bulbs that can't report a color; others use their own",
      selector: { text: {} }
    },
    {
      name: "strip",
      label: "LED strip",
      helper: "Casts along a run centred on the device; drag its ends on the plan",
      selector: { boolean: {} }
    }
  ), a && s.push(
    {
      name: "stripLength",
      label: "Strip length",
      selector: { number: { min: $o, max: 2e3, step: 1, mode: "box" } }
    },
    {
      name: "stripAngle",
      label: "Strip direction",
      selector: {
        number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" }
      }
    },
    {
      name: "stripSide",
      label: "Lit side",
      // The review on #372: the editor is where strips get laid out, so
      // the warning belongs here and not only in the docs.
      helper: "On a wall, Left or Right, or it lights the room behind it too. Auto picks one when both ends are dragged onto a wall. Seen from its first end",
      selector: {
        select: {
          mode: "dropdown",
          // "Auto" is the unset side, which lights both until a drag lays
          // the strip onto a wall. It is spelled out rather than shown
          // as "Both sides", which would read as a choice the editor then
          // overrides (second review on #372).
          options: [
            { value: "auto", label: "Auto (both until laid on a wall)" },
            { value: "both", label: "Both sides" },
            { value: "left", label: "Left" },
            { value: "right", label: "Right" }
          ]
        }
      }
    }
  ))), {
    fields: s,
    data: {
      ripple: n,
      rippleSize: e.rippleSize ?? dn,
      rippleDirection: e.rippleDirection ?? hn,
      rippleWidth: e.rippleWidth ?? pn,
      glow: e.glow ?? !1,
      glowRadius: e.glowRadius ?? cn,
      glowColor: e.glowColor ?? "",
      strip: a,
      stripLength: e.stripLength ?? br,
      stripAngle: e.stripAngle ?? 0,
      stripSide: e.stripSide ?? "auto"
    },
    toPatch: (l) => {
      let c = l;
      if ("strip" in c) {
        const { strip: h, ...u } = c;
        c = h ? { ...u, stripLength: a ? e.stripLength : br } : { ...u, stripLength: void 0, stripAngle: void 0, stripSide: void 0 };
      }
      if (c.stripSide === "auto" && (c = { ...c, stripSide: void 0 }), !("ripple" in c)) return c;
      const { ripple: p, ...d } = c;
      return { ...d, ...Kl(Oi(e), !!p) };
    }
  };
}
function Pb(e) {
  const t = [
    {
      name: "showOnlyWhenZoomed",
      label: "Only show when zoomed into area",
      helper: "Hidden on the full plan, and shown once the room it sits in is zoomed into",
      selector: { boolean: {} }
    },
    {
      name: "enableHideByEntity",
      label: "Hide by condition (Entire Object)",
      selector: { boolean: {} }
    }
  ];
  if (e.enableHideByEntity) {
    const i = e.hideEntity || e.entity;
    t.push(
      {
        name: "hideEntity",
        label: "Evaluation Entity (Optional)",
        helper: "Leave empty to use the main object entity",
        selector: { entity: {} }
      },
      {
        name: "hideAttribute",
        label: "Evaluation Attribute (Optional)",
        helper: "Leave empty to use the entity's state instead of an attribute",
        selector: { attribute: { entity_id: i } }
      },
      {
        name: "hideMode",
        label: "Condition Type",
        selector: { select: { mode: "dropdown", options: [{ value: "state", label: "State Match" }, { value: "threshold", label: "Numeric Threshold" }] } }
      },
      {
        name: "hideOperator",
        label: "Operator",
        selector: {
          select: {
            mode: "dropdown",
            options: e.hideMode === "threshold" ? [{ value: "<", label: "<" }, { value: "<=", label: "<=" }, { value: "==", label: "==" }, { value: "!=", label: "!=" }, { value: ">=", label: ">=" }, { value: ">", label: ">" }] : [{ value: "==", label: "==" }, { value: "!=", label: "!=" }]
          }
        }
      }
    ), e.hideMode === "threshold" ? t.push({
      name: "hideThreshold",
      label: "Threshold Value",
      selector: { number: { mode: "box", step: "any" } }
    }) : t.push({
      name: "hideState",
      label: "Hide State",
      helper: e.hideAttribute ? "Enter the exact attribute value that triggers the hide action" : "Select the state that triggers the hide action",
      selector: e.hideAttribute || !i ? { text: {} } : { state: { entity_id: i } }
    }), t.push({
      name: "hideInvert",
      label: "Invert condition",
      helper: "Hide when condition is NOT met",
      selector: { boolean: {} }
    });
  }
  if (t.push({
    name: "enableHideStateByEntity",
    label: "Hide State by condition",
    helper: "Hides only the state text below the icon based on a condition",
    selector: { boolean: {} }
  }), e.enableHideStateByEntity) {
    const i = e.hideStateEntity || e.entity;
    t.push(
      {
        name: "hideStateEntity",
        label: "State Eval. Entity (Optional)",
        helper: "Leave empty to use the main object entity",
        selector: { entity: {} }
      },
      {
        name: "hideStateAttribute",
        label: "State Eval. Attribute (Optional)",
        helper: "Leave empty to use the entity's state instead of an attribute",
        selector: { attribute: { entity_id: i } }
      },
      {
        name: "hideStateMode",
        label: "Condition Type",
        selector: { select: { mode: "dropdown", options: [{ value: "state", label: "State Match" }, { value: "threshold", label: "Numeric Threshold" }] } }
      },
      {
        name: "hideStateOperator",
        label: "Operator",
        selector: {
          select: {
            mode: "dropdown",
            options: e.hideStateMode === "threshold" ? [{ value: "<", label: "<" }, { value: "<=", label: "<=" }, { value: "==", label: "==" }, { value: "!=", label: "!=" }, { value: ">=", label: ">=" }, { value: ">", label: ">" }] : [{ value: "==", label: "==" }, { value: "!=", label: "!=" }]
          }
        }
      }
    ), e.hideStateMode === "threshold" ? t.push({
      name: "hideStateThreshold",
      label: "Threshold Value",
      selector: { number: { mode: "box", step: "any" } }
    }) : t.push({
      name: "hideStateMatch",
      label: "Hide State Match",
      helper: e.hideStateAttribute ? "Enter the exact attribute value that triggers hiding the text" : "Select the state that triggers hiding the text",
      selector: e.hideStateAttribute || !i ? { text: {} } : { state: { entity_id: i } }
    }), t.push({
      name: "hideStateInvert",
      label: "Invert condition",
      helper: "Hide text when condition is NOT met",
      selector: { boolean: {} }
    });
  }
  if (t.push({
    name: "enableHideBadgeByEntity",
    label: "Hide Badge by condition",
    helper: "Hides only the badge (icon/bubble) based on a condition",
    selector: { boolean: {} }
  }), e.enableHideBadgeByEntity) {
    const i = e.hideBadgeEntity || e.entity;
    t.push(
      {
        name: "hideBadgeEntity",
        label: "Badge Eval. Entity (Optional)",
        helper: "Leave empty to use the main object entity",
        selector: { entity: {} }
      },
      {
        name: "hideBadgeAttribute",
        label: "Badge Eval. Attribute (Optional)",
        helper: "Leave empty to use the entity's state instead of an attribute",
        selector: { attribute: { entity_id: i } }
      },
      {
        name: "hideBadgeMode",
        label: "Condition Type",
        selector: { select: { mode: "dropdown", options: [{ value: "state", label: "State Match" }, { value: "threshold", label: "Numeric Threshold" }] } }
      },
      {
        name: "hideBadgeOperator",
        label: "Operator",
        selector: {
          select: {
            mode: "dropdown",
            options: e.hideBadgeMode === "threshold" ? [{ value: "<", label: "<" }, { value: "<=", label: "<=" }, { value: "==", label: "==" }, { value: "!=", label: "!=" }, { value: ">=", label: ">=" }, { value: ">", label: ">" }] : [{ value: "==", label: "==" }, { value: "!=", label: "!=" }]
          }
        }
      }
    ), e.hideBadgeMode === "threshold" ? t.push({
      name: "hideBadgeThreshold",
      label: "Threshold Value",
      selector: { number: { mode: "box", step: "any" } }
    }) : t.push({
      name: "hideBadgeMatch",
      label: "Hide Badge Match",
      helper: e.hideBadgeAttribute ? "Enter the exact attribute value that triggers hiding the badge" : "Select the state that triggers hiding the badge",
      selector: e.hideBadgeAttribute || !i ? { text: {} } : { state: { entity_id: i } }
    }), t.push({
      name: "hideBadgeInvert",
      label: "Invert condition",
      helper: "Hide badge when condition is NOT met",
      selector: { boolean: {} }
    });
  }
  return {
    fields: t,
    data: {
      showOnlyWhenZoomed: e.showOnlyWhenZoomed ?? !1,
      enableHideByEntity: e.enableHideByEntity ?? !1,
      hideEntity: e.hideEntity ?? "",
      hideAttribute: e.hideAttribute ?? "",
      hideMode: e.hideMode ?? "state",
      hideState: e.hideState ?? "",
      hideOperator: e.hideOperator ?? "==",
      hideThreshold: e.hideThreshold ?? 0,
      hideInvert: e.hideInvert ?? !1,
      enableHideStateByEntity: e.enableHideStateByEntity ?? !1,
      hideStateEntity: e.hideStateEntity ?? "",
      hideStateAttribute: e.hideStateAttribute ?? "",
      hideStateMode: e.hideStateMode ?? "state",
      hideStateMatch: e.hideStateMatch ?? "",
      hideStateOperator: e.hideStateOperator ?? "==",
      hideStateThreshold: e.hideStateThreshold ?? 0,
      hideStateInvert: e.hideStateInvert ?? !1,
      enableHideBadgeByEntity: e.enableHideBadgeByEntity ?? !1,
      hideBadgeEntity: e.hideBadgeEntity ?? "",
      hideBadgeAttribute: e.hideBadgeAttribute ?? "",
      hideBadgeMode: e.hideBadgeMode ?? "state",
      hideBadgeMatch: e.hideBadgeMatch ?? "",
      hideBadgeOperator: e.hideBadgeOperator ?? "==",
      hideBadgeThreshold: e.hideBadgeThreshold ?? 0,
      hideBadgeInvert: e.hideBadgeInvert ?? !1
    },
    // Off is the default, so it leaves no key behind — an untouched device's
    // YAML stays as short as it was before this switch existed.
    //
    // Only when the user actually touched it, though. `_renderForm` diffs the
    // form against the event and passes on just the keys that changed, and
    // `_updateItem` merges with a spread — so a key that is merely *present*
    // and undefined overwrites what the config had. Writing it unconditionally
    // meant every one of this group's two dozen other fields silently switched
    // this one off. The sibling forms all prune inside a walk of
    // `Object.entries(patch)`, which has the same guard built in.
    toPatch: (i) => "showOnlyWhenZoomed" in i ? { ...i, showOnlyWhenZoomed: i.showOnlyWhenZoomed || void 0 } : i
  };
}
function zb(e) {
  const t = (e.tap_action?.action ?? _i(e.entity).action) === "more-info";
  return {
    fields: [
      {
        name: "hideWhenInactive",
        label: "Only when active",
        helper: "Hide on the card while the entity is off/idle (still editable here)",
        selector: { boolean: {} }
      },
      {
        name: "tap_action",
        label: "Tap action",
        selector: { ui_action: { default_action: _i(e.entity).action } }
      },
      ...t ? [
        {
          name: "moreInfoEntity",
          label: "Open more info for",
          helper: "Leave empty to open this device",
          selector: { entity: {} }
        }
      ] : [],
      { name: "hold_action", label: "Hold action", selector: { ui_action: { default_action: "none" } } },
      {
        name: "double_tap_action",
        label: "Double-tap action",
        selector: { ui_action: { default_action: "none" } }
      }
    ],
    data: {
      hideWhenInactive: e.hideWhenInactive ?? !1,
      tap_action: e.tap_action,
      ...t ? { moreInfoEntity: e.tap_action?.entity ?? "" } : {},
      hold_action: e.hold_action,
      double_tap_action: e.double_tap_action
    },
    toPatch: (i) => {
      if (!("moreInfoEntity" in i)) return i;
      const { moreInfoEntity: n, ...o } = i;
      if (!t) return o;
      const r = typeof n == "string" && n ? n : void 0, a = { ...e.tap_action ?? {}, action: "more-info" };
      r ? a.entity = r : delete a.entity;
      const s = a.action === _i(e.entity).action && Object.keys(a).every((l) => l === "action" || a[l] == null);
      return { ...o, tap_action: s ? void 0 : a };
    }
  };
}
function Ob(e, t) {
  const i = [
    {
      name: "text",
      label: "Text",
      // Required only while nothing else fills the label. A text with no words
      // and no entity is an invisible element, which is what this guarded
      // against; with a reading bound the words are optional, and demanding
      // them for a label that is only ever a number would be asking for a
      // placeholder to delete.
      required: !e.entity,
      helper: e.entity ? "Shown in front of the reading — leave empty for the value alone" : void 0,
      selector: { text: {} }
    },
    {
      name: "entity",
      label: "Entity",
      helper: Xo(t, "Shows this entity's value, formatted as HA formats it"),
      selector: Ko(t, e.entity)
    }
  ];
  return e.entity && i.push({
    name: "attribute",
    label: "Attribute",
    helper: "Show this attribute instead of the state (e.g. current_temperature)",
    selector: { attribute: { entity_id: e.entity } }
  }), i.push(
    {
      name: "size",
      label: "Size",
      selector: { number: { min: 8, max: 200, mode: "slider", unit_of_measurement: "px" } }
    },
    li()
  ), {
    fields: i,
    data: {
      text: e.text ?? "",
      entity: e.entity ?? "",
      attribute: e.attribute ?? "",
      size: e.size ?? jt,
      angle: e.angle ?? 0
    },
    toPatch: (n) => "entity" in n && !n.entity ? { ...n, attribute: void 0 } : n
  };
}
function Lb(e, t, i = $e, n = []) {
  const o = Gl(i), r = o.some((l) => l.id === e.type) ? o.map((l) => ({ value: l.id, label: l.name })) : [{ value: e.type, label: `${e.type} (missing)` }, ...o.map((l) => ({ value: l.id, label: l.name }))], a = e.goToFloor && typeof e.goToFloor == "object" && typeof e.goToFloor.floor == "string" ? e.goToFloor.floor : void 0, s = n.map((l) => T(`floor:${l.id}`, `Go to ${l.name} (${l.id})`));
  return a !== void 0 && !n.some((l) => l.id === a) && s.push(T(`floor:${a}`, `Missing floor: ${a}`)), {
    fields: [
      {
        name: "type",
        label: "Type",
        selector: { select: { mode: "dropdown", options: r } }
      },
      // L-shaped sectional only (#40): which side the chaise extends on,
      // facing the sofa from the front. Conditional, in the same shape
      // openingForm uses for its hinge / slide fields.
      ...e.type === "sectional" ? [
        {
          name: "hand",
          label: "Chaise side",
          helper: "Facing the sofa from the front",
          selector: U(T("right", "right"), T("left", "left"))
        }
      ] : [],
      { name: "w", label: "Width", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "h", label: "Height", required: !0, selector: { number: { min: 10, mode: "box" } } },
      li(),
      // Optional entity that makes the drawing live (issue #82) — a soil
      // sensor on a plant, a contact sensor on a cabinet. Last, because most
      // furniture is decoration and never binds anything.
      {
        name: "entity",
        label: "Entity",
        helper: Xo(t, "Optional — lets the drawing change color with a sensor"),
        selector: Ko(t, e.entity)
      },
      // Clicking it changes floor (issue #121). Offered on any piece rather
      // than only on the built-in `stairs`, because a plan can draw its own
      // staircase and a rule keyed on one symbol id would leave those out.
      // Empty on everything by default, so it is a row and not a nag.
      {
        name: "goToFloor",
        label: "Go to floor",
        helper: "Tap the icon to change floor. Main uses the default floor, or the first floor",
        selector: U(
          T("", "Nothing"),
          T("up", "Up one floor"),
          T("down", "Down one floor"),
          T("top", "Top floor"),
          T("bottom", "Bottom floor"),
          T("main", "Main floor"),
          ...s
        )
      },
      // Actions on the piece itself (issue #284), offered on every piece the
      // way a room's actions are — furniture with no entity can still navigate or call
      // a service, and requiring one first would rule that out.
      //
      // The tap helper names what it replaces, but only when there is
      // something to replace: on an ordinary piece a tap does nothing today,
      // and claiming it "replaces the floor change" would describe a staircase
      // this piece is not.
      {
        name: "tap_action",
        label: "Tap action",
        helper: e.goToFloor ? "Replaces the floor change. Put an action on hold or double-tap to keep both" : void 0,
        selector: { ui_action: { default_action: "none" } }
      },
      { name: "hold_action", label: "Hold action", selector: { ui_action: { default_action: "none" } } },
      {
        name: "double_tap_action",
        label: "Double-tap action",
        selector: { ui_action: { default_action: "none" } }
      }
    ],
    data: {
      type: e.type,
      ...e.type === "sectional" ? { hand: e.hand ?? "right" } : {},
      w: e.w,
      h: e.h,
      angle: e.angle ?? 0,
      entity: e.entity ?? "",
      goToFloor: a !== void 0 ? `floor:${a}` : typeof e.goToFloor == "string" ? e.goToFloor : "",
      tap_action: e.tap_action,
      hold_action: e.hold_action,
      double_tap_action: e.double_tap_action
    },
    toPatch: (l) => {
      if (!("goToFloor" in l)) return l;
      const c = l.goToFloor;
      return {
        ...l,
        goToFloor: typeof c == "string" && c.startsWith("floor:") ? { floor: c.slice(6) } : c || void 0
      };
    }
  };
}
function Fb(e) {
  return {
    fields: [
      { name: "w", label: "Width", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "h", label: "Height", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "x", label: "X", required: !0, selector: { number: { mode: "box" } } },
      { name: "y", label: "Y", required: !0, selector: { number: { mode: "box" } } },
      li(),
      {
        name: "dotSize",
        label: "Dot size",
        selector: { number: { min: 6, max: 80, mode: "slider", unit_of_measurement: "px" } }
      }
    ],
    data: {
      w: e.w,
      h: e.h,
      x: Math.round(e.x),
      y: Math.round(e.y),
      angle: e.angle ?? 0,
      dotSize: e.dotSize ?? ko
    },
    toPatch: It
  };
}
function Db(e, t = []) {
  return {
    fields: [{ name: "name", label: "Name", selector: t.length ? {
      select: {
        options: t.map((n) => ({ value: n, label: n })),
        custom_value: !0,
        mode: "dropdown",
        sort: !1
      }
    } : { text: {} } }],
    data: { name: e.name ?? "" },
    toPatch: It
  };
}
function Rb(e) {
  return {
    fields: [
      { name: "showName", label: "Show name", selector: { boolean: {} } },
      // Only while the name renders — same rule the item form uses for its
      // label size.
      ...e.showName ?? !0 ? [
        {
          name: "labelSize",
          label: "Name size",
          selector: {
            number: { min: 8, max: 40, step: 1, mode: "slider", unit_of_measurement: "px" }
          }
        }
      ] : [],
      {
        name: "opacity",
        label: "Fill opacity",
        selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
      },
      // How close tapping the room goes (issue #222). Only worth asking while
      // a tap still zooms: an area with its own `tap_action` has replaced the
      // zoom outright, and a number that does nothing is worse than no number.
      //
      // A toggle *and* a slider, rather than the slider alone resting at the
      // fit's ceiling. That earlier shape made "fit" and an explicit 4 the
      // same position, so a room whose fit is 1.15 — the ordinary case, and
      // the one this feature exists for — could not be told to zoom to 4 at
      // all. "Fit" is not a number on this scale; it is the absence of one,
      // and it needs its own control to say so.
      ...e.tap_action ? [] : [
        {
          name: "fitZoom",
          label: "Fit the room to the card",
          helper: "Off lets you set how close a tap goes",
          selector: { boolean: {} }
        },
        ...e.zoom === void 0 ? [] : [
          {
            name: "zoom",
            label: "Zoom level",
            helper: "How close a tap goes",
            selector: {
              number: {
                min: 1,
                max: is,
                step: 0.5,
                mode: "slider"
              }
            }
          }
        ]
      ],
      // Optional entity that makes the room itself live (issue #6) — a presence
      // sensor that lights the room while it is occupied. Last, because most
      // areas are just outlines and never bind anything.
      {
        name: "entity",
        label: "Entity",
        helper: "Optional — lets the room fill change color with a sensor",
        selector: { entity: {} }
      },
      // Only meaningful once something drives the colour. Offered here rather
      // than in the editor's colour rows because both are plain selectors, and
      // "Active opacity" belongs beside "Fill opacity".
      ...e.entity ? [
        {
          name: "activeOpacity",
          label: "Active opacity",
          helper: "Fill opacity while the entity resolves a color",
          selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
        },
        {
          name: "highlight",
          label: "Highlight",
          helper: "Border only outlines the room without tinting what's inside",
          selector: U(
            T("fill", "Fill"),
            T("border", "Border only"),
            T("both", "Fill and border")
          )
        }
      ] : [],
      // Actions on the room itself (issue #181). Tap already does something —
      // it zooms — so its default is named here rather than left blank: the
      // dropdown says "Zoom to room", which is what leaving it alone gives
      // you, on the same principle as the opening's "Tap opens".
      {
        name: "tap_action",
        label: "Tap action",
        helper: "Replaces the zoom. Put an action on hold or double-tap to keep both",
        selector: { ui_action: { default_action: "none" } }
      },
      { name: "hold_action", label: "Hold action", selector: { ui_action: { default_action: "none" } } },
      {
        name: "double_tap_action",
        label: "Double-tap action",
        selector: { ui_action: { default_action: "none" } }
      }
    ],
    data: {
      showName: e.showName ?? !0,
      labelSize: e.labelSize ?? _o,
      opacity: e.opacity ?? Bn,
      entity: e.entity ?? "",
      activeOpacity: e.activeOpacity ?? e.opacity ?? Bn,
      highlight: e.highlight ?? "fill",
      // "Fit" is the absence of a number, so it gets its own boolean; the
      // slider only appears once that is off, and then always shows a real
      // stored value.
      fitZoom: e.zoom === void 0,
      zoom: e.zoom ?? Un,
      tap_action: e.tap_action,
      hold_action: e.hold_action,
      double_tap_action: e.double_tap_action
    },
    toPatch: (t) => {
      let i = t;
      if ("highlight" in i && i.highlight === "fill" && (i = { ...i, highlight: void 0 }), "fitZoom" in i) {
        const { fitZoom: n, ...o } = i;
        i = { ...o, zoom: n ? void 0 : Un };
      }
      return i;
    }
  };
}
function Hb(e) {
  const t = (i, n) => ({
    name: i,
    label: n,
    required: !0,
    selector: { number: { mode: "box" } }
  });
  return {
    fields: [
      t("x1", "Start X"),
      t("y1", "Start Y"),
      t("x2", "End X"),
      t("y2", "End Y"),
      {
        name: "thickness",
        label: "Thickness",
        // Capped at MAX_SKIN_WALL_WIDTH, not a rounder number: past that a
        // wall stops being fully cleared by its own door or window (the
        // doorway mask's cut is sized off the shared WALL_THICKNESS
        // constant, not per-wall — see render.ts's wallThickness).
        selector: {
          number: { min: 2, max: Xa, step: 1, mode: "slider", unit_of_measurement: "px" }
        }
      },
      {
        name: "height",
        label: "Height",
        helper: "Override height for 3D view (leave empty to use default card wall height)",
        selector: {
          number: { min: 0, max: To, step: 1, mode: "slider", unit_of_measurement: "px" }
        }
      },
      // Issue #182. A dropdown rather than a switch: a railing is one kind of
      // line that is not a wall, and open-plan dividers are the next one asked
      // about (#288).
      {
        name: "kind",
        label: "Kind",
        helper: (e.kind ?? "wall") === "railing" ? "Drawn thin; lamp light and sunlight carry on over it, and it seals off no dead space" : "A railing is the low edge of a balcony, terrace or gallery",
        selector: U(T("wall", "Wall"), T("railing", "Railing"))
      }
    ],
    data: {
      x1: Math.round(e.x1),
      y1: Math.round(e.y1),
      x2: Math.round(e.x2),
      y2: Math.round(e.y2),
      thickness: e.thickness ?? X,
      height: e.height,
      kind: e.kind ?? "wall"
    },
    // Keep the defaults out of the YAML so untouched walls stay terse.
    toPatch: (i) => {
      const n = { ...i };
      return "thickness" in i && i.thickness === X && (n.thickness = void 0), "height" in i && (i.height === void 0 || i.height === null || typeof i.height != "number") && (n.height = void 0), "kind" in i && (n.kind = i.kind === "railing" ? "railing" : void 0), n;
    }
  };
}
function Nb(e) {
  return {
    fields: [
      { name: "title", label: "Title", selector: { text: {} } },
      { name: "width", label: "Canvas width", required: !0, selector: { number: { min: 1, mode: "box" } } },
      { name: "height", label: "Canvas height", required: !0, selector: { number: { min: 1, mode: "box" } } },
      {
        name: "grid",
        label: "Grid size",
        required: !0,
        helper: `Gap between grid lines, in canvas units (canvas is ${e.width}×${e.height}). Smaller = finer grid.`,
        selector: { number: { min: 1, mode: "box" } }
      }
    ],
    data: { title: e.title ?? "", width: e.width, height: e.height, grid: e.grid ?? So },
    toPatch: It
  };
}
function jb(e) {
  return {
    fields: [
      {
        name: "pressEffect",
        label: "Press effect",
        helper: "Feedback when a device is pressed. Only devices that do something respond",
        selector: U(
          T("scale", "Press in"),
          T("ripple", "Ink ripple"),
          T("flash", "Flash"),
          T("none", "None")
        )
      }
    ],
    data: { pressEffect: ki(e) },
    // The default stays out of the YAML, as the skin's does.
    toPatch: (t) => "pressEffect" in t && t.pressEffect === es ? { ...t, pressEffect: void 0 } : t
  };
}
function Wb(e) {
  const t = e.historyReplay?.enabled ?? !1;
  return {
    fields: [
      {
        name: "historyReplayEnabled",
        label: "Enable history replay",
        helper: "Shows replay controls and loads mapped-entity history from Home Assistant",
        selector: { boolean: {} }
      }
    ],
    data: { historyReplayEnabled: t },
    toPatch: (i) => "historyReplayEnabled" in i ? i.historyReplayEnabled ? {
      historyReplay: {
        enabled: !0,
        lookbackSeconds: e.historyReplay?.lookbackSeconds,
        defaultSpeed: e.historyReplay?.defaultSpeed
      }
    } : { historyReplay: void 0 } : {}
  };
}
function Bb(e) {
  const t = vo(e.skin) ?? Ri[0];
  return {
    fields: [
      {
        name: "skin",
        label: "Skin",
        helper: t.description,
        selector: U(...Ri.map((i) => T(i.id, i.label)))
      }
    ],
    // An id we don't ship reads back as Default, matching what it renders as.
    data: { skin: t.id },
    toPatch: (i) => (
      // Default is the absence of a skin, so it stays out of the YAML.
      "skin" in i && i.skin === ln ? { ...i, skin: void 0 } : i
    )
  };
}
function Ub(e) {
  return {
    fields: [
      {
        name: "view",
        label: "View",
        helper: "3D shows standing walls and openings. Editing stays in 2D",
        selector: U(T("2d", "2D plan"), T("3d", "3D isometric"))
      },
      {
        name: "appearance",
        label: "Appearance",
        helper: "Line art uses crisp outlines on white while keeping devices and doors live",
        selector: U(T("normal", "Normal"), T("line-art", "Line art"))
      },
      {
        name: "showViewControls",
        label: "Show view controls",
        helper: "Switch 2D/3D, appearance and viewing direction directly on the card",
        selector: { boolean: {} }
      },
      {
        name: "showExport",
        label: "Allow SVG download",
        helper: "Optional download of a static line-art drawing",
        selector: { boolean: {} }
      },
      ...Qt(e.view ?? e.projection) === "iso" ? [
        {
          name: "wallHeight",
          label: "Wall height",
          helper: "Canvas units. Lower walls reveal more of each room",
          selector: { number: { min: 0, max: To, step: 1, mode: "slider" } }
        },
        {
          name: "wallOpacity",
          label: "Wall opacity",
          helper: "1 is solid; lower values reveal the floor behind walls",
          selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
        }
      ] : [],
      {
        name: "rotation",
        label: "Rotate display",
        helper: "Rotates the live card only — editing stays as drawn",
        selector: U(T("0", "0°"), T("90", "90°"), T("180", "180°"), T("270", "270°"))
      },
      // Per-orientation overrides (issue #237). Two dropdowns with a "same as
      // above" default rather than a switch plus two angles: the switch would
      // be a third control whose only job is to say whether the other two
      // count, and "same as above" says that per orientation and for free.
      {
        name: "rotationPortrait",
        label: "…on a portrait screen",
        helper: "Overrides the angle above while the screen is taller than it is wide",
        selector: U(
          T("", "Same as above"),
          T("0", "0°"),
          T("90", "90°"),
          T("180", "180°"),
          T("270", "270°")
        )
      },
      {
        name: "rotationLandscape",
        label: "…on a landscape screen",
        helper: "Overrides the angle above while the screen is wider than it is tall",
        selector: U(
          T("", "Same as above"),
          T("0", "0°"),
          T("90", "90°"),
          T("180", "180°"),
          T("270", "270°")
        )
      },
      {
        name: "overlayScale",
        label: "Badge & label size",
        // Canvas units lead because they are what a plan wants and what a new
        // plan is created with; fixed pixels are what an older plan is still
        // laid out in, and the right answer for a card shown bigger than its
        // canvas or a wall tablet that wants a px floor under its text.
        helper: `Canvas units scale badges and labels with the drawing. Fixed pixels keep their size whatever width the card gets — suits a card rendered larger than its ${e.width}-wide canvas, or a wall tablet`,
        selector: U(T("plan", "Canvas units"), T("fixed", "Fixed pixels"))
      },
      ...Vi(e.overlayScale) === "plan" ? [{
        name: "overlayMinWidth",
        label: "Stop shrinking below",
        helper: "Keeps badges and labels sized for at least this plan width. 0 allows normal scaling; larger values can cause overlaps on small cards",
        selector: { number: { min: 0, max: Gs, step: 20, mode: "slider", unit_of_measurement: "px" } }
      }] : [],
      {
        name: "compactHeader",
        label: "Compact header",
        // Says what it costs as well as what it saves — the title lands on the
        // drawing, and on a plan that fills the card that is a real trade.
        helper: "Draws the title inside the plan and the floor buttons in a row, instead of spending a header row on them",
        selector: { boolean: {} }
      },
      {
        name: "zoomedOverlayAuto",
        label: "Grow badges with the room",
        helper: "Badges and labels scale with the drawing while zoomed, so a focused room reads bigger without its devices crowding each other any worse than at full plan",
        selector: { boolean: {} }
      },
      ...e.zoomedOverlayScale === "auto" ? [] : [{
        name: "zoomedOverlayScale",
        label: "Zoomed badge size",
        helper: "Badges, labels and text while zoomed in to a room, as a multiple of their size at full plan. 1 keeps them the same",
        selector: { number: { min: 0.5, max: 3, step: 0.1, mode: "slider" } }
      }],
      {
        name: "roomFocusControls",
        label: "Room arrows",
        helper: "Previous/next controls that walk the zoom from room to room. They also let the arrow keys do it, which is otherwise impossible — a room that only zooms is not a tab stop",
        selector: { boolean: {} }
      },
      {
        name: "roomFocusInterval",
        label: "Cycle rooms every",
        helper: "Seconds on each room before moving to the next. 0 only ever moves when asked; any tap or key press starts the count again, so it never moves under someone using the card",
        selector: { number: { min: 0, max: Nl, step: 1, mode: "box", unit_of_measurement: "s" } }
      },
      {
        name: "offlineStyle",
        label: "Offline devices",
        helper: "How a device is drawn when its entity is unavailable or missing",
        selector: U(
          T("dim", "Dimmed"),
          T("strike", "Dimmed and crossed out"),
          T("none", "No different")
        )
      }
    ],
    data: {
      view: Qt(e.view ?? e.projection) === "iso" ? "3d" : "2d",
      appearance: Ii(e.appearance),
      showViewControls: e.showViewControls ?? !1,
      showExport: e.showExport ?? !1,
      wallHeight: De(e.wallHeight),
      wallOpacity: ws(e.wallOpacity),
      rotation: String($t(e.rotation)),
      // "" is "same as above" — the absence of an override, not an angle.
      // `== null` for the same reason resolvePlanRotation uses it: a key
      // written with no value (`rotationPortrait:`) parses to `null`, and
      // reading that as an angle would show 0° here — then write it into the
      // YAML as a real override the moment this panel is saved, turning a
      // stray empty key into an instruction the plan never had.
      rotationPortrait: e.rotationPortrait == null ? "" : String($t(e.rotationPortrait)),
      rotationLandscape: e.rotationLandscape == null ? "" : String($t(e.rotationLandscape)),
      overlayScale: Vi(e.overlayScale),
      overlayMinWidth: qi(e.overlayMinWidth) ?? 0,
      compactHeader: e.compactHeader ?? !1,
      zoomedOverlayAuto: e.zoomedOverlayScale === "auto",
      zoomedOverlayScale: typeof e.zoomedOverlayScale == "number" ? e.zoomedOverlayScale : Vn,
      roomFocusControls: rt(e.roomFocus)?.controls ?? !1,
      roomFocusInterval: (rt(e.roomFocus)?.intervalMs ?? 0) / 1e3,
      offlineStyle: Js(e)
    },
    toPatch: (t) => {
      let i = t;
      "view" in i && (i = { ...i, projection: void 0 }), "rotation" in i && (i = { ...i, rotation: i.rotation === "0" ? void 0 : Number(i.rotation) });
      for (const n of ["rotationPortrait", "rotationLandscape"])
        n in i && (i = { ...i, [n]: i[n] === "" ? void 0 : Number(i[n]) });
      if ("overlayMinWidth" in i && (i = { ...i, overlayMinWidth: qi(i.overlayMinWidth) }), "compactHeader" in i && !i.compactHeader && (i = { ...i, compactHeader: void 0 }), "offlineStyle" in i && i.offlineStyle === ts && (i = { ...i, offlineStyle: void 0 }), "zoomedOverlayScale" in i && i.zoomedOverlayScale === Vn && (i = { ...i, zoomedOverlayScale: void 0 }), "zoomedOverlayAuto" in i && (i = {
        ...i,
        zoomedOverlayScale: i.zoomedOverlayAuto ? "auto" : void 0,
        zoomedOverlayAuto: void 0
      }), "roomFocusControls" in i || "roomFocusInterval" in i) {
        const n = rt(e.roomFocus), o = "roomFocusControls" in i ? !!i.roomFocusControls : n?.controls ?? !1, r = "roomFocusInterval" in i ? Number(i.roomFocusInterval) : (n?.intervalMs ?? 0) / 1e3, a = Number.isFinite(r) && r > 0 ? r : 0, s = n?.rooms;
        i = {
          ...i,
          roomFocus: !o && !a ? void 0 : o && !a && !s?.length ? (
            // The plain case says so plainly.
            !0
          ) : { controls: o, ...a ? { interval: a } : {}, ...s?.length ? { rooms: s } : {} },
          roomFocusControls: void 0,
          roomFocusInterval: void 0
        };
      }
      return i;
    }
  };
}
function Vb(e) {
  return {
    fields: [
      {
        name: "showDeadSpaces",
        label: "Mark dead spaces",
        helper: "Hatches any space the walls close off that no door or window opens onto",
        selector: { boolean: {} }
      }
    ],
    data: { showDeadSpaces: e.showDeadSpaces ?? !1 },
    // Off is the default, so it stays out of the YAML until switched on.
    toPatch: (t) => "showDeadSpaces" in t && !t.showDeadSpaces ? { ...t, showDeadSpaces: void 0 } : t
  };
}
function qb(e) {
  const t = [
    {
      name: "sunDimming",
      label: "Follow the sun",
      helper: "Dims the plan at night, using your Home Assistant's own sunrise and sunset",
      selector: { boolean: {} }
    }
  ];
  return e.sunDimming && t.push(
    {
      name: "sunBrightnessMin",
      label: "Night brightness",
      selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
    },
    {
      name: "sunBrightnessMax",
      label: "Day brightness",
      selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
    }
  ), {
    fields: t,
    data: {
      sunDimming: e.sunDimming ?? !1,
      sunBrightnessMin: e.sunBrightnessMin ?? xo,
      sunBrightnessMax: e.sunBrightnessMax ?? Hi
    },
    // Off is the default, so keep the whole feature out of the YAML until it
    // is switched on — including the two sliders it drags along with it.
    toPatch: (i) => "sunDimming" in i && !i.sunDimming ? { ...i, sunDimming: void 0, sunBrightnessMin: void 0, sunBrightnessMax: void 0 } : i
  };
}
function Gb(e) {
  const t = [
    {
      name: "ambientDaylight",
      label: "Ambient daylight",
      helper: "Soft sky light through exterior windows and open or glazed doors, even when direct sun does not hit them",
      selector: { boolean: {} }
    },
    {
      name: "sunlight",
      label: "Let the sun in",
      helper: "Light through every window and open door; the rooms it never reaches go a shade darker",
      selector: { boolean: {} }
    }
  ];
  return e.sunlight && (t.push(
    {
      name: "north",
      label: "North",
      helper: "Which way north points on this plan, so the sun angle describes the house",
      selector: {
        number: { min: 0, max: 359, step: 1, mode: "slider", unit_of_measurement: "°" }
      }
    },
    {
      name: "sunShade",
      label: "Shade the rest",
      helper: "Darkens everywhere the light does not reach. Off shows the patches alone",
      selector: { boolean: {} }
    },
    {
      name: "sunReach",
      label: "Reach",
      helper: "How far a patch carries before it fades out, as a share of the plan's shorter side",
      selector: {
        number: { min: 0.05, max: 1, step: 0.01, mode: "slider" }
      }
    },
    {
      name: "sunFollows",
      label: "Follow the real sun",
      helper: "Swings through the day and goes out at night. Off keeps the light where you put it, always on",
      selector: { boolean: {} }
    }
  ), typeof e.sunBearing != "number" && t.push({
    name: "moonlight",
    label: "Moonlight",
    helper: "After dark the moon lets in its own cooler light, brighter the fuller it is",
    selector: { boolean: {} }
  }), typeof e.sunBearing == "number" && t.push({
    name: "sunBearing",
    label: "Sun from",
    helper: "Compass bearing of the light: 0 = north, 90 = east, 180 = south",
    selector: {
      number: { min: 0, max: 359, step: 5, mode: "slider", unit_of_measurement: "°" }
    }
  })), (e.ambientDaylight || e.sunlight && typeof e.sunBearing != "number") && t.push({
    name: "cloudCoverEntity",
    label: "Clouds",
    helper: "A weather entity, or a cloud cover sensor in %. Cloud thins the sunlight, and the sky light a little",
    selector: { entity: { filter: [{ domain: ["weather", "sensor"] }] } }
  }), {
    fields: t,
    data: {
      cloudCoverEntity: e.cloudCoverEntity ?? "",
      ambientDaylight: e.ambientDaylight ?? !1,
      sunlight: e.sunlight ?? !1,
      sunShade: e.sunShade ?? !0,
      north: e.north ?? 0,
      sunReach: e.sunReach ?? ii,
      sunFollows: typeof e.sunBearing != "number",
      moonlight: e.moonlight ?? !1,
      sunBearing: e.sunBearing ?? to
    },
    toPatch: (i) => {
      let n = { ...i };
      "ambientDaylight" in n && !n.ambientDaylight && (n = { ...n, ambientDaylight: void 0 });
      const o = "sunlight" in n ? !!n.sunlight : !!e.sunlight, r = "ambientDaylight" in n ? !!n.ambientDaylight : !!e.ambientDaylight, a = "sunFollows" in n ? !!n.sunFollows : typeof e.sunBearing != "number";
      return !r && !(o && a) && (n.cloudCoverEntity = void 0), "sunlight" in n && !n.sunlight ? {
        ...n,
        sunlight: void 0,
        north: void 0,
        sunBearing: void 0,
        sunReach: void 0,
        sunShade: void 0,
        sunlightColor: void 0,
        sunShadeColor: void 0,
        moonlight: void 0
      } : ("sunFollows" in n && (n.sunBearing = n.sunFollows ? void 0 : e.sunBearing ?? to, n.sunFollows || (n.moonlight = void 0), delete n.sunFollows), "north" in n && !n.north && (n.north = void 0), "sunReach" in n && n.sunReach === ii && (n.sunReach = void 0), "sunShade" in n && n.sunShade && (n.sunShade = void 0), "moonlight" in n && !n.moonlight && (n.moonlight = void 0), n);
    }
  };
}
function Kb(e) {
  const t = [
    { name: "image", label: "Bg image", helper: "/local/floorplan.png or URL", selector: { text: {} } }
  ];
  return e.image && (t.push({
    name: "imageFit",
    label: "Image fit",
    helper: "Per floor, so scans of different resolutions can each fit properly",
    selector: U(
      T("stretch", "Stretch to canvas (may distort)"),
      T("contain", "Fit inside (keep proportions)"),
      T("cover", "Fill canvas (keep proportions, crop)")
    )
  }), t.push({
    name: "imageOpacity",
    label: "Image opacity",
    selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
  })), {
    fields: t,
    data: {
      image: e.image ?? "",
      imageFit: e.imageFit ?? "stretch",
      imageOpacity: e.imageOpacity ?? 1
    },
    // "stretch" is the default, so keep it out of the YAML.
    toPatch: (i) => "imageFit" in i && i.imageFit === "stretch" ? { ...i, imageFit: void 0 } : i
  };
}
var Xb = Object.defineProperty, Yb = Object.getOwnPropertyDescriptor, D = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Yb(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Xb(t, i, o), o;
};
const Zb = (e) => e.label, Qb = (e) => e.helper, tt = {
  select: { icon: "mdi:cursor-default", label: "Select" },
  wall: { icon: "mdi:wall", label: "Wall" },
  door: { icon: "mdi:door", label: "Door" },
  // Two jambs and the span between them — which is all a passage is, and the
  // one number it is placed by (issue #309).
  passage: { icon: "mdi:arrow-expand-horizontal", label: "Passage" },
  window: { icon: "mdi:window-closed-variant", label: "Window" },
  // A roof seen from outside, which is the one thing in the icon set that says
  // "this is overhead" without saying "window" a second time — the two tools
  // sit next to each other and have to be told apart at a glance.
  skylight: { icon: "mdi:home-roof", label: "Skylight" },
  tracker: { icon: "mdi:crosshairs-gps", label: "Tracker" },
  area: { icon: "mdi:vector-polygon", label: "Area" }
}, wi = (e, t) => ({ x: e * 0.93, y: t * 0.08 }), Nn = 4, Jb = 200, ev = {
  wall: "mdi:wall",
  opening: "mdi:door",
  item: "mdi:lightbulb-outline",
  text: "mdi:format-text",
  furniture: "mdi:sofa-outline",
  tracker: "mdi:crosshairs-gps",
  area: "mdi:floor-plan"
}, La = 35, tv = 8, iv = 2e3, nv = 10;
function jn(e) {
  return e.some((t) => {
    const i = t, n = i.tagName?.toLowerCase();
    return n === "input" || n === "textarea" || n === "select" || n === "ha-form" || n === "ha-entity-picker" || n === "ha-icon-picker" || i.isContentEditable === !0;
  });
}
let z = class extends Ue {
  constructor() {
    super(...arguments), this._wallMaskId = `fp-edit-wall-mask-${z._nextWallMaskId++}`, this._watchedEntities = /* @__PURE__ */ new Set(), this._tool = "select", this._selection = [], this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaHover = null, this._areaDragStart = null, this._areaDragCurrent = null, this._areaDragTimer = null, this._areaDragMoved = !1, this._freeWalls = !1, this._defaultOpeningLength = 60, this._defaultSkylightLength = 70, this._defaultSkylightWidth = 44, this._marquee = null, this._history = [], this._future = [], this._zoom = 1, this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "", this._symbolDraft = "", this._symbolError = "", this._paletteError = "", this._projectOpen = !1, this._selectionPage = "properties", this._projectPage = "plan", this._mobileInspector = !1, this._previewCollapsed = !1, this._keyboardOpen = !1, this._fullscreen = !1, this._applyState = "idle", this._applyError = "", this._applyResetTimer = null, this._fitToViewport = !0, this._drag = null, this._dragMoves = new Aa(Ea, (e) => {
      this._drag && this._applyDrag(e);
    }), this._switcherMoves = new Aa(Ea, (e) => {
      this._switcherDrag && (this._config = {
        ...this._config,
        floorSwitcher: { ...this._config.floorSwitcher, x: e.x, y: e.y }
      });
    }), this._dragDirty = !1, this._pickAnchor = null, this._hideLabels = !1, this._pinchPts = /* @__PURE__ */ new Map(), this._pinch = null, this._gesturePointer = null, this._marqueeAdd = !1, this._clipboard = null, this._onKeyDown = (e) => this._handleKeyDown(e), this._onHostKeyDown = (e) => {
      e.key !== "Escape" || !this._fullscreen || jn(e.composedPath()) && (e.preventDefault(), e.stopPropagation(), this._canvasWrap?.focus({ preventScroll: !0 }));
    }, this._onFocusIn = (e) => {
      this._fullscreen && !e.composedPath().includes(this) && (this._fullscreen = !1), this._syncVisualViewport();
    }, this._syncVisualViewport = () => {
      const e = window.visualViewport, t = e?.scale === 1 ? e.height : window.innerHeight, i = e?.scale === 1 ? e.offsetTop : 0;
      this.style.setProperty("--editor-viewport-height", `${t}px`), this.style.setProperty("--editor-viewport-top", `${i}px`);
      let n = this.shadowRoot?.activeElement ?? null;
      const o = [];
      for (; n; )
        o.push(n), n = n.shadowRoot?.activeElement ?? null;
      this._keyboardOpen = window.innerHeight - t > 120 && jn(o);
    }, this._preventGesture = (e) => e.preventDefault(), this._onWrapPointerDown = (e) => {
      if (e.pointerType !== "touch" || (this._pinchPts.set(e.pointerId, { x: e.clientX, y: e.clientY }), this._pinchPts.size !== 2)) return;
      this._cancelGesture();
      const t = this._canvasWrap, i = t?.getBoundingClientRect(), [n, o] = [...this._pinchPts.values()];
      this._pinch = {
        d0: Math.max(Math.hypot(o.x - n.x, o.y - n.y), 1),
        z0: this._zoom,
        cx: (n.x + o.x) / 2 - (i?.left ?? 0) + (t?.scrollLeft ?? 0),
        cy: (n.y + o.y) / 2 - (i?.top ?? 0) + (t?.scrollTop ?? 0)
      }, e.stopPropagation();
    }, this._onWrapPointerMove = (e) => {
      if (!this._pinch || !this._pinchPts.has(e.pointerId) || (this._pinchPts.set(e.pointerId, { x: e.clientX, y: e.clientY }), this._pinchPts.size < 2)) return;
      e.preventDefault(), e.stopPropagation();
      const [t, i] = [...this._pinchPts.values()], n = this._pinch;
      this._setZoom(n.z0 * (Math.hypot(i.x - t.x, i.y - t.y) / n.d0)), this.updateComplete.then(() => {
        const o = this._canvasWrap;
        if (!o || this._pinch !== n) return;
        const r = o.getBoundingClientRect(), a = this._zoom / n.z0;
        o.scrollLeft = n.cx * a - ((t.x + i.x) / 2 - r.left), o.scrollTop = n.cy * a - ((t.y + i.y) / 2 - r.top);
      });
    }, this._onWrapPointerEnd = (e) => {
      e.pointerType === "touch" && (this._pinchPts.delete(e.pointerId), this._pinchPts.size < 2 && (this._pinch = null));
    }, this._liveEditKey = null, this._onEditorPointerDown = () => {
      this._liveEditKey = null;
    }, this._gridCache = null, this._onInspectorTabKeyDown = async (e) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      const t = e.key === "Home" ? !1 : e.key === "End" ? !0 : !this._projectOpen;
      this._setInspector(t), await this.updateComplete, this.renderRoot.querySelector(t ? "#project-tab" : "#selection-tab")?.focus();
    }, this._apply = async () => {
      if (this._applyState === "saving") return;
      this._applyResetTimer !== null && clearTimeout(this._applyResetTimer), this._applyState = "saving", this._applyError = "", await this.updateComplete, await new Promise((t) => setTimeout(t, 0));
      const e = await kb(this);
      if (!e.ok) {
        this._applyState = "idle", this._applyError = e.error;
        return;
      }
      this._applyState = "saved", this._applyResetTimer = setTimeout(() => {
        this._applyResetTimer = null, this._applyState = "idle";
      }, iv);
    }, this._onSwitcherDown = (e) => {
      if (this._tool !== "select" || e.button !== 0 || this._gesturePointer !== null) return;
      e.stopPropagation(), e.preventDefault(), this._canvasWrap?.focus({ preventScroll: !0 });
      const t = e.currentTarget;
      this._switcherDrag = {
        pointerId: e.pointerId,
        handle: t,
        moved: !1,
        at: this._toVirtual(e, !1),
        before: this._config,
        priorFuture: this._future
      }, this._gesturePointer = e.pointerId, this._capturePointer(e, t);
    }, this._onSwitcherMove = (e) => {
      const t = this._switcherDrag;
      if (!t || t.pointerId !== e.pointerId) return;
      if (e.stopPropagation(), e.buttons === 0) {
        this._forgetSwitcherTouch(e), this._cancelGesture();
        return;
      }
      const i = this._toVirtual(e, !1);
      !t.moved && Math.hypot(i.x - t.at.x, i.y - t.at.y) <= Nn || (t.moved || (t.priorHistory = this._history, this._pushHistory(), t.moved = !0), this._switcherMoves.push(this._toVirtual(e)));
    }, this._onSwitcherUp = (e) => {
      const t = this._switcherDrag;
      !t || t.pointerId !== e.pointerId || (e.stopPropagation(), this._forgetSwitcherTouch(e), this._releasePointer(e, t.handle), t.moved && this._switcherMoves.push(this._toVirtual(e)), this._switcherMoves.settle(), this._switcherDrag = void 0, this._gesturePointer = null, t.moved && this._emit(this._config));
    }, this._onSwitcherCancel = (e) => {
      const t = this._switcherDrag;
      !t || t.pointerId !== e.pointerId || (e.stopPropagation(), this._forgetSwitcherTouch(e), this._releasePointer(e, t.handle), this._rollBackSwitcherDrag());
    }, this._addSymbol = () => {
      let e;
      try {
        e = JSON.parse(this._symbolDraft);
      } catch (n) {
        this._symbolError = `Not valid JSON — ${n.message}`;
        return;
      }
      const t = [], i = mn(e, void 0, t);
      if (!i) {
        this._symbolError = t[0] ?? "Not a usable symbol.";
        return;
      }
      this._patchConfig({ symbols: { ...this._config.symbols ?? {}, [i.id]: e } }), this._symbolDraft = "", this._symbolError = "";
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._canvasWrap && this._canvasResize?.observe(this._canvasWrap), window.addEventListener("keydown", this._onKeyDown, !0), this.addEventListener("keydown", this._onHostKeyDown), window.addEventListener("focusin", this._onFocusIn), window.visualViewport?.addEventListener("resize", this._syncVisualViewport), window.visualViewport?.addEventListener("scroll", this._syncVisualViewport), window.addEventListener("resize", this._syncVisualViewport), this._syncVisualViewport();
    const e = this.renderRoot;
    e.addEventListener("pointermove", this._onSwitcherMove, !0), e.addEventListener("pointerup", this._onSwitcherUp, !0), e.addEventListener("pointercancel", this._onSwitcherCancel, !0);
  }
  disconnectedCallback() {
    this._numberDraft = void 0, this._canvasResize?.disconnect(), window.removeEventListener("keydown", this._onKeyDown, !0), this.removeEventListener("keydown", this._onHostKeyDown), window.removeEventListener("focusin", this._onFocusIn), window.visualViewport?.removeEventListener("resize", this._syncVisualViewport), window.visualViewport?.removeEventListener("scroll", this._syncVisualViewport), window.removeEventListener("resize", this._syncVisualViewport);
    const e = this.renderRoot;
    e.removeEventListener("pointermove", this._onSwitcherMove, !0), e.removeEventListener("pointerup", this._onSwitcherUp, !0), e.removeEventListener("pointercancel", this._onSwitcherCancel, !0), this._applyResetTimer !== null && clearTimeout(this._applyResetTimer), this._clearAreaDragTimer(), this._areaDragStart = null, this._areaDragCurrent = null, this._areaDragMoved = !1, this._dragMoves.cancel(), this._flushDrag(), this._drag = null, this._switcherMoves.settle(), this._switcherDrag?.moved && this._emit(this._config), this._switcherDrag = void 0, this._gesturePointer = null, this._resetPinch(), super.disconnectedCallback();
  }
  setConfig(e) {
    Va(e);
    const t = { ...td(e.type || "custom:easy-floorplan-card"), ...e }, i = Ce(t).map((n) => structuredClone(n));
    this._config = {
      ...t,
      floors: i,
      walls: [],
      openings: [],
      items: [],
      texts: [],
      furniture: [],
      trackers: []
    }, (!this._activeFloorId || !i.some((n) => n.id === this._activeFloorId)) && (this._activeFloorId = t.defaultFloor && i.some((n) => n.id === t.defaultFloor) ? t.defaultFloor : i[0].id), this._lastEmitted && e !== this._lastEmitted && !qn(e, this._lastEmitted) && (this._history = [], this._future = [], this._liveEditKey = null), this._watchedEntities = yt(this._config);
  }
  /**
   * HA replaces `hass` on every state change in the instance; the editor's
   * render is expensive (full SVG + panels). Skip ticks that can't change
   * anything we draw. Entity pickers keep the `hass` they last rendered with —
   * acceptable, the registry data they browse changes rarely.
   */
  shouldUpdate(e) {
    if (!(e.size === 1 && e.has("hass"))) return !0;
    const t = e.get("hass");
    if (!t || !this.hass) return !0;
    const i = (n) => n.floors;
    return i(t) !== i(this.hass) ? !0 : Is(t, this.hass, this._watchedEntities);
  }
  // ---- active floor access -----------------------------------------------
  _floor() {
    const e = this._config.floors ?? [];
    return e.find((t) => t.id === this._activeFloorId) ?? e[0];
  }
  /**
   * The shipped symbol library with this config's own `symbols:` merged over
   * it (issue #90). Memoized on the config's identity inside `symbolCatalog`,
   * so calling it per cell in the picker costs one lookup.
   */
  _symbols() {
    return Wt(this._config.symbols);
  }
  /** Discrete change to the active floor's elements (snapshots for undo). */
  _commitFloor(e) {
    this._commit({ ...this._config, floors: this._patchFloors(e) });
  }
  /** Live change to the active floor's elements (no history snapshot — for dragging). */
  _emitFloor(e) {
    const t = { ...this._config, floors: this._patchFloors(e) };
    if (this._drag) {
      this._config = t, this._watchedEntities = yt(t), this._dragDirty = !0;
      return;
    }
    this._emit(t);
  }
  /** Hand the host what a drag accumulated — once, on release. */
  _flushDrag() {
    this._dragDirty && (this._dragDirty = !1, this._emit(this._config));
  }
  _patchFloors(e) {
    const t = this._config.floors ?? [], i = t.find((n) => n.id === this._activeFloorId) ?? t[0];
    return t.map((n) => i && n.id === i.id ? { ...n, ...e } : n);
  }
  firstUpdated() {
    this._ensureHaComponents(), this._canvasWrap && typeof ResizeObserver < "u" && (this._canvasResize = new ResizeObserver(() => {
      const t = this.renderRoot.querySelector(".side"), i = this._mobileInspector && !this._projectOpen && this._primary() && t && this._canvasWrap && t.getBoundingClientRect().top >= this._canvasWrap.getBoundingClientRect().bottom;
      this._fitToViewport && this._gesturePointer === null && !i && this._fitView(), this.updateComplete.then(() => this._keepSelectionInPreview());
    }), this._canvasResize.observe(this._canvasWrap));
    for (const t of [
      "ha-form",
      "ha-entity-picker",
      "ha-entity-attribute-picker",
      "ha-icon-picker",
      "ha-combo-box"
    ])
      customElements.get(t) || customElements.whenDefined(t).then(() => this.requestUpdate());
    const e = this._canvasWrap;
    if (e) {
      e.addEventListener("pointerdown", this._onWrapPointerDown, { capture: !0 }), e.addEventListener("pointermove", this._onWrapPointerMove, { capture: !0 }), e.addEventListener("pointerup", this._onWrapPointerEnd, { capture: !0 }), e.addEventListener("pointercancel", this._onWrapPointerEnd, { capture: !0 });
      for (const t of ["gesturestart", "gesturechange", "gestureend"])
        e.addEventListener(t, this._preventGesture);
    }
  }
  /**
   * Defensive pinch-state reset (review feedback on #57). The listeners
   * themselves stay attached on purpose: they live on an element inside our
   * own shadow root (no leak — they die with the instance), and HA's dialog
   * reparents the editor, which fires disconnected/connected without a second
   * firstUpdated — removing them here would permanently kill pinch after a
   * reparent. Clearing the *points* is what matters: a pointerup lost to the
   * reparent would leave a stale entry behind, and the next single tap would
   * read as a phantom second finger.
   */
  _resetPinch() {
    this._pinchPts.clear(), this._pinch = null;
  }
  willUpdate(e) {
    const t = e.get("_config");
    if (t && this._fitToViewport && (t.width !== this._config.width || t.height !== this._config.height) && this._fitView(), e.has("_selection")) {
      const i = e.get("_selection") ?? [], n = (o) => o.map((r) => `${r.kind}:${r.id}`).join(",");
      n(i) !== n(this._selection) && (this._numberDraft = void 0, this._selectionPage = "properties", this._selection.length ? this._projectOpen = !1 : i.length && !this._projectOpen && (this._mobileInspector = !1));
    }
  }
  /**
   * Promote the expanded editor into the top layer. `position: fixed` alone is
   * not enough: HA's edit dialog puts a `transform` on its surface to offset
   * the safe areas, and any transform makes that surface the containing block
   * for fixed descendants — so a "full-viewport" overlay would fill the narrow
   * dialog instead. A popover escapes it. Collapsing drops the attribute, which
   * hides the popover on its own. Browsers without the API keep the fixed
   * fallback, which is already correct on the mobile dialog (transform: none).
   */
  updated() {
    if (!this._fullscreen) return;
    const e = this._editorEl;
    if (!(!e?.isConnected || typeof e.showPopover != "function") && !e.matches(":popover-open"))
      try {
        e.showPopover();
      } catch {
      }
  }
  /**
   * `ha-form` and the pickers are only defined once HA loads an editor that
   * imports them. The button-card editor statically imports ha-form (and the
   * ui_action selector chain); the entities editor defines ha-entity-picker
   * for the custom tracker rows. Every selector rendered by ha-form
   * lazy-loads its own picker after that.
   */
  async _ensureHaComponents() {
    if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
    const e = await window.loadCardHelpers?.();
    if (e) {
      for (const t of [{ type: "button" }, { type: "entities", entities: [] }])
        try {
          await (await e.createCardElement(t))?.constructor?.getConfigElement?.();
        } catch {
        }
      this.requestUpdate();
    }
  }
  get grid() {
    return this._config.grid ?? So;
  }
  /**
   * Resolved placement snap step. `snap` is tri-state in the config: unset
   * means "follow the grid" (the default behaviour), `0` is free placement,
   * any other number is a custom step. See {@link resolveSnap}.
   */
  get _resolvedSnap() {
    return Yc(this._config.snap, this.grid);
  }
  /** Which radio option the panel's "Snap to" control shows as active. */
  get _snapMode() {
    const e = this._config.snap;
    return e == null ? "grid" : e === 0 ? "off" : "custom";
  }
  _setSnapMode(e) {
    if (e === "grid")
      this._patchConfig({ snap: void 0 });
    else if (e === "off")
      this._patchConfig({ snap: 0 });
    else {
      const t = this._config.snap;
      this._patchConfig({
        snap: t && t > 0 ? t : Cn(_r, this.grid)
      });
    }
  }
  /** Grid update plus a custom-snap rescale so its percentage of the grid is preserved. */
  _gridPatch(e) {
    const t = { grid: e };
    if (this._snapMode === "custom") {
      const i = $r(this._config.snap, this.grid);
      t.snap = Cn(i, e);
    }
    return t;
  }
  _snap(e) {
    const t = this._resolvedSnap;
    return t > 0 ? Math.round(e / t) * t : e;
  }
  _toVirtual(e, t = !0) {
    const n = this._svg.getScreenCTM();
    if (!n) return { x: 0, y: 0 };
    const o = new DOMPoint(e.clientX, e.clientY).matrixTransform(n.inverse());
    return t ? { x: this._snap(o.x), y: this._snap(o.y) } : { x: o.x, y: o.y };
  }
  /** Nearest existing wall endpoint within ENDPOINT_SNAP, or null. */
  _nearestCorner(e, t) {
    return Rl(this._floor().walls, e, t, bt);
  }
  /** Snap a raw point to a nearby existing wall endpoint, else to the snap step. */
  _snapWallPoint(e, t) {
    return this._nearestCorner(e, t) ?? { x: this._snap(e), y: this._snap(t) };
  }
  /**
   * Snap a raw point for Area drawing/editing: nearby wall corner or another
   * Area's vertex wins (so adjacent rooms can share an exact boundary point),
   * else the grid/snap step. `exclude` drops one vertex from the candidate
   * set — the one currently being dragged, so it can't snap to itself.
   */
  _snapAreaPoint(e, t, i) {
    return xy(this._floor(), e, t, bt, i) ?? {
      x: this._snap(e),
      y: this._snap(t)
    };
  }
  /**
   * Like {@link _snapWallPoint}, but ignores endpoints in `moving` (keys
   * `${wallId}:${end}`) — the corner cluster being dragged must not attract
   * itself.
   */
  _snapWallPointExcluding(e, t, i) {
    let n = null, o = bt;
    for (const r of this._floor().walls)
      for (const a of [1, 2]) {
        if (i.has(`${r.id}:${a}`)) continue;
        const s = a === 1 ? r.x1 : r.x2, l = a === 1 ? r.y1 : r.y2, c = Math.hypot(e - s, t - l);
        c < o && (o = c, n = { x: s, y: l });
      }
    return n ?? { x: this._snap(e), y: this._snap(t) };
  }
  /** See {@link snapWallEnd}: corners win, then axis gravity, then the snap step. */
  _snapWallEnd(e, t, i, n) {
    return $y(
      this._floor().walls,
      e,
      t,
      i,
      n,
      (o) => this._snap(o),
      this._freeWalls,
      nv,
      bt
    );
  }
  _emit(e) {
    this._drag && (this._drag.emitted = !0), this._config = e, this._watchedEntities = yt(e);
    const t = { ...e };
    for (const i of ["walls", "openings", "items", "texts", "furniture", "trackers", "areas"])
      t[i]?.length || delete t[i];
    this._lastEmitted = structuredClone(t), this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: t }, bubbles: !0, composed: !0 })
    );
  }
  _pushHistory(e = null) {
    this._history = [...this._history, structuredClone(this._config)].slice(-60), this._future = [], this._liveEditKey = e;
  }
  /** Discrete change: snapshot for undo, then emit. */
  _commit(e) {
    this._pushHistory(), this._emit(e);
  }
  _undo() {
    if (this._liveEditKey = null, !this._history.length) return;
    this._future = [structuredClone(this._config), ...this._future];
    const e = this._history[this._history.length - 1];
    this._history = this._history.slice(0, -1), this._restoreHistory(e);
  }
  _redo() {
    if (this._liveEditKey = null, !this._future.length) return;
    this._history = [...this._history, structuredClone(this._config)];
    const e = this._future[0];
    this._future = this._future.slice(1), this._restoreHistory(e);
  }
  /** Keep property edits in context, but never retain an object removed by undo. */
  _restoreHistory(e) {
    const t = e.floors?.find((i) => i.id === this._activeFloorId);
    this._selection = t ? this._selection.filter((i) => Go(t, i)) : [], this._emit(e);
  }
  // ---- selection ----------------------------------------------------------
  /** The element whose properties show in the panel (the most recent selection). */
  _primary() {
    return this._selection[this._selection.length - 1] ?? null;
  }
  _selectOne(e) {
    this._selection = [e], this._liveEditKey = null;
  }
  _toggleSel(e) {
    this._selection = this._isSel(e.kind, e.id) ? this._selection.filter((t) => !(t.kind === e.kind && t.id === e.id)) : [...this._selection, e], this._liveEditKey = null;
  }
  _clearSel() {
    this._selection = [], this._liveEditKey = null;
  }
  /** Pointer-driven selection: modifier toggles; plain click selects unless already in the set. */
  _selectForPointer(e, t) {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      this._toggleSel(t);
      return;
    }
    this._isSel(t.kind, t.id) || this._selectOne(t);
  }
  _idsOfKind(e) {
    return new Set(this._selection.filter((t) => t.kind === e).map((t) => t.id));
  }
  _mergeSel(e, t) {
    const i = [...e];
    for (const n of t) i.some((o) => o.kind === n.kind && o.id === n.id) || i.push(n);
    return i;
  }
  // ---- keyboard nudging ---------------------------------------------------
  _handleKeyDown(e) {
    const t = this.checkVisibility;
    if (t && !t.call(this)) return;
    const i = e.composedPath();
    if (!i.includes(this)) {
      this._fullscreen && e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), this._fullscreen = !1);
      return;
    }
    if (jn(i) || i.some((c) => c instanceof Element && c.getAttribute("role") === "tab") && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const n = e.ctrlKey || e.metaKey, o = e.key.toLowerCase(), r = !!(this._drag || this._draft || this._draftTracker || this._draftArea || this._marquee || // The switcher's drag is a gesture like any other (issue #281): an undo
    // or a nudge landing mid-drag would interleave with its history snapshot
    // and its eventual emit.
    this._switcherDrag);
    if (e.key === "Backspace" && this._draftArea?.points.length) {
      e.preventDefault();
      const c = this._draftArea.points.slice(0, -1);
      this._draftArea = c.length ? { points: c } : null;
      return;
    }
    if (r && e.key !== "Escape" && !(n && o === "c")) return;
    if (n && o === "c") {
      this._selection.length && (e.preventDefault(), this._copy());
      return;
    }
    if (n && o === "v") {
      this._clipboard && (e.preventDefault(), this._paste());
      return;
    }
    if (n && o === "d") {
      this._selection.length && (e.preventDefault(), this._duplicate());
      return;
    }
    if (n && o === "z") {
      e.preventDefault(), e.shiftKey ? this._redo() : this._undo();
      return;
    }
    if (n && o === "y") {
      e.preventDefault(), this._redo();
      return;
    }
    if (e.key === "Escape") {
      if (this._floorMenuOpen || this._addMenuOpen) {
        e.preventDefault(), e.stopPropagation(), this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "";
        return;
      }
      this._draft || this._draftTracker || this._draftArea || this._marquee || this._drag || this._switcherDrag ? (e.preventDefault(), e.stopPropagation(), this._cancelGesture()) : this._selection.length ? (e.preventDefault(), e.stopPropagation(), this._clearSel()) : this._fullscreen && (e.preventDefault(), e.stopPropagation(), this._fullscreen = !1);
      return;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && this._selection.length) {
      e.preventDefault(), this._deleteSelected();
      return;
    }
    if (!this._selection.length) return;
    const s = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1]
    }[e.key];
    if (!s) return;
    e.preventDefault();
    const l = e.shiftKey ? this.grid : this._resolvedSnap || 1;
    this._nudge(s[0] * l, s[1] * l);
  }
  _nudge(e, t) {
    if (!this._selection.length) return;
    const i = this._floor();
    if (!Ty(i, this._selection).length) return;
    const n = (d) => {
      const h = this._idsOfKind(d);
      for (const u of h) fi(i, { kind: d, id: u }) && h.delete(u);
      return h;
    }, o = n("wall"), r = n("opening"), a = n("item"), s = n("text"), l = n("furniture"), c = n("tracker"), p = n("area");
    this._commitFloor({
      walls: i.walls.map(
        (d) => o.has(d.id) ? { ...d, x1: d.x1 + e, y1: d.y1 + t, x2: d.x2 + e, y2: d.y2 + t } : d
      ),
      openings: i.openings.map((d) => r.has(d.id) ? { ...d, x: d.x + e, y: d.y + t } : d),
      items: i.items.map((d) => a.has(d.id) ? { ...d, x: d.x + e, y: d.y + t } : d),
      texts: i.texts.map((d) => s.has(d.id) ? { ...d, x: d.x + e, y: d.y + t } : d),
      furniture: i.furniture.map(
        (d) => l.has(d.id) ? { ...d, x: d.x + e, y: d.y + t } : d
      ),
      trackers: (i.trackers ?? []).map(
        (d) => c.has(d.id) ? { ...d, x: d.x + e, y: d.y + t } : d
      ),
      areas: (i.areas ?? []).map(
        (d) => p.has(d.id) ? { ...d, points: d.points.map((h) => ({ x: h.x + e, y: h.y + t })) } : d
      )
    });
  }
  // ---- canvas (SVG) pointer handling: drawing walls/openings -------------
  /**
   * Best-effort pointer capture. `setPointerCapture` throws NotFoundError when
   * the pointer id isn't active (synthetic events, or HA's dialog re-targeting
   * the pointer), which would abort the rest of the calling handler — we hit
   * exactly that with the tracker tool's drag-to-draw. Capture is an
   * enhancement (smooth dragging past the canvas edge), never a requirement,
   * so failures are safe to swallow.
   */
  _capturePointer(e, t = e.target) {
    try {
      t?.setPointerCapture?.(e.pointerId);
    } catch {
    }
  }
  /** Best-effort release; pointerup releases capture implicitly anyway. */
  _releasePointer(e, t = e.target) {
    try {
      t?.releasePointerCapture?.(e.pointerId);
    } catch {
    }
  }
  _onCanvasDown(e) {
    if (e.button !== 0 || this._gesturePointer !== null) return;
    this._canvasWrap?.focus({ preventScroll: !0 });
    const t = this._toVirtual(e, !1);
    if (this._tool === "wall") {
      const i = this._freeWalls ? { x: this._snap(t.x), y: this._snap(t.y) } : this._snapWallPoint(t.x, t.y);
      this._draft = { x1: i.x, y1: i.y, x2: i.x, y2: i.y }, this._gesturePointer = e.pointerId, this._capturePointer(e);
      return;
    }
    if (this._tool === "door" || this._tool === "passage" || this._tool === "window" || this._tool === "skylight") {
      this._addOpening(this._tool, this._snap(t.x), this._snap(t.y));
      return;
    }
    if (this._tool === "tracker") {
      const i = this._snap(t.x), n = this._snap(t.y);
      this._draftTracker = { x0: i, y0: n, x1: i, y1: n }, this._gesturePointer = e.pointerId, this._capturePointer(e);
      return;
    }
    if (this._tool === "area") {
      const i = this._snapAreaPoint(t.x, t.y);
      if (this._draftArea) {
        this._addAreaPoint(i), this._areaHover = null;
        return;
      }
      this._areaDragStart = { x: i.x, y: i.y }, this._areaDragCurrent = null, this._areaDragMoved = !1, this._gesturePointer = e.pointerId, this._capturePointer(e);
      return;
    }
    this._pickAnchor = null, this._marqueeAdd = e.shiftKey || e.ctrlKey || e.metaKey, this._marquee = { x0: t.x, y0: t.y, x1: t.x, y1: t.y }, this._gesturePointer = e.pointerId, this._capturePointer(e);
  }
  /**
   * Abort any in-progress gesture. A moved drag is rolled back to the exact
   * pre-drag config (restoring wall-snap angle changes too) and its own
   * history snapshot — matched by identity, in case something else pushed in
   * between — is dropped, so a canceled drag leaves no trace in undo.
   */
  _cancelGesture() {
    this._rollBackSwitcherDrag(), this._dragMoves.cancel(), this._dragDirty = !1, this._gesturePointer = null, this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaDragStart = null, this._areaDragCurrent = null, this._clearAreaDragTimer(), this._areaDragMoved = !1, this._marquee = null;
    const e = this._drag;
    this._drag = null, e?.moved && e.snapshot && (this._history = e.priorHistory ?? this._history.filter((t) => t !== e.snapshot), e.emitted ? this._emit(e.snapshot) : (this._config = e.snapshot, this._watchedEntities = yt(e.snapshot)), this._future = e.priorFuture ?? []);
  }
  _onPointerCancel(e) {
    this._gesturePointer !== null && e.pointerId !== this._gesturePointer || this._cancelGesture();
  }
  /** True when this event belongs to a pointer other than the gesture's. */
  _foreignPointer(e) {
    return this._gesturePointer !== null && e.pointerId !== this._gesturePointer;
  }
  _onCanvasMove(e) {
    if (!this._foreignPointer(e)) {
      if (e.buttons === 0 && (this._drag || this._draft || this._draftTracker || this._marquee || this._areaDragStart)) {
        this._cancelGesture();
        return;
      }
      if (this._tool === "wall" && this._draft) {
        const t = this._toVirtual(e, !1), i = this._snapWallEnd(this._draft.x1, this._draft.y1, t.x, t.y);
        this._draft = { ...this._draft, x2: i.x, y2: i.y };
        return;
      }
      if (this._tool === "tracker" && this._draftTracker) {
        const t = this._toVirtual(e, !1);
        this._draftTracker = {
          ...this._draftTracker,
          x1: this._snap(t.x),
          y1: this._snap(t.y)
        };
        return;
      }
      if (this._tool === "area" && this._areaDragStart) {
        const t = this._toVirtual(e, !1), i = this._areaDragStart, n = { x: t.x, y: t.y };
        if (this._areaDragCurrent = n, this._areaDragMoved) {
          this._updateAreaRectangleDraft(n);
          return;
        }
        !this._areaDragMoved && this._areaDragTimer === null && Math.hypot(n.x - i.x, n.y - i.y) > Nn && (this._areaDragTimer = setTimeout(() => {
          this._areaDragTimer = null;
          const o = this._areaDragCurrent;
          if (!this._areaDragStart || !o) return;
          const r = { x: this._snap(o.x), y: this._snap(o.y) };
          r.x === i.x && r.y === i.y || (this._areaDragMoved = !0, this._updateAreaRectangleDraft(o));
        }, Jb));
        return;
      }
      if (this._tool === "area" && this._draftArea) {
        const t = this._toVirtual(e, !1);
        this._areaHover = this._snapAreaPoint(t.x, t.y);
        return;
      }
      if (this._marquee) {
        const t = this._toVirtual(e, !1);
        this._marquee = { ...this._marquee, x1: t.x, y1: t.y };
        return;
      }
      this._drag && this._dragMoves.push({ ...this._toVirtual(e, !1), altKey: e.altKey });
    }
  }
  _onCanvasUp(e) {
    if (!this._foreignPointer(e)) {
      if (this._dragMoves.settle(), this._gesturePointer = null, this._tool === "wall" && this._draft) {
        const t = this._draft;
        if (this._draft = null, t.x1 !== t.x2 || t.y1 !== t.y2) {
          const i = { id: ae("wall"), ...t };
          this._commitFloor({ walls: [...this._floor().walls, i] }), this._selection = [{ kind: "wall", id: i.id }];
        }
        return;
      }
      if (this._tool === "tracker" && this._draftTracker) {
        const t = this._draftTracker;
        this._draftTracker = null, this._releasePointer(e);
        const i = Math.min(t.x0, t.x1), n = Math.min(t.y0, t.y1), o = Math.abs(t.x1 - t.x0), r = Math.abs(t.y1 - t.y0);
        o >= this.grid / 2 && r >= this.grid / 2 && this._addTracker(i, n, o, r);
        return;
      }
      if (this._tool === "area" && this._areaDragStart) {
        const t = this._areaDragStart, i = this._areaDragMoved, n = this._draftArea;
        if (this._clearAreaDragTimer(), this._areaDragStart = null, this._areaDragCurrent = null, this._areaDragMoved = !1, this._releasePointer(e), i && n) {
          const o = Math.abs(n.points[1].x - n.points[0].x), r = Math.abs(n.points[3].y - n.points[0].y);
          if (o > 0 && r > 0) {
            const a = Fn(n.points, this._floor().areas ?? [], { dx: 0, dy: 0 });
            if (!pi(a) || (this._floor().areas ?? []).some((l) => this._rectAreasOverlap({ id: "draft-area", points: a, showName: !0 }, l))) {
              this._draftArea = null;
              return;
            }
            const s = { id: ae("area"), points: a, showName: !0 };
            this._commitFloor({ areas: [...this._floor().areas ?? [], s] }), this._selection = [{ kind: "area", id: s.id }], this._tool = "select";
          }
          this._draftArea = null;
          return;
        }
        this._addAreaPoint(t);
        return;
      }
      if (this._marquee) {
        const t = this._marquee;
        if (this._marquee = null, this._releasePointer(e), !(Math.hypot(t.x1 - t.x0, t.y1 - t.y0) > 4)) {
          this._marqueeAdd || this._clearSel();
          return;
        }
        const n = this._elementsInRect(t);
        this._selection = this._marqueeAdd ? this._mergeSel(this._selection, n) : n, this._liveEditKey = null;
        return;
      }
      this._drag && (this._drag = null, this._releasePointer(e), this._flushDrag());
    }
  }
  /** All active-floor elements whose center lies inside the marquee rect. */
  _elementsInRect(e) {
    return ky(this._floor(), e);
  }
  // ---- dragging existing elements ----------------------------------------
  /**
   * Which element a plain click should actually select (issue #52). The
   * element whose hit area received the event is only a starting point: a big
   * tracker zone or an Area polygon can sit over a device, so we hit-test the
   * point geometrically and take the most *specific* candidate. Clicking again
   * without moving steps to the next candidate underneath and wraps, which is
   * what makes buried elements reachable at all.
   *
   * Modifier-clicks (multi-select) and explicit handles keep their old
   * behavior — they address one element on purpose.
   */
  _resolvePick(e, t) {
    if (e.shiftKey || e.ctrlKey || e.metaKey) return t;
    const i = this._toVirtual(e, !1), n = Ay(this._floor(), i.x, i.y, {
      itemSize: je,
      textSize: jt,
      wallThickness: X,
      hass: this.hass
    }), o = !!this._pickAnchor && Math.hypot(e.clientX - this._pickAnchor.clientX, e.clientY - this._pickAnchor.clientY) <= tv;
    return this._pickAnchor = { clientX: e.clientX, clientY: e.clientY }, Cy(n, this._selection, o) ?? t;
  }
  _startDrag(e, t, i, n, o, r) {
    if (this._tool !== "select" || (e.stopPropagation(), this._gesturePointer !== null)) return;
    this._canvasWrap?.focus({ preventScroll: !0 });
    const a = i != null || n != null || o != null || r != null, s = a ? t : this._resolvePick(e, t);
    a ? this._selectOne(s) : this._selectForPointer(e, s), !fi(this._floor(), s) && (this._drag = {
      primary: s,
      start: this._toVirtual(e, !1),
      orig: this._snapshotSelection(),
      endpoint: i,
      areaVertex: n,
      areaEdge: o,
      stripEnd: r
    }, s.kind === "wall" && (this._drag.attached = this._attachedCorners(s.id, i)), r && s.kind === "item" && (this._drag.stripAutoSide = this._floor().items.find((l) => l.id === s.id)?.stripSide === void 0), this._gesturePointer = e.pointerId, this._capturePointer(e));
  }
  /** See {@link attachedCorners}: shared room corners that stretch with this wall. */
  _attachedCorners(e, t) {
    return vy(this._floor().walls, e, t);
  }
  /** Capture the start positions of every selected element on the active floor. */
  _snapshotSelection() {
    const e = this._floor(), t = /* @__PURE__ */ new Map();
    for (const i of this._selection)
      if (!fi(e, i))
        if (i.kind === "wall") {
          const n = e.walls.find((o) => o.id === i.id);
          n && t.set(`wall:${n.id}`, { kind: "wall", x1: n.x1, y1: n.y1, x2: n.x2, y2: n.y2 });
        } else if (i.kind === "opening") {
          const n = e.openings.find((o) => o.id === i.id);
          n && t.set(`opening:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "item") {
          const n = e.items.find((o) => o.id === i.id);
          n && t.set(`item:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "text") {
          const n = e.texts.find((o) => o.id === i.id);
          n && t.set(`text:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "furniture") {
          const n = e.furniture.find((o) => o.id === i.id);
          n && t.set(`furniture:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "area") {
          const n = (e.areas ?? []).find((o) => o.id === i.id);
          n && t.set(`area:${n.id}`, { kind: "polygon", points: n.points.map((o) => ({ ...o })) });
        } else {
          const n = (e.trackers ?? []).find((o) => o.id === i.id);
          n && t.set(`tracker:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        }
    return t;
  }
  /**
   * Keep full-side-adjacent rectangle rooms synchronized while one side moves.
   *
   * Returns the updated `areas` array plus the ids of rooms that actually
   * coupled to the primary room during this move.
   */
  _coupleRectAreaSharedEdges(e, t, i, n, o) {
    let r = t;
    const a = t, s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
    for (const p of n) {
      if (p.id === e) continue;
      const d = s.get(p.id) ?? p.points;
      if (p.locked) continue;
      const h = gy(a, d, i, o);
      h && (r = h.points, s.set(p.id, h.other), l.add(p.id));
    }
    return {
      areas: n.map((p) => {
        if (p.id === e) return { ...p, points: r };
        const d = s.get(p.id);
        return d ? { ...p, points: d } : p;
      }),
      coupledIds: l
    };
  }
  _rectAreasOverlap(e, t) {
    const i = e.points.map((a) => a.x), n = e.points.map((a) => a.y), o = t.points.map((a) => a.x), r = t.points.map((a) => a.y);
    return Math.max(...i) > Math.min(...o) && Math.min(...i) < Math.max(...o) && Math.max(...n) > Math.min(...r) && Math.min(...n) < Math.max(...r);
  }
  /**
   * Limit a shared-edge resize against rooms that are not part of the current
   * shared component. A coupled neighbor can encounter a new room after the
   * drag starts, so clamping only the primary room is insufficient.
   */
  _coupledEdgeResize(e, t, i, n, o) {
    const r = this._coupleRectAreaSharedEdges(e, t.points, i, n, o);
    if (!r.coupledIds.size) return { ...r, delta: i };
    const a = /* @__PURE__ */ new Set([e, ...r.coupledIds]), s = n.filter((h) => !a.has(h.id)), l = (h) => h.areas.some(
      (u) => a.has(u.id) && (!pi(u.points) || s.some((f) => this._rectAreasOverlap(u, f)))
    );
    if (!l(r)) return { ...r, delta: i };
    let c = 0, p = 1;
    for (let h = 0; h < 18; h++) {
      const u = (c + p) / 2, f = { dx: i.dx * u, dy: i.dy * u }, g = this._coupleRectAreaSharedEdges(e, t.points, f, n, o);
      l(g) ? p = u : c = u;
    }
    const d = { dx: i.dx * c, dy: i.dy * c };
    return {
      ...this._coupleRectAreaSharedEdges(e, t.points, d, n, o),
      delta: d
    };
  }
  _applyDrag(e) {
    const t = this._drag;
    if (!t.moved) {
      if (Math.hypot(e.x - t.start.x, e.y - t.start.y) <= Nn) return;
      t.moved = !0, t.priorFuture = this._future, t.priorHistory = this._history, this._pushHistory(), t.snapshot = this._history[this._history.length - 1];
    }
    const i = this._floor();
    if (t.primary.kind === "item" && t.stripEnd) {
      const c = i.items.find((g) => g.id === t.primary.id), p = c ? st(c) : void 0;
      if (!c || !p) return;
      const d = t.stripEnd === 1 ? { x: p.x2, y: p.y2 } : { x: p.x1, y: p.y1 }, h = this._snapWallEnd(d.x, d.y, e.x, e.y);
      if (Math.hypot(h.x - d.x, h.y - d.y) < $o) return;
      const u = t.stripEnd === 1 ? [h.x, h.y, d.x, d.y] : [d.x, d.y, h.x, h.y], f = $m(...u);
      if (t.stripAutoSide) {
        const g = t.orig.get(`item:${c.id}`);
        f.stripSide = g?.kind === "pt" ? wy(i.walls, ...u, g, (y, b) => !!Rn(i, y, b)) : void 0;
      }
      this._emitFloor({ items: i.items.map((g) => g.id === c.id ? { ...g, ...f } : g) });
      return;
    }
    if (t.endpoint) {
      const c = e.altKey ? [] : t.attached ?? [], p = /* @__PURE__ */ new Set([
        `${t.primary.id}:${t.endpoint}`,
        ...c.map((u) => `${u.id}:${u.end}`)
      ]), d = this._snapWallPointExcluding(e.x, e.y, p), h = i.walls.map((u) => {
        let f = u;
        u.id === t.primary.id && (f = t.endpoint === 1 ? { ...f, x1: d.x, y1: d.y } : { ...f, x2: d.x, y2: d.y });
        for (const g of c)
          g.id === u.id && (f = g.end === 1 ? { ...f, x1: d.x, y1: d.y } : { ...f, x2: d.x, y2: d.y });
        return f;
      });
      this._emitFloor({ walls: h });
      return;
    }
    if (t.primary.kind === "area" && t.areaVertex != null) {
      const c = t.areaVertex, p = this._snapAreaPoint(e.x, e.y, { areaId: t.primary.id, vertexIndex: c }), d = (i.areas ?? []).find((y) => y.id === t.primary.id);
      let h = Ie(d.points) ? uy(d.points, c, p) : d.points.map((y, b) => b === c ? p : y);
      const u = { dx: p.x - d.points[c].x, dy: p.y - d.points[c].y }, f = Ie(d.points) ? [ze[(c + 3) % 4], ze[c]] : [];
      let g = { areas: i.areas ?? [], coupledIds: /* @__PURE__ */ new Set() };
      for (const y of f) {
        const b = this._coupleRectAreaSharedEdges(t.primary.id, d.points, u, g.areas, y);
        g = {
          areas: b.areas,
          coupledIds: /* @__PURE__ */ new Set([...g.coupledIds, ...b.coupledIds])
        };
      }
      if (Ie(d.points) && !pi(h)) {
        this._emitFloor({ areas: i.areas ?? [] });
        return;
      }
      this._emitFloor({
        areas: g.areas.map((y) => y.id === t.primary.id ? { ...y, points: h } : y)
      });
      return;
    }
    if (t.primary.kind === "area" && t.areaEdge != null) {
      const c = t.areaEdge, p = { x: this._snap(e.x), y: this._snap(e.y) }, d = (i.areas ?? []).find(($) => $.id === t.primary.id);
      let h = fy(d.points, c, p);
      const u = d.points[c % 4], f = d.points[(c + 1) % 4], g = Math.abs(u.y - f.y) < de, y = h[c % 4], b = g ? { dx: 0, dy: y.y - u.y } : { dx: y.x - u.x, dy: 0 }, k = this._coupledEdgeResize(
        t.primary.id,
        d,
        b,
        i.areas ?? [],
        ze[c]
      ), S = (k.areas ?? []).filter(
        ($) => $.id !== t.primary.id && !k.coupledIds.has($.id)
      ), x = k.coupledIds.size ? k.areas.find(($) => $.id === t.primary.id)?.points ?? h : h;
      if (h = Fn(
        x,
        S,
        k.delta
      ), !pi(h)) {
        this._emitFloor({ areas: i.areas ?? [] });
        return;
      }
      this._emitFloor({
        areas: k.areas.map(($) => $.id === t.primary.id ? { ...$, points: h } : $)
      });
      return;
    }
    if (this._selection.length === 1 && t.primary.kind === "opening" && !ie(
      i.openings.find((c) => c.id === t.primary.id) ?? { type: "door" }
    )) {
      const c = t.orig.get(`opening:${t.primary.id}`);
      if (c && c.kind === "pt") {
        const p = c.x + (e.x - t.start.x), d = c.y + (e.y - t.start.y), h = la(p, d, i.walls, La), u = i.openings.map(
          (f) => f.id === t.primary.id ? h ? { ...f, x: h.x, y: h.y, angle: h.angle } : { ...f, x: this._snap(p), y: this._snap(d) } : f
        );
        this._emitFloor({ openings: u });
        return;
      }
    }
    const n = t.orig.get(`${t.primary.kind}:${t.primary.id}`);
    if (!n) return;
    const o = n.kind === "wall" ? n.x1 : n.kind === "polygon" ? n.points[0].x : n.x, r = n.kind === "wall" ? n.y1 : n.kind === "polygon" ? n.points[0].y : n.y, a = this._snap(o + (e.x - t.start.x)) - o, s = this._snap(r + (e.y - t.start.y)) - r;
    let l = this._applyDelta(a, s, t.orig);
    if (t.attached?.length && !e.altKey) {
      const c = (l.walls ?? i.walls).map((p) => {
        let d = p;
        for (const h of t.attached)
          h.id !== p.id || t.orig.has(`wall:${h.id}`) || (d = h.end === 1 ? { ...d, x1: h.x0 + a, y1: h.y0 + s } : { ...d, x2: h.x0 + a, y2: h.y0 + s });
        return d;
      });
      l = { ...l, walls: c };
    }
    this._emitFloor(l);
  }
  /** Translate every snapshotted element by (dx, dy). */
  _applyDelta(e, t, i) {
    return Sy(this._floor(), e, t, i);
  }
  // ---- overlay drag for items & texts (HTML, not SVG) --------------------
  _onOverlayDown(e, t) {
    if (this._tool !== "select" || (e.stopPropagation(), e.preventDefault(), this._gesturePointer !== null)) return;
    this._canvasWrap?.focus({ preventScroll: !0 });
    const i = this._resolvePick(e, t);
    this._selectForPointer(e, i), this._drag = {
      primary: i,
      start: this._toVirtual(e, !1),
      orig: this._snapshotSelection()
    }, this._gesturePointer = e.pointerId, this._capturePointer(e, e.currentTarget);
  }
  _onOverlayMove(e) {
    if (!this._foreignPointer(e)) {
      if (e.buttons === 0 && this._drag) {
        this._cancelGesture();
        return;
      }
      this._drag && this._dragMoves.push({ ...this._toVirtual(e, !1), altKey: e.altKey });
    }
  }
  _onOverlayUp(e) {
    this._foreignPointer(e) || (this._dragMoves.settle(), this._gesturePointer = null, this._drag && (this._drag = null, this._releasePointer(e, e.currentTarget), this._flushDrag()));
  }
  // ---- element creation / mutation ---------------------------------------
  _addOpening(e, t, i) {
    const n = this._floor(), o = e === "skylight", r = o ? void 0 : la(t, i, n.walls, La), a = {
      id: ae(e),
      type: e,
      x: r?.x ?? t,
      y: r?.y ?? i,
      // User-editable from the door/window context bar so opening size can be
      // set BEFORE placing (the previous hardcoded 60 forced place-then-resize).
      length: o ? this._defaultSkylightLength : this._defaultOpeningLength,
      angle: r?.angle ?? 0,
      // Its second side, which only a skylight has. Written out rather than
      // left to the default so the very first drag of the Width field has
      // something to move, and so the plan says what it drew.
      ...o ? { width: this._defaultSkylightWidth } : {}
    };
    this._commitFloor({ openings: [...n.openings, a] }), this._selection = [{ kind: "opening", id: a.id }], this._tool = "select";
  }
  _addItem(e) {
    const t = {
      id: ae("item"),
      entity: "",
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      kind: e,
      showState: e === "sensor",
      showIcon: !0,
      size: je
    };
    this._commitFloor({ items: [...this._floor().items, t] }), this._selection = [{ kind: "item", id: t.id }], this._tool = "select";
  }
  _addFurniture(e) {
    const t = zr(e, this._symbols()), i = {
      id: ae("furn"),
      type: e,
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      w: t.w,
      h: t.h,
      angle: 0
    };
    this._commitFloor({ furniture: [...this._floor().furniture, i] }), this._selection = [{ kind: "furniture", id: i.id }], this._tool = "select";
  }
  /**
   * Drop a new Tracker on the active floor sized to the user's drag and
   * select it so the per-element editor (entity pickers + sensor ranges) is
   * immediately reachable. Tool switches back to Select so the user can
   * configure / move the new tracker without re-dragging.
   */
  _addTracker(e, t, i, n) {
    const o = {
      id: ae("tracker"),
      x: e,
      y: t,
      w: i,
      h: n,
      angle: 0,
      dotSize: ko
    };
    this._commitFloor({ trackers: [...this._floor().trackers ?? [], o] }), this._selection = [{ kind: "tracker", id: o.id }], this._tool = "select";
  }
  /** Close the in-progress Area draft into a committed polygon and select it. */
  _finishArea() {
    if (!this._draftArea || this._draftArea.points.length < 3) return;
    const e = { id: ae("area"), points: this._draftArea.points, showName: !0 };
    this._commitFloor({ areas: [...this._floor().areas ?? [], e] }), this._selection = [{ kind: "area", id: e.id }], this._draftArea = null, this._areaHover = null, this._tool = "select";
  }
  _clearAreaDragTimer() {
    this._areaDragTimer !== null && (clearTimeout(this._areaDragTimer), this._areaDragTimer = null);
  }
  _roomWallSegments(e) {
    return (e.areas ?? []).flatMap(
      (t) => Mn(t.id, t.points, t.sideWalls ?? {}).filter((i) => !i.divider)
    );
  }
  _updateAreaRectangleDraft(e) {
    const t = this._areaDragStart;
    if (!t) return;
    const i = { x: this._snap(e.x), y: this._snap(e.y) };
    this._draftArea = {
      points: Fn(
        Sn({ x0: t.x, y0: t.y, x1: i.x, y1: i.y }),
        this._floor().areas ?? [],
        { dx: i.x - t.x, dy: i.y - t.y }
      )
    };
  }
  /** Add one polygon vertex, or close the draft when clicking its start. */
  _addAreaPoint(e) {
    if (!this._draftArea) {
      this._draftArea = { points: [e] };
      return;
    }
    const t = this._draftArea.points, i = t[0];
    if (t.length >= 3 && Math.hypot(e.x - i.x, e.y - i.y) <= bt) {
      this._finishArea();
      return;
    }
    const n = t[t.length - 1];
    (e.x !== n.x || e.y !== n.y) && (this._draftArea = { points: [...t, e] });
  }
  _addText() {
    const e = {
      id: ae("text"),
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      text: "Label",
      size: jt
    };
    this._commitFloor({ texts: [...this._floor().texts, e] }), this._selection = [{ kind: "text", id: e.id }], this._tool = "select";
  }
  _deleteSelected() {
    if (!this._selection.length) return;
    const e = this._floor(), t = this._idsOfKind("wall"), i = this._idsOfKind("opening"), n = this._idsOfKind("item"), o = this._idsOfKind("text"), r = this._idsOfKind("furniture"), a = this._idsOfKind("tracker"), s = this._idsOfKind("area");
    this._commitFloor({
      walls: e.walls.filter((l) => !t.has(l.id)),
      openings: e.openings.filter((l) => !i.has(l.id)),
      items: e.items.filter((l) => !n.has(l.id)),
      texts: e.texts.filter((l) => !o.has(l.id)),
      furniture: e.furniture.filter((l) => !r.has(l.id)),
      trackers: (e.trackers ?? []).filter((l) => !a.has(l.id)),
      areas: (e.areas ?? []).filter((l) => !s.has(l.id))
    }), this._clearSel();
  }
  // ---- clipboard (copy / paste / duplicate) ------------------------------
  _copy() {
    if (!this._selection.length) return;
    const e = this._floor(), t = this._idsOfKind("wall"), i = this._idsOfKind("opening"), n = this._idsOfKind("item"), o = this._idsOfKind("text"), r = this._idsOfKind("furniture"), a = this._idsOfKind("tracker"), s = this._idsOfKind("area");
    this._clipboard = structuredClone({
      walls: e.walls.filter((l) => t.has(l.id)),
      openings: e.openings.filter((l) => i.has(l.id)),
      items: e.items.filter((l) => n.has(l.id)),
      texts: e.texts.filter((l) => o.has(l.id)),
      furniture: e.furniture.filter((l) => r.has(l.id)),
      trackers: (e.trackers ?? []).filter((l) => a.has(l.id)),
      areas: (e.areas ?? []).filter((l) => s.has(l.id))
    });
  }
  /** Paste the clipboard onto the active floor, offset by one snap step, with fresh ids. */
  _paste() {
    if (!this._clipboard) return;
    const e = structuredClone(this._clipboard), t = this._resolvedSnap || this.grid, i = this._floor(), n = { locked: void 0 }, o = e.walls.map((d) => ({
      ...d,
      ...n,
      id: ae("wall"),
      x1: d.x1 + t,
      y1: d.y1 + t,
      x2: d.x2 + t,
      y2: d.y2 + t
    })), r = e.openings.map((d) => ({
      ...d,
      ...n,
      id: ae(d.type),
      x: d.x + t,
      y: d.y + t
    })), a = e.items.map((d) => ({
      ...d,
      ...n,
      id: ae("item"),
      x: d.x + t,
      y: d.y + t
    })), s = e.texts.map((d) => ({
      ...d,
      ...n,
      id: ae("text"),
      x: d.x + t,
      y: d.y + t
    })), l = e.furniture.map((d) => ({
      ...d,
      ...n,
      id: ae("furn"),
      x: d.x + t,
      y: d.y + t
    })), c = (e.trackers ?? []).map((d) => ({
      ...d,
      ...n,
      id: ae("tracker"),
      x: d.x + t,
      y: d.y + t
    })), p = (e.areas ?? []).map((d) => ({
      ...d,
      ...n,
      id: ae("area"),
      points: d.points.map((h) => ({ x: h.x + t, y: h.y + t }))
    }));
    this._commitFloor({
      walls: [...i.walls, ...o],
      openings: [...i.openings, ...r],
      items: [...i.items, ...a],
      texts: [...i.texts, ...s],
      furniture: [...i.furniture, ...l],
      trackers: [...i.trackers ?? [], ...c],
      areas: [...i.areas ?? [], ...p]
    }), this._selection = [
      ...o.map((d) => ({ kind: "wall", id: d.id })),
      ...r.map((d) => ({ kind: "opening", id: d.id })),
      ...a.map((d) => ({ kind: "item", id: d.id })),
      ...s.map((d) => ({ kind: "text", id: d.id })),
      ...l.map((d) => ({ kind: "furniture", id: d.id })),
      ...c.map((d) => ({ kind: "tracker", id: d.id })),
      ...p.map((d) => ({ kind: "area", id: d.id }))
    ], this._tool = "select";
  }
  _duplicate() {
    this._copy(), this._paste();
  }
  /**
   * Pin (or release) every selected element (issue #191). One history entry
   * for the whole selection, since it is one press.
   *
   * `undefined` rather than `false` when releasing: unlocked is the default,
   * so a released element goes back to saying nothing about it rather than
   * leaving `locked: false` behind in the YAML.
   */
  _setLocked(e) {
    if (!this._selection.length) return;
    const t = this._floor(), i = e || void 0, n = (o, r) => {
      const a = this._idsOfKind(r);
      return o.map((s) => a.has(s.id) ? { ...s, locked: i } : s);
    };
    this._commitFloor({
      walls: n(t.walls, "wall"),
      openings: n(t.openings, "opening"),
      items: n(t.items, "item"),
      texts: n(t.texts, "text"),
      furniture: n(t.furniture, "furniture"),
      trackers: n(t.trackers ?? [], "tracker"),
      areas: n(t.areas ?? [], "area")
    });
  }
  // ---- floors -------------------------------------------------------------
  /** Add a floor that reuses the current floor's walls (fresh ids) and nothing else. */
  _addFloor() {
    const e = this._floor().walls.map((o) => ({ ...o, id: ae("wall") })), t = (this._config.floors?.length ?? 1) + 1, i = nd(`Floor ${t}`, e), n = [...this._config.floors ?? [], i];
    this._activeFloorId = i.id, this._clearSel(), this._commit({ ...this._config, floors: n });
  }
  _switchFloor(e) {
    e !== this._activeFloorId && (this._activeFloorId = e, this._clearSel());
  }
  /**
   * Move the active floor one step up/down the list (issue #66) — the safe
   * alternative to reordering floor blocks by hand in YAML. Commits through
   * history, so a mis-move is one Ctrl+Z away.
   */
  _moveFloor(e) {
    const t = ad(this._config.floors ?? [], this._activeFloorId, e);
    t && this._commit({ ...this._config, floors: t });
  }
  _renameFloor(e, t) {
    this._commit({
      ...this._config,
      floors: (this._config.floors ?? []).map((i) => i.id === e ? { ...i, name: t } : i)
    });
  }
  /**
   * Link the active floor to a Home Assistant floor (issue #24). Linking also
   * names the floor after the HA floor — the point of the association — while
   * a later manual rename sticks (we never re-sync silently). Unlinking keeps
   * the current name.
   */
  _linkHaFloor(e) {
    const t = kr(this.hass).find((i) => i.floor_id === e);
    this._commit({
      ...this._config,
      floors: (this._config.floors ?? []).map(
        (i) => i.id === this._activeFloorId ? { ...i, haFloor: t?.floor_id, ...t ? { name: t.name } : {} } : i
      )
    });
  }
  /** HA-floor link row for the floor gear popover; hidden when HA exposes no floors. */
  _renderHaFloorRow(e) {
    const t = kr(this.hass);
    return t.length ? v`
      <div class="pop-row">
        <label>HA floor</label>
        <select
          .value=${e?.haFloor ?? ""}
          @change=${(i) => this._linkHaFloor(i.target.value)}
        >
          <option value="" ?selected=${!e?.haFloor}>(not linked)</option>
          ${t.map(
      (i) => v`<option value=${i.floor_id} ?selected=${e?.haFloor === i.floor_id}>
                ${i.name}
              </option>`
    )}
        </select>
      </div>
    ` : v`${m}`;
  }
  _deleteFloor() {
    const e = this._config.floors ?? [];
    if (e.length <= 1) return;
    const t = e.findIndex((n) => n.id === this._activeFloorId), i = e.filter((n) => n.id !== this._activeFloorId);
    this._commit({ ...this._config, floors: i }), this._activeFloorId = i[Math.max(0, t - 1)].id, this._clearSel();
  }
  _updateWall(e, t) {
    this._commitFloor({
      walls: this._floor().walls.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateOpening(e, t) {
    this._commitFloor({
      openings: this._floor().openings.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateItem(e, t) {
    this._commitFloor({
      items: this._floor().items.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateText(e, t) {
    this._commitFloor({
      texts: this._floor().texts.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateFurniture(e, t) {
    this._commitFloor({
      furniture: this._floor().furniture.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateTracker(e, t) {
    this._commitFloor({
      trackers: (this._floor().trackers ?? []).map(
        (i) => i.id === e ? { ...i, ...t } : i
      )
    });
  }
  _updateArea(e, t) {
    this._commitFloor({
      areas: (this._floor().areas ?? []).map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  /** Drop the HA-area link but keep the name the user sees on the plan. */
  _unlinkHaArea(e) {
    this._updateArea(e, { haArea: void 0 });
  }
  /**
   * Status line under the Area's name field. The name doubles as the HA-area
   * link (see {@link areaNamePatch}), so the resulting association would
   * otherwise be invisible: this shows a "Linked" chip whenever `haArea` is
   * set, with an unlink button for the one intent the merged field can't
   * express — keeping the name while dropping the link.
   */
  _renderAreaLinkRow(e, t) {
    const i = e.haArea ? t.find((n) => n.area_id === e.haArea) : void 0;
    return v`
      <div class="row wide area-name-status">
        <label></label>
        ${e.haArea ? v`<span
              class="ha-link-chip"
              title=${`Linked to the Home Assistant area "${i?.name ?? e.haArea}"`}
            >
              <ha-icon icon="mdi:link-variant"></ha-icon>Linked
              <button
                class="unlink"
                title="Keep this name but unlink the Home Assistant area"
                @click=${() => this._unlinkHaArea(e.id)}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </span>` : v`<span class="hint"
              >${t.length ? "Name this room after a Home Assistant area to link it." : "No Home Assistant areas available."}</span
            >`}
      </div>
    `;
  }
  /**
   * The editor's colour control: a swatch that edits live as you drag, plus a
   * text box for theme variables and named colours, committed on change.
   * Emptying the text box clears the override.
   *
   * Every colour in this editor is one of these. It lived as eight copies of
   * the same markup before the colour rules below needed a ninth.
   */
  /**
   * The plan's named colours (issue #265), usable and deduped.
   */
  _palette() {
    return ni(this._config?.palette);
  }
  /**
   * The dropdown that puts a named colour into a colour field, or `nothing`
   * when the plan has no palette.
   *
   * Rendering nothing is the point of the empty case: a plan that never names a
   * colour should see the editor it saw before this feature existed, not a
   * dropdown with one greyed-out entry in it. The control appears the moment
   * the first name is added under Project and disappears with the last.
   *
   * Choosing a name stores a `var()` reference rather than the colour itself,
   * which is what makes the link live — see `src/palette.ts`. Choosing "Custom"
   * writes back the colour the name currently resolves to, so leaving the
   * palette breaks the link without changing what is on screen.
   */
  _renderPalettePicker(e, t) {
    const i = this._palette();
    if (!i.length) return m;
    const n = Ol(e), o = n && i.some((r) => ce(r.name) === n) ? n : void 0;
    return v`
      <select
        class="palette-pick"
        title="Use one of the plan's named colours"
        .value=${o ?? ""}
        @change=${(r) => {
      const a = r.target.value;
      if (!a) {
        o && t(Ci(e, i));
        return;
      }
      const s = i.find((l) => ce(l.name) === a);
      s && t(ha(s.name));
    }}
      >
        <option value="" ?selected=${!o}>Custom…</option>
        ${i.map(
      (r) => v`<option
            value=${ce(r.name)}
            ?selected=${ce(r.name) === o}
          >
            ${r.name}
          </option>`
    )}
      </select>
    `;
  }
  /**
   * What an `<input type="color">` should show for a stored value: the literal
   * colour a palette reference names, since the swatch cannot resolve a var()
   * and would sit on black instead.
   */
  _swatchValue(e, t) {
    const i = Ci(e, this._config?.palette);
    return typeof i == "string" && i ? i : t;
  }
  _renderColorRow(e) {
    return v`
      <div class="row">
        <label title=${e.title ?? m}>${e.label}</label>
        <input
          type="color"
          title=${e.title ?? m}
          .value=${this._swatchValue(e.value, e.swatch)}
          @input=${(t) => e.onLive(t.target.value)}
        />
        <input
          type="text"
          placeholder=${e.placeholder}
          .value=${e.value ?? ""}
          @change=${(t) => e.onCommit(t.target.value || void 0)}
        />
        ${this._renderPalettePicker(e.value, e.onCommit)}
      </div>
    `;
  }
  /**
   * An entity's `supported_features` bitmask, or 0 when it isn't in `hass`.
   * Handed to {@link openingForm} so its Tap field can name the default the
   * live card would take — which for a `cover` depends on whether it can
   * actually open and close.
   */
  _supportedFeatures(e) {
    return this.hass?.states[e]?.attributes?.supported_features ?? 0;
  }
  /**
   * The glyph a device shows when no state rule names one — what a rule's
   * empty icon box falls back to. Resolved exactly as the card resolves it,
   * with the rules removed so a currently-matching rule cannot report itself
   * as the default.
   */
  _itemDefaultIcon(e) {
    const t = e.entity ? this.hass?.states[e.entity] : void 0;
    return $i(
      { ...e, stateColor: void 0 },
      t,
      e.entity ? this.hass?.entities?.[e.entity]?.icon : void 0
    );
  }
  /**
   * The device's default icon. State rules in Style & effects can override it.
   *
   * Unlike the colour it stays on screen once rules exist, because rules do
   * *not* replace it: a rule with no icon of its own falls through to this
   * one, which is what lets someone colour by state without naming the same
   * glyph in every row. Hiding it would strand a setting that is still
   * drawing.
   */
  _renderItemIconRow(e) {
    const t = "Icon for this device; state rules in Style & effects can override it";
    return v`
      <div class="row wide">
        <label title=${t}>Icon</label>
        ${this._renderIconPicker(e.icon ?? "", (i) => this._updateItem(e.id, { icon: i || void 0 }), {
      // The entity's own glyph, so leaving the box empty is visibly a
      // choice rather than a blank.
      placeholder: this._itemDefaultIcon(e),
      title: t
    })}
      </div>
      ${e.stateColor?.length ? v`<p class="hint rule-note">Shown when no state rule specifies an icon.</p>` : m}
    `;
  }
  /** Flat headings within the selected category; no nested disclosure state. */
  _renderGroup(e, ...t) {
    const i = this._projectOpen ? Ma : vi[this._primary()?.kind ?? "wall"], n = this._projectOpen ? this._projectPage : this._selectionPage;
    if (!i.find((r) => r.id === n)?.groups.includes(e)) return v`${m}`;
    const o = {
      "What it reads": "Sensor readings",
      Behavior: "Tap, hold & double-tap",
      Look: "Plan style",
      Project: "Canvas",
      Display: "View & scale",
      Color: "State colors",
      "Floor image": `Background · ${this._floor().name}`
    }[e] ?? e;
    return v`<section class="cfg-group" data-group=${e}>
      <h3 class="cfg-group-title">${o}</h3>${t}
    </section>`;
  }
  /** Tabs and in-panel shortcuts share draft, scroll and keyboard-focus handling. */
  async _choosePage(e, t = !1) {
    this._numberDraft = void 0, t ? this._projectPage = e : this._selectionPage = e, this.renderRoot.querySelector(".side")?.scrollTo({ top: 0 }), await this.updateComplete, this.renderRoot.querySelector(`#${t ? "project" : "object"}-category-${e}`)?.focus({ preventScroll: !0 });
  }
  _renderPagePicker(e, t) {
    if (e.length < 2) return m;
    const i = t ? this._projectPage : this._selectionPage, n = t ? "project" : "object";
    return v`<div class="settings-category ${e.length === 4 ? "two-columns" : ""}"
      role="tablist" aria-label=${t ? "Project settings" : "Object settings"}
      @keydown=${(o) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(o.key)) return;
      o.preventDefault(), o.stopPropagation();
      const r = e.findIndex((s) => s.id === i), a = o.key === "Home" ? 0 : o.key === "End" ? e.length - 1 : (r + (o.key === "ArrowRight" ? 1 : -1) + e.length) % e.length;
      this._choosePage(e[a].id, t);
    }}>
      ${e.map((o) => v`<button role="tab" id=${`${n}-category-${o.id}`}
        data-page=${o.id} aria-selected=${i === o.id} tabindex=${i === o.id ? 0 : -1}
        aria-controls=${`${n}-settings-page`} title=${o.hint ?? o.label}
        @click=${() => this._choosePage(o.id, t)}>${o.label}</button>`)}
    </div>`;
  }
  /**
   * A device's other entities (issue #180): every reading beyond its own
   * state, added one at a time with "+ Add entity" rather than by putting four
   * entity dropdowns on every device that will never use them.
   *
   * Plain rows rather than `ha-form` fields for the same reason the state
   * rules are: the list is repeatable and `ha-form` has no selector for that.
   *
   * The attribute box is offered on every row, not only once an entity is
   * picked, because a row with an attribute and *no* entity is a real and
   * useful configuration — it reads that attribute off the device's own
   * entity, which is how one climate shows four of its own numbers. It is HA's
   * own attribute picker, so it lists what that entity actually has.
   */
  _renderItemReadings(e) {
    const t = Ge(e), i = (o) => this._updateItem(e.id, {
      readings: o.length ? o : void 0,
      secondaryEntity: void 0,
      secondaryAttribute: void 0,
      // `badgeEntity: "secondary"` meant index 0, which is where the legacy
      // pair still is — restate it as the index so the old spelling does not
      // outlive the keys it referred to.
      ...e.badgeEntity === "secondary" ? { badgeEntity: 0 } : {}
    }), n = (o, r) => i(t.map((a, s) => s === o ? { ...a, ...r } : a));
    return v`
      <div class="row wide">
        <label title="Further entities and attributes whose readings join this device's label line"
          >Other entities</label
        >
      </div>
      ${t.map(
      (o, r) => v`
          <div class="row wide item-reading">
            ${this._renderEntityPicker(
        o.entity ?? "",
        (a) => n(r, { entity: a || void 0 }),
        void 0,
        // Scoped to the room the device sits in, exactly as its own
        // entity picker is — an extra reading is as likely to come from
        // the same room as the first one.
        this._areaEntitiesAt(e.x, e.y)?.entities
      )}
            ${this._renderAttributePicker(
        o.entity || e.entity,
        o.attribute ?? "",
        (a) => n(r, { attribute: a || void 0 }),
        "Read this attribute instead of the state — with no entity beside it, from this device's own entity"
      )}
            <button
              class="rule-remove"
              aria-label="Remove entity"
              title="Remove this entity"
              @click=${() => i(t.filter((a, s) => s !== r))}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <!-- Under its own entity, because it is about that entity and not
               about the device: an entity can be bound for the badge to read
               and kept out of the label text. -->
          <div class="row wide reading-show">
            <!-- The input is *inside* its label rather than paired to it by
                 id: the only id available here is the element's own, which
                 comes from config and can be anything, so a generated "for"
                 would be invalid or duplicated exactly when someone
                 hand-writes their YAML. Wrapping needs no id, and clicking
                 the words toggles the box either way. -->
            <label>
              <input
                type="checkbox"
                title="Off keeps this entity bound — the badge can still read it — without printing it in the label"
                .checked=${o.showState !== !1}
                @change=${(a) => n(r, {
        // `true` is the default, so it stays out of the YAML.
        showState: a.target.checked ? void 0 : !1
      })}
              />
              Show on label
            </label>
            <span class="hint"
              >${o.showState === !1 ? "Bound but not printed — the badge can still read it." : "Its value joins the label line."}</span
            >
          </div>
        `
    )}
      <div class="row wide state-color-add">
        <button @click=${() => i([...t, {}])}>
          <ha-icon icon="mdi:plus"></ha-icon>Add entity
        </button>
      </div>
      ${t.length ? v`<p class="hint rule-note">
            These show whether or not the device's own "Show state" above is on
            — that toggle is about the device's entity, not about these. Use
            each row's own "Show on label" to keep one bound without printing it.
          </p>` : m}
    `;
  }
  /**
   * The "Color by state" block (issues #68, #79, #82): a list of rules, each
   * one a condition and a colour, plus an "Add rule" button.
   *
   * A rule's condition is either a numeric threshold or an exact state, chosen
   * per row — the two ways an entity's value comes back. A rule with neither is
   * the fallback, and reads as "otherwise" in the UI.
   *
   * These are plain rows rather than `ha-form` fields: the list is repeatable
   * and ha-form has no selector for that (its `object` selector is a raw YAML
   * box). Colours are the one part of this editor that was always hand-rolled,
   * so the block still matches its neighbours.
   */
  _renderStateColorRules(e, t, i) {
    const n = e ?? [], o = (r, a) => {
      const s = n.map((l, c) => c === r ? { ...l, ...a } : l);
      t(s);
    };
    return v`
      <div class="row wide state-colors">
        <label
          title=${i?.icons ? "Color the badge — and optionally swap its icon — by what the entity reads" : "Color the element by what its entity reads"}
          >${i?.icons ? "Color & icon by state" : "Color by state"}</label
        >
      </div>
      ${n.map((r, a) => {
      const s = typeof r.state == "string" ? "state" : typeof r.above == "number" ? "above" : "else";
      return v`
          <div class="row wide state-color-rule">
            <select
              .value=${s}
              title="When this rule applies"
              @change=${(l) => {
        const c = l.target.value;
        o(a, {
          above: c === "above" ? r.above ?? 0 : void 0,
          state: c === "state" ? r.state ?? "" : void 0
        });
      }}
            >
              <option value="above">above</option>
              <option value="state">state is</option>
              <option value="else">otherwise</option>
            </select>
            ${s === "above" ? v`<input
                  type="number"
                  class="cond"
                  .value=${String(r.above ?? 0)}
                  @change=${(l) => o(a, { above: Number(l.target.value) || 0 })}
                />` : s === "state" ? v`<input
                    type="text"
                    class="cond"
                    placeholder="on"
                    .value=${r.state ?? ""}
                    @change=${(l) => o(a, { state: l.target.value })}
                  />` : v`<span class="cond hint">any other value</span>`}
            <input
              type="color"
              .value=${this._swatchValue(r.color, "#ff0000")}
              @input=${(l) => o(a, { color: l.target.value })}
            />
            <input
              type="text"
              class="rule-color-text"
              placeholder="red"
              .value=${r.color ?? ""}
              @change=${(l) => o(a, { color: l.target.value })}
            />
            ${this._renderPalettePicker(r.color, (l) => o(a, { color: l ?? "" }))}
            ${i?.icons ? (
        // Empty means "keep the device's icon", so the device's icon is
        // the placeholder — the rule shows what leaving it blank gives
        // you, and colour-only rules need no icon at all (issue #127).
        this._renderIconPicker(r.icon ?? "", (l) => o(a, { icon: l || void 0 }), {
          placeholder: i.iconPlaceholder,
          title: "Icon while this rule matches — empty keeps the device's own"
        })
      ) : m}
            <button
              class="rule-remove"
              aria-label="Remove rule"
              title="Remove this rule"
              @click=${() => {
        const l = n.filter((c, p) => p !== a);
        t(l.length ? l : void 0);
      }}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
        `;
    })}
      <div class="row wide state-color-add">
        <button
          @click=${() => t([
      ...n,
      // A fresh rule defaults to a threshold: the numeric case is what
      // both #68 and #82 ask for, and it's the one that needs no typing.
      { above: 0, color: "#ff0000" }
    ])}
        >
          <ha-icon icon="mdi:plus"></ha-icon>Add rule
        </button>
      </div>
    `;
  }
  /**
   * Entity ids to scope a picker to for something sitting at (x, y), or
   * undefined for "offer everything".
   *
   * An element inside an Area linked to a Home Assistant area gets its pickers
   * scoped to that area, unless the area's own "Filter entities" toggle turns
   * that off. Recomputed on every render from the live coordinates, so it
   * tracks the element as it's dragged in/out of the polygon, even before the
   * form reopens.
   */
  /**
   * The Area actively scoping the selected element's entity picker, if any —
   * i.e. the element is a device/furniture, it sits inside an Area, and that
   * Area is linked to an HA area with filtering on. The canvas animates this
   * one so it is obvious *which room you are working in* and why the picker
   * is short; nothing else in the editor communicated that.
   */
  _scopingAreaId() {
    if (this._selection.length !== 1) return;
    const e = this._selection[0], t = this._floor(), i = e.kind === "item" ? t.items.find((o) => o.id === e.id) : e.kind === "furniture" ? t.furniture.find((o) => o.id === e.id) : void 0;
    if (!i) return;
    const n = Rn(t, i.x, i.y);
    if (fr(n))
      return In(this.hass, n.haArea).length ? n.id : void 0;
  }
  _areaEntitiesAt(e, t) {
    const i = Rn(this._floor(), e, t);
    return fr(i) ? { entities: In(this.hass, i.haArea), name: i.name } : void 0;
  }
  /** Every entity in `area`'s linked HA area not already placed as an item on this floor. */
  _pendingAreaEntities(e) {
    if (!e.haArea) return [];
    const t = new Set(this._floor().items.map((i) => i.entity));
    return In(this.hass, e.haArea).filter((i) => !t.has(i));
  }
  /**
   * Add a device for every entity registered to `area`'s linked HA area that
   * isn't already placed as an item on this floor, laid out across the
   * polygon's interior (`layoutPointsInPolygon`) so the new icons spread out
   * instead of stacking on top of each other.
   */
  _addAreaEntities(e) {
    const t = this._pendingAreaEntities(e);
    if (!t.length) return;
    const i = _y(e.points, t.length), n = t.map((o, r) => {
      const a = Kr(o);
      return {
        id: ae("item"),
        entity: o,
        x: Math.round(i[r].x),
        y: Math.round(i[r].y),
        kind: a,
        showState: a === "sensor",
        showIcon: !0,
        size: je
      };
    });
    this._commitFloor({ items: [...this._floor().items, ...n] }), this._selection = n.map((o) => ({ kind: "item", id: o.id }));
  }
  /** Patch a single field on one of a tracker's sensor sub-objects (X / Y axis). */
  _updateTrackerSensor(e, t, i) {
    const n = (this._floor().trackers ?? []).find((r) => r.id === e);
    if (!n) return;
    if (i === null) {
      this._updateTracker(e, { [t]: void 0 });
      return;
    }
    const o = n[t] ?? { entity: "", min: 0, max: 5 };
    this._updateTracker(e, { [t]: { ...o, ...i } });
  }
  _patchConfig(e) {
    this._commit({ ...this._config, ...e });
  }
  /**
   * Live variants for continuous controls (sliders, color pickers, typing):
   * one undo snapshot per edit burst — keyed by element and fields — then
   * plain emits, instead of a full-config clone per input event.
   */
  _beginLive(e, t, i) {
    const n = `${e}:${t}:${Object.keys(i).sort().join(",")}`;
    this._liveEditKey !== n && this._pushHistory(n);
  }
  _updateOpeningLive(e, t) {
    this._beginLive("opening", e, t), this._emitFloor({
      openings: this._floor().openings.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateItemLive(e, t) {
    this._beginLive("item", e, t), this._emitFloor({
      items: this._floor().items.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateTextLive(e, t) {
    this._beginLive("text", e, t), this._emitFloor({
      texts: this._floor().texts.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateFurnitureLive(e, t) {
    this._beginLive("furniture", e, t), this._emitFloor({
      furniture: this._floor().furniture.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateTrackerLive(e, t) {
    this._beginLive("tracker", e, t), this._emitFloor({
      trackers: (this._floor().trackers ?? []).map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _updateAreaLive(e, t) {
    this._beginLive("area", e, t), this._emitFloor({
      areas: (this._floor().areas ?? []).map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _patchConfigLive(e) {
    this._beginLive("config", "", e), this._emit({ ...this._config, ...e });
  }
  _updateWallLive(e, t) {
    this._beginLive("wall", e, t), this._emitFloor({
      walls: this._floor().walls.map((i) => i.id === e ? { ...i, ...t } : i)
    });
  }
  _patchFloorLive(e) {
    this._beginLive("floor", this._activeFloorId, e), this._emitFloor(e);
  }
  /** Route a form patch to the right per-kind update helper (commit or burst). */
  _applyElementPatch(e, t, i, n) {
    switch (e) {
      case "opening":
        n ? this._updateOpeningLive(t, i) : this._updateOpening(t, i);
        break;
      case "item":
        n ? this._updateItemLive(t, i) : this._updateItem(t, i);
        break;
      case "text":
        n ? this._updateTextLive(t, i) : this._updateText(t, i);
        break;
      case "furniture":
        n ? this._updateFurnitureLive(t, i) : this._updateFurniture(t, i);
        break;
      case "tracker":
        n ? this._updateTrackerLive(t, i) : this._updateTracker(t, i);
        break;
      case "wall":
        n ? this._updateWallLive(t, i) : this._updateWall(t, i);
        break;
      case "area":
        n ? this._updateAreaLive(t, i) : this._updateArea(t, i);
        break;
    }
  }
  // ---- rendering ----------------------------------------------------------
  // ---- zoom ----------------------------------------------------------------
  _setZoom(e) {
    this._fitToViewport = !1, this._zoom = Math.min(3, Math.max(0.01, Math.round(e * 100) / 100));
  }
  /** Ctrl/Cmd + wheel zooms the canvas (also catches trackpad pinch); plain wheel scrolls. */
  _onCanvasWheel(e) {
    !e.ctrlKey && !e.metaKey || (e.preventDefault(), this._setZoom(this._zoom - Math.sign(e.deltaY) * 0.1));
  }
  _onCanvasScroll() {
    const e = this._canvasWrap;
    if (!e) return;
    const t = this._canvasScroll;
    this._recordCanvasScroll(e), !(!t || t.left === e.scrollLeft && t.top === e.scrollTop) && t.width === e.clientWidth && t.height === e.clientHeight && (this._fitToViewport = !1);
  }
  _recordCanvasScroll(e) {
    this._canvasScroll = {
      left: e.scrollLeft,
      top: e.scrollTop,
      width: e.clientWidth,
      height: e.clientHeight
    };
  }
  _scrollCanvas(e, t) {
    const i = this._canvasWrap;
    i && (i.scrollTo({ left: e, top: t, behavior: "instant" }), this._recordCanvasScroll(i));
  }
  /** Fit both dimensions, including tall plans in a docked or fullscreen canvas. */
  _fitView() {
    this._fitToViewport = !0;
    const e = this._canvasWrap;
    if (!e?.clientWidth || !e.clientHeight) return;
    const t = e.getBoundingClientRect().width - 2, i = e.clientHeight * this._config.width / (t * this._config.height);
    this._zoom = Math.max(0.01, Math.min(1, Math.floor(i * 100) / 100)), this._scrollCanvas(0, 0);
  }
  /** One-line description of the selected element for the Element header. */
  _selectionSummary(e) {
    const t = this._floor();
    switch (e.kind) {
      case "wall": {
        const i = t.walls.find((n) => n.id === e.id);
        return i ? `Wall · ${Math.round(Math.hypot(i.x2 - i.x1, i.y2 - i.y1))} units` : "Wall";
      }
      case "opening": {
        const i = t.openings.find((o) => o.id === e.id);
        return i ? ie(i) ? `Skylight · ${Math.round(i.length)}×${Math.round(Se(i))}` : `${i.type === "door" ? "Door" : xe(i) ? "Passage" : "Window"} · ${Math.round(i.length)} units` : "Opening";
      }
      case "item": {
        const i = t.items.find((n) => n.id === e.id);
        return i?.entity ? String(i.name || this.hass?.states[i.entity]?.attributes.friendly_name || i.entity) : "Device";
      }
      case "text": {
        const n = t.texts.find((o) => o.id === e.id)?.text ?? "";
        return n ? `Text · “${n.length > 24 ? `${n.slice(0, 24)}…` : n}”` : "Text";
      }
      case "furniture": {
        const i = t.furniture.find((o) => o.id === e.id);
        if (!i) return "Furniture";
        const n = Mb(i.type, this._symbols());
        return `${n.charAt(0).toUpperCase()}${n.slice(1)} · ${Math.round(i.w)}×${Math.round(i.h)}`;
      }
      case "area": {
        const i = (t.areas ?? []).find((n) => n.id === e.id);
        return i ? `Area · ${i.name || `${i.points.length}-point`}` : "Area";
      }
      default: {
        const i = (t.trackers ?? []).find((n) => n.id === e.id);
        return i ? `Tracker · ${Math.round(i.w)}×${Math.round(i.h)}` : "Tracker";
      }
    }
  }
  _renderGrid() {
    const { width: e, height: t } = this._config, i = this.grid, n = `${e}x${t}x${i}`;
    if (this._gridCache?.key === n) return this._gridCache.lines;
    const o = [];
    for (let r = 0; r <= e; r += i)
      o.push(_`<line x1=${r} y1="0" x2=${r} y2=${t} class="grid" />`);
    for (let r = 0; r <= t; r += i)
      o.push(_`<line x1="0" y1=${r} x2=${e} y2=${r} class="grid" />`);
    return this._gridCache = { key: n, lines: o }, o;
  }
  _isSel(e, t) {
    return this._selection.some((i) => i.kind === e && i.id === t);
  }
  /**
   * The second toolbar row: shows controls and hints for whatever you're
   * currently doing — options for the active drawing tool, or actions for the
   * current selection. This keeps contextual controls (which come and go) out
   * of the always-present top row.
   */
  _renderContextBar() {
    const e = this._tool;
    let t, i;
    if (e === "wall")
      t = "Wall", i = v`
        <button
          class=${this._freeWalls ? "" : "active"}
          aria-pressed=${!this._freeWalls}
          title="Snap walls to horizontal/vertical and existing corners (off = draw freely)"
          @click=${() => {
        this._freeWalls = !this._freeWalls;
      }}
        >
          straighten
        </button>
        <span class="ctx-hint">Drag to draw. Endpoints snap to nearby corners to close rooms.</span>
      `;
    else if (e === "tracker")
      t = "Tracker", i = v`
        <span class="ctx-hint"
          >Drag on the canvas to draw the tracked area; bind one or two
          distance sensors in its properties.</span
        >
      `;
    else if (e === "area") {
      t = "Area";
      const n = this._draftArea?.points.length ?? 0;
      i = v`
        <span class="ctx-hint">
          ${n === 0 ? "Click to start a room outline; points snap to nearby corners." : n < 3 ? `${n} point${n === 1 ? "" : "s"} placed — click to add more (3+ to close).` : `${n} points placed — click the first point to close the room, or keep adding.`}
        </span>
      `;
    } else if (e === "skylight") {
      t = "Skylight";
      const n = (o, r, a, s) => v`
        <label class="ctx-field">
          ${o}
          <input
            class="num"
            type="number"
            min="1"
            .value=${String(r)}
            title=${a}
            @change=${(l) => {
        s(Math.max(1, Number(l.target.value) || r));
      }}
          />
        </label>
      `;
      i = v`
        ${n(
        "Length",
        this._defaultSkylightLength,
        "Default long side applied to the next skylight you place",
        (o) => {
          this._defaultSkylightLength = o;
        }
      )}
        ${n(
        "Width",
        this._defaultSkylightWidth,
        "Default short side applied to the next skylight you place",
        (o) => {
          this._defaultSkylightWidth = o;
        }
      )}
        <span class="ctx-hint"
          >Click anywhere inside a room to drop a roof window — it sits in the
          ceiling, so it snaps to no wall.</span
        >
      `;
    } else if (e === "door" || e === "passage" || e === "window")
      t = tt[e].label, i = v`
        <label class="ctx-field">
          Length
          <input
            class="num"
            type="number"
            min="1"
            .value=${String(this._defaultOpeningLength)}
            title="Default length applied to the next ${e} you place"
            @change=${(n) => {
        this._defaultOpeningLength = Math.max(
          1,
          Number(n.target.value) || this._defaultOpeningLength
        );
      }}
          />
        </label>
        <span class="ctx-hint">Click on a wall to drop a ${e}; it snaps onto the wall.</span>
      `;
    else {
      t = "Select";
      const n = this._selection.length;
      i = n === 0 ? v`<span class="ctx-hint"
              >Click an element to select it, or drag a box to select several.</span
            >` : v`
              <span class="ctx-count">${n === 1 ? this._selectionSummary(this._selection[0]) : `${n} selected`}</span>
              <button class="inspector-jump" @click=${() => this._jumpToInspector()}>Edit properties <span aria-hidden="true">→</span></button>
            `;
    }
    return v`
      <div class="context-bar">
        <span class="ctx-label">${t}</span>
        ${i}
        <span class="ctx-divider"></span>
        ${this._renderSnapControl()}
      </div>
    `;
  }
  /**
   * Snap control rendered at the end of the context bar for every tool. The
   * setting governs placement / drag / wall drawing across all tools, so the
   * control needs to be reachable regardless of which tool is active.
   */
  _renderSnapControl() {
    const e = this._snapMode, t = $r(this._config.snap, this.grid);
    return v`
      <label class="snap-control">Snap
        <select aria-label="Snapping" aria-describedby="snap-hint" .value=${e}
          @change=${(i) => this._setSnapMode(i.target.value)}>
          <option value="grid">Grid</option>
          <option value="off">Off</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      ${e === "custom" ? v`<input
              class="num"
              type="number"
              min="1"
              step="5"
              .value=${String(t)}
              title="Custom snap step, as a percentage of the grid"
              aria-label="Custom snap percentage"
              aria-describedby="snap-hint"
              @change=${(i) => {
      const n = Math.max(
        1,
        Number(i.target.value) || _r
      );
      this._patchConfig({ snap: Cn(n, this.grid) });
    }}
            /><span class="ctx-field-label">%</span>` : m}
      <span class="ctx-hint snap-hint" id="snap-hint">${e === "grid" ? `Snapping to the ${this.grid}-unit grid.` : e === "off" ? "Snapping is off." : `Snap = ${t}% of grid (${this._resolvedSnap} units).`}</span>
    `;
  }
  render() {
    if (!this._config) return v`${m}`;
    const e = this._config, t = this._floor(), i = e.floors ?? [], n = this._roomWallSegments(t), o = Do([...t.walls, ...n]), r = /* @__PURE__ */ new Map();
    for (const h of t.areas ?? [])
      for (const [u, f] of ze.entries())
        r.set(Fl(h.id, f), { area: h, side: f, edgeIndex: u });
    const a = Vi(e.overlayScale), s = a === "plan" ? qi(e.overlayMinWidth) : void 0, l = this._scopingAreaId(), c = e.showDeadSpaces ? fs(o, t.openings) : [], p = t.items.some((h) => h.glow) ? bn(o, t.openings, (h) => Lo(
      h,
      ((f) => _t(h, f ? this.hass?.states[f] : void 0))(h.entity),
      h.secondaryEntity && Ut(h) ? _t(
        rl(h),
        this.hass?.states[h.secondaryEntity]
      ) : void 0,
      h.shutterEntity ? Te(this.hass?.states[h.shutterEntity], h.shutterInvert) : void 0
    )) : o, d = !t.walls.length && !t.openings.length && !t.items.length && !t.texts.length && !t.furniture.length && !(t.trackers ?? []).length && !(t.areas ?? []).length;
    return v`
      <div
        class="editor ${this._fullscreen ? "fullscreen" : ""} ${this._mobileInspector ? "show-inspector" : ""} ${this._previewCollapsed ? "preview-collapsed" : ""} ${this._keyboardOpen ? "keyboard-open" : ""}"
        popover=${this._fullscreen ? "manual" : m}
        @pointerdown=${this._onEditorPointerDown}
      >
        ${this._floorMenuOpen || this._addMenuOpen ? v`<div
              class="pop-backdrop"
              @click=${() => {
      this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "";
    }}
            ></div>` : m}
        <div class="toolbar">
          <div class="editor-brand">
            <ha-icon icon="mdi:floor-plan"></ha-icon>
            <strong>${e.title || "Untitled plan"}</strong>
            <button class="project-settings" aria-label="Project settings" title="Project settings"
              @click=${() => this._jumpToInspector(!0)}><ha-icon icon="mdi:cog-outline"></ha-icon></button>
          </div>
          <!-- History -->
          <div class="group history">
            <button aria-label="Undo" title="Undo (Ctrl/Cmd+Z)" ?disabled=${!this._history.length} @click=${this._undo}>
              <ha-icon icon="mdi:undo"></ha-icon>
            </button>
            <button aria-label="Redo" title="Redo (Ctrl/Cmd+Shift+Z)" ?disabled=${!this._future.length} @click=${this._redo}>
              <ha-icon icon="mdi:redo"></ha-icon>
            </button>
          </div>

          <label class="tool-compact">
            <ha-icon icon=${tt[this._tool].icon}></ha-icon>
            <select aria-label="Drawing tool" .value=${this._tool}
              @change=${(h) => this._chooseTool(h.target.value)}>
              ${["select", "wall", "door", "passage", "window", "skylight", "tracker", "area"].map((h) => v`<option value=${h}>${tt[h].label}</option>`)}
            </select>
          </label>

          <!-- Insert — one popover for everything droppable on the floor -->
          <span class="pop-wrap insert-menu">
            <button
              aria-haspopup="true"
              aria-expanded=${this._addMenuOpen}
              @click=${() => {
      this._addMenuOpen = !this._addMenuOpen, this._floorMenuOpen = !1;
    }}
            >
              + Add
            </button>
            ${this._addMenuOpen ? this._renderAddMenu() : m}
          </span>


          <!-- Expand: break out of HA's narrow config dialog into a full-screen
               workspace. Kept next to the tools so it's reachable even when the
               toolbar wraps at dialog width. -->
          <button
            class=${this._fullscreen ? "active expand-toggle" : "expand-toggle"}
            aria-pressed=${this._fullscreen}
            aria-label=${this._fullscreen ? "Exit full screen" : "Expand"}
            title=${this._fullscreen ? "Exit full screen (Esc)" : "Edit full screen — more room for the canvas"}
            @click=${() => this._toggleFullscreen()}
          >
            <ha-icon icon=${this._fullscreen ? "mdi:fullscreen-exit" : "mdi:fullscreen"}></ha-icon>
            <span class="expand-label">${this._fullscreen ? "Exit" : "Expand"}</span>
          </button>

          <!-- Apply: save the plan to the dashboard and keep editing (issue
               #198). HA's own Save closes the dialog, and the preview beside
               the editor is too small to judge where an icon really lands, so
               checking one nudge cost a save, a close, a look, then reopening
               and re-expanding the editor. Next to Expand because that is
               where the need bites hardest: the fullscreen workspace covers
               HA's footer, Save included. -->
          <button
            class="apply-btn"
            ?disabled=${this._applyState === "saving"}
            title="Save to the dashboard without closing the editor — the card behind updates"
            @click=${this._apply}
          >
            <ha-icon
              icon=${this._applyState === "saved" ? "mdi:check" : "mdi:content-save-outline"}
            ></ha-icon>
            ${this._applyState === "saved" ? "Saved" : this._applyState === "saving" ? "Saving…" : "Apply"}
          </button>
          ${this._applyError ? v`<span class="apply-error">${this._applyError}</span>` : m}

        </div>

        <div class="workspace">
          <!-- Tools — modes; exactly one is active at a time -->
          <nav class="tool-rail" aria-label="Drawing tools">
            ${["select", "wall", "door", "passage", "window", "skylight", "tracker", "area"].map(
      (h) => v`
                <button
                  class=${this._tool === h ? "active" : ""}
                  aria-pressed=${this._tool === h}
                  title=${tt[h].label}
                  @click=${() => this._chooseTool(h)}
                >
                  <ha-icon icon=${tt[h].icon}></ha-icon><span>${tt[h].label}</span>
                </button>`
    )}
          </nav>
        <div class="canvas-column">
          <div class="canvas-heading">
          <!-- Floor — switch + add inline; rename/delete behind the gear -->
          <span class="floors pop-wrap">
            <ha-icon icon="mdi:layers-outline"></ha-icon><label for="editing-floor">Floor</label>
            <select id="editing-floor" aria-label="Editing floor"
              @change=${(h) => {
      this._switchFloor(h.target.value), this._canvasWrap?.focus({ preventScroll: !0 });
    }}
            >
              ${i.map(
      (h) => v`<option value=${h.id} .selected=${h.id === this._activeFloorId}>${h.name}</option>`
    )}
            </select>
            <button
              aria-label="Add floor"
              title="Add a floor (copies the current walls)"
              @click=${this._addFloor}
            >
              +
            </button>
            <button
              aria-label="Floor settings"
              title="Rename or delete this floor"
              aria-haspopup="true"
              aria-expanded=${this._floorMenuOpen}
              @click=${() => {
      this._floorMenuOpen = !this._floorMenuOpen, this._addMenuOpen = !1, this._addQuery = "";
    }}
            >
              <ha-icon icon="mdi:cog-outline"></ha-icon>
            </button>
            ${this._floorMenuOpen ? v`<div class="pop">
                  ${this._renderHaFloorRow(t)}
                  <!-- Reorder (issue #66): the safe alternative to cut-and-
                       pasting floor blocks in YAML, which drops/duplicates
                       ids. Position in this list is the switcher order. -->
                  <div class="pop-row">
                    <label>Order</label>
                    <button
                      aria-label="Move floor up"
                      title="Move this floor up the list"
                      ?disabled=${i.length < 2 || i[0]?.id === this._activeFloorId}
                      @click=${() => this._moveFloor(-1)}
                    >
                      <ha-icon icon="mdi:arrow-up"></ha-icon>
                    </button>
                    <button
                      aria-label="Move floor down"
                      title="Move this floor down the list"
                      ?disabled=${i.length < 2 || i[i.length - 1]?.id === this._activeFloorId}
                      @click=${() => this._moveFloor(1)}
                    >
                      <ha-icon icon="mdi:arrow-down"></ha-icon>
                    </button>
                  </div>
                  <div class="pop-row">
                    <label>Rename</label>
                    <input
                      class="floor-name"
                      type="text"
                      .value=${t?.name ?? ""}
                      @change=${(h) => this._renameFloor(this._activeFloorId, h.target.value)}
                    />
                  </div>
                  <!-- Issue #67: switcher-button label, per-floor accent, and
                       which floor the live card opens on. -->
                  <div class="pop-row">
                    <label>Short</label>
                    <input
                      type="text"
                      maxlength="8"
                      placeholder="e.g. GF"
                      title="Short label for the card's floor-switcher button"
                      .value=${t?.short ?? ""}
                      @change=${(h) => this._commitFloor({
      short: h.target.value.trim() || void 0
    })}
                    />
                  </div>
                  <div class="pop-row">
                    <label>Color</label>
                    <input
                      type="color"
                      title="Accent for this floor's switcher button while active"
                      .value=${t?.color ?? "#03a9f4"}
                      @input=${(h) => this._commitFloor({ color: h.target.value })}
                    />
                    <button
                      aria-label="Clear floor color"
                      title="Back to the theme color"
                      ?disabled=${!t?.color}
                      @click=${() => this._commitFloor({ color: void 0 })}
                    >
                      <ha-icon icon="mdi:water-off-outline"></ha-icon>
                    </button>
                  </div>
                  <div class="pop-row">
                    <label>Default</label>
                    <input
                      type="checkbox"
                      title="Open the live card on this floor"
                      .checked=${this._config.defaultFloor === this._activeFloorId}
                      @change=${(h) => this._commit({
      ...this._config,
      defaultFloor: h.target.checked ? this._activeFloorId : void 0
    })}
                    />
                  </div>
                  <button
                    class="danger pop-action"
                    ?disabled=${i.length <= 1}
                    @click=${() => {
      this._deleteFloor(), this._floorMenuOpen = !1;
    }}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon> Delete this floor
                  </button>
                </div>` : m}
          </span>
            <span class="spacer"></span>
          <!-- Labels: declutter a dense plan while editing (issue #52). -->
          <button
            class="icon-btn"
            aria-pressed=${this._hideLabels}
            title=${this._hideLabels ? "Show element labels on the canvas" : "Hide element labels — easier to aim on a dense plan"}
            @click=${() => {
      this._hideLabels = !this._hideLabels;
    }}
          >
            <ha-icon
              icon=${this._hideLabels ? "mdi:label-off-outline" : "mdi:label-outline"}
            ></ha-icon>
            Labels
          </button>


          </div>
        <div class="canvas-outer">
        <!-- The viewport keeps the canvas's aspect ratio so its height does not
             grow with the zoom level. Otherwise zooming in made this box taller,
             which pushed the zoom buttons (anchored to its bottom-right) down the
             page — you had to chase the + button between clicks. Fullscreen sizes
             the viewport from the available space instead, which is why it never
             had the problem. -->
        <div
          class="canvas-wrap"
          tabindex="0"
          style=${this._fullscreen ? m : `aspect-ratio:${O(e.width, be)} / ${O(e.height, we)};`}
          @wheel=${this._onCanvasWheel}
          @scroll=${this._onCanvasScroll}
        >
          <!-- The stage doubles as the card's .plan box for overlay sizing: same
               container query, same --fp-u, so a badge measured in canvas units
               previews here at the size a card of this width would draw it
               (issue #192). The editor never rotates the plan, so the canvas
               width is what 100cqw measures against. -->
          <div class="stage ${a === "plan" ? "scale-plan" : ""}"
               style="aspect-ratio: ${O(e.width, be)} / ${O(
      e.height,
      we
    )}; width:${this._zoom * 100}%;
                   --fp-plan-w: ${O(e.width, be)};${s === void 0 ? "" : `--fp-min-w: ${s}px;`}${Fc(
      e.skin
    )}${Pl(e.palette)}">
            <!-- Keyed on the skin and the palette, for the repaint reason
                 documented on the card's SVG (issue #122): a var() inside a
                 presentation attribute does not repaint when the custom
                 property changes, so without this the canvas kept the previous
                 skin's doors and room fills — and, since issue #265, would show
                 a palette colour's old value while you were editing it. -->
            ${Ua(
      `${e.skin ?? ""}|${zl(e.palette)}`,
      _`<svg
              viewBox="0 0 ${e.width} ${e.height}"
              preserveAspectRatio="none"
              class=${this._tool}
              @pointerdown=${this._onCanvasDown}
              @pointermove=${this._onCanvasMove}
              @pointerup=${this._onCanvasUp}
              @pointercancel=${this._onPointerCancel}
            >
              <rect
                x="0"
                y="0"
                width=${e.width}
                height=${e.height}
                fill=${e.background ?? oi}
              />
              ${t.image ? _`<image href=${t.image} x="0" y="0" width=${e.width} height=${e.height}
                            preserveAspectRatio=${_l(t.imageFit)}
                            opacity=${t.imageOpacity ?? 1} />` : m}
              ${this._renderGrid()}
              ${Ee(
        t.areas ?? [],
        (h, u) => h.id || u,
        (h) => this._renderAreaSel(h, l)
      )}
              <!-- Dead spaces (issue #88), same layer position as the card so
                   what you draw is what you get. Live while you draw: closing
                   the last wall of a shaft hatches it, and dropping a door into
                   it clears the hatching again — which is the fastest way to
                   see that the card agrees with you about what is sealed. -->
              ${c.length ? _`${kl(`${this._wallMaskId}-dead`)}
                      ${c.map(
        (h) => Sl(h, `${this._wallMaskId}-dead`)
      )}` : m}
              <!-- Light pools (issue #6), same layer position as the card so
                   what you place is what you get. Previewed at full strength
                   with no hass in the editor, so the radius is adjustable
                   without having to turn the real light on. -->
              ${Rs(
        t.furniture,
        e.width,
        e.height,
        `${this._wallMaskId}-glowmask`,
        this._symbols()
      )}
              <g class="fp-glows"
                 mask=${t.furniture.length ? `url(#${this._wallMaskId}-glowmask)` : m}>
                ${t.items.map((h, u) => {
        if (!h.glow) return m;
        const f = Wr(h, this.hass?.states[h.entity]);
        return f ? Os(h, f, `${this._wallMaskId}-glow-${u}`, p) : m;
      })}
              </g>
              ${// Radius guide for the selected glow (issue #108). Sizing an
      // unlit light would otherwise be blind, now that an off light
      // correctly draws nothing. Editor-only chrome, like the
      // tracker zone outline.
      //
      // Deliberately the *configured* radius, not the brightness-
      // scaled one (issue #123): this is the handle for the value you
      // are setting, which is the pool's size at full brightness. A
      // guide that shrank as the bulb dimmed would move while you
      // dragged it, and would never show the size you actually typed.
      t.items.map((h) => {
        if (!h.glow || !this._isSel("item", h.id)) return m;
        const u = O(h.glowRadius, cn), f = st(h);
        return f ? _`<path class="glow-guide" d=${Sm(f, u)} />` : _`<circle class="glow-guide" cx=${h.x} cy=${h.y} r=${u} />`;
      })}
              ${t.furniture.map((h) => this._renderFurnitureSel(h))}
              ${Vo(t.openings, e.width, e.height, this._wallMaskId)}
              ${(() => {
        const h = (u, f) => this._renderWall(u, f);
        return [...t.walls, ...n].map((u) => h(u, r.get(u.id)));
      })()}
              <!-- Room outlines, same layer position as the card so what you
                   place is what you get. Only a static borderColor draws here,
                   there being no hass to resolve a live color from — but the
                   clip ids are passed anyway, so wiring a live preview in later
                   cannot silently land on the unclipped path. -->
              <g mask=${`url(#${this._wallMaskId})`}>
                ${(t.areas ?? []).map(
        (h, u) => El(h, void 0, `${this._wallMaskId}-area-${u}`)
      )}
              </g>
              ${t.items.map((h) => this._renderStripSel(h))}
              ${Ee(
        // Keyed by id: switching floors must create fresh DOM. Reused
        // nodes would CSS-transition from the previous floor's opening
        // state — a window briefly plays a door swing (issue #50).
        t.openings,
        (h, u) => h.id || u,
        (h) => this._renderOpeningSel(h)
      )}
              ${Ee(
        t.trackers ?? [],
        (h, u) => h.id || u,
        (h) => this._renderTrackerSel(h)
      )}
              ${this._draftTracker ? _`<rect class="tracker-draft"
                              x=${Math.min(this._draftTracker.x0, this._draftTracker.x1)}
                              y=${Math.min(this._draftTracker.y0, this._draftTracker.y1)}
                              width=${Math.abs(this._draftTracker.x1 - this._draftTracker.x0)}
                              height=${Math.abs(this._draftTracker.y1 - this._draftTracker.y0)}
                              rx="4" />` : m}
              ${this._draft ? _`<g class="fp-wall-neon"><line x1=${this._draft.x1} y1=${this._draft.y1}
                              x2=${this._draft.x2} y2=${this._draft.y2}
                              class="wall draft" mask=${`url(#${this._wallMaskId})`}
                              stroke-width=${X} /></g>` : m}
              ${this._renderAreaDraft()}
              ${this._marquee ? _`<rect x=${Math.min(this._marquee.x0, this._marquee.x1)}
                              y=${Math.min(this._marquee.y0, this._marquee.y1)}
                              width=${Math.abs(this._marquee.x1 - this._marquee.x0)}
                              height=${Math.abs(this._marquee.y1 - this._marquee.y0)}
                              class="marquee" />` : m}
            </svg>`
    )}
            <div class="items">
              ${(e.floors ?? []).length > 1 ? this._renderSwitcherHandle(e) : m}
              ${t.texts.map((h) => this._renderTextOverlay(h, e, a))}
              ${t.openings.filter((h) => sl(h)).map((h) => this._renderShutterMarkOverlay(h, e, a))}
              ${t.openings.filter((h) => dl(h)).map((h) => this._renderOpeningMarkOverlay(h, e, a))}
              ${t.items.map((h) => this._renderItemOverlay(h, e, a))}
            </div>
          </div>
        </div>
        ${d && !this._draft && !this._draftTracker && !this._draftArea ? v`<div class="empty-hint">
              <div>
                <b>Draw your first room:</b> pick the <b>Wall</b> tool and drag on the canvas.<br />
                Then drop doors, windows and devices onto it.
              </div>
            </div>` : m}
        <div class="zoom-overlay">
          <button aria-label="Zoom out" title="Zoom out" @click=${() => this._setZoom(this._zoom - 0.25)}>
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <button class="zoom-val-btn" title="Use full canvas width (100%)" @click=${() => this._setZoom(1)}>
            ${Math.round(this._zoom * 100)}% width
          </button>
          <button aria-label="Zoom in" title="Zoom in" @click=${() => this._setZoom(this._zoom + 0.25)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
          <button aria-label="Fit to view" title="Fit the whole plan; refit automatically on resize"
            aria-pressed=${this._fitToViewport} class=${this._fitToViewport ? "active" : ""} @click=${this._fitView}>
            <ha-icon icon="mdi:fit-to-screen-outline"></ha-icon> Fit
          </button>
        </div>
        </div>

          ${this._renderContextBar()}
        </div>
        <aside class="side" aria-label="Inspector">
          <div class="inspector-heading">
            <div class="inspector-tabs" role="tablist" aria-label="Inspector" @keydown=${this._onInspectorTabKeyDown}>
              <button id="selection-tab" role="tab" aria-selected=${!this._projectOpen}
                aria-controls="selection-panel" tabindex=${this._projectOpen ? -1 : 0}
                @click=${() => this._setInspector(!1)}>Selection</button>
              <button id="project-tab" role="tab" aria-selected=${this._projectOpen}
                aria-controls="project-panel" tabindex=${this._projectOpen ? 0 : -1}
                @click=${() => this._setInspector(!0)}>Project</button>
            </div>
            <button class="preview-toggle" aria-expanded=${!this._previewCollapsed}
              @click=${() => {
      this._previewCollapsed = !this._previewCollapsed;
    }}>
              ${this._previewCollapsed ? "Show plan" : "Hide plan"}</button>
            <button class="canvas-jump" @click=${() => this._jumpToCanvas()}>Done</button>
          </div>
          <div id="selection-panel" role="tabpanel" aria-labelledby="selection-tab" ?hidden=${this._projectOpen}>
            ${this._projectOpen ? m : this._renderElementEdit()}
          </div>
          <div id="project-panel" role="tabpanel" aria-labelledby="project-tab" ?hidden=${!this._projectOpen}>
            ${this._projectOpen ? this._renderPanel() : m}
          </div>
        </aside>
        </div>
      </div>
    `;
  }
  /**
   * `ha-entity-picker` when defined, else a plain entity-id input — mirrors
   * the icon-picker fallback so entity binding never silently dead-ends when
   * the helper load fails or the editor runs outside HA.
   */
  /**
   * Render a FormSpec: real `<ha-form>` (native HA selectors) when the
   * element is defined, otherwise the same schema through plain inputs.
   * Patches route through `apply(patch, live)` — `live` marks continuous
   * fields (typing, sliders) for the burst-history path.
   */
  _renderForm(e, t) {
    if (customElements.get("ha-form")) {
      const i = this._numberDraft, n = i?.form.isConnected && e.fields.some((o) => o.name === i.name) ? { ...e.data, [i.name]: i.value } : e.data;
      return v`<ha-form
        .hass=${this.hass}
        .data=${n}
        .schema=${e.fields}
        .computeLabel=${Zb}
        .computeHelper=${Qb}
        @focusout=${(o) => {
        this._numberDraft?.form === o.currentTarget && (this._numberDraft = void 0, this.requestUpdate());
      }}
        @value-changed=${(o) => {
        o.stopPropagation();
        const r = Sb(n, o.detail.value, e.fields), a = Object.keys(r), s = a.length === 1 ? e.fields.find((h) => h.name === a[0]) : void 0, l = o.currentTarget;
        s && "number" in s.selector && l.matches(":focus-within") && (this._numberDraft = { form: l, name: s.name, value: r[s.name] }, this.requestUpdate());
        const c = Ia(r, e.fields), p = Object.keys(c);
        if (!p.length) return;
        const d = p.length === 1 && Ca(e.fields.find((h) => h.name === p[0]));
        t(e.toPatch(c), d);
      }}
      ></ha-form>`;
    }
    return v`${e.fields.map((i) => this._renderFallbackField(e, i, t))}
      ${e.fields.some((i) => "ui_action" in i.selector) ? v`<p class="hint action-editor-note">Edit tap, hold and double-tap actions in the Home Assistant editor.</p>` : m}`;
  }
  _renderEssentialForm(e, t, i) {
    return v`<div class="essential-fields">
      ${ve(e, t).fields.map((n) => {
      const o = n.selector.number, r = o ? { ...n, selector: { number: { ...o, mode: "box" } } } : n.name === "goToFloor" ? { ...n, helper: "Tap this object to change floors." } : n, a = o || n.name === "hand";
      return v`<div class=${a ? "essential-field" : "essential-field full"}>
          ${this._renderForm({ ...e, fields: [r] }, i)}
        </div>`;
    })}
    </div>`;
  }
  _applyFallback(e, t, i, n, o) {
    const r = Ia({ [t.name]: i }, e.fields);
    t.name in r && o(e.toPatch(r), n && Ca(t));
  }
  /** One plain-input row per schema field — the outside-HA / load-failure path. */
  _renderFallbackField(e, t, i) {
    const n = e.data[t.name], o = t.selector;
    if ("select" in o) {
      const r = o.select, a = r.options;
      if (r.custom_value) {
        const s = `sel-${t.name}-${a.length}`;
        return v`<div class="row wide">
          <label for=${`field-${t.name}`}>${t.label}</label>
          <input id=${`field-${t.name}`}
            type="text"
            list=${s}
            .value=${String(n ?? "")}
            @change=${(l) => this._applyFallback(e, t, l.target.value, !1, i)}
          />
          <datalist id=${s}>
            ${a.map((l) => v`<option value=${l.value}></option>`)}
          </datalist>
        </div>`;
      }
      return v`<div class="row">
        <label for=${`field-${t.name}`}>${t.label}</label>
        <select id=${`field-${t.name}`}
          .value=${String(n ?? "")}
          @change=${(s) => this._applyFallback(e, t, s.target.value, !1, i)}
        >
          ${a.map(
        (s) => v`<option value=${s.value} ?selected=${s.value === n}>${s.label}</option>`
      )}
        </select>
      </div>`;
    }
    if ("boolean" in o)
      return v`<div class="row">
        <label for=${`field-${t.name}`}>${t.label}</label>
        <input id=${`field-${t.name}`}
          type="checkbox"
          .checked=${!!n}
          @change=${(r) => this._applyFallback(e, t, r.target.checked, !1, i)}
        />
      </div>`;
    if ("number" in o) {
      const r = o.number, a = r.mode === "slider";
      return v`<div class="row">
        <label for=${`field-${t.name}`}>${t.label}</label>
        ${a ? v`<input aria-label=${t.label}
              type="range"
              min=${r.min ?? 0}
              max=${r.max ?? 100}
              step=${r.step ?? 1}
              .value=${String(n ?? r.min ?? 0)}
              @input=${(s) => this._applyFallback(e, t, Number(s.target.value), !0, i)}
            />` : m}
        <input id=${`field-${t.name}`}
          class="num"
          type="number"
          min=${r.min ?? m}
          max=${r.max ?? m}
          step=${r.step ?? m}
          .value=${String(n ?? "")}
          @change=${(s) => {
        const l = s.target;
        this._applyFallback(
          e,
          t,
          l.value === "" ? void 0 : Number(l.value),
          !1,
          i
        ), l.value = String(e.data[t.name] ?? "");
      }}
        />
      </div>`;
    }
    if ("entity" in o) {
      const r = o.entity;
      return v`<div class="row wide">
        <label for=${`field-${t.name}`}>${t.label}</label>
        ${this._renderEntityPicker(
        String(n ?? ""),
        (a) => this._applyFallback(e, t, a, !1, i),
        r.filter?.[0]?.domain,
        r.include_entities,
        `field-${t.name}`
      )}
      </div>`;
    }
    return "icon" in o ? v`<div class="row wide">
        <label for=${`field-${t.name}`}>${t.label}</label>
        <input id=${`field-${t.name}`}
          type="text"
          placeholder=${o.icon.placeholder ?? "mdi:…"}
          .value=${String(n ?? "")}
          @change=${(r) => this._applyFallback(e, t, r.target.value, !1, i)}
        />
      </div>` : "ui_action" in o ? v`${m}` : v`<div class="row">
      <label for=${`field-${t.name}`}>${t.label}</label>
      <input id=${`field-${t.name}`}
        type="text"
        .value=${String(n ?? "")}
        @input=${(r) => this._applyFallback(e, t, r.target.value, !0, i)}
      />
    </div>`;
  }
  _renderEntityPicker(e, t, i, n, o) {
    return customElements.get("ha-entity-picker") ? v`<ha-entity-picker
        id=${o ?? m}
        .hass=${this.hass}
        .value=${e}
        .includeDomains=${i}
        .includeEntities=${n}
        allow-custom-entity
        @value-changed=${(r) => t(r.detail.value ?? "")}
      ></ha-entity-picker>` : v`<input
      id=${o ?? m}
      type="text"
      placeholder="sensor.example"
      .value=${e}
      @change=${(r) => t(r.target.value)}
    />`;
  }
  /**
   * Attribute field for the hand-rolled rows, mirroring
   * {@link _renderEntityPicker}: HA's own attribute dropdown when the frontend
   * has registered it, a plain text input otherwise.
   *
   * The dropdown is the whole point — it lists the attributes the entity
   * *actually has*, which is what `ha-form`'s `attribute` selector gives the
   * device's own Attribute field. A repeatable row cannot go through `ha-form`,
   * but that is no reason for it to be a worse control: typing `curent_temp`
   * into a free-text box fails silently at render time, which is exactly the
   * bug a picker cannot have.
   *
   * `entityId` is what the attributes are listed from — the row's own entity
   * when it names one, else the device's, which is the same fallback the
   * reading itself resolves through.
   */
  _renderAttributePicker(e, t, i, n) {
    return customElements.get("ha-entity-attribute-picker") && e ? v`<ha-entity-attribute-picker
        class="reading-attr"
        .hass=${this.hass}
        .entityId=${e}
        .value=${t}
        allow-custom-value
        title=${n ?? m}
        @value-changed=${(o) => i(o.detail.value ?? "")}
      ></ha-entity-attribute-picker>` : v`<input
      type="text"
      class="reading-attr"
      placeholder="attribute"
      title=${n ?? m}
      .value=${t}
      @change=${(o) => i(o.target.value)}
    />`;
  }
  /**
   * Icon field for the hand-rolled rows (issue #106), mirroring
   * {@link _renderEntityPicker}: HA's searchable picker when the frontend has
   * registered it, a plain text input otherwise. Used by the state-rule list,
   * which cannot go through `ha-form` because it is repeatable, and by the
   * device's own icon row that sits beside it (issue #127).
   */
  _renderIconPicker(e, t, i) {
    return customElements.get("ha-icon-picker") ? v`<ha-icon-picker
        class="rule-icon"
        .hass=${this.hass}
        .value=${e}
        placeholder=${i?.placeholder ?? "Icon"}
        title=${i?.title ?? m}
        @value-changed=${(n) => t(n.detail.value ?? "")}
      ></ha-icon-picker>` : v`<input
      type="text"
      class="rule-icon"
      placeholder=${i?.placeholder ?? "mdi:blinds"}
      title=${i?.title ?? m}
      .value=${e}
      @change=${(n) => t(n.target.value)}
    />`;
  }
  /** Toggle the full-screen workspace. */
  _toggleFullscreen() {
    this._fullscreen = !this._fullscreen, this._fullscreen && this._canvasWrap && (this._canvasWrap.style.width = "", this._canvasWrap.style.height = ""), this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "";
  }
  _chooseTool(e) {
    this._tool = e, this._mobileInspector = !1, this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaHover = null, this._areaDragStart = null, this._areaDragCurrent = null, this._clearAreaDragTimer(), this._areaDragMoved = !1;
  }
  _setInspector(e) {
    this._numberDraft = void 0, this._projectOpen = e, this.renderRoot.querySelector(".side")?.scrollTo({ top: 0 });
  }
  async _jumpToInspector(e = !1) {
    this._setInspector(e), this._mobileInspector = !0, await this.updateComplete, this.renderRoot.querySelector(e ? "#project-tab" : "#selection-tab")?.focus({ preventScroll: !0 });
  }
  async _jumpToCanvas() {
    this._mobileInspector = !1, await this.updateComplete, this._canvasWrap?.focus({ preventScroll: !0 });
  }
  /** A smaller preview should pan to the edited object without replacing manual zoom. */
  _keepSelectionInPreview() {
    if (!this._mobileInspector || this._projectOpen || this._gesturePointer !== null) return;
    const e = this.renderRoot.querySelector(".canvas-jump"), t = this.renderRoot.querySelector(".stage .selected"), i = this._canvasWrap;
    if (!e?.getClientRects().length || !i?.clientHeight || !t) return;
    const n = i.getBoundingClientRect(), o = t.getBoundingClientRect(), r = n.left + i.clientWidth, a = n.top + i.clientHeight;
    (o.left < n.left || o.right > r || o.top < n.top || o.bottom > a) && this._scrollCanvas(
      i.scrollLeft + (o.left + o.right - n.left - r) / 2,
      i.scrollTop + (o.top + o.bottom - n.top - a) / 2
    );
  }
  /**
   * The "+ Add" popover: device, text, then every symbol as its real glyph.
   *
   * The grid is searchable and grouped (issue #90). It was 26 fixed cells over
   * six rows, which was already the tallest thing in the editor; with a
   * community library behind it the list only grows, so the query filters on id,
   * name, category and the symbol's own keywords — "couch" finds the sofa.
   */
  _renderAddMenu() {
    const e = () => {
      this._addMenuOpen = !1, this._addQuery = "";
    }, t = this._symbols(), i = Gl(t).filter((r) => Rf(r, this._addQuery)), n = !this._addQuery.trim();
    let o = "";
    return v`
      <div class="pop left add-pop">
        <div class="add-shortcuts">
        <button
          class="add-entry"
          @click=${() => {
      this._addItem("generic"), e();
    }}
        >
          <ha-icon icon="mdi:lightbulb-outline"></ha-icon> Device
        </button>
        <button
          class="add-entry"
          @click=${() => {
      this._addText(), e();
    }}
        >
          <ha-icon icon="mdi:format-text"></ha-icon> Text
        </button>
        </div>
        <div class="furn-search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            placeholder="Search furniture"
            .value=${this._addQuery}
            @input=${(r) => {
      this._addQuery = r.target.value;
    }}
            @keydown=${(r) => {
      r.key === "Escape" && this._addQuery && (r.stopPropagation(), this._addQuery = "");
    }}
          />
        </div>
        <div class="add-furn-scroll">
          ${i.length ? i.map((r) => {
      const a = n && r.category !== o ? r.category : "";
      return o = r.category, v`${a ? v`<div class="furn-group">${a}</div>` : m}
                  ${this._renderFurnCell(r, e)}`;
    }) : v`<div class="furn-empty">No symbol matches “${this._addQuery}”</div>`}
        </div>
      </div>
    `;
  }
  /** One picker cell: the symbol drawn at its own default size, plus its name. */
  _renderFurnCell(e, t) {
    const { w: i, h: n } = e.size, o = Math.max(i, n) * 0.25 + 6, r = `${-i / 2 - o} ${-n / 2 - o} ${i + o * 2} ${n + o * 2}`;
    return v`
      <button
        class="furn-cell"
        title=${e.name}
        @click=${() => {
      this._addFurniture(e.id), t();
    }}
      >
        <svg viewBox=${r}>
          ${qt(
      { id: "preview", type: e.id, x: 0, y: 0, w: i, h: n },
      void 0,
      this._symbols()
    )}
        </svg>
        <span>${e.name}</span>
      </button>
    `;
  }
  /**
   * Per-element properties in the inspector beside the canvas (below on mobile).
   * Kept separate from the project panel so users can tell the two apart, and
   * separate from the context bar so the bar's height stays stable across
   * selection changes (the canvas no longer jumps when you click around).
   */
  _renderElementEdit() {
    const e = this._selection.length, t = this._primary();
    if (e === 0 || !t)
      return v`
        <section class="edit-area">
          <div class="inspector-empty">
            <ha-icon icon="mdi:cursor-default-outline"></ha-icon>
            <strong>Select an object</strong>
            <p>Select a wall, room or object to edit its properties.</p>
            <span>Drag a box to select several.</span>
          </div>
        </section>
      `;
    const i = e > 1 ? `${e} elements selected` : this._selectionSummary(t), n = e === 1 && t.kind === "furniture" ? this._floor().furniture.find((s) => s.id === t.id) : void 0, o = e === 1 && t.kind === "item" ? this._floor().items.find((s) => s.id === t.id) : void 0, r = e === 1 && t.kind === "opening" ? this._floor().openings.find((s) => s.id === t.id) : void 0, a = e > 1 ? "mdi:select-group" : o ? $i(o, this.hass?.states[o.entity], this.hass?.entities?.[o.entity]?.icon) : r ? tt[r.type].icon : ev[t.kind];
    return v`
      <section class="edit-area">
        <div class="edit-head">
          ${n ? (() => {
      const { w: s, h: l } = zr(n.type, this._symbols()), c = Math.max(s, l) * 0.2 + 6;
      return v`<svg class="selection-symbol" aria-hidden="true" viewBox=${`${-s / 2 - c} ${-l / 2 - c} ${s + 2 * c} ${l + 2 * c}`}>
              ${qt({ ...n, x: 0, y: 0, angle: 0, w: s, h: l }, "currentColor", this._symbols())}
            </svg>`;
    })() : v`<ha-icon icon=${a} aria-hidden="true"></ha-icon>`}
          <span class="edit-title" title=${i}>${i}</span>
          <span class="head-spacer"></span>
          ${(() => {
      const s = this._floor(), l = this._selection.every((c) => fi(s, c));
      return v`<button
              class=${l ? "on" : ""}
              aria-label=${l ? "Unlock" : "Lock in place"}
              aria-pressed=${l ? "true" : "false"}
              title=${l ? "Unlock — let it be dragged again" : "Lock in place — it can still be selected and edited, just not moved"}
              @click=${() => this._setLocked(!l)}
            >
              <ha-icon icon=${l ? "mdi:lock" : "mdi:lock-open-variant-outline"}></ha-icon>
            </button>`;
    })()}
          <button aria-label="Duplicate" title="Duplicate (Ctrl/Cmd+D)" @click=${this._duplicate}>
            <ha-icon icon="mdi:content-duplicate"></ha-icon>
          </button>
          <button class="danger" aria-label="Delete" title="Delete (Del)" @click=${this._deleteSelected}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${e > 1 ? v`<p class="hint">
              Edit elements one at a time. Drag any selected element to move the whole group.
            </p>` : v`
              ${this._renderPagePicker(vi[t.kind], !1)}
              ${this._renderAreaScopeHint()}
              <div id="object-settings-page" role=${vi[t.kind].length > 1 ? "tabpanel" : m}
                aria-labelledby=${vi[t.kind].length > 1 ? `object-category-${this._selectionPage}` : m}
                class="rows ${this._selectionPage === "properties" ? "essential-properties" : "category-properties"}">${this._renderSelectionEditor()}</div>`}
      </section>
    `;
  }
  /**
   * An LED strip's run (issue #298), and — while its device is selected — a
   * handle on each end, dragged like a wall's. The device's own icon still
   * selects and moves it; the run follows because it is centred on the icon.
   */
  _renderStripSel(e) {
    const t = e.glow ? st(e) : void 0;
    if (!t) return m;
    const i = Wr(e, e.entity ? this.hass?.states[e.entity] : void 0), n = this._isSel("item", e.id) && !e.locked;
    return _`
      ${Ds(t, i?.color)}
      ${n ? _`
              <circle cx=${t.x1} cy=${t.y1} r="7" class="handle"
                      @pointerdown=${(o) => this._startDrag(o, { kind: "item", id: e.id }, void 0, void 0, void 0, 1)} />
              <circle cx=${t.x2} cy=${t.y2} r="7" class="handle"
                      @pointerdown=${(o) => this._startDrag(o, { kind: "item", id: e.id }, void 0, void 0, void 0, 2)} />` : m}`;
  }
  _renderWall(e, t) {
    const i = this._isSel("wall", e.id), n = i && !e.locked, o = t?.side, r = t?.edgeIndex ?? -1, a = !!t && !t.area.locked, s = t?.area.sideWalls?.[o], c = Math.abs(e.y1 - e.y2) < de ? "ns" : "ew", p = e.divider ? qs() : Vs(e.thickness, e.kind);
    return _`
      <g>
        <line x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}
              class=${["wall-hit", t ? "side-wall-edge" : "", c].filter(Boolean).join(" ")}
              @pointerdown=${(d) => {
      if (t) {
        this._startDrag(d, { kind: "area", id: t.area.id }, void 0, void 0, r);
        return;
      }
      this._startDrag(d, { kind: "wall", id: e.id });
    }}
              @dblclick=${(d) => {
      t && (d.preventDefault(), d.stopPropagation(), this._toggleRectAreaSide(t.area, r));
    }} />
        <g class="fp-wall-neon"><line x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}
            class="wall ${i ? "selected" : ""} ${qe(e) ? "railing" : ""} ${t ? "side-wall-edge" : ""} ${c}"
              mask=${`url(#${this._wallMaskId})`}
              style=${p} stroke-linecap="round" /></g>
        ${n ? _`
                <circle cx=${e.x1} cy=${e.y1} r="9" class="handle"
                        @pointerdown=${(d) => this._startDrag(d, { kind: "wall", id: e.id }, 1)} />
                <circle cx=${e.x2} cy=${e.y2} r="9" class="handle"
                        @pointerdown=${(d) => this._startDrag(d, { kind: "wall", id: e.id }, 2)} />` : m}
        ${a ? _`
                <path
                  d=${(() => {
      const d = (e.x1 + e.x2) / 2, h = (e.y1 + e.y2) / 2, u = 7;
      return `M ${d} ${h - u} L ${d + u} ${h} L ${d} ${h + u} L ${d - u} ${h} Z`;
    })()}
                  class=${["area-wall-toggle", s ?? "none"].join(" ")}
                  title=${s ? `Double-click to cycle this ${o} wall: ${s}` : `Double-click to add a wall on the ${o} side`}
                  @dblclick=${(d) => {
      d.preventDefault(), d.stopPropagation(), this._toggleRectAreaSide(t.area, r);
    }} />` : m}
      </g>`;
  }
  _renderOpeningSel(e) {
    const t = this._isSel("opening", e.id), i = t ? "var(--primary-color, #03a9f4)" : bo;
    return _`
      <g class="opening-hit"
         @pointerdown=${(n) => this._startDrag(n, { kind: "opening", id: e.id })}>
        ${Wo(e, {
      color: i,
      // The closed colour previews here too (issue #228) — unless this is
      // the selected opening, whose whole symbol goes blue to show that.
      inactive: t ? void 0 : e.inactiveColor,
      open: _n(e),
      // Draw sliding / rolling openings partly open in the editor so the
      // motion is visible — closed, both look like a plain band, which
      // would make the Motion / Slide / Style controls appear inert.
      amount: ne(e) !== "swing" ? 0.55 : void 0,
      // Shutter previewed half-rolled so the layer is visible while
      // configuring, whatever the live state.
      shutter: e.shutterEntity ? { amount: 0.55, style: nt(e), flip: e.shutterFlipV } : void 0
    })}
        ${// A skylight is an outline around empty floor, and the strokes are
    // all there is to grab: without this you can only pick it up by its
    // frame or by a dashed diagonal, which on a large roof light means
    // most of the shape you are looking at does not answer the pointer.
    // The card gives every pressable opening the same target for the
    // same reason (openingHitSize); the wall openings do not need one
    // here because a door's own symbol is barely wider than the target
    // would be.
    ie(e) ? (() => {
      const n = eo(e);
      return _`<rect class="skylight-hit"
                    x=${e.x - n.width / 2} y=${e.y - n.height / 2}
                    width=${n.width} height=${n.height}
                    transform="rotate(${e.angle} ${e.x} ${e.y})" />`;
    })() : m}
        ${// A passage draws nothing on the card — the gap in the wall is the
    // whole symbol (issue #309) — which here would leave nothing to see
    // and nothing to grab. So the editor alone marks it: the gap itself
    // as the target, and a dashed line across it that turns blue with
    // the selection the way a door's own symbol does.
    xe(e) ? (() => {
      const n = eo(e), o = e.length / 2;
      return _`<g transform="translate(${e.x} ${e.y}) rotate(${e.angle})">
                    <rect class="passage-hit"
                        x=${-n.width / 2} y=${-n.height / 2}
                        width=${n.width} height=${n.height} />
                    <line class="passage-mark" x1=${-o} y1="0" x2=${o} y2="0"
                        stroke=${i} stroke-width="1.5" stroke-dasharray="4 3" />
                  </g>`;
    })() : m}
      </g>`;
  }
  /**
   * Render a Tracker in the editor SVG with its zone outline visible (so the
   * user can grab/resize it) plus a hit overlay for drag-to-move and a dashed
   * selection rectangle when active.
   */
  _renderTrackerSel(e) {
    const t = this._isSel("tracker", e.id), i = Qi(this.hass?.states, e.xSensor?.entity), n = Qi(this.hass?.states, e.ySensor?.entity), o = ji(this.hass?.states, e.xSensor?.presence), r = ji(this.hass?.states, e.ySensor?.presence);
    return _`
      <g class="tracker-hit ${t ? "selected" : ""}"
         @pointerdown=${(a) => this._startDrag(a, { kind: "tracker", id: e.id })}>
        ${Al(e, {
      editing: !0,
      xReading: i,
      yReading: n,
      xPresent: o,
      yPresent: r
    })}
        <rect x=${e.x} y=${e.y} width=${e.w} height=${e.h}
              transform="rotate(${e.angle ?? 0} ${e.x + e.w / 2} ${e.y + e.h / 2})"
              class="tracker-hit-rect" />
        ${t ? _`<rect x=${e.x - 4} y=${e.y - 4}
                        width=${e.w + 8} height=${e.h + 8}
                        transform="rotate(${e.angle ?? 0} ${e.x + e.w / 2} ${e.y + e.h / 2})"
                        class="tracker-outline" />` : m}
      </g>`;
  }
  _renderFurnitureSel(e) {
    const t = this._isSel("furniture", e.id);
    return _`
      <g class="furn-hit ${t ? "selected" : ""}"
         @pointerdown=${(i) => this._startDrag(i, { kind: "furniture", id: e.id })}>
        ${qt(e, void 0, this._symbols())}
        ${t ? _`<rect x=${e.x - e.w / 2 - 4} y=${e.y - e.h / 2 - 4}
                        width=${e.w + 8} height=${e.h + 8}
                        transform="rotate(${e.angle ?? 0} ${e.x} ${e.y})"
                        class="furn-outline" />` : m}
      </g>`;
  }
  /**
   * A committed Area: the translucent fill (shared with the live card),
   * a transparent hit-polygon for click-to-select and whole-shape drag, and
   * — while selected — a heavier outline plus one draggable handle per
   * vertex (decision #1 in areas.md: vertices reshape independently, with
   * no cross-element corner-stretch).
   */
  /**
   * States in words what the canvas animation shows: this element sits in a
   * linked room, so its entity picker only lists that room's entities. Colour
   * alone can't carry that, and the off-switch lives on the Area element.
   */
  _renderAreaScopeHint() {
    const e = this._scopingAreaId();
    if (!e) return m;
    const t = (this._floor().areas ?? []).find((n) => n.id === e), i = t?.name ? t.name : "this area";
    return v`<p class="hint area-scope-hint">
      <ha-icon icon="mdi:vector-polygon"></ha-icon>
      <span>Only entities in <strong>${i}</strong> are listed.</span>
      <button
        class="link-btn"
        title="Turn off Filter entities for this area — every entity becomes selectable"
        @click=${() => this._updateArea(e, { filterEntities: !1 })}
      >
        Show all
      </button>
    </p>`;
  }
  _toggleRectAreaSide(e, t) {
    if (e.locked) return;
    const i = ze[t % ze.length], n = yy(e.sideWalls?.[i]), o = { ...e.sideWalls ?? {} };
    n === "none" ? delete o[i] : o[i] = n, this._updateArea(e.id, { sideWalls: Object.keys(o).length ? o : void 0 });
  }
  _renderAreaSel(e, t) {
    const i = this._isSel("area", e.id), n = e.id === t, o = e.points.map((a) => `${a.x},${a.y}`).join(" "), r = (this._floor().areas ?? []).filter((a) => a.id !== e.id).flatMap((a) => my(e.points, a.points).map((s) => ({ side: s, otherId: a.id }))).filter(({ otherId: a }) => e.id.localeCompare(a) < 0);
    return _`
      <g class="area-hit ${i ? "selected" : ""} ${n ? "scoping" : ""}">
        ${n ? _`<polygon points=${o} class="area-scoping" />` : m}
        ${Ml(e)}
        <polygon points=${o} class="area-hit-shape"
                 @pointerdown=${(a) => this._startDrag(a, { kind: "area", id: e.id })} />
        ${i ? _`<polygon points=${o} class="area-outline" />` : m}
        ${r.map(({ side: a }) => {
      const s = ze.indexOf(a), l = e.points[s], c = e.points[(s + 1) % e.points.length], p = { x: (l.x + c.x) / 2, y: (l.y + c.y) / 2 }, d = 8, h = a === "top" || a === "bottom" ? `M ${p.x - d} ${p.y - d} L ${p.x + d} ${p.y + d} M ${p.x - d} ${p.y + d} L ${p.x + d} ${p.y - d}` : `M ${p.x - d} ${p.y + d} L ${p.x + d} ${p.y - d} M ${p.x - d} ${p.y - d} L ${p.x + d} ${p.y + d}`;
      return _`<path d=${h} class="area-shared-wall" />`;
    })}
        ${// Outline yes, vertex and edge handles no, for a pinned room — same
    // reasoning as the wall's endpoints (issue #191): still visibly
    // selected, with nothing on it that pretends to be draggable.
    i && !e.locked ? [
      ...e.points.map(
        (a, s) => _`
                    <circle cx=${a.x} cy=${a.y} r="7" class="handle"
                            @pointerdown=${(l) => this._startDrag(l, { kind: "area", id: e.id }, void 0, s)} />`
      ),
      ...Ie(e.points) ? [
        ...e.points.map((a, s) => {
          const l = e.points[(s + 1) % e.points.length], p = Math.abs(a.y - l.y) < de ? "ns" : "ew";
          return _`
                          <line
                            x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y}
                            class=${["area-edge-hit", p].join(" ")}
                            @pointerdown=${(d) => {
            this._startDrag(d, { kind: "area", id: e.id }, void 0, void 0, s);
          }}
                            @dblclick=${(d) => {
            d.preventDefault(), d.stopPropagation(), this._toggleRectAreaSide(e, s);
          }} />`;
        }),
        ...e.points.map((a, s) => {
          const l = e.points[(s + 1) % e.points.length], c = { x: (a.x + l.x) / 2, y: (a.y + l.y) / 2 }, p = Math.abs(a.y - l.y) < de, d = ze[s], h = e.sideWalls?.[d];
          return _`
                          <circle
                            cx=${c.x}
                            cy=${c.y}
                            r="5"
                            class=${[
            "handle",
            "area-edge-handle",
            p ? "ns" : "ew",
            h ? "side-wall-toggle" : ""
          ].filter(Boolean).join(" ")}
                            title=${h ? `Double-click to cycle this ${d} wall: ${h}` : `Double-click to add a wall on the ${d} side`}
                            @pointerdown=${(u) => this._startDrag(u, { kind: "area", id: e.id }, void 0, void 0, s)}
                            @dblclick=${(u) => {
            u.preventDefault(), u.stopPropagation(), this._toggleRectAreaSide(e, s);
          }} />`;
        })
      ] : []
    ] : m}
      </g>`;
  }
  /**
  * The in-progress Area draft: committed vertices as dots and straight
  * segments between them. Once 3+ points are down the starting vertex is
  * drawn larger/hollow so it's visually obvious that clicking it closes the
  * polygon (see `_onCanvasDown`).
   */
  _renderAreaDraft() {
    const e = this._draftArea;
    if (!e) return m;
    const t = e.points, i = t.map((a) => `${a.x},${a.y}`).join(" "), n = t[t.length - 1], o = t.length >= 3, r = this._areaHover;
    return _`
      <g class="area-draft">
        ${t.length > 1 ? _`<polyline points=${i} class="area-draft-line" />` : m}
        ${r ? _`<line x1=${n.x} y1=${n.y} x2=${r.x} y2=${r.y}
                        class="area-draft-hover" />` : m}
        ${t.map(
      (a, s) => s === 0 && o ? _`<circle cx=${a.x} cy=${a.y} r="9" class="area-draft-start" />` : _`<circle cx=${a.x} cy=${a.y} r="5" class="area-draft-point" />`
    )}
      </g>`;
  }
  /**
   * The card's shutter badge, previewed (issue #74 follow-up) — an opening
   * with both entities bound shows the shutter's own icon beside it, and the
   * editor is where you find out whether it lands somewhere sensible.
   *
   * Inert here: the canvas selects and drags openings by clicking them, and a
   * badge that swallowed those clicks would make the opening under it awkward
   * to grab. On the card it is a control; here it is a picture of one.
   */
  _renderShutterMarkOverlay(e, t, i) {
    const n = e.shutterEntity, o = this.hass?.states[n], r = Te(o, e.shutterInvert) > 0, a = cl(e, o, r, this.hass?.entities?.[n]?.icon), s = R(e.shutterActiveColor ?? e.activeColor) ?? Q, l = jo(e), c = No(e), p = K(Ki, i), d = K(Gi, i);
    return v`<div
      class="shutter-mark ${Mi(o, e.shutterInvert) ? "on" : "off"}"
      style="left:${l.x / t.width * 100}%; top:${l.y / t.height * 100}%;
             width:${p};height:${p};
             transform:translate(-50%,-50%)
                       translate(calc(${c.x} * ${d}), calc(${c.y} * ${d}));
             --fp-active:${s};"
      title=${`${o?.attributes?.friendly_name ?? n} — shown on the card, tap it there to open the shutter`}
    >
      <ha-icon icon=${a} style="--mdc-icon-size:${K(
      Xi,
      i
    )};"></ha-icon>
    </div>`;
  }
  /**
   * The card's opening badge, previewed (issue #154 follow-up). Same reason as
   * the shutter's preview above: turning **Show icon** on and finding out where
   * the badge lands is the whole point of having a canvas. Inert here too.
   */
  _renderOpeningMarkOverlay(e, t, i) {
    const n = e.entity, o = this.hass?.states[n], r = _t(e, o) > 0, a = hl(e, o, r, this.hass?.entities?.[n]?.icon), s = R(e.activeColor) ?? Q, l = pl(e), c = ul(e), p = K(Ki, i), d = K(Gi, i);
    return v`<div
      class="shutter-mark ${Jn(e, o) ? "on" : "off"}"
      style="left:${l.x / t.width * 100}%; top:${l.y / t.height * 100}%;
             width:${p};height:${p};
             transform:translate(-50%,-50%)
                       translate(calc(${c.x} * ${d}), calc(${c.y} * ${d}));
             --fp-active:${s};"
      title=${`${o?.attributes?.friendly_name ?? n} — shown on the card, tap it there to open its dialog`}
    >
      <ha-icon icon=${a} style="--mdc-icon-size:${K(
      Xi,
      i
    )};"></ha-icon>
    </div>`;
  }
  _renderItemOverlay(e, t, i) {
    const n = this._isSel("item", e.id), o = e.entity ? this.hass?.states[e.entity] : void 0, r = $i(e, o, e.entity ? this.hass?.entities?.[e.entity]?.icon : void 0), { text: a, live: s } = Pm(this.hass, e), l = O(e.size, je), c = ei(e) !== "none", p = e.display ?? "badge", d = Ro(e, o), h = R(gn(e.stateColor, d)), u = Bs(e, h), f = ei(e) === "value" ? el(this.hass, e) : void 0, g = He(e.entity, o?.state), y = g ? R(e.activeColor) ?? zs(o) : void 0, b = !!this.hass && Zn(e, o?.state), k = g || b ? void 0 : R(e.inactiveColor), S = Ka(
      Ci(h ?? y ?? k, this._config?.palette)
    ), x = e.rippleColor ?? h ?? y ?? Q, $ = e.rippleSize ?? dn, M = e.rippleDirection ?? hn, P = e.rippleWidth ?? pn, A = Xs(e, o?.state, o?.attributes), I = K(l, i), C = v`<div
      class="badge ${c ? "" : "ghost"} ${h ? "state-colored" : g ? "active-colored" : k ? "inactive-colored" : ""}"
      style="width:${I};height:${I};transform:rotate(${O(e.angle, 0)}deg);${h ? `--fp-state:${h};` : ""}${y ? `--fp-active:${y};` : ""}${k ? `--fp-inactive:${k};` : ""}${S ? `--fp-ink:${S};` : ""}"
    >
      ${f ? v`<span
            class="badge-value"
            style="font-size:${K(nl(l, f), i)};"
            >${f}</span
          >` : v`<ha-icon
            class=${A ? `anim-${A}` : ""}
            icon=${r}
            style="--mdc-icon-size:${K(Qs(l), i)};"
          ></ha-icon>`}
    </div>`;
    let L;
    p === "ripple" ? L = Zi(!0, x, $, M, P, 3, i) : p === "iconRipple" ? L = v`<div class="stack">
        ${Zi(!0, x, $, M, P, 3, i)}
        <div class="stack-icon">${C}</div>
      </div>` : L = C;
    const B = Hs(e, o?.state, this.hass);
    return v`
      <div
        class="edit-item ${n ? "selected" : ""} ${B ? "card-hidden" : ""}"
        style="left:${e.x / t.width * 100}%; top:${e.y / t.height * 100}%;"
        @pointerdown=${(j) => this._onOverlayDown(j, { kind: "item", id: e.id })}
        @pointermove=${this._onOverlayMove}
        @pointerup=${this._onOverlayUp}
        @pointercancel=${this._onPointerCancel}
      >
        ${L}
        <!-- The card's own label line when there is one (issue #135), so
             turning Show state on is visible here rather than only after
             leaving the editor; otherwise the dim identification fallback.
             The Labels toolbar toggle hides either on dense plans (issue
             #52), and the size previews the card's labelSize (issue #59). -->
        ${this._hideLabels ? m : v`<span
            class="ilabel ${s ? "live" : ""} ilabel-${Bi(e)}"
            style="font-size:${K(
      s || e.labelSize != null ? Ws(e.labelSize) : 11,
      i
    )};${s && u ? `color:${u};` : ""}"
            >${a}</span
          >`}
      </div>
    `;
  }
  /**
   * The floor switcher, draggable on the canvas (issue #281) — "the most
   * flexible solution would be to make this part freely movable, like a piece
   * of furniture", and the maintainer's "lets start with full freedom".
   *
   * Deliberately **not** a {@link SelKind}. Every kind in that union names a
   * per-floor array of things with ids, and the editor's machinery reads it
   * that way throughout: snapshots, group drags, locking, duplicate, delete,
   * the selection summary and its icon. The switcher is one card-level thing
   * with no id, and none of those operations mean anything for it — adding a
   * kind would have put a special case in each of them, which is a lot of
   * places to be wrong in.
   *
   * So it carries its own small drag instead: three handlers and one field,
   * touching nothing the selection model owns.
   */
  _renderSwitcherHandle(e) {
    const t = O(e.width, be), i = O(e.height, we), n = Rt(e) ?? wi(t, i), o = !!Rt(e), r = e.floors ?? [];
    return v`
      <div
        class="switcher-handle floor-switcher ${qa(e)} ${this._switcherDrag ? "dragging" : ""} ${o ? "" : "default"} ${this._tool === "select" ? "" : "passive"}"
        style="left:${n.x / t * 100}%; top:${n.y / i * 100}%;"
        title=${o ? "Drag to move the floor switcher" : "Drag to move the floor switcher off the corner"}
        @pointerdown=${this._onSwitcherDown}
        @lostpointercapture=${this._onSwitcherCancel}
      >
        ${r.map(
      (a) => v`<span class="sh-btn floor-button ${a.id === this._activeFloorId ? "active" : ""}"
            style=${R(a.color) ? `--fp-floor-accent:${R(a.color)};` : m}
            >${a.short || a.name}</span
          >`
    )}
      </div>
    `;
  }
  /**
   * Take the drag's finger out of the pinch bookkeeping.
   *
   * `_onWrapPointerDown` counts every touch that lands on the canvas, the
   * switcher's included, and only `_onWrapPointerEnd` takes it out again. The
   * drag's own listeners run first — on the shadow root, above `.canvas-wrap`
   * — and stop the event, so that end handler never hears this finger lift.
   * Left counted, the next single touch reads as a second finger and starts a
   * pinch nobody is making. Called on every path that ends the drag's pointer,
   * before the event is stopped from reaching the wrap.
   */
  _forgetSwitcherTouch(e) {
    this._onWrapPointerEnd(e);
  }
  /**
   * Put the config back as it was before the switcher drag started.
   *
   * Nothing was emitted while it was live, so the host still holds the pre-drag
   * config and restoring it locally spares a round trip. The undo stack and the
   * redo stack are both put back as they stood before the first-movement push,
   * so a canceled drag is a complete no-op — the same contract `_cancelGesture`
   * keeps for an element drag.
   */
  _rollBackSwitcherDrag() {
    const e = this._switcherDrag;
    e && (this._switcherMoves.cancel(), this._switcherDrag = void 0, this._gesturePointer = null, e.moved && (e.priorHistory && (this._history = e.priorHistory), this._config = e.before, this._watchedEntities = yt(e.before), this._future = e.priorFuture));
  }
  _renderTextOverlay(e, t, i) {
    const n = this._isSel("text", e.id);
    return v`
      <div
        class="edit-text ${n ? "selected" : ""}"
        style="left:${e.x / t.width * 100}%; top:${e.y / t.height * 100}%;
               font-size:${K(O(e.size, jt), i)};
               color:${fe(e.color, Ya)};
               transform:translate(-50%,-50%) rotate(${O(e.angle, 0)}deg);"
        @pointerdown=${(o) => this._onOverlayDown(o, { kind: "text", id: e.id })}
        @pointermove=${this._onOverlayMove}
        @pointerup=${this._onOverlayUp}
        @pointercancel=${this._onPointerCancel}
      >
        ${Po(this.hass, e) || "…"}
      </div>
    `;
  }
  _renderPanel() {
    return v`
      <section class="panel">
        ${this._renderPagePicker(Ma, !0)}
        <div id="project-settings-page" role="tabpanel" aria-labelledby=${`project-category-${this._projectPage}`}>
          ${this._renderPanelBody()}
        </div>
      </section>
    `;
  }
  /**
   * The Project panel, grouped on the same criteria as the element panels:
   * what the plan *is*, then how it *looks*, then what it *does*.
   *
   * It had the same problem the device panel had — nineteen controls in one
   * run, with the sun's five aiming fields separated from the two brightness
   * sliders by a press-effect dropdown, and "Offline devices" filed under
   * display next to the card's rotation.
   *
   * `offlineStyle` moves out of the display slice and joins the press effect:
   * both are statements about how *devices* look and answer, not about how the
   * card is framed. It stays in `projectDisplayForm` as a field — one form, one
   * `toPatch` — and is sliced into the group it belongs to (see `formSlice`).
   */
  _renderPanelBody() {
    const e = this._config, t = (n) => this._patchConfig(n), i = Ub(e);
    return v`
      <div class="rows panel-body">
        ${this._renderGroup(
      "Project",
      this._renderForm(Nb(e), (n, o) => {
        "grid" in n && typeof n.grid == "number" && (n = { ...n, ...this._gridPatch(n.grid) }), o ? this._patchConfigLive(n) : this._patchConfig(n);
      })
    )}
        ${this._renderGroup(
      // The plan's own look: its palette, its paper, and the one drawing
      // convention that is a plan-wide choice rather than an element's.
      "Look",
      this._renderForm(Bb(e), t),
      this._renderColorRow({
        label: "Background",
        value: e.background,
        swatch: "#ffffff",
        placeholder: "#ffffff or empty",
        onLive: (n) => this._patchConfigLive({ background: n }),
        onCommit: (n) => this._patchConfig({ background: n })
      }),
      this._renderForm(Vb(e), t)
    )}
        ${this._renderGroup(
      // Named colours (issue #265). Its own group rather than a row inside
      // Look: it is a list that grows, and it is the one thing here that
      // other panels reach back into.
      "Named colors",
      this._renderPalettePanel()
    )}
        ${this._renderGroup(
      // Where the floor switcher sits (issue #281). Under Project because
      // it is one control for the whole card, not a property of a floor —
      // and next to the plan's own look, which is what it sits on.
      "Floor switcher",
      this._renderSwitcherPlacement()
    )}
        ${this._renderGroup(
      // Per floor, not per project — but it is the floor's paper, so it
      // belongs beside the plan's own.
      "Floor image",
      this._renderForm(Kb(this._floor()), (n, o) => {
        o ? this._patchFloorLive(n) : this._commitFloor(n);
      })
    )}
        ${this._renderGroup(
      // How the card is framed on the dashboard, as opposed to what is
      // drawn inside it. Set once for a surface and rarely touched again.
      "Display",
      this._renderForm(
        ve(i, [
          "view",
          "appearance",
          "showViewControls",
          "showExport",
          "wallHeight",
          "wallOpacity",
          "rotation",
          "rotationPortrait",
          "rotationLandscape",
          "overlayScale",
          "overlayMinWidth",
          "compactHeader",
          "zoomedOverlayAuto",
          "zoomedOverlayScale",
          "roomFocusControls",
          "roomFocusInterval"
        ]),
        t
      )
    )}
        ${this._renderGroup(
      // Light through the openings (issue #177) — where it comes from and
      // what it looks like where it lands.
      "Sunlight",
      this._renderForm(Gb(e), t),
      e.sunlight ? v`${this._renderColorRow({
        label: "Sun color",
        title: "Color of the light the openings let in",
        value: e.sunlightColor,
        swatch: "#ffd9a0",
        placeholder: "(warm white)",
        onLive: (n) => this._patchConfigLive({ sunlightColor: n }),
        onCommit: (n) => this._patchConfig({ sunlightColor: n })
      })}
              ${e.sunShade === !1 ? m : this._renderColorRow({
        label: "Shade color",
        title: "Color of everywhere the light does not reach",
        value: e.sunShadeColor,
        swatch: "#000000",
        placeholder: "(black)",
        onLive: (n) => this._patchConfigLive({ sunShadeColor: n }),
        onCommit: (n) => this._patchConfig({ sunShadeColor: n })
      })}` : m
    )}
        ${this._renderGroup(
      // The other half of following the sun, and a separate switch: this
      // one dims the whole plan after dark rather than casting anything.
      "Night dimming",
      this._renderForm(qb(e), t)
    )}
        ${this._renderGroup(
      // How devices look and answer, plan-wide. "Offline devices" lived
      // under display, beside the card's rotation, which is not what it is
      // about.
      "Devices",
      this._renderForm(Wb(e), t),
      this._renderForm(ve(i, ["offlineStyle"]), t),
      this._renderForm(jb(e), t)
    )}
        ${this._renderGroup("Symbols", this._renderSymbolsPanel())}
      </div>
    `;
  }
  /**
   * Paste a furniture symbol into this plan (issue #90).
   *
   * The point is that you don't need a pull request to draw something the
   * library hasn't got: paste the geometry here, it lands in the config's
   * `symbols:` block, and it appears in the picker beside the built-ins. If it
   * turns out to be generally useful, the same JSON is what you contribute to
   * `furniture/`.
   *
   * It is validated through `normalizeSymbol` — the same function the shipped
   * library goes through — so a malformed paste is reported here rather than
   * becoming a broken glyph on the plan. Nothing pasted is ever parsed as
   * markup; see `symbols.ts`.
   */
  /**
   * The plan's named colours (issue #265): *"I hate copying color hex codes
   * across so many entities."*
   *
   * Names are stored, but what elements store is a `var()` built from the name
   * (see `src/palette.ts`), so the two edits that could strand a reference are
   * the ones this panel has to be careful about — and both are handled by
   * rewriting the plan rather than by warning about it:
   *
   * - **Rename** rewrites every reference to the new name, so the link
   *   survives. Blocked when the new name would collide with another entry,
   *   since two entries sharing a slug means one of them silently stops
   *   resolving.
   * - **Delete** rewrites every reference to the literal colour the entry held.
   *   A dangling `var()` is not a colour at all, so the alternative is elements
   *   turning black the moment a name is removed. This way the plan looks
   *   exactly the same afterwards and has simply lost the link.
   */
  _renderPalettePanel() {
    const e = this._config.palette ?? [], t = (n) => this._patchConfig({ palette: n.length ? n : void 0 }), i = (n, o, r = !1) => {
      const a = e.map((s, l) => l === n ? { ...s, ...o } : s);
      r ? this._patchConfigLive({ palette: a }) : this._patchConfig({ palette: a });
    };
    return v`
      <div class="row col palette-panel">
        ${e.length ? m : v`<span class="hint"
              >Name a color here and every color field on the plan can point at it.</span
            >`}
        ${e.map(
      (n, o) => v`
            <div class="row wide palette-row">
              <input
                type="text"
                class="palette-name"
                placeholder="Warm"
                .value=${n.name ?? ""}
                @change=${(r) => this._renamePaletteColor(o, r.target)}
              />
              <input
                type="color"
                .value=${this._swatchValue(n.color, "#ff8800")}
                @input=${(r) => i(o, { color: r.target.value }, !0)}
              />
              <input
                type="text"
                class="palette-color"
                placeholder="#ff8800"
                .value=${n.color ?? ""}
                @change=${(r) => this._recolorPaletteColor(o, r.target)}
              />
              <button
                class="rule-remove"
                aria-label="Remove color"
                title="Remove this color; anything using it keeps the color it has now"
                @click=${() => this._removePaletteColor(o)}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>
          `
    )}
        ${this._paletteError ? v`<div class="symbol-error">${this._paletteError}</div>` : m}
        ${e.length >= Cl ? m : v`<div class="row wide state-color-add">
              <button
                @click=${() => {
      this._paletteError = "", t([...e, { name: this._nextPaletteName(e), color: "#ff8800" }]);
    }}
              >
                <ha-icon icon="mdi:plus"></ha-icon>Add color
              </button>
            </div>`}
      </div>
    `;
  }
  /** "Color 1", "Color 2", … — the first number no entry is already using. */
  _nextPaletteName(e) {
    const t = new Set(e.map((i) => ce(i.name)));
    for (let i = 1; ; i++) {
      const n = `Color ${i}`;
      if (!t.has(ce(n))) return n;
    }
  }
  /**
   * Takes the input rather than its value so a refused rename can put the old
   * name back. Lit will not do it: the config is unchanged, so the binding sees
   * the same value it last wrote and skips the DOM, leaving the box showing a
   * name the plan does not have.
   */
  _renamePaletteColor(e, t) {
    const i = this._config.palette ?? [], n = i[e];
    if (!n) return;
    const o = t.value.trim(), r = ce(n.name), a = ce(o);
    if (r === a) {
      if (this._paletteError = "", o === (n.name ?? "")) {
        t.value = o;
        return;
      }
      this._patchConfig({ palette: i.map((c, p) => p === e ? { ...c, name: o } : c) });
      return;
    }
    if (a && i.some((c, p) => p !== e && ce(c.name) === a)) {
      this._paletteError = `Another color is already called “${o}”.`, t.value = n.name ?? "";
      return;
    }
    this._paletteError = "";
    const s = i.map((c, p) => p === e ? { ...c, name: o } : c), l = { ...this._config, palette: s };
    this._patchConfig(
      // Same shadowing caveat as delete: if another entry still declares the old
      // slug, its references are none of this rename's business.
      this._slugStillResolves(r, l) ? l : (
        // An empty new name leaves the entry unusable, so its references have
        // nothing to point at — freeze them at the colour, as a delete does.
        pa(l, r, a ? ha(o) : n.color)
      )
    );
  }
  /**
   * The colour half of a palette row.
   *
   * Guarded like the name half, and for the same reason. An empty or invalid
   * colour drops the entry from `paletteEntries`, so `paletteStyle` stops
   * declaring its property and every reference to it dangles — which is not a
   * fallback, it is black. That is the same damage deleting the entry does, but
   * reached without a rewrite, without an error, and with the row still sitting
   * there looking live. Refuse it and put the field back instead; the way out
   * is the remove button, which freezes the references properly.
   */
  _recolorPaletteColor(e, t) {
    const i = this._config.palette ?? [], n = i[e];
    if (!n) return;
    const o = t.value.trim();
    if (!R(o)) {
      this._paletteError = o ? `“${o}” is not a color the card can use.` : "A named color needs a color. Use the remove button to take the name away.", t.value = n.color ?? "";
      return;
    }
    this._paletteError = "", this._patchConfig({ palette: i.map((r, a) => a === e ? { ...r, color: o } : r) });
  }
  _removePaletteColor(e) {
    const t = this._config.palette ?? [], i = t[e];
    if (!i) return;
    this._paletteError = "";
    const n = t.filter((r, a) => a !== e), o = { ...this._config, palette: n.length ? n : void 0 };
    this._patchConfig(
      this._slugStillResolves(ce(i.name), o) ? o : pa(o, ce(i.name), i.color)
    );
  }
  /** Whether a slug is still declared by the palette in `config`. */
  _slugStillResolves(e, t) {
    return e ? ni(t.palette).some((i) => ce(i.name) === e) : !1;
  }
  /**
   * Says where the switcher is and offers the way back (issue #281).
   *
   * Placing is a drag on the canvas, so this is not a second way to set the
   * position — it is the half a drag cannot express: returning to the corner.
   * Without it, dropping the switcher once would be irreversible except by
   * hand-editing YAML.
   */
  _renderSwitcherPlacement() {
    const e = Rt(this._config), t = this._config.floors ?? [], i = O(this._config.width, be), n = O(this._config.height, we);
    return v`
      <!-- Appearance only matters once there is a switcher to see; a
           one-floor plan would store a choice with no visible result. -->
      ${t.length > 1 ? v`
          <div class="row">
            <label for="floor-switcher-style">Style</label>
            <select id="floor-switcher-style" .value=${this._config.floorSwitcher?.style ?? "default"}
              @change=${(o) => this._patchSwitcher({
      style: o.target.value
    })}>
              <option value="default">Classic</option>
              <option value="buttons">Dashboard buttons</option>
            </select>
          </div>
          <div class="row">
            <label for="floor-switcher-layout">Layout</label>
            <select id="floor-switcher-layout" .value=${this._config.floorSwitcher?.layout ?? "auto"}
              @change=${(o) => this._patchSwitcher({
      layout: o.target.value
    })}>
              <option value="auto">Automatic</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>` : m}
      <div class="row col">
        <label>Position</label>
        ${t.length > 1 ? v`<span class="hint"
                >${e ? "Drag it on the canvas, or type the point here." : "In the plan's top-right corner. Drag it on the canvas, or type a point here."}</span
              >
              <!-- Coordinates as well as the drag, because the drag is the only
                   way to place it and a pointer is not the only way people
                   work: the handle takes no keyboard, so without these there
                   would be no keyboard path to the feature at all. They are
                   also the precise option, for a plan being nudged a few units
                   rather than aimed by eye. -->
              <div class="row wide">
                <!-- The visible <label>s are siblings rather than wrappers, so
                     they name nothing as far as assistive tech is concerned:
                     a screen reader would announce two unlabelled spinbuttons
                     and leave you to guess which is which. The aria-label is
                     what carries the name, and says the unit as well, since
                     "X" alone does not tell you these are canvas units. -->
                <label aria-hidden="true">X</label>
                <!-- The exact stored number, not a rounded one. With Snap off
                     (or a hand-written config) an anchor is legitimately
                     fractional, and a field that showed 12 for a stored 12.4
                     would be lying about where the switcher is — then rewrite
                     it to 13 the moment anyone touched the spinner. These are
                     meant to be the precise way to place it. Hence step="any"
                     as well: a number input defaults to whole steps, which
                     marks a stored 60.4 invalid and lets the spinner snap it. -->
                <input
                  type="number"
                  step="any"
                  aria-label="Floor switcher X, in canvas units"
                  .value=${e ? String(e.x) : ""}
                  placeholder=${Math.round(wi(i, n).x)}
                  @change=${(o) => this._setSwitcherCoord("x", o.target.value)}
                />
                <label aria-hidden="true">Y</label>
                <input
                  type="number"
                  step="any"
                  aria-label="Floor switcher Y, in canvas units"
                  .value=${e ? String(e.y) : ""}
                  placeholder=${Math.round(wi(i, n).y)}
                  @change=${(o) => this._setSwitcherCoord("y", o.target.value)}
                />
              </div>
              ${e ? v`<div class="row wide">
                    <button @click=${() => this._patchSwitcher({ x: void 0, y: void 0 })}>
                      Back to the corner
                    </button>
                  </div>` : m}` : v`<span class="hint"
              >A plan with one floor draws no switcher. Add a second floor and it appears
              here.</span
            >`}
      </div>
    `;
  }
  /** Update appearance or placement without dropping the other settings. */
  _patchSwitcher(e) {
    const t = this._config.floorSwitcher, n = { ...t && typeof t == "object" && !Array.isArray(t) ? t : {}, ...e };
    n.style === "default" && delete n.style, n.layout === "auto" && delete n.layout;
    const o = Object.entries(n).filter(([, r]) => r !== void 0);
    this._patchConfig({ floorSwitcher: o.length ? Object.fromEntries(o) : void 0 });
  }
  /**
   * Set one coordinate from the panel's number fields.
   *
   * Typing into one of them while the switcher is still in its default corner
   * has to place it, which means inventing the other half — and the only
   * honest answer is where the handle is actually drawn, since that is what
   * the field's placeholder has been showing.
   *
   * An emptied field clears both coordinates while preserving appearance.
   * `floorSwitcherAnchor` requires a complete position at the other end.
   */
  _setSwitcherCoord(e, t) {
    const i = Number(t);
    if (t.trim() === "" || !Number.isFinite(i)) {
      this._patchSwitcher({ x: void 0, y: void 0 });
      return;
    }
    const n = O(this._config.width, be), o = O(this._config.height, we), r = Rt(this._config) ?? wi(n, o);
    this._patchSwitcher({ ...r, [e]: i });
  }
  _renderSymbolsPanel() {
    const e = Object.keys(this._config.symbols ?? {});
    return v`
      <div class="row col symbols-panel">
        ${e.length ? v`<div class="symbol-list">
              ${e.map(
      (t) => v`
                  <span class="symbol-chip">
                    ${t}
                    <button
                      class="chip-x"
                      title=${`Remove ${t}`}
                      @click=${() => this._removeSymbol(t)}
                    >
                      ✕
                    </button>
                  </span>
                `
    )}
            </div>` : m}
        <textarea
          class="symbol-input"
          rows="4"
          spellcheck="false"
          placeholder=${'{ "id": "my-desk", "size": { "w": 120, "h": 60 }, "parts": [ … ] }'}
          .value=${this._symbolDraft}
          @input=${(t) => {
      this._symbolDraft = t.target.value, this._symbolError = "";
    }}
        ></textarea>
        ${this._symbolError ? v`<div class="symbol-error">${this._symbolError}</div>` : m}
        <div class="symbol-actions">
          <button ?disabled=${!this._symbolDraft.trim()} @click=${this._addSymbol}>
            Add symbol
          </button>
          <a
            href="https://github.com/nicosandller/easy-floorplan/blob/main/furniture/README.md"
            target="_blank"
            rel="noreferrer"
            >How to draw one</a
          >
        </div>
      </div>
    `;
  }
  _removeSymbol(e) {
    const t = { ...this._config.symbols ?? {} };
    delete t[e], this._patchConfig({ symbols: Object.keys(t).length ? t : void 0 });
  }
  /**
   * Fields for the selected object and settings category. Returns nothing
   * when the selection isn't exactly one element — multi-select and
   * empty-select states are handled by the Element header itself.
   */
  _renderSelectionEditor() {
    const e = this._primary();
    if (!e || this._selection.length !== 1) return v`${m}`;
    if (e.kind === "opening") {
      const t = this._floor().openings.find((r) => r.id === e.id);
      if (!t) return v`${m}`;
      const i = Eb(t, (r) => this._supportedFeatures(r)), n = (r, a) => {
        if ("entity" in r) {
          const s = r.entity, l = s ? this.hass?.states[s]?.attributes?.device_class : void 0;
          r = { ...r, ...ag(t, l) };
        }
        this._applyElementPatch("opening", t.id, r, a);
      };
      if (this._selectionPage === "properties") return v`
        ${this._renderEssentialForm(i, ["length", "width", "angle", "ceilingHeight"], n)}
        ${this._renderEssentialForm(i, z.OPENING_GROUPS[0][1].filter((r) => !["length", "width", "angle", "ceilingHeight"].includes(r)), n)}
      `;
      const o = (r, a, ...s) => {
        const l = ve(i, a);
        return !l.fields.length && !s.some((c) => c && c !== m) ? m : this._renderGroup(r, this._renderForm(l, n), ...s);
      };
      return v`
        ${this._selectionPage === "actions" && !i.fields.some((r) => "ui_action" in r.selector) ? v`<div class="unbound-actions">
              <p class="hint">Connect a sensor or cover to give this opening tap, hold and double-tap actions.</p>
              <button @click=${() => this._choosePage("sensors")}>Choose a sensor</button>
            </div>` : m}
        ${z.OPENING_GROUPS.filter(([r]) => r !== "Shape").map(
        ([r, a]) => r === "Color" ? o(
          r,
          a,
          // Both colours paint the leaf, and a passage has none.
          t.entity && !xe(t) ? v`${this._renderColorRow({
            label: "Open color",
            title: "Leaf, sash and swing arc while this opening is open",
            value: t.activeColor,
            swatch: "#03a9f4",
            placeholder: "(primary)",
            onLive: (s) => this._updateOpeningLive(t.id, { activeColor: s }),
            onCommit: (s) => this._updateOpening(t.id, { activeColor: s })
          })}
                    ${this._renderColorRow({
            label: "Closed color",
            title: "Leaf, sash and swing arc while it is closed — the jambs stay the wall's color",
            value: t.inactiveColor,
            swatch: "#c62828",
            placeholder: "(wall)",
            onLive: (s) => this._updateOpeningLive(t.id, { inactiveColor: s }),
            onCommit: (s) => this._updateOpening(t.id, { inactiveColor: s })
          })}` : m
        ) : r === "Shutter" ? o(
          r,
          a,
          // The shutter's own accent, so an open shutter over a shut
          // window can read as a separate thing from the sash it
          // covers. Falls back to the opening's, hence the placeholder.
          t.shutterEntity ? this._renderColorRow({
            label: "Shutter color",
            title: "Shutter color while it is open",
            value: t.shutterActiveColor,
            swatch: t.activeColor ?? "#03a9f4",
            placeholder: t.activeColor ? "(active color)" : "(primary)",
            onLive: (s) => this._updateOpeningLive(t.id, { shutterActiveColor: s }),
            onCommit: (s) => this._updateOpening(t.id, { shutterActiveColor: s })
          }) : m
        ) : o(r, a)
      )}
      `;
    }
    if (e.kind === "item") {
      const t = this._floor().items.find((c) => c.id === e.id);
      if (!t) return v`${m}`;
      const i = this._areaEntitiesAt(t.x, t.y), n = t.entity ? this.hass?.states[t.entity]?.attributes?.device_class : void 0, o = (c) => (c ? this.hass?.states[c]?.attributes?.friendly_name : void 0) ?? c, r = {
        source: il(this.hass, t)?.source ?? "primary",
        primaryLabel: o(t.entity),
        // One label per reading, positionally — the dropdown names each rather
        // than numbering them, and a reading with no entity of its own is read
        // off this device, so that is the name to show for it (issue #180).
        readingLabels: Ge(t).map((c) => o(c.entity || t.entity))
      }, a = (c, p) => {
        "entity" in c && typeof c.entity == "string" && (c = { ...c, kind: Kr(c.entity) }), this._applyElementPatch("item", t.id, c, p);
      };
      if (this._selectionPage === "properties") return v`
        ${this._renderEssentialForm(za(t, i), ["entity"], a)}
        ${this._renderEssentialForm(Ab(t), ["name", "showName"], a)}
        ${this._renderEssentialForm(Tb(t), ["showState"], a)}
        ${this._renderEssentialForm(Oa(t), ["size", "angle"], a)}
        ${this._renderItemIconRow(t)}
      `;
      const s = t.entity ? this.hass?.states[t.entity] : void 0, l = Ib(t, n, s);
      return v`
        ${this._renderGroup(
        "What it reads",
        // Entity, its attribute, whether its own state shows, then every
        // other entity — the order the label prints them in (issue #180).
        this._renderForm(ve(za(t, i), ["attribute"]), a),
        this._renderItemReadings(t)
      )}
        ${Im(t) ? this._renderGroup(
        "Label",
        this._renderForm(Cb(t), a),
        t.disableLabelColor && t.useCustomLabelColor ? this._renderColorRow({
          label: "Custom color",
          value: t.labelCustomColor,
          swatch: "#ffffff",
          placeholder: "e.g. #ff0000 or red",
          onLive: (c) => this._updateItemLive(t.id, { labelCustomColor: c }),
          onCommit: (c) => this._updateItem(t.id, { labelCustomColor: c })
        }) : m
      ) : m}
        ${this._renderGroup(
        "Badge",
        this._renderForm(ve(Oa(t, r), ["badgeMode", "badgeEntity"]), a)
      )}
        ${this._renderGroup(
        "Color",
        t.stateColor?.length ? (
          // Colour by state supersedes the fixed active colour, so showing
          // both invites setting one and seeing the other. Say which one is
          // in charge instead of leaving a dead control on screen.
          v`<p class="hint rule-note">
                Colored by the state rules below — they replace the active and inactive colors.
              </p>`
        ) : v`${this._renderColorRow({
          label: "Active color",
          title: "Badge color while this device is on (issue #79)",
          value: t.activeColor,
          swatch: "#fdd835",
          placeholder: "(theme)",
          onLive: (c) => this._updateItemLive(t.id, { activeColor: c }),
          onCommit: (c) => this._updateItem(t.id, { activeColor: c })
        })}
              ${this._renderColorRow({
          label: "Inactive color",
          title: "Badge color while this device is off — closed, locked or docked, whichever this entity says (issue #228)",
          value: t.inactiveColor,
          swatch: "#c62828",
          placeholder: "(theme)",
          onLive: (c) => this._updateItemLive(t.id, { inactiveColor: c }),
          onCommit: (c) => this._updateItem(t.id, { inactiveColor: c })
        })}`,
        this._renderStateColorRules(
          t.stateColor,
          (c) => this._updateItem(t.id, { stateColor: c }),
          // Only a device draws a glyph, so only a device's rules offer an
          // icon — furniture and areas share this rule shape but paint
          // polygons (issue #106).
          { icons: !0, iconPlaceholder: this._itemDefaultIcon(t) }
        )
      )}
        ${l ? this._renderGroup(
        "Effects",
        this._renderForm(l, a),
        // The ring's colour belongs with the ring, not with the badge's.
        Ys(t.entity, n) && Yo(t) ? this._renderColorRow({
          label: "Ripple color",
          value: t.rippleColor,
          swatch: t.activeColor ?? "#03a9f4",
          placeholder: t.activeColor ? "(active color)" : "(primary)",
          onLive: (c) => this._updateItemLive(t.id, { rippleColor: c }),
          onCommit: (c) => this._updateItem(t.id, { rippleColor: c })
        }) : m
      ) : m}
        ${this._renderGroup("Behavior", this._renderForm(zb(t), a))}
        ${this._renderGroup("Visibility", this._renderForm(Pb(t), a))}
      `;
    }
    if (e.kind === "text") {
      const t = this._floor().texts.find((i) => i.id === e.id);
      return t ? v`
        ${this._renderEssentialForm(
        Ob(t, this._areaEntitiesAt(t.x, t.y)),
        ["text", "entity", "attribute", "size", "angle"],
        (i, n) => this._applyElementPatch("text", t.id, i, n)
      )}
        ${this._renderColorRow({
        label: "Color",
        value: t.color,
        swatch: "#000000",
        placeholder: "(theme default)",
        onLive: (i) => this._updateTextLive(t.id, { color: i }),
        onCommit: (i) => this._updateText(t.id, { color: i })
      })}
      ` : v`${m}`;
    }
    if (e.kind === "furniture") {
      const t = this._floor().furniture.find((o) => o.id === e.id);
      if (!t) return v`${m}`;
      const i = Lb(t, this._areaEntitiesAt(t.x, t.y), this._symbols(), Ce(this._config)), n = (o, r) => this._applyElementPatch("furniture", t.id, o, r);
      return this._selectionPage === "properties" ? v`
        ${this._renderEssentialForm(i, ["w", "h", "angle", ...t.type === "stairs" ? ["goToFloor"] : [], "hand"], n)}
        ${this._renderColorRow({
        label: "Color",
        value: t.color,
        swatch: "#9e9e9e",
        placeholder: "Default",
        onLive: (o) => this._updateFurnitureLive(t.id, { color: o }),
        onCommit: (o) => this._updateFurniture(t.id, { color: o })
      })}
        <div class="secondary-property">${this._renderEssentialForm(i, ["type"], n)}</div>
      ` : v`
        ${z.FURNITURE_GROUPS.filter(([o]) => o !== "Shape").map(
        ([o, r]) => this._renderGroup(o, this._renderForm(ve(i, r.filter((a) => a !== "goToFloor" || t.type !== "stairs")), n))
      )}
        ${t.entity ? this._renderGroup(
        "Color",
        v`
            ${this._renderColorRow({
          label: "Active color",
          title: "Color while the entity is on",
          value: t.activeColor,
          swatch: "#03a9f4",
          placeholder: "(no change)",
          onLive: (o) => this._updateFurnitureLive(t.id, { activeColor: o }),
          onCommit: (o) => this._updateFurniture(t.id, { activeColor: o })
        })}
            ${this._renderStateColorRules(
          t.stateColor,
          (o) => this._updateFurniture(t.id, { stateColor: o })
        )}
          `
      ) : m}
      `;
    }
    if (e.kind === "area") {
      const t = (this._floor().areas ?? []).find((a) => a.id === e.id);
      if (!t) return v`${m}`;
      const i = Zc(this.hass), n = t.haArea ? this._pendingAreaEntities(t) : [], o = Rb(t), r = (a, s) => this._applyElementPatch("area", t.id, a, s);
      return this._selectionPage === "properties" ? v`
        ${this._renderEssentialForm(Db(t, i.map((a) => a.name)), ["name"], (a, s) => this._applyElementPatch("area", t.id, Qc(a, i), s))}
        ${this._renderAreaLinkRow(t, i)}
        ${this._renderEssentialForm(o, ["showName", "labelSize", "opacity"], r)}
        ${this._renderColorRow({
        label: "Fill color",
        value: t.color,
        swatch: "#03a9f4",
        placeholder: "Default",
        onLive: (a) => this._updateAreaLive(t.id, { color: a }),
        onCommit: (a) => this._updateArea(t.id, { color: a })
      })}
      ` : v`
        ${this._renderGroup(
        "What it reads",
        this._renderForm(ve(o, ["entity"]), r)
      )}
        ${t.entity ? this._renderGroup(
        "Color",
        this._renderForm(ve(o, ["highlight", "activeOpacity"]), r),
        // The colours the bound entity drives. Same shape furniture and
        // devices already use, and gated the same way — without an entity
        // there is nothing to condition on. Until this existed the Entity
        // picker above was inert on its own: areaColor() resolves nothing
        // without an activeColor or a matching rule, so binding an entity
        // in the editor changed nothing and the feature looked unbuilt.
        v`
            ${this._renderColorRow({
          label: "Active color",
          title: "Color while the entity is on",
          value: t.activeColor,
          swatch: "#03a9f4",
          placeholder: "(no change)",
          onLive: (a) => this._updateAreaLive(t.id, { activeColor: a }),
          onCommit: (a) => this._updateArea(t.id, { activeColor: a })
        })}
            ${this._renderStateColorRules(
          t.stateColor,
          (a) => this._updateArea(t.id, { stateColor: a })
        )}
          `
      ) : m}
        ${this._renderGroup(
        // What tapping the room does (issue #181). Last, as it is on every
        // other element: the thing it *does*, after everything it *is*.
        "Behavior",
        this._renderForm(
          ve(o, [
            "fitZoom",
            "zoom",
            "tap_action",
            "hold_action",
            "double_tap_action"
          ]),
          r
        )
      )}
        ${t.haArea ? this._renderGroup(
        // Everything that only exists because this room is linked to a
        // Home Assistant area.
        "Home Assistant area",
        v`<div class="row wide">
                <label>Filter entities</label>
                <input
                  type="checkbox"
                  .checked=${t.filterEntities ?? !0}
                  @change=${(a) => this._updateArea(t.id, {
          filterEntities: a.target.checked
        })}
                />
                <span class="hint"
                  >Scope the entity picker, for devices placed inside this room, to this HA
                  area's entities.</span
                >
              </div>`,
        v`<div class="row wide">
                <button
                  ?disabled=${!n.length}
                  title=${n.length ? `Add ${n.length} device${n.length === 1 ? "" : "s"} from this HA area, spread out across the room` : "Every entity in this HA area is already placed on this floor"}
                  @click=${() => this._addAreaEntities(t)}
                >
                  <ha-icon icon="mdi:shape-square-plus"></ha-icon>
                  Add all devices in this HA area${n.length ? ` (${n.length})` : ""}
                </button>
              </div>`
      ) : m}
        <p class="hint">
          Drag inside the fill to move the whole room; drag a vertex handle to reshape it.
        </p>
      `;
    }
    if (e.kind === "tracker") {
      const t = (this._floor().trackers ?? []).find((o) => o.id === e.id);
      if (!t) return v`${m}`;
      const i = Fb(t), n = (o, r) => this._applyElementPatch("tracker", t.id, o, r);
      return this._selectionPage === "properties" ? v`
        ${this._renderEssentialForm(i, z.TRACKER_GROUPS[0][1], n)}
      ` : v`
        ${this._renderGroup(
        // The two distance sensors that place the marker inside the zone —
        // the thing a tracker actually is, so it gets its own group rather
        // than two unlabelled blocks above the box.
        "Sensors",
        this._renderTrackerSensorRows(t, "xSensor", "X sensor"),
        this._renderTrackerSensorRows(t, "ySensor", "Y sensor")
      )}
        ${this._renderGroup(
        "Marker",
        this._renderForm(ve(i, z.TRACKER_GROUPS[1][1]), n),
        this._renderColorRow({
          label: "Color",
          value: t.color,
          swatch: "#03a9f4",
          placeholder: "(primary)",
          onLive: (o) => this._updateTrackerLive(t.id, { color: o }),
          onCommit: (o) => this._updateTracker(t.id, { color: o })
        })
      )}
      `;
    }
    if (e.kind === "wall") {
      const t = this._floor().walls.find((n) => n.id === e.id);
      if (!t) return v`${m}`;
      const i = Math.round(Math.hypot(t.x2 - t.x1, t.y2 - t.y1));
      return v`
        ${this._renderEssentialForm(
        Hb(t),
        ["x1", "y1", "x2", "y2", "thickness", "height", "kind"],
        (n, o) => this._applyElementPatch("wall", t.id, n, o)
      )}
        <div class="row">
          <label>Length</label>
          <input
            class="num"
            type="number"
            min="1"
            .value=${String(i)}
            @change=${(n) => {
        const o = n.target, r = Number(o.value);
        if (o.value === "" || !(r >= 1)) {
          o.value = String(i);
          return;
        }
        const a = t.x2 - t.x1, s = t.y2 - t.y1, l = Math.hypot(a, s), c = l > 0 ? a / l : 1, p = l > 0 ? s / l : 0;
        this._updateWall(t.id, {
          x2: Math.round(t.x1 + c * r),
          y2: Math.round(t.y1 + p * r)
        });
      }}
          />
          <span class="hint">Resizes from the start point, keeping the direction.</span>
        </div>
        <p class="hint">
          Or drag the line on the canvas to move it, and the round handles to move an endpoint.
        </p>
      `;
    }
    return v`${m}`;
  }
  /**
   * Editor rows for one of a tracker's two sensor mappings (X or Y). Entity
   * picker is always shown; min / max / invert appear once a sensor entity is
   * set so the panel stays compact while empty.
   */
  _renderTrackerSensorRows(e, t, i) {
    const n = e[t];
    return v`
      <div class="row wide">
        <label>${i}</label>
        ${this._renderEntityPicker(
      n?.entity ?? "",
      (o) => {
        o ? this._updateTrackerSensor(e.id, t, { entity: o }) : this._updateTrackerSensor(e.id, t, null);
      },
      ["sensor", "input_number", "number"]
    )}
      </div>
      ${n ? v`<div class="row">
            <label>${i} range</label>
            <input
              class="num"
              type="number"
              step="0.01"
              title="Reading at the near edge"
              .value=${String(n.min)}
              @change=${(o) => {
      const r = o.target, a = Number(r.value);
      r.value !== "" && Number.isFinite(a) ? this._updateTrackerSensor(e.id, t, { min: a }) : r.value = String(n.min);
    }}
            />
            <input
              class="num"
              type="number"
              step="0.01"
              title="Reading at the far edge"
              .value=${String(n.max)}
              @change=${(o) => {
      const r = o.target, a = Number(r.value);
      r.value !== "" && Number.isFinite(a) ? this._updateTrackerSensor(e.id, t, { max: a }) : r.value = String(n.max);
    }}
            />
            <label class="inline-check">
              <input
                type="checkbox"
                .checked=${n.invert ?? !1}
                @change=${(o) => this._updateTrackerSensor(e.id, t, {
      invert: o.target.checked || void 0
    })}
              />
              invert
            </label>
          </div>
          <div class="row wide">
            <label>${i} presence</label>
            ${this._renderEntityPicker(
      n.presence?.entity ?? "",
      (o) => this._updateTrackerSensor(e.id, t, {
        presence: o ? { entity: o, invert: n.presence?.invert } : void 0
      }),
      ["binary_sensor", "input_boolean", "device_tracker"]
    )}
            ${n.presence ? v`<label class="inline-check" title="Treat 'off' as detected">
                  <input
                    type="checkbox"
                    .checked=${n.presence.invert ?? !1}
                    @change=${(o) => this._updateTrackerSensor(e.id, t, {
      presence: {
        entity: n.presence.entity,
        invert: o.target.checked || void 0
      }
    })}
                  />
                  invert
                </label>` : m}
          </div>` : m}
    `;
  }
};
z._nextWallMaskId = 0;
z.OPENING_GROUPS = [
  // What it is, and how it is drawn.
  // `width` and `ceilingHeight` are the skylight's two; `openingForm` only
  // offers them for one, so they cost every other opening nothing but a
  // name in this list.
  ["Shape", [
    "type",
    "motion",
    "length",
    "width",
    "ceilingHeight",
    "sash",
    "sashSpan",
    "hinge",
    "opens",
    "slide",
    "style",
    "angle"
  ]],
  // Which contacts drive it — the opening's own, before the shutter's.
  ["What it reads", ["entity", "secondaryEntity", "invert"]],
  // How it behaves toward the sun (issue #177), which is neither shape nor
  // state but gets asked about as its own thing.
  ["Sunlight", ["glazed", "sunlight"]],
  // The shutter is a layer over the opening with its own entity, style,
  // side, second contact, badge and colour — so it gets its own group
  // rather than being scattered through the others.
  ["Shutter", [
    "shutterEntity",
    "shutterStyle",
    "shutterSide",
    "shutterSecondaryEntity",
    "shutterInvert",
    "showShutterIcon",
    "shutterIcon"
  ]],
  ["Badge", ["showIcon", "icon"]],
  // No fields of its own — the opening's accent is a colour row, not an
  // ha-form field. It is listed here so it lands in the same place in the
  // order as every other panel's Color group, rather than after Behavior.
  ["Color", []],
  ["Behavior", ["tapTarget", "tap_action", "hold_action", "double_tap_action"]]
];
z.FURNITURE_GROUPS = [
  ["Shape", ["type", "hand", "w", "h", "angle"]],
  ["What it reads", ["entity"]],
  // What clicking it does — a staircase that changes floor (issue #121).
  ["Behavior", ["goToFloor", "tap_action", "hold_action", "double_tap_action"]]
];
z.TRACKER_GROUPS = [
  ["Zone", ["w", "h", "x", "y", "angle"]],
  ["Marker", ["dotSize"]]
];
z.styles = [
  Za,
  Re`
    /* generic inline cluster of related controls */
    .group {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    /* vertical rule between toolbar groups */
    .divider {
      align-self: stretch;
      width: 1px;
      min-height: 26px;
      margin: 0 4px;
      background: var(--divider-color, #e0e0e0);
    }
    /* tools rendered as a connected segmented control (one active) */
    .seg {
      display: inline-flex;
    }
    .seg button {
      border-radius: 0;
      border-left-width: 0;
    }
    .seg button:first-child {
      border-left-width: 1px;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    .seg button:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
    /* contextual second row: options/actions for the current tool or selection */
    .context-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 6px;
      padding: 5px 10px;
      min-height: 36px;
      box-sizing: border-box;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--secondary-background-color, #f5f5f5);
    }
    .context-bar .ctx-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--primary-color, #03a9f4);
      padding-right: 8px;
      margin-right: 2px;
      border-right: 1px solid var(--divider-color, #e0e0e0);
    }
    .context-bar .ctx-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .context-bar .ctx-count {
      font-size: 12px;
      color: var(--primary-text-color);
    }
    .context-bar button {
      padding: 4px 10px;
      font-size: 13px;
    }
    /* A label + input pair inline in the context bar (e.g. default Length for
       the Door/Window tools). The <label> wraps both so clicking the text
       focuses the input. */
    .context-bar .ctx-field {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .context-bar .ctx-field input.num {
      width: 60px;
    }
    /* Inline label for a control rendered loose in the context bar (e.g. the
       "Snap" word next to the segmented control). */
    .context-bar .ctx-field-label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .context-bar input.num {
      width: 60px;
    }
    /* Thin vertical rule separating the tool-specific contents from the
       always-on Snap control on the right side of the context bar. */
    .ctx-divider {
      flex: 0 0 1px;
      align-self: stretch;
      min-height: 22px;
      margin: 0 4px;
      background: var(--divider-color, #e0e0e0);
    }
    button {
      cursor: pointer;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 6px;
      padding: 6px 10px;
      text-transform: capitalize;
    }
    button.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    button.danger {
      color: var(--error-color, #db4437);
    }
    button[disabled] {
      opacity: 0.4;
      cursor: not-allowed;
    }
    /* The canvas is focusable so keyboard shortcuts only fire while working in
       the editor; only show the ring for keyboard focus, not pointer clicks. */
    .canvas-wrap:focus {
      outline: none;
    }
    .canvas-wrap:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
    .canvas-wrap {
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      overflow: auto;
      resize: both;
      /* Size to the canvas's own aspect ratio rather than forcing a fixed
         viewport-relative height. This avoids the empty band above and below
         the grid that used to appear with the default 1000×600 canvas, and
         leaves room for the Element / Project sections below. The user can
         still drag-resize via the corner handle (resize: both). */
      min-height: 200px;
      background: var(--secondary-background-color, #f5f5f5);
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
    }
    .stage {
      position: relative;
      width: 100%;
      flex: 0 0 auto;
      margin: auto;
      touch-action: none;
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }
    svg.wall,
    svg.door,
    svg.window,
    svg.tracker,
    svg.area {
      cursor: crosshair;
    }
    .grid {
      /* Theme text colour at low opacity so the grid stays visible over a
         background image (and on both light and dark themes); non-scaling-stroke
         keeps the lines a crisp ~1px at any canvas size / zoom. Editor-only —
         the live card never draws a grid. */
      stroke: var(--fp-skin-text, var(--primary-text-color, #212121));
      stroke-opacity: 0.25;
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
      /* Purely decorative — must never intercept pointers, or a press that lands
         on a grid line would capture the pointer there and break wall drawing. */
      pointer-events: none;
    }
    /* Scoped to <line> so the rule doesn't accidentally match the <svg>,
       which carries the active-tool class (e.g. "wall") on the canvas. A
       bare ".wall" selector matched the SVG too, and because pointer-events
       is inherited in SVG, setting it to none disabled the entire canvas
       — so no pointerdown reached the wall-draw handler. */
    line.wall {
      stroke: var(--fp-skin-wall, var(--primary-text-color));
      /* Same skin hooks as the card's .wall, so the canvas draws the weight
         and glow the plan will actually have. The glow itself is on
         .fp-wall-neon, outside the doorway mask — see the note there. */
      stroke-width: var(--fp-skin-wall-width, 8);
      /* The wide transparent .wall-hit line beneath handles selection/drag.
         Without this, the visible line (painted on top) swallows clicks on the
         wall body, so you could only grab it just *outside* the body. */
      pointer-events: none;
    }
    /* Neon, matching the card. Must stay on a group *outside* the doorway
       mask: CSS applies filter before mask, so a filter on the wall itself is
       computed from the uncut wall and its halo then survives the cut,
       leaving a fringe that runs through every opening (#203). */
    .fp-wall-neon {
      filter: var(--fp-skin-wall-filter, none);
    }
    /* Thin, as the card draws a railing (issue #182) — see the card's rule. */
    line.wall.railing {
      stroke-width: calc(var(--fp-skin-wall-width, 8) * 0.4);
    }
    line.wall.selected {
      stroke: var(--primary-color, #03a9f4);
    }
    line.wall.draft {
      opacity: 0.5;
      pointer-events: none;
    }
    .fp-door-leaf,
    .fp-leaf-r {
      transform-box: fill-box;
      transition: transform 0.5s ease;
    }
    .fp-door-leaf {
      transform-origin: left center;
    }
    .fp-leaf-r {
      transform-origin: right center;
    }
    .fp-door-leaf rect,
    .fp-leaf-r rect {
      transition: fill 0.5s ease;
    }
    .fp-door-arc {
      transition: stroke-dashoffset 0.5s ease, stroke 0.5s ease;
    }
    /* Roll-up curtain: scaleY must shrink onto the band's own centerline
       (the track), not the SVG origin. */
    .fp-roll-curtain {
      transform-box: fill-box;
      transform-origin: center;
    }
    .wall-hit {
      stroke: transparent;
      stroke-width: 22;
      cursor: move;
    }
    .wall-hit.side-wall-edge.ns,
    .wall.side-wall-edge.ns {
      cursor: ns-resize;
    }
    .wall-hit.side-wall-edge.ew,
    .wall.side-wall-edge.ew {
      cursor: ew-resize;
    }
    .opening-hit {
      cursor: move;
    }
    /* The skylight's grab area — invisible, but painted, which is what makes
       it hit-testable at all: a fill of none would leave the rectangle as empty
       as the floor under it. */
    .skylight-hit,
    .passage-hit {
      fill: transparent;
    }
    .furn-hit {
      cursor: move;
    }
    .furn-outline {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 1.5;
      stroke-dasharray: 6 4;
      pointer-events: none;
    }
    /* Toolbar icons sit inline with their labels; smaller than content icons. */
    .toolbar ha-icon {
      --mdc-icon-size: 16px;
    }
    .seg button {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    /* === Popovers (floor gear, + Add). The backdrop is a fixed transparent
       layer below the popover that closes it on any outside click. === */
    .pop-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .pop {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      z-index: 20;
      min-width: 220px;
      padding: 8px;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
    }
    .pop.left {
      left: 0;
      right: auto;
    }
    .pop-backdrop {
      position: fixed;
      inset: 0;
      z-index: 19;
    }
    .pop-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    .pop-row label {
      flex: 0 0 60px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .pop-row input,
    .pop-row select {
      flex: 1;
      min-width: 0;
      padding: 4px 6px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .pop-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      justify-content: center;
      font-size: 13px;
    }
    .add-pop {
      min-width: 300px;
    }
    .add-entry {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      border: none;
      background: none;
      padding: 6px 8px;
      border-radius: 6px;
      text-align: left;
      font-size: 13px;
    }
    .add-entry:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    /* Search row above the grid (issue #90): the library grows with every
       contributed symbol, so the list has to be findable, not just scrollable. */
    .furn-search {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding: 4px 6px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
    }
    .furn-search ha-icon {
      --mdc-icon-size: 16px;
      color: var(--secondary-text-color);
      flex: none;
    }
    .furn-search input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: none;
      font: inherit;
      font-size: 12px;
      color: var(--primary-text-color);
    }
    .add-furn-scroll {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 4px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--divider-color, #eee);
      /* 26 built-ins already filled six rows; a community library is unbounded. */
      max-height: 46vh;
      overflow-y: auto;
    }
    .furn-group {
      grid-column: 1 / -1;
      font-size: 10px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      opacity: 0.8;
      padding: 4px 2px 0;
    }
    .furn-empty {
      grid-column: 1 / -1;
      padding: 10px 2px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .furn-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      border: none;
      background: none;
      padding: 6px 2px;
      border-radius: 6px;
      font-size: 11px;
      color: var(--secondary-text-color);
      text-transform: none;
    }
    .furn-cell:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .furn-cell svg {
      position: static;
      width: 38px;
      height: 30px;
      display: block;
    }
    /* === Canvas chrome: the zoom overlay and first-run hint live on a
       relative wrapper OUTSIDE the scroll container so they don't scroll
       away with the stage. === */
    .canvas-outer {
      position: relative;
    }
    .zoom-overlay {
      position: absolute;
      right: 26px;
      bottom: 12px;
      z-index: 2;
      display: flex;
      gap: 4px;
    }
    .zoom-overlay button {
      display: inline-flex;
      align-items: center;
      padding: 3px 7px;
      font-size: 12px;
      background: var(--card-background-color, #fff);
    }
    .zoom-overlay ha-icon {
      --mdc-icon-size: 15px;
    }
    .zoom-val-btn {
      min-width: 46px;
      justify-content: center;
    }
    .empty-hint {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 16px;
      font-size: 14px;
      line-height: 1.6;
      color: var(--secondary-text-color);
      /* Never block the first wall being drawn straight through the hint. */
      pointer-events: none;
    }
    .floors {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .floors label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .floors select,
    .floors .floor-name {
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: 6px;
      padding: 6px 8px;
    }
    .floors .floor-name {
      width: 90px;
    }
    .marquee {
      fill: var(--primary-color, #03a9f4);
      fill-opacity: 0.1;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      pointer-events: none;
    }
    .handle {
      fill: var(--primary-color, #03a9f4);
      stroke: var(--card-background-color, #fff);
      stroke-width: 1.5;
      cursor: grab;
    }
    .area-shared-wall {
      fill: none;
      stroke: var(--secondary-text-color, #666);
      stroke-width: 1;
      stroke-linecap: round;
      stroke-dasharray: 3 4;
      opacity: 0.22;
      pointer-events: none;
      vector-effect: non-scaling-stroke;
    }
    .area-edge-hit {
      stroke: transparent;
      stroke-width: 18;
      cursor: pointer;
      pointer-events: stroke;
    }
    .area-edge-hit.ew,
    .area-edge-handle.ew,
    .area-wall-toggle.ew {
      cursor: ew-resize;
    }
    .area-edge-hit.ns,
    .area-edge-handle.ns,
    .area-wall-toggle.ns {
      cursor: ns-resize;
    }
    .area-edge-handle.side-wall-toggle.ew,
    .area-edge-handle.side-wall-toggle.ns,
    .area-wall-toggle {
      cursor: pointer;
      fill: var(--card-background-color, #fff);
      stroke: var(--fp-skin-wall, var(--primary-text-color));
      stroke-width: 2;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
    .area-wall-toggle.wall {
      fill: var(--fp-skin-wall, var(--primary-text-color));
      stroke: var(--fp-skin-wall, var(--primary-text-color));
    }
    .area-wall-toggle.divider {
      fill: var(--card-background-color, #fff);
      stroke-dasharray: 2 2;
    }
    .items {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    /*
     * overlayScale: plan, previewed (issue #192). The same two lines the card
     * uses, on the box that plays the same part: the stage carries the canvas
     * ratio, so 100cqw is the plan's own width on screen and --fp-u is one
     * canvas unit. Declared on .items rather than .stage for the reason the
     * card documents — an unregistered custom property substitutes as a token
     * stream, so the cqw resolves where it is used, which stays correct if
     * --fp-u is ever registered with @property.
     *
     * Zoom falls out of it rather than needing a term of its own: the stage's
     * width is a percentage of the zoom, so zooming in widens the container and
     * every canvas-unit measure grows with the drawing — which is the mode.
     */
    .stage.scale-plan {
      container-type: inline-size;
    }
    /*
     * The unit itself, declared twice on purpose.
     *
     * The fallback in var(--fp-u, 1px) is not the safety net it looks like: it
     * fires when the property is *unset*, never when its value fails to
     * resolve. A browser with no container queries parses the calc quite
     * happily -- a custom property takes almost any token stream -- and then
     * every property using it is invalid at computed-value time, so each falls
     * back to its own initial value. Width becomes auto, and a badge collapses
     * to its borders: about 3px, with its label landing on top of it because
     * the item's box collapsed with it.
     *
     * So the plain value is declared first, and the container-query one only
     * where it can actually be computed. One pixel per canvas unit is exactly
     * what overlayScale fixed draws, which is the right thing to degrade to: a
     * plan that looks like it did before canvas units existed, rather than one
     * with 3px badges.
     *
     * The guard tests the unit as well as the property, because they are two
     * features and only one of them is what the declaration is made of. A
     * browser with container-type but no cqw would pass a check for the
     * property and then fail on the value, which is the exact collapse this is
     * here to stop. Test what is actually used; it costs one more clause.
     */
    .stage.scale-plan .items {
      --fp-u: 1px;
    }
    @supports (container-type: inline-size) and (width: 1cqw) {
      .stage.scale-plan .items {
        /* overlayMinWidth clamps the unit exactly as the card does. */
        --fp-u: calc(max(100cqw, var(--fp-min-w, 0px)) / var(--fp-plan-w));
      }
    }
    /* Label padding and offsets go to em so they track the text with the plan,
       exactly as the card's own scale-plan rules do. Hairlines stay px on
       purpose there and here: below a pixel they disappear on the small cards
       this mode is for. */
    .stage.scale-plan .ilabel {
      padding: 0.08em 0.33em;
      border-radius: 0.33em;
      top: calc(100% + 0.17em);
      max-width: none;
    }
    .stage.scale-plan .ilabel-left,
    .stage.scale-plan .ilabel-right {
      top: 50%;
    }
    .stage.scale-plan .ilabel-left {
      right: calc(100% + 0.33em);
    }
    .stage.scale-plan .ilabel-right {
      left: calc(100% + 0.33em);
    }
    /* Preview of the card's shutter badge. Inherits .items' pointer-events:
       none — the opening underneath stays clickable for selection and drag. */
    .shutter-mark {
      position: absolute;
      /* transform and size are set inline, matching the card. */
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--fp-skin-paper, var(--card-background-color, #fff));
      border: 1px solid var(--fp-skin-wall, var(--primary-text-color, #212121));
      color: var(--fp-skin-wall, var(--primary-text-color, #212121));
      opacity: 0.75;
    }
    .shutter-mark.on {
      color: var(--fp-active, var(--fp-skin-accent, var(--primary-color, #03a9f4)));
      border-color: var(--fp-active, var(--fp-skin-accent, var(--primary-color, #03a9f4)));
      opacity: 1;
    }
    .shutter-mark ha-icon {
      --mdc-icon-size: 15px;
      display: flex;
    }
    /* Grab area = the visible device, matching the card's hit area. A presence
       ripple is mostly empty air, and while the anchor took pointer events for
       all of it, a 110px square sat over the plan: the wall or door underneath
       could not be clicked at all, and neither could a device standing inside
       the ring. The badge and label answer instead — enough to grab and drag,
       and it puts back what was buried. */
    .edit-item {
      position: absolute;
      transform: translate(-50%, -50%);
      pointer-events: none;
      cursor: move;
      display: flex;
      flex-direction: column;
      align-items: center;
      touch-action: none;
    }
    .edit-item .badge,
    .edit-item .ilabel {
      pointer-events: auto;
    }
    .stack-icon,
    .ripple {
      pointer-events: none;
    }
    /* A ripple-only device has no badge to grab, so its centre answers. */
    .edit-item .ripple .dot {
      pointer-events: auto;
      position: relative;
    }
    .edit-item .ripple .dot::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${vt}px;
      height: ${vt}px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
    }
    .badge {
      width: 34px;
      height: 34px;
      border-radius: var(--fp-skin-badge-radius, 50%);
      background: var(--fp-skin-badge-bg, var(--card-background-color, #fff));
      border: var(--fp-skin-badge-border-width, 1.5px) solid
        var(--fp-skin-badge-border, var(--divider-color, #ccc));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--fp-skin-text, var(--primary-text-color));
      box-shadow: var(--fp-skin-badge-shadow, 0 1px 3px rgba(0, 0, 0, 0.25));
    }
    /* Mirrors the card's .badge-value (issue #106) — the canvas must show the
       reading exactly as the plan will draw it. */
    .badge-value {
      font-weight: 600;
      line-height: 1;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    /* Hidden on the live card right now (issue #55): faded and dashed here so
       it reads as deliberately absent from the card, while staying selectable. */
    .edit-item.card-hidden {
      opacity: 0.4;
    }
    .edit-item.card-hidden .badge {
      border-style: dashed;
    }
    .edit-item.selected .badge {
      border-color: var(--primary-color, #03a9f4);
      border-width: 2.5px;
    }
    .badge.ghost {
      opacity: 0.35;
      border-style: dashed;
    }
    .stack {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stack-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ripple {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ripple .ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid var(--fp-ripple-color);
      opacity: 0;

      /* Keep only the angular slice the ring should travel along */
      -webkit-mask: conic-gradient(
        from calc(var(--fp-ripple-direction) * 1deg - var(--fp-ripple-width) * 1deg / 2),
        #000 0deg,
        #000 calc(var(--fp-ripple-width) * 1deg),
        transparent calc(var(--fp-ripple-width) * 1deg)
      );
      mask: conic-gradient(
        from calc(var(--fp-ripple-direction) * 1deg - var(--fp-ripple-width) * 1deg / 2),
        #000 0deg,
        #000 calc(var(--fp-ripple-width) * 1deg),
        transparent calc(var(--fp-ripple-width) * 1deg)
      );
    }
    .ripple.active .ring {
      animation: fp-ripple 1.8s ease-out infinite;
    }
    .ripple .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--fp-ripple-color);
      opacity: 0.4;
    }
    .ripple.active .dot {
      opacity: 0.9;
    }
    @keyframes fp-ripple {
      0% {
        transform: scale(0.15);
        opacity: 0.7;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
    /* === Tracker (editor + card share the same animation classes). The zone
       outline is editor-only and added by renderTracker when editing:true; in
       the live card only the marker / line shows. Movement transitions are
       applied to the marker group's transform so the dot/triangle glides
       between sensor updates rather than jumping. === */
    /* Scoped to <g> so the rule doesn't also match the <svg>, which carries
       the active-tool class (e.g. "tracker") for cursor styling. A bare
       ".tracker" matched the SVG too, and pointer-events is inherited in
       SVG — so toggling the tracker tool silently killed every pointerdown
       on the canvas, breaking drag-to-draw. Same trap as line.wall above. */
    g.tracker {
      pointer-events: none;
    }
    .tracker-zone {
      transition: opacity 0.2s ease;
    }
    /* Dim the zone when a configured presence sensor reports "clear" so the
       editor visibly confirms the marker is being gated off — without this,
       a user toggling the mock presence sensor would just see the triangle
       vanish with no other feedback. */
    .tracker-zone.presence-gated {
      opacity: 0.35;
    }
    .tracker-hit {
      cursor: move;
    }
    .tracker-hit-rect {
      /* Transparent fill turns the entire zone into a pointer target for drag,
         without obscuring the dashed outline drawn by the renderer. */
      fill: transparent;
      pointer-events: all;
    }
    .tracker-outline {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 1.5;
      stroke-dasharray: 6 4;
      pointer-events: none;
    }
    .area-hit {
      cursor: move;
    }
    /* Dead-space hatching (issue #88): a whole region of the canvas, so it must
       never take a pointer event — it sits over the very walls and doors you
       would click next, and over empty floor you need to be able to drag on. */
    .fp-dead-space {
      pointer-events: none;
    }
    .area-hit-shape {
      /* Transparent fill turns the whole polygon into a pointer target for
         the whole-shape drag, without covering the translucent room fill
         drawn underneath by renderArea. */
      fill: transparent;
      stroke: none;
      pointer-events: all;
    }
    .area-scope-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0 0 6px;
      color: var(--primary-color, #03a9f4);
    }
    .area-scope-hint .link-btn {
      border: none;
      background: none;
      padding: 0 2px;
      font: inherit;
      color: var(--primary-color, #03a9f4);
      text-decoration: underline;
      cursor: pointer;
      flex: 0 0 auto;
    }
    .area-scope-hint ha-icon {
      --mdc-icon-size: 16px;
      flex: 0 0 auto;
    }
    .area-outline {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 2;
      pointer-events: none;
    }
    /* The room currently scoping the selected element's entity picker: a
       breathing tint plus marching-ants border, so "you are working inside
       the Kitchen — that's why the picker is short" reads at a glance. */
    .area-scoping {
      fill: var(--primary-color, #03a9f4);
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 2.5;
      stroke-dasharray: 10 6;
      pointer-events: none;
      animation: fp-area-breathe 2.2s ease-in-out infinite,
        fp-area-ants 1.4s linear infinite;
    }
    @keyframes fp-area-breathe {
      0%,
      100% {
        fill-opacity: 0.1;
      }
      50% {
        fill-opacity: 0.28;
      }
    }
    @keyframes fp-area-ants {
      to {
        stroke-dashoffset: -16;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .area-scoping {
        animation: none;
        fill-opacity: 0.2;
      }
    }
    .area-draft-line {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 2;
      stroke-dasharray: 6 4;
      pointer-events: none;
    }
    .area-draft-hover {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 1.5;
      stroke-dasharray: 3 4;
      opacity: 0.7;
      pointer-events: none;
    }
    .area-draft-point {
      fill: var(--primary-color, #03a9f4);
      stroke: var(--card-background-color, #fff);
      stroke-width: 1.5;
      pointer-events: none;
    }
    .area-draft-start {
      fill: var(--card-background-color, #fff);
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 2;
      pointer-events: none;
    }
    /* Light pools are decoration: they must never intercept a pointer. These
       are filled circles drawn above the areas, so without this they swallow
       pointerdown and areas under a lit lamp cannot be selected (issue #108).
       The blend rules mirror the card's, so the editor previews the same
       picture it will render — overlapping lamps add rather than stack. */
    .fp-glows {
      isolation: isolate;
      pointer-events: none;
    }
    .fp-glow {
      mix-blend-mode: screen;
    }
    /* An LED strip's run (issue #298), drawn as the card draws it. */
    .fp-strip {
      stroke: var(--secondary-text-color, #888);
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 2 5;
      opacity: 0.7;
      pointer-events: none;
    }
    .fp-strip.on {
      stroke-dasharray: none;
      opacity: 1;
    }
    /* Radius guide for the selected cast-light device (issue #108). Outline
       only — it shows how far the light reaches without pretending it is on. */
    .glow-guide {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 1.5;
      stroke-dasharray: 6 5;
      opacity: 0.7;
      pointer-events: none;
    }
    .tracker-draft {
      fill: var(--primary-color, #03a9f4);
      fill-opacity: 0.08;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 1.5;
      stroke-dasharray: 6 4;
      pointer-events: none;
    }
    .tracker-marker {
      transition: transform 0.4s ease-out;
      transform-box: fill-box;
    }
    .tracker-dot {
      animation: fp-tracker-pulse 1.4s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
    .tracker-ring {
      animation: fp-tracker-ring 2.2s ease-out infinite;
      opacity: 0;
    }
    .tracker-line {
      transition: transform 0.4s ease-out;
    }
    .tracker-line-stroke {
      opacity: 0.45;
      animation: fp-tracker-pulse 1.6s ease-in-out infinite;
    }
    .tracker-band {
      opacity: 0;
      animation: fp-tracker-band 2.2s ease-out infinite;
    }
    .tracker-placeholder {
      opacity: 0.6;
    }
    @keyframes fp-tracker-pulse {
      0%,
      100% {
        transform: scale(0.9);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
    }
    @keyframes fp-tracker-ring {
      0% {
        r: 0;
        opacity: 0.7;
      }
      100% {
        r: var(--fp-tracker-ring-max, 60px);
        opacity: 0;
      }
    }
    @keyframes fp-tracker-band {
      0% {
        opacity: 0.5;
        stroke-width: 1.5;
      }
      100% {
        opacity: 0;
        stroke-width: 14;
      }
    }
    .edit-text {
      position: absolute;
      pointer-events: auto;
      cursor: move;
      white-space: nowrap;
      font-weight: 500;
      line-height: 1;
      padding: 2px;
      touch-action: none;
    }
    .edit-text.selected {
      outline: 1.5px dashed var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    ha-icon {
      --mdc-icon-size: 22px;
    }
    /* Icon motion while the entity is active (issue #48) — matches the card. */
    ha-icon.anim-spin {
      animation: fp-icon-spin 2s linear infinite;
    }
    ha-icon.anim-pulse {
      animation: fp-icon-pulse 1.6s ease-in-out infinite;
    }
    @keyframes fp-icon-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes fp-icon-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      ha-icon.anim-spin,
      ha-icon.anim-pulse {
        animation: none;
      }
    }
    .ilabel {
      /* Out of flow, hanging below the badge: the label must not change the
         element's box, so badges anchor on (x, y) whether or not a label
         renders — icons stay aligned (issue #34) and match the card. */
      position: absolute;
      top: calc(100% + 2px);
      left: 50%;
      transform: translateX(-50%);
      font-size: 11px;
      line-height: 1;
      padding: 1px 4px;
      border-radius: 4px;
      background: var(--fp-skin-badge-bg, var(--card-background-color, #fff));
      color: var(--secondary-text-color);
      white-space: nowrap;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Label beside the badge (issue #180), mirroring the card's own rule so
       moving it here shows what the card will do rather than only what the
       config now says. */
    .ilabel-left,
    .ilabel-right {
      top: 50%;
      transform: translateY(-50%);
    }
    .ilabel-left {
      left: auto;
      right: calc(100% + 4px);
    }
    .ilabel-right {
      left: calc(100% + 4px);
    }
    /* The card's own label line, drawn as the card draws it (issue #135):
       full-strength ink, and no width clamp — the card has none, and clipping
       is exactly what would make a long label look right here and wrong live.
       The unclamped variant is the one you are checking; the dim fallback
       above stays clamped, being editor chrome rather than a preview. */
    .ilabel.live {
      color: var(--fp-skin-text, var(--primary-text-color));
      max-width: none;
      overflow: visible;
    }
    /* An extra-reading row (issue #180): the entity picker takes the space and
       the attribute box stays narrow beside it, the same proportions the
       state-rule rows use for their condition and colour. */
    .item-reading ha-entity-picker,
    .item-reading input[type="text"]:not(.reading-attr) {
      flex: 1 1 auto;
      min-width: 0;
    }
    .item-reading .reading-attr {
      flex: 0 0 130px;
      min-width: 0;
    }
    /* The visibility toggle belongs to the entity row above it, so it sits
       tight under it and the gap goes after the pair instead. */
    .reading-show {
      margin-top: -4px;
      margin-bottom: 12px;
      padding-left: 4px;
    }
    .reading-show label {
      flex: 0 0 auto;
      font-size: 12px;
      /* Holds the checkbox it wraps, so the pair reads as one control and the
         whole thing is a click target. */
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    /* The panel ("Project" config) and the new element-edit area share the
       same boxed look so the two sections below the canvas read as siblings. */
    .panel,
    .edit-area {
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 10px;
    }
    .section-title {
      margin: 0 0 8px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color);
    }
    /* Element header: kind icon + summary + the selection's actions.
       The actions are the fixed part and the summary is the elastic one: a
       device named after a long entity id used to push Duplicate and Delete
       off the panel entirely (issue #163), which is unreachable rather than
       merely ugly. So everything but the title refuses to shrink, and the
       title truncates instead — its full text stays available on hover. */
    .edit-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .edit-head ha-icon {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
      flex: none;
    }
    .edit-head .edit-title {
      font-size: 13px;
      font-weight: 600;
      /* min-width:0 is what lets a flex item shrink below its content. */
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .edit-head .head-spacer {
      /* Grows to push the actions right, but never shrinks the title away
         while there is still slack of its own to give back. */
      flex: 1 1 0;
      min-width: 0;
    }
    .edit-head button {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      flex: none;
    }
    .edit-head button ha-icon {
      --mdc-icon-size: 16px;
      color: inherit;
    }
    /* Lock in place (issue #191). The pressed state has to read at a glance:
       it is the only one of these buttons that describes a state rather than
       performing an action, and "why won't this drag" is the question it
       exists to answer. */
    .edit-head button.on {
      color: var(--primary-color);
    }
    /* Field rows flow into responsive columns so the below-canvas sections
       stay short at HA-dialog width (~700px fits two columns). Rows that
       need the full width (entity pickers, long hints) opt out via .wide. */
    .rows {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      column-gap: 16px;
      align-items: start;
    }
    .rows .row.wide,
    .rows > .hint,
    .rows > p {
      grid-column: 1 / -1;
    }
    /* ha-form packs its own fields tightly; the last one in a group should not
       sit flush against the next group's rule. */
    .cfg-group > *:last-child {
      margin-bottom: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    .row label {
      flex: 0 0 90px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .row input[type="text"],
    .row input[type="number"],
    .row select {
      flex: 1;
      min-width: 0;
      padding: 4px 6px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    ha-entity-picker,
    ha-icon-picker,
    ha-combo-box {
      flex: 1;
      min-width: 0;
    }
    .row input.num {
      flex: 0 0 64px;
    }
    /* Paste-a-symbol block (issue #90): a stacked row, since a JSON blob does
       not fit the label-then-control shape the rest of the panel uses. */
    .row.col {
      flex-direction: column;
      align-items: stretch;
    }
    .row.col > label {
      flex: none;
      margin-bottom: 2px;
    }
    .symbol-input {
      width: 100%;
      box-sizing: border-box;
      padding: 6px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-family: var(--code-font-family, ui-monospace, monospace);
      font-size: 11px;
      resize: vertical;
    }
    .symbol-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 6px;
    }
    .symbol-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 11px;
      background: var(--secondary-background-color, #f2f2f2);
      color: var(--primary-text-color);
    }
    .symbol-chip button.chip-x {
      border: none;
      background: none;
      padding: 0;
      font-size: 11px;
      line-height: 1;
      color: var(--secondary-text-color);
    }
    .symbol-actions button[disabled] {
      opacity: 0.5;
      cursor: default;
    }
    .symbol-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 6px;
      font-size: 12px;
    }
    .symbol-actions a {
      color: var(--secondary-text-color);
    }
    .symbol-error {
      margin-top: 4px;
      font-size: 11px;
      color: var(--error-color, #c62828);
    }
    /* Compact inline checkbox+label used inside a .row that already has its
       primary <label> on the left (e.g. the Tracker sensor "invert" toggle). */
    .row .inline-check {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .hint {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.5;
    }
    /* The Area name's status line (Linked chip / hint). It sits on its own row
       under the field rather than beside it: the docked inspector is only
       340px wide in full screen, and a chip + hint sharing that row squeezed
       the name box down to a sliver. The empty label keeps it aligned with the
       field above, and -4px claws back the row's own bottom margin so the pair
       still reads as one control. */
    .area-name-status {
      margin-top: -4px;
    }
    /* "Color by state" rules (issues #68, #79, #82). The rules are a list, so
       they read as one group indented under the heading row rather than as
       more loose fields; the rail is what says "these belong together" in a
       340px panel where indentation alone is too expensive. */
    .state-colors {
      margin-bottom: 4px;
    }
    .state-colors label {
      flex: 1 1 auto;
      font-weight: 500;
    }
    .state-color-rule,
    .state-color-add {
      padding-left: 8px;
      border-left: 2px solid var(--divider-color, #ccc);
      margin-bottom: 6px;
    }
    /* The docked inspector is only 340px wide, so a rule's condition and its
       colour cannot share a line without crushing both. Wrap onto two lines
       instead of squeezing — the fullscreen visibility complaint. */
    .row.state-color-rule {
      flex-wrap: wrap;
      row-gap: 4px;
    }
    .rule-note {
      margin: 0 0 6px;
      font-style: italic;
    }
    /* The canvas preview mirrors the card: a resolved state colour paints the
       badge whether or not the entity reads "on". */
    .edit-item .badge.state-colored {
      background: var(--fp-state);
      border-color: var(--fp-state);
      color: var(--fp-ink, var(--text-primary-color, #212121));
    }
    /* An active device, painted exactly as the card paints it (issue #106):
       the device's active colour, else a colour-capable bulb's own, else the
       theme's active yellow — the same fallback chain as .item.on .badge.
       The canvas previewed none of this before, so setting "Active color"
       changed nothing here and a coloured lamp looked plain. Below
       .state-colored, which is the more specific statement. */
    .edit-item .badge.active-colored {
      background: var(--fp-active, var(--fp-skin-active, var(--state-light-active-color, var(--state-active-color, #fdd835))));
      border-color: var(--fp-active, var(--fp-skin-active, var(--state-light-active-color, var(--state-active-color, #fdd835))));
      color: var(--fp-ink, var(--fp-skin-active-ink, var(--text-primary-color, #212121)));
    }
    /* The off colour, previewed as the card paints it (issue #228). Below
       .active-colored and .state-colored in the same order the card uses. */
    .edit-item .badge.inactive-colored {
      background: var(--fp-inactive);
      border-color: var(--fp-inactive);
      color: var(--fp-ink, var(--text-primary-color, #212121));
    }
    /* The floor switcher's drag handle (issue #281). Drawn as the switcher it
       stands for rather than as a generic grip, so what you drag looks like
       what you are placing — and centred on its anchor, which is what makes
       the drop land where the pointer is. */
    .switcher-handle {
      position: absolute;
      /* The overlay it sits in is pointer-events:none so clicks reach the
         canvas underneath; anything in there that is meant to be grabbed has
         to turn them back on for itself. Without this the handle drew
         perfectly and could not be picked up at all. */
      pointer-events: auto;
      transform: translate(-50%, -50%);
      width: max-content;
      cursor: grab;
      touch-action: none;
      z-index: 4;
    }
    /* Only the Select tool moves the switcher, so under a drawing tool the
       handle is just in the way: it sits above the canvas and would swallow a
       wall, door or area gesture started beneath it, since its own pointerdown
       handler ignores every tool but Select. It stays visible, as the footprint
       the card's buttons will cover, and lets the pointer through. */
    .switcher-handle.passive {
      pointer-events: none;
      cursor: default;
    }
    .switcher-handle.dragging {
      cursor: grabbing;
    }
    /* Compact chrome lays the card's buttons across a row rather than down a
       column (issue #152), and the handle has to agree: its whole job is to
       show the footprint the block will have, and a column standing in for a
       row can sit happily in a gap the real thing overflows. Wrapped and
       centred for the same reason the card's is wrapped — eight floors is
       exactly the case a row is worst at. */
    .switcher-handle.floor-switcher.row {
      justify-content: center;
    }
    /* Dimmed until it has been placed, so the canvas does not claim a position
       is stored when none is. Its tooltip says the same thing in words. */
    .switcher-handle.default {
      opacity: 0.55;
    }
    .switcher-handle .sh-btn {
      pointer-events: none;
    }
    .state-color-rule select {
      flex: 0 0 96px;
    }
    /* Higher specificity than the generic .row input rule above, which would
       otherwise stretch a two-digit threshold across half the panel. */
    .row.state-color-rule input.cond {
      flex: 0 0 90px;
    }
    .row.state-color-rule span.cond {
      flex: 0 0 auto;
      font-size: 12px;
      white-space: nowrap;
    }
    /* The color text box gives up width first — the condition and the swatch
       are what you read, and the swatch already shows the colour. */
    .row.state-color-rule input.rule-color-text {
      flex: 1 1 60px;
      min-width: 60px;
    }
    /* The optional icon (issue #106) takes the rule's second line rather than
       competing for the first: the condition and the colour are what you scan,
       and an icon picker needs room for its name to be readable. */
    .row.state-color-rule .rule-icon {
      flex: 1 1 100%;
      min-width: 0;
    }
    /* Named colours (issue #265). The dropdown is the narrowest control in
       the row and never grows: it holds short names, and the swatch beside it
       is what you actually read the colour off. It is absent entirely on a
       plan with no palette, so these rules cost an unpalettised editor
       nothing. */
    .row select.palette-pick {
      flex: 0 1 96px;
      min-width: 0;
    }
    .palette-panel {
      gap: 6px;
    }
    /* The name leads — it is what the dropdowns elsewhere will show — and the
       colour text box gives up width first, exactly as a state rule's does. */
    .row.palette-row input.palette-name {
      flex: 1 1 90px;
      min-width: 60px;
    }
    .row.palette-row input.palette-color {
      flex: 1 1 60px;
      min-width: 60px;
    }
    .palette-row .rule-remove,
    .state-color-rule .rule-remove,
    .state-color-add button {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 3px 6px;
    }
    .state-color-rule .rule-remove {
      flex: 0 0 auto;
    }
    .state-color-rule .rule-remove ha-icon,
    .state-color-add button ha-icon {
      --mdc-icon-size: 16px;
    }
    .area-name-status label {
      /* Alignment spacer only — nothing to announce. */
      flex: 0 0 90px;
    }
    /* "Linked" badge on the Area name row: the HA-area association is implied
       by the name matching, so it needs to be visible somewhere. */
    .ha-link-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 4px 2px 8px;
      border-radius: 999px;
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
    .ha-link-chip ha-icon {
      --mdc-icon-size: 14px;
    }
    .ha-link-chip .unlink {
      display: inline-flex;
      align-items: center;
      padding: 0;
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      opacity: 0.85;
    }
    .ha-link-chip .unlink:hover {
      opacity: 1;
    }
  `,
  Ga,
  wb
];
D([
  G({ attribute: !1 })
], z.prototype, "hass", 2);
D([
  F()
], z.prototype, "_config", 2);
D([
  F()
], z.prototype, "_tool", 2);
D([
  F()
], z.prototype, "_selection", 2);
D([
  F()
], z.prototype, "_activeFloorId", 2);
D([
  F()
], z.prototype, "_draft", 2);
D([
  F()
], z.prototype, "_draftTracker", 2);
D([
  F()
], z.prototype, "_draftArea", 2);
D([
  F()
], z.prototype, "_areaHover", 2);
D([
  F()
], z.prototype, "_areaDragStart", 2);
D([
  F()
], z.prototype, "_areaDragMoved", 2);
D([
  F()
], z.prototype, "_freeWalls", 2);
D([
  F()
], z.prototype, "_defaultOpeningLength", 2);
D([
  F()
], z.prototype, "_defaultSkylightLength", 2);
D([
  F()
], z.prototype, "_defaultSkylightWidth", 2);
D([
  F()
], z.prototype, "_marquee", 2);
D([
  F()
], z.prototype, "_history", 2);
D([
  F()
], z.prototype, "_future", 2);
D([
  F()
], z.prototype, "_zoom", 2);
D([
  F()
], z.prototype, "_floorMenuOpen", 2);
D([
  F()
], z.prototype, "_addMenuOpen", 2);
D([
  F()
], z.prototype, "_addQuery", 2);
D([
  F()
], z.prototype, "_symbolDraft", 2);
D([
  F()
], z.prototype, "_symbolError", 2);
D([
  F()
], z.prototype, "_paletteError", 2);
D([
  F()
], z.prototype, "_switcherDrag", 2);
D([
  F()
], z.prototype, "_projectOpen", 2);
D([
  F()
], z.prototype, "_selectionPage", 2);
D([
  F()
], z.prototype, "_projectPage", 2);
D([
  F()
], z.prototype, "_mobileInspector", 2);
D([
  F()
], z.prototype, "_previewCollapsed", 2);
D([
  F()
], z.prototype, "_keyboardOpen", 2);
D([
  F()
], z.prototype, "_fullscreen", 2);
D([
  F()
], z.prototype, "_applyState", 2);
D([
  F()
], z.prototype, "_applyError", 2);
D([
  go(".editor")
], z.prototype, "_editorEl", 2);
D([
  go("svg")
], z.prototype, "_svg", 2);
D([
  go(".canvas-wrap")
], z.prototype, "_canvasWrap", 2);
D([
  F()
], z.prototype, "_fitToViewport", 2);
D([
  F()
], z.prototype, "_hideLabels", 2);
z = D([
  rn("easy-floorplan-card-editor")
], z);
const ov = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get FloorplanCardEditor() {
    return z;
  }
}, Symbol.toStringTag, { value: "Module" })), rv = "0.7.2", lo = window;
lo.customCards = lo.customCards || [];
lo.customCards.push({
  type: "easy-floorplan-card",
  name: "Easy Floorplan",
  description: "Draw a floorplan with walls, doors, windows, furniture and text, then place device/light controls with a visual editor.",
  preview: !1,
  documentationURL: "https://github.com/nicosandller/easy-floorplan"
});
console.info(
  `%c EASY-FLOORPLAN %c ${rv} `,
  "background:#03a9f4;color:#fff",
  "color:#03a9f4"
);
export {
  ge as FloorplanCard
};
