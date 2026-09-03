/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ve = globalThis, Kt = Ve.ShadowRoot && (Ve.ShadyCSS === void 0 || Ve.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Vt = Symbol(), Li = /* @__PURE__ */ new WeakMap();
let Ln = class {
  constructor(t, i, n) {
    if (this._$cssResult$ = !0, n !== Vt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Kt && t === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (t = Li.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && Li.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Dn = (e) => new Ln(typeof e == "string" ? e : e + "", void 0, Vt), Yt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((n, o, r) => n + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[r + 1], e[0]);
  return new Ln(i, e, Vt);
}, nr = (e, t) => {
  if (Kt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const n = document.createElement("style"), o = Ve.litNonce;
    o !== void 0 && n.setAttribute("nonce", o), n.textContent = i.cssText, e.appendChild(n);
  }
}, Di = Kt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const n of t.cssRules) i += n.cssText;
  return Dn(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: or, defineProperty: rr, getOwnPropertyDescriptor: sr, getOwnPropertyNames: ar, getOwnPropertySymbols: lr, getPrototypeOf: cr } = Object, gt = globalThis, Hi = gt.trustedTypes, hr = Hi ? Hi.emptyScript : "", dr = gt.reactiveElementPolyfillSupport, Oe = (e, t) => e, et = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? hr : null;
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
} }, Zt = (e, t) => !or(e, t), Ri = { attribute: !0, type: String, converter: et, reflect: !1, useDefault: !1, hasChanged: Zt };
Symbol.metadata ??= Symbol("metadata"), gt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let fe = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Ri) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const n = Symbol(), o = this.getPropertyDescriptor(t, n, i);
      o !== void 0 && rr(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, i, n) {
    const { get: o, set: r } = sr(this.prototype, t) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: o, set(s) {
      const l = o?.call(this);
      r?.call(this, s), this.requestUpdate(t, l, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ri;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Oe("elementProperties"))) return;
    const t = cr(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Oe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Oe("properties"))) {
      const i = this.properties, n = [...ar(i), ...lr(i)];
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
      for (const o of n) i.unshift(Di(o));
    } else t !== void 0 && i.push(Di(t));
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
    return nr(t, this.constructor.elementStyles), t;
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
      const r = (n.converter?.toAttribute !== void 0 ? n.converter : et).toAttribute(i, n.type);
      this._$Em = t, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const n = this.constructor, o = n._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const r = n.getPropertyOptions(o), s = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : et;
      this._$Em = o;
      const l = s.fromAttribute(i, r.type);
      this[o] = l ?? this._$Ej?.get(o) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, i, n, o = !1, r) {
    if (t !== void 0) {
      const s = this.constructor;
      if (o === !1 && (r = this[t]), n ??= s.getPropertyOptions(t), !((n.hasChanged ?? Zt)(r, i) || n.useDefault && n.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, n)))) return;
      this.C(t, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: n, reflect: o, wrapped: r }, s) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, s ?? i ?? this[t]), r !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (i = void 0), this._$AL.set(t, i)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        const { wrapped: s } = r, l = this[o];
        s !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, r, l);
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
fe.elementStyles = [], fe.shadowRootOptions = { mode: "open" }, fe[Oe("elementProperties")] = /* @__PURE__ */ new Map(), fe[Oe("finalized")] = /* @__PURE__ */ new Map(), dr?.({ ReactiveElement: fe }), (gt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xt = globalThis, Ni = (e) => e, tt = Xt.trustedTypes, ji = tt ? tt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Hn = "$lit$", Z = `lit$${Math.random().toFixed(9).slice(2)}$`, Rn = "?" + Z, ur = `<${Rn}>`, ce = document, De = () => ce.createComment(""), He = (e) => e === null || typeof e != "object" && typeof e != "function", Qt = Array.isArray, pr = (e) => Qt(e) || typeof e?.[Symbol.iterator] == "function", Et = `[ 	
\f\r]`, Ae = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Bi = /-->/g, Ui = />/g, oe = RegExp(`>|${Et}(?:([^\\s"'>=/]+)(${Et}*=${Et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Wi = /'/g, Gi = /"/g, Nn = /^(?:script|style|textarea|title)$/i, jn = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), g = jn(1), b = jn(2), te = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), qi = /* @__PURE__ */ new WeakMap(), ae = ce.createTreeWalker(ce, 129);
function Bn(e, t) {
  if (!Qt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ji !== void 0 ? ji.createHTML(t) : t;
}
const fr = (e, t) => {
  const i = e.length - 1, n = [];
  let o, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = Ae;
  for (let l = 0; l < i; l++) {
    const a = e[l];
    let c, h, d = -1, p = 0;
    for (; p < a.length && (s.lastIndex = p, h = s.exec(a), h !== null); ) p = s.lastIndex, s === Ae ? h[1] === "!--" ? s = Bi : h[1] !== void 0 ? s = Ui : h[2] !== void 0 ? (Nn.test(h[2]) && (o = RegExp("</" + h[2], "g")), s = oe) : h[3] !== void 0 && (s = oe) : s === oe ? h[0] === ">" ? (s = o ?? Ae, d = -1) : h[1] === void 0 ? d = -2 : (d = s.lastIndex - h[2].length, c = h[1], s = h[3] === void 0 ? oe : h[3] === '"' ? Gi : Wi) : s === Gi || s === Wi ? s = oe : s === Bi || s === Ui ? s = Ae : (s = oe, o = void 0);
    const m = s === oe && e[l + 1].startsWith("/>") ? " " : "";
    r += s === Ae ? a + ur : d >= 0 ? (n.push(c), a.slice(0, d) + Hn + a.slice(d) + Z + m) : a + Z + (d === -2 ? l : m);
  }
  return [Bn(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class Re {
  constructor({ strings: t, _$litType$: i }, n) {
    let o;
    this.parts = [];
    let r = 0, s = 0;
    const l = t.length - 1, a = this.parts, [c, h] = fr(t, i);
    if (this.el = Re.createElement(c, n), ae.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (o = ae.nextNode()) !== null && a.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const d of o.getAttributeNames()) if (d.endsWith(Hn)) {
          const p = h[s++], m = o.getAttribute(d).split(Z), v = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: r, name: v[2], strings: m, ctor: v[1] === "." ? mr : v[1] === "?" ? yr : v[1] === "@" ? br : mt }), o.removeAttribute(d);
        } else d.startsWith(Z) && (a.push({ type: 6, index: r }), o.removeAttribute(d));
        if (Nn.test(o.tagName)) {
          const d = o.textContent.split(Z), p = d.length - 1;
          if (p > 0) {
            o.textContent = tt ? tt.emptyScript : "";
            for (let m = 0; m < p; m++) o.append(d[m], De()), ae.nextNode(), a.push({ type: 2, index: ++r });
            o.append(d[p], De());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Rn) a.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = o.data.indexOf(Z, d + 1)) !== -1; ) a.push({ type: 7, index: r }), d += Z.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const n = ce.createElement("template");
    return n.innerHTML = t, n;
  }
}
function $e(e, t, i = e, n) {
  if (t === te) return t;
  let o = n !== void 0 ? i._$Co?.[n] : i._$Cl;
  const r = He(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== r && (o?._$AO?.(!1), r === void 0 ? o = void 0 : (o = new r(e), o._$AT(e, i, n)), n !== void 0 ? (i._$Co ??= [])[n] = o : i._$Cl = o), o !== void 0 && (t = $e(e, o._$AS(e, t.values), o, n)), t;
}
class gr {
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
    const { el: { content: i }, parts: n } = this._$AD, o = (t?.creationScope ?? ce).importNode(i, !0);
    ae.currentNode = o;
    let r = ae.nextNode(), s = 0, l = 0, a = n[0];
    for (; a !== void 0; ) {
      if (s === a.index) {
        let c;
        a.type === 2 ? c = new ke(r, r.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (c = new vr(r, this, t)), this._$AV.push(c), a = n[++l];
      }
      s !== a?.index && (r = ae.nextNode(), s++);
    }
    return ae.currentNode = ce, o;
  }
  p(t) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, i), i += n.strings.length - 2) : n._$AI(t[i])), i++;
  }
}
class ke {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, n, o) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = n, this.options = o, this._$Cv = o?.isConnected ?? !0;
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
    t = $e(this, t, i), He(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== te && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : pr(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && He(this._$AH) ? this._$AA.nextSibling.data = t : this.T(ce.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: n } = t, o = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = Re.createElement(Bn(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === o) this._$AH.p(i);
    else {
      const r = new gr(o, this), s = r.u(this.options);
      r.p(i), this.T(s), this._$AH = r;
    }
  }
  _$AC(t) {
    let i = qi.get(t.strings);
    return i === void 0 && qi.set(t.strings, i = new Re(t)), i;
  }
  k(t) {
    Qt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, o = 0;
    for (const r of t) o === i.length ? i.push(n = new ke(this.O(De()), this.O(De()), this, this.options)) : n = i[o], n._$AI(r), o++;
    o < i.length && (this._$AR(n && n._$AB.nextSibling, o), i.length = o);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const n = Ni(t).nextSibling;
      Ni(t).remove(), t = n;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class mt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, n, o, r) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = t, this.name = i, this._$AM = o, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = f;
  }
  _$AI(t, i = this, n, o) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) t = $e(this, t, i, 0), s = !He(t) || t !== this._$AH && t !== te, s && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = r[0], a = 0; a < r.length - 1; a++) c = $e(this, l[n + a], i, a), c === te && (c = this._$AH[a]), s ||= !He(c) || c !== this._$AH[a], c === f ? t = f : t !== f && (t += (c ?? "") + r[a + 1]), this._$AH[a] = c;
    }
    s && !o && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class mr extends mt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class yr extends mt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class br extends mt {
  constructor(t, i, n, o, r) {
    super(t, i, n, o, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = $e(this, t, i, 0) ?? f) === te) return;
    const n = this._$AH, o = t === f && n !== f || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, r = t !== f && (n === f || o);
    o && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class vr {
  constructor(t, i, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    $e(this, t);
  }
}
const wr = { I: ke }, _r = Xt.litHtmlPolyfillSupport;
_r?.(Re, ke), (Xt.litHtmlVersions ??= []).push("3.3.3");
const $r = (e, t, i) => {
  const n = i?.renderBefore ?? t;
  let o = n._$litPart$;
  if (o === void 0) {
    const r = i?.renderBefore ?? null;
    n._$litPart$ = o = new ke(t.insertBefore(De(), r), r, void 0, i ?? {});
  }
  return o._$AI(e), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = globalThis;
let be = class extends fe {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = $r(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return te;
  }
};
be._$litElement$ = !0, be.finalized = !0, Jt.litElementHydrateSupport?.({ LitElement: be });
const xr = Jt.litElementPolyfillSupport;
xr?.({ LitElement: be });
(Jt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Un = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kr = { attribute: !0, type: String, converter: et, reflect: !1, hasChanged: Zt }, Sr = (e = kr, t, i) => {
  const { kind: n, metadata: o } = i;
  let r = globalThis.litPropertyMetadata.get(o);
  if (r === void 0 && globalThis.litPropertyMetadata.set(o, r = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), n === "accessor") {
    const { name: s } = i;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(s, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(s, void 0, e, l), l;
    } };
  }
  if (n === "setter") {
    const { name: s } = i;
    return function(l) {
      const a = this[s];
      t.call(this, l), this.requestUpdate(s, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function ei(e) {
  return (t, i) => typeof i == "object" ? Sr(e, t, i) : ((n, o, r) => {
    const s = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, n), s ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function I(e) {
  return ei({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ar = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ti(e, t) {
  return (i, n, o) => {
    const r = (s) => s.renderRoot?.querySelector(e) ?? null;
    return Ar(i, n, { get() {
      return r(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Er = { CHILD: 2 }, ii = (e) => (...t) => ({ _$litDirective$: e, values: t });
let ni = class {
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
const { I: Mr } = wr, Ki = (e) => e, Vi = () => document.createComment(""), Ee = (e, t, i) => {
  const n = e._$AA.parentNode, o = t === void 0 ? e._$AB : t._$AA;
  if (i === void 0) {
    const r = n.insertBefore(Vi(), o), s = n.insertBefore(Vi(), o);
    i = new Mr(r, s, e, e.options);
  } else {
    const r = i._$AB.nextSibling, s = i._$AM, l = s !== e;
    if (l) {
      let a;
      i._$AQ?.(e), i._$AM = e, i._$AP !== void 0 && (a = e._$AU) !== s._$AU && i._$AP(a);
    }
    if (r !== o || l) {
      let a = i._$AA;
      for (; a !== r; ) {
        const c = Ki(a).nextSibling;
        Ki(n).insertBefore(a, o), a = c;
      }
    }
  }
  return i;
}, re = (e, t, i = e) => (e._$AI(t, i), e), Tr = {}, Wn = (e, t = Tr) => e._$AH = t, Ir = (e) => e._$AH, Mt = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yi = (e, t, i) => {
  const n = /* @__PURE__ */ new Map();
  for (let o = t; o <= i; o++) n.set(e[o], o);
  return n;
}, X = ii(class extends ni {
  constructor(e) {
    if (super(e), e.type !== Er.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, i) {
    let n;
    i === void 0 ? i = t : t !== void 0 && (n = t);
    const o = [], r = [];
    let s = 0;
    for (const l of e) o[s] = n ? n(l, s) : s, r[s] = i(l, s), s++;
    return { values: r, keys: o };
  }
  render(e, t, i) {
    return this.dt(e, t, i).values;
  }
  update(e, [t, i, n]) {
    const o = Ir(e), { values: r, keys: s } = this.dt(t, i, n);
    if (!Array.isArray(o)) return this.ut = s, r;
    const l = this.ut ??= [], a = [];
    let c, h, d = 0, p = o.length - 1, m = 0, v = r.length - 1;
    for (; d <= p && m <= v; ) if (o[d] === null) d++;
    else if (o[p] === null) p--;
    else if (l[d] === s[m]) a[m] = re(o[d], r[m]), d++, m++;
    else if (l[p] === s[v]) a[v] = re(o[p], r[v]), p--, v--;
    else if (l[d] === s[v]) a[v] = re(o[d], r[v]), Ee(e, a[v + 1], o[d]), d++, v--;
    else if (l[p] === s[m]) a[m] = re(o[p], r[m]), Ee(e, o[d], o[p]), p--, m++;
    else if (c === void 0 && (c = Yi(s, m, v), h = Yi(l, d, p)), c.has(l[d])) if (c.has(l[p])) {
      const y = h.get(s[m]), w = y !== void 0 ? o[y] : null;
      if (w === null) {
        const u = Ee(e, o[d]);
        re(u, r[m]), a[m] = u;
      } else a[m] = re(w, r[m]), Ee(e, o[d], w), o[y] = null;
      m++;
    } else Mt(o[p]), p--;
    else Mt(o[d]), d++;
    for (; m <= v; ) {
      const y = Ee(e, a[v + 1]);
      re(y, r[m]), a[m++] = y;
    }
    for (; d <= p; ) {
      const y = o[d++];
      y !== null && Mt(y);
    }
    return this.ut = s, Wn(e, a), te;
  }
});
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gn = ii(class extends ni {
  constructor() {
    super(...arguments), this.key = f;
  }
  render(e, t) {
    return this.key = e, t;
  }
  update(e, [t, i]) {
    return t !== this.key && (Wn(e), this.key = t), i;
  }
}), Cr = /* @__PURE__ */ new Set([
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
]), Or = /^[a-z0-9#%.,/_() +*-]+$/i, Pr = /([a-z][a-z0-9-]*)\s*\(/gi;
function H(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  if (!t || !Or.test(t) || t.includes("/*") || t.includes("*/") || !/^[a-z#]/i.test(t)) return;
  let i = 0;
  for (let o = 0; o < t.length; o++) {
    const r = t[o];
    if (r === "(") i++;
    else if (r === ")" && --i < 0) return;
  }
  if (i !== 0) return;
  const n = new RegExp(Pr.source, "gi");
  for (let o; o = n.exec(t); )
    if (!Cr.has(o[1].toLowerCase())) return;
  return t;
}
function N(e, t) {
  return H(e) ?? t;
}
function T(e, t) {
  if (e == null || typeof e == "string" && e.trim() === "") return t;
  const i = typeof e == "number" ? e : Number(e);
  return Number.isFinite(i) ? i : t;
}
function j(e) {
  if (typeof e != "string") return;
  const t = e.trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return t === "" ? void 0 : t;
}
const zr = {
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
function Fr(e) {
  const t = e.trim().toLowerCase(), i = zr[t];
  if (i) return i;
  const n = /^#([0-9a-f]{3,8})$/i.exec(t);
  if (n) {
    const r = n[1];
    return r.length === 3 || r.length === 4 ? [0, 1, 2].map((s) => parseInt(r[s] + r[s], 16)) : r.length === 6 || r.length === 8 ? [0, 2, 4].map((s) => parseInt(r.slice(s, s + 2), 16)) : void 0;
  }
  const o = /^rgba?\(([^)]*)\)$/.exec(t);
  if (o) {
    const r = o[1].split(/[\s,/]+/).filter((l) => l !== "");
    if (r.length < 3) return;
    const s = r.slice(0, 3).map((l) => {
      if (l.endsWith("%")) {
        const a = Number(l.slice(0, -1));
        return Number.isFinite(a) ? a / 100 * 255 : NaN;
      }
      return Number(l);
    });
    return s.some((l) => !Number.isFinite(l)) ? void 0 : s.map((l) => Math.max(0, Math.min(255, l)));
  }
}
function oi([e, t, i]) {
  const n = (o) => {
    const r = o / 255;
    return r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * n(e) + 0.7152 * n(t) + 0.0722 * n(i);
}
const Lr = "#212121", Dr = "#ffffff", Hr = oi([33, 33, 33]), Rr = oi([255, 255, 255]);
function qn(e) {
  if (typeof e != "string") return;
  const t = Fr(e);
  if (!t) return;
  const i = oi(t), n = (o) => (Math.max(i, o) + 0.05) / (Math.min(i, o) + 0.05);
  return n(Hr) >= n(Rr) ? Lr : Dr;
}
const Nr = /^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/i;
function Pe(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  return Nr.test(t) ? t : void 0;
}
function ee(e) {
  if (typeof e != "string") return;
  const t = e.trim().replace(/[^a-zA-Z0-9_.-]/g, "");
  return t === "" ? void 0 : t;
}
function Zi(e) {
  return !!e?.haArea && (e.filterEntities ?? !0);
}
const Xi = -6, jr = 6, ri = 0.45, it = 1, Kn = "scale", Vn = "dim", Qi = 0.92, Ji = 80, en = 260, zt = 0.25, si = 14, Br = 3, yt = 140, Yn = "var(--fp-skin-glow, #ffd9a0)", tn = 0.18, nt = 0.6, nn = 0.5, on = 0.45, Ur = 0.5, ai = 14, le = 34, ot = 34, ze = 16, bt = 80, Wr = "var(--fp-skin-furniture, #9e9e9e)", ve = 1e3, Ne = 600, li = 20, rn = 50;
function Gr(e, t) {
  return e ?? t;
}
function sn(e, t) {
  return t <= 0 ? 100 : Math.round(e / t * 100);
}
function Tt(e, t) {
  return Math.max(1, Math.round(t * e / 100));
}
function an(e) {
  const t = e?.floors;
  return !t || typeof t != "object" ? [] : Object.values(t).filter((i) => !!i && typeof i.floor_id == "string" && typeof i.name == "string").sort((i, n) => (i.level ?? 0) - (n.level ?? 0) || i.name.localeCompare(n.name));
}
function qr(e) {
  const t = e?.areas;
  return !t || typeof t != "object" ? [] : Object.values(t).filter((i) => !!i && typeof i.area_id == "string" && typeof i.name == "string").sort((i, n) => i.name.localeCompare(n.name));
}
function Kr(e, t) {
  if (!("name" in e)) return e;
  const i = (e.name ?? "").toString().trim(), n = Vr(t, i);
  return { ...e, name: n ? n.name : i || void 0, haArea: n?.area_id };
}
function Vr(e, t) {
  const i = (t ?? "").trim();
  if (!i) return;
  const n = e.find((l) => l.name === i);
  if (n) return n;
  const o = i.toLowerCase(), r = e.find((l) => l.name.toLowerCase() === o);
  if (r) return r;
  const s = o.replace(/\s+/g, " ");
  return e.find((l) => l.name.trim().toLowerCase().replace(/\s+/g, " ") === s);
}
function Yr(e, t) {
  const i = e, n = i?.entities?.[t];
  return n ? n.area_id ? n.area_id : (n.device_id ? i?.devices?.[n.device_id] : void 0)?.area_id ?? void 0 : void 0;
}
function It(e, t) {
  const n = e?.entities;
  return !n || typeof n != "object" ? [] : Object.keys(n).filter((o) => Yr(e, o) === t);
}
function Zr(e) {
  return {
    type: e,
    width: ve,
    height: Ne,
    grid: li,
    walls: [],
    openings: [],
    items: [],
    texts: [],
    furniture: [],
    trackers: [],
    areas: []
  };
}
function Xr() {
  return { overlayScale: "plan" };
}
function D(e) {
  return `${e}_${Math.random().toString(36).slice(2, 9)}`;
}
function Ft(e, t) {
  if (e === t) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return !Array.isArray(e) || !Array.isArray(t) || e.length !== t.length ? !1 : e.every((o, r) => Ft(o, t[r]));
  if (typeof e != "object" || typeof t != "object" || e === null || t === null) return !1;
  const i = e, n = t;
  for (const o of /* @__PURE__ */ new Set([...Object.keys(i), ...Object.keys(n)]))
    if (!Ft(i[o], n[o])) return !1;
  return !0;
}
function Qr(e, t = []) {
  return {
    id: D("floor"),
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
function Jr(e) {
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
function es(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((i, n) => {
    let o = i.id || `floor_${n + 1}`;
    for (; t.has(o); ) o = `${o}_${n + 1}`;
    return t.add(o), o === i.id ? i : { ...i, id: o };
  });
}
function ts(e, t, i) {
  const n = e.findIndex((l) => l.id === t), o = n + i;
  if (n < 0 || o < 0 || o >= e.length) return null;
  const r = [...e], [s] = r.splice(n, 1);
  return r.splice(o, 0, s), r;
}
function rt(e) {
  return e.floors && e.floors.length ? es(e.floors.map(Jr)) : [
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
function st(e, t) {
  if (!t) return null;
  const i = e?.[t.entity]?.state;
  if (i == null || i === "unavailable" || i === "unknown") return !1;
  const n = i === "on" || i === "open" || i === "home" || i === "detected";
  return t.invert ? !n : n;
}
function ln(e, t) {
  if (!e || t == null || !Number.isFinite(t)) return null;
  const i = e.max - e.min;
  if (i === 0) return null;
  const n = (t - e.min) / i, o = Math.max(0, Math.min(1, n));
  return e.invert ? 1 - o : o;
}
const is = "airHandler", ns = "air handler", os = "utility", rs = [
  "hvac",
  "ahu",
  "furnace",
  "ventilation"
], ss = {
  w: 60,
  h: 56
}, as = [
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
], ls = {
  id: is,
  name: ns,
  category: os,
  keywords: rs,
  size: ss,
  parts: as
}, cs = "bathtub", hs = "bathtub", ds = "bath", us = [
  "bath",
  "tub"
], ps = {
  w: 150,
  h: 76
}, fs = [
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
], gs = {
  id: cs,
  name: hs,
  category: ds,
  keywords: us,
  size: ps,
  parts: fs
}, ms = "bed", ys = "bed", bs = "bedroom", vs = [
  "double",
  "mattress",
  "sleep"
], ws = {
  w: 150,
  h: 200
}, _s = [
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
], $s = {
  id: ms,
  name: ys,
  category: bs,
  keywords: vs,
  size: ws,
  parts: _s
}, xs = "chair", ks = "chair", Ss = "living", As = [
  "seat"
], Es = {
  w: 44,
  h: 44
}, Ms = [
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
], Ts = {
  id: xs,
  name: ks,
  category: Ss,
  keywords: As,
  size: Es,
  parts: Ms
}, Is = "desk", Cs = "desk", Os = "living", Ps = [
  "office",
  "workstation"
], zs = {
  w: 120,
  h: 60
}, Fs = [
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
], Ls = {
  id: Is,
  name: Cs,
  category: Os,
  keywords: Ps,
  size: zs,
  parts: Fs
}, Ds = "dishwasher", Hs = "dishwasher", Rs = "kitchen", Ns = [
  "dishes"
], js = {
  w: 60,
  h: 60
}, Bs = [
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
], Us = {
  id: Ds,
  name: Hs,
  category: Rs,
  keywords: Ns,
  size: js,
  parts: Bs
}, Ws = "dryer", Gs = "dryer", qs = "utility", Ks = [
  "tumble dryer",
  "laundry"
], Vs = {
  w: 60,
  h: 62
}, Ys = [
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
], Zs = {
  id: Ws,
  name: Gs,
  category: qs,
  keywords: Ks,
  size: Vs,
  parts: Ys
}, Xs = "fishTank", Qs = "fish tank", Js = "living", ea = [
  "aquarium",
  "fish",
  "water"
], ta = {
  w: 100,
  h: 40
}, ia = [
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
], na = {
  id: Xs,
  name: Qs,
  category: Js,
  keywords: ea,
  size: ta,
  parts: ia
}, oa = "fridge", ra = "fridge", sa = "kitchen", aa = [
  "refrigerator",
  "freezer"
], la = {
  w: 60,
  h: 64
}, ca = [
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
], ha = {
  id: oa,
  name: ra,
  category: sa,
  keywords: aa,
  size: la,
  parts: ca
}, da = "hotTub", ua = "hot tub", pa = "bath", fa = [
  "jacuzzi",
  "spa",
  "whirlpool"
], ga = {
  w: 120,
  h: 120
}, ma = [
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
], ya = {
  id: da,
  name: ua,
  category: pa,
  keywords: fa,
  size: ga,
  parts: ma
}, ba = "piano", va = "piano", wa = "living", _a = [
  "upright",
  "keyboard",
  "music"
], $a = {
  w: 140,
  h: 60
}, xa = [
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
], ka = {
  id: ba,
  name: va,
  category: wa,
  keywords: _a,
  size: $a,
  parts: xa
}, Sa = "plant", Aa = "plant", Ea = "living", Ma = [
  "pot",
  "tree",
  "greenery"
], Ta = {
  w: 44,
  h: 44
}, Ia = "ellipse", Ca = [
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
], Oa = {
  id: Sa,
  name: Aa,
  category: Ea,
  keywords: Ma,
  size: Ta,
  footprint: Ia,
  parts: Ca
}, Pa = "roundTable", za = "round table", Fa = "living", La = [
  "dining",
  "circular"
], Da = {
  w: 100,
  h: 100
}, Ha = "ellipse", Ra = [
  {
    ellipse: [
      50,
      50,
      50,
      50
    ],
    role: "body"
  }
], Na = {
  id: Pa,
  name: za,
  category: Fa,
  keywords: La,
  size: Da,
  footprint: Ha,
  parts: Ra
}, ja = "rug", Ba = "rug", Ua = "living", Wa = [
  "carpet",
  "mat"
], Ga = {
  w: 180,
  h: 120
}, qa = [
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
], Ka = {
  id: ja,
  name: Ba,
  category: Ua,
  keywords: Wa,
  size: Ga,
  parts: qa
}, Va = "sectional", Ya = "sectional (L)", Za = "living", Xa = [
  "couch",
  "sofa",
  "corner",
  "chaise"
], Qa = {
  w: 230,
  h: 180
}, Ja = [
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
], el = {
  id: Va,
  name: Ya,
  category: Za,
  keywords: Xa,
  size: Qa,
  parts: Ja
}, tl = "sink", il = "sink", nl = "kitchen", ol = [
  "basin",
  "tap",
  "faucet"
], rl = {
  w: 64,
  h: 48
}, sl = [
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
], al = {
  id: tl,
  name: il,
  category: nl,
  keywords: ol,
  size: rl,
  parts: sl
}, ll = "sofa", cl = "sofa", hl = "living", dl = [
  "couch",
  "settee",
  "seat"
], ul = {
  w: 170,
  h: 72
}, pl = [
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
], fl = {
  id: ll,
  name: cl,
  category: hl,
  keywords: dl,
  size: ul,
  parts: pl
}, gl = "stairs", ml = "stairs", yl = "utility", bl = [
  "steps",
  "staircase"
], vl = {
  w: 90,
  h: 170
}, wl = [
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
], _l = {
  id: gl,
  name: ml,
  category: yl,
  keywords: bl,
  size: vl,
  parts: wl
}, $l = "stove", xl = "stove", kl = "kitchen", Sl = [
  "cooker",
  "hob",
  "oven",
  "range"
], Al = {
  w: 64,
  h: 64
}, El = [
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
], Ml = {
  id: $l,
  name: xl,
  category: kl,
  keywords: Sl,
  size: Al,
  parts: El
}, Tl = "table", Il = "table", Cl = "living", Ol = [
  "dining"
], Pl = {
  w: 120,
  h: 80
}, zl = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 5
  }
], Fl = {
  id: Tl,
  name: Il,
  category: Cl,
  keywords: Ol,
  size: Pl,
  parts: zl
}, Ll = "toilet", Dl = "toilet", Hl = "bath", Rl = [
  "wc",
  "loo",
  "lavatory"
], Nl = {
  w: 48,
  h: 68
}, jl = [
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
], Bl = {
  id: Ll,
  name: Dl,
  category: Hl,
  keywords: Rl,
  size: Nl,
  parts: jl
}, Ul = "tv", Wl = "tv", Gl = "living", ql = [
  "television",
  "screen",
  "media"
], Kl = {
  w: 110,
  h: 18
}, Vl = [
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
], Yl = {
  id: Ul,
  name: Wl,
  category: Gl,
  keywords: ql,
  size: Kl,
  parts: Vl
}, Zl = "vanity", Xl = "vanity", Ql = "bath", Jl = [
  "washbasin",
  "sink",
  "bathroom"
], ec = {
  w: 110,
  h: 55
}, tc = [
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
], ic = {
  id: Zl,
  name: Xl,
  category: Ql,
  keywords: Jl,
  size: ec,
  parts: tc
}, nc = "wardrobe", oc = "wardrobe", rc = "bedroom", sc = [
  "closet",
  "armoire",
  "cupboard"
], ac = {
  w: 120,
  h: 55
}, lc = [
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
], cc = {
  id: nc,
  name: oc,
  category: rc,
  keywords: sc,
  size: ac,
  parts: lc
}, hc = "washer", dc = "washer", uc = "utility", pc = [
  "washing machine",
  "laundry"
], fc = {
  w: 60,
  h: 62
}, gc = [
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
], mc = {
  id: hc,
  name: dc,
  category: uc,
  keywords: pc,
  size: fc,
  parts: gc
}, yc = "waterHeater", bc = "water heater", vc = "utility", wc = [
  "boiler",
  "cylinder",
  "tank"
], _c = {
  w: 52,
  h: 52
}, $c = "ellipse", xc = [
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
], kc = {
  id: yc,
  name: bc,
  category: vc,
  keywords: wc,
  size: _c,
  footprint: $c,
  parts: xc
}, Lt = [
  "living",
  "bedroom",
  "kitchen",
  "bath",
  "utility",
  "other"
], vt = (e) => Object.assign(/* @__PURE__ */ Object.create(null), e), ci = (e, t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0, cn = vt({
  body: { width: 2, opacity: 1, fillOpacity: 0.12 },
  line: { width: 2, opacity: 1, fillOpacity: 0 },
  thin: { width: 1.5, opacity: 1, fillOpacity: 0 },
  detail: { width: 1.5, opacity: 0.7, fillOpacity: 0 },
  hint: { width: 1, opacity: 0.6, fillOpacity: 0 },
  solid: { width: 0, opacity: 0.7, fillOpacity: 1 }
}), Sc = [0, 0, 100, 100], Ac = 64, Zn = 256, Ec = 256, Mc = 0.25, hn = 8, K = (e) => typeof e == "number" && Number.isFinite(e) ? e : null, ge = (e, t, i) => Math.min(i, Math.max(t, e));
function J(e, t) {
  if (!Array.isArray(e) || e.length !== t) return null;
  const i = [];
  for (const n of e) {
    const o = K(n);
    if (o === null) return null;
    i.push(o);
  }
  return i;
}
function Tc(e) {
  if (!Array.isArray(e) || e.length < 2 || e.length > Zn) return null;
  const t = [];
  for (const i of e) {
    const n = J(i, 2);
    if (!n) return null;
    t.push([n[0], n[1]]);
  }
  return t;
}
const Ic = vt({ M: 2, L: 2, Q: 4, C: 6, Z: 0 });
function Cc(e) {
  if (!Array.isArray(e) || !e.length || e.length > Ec) return null;
  const t = [];
  for (const i of e) {
    if (!Array.isArray(i) || typeof i[0] != "string") return null;
    const n = i[0].toUpperCase(), o = ci(Ic, n);
    if (o === void 0) return null;
    const r = J(i.slice(1), o);
    if (!r) return null;
    t.push([n, ...r]);
  }
  return t[0]?.[0] !== "M" ? null : t;
}
function ue(e, t) {
  const i = ci(cn, e.role) ? e.role : t, n = cn[i], o = K(e.width), r = K(e.opacity), s = K(e.fillOpacity), l = Array.isArray(e.dash) ? e.dash.map(K) : null, a = l && l.length && l.length <= 8 && l.every((c) => c !== null) ? l.map((c) => ge(c, 0, 100)) : void 0;
  return {
    role: i,
    width: o === null ? n.width : i === "solid" ? ge(o, 0, hn) : ge(o, Mc, hn),
    opacity: r === null ? n.opacity : ge(r, 0, 1),
    fillOpacity: s === null ? n.fillOpacity : ge(s, 0, 1),
    dash: a
  };
}
function dn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, i = t.space === "square" ? "square" : "box";
  if ("line" in t) {
    const n = J(t.line, 4);
    return n ? { kind: "line", a: [n[0], n[1]], b: [n[2], n[3]], space: i, style: ue(t, "line") } : null;
  }
  if ("rect" in t) {
    const n = J(t.rect, 4);
    return !n || n[2] < 0 || n[3] < 0 ? null : {
      kind: "rect",
      x: n[0],
      y: n[1],
      w: n[2],
      h: n[3],
      rx: Math.max(0, K(t.rx) ?? 0),
      space: i,
      style: ue(t, "body")
    };
  }
  if ("circle" in t) {
    const n = J(t.circle, 3);
    return !n || n[2] < 0 ? null : { kind: "circle", cx: n[0], cy: n[1], r: n[2], space: i, style: ue(t, "line") };
  }
  if ("ellipse" in t) {
    const n = J(t.ellipse, 4);
    return !n || n[2] < 0 || n[3] < 0 ? null : {
      kind: "ellipse",
      cx: n[0],
      cy: n[1],
      rx: n[2],
      ry: n[3],
      space: i,
      style: ue(t, "line")
    };
  }
  if ("polygon" in t || "polyline" in t) {
    const n = "polygon" in t, o = Tc(n ? t.polygon : t.polyline);
    return o ? { kind: "poly", closed: n, pts: o, space: i, style: ue(t, n ? "body" : "line") } : null;
  }
  if ("path" in t) {
    const n = Cc(t.path);
    return n ? { kind: "path", cmds: n, space: i, style: ue(t, "line") } : null;
  }
  return null;
}
function Oc(e, t, i) {
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
          const o = n.slice(1).map((r, s) => r + (s % 2 === 0 ? t : i));
          return [n[0], ...o];
        })
      };
  }
}
function Pc(e) {
  if (e && typeof e == "object" && "repeat" in e) {
    const i = e, n = K(i.repeat), o = J(i.step, 2), r = dn(i.part);
    if (n === null || !o || !r) return [];
    const s = ge(Math.round(n), 1, Ac);
    return Array.from({ length: s }, (l, a) => Oc(r, o[0] * a, o[1] * a));
  }
  const t = dn(e);
  return t ? [t] : [];
}
function wt(e, t, i) {
  const n = (p) => (i?.push(p), null);
  if (!e || typeof e != "object" || Array.isArray(e))
    return n("A symbol has to be a JSON object.");
  const o = e, r = typeof o.id == "string" && o.id.trim() ? o.id.trim() : t, s = j(r);
  if (!s || s !== r)
    return n('`id` is missing, or uses characters a CSS class cannot: letters, digits, "-" and "_" only.');
  if (!Array.isArray(o.parts)) return n("`parts` has to be an array of shapes.");
  const l = [];
  for (const p of o.parts)
    for (const m of Pc(p)) {
      if (l.length >= Zn) break;
      l.push(m);
    }
  if (!l.length)
    return n(
      "No drawable parts. Each one needs a known shape (line, rect, circle, ellipse, polygon, polyline, path) with the right number of finite numbers."
    );
  const a = o.size && typeof o.size == "object" ? o.size : {}, c = K(a.w), h = K(a.h), d = J(o.viewBox, 4);
  return {
    id: s,
    name: typeof o.name == "string" && o.name.trim() ? o.name.trim().slice(0, 60) : s,
    category: typeof o.category == "string" && Lt.includes(o.category) ? o.category : "other",
    keywords: Array.isArray(o.keywords) ? o.keywords.filter((p) => typeof p == "string").slice(0, 12) : [],
    size: { w: c && c > 0 ? c : 60, h: h && h > 0 ? h : 60 },
    viewBox: d && d[2] > 0 && d[3] > 0 ? d : Sc,
    footprint: o.footprint === "ellipse" ? "ellipse" : "rect",
    parts: l
  };
}
const zc = wt({
  id: "unknown",
  name: "unknown",
  size: { w: 60, h: 60 },
  parts: [{ rect: [0, 0, 100, 100], rx: 6.666667 }]
}), V = (() => {
  const e = /* @__PURE__ */ Object.assign({ "../furniture/airHandler.json": ls, "../furniture/bathtub.json": gs, "../furniture/bed.json": $s, "../furniture/chair.json": Ts, "../furniture/desk.json": Ls, "../furniture/dishwasher.json": Us, "../furniture/dryer.json": Zs, "../furniture/fishTank.json": na, "../furniture/fridge.json": ha, "../furniture/hotTub.json": ya, "../furniture/piano.json": ka, "../furniture/plant.json": Oa, "../furniture/roundTable.json": Na, "../furniture/rug.json": Ka, "../furniture/sectional.json": el, "../furniture/sink.json": al, "../furniture/sofa.json": fl, "../furniture/stairs.json": _l, "../furniture/stove.json": Ml, "../furniture/table.json": Fl, "../furniture/toilet.json": Bl, "../furniture/tv.json": Yl, "../furniture/vanity.json": ic, "../furniture/wardrobe.json": cc, "../furniture/washer.json": mc, "../furniture/waterHeater.json": kc }), t = vt({});
  for (const [i, n] of Object.entries(e)) {
    const o = wt(n, i.split("/").pop()?.replace(/\.json$/, ""));
    o && (t[o.id] = o);
  }
  return t;
})();
function _t(e, t) {
  return ci(e, t);
}
let un, pn = V;
function Dt(e) {
  if (!e || typeof e != "object") return V;
  if (e === un) return pn;
  const t = vt({});
  Object.assign(t, V);
  for (const [i, n] of Object.entries(e)) {
    const o = wt(n, i);
    o && (t[o.id] = o);
  }
  return un = e, pn = t, t;
}
function Fc(e) {
  const t = (i) => {
    const n = Lt.indexOf(i);
    return n < 0 ? Lt.length : n;
  };
  return Object.values(e).sort(
    (i, n) => t(i.category) - t(n.category) || i.name.localeCompare(n.name)
  );
}
function Lc(e, t) {
  const i = t.trim().toLowerCase();
  return i ? e.id.toLowerCase().includes(i) || e.name.toLowerCase().includes(i) || e.category.includes(i) || e.keywords.some((n) => n.toLowerCase().includes(i)) : !0;
}
function Dc(e, t = V) {
  return _t(t, e)?.size ?? { w: 60, h: 60 };
}
function fn(e, t, i, n) {
  const [o, r, s, l] = e.viewBox, a = n === "square" ? Math.min(t, i) : t, c = n === "square" ? Math.min(t, i) : i, h = a / s, d = c / l;
  return {
    x: (p) => (p - o) * h - a / 2,
    y: (p) => (p - r) * d - c / 2,
    len: (p) => p * Math.min(h, d),
    sx: (p) => p * h,
    sy: (p) => p * d
  };
}
const z = (e) => Number.isFinite(e) ? e : 0;
function Hc(e, t) {
  const i = e.fillOpacity > 0 ? t : "none", n = e.role === "solid" ? "none" : t;
  return { fill: i, stroke: n, style: e };
}
function Rc(e, t, i) {
  const { fill: n, stroke: o, style: r } = Hc(e.style, i), s = r.opacity < 1 ? r.opacity : f, l = r.dash?.length ? r.dash.join(" ") : f, a = r.fillOpacity > 0 && r.fillOpacity < 1 ? r.fillOpacity : f, c = r.role === "solid" ? f : r.width;
  switch (e.kind) {
    case "line":
      return b`<line x1=${z(t.x(e.a[0]))} y1=${z(t.y(e.a[1]))}
                       x2=${z(t.x(e.b[0]))} y2=${z(t.y(e.b[1]))}
                       fill="none" stroke=${o} stroke-width=${c}
                       stroke-dasharray=${l} opacity=${s} />`;
    case "rect":
      return b`<rect x=${z(t.x(e.x))} y=${z(t.y(e.y))}
                       width=${z(t.sx(e.w))} height=${z(t.sy(e.h))}
                       rx=${e.rx > 0 ? z(t.len(e.rx)) : f}
                       fill=${n} fill-opacity=${a}
                       stroke=${o} stroke-width=${c}
                       stroke-dasharray=${l} opacity=${s} />`;
    case "circle":
      return b`<circle cx=${z(t.x(e.cx))} cy=${z(t.y(e.cy))} r=${z(t.len(e.r))}
                         fill=${n} fill-opacity=${a}
                         stroke=${o} stroke-width=${c} opacity=${s} />`;
    case "ellipse":
      return b`<ellipse cx=${z(t.x(e.cx))} cy=${z(t.y(e.cy))}
                          rx=${z(t.sx(e.rx))} ry=${z(t.sy(e.ry))}
                          fill=${n} fill-opacity=${a}
                          stroke=${o} stroke-width=${c} opacity=${s} />`;
    case "poly": {
      const h = e.pts.map(([d, p]) => `${z(t.x(d))},${z(t.y(p))}`).join(" ");
      return e.closed ? b`<polygon points=${h}
                       fill=${n} fill-opacity=${a}
                       stroke=${o} stroke-width=${c}
                       stroke-linejoin="round" opacity=${s} />` : b`<polyline points=${h} fill="none"
                        stroke=${o} stroke-width=${c}
                        stroke-linejoin="round" opacity=${s} />`;
    }
    case "path": {
      const h = e.cmds.map(
        (d) => d[0] === "Z" ? "Z" : `${d[0]} ${d.slice(1).map((p, m) => m % 2 === 0 ? z(t.x(p)) : z(t.y(p))).join(" ")}`
      ).join(" ");
      return b`<path d=${h}
                       fill=${n} fill-opacity=${a}
                       stroke=${o} stroke-width=${c}
                       stroke-linejoin="round" opacity=${s} />`;
    }
  }
}
function Nc(e, t, i, n) {
  const o = fn(e, t, i, "box"), r = fn(e, t, i, "square");
  return e.parts.map((s) => Rc(s, s.space === "square" ? r : o, n));
}
const jc = /* @__PURE__ */ new Set(["light", "switch", "fan", "input_boolean"]);
function Xn(e) {
  const t = e?.split(".")[0] ?? "";
  return jc.has(t) ? { action: "toggle" } : { action: "more-info" };
}
function Y(e) {
  return e !== void 0 && e.action !== "none";
}
function Qn(e, t) {
  return t === "tap" ? e.tap_action ?? Xn(e.entity) : t === "hold" ? e.hold_action : e.double_tap_action;
}
function Bc(e, t) {
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
      return Jn(t) !== null;
    case "fire-dom-event":
      return !0;
    default:
      return !1;
  }
}
function Uc(e) {
  return ["tap", "hold", "double_tap"].some(
    (t) => Bc(e, Qn(e, t))
  );
}
function Jn(e) {
  const t = e.perform_action ?? e.service;
  if (!t || !t.includes(".")) return null;
  const [i, n] = t.split(".", 2);
  return { domain: i, service: n, data: e.data ?? e.service_data, target: e.target };
}
function Me(e, t, i, n) {
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
        const o = Jn(n);
        o && t.callService(o.domain, o.service, o.data, o.target);
        break;
      }
      case "fire-dom-event":
        e.dispatchEvent(new CustomEvent("ll-custom", { detail: n, bubbles: !0, composed: !0 }));
        break;
    }
  }
}
const $t = "default", eo = 10, at = [
  {
    id: $t,
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
], xt = "var(--fp-skin-bg, var(--card-background-color, #fff))", hi = "var(--fp-skin-wall, var(--primary-text-color))", to = "var(--fp-skin-text, var(--primary-text-color))", R = "var(--fp-skin-accent, var(--primary-color, #03a9f4))";
function di(e) {
  if (typeof e == "string")
    return at.find((t) => t.id === e);
}
function Wc(e) {
  const t = di(e);
  return t ? Object.entries(t.vars).map(([i, n]) => `${i}:${n};`).join("") : "";
}
function Gc(e) {
  const t = di(e);
  return t && t.id !== $t ? t.id : void 0;
}
const qc = Dn(
  at.filter((e) => e.id !== $t).map(
    (e) => `:host([data-skin="${e.id}"]){` + Object.entries(e.vars).map(([t, i]) => `${t}:${i};`).join("") + "}"
  ).join(`
`)
), io = Yt`
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
`, Kc = 0.75, lt = 8, Vc = 400;
function Ct(e, t) {
  return typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t;
}
function Yc(e) {
  let t = 0;
  for (let i = 0, n = e.length - 1; i < e.length; n = i++)
    t += e[n].x * e[i].y - e[i].x * e[n].y;
  return t / 2;
}
function Zc(e, t, i, n) {
  const o = n.x - i.x, r = n.y - i.y, s = o * o + r * r;
  if (s === 0) return Math.hypot(e - i.x, t - i.y);
  let l = ((e - i.x) * o + (t - i.y) * r) / s;
  return l = Math.max(0, Math.min(1, l)), Math.hypot(e - (i.x + l * o), t - (i.y + l * r));
}
function Xc(e, t) {
  const i = [];
  for (let n = 0; n < e.length; n++) {
    const o = e[n], r = o.b.x - o.a.x, s = o.b.y - o.a.y, l = Math.hypot(r, s);
    if (l <= t) continue;
    const a = [0, 1], c = t / l;
    for (let h = 0; h < e.length; h++) {
      if (h === n) continue;
      const d = e[h], p = d.b.x - d.a.x, m = d.b.y - d.a.y, v = r * m - s * p;
      if (Math.abs(v) > 1e-9) {
        const y = ((d.a.x - o.a.x) * m - (d.a.y - o.a.y) * p) / v, w = ((d.a.x - o.a.x) * s - (d.a.y - o.a.y) * r) / v, u = t / Math.max(Math.hypot(p, m), 1e-9);
        y > c && y < 1 - c && w >= -u && w <= 1 + u && a.push(y);
        continue;
      }
      for (const y of [d.a, d.b]) {
        const w = ((y.x - o.a.x) * r + (y.y - o.a.y) * s) / (l * l);
        if (w <= c || w >= 1 - c) continue;
        const u = o.a.x + w * r, _ = o.a.y + w * s;
        Math.hypot(y.x - u, y.y - _) <= t && a.push(w);
      }
    }
    a.sort((h, d) => h - d);
    for (let h = 1; h < a.length; h++) {
      const d = a[h - 1], p = a[h];
      p - d <= c || i.push({
        a: { x: o.a.x + d * r, y: o.a.y + d * s },
        b: { x: o.a.x + p * r, y: o.a.y + p * s }
      });
    }
  }
  return i;
}
function Qc(e, t) {
  const i = [], n = /* @__PURE__ */ new Map(), o = (c) => Math.floor(c / t), r = (c) => {
    const h = o(c.x), d = o(c.y);
    for (let y = -1; y <= 1; y++)
      for (let w = -1; w <= 1; w++)
        for (const u of n.get(`${h + y}:${d + w}`) ?? [])
          if (Math.hypot(i[u].x - c.x, i[u].y - c.y) <= t) return u;
    const p = i.push({ x: c.x, y: c.y }) - 1, m = `${h}:${d}`, v = n.get(m);
    return v ? v.push(p) : n.set(m, [p]), p;
  }, s = /* @__PURE__ */ new Map(), l = (c) => {
    let h = s.get(c);
    return h || s.set(c, h = /* @__PURE__ */ new Set()), h;
  };
  for (const c of e) {
    const h = r(c.a), d = r(c.b);
    h !== d && (l(h).add(d), l(d).add(h));
  }
  const a = i.map(
    (c, h) => [...s.get(h) ?? []].sort(
      (d, p) => Math.atan2(i[d].y - c.y, i[d].x - c.x) - Math.atan2(i[p].y - c.y, i[p].x - c.x)
    )
  );
  return { points: i, neighbors: a };
}
function Jc(e, t) {
  const { points: i, neighbors: n } = Qc(e, t), o = /* @__PURE__ */ new Set(), r = [];
  for (let s = 0; s < i.length; s++)
    for (const l of n[s]) {
      if (o.has(`${s}>${l}`)) continue;
      const a = [];
      let c = s, h = l, d = !1;
      for (let p = 0; p <= i.length * i.length + 4; p++) {
        o.add(`${c}>${h}`), a.push(c);
        const m = n[h], v = m.indexOf(c), y = m[(v - 1 + m.length) % m.length];
        if (c = h, h = y, c === s && h === l) {
          d = !0;
          break;
        }
      }
      d && a.length >= 3 && r.push(a.map((p) => ({ x: i[p].x, y: i[p].y })));
    }
  return r;
}
function eh(e, t, i) {
  for (let n = 0, o = e.length - 1; n < e.length; o = n++)
    for (const r of t)
      if (Zc(r.x, r.y, e[o], e[n]) <= i) return !0;
  return !1;
}
function th(e, t, i = {}) {
  const n = Ct(i.weldEps, Kc), o = Ct(i.openingEps, lt), r = Ct(i.minArea, Vc);
  if (e.length < 3) return [];
  const s = Xc(
    e.map((a) => ({ a: { x: a.x1, y: a.y1 }, b: { x: a.x2, y: a.y2 } })),
    n
  );
  return Jc(s, n).map((a) => ({ ring: a, area: Yc(a) })).filter((a) => a.area >= r && !eh(a.ring, t, o)).sort((a, c) => c.area - a.area).map((a) => a.ring);
}
const gn = /* @__PURE__ */ new WeakMap();
function no(e, t) {
  const i = gn.get(e);
  if (i && i.openings === t) return i.out;
  const n = th(e, t);
  return gn.set(e, { openings: t, out: n }), n;
}
const F = 8, Fe = "—";
function je(e, t) {
  if (!t || !e) return Fe;
  const i = e.states[t];
  return i ? e.formatEntityState(i) : Fe;
}
function oo(e, t, i) {
  if (e.formatEntityState !== t.formatEntityState) return !0;
  for (const n of i)
    if (e.states[n] !== t.states[n]) return !0;
  return !1;
}
function Ce(e) {
  const t = /* @__PURE__ */ new Set();
  (e.sunDimming || e.sunlight && !At(e)) && t.add("sun.sun");
  for (const i of rt(e)) {
    for (const n of i.openings)
      n.entity && t.add(n.entity), n.shutterEntity && t.add(n.shutterEntity), n.secondaryEntity && t.add(n.secondaryEntity), n.shutterSecondaryEntity && t.add(n.shutterSecondaryEntity);
    for (const n of i.items) {
      n.entity && t.add(n.entity), n.hideEntity && t.add(n.hideEntity), n.hideStateEntity && t.add(n.hideStateEntity), n.hideBadgeEntity && t.add(n.hideBadgeEntity);
      for (const o of he(n)) o.entity && t.add(o.entity);
    }
    for (const n of i.texts)
      n.entity && t.add(n.entity);
    for (const n of i.furniture)
      n.entity && t.add(n.entity);
    for (const n of i.areas)
      n.entity && t.add(n.entity);
    for (const n of i.trackers)
      for (const o of [n.xSensor, n.ySensor])
        o?.entity && t.add(o.entity), o?.presence?.entity && t.add(o.presence.entity);
  }
  return t;
}
function ui(e, t, i) {
  if (!t || !e) return Fe;
  const n = e.states[t];
  if (!n) return Fe;
  const o = e.formatEntityAttributeValue;
  if (typeof o == "function") return o(n, i);
  const r = n.attributes?.[i];
  return r == null || r === "" ? Fe : String(r);
}
function ih(e, t, i) {
  const n = i.entity || (i.attribute ? t.entity : void 0);
  return n ? i.attribute ? ui(e, n, i.attribute) : je(e, n) : "";
}
function he(e) {
  return [...e.secondaryEntity || e.secondaryAttribute ? [{ entity: e.secondaryEntity, attribute: e.secondaryAttribute }] : [], ...e.readings ?? []];
}
function nh(e, t) {
  return t.attribute ? ui(e, t.entity, t.attribute) : je(e, t.entity);
}
function pi(e, t) {
  if (!t.entity) return t.text ?? "";
  const i = t.attribute ? ui(e, t.entity, t.attribute) : je(e, t.entity);
  return t.text ? `${t.text} ${i}` : i;
}
function kt(e, t) {
  return ro(e, t)?.color;
}
function ro(e, t) {
  if (!e?.length) return;
  const i = typeof t == "number" ? t : Number(t), n = typeof t != "boolean" && t !== "" && t != null && Number.isFinite(i), o = t == null ? "" : String(t).trim().toLowerCase();
  let r, s, l;
  for (const a of e)
    !a || typeof a != "object" || typeof a.color != "string" || (typeof a.state == "string" && a.state !== "" ? r === void 0 && o !== "" && a.state.trim().toLowerCase() === o && (r = a) : typeof a.above == "number" ? n && i > a.above && (!s || a.above > (s.above ?? -1 / 0)) && (s = a) : l === void 0 && (l = a));
  return r ?? s ?? l;
}
function oh(e, t) {
  if (!e.entity) return;
  const i = kt(e.stateColor, t);
  if (i) return H(i);
  if (e.activeColor && ie(e.entity, t)) return H(e.activeColor);
}
function mn(e, t) {
  if (!e.entity) return;
  const i = kt(e.stateColor, t);
  if (i) return H(i);
  if (e.activeColor && ie(e.entity, t)) return H(e.activeColor);
}
function fi(e, t) {
  if (!t || t.state !== "on") return;
  const i = t.attributes ?? {}, n = i.brightness, o = typeof n == "number" && Number.isFinite(n) ? Math.max(0, Math.min(255, n)) : void 0, r = o === void 0 ? nt : tn + (nt - tn) * (o / 255), s = T(e.glowRadius, yt) * (o === void 0 ? 1 : nn + (1 - nn) * (o / 255)), l = i.rgb_color;
  if (Array.isArray(l) && l.length >= 3) {
    const [a, c, h] = l;
    if ([a, c, h].every((d) => typeof d == "number" && Number.isFinite(d))) {
      const d = (m) => Math.max(0, Math.min(255, Math.round(m))), p = H(`rgb(${d(a)}, ${d(c)}, ${d(h)})`);
      if (p) return { color: p, opacity: r, radius: s };
    }
  }
  return { color: N(e.glowColor, Yn), opacity: r, radius: s };
}
function so(e) {
  if (!e || e.state !== "on") return;
  const t = e.attributes ?? {}, i = t.rgb_color;
  if (!Array.isArray(i) || i.length < 3) return;
  const [n, o, r] = i;
  if (![n, o, r].every((h) => typeof h == "number" && Number.isFinite(h))) return;
  const s = t.brightness, l = typeof s == "number" && Number.isFinite(s) ? Math.max(0, Math.min(255, s)) : void 0, a = l === void 0 ? 1 : on + (1 - on) * (l / 255), c = (h) => Math.max(0, Math.min(255, Math.round(h * a)));
  return H(`rgb(${c(n)}, ${c(o)}, ${c(r)})`);
}
function rh(e, t) {
  return t ? fi(e, t) : {
    color: N(e.glowColor, Yn),
    opacity: nt,
    radius: T(e.glowRadius, yt)
  };
}
function gi(e, t, i) {
  const n = i.x2 - i.x1, o = i.y2 - i.y1, r = n * n + o * o, s = r === 0 ? 0 : Math.max(0, Math.min(1, ((e - i.x1) * n + (t - i.y1) * o) / r)), l = i.x1 + s * n, a = i.y1 + s * o;
  return Math.hypot(e - l, t - a);
}
function mi(e, t, i, n, o) {
  const r = o.x2 - o.x1, s = o.y2 - o.y1, l = i * s - n * r;
  if (Math.abs(l) < 1e-12) return;
  const a = o.x1 - e, c = o.y1 - t, h = (a * s - c * r) / l, d = (a * n - c * i) / l;
  if (!(h <= 1e-9 || d < 0 || d > 1))
    return h;
}
function sh(e, t, i, n, o) {
  const r = e.x2 - e.x1, s = e.y2 - e.y1, l = [-r, r, -s, s], a = [e.x1 - t, n - e.x1, e.y1 - i, o - e.y1];
  let c = 0, h = 1;
  for (let d = 0; d < 4; d++) {
    if (l[d] === 0) {
      if (a[d] < 0) return;
      continue;
    }
    const p = a[d] / l[d];
    if (l[d] < 0) {
      if (p > h) return;
      p > c && (c = p);
    } else {
      if (p < c) return;
      p < h && (h = p);
    }
  }
  return {
    ...e,
    x1: e.x1 + c * r,
    y1: e.y1 + c * s,
    x2: e.x1 + h * r,
    y2: e.y1 + h * s
  };
}
function ao(e, t, i) {
  const n = Math.max(0, Math.min(1, t)), o = Math.max(0, Math.min(1, i ?? t));
  if (B(e) === "swing")
    return xe(e) === "double" ? (n + o) / 2 : n;
  switch (St(e)) {
    case "biparting":
      return (n + o) / 2;
    case "biparting-bypass":
    case "converging":
      return (n + o) / 4;
    default:
      return n;
  }
}
function lo(e, t, i, n) {
  return n !== void 0 && n <= 0 ? [0, 0] : Ei(e) && B(e) !== "roll" ? [0, 1] : ah(e, t, i);
}
function ah(e, t, i) {
  const n = ao(e, t, i), o = [(1 - n) / 2, (1 + n) / 2];
  if (B(e) !== "swing" || xe(e) !== "double") return o;
  const r = Math.max(0, Math.min(1, t)), s = Math.max(0, Math.min(1, i ?? t)), l = [0.5 - r / 2, 0.5 + s / 2];
  return e.flipH ? [1 - l[1], 1 - l[0]] : l;
}
function yi(e, t, i) {
  const n = [];
  for (const r of t) {
    const s = i(r), l = (c) => Math.max(0, Math.min(1, c)), a = typeof s == "number" ? [(1 - l(s)) / 2, (1 + l(s)) / 2] : [l(Math.min(s[0], s[1])), l(Math.max(s[0], s[1]))];
    a[1] > a[0] && n.push({ o: r, span: a });
  }
  if (!n.length) return e;
  const o = [];
  for (const r of e) {
    const s = r.x2 - r.x1, l = r.y2 - r.y1, a = s * s + l * l;
    if (a === 0) {
      o.push(r);
      continue;
    }
    const c = Math.sqrt(a), h = [];
    for (const { o: w, span: u } of n) {
      if (gi(w.x, w.y, r) > lt) continue;
      const _ = ((w.x - r.x1) * s + (w.y - r.y1) * l) / a, x = Math.cos(w.angle * Math.PI / 180) * s + Math.sin(w.angle * Math.PI / 180) * l >= 0 ? 1 : -1, A = (Ge) => x * (Ge - 0.5) * w.length / c, E = _ + A(u[0]), P = _ + A(u[1]), L = Math.max(0, Math.min(E, P)), U = Math.min(1, Math.max(E, P));
      U > L && h.push([L, U]);
    }
    if (!h.length) {
      o.push(r);
      continue;
    }
    h.sort((w, u) => w[0] - u[0]);
    const d = [h[0]];
    for (const w of h.slice(1)) {
      const u = d[d.length - 1];
      w[0] <= u[1] ? u[1] = Math.max(u[1], w[1]) : d.push(w);
    }
    const p = (w) => ({ x: r.x1 + s * w, y: r.y1 + l * w });
    let m = 0, v = 0;
    const y = (w, u) => {
      if ((u - w) * c < F / 2) return;
      const _ = p(w), x = p(u);
      o.push({ id: `${r.id}#${v++}`, x1: _.x, y1: _.y, x2: x.x, y2: x.y });
    };
    for (const [w, u] of d)
      y(m, w), m = u;
    y(m, 1);
  }
  return o;
}
function co(e, t, i, n) {
  const o = n.filter((d) => {
    const p = gi(e, t, d);
    return p < i && p > F;
  });
  if (!o.length) return;
  const r = i * 1.01, s = [
    { id: "b1", x1: e - r, y1: t - r, x2: e + r, y2: t - r },
    { id: "b2", x1: e + r, y1: t - r, x2: e + r, y2: t + r },
    { id: "b3", x1: e + r, y1: t + r, x2: e - r, y2: t + r },
    { id: "b4", x1: e - r, y1: t + r, x2: e - r, y2: t - r }
  ], l = o.map((d) => sh(d, e - r, t - r, e + r, t + r)).filter((d) => d !== void 0);
  if (!l.length) return;
  const a = [...l, ...s], c = [];
  for (const d of a)
    for (const [p, m] of [
      [d.x1, d.y1],
      [d.x2, d.y2]
    ]) {
      const v = Math.atan2(m - t, p - e);
      for (const y of [v - 1e-4, v, v + 1e-4]) {
        const w = Math.cos(y), u = Math.sin(y);
        let _ = 1 / 0;
        for (const x of a) {
          const A = mi(e, t, w, u, x);
          A !== void 0 && A < _ && (_ = A);
        }
        _ < 1 / 0 && c.push({ x: e + w * _, y: t + u * _, a: y });
      }
    }
  c.sort((d, p) => d.a - p.a);
  const h = (d) => Math.round(d * 100) / 100;
  return c.map(({ x: d, y: p }) => ({ x: h(d), y: h(p) }));
}
function ho(e, t, i, n) {
  const o = t.radius, r = n?.length ? co(e.x, e.y, o, n) : void 0, s = `${i}-clip`;
  return b`
    ${r ? b`<clipPath id=${s}>
                <polygon points=${r.map((l) => `${l.x},${l.y}`).join(" ")} />
              </clipPath>` : f}
    <radialGradient id=${i} gradientUnits="userSpaceOnUse"
                    cx=${e.x} cy=${e.y} r=${o}>
      <stop offset="0" stop-color=${t.color} stop-opacity=${t.opacity} />
      <stop offset="1" stop-color=${t.color} stop-opacity="0" />
    </radialGradient>
    <circle class="fp-glow" cx=${e.x} cy=${e.y} r=${o}
            fill=${`url(#${i})`}
            clip-path=${r ? `url(#${s})` : f} />`;
}
function lh(e, t, i, n, o, r) {
  const s = e.map((a) => {
    if (!a.glow) return;
    const c = fi(a, t?.[a.entity]);
    if (c)
      return {
        // Normalized against the glow's own ceiling, so a full-brightness lamp
        // clears the dim entirely and a dim one clears proportionally.
        strength: Math.max(0, Math.min(1, c.opacity / nt)),
        // Straight off the paint, so the clearing tracks the pool as it shrinks
        // with brightness (issue #123) instead of staying at the configured size.
        radius: c.radius
      };
  });
  if (!s.some((a) => a !== void 0)) return f;
  const l = F;
  return b`
    <defs>
      <mask id=${o} maskUnits="userSpaceOnUse"
            x=${-l} y=${-l} width=${i + l * 2} height=${n + l * 2}>
        <rect x=${-l} y=${-l} width=${i + l * 2} height=${n + l * 2}
              fill="white" />
        ${e.map((a, c) => {
    const h = s[c];
    if (h === void 0) return f;
    const { strength: d, radius: p } = h, m = `${o}-${c}`, v = r?.length ? co(a.x, a.y, p, r) : void 0, y = `${m}-clip`;
    return b`
            ${v ? b`<clipPath id=${y}>
                        <polygon points=${v.map((w) => `${w.x},${w.y}`).join(" ")} />
                      </clipPath>` : f}
            <radialGradient id=${m} gradientUnits="userSpaceOnUse"
                            cx=${a.x} cy=${a.y} r=${p}>
              <stop offset="0" stop-color="#000" stop-opacity=${d} />
              <stop offset="1" stop-color="#000" stop-opacity="0" />
            </radialGradient>
            <circle cx=${a.x} cy=${a.y} r=${p} fill=${`url(#${m})`}
                    clip-path=${v ? `url(#${y})` : f} />`;
  })}
      </mask>
    </defs>`;
}
function uo(e, t, i, n, o = V) {
  const r = F;
  return b`
    <defs>
      <mask id=${n} maskUnits="userSpaceOnUse"
            x=${-r} y=${-r} width=${t + r * 2} height=${i + r * 2}>
        <rect x=${-r} y=${-r} width=${t + r * 2} height=${i + r * 2}
              fill="white" />
        ${e.map((s) => {
    const l = s.angle ? `rotate(${s.angle} ${s.x} ${s.y})` : void 0, a = _t(o, s.type)?.footprint === "ellipse", c = 1 - Ur;
    return a ? b`<ellipse cx=${s.x} cy=${s.y} rx=${s.w / 2} ry=${s.h / 2}
                           fill="#000" fill-opacity=${c} transform=${l ?? f} />` : b`<rect x=${s.x - s.w / 2} y=${s.y - s.h / 2} width=${s.w} height=${s.h}
                        fill="#000" fill-opacity=${c} transform=${l ?? f} />`;
  })}
      </mask>
    </defs>`;
}
function po(e, t, i) {
  if (e.enableHideByEntity) {
    const n = e.hideEntity || e.entity;
    let o = t;
    return n && i && i.states[n] && (o = e.hideAttribute ? i.states[n].attributes[e.hideAttribute] : i.states[n].state), bi(
      o,
      e.hideMode,
      e.hideState,
      e.hideOperator,
      e.hideThreshold,
      e.hideInvert
    );
  }
  return e.hideWhenInactive ? e.entity ? !ie(e.entity, t) : !0 : !1;
}
function ch(e, t, i) {
  if (!e.enableHideBadgeByEntity) return !1;
  let n = t;
  if (i) {
    const o = e.hideBadgeEntity || e.entity;
    o && i.states[o] && (n = e.hideBadgeAttribute && i.states[o].attributes ? String(i.states[o].attributes[e.hideBadgeAttribute]) : i.states[o].state);
  }
  return bi(
    n,
    e.hideBadgeMode,
    e.hideBadgeMatch,
    // Ensure this property is correctly mapped in your types, or use hideBadgeState
    e.hideBadgeOperator,
    e.hideBadgeThreshold,
    e.hideBadgeInvert
  );
}
const fo = 12;
function go(e, t) {
  const i = [];
  if (t.showName) {
    const o = t.entity ? e?.states[t.entity]?.attributes?.friendly_name : void 0, r = t.name || o || t.entity;
    r && i.push(r);
  }
  let n = !1;
  if (t.enableHideStateByEntity && e) {
    const o = t.hideStateEntity || t.entity;
    let r;
    o && e.states[o] && (r = t.hideStateAttribute && e.states[o].attributes ? e.states[o].attributes[t.hideStateAttribute] : e.states[o].state), n = bi(
      r,
      t.hideStateMode,
      t.hideStateMatch,
      t.hideStateOperator,
      t.hideStateThreshold,
      t.hideStateInvert
    );
  }
  if (t.entity && (t.showState ?? t.kind === "sensor") && !n && i.push(nh(e, t)), !n)
    for (const o of he(t)) {
      if (o.showState === !1) continue;
      const r = ih(e, t, o);
      r && i.push(r);
    }
  return i.join(" · ");
}
const yn = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function bi(e, t = "state", i, n = "==", o, r = !1) {
  if (e == null || e === "") return !1;
  let s = !1;
  if (t === "threshold") {
    if (o == null) return !1;
    const l = Number(e);
    if (!Number.isFinite(l)) return !1;
    switch (n) {
      case "<":
        s = l < o;
        break;
      case "<=":
        s = l <= o;
        break;
      case "==":
        s = l === o;
        break;
      case "!=":
        s = l !== o;
        break;
      case ">=":
        s = l >= o;
        break;
      case ">":
        s = l > o;
        break;
      default:
        return !1;
    }
  } else {
    if (i == null || String(i).trim() === "") return !1;
    const l = String(e).trim().toLowerCase(), a = String(i).trim().toLowerCase();
    if (yn.has(l) && !yn.has(a))
      return !1;
    s = n === "!=" ? l !== a : l === a;
  }
  return r ? !s : s;
}
function hh(e) {
  return e.showName || (e.showState ?? e.kind === "sensor") ? !0 : he(e).some((t) => t.showState !== !1 && (t.entity || t.attribute));
}
function vi(e) {
  const t = e.labelPosition;
  return t === "left" || t === "right" ? t : "below";
}
function dh(e, t) {
  const i = go(e, t);
  return i ? { text: i, live: !0 } : { text: t.name || t.entity || t.kind, live: !1 };
}
function mo(e) {
  return Math.min(40, Math.max(8, T(e, fo)));
}
function uh(e) {
  return Math.min(40, Math.max(8, T(e, si)));
}
function ph(e) {
  return Math.min(eo, Math.max(2, T(e, F)));
}
function yo(e) {
  return e === void 0 ? "" : `stroke-width:${ph(e)};`;
}
function wi(e) {
  return e === "plan" ? "plan" : "fixed";
}
function C(e, t) {
  return t === "plan" ? `calc(${e} * var(--fp-u, 1px))` : `${e}px`;
}
function fh(e, t) {
  return t !== "plan" && e === void 0 ? "" : `font-size:${C(uh(e), t)};`;
}
function bn(e) {
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
const gh = {
  media_player: { on: "mdi:television-play", off: "mdi:television-off" },
  fan: { on: "mdi:fan", off: "mdi:fan-off" },
  lock: { on: "mdi:lock-open-variant", off: "mdi:lock" },
  camera: { on: "mdi:cctv", off: "mdi:cctv-off" },
  humidifier: { on: "mdi:air-humidifier", off: "mdi:air-humidifier-off" },
  vacuum: { on: "mdi:robot-vacuum", off: "mdi:robot-vacuum-variant" }
}, mh = {
  paused: "mdi:television-pause",
  idle: "mdi:television"
}, yh = {
  off: "mdi:power",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  heat_cool: "mdi:sun-snowflake-variant",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan"
}, bh = {
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
}, vh = {
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
}, wh = {
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
}, _h = {
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
function $h(e) {
  return e === "on" || e === "open" || e === "home" || e === "playing";
}
const xh = {
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
function ie(e, t) {
  if (!t || t === "unavailable" || t === "unknown") return !1;
  const i = e?.split(".")[0] ?? "", n = xh[i];
  return n ? n.has(t) : $h(t);
}
const kh = {
  fan: "spin",
  media_player: "pulse",
  vacuum: "pulse"
};
function bo(e) {
  return kh[e?.split(".")[0] ?? ""];
}
function vo(e, t) {
  const i = e.iconAnimation ?? "auto";
  if (i !== "none" && ie(e.entity, t))
    return e.entity?.split(".")[0] === "climate" && t === "fan_only" ? "spin" : i === "spin" || i === "pulse" ? i : bo(e.entity);
}
const Sh = /* @__PURE__ */ new Set(["motion", "occupancy", "presence", "vibration"]);
function wo(e, t) {
  const i = e?.split(".")[0];
  return i === "device_tracker" || i === "person" ? !0 : i === "binary_sensor" && !!t && Sh.has(t);
}
function _o(e, t, i, n) {
  const o = e.split(".")[0];
  if (o === "climate")
    return yh[n ?? ""] ?? (i ? "mdi:thermostat" : "mdi:power");
  if (o === "weather") return bh[n ?? ""] ?? "mdi:weather-cloudy";
  if (o === "media_player" && n) {
    const s = mh[n];
    if (s) return s;
  }
  const r = gh[o];
  if (r) return i ? r.on : r.off;
  if (t) {
    if (o === "binary_sensor") {
      const s = vh[t];
      return s ? i ? s.on : s.off : void 0;
    }
    if (o === "sensor") return wh[t];
    if (o === "cover") {
      const s = _h[t];
      return s ? i ? s.on : s.off : void 0;
    }
  }
}
function _i(e, t) {
  if (t)
    return e.attribute ? t.attributes?.[e.attribute] : t.state;
}
function Ht(e, t, i) {
  const n = Pe(ro(e.stateColor, _i(e, t))?.icon);
  if (n) return n;
  const o = Pe(e.icon);
  if (o) return o;
  if (!e.entity) return bn(e.kind);
  if (i) return i;
  const r = t?.attributes?.icon;
  return r || (_o(
    e.entity,
    t?.attributes?.device_class,
    ie(e.entity, t?.state),
    t?.state
  ) ?? bn(e.kind));
}
function $o(e) {
  const t = Math.round(e);
  let i = Math.round(t * 0.62);
  return i % 2 !== t % 2 && (i += 1), Math.max(2, i);
}
function Be(e) {
  return e.badgeContent === "icon" || e.badgeContent === "value" || e.badgeContent === "none" ? e.badgeContent : e.showIcon === !1 ? "none" : "icon";
}
function Ye(e) {
  const t = e.pressEffect;
  return t === "scale" || t === "ripple" || t === "flash" || t === "none" ? t : Kn;
}
function Ah(e, t, i) {
  if (e.goToFloor !== "up" && e.goToFloor !== "down") return;
  const n = t.findIndex((r) => r.id === i);
  return n < 0 ? void 0 : t[n + (e.goToFloor === "up" ? 1 : -1)]?.id;
}
function xo(e) {
  const t = e.offlineStyle;
  return t === "dim" || t === "strike" || t === "none" ? t : Vn;
}
function Eh(e, t) {
  return e.entity ? t === void 0 || Se(t) : !1;
}
const Mh = {
  climate: { attribute: "current_temperature", unit: "°" },
  water_heater: { attribute: "current_temperature", unit: "°" },
  humidifier: { attribute: "current_humidity", unit: "%" }
};
function Te(e) {
  if (e == null || typeof e == "boolean" || typeof e == "string" && e.trim() === "") return;
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : void 0;
}
function Th(e) {
  if (typeof e != "string") return "";
  const t = e.trim();
  return t === "°C" || t === "°F" || t === "K" ? "°" : t === "ppm" || t === "ppb" ? "" : t.length <= 3 ? t : "";
}
function Ze(e) {
  return Math.abs(e) < 10 && !Number.isInteger(e) ? e.toFixed(1) : String(Math.round(e));
}
function Ih(e, t) {
  return t === "W" && Math.abs(e) >= 1e3 ? { n: e / 1e3, unit: "kW" } : { n: e, unit: t };
}
function vn(e, t) {
  const i = Ih(e, Th(t));
  return Ze(i.n) + i.unit;
}
function ko(e, t) {
  return Ao(e, t)?.text;
}
function So(e) {
  return e === "primary" ? "primary" : e === "secondary" ? 0 : typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : void 0;
}
function Ao(e, t) {
  if (!e || !t.entity) return;
  const i = he(t), n = () => {
    const l = e.states[t.entity], a = l?.attributes, c = Mh[t.entity.split(".")[0]];
    if (t.attribute) {
      const d = Te(a?.[t.attribute]);
      if (d !== void 0)
        return Ze(d) + (t.attribute === c?.attribute ? c.unit : "");
    }
    if (c) {
      const d = Te(a?.[c.attribute]);
      if (d !== void 0) return Ze(d) + c.unit;
    }
    const h = Te(l?.state);
    return h === void 0 ? void 0 : vn(h, a?.unit_of_measurement);
  }, o = (l) => {
    const a = i[l];
    if (!a) return;
    const c = a.entity || (a.attribute ? t.entity : void 0);
    if (!c) return;
    const h = e.states[c], d = h?.attributes;
    if (a.attribute) {
      const m = Te(d?.[a.attribute]);
      return m === void 0 ? void 0 : Ze(m);
    }
    const p = Te(h?.state);
    return p === void 0 ? void 0 : vn(p, d?.unit_of_measurement);
  }, r = So(t.badgeEntity);
  if (r === "primary") {
    const l = n();
    return l === void 0 ? void 0 : { text: l, source: "primary" };
  }
  if (typeof r == "number") {
    const l = o(r);
    return l === void 0 ? void 0 : { text: l, source: r };
  }
  const s = n();
  if (s !== void 0) return { text: s, source: "primary" };
  for (let l = 0; l < i.length; l++) {
    const a = o(l);
    if (a !== void 0) return { text: a, source: l };
  }
}
const Ch = { ".": 0.28, "-": 0.38, "°": 0.45, "%": 1, k: 0.58 }, Oh = 0.7, Ph = 0.85;
function wn(e) {
  let t = 0;
  for (const i of e)
    t += Ch[i] ?? (i >= "0" && i <= "9" ? Oh : Ph);
  return t;
}
function Eo(e, t) {
  const i = Math.round(T(e, le)), n = Math.max(0, i - 6), o = wn(t) > 0 ? n / wn(t) : i;
  let r = Math.round(Math.min(i * 0.46, o));
  return r % 2 !== i % 2 && (r -= 1), Math.max(6, r);
}
function _n(e) {
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
function B(e) {
  return e.motion ?? "swing";
}
function $i(e) {
  const t = e.type === "door" && B(e) === "swing";
  return e.invert ? !t : t;
}
function zh(e) {
  return { sx: e.flipH ? -1 : 1, sy: e.flipV ? -1 : 1 };
}
function St(e) {
  return B(e) === "slide" ? e.sliderStyle ?? "single" : "single";
}
function Mo(e) {
  return e === "biparting" || e === "biparting-bypass" || e === "converging";
}
function Le(e) {
  return B(e) === "swing" ? xe(e) === "double" : Mo(St(e));
}
function To(e) {
  return { ...e, entity: e.secondaryEntity };
}
function Rt(e) {
  return e === "window" ? "double" : "single";
}
function xe(e) {
  return B(e) === "swing" ? e.sash ?? Rt(e.type) : Rt(e.type);
}
function we(e) {
  return e.shutterStyle === "roll" || e.shutterStyle === "swing" ? e.shutterStyle : e.shutterEntity?.split(".")[0] === "binary_sensor" ? "swing" : "roll";
}
function Q(e, t = !1) {
  if (!e || Se(e.state)) return 0;
  const i = e.attributes?.current_position;
  if (typeof i == "number" && Number.isFinite(i)) {
    const o = Math.max(0, Math.min(1, i / 100));
    return t ? 1 - o : o;
  }
  const n = e.state === "open" || e.state === "opening" || e.state === "closing" || e.state === "on";
  return (t ? !n : n) ? 1 : 0;
}
function Xe(e, t = !1) {
  return !e || Se(e.state) ? !1 : Q(e, t) > 0 || e.state === "opening" || e.state === "closing";
}
const Fh = /* @__PURE__ */ new Set(["window", "blind", "shade", "shutter", "curtain", "awning"]), Lh = /* @__PURE__ */ new Set(["blind", "shade", "curtain"]), Dh = /* @__PURE__ */ new Set(["garage", "garage_door", "shutter"]);
function Hh(e) {
  const t = e ?? "";
  return {
    type: Fh.has(t) ? "window" : "door",
    motion: Dh.has(t) ? "roll" : Lh.has(t) ? "slide" : void 0
  };
}
const Rh = 3;
function Nh(e, t) {
  return e.split(".")[0] === "cover" && t & Rh ? "cover-toggle" : "more-info";
}
function xi(e, t, i) {
  const n = e.entity || void 0, o = e.shutterEntity || void 0, r = !!(n && o && e.tapTarget === "shutter"), s = r ? o : n ?? o, l = n && o ? r ? n : o : void 0, a = t === "tap" ? e.tap_action : t === "hold" ? e.hold_action : e.double_tap_action;
  if (a) return { entity: a.entity ?? s, config: a };
  if (t === "tap")
    return s ? {
      entity: s,
      config: {
        action: (
          // Pointing the tap at the shutter opens its dialog; it does not
          // drive the motor. Choosing *which* entity answers is not the same
          // as choosing to move hardware on a tap, and that second decision
          // stays where it is explicit — `tap_action: toggle` (issue #47).
          !r && Nh(s, i(s)) === "cover-toggle" ? "toggle" : "more-info"
        )
      }
    } : void 0;
  if (t === "hold" && l) return { entity: l, config: { action: "more-info" } };
}
function Qe(e, t) {
  const i = t === "tap" ? e.tap_action : t === "hold" ? e.hold_action : e.double_tap_action;
  if (i)
    return { entity: i.entity ?? e.entity, config: i };
}
function jh(e) {
  return ["tap", "hold", "double_tap"].some(
    (t) => Y(Qe(e, t)?.config)
  );
}
function Bh(e, t) {
  return ["tap", "hold", "double_tap"].some(
    (i) => Y(xi(e, i, t)?.config)
  );
}
function Se(e) {
  return e === "unavailable" || e === "unknown";
}
function Uh(e, t) {
  if (!e.entity || t === void 0) return $i(e);
  if (Wh(e.entity, t)) return !1;
  const i = Gh(e.entity, t);
  return e.invert ? !i : i;
}
function Wh(e, t) {
  return Se(t) ? !0 : e.split(".")[0] === "lock" && t === "jammed";
}
function Gh(e, t) {
  return e.split(".")[0] === "lock" ? ie(e, t) : t === "on" || t === "open" || t === "opening" || t === "closing";
}
function qh(e) {
  return e === "opening" || e === "closing";
}
function _e(e, t) {
  if (!e.entity || !t) return $i(e) ? 1 : 0;
  if (Se(t.state)) return 0;
  const i = t.attributes?.current_position;
  if (typeof i == "number" && Number.isFinite(i)) {
    const n = Math.max(0, Math.min(1, i / 100));
    return e.invert ? 1 - n : n;
  }
  return Uh(e, t.state) ? 1 : 0;
}
function Nt(e, t) {
  return !e.entity || !t || Se(t.state) ? !1 : qh(t.state) || _e(e, t) > 0;
}
function $n(e, t, i) {
  const n = e / 2, o = 5, r = Math.max(3, Math.round(e / 12)), s = [];
  for (let l = 1; l < r; l++) {
    const a = -n + e * l / r;
    s.push(
      b`<line x1=${a} y1=${-o / 2} x2=${a} y2=${o / 2}
            stroke=${xt} stroke-width="0.75" />`
    );
  }
  return b`<g class="fp-roll-curtain" style="transform:scaleY(${1 - i});">
      <rect x=${-n} y=${-o / 2} width=${e} height=${o}
            style="fill:${t};" />
      ${s}
    </g>`;
}
function Kh(e, t, i, n, o = 1, r = i, s = n) {
  const l = e / 2, a = 3, c = o * (t / 2 + a / 2), h = (d, p) => {
    const m = [], v = Math.max(2, Math.round(p / 14));
    for (let y = 1; y < v; y++) {
      const w = d + p * y / v;
      m.push(
        b`<line x1=${w} y1=${-a / 2} x2=${w} y2=${a / 2}
              stroke=${xt} stroke-width="0.75" />`
      );
    }
    return m;
  };
  return b`
      <g transform="translate(${-l} ${c})">
        <g class="fp-door-leaf" style="transform:rotate(${o * 90 * n}deg);">
          <rect x="0" y=${-a / 2} width=${l} height=${a} style="fill:${i};" />
          ${h(0, l)}
        </g>
      </g>
      <g transform="translate(${l} ${c})">
        <g class="fp-leaf-r" style="transform:rotate(${-o * 90 * s}deg);">
          <rect x=${-l} y=${-a / 2} width=${l} height=${a} style="fill:${r};" />
          ${h(-l, l)}
        </g>
      </g>`;
}
const Io = 22, ct = 14, ht = 22, dt = 15;
function ki(e, t = 0) {
  const i = e.flipV ? -1 : 1, n = e.angle * Math.PI / 180, o = { x: -Math.sin(n) * i, y: Math.cos(n) * i };
  return t === 90 ? { x: -o.y, y: o.x } : t === 180 ? { x: -o.x, y: -o.y } : t === 270 ? { x: o.y, y: -o.x } : o;
}
function Si(e, t = Io) {
  const i = (e.flipV ? -1 : 1) * t, n = e.angle * Math.PI / 180;
  return { x: e.x - Math.sin(n) * i, y: e.y + Math.cos(n) * i };
}
function Co(e) {
  return !!(e.entity && e.shutterEntity) && (e.showShutterIcon ?? !0);
}
const Vh = { on: "mdi:window-shutter-open", off: "mdi:window-shutter" }, xn = {
  door: { on: "mdi:door-open", off: "mdi:door-closed" },
  window: { on: "mdi:window-open", off: "mdi:window-closed" }
};
function Oo(e, t, i, n, o, r) {
  const s = Pe(t);
  if (s) return s;
  const l = Pe(r);
  if (l) return l;
  const a = Pe(i?.attributes?.icon);
  return a || (_o(e, i?.attributes?.device_class, n) ?? (n ? o.on : o.off));
}
function Po(e, t, i, n) {
  return Oo(
    e.shutterEntity ?? "",
    e.shutterIcon,
    t,
    i,
    Vh,
    n
  );
}
function zo(e) {
  return !!e.entity && (e.showIcon ?? !1);
}
function Fo(e, t, i, n) {
  return Oo(
    e.entity ?? "",
    e.icon,
    t,
    i,
    xn[e.type] ?? xn.door,
    n
  );
}
function Lo(e) {
  return Si(e, -Io);
}
function Do(e, t = 0) {
  const i = ki(e, t);
  return { x: -i.x, y: -i.y };
}
function Ho(e, t) {
  const { color: i, open: n = !0, active: o = !1, accent: r = R } = t, s = e.length / 2, l = F + 4, a = N(o ? r : i, R), c = Math.max(0, Math.min(1, t.amount ?? (n ? 1 : 0))), h = t.second ? Math.max(0, Math.min(1, t.second.amount)) : c, d = t.second ? N(t.second.active ? r : i, R) : a;
  let p;
  if (B(e) === "swing") {
    const y = xe(e) === "double", w = y ? s : e.length, u = Math.PI / 2 * w, _ = (A, E, P) => b`<path class="fp-door-arc" d=${A}
              fill="none" stroke-width="1.5" stroke-dasharray=${u}
              style="stroke:${E};stroke-dashoffset:${u * (1 - P)};" />`, x = e.type === "window" ? b`
        <line x1=${-s} y1=${-l / 2} x2=${-s} y2=${l / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${s} y1=${-l / 2} x2=${s} y2=${l / 2}
              stroke=${i} stroke-width="2" />` : f;
    p = b`
        ${x}
        ${y ? (
      // Two leaves hinged at opposite jambs, meeting in the middle when
      // shut and each tracing its own quarter circle outward.
      b`${_(`M 0 0 A ${s} ${s} 0 0 0 ${-s} ${-s}`, a, c)}${_(
        `M 0 0 A ${s} ${s} 0 0 1 ${s} ${-s}`,
        d,
        h
      )}`
    ) : _(`M ${s} 0 A ${e.length} ${e.length} 0 0 0 ${-s} ${-e.length}`, a, c)}
        <!-- leaf hinged at the left jamb (flipH mirrors it to the right one) -->
        <g transform="translate(${-s} 0)">
          <g class="fp-door-leaf" style="transform:rotate(${-90 * c}deg);">
            <rect x="0" y="-1.25" width=${w} height="2.5" style="fill:${a};" />
          </g>
        </g>
        ${y ? (
      // The other leaf, on its own sensor when it has one (issue #159):
      // a casement pair with a contact per sash draws left-open /
      // right-shut, exactly as a two-sensor slider parts unevenly.
      b`<g transform="translate(${s} 0)">
          <g class="fp-leaf-r" style="transform:rotate(${90 * h}deg);">
            <rect x=${-s} y="-1.25" width=${s} height="2.5" style="fill:${d};" />
          </g>
        </g>`
    ) : f}
      `;
  } else if (B(e) === "roll")
    p = b`
        <!-- jambs -->
        <line x1=${-s} y1=${-l / 2} x2=${-s} y2=${l / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${s} y1=${-l / 2} x2=${s} y2=${l / 2}
              stroke=${i} stroke-width="2" />
        <!-- Track: stays when the curtain is up so the gap still reads as an
             opening — and wears the accent while the cover is open or moving
             (issue #154). Wide open the curtain has scaled away to nothing, so
             this line is the *only* mark left: drawn in the base colour it read
             exactly like a shut garage, which is the one thing it must not do.
             Full strength when accented, since a 0.6 tint of the accent reads
             as neither colour. -->
        <line x1=${-s} y1="0" x2=${s} y2="0"
              stroke=${a} stroke-width="0.75" opacity=${o ? 1 : 0.6} />
        ${$n(e.length, a, c)}`;
  else {
    const y = e.type === "window" ? 1.5 : 2.5, w = b`
        <line x1=${-s} y1=${-l / 2} x2=${-s} y2=${l / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${s} y1=${-l / 2} x2=${s} y2=${l / 2}
              stroke=${i} stroke-width="2" />`, u = St(e);
    if (u === "bypass") {
      const x = -s * c;
      p = b`
        ${w}
        <!-- tracks -->
        <line x1=${-s} y1=${-1.75} x2=${s} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-s} y1=${1.75} x2=${s} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- fixed panel: left half, front track -->
        <rect x=${-s} y=${1.75 - y / 2} width=${s} height=${y} style="fill:${a};" />
        <!-- moving panel: right half, back track -->
        <g class="fp-slide-panel" style="transform:translateX(${x}px);">
          <rect x="0" y=${-1.75 - y / 2} width=${s} height=${y} style="fill:${a};" />
        </g>`;
    } else if (u === "biparting")
      p = b`
        ${w}
        <!-- track -->
        <line x1=${-s} y1="0" x2=${s} y2="0"
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <g class="fp-slide-panel" style="transform:translateX(${-s * c}px);">
          <rect x=${-s} y=${-y / 2} width=${s} height=${y} style="fill:${a};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${s * h}px);">
          <rect x="0" y=${-y / 2} width=${s} height=${y} style="fill:${d};" />
        </g>`;
    else if (u === "biparting-bypass") {
      const x = s / 2;
      p = b`
        ${w}
        <!-- tracks -->
        <line x1=${-s} y1=${-1.75} x2=${s} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-s} y1=${1.75} x2=${s} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- fixed panels: outer quarters, front track. Never accented, even
             wide open — the accent marks what has moved, and lighting these
             would accent exactly the half that is still glazed shut. -->
        <rect x=${-s} y=${1.75 - y / 2} width=${x} height=${y} fill=${i} />
        <rect x=${s - x} y=${1.75 - y / 2} width=${x} height=${y} fill=${i} />
        <!-- moving panels: inner quarters, back track -->
        <g class="fp-slide-panel" style="transform:translateX(${-x * c}px);">
          <rect x=${-x} y=${-1.75 - y / 2} width=${x} height=${y} style="fill:${a};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${x * h}px);">
          <rect x="0" y=${-1.75 - y / 2} width=${x} height=${y} style="fill:${d};" />
        </g>`;
    } else if (u === "converging") {
      const x = s / 2;
      p = b`
        ${w}
        <!-- tracks -->
        <line x1=${-s} y1=${-1.75} x2=${s} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-s} y1=${1.75} x2=${s} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- both panels move, so both take the accent on their own state:
             front track travels right, back track left, and they meet. -->
        <g class="fp-slide-panel" style="transform:translateX(${x * c}px);">
          <rect x=${-s} y=${1.75 - y / 2} width=${s} height=${y} style="fill:${a};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${-x * h}px);">
          <rect x="0" y=${-1.75 - y / 2} width=${s} height=${y} style="fill:${d};" />
        </g>`;
    } else {
      const _ = e.length * c;
      p = b`
        ${w}
        <!-- track -->
        <line x1=${-s} y1="0" x2=${s} y2="0"
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <g class="fp-slide-panel" style="transform:translateX(${_}px);">
          <rect x=${-s} y=${-y / 2} width=${e.length} height=${y} style="fill:${a};" />
        </g>`;
    }
  }
  if (t.shutter) {
    const y = N(
      t.shutter.active ? t.shutter.accent ?? r : i,
      R
    ), w = Math.max(0, Math.min(1, t.shutter.amount)), u = t.shutter.second, _ = u ? N(
      u.active ? t.shutter.accent ?? r : i,
      R
    ) : y, x = u ? Math.max(0, Math.min(1, u.amount)) : w;
    p = b`${p}${t.shutter.style === "swing" ? Kh(
      e.length,
      l,
      y,
      w,
      t.shutter.flip ? -1 : 1,
      _,
      x
    ) : $n(e.length, y, w)}`;
  }
  const { sx: m, sy: v } = zh(e);
  return b`<g class=${`fp-opening fp-opening-${j(e.type) ?? "unknown"}`}
                data-id=${j(e.id) ?? f}
                data-entity=${ee(e.entity) ?? f}
                transform="translate(${e.x} ${e.y}) rotate(${e.angle})">
      <g transform="scale(${m} ${v})">${p}</g>
    </g>`;
}
function Ro(e) {
  if (typeof e != "number" || !Number.isFinite(e)) return 0;
  const t = (e % 360 + 360) % 360;
  return t === 90 || t === 180 || t === 270 ? t : 0;
}
function se(e, t, i) {
  return i === 90 || i === 270 ? { w: t, h: e } : { w: e, h: t };
}
function me(e, t, i, n, o) {
  switch (o) {
    case 90:
      return { x: n - t, y: e };
    case 180:
      return { x: i - e, y: n - t };
    case 270:
      return { x: t, y: i - e };
    default:
      return { x: e, y: t };
  }
}
function Yh(e, t, i) {
  switch (i) {
    case 90:
      return `translate(${t} 0) rotate(90)`;
    case 180:
      return `translate(${e} ${t}) rotate(180)`;
    case 270:
      return `translate(0 ${e}) rotate(-90)`;
    default:
      return "";
  }
}
function Zh(e, t = ri, i = it) {
  const n = Math.min(t, i), o = Math.max(t, i);
  if (!(typeof e == "number" || typeof e == "string" && e.trim() !== "")) return o;
  const s = typeof e == "number" ? e : Number(e);
  if (!Number.isFinite(s)) return o;
  const l = jr - Xi, a = Math.max(0, Math.min(1, (s - Xi) / l)), c = a * a * (3 - 2 * a);
  return n + (o - n) * c;
}
const jt = 135, kn = 12;
function Ai(e) {
  if (!(typeof e == "number" || typeof e == "string" && e.trim() !== "")) return;
  const i = typeof e == "number" ? e : Number(e);
  return Number.isFinite(i) ? i : void 0;
}
function Xh(e) {
  const t = Ai(e);
  if (t === void 0) return 1;
  if (t <= 0) return 0;
  if (t >= kn) return 1;
  const i = t / kn;
  return i * i * (3 - 2 * i);
}
function Qh(e, t = 0) {
  const i = (e + t) * Math.PI / 180;
  return { x: Math.sin(i), y: -Math.cos(i) };
}
function Jh(e, t) {
  return At(e) ? e.sunBearing : Ai(t) ?? jt;
}
function At(e) {
  return typeof e.sunBearing == "number" && Number.isFinite(e.sunBearing);
}
function ed(e, t) {
  return At(e) ? 1 : Xh(t);
}
const ut = 0.34, td = 30, id = 0.95, nd = 0.16, od = 0.37, Bt = "var(--fp-skin-sunlight, #ffd9a0)", Ut = "var(--fp-skin-sunshade, #000)";
function rd(e) {
  return Math.max(0.02, Math.min(1.5, T(e, ut)));
}
function sd(e, t, i, n) {
  let o = n;
  for (const r of i) {
    const s = mi(e.x, e.y, t.x, t.y, r);
    s !== void 0 && s > 1 && s < o && (o = s);
  }
  return o;
}
function ad(e) {
  const t = Ai(e);
  if (t === void 0) return 1;
  const i = (o) => o * Math.PI / 180, n = Math.tan(i(td)) / Math.tan(i(Math.max(1, Math.min(89, t))));
  return Math.max(0.45, Math.min(1.9, n));
}
function ld(e, t, i) {
  return e.sunlight === !1 || i !== void 0 && i <= 0 ? 0 : Ei(e) ? 1 : Math.max(0, Math.min(1, t));
}
function Ei(e) {
  return e.glazed ?? e.type === "window";
}
function No(e) {
  const t = e.angle * Math.PI / 180, i = Math.cos(t) * e.length / 2, n = Math.sin(t) * e.length / 2;
  return [
    { x: e.x - i, y: e.y - n },
    { x: e.x + i, y: e.y + n }
  ];
}
function Mi(e, t, i) {
  let n = !1;
  for (let o = 0, r = e.length - 1; o < e.length; r = o++) {
    const s = e[o], l = e[r];
    s.y > i != l.y > i && t < (l.x - s.x) * (i - s.y) / (l.y - s.y) + s.x && (n = !n);
  }
  return n;
}
function cd(e, t, i) {
  for (const n of t) {
    const o = mi(e.x, e.y, -i.x, -i.y, n);
    if (o === void 0) continue;
    if (!(o <= lt && gi(e.x, e.y, n) <= lt)) return !1;
  }
  return !0;
}
function hd(e, t) {
  return Qh(Jh(e, t) + 180, e.north ?? 0);
}
function jo(e, t, i, n) {
  return [
    e,
    t,
    { x: t.x + i.x * n, y: t.y + i.y * n },
    { x: e.x + i.x * n, y: e.y + i.y * n }
  ];
}
function dd(e, t, i, n = 1) {
  const [o, r] = No(e), s = Math.max(0, Math.min(1, n)), l = (o.x + r.x) / 2, a = (o.y + r.y) / 2, c = (h) => ({ x: l + (h.x - l) * s, y: a + (h.y - a) * s });
  return jo(c(o), c(r), t, i);
}
function ud(e, t, i) {
  return jo({ x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 }, t, i);
}
function Sn(e) {
  return e.map((t) => `${t.x},${t.y}`).join(" ");
}
function pd(e, t, i, n, o, r) {
  const { dir: s, openAmount: l, shutterOpen: a, strength: c = 1 } = r, h = {
    light: r.light ?? Bt,
    // `?? ` would swallow the explicit null that means "no shade at all".
    shade: r.shade === void 0 ? Ut : r.shade
  };
  if (c <= 0) return f;
  const d = Math.min(i, n) * rd(r.reach), p = (k) => ld(k, l(k), a(k)), v = yi(e, t, p).map((k) => ud(k, s, d)), y = t.map((k, G) => {
    if (!(p(k) > 0 && cd(k, e, s))) return;
    const de = sd(k, s, e, d), [zi, Fi] = No(k), er = Fi.x - zi.x, tr = Fi.y - zi.y, ir = Math.abs(er * s.y - tr * s.x) * p(k) / 2;
    return {
      // The outline runs past the falloff, so the ellipse is what bounds the
      // patch and never the polygon's flat far edge.
      points: Sn(dd(k, s, de + k.length, p(k))),
      cx: k.x,
      cy: k.y,
      along: de,
      across: Math.max(1, ir * id),
      angle: Math.atan2(s.y, s.x) * 180 / Math.PI,
      lightId: `${o}-b${G}`,
      shadeId: `${o}-s${G}`,
      fadeId: `${o}-f${G}`
    };
  });
  if (!y.some((k) => k !== void 0)) return f;
  const w = v.map(Sn), u = F, _ = `${o}-shade`, x = `${o}-shadow`, A = -u, E = -u, P = i + u * 2, L = n + u * 2, U = (k, G = f) => b`<rect x=${A} y=${E} width=${P} height=${L} fill=${k}>${G}</rect>`, Ge = (k, G) => b`<polygon points=${k} fill=${G} stroke=${G} stroke-width=${F} />`, Pi = (k, G, de) => b`<radialGradient id=${G} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
              gradientTransform=${`translate(${k.cx} ${k.cy}) rotate(${k.angle}) scale(${k.along} ${k.across})`}>
          <stop offset="0" stop-color=${de} stop-opacity="1" />
          <stop offset="0.45" stop-color=${de} stop-opacity="0.55" />
          <stop offset="1" stop-color=${de} stop-opacity="0" />
        </radialGradient>`, Jo = h.shade === null ? f : b`
      <!-- Where the shade shows: everywhere, minus the patches of light, plus
           back wherever a wall stands in one. The order is the whole logic. -->
      <mask id=${_} maskUnits="userSpaceOnUse" x=${A} y=${E} width=${P} height=${L}>
        ${U("#fff")}
        ${y.map((k) => k ? Pi(k, k.shadeId, "#000") : f)}
        ${y.map(
    (k) => k ? b`<polygon points=${k.points} fill=${`url(#${k.shadeId})`} />` : f
  )}
        ${w.map((k) => Ge(k, "#fff"))}
      </mask>`;
  return b`
    <defs>
      ${Jo}
      <!-- The wall shadows again, for the warm patches themselves. -->
      <mask id=${x} maskUnits="userSpaceOnUse" x=${A} y=${E} width=${P} height=${L}>
        ${U("#fff")}
        ${w.map((k) => Ge(k, "#000"))}
      </mask>
    </defs>
    <g class="fp-sunlight">
      ${h.shade === null ? f : b`<rect x=${A} y=${E} width=${P} height=${L}
            style=${`fill:${N(h.shade, Ut)};`}
            opacity=${nd * c} mask=${`url(#${_})`} />`}
      <g mask=${`url(#${x})`} opacity=${od * c}>
        ${y.map(
    (k) => k ? Pi(k, k.lightId, N(h.light, Bt)) : f
  )}
        ${y.map(
    (k) => k ? b`<polygon class="fp-sunbeam" points=${k.points}
                            fill=${`url(#${k.lightId})`} />` : f
  )}
      </g>
    </g>`;
}
function Bo(e) {
  switch (e) {
    case "contain":
      return "xMidYMid meet";
    case "cover":
      return "xMidYMid slice";
    default:
      return "none";
  }
}
function Uo(e, t, i, n) {
  const o = F + 4, r = F;
  return b`
    <defs>
      <mask id=${n} maskUnits="userSpaceOnUse"
            x=${-r} y=${-r} width=${t + r * 2} height=${i + r * 2}>
        <rect x=${-r} y=${-r} width=${t + r * 2} height=${i + r * 2}
              fill="white" />
        ${e.map((s) => {
    const l = s.length / 2;
    return b`<rect x=${s.x - l} y=${s.y - o / 2}
                           width=${s.length} height=${o} fill="black"
                           transform="rotate(${s.angle} ${s.x} ${s.y})" />`;
  })}
      </mask>
    </defs>`;
}
function Ti(e) {
  if (!e.length) return { x: 0, y: 0 };
  const t = e.reduce((i, n) => ({ x: i.x + n.x, y: i.y + n.y }), { x: 0, y: 0 });
  return { x: t.x / e.length, y: t.y / e.length };
}
const Wt = { scale: 1, txPercent: 0, tyPercent: 0 };
function fd(e, t, i, n, o = 0.15, r = 4) {
  if (!e.length) return Wt;
  const s = e.map((E) => me(E.x, E.y, t, i, n)), l = se(t, i, n), a = s.map((E) => E.x), c = s.map((E) => E.y), h = Math.min(...a), d = Math.max(...a), p = Math.min(...c), m = Math.max(...c), v = Math.max(d - h, m - p) * o, y = Math.max(d - h + v * 2, 1), w = Math.max(m - p + v * 2, 1), u = Math.max(1, Math.min(r, Math.min(l.w / y, l.h / w)));
  if (!Number.isFinite(u)) return Wt;
  const _ = (h + d) / 2 / l.w, x = (p + m) / 2 / l.h, A = (E) => Math.min(0, Math.max(100 * (1 - u), E));
  return {
    scale: u,
    txPercent: A(50 - u * _ * 100),
    tyPercent: A(50 - u * x * 100)
  };
}
const Ot = 12, gd = 1.5, md = 0.4;
function Wo(e) {
  return b`
    <defs>
      <pattern id=${e} width=${Ot} height=${Ot}
               patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line class="fp-dead-space-line" x1="0" y1="0" x2="0" y2=${Ot}
              stroke=${hi} stroke-width=${gd} />
      </pattern>
    </defs>`;
}
function Go(e, t) {
  const i = e.map((n) => `${n.x},${n.y}`).join(" ");
  return b`<polygon class="fp-dead-space" points=${i}
                      fill=${`url(#${t})`} fill-rule="nonzero"
                      fill-opacity=${md} stroke="none" />`;
}
function qo(e, t) {
  const i = e.points.map((r) => `${r.x},${r.y}`).join(" "), n = t !== void 0 && (e.highlight ?? "fill") !== "border", o = n ? e.activeOpacity ?? e.opacity : e.opacity;
  return b`<polygon class="fp-area" data-id=${j(e.id) ?? f}
                       data-entity=${ee(e.entity) ?? f}
                       points=${i}
                       fill=${n ? t : N(e.color, R)}
                       fill-opacity=${T(o, zt)}
                       stroke="none"
                       stroke-width="0" />`;
}
function Ko(e, t, i) {
  const n = t !== void 0 && (e.highlight ?? "fill") !== "fill", o = n ? t : e.borderColor ? N(e.borderColor, "none") : void 0;
  if (o === void 0 || o === "none") return f;
  const r = e.points.map((l) => `${l.x},${l.y}`).join(" "), s = T(
    e.borderWidth,
    n ? F / 2 : Br
  );
  return !n || i === void 0 ? b`<polygon class="fp-area-border" data-id=${j(e.id) ?? f}
                        data-entity=${ee(e.entity) ?? f}
                        points=${r} fill="none"
                        stroke=${o} stroke-width=${s} />` : b`
    <clipPath id=${i}><polygon points=${r} /></clipPath>
    <polygon class="fp-area-border" data-id=${j(e.id) ?? f}
             data-entity=${ee(e.entity) ?? f}
             points=${r} fill="none" clip-path=${`url(#${i})`}
             stroke=${o} stroke-width=${s * 2} />`;
}
function Gt(e, t, i = V) {
  const n = t ?? e.color ?? Wr, o = Nc(_t(i, e.type) ?? zc, e.w, e.h, n), r = e.hand === "left" ? " scale(-1 1)" : "";
  return b`<g class=${`fp-furniture fp-furniture-${j(e.type) ?? "unknown"}`}
                data-id=${j(e.id) ?? f}
                data-entity=${ee(e.entity) ?? f}
                transform="translate(${e.x} ${e.y}) rotate(${e.angle ?? 0})${r}">${o}</g>`;
}
function pt(e, t, i, n = 3, o = "fixed") {
  const r = C(T(i, bt), o);
  return g`
    <div
      class="ripple ${e ? "active" : ""}"
      style="width:${r};height:${r};--fp-ripple-color:${N(t, R)};"
    >
      <span class="dot"></span>
      ${Array.from(
    { length: n },
    (s, l) => g`<span class="ring" style="animation-delay:${(l * 0.6).toFixed(2)}s;"></span>`
  )}
    </div>
  `;
}
function ft(e, t) {
  if (!t || !e) return null;
  const i = e[t]?.state;
  if (i == null || i === "unavailable" || i === "unknown") return null;
  const n = Number(i);
  return Number.isFinite(n) ? n : null;
}
function Vo(e, t) {
  const i = e.color ?? R, n = (e.dotSize ?? ai) / 2, o = e.x + e.w / 2, r = e.y + e.h / 2, s = e.angle ?? 0, l = ln(e.xSensor, t.xReading), a = ln(e.ySensor, t.yReading), c = l != null, h = a != null, d = t.xPresent === !1 || t.yPresent === !1, p = e.w / 2, m = e.h / 2, v = t.editing ? b`<rect class="tracker-zone ${d ? "presence-gated" : ""}"
                x=${-p} y=${-m} width=${e.w} height=${e.h}
                fill=${i} fill-opacity="0.08" stroke=${i} stroke-width="1.5"
                stroke-dasharray="6 4" rx="4" pointer-events="none" />` : b``;
  let y;
  if (d)
    y = b``;
  else if (c && h) {
    const w = -p + l * e.w, u = -m + a * e.h, _ = `0,${-n} ${n * 0.9},${n * 0.7} ${-n * 0.9},${n * 0.7}`, x = Math.max(n * 3.5, Math.min(e.w, e.h) * 0.45);
    y = b`
      <g class="tracker-marker" style="transform:translate(${w}px, ${u}px);">
        <circle class="tracker-ring" cx="0" cy="0" r="0"
                fill="none" stroke=${i} stroke-width="1.5"
                style="--fp-tracker-ring-max:${x}px;" />
        <circle class="tracker-ring" cx="0" cy="0" r="0"
                fill="none" stroke=${i} stroke-width="1.5"
                style="--fp-tracker-ring-max:${x}px; animation-delay:0.7s;" />
        <polygon class="tracker-dot" points=${_} fill=${i} />
      </g>`;
  } else if (c || h)
    if (c) {
      const w = -p + l * e.w;
      y = b`
        <g class="tracker-line" style="transform:translate(${w}px, 0);">
          <line class="tracker-line-stroke" x1="0" y1=${-m} x2="0" y2=${m}
                stroke=${i} stroke-width="1.5" />
          <line class="tracker-band" x1="0" y1=${-m} x2="0" y2=${m}
                stroke=${i} stroke-width="3" stroke-linecap="round" />
          <line class="tracker-band" x1="0" y1=${-m} x2="0" y2=${m}
                stroke=${i} stroke-width="3" stroke-linecap="round"
                style="animation-delay:0.8s;" />
        </g>`;
    } else {
      const w = -m + a * e.h;
      y = b`
        <g class="tracker-line tracker-line-h" style="transform:translate(0, ${w}px);">
          <line class="tracker-line-stroke" x1=${-p} y1="0" x2=${p} y2="0"
                stroke=${i} stroke-width="1.5" />
          <line class="tracker-band" x1=${-p} y1="0" x2=${p} y2="0"
                stroke=${i} stroke-width="3" stroke-linecap="round" />
          <line class="tracker-band" x1=${-p} y1="0" x2=${p} y2="0"
                stroke=${i} stroke-width="3" stroke-linecap="round"
                style="animation-delay:0.8s;" />
        </g>`;
    }
  else t.editing ? y = b`<circle class="tracker-placeholder" cx="0" cy="0" r=${n}
                          fill=${i} fill-opacity="0.25" />` : y = b``;
  return b`
    <g class="tracker fp-tracker ${t.editing ? "editing" : ""}"
       data-id=${j(e.id) ?? f}
       transform="translate(${o} ${r}) rotate(${s})">
      ${v}${y}
    </g>`;
}
function An(e, t, i, n) {
  let o = null, r = n;
  for (const s of i) {
    const l = s.x2 - s.x1, a = s.y2 - s.y1, c = l * l + a * a;
    if (c === 0) continue;
    let h = ((e - s.x1) * l + (t - s.y1) * a) / c;
    h = Math.max(0, Math.min(1, h));
    const d = s.x1 + h * l, p = s.y1 + h * a, m = Math.hypot(e - d, t - p);
    m < r && (r = m, o = { x: d, y: p, angle: Math.atan2(a, l) * 180 / Math.PI });
  }
  return o;
}
const yd = 500, bd = 250;
class vd extends HTMLElement {
  constructor() {
    super(...arguments), this.holdTime = yd, this.held = !1, this.cancelled = !1;
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
    t.actionHandler && wd(i, t.actionHandler.options) || (t.actionHandler ? (t.removeEventListener("touchstart", t.actionHandler.start), t.removeEventListener("touchend", t.actionHandler.end), t.removeEventListener("touchcancel", t.actionHandler.end), t.removeEventListener("mousedown", t.actionHandler.start), t.removeEventListener("click", t.actionHandler.end), t.removeEventListener("keydown", t.actionHandler.handleKeyDown)) : t.addEventListener("contextmenu", (n) => {
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
      i.hasHold && this.timer && (clearTimeout(this.timer), this.timer = void 0), i.hasHold && this.held ? qe(o, "hold") : i.hasDoubleClick ? n.type === "click" && n.detail < 2 || !this.dblClickTimeout ? this.dblClickTimeout = window.setTimeout(() => {
        this.dblClickTimeout = void 0, qe(o, "tap");
      }, bd) : (clearTimeout(this.dblClickTimeout), this.dblClickTimeout = void 0, qe(o, "double_tap")) : qe(o, "tap");
    }, t.actionHandler.handleKeyDown = (n) => {
      ["Enter", " "].includes(n.key) && (n.preventDefault(), n.currentTarget.actionHandler.end(n));
    }, t.addEventListener("touchstart", t.actionHandler.start, { passive: !0 }), t.addEventListener("touchend", t.actionHandler.end), t.addEventListener("touchcancel", t.actionHandler.end), t.addEventListener("mousedown", t.actionHandler.start, { passive: !0 }), t.addEventListener("click", t.actionHandler.end), t.addEventListener("keydown", t.actionHandler.handleKeyDown)));
  }
}
function wd(e, t) {
  return e.hasHold === t.hasHold && e.hasDoubleClick === t.hasDoubleClick && e.disabled === t.disabled;
}
function qe(e, t) {
  e.dispatchEvent(
    new CustomEvent("action", { detail: { action: t }, bubbles: !0, composed: !0 })
  );
}
function _d() {
  const e = document.body, t = e.querySelector("action-handler-easy-floorplan");
  if (t) return t;
  const i = document.createElement("action-handler-easy-floorplan");
  return e.appendChild(i), i;
}
customElements.get("action-handler-easy-floorplan") || customElements.define("action-handler-easy-floorplan", vd);
const $d = (e, t) => {
  _d().bind(e, t);
}, pe = ii(
  class extends ni {
    update(e, [t]) {
      return $d(e.element, t), te;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(e) {
    }
  }
);
var xd = Object.defineProperty, kd = Object.getOwnPropertyDescriptor, Ue = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? kd(t, i) : t, r = e.length - 1, s; r >= 0; r--)
    (s = e[r]) && (o = (n ? s(t, i, o) : s(o)) || o);
  return n && o && xd(t, i, o), o;
};
const En = /* @__PURE__ */ new Map();
function Mn(e) {
  return e.map((t) => t.id).join("|");
}
let W = class extends be {
  constructor() {
    super(...arguments), this._wallMaskId = `fp-wall-mask-${W._nextWallMaskId++}`, this._glowIdBase = `fp-glow-${W._nextGlowId++}`, this._watchedEntities = /* @__PURE__ */ new Set(), this._featuresOf = (e) => this.hass?.states[e]?.attributes?.supported_features ?? 0;
  }
  setConfig(e) {
    if (!e || typeof e != "object") throw new Error("Invalid configuration");
    const t = e;
    for (const i of ["walls", "openings", "items", "texts", "furniture", "trackers", "areas", "floors"])
      if (t[i] != null && !Array.isArray(t[i]))
        throw new Error(`Invalid configuration: "${i}" must be a list`);
    for (const i of ["width", "height", "grid", "rotation"])
      if (t[i] != null && typeof t[i] != "number")
        throw new Error(`Invalid configuration: "${i}" must be a number`);
    if (this._config = {
      ...e,
      width: e.width ?? ve,
      height: e.height ?? Ne,
      walls: e.walls ?? [],
      openings: e.openings ?? [],
      items: e.items ?? [],
      texts: e.texts ?? [],
      furniture: e.furniture ?? []
    }, this._watchedEntities = Ce(this._config), !this._activeFloorId) {
      const i = rt(this._config), n = En.get(Mn(i));
      n && i.some((o) => o.id === n) && (this._activeFloorId = n);
    }
  }
  /**
   * HA pushes a fresh `hass` on every state change anywhere in the instance —
   * for most updates nothing on this plan moved. Skip those renders entirely.
   */
  shouldUpdate(e) {
    if (!(e.size === 1 && e.has("hass"))) return !0;
    const t = e.get("hass");
    return !t || !this.hass ? !0 : oo(t, this.hass, this._watchedEntities);
  }
  /**
   * Carry the skin as an attribute on the host, where `skinPalettes` picks it
   * up (issue #155). It has to be the host and not the template, because the
   * point is to sit *above* the `<ha-card>` a card-mod rule targets — see
   * skins.ts. Only ever a `findSkin` match, so an unrecognised `skin:` puts no
   * attribute on the element at all.
   */
  willUpdate(e) {
    if (!e.has("_config")) return;
    const t = Gc(this._config?.skin);
    t ? this.setAttribute("data-skin", t) : this.removeAttribute("data-skin");
  }
  getCardSize() {
    return 6;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => _u), document.createElement("easy-floorplan-card-editor");
  }
  static getStubConfig() {
    return Xr();
  }
  /**
   * Sections-view sizing (grid rows ≈ 56px): room for the 5:3 default canvas.
   * An instance method — HA calls it on the card element (getConfigElement /
   * getStubConfig are the static ones, called before any instance exists).
   */
  getGridOptions() {
    return { columns: 12, rows: 8, min_columns: 6, min_rows: 4 };
  }
  _isOn(e) {
    return ie(e.entity, this.hass?.states[e.entity]?.state);
  }
  /** How far open an opening should be drawn (0..1), from its entity (or default). */
  _openingAmount(e) {
    const t = e.entity ? this.hass?.states[e.entity] : void 0;
    return _e(e, t);
  }
  /** Whether an opening wears its accent: drawn open, or a cover still in transit. */
  _openingActive(e) {
    const t = e.entity ? this.hass?.states[e.entity] : void 0;
    return Nt(e, t);
  }
  /**
   * The second leaf's own state for an opening with a sensor on each — a
   * two-panel slider (issue #145) or a hinged double (issue #159).
   * `undefined` — no second sensor, or a shape with only one leaf — leaves both
   * on the first entity, so nothing about a single-sensor opening changes.
   */
  _openingSecond(e) {
    if (!e.secondaryEntity || !Le(e)) return;
    const t = To(e), i = this.hass?.states[e.secondaryEntity];
    return { amount: _e(t, i), active: Nt(t, i) };
  }
  /**
   * The same for a hinged shutter's other panel (issue #159). Read from its
   * own key and its own resolvers — the shutter answers to `shutterInvert` and
   * is drawn from `shutterAmount` / `shutterActive`, not the sash's — and only
   * for a `swing` shutter, since a roll curtain has no second panel to drive.
   */
  _shutterSecond(e) {
    if (!e.shutterSecondaryEntity || we(e) !== "swing") return;
    const t = this.hass?.states[e.shutterSecondaryEntity];
    return {
      amount: Q(t, e.shutterInvert),
      active: Xe(t, e.shutterInvert)
    };
  }
  _itemIcon(e) {
    return Ht(
      e,
      this.hass?.states[e.entity],
      this.hass?.entities?.[e.entity]?.icon
    );
  }
  _label(e) {
    return e.name ?? this.hass?.states[e.entity]?.attributes?.friendly_name ?? e.entity ?? "";
  }
  _handleItemAction(e, t) {
    this.hass && Me(this, this.hass, t, Qn(t, e.detail.action));
  }
  /** What a gesture on this opening would do, if anything. */
  _openingPress(e, t) {
    return xi(e, t, this._featuresOf);
  }
  /**
   * Pressing an opening (issue #74 follow-up). Which entity answers — the
   * window/door or its shutter — is {@link openingActionForGesture}'s call;
   * from here it is the same Lovelace dispatch every device uses.
   */
  _onOpeningAction(e, t) {
    if (!this.hass) return;
    const i = this._openingPress(t, e.detail.action);
    i && Me(this, this.hass, { entity: i.entity }, i.config);
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
  _renderShutterMark(e, t, i, n) {
    const o = e.shutterEntity, r = this.hass?.states[o], s = Q(r, e.shutterInvert) > 0, l = Xe(r, e.shutterInvert), a = Po(e, r, s, this.hass?.entities?.[o]?.icon), c = H(e.shutterActiveColor ?? e.activeColor) ?? R, h = Si(e), d = me(h.x, h.y, t.width, t.height, i), p = se(t.width, t.height, i), m = ki(e, i), v = C(ct, n), y = `translate(calc(${m.x} * ${v}), calc(${m.y} * ${v}))`, w = C(ht, n), u = this.hass?.states[o]?.attributes?.friendly_name ?? o;
    return g`
      <div
        class="shutter-mark ${l ? "on" : "off"}"
        data-entity=${ee(o) ?? f}
        style="left:${d.x / p.w * 100}%; top:${d.y / p.h * 100}%;
               width:${w};height:${w};
               transform:translate(-50%,-50%) ${y};--fp-active:${c};"
        title="${u} · ${je(this.hass, o)}"
        role="button"
        tabindex="0"
        @action=${() => {
      this.hass && Me(this, this.hass, { entity: o }, { action: "more-info" });
    }}
        .actionHandler=${pe({})}
      >
        <ha-icon
          icon=${a}
          style="--mdc-icon-size:${C(dt, n)};"
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
  _renderOpeningMark(e, t, i, n) {
    const o = e.entity, r = this.hass?.states[o], s = this._openingAmount(e) > 0, l = this._openingActive(e), a = Fo(e, r, s, this.hass?.entities?.[o]?.icon), c = H(e.activeColor) ?? R, h = Lo(e), d = me(h.x, h.y, t.width, t.height, i), p = se(t.width, t.height, i), m = Do(e, i), v = C(ct, n), y = `translate(calc(${m.x} * ${v}), calc(${m.y} * ${v}))`, w = C(ht, n), u = this.hass?.states[o]?.attributes?.friendly_name ?? o;
    return g`
      <div
        class="shutter-mark ${l ? "on" : "off"}"
        data-entity=${ee(o) ?? f}
        style="left:${d.x / p.w * 100}%; top:${d.y / p.h * 100}%;
               width:${w};height:${w};
               transform:translate(-50%,-50%) ${y};--fp-active:${c};"
        title="${u} · ${je(this.hass, o)}"
        role="button"
        tabindex="0"
        @action=${() => {
      this.hass && Me(this, this.hass, { entity: o }, { action: "more-info" });
    }}
        .actionHandler=${pe({})}
      >
        <ha-icon
          icon=${a}
          style="--mdc-icon-size:${C(dt, n)};"
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
    this._activeFloorId = t, En.set(Mn(e), t), this._zoomedAreaId = void 0;
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
    const i = Qe(t, e.detail.action);
    if (!i) {
      e.detail.action === "tap" && this._onAreaClick(t);
      return;
    }
    this.hass && Me(this, this.hass, { entity: i.entity }, i.config);
  }
  _renderBadge(e, t) {
    const i = T(e.size, le), n = C(i, t), o = vo(
      e,
      e.entity ? this.hass?.states[e.entity]?.state : void 0
    ), r = Be(e) === "value" ? ko(this.hass, e) : void 0;
    return g`
      <div
        class="badge"
        style="width:${n};height:${n};transform:rotate(${T(e.angle, 0)}deg);"
      >
        ${r ? g`<span
              class="badge-value"
              style="font-size:${C(Eo(i, r), t)};"
              >${r}</span
            >` : g`<ha-icon
              class=${o ? `anim-${o}` : ""}
              icon=${this._itemIcon(e)}
              style="--mdc-icon-size:${C($o(i), t)};"
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
  _renderItem(e, t, i, n) {
    const o = this._isOn(e), r = go(this.hass, e), s = e.entity ? this.hass?.states[e.entity] : void 0, l = _i(e, s), a = H(kt(e.stateColor, l)), c = a, h = !!this.hass && Eh(e, s?.state), d = ch(e, s?.state, this.hass), p = Be(e) !== "none", m = e.display ?? "badge", v = so(s), y = H(e.activeColor) ?? v, w = e.rippleColor ?? a ?? e.activeColor ?? v ?? R, u = qn(a ?? y), _ = e.rippleSize ?? bt, x = d ? "visibility: hidden; pointer-events: none;" : "";
    let A = f;
    m === "ripple" ? A = g`<span style="${x}">
        ${pt(o, w, _, 3, n)}
      </span>` : m === "iconRipple" ? A = g`<div class="stack" style="${x}">
        ${pt(o, w, _, 3, n)}
        ${p ? g`<div class="stack-icon">${this._renderBadge(e, n)}</div>` : f}
      </div>` : p && (A = g`<span style="${x}">
        ${this._renderBadge(e, n)}
      </span>`);
    const E = me(e.x, e.y, t.width, t.height, i), P = se(t.width, t.height, i), L = Uc(e);
    return g`
      <div
        class="item fp-item ${o ? "on" : "off"} ${h ? "offline" : ""} ${a ? "state-colored" : ""} ${L ? "interactive" : ""}"
        data-id=${j(e.id) ?? f}
        data-entity=${ee(e.entity) ?? f}
        data-kind=${j(e.kind) ?? f}
        style="left:${E.x / P.w * 100}%; top:${E.y / P.h * 100}%;${a ? `--fp-state:${a};` : ""}${y ? `--fp-active:${y};` : ""}${u ? `--fp-ink:${u};` : ""}"
        title=${this._label(e)}
        role=${L ? "button" : f}
        tabindex=${L ? "0" : f}
        @action=${(U) => this._handleItemAction(U, e)}
        .actionHandler=${pe({
      hasHold: Y(e.hold_action),
      hasDoubleClick: Y(e.double_tap_action),
      // Unbinds the gesture listeners outright, so keyboard activation
      // cannot reach an action that would do nothing.
      disabled: !L
    })}
        @pointerdown=${L && Ye(t) === "ripple" ? (U) => this._startInk(U) : f}
      >
        ${A}
        ${L && Ye(t) === "ripple" ? g`<span class="press-ink" aria-hidden="true"></span>` : f}
        ${r ? g`<span
              class="label ${A === f ? "inflow" : ""} label-${vi(e)}"
              style="font-size:${C(mo(e.labelSize), n)};${c ? `color:${c};` : ""}"
              >${r}</span
            >` : f}
      </div>
    `;
  }
  _renderAreaLabel(e, t, i, n) {
    if (!e.name || (e.showName ?? !0) === !1) return f;
    const o = Ti(e.points), r = me(o.x, o.y, t.width, t.height, i), s = se(t.width, t.height, i), l = fh(e.labelSize, n);
    return g`
      <div
        class="area-label"
        style="left:${r.x / s.w * 100}%; top:${r.y / s.h * 100}%;${l}"
      >
        ${e.name}
      </div>
    `;
  }
  _renderText(e, t, i, n) {
    const o = me(e.x, e.y, t.width, t.height, i), r = se(t.width, t.height, i);
    return g`
      <div
        class="text fp-text"
        data-id=${j(e.id) ?? f}
        style="left:${o.x / r.w * 100}%; top:${o.y / r.h * 100}%;
               font-size:${C(T(e.size, ze), n)};
               color:${N(e.color, to)};
               transform:translate(-50%,-50%) scale(var(--fp-inv-zoom,1)) rotate(${T(e.angle, 0)}deg);"
      >
        ${pi(this.hass, e)}
      </div>
    `;
  }
  render() {
    if (!this._config) return g`${f}`;
    const e = this._config, t = rt(e), i = t.find((u) => u.id === this._activeFloorId) ?? t.find((u) => u.id === e.defaultFloor) ?? t[0], n = Ro(e.rotation), o = se(T(e.width, ve), T(e.height, Ne), n), r = Yh(e.width, e.height, n), s = wi(e.overlayScale), l = e.sunDimming ? Zh(
      this.hass?.states["sun.sun"]?.attributes?.elevation,
      T(e.sunBrightnessMin, ri),
      T(e.sunBrightnessMax, it)
    ) : it, a = e.showDeadSpaces ? no(i.walls, i.openings) : [], h = e.sunDimming || i.items.some((u) => u.glow) ? yi(
      i.walls,
      i.openings,
      (u) => (
        // Both leaves, and the travel each style actually has (issue #145):
        // asking `entity` alone left a door whose *second* panel was open
        // still blocking light outright. Glass admits it whole regardless
        // of sash — a closed window is not a hole, but light still gets
        // through it. A shutter rolled down overrides that, same as it
        // does for sunlight.
        lo(
          u,
          this._openingAmount(u),
          this._openingSecond(u)?.amount,
          u.shutterEntity ? Q(this.hass?.states[u.shutterEntity], u.shutterInvert) : void 0
        )
      )
    ) : i.walls, d = `${this._glowIdBase}-sundim`, p = e.sunDimming ? lh(
      i.items,
      this.hass?.states,
      e.width,
      e.height,
      d,
      h
    ) : f, m = i.areas?.find((u) => u.id === this._zoomedAreaId), v = m ? fd(m.points, e.width, e.height, n) : Wt, y = e.compactHeader === !0, w = y && !!e.title;
    return g`
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
      <ha-card .header=${y ? f : e.title ?? f}>
        <div
          class="stage press-${Ye(e)} offline-${xo(e)} ${w ? "compact-title" : ""}"
          style="aspect-ratio: ${o.w} / ${o.h};"
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
            class="plan ${s === "plan" ? "scale-plan" : ""}"
            style="aspect-ratio: ${o.w} / ${o.h};
                   width: min(100%, calc(100cqh * ${o.w} / ${o.h}));
                   --fp-plan-w: ${o.w};
                   background:${N(e.background, xt)};"
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
            style="transform: translate(${v.txPercent}%, ${v.tyPercent}%) scale(${v.scale});"
          >
          <!-- Keyed on the skin (issue #122). A skin changes custom properties on
               an ancestor, and Chromium does not repaint an SVG element whose
               colour comes from a var() inside a presentation attribute or an
               inline style unless something else about it changes — Lit writes
               the same attribute string either way, so switching skins left
               every door, window and room fill painted in the previous skin's
               colours while the computed values were already correct. Keying
               rebuilds the subtree instead, which repaints by construction.
               Only on a skin change; ordinary state updates are untouched. -->
          ${Gn(
      e.skin ?? "",
      b`<svg viewBox="0 0 ${o.w} ${o.h}" preserveAspectRatio="none">
            <g transform=${r || f}>
            ${i.image ? b`<image href=${i.image} x="0" y="0" width=${e.width} height=${e.height}
                          preserveAspectRatio=${Bo(i.imageFit)}
                          opacity=${i.imageOpacity ?? 1} />` : f}
            ${i.areas?.map((u) => {
        const _ = jh(u);
        return b`<g class="area-tap-target"
                    role=${_ ? "button" : f}
                    tabindex=${_ ? "0" : f}
                    @action=${(x) => this._onAreaAction(x, u)}
                    .actionHandler=${pe({
          // Only wait out the timers when a gesture can resolve:
          // otherwise every tap on an ordinary room would sit for
          // 500ms before zooming.
          hasHold: Y(Qe(u, "hold")?.config),
          hasDoubleClick: Y(Qe(u, "double_tap")?.config)
        })}>
                  ${qo(u, mn(u, u.entity ? this.hass?.states[u.entity]?.state : void 0))}
                </g>`;
      })}
            <!-- Dead spaces (issue #88): the regions the walls seal off that no
                 door or window reaches, hatched. Above the room fills, so a
                 region someone has also drawn an area over still reads as
                 unreachable; below everything else, because it describes the
                 floor rather than anything standing on it. -->
            ${a.length ? b`${Wo(`${this._wallMaskId}-dead`)}
                    ${a.map(
        (u) => Go(u, `${this._wallMaskId}-dead`)
      )}` : f}
            <!-- Light pools (issue #6). Above the room fills but below the
                 furniture and walls, so light reads as cast onto the floor
                 rather than painted over the plan. Isolated as one layer: the
                 pools screen-blend with each other (two lamps brighten where
                 they meet) without screening against the plan beneath, which
                 would wash out on a light theme. -->
            ${uo(
        i.furniture,
        e.width,
        e.height,
        `${this._glowIdBase}-mask`,
        Dt(e.symbols)
      )}
            <g class="fp-glows"
               mask=${i.furniture.length ? `url(#${this._glowIdBase}-mask)` : f}>
              ${i.items.map((u, _) => {
        if (!u.glow) return f;
        const x = fi(u, this.hass?.states[u.entity]);
        return x ? ho(u, x, `${this._glowIdBase}-${_}`, h) : f;
      })}
            </g>
            ${i.furniture.map((u) => {
        const _ = Gt(
          u,
          oh(u, u.entity ? this.hass?.states[u.entity]?.state : void 0),
          Dt(e.symbols)
        ), x = Ah(u, t, i.id);
        if (!x) return _;
        const A = t.find((E) => E.id === x)?.name;
        return b`<g class="fp-furniture-link" role="button" tabindex="0"
                    @action=${() => this._goToFloor(t, x)}
                    .actionHandler=${pe({
          // A staircase has one gesture. Saying so keeps a tap from
          // sitting out the hold and double-tap timers before it
          // does anything.
          hasHold: !1,
          hasDoubleClick: !1
        })}>
                  <!-- An SVG tooltip is a <title> child, not a title=
                       attribute: the attribute does nothing here. -->
                  <title>${A ? `Go to ${A}` : "Go to the next floor"}</title>
                  ${_}
                </g>`;
      })}
            <!-- Sunlight through the openings. Under the walls on purpose:
                 light lands on the floor, and the walls stay crisp lines over
                 it rather than being tinted by the patches they let in. The
                 sun dimming further down is the whole-sky reading and still
                 has the last word — at night there is nothing to let in. -->
            ${e.sunlight ? pd(
        i.walls,
        i.openings,
        e.width,
        e.height,
        `${this._wallMaskId}-sun`,
        {
          // Both halves of the sun come from the same entity while
          // the plan follows it: the azimuth says where the light
          // comes from, the elevation whether there is any at all.
          // A plan that pins its own angle keeps its light on —
          // see sunlightStrengthOf.
          dir: hd(
            e,
            this.hass?.states["sun.sun"]?.attributes?.azimuth
          ),
          strength: ed(
            e,
            this.hass?.states["sun.sun"]?.attributes?.elevation
          ),
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
          reach: T(e.sunReach, ut) * (At(e) ? 1 : ad(this.hass?.states["sun.sun"]?.attributes?.elevation)),
          // The gap each style actually clears, both leaves
          // included — the same reading the lamps get above, and
          // for the same reason (#145): `entity` alone leaves a
          // door whose *second* panel is open reading as shut,
          // and a converging pair reading as twice as clear as it
          // draws. Glazing and shutters are applied on top of
          // this, inside openingSunFraction.
          openAmount: (u) => ao(
            u,
            this._openingAmount(u),
            this._openingSecond(u)?.amount
          ),
          // A shutter that is all the way down stops the light, as
          // one does. Undefined where none is bound, so an opening
          // without a shutter is judged on itself alone.
          shutterOpen: (u) => u.shutterEntity ? Q(this.hass?.states[u.shutterEntity], u.shutterInvert) : void 0,
          light: e.sunlightColor ?? Bt,
          shade: e.sunShade === !1 ? null : e.sunShadeColor ?? Ut
        }
      ) : f}
            ${Uo(i.openings, e.width, e.height, this._wallMaskId)}
            ${i.walls.map(
        (u) => b`
                <g class="fp-wall-neon"><line x1=${u.x1} y1=${u.y1} x2=${u.x2} y2=${u.y2}
                      class="wall fp-wall" data-id=${j(u.id) ?? f}
                      mask=${`url(#${this._wallMaskId})`}
                      style=${yo(u.thickness)} stroke-linecap="round" /></g>`
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
              ${i.areas?.map(
        (u, _) => Ko(
          u,
          mn(u, u.entity ? this.hass?.states[u.entity]?.state : void 0),
          `${this._wallMaskId}-area-${_}`
        )
      )}
            </g>
            ${X(
        // Keyed by id: switching floors must create fresh DOM nodes.
        // Unkeyed, Lit morphs floor A's openings into floor B's, and the
        // 0.5s leaf/panel transitions animate the leftover state — a
        // window briefly plays a door swing (issue #50).
        i.openings,
        (u, _) => u.id || _,
        (u) => {
          const _ = this._openingAmount(u), x = u.shutterEntity ? this.hass?.states[u.shutterEntity] : void 0, A = Ho(u, {
            color: hi,
            open: _ > 0,
            amount: _,
            active: this._openingActive(u),
            accent: u.activeColor ?? R,
            // Per-leaf state for a two-sensor biparting slider (issue #145).
            second: this._openingSecond(u),
            // External roller shutter layer (issue #74). No entity bound
            // yet → previewed shut, like a static plan.
            shutter: u.shutterEntity ? {
              amount: Q(x, u.shutterInvert),
              active: Xe(x, u.shutterInvert),
              style: we(u),
              // The shutter's own accent, falling back to the
              // opening's and then to the skin's.
              accent: u.shutterActiveColor ?? u.activeColor ?? R,
              flip: u.shutterFlipV,
              // Per-panel state for a two-contact hinged shutter
              // (issue #159).
              second: this._shutterSecond(u)
            } : void 0
          });
          if (!Bh(u, this._featuresOf)) return A;
          const E = u.length / 2, P = F + 4;
          return b`<g class="fp-opening" role="button" tabindex="0"
                    @action=${(L) => this._onOpeningAction(L, u)}
                    .actionHandler=${pe({
            // Only wait out the hold/double-tap timers when a gesture
            // actually resolves: otherwise every tap on a plain
            // contact sensor would sit for 500ms before answering.
            hasHold: Y(this._openingPress(u, "hold")?.config),
            hasDoubleClick: Y(this._openingPress(u, "double_tap")?.config)
          })}>
                  ${A}
                  <rect class="fp-opening-hit" x=${u.x - E} y=${u.y - P / 2}
                        width=${u.length} height=${P}
                        transform="rotate(${u.angle} ${u.x} ${u.y})" />
                </g>`;
        }
      )}
            ${X(
        i.trackers ?? [],
        (u, _) => u.id || _,
        (u) => Vo(u, {
          editing: !1,
          xReading: ft(this.hass?.states, u.xSensor?.entity),
          yReading: ft(this.hass?.states, u.ySensor?.entity),
          xPresent: st(this.hass?.states, u.xSensor?.presence),
          yPresent: st(this.hass?.states, u.ySensor?.presence)
        })
      )}
            <!-- Sun dimming (issue #113). Last inside the rotated group, so it
                 covers the whole plan; the device overlay below is HTML and
                 stays at full brightness, keeping icons and state readable at
                 night. pointer-events:none is not optional — this rect spans
                 the canvas, and without it every tappable opening underneath
                 stops responding (the lesson from #108). -->
            ${e.sunDimming ? b`${p}<rect class="fp-sun-dim"
                            x=${-F} y=${-F}
                            width=${e.width + F * 2}
                            height=${e.height + F * 2}
                            fill="#000"
                            mask=${p === f ? f : `url(#${d})`}
                            opacity=${1 - l} />` : f}
            </g>
          </svg>`
    )}
          <div class="items" style="--fp-inv-zoom:${1 / v.scale};">
            ${i.areas?.map((u) => this._renderAreaLabel(u, e, n, s))}
            ${i.texts.map((u) => this._renderText(u, e, n, s))}
            ${X(
      // Keyed like the openings above: a floor switch must build fresh
      // nodes rather than morph one floor's badges into another's.
      i.openings.filter((u) => Co(u)),
      (u, _) => `${u.id || _}-shutter`,
      (u) => this._renderShutterMark(u, e, n, s)
    )}
            ${X(
      i.openings.filter((u) => zo(u)),
      (u, _) => `${u.id || _}-opening`,
      (u) => this._renderOpeningMark(u, e, n, s)
    )}
            ${X(
      // No entity filter: devices that exist physically but have no HA
      // entity still deserve their badge (issue #39). Keyed by id so a
      // floor switch builds fresh DOM (see the openings comment).
      // "Only when active" devices drop out here (issue #55) — the
      // editor still draws them, dimmed, so they stay editable.
      i.items.filter(
        (u) => !po(
          u,
          u.entity ? this.hass?.states[u.entity]?.state : void 0
        )
      ),
      (u, _) => u.id || _,
      (u) => this._renderItem(u, e, n, s)
    )}
          </div>
          </div>
          ${v.scale > 1 ? g`<button
                class="zoom-out"
                title="Zoom out"
                aria-label="Zoom out"
                @click=${() => this._zoomedAreaId = void 0}
              >
                <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
              </button>` : f}
          ${w ? g`<div class="plan-title">${e.title}</div>` : f}
          ${t.length > 1 ? this._renderFloorSwitcher(t, i, y) : f}
        </div>
      </ha-card>
    `;
  }
  _renderFloorSwitcher(e, t, i = !1) {
    return g`
      <div class="floor-switcher ${i ? "row" : ""}">
        ${e.map((n) => {
      const o = n.id === t.id ? H(n.color) : void 0;
      return g`
            <button
              class=${n.id === t.id ? "active" : ""}
              title=${n.name}
              style=${o ? `background:${o};border-color:${o};` : f}
              @click=${() => this._goToFloor(e, n.id)}
            >
              ${n.short || n.name}
            </button>
          `;
    })}
      </div>
    `;
  }
};
W._nextWallMaskId = 0;
W._nextGlowId = 0;
W.styles = [
  io,
  qc,
  Yt`
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
        --fp-u: calc(100cqw / var(--fp-plan-w));
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
      display: flex;
      flex-direction: column;
      gap: 4px;
      pointer-events: auto;
      z-index: 1;
    }
    /* Compact chrome (issue #152): the buttons run across the top strip
       instead of down the side, so they share it with the title chip rather
       than each claiming their own band. Wrapped, because a plan with eight
       floors is exactly the case a row is worst at — better a second short
       row than buttons off the edge of the card. Right-aligned so the row
       grows back toward the title rather than through it. */
    .floor-switcher.row {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    /* Room for the title chip on the left, so a long floor name and a long
       title don't meet in the middle — the chip's own max-width leaves the
       same margin from the other side. Only when there *is* a chip: a compact
       card with no title has the whole strip, and reserving 44% of it would
       wrap the buttons for nothing. */
    .stage.compact-title .floor-switcher.row {
      left: 44%;
    }
    .floor-switcher button {
      cursor: pointer;
      border: 1px solid var(--fp-skin-badge-border, var(--divider-color, #ccc));
      background: var(--fp-skin-badge-bg, var(--card-background-color, #fff));
      color: var(--fp-skin-text, var(--primary-text-color));
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 12px;
      line-height: 1;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .floor-switcher button.active {
      background: var(--fp-skin-accent, var(--primary-color, #03a9f4));
      /* Its own ink, not the badge's: this sits on --fp-skin-accent, and the
         skin whose accent wants dark ink is not necessarily the one whose
         active badge does. Left at the theme's text-on-primary, Pastel and
         Tron print near-white on a pale blue and a bright cyan. */
      color: var(--fp-skin-accent-ink, var(--text-primary-color, #fff));
      border-color: var(--fp-skin-accent, var(--primary-color, #03a9f4));
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
    /* A staircase that changes floor (issue #121). The pointer is the whole
       affordance — the symbol already draws an arrow saying which way it
       goes — and it only exists on a piece that has somewhere to lead. */
    .fp-furniture-link {
      cursor: pointer;
    }
    .fp-furniture-link:focus-visible {
      outline: 2px solid var(--fp-skin-accent, var(--primary-color, #03a9f4));
      outline-offset: 2px;
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
      width: ${ot}px;
      height: ${ot}px;
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
       replace it — restating scale(${Qi}) alone would drop the
       counter-scale along with the translate, and a badge held down at 4x
       zoom would balloon to roughly 4x its resting size instead of shrinking. */
    .press-scale .item.interactive {
      transition: transform ${en}ms cubic-bezier(0.2, 0.8, 0.3, 1);
    }
    .press-scale .item.interactive:active {
      transform: translate(-50%, -50%) scale(calc(var(--fp-inv-zoom, 1) * ${Qi}));
      transition-duration: ${Ji}ms;
    }

    /* Flash: drop-shadow rather than a box-shadow or a background, so the halo
       follows whatever the device actually draws — the badge's circle, a bare
       ripple ring, the label — instead of a rectangle around it. */
    .press-flash .item.interactive {
      transition: filter ${en}ms ease-out;
    }
    .press-flash .item.interactive:active {
      filter: drop-shadow(0 0 5px var(--fp-skin-accent, var(--primary-color, #03a9f4)));
      transition-duration: ${Ji}ms;
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
       eye actually pairs up. .inflow (a label-only device) ignores all of
       this — with no badge there is no side to sit on. */
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
    /* Label-only items (showIcon: false) have no badge to hang under, so the
       absolute label would drop to y + 2px on a zero-height item. Put it back
       in flow so it becomes the item's box and centers on (x, y) as before. */
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
      font-size: ${si}px;
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
  `
];
Ue([
  ei({ attribute: !1 })
], W.prototype, "hass", 2);
Ue([
  I()
], W.prototype, "_config", 2);
Ue([
  I()
], W.prototype, "_activeFloorId", 2);
Ue([
  I()
], W.prototype, "_zoomedAreaId", 2);
W = Ue([
  Un("easy-floorplan-card")
], W);
const ye = 26, Sd = 0.75;
function Ad(e, t, i, n = Sd) {
  const o = e.find((l) => l.id === t);
  if (!o) return;
  const r = [];
  i !== 2 && r.push({ x: o.x1, y: o.y1, which: 1 }), i !== 1 && r.push({ x: o.x2, y: o.y2, which: 2 });
  const s = [];
  for (const l of e)
    if (l.id !== o.id)
      for (const a of [1, 2]) {
        const c = a === 1 ? l.x1 : l.x2, h = a === 1 ? l.y1 : l.y2, d = r.find((p) => Math.hypot(c - p.x, h - p.y) <= n);
        d && s.push({ id: l.id, end: a, which: d.which, x0: c, y0: h });
      }
  return s.length ? s : void 0;
}
function Yo(e, t, i, n) {
  let o = null, r = n;
  for (const s of e) {
    const l = Math.hypot(t - s.x, i - s.y);
    l < r && (r = l, o = { x: s.x, y: s.y });
  }
  return o;
}
function Zo(e, t, i, n) {
  const o = e.flatMap((r) => [
    { x: r.x1, y: r.y1 },
    { x: r.x2, y: r.y2 }
  ]);
  return Yo(o, t, i, n);
}
function Ed(e, t, i, n, o) {
  const r = e.walls.flatMap((l) => [
    { x: l.x1, y: l.y1 },
    { x: l.x2, y: l.y2 }
  ]), s = (e.areas ?? []).flatMap(
    (l) => l.points.filter((a, c) => !(o && o.areaId === l.id && o.vertexIndex === c)).map((a) => ({ x: a.x, y: a.y }))
  );
  return Yo([...r, ...s], t, i, n);
}
function Tn(e, t, i) {
  const n = e.areas ?? [];
  for (let o = n.length - 1; o >= 0; o--)
    if (Mi(n[o].points, t, i)) return n[o];
}
function Md(e, t) {
  if (t <= 0) return [];
  const i = Ti(e);
  if (t === 1) return [i];
  const n = e.map((d) => d.x), o = e.map((d) => d.y), r = Math.min(...n), s = Math.max(...n), l = Math.min(...o), a = Math.max(...o), c = Math.max(s - r, 1), h = Math.max(a - l, 1);
  for (let d = 1; d <= 8; d++) {
    const p = t * d, m = Math.max(1, Math.round(Math.sqrt(p * c / h))), v = Math.max(1, Math.ceil(p / m)), y = c / (m + 1), w = h / (v + 1), u = [];
    for (let _ = 1; _ <= v; _++)
      for (let x = 1; x <= m; x++) {
        const A = r + x * y, E = l + _ * w;
        Mi(e, A, E) && u.push({ x: A, y: E });
      }
    if (u.length >= t)
      return Array.from(
        { length: t },
        (_, x) => u[Math.floor(x * u.length / t)]
      );
  }
  return Array.from({ length: t }, (d, p) => {
    const m = p / t * Math.PI * 2, v = Math.min(c, h) * 0.15 * (1 + Math.floor(p / 6));
    return { x: i.x + Math.cos(m) * v, y: i.y + Math.sin(m) * v };
  });
}
function Td(e, t, i, n, o, r, s, l, a = ye) {
  if (s) return { x: r(n), y: r(o) };
  const c = Zo(e, n, o, a);
  if (c) return c;
  const h = n - t, d = o - i, p = Math.tan(l * Math.PI / 180);
  return Math.abs(d) <= Math.abs(h) * p ? { x: r(n), y: i } : Math.abs(h) <= Math.abs(d) * p ? { x: t, y: r(o) } : { x: r(n), y: r(o) };
}
function Id(e, t) {
  const i = Math.min(t.x0, t.x1), n = Math.max(t.x0, t.x1), o = Math.min(t.y0, t.y1), r = Math.max(t.y0, t.y1), s = (a, c) => a >= i && a <= n && c >= o && c <= r, l = [];
  for (const a of e.walls)
    s((a.x1 + a.x2) / 2, (a.y1 + a.y2) / 2) && l.push({ kind: "wall", id: a.id });
  for (const a of e.openings) s(a.x, a.y) && l.push({ kind: "opening", id: a.id });
  for (const a of e.items) s(a.x, a.y) && l.push({ kind: "item", id: a.id });
  for (const a of e.texts) s(a.x, a.y) && l.push({ kind: "text", id: a.id });
  for (const a of e.furniture) s(a.x, a.y) && l.push({ kind: "furniture", id: a.id });
  for (const a of e.trackers ?? [])
    s(a.x + a.w / 2, a.y + a.h / 2) && l.push({ kind: "tracker", id: a.id });
  for (const a of e.areas ?? []) {
    const c = Ti(a.points);
    s(c.x, c.y) && l.push({ kind: "area", id: a.id });
  }
  return l;
}
function Cd(e, t, i, n) {
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
      return r && r.kind === "polygon" ? { ...o, points: r.points.map((s) => ({ x: s.x + t, y: s.y + i })) } : o;
    })
  };
}
const Od = [
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
], Ie = {
  wall: 11,
  /** Padding around an item badge / text box so small glyphs stay grabbable. */
  pad: 4
};
function Ke(e, t, i, n, o) {
  const r = -(o || 0) * Math.PI / 180, s = e - i, l = t - n;
  return { x: s * Math.cos(r) - l * Math.sin(r), y: s * Math.sin(r) + l * Math.cos(r) };
}
function Pd(e, t, i) {
  const n = i.x2 - i.x1, o = i.y2 - i.y1, r = n * n + o * o;
  if (r === 0) return Math.hypot(e - i.x1, t - i.y1);
  let s = ((e - i.x1) * n + (t - i.y1) * o) / r;
  return s = Math.max(0, Math.min(1, s)), Math.hypot(e - (i.x1 + s * n), t - (i.y1 + s * o));
}
function zd(e, t, i, n) {
  const o = [], r = (s, l, a) => o.push({ sel: { kind: s, id: l }, rank: Od.indexOf(s), order: a });
  return e.items.forEach((s, l) => {
    const a = (s.size ?? n.itemSize) / 2 + Ie.pad;
    Math.abs(t - s.x) <= a && Math.abs(i - s.y) <= a && r("item", s.id, l);
  }), e.texts.forEach((s, l) => {
    const a = s.size ?? n.textSize, c = a * 0.6 * Math.max(1, pi(n.hass, s).length) / 2 + Ie.pad, h = a / 2 + Ie.pad, d = Ke(t, i, s.x, s.y, s.angle ?? 0);
    Math.abs(d.x) <= c && Math.abs(d.y) <= h && r("text", s.id, l);
  }), e.openings.forEach((s, l) => {
    const a = Ke(t, i, s.x, s.y, s.angle ?? 0);
    Math.abs(a.x) <= s.length / 2 && Math.abs(a.y) <= n.wallThickness / 2 + Ie.pad && r("opening", s.id, l);
  }), e.furniture.forEach((s, l) => {
    const a = Ke(t, i, s.x, s.y, s.angle ?? 0);
    Math.abs(a.x) <= s.w / 2 && Math.abs(a.y) <= s.h / 2 && r("furniture", s.id, l);
  }), e.walls.forEach((s, l) => {
    Pd(t, i, s) <= Ie.wall && r("wall", s.id, l);
  }), (e.trackers ?? []).forEach((s, l) => {
    const a = Ke(t, i, s.x + s.w / 2, s.y + s.h / 2, s.angle ?? 0);
    Math.abs(a.x) <= s.w / 2 && Math.abs(a.y) <= s.h / 2 && r("tracker", s.id, l);
  }), (e.areas ?? []).forEach((s, l) => {
    Mi(s.points, t, i) && r("area", s.id, l);
  }), o.sort((s, l) => s.rank - l.rank || l.order - s.order).map((s) => s.sel);
}
function Fd(e, t, i) {
  if (!e.length) return null;
  if (!i || t.length !== 1) return e[0];
  const n = e.findIndex((o) => o.kind === t[0].kind && o.id === t[0].id);
  return n < 0 ? e[0] : e[(n + 1) % e.length];
}
const Ld = {
  request: (e) => requestAnimationFrame(e),
  cancel: (e) => cancelAnimationFrame(e)
};
class Dd {
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
const In = "Apply needs Home Assistant's card editor — use Save instead.", Hd = "Save this card once first — it isn't on the dashboard yet.", Rd = 200;
function Nd(e) {
  let t = e;
  for (let i = 0; t && i < Rd; i++) {
    const n = t;
    if (typeof n._params?.saveCardConfig == "function") return n;
    t = t.parentNode ?? t.host ?? null;
  }
  return null;
}
async function jd(e) {
  const t = Nd(e);
  if (!t) return { ok: !1, error: In };
  if (t._params?.isNew) return { ok: !1, error: Hd };
  const i = t._cardConfig;
  if (!i || typeof i != "object")
    return { ok: !1, error: In };
  try {
    await t._params.saveCardConfig(i);
  } catch (n) {
    return { ok: !1, error: `Could not save — ${n instanceof Error ? n.message : String(n)}` };
  }
  return typeof t._markDirtyStateClean == "function" ? t._markDirtyStateClean() : typeof t._dirty == "boolean" && (t._dirty = !1), { ok: !0 };
}
function Cn(e) {
  return "text" in e.selector || "number" in e.selector;
}
function Bd(e, t, i) {
  const n = {};
  for (const o of i)
    t[o.name] !== e[o.name] && (n[o.name] = t[o.name]);
  return n;
}
function On(e, t) {
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
        const s = n.selector.number;
        let l = n.name === "angle" ? (r % 360 + 360) % 360 : r;
        s.min !== void 0 && l < s.min && (l = s.min), s.max !== void 0 && l > s.max && (l = s.max), o = l;
      }
    } else "boolean" in n.selector && (o = !!o);
    i[n.name] = o;
  }
  return i;
}
const ne = (e) => e, Pn = ["binary_sensor", "cover", "lock"];
function q(e, t) {
  return { fields: t.map((n) => e.fields.find((o) => o.name === n)).filter((n) => !!n), data: e.data, toPatch: e.toPatch };
}
const We = () => ({
  name: "angle",
  label: "Angle",
  selector: { number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" } }
}), $ = (e, t) => ({ value: e, label: t }), O = (...e) => ({
  select: { mode: "dropdown", options: e }
});
function Xo(e = V) {
  return Fc(e);
}
function Ud(e, t = V) {
  return _t(t, e)?.name ?? e;
}
function Wd(e, t = () => 0) {
  const i = B(e), n = St(e), o = Le(e), r = [
    { name: "type", label: "Type", selector: O($("door", "Door"), $("window", "Window")) },
    {
      name: "motion",
      label: "Motion",
      selector: O(
        $("swing", "Swing"),
        $("slide", "Slide"),
        // Not "garage / shutter": an external shutter is the Shutter field
        // below, a layer over any opening, and naming it here read as the
        // place to set one up.
        $("roll", "Roll up (garage)")
      )
    },
    { name: "length", label: "Length", required: !0, selector: { number: { min: 1, mode: "box" } } }
  ];
  if (i === "swing") {
    const s = e.type === "door";
    r.push({
      name: "sash",
      label: s ? "Leaves" : "Sashes",
      helper: s ? "Double = two leaves meeting in the middle, hinged at each jamb" : "Single = one full-width sash (issue #73)",
      selector: s ? O($("single", "Single (one leaf)"), $("double", "Double (two leaves)")) : O($("double", "Double (two leaves)"), $("single", "Single sash"))
    });
  }
  return e.type === "door" && r.push({
    name: "glazed",
    label: "Glazed",
    helper: "Lets sunlight through even when shut — a patio or French door",
    selector: { boolean: {} }
  }), r.push({
    name: "sunlight",
    label: "Lets sunlight in",
    helper: "Off makes it wall to the sun — for a solid door the plan draws open",
    selector: { boolean: {} }
  }), i === "swing" && xe(e) === "single" && r.push({
    name: "hinge",
    label: "Hinge",
    selector: O($("left", "Left"), $("right", "Right"))
  }), i === "swing" && r.push({
    name: "opens",
    label: "Opens",
    selector: O($("this", "This side"), $("other", "Other side"))
  }), i === "slide" && (o || r.push({
    name: "slide",
    label: "Slide",
    selector: O($("left", "To left"), $("right", "To right"))
  }), r.push({
    name: "style",
    label: "Style",
    selector: O(
      $("single", "Single"),
      $("bypass", "Bypass (stack)"),
      $("biparting", "Biparting (into the walls)"),
      $("biparting-bypass", "Biparting (over fixed panels)"),
      $("converging", "Converging (both panels stack in the middle)")
    )
  })), r.push({
    name: "entity",
    label: "Entity",
    // Says locks are usable, because nothing else would: a lock is neither a
    // contact nor a cover, and its states are `locked` / `unlocked` rather
    // than anything that looks like open/closed (issue #176).
    helper: o ? "Contact, cover or lock. Drives the first leaf; type and motion follow its device class" : "Contact, cover or lock — a lock reads unlocked as open. Type and motion follow its device class",
    selector: { entity: { filter: [{ domain: Pn }] } }
  }), o && e.entity && r.push({
    name: "secondaryEntity",
    label: "Second leaf",
    helper: "Its own sensor for the other leaf — leave empty to move both together",
    selector: { entity: { filter: [{ domain: Pn }] } }
  }), r.push({
    name: "shutterEntity",
    label: "Shutter",
    helper: "External shutter over this opening — a cover, or a contact sensor",
    selector: { entity: { filter: [{ domain: ["cover", "binary_sensor"] }] } }
  }), e.shutterEntity && (r.push({
    name: "shutterStyle",
    label: "Shutter type",
    helper: "Hinged panels fold back against the wall; roll-up slats disappear upward",
    selector: O($("swing", "Hinged (louvered panels)"), $("roll", "Roll-up (slats)"))
  }), we(e) === "swing" && r.push({
    name: "shutterSide",
    label: "Shutter side",
    helper: "Which side of the wall the panels hang on",
    selector: O($("far", "Away from the sash"), $("near", "Same side as the sash"))
  }), we(e) === "swing" && r.push({
    name: "shutterSecondaryEntity",
    label: "Second shutter panel",
    helper: "Its own contact for the other panel — leave empty to fold both together",
    selector: { entity: { filter: [{ domain: ["binary_sensor", "cover"] }] } }
  }), r.push({
    name: "shutterInvert",
    label: "Invert shutter animation",
    selector: { boolean: {} }
  })), r.push({
    name: "invert",
    label: e.type === "door" ? "Invert door animation" : "Invert window animation",
    helper: e.entity ? void 0 : (
      // Only a swing door draws open with no sensor to ask
      // (openingDefaultOpen) — everything else, door or window, draws shut.
      e.type === "door" && B(e) === "swing" ? "No sensor bound — draws shut instead of open" : "No sensor bound — draws open instead of shut"
    ),
    selector: { boolean: {} }
  }), r.push(We()), e.entity && (r.push({
    name: "showIcon",
    label: "Show icon",
    helper: B(e) === "roll" ? "A raised roll-up leaves only a line — this puts its state beside it, and opens its dialog when tapped" : "Shows this opening's state beside it, and opens its dialog when tapped",
    selector: { boolean: {} }
  }), e.showIcon && r.push({
    name: "icon",
    label: "Icon",
    helper: "Overrides the entity's own icon, which changes with its state",
    selector: { icon: {} }
  })), e.entity && e.shutterEntity && (r.push({
    name: "showShutterIcon",
    label: "Shutter icon",
    helper: "Shows the shutter's state beside the opening, and opens it when tapped",
    selector: { boolean: {} }
  }), (e.showShutterIcon ?? !0) && r.push({
    name: "shutterIcon",
    label: "Icon",
    helper: "Overrides the shutter entity's own icon, which changes with its state",
    selector: { icon: {} }
  }), r.push({
    name: "tapTarget",
    label: "Tap opens",
    helper: "The other one moves to press-and-hold. Opens the dialog; use Tap action below to move the shutter itself",
    selector: O(
      $("opening", e.type === "door" ? "The door" : "The window"),
      $("shutter", "The shutter")
    )
  })), (e.entity || e.shutterEntity) && r.push(
    {
      name: "tap_action",
      label: "Tap action",
      selector: {
        ui_action: {
          default_action: xi(e, "tap", t)?.config.action ?? "none"
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
    fields: r,
    data: {
      type: e.type,
      motion: i,
      length: e.length,
      hinge: e.flipH ? "right" : "left",
      opens: e.flipV ? "other" : "this",
      slide: e.flipH ? "right" : "left",
      style: n,
      sash: xe(e),
      entity: e.entity ?? "",
      secondaryEntity: e.secondaryEntity ?? "",
      glazed: Ei(e),
      sunlight: e.sunlight ?? !0,
      shutterEntity: e.shutterEntity ?? "",
      shutterSecondaryEntity: e.shutterSecondaryEntity ?? "",
      shutterStyle: we(e),
      shutterSide: e.shutterFlipV ? "near" : "far",
      shutterInvert: e.shutterInvert ?? !1,
      showShutterIcon: e.showShutterIcon ?? !0,
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
    toPatch(s) {
      const l = {};
      for (const [a, c] of Object.entries(s))
        if (a === "shutterEntity")
          l.shutterEntity = c, c || (l.shutterStyle = void 0, l.shutterFlipV = void 0, l.shutterInvert = void 0, l.shutterActiveColor = void 0, l.shutterSecondaryEntity = void 0, l.tapTarget = void 0, l.showShutterIcon = void 0, l.shutterIcon = void 0);
        else if (a === "sunlight")
          l.sunlight = c ? void 0 : !1;
        else if (a === "glazed")
          l.glazed = e.type === "door" && c ? !0 : void 0;
        else if (a === "entity")
          l.entity = c, c || (l.showIcon = void 0, l.icon = void 0);
        else if (a === "shutterSide") l.shutterFlipV = c === "near" || void 0;
        else if (a === "shutterInvert") l.shutterInvert = c || void 0;
        else if (a === "tapTarget") l.tapTarget = c === "shutter" ? "shutter" : void 0;
        else if (a === "showShutterIcon") l.showShutterIcon = c ? void 0 : !1;
        else if (a === "showIcon")
          l.showIcon = c ? !0 : void 0, c || (l.icon = void 0);
        else if (a === "motion") {
          const h = c === "slide" || c === "roll" ? c : void 0;
          l.motion = h, c !== "slide" && (l.sliderStyle = void 0), Le({
            ...e,
            motion: h,
            sliderStyle: c === "slide" ? e.sliderStyle : void 0
          }) || (l.secondaryEntity = void 0);
        } else a === "sash" ? (l.sash = c === Rt(e.type) ? void 0 : c, Le({ ...e, sash: c }) || (l.secondaryEntity = void 0)) : a === "shutterStyle" ? (l.shutterStyle = c, c !== "swing" && (l.shutterSecondaryEntity = void 0)) : a === "hinge" || a === "slide" ? l.flipH = c === "right" || void 0 : a === "opens" ? l.flipV = c === "other" || void 0 : a === "style" ? (l.sliderStyle = c === "single" ? void 0 : c, Mo(c) || (l.secondaryEntity = void 0)) : a === "invert" ? l.invert = c || void 0 : l[a] = c;
      return l;
    }
  };
}
function Ii(e, t) {
  return e?.entities.length ? { entity: { include_entities: t && !e.entities.includes(t) ? [...e.entities, t] : e.entities } } : { entity: {} };
}
function Ci(e, t) {
  if (!e?.entities.length) return t;
  const n = `Only entities in ${e.name ? `the ${e.name} area` : "this area"} — turn off “Filter entities” on the area to see all`;
  return t ? `${t}. ${n}` : n;
}
function Je(e) {
  if ((e.display ?? "badge") === "ripple") return "none";
  const t = Be(e);
  if (t !== "icon") return t;
  const i = e.iconAnimation ?? "auto";
  return i === "spin" || i === "pulse" ? i : i === "auto" ? bo(e.entity) ?? "icon" : "icon";
}
function Oi(e) {
  return (e.display ?? "badge") !== "badge";
}
function Qo(e, t) {
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
function Gd(e, t) {
  return {
    fields: [
      {
        name: "entity",
        label: "Entity",
        required: !0,
        helper: Ci(t),
        selector: Ii(t, e.entity)
      },
      {
        name: "attribute",
        label: "Attribute",
        helper: "Show this attribute instead of the state (e.g. current_temperature)",
        selector: { attribute: { entity_id: e.entity } }
      }
    ],
    data: { entity: e.entity ?? "", attribute: e.attribute ?? "" },
    toPatch: ne
  };
}
function qd(e) {
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
    toPatch: ne
  };
}
function Kd(e) {
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
    toPatch: ne
  };
}
function Vd(e) {
  return {
    fields: [
      {
        name: "labelPosition",
        label: "Label position",
        helper: "Beside the badge instead of under it — a long reading then grows one way only",
        selector: O($("below", "Below"), $("left", "Left"), $("right", "Right"))
      },
      {
        name: "labelSize",
        label: "Label size",
        selector: { number: { min: 8, max: 40, step: 1, mode: "slider", unit_of_measurement: "px" } }
      }
    ],
    data: {
      labelPosition: vi(e),
      labelSize: e.labelSize ?? fo
    },
    // Below is the default, so it stays out of the YAML.
    toPatch: (t) => "labelPosition" in t && t.labelPosition === "below" ? { ...t, labelPosition: void 0 } : t
  };
}
function Yd(e, t) {
  const i = [
    {
      name: "badgeMode",
      label: "Badge shows",
      helper: "Animations play only while the entity is active. Value puts the reading in the badge, falling back to the icon when there is no number",
      selector: O(
        $("icon", "Icon, still"),
        $("spin", "Icon, spinning"),
        $("pulse", "Icon, pulsing"),
        $("value", "Value"),
        $("none", "Nothing")
      )
    }
  ], n = he(e);
  return Je(e) === "value" && n.length && i.push({
    name: "badgeEntity",
    label: "Badge reads",
    helper: "Which of this device's readings the badge shows",
    selector: O(
      $("primary", t?.primaryLabel || e.entity || "Main entity"),
      ...n.map(
        (o, r) => $(
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
    We()
  ), {
    fields: i,
    data: {
      badgeMode: Je(e),
      // The dropdown's values are strings, so the stored index (or the legacy
      // "secondary") is spelled the same way here; toPatch turns it back into
      // a number. Opens on what the badge is *actually* reading when nothing
      // is chosen, which is the whole point of badgeSource (issue #136).
      badgeEntity: String(So(e.badgeEntity) ?? t?.source ?? "primary"),
      size: e.size ?? le,
      angle: e.angle ?? 0
    },
    // "Badge shows" is the editor's spelling of three config keys (issue
    // #127) — expand it back, carrying the ripple state off the item since
    // that control lives in another group now.
    toPatch: (o) => {
      let r = o;
      if ("badgeEntity" in r && typeof r.badgeEntity == "string" && r.badgeEntity !== "primary" && (r = { ...r, badgeEntity: Number(r.badgeEntity) }), !("badgeMode" in r)) return r;
      const { badgeMode: s, ...l } = r;
      return {
        ...l,
        ...Qo(s ?? Je(e), Oi(e))
      };
    }
  };
}
function Zd(e, t) {
  const i = Oi(e), n = wo(e.entity, t), o = e.kind === "light" || e.entity?.startsWith("light.");
  if (!n && !o) return;
  const r = [];
  return n && (r.push({
    name: "ripple",
    label: "Ripple",
    // "Detected" rather than "the sensor is on": this is offered to a
    // device_tracker and a person too, and neither of those is a sensor.
    // It stays vague about *what* is detected because a vibration sensor
    // rings for a knock, not for presence (issue #202).
    helper: "Draws a pulsing ring while this device detects something",
    selector: { boolean: {} }
  }), i && r.push({
    name: "rippleSize",
    label: "Ripple size",
    selector: {
      number: { min: 40, max: 400, step: 4, mode: "slider", unit_of_measurement: "px" }
    }
  })), o && (r.push({
    name: "glow",
    label: "Cast light",
    helper: "Pools the light's own color onto the plan; overlapping lights mix",
    selector: { boolean: {} }
  }), e.glow && r.push(
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
    }
  )), {
    fields: r,
    data: {
      ripple: i,
      rippleSize: e.rippleSize ?? bt,
      glow: e.glow ?? !1,
      glowRadius: e.glowRadius ?? yt,
      glowColor: e.glowColor ?? ""
    },
    // "Ripple" is the other half of #127's three-key spelling — same expansion
    // as the badge group's, with the badge mode read off the item.
    toPatch: (s) => {
      if (!("ripple" in s)) return s;
      const { ripple: l, ...a } = s;
      return { ...a, ...Qo(Je(e), !!l) };
    }
  };
}
function Xd(e) {
  const t = [
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
    toPatch: ne
  };
}
function Qd(e) {
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
        selector: { ui_action: { default_action: Xn(e.entity).action } }
      },
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
      hold_action: e.hold_action,
      double_tap_action: e.double_tap_action
    },
    toPatch: ne
  };
}
function Jd(e, t) {
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
      helper: Ci(t, "Shows this entity's value, formatted as HA formats it"),
      selector: Ii(t, e.entity)
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
    We()
  ), {
    fields: i,
    data: {
      text: e.text ?? "",
      entity: e.entity ?? "",
      attribute: e.attribute ?? "",
      size: e.size ?? ze,
      angle: e.angle ?? 0
    },
    toPatch: (n) => "entity" in n && !n.entity ? { ...n, attribute: void 0 } : n
  };
}
function eu(e, t, i = V) {
  const n = Xo(i);
  return {
    fields: [
      {
        name: "type",
        label: "Type",
        selector: { select: { mode: "dropdown", options: n.some((r) => r.id === e.type) ? n.map((r) => ({ value: r.id, label: r.name })) : [{ value: e.type, label: `${e.type} (missing)` }, ...n.map((r) => ({ value: r.id, label: r.name }))] } }
      },
      // L-shaped sectional only (#40): which side the chaise extends on,
      // facing the sofa from the front. Conditional, in the same shape
      // openingForm uses for its hinge / slide fields.
      ...e.type === "sectional" ? [
        {
          name: "hand",
          label: "Chaise side",
          helper: "Facing the sofa from the front",
          selector: O($("right", "right"), $("left", "left"))
        }
      ] : [],
      { name: "w", label: "Width", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "h", label: "Height", required: !0, selector: { number: { min: 10, mode: "box" } } },
      We(),
      // Optional entity that makes the drawing live (issue #82) — a soil
      // sensor on a plant, a contact sensor on a cabinet. Last, because most
      // furniture is decoration and never binds anything.
      {
        name: "entity",
        label: "Entity",
        helper: Ci(t, "Optional — lets the drawing change color with a sensor"),
        selector: Ii(t, e.entity)
      },
      // Clicking it changes floor (issue #121). Offered on any piece rather
      // than only on the built-in `stairs`, because a plan can draw its own
      // staircase and a rule keyed on one symbol id would leave those out.
      // Empty on everything by default, so it is a row and not a nag.
      {
        name: "goToFloor",
        label: "Go to floor",
        helper: "Clicking this piece changes floor — for a staircase",
        selector: O($("", "Nothing"), $("up", "Up one floor"), $("down", "Down one floor"))
      }
    ],
    data: {
      type: e.type,
      ...e.type === "sectional" ? { hand: e.hand ?? "right" } : {},
      w: e.w,
      h: e.h,
      angle: e.angle ?? 0,
      entity: e.entity ?? "",
      goToFloor: e.goToFloor ?? ""
    },
    // "" is the empty option, and means the piece is ordinary furniture.
    toPatch: (r) => "goToFloor" in r && !r.goToFloor ? { ...r, goToFloor: void 0 } : r
  };
}
function tu(e) {
  return {
    fields: [
      { name: "w", label: "Width", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "h", label: "Height", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "x", label: "X", required: !0, selector: { number: { mode: "box" } } },
      { name: "y", label: "Y", required: !0, selector: { number: { mode: "box" } } },
      We(),
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
      dotSize: e.dotSize ?? ai
    },
    toPatch: ne
  };
}
function iu(e, t = []) {
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
    toPatch: ne
  };
}
function nu(e) {
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
          selector: O(
            $("fill", "Fill"),
            $("border", "Border only"),
            $("both", "Fill and border")
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
      labelSize: e.labelSize ?? si,
      opacity: e.opacity ?? zt,
      entity: e.entity ?? "",
      activeOpacity: e.activeOpacity ?? e.opacity ?? zt,
      highlight: e.highlight ?? "fill",
      tap_action: e.tap_action,
      hold_action: e.hold_action,
      double_tap_action: e.double_tap_action
    },
    // "fill" is the default, so keep it out of the YAML.
    toPatch: (t) => "highlight" in t && t.highlight === "fill" ? { ...t, highlight: void 0 } : t
  };
}
function ou(e) {
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
          number: { min: 2, max: eo, step: 1, mode: "slider", unit_of_measurement: "px" }
        }
      }
    ],
    data: {
      x1: Math.round(e.x1),
      y1: Math.round(e.y1),
      x2: Math.round(e.x2),
      y2: Math.round(e.y2),
      thickness: e.thickness ?? F
    },
    // Keep the default out of the YAML so untouched walls stay terse.
    toPatch: (i) => "thickness" in i && i.thickness === F ? { ...i, thickness: void 0 } : i
  };
}
function ru(e) {
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
    data: { title: e.title ?? "", width: e.width, height: e.height, grid: e.grid ?? li },
    toPatch: ne
  };
}
function su(e) {
  return {
    fields: [
      {
        name: "pressEffect",
        label: "Press effect",
        helper: "Feedback when a device is pressed. Only devices that do something respond",
        selector: O(
          $("scale", "Press in"),
          $("ripple", "Ink ripple"),
          $("flash", "Flash"),
          $("none", "None")
        )
      }
    ],
    data: { pressEffect: Ye(e) },
    // The default stays out of the YAML, as the skin's does.
    toPatch: (t) => "pressEffect" in t && t.pressEffect === Kn ? { ...t, pressEffect: void 0 } : t
  };
}
function au(e) {
  const t = di(e.skin) ?? at[0];
  return {
    fields: [
      {
        name: "skin",
        label: "Skin",
        helper: t.description,
        selector: O(...at.map((i) => $(i.id, i.label)))
      }
    ],
    // An id we don't ship reads back as Default, matching what it renders as.
    data: { skin: t.id },
    toPatch: (i) => (
      // Default is the absence of a skin, so it stays out of the YAML.
      "skin" in i && i.skin === $t ? { ...i, skin: void 0 } : i
    )
  };
}
function lu(e) {
  return {
    fields: [
      {
        name: "rotation",
        label: "Rotate display",
        helper: "Rotates the live card only — editing stays as drawn",
        selector: O($("0", "0°"), $("90", "90°"), $("180", "180°"), $("270", "270°"))
      },
      {
        name: "overlayScale",
        label: "Badge & label size",
        // Canvas units lead because they are what a plan wants and what a new
        // plan is created with; fixed pixels are what an older plan is still
        // laid out in, and the right answer for a card shown bigger than its
        // canvas or a wall tablet that wants a px floor under its text.
        helper: `Canvas units scale badges and labels with the drawing. Fixed pixels keep their size whatever width the card gets — suits a card rendered larger than its ${e.width}-wide canvas, or a wall tablet`,
        selector: O($("plan", "Canvas units"), $("fixed", "Fixed pixels"))
      },
      {
        name: "compactHeader",
        label: "Compact header",
        // Says what it costs as well as what it saves — the title lands on the
        // drawing, and on a plan that fills the card that is a real trade.
        helper: "Draws the title inside the plan and the floor buttons in a row, instead of spending a header row on them",
        selector: { boolean: {} }
      },
      {
        name: "offlineStyle",
        label: "Offline devices",
        helper: "How a device is drawn when its entity is unavailable or missing",
        selector: O(
          $("dim", "Dimmed"),
          $("strike", "Dimmed and crossed out"),
          $("none", "No different")
        )
      }
    ],
    data: {
      rotation: String(Ro(e.rotation)),
      overlayScale: wi(e.overlayScale),
      compactHeader: e.compactHeader ?? !1,
      offlineStyle: xo(e)
    },
    toPatch: (t) => {
      let i = t;
      return "rotation" in i && (i = { ...i, rotation: i.rotation === "0" ? void 0 : Number(i.rotation) }), "compactHeader" in i && !i.compactHeader && (i = { ...i, compactHeader: void 0 }), "offlineStyle" in i && i.offlineStyle === Vn && (i = { ...i, offlineStyle: void 0 }), i;
    }
  };
}
function cu(e) {
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
function hu(e) {
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
      sunBrightnessMin: e.sunBrightnessMin ?? ri,
      sunBrightnessMax: e.sunBrightnessMax ?? it
    },
    // Off is the default, so keep the whole feature out of the YAML until it
    // is switched on — including the two sliders it drags along with it.
    toPatch: (i) => "sunDimming" in i && !i.sunDimming ? { ...i, sunDimming: void 0, sunBrightnessMin: void 0, sunBrightnessMax: void 0 } : i
  };
}
function du(e) {
  const t = [
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
  ), typeof e.sunBearing == "number" && t.push({
    name: "sunBearing",
    label: "Sun from",
    helper: "Compass bearing of the light: 0 = north, 90 = east, 180 = south",
    selector: {
      number: { min: 0, max: 359, step: 5, mode: "slider", unit_of_measurement: "°" }
    }
  })), {
    fields: t,
    data: {
      sunlight: e.sunlight ?? !1,
      sunShade: e.sunShade ?? !0,
      north: e.north ?? 0,
      sunReach: e.sunReach ?? ut,
      sunFollows: typeof e.sunBearing != "number",
      sunBearing: e.sunBearing ?? jt
    },
    toPatch: (i) => {
      const n = { ...i };
      return "sunlight" in n && !n.sunlight ? {
        ...n,
        sunlight: void 0,
        north: void 0,
        sunBearing: void 0,
        sunReach: void 0,
        sunShade: void 0,
        sunlightColor: void 0,
        sunShadeColor: void 0
      } : ("sunFollows" in n && (n.sunBearing = n.sunFollows ? void 0 : e.sunBearing ?? jt, delete n.sunFollows), "north" in n && !n.north && (n.north = void 0), "sunReach" in n && n.sunReach === ut && (n.sunReach = void 0), "sunShade" in n && n.sunShade && (n.sunShade = void 0), n);
    }
  };
}
function uu(e) {
  const t = [
    { name: "image", label: "Bg image", helper: "/local/floorplan.png or URL", selector: { text: {} } }
  ];
  return e.image && (t.push({
    name: "imageFit",
    label: "Image fit",
    helper: "Per floor, so scans of different resolutions can each fit properly",
    selector: O(
      $("stretch", "Stretch to canvas (may distort)"),
      $("contain", "Fit inside (keep proportions)"),
      $("cover", "Fill canvas (keep proportions, crop)")
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
var pu = Object.defineProperty, fu = Object.getOwnPropertyDescriptor, M = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? fu(t, i) : t, r = e.length - 1, s; r >= 0; r--)
    (s = e[r]) && (o = (n ? s(t, i, o) : s(o)) || o);
  return n && o && pu(t, i, o), o;
};
const gu = (e) => e.label, mu = (e) => e.helper, Pt = {
  select: { icon: "mdi:cursor-default", label: "Select" },
  wall: { icon: "mdi:wall", label: "Wall" },
  door: { icon: "mdi:door", label: "Door" },
  window: { icon: "mdi:window-closed-variant", label: "Window" },
  tracker: { icon: "mdi:crosshairs-gps", label: "Tracker" },
  area: { icon: "mdi:vector-polygon", label: "Area" }
}, yu = {
  wall: "mdi:wall",
  opening: "mdi:door",
  item: "mdi:lightbulb-outline",
  text: "mdi:format-text",
  furniture: "mdi:sofa-outline",
  tracker: "mdi:crosshairs-gps",
  area: "mdi:floor-plan"
}, zn = 35, bu = 8, vu = 2e3, wu = 10;
function Fn(e) {
  return e.some((t) => {
    const i = t, n = i.tagName?.toLowerCase();
    return n === "input" || n === "textarea" || n === "select" || n === "ha-form" || n === "ha-entity-picker" || n === "ha-icon-picker" || i.isContentEditable === !0;
  });
}
let S = class extends be {
  constructor() {
    super(...arguments), this._wallMaskId = `fp-edit-wall-mask-${S._nextWallMaskId++}`, this._watchedEntities = /* @__PURE__ */ new Set(), this._tool = "select", this._selection = [], this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaHover = null, this._freeWalls = !1, this._defaultOpeningLength = 60, this._marquee = null, this._history = [], this._future = [], this._zoom = 1, this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "", this._symbolDraft = "", this._symbolError = "", this._projectOpen = !1, this._openGroups = /* @__PURE__ */ new Set(), this._fullscreen = !1, this._applyState = "idle", this._applyError = "", this._applyResetTimer = null, this._drag = null, this._dragMoves = new Dd(Ld, (e) => {
      this._drag && this._applyDrag(e);
    }), this._dragDirty = !1, this._pickAnchor = null, this._hideLabels = !1, this._pinchPts = /* @__PURE__ */ new Map(), this._pinch = null, this._gesturePointer = null, this._marqueeAdd = !1, this._clipboard = null, this._onKeyDown = (e) => this._handleKeyDown(e), this._onHostKeyDown = (e) => {
      e.key !== "Escape" || !this._fullscreen || Fn(e.composedPath()) && (e.preventDefault(), e.stopPropagation(), this._canvasWrap?.focus({ preventScroll: !0 }));
    }, this._onFocusIn = (e) => {
      this._fullscreen && !e.composedPath().includes(this) && (this._fullscreen = !1);
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
        const r = o.getBoundingClientRect(), s = this._zoom / n.z0;
        o.scrollLeft = n.cx * s - ((t.x + i.x) / 2 - r.left), o.scrollTop = n.cy * s - ((t.y + i.y) / 2 - r.top);
      });
    }, this._onWrapPointerEnd = (e) => {
      e.pointerType === "touch" && (this._pinchPts.delete(e.pointerId), this._pinchPts.size < 2 && (this._pinch = null));
    }, this._liveEditKey = null, this._onEditorPointerDown = () => {
      this._liveEditKey = null;
    }, this._gridCache = null, this._apply = async () => {
      if (this._applyState === "saving") return;
      this._applyResetTimer !== null && clearTimeout(this._applyResetTimer), this._applyState = "saving", this._applyError = "", await this.updateComplete, await new Promise((t) => setTimeout(t, 0));
      const e = await jd(this);
      if (!e.ok) {
        this._applyState = "idle", this._applyError = e.error;
        return;
      }
      this._applyState = "saved", this._applyResetTimer = setTimeout(() => {
        this._applyResetTimer = null, this._applyState = "idle";
      }, vu);
    }, this._addSymbol = () => {
      let e;
      try {
        e = JSON.parse(this._symbolDraft);
      } catch (n) {
        this._symbolError = `Not valid JSON — ${n.message}`;
        return;
      }
      const t = [], i = wt(e, void 0, t);
      if (!i) {
        this._symbolError = t[0] ?? "Not a usable symbol.";
        return;
      }
      this._patchConfig({ symbols: { ...this._config.symbols ?? {}, [i.id]: e } }), this._symbolDraft = "", this._symbolError = "";
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", this._onKeyDown, !0), this.addEventListener("keydown", this._onHostKeyDown), window.addEventListener("focusin", this._onFocusIn);
  }
  disconnectedCallback() {
    window.removeEventListener("keydown", this._onKeyDown, !0), this.removeEventListener("keydown", this._onHostKeyDown), window.removeEventListener("focusin", this._onFocusIn), this._applyResetTimer !== null && clearTimeout(this._applyResetTimer), this._dragMoves.cancel(), this._flushDrag(), this._drag = null, this._gesturePointer = null, this._resetPinch(), super.disconnectedCallback();
  }
  setConfig(e) {
    const t = { ...Zr(e.type || "custom:easy-floorplan-card"), ...e }, i = rt(t).map((n) => structuredClone(n));
    this._config = {
      ...t,
      floors: i,
      walls: [],
      openings: [],
      items: [],
      texts: [],
      furniture: [],
      trackers: []
    }, (!this._activeFloorId || !i.some((n) => n.id === this._activeFloorId)) && (this._activeFloorId = t.defaultFloor && i.some((n) => n.id === t.defaultFloor) ? t.defaultFloor : i[0].id), this._lastEmitted && e !== this._lastEmitted && !Ft(e, this._lastEmitted) && (this._history = [], this._future = [], this._liveEditKey = null), this._watchedEntities = Ce(this._config);
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
    return i(t) !== i(this.hass) ? !0 : oo(t, this.hass, this._watchedEntities);
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
    return Dt(this._config.symbols);
  }
  /** Discrete change to the active floor's elements (snapshots for undo). */
  _commitFloor(e) {
    this._commit({ ...this._config, floors: this._patchFloors(e) });
  }
  /** Live change to the active floor's elements (no history snapshot — for dragging). */
  _emitFloor(e) {
    const t = { ...this._config, floors: this._patchFloors(e) };
    if (this._drag) {
      this._config = t, this._watchedEntities = Ce(t), this._dragDirty = !0;
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
    this._ensureHaComponents();
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
    return this._config.grid ?? li;
  }
  /**
   * Resolved placement snap step. `snap` is tri-state in the config: unset
   * means "follow the grid" (the default behaviour), `0` is free placement,
   * any other number is a custom step. See {@link resolveSnap}.
   */
  get _resolvedSnap() {
    return Gr(this._config.snap, this.grid);
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
        snap: t && t > 0 ? t : Tt(rn, this.grid)
      });
    }
  }
  /** Grid update plus a custom-snap rescale so its percentage of the grid is preserved. */
  _gridPatch(e) {
    const t = { grid: e };
    if (this._snapMode === "custom") {
      const i = sn(this._config.snap, this.grid);
      t.snap = Tt(i, e);
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
    return Zo(this._floor().walls, e, t, ye);
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
    return Ed(this._floor(), e, t, ye, i) ?? {
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
    let n = null, o = ye;
    for (const r of this._floor().walls)
      for (const s of [1, 2]) {
        if (i.has(`${r.id}:${s}`)) continue;
        const l = s === 1 ? r.x1 : r.x2, a = s === 1 ? r.y1 : r.y2, c = Math.hypot(e - l, t - a);
        c < o && (o = c, n = { x: l, y: a });
      }
    return n ?? { x: this._snap(e), y: this._snap(t) };
  }
  /** See {@link snapWallEnd}: corners win, then axis gravity, then the snap step. */
  _snapWallEnd(e, t, i, n) {
    return Td(
      this._floor().walls,
      e,
      t,
      i,
      n,
      (o) => this._snap(o),
      this._freeWalls,
      wu,
      ye
    );
  }
  _emit(e) {
    this._drag && (this._drag.emitted = !0), this._config = e, this._watchedEntities = Ce(e);
    const t = { ...e };
    for (const i of ["walls", "openings", "items", "texts", "furniture", "trackers", "areas"])
      t[i]?.length || delete t[i];
    this._lastEmitted = t, this.dispatchEvent(
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
    this._history = this._history.slice(0, -1), this._selection = [], this._emit(e);
  }
  _redo() {
    if (this._liveEditKey = null, !this._future.length) return;
    this._history = [...this._history, structuredClone(this._config)];
    const e = this._future[0];
    this._future = this._future.slice(1), this._selection = [], this._emit(e);
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
    if (Fn(i)) return;
    const n = e.ctrlKey || e.metaKey, o = e.key.toLowerCase(), r = !!(this._drag || this._draft || this._draftTracker || this._draftArea || this._marquee);
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
      this._draft || this._draftTracker || this._draftArea || this._marquee || this._drag ? (e.preventDefault(), e.stopPropagation(), this._cancelGesture()) : this._selection.length ? (e.preventDefault(), e.stopPropagation(), this._clearSel()) : this._fullscreen && (e.preventDefault(), e.stopPropagation(), this._fullscreen = !1);
      return;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && this._selection.length) {
      e.preventDefault(), this._deleteSelected();
      return;
    }
    if (!this._selection.length) return;
    const l = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1]
    }[e.key];
    if (!l) return;
    e.preventDefault();
    const a = e.shiftKey ? this.grid : this._resolvedSnap || 1;
    this._nudge(l[0] * a, l[1] * a);
  }
  _nudge(e, t) {
    if (!this._selection.length) return;
    const i = this._floor(), n = this._idsOfKind("wall"), o = this._idsOfKind("opening"), r = this._idsOfKind("item"), s = this._idsOfKind("text"), l = this._idsOfKind("furniture"), a = this._idsOfKind("tracker"), c = this._idsOfKind("area");
    this._commitFloor({
      walls: i.walls.map(
        (h) => n.has(h.id) ? { ...h, x1: h.x1 + e, y1: h.y1 + t, x2: h.x2 + e, y2: h.y2 + t } : h
      ),
      openings: i.openings.map((h) => o.has(h.id) ? { ...h, x: h.x + e, y: h.y + t } : h),
      items: i.items.map((h) => r.has(h.id) ? { ...h, x: h.x + e, y: h.y + t } : h),
      texts: i.texts.map((h) => s.has(h.id) ? { ...h, x: h.x + e, y: h.y + t } : h),
      furniture: i.furniture.map(
        (h) => l.has(h.id) ? { ...h, x: h.x + e, y: h.y + t } : h
      ),
      trackers: (i.trackers ?? []).map(
        (h) => a.has(h.id) ? { ...h, x: h.x + e, y: h.y + t } : h
      ),
      areas: (i.areas ?? []).map(
        (h) => c.has(h.id) ? { ...h, points: h.points.map((d) => ({ x: d.x + e, y: d.y + t })) } : h
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
    if (this._tool === "door" || this._tool === "window") {
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
      if (!this._draftArea) {
        this._draftArea = { points: [i] };
        return;
      }
      const n = this._draftArea.points, o = n[0];
      if (n.length >= 3 && Math.hypot(i.x - o.x, i.y - o.y) <= ye) {
        this._finishArea();
        return;
      }
      const r = n[n.length - 1];
      (i.x !== r.x || i.y !== r.y) && (this._draftArea = { points: [...n, i] });
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
    this._dragMoves.cancel(), this._dragDirty = !1, this._gesturePointer = null, this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaHover = null, this._marquee = null;
    const e = this._drag;
    this._drag = null, e?.moved && e.snapshot && (this._history = this._history.filter((t) => t !== e.snapshot), e.emitted ? this._emit(e.snapshot) : (this._config = e.snapshot, this._watchedEntities = Ce(e.snapshot)), this._future = e.priorFuture ?? []);
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
      if (e.buttons === 0 && (this._drag || this._draft || this._draftTracker || this._marquee)) {
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
          const i = { id: D("wall"), ...t };
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
    return Id(this._floor(), e);
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
    const i = this._toVirtual(e, !1), n = zd(this._floor(), i.x, i.y, {
      itemSize: le,
      textSize: ze,
      wallThickness: F,
      hass: this.hass
    }), o = !!this._pickAnchor && Math.hypot(e.clientX - this._pickAnchor.clientX, e.clientY - this._pickAnchor.clientY) <= bu;
    return this._pickAnchor = { clientX: e.clientX, clientY: e.clientY }, Fd(n, this._selection, o) ?? t;
  }
  _startDrag(e, t, i, n) {
    if (this._tool !== "select" || (e.stopPropagation(), this._gesturePointer !== null)) return;
    this._canvasWrap?.focus({ preventScroll: !0 });
    const o = i != null || n != null, r = o ? t : this._resolvePick(e, t);
    o ? this._selectOne(r) : this._selectForPointer(e, r), this._drag = {
      primary: r,
      start: this._toVirtual(e, !1),
      orig: this._snapshotSelection(),
      endpoint: i,
      areaVertex: n
    }, r.kind === "wall" && (this._drag.attached = this._attachedCorners(r.id, i)), this._gesturePointer = e.pointerId, this._capturePointer(e);
  }
  /** See {@link attachedCorners}: shared room corners that stretch with this wall. */
  _attachedCorners(e, t) {
    return Ad(this._floor().walls, e, t);
  }
  /** Capture the start positions of every selected element on the active floor. */
  _snapshotSelection() {
    const e = this._floor(), t = /* @__PURE__ */ new Map();
    for (const i of this._selection)
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
  _applyDrag(e) {
    const t = this._drag;
    if (!t.moved) {
      if (Math.hypot(e.x - t.start.x, e.y - t.start.y) <= 4) return;
      t.moved = !0, t.priorFuture = this._future, this._pushHistory(), t.snapshot = this._history[this._history.length - 1];
    }
    const i = this._floor();
    if (t.endpoint) {
      const c = e.altKey ? [] : t.attached ?? [], h = /* @__PURE__ */ new Set([
        `${t.primary.id}:${t.endpoint}`,
        ...c.map((m) => `${m.id}:${m.end}`)
      ]), d = this._snapWallPointExcluding(e.x, e.y, h), p = i.walls.map((m) => {
        let v = m;
        m.id === t.primary.id && (v = t.endpoint === 1 ? { ...v, x1: d.x, y1: d.y } : { ...v, x2: d.x, y2: d.y });
        for (const y of c)
          y.id === m.id && (v = y.end === 1 ? { ...v, x1: d.x, y1: d.y } : { ...v, x2: d.x, y2: d.y });
        return v;
      });
      this._emitFloor({ walls: p });
      return;
    }
    if (t.primary.kind === "area" && t.areaVertex != null) {
      const c = t.areaVertex, h = this._snapAreaPoint(e.x, e.y, { areaId: t.primary.id, vertexIndex: c }), d = (i.areas ?? []).map(
        (p) => p.id === t.primary.id ? { ...p, points: p.points.map((m, v) => v === c ? h : m) } : p
      );
      this._emitFloor({ areas: d });
      return;
    }
    if (this._selection.length === 1 && t.primary.kind === "opening") {
      const c = t.orig.get(`opening:${t.primary.id}`);
      if (c && c.kind === "pt") {
        const h = c.x + (e.x - t.start.x), d = c.y + (e.y - t.start.y), p = An(h, d, i.walls, zn), m = i.openings.map(
          (v) => v.id === t.primary.id ? p ? { ...v, x: p.x, y: p.y, angle: p.angle } : { ...v, x: this._snap(h), y: this._snap(d) } : v
        );
        this._emitFloor({ openings: m });
        return;
      }
    }
    const n = t.orig.get(`${t.primary.kind}:${t.primary.id}`);
    if (!n) return;
    const o = n.kind === "wall" ? n.x1 : n.kind === "polygon" ? n.points[0].x : n.x, r = n.kind === "wall" ? n.y1 : n.kind === "polygon" ? n.points[0].y : n.y, s = this._snap(o + (e.x - t.start.x)) - o, l = this._snap(r + (e.y - t.start.y)) - r;
    let a = this._applyDelta(s, l, t.orig);
    if (t.attached?.length && !e.altKey) {
      const c = (a.walls ?? i.walls).map((h) => {
        let d = h;
        for (const p of t.attached)
          p.id !== h.id || t.orig.has(`wall:${p.id}`) || (d = p.end === 1 ? { ...d, x1: p.x0 + s, y1: p.y0 + l } : { ...d, x2: p.x0 + s, y2: p.y0 + l });
        return d;
      });
      a = { ...a, walls: c };
    }
    this._emitFloor(a);
  }
  /** Translate every snapshotted element by (dx, dy). */
  _applyDelta(e, t, i) {
    return Cd(this._floor(), e, t, i);
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
    const n = this._floor(), o = An(t, i, n.walls, zn), r = {
      id: D(e),
      type: e,
      x: o?.x ?? t,
      y: o?.y ?? i,
      // User-editable from the door/window context bar so opening size can be
      // set BEFORE placing (the previous hardcoded 60 forced place-then-resize).
      length: this._defaultOpeningLength,
      angle: o?.angle ?? 0
    };
    this._commitFloor({ openings: [...n.openings, r] }), this._selection = [{ kind: "opening", id: r.id }], this._tool = "select";
  }
  _addItem(e) {
    const t = {
      id: D("item"),
      entity: "",
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      kind: e,
      showState: e === "sensor",
      showIcon: !0,
      size: le
    };
    this._commitFloor({ items: [...this._floor().items, t] }), this._selection = [{ kind: "item", id: t.id }], this._tool = "select";
  }
  _addFurniture(e) {
    const t = Dc(e, this._symbols()), i = {
      id: D("furn"),
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
      id: D("tracker"),
      x: e,
      y: t,
      w: i,
      h: n,
      angle: 0,
      dotSize: ai
    };
    this._commitFloor({ trackers: [...this._floor().trackers ?? [], o] }), this._selection = [{ kind: "tracker", id: o.id }], this._tool = "select";
  }
  /** Close the in-progress Area draft into a committed polygon and select it. */
  _finishArea() {
    if (!this._draftArea || this._draftArea.points.length < 3) return;
    const e = { id: D("area"), points: this._draftArea.points, showName: !0 };
    this._commitFloor({ areas: [...this._floor().areas ?? [], e] }), this._selection = [{ kind: "area", id: e.id }], this._draftArea = null, this._areaHover = null, this._tool = "select";
  }
  _addText() {
    const e = {
      id: D("text"),
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      text: "Label",
      size: ze
    };
    this._commitFloor({ texts: [...this._floor().texts, e] }), this._selection = [{ kind: "text", id: e.id }], this._tool = "select";
  }
  _deleteSelected() {
    if (!this._selection.length) return;
    const e = this._floor(), t = this._idsOfKind("wall"), i = this._idsOfKind("opening"), n = this._idsOfKind("item"), o = this._idsOfKind("text"), r = this._idsOfKind("furniture"), s = this._idsOfKind("tracker"), l = this._idsOfKind("area");
    this._commitFloor({
      walls: e.walls.filter((a) => !t.has(a.id)),
      openings: e.openings.filter((a) => !i.has(a.id)),
      items: e.items.filter((a) => !n.has(a.id)),
      texts: e.texts.filter((a) => !o.has(a.id)),
      furniture: e.furniture.filter((a) => !r.has(a.id)),
      trackers: (e.trackers ?? []).filter((a) => !s.has(a.id)),
      areas: (e.areas ?? []).filter((a) => !l.has(a.id))
    }), this._clearSel();
  }
  // ---- clipboard (copy / paste / duplicate) ------------------------------
  _copy() {
    if (!this._selection.length) return;
    const e = this._floor(), t = this._idsOfKind("wall"), i = this._idsOfKind("opening"), n = this._idsOfKind("item"), o = this._idsOfKind("text"), r = this._idsOfKind("furniture"), s = this._idsOfKind("tracker"), l = this._idsOfKind("area");
    this._clipboard = structuredClone({
      walls: e.walls.filter((a) => t.has(a.id)),
      openings: e.openings.filter((a) => i.has(a.id)),
      items: e.items.filter((a) => n.has(a.id)),
      texts: e.texts.filter((a) => o.has(a.id)),
      furniture: e.furniture.filter((a) => r.has(a.id)),
      trackers: (e.trackers ?? []).filter((a) => s.has(a.id)),
      areas: (e.areas ?? []).filter((a) => l.has(a.id))
    });
  }
  /** Paste the clipboard onto the active floor, offset by one snap step, with fresh ids. */
  _paste() {
    if (!this._clipboard) return;
    const e = structuredClone(this._clipboard), t = this._resolvedSnap || this.grid, i = this._floor(), n = e.walls.map((h) => ({
      ...h,
      id: D("wall"),
      x1: h.x1 + t,
      y1: h.y1 + t,
      x2: h.x2 + t,
      y2: h.y2 + t
    })), o = e.openings.map((h) => ({
      ...h,
      id: D(h.type),
      x: h.x + t,
      y: h.y + t
    })), r = e.items.map((h) => ({
      ...h,
      id: D("item"),
      x: h.x + t,
      y: h.y + t
    })), s = e.texts.map((h) => ({
      ...h,
      id: D("text"),
      x: h.x + t,
      y: h.y + t
    })), l = e.furniture.map((h) => ({
      ...h,
      id: D("furn"),
      x: h.x + t,
      y: h.y + t
    })), a = (e.trackers ?? []).map((h) => ({
      ...h,
      id: D("tracker"),
      x: h.x + t,
      y: h.y + t
    })), c = (e.areas ?? []).map((h) => ({
      ...h,
      id: D("area"),
      points: h.points.map((d) => ({ x: d.x + t, y: d.y + t }))
    }));
    this._commitFloor({
      walls: [...i.walls, ...n],
      openings: [...i.openings, ...o],
      items: [...i.items, ...r],
      texts: [...i.texts, ...s],
      furniture: [...i.furniture, ...l],
      trackers: [...i.trackers ?? [], ...a],
      areas: [...i.areas ?? [], ...c]
    }), this._selection = [
      ...n.map((h) => ({ kind: "wall", id: h.id })),
      ...o.map((h) => ({ kind: "opening", id: h.id })),
      ...r.map((h) => ({ kind: "item", id: h.id })),
      ...s.map((h) => ({ kind: "text", id: h.id })),
      ...l.map((h) => ({ kind: "furniture", id: h.id })),
      ...a.map((h) => ({ kind: "tracker", id: h.id })),
      ...c.map((h) => ({ kind: "area", id: h.id }))
    ], this._tool = "select";
  }
  _duplicate() {
    this._copy(), this._paste();
  }
  // ---- floors -------------------------------------------------------------
  /** Add a floor that reuses the current floor's walls (fresh ids) and nothing else. */
  _addFloor() {
    const e = this._floor().walls.map((o) => ({ ...o, id: D("wall") })), t = (this._config.floors?.length ?? 1) + 1, i = Qr(`Floor ${t}`, e), n = [...this._config.floors ?? [], i];
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
    const t = ts(this._config.floors ?? [], this._activeFloorId, e);
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
    const t = an(this.hass).find((i) => i.floor_id === e);
    this._commit({
      ...this._config,
      floors: (this._config.floors ?? []).map(
        (i) => i.id === this._activeFloorId ? { ...i, haFloor: t?.floor_id, ...t ? { name: t.name } : {} } : i
      )
    });
  }
  /** HA-floor link row for the floor gear popover; hidden when HA exposes no floors. */
  _renderHaFloorRow(e) {
    const t = an(this.hass);
    return t.length ? g`
      <div class="pop-row">
        <label>HA floor</label>
        <select
          .value=${e?.haFloor ?? ""}
          @change=${(i) => this._linkHaFloor(i.target.value)}
        >
          <option value="" ?selected=${!e?.haFloor}>(not linked)</option>
          ${t.map(
      (i) => g`<option value=${i.floor_id} ?selected=${e?.haFloor === i.floor_id}>
                ${i.name}
              </option>`
    )}
        </select>
      </div>
    ` : g`${f}`;
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
    return g`
      <div class="row wide area-name-status">
        <label></label>
        ${e.haArea ? g`<span
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
            </span>` : g`<span class="hint"
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
  _renderColorRow(e) {
    return g`
      <div class="row">
        <label title=${e.title ?? f}>${e.label}</label>
        <input
          type="color"
          title=${e.title ?? f}
          .value=${e.value ?? e.swatch}
          @input=${(t) => e.onLive(t.target.value)}
        />
        <input
          type="text"
          placeholder=${e.placeholder}
          .value=${e.value ?? ""}
          @change=${(t) => e.onCommit(t.target.value || void 0)}
        />
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
    return Ht(
      { ...e, stateColor: void 0 },
      t,
      e.entity ? this.hass?.entities?.[e.entity]?.icon : void 0
    );
  }
  /**
   * The device's icon, rendered here rather than up in the form (issue #127):
   * it is the same setting the state rules below override, so it belongs
   * beside them — like "Active color" beside the colours those rules replace.
   *
   * Unlike the colour it stays on screen once rules exist, because rules do
   * *not* replace it: a rule with no icon of its own falls through to this
   * one, which is what lets someone colour by state without naming the same
   * glyph in every row. Hiding it would strand a setting that is still
   * drawing.
   */
  _renderItemIconRow(e) {
    const t = "Icon for this device; a state rule below can swap it";
    return g`
      <div class="row wide">
        <label title=${t}>Icon</label>
        ${this._renderIconPicker(e.icon ?? "", (i) => this._updateItem(e.id, { icon: i || void 0 }), {
      // The entity's own glyph, so leaving the box empty is visibly a
      // choice rather than a blank.
      placeholder: this._itemDefaultIcon(e),
      title: t
    })}
      </div>
      ${e.stateColor?.length ? g`<p class="hint rule-note">Shown while no rule below names an icon of its own.</p>` : f}
    `;
  }
  /**
   * One titled group of the element panel, with a rule above it.
   *
   * The device panel had grown to two dozen controls in one flat run, in the
   * order they had been added rather than any order you would look for them
   * in. Grouping them costs a heading and a hairline each; what it buys is
   * that "where do I set the label position" has an answer you can guess.
   *
   * The heading is a disclosure button and the group starts collapsed (issue
   * #205): headings you can skim beat controls you have to scroll past, and
   * the panel now opens as a table of contents for the element. See
   * `_openGroups` for why the open set is keyed by title.
   *
   * Collapsed means *not rendered*, not hidden — so a closed group's `ha-form`
   * costs nothing, and reopening it rebuilds from `data` the same way a
   * selection change does.
   *
   * Takes the content rather than a field list because a group is rarely all
   * `ha-form` — the readings list, the icon row and the colour pickers are
   * hand-rolled, and they belong *inside* the group whose subject they share.
   */
  _renderGroup(e, ...t) {
    const i = this._openGroups.has(e);
    return g`
      <div class="cfg-group ${i ? "open" : ""}">
        <button
          class="cfg-group-title"
          type="button"
          aria-expanded=${i}
          @click=${() => this._toggleGroup(e)}
        >
          <ha-icon icon=${i ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span>${e}</span>
        </button>
        ${i ? t : f}
      </div>
    `;
  }
  /** Open a collapsed config group, or collapse an open one. */
  _toggleGroup(e) {
    const t = new Set(this._openGroups);
    t.delete(e) || t.add(e), this._openGroups = t;
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
    const t = he(e), i = (o) => this._updateItem(e.id, {
      readings: o.length ? o : void 0,
      secondaryEntity: void 0,
      secondaryAttribute: void 0,
      // `badgeEntity: "secondary"` meant index 0, which is where the legacy
      // pair still is — restate it as the index so the old spelling does not
      // outlive the keys it referred to.
      ...e.badgeEntity === "secondary" ? { badgeEntity: 0 } : {}
    }), n = (o, r) => i(t.map((s, l) => l === o ? { ...s, ...r } : s));
    return g`
      <div class="row wide">
        <label title="Further entities and attributes whose readings join this device's label line"
          >Other entities</label
        >
      </div>
      ${t.map(
      (o, r) => g`
          <div class="row wide item-reading">
            ${this._renderEntityPicker(
        o.entity ?? "",
        (s) => n(r, { entity: s || void 0 }),
        void 0,
        // Scoped to the room the device sits in, exactly as its own
        // entity picker is — an extra reading is as likely to come from
        // the same room as the first one.
        this._areaEntitiesAt(e.x, e.y)?.entities
      )}
            ${this._renderAttributePicker(
        o.entity || e.entity,
        o.attribute ?? "",
        (s) => n(r, { attribute: s || void 0 }),
        "Read this attribute instead of the state — with no entity beside it, from this device's own entity"
      )}
            <button
              class="rule-remove"
              aria-label="Remove entity"
              title="Remove this entity"
              @click=${() => i(t.filter((s, l) => l !== r))}
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
                @change=${(s) => n(r, {
        // `true` is the default, so it stays out of the YAML.
        showState: s.target.checked ? void 0 : !1
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
      ${t.length ? g`<p class="hint rule-note">
            These show whether or not the device's own "Show state" above is on
            — that toggle is about the device's entity, not about these. Use
            each row's own "Show on label" to keep one bound without printing it.
          </p>` : f}
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
    const n = e ?? [], o = (r, s) => {
      const l = n.map((a, c) => c === r ? { ...a, ...s } : a);
      t(l);
    };
    return g`
      <div class="row wide state-colors">
        <label
          title=${i?.icons ? "Color the badge — and optionally swap its icon — by what the entity reads" : "Color the element by what its entity reads"}
          >${i?.icons ? "Color & icon by state" : "Color by state"}</label
        >
      </div>
      ${n.map((r, s) => {
      const l = typeof r.state == "string" ? "state" : typeof r.above == "number" ? "above" : "else";
      return g`
          <div class="row wide state-color-rule">
            <select
              .value=${l}
              title="When this rule applies"
              @change=${(a) => {
        const c = a.target.value;
        o(s, {
          above: c === "above" ? r.above ?? 0 : void 0,
          state: c === "state" ? r.state ?? "" : void 0
        });
      }}
            >
              <option value="above">above</option>
              <option value="state">state is</option>
              <option value="else">otherwise</option>
            </select>
            ${l === "above" ? g`<input
                  type="number"
                  class="cond"
                  .value=${String(r.above ?? 0)}
                  @change=${(a) => o(s, { above: Number(a.target.value) || 0 })}
                />` : l === "state" ? g`<input
                    type="text"
                    class="cond"
                    placeholder="on"
                    .value=${r.state ?? ""}
                    @change=${(a) => o(s, { state: a.target.value })}
                  />` : g`<span class="cond hint">any other value</span>`}
            <input
              type="color"
              .value=${r.color || "#ff0000"}
              @input=${(a) => o(s, { color: a.target.value })}
            />
            <input
              type="text"
              class="rule-color-text"
              placeholder="red"
              .value=${r.color ?? ""}
              @change=${(a) => o(s, { color: a.target.value })}
            />
            ${i?.icons ? (
        // Empty means "keep the device's icon", so the device's icon is
        // the placeholder — the rule shows what leaving it blank gives
        // you, and colour-only rules need no icon at all (issue #127).
        this._renderIconPicker(r.icon ?? "", (a) => o(s, { icon: a || void 0 }), {
          placeholder: i.iconPlaceholder,
          title: "Icon while this rule matches — empty keeps the device's own"
        })
      ) : f}
            <button
              class="rule-remove"
              aria-label="Remove rule"
              title="Remove this rule"
              @click=${() => {
        const a = n.filter((c, h) => h !== s);
        t(a.length ? a : void 0);
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
    const n = Tn(t, i.x, i.y);
    if (Zi(n))
      return It(this.hass, n.haArea).length ? n.id : void 0;
  }
  _areaEntitiesAt(e, t) {
    const i = Tn(this._floor(), e, t);
    return Zi(i) ? { entities: It(this.hass, i.haArea), name: i.name } : void 0;
  }
  /** Every entity in `area`'s linked HA area not already placed as an item on this floor. */
  _pendingAreaEntities(e) {
    if (!e.haArea) return [];
    const t = new Set(this._floor().items.map((i) => i.entity));
    return It(this.hass, e.haArea).filter((i) => !t.has(i));
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
    const i = Md(e.points, t.length), n = t.map((o, r) => {
      const s = _n(o);
      return {
        id: D("item"),
        entity: o,
        x: Math.round(i[r].x),
        y: Math.round(i[r].y),
        kind: s,
        showState: s === "sensor",
        showIcon: !0,
        size: le
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
    this._zoom = Math.min(3, Math.max(0.5, Math.round(e * 100) / 100));
  }
  /** Ctrl/Cmd + wheel zooms the canvas (also catches trackpad pinch); plain wheel scrolls. */
  _onCanvasWheel(e) {
    !e.ctrlKey && !e.metaKey || (e.preventDefault(), this._setZoom(this._zoom - Math.sign(e.deltaY) * 0.1));
  }
  /** Reset to 100% (where the stage fits the wrap width) and scroll home. */
  _fitView() {
    this._setZoom(1), this._canvasWrap?.scrollTo({ top: 0, left: 0 });
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
        const i = t.openings.find((n) => n.id === e.id);
        return i ? `${i.type === "door" ? "Door" : "Window"} · ${Math.round(i.length)} units` : "Opening";
      }
      case "item": {
        const i = t.items.find((n) => n.id === e.id);
        return i?.entity ? `Device · ${i.entity}` : "Device";
      }
      case "text": {
        const n = t.texts.find((o) => o.id === e.id)?.text ?? "";
        return n ? `Text · “${n.length > 24 ? `${n.slice(0, 24)}…` : n}”` : "Text";
      }
      case "furniture": {
        const i = t.furniture.find((o) => o.id === e.id);
        if (!i) return "Furniture";
        const n = Ud(i.type, this._symbols());
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
      o.push(b`<line x1=${r} y1="0" x2=${r} y2=${t} class="grid" />`);
    for (let r = 0; r <= t; r += i)
      o.push(b`<line x1="0" y1=${r} x2=${e} y2=${r} class="grid" />`);
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
      t = "Wall", i = g`
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
      t = "Tracker", i = g`
        <span class="ctx-hint"
          >Drag on the canvas to draw the tracked area; bind one or two
          distance sensors in the Element editor.</span
        >
      `;
    else if (e === "area") {
      t = "Area";
      const n = this._draftArea?.points.length ?? 0;
      i = g`
        <span class="ctx-hint">
          ${n === 0 ? "Click to start a room outline; points snap to nearby corners." : n < 3 ? `${n} point${n === 1 ? "" : "s"} placed — click to add more (3+ to close).` : `${n} points placed — click the first point to close the room, or keep adding.`}
        </span>
      `;
    } else if (e === "door" || e === "window")
      t = e === "door" ? "Door" : "Window", i = g`
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
      i = n === 0 ? g`<span class="ctx-hint"
              >Click an element to select it, or drag a box to select several.</span
            >` : g`
              <span class="ctx-count">${n} selected</span>
              <span class="ctx-hint">Properties and actions are in the Element section below.</span>
            `;
    }
    return g`
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
    const e = this._snapMode, t = sn(this._config.snap, this.grid), i = [
      { id: "grid", label: "On" },
      { id: "off", label: "Off" },
      { id: "custom", label: "Custom" }
    ], n = e === "grid" ? `Snapping to the ${this.grid}-unit grid.` : e === "off" ? "No snapping — free placement." : `Snap = ${t}% of grid (${this._resolvedSnap} units).`;
    return g`
      <span class="ctx-field-label">Snap</span>
      <div class="seg" role="group" aria-label="Snap mode">
        ${i.map(
      (o) => g`
            <button
              class=${e === o.id ? "active" : ""}
              aria-pressed=${e === o.id}
              title=${o.id === "grid" ? "Snap to the grid" : o.id === "off" ? "Free placement" : "Custom step (% of grid)"}
              @click=${() => this._setSnapMode(o.id)}
            >
              ${o.label}
            </button>
          `
    )}
      </div>
      ${e === "custom" ? g`<input
              class="num"
              type="number"
              min="1"
              step="5"
              .value=${String(t)}
              title="Custom snap step, as a percentage of the grid"
              @change=${(o) => {
      const r = Math.max(
        1,
        Number(o.target.value) || rn
      );
      this._patchConfig({ snap: Tt(r, this.grid) });
    }}
            /><span class="ctx-field-label">%</span>` : f}
      <span class="ctx-hint">${n}</span>
    `;
  }
  render() {
    if (!this._config) return g`${f}`;
    const e = this._config, t = this._floor(), i = e.floors ?? [], n = wi(e.overlayScale), o = this._scopingAreaId(), r = e.showDeadSpaces ? no(t.walls, t.openings) : [], s = t.items.some((a) => a.glow) ? yi(t.walls, t.openings, (a) => lo(
      a,
      ((h) => _e(a, h ? this.hass?.states[h] : void 0))(a.entity),
      a.secondaryEntity && Le(a) ? _e(
        To(a),
        this.hass?.states[a.secondaryEntity]
      ) : void 0,
      a.shutterEntity ? Q(this.hass?.states[a.shutterEntity], a.shutterInvert) : void 0
    )) : t.walls, l = !t.walls.length && !t.openings.length && !t.items.length && !t.texts.length && !t.furniture.length && !(t.trackers ?? []).length && !(t.areas ?? []).length;
    return g`
      <div
        class="editor ${this._fullscreen ? "fullscreen" : ""}"
        popover=${this._fullscreen ? "manual" : f}
        @pointerdown=${this._onEditorPointerDown}
      >
        ${this._floorMenuOpen || this._addMenuOpen ? g`<div
              class="pop-backdrop"
              @click=${() => {
      this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "";
    }}
            ></div>` : f}
        <div class="toolbar">
          <!-- Tools — modes; exactly one is active at a time -->
          <div class="seg" role="group" aria-label="Tool">
            ${["select", "wall", "door", "window", "tracker", "area"].map(
      (a) => g`
                <button
                  class=${this._tool === a ? "active" : ""}
                  aria-pressed=${this._tool === a}
                  title=${Pt[a].label}
                  @click=${() => {
        this._tool = a, this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaHover = null;
      }}
                >
                  <ha-icon icon=${Pt[a].icon}></ha-icon>${Pt[a].label}
                </button>`
    )}
          </div>

          <span class="divider"></span>

          <!-- Expand: break out of HA's narrow config dialog into a full-screen
               workspace. Kept next to the tools so it's reachable even when the
               toolbar wraps at dialog width. -->
          <button
            class=${this._fullscreen ? "active expand-toggle" : "expand-toggle"}
            aria-pressed=${this._fullscreen}
            title=${this._fullscreen ? "Exit full screen (Esc)" : "Edit full screen — more room for the canvas"}
            @click=${() => this._toggleFullscreen()}
          >
            <ha-icon icon=${this._fullscreen ? "mdi:fullscreen-exit" : "mdi:fullscreen"}></ha-icon>
            ${this._fullscreen ? "Exit" : "Expand"}
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
          ${this._applyError ? g`<span class="apply-error">${this._applyError}</span>` : f}

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

          <span class="divider"></span>

          <!-- Insert — one popover for everything droppable on the floor -->
          <span class="pop-wrap">
            <button
              aria-haspopup="true"
              aria-expanded=${this._addMenuOpen}
              @click=${() => {
      this._addMenuOpen = !this._addMenuOpen, this._floorMenuOpen = !1;
    }}
            >
              + Add
            </button>
            ${this._addMenuOpen ? this._renderAddMenu() : f}
          </span>

          <span class="spacer"></span>

          <!-- History -->
          <div class="group">
            <button aria-label="Undo" title="Undo (Ctrl/Cmd+Z)" ?disabled=${!this._history.length} @click=${this._undo}>
              <ha-icon icon="mdi:undo"></ha-icon>
            </button>
            <button aria-label="Redo" title="Redo (Ctrl/Cmd+Shift+Z)" ?disabled=${!this._future.length} @click=${this._redo}>
              <ha-icon icon="mdi:redo"></ha-icon>
            </button>
          </div>

          <span class="divider"></span>

          <!-- Floor — switch + add inline; rename/delete behind the gear -->
          <span class="floors pop-wrap">
            <label>floor</label>
            <select
              @change=${(a) => {
      this._switchFloor(a.target.value), this._canvasWrap?.focus({ preventScroll: !0 });
    }}
            >
              ${i.map(
      (a) => g`<option value=${a.id} .selected=${a.id === this._activeFloorId}>${a.name}</option>`
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
            ${this._floorMenuOpen ? g`<div class="pop">
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
                      @change=${(a) => this._renameFloor(this._activeFloorId, a.target.value)}
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
                      @change=${(a) => this._commitFloor({
      short: a.target.value.trim() || void 0
    })}
                    />
                  </div>
                  <div class="pop-row">
                    <label>Color</label>
                    <input
                      type="color"
                      title="Accent for this floor's switcher button while active"
                      .value=${t?.color ?? "#03a9f4"}
                      @input=${(a) => this._commitFloor({ color: a.target.value })}
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
                      @change=${(a) => this._commit({
      ...this._config,
      defaultFloor: a.target.checked ? this._activeFloorId : void 0
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
                </div>` : f}
          </span>
        </div>

        ${this._renderContextBar()}

        <div class="workspace">
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
          style=${this._fullscreen ? f : `aspect-ratio:${T(e.width, ve)} / ${T(e.height, Ne)};`}
          @wheel=${this._onCanvasWheel}
        >
          <!-- The stage doubles as the card's .plan box for overlay sizing: same
               container query, same --fp-u, so a badge measured in canvas units
               previews here at the size a card of this width would draw it
               (issue #192). The editor never rotates the plan, so the canvas
               width is what 100cqw measures against. -->
          <div class="stage ${n === "plan" ? "scale-plan" : ""}"
               style="aspect-ratio: ${T(e.width, ve)} / ${T(
      e.height,
      Ne
    )}; width:${this._zoom * 100}%;
                   --fp-plan-w: ${T(e.width, ve)};${Wc(e.skin)}">
            <!-- Keyed on the skin, for the repaint reason documented on the
                 card's SVG (issue #122): a var() inside a presentation
                 attribute does not repaint when the custom property changes,
                 so without this the canvas kept the previous skin's doors and
                 room fills. -->
            ${Gn(
      e.skin ?? "",
      b`<svg
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
                fill=${e.background ?? xt}
              />
              ${t.image ? b`<image href=${t.image} x="0" y="0" width=${e.width} height=${e.height}
                            preserveAspectRatio=${Bo(t.imageFit)}
                            opacity=${t.imageOpacity ?? 1} />` : f}
              ${this._renderGrid()}
              ${X(
        t.areas ?? [],
        (a, c) => a.id || c,
        (a) => this._renderAreaSel(a, o)
      )}
              <!-- Dead spaces (issue #88), same layer position as the card so
                   what you draw is what you get. Live while you draw: closing
                   the last wall of a shaft hatches it, and dropping a door into
                   it clears the hatching again — which is the fastest way to
                   see that the card agrees with you about what is sealed. -->
              ${r.length ? b`${Wo(`${this._wallMaskId}-dead`)}
                      ${r.map(
        (a) => Go(a, `${this._wallMaskId}-dead`)
      )}` : f}
              <!-- Light pools (issue #6), same layer position as the card so
                   what you place is what you get. Previewed at full strength
                   with no hass in the editor, so the radius is adjustable
                   without having to turn the real light on. -->
              ${uo(
        t.furniture,
        e.width,
        e.height,
        `${this._wallMaskId}-glowmask`,
        this._symbols()
      )}
              <g class="fp-glows"
                 mask=${t.furniture.length ? `url(#${this._wallMaskId}-glowmask)` : f}>
                ${t.items.map((a, c) => {
        if (!a.glow) return f;
        const h = rh(a, this.hass?.states[a.entity]);
        return h ? ho(a, h, `${this._wallMaskId}-glow-${c}`, s) : f;
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
      t.items.map(
        (a) => a.glow && this._isSel("item", a.id) ? b`<circle class="glow-guide" cx=${a.x} cy=${a.y}
                                  r=${T(a.glowRadius, yt)} />` : f
      )}
              ${t.furniture.map((a) => this._renderFurnitureSel(a))}
              ${Uo(t.openings, e.width, e.height, this._wallMaskId)}
              ${t.walls.map((a) => this._renderWall(a))}
              <!-- Room outlines, same layer position as the card so what you
                   place is what you get. Only a static borderColor draws here,
                   there being no hass to resolve a live color from — but the
                   clip ids are passed anyway, so wiring a live preview in later
                   cannot silently land on the unclipped path. -->
              <g mask=${`url(#${this._wallMaskId})`}>
                ${(t.areas ?? []).map(
        (a, c) => Ko(a, void 0, `${this._wallMaskId}-area-${c}`)
      )}
              </g>
              ${X(
        // Keyed by id: switching floors must create fresh DOM. Reused
        // nodes would CSS-transition from the previous floor's opening
        // state — a window briefly plays a door swing (issue #50).
        t.openings,
        (a, c) => a.id || c,
        (a) => this._renderOpeningSel(a)
      )}
              ${X(
        t.trackers ?? [],
        (a, c) => a.id || c,
        (a) => this._renderTrackerSel(a)
      )}
              ${this._draftTracker ? b`<rect class="tracker-draft"
                              x=${Math.min(this._draftTracker.x0, this._draftTracker.x1)}
                              y=${Math.min(this._draftTracker.y0, this._draftTracker.y1)}
                              width=${Math.abs(this._draftTracker.x1 - this._draftTracker.x0)}
                              height=${Math.abs(this._draftTracker.y1 - this._draftTracker.y0)}
                              rx="4" />` : f}
              ${this._draft ? b`<g class="fp-wall-neon"><line x1=${this._draft.x1} y1=${this._draft.y1}
                              x2=${this._draft.x2} y2=${this._draft.y2}
                              class="wall draft" mask=${`url(#${this._wallMaskId})`}
                              stroke-width=${F} /></g>` : f}
              ${this._renderAreaDraft()}
              ${this._marquee ? b`<rect x=${Math.min(this._marquee.x0, this._marquee.x1)}
                              y=${Math.min(this._marquee.y0, this._marquee.y1)}
                              width=${Math.abs(this._marquee.x1 - this._marquee.x0)}
                              height=${Math.abs(this._marquee.y1 - this._marquee.y0)}
                              class="marquee" />` : f}
            </svg>`
    )}
            <div class="items">
              ${t.texts.map((a) => this._renderTextOverlay(a, e, n))}
              ${t.openings.filter((a) => Co(a)).map((a) => this._renderShutterMarkOverlay(a, e, n))}
              ${t.openings.filter((a) => zo(a)).map((a) => this._renderOpeningMarkOverlay(a, e, n))}
              ${t.items.map((a) => this._renderItemOverlay(a, e, n))}
            </div>
          </div>
        </div>
        ${l && !this._draft && !this._draftTracker && !this._draftArea ? g`<div class="empty-hint">
              <div>
                <b>Draw your first room:</b> pick the <b>Wall</b> tool and drag on the canvas.<br />
                Then drop doors, windows and devices onto it.
              </div>
            </div>` : f}
        <div class="zoom-overlay">
          <button aria-label="Zoom out" title="Zoom out" @click=${() => this._setZoom(this._zoom - 0.25)}>
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <button class="zoom-val-btn" title="Reset zoom to 100%" @click=${() => this._setZoom(1)}>
            ${Math.round(this._zoom * 100)}%
          </button>
          <button aria-label="Zoom in" title="Zoom in" @click=${() => this._setZoom(this._zoom + 0.25)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
          <button aria-label="Fit to view" title="Fit to view" @click=${this._fitView}>
            <ha-icon icon="mdi:fit-to-screen-outline"></ha-icon>
          </button>
        </div>
        </div>

        <div class="side">
          ${this._renderElementEdit()}
          ${this._renderPanel()}
        </div>
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
    return customElements.get("ha-form") ? g`<ha-form
        .hass=${this.hass}
        .data=${e.data}
        .schema=${e.fields}
        .computeLabel=${gu}
        .computeHelper=${mu}
        @value-changed=${(i) => {
      i.stopPropagation();
      const n = Bd(e.data, i.detail.value, e.fields), o = On(n, e.fields), r = Object.keys(o);
      if (!r.length) return;
      const s = r.length === 1 && Cn(e.fields.find((l) => l.name === r[0]));
      t(e.toPatch(o), s);
    }}
      ></ha-form>` : g`${e.fields.map((i) => this._renderFallbackField(e, i, t))}`;
  }
  _applyFallback(e, t, i, n, o) {
    const r = On({ [t.name]: i }, e.fields);
    t.name in r && o(e.toPatch(r), n && Cn(t));
  }
  /** One plain-input row per schema field — the outside-HA / load-failure path. */
  _renderFallbackField(e, t, i) {
    const n = e.data[t.name], o = t.selector;
    if ("select" in o) {
      const r = o.select, s = r.options;
      if (r.custom_value) {
        const l = `sel-${t.name}-${s.length}`;
        return g`<div class="row wide">
          <label>${t.label}</label>
          <input
            type="text"
            list=${l}
            .value=${String(n ?? "")}
            @change=${(a) => this._applyFallback(e, t, a.target.value, !1, i)}
          />
          <datalist id=${l}>
            ${s.map((a) => g`<option value=${a.value}></option>`)}
          </datalist>
        </div>`;
      }
      return g`<div class="row">
        <label>${t.label}</label>
        <select
          .value=${String(n ?? "")}
          @change=${(l) => this._applyFallback(e, t, l.target.value, !1, i)}
        >
          ${s.map(
        (l) => g`<option value=${l.value} ?selected=${l.value === n}>${l.label}</option>`
      )}
        </select>
      </div>`;
    }
    if ("boolean" in o)
      return g`<div class="row">
        <label>${t.label}</label>
        <input
          type="checkbox"
          .checked=${!!n}
          @change=${(r) => this._applyFallback(e, t, r.target.checked, !1, i)}
        />
      </div>`;
    if ("number" in o) {
      const r = o.number, s = r.mode === "slider";
      return g`<div class="row">
        <label>${t.label}</label>
        ${s ? g`<input
              type="range"
              min=${r.min ?? 0}
              max=${r.max ?? 100}
              step=${r.step ?? 1}
              .value=${String(n ?? r.min ?? 0)}
              @input=${(l) => this._applyFallback(e, t, Number(l.target.value), !0, i)}
            />` : f}
        <input
          class="num"
          type="number"
          min=${r.min ?? f}
          max=${r.max ?? f}
          step=${r.step ?? f}
          .value=${String(n ?? "")}
          @change=${(l) => {
        const a = l.target;
        this._applyFallback(
          e,
          t,
          a.value === "" ? void 0 : Number(a.value),
          !1,
          i
        ), a.value = String(e.data[t.name] ?? "");
      }}
        />
      </div>`;
    }
    if ("entity" in o) {
      const r = o.entity;
      return g`<div class="row wide">
        <label>${t.label}</label>
        ${this._renderEntityPicker(
        String(n ?? ""),
        (s) => this._applyFallback(e, t, s, !1, i),
        r.filter?.[0]?.domain,
        r.include_entities
      )}
      </div>`;
    }
    return "icon" in o ? g`<div class="row wide">
        <label>${t.label}</label>
        <input
          type="text"
          placeholder=${o.icon.placeholder ?? "mdi:…"}
          .value=${String(n ?? "")}
          @change=${(r) => this._applyFallback(e, t, r.target.value, !1, i)}
        />
      </div>` : "ui_action" in o ? g`${f}` : g`<div class="row">
      <label>${t.label}</label>
      <input
        type="text"
        .value=${String(n ?? "")}
        @input=${(r) => this._applyFallback(e, t, r.target.value, !0, i)}
      />
    </div>`;
  }
  _renderEntityPicker(e, t, i, n) {
    return customElements.get("ha-entity-picker") ? g`<ha-entity-picker
        .hass=${this.hass}
        .value=${e}
        .includeDomains=${i}
        .includeEntities=${n}
        allow-custom-entity
        @value-changed=${(o) => t(o.detail.value ?? "")}
      ></ha-entity-picker>` : g`<input
      type="text"
      placeholder="sensor.example"
      .value=${e}
      @change=${(o) => t(o.target.value)}
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
    return customElements.get("ha-entity-attribute-picker") && e ? g`<ha-entity-attribute-picker
        class="reading-attr"
        .hass=${this.hass}
        .entityId=${e}
        .value=${t}
        allow-custom-value
        title=${n ?? f}
        @value-changed=${(o) => i(o.detail.value ?? "")}
      ></ha-entity-attribute-picker>` : g`<input
      type="text"
      class="reading-attr"
      placeholder="attribute"
      title=${n ?? f}
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
    return customElements.get("ha-icon-picker") ? g`<ha-icon-picker
        class="rule-icon"
        .hass=${this.hass}
        .value=${e}
        placeholder=${i?.placeholder ?? "Icon"}
        title=${i?.title ?? f}
        @value-changed=${(n) => t(n.detail.value ?? "")}
      ></ha-icon-picker>` : g`<input
      type="text"
      class="rule-icon"
      placeholder=${i?.placeholder ?? "mdi:blinds"}
      title=${i?.title ?? f}
      .value=${e}
      @change=${(n) => t(n.target.value)}
    />`;
  }
  /** Toggle the full-screen workspace. */
  _toggleFullscreen() {
    this._fullscreen = !this._fullscreen, this._fullscreen && this._canvasWrap && (this._canvasWrap.style.width = "", this._canvasWrap.style.height = ""), this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "";
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
    }, t = this._symbols(), i = Xo(t).filter((r) => Lc(r, this._addQuery)), n = !this._addQuery.trim();
    let o = "";
    return g`
      <div class="pop left add-pop">
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
      const s = n && r.category !== o ? r.category : "";
      return o = r.category, g`${s ? g`<div class="furn-group">${s}</div>` : f}
                  ${this._renderFurnCell(r, e)}`;
    }) : g`<div class="furn-empty">No symbol matches “${this._addQuery}”</div>`}
        </div>
      </div>
    `;
  }
  /** One picker cell: the symbol drawn at its own default size, plus its name. */
  _renderFurnCell(e, t) {
    const { w: i, h: n } = e.size, o = Math.max(i, n) * 0.25 + 6, r = `${-i / 2 - o} ${-n / 2 - o} ${i + o * 2} ${n + o * 2}`;
    return g`
      <button
        class="furn-cell"
        title=${e.name}
        @click=${() => {
      this._addFurniture(e.id), t();
    }}
      >
        <svg viewBox=${r}>
          ${Gt(
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
   * Per-element editor area, rendered BELOW the canvas with a small title.
   * Kept separate from the project panel so users can tell the two apart, and
   * separate from the context bar so the bar's height stays stable across
   * selection changes (the canvas no longer jumps when you click around).
   */
  _renderElementEdit() {
    const e = this._selection.length, t = this._primary();
    if (e === 0 || !t)
      return g`
        <section class="edit-area">
          <h3 class="section-title">Element</h3>
          <p class="hint">Select an element on the canvas to edit its properties here.</p>
        </section>
      `;
    const i = e > 1 ? `${e} elements selected` : this._selectionSummary(t), n = e > 1 ? "mdi:select-group" : yu[t.kind];
    return g`
      <section class="edit-area">
        <div class="edit-head">
          <ha-icon icon=${n}></ha-icon>
          <span class="edit-title" title=${i}>${i}</span>
          <span class="head-spacer"></span>
          <button aria-label="Duplicate" title="Duplicate (Ctrl/Cmd+D)" @click=${this._duplicate}>
            <ha-icon icon="mdi:content-duplicate"></ha-icon>
          </button>
          <button class="danger" aria-label="Delete" title="Delete (Del)" @click=${this._deleteSelected}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${e > 1 ? g`<p class="hint">
              Edit elements one at a time. Drag any selected element to move the whole group.
            </p>` : g`${this._renderAreaScopeHint()}
              <div class="rows">${this._renderSelectionEditor()}</div>`}
      </section>
    `;
  }
  _renderWall(e) {
    const t = this._isSel("wall", e.id);
    return b`
      <g>
        <line x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}
              class="wall-hit"
              @pointerdown=${(i) => this._startDrag(i, { kind: "wall", id: e.id })} />
        <g class="fp-wall-neon"><line x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}
              class="wall ${t ? "selected" : ""}"
              mask=${`url(#${this._wallMaskId})`}
              style=${yo(e.thickness)} stroke-linecap="round" /></g>
        ${t ? b`
                <circle cx=${e.x1} cy=${e.y1} r="9" class="handle"
                        @pointerdown=${(i) => this._startDrag(i, { kind: "wall", id: e.id }, 1)} />
                <circle cx=${e.x2} cy=${e.y2} r="9" class="handle"
                        @pointerdown=${(i) => this._startDrag(i, { kind: "wall", id: e.id }, 2)} />` : f}
      </g>`;
  }
  _renderOpeningSel(e) {
    const t = this._isSel("opening", e.id);
    return b`
      <g class="opening-hit"
         @pointerdown=${(i) => this._startDrag(i, { kind: "opening", id: e.id })}>
        ${Ho(e, {
      color: t ? "var(--primary-color, #03a9f4)" : hi,
      open: $i(e),
      // Draw sliding / rolling openings partly open in the editor so the
      // motion is visible — closed, both look like a plain band, which
      // would make the Motion / Slide / Style controls appear inert.
      amount: B(e) !== "swing" ? 0.55 : void 0,
      // Shutter previewed half-rolled so the layer is visible while
      // configuring, whatever the live state.
      shutter: e.shutterEntity ? { amount: 0.55, style: we(e), flip: e.shutterFlipV } : void 0
    })}
      </g>`;
  }
  /**
   * Render a Tracker in the editor SVG with its zone outline visible (so the
   * user can grab/resize it) plus a hit overlay for drag-to-move and a dashed
   * selection rectangle when active.
   */
  _renderTrackerSel(e) {
    const t = this._isSel("tracker", e.id), i = ft(this.hass?.states, e.xSensor?.entity), n = ft(this.hass?.states, e.ySensor?.entity), o = st(this.hass?.states, e.xSensor?.presence), r = st(this.hass?.states, e.ySensor?.presence);
    return b`
      <g class="tracker-hit ${t ? "selected" : ""}"
         @pointerdown=${(s) => this._startDrag(s, { kind: "tracker", id: e.id })}>
        ${Vo(e, {
      editing: !0,
      xReading: i,
      yReading: n,
      xPresent: o,
      yPresent: r
    })}
        <rect x=${e.x} y=${e.y} width=${e.w} height=${e.h}
              transform="rotate(${e.angle ?? 0} ${e.x + e.w / 2} ${e.y + e.h / 2})"
              class="tracker-hit-rect" />
        ${t ? b`<rect x=${e.x - 4} y=${e.y - 4}
                        width=${e.w + 8} height=${e.h + 8}
                        transform="rotate(${e.angle ?? 0} ${e.x + e.w / 2} ${e.y + e.h / 2})"
                        class="tracker-outline" />` : f}
      </g>`;
  }
  _renderFurnitureSel(e) {
    const t = this._isSel("furniture", e.id);
    return b`
      <g class="furn-hit ${t ? "selected" : ""}"
         @pointerdown=${(i) => this._startDrag(i, { kind: "furniture", id: e.id })}>
        ${Gt(e, void 0, this._symbols())}
        ${t ? b`<rect x=${e.x - e.w / 2 - 4} y=${e.y - e.h / 2 - 4}
                        width=${e.w + 8} height=${e.h + 8}
                        transform="rotate(${e.angle ?? 0} ${e.x} ${e.y})"
                        class="furn-outline" />` : f}
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
    if (!e) return f;
    const t = (this._floor().areas ?? []).find((n) => n.id === e), i = t?.name ? t.name : "this area";
    return g`<p class="hint area-scope-hint">
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
  _renderAreaSel(e, t) {
    const i = this._isSel("area", e.id), n = e.id === t, o = e.points.map((r) => `${r.x},${r.y}`).join(" ");
    return b`
      <g class="area-hit ${i ? "selected" : ""} ${n ? "scoping" : ""}">
        ${n ? b`<polygon points=${o} class="area-scoping" />` : f}
        ${qo(e)}
        <polygon points=${o} class="area-hit-shape"
                 @pointerdown=${(r) => this._startDrag(r, { kind: "area", id: e.id })} />
        ${i ? b`<polygon points=${o} class="area-outline" />` : f}
        ${i ? e.points.map(
      (r, s) => b`
                  <circle cx=${r.x} cy=${r.y} r="7" class="handle"
                          @pointerdown=${(l) => this._startDrag(l, { kind: "area", id: e.id }, void 0, s)} />`
    ) : f}
      </g>`;
  }
  /**
   * The in-progress Area draft: committed vertices as dots, straight segments
   * between them, and — while a live pointer position is known — a dashed
   * "rubber band" segment from the last vertex to the cursor. Once 3+ points
   * are down the starting vertex is drawn larger/hollow so it's visually
   * obvious that clicking it closes the polygon (see `_onCanvasDown`).
   */
  _renderAreaDraft() {
    const e = this._draftArea;
    if (!e) return f;
    const t = e.points, i = t.map((s) => `${s.x},${s.y}`).join(" "), n = t[t.length - 1], o = t.length >= 3, r = this._areaHover;
    return b`
      <g class="area-draft">
        ${t.length > 1 ? b`<polyline points=${i} class="area-draft-line" />` : f}
        ${r ? b`<line x1=${n.x} y1=${n.y} x2=${r.x} y2=${r.y}
                        class="area-draft-hover" />` : f}
        ${t.map(
      (s, l) => l === 0 && o ? b`<circle cx=${s.x} cy=${s.y} r="9" class="area-draft-start" />` : b`<circle cx=${s.x} cy=${s.y} r="5" class="area-draft-point" />`
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
    const n = e.shutterEntity, o = this.hass?.states[n], r = Q(o, e.shutterInvert) > 0, s = Po(e, o, r, this.hass?.entities?.[n]?.icon), l = H(e.shutterActiveColor ?? e.activeColor) ?? R, a = Si(e), c = ki(e), h = C(ht, i), d = C(ct, i);
    return g`<div
      class="shutter-mark ${Xe(o, e.shutterInvert) ? "on" : "off"}"
      style="left:${a.x / t.width * 100}%; top:${a.y / t.height * 100}%;
             width:${h};height:${h};
             transform:translate(-50%,-50%)
                       translate(calc(${c.x} * ${d}), calc(${c.y} * ${d}));
             --fp-active:${l};"
      title=${`${o?.attributes?.friendly_name ?? n} — shown on the card, tap it there to open the shutter`}
    >
      <ha-icon icon=${s} style="--mdc-icon-size:${C(
      dt,
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
    const n = e.entity, o = this.hass?.states[n], r = _e(e, o) > 0, s = Fo(e, o, r, this.hass?.entities?.[n]?.icon), l = H(e.activeColor) ?? R, a = Lo(e), c = Do(e), h = C(ht, i), d = C(ct, i);
    return g`<div
      class="shutter-mark ${Nt(e, o) ? "on" : "off"}"
      style="left:${a.x / t.width * 100}%; top:${a.y / t.height * 100}%;
             width:${h};height:${h};
             transform:translate(-50%,-50%)
                       translate(calc(${c.x} * ${d}), calc(${c.y} * ${d}));
             --fp-active:${l};"
      title=${`${o?.attributes?.friendly_name ?? n} — shown on the card, tap it there to open its dialog`}
    >
      <ha-icon icon=${s} style="--mdc-icon-size:${C(
      dt,
      i
    )};"></ha-icon>
    </div>`;
  }
  _renderItemOverlay(e, t, i) {
    const n = this._isSel("item", e.id), o = e.entity ? this.hass?.states[e.entity] : void 0, r = Ht(e, o, e.entity ? this.hass?.entities?.[e.entity]?.icon : void 0), { text: s, live: l } = dh(this.hass, e), a = T(e.size, le), c = Be(e) !== "none", h = e.display ?? "badge", d = _i(e, o), p = H(kt(e.stateColor, d)), m = Be(e) === "value" ? ko(this.hass, e) : void 0, v = ie(e.entity, o?.state), y = v ? H(e.activeColor) ?? so(o) : void 0, w = qn(p ?? y), u = e.rippleColor ?? p ?? y ?? R, _ = e.rippleSize ?? bt, x = vo(e, o?.state), A = C(a, i), E = g`<div
      class="badge ${c ? "" : "ghost"} ${p ? "state-colored" : v ? "active-colored" : ""}"
      style="width:${A};height:${A};transform:rotate(${T(e.angle, 0)}deg);${p ? `--fp-state:${p};` : ""}${y ? `--fp-active:${y};` : ""}${w ? `--fp-ink:${w};` : ""}"
    >
      ${m ? g`<span
            class="badge-value"
            style="font-size:${C(Eo(a, m), i)};"
            >${m}</span
          >` : g`<ha-icon
            class=${x ? `anim-${x}` : ""}
            icon=${r}
            style="--mdc-icon-size:${C($o(a), i)};"
          ></ha-icon>`}
    </div>`;
    let P;
    h === "ripple" ? P = pt(!0, u, _, 3, i) : h === "iconRipple" ? P = g`<div class="stack">
        ${pt(!0, u, _, 3, i)}
        <div class="stack-icon">${E}</div>
      </div>` : P = E;
    const L = po(e, o?.state);
    return g`
      <div
        class="edit-item ${n ? "selected" : ""} ${L ? "card-hidden" : ""}"
        style="left:${e.x / t.width * 100}%; top:${e.y / t.height * 100}%;"
        @pointerdown=${(U) => this._onOverlayDown(U, { kind: "item", id: e.id })}
        @pointermove=${this._onOverlayMove}
        @pointerup=${this._onOverlayUp}
        @pointercancel=${this._onPointerCancel}
      >
        ${P}
        <!-- The card's own label line when there is one (issue #135), so
             turning Show state on is visible here rather than only after
             leaving the editor; otherwise the dim identification fallback.
             The Labels toolbar toggle hides either on dense plans (issue
             #52), and the size previews the card's labelSize (issue #59). -->
        ${this._hideLabels ? f : g`<span
              class="ilabel ${l ? "live" : ""} ilabel-${vi(e)}"
              style="font-size:${C(
      l || e.labelSize != null ? mo(e.labelSize) : 11,
      i
    )};${l && p ? `color:${p};` : ""}"
              >${s}</span
            >`}
      </div>
    `;
  }
  _renderTextOverlay(e, t, i) {
    const n = this._isSel("text", e.id);
    return g`
      <div
        class="edit-text ${n ? "selected" : ""}"
        style="left:${e.x / t.width * 100}%; top:${e.y / t.height * 100}%;
               font-size:${C(T(e.size, ze), i)};
               color:${N(e.color, to)};
               transform:translate(-50%,-50%) rotate(${T(e.angle, 0)}deg);"
        @pointerdown=${(o) => this._onOverlayDown(o, { kind: "text", id: e.id })}
        @pointermove=${this._onOverlayMove}
        @pointerup=${this._onOverlayUp}
        @pointercancel=${this._onPointerCancel}
      >
        ${pi(this.hass, e) || "…"}
      </div>
    `;
  }
  _renderPanel() {
    return g`
      <section class="panel">
        <button
          class="section-toggle"
          aria-expanded=${this._projectOpen}
          @click=${() => {
      this._projectOpen = !this._projectOpen;
    }}
        >
          <ha-icon icon=${this._projectOpen ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
          <span class="section-title-inline">Project</span>
          ${this._projectOpen ? f : g`<span class="section-summary"
                >${this._config.title || "Untitled"} · ${this._config.width}×${this._config.height}</span
              >`}
        </button>
        ${this._projectOpen ? this._renderPanelBody() : f}
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
    const e = this._config, t = (n) => this._patchConfig(n), i = lu(e);
    return g`
      <div class="rows panel-body">
        ${this._renderGroup(
      "Project",
      this._renderForm(ru(e), (n, o) => {
        "grid" in n && typeof n.grid == "number" && (n = { ...n, ...this._gridPatch(n.grid) }), o ? this._patchConfigLive(n) : this._patchConfig(n);
      })
    )}
        ${this._renderGroup(
      // The plan's own look: its palette, its paper, and the one drawing
      // convention that is a plan-wide choice rather than an element's.
      "Look",
      this._renderForm(au(e), t),
      this._renderColorRow({
        label: "Background",
        value: e.background,
        swatch: "#ffffff",
        placeholder: "#ffffff or empty",
        onLive: (n) => this._patchConfigLive({ background: n }),
        onCommit: (n) => this._patchConfig({ background: n })
      }),
      this._renderForm(cu(e), t)
    )}
        ${this._renderGroup(
      // Per floor, not per project — but it is the floor's paper, so it
      // belongs beside the plan's own.
      "Floor image",
      this._renderForm(uu(this._floor()), (n, o) => {
        o ? this._patchFloorLive(n) : this._commitFloor(n);
      })
    )}
        ${this._renderGroup(
      // How the card is framed on the dashboard, as opposed to what is
      // drawn inside it. Set once for a surface and rarely touched again.
      "Display",
      this._renderForm(q(i, ["rotation", "overlayScale", "compactHeader"]), t)
    )}
        ${this._renderGroup(
      // Light through the openings (issue #177) — where it comes from and
      // what it looks like where it lands.
      "Sunlight",
      this._renderForm(du(e), t),
      e.sunlight ? g`${this._renderColorRow({
        label: "Sun color",
        title: "Color of the light the openings let in",
        value: e.sunlightColor,
        swatch: "#ffd9a0",
        placeholder: "(warm white)",
        onLive: (n) => this._patchConfigLive({ sunlightColor: n }),
        onCommit: (n) => this._patchConfig({ sunlightColor: n })
      })}
              ${e.sunShade === !1 ? f : this._renderColorRow({
        label: "Shade color",
        title: "Color of everywhere the light does not reach",
        value: e.sunShadeColor,
        swatch: "#000000",
        placeholder: "(black)",
        onLive: (n) => this._patchConfigLive({ sunShadeColor: n }),
        onCommit: (n) => this._patchConfig({ sunShadeColor: n })
      })}` : f
    )}
        ${this._renderGroup(
      // The other half of following the sun, and a separate switch: this
      // one dims the whole plan after dark rather than casting anything.
      "Night dimming",
      this._renderForm(hu(e), t)
    )}
        ${this._renderGroup(
      // How devices look and answer, plan-wide. "Offline devices" lived
      // under display, beside the card's rotation, which is not what it is
      // about.
      "Devices",
      this._renderForm(q(i, ["offlineStyle"]), t),
      this._renderForm(su(e), t)
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
  _renderSymbolsPanel() {
    const e = Object.keys(this._config.symbols ?? {});
    return g`
      <div class="row col symbols-panel">
        ${e.length ? g`<div class="symbol-list">
              ${e.map(
      (t) => g`
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
            </div>` : f}
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
        ${this._symbolError ? g`<div class="symbol-error">${this._symbolError}</div>` : f}
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
   * Editor fields for the currently-selected element, rendered in the Element
   * section below the canvas (docked beside it in fullscreen). Returns nothing
   * when the selection isn't exactly one element — multi-select and
   * empty-select states are handled by the Element header itself.
   */
  _renderSelectionEditor() {
    const e = this._primary();
    if (!e || this._selection.length !== 1) return g`${f}`;
    if (e.kind === "opening") {
      const t = this._floor().openings.find((r) => r.id === e.id);
      if (!t) return g`${f}`;
      const i = Wd(t, (r) => this._supportedFeatures(r)), n = (r, s) => {
        if ("entity" in r) {
          const l = r.entity, a = l ? this.hass?.states[l]?.attributes?.device_class : void 0;
          r = { ...r, ...a ? Hh(a) : {} };
        }
        this._applyElementPatch("opening", t.id, r, s);
      }, o = (r, s, ...l) => {
        const a = q(i, s);
        return !a.fields.length && !l.some((c) => c && c !== f) ? f : this._renderGroup(r, this._renderForm(a, n), ...l);
      };
      return g`
        ${S.OPENING_GROUPS.map(
        ([r, s]) => r === "Color" ? o(
          r,
          s,
          t.entity ? this._renderColorRow({
            label: "Active color",
            value: t.activeColor,
            swatch: "#03a9f4",
            placeholder: "(primary)",
            onLive: (l) => this._updateOpeningLive(t.id, { activeColor: l }),
            onCommit: (l) => this._updateOpening(t.id, { activeColor: l })
          }) : f
        ) : r === "Shutter" ? o(
          r,
          s,
          // The shutter's own accent, so an open shutter over a shut
          // window can read as a separate thing from the sash it
          // covers. Falls back to the opening's, hence the placeholder.
          t.shutterEntity ? this._renderColorRow({
            label: "Shutter color",
            title: "Shutter color while it is open",
            value: t.shutterActiveColor,
            swatch: t.activeColor ?? "#03a9f4",
            placeholder: t.activeColor ? "(active color)" : "(primary)",
            onLive: (l) => this._updateOpeningLive(t.id, { shutterActiveColor: l }),
            onCommit: (l) => this._updateOpening(t.id, { shutterActiveColor: l })
          }) : f
        ) : o(r, s)
      )}
      `;
    }
    if (e.kind === "item") {
      const t = this._floor().items.find((a) => a.id === e.id);
      if (!t) return g`${f}`;
      const i = this._areaEntitiesAt(t.x, t.y), n = t.entity ? this.hass?.states[t.entity]?.attributes?.device_class : void 0, o = (a) => (a ? this.hass?.states[a]?.attributes?.friendly_name : void 0) ?? a, r = {
        source: Ao(this.hass, t)?.source ?? "primary",
        primaryLabel: o(t.entity),
        // One label per reading, positionally — the dropdown names each rather
        // than numbering them, and a reading with no entity of its own is read
        // off this device, so that is the name to show for it (issue #180).
        readingLabels: he(t).map((a) => o(a.entity || t.entity))
      }, s = (a, c) => {
        "entity" in a && typeof a.entity == "string" && (a = { ...a, kind: _n(a.entity) }), this._applyElementPatch("item", t.id, a, c);
      }, l = Zd(t, n);
      return g`
        ${this._renderGroup("Identity", this._renderForm(qd(t), s))}
        ${this._renderGroup(
        "What it reads",
        // Entity, its attribute, whether its own state shows, then every
        // other entity — the order the label prints them in (issue #180).
        this._renderForm(Gd(t, i), s),
        this._renderForm(Kd(t), s),
        this._renderItemReadings(t)
      )}
        ${hh(t) ? (
        // Nothing to place or size while the device draws no label at all.
        this._renderGroup("Label", this._renderForm(Vd(t), s))
      ) : f}
        ${this._renderGroup(
        "Badge",
        this._renderForm(Yd(t, r), s),
        this._renderItemIconRow(t)
      )}
        ${this._renderGroup(
        "Color",
        t.stateColor?.length ? (
          // Colour by state supersedes the fixed active colour, so showing
          // both invites setting one and seeing the other. Say which one is
          // in charge instead of leaving a dead control on screen.
          g`<p class="hint rule-note">
                Colored by the state rules below — they replace the active color.
              </p>`
        ) : this._renderColorRow({
          label: "Active color",
          title: "Badge color while this device is on (issue #79)",
          value: t.activeColor,
          swatch: "#fdd835",
          placeholder: "(theme)",
          onLive: (a) => this._updateItemLive(t.id, { activeColor: a }),
          onCommit: (a) => this._updateItem(t.id, { activeColor: a })
        }),
        this._renderStateColorRules(
          t.stateColor,
          (a) => this._updateItem(t.id, { stateColor: a }),
          // Only a device draws a glyph, so only a device's rules offer an
          // icon — furniture and areas share this rule shape but paint
          // polygons (issue #106).
          { icons: !0, iconPlaceholder: this._itemDefaultIcon(t) }
        )
      )}
        ${l ? this._renderGroup(
        "Effects",
        this._renderForm(l, s),
        // The ring's colour belongs with the ring, not with the badge's.
        wo(t.entity, n) && Oi(t) ? this._renderColorRow({
          label: "Ripple color",
          value: t.rippleColor,
          swatch: t.activeColor ?? "#03a9f4",
          placeholder: t.activeColor ? "(active color)" : "(primary)",
          onLive: (a) => this._updateItemLive(t.id, { rippleColor: a }),
          onCommit: (a) => this._updateItem(t.id, { rippleColor: a })
        }) : f
      ) : f}
        ${this._renderGroup("Behaviour", this._renderForm(Qd(t), s))}
        ${this._renderGroup("Visibility", this._renderForm(Xd(t), s))}
      `;
    }
    if (e.kind === "text") {
      const t = this._floor().texts.find((i) => i.id === e.id);
      return t ? g`
        ${this._renderForm(
        Jd(t, this._areaEntitiesAt(t.x, t.y)),
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
      ` : g`${f}`;
    }
    if (e.kind === "furniture") {
      const t = this._floor().furniture.find((o) => o.id === e.id);
      if (!t) return g`${f}`;
      const i = eu(t, this._areaEntitiesAt(t.x, t.y), this._symbols()), n = (o, r) => this._applyElementPatch("furniture", t.id, o, r);
      return g`
        ${S.FURNITURE_GROUPS.map(
        ([o, r]) => this._renderGroup(o, this._renderForm(q(i, r), n))
      )}
        ${this._renderGroup(
        "Color",
        this._renderColorRow({
          label: "Color",
          value: t.color,
          swatch: "#9e9e9e",
          placeholder: "(gray)",
          onLive: (o) => this._updateFurnitureLive(t.id, { color: o }),
          onCommit: (o) => this._updateFurniture(t.id, { color: o })
        }),
        // Without an entity there is nothing to condition a colour on.
        t.entity ? g`
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
              ` : f
      )}
      `;
    }
    if (e.kind === "area") {
      const t = (this._floor().areas ?? []).find((s) => s.id === e.id);
      if (!t) return g`${f}`;
      const i = qr(this.hass), n = t.haArea ? this._pendingAreaEntities(t) : [], o = nu(t), r = (s, l) => this._applyElementPatch("area", t.id, s, l);
      return g`
        ${this._renderGroup(
        // The name doubles as the HA-area link, so the link status line and
        // the name-related toggles belong with it.
        "Identity",
        this._renderForm(
          iu(t, i.map((s) => s.name)),
          (s, l) => (
            // A name change also decides `haArea` (see areaNamePatch).
            this._applyElementPatch("area", t.id, Kr(s, i), l)
          )
        ),
        this._renderAreaLinkRow(t, i),
        this._renderForm(q(o, ["showName", "labelSize"]), r)
      )}
        ${this._renderGroup(
        "What it reads",
        this._renderForm(q(o, ["entity"]), r)
      )}
        ${this._renderGroup(
        "Color",
        this._renderForm(q(o, ["highlight", "opacity", "activeOpacity"]), r),
        this._renderColorRow({
          label: "Color",
          value: t.color,
          swatch: "#03a9f4",
          placeholder: "(primary)",
          onLive: (s) => this._updateAreaLive(t.id, { color: s }),
          onCommit: (s) => this._updateArea(t.id, { color: s })
        }),
        // The colours the bound entity drives. Same shape furniture and
        // devices already use, and gated the same way — without an entity
        // there is nothing to condition on. Until this existed the Entity
        // picker above was inert on its own: areaColor() resolves nothing
        // without an activeColor or a matching rule, so binding an entity
        // in the editor changed nothing and the feature looked unbuilt.
        t.entity ? g`
                ${this._renderColorRow({
          label: "Active color",
          title: "Color while the entity is on",
          value: t.activeColor,
          swatch: "#03a9f4",
          placeholder: "(no change)",
          onLive: (s) => this._updateAreaLive(t.id, { activeColor: s }),
          onCommit: (s) => this._updateArea(t.id, { activeColor: s })
        })}
                ${this._renderStateColorRules(
          t.stateColor,
          (s) => this._updateArea(t.id, { stateColor: s })
        )}
              ` : f
      )}
        ${this._renderGroup(
        // What tapping the room does (issue #181). Last, as it is on every
        // other element: the thing it *does*, after everything it *is*.
        "Behavior",
        this._renderForm(
          q(o, ["tap_action", "hold_action", "double_tap_action"]),
          r
        )
      )}
        ${t.haArea ? this._renderGroup(
        // Everything that only exists because this room is linked to a
        // Home Assistant area.
        "Home Assistant area",
        g`<div class="row wide">
                <label>Filter entities</label>
                <input
                  type="checkbox"
                  .checked=${t.filterEntities ?? !0}
                  @change=${(s) => this._updateArea(t.id, {
          filterEntities: s.target.checked
        })}
                />
                <span class="hint"
                  >Scope the entity picker, for devices placed inside this room, to this HA
                  area's entities.</span
                >
              </div>`,
        g`<div class="row wide">
                <button
                  ?disabled=${!n.length}
                  title=${n.length ? `Add ${n.length} device${n.length === 1 ? "" : "s"} from this HA area, spread out across the room` : "Every entity in this HA area is already placed on this floor"}
                  @click=${() => this._addAreaEntities(t)}
                >
                  <ha-icon icon="mdi:shape-square-plus"></ha-icon>
                  Add all devices in this HA area${n.length ? ` (${n.length})` : ""}
                </button>
              </div>`
      ) : f}
        <p class="hint">
          Drag inside the fill to move the whole room; drag a vertex handle to reshape it.
        </p>
      `;
    }
    if (e.kind === "tracker") {
      const t = (this._floor().trackers ?? []).find((o) => o.id === e.id);
      if (!t) return g`${f}`;
      const i = tu(t), n = (o, r) => this._applyElementPatch("tracker", t.id, o, r);
      return g`
        ${this._renderGroup(
        "Zone",
        this._renderForm(q(i, S.TRACKER_GROUPS[0][1]), n)
      )}
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
        this._renderForm(q(i, S.TRACKER_GROUPS[1][1]), n),
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
      if (!t) return g`${f}`;
      const i = Math.round(Math.hypot(t.x2 - t.x1, t.y2 - t.y1));
      return g`
        ${this._renderForm(
        ou(t),
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
        const s = t.x2 - t.x1, l = t.y2 - t.y1, a = Math.hypot(s, l), c = a > 0 ? s / a : 1, h = a > 0 ? l / a : 0;
        this._updateWall(t.id, {
          x2: Math.round(t.x1 + c * r),
          y2: Math.round(t.y1 + h * r)
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
    return g`${f}`;
  }
  /**
   * Editor rows for one of a tracker's two sensor mappings (X or Y). Entity
   * picker is always shown; min / max / invert appear once a sensor entity is
   * set so the panel stays compact while empty.
   */
  _renderTrackerSensorRows(e, t, i) {
    const n = e[t];
    return g`
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
      ${n ? g`<div class="row">
            <label>${i} range</label>
            <input
              class="num"
              type="number"
              step="0.01"
              title="Reading at the near edge"
              .value=${String(n.min)}
              @change=${(o) => {
      const r = o.target, s = Number(r.value);
      r.value !== "" && Number.isFinite(s) ? this._updateTrackerSensor(e.id, t, { min: s }) : r.value = String(n.min);
    }}
            />
            <input
              class="num"
              type="number"
              step="0.01"
              title="Reading at the far edge"
              .value=${String(n.max)}
              @change=${(o) => {
      const r = o.target, s = Number(r.value);
      r.value !== "" && Number.isFinite(s) ? this._updateTrackerSensor(e.id, t, { max: s }) : r.value = String(n.max);
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
            ${n.presence ? g`<label class="inline-check" title="Treat 'off' as detected">
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
                </label>` : f}
          </div>` : f}
    `;
  }
};
S._nextWallMaskId = 0;
S.OPENING_GROUPS = [
  // What it is, and how it is drawn.
  ["Shape", ["type", "motion", "length", "sash", "hinge", "opens", "slide", "style", "angle"]],
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
S.FURNITURE_GROUPS = [
  ["Shape", ["type", "hand", "w", "h", "angle"]],
  ["What it reads", ["entity"]],
  // What clicking it does — a staircase that changes floor (issue #121).
  ["Behavior", ["goToFloor"]]
];
S.TRACKER_GROUPS = [
  ["Zone", ["w", "h", "x", "y", "angle"]],
  ["Marker", ["dotSize"]]
];
S.styles = [
  io,
  Yt`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    /* Full-screen workspace, shown as a popover so the top layer lifts it clear
       of HA's edit dialog (whose surface is transformed — see updated()). The
       resets undo the UA popover defaults: fit-content size, auto margins, a
       solid border and padding. The fixed position only matters to the
       non-popover fallback, where the transformed dialog surface is the
       containing block — there "fullscreen" fills the dialog, not the page. */
    .editor.fullscreen {
      position: fixed;
      inset: 0;
      z-index: 100;
      width: auto;
      height: auto;
      max-width: none;
      max-height: none;
      margin: 0;
      border: none;
      padding: 12px;
      box-sizing: border-box;
      color: inherit;
      background: var(--card-background-color, #fff);
      overflow: hidden;
    }
    /* Toolbar-icon buttons (Expand/Exit, Apply) — match the gear button's
       icon+label alignment so they read as part of the toolbar. */
    .expand-toggle,
    .apply-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    /* Apply writes to the dashboard, unlike everything else in the toolbar —
       accented so it reads as the one committing action. */
    .apply-btn {
      color: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
    }
    /* Why the last Apply didn't go through; sits in the toolbar so it is
       visible in the fullscreen workspace too, where nothing else is. */
    .apply-error {
      font-size: 12px;
      color: var(--error-color, #c62828);
    }
    /* Below the two toolbars: the canvas and the element/project sections.
       Stacked at dialog width; split into canvas + docked side panel when
       expanded so the extra width isn't wasted. */
    .workspace {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }
    .side {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }
    .editor.fullscreen .workspace {
      flex-direction: row;
      align-items: stretch;
      flex: 1 1 auto;
      min-height: 0;
    }
    .editor.fullscreen .canvas-outer {
      flex: 1 1 auto;
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .editor.fullscreen .canvas-wrap {
      flex: 1 1 auto;
      min-height: 0;
      height: auto;
      resize: none;
    }
    /* Docked inspector — fixed, scrollable column beside the canvas. */
    .editor.fullscreen .side {
      flex: 0 0 340px;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 2px;
    }
    /* At real dialog width the side panel can drop below instead of squeezing
       the canvas to nothing. */
    @media (max-width: 900px) {
      .editor.fullscreen .workspace {
        flex-direction: column;
        /* Stacked panels can exceed a short viewport (phone landscape) — the
           root clips, so the workspace itself must scroll. */
        overflow-y: auto;
      }
      .editor.fullscreen .side {
        flex: 0 0 auto;
        max-height: 40vh;
      }
    }
    .toolbar {
      display: flex;
      gap: 4px;
      align-items: center;
      flex-wrap: wrap;
    }
    .toolbar .spacer {
      flex: 1;
    }
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
    .opening-hit {
      cursor: move;
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
        --fp-u: calc(100cqw / var(--fp-plan-w));
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
      width: ${ot}px;
      height: ${ot}px;
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
    /* Collapsible Project section header. */
    .section-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      border: none;
      background: none;
      padding: 2px 0;
      margin: 0;
      cursor: pointer;
      color: var(--secondary-text-color);
      text-align: left;
    }
    .section-toggle ha-icon {
      --mdc-icon-size: 16px;
    }
    .section-toggle .section-title-inline {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .section-toggle .section-summary {
      font-size: 12px;
      color: var(--secondary-text-color);
      opacity: 0.8;
      text-transform: none;
    }
    .panel-body {
      margin-top: 10px;
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
    /* ---- Element panel groups --------------------------------------------
       The device panel is two dozen controls; ungrouped, finding one meant
       reading all of them. Each group is a heading and a hairline above it,
       with real space between groups so the eye can skip a whole section it
       does not want.

       The rule is on the group rather than between them, and the first group
       drops it: a line above the very first heading would read as a border
       around the panel rather than as a separator inside it. */
    .cfg-group {
      border-top: 1px solid var(--divider-color, #e0e0e0);
      padding-top: 14px;
      margin-top: 18px;
    }
    /* A collapsed group is one line, and a column of one-line headings wants
       to read as a list rather than as eight things with a gap each. */
    .cfg-group:not(.open) {
      padding-top: 8px;
      margin-top: 8px;
    }
    /* Ties with the rule above on specificity, so it has to stay below it:
       the first group leads the panel and takes no space above it whether it
       is open or shut. */
    .cfg-group:first-of-type {
      border-top: none;
      padding-top: 0;
      margin-top: 0;
    }
    /* The heading names the group without competing with the field labels
       beneath it: same size, but the primary ink and a little letter-spacing,
       so it reads as a heading rather than as one more row label.

       It is also the group's disclosure control, so it undoes the panel's
       generic button look (border, chip padding, capitalize — which would
       print "What it reads" as "What It Reads") and keeps the heading's own
       type. Full width so the whole line is the hit target, not just the
       glyph. */
    .cfg-group-title {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      margin: 0 0 10px;
      padding: 2px 0;
      border: none;
      border-radius: 0;
      background: none;
      cursor: pointer;
      text-align: left;
      text-transform: none;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: var(--primary-text-color);
    }
    /* The chevron is the affordance, so it stays quieter than the title it
       points at. */
    .cfg-group-title ha-icon {
      --mdc-icon-size: 18px;
      flex: none;
      color: var(--secondary-text-color);
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
  `
];
M([
  ei({ attribute: !1 })
], S.prototype, "hass", 2);
M([
  I()
], S.prototype, "_config", 2);
M([
  I()
], S.prototype, "_tool", 2);
M([
  I()
], S.prototype, "_selection", 2);
M([
  I()
], S.prototype, "_activeFloorId", 2);
M([
  I()
], S.prototype, "_draft", 2);
M([
  I()
], S.prototype, "_draftTracker", 2);
M([
  I()
], S.prototype, "_draftArea", 2);
M([
  I()
], S.prototype, "_areaHover", 2);
M([
  I()
], S.prototype, "_freeWalls", 2);
M([
  I()
], S.prototype, "_defaultOpeningLength", 2);
M([
  I()
], S.prototype, "_marquee", 2);
M([
  I()
], S.prototype, "_history", 2);
M([
  I()
], S.prototype, "_future", 2);
M([
  I()
], S.prototype, "_zoom", 2);
M([
  I()
], S.prototype, "_floorMenuOpen", 2);
M([
  I()
], S.prototype, "_addMenuOpen", 2);
M([
  I()
], S.prototype, "_addQuery", 2);
M([
  I()
], S.prototype, "_symbolDraft", 2);
M([
  I()
], S.prototype, "_symbolError", 2);
M([
  I()
], S.prototype, "_projectOpen", 2);
M([
  I()
], S.prototype, "_openGroups", 2);
M([
  I()
], S.prototype, "_fullscreen", 2);
M([
  I()
], S.prototype, "_applyState", 2);
M([
  I()
], S.prototype, "_applyError", 2);
M([
  ti(".editor")
], S.prototype, "_editorEl", 2);
M([
  ti("svg")
], S.prototype, "_svg", 2);
M([
  ti(".canvas-wrap")
], S.prototype, "_canvasWrap", 2);
M([
  I()
], S.prototype, "_hideLabels", 2);
S = M([
  Un("easy-floorplan-card-editor")
], S);
const _u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get FloorplanCardEditor() {
    return S;
  }
}, Symbol.toStringTag, { value: "Module" })), $u = "0.7.2", qt = window;
qt.customCards = qt.customCards || [];
qt.customCards.push({
  type: "easy-floorplan-card",
  name: "Easy Floorplan",
  description: "Draw a floorplan with walls, doors, windows, furniture and text, then place device/light controls with a visual editor.",
  preview: !1,
  documentationURL: "https://github.com/nicosandller/easy-floorplan"
});
console.info(
  `%c EASY-FLOORPLAN %c ${$u} `,
  "background:#03a9f4;color:#fff",
  "color:#03a9f4"
);
export {
  W as FloorplanCard
};
