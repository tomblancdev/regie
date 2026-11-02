/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nn = globalThis, ar = nn.ShadowRoot && (nn.ShadyCSS === void 0 || nn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lr = Symbol(), Xr = /* @__PURE__ */ new WeakMap();
let Ga = class {
  constructor(e, i, n) {
    if (this._$cssResult$ = !0, n !== lr) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ar && e === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (e = Xr.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Xr.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const _n = (t) => new Ga(typeof t == "string" ? t : t + "", void 0, lr), re = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((n, o, r) => n + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[r + 1], t[0]);
  return new Ga(i, t, lr);
}, vd = (t, e) => {
  if (ar) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const n = document.createElement("style"), o = nn.litNonce;
    o !== void 0 && n.setAttribute("nonce", o), n.textContent = i.cssText, t.appendChild(n);
  }
}, Zr = ar ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const n of e.cssRules) i += n.cssText;
  return _n(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: xd, defineProperty: wd, getOwnPropertyDescriptor: _d, getOwnPropertyNames: $d, getOwnPropertySymbols: kd, getPrototypeOf: Sd } = Object, qn = globalThis, Qr = qn.trustedTypes, Md = Qr ? Qr.emptyScript : "", Ed = qn.reactiveElementPolyfillSupport, bi = (t, e) => t, $n = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Md : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, cr = (t, e) => !xd(t, e), Jr = { attribute: !0, type: String, converter: $n, reflect: !1, useDefault: !1, hasChanged: cr };
Symbol.metadata ??= Symbol("metadata"), qn.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let De = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Jr) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const n = Symbol(), o = this.getPropertyDescriptor(e, n, i);
      o !== void 0 && wd(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, i, n) {
    const { get: o, set: r } = _d(this.prototype, e) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: o, set(s) {
      const a = o?.call(this);
      r?.call(this, s), this.requestUpdate(e, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Jr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(bi("elementProperties"))) return;
    const e = Sd(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(bi("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(bi("properties"))) {
      const i = this.properties, n = [...$d(i), ...kd(i)];
      for (const o of n) this.createProperty(o, i[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [n, o] of i) this.elementProperties.set(n, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, n] of this.elementProperties) {
      const o = this._$Eu(i, n);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const o of n) i.unshift(Zr(o));
    } else e !== void 0 && i.push(Zr(e));
    return i;
  }
  static _$Eu(e, i) {
    const n = i.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const n of i.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return vd(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, n) {
    this._$AK(e, n);
  }
  _$ET(e, i) {
    const n = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, n);
    if (o !== void 0 && n.reflect === !0) {
      const r = (n.converter?.toAttribute !== void 0 ? n.converter : $n).toAttribute(i, n.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const n = this.constructor, o = n._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const r = n.getPropertyOptions(o), s = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : $n;
      this._$Em = o;
      const a = s.fromAttribute(i, r.type);
      this[o] = a ?? this._$Ej?.get(o) ?? a, this._$Em = null;
    }
  }
  requestUpdate(e, i, n, o = !1, r) {
    if (e !== void 0) {
      const s = this.constructor;
      if (o === !1 && (r = this[e]), n ??= s.getPropertyOptions(e), !((n.hasChanged ?? cr)(r, i) || n.useDefault && n.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(s._$Eu(e, n)))) return;
      this.C(e, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: n, reflect: o, wrapped: r }, s) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, s ?? i ?? this[e]), r !== !0 || s !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (i = void 0), this._$AL.set(e, i)), o === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
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
        const { wrapped: s } = r, a = this[o];
        s !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, r, a);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((n) => n.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (n) {
      throw e = !1, this._$EM(), n;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
De.elementStyles = [], De.shadowRootOptions = { mode: "open" }, De[bi("elementProperties")] = /* @__PURE__ */ new Map(), De[bi("finalized")] = /* @__PURE__ */ new Map(), Ed?.({ ReactiveElement: De }), (qn.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dr = globalThis, ts = (t) => t, kn = dr.trustedTypes, es = kn ? kn.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ka = "$lit$", de = `lit$${Math.random().toFixed(9).slice(2)}$`, Xa = "?" + de, Ad = `<${Xa}>`, Ce = document, Si = () => Ce.createComment(""), Mi = (t) => t === null || typeof t != "object" && typeof t != "function", hr = Array.isArray, Td = (t) => hr(t) || typeof t?.[Symbol.iterator] == "function", go = `[ 	
\f\r]`, li = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, is = /-->/g, ns = />/g, ve = RegExp(`>|${go}(?:([^\\s"'>=/]+)(${go}*=${go}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), os = /'/g, rs = /"/g, Za = /^(?:script|style|textarea|title)$/i, Qa = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), v = Qa(1), $ = Qa(2), Qt = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), ss = /* @__PURE__ */ new WeakMap(), ke = Ce.createTreeWalker(Ce, 129);
function Ja(t, e) {
  if (!hr(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return es !== void 0 ? es.createHTML(e) : e;
}
const Cd = (t, e) => {
  const i = t.length - 1, n = [];
  let o, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = li;
  for (let a = 0; a < i; a++) {
    const l = t[a];
    let c, d, h = -1, p = 0;
    for (; p < l.length && (s.lastIndex = p, d = s.exec(l), d !== null); ) p = s.lastIndex, s === li ? d[1] === "!--" ? s = is : d[1] !== void 0 ? s = ns : d[2] !== void 0 ? (Za.test(d[2]) && (o = RegExp("</" + d[2], "g")), s = ve) : d[3] !== void 0 && (s = ve) : s === ve ? d[0] === ">" ? (s = o ?? li, h = -1) : d[1] === void 0 ? h = -2 : (h = s.lastIndex - d[2].length, c = d[1], s = d[3] === void 0 ? ve : d[3] === '"' ? rs : os) : s === rs || s === os ? s = ve : s === is || s === ns ? s = li : (s = ve, o = void 0);
    const f = s === ve && t[a + 1].startsWith("/>") ? " " : "";
    r += s === li ? l + Ad : h >= 0 ? (n.push(c), l.slice(0, h) + Ka + l.slice(h) + de + f) : l + de + (h === -2 ? a : f);
  }
  return [Ja(t, r + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class Ei {
  constructor({ strings: e, _$litType$: i }, n) {
    let o;
    this.parts = [];
    let r = 0, s = 0;
    const a = e.length - 1, l = this.parts, [c, d] = Cd(e, i);
    if (this.el = Ei.createElement(c, n), ke.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = ke.nextNode()) !== null && l.length < a; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(Ka)) {
          const p = d[s++], f = o.getAttribute(h).split(de), u = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: r, name: u[2], strings: f, ctor: u[1] === "." ? zd : u[1] === "?" ? Pd : u[1] === "@" ? Od : Yn }), o.removeAttribute(h);
        } else h.startsWith(de) && (l.push({ type: 6, index: r }), o.removeAttribute(h));
        if (Za.test(o.tagName)) {
          const h = o.textContent.split(de), p = h.length - 1;
          if (p > 0) {
            o.textContent = kn ? kn.emptyScript : "";
            for (let f = 0; f < p; f++) o.append(h[f], Si()), ke.nextNode(), l.push({ type: 2, index: ++r });
            o.append(h[p], Si());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Xa) l.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(de, h + 1)) !== -1; ) l.push({ type: 7, index: r }), h += de.length - 1;
      }
      r++;
    }
  }
  static createElement(e, i) {
    const n = Ce.createElement("template");
    return n.innerHTML = e, n;
  }
}
function Qe(t, e, i = t, n) {
  if (e === Qt) return e;
  let o = n !== void 0 ? i._$Co?.[n] : i._$Cl;
  const r = Mi(e) ? void 0 : e._$litDirective$;
  return o?.constructor !== r && (o?._$AO?.(!1), r === void 0 ? o = void 0 : (o = new r(t), o._$AT(t, i, n)), n !== void 0 ? (i._$Co ??= [])[n] = o : i._$Cl = o), o !== void 0 && (e = Qe(t, o._$AS(t, e.values), o, n)), e;
}
class Id {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: n } = this._$AD, o = (e?.creationScope ?? Ce).importNode(i, !0);
    ke.currentNode = o;
    let r = ke.nextNode(), s = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let c;
        l.type === 2 ? c = new ni(r, r.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (c = new Ld(r, this, e)), this._$AV.push(c), l = n[++a];
      }
      s !== l?.index && (r = ke.nextNode(), s++);
    }
    return ke.currentNode = Ce, o;
  }
  p(e) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, i), i += n.strings.length - 2) : n._$AI(e[i])), i++;
  }
}
class ni {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, n, o) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = n, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = Qe(this, e, i), Mi(e) ? e === y || e == null || e === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : e !== this._$AH && e !== Qt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Td(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== y && Mi(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Ce.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: n } = e, o = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ei.createElement(Ja(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === o) this._$AH.p(i);
    else {
      const r = new Id(o, this), s = r.u(this.options);
      r.p(i), this.T(s), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = ss.get(e.strings);
    return i === void 0 && ss.set(e.strings, i = new Ei(e)), i;
  }
  k(e) {
    hr(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, o = 0;
    for (const r of e) o === i.length ? i.push(n = new ni(this.O(Si()), this.O(Si()), this, this.options)) : n = i[o], n._$AI(r), o++;
    o < i.length && (this._$AR(n && n._$AB.nextSibling, o), i.length = o);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const n = ts(e).nextSibling;
      ts(e).remove(), e = n;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Yn {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, n, o, r) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = e, this.name = i, this._$AM = o, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = y;
  }
  _$AI(e, i = this, n, o) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) e = Qe(this, e, i, 0), s = !Mi(e) || e !== this._$AH && e !== Qt, s && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = r[0], l = 0; l < r.length - 1; l++) c = Qe(this, a[n + l], i, l), c === Qt && (c = this._$AH[l]), s ||= !Mi(c) || c !== this._$AH[l], c === y ? e = y : e !== y && (e += (c ?? "") + r[l + 1]), this._$AH[l] = c;
    }
    s && !o && this.j(e);
  }
  j(e) {
    e === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class zd extends Yn {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === y ? void 0 : e;
  }
}
class Pd extends Yn {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== y);
  }
}
class Od extends Yn {
  constructor(e, i, n, o, r) {
    super(e, i, n, o, r), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = Qe(this, e, i, 0) ?? y) === Qt) return;
    const n = this._$AH, o = e === y && n !== y || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, r = e !== y && (n === y || o);
    o && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ld {
  constructor(e, i, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Qe(this, e);
  }
}
const Fd = { I: ni }, Rd = dr.litHtmlPolyfillSupport;
Rd?.(Ei, ni), (dr.litHtmlVersions ??= []).push("3.3.3");
const tl = (t, e, i) => {
  const n = i?.renderBefore ?? e;
  let o = n._$litPart$;
  if (o === void 0) {
    const r = i?.renderBefore ?? null;
    n._$litPart$ = o = new ni(e.insertBefore(Si(), r), r, void 0, i ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pr = globalThis;
let fe = class extends De {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = tl(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Qt;
  }
};
fe._$litElement$ = !0, fe.finalized = !0, pr.litElementHydrateSupport?.({ LitElement: fe });
const Dd = pr.litElementPolyfillSupport;
Dd?.({ LitElement: fe });
(pr.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gn = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nd = { attribute: !0, type: String, converter: $n, reflect: !1, hasChanged: cr }, Hd = (t = Nd, e, i) => {
  const { kind: n, metadata: o } = i;
  let r = globalThis.litPropertyMetadata.get(o);
  if (r === void 0 && globalThis.litPropertyMetadata.set(o, r = /* @__PURE__ */ new Map()), n === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(i.name, t), n === "accessor") {
    const { name: s } = i;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(s, l, t, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(s, void 0, t, a), a;
    } };
  }
  if (n === "setter") {
    const { name: s } = i;
    return function(a) {
      const l = this[s];
      e.call(this, a), this.requestUpdate(s, l, t, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function at(t) {
  return (e, i) => typeof i == "object" ? Hd(t, e, i) : ((n, o, r) => {
    const s = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, n), s ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Y(t) {
  return at({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jd = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ur(t, e) {
  return (i, n, o) => {
    const r = (s) => s.renderRoot?.querySelector(t) ?? null;
    return jd(i, n, { get() {
      return r(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wd = { CHILD: 2 }, Kn = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Xn = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, i, n) {
    this._$Ct = e, this._$AM = i, this._$Ci = n;
  }
  _$AS(e, i) {
    return this.update(e, i);
  }
  update(e, i) {
    return this.render(...i);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: Bd } = Fd, as = (t) => t, ls = () => document.createComment(""), ci = (t, e, i) => {
  const n = t._$AA.parentNode, o = e === void 0 ? t._$AB : e._$AA;
  if (i === void 0) {
    const r = n.insertBefore(ls(), o), s = n.insertBefore(ls(), o);
    i = new Bd(r, s, t, t.options);
  } else {
    const r = i._$AB.nextSibling, s = i._$AM, a = s !== t;
    if (a) {
      let l;
      i._$AQ?.(t), i._$AM = t, i._$AP !== void 0 && (l = t._$AU) !== s._$AU && i._$AP(l);
    }
    if (r !== o || a) {
      let l = i._$AA;
      for (; l !== r; ) {
        const c = as(l).nextSibling;
        as(n).insertBefore(l, o), l = c;
      }
    }
  }
  return i;
}, xe = (t, e, i = t) => (t._$AI(e, i), t), Ud = {}, el = (t, e = Ud) => t._$AH = e, Vd = (t) => t._$AH, bo = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const cs = (t, e, i) => {
  const n = /* @__PURE__ */ new Map();
  for (let o = e; o <= i; o++) n.set(t[o], o);
  return n;
}, jt = Kn(class extends Xn {
  constructor(t) {
    if (super(t), t.type !== Wd.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, i) {
    let n;
    i === void 0 ? i = e : e !== void 0 && (n = e);
    const o = [], r = [];
    let s = 0;
    for (const a of t) o[s] = n ? n(a, s) : s, r[s] = i(a, s), s++;
    return { values: r, keys: o };
  }
  render(t, e, i) {
    return this.dt(t, e, i).values;
  }
  update(t, [e, i, n]) {
    const o = Vd(t), { values: r, keys: s } = this.dt(e, i, n);
    if (!Array.isArray(o)) return this.ut = s, r;
    const a = this.ut ??= [], l = [];
    let c, d, h = 0, p = o.length - 1, f = 0, u = r.length - 1;
    for (; h <= p && f <= u; ) if (o[h] === null) h++;
    else if (o[p] === null) p--;
    else if (a[h] === s[f]) l[f] = xe(o[h], r[f]), h++, f++;
    else if (a[p] === s[u]) l[u] = xe(o[p], r[u]), p--, u--;
    else if (a[h] === s[u]) l[u] = xe(o[h], r[u]), ci(t, l[u + 1], o[h]), h++, u--;
    else if (a[p] === s[f]) l[f] = xe(o[p], r[f]), ci(t, o[h], o[p]), p--, f++;
    else if (c === void 0 && (c = cs(s, f, u), d = cs(a, h, p)), c.has(a[h])) if (c.has(a[p])) {
      const m = d.get(s[f]), b = m !== void 0 ? o[m] : null;
      if (b === null) {
        const g = ci(t, o[h]);
        xe(g, r[f]), l[f] = g;
      } else l[f] = xe(b, r[f]), ci(t, o[h], b), o[m] = null;
      f++;
    } else bo(o[p]), p--;
    else bo(o[h]), h++;
    for (; f <= u; ) {
      const m = ci(t, l[u + 1]);
      xe(m, r[f]), l[f++] = m;
    }
    for (; h <= p; ) {
      const m = o[h++];
      m !== null && bo(m);
    }
    return this.ut = s, el(t, l), Qt;
  }
});
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Po = Kn(class extends Xn {
  constructor() {
    super(...arguments), this.key = y;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, i]) {
    return e !== this.key && (el(t), this.key = e), i;
  }
});
function il(t) {
  const e = (o, r) => {
    const s = o;
    if (s && typeof s.y == "number" && Number.isFinite(s.y)) return;
    const a = s && (Object.prototype.hasOwnProperty.call(s, "true") ? "true" : Object.prototype.hasOwnProperty.call(s, "Y") ? "Y" : void 0), l = a ? ` Replace the "${a}" key with quoted lowercase 'y' in YAML (for example, 'y': 141).` : " In YAML, quote the lowercase key (for example, 'y': 141).";
    throw new Error(`Invalid configuration: ${r}.y must be a finite number.${l}`);
  }, i = (o, r) => {
    if (!o || typeof o != "object") return;
    const s = o;
    for (const a of ["openings", "items", "texts", "furniture", "trackers"]) {
      const l = s[a];
      Array.isArray(l) && l.forEach((c, d) => e(c, `${r}${a}[${d}]`));
    }
    Array.isArray(s.areas) && s.areas.forEach((a, l) => {
      Array.isArray(a?.points) && a.points.forEach((c, d) => e(c, `${r}areas[${l}].points[${d}]`));
    });
  };
  Array.isArray(t.floors) && t.floors.length ? t.floors.forEach((o, r) => i(o, `floors[${r}].`)) : i(t, "");
  const n = t.floorSwitcher;
  n && (Object.prototype.hasOwnProperty.call(n, "true") || Object.prototype.hasOwnProperty.call(n, "Y")) && e(n, "floorSwitcher");
}
function nl(t) {
  const e = t.floorSwitcher?.layout;
  return `${e === "horizontal" || e !== "vertical" && t.compactHeader === !0 ? "row" : ""} ${t.floorSwitcher?.style === "buttons" ? "buttons" : ""}`;
}
const ol = re`
  .floor-switcher {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--fp-floor-switcher-gap, var(--_fp-floor-gap, 4px));
    max-width: calc(100% - 16px);
  }
  /* Summary buttons are taller, so a stack of them may need to scroll. Only
     these switchers scroll: overflow-y: auto also clips overflow-x, and the
     padding (taken back by the margin) keeps the buttons' shadow and focus
     ring inside the clip. */
  .floor-switcher.has-summaries {
    max-height: calc(100% - 24px);
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    padding: 4px;
    margin: -4px;
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
  :where(.floor-switcher) .floor-button.has-summary {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: var(--fp-floor-switcher-max-width, 220px);
    line-height: 1.2;
    padding: var(--fp-floor-switcher-padding, var(--_fp-floor-padding, 6px 10px));
  }
  :where(.floor-switcher) .floor-button-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
  :where(.floor-switcher) .floor-button-summary {
    font-size: var(--fp-floor-switcher-summary-size, 11px);
    opacity: var(--fp-floor-switcher-summary-opacity, 0.85);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-weight: normal;
  }
`;
function gt(t) {
  return t.type === "skylight";
}
function Ut(t) {
  return t.type === "passage";
}
const ee = ["top", "right", "bottom", "left"];
function ds(t) {
  return !!t?.haArea && (t.filterEntities ?? !0);
}
const Ae = -6, Oo = 6, fr = 0.45, Sn = 1, rl = "scale", sl = "dim", hs = 0.92, ps = 80, us = 260, Lo = 0.25, Fo = 4, al = 10, Ro = 1, mr = 14, qd = 3, Ai = 140, Zn = 4, ll = 10, fs = 160, cl = "var(--fp-skin-glow, #ffd9a0)", ms = 0.18, Mn = 0.6, ys = 0.5, gs = 0.45, Yd = 0.5, yr = 14, ne = 34, En = 34, Gd = ne, Kd = 20, vi = 16, Qn = 80, Jn = 0, to = 360, dl = "var(--fp-skin-furniture, #9e9e9e)", gr = 1, Xd = [
  "temperature",
  "humidity",
  "presence",
  "lights",
  "windows"
], Ct = 1e3, Ot = 600, br = 20, bs = 50;
function Zd(t, e) {
  return t ?? e;
}
function vs(t, e) {
  return e <= 0 ? 100 : Math.round(t / e * 100);
}
function vo(t, e) {
  return Math.max(1, Math.round(e * t / 100));
}
function Do(t) {
  const e = t?.floors;
  return !e || typeof e != "object" ? [] : Object.values(e).filter((i) => !!i && typeof i.floor_id == "string" && typeof i.name == "string").sort((i, n) => (i.level ?? 0) - (n.level ?? 0) || i.name.localeCompare(n.name));
}
function hl(t) {
  const e = t?.areas;
  return !e || typeof e != "object" ? [] : Object.values(e).filter((i) => !!i && typeof i.area_id == "string" && typeof i.name == "string").sort((i, n) => i.name.localeCompare(n.name));
}
function Qd(t, e) {
  if (!("name" in t)) return t;
  const i = (t.name ?? "").toString().trim(), n = Jd(e, i);
  return { ...t, name: n ? n.name : i || void 0, haArea: n?.area_id };
}
function Jd(t, e) {
  const i = (e ?? "").trim();
  if (!i) return;
  const n = t.find((a) => a.name === i);
  if (n) return n;
  const o = i.toLowerCase(), r = t.find((a) => a.name.toLowerCase() === o);
  if (r) return r;
  const s = o.replace(/\s+/g, " ");
  return t.find((a) => a.name.trim().toLowerCase().replace(/\s+/g, " ") === s);
}
function th(t, e) {
  const i = t, n = i?.entities?.[e];
  return n ? n.area_id ? n.area_id : (n.device_id ? i?.devices?.[n.device_id] : void 0)?.area_id ?? void 0 : void 0;
}
function on(t, e) {
  const n = t?.entities;
  return !n || typeof n != "object" ? [] : Object.keys(n).filter((o) => th(t, o) === e);
}
function eh(t) {
  return {
    type: t,
    width: Ct,
    height: Ot,
    grid: br,
    walls: [],
    openings: [],
    items: [],
    texts: [],
    furniture: [],
    trackers: [],
    areas: []
  };
}
function ih() {
  return { overlayScale: "plan", showViewControls: !0 };
}
function ht(t) {
  return `${t}_${Math.random().toString(36).slice(2, 9)}`;
}
function No(t, e) {
  if (t === e) return !0;
  if (Array.isArray(t) || Array.isArray(e))
    return !Array.isArray(t) || !Array.isArray(e) || t.length !== e.length ? !1 : t.every((o, r) => No(o, e[r]));
  if (typeof t != "object" || typeof e != "object" || t === null || e === null) return !1;
  const i = t, n = e;
  for (const o of /* @__PURE__ */ new Set([...Object.keys(i), ...Object.keys(n)]))
    if (!No(i[o], n[o])) return !1;
  return !0;
}
function nh(t, e = []) {
  return {
    id: ht("floor"),
    name: t,
    walls: e,
    openings: [],
    items: [],
    texts: [],
    furniture: [],
    trackers: [],
    areas: [],
    roofs: []
  };
}
function oh(t) {
  return {
    ...t,
    walls: t.walls ?? [],
    openings: t.openings ?? [],
    items: t.items ?? [],
    texts: t.texts ?? [],
    furniture: t.furniture ?? [],
    trackers: t.trackers ?? [],
    areas: t.areas ?? [],
    roofs: t.roofs ?? []
  };
}
function Vi(t) {
  return t.roofs ?? [];
}
function Pe(t, e, i) {
  if (typeof t.level == "number" && !isNaN(t.level))
    return t.level;
  if (t.haFloor !== void 0 && t.haFloor !== "") {
    const s = Do(i).find((a) => a.floor_id === t.haFloor);
    if (s?.level != null)
      return s.level;
  }
  const o = e.filter((r) => !r.isOutdoor).findIndex((r) => r.id === t.id);
  return o !== -1 ? o : 0;
}
function rh(t) {
  const e = /* @__PURE__ */ new Set();
  return t.map((i, n) => {
    let o = i.id || `floor_${n + 1}`;
    for (; e.has(o); ) o = `${o}_${n + 1}`;
    return e.add(o), o === i.id ? i : { ...i, id: o };
  });
}
function sh(t, e, i) {
  const n = t.findIndex((a) => a.id === e), o = n + i;
  if (n < 0 || o < 0 || o >= t.length) return null;
  const r = [...t], [s] = r.splice(n, 1);
  return r.splice(o, 0, s), r;
}
function yt(t) {
  return t.floors && t.floors.length ? rh(t.floors.map(oh)) : [
    {
      id: "floor_main",
      name: "Floor 1",
      walls: t.walls ?? [],
      openings: t.openings ?? [],
      items: t.items ?? [],
      texts: t.texts ?? [],
      furniture: t.furniture ?? [],
      trackers: t.trackers ?? [],
      areas: t.areas ?? [],
      roofs: t.roofs ?? []
    }
  ];
}
function An(t, e) {
  if (!e) return null;
  const i = t?.[e.entity]?.state;
  if (i == null || i === "unavailable" || i === "unknown") return !1;
  const n = i === "on" || i === "open" || i === "home" || i === "detected";
  return e.invert ? !n : n;
}
function xs(t, e) {
  if (!t || e == null || !Number.isFinite(e)) return null;
  const i = t.max - t.min;
  if (i === 0) return null;
  const n = (e - t.min) / i, o = Math.max(0, Math.min(1, n));
  return t.invert ? 1 - o : o;
}
function Ho(t) {
  if (!t) return;
  const e = t.trim().toUpperCase().replace("°", "");
  if (e === "C" || e === "CELSIUS") return "C";
  if (e === "F" || e === "FAHRENHEIT") return "F";
  if (e === "K" || e === "KELVIN") return "K";
}
function ah(t, e, i) {
  const n = Ho(e), o = Ho(i);
  if (!n || !o || n === o) return t;
  let r = t;
  return n === "F" ? r = (t - 32) * 5 / 9 : n === "K" && (r = t - 273.15), o === "C" ? r : o === "F" ? r * 9 / 5 + 32 : o === "K" ? r + 273.15 : t;
}
function jo(t, e, i = gr) {
  if (t === null || !Number.isFinite(t)) return "";
  const n = Math.pow(10, i), o = Math.round(t * n) / n, r = i > 0 ? o.toFixed(i) : String(o);
  return e ? e.startsWith("°") || e === "%" ? `${r}${e}` : `${r} ${e}` : r;
}
const lh = /* @__PURE__ */ new Set([
  "sensor",
  "binary_sensor",
  "climate",
  "light",
  "cover",
  "person",
  "device_tracker"
]);
function pl(t, e) {
  const i = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  for (const o of t.areas ?? [])
    o.haArea && n.add(o.haArea);
  if (t.haFloor)
    for (const o of hl(e))
      o.floor_id === t.haFloor && n.add(o.area_id);
  for (const o of n)
    for (const r of on(e, o))
      lh.has(r.split(".")[0]) && i.add(r);
  return [...i];
}
function he(t, e) {
  return t.summary?.enabled === !1 ? !1 : !!(e?.enabled || t.summary?.enabled === !0 || t.summary?.temperatureEntity || t.summary?.humidityEntity || t.summary?.presenceEntity || t.summary?.customText);
}
function ch(t, e, i) {
  const n = {
    temperature: [],
    humidity: [],
    presence: [],
    lights: [],
    windows: [],
    all: []
  };
  if (!t) return n;
  const o = /* @__PURE__ */ new Set();
  for (const s of t.items ?? []) {
    s.entity && o.add(s.entity), s.secondaryEntity && o.add(s.secondaryEntity);
    for (const a of s.readings ?? [])
      a.entity && o.add(a.entity);
  }
  for (const s of t.openings ?? [])
    s.entity && o.add(s.entity), s.secondaryEntity && o.add(s.secondaryEntity);
  for (const s of t.trackers ?? [])
    s.xSensor?.entity && o.add(s.xSensor.entity), s.ySensor?.entity && o.add(s.ySensor.entity), s.xSensor?.presence?.entity && o.add(s.xSensor.presence.entity), s.ySensor?.presence?.entity && o.add(s.ySensor.presence.entity);
  for (const s of t.areas ?? [])
    s.entity && o.add(s.entity);
  for (const s of i ?? pl(t, e))
    o.add(s);
  t.summary?.temperatureEntity && o.add(t.summary.temperatureEntity), t.summary?.humidityEntity && o.add(t.summary.humidityEntity), t.summary?.presenceEntity && o.add(t.summary.presenceEntity), n.all = Array.from(o);
  const r = e?.states ?? {};
  for (const s of o) {
    const l = r[s]?.attributes ?? {}, c = l.device_class, d = l.unit_of_measurement, h = s.split(".")[0], p = Ho(d);
    (h === "climate" || h === "sensor" && (c === "temperature" || p === "C" || p === "F")) && n.temperature.push(s), (h === "sensor" && c === "humidity" || h === "climate" && l.current_humidity !== void 0) && n.humidity.push(s), (h === "binary_sensor" && (c === "occupancy" || c === "motion" || c === "presence") || h === "person" || h === "device_tracker") && n.presence.push(s), h === "light" && n.lights.push(s), (t.openings?.some(
      (A) => A.entity === s || A.secondaryEntity === s
    ) || c === "window" || c === "door" || c === "garage_door" || c === "opening") && n.windows.push(s);
  }
  return n;
}
function ws(t, e, i, n) {
  const o = n?.decimals ?? gr, r = new Set(e ?? []), s = [];
  if (!i || !t.length)
    return {
      value: null,
      formatted: "",
      unit: n?.preferredUnit ?? "",
      count: 0,
      entityIds: []
    };
  const a = i.states ?? {}, l = t.filter((b) => !r.has(b));
  let c = n?.preferredUnit;
  if (!c) {
    for (const b of l) {
      const g = a[b];
      if (g && g.state !== "unavailable" && g.state !== "unknown") {
        const w = g.attributes?.unit_of_measurement;
        if (w) {
          c = w;
          break;
        }
      }
    }
    !c && l.some((b) => b.startsWith("climate.")) && (c = "°");
  }
  let d = 0, h = 0;
  for (const b of l) {
    const g = a[b];
    if (!g || g.state === "unavailable" || g.state === "unknown")
      continue;
    let w;
    if (n?.attribute ? w = g.attributes?.[n.attribute] : b.startsWith("climate.") ? c === "%" || n?.preferredUnit === "%" ? w = g.attributes?.current_humidity : w = g.attributes?.current_temperature ?? g.state : w = g.state, w == null || w === "")
      continue;
    const A = typeof w == "number" ? w : parseFloat(String(w));
    if (Number.isNaN(A) || !Number.isFinite(A))
      continue;
    const M = g.attributes?.unit_of_measurement, k = ah(A, M, c);
    d += k, h++, s.push(b);
  }
  if (h === 0)
    return {
      value: null,
      formatted: "",
      unit: c ?? "",
      count: 0,
      entityIds: []
    };
  const p = d / h, f = Math.pow(10, o), u = Math.round(p * f) / f, m = jo(u, c, o);
  return {
    value: u,
    formatted: m,
    unit: c ?? "",
    count: h,
    entityIds: s
  };
}
function dh(t, e, i, n) {
  const o = he(t, i), r = i?.decimals ?? gr, s = t.summary?.excludeEntities, a = new Set(s ?? []), l = ch(t, e, n), c = e?.states ?? {};
  let d;
  if (t.summary?.temperatureEntity) {
    const S = t.summary.temperatureEntity, _ = c[S];
    if (_ && _.state !== "unavailable" && _.state !== "unknown") {
      const P = S.startsWith("climate.") ? _.attributes?.current_temperature ?? _.state : _.state, L = typeof P == "number" ? P : parseFloat(String(P));
      if (!Number.isNaN(L) && Number.isFinite(L)) {
        const N = _.attributes?.unit_of_measurement ?? "°", U = Math.pow(10, r), H = Math.round(L * U) / U;
        d = {
          value: H,
          formatted: jo(H, N, r),
          unit: N,
          count: 1,
          entityIds: [S]
        };
      } else
        d = { value: null, formatted: "", unit: "", count: 0, entityIds: [] };
    } else
      d = { value: null, formatted: "", unit: "", count: 0, entityIds: [] };
  } else
    d = ws(l.temperature, s, e, { decimals: r });
  let h;
  if (t.summary?.humidityEntity) {
    const S = t.summary.humidityEntity, _ = c[S];
    if (_ && _.state !== "unavailable" && _.state !== "unknown") {
      const P = S.startsWith("climate.") ? _.attributes?.current_humidity ?? _.state : _.state, L = typeof P == "number" ? P : parseFloat(String(P));
      if (!Number.isNaN(L) && Number.isFinite(L)) {
        const N = _.attributes?.unit_of_measurement ?? "%", U = Math.pow(10, 0), H = Math.round(L * U) / U;
        h = {
          value: H,
          formatted: jo(H, N, 0),
          unit: N,
          count: 1,
          entityIds: [S]
        };
      } else
        h = { value: null, formatted: "", unit: "", count: 0, entityIds: [] };
    } else
      h = { value: null, formatted: "", unit: "", count: 0, entityIds: [] };
  } else
    h = ws(l.humidity, s, e, {
      decimals: 0,
      preferredUnit: "%"
    });
  let p = !1, f = 0;
  const u = [];
  if (t.summary?.presenceEntity) {
    const S = t.summary.presenceEntity, _ = c[S];
    if (_ && _.state !== "unavailable" && _.state !== "unknown") {
      const P = String(_.state).toLowerCase(), L = parseFloat(P);
      (P === "on" || P === "home" || P === "occupied" || !isNaN(L) && L > 0) && (p = !0, f = !isNaN(L) && L > 0 ? L : 1), u.push(S);
    }
  } else {
    const S = l.presence.filter((_) => !a.has(_));
    for (const _ of S) {
      const P = c[_];
      if (P && P.state !== "unavailable" && P.state !== "unknown") {
        const L = String(P.state).toLowerCase(), N = parseFloat(L);
        (L === "on" || L === "home" || L === "occupied" || !isNaN(N) && N > 0) && (p = !0, _.startsWith("person.") && f++, u.push(_));
      }
    }
    p && f === 0 && (f = 1);
  }
  const m = p ? f > 1 ? `${f} present` : "Occupied" : "Clear", b = l.lights.filter((S) => !a.has(S));
  let g = 0;
  const w = [];
  for (const S of b)
    c[S]?.state === "on" && (g++, w.push(S));
  const A = g > 0 ? `${g} on` : "Off", M = l.windows.filter((S) => !a.has(S));
  let k = 0;
  const z = [];
  for (const S of M) {
    const _ = c[S];
    if (_) {
      const P = String(_.state).toLowerCase(), L = _.attributes?.current_position;
      (P === "on" || P === "open" || typeof L == "number" && L > 0) && (k++, z.push(S));
    }
  }
  const D = k > 0 ? `${k} open` : "Closed";
  let R = "";
  if (t.summary?.customText)
    R = t.summary.customText.replace(/\{temp\}/gi, d.formatted).replace(/\{humidity\}/gi, h.formatted).replace(/\{presence\}/gi, m).replace(/\{lights\}/gi, A).replace(/\{windows\}/gi, D).trim();
  else {
    const S = [...Xd], _ = i?.metrics ?? S, P = [];
    _.includes("temperature") && d.formatted && P.push(d.formatted), _.includes("humidity") && h.formatted && P.push(h.formatted), _.includes("presence") && p && P.push(f > 1 ? `👤 ${f}` : "👤"), _.includes("lights") && g > 0 && P.push(`💡 ${g}`), _.includes("windows") && k > 0 && P.push(`🪟 ${k}`), R = P.join(" · ");
  }
  const E = [t.name], C = [];
  d.formatted && C.push(`Average Temp ${d.formatted}`), h.formatted && C.push(`Humidity ${h.formatted}`), p && C.push(f > 1 ? `${f} present` : "Occupied"), g > 0 && C.push(`${g} ${g === 1 ? "light" : "lights"} on`), k > 0 && C.push(`${k} ${k === 1 ? "opening" : "openings"} open`);
  const I = C.length > 0 ? `${E[0]}: ${C.join(", ")}` : t.name;
  return {
    enabled: o,
    temperature: {
      value: d.value,
      formatted: d.formatted,
      unit: d.unit,
      count: d.count,
      entityIds: d.entityIds
    },
    humidity: {
      value: h.value,
      formatted: h.formatted,
      unit: h.unit,
      count: h.count,
      entityIds: h.entityIds
    },
    presence: {
      value: p,
      active: p,
      formatted: m,
      unit: "",
      count: f,
      entityIds: u
    },
    lights: {
      onCount: g,
      totalCount: b.length,
      formatted: A,
      entityIds: w
    },
    windows: {
      openCount: k,
      totalCount: M.length,
      formatted: D,
      entityIds: z
    },
    badgeText: R,
    tooltip: I
  };
}
class _s {
  constructor(e) {
    this._hass = e;
  }
  getEntityState(e) {
    return this._hass.states[e];
  }
}
class hh {
  constructor(e, i, n) {
    this._historyService = e, this._fallback = i, this._timestamp = n, this._historicalStates = this._historyService.getStateAt(this._timestamp);
  }
  getEntityState(e) {
    const i = this._historicalStates.get(e);
    if (i) return i;
    const n = this._fallback.getEntityState(e);
    return n ? { ...n, attributes: { ...n.attributes ?? {} } } : void 0;
  }
}
function ph(t, e, i, n) {
  return t ? i ? new hh(e, new _s(t), n) : new _s(t) : { getEntityState: () => {
  } };
}
function uh(t, e, i, n, o) {
  if (!t) return;
  const r = ph(t, i, n, o), s = {};
  for (const a of e)
    s[a] = r.getEntityState(a);
  return {
    states: s,
    formatEntityState: (a) => t.formatEntityState(a),
    formatEntityAttributeValue: t.formatEntityAttributeValue ? (a, l) => t.formatEntityAttributeValue(a, l) : void 0
  };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fh = {}, $s = Kn(class extends Xn {
  constructor() {
    super(...arguments), this.ot = fh;
  }
  render(t, e) {
    return e();
  }
  update(t, [e, i]) {
    if (Array.isArray(e)) {
      if (Array.isArray(this.ot) && this.ot.length === e.length && e.every((n, o) => n === this.ot[o])) return Qt;
    } else if (this.ot === e) return Qt;
    return this.ot = Array.isArray(e) ? Array.from(e) : e, this.render(e, i);
  }
}), mh = /* @__PURE__ */ new Set([
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
]), yh = /^[a-z0-9#%.,/_() +*-]+$/i, gh = /([a-z][a-z0-9-]*)\s*\(/gi;
function J(t) {
  if (typeof t != "string") return;
  const e = t.trim();
  if (!e || !yh.test(e) || e.includes("/*") || e.includes("*/") || !/^[a-z#]/i.test(e)) return;
  let i = 0;
  for (let o = 0; o < e.length; o++) {
    const r = e[o];
    if (r === "(") i++;
    else if (r === ")" && --i < 0) return;
  }
  if (i !== 0) return;
  const n = new RegExp(gh.source, "gi");
  for (let o; o = n.exec(e); )
    if (!mh.has(o[1].toLowerCase())) return;
  return e;
}
function ut(t, e) {
  return J(t) ?? e;
}
function W(t, e) {
  if (t == null || typeof t == "string" && t.trim() === "") return e;
  const i = typeof t == "number" ? t : Number(t);
  return Number.isFinite(i) ? i : e;
}
function wt(t) {
  if (typeof t != "string") return;
  const e = t.trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return e === "" ? void 0 : e;
}
const bh = {
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
function vh(t) {
  const e = t.trim().toLowerCase(), i = bh[e];
  if (i) return i;
  const n = /^#([0-9a-f]{3,8})$/i.exec(e);
  if (n) {
    const r = n[1];
    return r.length === 3 || r.length === 4 ? [0, 1, 2].map((s) => parseInt(r[s] + r[s], 16)) : r.length === 6 || r.length === 8 ? [0, 2, 4].map((s) => parseInt(r.slice(s, s + 2), 16)) : void 0;
  }
  const o = /^rgba?\(([^)]*)\)$/.exec(e);
  if (o) {
    const r = o[1].split(/[\s,/]+/).filter((a) => a !== "");
    if (r.length < 3) return;
    const s = r.slice(0, 3).map((a) => {
      if (a.endsWith("%")) {
        const l = Number(a.slice(0, -1));
        return Number.isFinite(l) ? l / 100 * 255 : NaN;
      }
      return Number(a);
    });
    return s.some((a) => !Number.isFinite(a)) ? void 0 : s.map((a) => Math.max(0, Math.min(255, a)));
  }
}
function vr([t, e, i]) {
  const n = (o) => {
    const r = o / 255;
    return r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * n(t) + 0.7152 * n(e) + 0.0722 * n(i);
}
const xh = "#212121", wh = "#ffffff", _h = vr([33, 33, 33]), $h = vr([255, 255, 255]);
function ul(t) {
  if (typeof t != "string") return;
  const e = vh(t);
  if (!e) return;
  const i = vr(e), n = (o) => (Math.max(i, o) + 0.05) / (Math.min(i, o) + 0.05);
  return n(_h) >= n($h) ? xh : wh;
}
const kh = /^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/i;
function xi(t) {
  if (typeof t != "string") return;
  const e = t.trim();
  return kh.test(e) ? e : void 0;
}
function me(t) {
  if (typeof t != "string") return;
  const e = t.trim().replace(/[^a-zA-Z0-9_.-]/g, "");
  return e === "" ? void 0 : e;
}
const eo = "default", Ti = 10, Tn = [
  {
    id: eo,
    label: "Default",
    description: "Follows your Home Assistant theme",
    vars: {}
  },
  {
    id: "odnetnin",
    label: "Odnetnin",
    description: "Playful and chunky — thick outlines on warm paper",
    scheme: "light",
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
    scheme: "light",
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
    scheme: "dark",
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
], Ni = "var(--fp-skin-bg, var(--card-background-color, #fff))", xr = "var(--fp-skin-wall, var(--primary-text-color))", fl = "var(--fp-skin-text, var(--primary-text-color))", pt = "var(--fp-skin-accent, var(--primary-color, #03a9f4))", xo = "var(--fp-skin-active, var(--state-light-active-color, var(--state-active-color, #fdd835)))", we = "var(--fp-skin-badge-bg, var(--card-background-color, #fff))";
function io(t) {
  if (typeof t == "string")
    return Tn.find((e) => e.id === t);
}
function Sh(t) {
  const e = io(t);
  return e ? Object.entries(e.vars).map(([i, n]) => `${i}:${n};`).join("") : "";
}
function Mh(t) {
  const e = io(t);
  return e && e.id !== eo ? e.id : void 0;
}
const Eh = _n(
  Tn.filter((t) => t.id !== eo).map(
    (t) => `:host([data-skin="${t.id}"]){` + Object.entries(t.vars).map(([e, i]) => `${e}:${i};`).join("") + "}"
  ).join(`
`)
), ml = re`
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
`, Ah = 6e4, Th = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function yl(t) {
  return Th.has(t);
}
function wr(t) {
  if (t === "") return;
  const e = Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function gl(t) {
  let e = 0;
  for (const i of t)
    if (!yl(i.newState)) {
      if (wr(i.newState) === void 0) return !1;
      e++;
    }
  return e > 0;
}
function Ch(t, e, i) {
  const n = t.map((c) => wr(c.newState)), o = n.filter((c) => c !== void 0);
  if (!o.length) return t;
  const r = (Math.max(...o) - Math.min(...o)) / e;
  if (!(r > 0) && !t.some((c) => yl(c.newState)))
    return t.length ? [t[0], t[t.length - 1]] : [];
  const s = [t[0]];
  let a = n[0], l = t[0].timestamp;
  for (let c = 1; c < t.length - 1; c++) {
    const d = n[c];
    if (d === void 0) {
      s.push(t[c]), a = void 0, l = t[c].timestamp;
      continue;
    }
    if (a === void 0) {
      s.push(t[c]), a = d, l = t[c].timestamp;
      continue;
    }
    const h = n[c - 1], p = n[c + 1], f = h !== void 0 && p !== void 0 && (d > h && d >= p || d < h && d <= p);
    (Math.abs(d - a) >= r || f && Math.abs(d - a) >= r / 2 || t[c].timestamp - l >= i) && (s.push(t[c]), a = d, l = t[c].timestamp);
  }
  return t.length > 1 && s.push(t[t.length - 1]), s;
}
function Ih(t, e = {}) {
  const i = e.numericSteps ?? 0;
  return !(i > 0) || t.length < 3 || !gl(t) ? t : Ch(t, i, e.maxGapMs ?? Ah);
}
function zh(t, e = {}) {
  if (!(e.numericSteps ?? 0) || t.length === 0) return t;
  const i = /* @__PURE__ */ new Map();
  for (const o of t) {
    const r = i.get(o.entityId);
    r ? r.push(o) : i.set(o.entityId, [o]);
  }
  const n = /* @__PURE__ */ new Set();
  for (const o of i.values())
    for (const r of Ih(o, e)) n.add(r);
  return t.filter((o) => n.has(o));
}
function Ph(t, e) {
  if (!(e > 2) || t.length <= e || !gl(t)) return t;
  const i = t.map((s) => wr(s.newState)), n = /* @__PURE__ */ new Set([0, t.length - 1]);
  for (let s = 0; s < t.length; s++)
    i[s] === void 0 && n.add(s);
  const o = [];
  let r;
  for (let s = 0; s < t.length; s++) {
    const a = i[s];
    if (a === void 0) {
      r = void 0;
      continue;
    }
    s > 0 && s < t.length - 1 && r !== void 0 && o.push({ i: s, delta: Math.abs(a - r) }), r = a;
  }
  o.sort((s, a) => a.delta - s.delta);
  for (const { i: s } of o) {
    if (n.size >= e) break;
    n.add(s);
  }
  return t.filter((s, a) => n.has(a));
}
function Ci(t) {
  const e = typeof t.color == "string" ? J(t.color) : void 0;
  if (e) return e;
  const i = t.attributes?.color, n = typeof i == "string" ? J(i) : void 0;
  if (n) return n;
  const o = String(t.newState ?? "").trim().toLowerCase();
  return t.entityId.startsWith("light.") ? o === "off" ? we : xo : t.entityId.startsWith("cover.") ? o === "closed" ? we : pt : t.entityId.startsWith("sensor.") || t.entityId.startsWith("binary_sensor.") ? o === "off" ? we : pt : t.entityId.startsWith("fan.") ? o === "off" ? we : xo : t.entityId.startsWith("media_player.") ? o === "idle" ? we : xo : o === "on" || o === "open" || o === "playing" || o === "home" || o === "locked" || o === "unlocked" ? pt : we;
}
class Oh {
  constructor(e = {}) {
    this._cache = /* @__PURE__ */ new Map(), this._events = [], this._eventsByEntity = /* @__PURE__ */ new Map(), this._maxCacheEntries = 8, this._loadCommitId = 0, this._loader = e.loader ?? (async () => []);
  }
  configure(e = {}) {
    this._context = e;
  }
  async loadHistory(e, i, n = {}) {
    const o = ++this._loadCommitId, r = n.scopeKey ?? "all", s = `${e}:${i}:${r}:${n.numericSteps ?? 0}`;
    if (this._cache.has(s)) {
      if (o === this._loadCommitId) {
        const p = this._cache.get(s);
        this._events = p, this._eventsByEntity = this._groupEventsByEntity(p);
      }
      return;
    }
    const a = n.hass ?? this._context?.hass, l = n.watched ?? this._context?.watched, d = (a && Array.isArray(l) ? await this._loadFromHass(a, e, i, l) : await this._loader(e, i, { ...this._context, ...n, hass: a, watched: l })).slice().sort((p, f) => p.timestamp - f.timestamp).map((p) => ({
      ...p,
      attributes: p.attributes ?? {}
    })), h = zh(d, { numericSteps: n.numericSteps });
    if (o === this._loadCommitId) {
      if (this._cache.set(s, h), this._cache.size > this._maxCacheEntries) {
        const p = this._cache.keys().next().value;
        p && this._cache.delete(p);
      }
      this._events = h, this._eventsByEntity = this._groupEventsByEntity(h);
    }
  }
  async loadFromHass(e, i, n, o) {
    return this._loadFromHass(e, i, n, o);
  }
  async _loadFromHass(e, i, n, o) {
    if (!o.length) return [];
    const r = e.callWS, s = e.callApi, a = new Date(i * 1e3).toISOString(), l = new Date(n * 1e3).toISOString(), c = new Set(o), d = {
      type: "history/history_during_period",
      start_time: a,
      end_time: l,
      minimal_response: !1,
      no_attributes: !1,
      significant_changes_only: !1,
      entity_ids: o
    };
    let h;
    if (typeof r == "function")
      try {
        h = await r(d);
      } catch (p) {
        console.warn("[easy-floorplan] Replay WS history query failed", { startTime: a, endTime: l, watchedCount: o.length, error: p });
      }
    if (!h && typeof s == "function")
      try {
        h = await s("GET", `history/period/${encodeURIComponent(a)}`, {
          end_time: l,
          filter_entity_id: o.join(","),
          minimal_response: !1,
          no_attributes: !1,
          significant_changes_only: !1
        });
      } catch (p) {
        console.warn("[easy-floorplan] Replay REST history query failed", { startTime: a, endTime: l, watchedCount: o.length, error: p });
      }
    if (!h)
      throw new Error(`Unable to load history via websocket or REST API (ws:${typeof r == "function" ? "yes" : "no"}, api:${typeof s == "function" ? "yes" : "no"}).`);
    return this._normalizeHistoryPayload(h, i, n, c);
  }
  _normalizeHistoryPayload(e, i, n, o) {
    const r = /* @__PURE__ */ new Map(), s = (p, f) => {
      if (typeof p == "number")
        return Number.isFinite(p) ? p > 1e12 ? p / 1e3 : p : Number.NaN;
      if (typeof p == "string") {
        const u = Number(p);
        if (Number.isFinite(u)) return u > 1e12 ? u / 1e3 : u;
        const m = Date.parse(p) / 1e3;
        return Number.isFinite(m) ? m : Number.NaN;
      }
      return Date.parse(f) / 1e3;
    }, a = (p, f) => {
      for (const u of f) {
        const m = p[u];
        if (m !== void 0) return m;
      }
    }, l = (p, f) => {
      const u = f.filter((m) => !!m && typeof m == "object");
      u.length && r.set(p, u.map((m) => {
        const b = a(m, ["state", "s"]), g = a(m, ["attributes", "a"]), w = a(m, ["last_updated", "lu"]), A = a(m, ["last_changed", "lc"]);
        return {
          state: typeof b == "string" || typeof b == "number" || typeof b == "boolean" ? String(b) : void 0,
          attributes: g && typeof g == "object" ? g : void 0,
          last_updated: typeof w == "string" || typeof w == "number" ? w : void 0,
          last_changed: typeof A == "string" || typeof A == "number" ? A : void 0
        };
      }));
    };
    if (Array.isArray(e))
      for (const p of e) {
        if (!p || typeof p != "object") continue;
        const f = p, u = typeof f.entity_id == "string" ? f.entity_id : void 0, m = Array.isArray(f.states) ? f.states : Array.isArray(f.history) ? f.history : [];
        u && m.length && l(u, m);
      }
    else if (e && typeof e == "object")
      for (const [p, f] of Object.entries(e)) {
        if (Array.isArray(f) && f.length) {
          l(p, f);
          continue;
        }
        if (f && typeof f == "object") {
          const u = f;
          Array.isArray(u.states) && u.states.length && l(p, u.states);
        }
      }
    if (!r.size)
      throw new Error("History payload contained no parseable state rows.");
    const c = [], d = new Date(n * 1e3).toISOString();
    for (const [p, f] of r.entries())
      if (f.length && o.has(p)) {
        if (f.length === 1) {
          const u = f[0], m = s(u.last_updated ?? u.last_changed, d);
          if (!Number.isFinite(m) || m < i || m > n)
            continue;
          c.push({
            timestamp: m,
            entityId: p,
            oldState: u.state ?? "unknown",
            newState: u.state ?? "unknown",
            attributes: u.attributes ?? {}
          });
          continue;
        }
        for (let u = 1; u < f.length; u += 1) {
          const m = f[u - 1], b = f[u], g = s(m.last_updated ?? m.last_changed, d), w = s(b.last_updated ?? b.last_changed, d);
          if (!Number.isFinite(g) || !Number.isFinite(w) || w < i || g > n)
            continue;
          const A = m.state !== b.state, M = !this._attributesEqual(m.attributes ?? {}, b.attributes ?? {});
          !A && !M || c.push({
            timestamp: w,
            entityId: p,
            oldState: m.state ?? "unknown",
            newState: b.state ?? "unknown",
            attributes: {
              ...m.attributes ?? {},
              ...b.attributes ?? {}
            }
          });
        }
      }
    return c.sort((p, f) => p.timestamp - f.timestamp);
  }
  _attributesEqual(e, i) {
    if (e === i) return !0;
    if (!e || !i) return !e && !i;
    if (typeof e != typeof i) return !1;
    if (Array.isArray(e) || Array.isArray(i)) {
      if (!Array.isArray(e) || !Array.isArray(i) || e.length !== i.length) return !1;
      for (let a = 0; a < e.length; a += 1)
        if (!this._attributesEqual(e[a], i[a])) return !1;
      return !0;
    }
    if (typeof e != "object") return !1;
    const n = e, o = i, r = Object.keys(n), s = Object.keys(o);
    if (r.length !== s.length) return !1;
    for (const a of r)
      if (!(a in o) || !this._attributesEqual(n[a], o[a])) return !1;
    return !0;
  }
  clearCache() {
    this._loadCommitId += 1, this._cache.clear(), this._events = [], this._eventsByEntity.clear();
  }
  getStateAt(e) {
    const i = /* @__PURE__ */ new Map();
    for (const [n, o] of this._eventsByEntity.entries()) {
      const r = this._findLastEventAtOrBefore(o, e);
      if (r) {
        i.set(n, this._toHassEntity(n, r.newState, r.attributes, r.timestamp));
        continue;
      }
      const s = o[0];
      s && i.set(n, this._toHassEntity(n, s.oldState, s.attributes, 0));
    }
    return i;
  }
  _groupEventsByEntity(e) {
    const i = /* @__PURE__ */ new Map();
    for (const n of e) {
      const o = i.get(n.entityId) ?? [];
      o.push(n), i.set(n.entityId, o);
    }
    for (const n of i.values())
      n.sort((o, r) => o.timestamp - r.timestamp);
    return i;
  }
  _findLastEventAtOrBefore(e, i) {
    let n = 0, o = e.length - 1, r;
    for (; n <= o; ) {
      const s = n + o >> 1, a = e[s];
      a.timestamp <= i ? (r = a, n = s + 1) : o = s - 1;
    }
    return r;
  }
  _toHassEntity(e, i, n, o) {
    const r = Number.isFinite(o) ? o : Date.now() / 1e3;
    return {
      entity_id: e,
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
  getEventBefore(e) {
    if (!this._events.length) return;
    let i = 0, n = this._events.length - 1, o = -1;
    for (; i <= n; ) {
      const r = i + n >> 1;
      this._events[r].timestamp <= e ? (o = r, i = r + 1) : n = r - 1;
    }
    return o >= 0 ? this._events[o] : void 0;
  }
  getEventAfter(e) {
    if (!this._events.length) return;
    let i = 0, n = this._events.length - 1, o = this._events.length;
    for (; i <= n; ) {
      const r = i + n >> 1;
      this._events[r].timestamp >= e ? (o = r, n = r - 1) : i = r + 1;
    }
    return o < this._events.length ? this._events[o] : void 0;
  }
}
var Lh = Object.defineProperty, Fh = Object.getOwnPropertyDescriptor, Ie = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Fh(e, i) : e, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (o = (n ? s(e, i, o) : s(o)) || o);
  return n && o && Lh(e, i, o), o;
};
let Vt = class extends fe {
  constructor() {
    super(...arguments), this.events = [], this.startTime = 0, this.endTime = 0, this.currentTime = 0, this.expanded = !1, this._dragging = !1, this._hidden = /* @__PURE__ */ new Set();
  }
  _toggleLane(t) {
    const e = new Set(this._hidden);
    e.delete(t) || e.add(t), this._hidden = e;
  }
  _showAllLanes() {
    this._hidden = /* @__PURE__ */ new Set();
  }
  _seek(t) {
    this.dispatchEvent(new CustomEvent("seek", { detail: { timestamp: t }, bubbles: !0, composed: !0 }));
  }
  _formatTimestamp(t) {
    return Number.isFinite(t) ? new Intl.DateTimeFormat(void 0, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(t * 1e3)) : "—";
  }
  _getMarkerLeft(t) {
    return `${(t - this.startTime) / Math.max(1, this.endTime - this.startTime) * 100}%`;
  }
  /**
   * Keep markers visually centered while preventing edge overflow that can
   * trigger horizontal scrollbars in tight containers.
   */
  _getMarkerLeftClamped(t, e) {
    const i = this._getMarkerLeft(t);
    return `clamp(${e}px, ${i}, calc(100% - ${e}px))`;
  }
  /** This timestamp as a 0-100 position in the window, unitless for calc(). */
  _pct(t) {
    return (t - this.startTime) / Math.max(1, this.endTime - this.startTime) * 100;
  }
  _markerStyle(t, e = "0px") {
    const i = Ci(t), n = `left:${this._getMarkerLeftClamped(t.timestamp, 7)};--stack-offset:${e};--marker-pct:${this._pct(t.timestamp)};`;
    return i ? `${n}background:${i};box-shadow:0 0 0 2px ${i}22;` : n;
  }
  _formatEventTitle(t) {
    return `${this._formatTimestamp(t.timestamp)} · ${t.entityId}: ${t.oldState} → ${t.newState}`;
  }
  _formatClusterTitle(t) {
    return t.map((e) => this._formatEventTitle(e)).join(`
`);
  }
  _visibleEvents() {
    if (!this.events.length) return [];
    const t = this.startTime, e = this.endTime;
    return this.events.filter((i) => i.timestamp >= t && i.timestamp <= e);
  }
  /**
   * The events this timeline draws — every discrete state change, and the
   * largest moves of each numeric sensor up to what a lane can show. Replay
   * itself still reads the full series; this only decides what gets a marker.
   */
  /** Each entity's lane, display-thinned. Hidden lanes are still in here, so
   *  the expanded view can keep their label on screen to switch back on. */
  _laneSeries() {
    const t = /* @__PURE__ */ new Map();
    for (const e of this._visibleEvents()) {
      const i = t.get(e.entityId);
      i ? i.push(e) : t.set(e.entityId, [e]);
    }
    for (const [e, i] of t)
      t.set(e, Ph(i, Vt.MAX_MARKERS_PER_LANE));
    return t;
  }
  /**
   * What the summary bar draws: every lane that is switched on. Hiding a lane
   * takes its events out of here too, which is the point — a summary that
   * still counted a lane you had switched off would not be a summary of what
   * you are looking at.
   */
  _drawnEvents() {
    const t = [];
    for (const [e, i] of this._laneSeries())
      this._hidden.has(e) || t.push(...i);
    return t.sort((e, i) => e.timestamp - i.timestamp);
  }
  _groupEventsByTimestamp() {
    const t = this._drawnEvents(), e = /* @__PURE__ */ new Map();
    for (const i of t) {
      const n = e.get(i.timestamp);
      n ? n.push(i) : e.set(i.timestamp, [i]);
    }
    return Array.from(e.entries()).map(([i, n]) => ({
      timestamp: i,
      events: n,
      left: this._getMarkerLeft(i)
    }));
  }
  _getEntityLabel(t) {
    const e = t.attributes ?? {};
    return ((typeof e.friendly_name == "string" ? e.friendly_name : void 0)?.trim() || t.entityId).replace(/^./, (o) => o.toUpperCase());
  }
  _seekFromClientX(t) {
    const e = this.expanded ? ".timeline-track-overlay" : ".timeline", i = this.shadowRoot?.querySelector(e)?.getBoundingClientRect();
    if (!i) return;
    const n = Math.max(1, this.endTime - this.startTime), o = Math.min(1, Math.max(0, (t - i.left) / i.width)), r = Math.round(this.startTime + o * n);
    this._seek(r);
  }
  _handleTimelineClick(t) {
    this._seekFromClientX(t.clientX);
  }
  _handleKeyDown(t) {
    const e = Math.max(1, this.endTime - this.startTime), i = Math.max(1, Math.round(e / 100));
    switch (t.key) {
      case "ArrowLeft":
      case "ArrowDown":
        this._seek(Math.max(this.startTime, this.currentTime - i)), t.preventDefault();
        break;
      case "ArrowRight":
      case "ArrowUp":
        this._seek(Math.min(this.endTime, this.currentTime + i)), t.preventDefault();
        break;
      case "Home":
        this._seek(this.startTime), t.preventDefault();
        break;
      case "End":
        this._seek(this.endTime), t.preventDefault();
        break;
    }
  }
  /**
   * The way back. Switching a lane off in the expanded view and then
   * collapsing would otherwise strand it: the summary bar has no labels to
   * click, so nothing on screen would say anything was missing.
   */
  _renderHiddenNotice() {
    if (!this._hidden.size) return y;
    const t = this._hidden.size;
    return v`
      <div class="lanes-hidden">
        <span>${t} lane${t === 1 ? "" : "s"} hidden</span>
        <button class="lanes-hidden-show" @click=${() => this._showAllLanes()}>Show all</button>
      </div>
    `;
  }
  _renderExpandedTimeline(t) {
    const e = this._laneSeries(), i = Array.from(e.keys()), n = (this.currentTime - this.startTime) / t * 100;
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
        ${$s([this.events, this.startTime, this.endTime, this._hidden], () => i.map((o, r) => {
      const s = e.get(o) ?? [], a = r + 1, l = this._getEntityLabel(s[0]), c = this._hidden.has(o);
      return v`
            <button
              class="lane-label ${c ? "lane-off" : ""}"
              style="grid-row:${a};"
              aria-pressed=${c ? "false" : "true"}
              title=${c ? `Show ${l} on the timeline` : `Hide ${l} from the timeline`}
              @click=${(d) => {
        d.stopPropagation(), this._toggleLane(o);
      }}
            ><span class="lane-dot" aria-hidden="true"></span><span class="lane-name">${l}</span></button>
            <div class="lane lane-track ${c ? "lane-off" : ""}" style="grid-row:${a};">
              ${(c ? [] : s).map((d) => {
        const h = Ci(d), p = this._getMarkerLeftClamped(d.timestamp, 4);
        return v`
                  <button
                    class="marker"
                    style=${`left:${p};--marker-pct:${this._pct(d.timestamp)};${h ? `background:${h};box-shadow:0 0 0 2px ${h}22;` : ""}`}
                    title=${this._formatEventTitle(d)}
                    @click=${(f) => {
          f.stopPropagation(), this._seek(d.timestamp);
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
  _handlePointerDown(t) {
    this._dragging = !0, this._updateFromPointer(t);
  }
  _handlePointerMove(t) {
    this._dragging && this._updateFromPointer(t);
  }
  _handlePointerUp(t) {
    this._dragging && (this._dragging = !1, this._updateFromPointer(t));
  }
  _updateFromPointer(t) {
    this._seekFromClientX(t.clientX);
  }
  render() {
    if (!this.events.length)
      return v`<div class="timeline-empty">No history available.</div>`;
    const t = Math.max(1, this.endTime - this.startTime);
    return this.expanded ? v`${this._renderHiddenNotice()}${this._renderExpandedTimeline(t)}` : v`
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
        @click=${(e) => this._handleTimelineClick(e)}
        @pointerdown=${(e) => this._handlePointerDown(e)}
        @pointermove=${(e) => this._handlePointerMove(e)}
        @pointerup=${(e) => this._handlePointerUp(e)}
        @pointerleave=${(e) => this._handlePointerUp(e)}
        @keydown=${this._handleKeyDown}
      >
        <div class="track"></div>
        <div class="playhead" style="left:${this._pct(this.currentTime)}%">
          <span class="playhead-time">${this._formatTimestamp(this.currentTime)}</span>
        </div>
        ${$s([this.events, this.startTime, this.endTime], () => this._groupEventsByTimestamp().map((e) => v`
          <div
            class="marker-cluster"
            style="left:${this._getMarkerLeftClamped(e.timestamp, 7)};--marker-pct:${this._pct(e.timestamp)};"
            title=${this._formatClusterTitle(e.events)}
            @click=${(i) => {
      i.stopPropagation(), this._seek(e.timestamp);
    }}
          >
            ${e.events.map((i, n) => {
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
Vt.MAX_MARKERS_PER_LANE = 150;
Vt.styles = re`
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
    .playhead { position: absolute; top: -2px; width: 2px; height: calc(100% + 4px); background: ${_n(pt)}; }
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
      background: ${_n(pt)};
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
Ie([
  at({ attribute: !1 })
], Vt.prototype, "events", 2);
Ie([
  at({ type: Number })
], Vt.prototype, "startTime", 2);
Ie([
  at({ type: Number })
], Vt.prototype, "endTime", 2);
Ie([
  at({ type: Number })
], Vt.prototype, "currentTime", 2);
Ie([
  at({ type: Boolean })
], Vt.prototype, "expanded", 2);
Ie([
  Y()
], Vt.prototype, "_hidden", 2);
Vt = Ie([
  Gn("easy-floorplan-history-timeline")
], Vt);
const bl = 500, ks = {
  now: () => performance.now(),
  request: (t) => requestAnimationFrame(t),
  cancel: (t) => cancelAnimationFrame(t)
};
function vl(t) {
  if (!(t > 0)) return 0;
  if (t >= 1) return 1;
  const e = 0.25, i = 0.1, n = 0.25, o = 1, r = (d, h, p) => ((1 - d) * (1 - d) * 3 * h + (1 - d) * d * 3 * p + d * d) * d, s = (d, h, p) => 3 * (1 - d) * (1 - d) * h + 6 * (1 - d) * d * (p - h) + 3 * d * d * (1 - p);
  let a = 0, l = 1, c = t;
  for (let d = 0; d < 8; d++) {
    const h = r(c, e, n) - t;
    if (Math.abs(h) < 1e-6) break;
    h > 0 ? l = c : a = c;
    const p = s(c, e, n), f = p > 1e-6 ? c - h / p : (a + l) / 2;
    c = f > a && f < l ? f : (a + l) / 2;
  }
  return r(c, i, o);
}
class Rh {
  constructor(e, i, n = bl) {
    this.frames = e, this.onFrame = i, this._travels = /* @__PURE__ */ new Map(), this._handle = null, this._duration = n;
  }
  /** Zero animates nothing, which is what prefers-reduced-motion asks for. */
  setDuration(e) {
    this._duration = Math.max(0, e);
  }
  /**
   * What to draw for `key` right now, easing toward `target` and asking for
   * another frame while it has not arrived.
   *
   * A key seen for the first time takes its target outright: a card that has
   * just loaded shows the house as it is, rather than playing every door open
   * at once.
   */
  value(e, i) {
    const n = this.frames.now(), o = this._travels.get(e);
    if (!o)
      return this._travels.set(e, { from: i, to: i, start: n }), i;
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
  _at(e, i) {
    if (this._duration <= 0) return e.to;
    const n = i - e.start;
    return n > 0 ? n >= this._duration ? e.to : e.from + (e.to - e.from) * vl(n / this._duration) : e.from;
  }
  _schedule() {
    this._handle === null && (this._handle = this.frames.request(() => {
      this._handle = null, this.onFrame();
    }));
  }
}
function no(t) {
  const e = (t % 360 + 360) % 360;
  switch (e) {
    case 0:
      return { cos: 1, sin: 0 };
    case 90:
      return { cos: 0, sin: 1 };
    case 180:
      return { cos: -1, sin: 0 };
    case 270:
      return { cos: 0, sin: -1 };
    default:
      return { cos: Math.cos(e * Math.PI / 180), sin: Math.sin(e * Math.PI / 180) };
  }
}
const Ss = 450, wo = (t) => (t % 360 + 360) % 360;
class Dh {
  constructor(e, i) {
    this.frames = e, this.changed = i, this._value = 0, this._from = 0, this._target = 0, this._start = 0, this._duration = Ss;
  }
  get value() {
    return this._value;
  }
  get target() {
    return wo(this._target);
  }
  get running() {
    return this._handle !== void 0;
  }
  turn(e, i) {
    const n = this.frames.now();
    this._sample(n);
    const o = this._target + e;
    if (!i) {
      this.jump(o);
      return;
    }
    if (this._from = this._value, this._target = o, this._start = n, this._duration = Ss * Math.min(2, Math.abs(o - this._from) / 90), this._duration === 0) {
      this.finish();
      return;
    }
    this._schedule(), this.changed();
  }
  /** Reset, reduced motion, a changed projection or teardown cancels the RAF. */
  jump(e) {
    this._handle !== void 0 && this.frames.cancel(this._handle), this._handle = void 0, this._value = this._from = this._target = wo(e), this.changed();
  }
  finish() {
    this.jump(this._target);
  }
  _sample(e) {
    if (!this.running) return;
    const i = Math.min(1, Math.max(0, (e - this._start) / this._duration));
    this._value = this._from + (this._target - this._from) * vl(i);
  }
  _schedule() {
    this._handle === void 0 && (this._handle = this.frames.request(() => {
      this._sample(this.frames.now()), this._handle = void 0, this.frames.now() - this._start >= this._duration ? this._value = this._from = this._target = wo(this._target) : this._schedule(), this.changed();
    }));
  }
}
const Nh = "airHandler", Hh = "air handler", jh = "utility", Wh = [
  "hvac",
  "ahu",
  "furnace",
  "ventilation"
], Bh = {
  w: 60,
  h: 56
}, Uh = [
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
], Vh = {
  id: Nh,
  name: Hh,
  category: jh,
  keywords: Wh,
  size: Bh,
  parts: Uh
}, qh = "awning", Yh = "awning", Gh = "other", Kh = [
  "sunscreen",
  "sunshade",
  "canopy",
  "patio cover",
  "cover"
], Xh = {
  w: 300,
  h: 200
}, Zh = {
  axis: "h",
  min: 0.06,
  open: "extended"
}, Qh = {
  from: 0.74,
  to: 0.78
}, Jh = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    role: "body",
    fillOpacity: 0.18
  },
  {
    repeat: 5,
    step: [
      20,
      0
    ],
    part: {
      rect: [
        0,
        0,
        10,
        100
      ],
      role: "solid",
      opacity: 0.18
    }
  },
  {
    rect: [
      0,
      0,
      100,
      6
    ],
    role: "solid",
    opacity: 0.55
  },
  {
    line: [
      0,
      94,
      100,
      94
    ],
    role: "thin"
  }
], tp = {
  id: qh,
  name: Yh,
  category: Gh,
  keywords: Kh,
  size: Xh,
  extend: Zh,
  elevation: Qh,
  parts: Jh
}, ep = "bathtub", ip = "bathtub", np = "bath", op = [
  "bath",
  "tub"
], rp = {
  w: 150,
  h: 76
}, sp = [
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
], ap = {
  id: ep,
  name: ip,
  category: np,
  keywords: op,
  size: rp,
  parts: sp
}, lp = "bed", cp = "bed", dp = "bedroom", hp = [
  "double",
  "mattress",
  "sleep"
], pp = {
  w: 150,
  h: 200
}, up = [
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
], fp = {
  id: lp,
  name: cp,
  category: dp,
  keywords: hp,
  size: pp,
  parts: up
}, mp = "bookcase", yp = "bookcase", gp = "living", bp = [
  "bookshelf",
  "books",
  "shelving",
  "shelves",
  "billy",
  "library",
  "reol",
  "bogreol"
], vp = {
  w: 80,
  h: 40
}, xp = [
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
], wp = {
  id: mp,
  name: yp,
  category: gp,
  keywords: bp,
  size: vp,
  parts: xp
}, _p = "bunkBed", $p = "bunk bed", kp = "bedroom", Sp = [
  "bunk",
  "bed",
  "double deck",
  "ladder",
  "children",
  "køjeseng",
  "koejeseng",
  "etageseng",
  "210x100"
], Mp = {
  w: 210,
  h: 100
}, Ep = [
  {
    rect: [
      2,
      0,
      3,
      100
    ],
    role: "body"
  },
  {
    rect: [
      95,
      0,
      3,
      100
    ],
    role: "body"
  },
  {
    rect: [
      5,
      14,
      90,
      7
    ],
    role: "body"
  },
  {
    rect: [
      5,
      21,
      90,
      3
    ],
    role: "thin"
  },
  {
    rect: [
      5,
      77,
      90,
      7
    ],
    role: "body"
  },
  {
    rect: [
      5,
      84,
      90,
      3
    ],
    role: "thin"
  },
  {
    rect: [
      5,
      3,
      74,
      3
    ],
    role: "thin"
  },
  {
    line: [
      5,
      10,
      79,
      10
    ],
    role: "thin"
  },
  {
    rect: [
      9,
      11,
      17,
      3
    ],
    role: "detail"
  },
  {
    rect: [
      9,
      74,
      17,
      3
    ],
    role: "detail"
  },
  {
    rect: [
      79,
      3,
      2,
      97
    ],
    role: "body"
  },
  {
    rect: [
      91,
      14,
      2,
      86
    ],
    role: "body"
  },
  {
    repeat: 6,
    step: [
      0,
      13
    ],
    part: {
      line: [
        81,
        25,
        91,
        25
      ],
      role: "thin"
    }
  }
], Ap = {
  id: _p,
  name: $p,
  category: kp,
  keywords: Sp,
  size: Mp,
  parts: Ep
}, Tp = "chair", Cp = "chair", Ip = "living", zp = [
  "seat"
], Pp = {
  w: 44,
  h: 44
}, Op = [
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
], Lp = {
  id: Tp,
  name: Cp,
  category: Ip,
  keywords: zp,
  size: Pp,
  parts: Op
}, Fp = "cornerShowerCurved", Rp = "curved corner shower", Dp = "bath", Np = [
  "shower",
  "corner",
  "cubicle",
  "stall",
  "dusche",
  "glass",
  "enclosure",
  "bruseafskærmning"
], Hp = {
  w: 100,
  h: 100
}, jp = [
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
], Wp = {
  id: Fp,
  name: Rp,
  category: Dp,
  keywords: Np,
  size: Hp,
  parts: jp
}, Bp = "curtain", Up = "curtain", Vp = "other", qp = [
  "drape",
  "blind",
  "sliding curtain",
  "cover"
], Yp = {
  w: 160,
  h: 12
}, Gp = {
  axis: "w",
  min: 0.14,
  open: "retracted"
}, Kp = {
  from: 0.04,
  to: 0.88
}, Xp = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    role: "body",
    fillOpacity: 0.1,
    opacity: 0.5
  },
  {
    path: [
      [
        "M",
        0,
        50
      ],
      [
        "Q",
        6.25,
        0,
        12.5,
        50
      ],
      [
        "Q",
        18.75,
        100,
        25,
        50
      ],
      [
        "Q",
        31.25,
        0,
        37.5,
        50
      ],
      [
        "Q",
        43.75,
        100,
        50,
        50
      ],
      [
        "Q",
        56.25,
        0,
        62.5,
        50
      ],
      [
        "Q",
        68.75,
        100,
        75,
        50
      ],
      [
        "Q",
        81.25,
        0,
        87.5,
        50
      ],
      [
        "Q",
        93.75,
        100,
        100,
        50
      ]
    ],
    role: "line"
  },
  {
    line: [
      0,
      0,
      0,
      100
    ],
    role: "line",
    width: 3
  }
], Zp = {
  id: Bp,
  name: Up,
  category: Vp,
  keywords: qp,
  size: Yp,
  extend: Gp,
  elevation: Kp,
  parts: Xp
}, Qp = "desk", Jp = "desk", tu = "living", eu = [
  "office",
  "workstation"
], iu = {
  w: 120,
  h: 60
}, nu = [
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
], ou = {
  id: Qp,
  name: Jp,
  category: tu,
  keywords: eu,
  size: iu,
  parts: nu
}, ru = "dishwasher", su = "dishwasher", au = "kitchen", lu = [
  "dishes"
], cu = {
  w: 60,
  h: 60
}, du = [
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
], hu = {
  id: ru,
  name: su,
  category: au,
  keywords: lu,
  size: cu,
  parts: du
}, pu = "dresser", uu = "dresser", fu = "bedroom", mu = [
  "IKEA MALM",
  "chest of drawers",
  "low wide low & wide",
  "double dresser",
  "kommode",
  "lav bred",
  "skuffer",
  "154x50"
], yu = {
  w: 154,
  h: 50
}, gu = [
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
], bu = {
  id: pu,
  name: uu,
  category: fu,
  keywords: mu,
  size: yu,
  parts: gu
}, vu = "dryer", xu = "dryer", wu = "utility", _u = [
  "tumble dryer",
  "laundry"
], $u = {
  w: 60,
  h: 62
}, ku = [
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
], Su = {
  id: vu,
  name: xu,
  category: wu,
  keywords: _u,
  size: $u,
  parts: ku
}, Mu = "fishTank", Eu = "fish tank", Au = "living", Tu = [
  "aquarium",
  "fish",
  "water"
], Cu = {
  w: 100,
  h: 40
}, Iu = [
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
], zu = {
  id: Mu,
  name: Eu,
  category: Au,
  keywords: Tu,
  size: Cu,
  parts: Iu
}, Pu = "fridge", Ou = "fridge", Lu = "kitchen", Fu = [
  "refrigerator",
  "freezer"
], Ru = {
  w: 60,
  h: 64
}, Du = [
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
], Nu = {
  id: Pu,
  name: Ou,
  category: Lu,
  keywords: Fu,
  size: Ru,
  parts: Du
}, Hu = "hotTub", ju = "hot tub", Wu = "bath", Bu = [
  "jacuzzi",
  "spa",
  "whirlpool"
], Uu = {
  w: 120,
  h: 120
}, Vu = [
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
], qu = {
  id: Hu,
  name: ju,
  category: Wu,
  keywords: Bu,
  size: Uu,
  parts: Vu
}, Yu = "indoorPalm", Gu = "indoor palm", Ku = "living", Xu = [
  "palm",
  "houseplant",
  "potted plant",
  "tree",
  "foliage",
  "stuepalme",
  "palme",
  "plante",
  "potte"
], Zu = {
  w: 40,
  h: 40
}, Qu = [
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
], Ju = {
  id: Yu,
  name: Gu,
  category: Ku,
  keywords: Xu,
  size: Zu,
  parts: Qu
}, tf = "ladderShelf", ef = "ladder shelf", nf = "living", of = [
  "shelving",
  "shelves",
  "rack",
  "open",
  "cross brace",
  "reol",
  "stigereol"
], rf = {
  w: 80,
  h: 40
}, sf = [
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
], af = {
  id: tf,
  name: ef,
  category: nf,
  keywords: of,
  size: rf,
  parts: sf
}, lf = "piano", cf = "piano", df = "living", hf = [
  "upright",
  "keyboard",
  "music"
], pf = {
  w: 140,
  h: 60
}, uf = [
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
], ff = {
  id: lf,
  name: cf,
  category: df,
  keywords: hf,
  size: pf,
  parts: uf
}, mf = "plant", yf = "plant", gf = "living", bf = [
  "pot",
  "tree",
  "greenery"
], vf = {
  w: 44,
  h: 44
}, xf = "ellipse", wf = [
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
], _f = {
  id: mf,
  name: yf,
  category: gf,
  keywords: bf,
  size: vf,
  footprint: xf,
  parts: wf
}, $f = "quarterTub", kf = "corner hot tub", Sf = "bath", Mf = [
  "hottub",
  "jacuzzi",
  "corner",
  "quarter",
  "spa",
  "whirlpool"
], Ef = {
  w: 140,
  h: 140
}, Af = [
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
], Tf = {
  id: $f,
  name: kf,
  category: Sf,
  keywords: Mf,
  size: Ef,
  parts: Af
}, Cf = "roundTable", If = "round table", zf = "living", Pf = [
  "dining",
  "circular"
], Of = {
  w: 100,
  h: 100
}, Lf = "ellipse", Ff = [
  {
    ellipse: [
      50,
      50,
      50,
      50
    ],
    role: "body"
  }
], Rf = {
  id: Cf,
  name: If,
  category: zf,
  keywords: Pf,
  size: Of,
  footprint: Lf,
  parts: Ff
}, Df = "rug", Nf = "rug", Hf = "living", jf = [
  "carpet",
  "mat"
], Wf = {
  w: 180,
  h: 120
}, Bf = [
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
], Uf = {
  id: Df,
  name: Nf,
  category: Hf,
  keywords: jf,
  size: Wf,
  parts: Bf
}, Vf = "sectional", qf = "sectional (L)", Yf = "living", Gf = [
  "couch",
  "sofa",
  "corner",
  "chaise"
], Kf = {
  w: 230,
  h: 180
}, Xf = [
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
], Zf = {
  id: Vf,
  name: qf,
  category: Yf,
  keywords: Gf,
  size: Kf,
  parts: Xf
}, Qf = "sink", Jf = "sink", tm = "kitchen", em = [
  "basin",
  "tap",
  "faucet"
], im = {
  w: 64,
  h: 48
}, nm = [
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
], om = {
  id: Qf,
  name: Jf,
  category: tm,
  keywords: em,
  size: im,
  parts: nm
}, rm = "sofa", sm = "sofa", am = "living", lm = [
  "couch",
  "settee",
  "seat"
], cm = {
  w: 170,
  h: 72
}, dm = [
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
], hm = {
  id: rm,
  name: sm,
  category: am,
  keywords: lm,
  size: cm,
  parts: dm
}, pm = "stairs", um = "stairs", fm = "utility", mm = [
  "steps",
  "staircase"
], ym = {
  w: 90,
  h: 170
}, gm = [
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
], bm = {
  id: pm,
  name: um,
  category: fm,
  keywords: mm,
  size: ym,
  parts: gm
}, vm = "stove", xm = "stove", wm = "kitchen", _m = [
  "cooker",
  "hob",
  "oven",
  "range"
], $m = {
  w: 64,
  h: 64
}, km = [
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
], Sm = {
  id: vm,
  name: xm,
  category: wm,
  keywords: _m,
  size: $m,
  parts: km
}, Mm = "table", Em = "table", Am = "living", Tm = [
  "dining"
], Cm = {
  w: 120,
  h: 80
}, Im = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 5
  }
], zm = {
  id: Mm,
  name: Em,
  category: Am,
  keywords: Tm,
  size: Cm,
  parts: Im
}, Pm = "tallDresser", Om = "tall dresser", Lm = "bedroom", Fm = [
  "IKEA MALM",
  "chest of drawers",
  "tall narrow tall & narrow",
  "tallboy",
  "kommode",
  "høj smal",
  "skuffer",
  "80x48"
], Rm = {
  w: 80,
  h: 48
}, Dm = [
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
], Nm = {
  id: Pm,
  name: Om,
  category: Lm,
  keywords: Fm,
  size: Rm,
  parts: Dm
}, Hm = "toilet", jm = "toilet", Wm = "bath", Bm = [
  "wc",
  "loo",
  "lavatory"
], Um = {
  w: 48,
  h: 68
}, Vm = [
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
], qm = {
  id: Hm,
  name: jm,
  category: Wm,
  keywords: Bm,
  size: Um,
  parts: Vm
}, Ym = "tv", Gm = "tv", Km = "living", Xm = [
  "television",
  "screen",
  "media"
], Zm = {
  w: 110,
  h: 18
}, Qm = [
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
], Jm = {
  id: Ym,
  name: Gm,
  category: Km,
  keywords: Xm,
  size: Zm,
  parts: Qm
}, ty = "vanity", ey = "vanity", iy = "bath", ny = [
  "washbasin",
  "sink",
  "bathroom"
], oy = {
  w: 110,
  h: 55
}, ry = [
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
], sy = {
  id: ty,
  name: ey,
  category: iy,
  keywords: ny,
  size: oy,
  parts: ry
}, ay = "wardrobe", ly = "wardrobe", cy = "bedroom", dy = [
  "closet",
  "armoire",
  "cupboard"
], hy = {
  w: 120,
  h: 55
}, py = [
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
], uy = {
  id: ay,
  name: ly,
  category: cy,
  keywords: dy,
  size: hy,
  parts: py
}, fy = "washer", my = "washer", yy = "utility", gy = [
  "washing machine",
  "laundry"
], by = {
  w: 60,
  h: 62
}, vy = [
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
], xy = {
  id: fy,
  name: my,
  category: yy,
  keywords: gy,
  size: by,
  parts: vy
}, wy = "waterHeater", _y = "water heater", $y = "utility", ky = [
  "boiler",
  "cylinder",
  "tank"
], Sy = {
  w: 52,
  h: 52
}, My = "ellipse", Ey = [
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
], Ay = {
  id: wy,
  name: _y,
  category: $y,
  keywords: ky,
  size: Sy,
  footprint: My,
  parts: Ey
}, Wo = [
  "living",
  "bedroom",
  "kitchen",
  "bath",
  "utility",
  "other"
], oo = (t) => Object.assign(/* @__PURE__ */ Object.create(null), t), _r = (t, e) => typeof e == "string" && Object.prototype.hasOwnProperty.call(t, e) ? t[e] : void 0, Ms = oo({
  body: { width: 2, opacity: 1, fillOpacity: 0.12 },
  line: { width: 2, opacity: 1, fillOpacity: 0 },
  thin: { width: 1.5, opacity: 1, fillOpacity: 0 },
  detail: { width: 1.5, opacity: 0.7, fillOpacity: 0 },
  hint: { width: 1, opacity: 0.6, fillOpacity: 0 },
  solid: { width: 0, opacity: 0.7, fillOpacity: 1 }
}), Ty = [0, 0, 100, 100], Cy = 64, xl = 256, Iy = 256, zy = 0.25, Es = 8, Ft = (t) => typeof t == "number" && Number.isFinite(t) ? t : null, Ne = (t, e, i) => Math.min(i, Math.max(e, t));
function pe(t, e) {
  if (!Array.isArray(t) || t.length !== e) return null;
  const i = [];
  for (const n of t) {
    const o = Ft(n);
    if (o === null) return null;
    i.push(o);
  }
  return i;
}
function Py(t) {
  if (!Array.isArray(t) || t.length < 2 || t.length > xl) return null;
  const e = [];
  for (const i of t) {
    const n = pe(i, 2);
    if (!n) return null;
    e.push([n[0], n[1]]);
  }
  return e;
}
const Oy = oo({ M: 2, L: 2, Q: 4, C: 6, Z: 0 });
function Ly(t) {
  if (!Array.isArray(t) || !t.length || t.length > Iy) return null;
  const e = [];
  for (const i of t) {
    if (!Array.isArray(i) || typeof i[0] != "string") return null;
    const n = i[0].toUpperCase(), o = _r(Oy, n);
    if (o === void 0) return null;
    const r = pe(i.slice(1), o);
    if (!r) return null;
    e.push([n, ...r]);
  }
  return e[0]?.[0] !== "M" ? null : e;
}
function Oe(t, e) {
  const i = _r(Ms, t.role) ? t.role : e, n = Ms[i], o = Ft(t.width), r = Ft(t.opacity), s = Ft(t.fillOpacity), a = Array.isArray(t.dash) ? t.dash.map(Ft) : null, l = a && a.length && a.length <= 8 && a.every((c) => c !== null) ? a.map((c) => Ne(c, 0, 100)) : void 0;
  return {
    role: i,
    width: o === null ? n.width : i === "solid" ? Ne(o, 0, Es) : Ne(o, zy, Es),
    opacity: r === null ? n.opacity : Ne(r, 0, 1),
    fillOpacity: s === null ? n.fillOpacity : Ne(s, 0, 1),
    dash: l
  };
}
function As(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return null;
  const e = t, i = e.space === "square" ? "square" : "box";
  if ("line" in e) {
    const n = pe(e.line, 4);
    return n ? { kind: "line", a: [n[0], n[1]], b: [n[2], n[3]], space: i, style: Oe(e, "line") } : null;
  }
  if ("rect" in e) {
    const n = pe(e.rect, 4);
    return !n || n[2] < 0 || n[3] < 0 ? null : {
      kind: "rect",
      x: n[0],
      y: n[1],
      w: n[2],
      h: n[3],
      rx: Math.max(0, Ft(e.rx) ?? 0),
      space: i,
      style: Oe(e, "body")
    };
  }
  if ("circle" in e) {
    const n = pe(e.circle, 3);
    return !n || n[2] < 0 ? null : { kind: "circle", cx: n[0], cy: n[1], r: n[2], space: i, style: Oe(e, "line") };
  }
  if ("ellipse" in e) {
    const n = pe(e.ellipse, 4);
    return !n || n[2] < 0 || n[3] < 0 ? null : {
      kind: "ellipse",
      cx: n[0],
      cy: n[1],
      rx: n[2],
      ry: n[3],
      space: i,
      style: Oe(e, "line")
    };
  }
  if ("polygon" in e || "polyline" in e) {
    const n = "polygon" in e, o = Py(n ? e.polygon : e.polyline);
    return o ? { kind: "poly", closed: n, pts: o, space: i, style: Oe(e, n ? "body" : "line") } : null;
  }
  if ("path" in e) {
    const n = Ly(e.path);
    return n ? { kind: "path", cmds: n, space: i, style: Oe(e, "line") } : null;
  }
  return null;
}
function Fy(t, e, i) {
  switch (t.kind) {
    case "line":
      return { ...t, a: [t.a[0] + e, t.a[1] + i], b: [t.b[0] + e, t.b[1] + i] };
    case "rect":
      return { ...t, x: t.x + e, y: t.y + i };
    case "circle":
      return { ...t, cx: t.cx + e, cy: t.cy + i };
    case "ellipse":
      return { ...t, cx: t.cx + e, cy: t.cy + i };
    case "poly":
      return { ...t, pts: t.pts.map(([n, o]) => [n + e, o + i]) };
    case "path":
      return {
        ...t,
        cmds: t.cmds.map((n) => {
          if (n[0] === "Z") return n;
          const o = n.slice(1).map((r, s) => r + (s % 2 === 0 ? e : i));
          return [n[0], ...o];
        })
      };
  }
}
function Ry(t) {
  if (t && typeof t == "object" && "repeat" in t) {
    const i = t, n = Ft(i.repeat), o = pe(i.step, 2), r = As(i.part);
    if (n === null || !o || !r) return [];
    const s = Ne(Math.round(n), 1, Cy);
    return Array.from({ length: s }, (a, l) => Fy(r, o[0] * l, o[1] * l));
  }
  const e = As(t);
  return e ? [e] : [];
}
function ro(t, e, i) {
  const n = (p) => (i?.push(p), null);
  if (!t || typeof t != "object" || Array.isArray(t))
    return n("A symbol has to be a JSON object.");
  const o = t, r = typeof o.id == "string" && o.id.trim() ? o.id.trim() : e, s = wt(r);
  if (!s || s !== r)
    return n('`id` is missing, or uses characters a CSS class cannot: letters, digits, "-" and "_" only.');
  if (!Array.isArray(o.parts)) return n("`parts` has to be an array of shapes.");
  const a = [];
  for (const p of o.parts)
    for (const f of Ry(p)) {
      if (a.length >= xl) break;
      a.push(f);
    }
  if (!a.length)
    return n(
      "No drawable parts. Each one needs a known shape (line, rect, circle, ellipse, polygon, polyline, path) with the right number of finite numbers."
    );
  const l = o.size && typeof o.size == "object" ? o.size : {}, c = Ft(l.w), d = Ft(l.h), h = pe(o.viewBox, 4);
  return {
    id: s,
    name: typeof o.name == "string" && o.name.trim() ? o.name.trim().slice(0, 60) : s,
    category: typeof o.category == "string" && Wo.includes(o.category) ? o.category : "other",
    keywords: Array.isArray(o.keywords) ? o.keywords.filter((p) => typeof p == "string").slice(0, 12) : [],
    size: { w: c && c > 0 ? c : 60, h: d && d > 0 ? d : 60 },
    viewBox: h && h[2] > 0 && h[3] > 0 ? h : Ty,
    footprint: o.footprint === "ellipse" ? "ellipse" : "rect",
    parts: a,
    ...Ts(o.extend) ? { extend: Ts(o.extend) } : {},
    ...Cs(o.elevation) ? { elevation: Cs(o.elevation) } : {}
  };
}
function Ts(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return;
  const e = t;
  if (e.axis !== "w" && e.axis !== "h") return;
  const i = Ft(e.min);
  return {
    axis: e.axis,
    min: i !== null && i >= 0 && i < 1 ? i : 0,
    open: e.open === "retracted" ? "retracted" : "extended"
  };
}
function Cs(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return;
  const e = t, i = Ft(e.from), n = Ft(e.to);
  if (!(i === null || n === null || i < 0 || n > 1 || n <= i))
    return { from: i, to: n };
}
const wl = ro({
  id: "unknown",
  name: "unknown",
  size: { w: 60, h: 60 },
  parts: [{ rect: [0, 0, 100, 100], rx: 6.666667 }]
}), It = (() => {
  const t = /* @__PURE__ */ Object.assign({ "../furniture/airHandler.json": Vh, "../furniture/awning.json": tp, "../furniture/bathtub.json": ap, "../furniture/bed.json": fp, "../furniture/bookcase.json": wp, "../furniture/bunkBed.json": Ap, "../furniture/chair.json": Lp, "../furniture/cornerShowerCurved.json": Wp, "../furniture/curtain.json": Zp, "../furniture/desk.json": ou, "../furniture/dishwasher.json": hu, "../furniture/dresser.json": bu, "../furniture/dryer.json": Su, "../furniture/fishTank.json": zu, "../furniture/fridge.json": Nu, "../furniture/hotTub.json": qu, "../furniture/indoorPalm.json": Ju, "../furniture/ladderShelf.json": af, "../furniture/piano.json": ff, "../furniture/plant.json": _f, "../furniture/quarterTub.json": Tf, "../furniture/roundTable.json": Rf, "../furniture/rug.json": Uf, "../furniture/sectional.json": Zf, "../furniture/sink.json": om, "../furniture/sofa.json": hm, "../furniture/stairs.json": bm, "../furniture/stove.json": Sm, "../furniture/table.json": zm, "../furniture/tallDresser.json": Nm, "../furniture/toilet.json": qm, "../furniture/tv.json": Jm, "../furniture/vanity.json": sy, "../furniture/wardrobe.json": uy, "../furniture/washer.json": xy, "../furniture/waterHeater.json": Ay }), e = oo({});
  for (const [i, n] of Object.entries(t)) {
    const o = ro(n, i.split("/").pop()?.replace(/\.json$/, ""));
    o && (e[o.id] = o);
  }
  return e;
})();
function Rt(t, e) {
  return _r(t, e);
}
let Is, zs = It;
function $e(t) {
  if (!t || typeof t != "object") return It;
  if (t === Is) return zs;
  const e = oo({});
  Object.assign(e, It);
  for (const [i, n] of Object.entries(t)) {
    const o = ro(n, i);
    o && (e[o.id] = o);
  }
  return Is = t, zs = e, e;
}
function Dy(t) {
  const e = (i) => {
    const n = Wo.indexOf(i);
    return n < 0 ? Wo.length : n;
  };
  return Object.values(t).sort(
    (i, n) => e(i.category) - e(n.category) || i.name.localeCompare(n.name)
  );
}
function Ny(t, e) {
  const i = e.trim().toLowerCase();
  return i ? t.id.toLowerCase().includes(i) || t.name.toLowerCase().includes(i) || t.category.includes(i) || t.keywords.some((n) => n.toLowerCase().includes(i)) : !0;
}
function Ps(t, e = It) {
  return Rt(e, t)?.size ?? { w: 60, h: 60 };
}
function Os(t, e, i, n) {
  const [o, r, s, a] = t.viewBox, l = n === "square" ? Math.min(e, i) : e, c = n === "square" ? Math.min(e, i) : i, d = l / s, h = c / a;
  return {
    x: (p) => (p - o) * d - l / 2,
    y: (p) => (p - r) * h - c / 2,
    len: (p) => p * Math.min(d, h),
    sx: (p) => p * d,
    sy: (p) => p * h
  };
}
const mt = (t) => Number.isFinite(t) ? t : 0;
function Hy(t, e) {
  const i = t.fillOpacity > 0 ? e : "none", n = t.role === "solid" ? "none" : e;
  return { fill: i, stroke: n, style: t };
}
function jy(t, e, i, n) {
  const { fill: o, stroke: r, style: s } = Hy(t.style, i), a = n ?? o, l = s.opacity < 1 ? s.opacity : y, c = s.dash?.length ? s.dash.join(" ") : y, d = s.fillOpacity > 0 && s.fillOpacity < 1 ? s.fillOpacity : y, h = s.role === "solid" ? y : s.width;
  switch (t.kind) {
    case "line":
      return $`<line x1=${mt(e.x(t.a[0]))} y1=${mt(e.y(t.a[1]))}
                       x2=${mt(e.x(t.b[0]))} y2=${mt(e.y(t.b[1]))}
                       fill="none" stroke=${r} stroke-width=${h}
                       stroke-dasharray=${c} opacity=${l} />`;
    case "rect":
      return $`<rect x=${mt(e.x(t.x))} y=${mt(e.y(t.y))}
                       width=${mt(e.sx(t.w))} height=${mt(e.sy(t.h))}
                       rx=${t.rx > 0 ? mt(e.len(t.rx)) : y}
                       fill=${a} fill-opacity=${d}
                       stroke=${r} stroke-width=${h}
                       stroke-dasharray=${c} opacity=${l} />`;
    case "circle":
      return $`<circle cx=${mt(e.x(t.cx))} cy=${mt(e.y(t.cy))} r=${mt(e.len(t.r))}
                         fill=${a} fill-opacity=${d}
                         stroke=${r} stroke-width=${h} opacity=${l} />`;
    case "ellipse":
      return $`<ellipse cx=${mt(e.x(t.cx))} cy=${mt(e.y(t.cy))}
                          rx=${mt(e.sx(t.rx))} ry=${mt(e.sy(t.ry))}
                          fill=${a} fill-opacity=${d}
                          stroke=${r} stroke-width=${h} opacity=${l} />`;
    case "poly": {
      const p = t.pts.map(([f, u]) => `${mt(e.x(f))},${mt(e.y(u))}`).join(" ");
      return t.closed ? $`<polygon points=${p}
                       fill=${a} fill-opacity=${d}
                       stroke=${r} stroke-width=${h}
                       stroke-linejoin="round" opacity=${l} />` : $`<polyline points=${p} fill="none"
                        stroke=${r} stroke-width=${h}
                        stroke-linejoin="round" opacity=${l} />`;
    }
    case "path": {
      const p = t.cmds.map(
        (f) => f[0] === "Z" ? "Z" : `${f[0]} ${f.slice(1).map((u, m) => m % 2 === 0 ? mt(e.x(u)) : mt(e.y(u))).join(" ")}`
      ).join(" ");
      return $`<path d=${p}
                       fill=${o} fill-opacity=${d}
                       stroke=${r} stroke-width=${h}
                       stroke-linejoin="round" opacity=${l} />`;
    }
  }
}
function _l(t, e, i, n, o) {
  const r = Os(t, e, i, "box"), s = Os(t, e, i, "square");
  return t.parts.map((a) => jy(a, a.space === "square" ? s : r, n, o));
}
const Wy = /* @__PURE__ */ new Set(["light", "switch", "fan", "input_boolean"]);
function rn(t) {
  const e = t?.split(".")[0] ?? "";
  return Wy.has(e) ? { action: "toggle" } : { action: "more-info" };
}
function Pt(t) {
  return t !== void 0 && t.action !== "none";
}
function $l(t, e) {
  return e === "tap" ? t.tap_action ?? rn(t.entity) : e === "hold" ? t.hold_action : t.double_tap_action;
}
function $r(t, e) {
  if (!e || e.action === "none") return !1;
  switch (e.action) {
    case "toggle":
      return !!t.entity;
    case "more-info":
      return !!(e.entity ?? t.entity);
    case "navigate":
      return !!e.navigation_path;
    case "url":
      return !!e.url_path;
    case "perform-action":
    case "call-service":
      return Sl(e) !== null;
    case "fire-dom-event":
      return !0;
    default:
      return !1;
  }
}
function kl(t, e) {
  if (!(!e || !$r(t, e)))
    switch (e.action) {
      case "toggle":
        return t.entity;
      case "more-info":
        return e.entity ?? t.entity;
      default:
        return;
    }
}
function By(t) {
  return ["tap", "hold", "double_tap"].some(
    (e) => $r(t, $l(t, e))
  );
}
function Sl(t) {
  const e = t.perform_action ?? t.service;
  if (!e || !e.includes(".")) return null;
  const [i, n] = e.split(".", 2);
  return { domain: i, service: n, data: t.data ?? t.service_data, target: t.target };
}
function Le(t, e, i, n) {
  if (!(!n || n.action === "none")) {
    if (n.confirmation) {
      const o = typeof n.confirmation == "object" && n.confirmation.text || `Are you sure you want to ${n.action}?`;
      if (!globalThis.confirm?.(o)) return;
    }
    switch (n.action) {
      case "toggle":
        i.entity && e.callService("homeassistant", "toggle", { entity_id: i.entity });
        break;
      case "more-info": {
        const o = n.entity ?? i.entity;
        o && t.dispatchEvent(
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
        const o = Sl(n);
        o && e.callService(o.domain, o.service, o.data, o.target);
        break;
      }
      case "fire-dom-event":
        t.dispatchEvent(new CustomEvent("ll-custom", { detail: n, bubbles: !0, composed: !0 }));
        break;
    }
  }
}
const Et = 0.75, zt = 8, Uy = 400;
function _o(t, e) {
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : e;
}
function Ve(t) {
  let e = 0;
  for (let i = 0, n = t.length - 1; i < t.length; n = i++)
    e += t[n].x * t[i].y - t[i].x * t[n].y;
  return e / 2;
}
function Vy(t, e, i, n) {
  const o = n.x - i.x, r = n.y - i.y, s = o * o + r * r;
  if (s === 0) return Math.hypot(t - i.x, e - i.y);
  let a = ((t - i.x) * o + (e - i.y) * r) / s;
  return a = Math.max(0, Math.min(1, a)), Math.hypot(t - (i.x + a * o), e - (i.y + a * r));
}
function kr(t, e) {
  const i = [];
  for (let n = 0; n < t.length; n++) {
    const o = t[n], r = o.b.x - o.a.x, s = o.b.y - o.a.y, a = Math.hypot(r, s);
    if (a <= e) continue;
    const l = [0, 1], c = e / a;
    for (let d = 0; d < t.length; d++) {
      if (d === n) continue;
      const h = t[d], p = h.b.x - h.a.x, f = h.b.y - h.a.y, u = r * f - s * p;
      if (Math.abs(u) > 1e-9) {
        const m = ((h.a.x - o.a.x) * f - (h.a.y - o.a.y) * p) / u, b = ((h.a.x - o.a.x) * s - (h.a.y - o.a.y) * r) / u, g = e / Math.max(Math.hypot(p, f), 1e-9);
        m > c && m < 1 - c && b >= -g && b <= 1 + g && l.push(m);
        continue;
      }
      for (const m of [h.a, h.b]) {
        const b = ((m.x - o.a.x) * r + (m.y - o.a.y) * s) / (a * a);
        if (b <= c || b >= 1 - c) continue;
        const g = o.a.x + b * r, w = o.a.y + b * s;
        Math.hypot(m.x - g, m.y - w) <= e && l.push(b);
      }
    }
    l.sort((d, h) => d - h);
    for (let d = 1; d < l.length; d++) {
      const h = l[d - 1], p = l[d];
      p - h <= c || i.push({
        a: { x: o.a.x + h * r, y: o.a.y + h * s },
        b: { x: o.a.x + p * r, y: o.a.y + p * s }
      });
    }
  }
  return i;
}
function qy(t, e) {
  const i = [], n = /* @__PURE__ */ new Map(), o = (c) => Math.floor(c / e), r = (c) => {
    const d = o(c.x), h = o(c.y);
    for (let m = -1; m <= 1; m++)
      for (let b = -1; b <= 1; b++)
        for (const g of n.get(`${d + m}:${h + b}`) ?? [])
          if (Math.hypot(i[g].x - c.x, i[g].y - c.y) <= e) return g;
    const p = i.push({ x: c.x, y: c.y }) - 1, f = `${d}:${h}`, u = n.get(f);
    return u ? u.push(p) : n.set(f, [p]), p;
  }, s = /* @__PURE__ */ new Map(), a = (c) => {
    let d = s.get(c);
    return d || s.set(c, d = /* @__PURE__ */ new Set()), d;
  };
  for (const c of t) {
    const d = r(c.a), h = r(c.b);
    d !== h && (a(d).add(h), a(h).add(d));
  }
  const l = i.map(
    (c, d) => [...s.get(d) ?? []].sort(
      (h, p) => Math.atan2(i[h].y - c.y, i[h].x - c.x) - Math.atan2(i[p].y - c.y, i[p].x - c.x)
    )
  );
  return { points: i, neighbors: l };
}
function Ml(t, e) {
  const { points: i, neighbors: n } = qy(t, e), o = /* @__PURE__ */ new Set(), r = [];
  for (let s = 0; s < i.length; s++)
    for (const a of n[s]) {
      if (o.has(`${s}>${a}`)) continue;
      const l = [];
      let c = s, d = a, h = !1;
      for (let p = 0; p <= i.length * i.length + 4; p++) {
        o.add(`${c}>${d}`), l.push(c);
        const f = n[d], u = f.indexOf(c), m = f[(u - 1 + f.length) % f.length];
        if (c = d, d = m, c === s && d === a) {
          h = !0;
          break;
        }
      }
      h && l.length >= 3 && r.push(l.map((p) => ({ x: i[p].x, y: i[p].y })));
    }
  return r;
}
function Yy(t, e, i) {
  for (let n = 0, o = t.length - 1; n < t.length; o = n++)
    for (const r of e)
      if (!gt(r) && Vy(r.x, r.y, t[o], t[n]) <= i)
        return !0;
  return !1;
}
function Gy(t, e, i = {}) {
  const n = _o(i.weldEps, Et), o = _o(i.openingEps, zt), r = _o(i.minArea, Uy);
  if (t.length < 3) return [];
  const s = kr(
    t.map((l) => ({ a: { x: l.x1, y: l.y1 }, b: { x: l.x2, y: l.y2 } })),
    n
  );
  return Ml(s, n).map((l) => ({ ring: l, area: Ve(l) })).filter((l) => l.area >= r && !Yy(l.ring, e, o)).sort((l, c) => c.area - l.area).map((l) => l.ring);
}
const Ls = /* @__PURE__ */ new WeakMap();
function sn(t, e) {
  const i = Ls.get(t);
  if (i && i.openings === e) return i.out;
  const n = Gy(t, e);
  return Ls.set(t, { openings: e, out: n }), n;
}
function Ky(t, e = () => !0) {
  const i = kr(t.map((a) => ({ a: { x: a.x1, y: a.y1 }, b: { x: a.x2, y: a.y2 } })), Et), n = [], o = (a) => {
    const l = n.find((d) => Math.hypot(a.x - d.p.x, a.y - d.p.y) <= Et);
    if (l) return l;
    const c = { p: a, rays: [] };
    return n.push(c), c;
  }, r = /* @__PURE__ */ new Set(), s = [];
  for (const a of i) {
    const l = t.find((b) => {
      const g = b.x2 - b.x1, w = b.y2 - b.y1, A = Math.hypot(g, w);
      return A ? [a.a, a.b].every((M) => {
        const k = ((M.x - b.x1) * g + (M.y - b.y1) * w) / A;
        return k >= -Et && k <= A + Et && Math.abs((M.x - b.x1) * w - (M.y - b.y1) * g) / A <= Et;
      }) : !1;
    });
    if (!l) continue;
    const c = o(a.a), d = o(a.b);
    if (c === d) continue;
    const h = [n.indexOf(c), n.indexOf(d)].sort((b, g) => b - g).join(":");
    if (r.has(h)) continue;
    r.add(h);
    const p = { ...l, x1: c.p.x, y1: c.p.y, x2: d.p.x, y2: d.p.y }, f = Math.hypot(p.x2 - p.x1, p.y2 - p.y1), u = (p.x2 - p.x1) / f, m = (p.y2 - p.y1) / f;
    c.rays.push({ wall: p, start: !0, dx: u, dy: m, half: p.thickness / 2 }), d.rays.push({ wall: p, start: !1, dx: -u, dy: -m, half: p.thickness / 2 }), s.push(p);
  }
  for (const { p: a, rays: l } of n) for (const c of new Set(l.map((d) => d.wall.kind ?? "wall"))) {
    const d = l.filter((u) => (u.wall.kind ?? "wall") === c && e(u.wall, u.start));
    if (d.length < 2) continue;
    d.sort((u, m) => Math.atan2(u.dy, u.dx) - Math.atan2(m.dy, m.dx));
    const h = (u, m) => {
      const b = { x: a.x - u.dy * u.half, y: a.y + u.dx * u.half }, g = { x: a.x + m.dy * m.half, y: a.y - m.dx * m.half }, w = u.dx * m.dy - u.dy * m.dx;
      if (Math.abs(w) > 1e-6) {
        const A = ((g.x - b.x) * m.dy - (g.y - b.y) * m.dx) / w, M = { x: b.x + u.dx * A, y: b.y + u.dy * A };
        if (Math.hypot(M.x - a.x, M.y - a.y) <= 4 * Math.max(u.half, m.half)) return M;
      }
      return { x: (b.x + g.x) / 2, y: (b.y + g.y) / 2 };
    }, p = d.map((u, m) => h(u, d[(m + 1) % d.length])), f = p.reduce((u, m) => ({ x: u.x + m.x / p.length, y: u.y + m.y / p.length }), { x: 0, y: 0 });
    d.forEach((u, m) => {
      const b = p[m], g = p[(m + d.length - 1) % d.length], w = d.length > 2 ? [f] : [];
      u.start ? u.wall.start = [b, ...w, g] : u.wall.end = [g, ...w, b];
    });
  }
  return s;
}
function Xy(t) {
  if (t.sortDepth !== void 0) return t.sortDepth;
  if (t.vertices && t.vertices.length > 0) {
    const i = t.vertices.length;
    return t.vertices.reduce((n, o) => n + o.x + o.y + o.z, 0) / i;
  }
  const e = t.base.reduce((i, n) => i + n.x + n.y, 0) / (t.base.length || 1);
  return t.kind === "roof" ? e + (t.z0 + t.z1) / 2 : e;
}
const rt = 1e-7, El = (t, e) => t.x * e.x + t.y * e.y + t.z * e.z;
function Zy(t) {
  return t.vertices ?? t.base.flatMap((e) => [{ ...e, z: t.z0 }, { ...e, z: t.z1 }]);
}
function Qy(t) {
  const e = [...t].sort((o, r) => o.x - r.x || o.y - r.y), i = (o, r, s) => (r.x - o.x) * (s.y - o.y) - (r.y - o.y) * (s.x - o.x), n = (o) => {
    const r = [];
    for (const s of o) {
      for (; r.length > 1 && i(r[r.length - 2], r[r.length - 1], s) <= rt; ) r.pop();
      r.push(s);
    }
    return r.slice(0, -1);
  };
  return [...n(e), ...n(e.reverse())];
}
function Fs(t, e) {
  const i = t.map((n) => El(n, e));
  return [Math.min(...i), Math.max(...i)];
}
function Jy(t) {
  const e = [{ x: 0, y: 0, z: 1 }];
  for (let i = 0; i < t.base.length; i++) {
    const n = t.base[i], o = t.base[(i + 1) % t.base.length];
    e.push({ x: o.y - n.y, y: n.x - o.x, z: 0 });
  }
  if (t.vertices && t.vertices.length >= 3) {
    const [i, n, o] = t.vertices, r = { x: n.x - i.x, y: n.y - i.y, z: n.z - i.z }, s = { x: o.x - i.x, y: o.y - i.y, z: o.z - i.z };
    e.push({ x: r.y * s.z - r.z * s.y, y: r.z * s.x - r.x * s.z, z: r.x * s.y - r.y * s.x });
  }
  return e.filter((i) => Math.hypot(i.x, i.y, i.z) > rt).map((i) => {
    const n = Math.hypot(i.x, i.y, i.z);
    return { x: i.x / n, y: i.y / n, z: i.z / n };
  });
}
function Al(t, e) {
  if (t.length < 3 || e.length < 3) return !1;
  for (const i of [t, e]) for (let n = 0; n < i.length; n++) {
    const o = i[n], r = i[(n + 1) % i.length], s = r.y - o.y, a = o.x - r.x, l = t.map((d) => d.x * s + d.y * a), c = e.map((d) => d.x * s + d.y * a);
    if (Math.max(...l) <= Math.min(...c) + rt || Math.max(...c) <= Math.min(...l) + rt) return !1;
  }
  return !0;
}
function tg(t) {
  const e = (n, o) => n.map((r) => ({ ...r, z: o })), i = [];
  if (t.kind === "glass" || t.kind === "panel" || t.kind === "opening-hit" || t.vertices) {
    const [n, o] = t.base;
    i.push(t.vertices ?? [
      { ...n, z: t.z0 },
      { ...o, z: t.z0 },
      { ...o, z: t.z1 },
      { ...n, z: t.z1 }
    ]);
  } else {
    i.push(e(t.base, t.z1));
    const n = t.base.reduce((o, r) => ({ x: o.x + r.x / t.base.length, y: o.y + r.y / t.base.length }), { x: 0, y: 0 });
    for (let o = 0; o < t.base.length; o++) {
      if (t.hiddenEdges?.includes(o)) continue;
      const r = t.base[o], s = t.base[(o + 1) % t.base.length];
      let a = s.y - r.y, l = r.x - s.x;
      a * (n.x - r.x) + l * (n.y - r.y) > 0 && (a = -a, l = -l), a + l > 0 && i.push([...e([r, s], t.z0), ...e([s, r], t.z1)]);
    }
  }
  return i.flatMap((n) => {
    if (n.length < 3) return [];
    const [o, r, s] = n, a = { x: r.x - o.x, y: r.y - o.y, z: r.z - o.z }, l = { x: s.x - o.x, y: s.y - o.y, z: s.z - o.z }, c = { x: a.y * l.z - a.z * l.y, y: a.z * l.x - a.x * l.z, z: a.x * l.y - a.y * l.x }, d = c.x + c.y + c.z;
    return Math.abs(d) <= rt ? [] : [{
      polygon: n.map((h) => ({ x: h.x - h.z, y: h.y - h.z })),
      normal: c,
      distance: El(c, o),
      toward: d
    }];
  });
}
function eg(t, e) {
  let i = t;
  const n = e.reduce((o, r, s) => {
    const a = e[(s + 1) % e.length];
    return o + r.x * a.y - r.y * a.x;
  }, 0);
  for (let o = 0; o < e.length && i.length; o++) {
    const r = e[o], s = e[(o + 1) % e.length], a = (c) => Math.sign(n) * ((s.x - r.x) * (c.y - r.y) - (s.y - r.y) * (c.x - r.x)), l = [];
    for (let c = 0; c < i.length; c++) {
      const d = i[c], h = i[(c + 1) % i.length], p = a(d), f = a(h);
      if (p >= -rt && l.push(d), p > rt && f < -rt || p < -rt && f > rt) {
        const u = p / (p - f);
        l.push({ x: d.x + (h.x - d.x) * u, y: d.y + (h.y - d.y) * u });
      }
    }
    i = l;
  }
  return i;
}
function ig(t, e) {
  let i = 0;
  const n = (o, r) => (o.distance - o.normal.x * r.x - o.normal.y * r.y) / o.toward;
  for (const o of t) for (const r of e) {
    if (!Al(o.polygon, r.polygon)) continue;
    const s = eg(o.polygon, r.polygon);
    if (s.length < 3) continue;
    const a = s.map((h) => n(o, h) - n(r, h)), l = Math.min(...a), c = Math.max(...a);
    if (l < -rt && c > rt) return 0;
    const d = l < -rt ? 1 : c > rt ? -1 : 0;
    if (d && i && i !== d) return 0;
    i ||= d;
  }
  return i;
}
function ng(t) {
  const e = t.map((o, r) => {
    const s = Zy(o), a = Qy(s.map((l) => ({ x: l.x - l.z, y: l.y - l.z })));
    return {
      s: o,
      i: r,
      vs: s,
      shadow: a,
      axes: Jy(o),
      faces: tg(o),
      next: /* @__PURE__ */ new Set(),
      incoming: 0,
      depth: Xy(o),
      xmin: Math.min(...a.map((l) => l.x)),
      xmax: Math.max(...a.map((l) => l.x)),
      ymin: Math.min(...a.map((l) => l.y)),
      ymax: Math.max(...a.map((l) => l.y))
    };
  });
  for (let o = 0; o < e.length; o++) for (let r = o + 1; r < e.length; r++) {
    const s = e[o], a = e[r];
    if (s.xmax <= a.xmin + rt || a.xmax <= s.xmin + rt || s.ymax <= a.ymin + rt || a.ymax <= s.ymin + rt || !Al(s.shadow, a.shadow)) continue;
    const l = !!s.s.isSlab, c = !!a.s.isSlab;
    let d = 0;
    if (l && c)
      Math.abs(s.s.z1 - a.s.z1) > rt ? d = s.s.z1 < a.s.z1 ? 1 : -1 : d = s.depth < a.depth - rt ? 1 : s.depth > a.depth + rt ? -1 : s.i < a.i ? 1 : -1;
    else if (l !== c) {
      const [h, p] = l ? [s, a] : [a, s];
      p.s.z1 > h.s.z1 + rt ? d = l ? 1 : -1 : d = l ? -1 : 1;
    }
    if (!d) {
      for (const h of [...s.axes, ...a.axes]) {
        const p = h.x + h.y + h.z;
        if (Math.abs(p) <= rt) continue;
        const [f, u] = Fs(s.vs, h), [m, b] = Fs(a.vs, h);
        if (!(u - f <= rt && b - m <= rt && Math.abs(f - m) <= rt) && (d = u <= m + rt ? p : b <= f + rt ? -p : 0, !!d))
          break;
      }
      d ||= ig(s.faces, a.faces);
    }
    if (d || s.s.kind === "roof" && a.s.kind === "roof" && s.s.id !== a.s.id && !l && !c && (d = s.depth < a.depth - rt ? 1 : s.depth > a.depth + rt ? -1 : s.i < a.i ? 1 : -1), d) {
      const [h, p] = d > 0 ? [s, a] : [a, s];
      h.next.add(p.i), p.incoming++;
    }
  }
  const i = [...e].sort((o, r) => o.depth - r.depth || o.i - r.i), n = [];
  for (; i.length; ) {
    let o = i.findIndex((s) => s.incoming === 0);
    o < 0 && (o = i.findIndex((s) => s.s.isSlab), o < 0 && (o = 0));
    const [r] = i.splice(o, 1);
    n.push(r.s);
    for (const s of r.next) e[s].incoming--;
  }
  return n;
}
const Sr = 60, Mr = 400, Bo = 0.4, og = 0.5, Tl = 0.35, Uo = 0.85, Cl = 0.8;
function Er(t) {
  const e = t.sill;
  return typeof e != "number" || !Number.isFinite(e) ? Tl : Math.max(0, Math.min(Cl, e));
}
const rg = 32, Rs = 0.18, Ds = 0.34, Je = Math.sqrt(3) / 2, Ii = 0.5, Il = 0.26;
function zi(t) {
  return t === "iso" || t === "3d" ? "iso" : "plan";
}
function Zt(t, e = Sr) {
  return Math.min(Mr, Math.max(0, W(t, e)));
}
function Ar(t, e) {
  const i = Zt(e);
  return Zt(t.height, i) * (t.kind === "railing" ? og : 1);
}
function Vo(t, e) {
  const i = Zt(t);
  return Math.max(i, ...e.map((n) => Ar(n, i)));
}
function Cn(t, e = Sr) {
  return t === "flat" ? 8 : Math.round(e * 0.6);
}
function zl(t) {
  return Math.min(1, Math.max(0, W(t, 1)));
}
const ce = 2.5;
function qe(t) {
  if (t.projection !== "iso") return { w: t.w, h: t.h };
  const e = t.orbitSpan ?? t.w + t.h;
  return {
    w: e * Je + 2 * (t.padding ?? 0),
    h: e * Ii + t.wallHeight + (t.lowerDepth ?? 0) + 2 * (t.padding ?? 0)
  };
}
function ti(t, e, i, n = 0) {
  if (i.projection !== "iso") return { x: t, y: e };
  const o = ((i.orbitSpan ?? i.w + i.h) - i.w - i.h) / 2;
  return {
    x: (t - e) * Je + (i.h + o) * Je + (i.padding ?? 0),
    y: (t + e + o) * Ii + i.wallHeight - n + (i.padding ?? 0)
  };
}
function sg(t, e, i) {
  if (i.projection !== "iso") return { x: t, y: e };
  const n = (t - e) * Je, o = (t + e) * Ii, r = Math.hypot(n, o) || 1;
  return { x: n / r, y: o / r };
}
function Pl(t) {
  if (t.projection !== "iso") return "";
  const e = (n) => String(+n.toFixed(6)), i = ti(0, 0, t);
  return `matrix(${e(Je)} ${e(Ii)} ${e(-Je)} ${e(Ii)} ${e(i.x)} ${e(i.y)})`;
}
function kt(t, e) {
  return { x: t.x - e, y: t.y - e };
}
function qo(t, e) {
  switch (e) {
    case 90:
      return { x: -t, y: t };
    case 180:
      return { x: t, y: t };
    case 270:
      return { x: t, y: -t };
    default: {
      const { cos: i, sin: n } = no(e);
      return { x: -t * (i + n), y: t * (n - i) };
    }
  }
}
function di(t, e) {
  return e ? {
    ...t,
    z0: t.z0 + e,
    z1: t.z1 + e,
    sortDepth: t.sortDepth !== void 0 ? t.sortDepth + e : void 0,
    vertices: t.vertices?.map((i) => ({ ...i, z: i.z + e }))
  } : t;
}
function ag(t, e) {
  if (t.type === "skylight") return;
  const i = t.angle * Math.PI / 180;
  let n, o = -1 / 0;
  for (const r of e) {
    const s = r.x2 - r.x1, a = r.y2 - r.y1, l = Math.hypot(s, a);
    if (!(l > 1e-6)) continue;
    const c = { x: s / l, y: a / l };
    if (Math.abs(c.x * Math.sin(i) - c.y * Math.cos(i)) > Il) continue;
    const h = t.x - r.x1, p = t.y - r.y1, f = h * c.x + p * c.y;
    if (f < -t.length / 2 || f > l + t.length / 2) continue;
    if (Math.abs(h * -c.y + p * c.x) <= zt) {
      const m = Math.min(l, f + t.length / 2) - Math.max(0, f - t.length / 2);
      m > o && (o = m, n = r);
    }
  }
  return n;
}
function an(t, e, i) {
  const n = Zt(i), o = ag(t, e);
  return o ? Ar(o, n) : n;
}
function Ns(t, e, i, n, o = !1) {
  const r = [];
  for (const a of e) {
    if (gt(a)) continue;
    const l = a.angle * Math.PI / 180;
    if (Math.abs(i.x * Math.sin(l) - i.y * Math.cos(l)) > Il) continue;
    const d = a.x - t.x1, h = a.y - t.y1, p = d * i.x + h * i.y;
    if (Math.abs(d * -i.y + h * i.x) > zt) continue;
    const u = p - a.length / 2, m = p + a.length / 2;
    let b = Math.max(0, u), g = Math.min(n, m);
    if (o && (b <= 2 && (b = 0), n - g <= 2 && (g = n)), g - b <= 0) continue;
    const w = a.type === "window";
    r.push({ s0: b, s1: g, type: w ? "window" : "door", sill: w ? Er(a) : 0 });
  }
  r.sort((a, l) => a.s0 - l.s0);
  const s = [];
  for (const a of r) {
    const l = s[s.length - 1];
    l && (a.s0 < l.s1 || a.s0 === l.s1 && a.sill === l.sill) ? (l.s1 = Math.max(l.s1, a.s1), l.type === "window" && (l.sill = Math.max(l.sill, a.sill))) : s.push({ ...a });
  }
  return s;
}
function ln(t, e, i, n = !0, o = !1) {
  const r = Zt(i), s = [], a = Ky(t, (l, c) => {
    const d = Math.hypot(l.x2 - l.x1, l.y2 - l.y1), h = { x: (l.x2 - l.x1) / d, y: (l.y2 - l.y1) / d };
    return !Ns(l, e, h, d, o).some((p) => c ? p.s0 <= 1e-6 : p.s1 >= d - 1e-6);
  });
  for (const l of a) {
    const c = l.x2 - l.x1, d = l.y2 - l.y1, h = Math.hypot(c, d);
    if (!(h > 1e-6)) continue;
    const p = Ar(l, r), f = l.kind === "railing" ? "railing" : "wall", u = { x: c / h, y: d / h }, m = { x: -u.y, y: u.x }, b = l.thickness / 2, g = (R) => ({ x: l.x1 + u.x * R, y: l.y1 + u.y * R }), w = (R, E) => {
      const C = g(R), I = g(E), S = R <= 0 && l.start ? l.start : [
        { x: C.x + m.x * b, y: C.y + m.y * b },
        { x: C.x - m.x * b, y: C.y - m.y * b }
      ], _ = E >= h && l.end ? l.end : [
        { x: I.x + m.x * b, y: I.y + m.y * b },
        { x: I.x - m.x * b, y: I.y - m.y * b }
      ];
      return {
        base: [S[0], ..._, ...S.slice(1).reverse()],
        endEdges: _.slice(1).map((P, L) => L + 1),
        startEdges: S.slice(1).map((P, L) => _.length + 1 + L)
      };
    }, A = (R, E, C, I, S = 0) => {
      const _ = Math.max(1, Math.ceil((E - R) / rg)), P = (E - R) / _;
      for (let L = 0; L < _; L++) {
        const N = w(R + P * L, R + P * (L + 1));
        s.push({
          kind: I,
          id: l.id,
          base: N.base,
          z0: S,
          z1: C,
          hiddenEdges: [
            ...L < _ - 1 || E >= h && l.end ? N.endEdges : [],
            ...L > 0 || R <= 0 && l.start ? N.startEdges : []
          ]
        });
      }
    }, M = Ns(l, e, u, h, o);
    let k = 0;
    const z = l.kind !== "railing" && p > Sr, D = o ? 2 : 0;
    for (const R of M) {
      if (R.s0 - k > D && A(k === 0 ? -b : k, R.s0, p, f), R.type === "window" && (R.sill > 0 && A(R.s0, R.s1, p * R.sill, "sill"), n && s.push({
        kind: "glass",
        id: l.id,
        base: [g(R.s0), g(R.s1)],
        z0: p * R.sill,
        z1: p * Uo
      })), z) {
        const E = p * Uo;
        p > E + 1e-4 && A(R.s0, R.s1, p, f, E);
      }
      k = R.s1;
    }
    h - k > D && A(k === 0 ? -b : k, h + b, p, f);
  }
  return s;
}
function Ol(t, e, i, n, o, r = 0) {
  const s = (t.angle ?? 0) * Math.PI / 180, a = Math.cos(s), l = Math.sin(s), c = t.w / 2, d = t.h / 2, h = [
    [-c, -d],
    [c, -d],
    [c, d],
    [-c, d]
  ].map(([p, f]) => e(t.x + p * a - f * l, t.y + p * l + f * a));
  return { kind: "furniture", id: t.id, base: h, z0: r, z1: i, color: n, top: o };
}
function Hs(t, e) {
  if (e <= 0 || t.length < 3) return t.map((o) => ({ x: o.x, y: o.y }));
  if (t.length === 4) {
    const o = new Set(t.map((s) => s.x)), r = new Set(t.map((s) => s.y));
    if (o.size === 2 && r.size === 2) {
      let s = 1 / 0, a = -1 / 0, l = 1 / 0, c = -1 / 0;
      for (const d of t)
        d.x < s && (s = d.x), d.x > a && (a = d.x), d.y < l && (l = d.y), d.y > c && (c = d.y);
      return t.map((d) => ({
        x: d.x === s ? s - e : a + e,
        y: d.y === l ? l - e : c + e
      }));
    }
  }
  let i = 0, n = 0;
  for (const o of t)
    i += o.x / t.length, n += o.y / t.length;
  return t.map((o) => {
    const r = o.x - i, s = o.y - n, a = Math.hypot(r, s) || 1;
    return { x: o.x + r / a * e, y: o.y + s / a * e };
  });
}
function et(t, e, i, n, o, r, s) {
  const a = [];
  for (const d of e) {
    const h = a[a.length - 1];
    (!h || Math.hypot(d.x - h.x, d.y - h.y, d.z - h.z) > 1e-4) && a.push(d);
  }
  if (a.length > 2) {
    const d = a[0], h = a[a.length - 1];
    Math.hypot(d.x - h.x, d.y - h.y, d.z - h.z) <= 1e-4 && a.pop();
  }
  if (a.length < 3) return { kind: "roof", base: [], z0: o, z1: r, sortDepth: s };
  const l = a.map((d) => i(d.x, d.y)), c = a.map((d) => ({ ...i(d.x, d.y), z: d.z }));
  return {
    kind: "roof",
    id: t,
    base: l,
    z0: o,
    z1: r,
    color: n,
    sortDepth: s,
    vertices: c
  };
}
function lg(t, e, i) {
  const n = [], o = t.alongX, r = (S, _, P) => o ? { x: S, y: _, z: P } : { x: _, y: S, z: P }, s = (S) => o ? S : [...S].reverse(), a = o ? t.minX : t.minY, l = o ? t.maxX : t.maxY, c = o ? t.minY : t.minX, d = o ? t.maxY : t.maxX, h = (c + d) / 2, p = t.z0, f = t.zPeak, u = d - h, m = u > 0 ? (f - p) / u : 1, b = h - c, g = b > 0 ? (f - p) / b : 1, w = e.filter((S) => (o ? S.midY : S.midX) >= h).sort((S, _) => o ? S.minX - _.minX : S.minY - _.minY), A = e.filter((S) => (o ? S.midY : S.midX) < h).sort((S, _) => o ? S.minX - _.minX : S.minY - _.minY);
  if (w.length === 0) {
    const S = r(l, d, p), _ = r(a, d, p), P = r(a, h, f), L = r(l, h, f);
    n.push(et(t.id, s([S, _, P, L]), i, t.color, p, f));
  } else {
    let S = a;
    for (const _ of w) {
      const P = o ? _.minX : _.minY, L = o ? _.maxX : _.maxY, N = (P + L) / 2, U = o ? _.maxY : _.maxX, H = Math.max(d, U), T = _.z0, q = _.zPeak, it = Math.min(f, q), ot = h + (f - it) / m, G = r(P, H, T), F = r(L, H, T), B = r(N, ot, it), X = r(N, H, q);
      n.push(et(_.id, s([G, B, X]), i, _.color, T, q)), n.push(et(_.id, s([F, X, B]), i, _.color, T, q)), n.push(et(_.id, s([F, G, X]), i, _.color, T, q));
      const lt = r(S, h, f), dt = r(S, H, p);
      if (n.push(et(t.id, s([lt, B, G, dt]), i, t.color, p, f)), q < f) {
        const _t = r(P, h, f), Nt = r(L, h, f);
        n.push(et(t.id, s([_t, Nt, B]), i, t.color, p, f));
      }
      S = L;
    }
    if (S < l) {
      const _ = w[w.length - 1], P = o ? _.minX : _.minY, L = o ? _.maxX : _.maxY, N = (P + L) / 2, U = o ? _.maxY : _.maxX, H = Math.max(d, U), T = Math.min(f, _.zPeak), q = h + (f - T) / m, it = r(N, q, T), ot = r(L, H, _.z0), G = r(l, h, f), F = r(l, H, p);
      n.push(et(t.id, s([it, G, F, ot]), i, t.color, p, f));
    }
  }
  if (A.length === 0) {
    const S = r(a, c, p), _ = r(l, c, p), P = r(a, h, f), L = r(l, h, f);
    n.push(et(t.id, s([S, _, L, P]), i, t.color, p, f));
  } else {
    let S = a;
    for (const _ of A) {
      const P = o ? _.minX : _.minY, L = o ? _.maxX : _.maxY, N = (P + L) / 2, U = o ? _.minY : _.minX, H = Math.min(c, U), T = _.z0, q = _.zPeak, it = Math.min(f, q), ot = h - (f - it) / g, G = r(P, H, T), F = r(L, H, T), B = r(N, ot, it), X = r(N, H, q);
      n.push(et(_.id, s([X, B, G]), i, _.color, T, q)), n.push(et(_.id, s([X, F, B]), i, _.color, T, q)), n.push(et(_.id, s([G, F, X]), i, _.color, T, q));
      const lt = r(S, h, f), dt = r(S, H, p);
      if (n.push(et(t.id, s([dt, G, B, lt]), i, t.color, p, f)), q < f) {
        const _t = r(P, h, f), Nt = r(L, h, f);
        n.push(et(t.id, s([Nt, _t, B]), i, t.color, p, f));
      }
      S = L;
    }
    if (S < l) {
      const _ = A[A.length - 1], P = o ? _.minX : _.minY, L = o ? _.maxX : _.maxY, N = (P + L) / 2, U = o ? _.minY : _.minX, H = Math.min(c, U), T = Math.min(f, _.zPeak), q = h - (f - T) / g, it = r(N, q, T), ot = r(L, H, _.z0), G = r(l, h, f), F = r(l, H, p);
      n.push(et(t.id, s([ot, F, G, it]), i, t.color, p, f));
    }
  }
  const M = w.length > 0 ? Math.max(d, ...w.map((S) => o ? S.maxY : S.maxX)) : d, k = A.length > 0 ? Math.min(c, ...A.map((S) => o ? S.minY : S.minX)) : c, z = r(a, M, p), D = r(a, k, p), R = r(a, h, f);
  n.push(et(t.id, s([z, D, R]), i, t.color, p, f));
  const E = r(l, k, p), C = r(l, M, p), I = r(l, h, f);
  return n.push(et(t.id, s([E, C, I]), i, t.color, p, f)), n;
}
function js(t, e, i) {
  const n = [], o = [], r = [];
  for (const c of t) {
    if (!c.points || c.points.length < 3) continue;
    const d = c.type ?? "gable", h = c.elevation ?? i, p = Cn(d, i), f = c.height ?? p, u = c.overhang ?? 0, m = ut(c.color, "#8d6e63"), b = c.highSide, g = c.ridge, w = {
      id: c.id,
      type: d,
      points: c.points,
      height: f,
      elevation: h,
      overhang: u,
      color: m,
      highSide: b,
      ridge: g
    };
    if (d === "gable") {
      const A = Hs(w.points, u);
      let M = 1 / 0, k = -1 / 0, z = 1 / 0, D = -1 / 0;
      for (const I of A)
        I.x < M && (M = I.x), I.x > k && (k = I.x), I.y < z && (z = I.y), I.y > D && (D = I.y);
      const R = k - M, E = D - z, C = g ? g === "horizontal" : R >= E;
      o.push({
        norm: w,
        id: w.id,
        minX: M,
        maxX: k,
        minY: z,
        maxY: D,
        rangeX: R,
        rangeY: E,
        midX: (M + k) / 2,
        midY: (z + D) / 2,
        alongX: C,
        z0: h,
        pitch: f,
        zPeak: h + f,
        color: m
      });
    } else
      r.push(w);
  }
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
  for (let c = 0; c < o.length; c++)
    for (let d = 0; d < o.length; d++) {
      if (c === d) continue;
      const h = o[c], p = o[d];
      if (h.alongX === p.alongX) continue;
      const f = h.rangeX * h.rangeY, u = p.rangeX * p.rangeY;
      f < u || f === u && c > d || p.maxX <= h.minX || h.maxX <= p.minX || p.maxY <= h.minY || h.maxY <= p.minY || !(h.alongX ? h.minX < p.midX && p.midX < h.maxX : h.minY < p.midY && p.midY < h.maxY) || (a.has(h) || a.set(h, []), a.get(h).push(p), s.add(h.id), s.add(p.id));
    }
  for (const [c, d] of a)
    n.push(...lg(c, d, e));
  const l = [
    ...o.filter((c) => !s.has(c.id)).map((c) => c.norm),
    ...r
  ];
  for (const c of l) {
    const d = c.type, h = c.elevation, p = c.height, f = c.overhang, u = c.color, m = f > 0 ? Hs(c.points, f) : c.points, b = m.map((S) => e(S.x, S.y));
    let g = 1 / 0, w = -1 / 0, A = 1 / 0, M = -1 / 0;
    for (const S of m)
      S.x < g && (g = S.x), S.x > w && (w = S.x), S.y < A && (A = S.y), S.y > M && (M = S.y);
    const k = w - g, z = M - A, D = (g + w) / 2, R = (A + M) / 2, E = h + p, C = e(D, R), I = C.x + C.y + (h + E) / 2;
    if (d === "flat")
      n.push({
        kind: "roof",
        id: c.id,
        base: b,
        z0: h,
        z1: h + p,
        color: u,
        sortDepth: I
      });
    else if (d === "hip") {
      const S = c.ridge ? c.ridge === "horizontal" : k >= z, _ = Math.min(S ? k / 2 : z / 2, (S ? z : k) / 2);
      if (S) {
        const P = { x: g + _, y: R, z: E }, L = { x: w - _, y: R, z: E }, N = { x: g, y: A, z: h }, U = { x: w, y: A, z: h }, H = { x: w, y: M, z: h }, T = { x: g, y: M, z: h };
        n.push(et(c.id, [N, U, L, P], e, u, h, E, I)), n.push(et(c.id, [U, H, L], e, u, h, E, I)), n.push(et(c.id, [H, T, P, L], e, u, h, E, I)), n.push(et(c.id, [T, N, P], e, u, h, E, I));
      } else {
        const P = { x: D, y: A + _, z: E }, L = { x: D, y: M - _, z: E }, N = { x: g, y: A, z: h }, U = { x: w, y: A, z: h }, H = { x: w, y: M, z: h }, T = { x: g, y: M, z: h };
        n.push(et(c.id, [N, U, P], e, u, h, E, I)), n.push(et(c.id, [U, H, L, P], e, u, h, E, I)), n.push(et(c.id, [H, T, L], e, u, h, E, I)), n.push(et(c.id, [T, N, P, L], e, u, h, E, I));
      }
    } else if (d === "gable") {
      const S = c.ridge ? c.ridge === "horizontal" : k >= z, _ = { x: g, y: A, z: h }, P = { x: w, y: A, z: h }, L = { x: w, y: M, z: h }, N = { x: g, y: M, z: h };
      if (S) {
        const U = { x: g, y: R, z: E }, H = { x: w, y: R, z: E };
        n.push(et(c.id, [_, P, H, U], e, u, h, E, I)), n.push(et(c.id, [L, N, U, H], e, u, h, E, I)), n.push(et(c.id, [N, _, U], e, u, h, E, I)), n.push(et(c.id, [P, L, H], e, u, h, E, I));
      } else {
        const U = { x: D, y: A, z: E }, H = { x: D, y: M, z: E };
        n.push(et(c.id, [N, _, U, H], e, u, h, E, I)), n.push(et(c.id, [P, L, H, U], e, u, h, E, I)), n.push(et(c.id, [_, P, U], e, u, h, E, I)), n.push(et(c.id, [L, N, H], e, u, h, E, I));
      }
    } else if (d === "shed") {
      const S = c.highSide ?? "top", _ = h + p;
      let P = h, L = h, N = h, U = h;
      S === "top" ? (P = _, L = _) : S === "bottom" ? (U = _, N = _) : S === "left" ? (P = _, U = _) : S === "right" && (L = _, N = _);
      const H = { x: g, y: A, z: P }, T = { x: w, y: A, z: L }, q = { x: w, y: M, z: N }, it = { x: g, y: M, z: U };
      n.push(et(c.id, [H, T, q, it], e, u, h, _, I));
      const ot = [H, T, q, it];
      for (let G = 0; G < 4; G++) {
        const F = ot[G], B = ot[(G + 1) % 4];
        (F.z > h || B.z > h) && n.push(et(
          c.id,
          [
            { x: F.x, y: F.y, z: h },
            { x: B.x, y: B.y, z: h },
            { x: B.x, y: B.y, z: B.z },
            { x: F.x, y: F.y, z: F.z }
          ],
          e,
          u,
          h,
          Math.max(F.z, B.z),
          I
        ));
      }
    }
  }
  return n;
}
function cg(t) {
  const e = Math.min(...t.map((a) => a.z)), i = Math.max(...t.map((a) => a.z)), n = i - e;
  if (n < 6) return [];
  const o = Math.max(10, Math.min(22, Math.round(n / 8))), r = [], s = Math.ceil((e + o * 0.4) / o) * o;
  for (let a = s; a < i; a += o) {
    const l = [], c = t.length;
    for (let d = 0; d < c; d++) {
      const h = t[d], p = t[(d + 1) % c];
      if ((h.z <= a && p.z >= a || h.z >= a && p.z <= a) && Math.abs(p.z - h.z) > 1e-4) {
        const f = (a - h.z) / (p.z - h.z);
        l.push(kt({
          x: h.x + f * (p.x - h.x),
          y: h.y + f * (p.y - h.y)
        }, a));
      }
    }
    l.length >= 2 && r.push([l[0], l[l.length - 1]]);
  }
  return r;
}
const Ws = (t) => String(Math.round(t * 100) / 100), hi = (t) => t.map((e) => `${Ws(e.x)},${Ws(e.y)}`).join(" ");
function Ll(t, e = (i, n) => n) {
  return $`<g class="fp-iso">${ng(t).map((i) => e(i, dg(i)))}</g>`;
}
function dg(t) {
  const e = wt(t.id) ?? y;
  if (t.kind === "glass" || t.kind === "panel" || t.kind === "opening-hit") {
    const [c, d] = t.base;
    return $`<polygon class=${`fp-iso-${t.kind}${t.glazed ? " fp-iso-glazed" : ""}`} data-id=${e}
                        style=${t.color ? `--fp-iso-color:${t.color}` : y}
                        points=${hi(t.vertices ? t.vertices.map((h) => kt(h, h.z)) : [kt(c, t.z0), kt(d, t.z0), kt(d, t.z1), kt(c, t.z1)])} />`;
  }
  if (t.kind === "roof" && t.vertices) {
    const c = t.vertices.map((f) => kt(f, f.z)), [d, h, p] = t.vertices;
    if (d && h && p) {
      const f = { x: h.x - d.x, y: h.y - d.y, z: h.z - d.z }, u = { x: p.x - d.x, y: p.y - d.y, z: p.z - d.z }, m = f.y * u.z - f.z * u.y, b = f.z * u.x - f.x * u.z, g = f.x * u.y - f.y * u.x;
      if (m + b + g <= 0) return $`${y}`;
      const A = Math.hypot(m, b, g) || 1, M = m / A, k = b / A, z = g / A;
      let D = 0.12;
      z > 0.8 ? D = 0.05 : Math.abs(M) >= Math.abs(k) ? D = M > 0 ? Rs : 0.22 : D = k > 0 ? Ds : 0.35;
      const R = z > 0.05 ? cg(t.vertices) : [], E = [];
      t.color && E.push(`--fp-iso-color:${t.color}`), t.opacity !== void 0 && E.push(`opacity:${t.opacity}`);
      const C = E.length > 0 ? E.join(";") : y;
      return $`<g class="fp-iso-solid fp-iso-roof" data-id=${e}
                    style=${C}>
        <polygon class="fp-iso-face" points=${hi(c)} />
        <polygon class="fp-iso-shade" points=${hi(c)} opacity=${D} />
        ${R.map(([I, S]) => $`<line class="fp-iso-roof-line" x1=${I.x} y1=${I.y} x2=${S.x} y2=${S.y} />`)}
      </g>`;
    }
  }
  const i = t.base.length;
  let n = 0, o = 0;
  for (const c of t.base)
    n += c.x / i, o += c.y / i;
  const r = [];
  for (let c = 0; c < i; c++) {
    if (t.hiddenEdges?.includes(c)) continue;
    const d = t.base[c], h = t.base[(c + 1) % i];
    let p = h.y - d.y, f = -(h.x - d.x);
    p * (n - d.x) + f * (o - d.y) > 0 && (p = -p, f = -f), !(p + f <= 0) && r.push({
      pts: hi([kt(d, t.z0), kt(h, t.z0), kt(h, t.z1), kt(d, t.z1)]),
      shade: Math.abs(p) >= Math.abs(f) ? Rs : Ds
    });
  }
  const s = [];
  t.color && s.push(`--fp-iso-color:${t.color}`), t.opacity !== void 0 && s.push(`opacity:${t.opacity}`);
  const a = s.length > 0 ? s.join(";") : y, l = hi(t.base.map((c) => kt(c, t.z1)));
  return $`<g class=${`fp-iso-solid fp-iso-${t.kind}${t.isSlab ? " fp-iso-slab" : ""}`} data-id=${e}
                style=${a}>
    ${r.map(
    (c) => $`<polygon class="fp-iso-face" points=${c.pts} /><polygon class="fp-iso-shade" points=${c.pts} opacity=${c.shade} />`
  )}
    <polygon class="fp-iso-face fp-iso-top" points=${l} />
    ${t.top ?? y}
  </g>`;
}
const Mt = Math.PI / 180, hg = 864e5, pg = 2440588, ug = 2451545, qi = 23.4397 * Mt, Bs = 149598e3, fg = 6378.14;
function Fl(t) {
  return t / hg - 0.5 + pg - ug;
}
function Rl(t, e) {
  return {
    ra: Math.atan2(
      Math.sin(t) * Math.cos(qi) - Math.tan(e) * Math.sin(qi),
      Math.cos(t)
    ),
    dec: Math.asin(
      Math.sin(e) * Math.cos(qi) + Math.cos(e) * Math.sin(qi) * Math.sin(t)
    )
  };
}
function mg(t) {
  const e = (357.5291 + 0.98560028 * t) * Mt, i = (1.9148 * Math.sin(e) + 0.02 * Math.sin(2 * e) + 3e-4 * Math.sin(3 * e)) * Mt, n = 102.9372 * Mt;
  return Rl(e + i + n + Math.PI, 0);
}
function Dl(t) {
  const e = (218.316 + 13.176396 * t) * Mt, i = (134.963 + 13.064993 * t) * Mt, n = (93.272 + 13.22935 * t) * Mt, o = (297.85 + 12.190749 * t) * Mt, r = (357.5291 + 0.98560028 * t) * Mt, [s, a, l] = [i, n, o], c = e + Mt * (6.289 * Math.sin(s) + 1.274 * Math.sin(2 * l - s) + 0.658 * Math.sin(2 * l) + 0.214 * Math.sin(2 * s) - 0.186 * Math.sin(r) - 0.114 * Math.sin(2 * a)), d = Mt * (5.128 * Math.sin(a) + 0.281 * Math.sin(s + a) + 0.278 * Math.sin(s - a) + 0.173 * Math.sin(2 * l - a));
  return {
    ...Rl(c, d),
    distance: 385001 - 20905 * Math.cos(s) - 3699 * Math.cos(2 * l - s) - 2956 * Math.cos(2 * l)
  };
}
function yg(t, e, i) {
  const n = Fl(t), o = e * Mt, r = Dl(n), s = (280.16 + 360.9856235 * n) * Mt + i * Mt - r.ra, a = Math.asin(
    Math.sin(o) * Math.sin(r.dec) + Math.cos(o) * Math.cos(r.dec) * Math.cos(s)
  ), l = a - Math.asin(fg / r.distance) * Math.cos(a), c = Math.max(0, l), d = 2967e-7 / Math.tan(c + 312536e-8 / (c + 0.08901179));
  return {
    bearing: ((Math.atan2(
      Math.sin(s),
      Math.cos(s) * Math.sin(o) - Math.tan(r.dec) * Math.cos(o)
    ) / Mt + 180) % 360 + 360) % 360,
    altitude: (l + d) / Mt
  };
}
function gg(t) {
  const e = Fl(t), i = mg(e), n = Dl(e), o = Math.acos(
    Math.sin(i.dec) * Math.sin(n.dec) + Math.cos(i.dec) * Math.cos(n.dec) * Math.cos(i.ra - n.ra)
  ), r = Math.atan2(
    Bs * Math.sin(o),
    n.distance - Bs * Math.cos(o)
  );
  return (1 + Math.cos(r)) / 2;
}
const nt = 8, Nl = 0.05, wi = "—";
function Pi(t, e) {
  if (!e || !t) return wi;
  const i = t.states[e];
  return i ? t.formatEntityState(i) : wi;
}
function Hl(t, e, i) {
  if (t.formatEntityState !== e.formatEntityState || t.formatEntityAttributeValue !== e.formatEntityAttributeValue || t.themes?.darkMode !== e.themes?.darkMode) return !0;
  for (const n of i)
    if (t.states[n] !== e.states[n]) return !0;
  return !1;
}
function bg(t) {
  const e = /* @__PURE__ */ new Set();
  for (const i of yt(t))
    for (const n of i.furniture ?? [])
      for (const o of ["tap", "hold", "double_tap"]) {
        const r = $i(n, o), s = r && kl({ entity: r.entity }, r.config);
        s && e.add(s);
      }
  return e;
}
function He(t) {
  const e = /* @__PURE__ */ new Set();
  (t.sunDimming || t.ambientDaylight || t.sunlight && !ze(t)) && e.add("sun.sun");
  const i = Fi(t);
  i && e.add(i);
  for (const n of yt(t)) {
    for (const o of n.openings)
      o.entity && e.add(o.entity), o.shutterEntity && e.add(o.shutterEntity), o.secondaryEntity && e.add(o.secondaryEntity), o.shutterSecondaryEntity && e.add(o.shutterSecondaryEntity);
    for (const o of n.items) {
      o.entity && e.add(o.entity), o.hideEntity && e.add(o.hideEntity), o.hideStateEntity && e.add(o.hideStateEntity), o.hideBadgeEntity && e.add(o.hideBadgeEntity);
      for (const r of ye(o)) r.entity && e.add(r.entity);
    }
    for (const o of n.texts)
      o.entity && e.add(o.entity);
    for (const o of n.furniture)
      o.entity && e.add(o.entity);
    for (const o of n.areas)
      o.entity && e.add(o.entity);
    for (const o of n.trackers)
      for (const r of [o.xSensor, o.ySensor])
        r?.entity && e.add(r.entity), r?.presence?.entity && e.add(r.presence.entity);
    n.summary?.temperatureEntity && e.add(n.summary.temperatureEntity), n.summary?.humidityEntity && e.add(n.summary.humidityEntity), n.summary?.presenceEntity && e.add(n.summary.presenceEntity);
  }
  return e;
}
function Tr(t, e, i) {
  if (!e || !t) return wi;
  const n = t.states[e];
  if (!n) return wi;
  const o = t.formatEntityAttributeValue;
  if (typeof o == "function") return o(n, i);
  const r = n.attributes?.[i];
  return r == null || r === "" ? wi : String(r);
}
function vg(t, e, i) {
  const n = i.entity || (i.attribute ? e.entity : void 0);
  return n ? i.attribute ? Tr(t, n, i.attribute) : Pi(t, n) : "";
}
function ye(t) {
  return [...t.secondaryEntity || t.secondaryAttribute ? [{ entity: t.secondaryEntity, attribute: t.secondaryAttribute }] : [], ...t.readings ?? []];
}
function xg(t, e) {
  return e.attribute ? Tr(t, e.entity, e.attribute) : Pi(t, e.entity);
}
function Cr(t, e) {
  if (!e.entity) return e.text ?? "";
  const i = e.attribute ? Tr(t, e.entity, e.attribute) : Pi(t, e.entity);
  return e.text ? `${e.text} ${i}` : i;
}
function so(t, e) {
  return jl(t, e)?.color;
}
function jl(t, e) {
  if (!t?.length) return;
  const i = typeof e == "number" ? e : Number(e), n = typeof e != "boolean" && e !== "" && e != null && Number.isFinite(i), o = e == null ? "" : String(e).trim().toLowerCase();
  let r, s, a;
  for (const l of t)
    !l || typeof l != "object" || typeof l.color != "string" || (typeof l.state == "string" && l.state !== "" ? r === void 0 && o !== "" && l.state.trim().toLowerCase() === o && (r = l) : typeof l.above == "number" ? n && i > l.above && (!s || l.above > (s.above ?? -1 / 0)) && (s = l) : a === void 0 && (a = l));
  return r ?? s ?? a;
}
function Us(t, e) {
  if (!t.entity) return;
  const i = so(t.stateColor, e);
  if (i) return J(i);
  if (t.activeColor && se(t.entity, e)) return J(t.activeColor);
}
function Yi(t, e) {
  if (!t.entity) return;
  const i = so(t.stateColor, e);
  if (i) return J(i);
  if (t.activeColor && se(t.entity, e)) return J(t.activeColor);
}
function wg(t) {
  if (!t) return !1;
  const e = t.attributes ?? {}, i = e.supported_color_modes;
  if (Array.isArray(i) && i.length > 0) return !0;
  if (typeof e.unit_of_measurement == "string" && e.unit_of_measurement.length > 0 || e.hvac_modes != null) return !1;
  const n = e.device_class;
  return n === "outlet" || n === "switch" ? !0 : typeof n == "string" && n.length > 0 ? !1 : t.state === "on" || t.state === "off";
}
function In(t, e) {
  if (!e || e.state !== "on") return;
  const i = e.attributes ?? {}, n = i.brightness, o = typeof n == "number" && Number.isFinite(n) ? Math.max(0, Math.min(255, n)) : void 0, r = o === void 0 ? Mn : ms + (Mn - ms) * (o / 255), s = W(t.glowRadius, Ai) * (o === void 0 ? 1 : ys + (1 - ys) * (o / 255)), a = i.rgb_color;
  if (Array.isArray(a) && a.length >= 3) {
    const [l, c, d] = a;
    if ([l, c, d].every((h) => typeof h == "number" && Number.isFinite(h))) {
      const h = (f) => Math.max(0, Math.min(255, Math.round(f))), p = J(`rgb(${h(l)}, ${h(c)}, ${h(d)})`);
      if (p) return { color: p, opacity: r, radius: s };
    }
  }
  return { color: ut(t.glowColor, cl), opacity: r, radius: s };
}
function Wl(t) {
  if (!t || t.state !== "on") return;
  const e = t.attributes ?? {}, i = e.rgb_color;
  if (!Array.isArray(i) || i.length < 3) return;
  const [n, o, r] = i;
  if (![n, o, r].every((d) => typeof d == "number" && Number.isFinite(d))) return;
  const s = e.brightness, a = typeof s == "number" && Number.isFinite(s) ? Math.max(0, Math.min(255, s)) : void 0, l = a === void 0 ? 1 : gs + (1 - gs) * (a / 255), c = (d) => Math.max(0, Math.min(255, Math.round(d * l)));
  return J(`rgb(${c(n)}, ${c(o)}, ${c(r)})`);
}
function Vs(t, e) {
  return e ? In(t, e) : {
    color: ut(t.glowColor, cl),
    opacity: Mn,
    radius: W(t.glowRadius, Ai)
  };
}
function ao(t, e, i) {
  const n = i.x2 - i.x1, o = i.y2 - i.y1, r = n * n + o * o, s = r === 0 ? 0 : Math.max(0, Math.min(1, ((t - i.x1) * n + (e - i.y1) * o) / r)), a = i.x1 + s * n, l = i.y1 + s * o;
  return Math.hypot(t - a, e - l);
}
function Ir(t, e, i, n, o) {
  const r = o.x2 - o.x1, s = o.y2 - o.y1, a = i * s - n * r;
  if (Math.abs(a) < 1e-12) return;
  const l = o.x1 - t, c = o.y1 - e, d = (l * s - c * r) / a, h = (l * n - c * i) / a;
  if (!(d <= 1e-9 || h < 0 || h > 1))
    return d;
}
function _g(t, e, i, n, o) {
  const r = t.x2 - t.x1, s = t.y2 - t.y1, a = [-r, r, -s, s], l = [t.x1 - e, n - t.x1, t.y1 - i, o - t.y1];
  let c = 0, d = 1;
  for (let h = 0; h < 4; h++) {
    if (a[h] === 0) {
      if (l[h] < 0) return;
      continue;
    }
    const p = l[h] / a[h];
    if (a[h] < 0) {
      if (p > d) return;
      p > c && (c = p);
    } else {
      if (p < c) return;
      p < d && (d = p);
    }
  }
  return {
    ...t,
    x1: t.x1 + c * r,
    y1: t.y1 + c * s,
    x2: t.x1 + d * r,
    y2: t.y1 + d * s
  };
}
function zr(t, e, i) {
  if (Ut(t)) return 1;
  if (vt(t) === "fixed") return 0;
  const n = Math.max(0, Math.min(1, e)), o = Math.max(0, Math.min(1, i ?? e));
  if (vt(t) === "swing")
    return oe(t) === "double" ? (n + o) / 2 : n * po(t);
  if (vt(t) === "awning") return n;
  switch (Hi(t)) {
    case "biparting":
      return (n + o) / 2;
    case "biparting-bypass":
    case "converging":
      return (n + o) / 4;
    default:
      return n;
  }
}
function Pr(t, e, i, n) {
  return n !== void 0 && n <= 0 ? [0, 0] : Rn(t) ? [0, 1] : $g(t, e, i);
}
function $g(t, e, i) {
  const n = zr(t, e, i), o = [(1 - n) / 2, (1 + n) / 2];
  if (po(t) < 1) {
    const l = [0, n];
    return t.flipH ? [1 - l[1], 1 - l[0]] : l;
  }
  if (vt(t) !== "swing" || oe(t) !== "double") return o;
  const r = Math.max(0, Math.min(1, e)), s = Math.max(0, Math.min(1, i ?? e)), a = [0.5 - r / 2, 0.5 + s / 2];
  return t.flipH ? [1 - a[1], 1 - a[0]] : a;
}
function lo(t, e, i) {
  const n = [];
  for (const r of e) {
    if (gt(r)) continue;
    const s = i(r), a = (c) => Math.max(0, Math.min(1, c)), l = typeof s == "number" ? [(1 - a(s)) / 2, (1 + a(s)) / 2] : [a(Math.min(s[0], s[1])), a(Math.max(s[0], s[1]))];
    l[1] > l[0] && n.push({ o: r, span: l });
  }
  if (!n.length) return t;
  const o = [];
  for (const r of t) {
    const s = r.x2 - r.x1, a = r.y2 - r.y1, l = s * s + a * a;
    if (l === 0) {
      o.push(r);
      continue;
    }
    const c = Math.sqrt(l), d = [];
    for (const { o: b, span: g } of n) {
      if (ao(b.x, b.y, r) > zt) continue;
      const w = ((b.x - r.x1) * s + (b.y - r.y1) * a) / l, A = Math.cos(b.angle * Math.PI / 180) * s + Math.sin(b.angle * Math.PI / 180) * a >= 0 ? 1 : -1, M = (E) => A * (E - 0.5) * b.length / c, k = w + M(g[0]), z = w + M(g[1]), D = Math.max(0, Math.min(k, z)), R = Math.min(1, Math.max(k, z));
      R > D && d.push([D, R]);
    }
    if (!d.length) {
      o.push(r);
      continue;
    }
    d.sort((b, g) => b[0] - g[0]);
    const h = [d[0]];
    for (const b of d.slice(1)) {
      const g = h[h.length - 1];
      b[0] <= g[1] ? g[1] = Math.max(g[1], b[1]) : h.push(b);
    }
    const p = (b) => ({ x: r.x1 + s * b, y: r.y1 + a * b });
    let f = 0, u = 0;
    const m = (b, g) => {
      if ((g - b) * c < nt / 2) return;
      const w = p(b), A = p(g);
      o.push({ id: `${r.id}#${u++}`, x1: w.x, y1: w.y, x2: A.x, y2: A.y });
    };
    for (const [b, g] of h)
      m(f, b), f = g;
    m(f, 1);
  }
  return o;
}
function co(t, e, i, n, o = nt) {
  const r = n.filter((p) => {
    const f = ao(t, e, p);
    return f < i && f > o;
  });
  if (!r.length) return;
  const s = i * 1.01, a = [
    { id: "b1", x1: t - s, y1: e - s, x2: t + s, y2: e - s },
    { id: "b2", x1: t + s, y1: e - s, x2: t + s, y2: e + s },
    { id: "b3", x1: t + s, y1: e + s, x2: t - s, y2: e + s },
    { id: "b4", x1: t - s, y1: e + s, x2: t - s, y2: e - s }
  ], l = r.map((p) => _g(p, t - s, e - s, t + s, e + s)).filter((p) => p !== void 0);
  if (!l.length) return;
  const c = [...l, ...a], d = [];
  for (const p of c)
    for (const [f, u] of [
      [p.x1, p.y1],
      [p.x2, p.y2]
    ]) {
      const m = Math.atan2(u - e, f - t);
      for (const b of [m - 1e-4, m, m + 1e-4]) {
        const g = Math.cos(b), w = Math.sin(b);
        let A = 1 / 0;
        for (const M of c) {
          const k = Ir(t, e, g, w, M);
          k !== void 0 && k < A && (A = k);
        }
        A < 1 / 0 && d.push({ x: t + g * A, y: e + w * A, a: b });
      }
    }
  d.sort((p, f) => p.a - f.a);
  const h = (p) => Math.round(p * 100) / 100;
  return d.map(({ x: p, y: f }) => ({ x: h(p), y: h(f) }));
}
function Bl(t, e, i, n) {
  const o = e.radius, r = Te(t);
  if (r) {
    const d = n?.length ? ql(r, o, n) : void 0;
    return Yl(r, o, e.color, e.opacity, i, d, "fp-glow");
  }
  const s = n?.length ? co(t.x, t.y, o, n) : void 0, a = `${i}-clip`, l = Oi(t), c = `${i}-cone`;
  return $`
    ${s ? $`<clipPath id=${a}>
                <polygon points=${s.map((d) => `${d.x},${d.y}`).join(" ")} />
              </clipPath>` : y}
    ${l ? Vl(c, t.x, t.y, o, l) : y}
    <radialGradient id=${i} gradientUnits="userSpaceOnUse"
                    cx=${t.x} cy=${t.y} r=${o}>
      <stop offset="0" stop-color=${e.color} stop-opacity=${e.opacity} />
      <stop offset="1" stop-color=${e.color} stop-opacity="0" />
    </radialGradient>
    <circle class="fp-glow" cx=${t.x} cy=${t.y} r=${o}
            fill=${`url(#${i})`}
            clip-path=${s ? `url(#${a})` : y}
            mask=${l ? `url(#${c})` : y} />`;
}
function Oi(t) {
  if (W(t.stripLength, 0) >= Zn) return;
  const e = W(t.glowWidth, 360);
  return e < 360 ? { bearing: (W(t.glowDirection, 0) % 360 + 360) % 360, width: Math.max(ll, e) } : void 0;
}
function Ul(t, e, i, n, o) {
  const r = (l) => {
    const c = l * Math.PI / 180;
    return { x: Z(t + Math.sin(c) * i), y: Z(e - Math.cos(c) * i) };
  };
  if (o >= 180)
    return Array.from({ length: 36 }, (l, c) => r(c * 10));
  const s = Math.max(2, Math.ceil(o * 2 / 10)), a = Array.from({ length: s + 1 }, (l, c) => r(n - o + 2 * o * c / s));
  return [{ x: Z(t), y: Z(e) }, ...a];
}
const kg = 20;
function Vl(t, e, i, n, o) {
  const r = o.width / 2, s = Math.max(2, Math.min(12, o.width * 0.15)), a = Math.max(0.5, r - s), l = r + s, c = n * 1.02, d = kg, h = Array.from({ length: d }, (p, f) => {
    const u = l - (l - a) * f / (d - 1);
    return {
      points: Ul(e, i, c, o.bearing, u).map((m) => `${m.x},${m.y}`).join(" "),
      opacity: Z(1 / (d - f))
    };
  });
  return $`<mask id=${t} maskUnits="userSpaceOnUse"
                   x=${Z(e - c)} y=${Z(i - c)} width=${Z(c * 2)} height=${Z(c * 2)}>
    ${h.map((p) => $`<polygon points=${p.points} fill="#fff" fill-opacity=${p.opacity} />`)}
  </mask>`;
}
const Z = (t) => Math.round(t * 100) / 100;
function Te(t) {
  const e = W(t.stripLength, 0);
  if (!(e >= Zn)) return;
  const i = W(t.stripAngle, 0) * Math.PI / 180, n = Math.cos(i), o = Math.sin(i), r = e / 2;
  return {
    x1: Z(t.x - n * r),
    y1: Z(t.y - o * r),
    x2: Z(t.x + n * r),
    y2: Z(t.y + o * r),
    dx: n,
    dy: o,
    length: e,
    side: t.stripSide === "left" || t.stripSide === "right" ? t.stripSide : "both"
  };
}
function Sg(t, e, i, n) {
  const o = Math.atan2(n - e, i - t) * 180 / Math.PI;
  return {
    x: Z((t + i) / 2),
    y: Z((e + n) / 2),
    stripLength: Z(Math.hypot(i - t, n - e)),
    stripAngle: Z((o % 360 + 360) % 360)
  };
}
function ho(t) {
  return t.side === "right" ? { nx: -t.dy, ny: t.dx } : { nx: t.dy, ny: -t.dx };
}
const Mg = 16;
function ql(t, e, i) {
  const n = Math.min(nt * 1.5, t.length / 2), o = t.length - n * 2, r = o <= 0 ? 1 : Math.min(Mg, Math.ceil(o / Math.max(e / 2, nt)) + 1), s = r > 1 ? o / (r - 1) : 0, a = t.side === "both" ? 0 : nt, { nx: l, ny: c } = ho(t), d = e + Math.max(n, s / 2) + a, h = [];
  let p = !1;
  for (let f = 0; f < r; f++) {
    const u = r > 1 ? n + s * f : t.length / 2, m = t.x1 + t.dx * u + l * a, b = t.y1 + t.dy * u + c * a, g = co(m, b, d, i);
    g && (p = !0), h.push(g ? { points: g } : { cx: Z(m), cy: Z(b), r: Z(d) });
  }
  return p ? h : void 0;
}
function Yl(t, e, i, n, o, r, s) {
  const { nx: a, ny: l } = ho(t), { x1: c, y1: d, x2: h, y2: p, dx: f, dy: u } = t, m = t.side === "both", b = m ? e : 0, g = (E, C) => `${Z(E)},${Z(C)}`, w = [
    g(c - a * b, d - l * b),
    g(h - a * b, p - l * b),
    g(h + a * e, p + l * e),
    g(c + a * e, d + l * e)
  ].join(" "), A = (c + h) / 2, M = (d + p) / 2, k = (E, C, I, S) => [
    g(A - a * b, M - l * b),
    g(A + a * e, M + l * e),
    g(E + a * e + I * e, C + l * e + S * e),
    g(E - a * b + I * e, C - l * b + S * e)
  ].join(" "), z = {
    x: Z(Math.min(c, h) - e - 1),
    y: Z(Math.min(d, p) - e - 1),
    w: Z(Math.abs(h - c) + e * 2 + 2),
    h: Z(Math.abs(p - d) + e * 2 + 2)
  }, D = `${o}-clip`, R = (E, C, I) => $`
    <radialGradient id=${`${o}-${E}`} gradientUnits="userSpaceOnUse"
                    cx=${C} cy=${I} r=${e}>
      <stop offset="0" stop-color="#fff" />
      <stop offset="1" stop-color="#000" />
    </radialGradient>`;
  return $`
    ${r ? $`<clipPath id=${D}>
                ${r.map(
    (E) => "points" in E ? $`<polygon points=${E.points.map((C) => `${C.x},${C.y}`).join(" ")} />` : $`<circle cx=${E.cx} cy=${E.cy} r=${E.r} />`
  )}
              </clipPath>` : y}
    <linearGradient id=${`${o}-run`} gradientUnits="userSpaceOnUse"
                    x1=${Z(A - a * b)} y1=${Z(M - l * b)}
                    x2=${Z(A + a * e)} y2=${Z(M + l * e)}>
      ${m ? $`<stop offset="0" stop-color="#000" />
                <stop offset="0.5" stop-color="#fff" />` : $`<stop offset="0" stop-color="#fff" />`}
      <stop offset="1" stop-color="#000" />
    </linearGradient>
    ${R("a", c, d)}
    ${R("b", h, p)}
    <clipPath id=${`${o}-ca`}><polygon points=${k(c, d, -f, -u)} /></clipPath>
    <clipPath id=${`${o}-cb`}><polygon points=${k(h, p, f, u)} /></clipPath>
    <mask id=${`${o}-fall`} maskUnits="userSpaceOnUse"
          x=${z.x} y=${z.y} width=${z.w} height=${z.h}>
      <circle cx=${c} cy=${d} r=${e} fill=${`url(#${o}-a)`} clip-path=${`url(#${o}-ca)`} />
      <circle cx=${h} cy=${p} r=${e} fill=${`url(#${o}-b)`} clip-path=${`url(#${o}-cb)`} />
      <polygon points=${w} fill=${`url(#${o}-run)`} />
    </mask>
    <g class=${s ?? y} clip-path=${r ? `url(#${D})` : y}>
      <rect x=${z.x} y=${z.y} width=${z.w} height=${z.h}
            fill=${i} fill-opacity=${n} mask=${`url(#${o}-fall)`} />
    </g>`;
}
function Gl(t, e) {
  const { nx: i, ny: n } = ho(t), o = t.side === "both" ? 0 : nt;
  return $`<line class=${e ? "fp-strip on" : "fp-strip"}
                   x1=${Z(t.x1 + i * o)} y1=${Z(t.y1 + n * o)}
                   x2=${Z(t.x2 + i * o)} y2=${Z(t.y2 + n * o)}
                   style=${e ? `stroke: ${e}` : y} />`;
}
function Eg(t, e) {
  const { nx: i, ny: n } = ho(t), { x1: o, y1: r, x2: s, y2: a, dx: l, dy: c } = t, d = (f, u) => `${Z(f)} ${Z(u)}`, h = t.side === "right" ? 0 : 1, p = (f, u) => `A ${Z(e)} ${Z(e)} 0 0 ${h} ${d(f, u)}`;
  return t.side === "both" ? [
    `M ${d(o + i * e, r + n * e)}`,
    `L ${d(s + i * e, a + n * e)}`,
    p(s - i * e, a - n * e),
    `L ${d(o - i * e, r - n * e)}`,
    p(o + i * e, r + n * e),
    "Z"
  ].join(" ") : [
    `M ${d(o - l * e, r - c * e)}`,
    p(o + i * e, r + n * e),
    `L ${d(s + i * e, a + n * e)}`,
    p(s + l * e, a + c * e),
    "Z"
  ].join(" ");
}
function Ag(t, e, i, n, o, r, s = y) {
  const a = t.map((c) => {
    if (!c.glow) return;
    const d = In(c, e?.[c.entity]);
    if (d)
      return {
        // Normalized against the glow's own ceiling, so a full-brightness lamp
        // clears the dim entirely and a dim one clears proportionally.
        strength: Math.max(0, Math.min(1, d.opacity / Mn)),
        // Straight off the paint, so the clearing tracks the pool as it shrinks
        // with brightness (issue #123) instead of staying at the configured size.
        radius: d.radius
      };
  });
  if (!a.some((c) => c !== void 0) && s === y) return y;
  const l = nt;
  return $`
    <defs>
      <mask id=${o} maskUnits="userSpaceOnUse"
            x=${-l} y=${-l} width=${i + l * 2} height=${n + l * 2}>
        <rect x=${-l} y=${-l} width=${i + l * 2} height=${n + l * 2}
              fill="white" />
        ${t.map((c, d) => {
    const h = a[d];
    if (h === void 0) return y;
    const { strength: p, radius: f } = h, u = `${o}-${d}`, m = Te(c);
    if (m) {
      const M = r?.length ? ql(m, f, r) : void 0;
      return Yl(m, f, "#000", p, u, M);
    }
    const b = r?.length ? co(c.x, c.y, f, r) : void 0, g = `${u}-clip`, w = Oi(c), A = `${u}-cone`;
    return $`
            ${b ? $`<clipPath id=${g}>
                        <polygon points=${b.map((M) => `${M.x},${M.y}`).join(" ")} />
                      </clipPath>` : y}
            ${w ? Vl(A, c.x, c.y, f, w) : y}
            <radialGradient id=${u} gradientUnits="userSpaceOnUse"
                            cx=${c.x} cy=${c.y} r=${f}>
              <stop offset="0" stop-color="#000" stop-opacity=${p} />
              <stop offset="1" stop-color="#000" stop-opacity="0" />
            </radialGradient>
            <circle cx=${c.x} cy=${c.y} r=${f} fill=${`url(#${u})`}
                    clip-path=${b ? `url(#${g})` : y}
                    mask=${w ? `url(#${A})` : y} />`;
  })}
        ${s}
      </mask>
    </defs>`;
}
function Kl(t, e, i, n, o = It) {
  const r = nt;
  return $`
    <defs>
      <mask id=${n} maskUnits="userSpaceOnUse"
            x=${-r} y=${-r} width=${e + r * 2} height=${i + r * 2}>
        <rect x=${-r} y=${-r} width=${e + r * 2} height=${i + r * 2}
              fill="white" />
        ${t.map((s) => {
    const a = 1 - Yd;
    return Tg(s, "#000", "#000", a, o);
  })}
      </mask>
    </defs>`;
}
function Tg(t, e, i, n, o = It) {
  const r = e;
  let s = Rt(o, t.type) ?? wl;
  s = structuredClone(s), s.parts = s.parts.map((c) => (c.style.fillOpacity = Cg(c) ? n : 0, c));
  const a = _l(s, t.w, t.h, r, i), l = t.hand === "left" ? " scale(-1 1)" : "";
  return $`<g class=${`fp-furniture-mask fp-furniture-mask-${wt(t.type) ?? "unknown"}`}
                transform="translate(${t.x} ${t.y}) rotate(${t.angle ?? 0})${l}">${a}</g>`;
}
function Cg(t) {
  switch (t.kind) {
    case "rect":
    case "circle":
    case "ellipse":
      return !0;
    case "poly":
      return t.closed;
    case "path": {
      let e = !1;
      for (const i of t.cmds)
        if (i[0] === "M") {
          if (e) return !1;
          e = !0;
        } else i[0] === "Z" && (e = !1);
      return !e;
    }
    case "line":
      return !1;
  }
}
function Xl(t, e, i) {
  if (t.enableHideByEntity) {
    const n = t.hideEntity || t.entity;
    let o = e;
    return n && i && i.states[n] && (o = t.hideAttribute ? i.states[n].attributes[t.hideAttribute] : i.states[n].state), Or(
      o,
      t.hideMode,
      t.hideState,
      t.hideOperator,
      t.hideThreshold,
      t.hideInvert
    );
  }
  return t.hideWhenInactive ? t.entity ? !se(t.entity, e) : !0 : !1;
}
function Ig(t, e) {
  return t.showOnlyWhenZoomed ? e ? t.area ? t.area !== e.id && t.area !== e.name : !ct(e.points ?? [], t.x, t.y) : !0 : !1;
}
function zg(t, e, i) {
  if (!t.enableHideBadgeByEntity) return !1;
  let n = e;
  if (i) {
    const o = t.hideBadgeEntity || t.entity;
    o && i.states[o] && (n = t.hideBadgeAttribute && i.states[o].attributes ? String(i.states[o].attributes[t.hideBadgeAttribute]) : i.states[o].state);
  }
  return Or(
    n,
    t.hideBadgeMode,
    t.hideBadgeMatch,
    // Ensure this property is correctly mapped in your types, or use hideBadgeState
    t.hideBadgeOperator,
    t.hideBadgeThreshold,
    t.hideBadgeInvert
  );
}
const Zl = 12;
function Ql(t, e) {
  const i = [];
  if (e.showName) {
    const o = e.entity ? t?.states[e.entity]?.attributes?.friendly_name : void 0, r = e.name || o || e.entity;
    r && i.push(r);
  }
  let n = !1;
  if (e.enableHideStateByEntity && t) {
    const o = e.hideStateEntity || e.entity;
    let r;
    o && t.states[o] && (r = e.hideStateAttribute && t.states[o].attributes ? t.states[o].attributes[e.hideStateAttribute] : t.states[o].state), n = Or(
      r,
      e.hideStateMode,
      e.hideStateMatch,
      e.hideStateOperator,
      e.hideStateThreshold,
      e.hideStateInvert
    );
  }
  if (e.entity && (e.showState ?? e.kind === "sensor") && !n && i.push(xg(t, e)), !n)
    for (const o of ye(e)) {
      if (o.showState === !1) continue;
      const r = vg(t, e, o);
      r && i.push(r);
    }
  return i.join(" · ");
}
const qs = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function Or(t, e = "state", i, n = "==", o, r = !1) {
  if (t == null || t === "") return !1;
  let s = !1;
  if (e === "threshold") {
    if (o == null) return !1;
    const a = Number(t);
    if (!Number.isFinite(a)) return !1;
    switch (n) {
      case "<":
        s = a < o;
        break;
      case "<=":
        s = a <= o;
        break;
      case "==":
        s = a === o;
        break;
      case "!=":
        s = a !== o;
        break;
      case ">=":
        s = a >= o;
        break;
      case ">":
        s = a > o;
        break;
      default:
        return !1;
    }
  } else {
    if (i == null || String(i).trim() === "") return !1;
    const a = String(t).trim().toLowerCase(), l = String(i).trim().toLowerCase();
    if (qs.has(a) && !qs.has(l))
      return !1;
    s = n === "!=" ? a !== l : a === l;
  }
  return r ? !s : s;
}
function Pg(t) {
  return t.showName || (t.showState ?? t.kind === "sensor") ? !0 : ye(t).some((e) => e.showState !== !1 && (e.entity || e.attribute));
}
function Lr(t) {
  const e = t.labelPosition;
  return e === "left" || e === "right" || e === "above" || e === "auto" ? e : "below";
}
function Og(t, e) {
  const i = Ql(t, e);
  return i ? { text: i, live: !0 } : { text: e.name || e.entity || e.kind, live: !1 };
}
function Jl(t) {
  return Math.min(40, Math.max(8, W(t, Zl)));
}
function tc(t, e) {
  if (!t.disableLabelColor) return e;
  if (t.useCustomLabelColor)
    return J(t.labelCustomColor) ?? void 0;
}
function ec(t) {
  return Math.min(40, Math.max(8, W(t, mr)));
}
function Lt(t) {
  return Math.min(Ti, Math.max(2, W(t, nt)));
}
function ic(t, e) {
  if (t === void 0) return "";
  const i = Lt(t);
  return e === "railing" ? `stroke-width:${Math.round(i * Ye * 100) / 100};` : `stroke-width:${i};`;
}
function nc() {
  return "stroke-width:2; stroke-dasharray:2 12; opacity:0.7;";
}
const Ye = 0.4;
function Xt(t) {
  return t.kind === "railing";
}
const Ys = /* @__PURE__ */ new WeakMap();
function Fr(t) {
  if (!t.some(Xt)) return t;
  let e = Ys.get(t);
  return e || (e = t.filter((i) => !Xt(i)), Ys.set(t, e)), e;
}
function zn(t) {
  return t === "plan" ? "plan" : "fixed";
}
const oc = 4e3;
function Pn(t) {
  if (typeof t != "number" && typeof t != "string") return;
  const e = Number(t);
  return Number.isFinite(e) && e > 0 ? Math.min(e, oc) : void 0;
}
function st(t, e) {
  return e === "plan" ? `calc(${t} * var(--fp-u, 1px))` : `${t}px`;
}
function Lg(t, e) {
  return e !== "plan" && t === void 0 ? "" : `font-size:${st(ec(t), e)};`;
}
function Gs(t) {
  switch (t) {
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
const Fg = {
  media_player: { on: "mdi:television-play", off: "mdi:television-off" },
  fan: { on: "mdi:fan", off: "mdi:fan-off" },
  lock: { on: "mdi:lock-open-variant", off: "mdi:lock" },
  camera: { on: "mdi:cctv", off: "mdi:cctv-off" },
  humidifier: { on: "mdi:air-humidifier", off: "mdi:air-humidifier-off" },
  vacuum: { on: "mdi:robot-vacuum", off: "mdi:robot-vacuum-variant" }
}, Rg = {
  paused: "mdi:television-pause",
  idle: "mdi:television"
}, Dg = {
  off: "mdi:power",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  heat_cool: "mdi:sun-snowflake-variant",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan"
}, Ng = {
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
}, Hg = {
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
}, jg = {
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
}, Wg = {
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
function Bg(t) {
  return t === "on" || t === "open" || t === "home" || t === "playing";
}
const Ug = {
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
function se(t, e) {
  if (!e || e === "unavailable" || e === "unknown") return !1;
  const i = t?.split(".")[0] ?? "", n = Ug[i];
  return n ? n.has(e) : Bg(e);
}
const Vg = {
  fan: "spin",
  media_player: "pulse",
  vacuum: "pulse"
};
function rc(t) {
  return Vg[t?.split(".")[0] ?? ""];
}
const qg = /* @__PURE__ */ new Set(["idle", "off"]);
function Yg(t) {
  const e = t?.hvac_action;
  return typeof e != "string" ? !0 : !qg.has(e);
}
function sc(t, e, i) {
  const n = t.iconAnimation ?? "auto";
  if (n !== "none" && se(t.entity, e)) {
    if (t.entity?.split(".")[0] === "climate") {
      if (!Yg(i)) return;
      if (e === "fan_only") return "spin";
    }
    return n === "spin" || n === "pulse" ? n : rc(t.entity);
  }
}
const Gg = /* @__PURE__ */ new Set(["motion", "occupancy", "presence", "vibration"]);
function ac(t, e) {
  const i = t?.split(".")[0];
  return i === "device_tracker" || i === "person" ? !0 : i === "binary_sensor" && !!e && Gg.has(e);
}
function lc(t, e, i, n) {
  const o = t.split(".")[0];
  if (o === "climate")
    return Dg[n ?? ""] ?? (i ? "mdi:thermostat" : "mdi:power");
  if (o === "weather") return Ng[n ?? ""] ?? "mdi:weather-cloudy";
  if (o === "media_player" && n) {
    const s = Rg[n];
    if (s) return s;
  }
  const r = Fg[o];
  if (r) return i ? r.on : r.off;
  if (e) {
    if (o === "binary_sensor") {
      const s = Hg[e];
      return s ? i ? s.on : s.off : void 0;
    }
    if (o === "sensor") return jg[e];
    if (o === "cover") {
      const s = Wg[e];
      return s ? i ? s.on : s.off : void 0;
    }
  }
}
function Rr(t, e) {
  if (e)
    return t.attribute ? e.attributes?.[t.attribute] : e.state;
}
function cn(t, e, i) {
  const n = xi(jl(t.stateColor, Rr(t, e))?.icon);
  if (n) return n;
  const o = xi(t.icon);
  if (o) return o;
  if (!t.entity) return Gs(t.kind);
  if (i) return i;
  const r = e?.attributes?.icon;
  return r || (lc(
    t.entity,
    e?.attributes?.device_class,
    se(t.entity, e?.state),
    e?.state
  ) ?? Gs(t.kind));
}
function cc(t) {
  const e = Math.round(t);
  let i = Math.round(e * 0.62);
  return i % 2 !== e % 2 && (i += 1), Math.max(2, i);
}
function Li(t) {
  return t.badgeContent === "icon" || t.badgeContent === "value" || t.badgeContent === "none" ? t.badgeContent : t.showIcon === !1 ? "none" : "icon";
}
function dn(t) {
  const e = t.pressEffect;
  return e === "scale" || e === "ripple" || e === "flash" || e === "none" ? e : rl;
}
function Kg(t, e, i, n) {
  const o = e.findIndex((a) => a.id === i);
  if (o < 0) return;
  const r = t.goToFloor;
  let s;
  if (r && typeof r == "object")
    s = e.find((a) => a.id === r.floor);
  else
    switch (r) {
      case "up":
        s = e[o + 1];
        break;
      case "down":
        s = e[o - 1];
        break;
      case "top":
        s = e[e.length - 1];
        break;
      case "bottom":
        s = e[0];
        break;
      case "main":
        s = e.find((a) => a.id === n) ?? e[0];
        break;
    }
  return s && s.id !== i ? s.id : void 0;
}
function dc(t) {
  const e = t.offlineStyle;
  return e === "dim" || e === "strike" || e === "none" ? e : sl;
}
function Yo(t, e) {
  return t.entity ? e === void 0 || oi(e) : !1;
}
const Xg = {
  climate: { attribute: "current_temperature", unit: "°" },
  water_heater: { attribute: "current_temperature", unit: "°" },
  humidifier: { attribute: "current_humidity", unit: "%" }
}, Zg = {
  light: {
    brightness: (t) => `${Math.round(t / 255 * 100)}%`
  }
};
function Ks(t, e, i) {
  return Zg[t.split(".")[0]]?.[e]?.(i);
}
function pi(t) {
  if (t == null || typeof t == "boolean" || typeof t == "string" && t.trim() === "") return;
  const e = typeof t == "number" ? t : Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function Qg(t) {
  if (typeof t != "string") return "";
  const e = t.trim();
  return e === "°C" || e === "°F" || e === "K" ? "°" : e === "ppm" || e === "ppb" ? "" : e.length <= 3 ? e : "";
}
function hn(t) {
  return Math.abs(t) < 10 && !Number.isInteger(t) ? t.toFixed(1) : String(Math.round(t));
}
function Jg(t, e) {
  return e === "W" && Math.abs(t) >= 1e3 ? { n: t / 1e3, unit: "kW" } : { n: t, unit: e };
}
function Xs(t, e) {
  const i = Jg(t, Qg(e));
  return hn(i.n) + i.unit;
}
function hc(t, e) {
  return uc(t, e)?.text;
}
function pc(t) {
  return t === "primary" ? "primary" : t === "secondary" ? 0 : typeof t == "number" && Number.isInteger(t) && t >= 0 ? t : void 0;
}
function uc(t, e) {
  if (!t || !e.entity) return;
  const i = ye(e), n = () => {
    const a = t.states[e.entity], l = a?.attributes, c = e.entity, d = Xg[c.split(".")[0]];
    if (e.attribute) {
      const p = pi(l?.[e.attribute]);
      if (p !== void 0) {
        const f = Ks(c, e.attribute, p);
        return f !== void 0 ? f : hn(p) + (e.attribute === d?.attribute ? d.unit : "");
      }
    }
    if (d) {
      const p = pi(l?.[d.attribute]);
      if (p !== void 0) return hn(p) + d.unit;
    }
    const h = pi(a?.state);
    return h === void 0 ? void 0 : Xs(h, l?.unit_of_measurement);
  }, o = (a) => {
    const l = i[a];
    if (!l) return;
    const c = l.entity || (l.attribute ? e.entity : void 0);
    if (!c) return;
    const d = t.states[c], h = d?.attributes;
    if (l.attribute) {
      const f = pi(h?.[l.attribute]);
      return f === void 0 ? void 0 : Ks(c, l.attribute, f) ?? hn(f);
    }
    const p = pi(d?.state);
    return p === void 0 ? void 0 : Xs(p, h?.unit_of_measurement);
  }, r = pc(e.badgeEntity);
  if (r === "primary") {
    const a = n();
    return a === void 0 ? void 0 : { text: a, source: "primary" };
  }
  if (typeof r == "number") {
    const a = o(r);
    return a === void 0 ? void 0 : { text: a, source: r };
  }
  const s = n();
  if (s !== void 0) return { text: s, source: "primary" };
  for (let a = 0; a < i.length; a++) {
    const l = o(a);
    if (l !== void 0) return { text: l, source: a };
  }
}
const tb = { ".": 0.28, "-": 0.38, "°": 0.45, "%": 1, k: 0.58 }, eb = 0.7, ib = 0.85;
function Zs(t) {
  let e = 0;
  for (const i of t)
    e += tb[i] ?? (i >= "0" && i <= "9" ? eb : ib);
  return e;
}
function fc(t, e) {
  const i = Math.round(W(t, ne)), n = Math.max(0, i - 6), o = Zs(e) > 0 ? n / Zs(e) : i;
  let r = Math.round(Math.min(i * 0.46, o));
  return r % 2 !== i % 2 && (r -= 1), Math.max(6, r);
}
function Qs(t) {
  const e = t.split(".")[0];
  switch (e) {
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
      return e;
    default:
      return "generic";
  }
}
const nb = 0.62;
function qt(t) {
  if (!gt(t)) return 0;
  const e = Math.abs(t.length) * nb, i = t.width;
  return typeof i != "number" || !Number.isFinite(i) || i <= 0 ? Math.max(1, e) : Math.max(1, i);
}
function vt(t) {
  return gt(t) ? "awning" : t.motion ?? "swing";
}
function po(t) {
  if (vt(t) !== "swing" || oe(t) !== "single") return 1;
  const e = t.sashSpan;
  return typeof e != "number" || !Number.isFinite(e) ? 1 : Math.max(Nl, Math.min(1, e));
}
function uo(t) {
  if (Ut(t)) return !0;
  const e = t.type === "door" && vt(t) === "swing";
  return t.invert ? !e : e;
}
function ob(t) {
  return { sx: t.flipH ? -1 : 1, sy: t.flipV ? -1 : 1 };
}
function Hi(t) {
  return vt(t) === "slide" ? t.sliderStyle ?? "single" : "single";
}
function mc(t) {
  return t === "biparting" || t === "biparting-bypass" || t === "converging";
}
function _i(t) {
  return Ut(t) ? !1 : vt(t) === "swing" ? oe(t) === "double" : mc(Hi(t));
}
function yc(t) {
  return { ...t, entity: t.secondaryEntity };
}
function Go(t) {
  return t === "window" ? "double" : "single";
}
function oe(t) {
  return vt(t) === "swing" ? t.sash ?? Go(t.type) : Go(t.type);
}
function Se(t) {
  return t.shutterStyle === "roll" || t.shutterStyle === "swing" ? t.shutterStyle : t.shutterEntity?.split(".")[0] === "binary_sensor" ? "swing" : "roll";
}
function Wt(t, e = !1) {
  if (!t || oi(t.state)) return 0;
  const i = t.attributes?.current_position;
  if (typeof i == "number" && Number.isFinite(i)) {
    const o = Math.max(0, Math.min(1, i / 100));
    return e ? 1 - o : o;
  }
  const n = t.state === "open" || t.state === "opening" || t.state === "closing" || t.state === "on";
  return (e ? !n : n) ? 1 : 0;
}
function pn(t, e = !1) {
  return !t || oi(t.state) ? !1 : Wt(t, e) > 0 || t.state === "opening" || t.state === "closing";
}
const rb = /* @__PURE__ */ new Set(["window", "blind", "shade", "shutter", "curtain", "awning"]), sb = /* @__PURE__ */ new Set(["blind", "shade", "curtain"]), ab = /* @__PURE__ */ new Set(["garage", "garage_door", "shutter"]);
function lb(t) {
  const e = t ?? "";
  return {
    type: rb.has(e) ? "window" : "door",
    motion: ab.has(e) ? "roll" : sb.has(e) ? "slide" : void 0
  };
}
function cb(t, e) {
  return e ? gt(t) ? {} : Ut(t) ? {} : lb(e) : {};
}
const db = 3;
function hb(t, e) {
  return t.split(".")[0] === "cover" && e & db ? "cover-toggle" : "more-info";
}
function Dr(t, e, i) {
  const n = t.entity || void 0, o = t.shutterEntity || void 0, r = !!(n && o && t.tapTarget === "shutter"), s = r ? o : n ?? o, a = n && o ? r ? n : o : void 0, l = e === "tap" ? t.tap_action : e === "hold" ? t.hold_action : t.double_tap_action;
  if (l) return { entity: l.entity ?? s, config: l };
  if (e === "tap")
    return s ? {
      entity: s,
      config: {
        action: (
          // Pointing the tap at the shutter opens its dialog; it does not
          // drive the motor. Choosing *which* entity answers is not the same
          // as choosing to move hardware on a tap, and that second decision
          // stays where it is explicit — `tap_action: toggle` (issue #47).
          !r && hb(s, i(s)) === "cover-toggle" ? "toggle" : "more-info"
        )
      }
    } : void 0;
  if (e === "hold" && a) return { entity: a, config: { action: "more-info" } };
}
function je(t, e) {
  const i = e === "tap" ? t.tap_action : e === "hold" ? t.hold_action : t.double_tap_action;
  if (i)
    return { entity: i.entity ?? t.entity, config: i };
}
function $i(t, e) {
  const i = e === "tap" ? t.tap_action : e === "hold" ? t.hold_action : t.double_tap_action;
  if (i)
    return { entity: i.entity ?? t.entity, config: i };
}
function pb(t, e, i = It) {
  const n = ["tap", "hold", "double_tap"].map((r) => $i(t, r)).map((r) => r ? kl({ entity: r.entity }, r.config) : void 0).find((r) => r) ?? t.entity;
  return (n ? e?.states[n]?.attributes?.friendly_name : void 0) || n || Rt(i, t.type)?.name || ub(t.type) || "Furniture";
}
function ub(t) {
  return String(t ?? "").replace(/[-_]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().trim();
}
function Js(t) {
  return ["tap", "hold", "double_tap"].some(
    (e) => Pt(je(t, e)?.config)
  );
}
function ta(t, e) {
  return ["tap", "hold", "double_tap"].some(
    (i) => Pt(Dr(t, i, e)?.config)
  );
}
function oi(t) {
  return t === "unavailable" || t === "unknown";
}
function fb(t, e) {
  if (!t.entity || e === void 0) return uo(t);
  if (mb(t.entity, e)) return !1;
  const i = yb(t.entity, e);
  return t.invert ? !i : i;
}
function mb(t, e) {
  return oi(e) ? !0 : t.split(".")[0] === "lock" && e === "jammed";
}
function yb(t, e) {
  return t.split(".")[0] === "lock" ? se(t, e) : e === "on" || e === "open" || e === "opening" || e === "closing";
}
function gb(t) {
  return t === "opening" || t === "closing";
}
function Ge(t, e) {
  if (!t.entity || !e) return uo(t) ? 1 : 0;
  if (oi(e.state)) return 0;
  const i = e.attributes?.current_position;
  if (typeof i == "number" && Number.isFinite(i)) {
    const n = Math.max(0, Math.min(1, i / 100));
    return t.invert ? 1 - n : n;
  }
  return fb(t, e.state) ? 1 : 0;
}
function Ko(t, e) {
  return !t.entity || !e || oi(e.state) ? !1 : gb(e.state) || Ge(t, e) > 0;
}
function ea(t, e, i) {
  const n = t / 2, o = 5, r = Math.max(3, Math.round(t / 12)), s = [];
  for (let a = 1; a < r; a++) {
    const l = -n + t * a / r;
    s.push(
      $`<line x1=${l} y1=${-o / 2} x2=${l} y2=${o / 2}
            stroke=${Ni} stroke-width="0.75" />`
    );
  }
  return $`<g class="fp-roll-curtain" style="transform:scaleY(${1 - i});">
      <rect x=${-n} y=${-o / 2} width=${t} height=${o}
            style="fill:${e};" />
      ${s}
    </g>`;
}
function bb(t, e, i, n) {
  const o = t / 2, r = e / 2, s = e * (1 - Math.max(0, Math.min(1, n)));
  if (s <= 0.5) return $``;
  const a = Math.max(2, Math.round(s / 7)), l = [];
  for (let c = 1; c < a; c++) {
    const d = -r + s * c / a;
    l.push(
      $`<line x1=${-o} y1=${d} x2=${o} y2=${d}
            stroke=${Ni} stroke-width="0.75" />`
    );
  }
  return $`<g class="fp-skylight-blind">
      <rect x=${-o} y=${-r} width=${t} height=${s}
            style="fill:${i};" opacity="0.85" />
      ${l}
    </g>`;
}
function vb(t, e, i, n, o = 1, r = i, s = n) {
  const a = t / 2, l = 3, c = o * (e / 2 + l / 2), d = (h, p) => {
    const f = [], u = Math.max(2, Math.round(p / 14));
    for (let m = 1; m < u; m++) {
      const b = h + p * m / u;
      f.push(
        $`<line x1=${b} y1=${-l / 2} x2=${b} y2=${l / 2}
              stroke=${Ni} stroke-width="0.75" />`
      );
    }
    return f;
  };
  return $`
      <g transform="translate(${-a} ${c})">
        <g class="fp-door-leaf" style="transform:rotate(${o * 90 * n}deg);">
          <rect x="0" y=${-l / 2} width=${a} height=${l} style="fill:${i};" />
          ${d(0, a)}
        </g>
      </g>
      <g transform="translate(${a} ${c})">
        <g class="fp-leaf-r" style="transform:rotate(${-o * 90 * s}deg);">
          <rect x=${-a} y=${-l / 2} width=${a} height=${l} style="fill:${r};" />
          ${d(-a, a)}
        </g>
      </g>`;
}
const ia = 22, On = 14, Ln = 22, Fn = 15;
function Nr(t, e = 0) {
  const i = t.flipV ? -1 : 1, n = t.angle * Math.PI / 180, o = { x: -Math.sin(n) * i, y: Math.cos(n) * i };
  if (e === 90) return { x: -o.y, y: o.x };
  if (e === 180) return { x: -o.x, y: -o.y };
  if (e === 270) return { x: o.y, y: -o.x };
  const { cos: r, sin: s } = no(e);
  return { x: o.x * r - o.y * s, y: o.x * s + o.y * r };
}
function Hr(t, e = gc(t)) {
  const i = (t.flipV ? -1 : 1) * e, n = t.angle * Math.PI / 180;
  return { x: t.x - Math.sin(n) * i, y: t.y + Math.cos(n) * i };
}
function Xo(t) {
  return {
    width: Math.abs(t.length),
    height: gt(t) ? qt(t) : nt + 4
  };
}
function gc(t) {
  return gt(t) ? ia + qt(t) / 2 : ia;
}
function un(t) {
  return !!t.entity;
}
function bc(t) {
  return !!t.shutterEntity && (t.showShutterIcon ?? un(t));
}
const xb = { on: "mdi:window-shutter-open", off: "mdi:window-shutter" }, na = {
  door: { on: "mdi:door-open", off: "mdi:door-closed" },
  window: { on: "mdi:window-open", off: "mdi:window-closed" },
  skylight: { on: "mdi:window-open-variant", off: "mdi:window-closed-variant" },
  // One glyph for both: a passage is never shut, so there is no pair to pick
  // from — the badge's colour still says what its entity is doing.
  passage: { on: "mdi:arrow-expand-horizontal", off: "mdi:arrow-expand-horizontal" }
};
function vc(t, e, i, n, o, r) {
  const s = xi(e);
  if (s) return s;
  const a = xi(r);
  if (a) return a;
  const l = xi(i?.attributes?.icon);
  return l || (lc(t, i?.attributes?.device_class, n) ?? (n ? o.on : o.off));
}
function xc(t, e, i, n) {
  return vc(
    t.shutterEntity ?? "",
    t.shutterIcon,
    e,
    i,
    xb,
    n
  );
}
function wc(t) {
  return !!t.entity && (t.showIcon ?? !1);
}
function _c(t, e, i, n) {
  return vc(
    t.entity ?? "",
    t.icon,
    e,
    i,
    na[t.type] ?? na.door,
    n
  );
}
function $c(t) {
  return Hr(t, -gc(t));
}
function kc(t, e = 0) {
  const i = Nr(t, e);
  return { x: -i.x, y: -i.y };
}
function jr(t, e) {
  const { color: i, open: n = !0, active: o = !1, accent: r = pt } = e, s = t.length / 2, a = nt + 4, l = J(e.inactive) ?? i, c = Math.max(0, Math.min(1, e.amount ?? (n ? 1 : 0))), d = e.second ? Math.max(0, Math.min(1, e.second.amount)) : c, h = (g, w) => ut(g ? r : w === 0 ? l : i, pt), p = h(o, c), f = e.second ? h(!!e.second.active, d) : p;
  let u;
  if (gt(t)) {
    const g = s, w = qt(t) / 2, A = Math.max(1.5, Math.min(4, Math.min(g, w) * 0.18)), M = Math.max(0.5, g - A), k = Math.max(0.5, w - A), z = k * 2 * (1 - c * 0.82);
    u = $`
        <!-- the kerb -->
        <rect x=${-g} y=${-w} width=${g * 2} height=${w * 2}
              fill="none" stroke=${i} stroke-width="2" />
        <!-- "above you": the plan convention for anything overhead -->
        <line x1=${-M} y1=${-k} x2=${M} y2=${k}
              stroke=${i} stroke-width="1" stroke-dasharray="4 4" opacity="0.55" />
        <line x1=${-M} y1=${k} x2=${M} y2=${-k}
              stroke=${i} stroke-width="1" stroke-dasharray="4 4" opacity="0.55" />
        <!-- the sash, foreshortening toward its hinge as it swings out -->
        <rect x=${-M} y=${-k} width=${M * 2} height=${z}
              fill="none" stroke=${p} stroke-width="1.5"
              stroke-dasharray=${c > 0.02 ? "5 4" : y} />
        <!-- the head it is hung from -->
        <line x1=${-M} y1=${-w} x2=${M} y2=${-w}
              stroke=${p} stroke-width="2.5" />`;
  } else if (Ut(t))
    u = $``;
  else if (vt(t) === "swing") {
    const g = oe(t) === "double", w = po(t), A = g ? s : t.length * w, M = Math.PI / 2 * A, k = (D, R, E) => $`<path class="fp-door-arc" d=${D}
              fill="none" stroke-width="1.5" stroke-dasharray=${M}
              style="stroke:${R};stroke-dashoffset:${M * (1 - E)};" />`, z = t.type === "window" ? $`
        <line x1=${-s} y1=${-a / 2} x2=${-s} y2=${a / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${s} y1=${-a / 2} x2=${s} y2=${a / 2}
              stroke=${i} stroke-width="2" />` : y;
    u = $`
        ${z}
        ${g ? (
      // Two leaves hinged at opposite jambs, meeting in the middle when
      // shut and each tracing its own quarter circle outward.
      $`${k(`M 0 0 A ${s} ${s} 0 0 0 ${-s} ${-s}`, p, c)}${k(
        `M 0 0 A ${s} ${s} 0 0 1 ${s} ${-s}`,
        f,
        d
      )}`
    ) : (
      // Hinged at the −x jamb, so the tip starts `leafW` along the wall
      // and ends `leafW` out from it. At full span that is exactly the
      // arc this drew before `sashSpan` existed.
      k(`M ${-s + A} 0 A ${A} ${A} 0 0 0 ${-s} ${-A}`, p, c)
    )}
        ${// The pane the sash does not cover: fixed glass, drawn in the base
    // colour because it never opens and so is never the active part.
    // Nothing at full span, which is every opening that predates this.
    w < 1 ? $`<line x1=${-s + A} y1="0" x2=${s} y2="0"
              stroke=${i} stroke-width=${t.type === "window" ? 1.5 : 2.5} />` : y}
        <!-- leaf hinged at the left jamb (flipH mirrors it to the right one) -->
        <g transform="translate(${-s} 0)">
          <g class="fp-door-leaf" style="transform:rotate(${-90 * c}deg);">
            <rect x="0" y="-1.25" width=${A} height="2.5" style="fill:${p};" />
          </g>
        </g>
        ${g ? (
      // The other leaf, on its own sensor when it has one (issue #159):
      // a casement pair with a contact per sash draws left-open /
      // right-shut, exactly as a two-sensor slider parts unevenly.
      $`<g transform="translate(${s} 0)">
          <g class="fp-leaf-r" style="transform:rotate(${90 * d}deg);">
            <rect x=${-s} y="-1.25" width=${s} height="2.5" style="fill:${f};" />
          </g>
        </g>`
    ) : y}
      `;
  } else if (vt(t) === "fixed") {
    const g = t.type === "window" ? 1.5 : 2.5;
    u = $`
        ${t.type === "window" ? $`
        <line x1=${-s} y1=${-a / 2} x2=${-s} y2=${a / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${s} y1=${-a / 2} x2=${s} y2=${a / 2}
              stroke=${i} stroke-width="2" />` : y}
        <line x1=${-s} y1="0" x2=${s} y2="0"
              stroke=${i} stroke-width=${g} />`;
  } else if (vt(t) === "awning") {
    const g = Math.min(12, t.length * 0.16), w = 5, A = s - g / 2 - 1, M = Math.max(0, A - g / 2), k = Math.min(s * 0.62, 34) * c, z = Math.min(k * 0.16, M * 0.4), D = c > 0.02;
    u = $`
        <!-- jambs, as any window -->
        <line x1=${-s} y1=${-a / 2} x2=${-s} y2=${a / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${s} y1=${-a / 2} x2=${s} y2=${a / 2}
              stroke=${i} stroke-width="2" />
        <!-- The glass line: solid while the sash is shut and sitting in it,
             broken once the sash has swung out and left the gap behind. -->
        <line x1=${-s} y1="0" x2=${s} y2="0"
              stroke=${p} stroke-width="1.5"
              stroke-dasharray=${D ? "6 4" : y} />
        ${D ? (
      // A polyline, not a polygon, and that is the whole point of the
      // broken line above it. A closed shape strokes its own base back
      // along y=0 — straight over the dashes, solid — and the only
      // glass left uncovered would be the sliver outside `bx`, which
      // is exactly where the knuckles sit. The line would have been
      // dashed in the markup and solid on the screen at every size.
      $`<polyline
                    points="${-M},0 ${-M + z},${-k} ${M - z},${-k} ${M},0"
                    fill="none" stroke=${p} stroke-width="1.5"
                    stroke-linejoin="round" />`
    ) : y}
        <!-- Hinge knuckles, drawn whether or not it is open: they are what says
             this window is top-hung rather than fixed when it happens to be
             shut, and the request asked for them by name. -->
        ${[-A, A].map(
      (R) => $`
          <rect x=${R - g / 2} y=${-w / 2} width=${g} height=${w}
                fill="none" stroke=${p} stroke-width="1.25" />
          <line x1=${R} y1=${-w / 2} x2=${R} y2=${w / 2}
                stroke=${p} stroke-width="1.25" />`
    )}`;
  } else if (vt(t) === "roll")
    u = $`
        <!-- jambs -->
        <line x1=${-s} y1=${-a / 2} x2=${-s} y2=${a / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${s} y1=${-a / 2} x2=${s} y2=${a / 2}
              stroke=${i} stroke-width="2" />
        <!-- Track: stays when the curtain is up so the gap still reads as an
             opening — and wears the accent while the cover is open or moving
             (issue #154). Wide open the curtain has scaled away to nothing, so
             this line is the *only* mark left: drawn in the base colour it read
             exactly like a shut garage, which is the one thing it must not do.
             Full strength when accented, since a 0.6 tint of the accent reads
             as neither colour. -->
        <line x1=${-s} y1="0" x2=${s} y2="0"
              stroke=${p} stroke-width="0.75" opacity=${o ? 1 : 0.6} />
        ${ea(t.length, p, c)}`;
  else {
    const g = t.type === "window" ? 1.5 : 2.5, w = $`
        <line x1=${-s} y1=${-a / 2} x2=${-s} y2=${a / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${s} y1=${-a / 2} x2=${s} y2=${a / 2}
              stroke=${i} stroke-width="2" />`, A = Hi(t);
    if (A === "bypass") {
      const k = -s * c;
      u = $`
        ${w}
        <!-- tracks -->
        <line x1=${-s} y1=${-1.75} x2=${s} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-s} y1=${1.75} x2=${s} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- fixed panel: left half, front track -->
        <rect x=${-s} y=${1.75 - g / 2} width=${s} height=${g} style="fill:${p};" />
        <!-- moving panel: right half, back track -->
        <g class="fp-slide-panel" style="transform:translateX(${k}px);">
          <rect x="0" y=${-1.75 - g / 2} width=${s} height=${g} style="fill:${p};" />
        </g>`;
    } else if (A === "biparting")
      u = $`
        ${w}
        <!-- track -->
        <line x1=${-s} y1="0" x2=${s} y2="0"
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <g class="fp-slide-panel" style="transform:translateX(${-s * c}px);">
          <rect x=${-s} y=${-g / 2} width=${s} height=${g} style="fill:${p};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${s * d}px);">
          <rect x="0" y=${-g / 2} width=${s} height=${g} style="fill:${f};" />
        </g>`;
    else if (A === "biparting-bypass") {
      const k = s / 2;
      u = $`
        ${w}
        <!-- tracks -->
        <line x1=${-s} y1=${-1.75} x2=${s} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-s} y1=${1.75} x2=${s} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- fixed panels: outer quarters, front track. Never accented, even
             wide open — the accent marks what has moved, and lighting these
             would accent exactly the half that is still glazed shut. -->
        <rect x=${-s} y=${1.75 - g / 2} width=${k} height=${g} fill=${i} />
        <rect x=${s - k} y=${1.75 - g / 2} width=${k} height=${g} fill=${i} />
        <!-- moving panels: inner quarters, back track -->
        <g class="fp-slide-panel" style="transform:translateX(${-k * c}px);">
          <rect x=${-k} y=${-1.75 - g / 2} width=${k} height=${g} style="fill:${p};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${k * d}px);">
          <rect x="0" y=${-1.75 - g / 2} width=${k} height=${g} style="fill:${f};" />
        </g>`;
    } else if (A === "converging") {
      const k = s / 2;
      u = $`
        ${w}
        <!-- tracks -->
        <line x1=${-s} y1=${-1.75} x2=${s} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-s} y1=${1.75} x2=${s} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- both panels move, so both take the accent on their own state:
             front track travels right, back track left, and they meet. -->
        <g class="fp-slide-panel" style="transform:translateX(${k * c}px);">
          <rect x=${-s} y=${1.75 - g / 2} width=${s} height=${g} style="fill:${p};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${-k * d}px);">
          <rect x="0" y=${-1.75 - g / 2} width=${s} height=${g} style="fill:${f};" />
        </g>`;
    } else {
      const M = t.length * c;
      u = $`
        ${w}
        <!-- track -->
        <line x1=${-s} y1="0" x2=${s} y2="0"
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <g class="fp-slide-panel" style="transform:translateX(${M}px);">
          <rect x=${-s} y=${-g / 2} width=${t.length} height=${g} style="fill:${p};" />
        </g>`;
    }
  }
  if (e.shutter) {
    const g = Math.max(0, Math.min(1, e.shutter.amount)), w = (D, R) => ut(D ? e.shutter.accent ?? r : R === 0 ? l : i, pt), A = w(e.shutter.active, g), M = e.shutter.second, k = M ? Math.max(0, Math.min(1, M.amount)) : g, z = M ? w(M.active, k) : A;
    u = $`${u}${// A roof light's blind is neither of the wall shapes: it is neither a
    // band on the wall line nor a pair of panels beside the jambs, but a
    // sheet drawn across the aperture you are looking down into. It also
    // ignores `shutterStyle` — there is only the one way a velux blind
    // travels, and offering a hinged one would be offering a shutter that
    // folds back against a roof.
    gt(t) ? bb(t.length, qt(t), A, g) : e.shutter.style === "swing" ? vb(
      t.length,
      a,
      A,
      g,
      e.shutter.flip ? -1 : 1,
      z,
      k
    ) : $`${// Up or moving, the track wears the shutter's accent (issue #375),
    // as a roll-up door's does (#154): fully raised the curtain has
    // scaled away, and without this line the colour only ever showed
    // part-way down. Shut, the band covers the line, so none is drawn.
    e.shutter.active ? $`<line x1=${-s} y1="0" x2=${s} y2="0"
                    stroke=${A} stroke-width="0.75" />` : y}${ea(t.length, A, g)}`}`;
  }
  const { sx: m, sy: b } = ob(t);
  return $`<g class=${`fp-opening fp-opening-${wt(t.type) ?? "unknown"}`}
                data-id=${wt(t.id) ?? y}
                data-entity=${me(t.entity) ?? y}
                transform="translate(${t.x} ${t.y}) rotate(${t.angle})">
      <g transform="scale(${m} ${b})">${u}</g>
    </g>`;
}
function Ke(t) {
  if (typeof t != "number" || !Number.isFinite(t)) return 0;
  const e = (t % 360 + 360) % 360;
  return e === 90 || e === 180 || e === 270 ? e : 0;
}
function oa(t, e) {
  const i = Ke(t.rotation);
  if (e === void 0) return i;
  const n = e ? t.rotationPortrait : t.rotationLandscape;
  return n == null ? i : Ke(n);
}
function Sc(t, e) {
  return t === 0 ? 0 : t + e;
}
function wb(t, e) {
  const i = Sc(t, e);
  if (i === 0 || e % 360 === 0) return i;
  const n = ((i + 180) % 360 + 360) % 360 - 180;
  return n > 90 ? n - 180 : n < -90 ? n + 180 : n;
}
function ra(t, e) {
  return typeof t.addEventListener == "function" ? (t.addEventListener("change", e), () => t.removeEventListener?.("change", e)) : typeof t.addListener == "function" ? (t.addListener(e), () => t.removeListener?.(e)) : () => {
  };
}
function gi(t) {
  const e = t.floorSwitcher;
  if (!e || typeof e != "object") return;
  const i = sa(e.x), n = sa(e.y);
  return i === void 0 || n === void 0 ? void 0 : { x: i, y: n };
}
function sa(t) {
  if (typeof t == "number") return Number.isFinite(t) ? t : void 0;
  if (typeof t != "string" || t.trim() === "") return;
  const e = Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function ei(t, e, i) {
  const { cos: n, sin: o } = no(i);
  return { w: Math.abs(n) * t + Math.abs(o) * e, h: Math.abs(o) * t + Math.abs(n) * e };
}
function _b(t, e) {
  return ((W(t, 0) + e) % 360 + 360) % 360;
}
function Me(t, e, i, n, o) {
  switch (o) {
    case 90:
      return { x: n - e, y: t };
    case 180:
      return { x: i - t, y: n - e };
    case 270:
      return { x: e, y: i - t };
    case 0:
      return { x: t, y: e };
    default: {
      const { cos: r, sin: s } = no(o), a = ei(i, n, o);
      return {
        x: (t - i / 2) * r - (e - n / 2) * s + a.w / 2,
        y: (t - i / 2) * s + (e - n / 2) * r + a.h / 2
      };
    }
  }
}
function Mc(t, e, i) {
  switch (i) {
    case 90:
      return `translate(${e} 0) rotate(90)`;
    case 180:
      return `translate(${t} ${e}) rotate(180)`;
    case 270:
      return `translate(0 ${t}) rotate(-90)`;
    case 0:
      return "";
    default: {
      const n = ei(t, e, i);
      return `translate(${n.w / 2} ${n.h / 2}) rotate(${i}) translate(${-t / 2} ${-e / 2})`;
    }
  }
}
function $b(t, e = fr, i = Sn) {
  const n = Math.min(e, i), o = Math.max(e, i);
  if (!(typeof t == "number" || typeof t == "string" && t.trim() !== "")) return o;
  const s = typeof t == "number" ? t : Number(t);
  if (!Number.isFinite(s)) return o;
  const a = Oo - Ae, l = Math.max(0, Math.min(1, (s - Ae) / a)), c = l * l * (3 - 2 * l);
  return n + (o - n) * c;
}
const Zo = 135, aa = 12;
function ri(t) {
  if (!(typeof t == "number" || typeof t == "string" && t.trim() !== "")) return;
  const i = typeof t == "number" ? t : Number(t);
  return Number.isFinite(i) ? i : void 0;
}
function Ec(t) {
  const e = ri(t);
  if (e === void 0) return 1;
  if (e <= 0) return 0;
  if (e >= aa) return 1;
  const i = e / aa;
  return i * i * (3 - 2 * i);
}
function Ac(t, e = 0) {
  const i = (t + e) * Math.PI / 180;
  return { x: Math.sin(i), y: -Math.cos(i) };
}
function kb(t, e) {
  return ze(t) ? t.sunBearing : ri(e) ?? Zo;
}
function ze(t) {
  return typeof t.sunBearing == "number" && Number.isFinite(t.sunBearing);
}
function Sb(t, e) {
  return ze(t) ? 1 : Ec(e);
}
function Mb(t, e) {
  return ze(t) ? 1 : Wr(e, Tc);
}
const Tc = 0.25, Eb = 0.7;
function Qo(t, e) {
  if (typeof t != "string" || !t) return;
  const i = e?.states[t];
  if (!i) return;
  const n = ri(
    t.startsWith("weather.") ? i.attributes?.cloud_coverage : i.state
  );
  return n === void 0 ? void 0 : Math.max(0, Math.min(100, n)) / 100;
}
function Wr(t, e) {
  return t === void 0 ? 1 : 1 - (1 - e) * t;
}
const Ab = "var(--fp-skin-moonlight, #c4d6ff)", Tb = 0.6, Cb = 4 * 6e4;
function Jo(t) {
  return t.moonlight === !0 && t.sunlight === !0 && !ze(t);
}
function Ib(t) {
  const e = ri(t);
  if (e === void 0 || e >= 0) return 0;
  if (e <= Ae) return 1;
  const i = e / Ae;
  return i * i * (3 - 2 * i);
}
function zb(t, e, i, n, o) {
  const r = i?.latitude, s = i?.longitude;
  if (typeof r != "number" || !Number.isFinite(r) || typeof s != "number" || !Number.isFinite(s) || !Number.isFinite(e)) return;
  const a = Ib(n);
  if (!(a > 0)) return;
  const l = yg(e, r, s), c = Tb * Ec(l.altitude) * gg(e) * a * Wr(o, Tc);
  if (c > 0)
    return {
      dir: Ac(l.bearing + 180, t.north ?? 0),
      strength: c,
      altitude: l.altitude
    };
}
function Fi(t) {
  const e = typeof t.cloudCoverEntity == "string" ? t.cloudCoverEntity.trim() : "";
  if (e)
    return t.ambientDaylight || t.sunlight && !ze(t) ? e : void 0;
}
const Ri = 0.34, Pb = 30, Ob = 0.95, Cc = 0.16, la = 0.37, fn = "var(--fp-skin-sunlight, #ffd9a0)", Xe = "var(--fp-skin-sunshade, #000)";
function Ic(t) {
  return Math.max(0.02, Math.min(1.5, W(t, Ri)));
}
const Lb = 0.55, ca = 2.1, Fb = 1.5;
function Rb(t) {
  return Math.max(0, Math.min(4, W(t, Lb)));
}
function Br(t) {
  const e = t.ceilingHeight;
  return typeof e != "number" || !Number.isFinite(e) ? 1 : Math.max(0.1, Math.min(8, e));
}
function zc(t, e = 1) {
  const i = Math.max(0, Math.min(1, e));
  return { along: Math.abs(t.length) / 2, across: qt(t) * i / 2 };
}
function Pc(t, e, i, n = 1) {
  const o = i * Br(t), r = Math.max(0, Math.min(1, n)), s = qt(t) / 2 * (1 - r) * (t.flipV ? -1 : 1), a = t.angle * Math.PI / 180;
  return {
    x: t.x + e.x * o - Math.sin(a) * s,
    y: t.y + e.y * o + Math.cos(a) * s
  };
}
function da(t, e, i, n = 1, o = 1) {
  const r = Pc(t, e, i, n), { along: s, across: a } = zc(t, n), l = t.angle * Math.PI / 180, c = Math.cos(l) * s * o, d = Math.sin(l) * s * o, h = -Math.sin(l) * a * o, p = Math.cos(l) * a * o;
  return [
    { x: r.x - c - h, y: r.y - d - p },
    { x: r.x + c - h, y: r.y + d - p },
    { x: r.x + c + h, y: r.y + d + p },
    { x: r.x - c + h, y: r.y - d + p }
  ];
}
function Db(t, e, i, n) {
  let o = n;
  for (const r of i) {
    const s = Ir(t.x, t.y, e.x, e.y, r);
    s !== void 0 && s > 1 && s < o && (o = s);
  }
  return o;
}
function ha(t) {
  const e = ri(t);
  if (e === void 0) return 1;
  const i = (o) => o * Math.PI / 180, n = Math.tan(i(Pb)) / Math.tan(i(Math.max(1, Math.min(89, e))));
  return Math.max(0.45, Math.min(1.9, n));
}
function Nb(t, e, i) {
  return t.sunlight === !1 || i !== void 0 && i <= 0 ? 0 : gt(t) ? (Rn(t) ? 1 : Math.max(0, Math.min(1, e))) * (i === void 0 ? 1 : Math.max(0, Math.min(1, i))) : Rn(t) ? 1 : Math.max(0, Math.min(1, e));
}
function fo(t) {
  return Ut(t) ? !1 : t.glazed ?? t.type !== "door";
}
function Rn(t) {
  return fo(t) && vt(t) !== "roll";
}
function Oc(t) {
  const e = t.angle * Math.PI / 180, i = Math.cos(e) * t.length / 2, n = Math.sin(e) * t.length / 2;
  return [
    { x: t.x - i, y: t.y - n },
    { x: t.x + i, y: t.y + n }
  ];
}
function Hb(t) {
  return {
    id: t.id,
    type: "window",
    x: (t.x1 + t.x2) / 2,
    y: (t.y1 + t.y2) / 2,
    length: Math.hypot(t.x2 - t.x1, t.y2 - t.y1),
    angle: Math.atan2(t.y2 - t.y1, t.x2 - t.x1) * 180 / Math.PI
  };
}
function ct(t, e, i) {
  let n = !1;
  for (let o = 0, r = t.length - 1; o < t.length; r = o++) {
    const s = t[o], a = t[r];
    s.y > i != a.y > i && e < (a.x - s.x) * (i - s.y) / (a.y - s.y) + s.x && (n = !n);
  }
  return n;
}
function jb(t, e, i) {
  for (const n of e) {
    const o = Ir(t.x, t.y, -i.x, -i.y, n);
    if (o === void 0) continue;
    if (!(o <= zt && ao(t.x, t.y, n) <= zt)) return !1;
  }
  return !0;
}
function Wb(t, e) {
  return Ac(kb(t, e) + 180, t.north ?? 0);
}
function Lc(t, e, i, n) {
  return [
    t,
    e,
    { x: e.x + i.x * n, y: e.y + i.y * n },
    { x: t.x + i.x * n, y: t.y + i.y * n }
  ];
}
function Bb(t, e, i, n = 1) {
  const [o, r] = Oc(t), s = Math.max(0, Math.min(1, n)), a = (o.x + r.x) / 2, l = (o.y + r.y) / 2, c = (d) => ({ x: a + (d.x - a) * s, y: l + (d.y - l) * s });
  return Lc(c(o), c(r), e, i);
}
function tr(t, e, i) {
  return Lc({ x: t.x1, y: t.y1 }, { x: t.x2, y: t.y2 }, e, i);
}
function We(t) {
  return t.map((e) => `${e.x},${e.y}`).join(" ");
}
function pa(t, e, i, n, o, r) {
  const { dir: s, openAmount: a, shutterOpen: l, strength: c = 1, railings: d = [] } = r, h = typeof r.direct == "number" && Number.isFinite(r.direct) ? Math.max(0, Math.min(1, r.direct)) : 1, p = {
    light: r.light ?? fn,
    // `?? ` would swallow the explicit null that means "no shade at all".
    shade: r.shade === void 0 ? Xe : r.shade
  };
  if (c <= 0) return y;
  const f = Math.min(i, n) * Ic(r.reach), u = (T) => Nb(T, a(T), l(T)), m = lo(t, e, u), b = m.map((T) => tr(T, s, f)), g = f * Rb(r.drop), w = (T) => {
    const q = g * Br(T) + Math.hypot(T.length, qt(T)) / 2, it = Math.max(q, f), ot = [];
    for (const G of m) {
      const F = (G.x1 - T.x) * s.x + (G.y1 - T.y) * s.y, B = (G.x2 - T.x) * s.x + (G.y2 - T.y) * s.y;
      if (Math.max(F, B) <= 0) continue;
      let X = G;
      if (Math.min(F, B) < 0) {
        const lt = F / (F - B), dt = G.x1 + (G.x2 - G.x1) * lt, _t = G.y1 + (G.y2 - G.y1) * lt;
        X = F > 0 ? { ...G, x2: dt, y2: _t } : { ...G, x1: dt, y1: _t };
      }
      ot.push(We(tr(X, s, it)));
    }
    return ot;
  }, A = d.length ? [...t, ...d] : t, M = (T, q, it) => {
    if (!jb(T, A, s)) return;
    const ot = Db(T, s, m, f), [G, F] = Oc(T), B = F.x - G.x, X = F.y - G.y, dt = Math.abs(B * s.y - X * s.x) * it / 2;
    return {
      ...q,
      sky: !1,
      // The outline runs past the falloff, so the ellipse is what bounds the
      // patch and never the polygon's flat far edge.
      points: We(Bb(T, s, ot + T.length, it)),
      cx: T.x,
      cy: T.y,
      along: ot,
      across: Math.max(1, dt * Ob),
      angle: Math.atan2(s.y, s.x) * 180 / Math.PI,
      // A beam has no edge to soften — it fades along its own length — so it
      // has no second polygon, and no shadow set of its own either: the wall
      // openings all share the one global shadow mask.
      haloPoints: "",
      halo: void 0,
      haloLightId: "",
      haloShadeId: "",
      shadows: []
    };
  }, k = e.map((T, q) => {
    const it = {
      lightId: `${o}-b${q}`,
      shadeId: `${o}-s${q}`,
      fadeId: `${o}-f${q}`,
      shadowMaskId: `${o}-k${q}`,
      clipId: `${o}-c${q}`
    }, ot = u(T);
    if (ot > 0) {
      if (gt(T)) {
        const G = Pc(T, s, g, ot), F = zc(T, ot), B = (X) => ({
          cx: G.x,
          cy: G.y,
          angle: T.angle,
          along: Math.max(1, F.along * X),
          across: Math.max(1, F.across * X)
        });
        return {
          ...it,
          sky: !0,
          // Its own rectangle, moved — not a sweep. See skylightPatchPolygon.
          // Twice: the patch at its true size, and the halo spilling past it,
          // which is what keeps the edge from being a hard cut. See
          // SKYLIGHT_CORE for why one gradient cannot do both jobs.
          points: We(da(T, s, g, ot)),
          haloPoints: We(da(T, s, g, ot, ca)),
          // The core's own ellipse rides on the record itself, so the shared
          // gradient helper reads a skylight exactly as it reads a beam.
          ...B(Fb),
          halo: B(ca),
          haloLightId: `${o}-h${q}`,
          haloShadeId: `${o}-hs${q}`,
          shadows: w(T)
        };
      }
      if (!d.some((G) => ao(T.x, T.y, G) <= zt))
        return M(T, it, ot);
    }
  }), z = d.map(
    (T, q) => M(Hb(T), {
      lightId: `${o}-rb${q}`,
      shadeId: `${o}-rs${q}`,
      fadeId: `${o}-rf${q}`,
      shadowMaskId: `${o}-rk${q}`,
      clipId: `${o}-rc${q}`
    }, 1)
  );
  if (k.push(...z), !k.some((T) => T !== void 0)) return y;
  const D = b.map(We), R = nt, E = `${o}-shade`, C = `${o}-shadow`, I = -R, S = -R, _ = i + R * 2, P = n + R * 2, L = (T, q = y) => $`<rect x=${I} y=${S} width=${_} height=${P} fill=${T}>${q}</rect>`, N = (T, q) => $`<polygon points=${T} fill=${q} stroke=${q} stroke-width=${nt} />`, U = (T, q, it, ot = "beam", G = 1) => $`<radialGradient id=${q} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
              gradientTransform=${`translate(${T.cx} ${T.cy}) rotate(${T.angle}) scale(${T.along} ${T.across})`}>
          ${ot === "core" ? (
    // Even, corner to corner: the ellipse circumscribes the
    // rectangle, so what ends this patch is the rectangle's own
    // outline. See SKYLIGHT_CORE.
    $`<stop offset="0" stop-color=${it} stop-opacity=${G} />
          <stop offset="0.66" stop-color=${it} stop-opacity=${0.92 * G} />
          <stop offset="1" stop-color=${it} stop-opacity=${0.62 * G} />`
  ) : ot === "halo" ? (
    // …and the spill past it, which is what keeps that outline
    // from reading as a cut. Never full strength: it is the
    // light around the patch, not the patch.
    $`<stop offset="0" stop-color=${it} stop-opacity=${0.5 * G} />
          <stop offset="0.48" stop-color=${it} stop-opacity=${0.38 * G} />
          <stop offset="1" stop-color=${it} stop-opacity="0" />`
  ) : $`<stop offset="0" stop-color=${it} stop-opacity=${G} />
          <stop offset="0.45" stop-color=${it} stop-opacity=${0.55 * G} />
          <stop offset="1" stop-color=${it} stop-opacity="0" />`}
        </radialGradient>`, H = p.shade === null ? y : $`
      <!-- Where the shade shows: everywhere, minus the patches of light, plus
           back wherever a wall stands in one. The order is the whole logic. -->
      <mask id=${E} maskUnits="userSpaceOnUse" x=${I} y=${S} width=${_} height=${P}>
        ${L("#fff")}
        ${k.map(
    (T) => T ? U(T, T.shadeId, "#000", T.sky ? "core" : "beam", h) : y
  )}
        ${k.map(
    (T) => T && T.halo ? U(T.halo, T.haloShadeId, "#000", "halo", h) : y
  )}
        ${k.map(
    (T) => T && !T.sky ? $`<polygon points=${T.points} fill=${`url(#${T.shadeId})`} />` : y
  )}
        ${D.map((T) => N(T, "#fff"))}
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
        ${k.map(
    (T) => T && T.sky ? $`<g clip-path=${`url(#${T.clipId})`}>
                <polygon points=${T.haloPoints} fill=${`url(#${T.haloShadeId})`} />
                <polygon points=${T.points} fill=${`url(#${T.shadeId})`} />
                ${T.shadows.map((q) => N(q, "#fff"))}
              </g>` : y
  )}
      </mask>`;
  return $`
    <defs>
      ${H}
      <!-- The wall shadows again, for the warm patches themselves. -->
      <mask id=${C} maskUnits="userSpaceOnUse" x=${I} y=${S} width=${_} height=${P}>
        ${L("#fff")}
        ${D.map((T) => N(T, "#000"))}
      </mask>
      <!-- The halo rectangle of each skylight, so its contribution to the
           shade mask above can be confined to its own light. Same reason the
           masks below are per-skylight: what one roof light does is nobody
           else's business. -->
      ${k.map(
    (T) => T && T.sky ? $`<clipPath id=${T.clipId} clipPathUnits="userSpaceOnUse">
              <polygon points=${T.haloPoints} />
            </clipPath>` : y
  )}
      <!-- …and one per skylight, carrying its downwind walls alone. A mask
           each rather than a shared one because "downwind" is measured from
           the roof light, so no two skylights have the same answer. -->
      ${k.map(
    (T) => T && T.sky ? $`<mask id=${T.shadowMaskId} maskUnits="userSpaceOnUse"
                      x=${I} y=${S} width=${_} height=${P}>
              ${L("#fff")}
              ${T.shadows.map((q) => N(q, "#000"))}
            </mask>` : y
  )}
    </defs>
    <g class="fp-sunlight">
      ${p.shade === null ? y : $`<rect x=${I} y=${S} width=${_} height=${P}
            style=${`fill:${ut(p.shade, Xe)};`}
            opacity=${Cc * c} mask=${`url(#${E})`} />`}
      ${k.map(
    (T) => T ? U(T, T.lightId, ut(p.light, fn), T.sky ? "core" : "beam") : y
  )}
      ${k.map(
    (T) => T && T.halo ? U(T.halo, T.haloLightId, ut(p.light, fn), "halo") : y
  )}
      <g mask=${`url(#${C})`} opacity=${la * c * h}>
        ${k.map(
    (T) => T && !T.sky ? $`<polygon class="fp-sunbeam" points=${T.points}
                            fill=${`url(#${T.lightId})`} />` : y
  )}
      </g>
      <!-- Each roof light through a mask of its own, carrying the walls
           downwind of it and no others — the reason spelled out above. -->
      ${k.map(
    (T) => T && T.sky ? $`<g mask=${`url(#${T.shadowMaskId})`} opacity=${la * c * h}>
              <polygon class="fp-sunbeam fp-skylight-halo" points=${T.haloPoints}
                       fill=${`url(#${T.haloLightId})`} />
              <polygon class="fp-sunbeam fp-skylight-patch" points=${T.points}
                       fill=${`url(#${T.lightId})`} />
            </g>` : y
  )}
    </g>`;
}
function Ze(t) {
  return !!t?.themes?.darkMode;
}
function Fc(t, e) {
  if (e && t.imageDark) return { href: t.imageDark };
  if (t.image)
    return e && t.imageInvertDark ? { href: t.image, filter: "invert(1) hue-rotate(180deg)" } : { href: t.image };
}
function ua(t, e, i, n, o) {
  const { dir: r, strength: s = 1 } = o, a = typeof o.direct == "number" && Number.isFinite(o.direct) ? Math.max(0, Math.min(1, o.direct)) : 1;
  if (s <= 0) return y;
  const l = Math.min(e, i) * Ic(o.reach), c = o.shade === void 0 ? Xe : o.shade;
  if (c === null) return y;
  const d = t.map((p) => ({
    poly: We(tr(p, r, l)),
    thickness: Lt(p.thickness)
  }));
  if (d.length === 0) return y;
  const h = Cc * s * a;
  return $`
    <g class="fp-sunlight fp-outdoor-sunlight" id=${n}>
      ${d.map(
    (p) => $`<polygon class="fp-outdoor-shadow" points=${p.poly} fill=${ut(c, Xe)} opacity=${h} stroke=${ut(c, Xe)} stroke-width=${p.thickness} />`
  )}
    </g>`;
}
function Rc(t) {
  switch (t) {
    case "contain":
      return "xMidYMid meet";
    case "cover":
      return "xMidYMid slice";
    default:
      return "none";
  }
}
function Ur(t, e, i, n) {
  const o = nt + 4, r = nt;
  return $`
    <defs>
      <mask id=${n} maskUnits="userSpaceOnUse"
            x=${-r} y=${-r} width=${e + r * 2} height=${i + r * 2}>
        <rect x=${-r} y=${-r} width=${e + r * 2} height=${i + r * 2}
              fill="white" />
        ${t.map((s) => {
    if (gt(s)) return y;
    const a = s.length / 2;
    return $`<rect x=${s.x - a} y=${s.y - o / 2}
                           width=${s.length} height=${o} fill="black"
                           transform="rotate(${s.angle} ${s.x} ${s.y})" />`;
  })}
      </mask>
    </defs>`;
}
function Dt(t) {
  if (!t.length) return { x: 0, y: 0 };
  const e = t.reduce((i, n) => ({ x: i.x + n.x, y: i.y + n.y }), { x: 0, y: 0 });
  return { x: e.x / t.length, y: e.y / t.length };
}
function Ub(t) {
  if (t.length < 3) return;
  let e = 0, i = 0, n = 0;
  for (let o = 0, r = t.length - 1; o < t.length; r = o++) {
    const s = t[o], a = t[r], l = a.x * s.y - s.x * a.y;
    e += l, i += (a.x + s.x) * l, n += (a.y + s.y) * l;
  }
  if (e !== 0)
    return { x: i / (3 * e), y: n / (3 * e) };
}
function Dc(t) {
  const e = Ub(t);
  return e && ct(t, e.x, e.y) ? e : Dt(t);
}
const er = { scale: 1, txPercent: 0, tyPercent: 0 };
function Vb(t, e, i, n, o = 0.15, r = Fo, s, a) {
  if (!t.length) return er;
  const l = ei(e, i, n), c = a ?? { w: l.w, h: l.h, projection: "plan", wallHeight: 0 }, d = t.map((C) => {
    const I = Me(C.x, C.y, e, i, n);
    return ti(I.x, I.y, c);
  }), h = qe(c), p = d.map((C) => C.x), f = d.map((C) => C.y);
  let u = Math.min(...p), m = Math.max(...p), b = Math.min(...f) - (c.projection === "iso" ? c.wallHeight : 0), g = Math.max(...f);
  if (c.projection === "iso" && c.orbitSpan !== void 0) {
    const C = Math.min(...t.map((U) => U.x)), I = Math.max(...t.map((U) => U.x)), S = Math.min(...t.map((U) => U.y)), _ = Math.max(...t.map((U) => U.y)), P = Me((C + I) / 2, (S + _) / 2, e, i, n), L = ti(P.x, P.y, c), N = qe({
      ...c,
      padding: 0,
      orbitSpan: Math.SQRT2 * Math.hypot(I - C, _ - S)
    });
    u = L.x - N.w / 2, m = L.x + N.w / 2, b = L.y - (N.h - c.wallHeight) / 2 - c.wallHeight, g = L.y + (N.h - c.wallHeight) / 2;
  }
  const w = Math.max(m - u, g - b) * o, A = Math.max(m - u + w * 2, 1), M = Math.max(g - b + w * 2, 1), k = Math.max(1, Math.min(r, Math.min(h.w / A, h.h / M))), z = s ?? k;
  if (!Number.isFinite(z)) return er;
  const D = (u + m) / 2 / h.w, R = (b + g) / 2 / h.h, E = (C) => Math.min(0, Math.max(100 * (1 - z), C));
  return {
    scale: z,
    txPercent: E(50 - z * D * 100),
    tyPercent: E(50 - z * R * 100)
  };
}
function qb(t) {
  const e = t.zoom;
  if (!(typeof e != "number" || !Number.isFinite(e)))
    return Math.max(1, Math.min(al, e));
}
function Yb(t, e) {
  if (!Number.isFinite(t) || t <= 1 || e === "auto") return 1;
  const i = typeof e == "number" && Number.isFinite(e) && e > 0 ? e : Ro;
  return 1 / t * i;
}
const $o = 12, Gb = 1.5, Kb = 0.4;
function Nc(t) {
  return $`
    <defs>
      <pattern id=${t} width=${$o} height=${$o}
               patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line class="fp-dead-space-line" x1="0" y1="0" x2="0" y2=${$o}
              stroke=${xr} stroke-width=${Gb} />
      </pattern>
    </defs>`;
}
function Hc(t, e) {
  const i = t.map((n) => `${n.x},${n.y}`).join(" ");
  return $`<polygon class="fp-dead-space" points=${i}
                      fill=${`url(#${e})`} fill-rule="nonzero"
                      fill-opacity=${Kb} stroke="none" />`;
}
function Dn(t) {
  switch (t) {
    case "lawn":
      return "#4CAF50";
    case "patio":
      return "#9E9E9E";
    case "pool":
      return "#2196F3";
    case "terrace":
      return "#A1887F";
    case "driveway":
      return "#607D8B";
    case "garden":
      return "#8BC34A";
    case "courtyard":
      return "#D7CCC8";
    default:
      return;
  }
}
function jc(t, e, i) {
  const n = t.points.map((c) => `${c.x},${c.y}`).join(" "), o = e !== void 0 && (t.highlight ?? "fill") !== "border", r = Dn(t.zoneKind), s = t.color || r ? void 0 : i, a = o ? t.activeOpacity ?? t.opacity : s ? s.opacity : t.opacity, l = s ? s.color : ut(t.color, r ?? pt);
  return $`<polygon class="fp-area" data-id=${wt(t.id) ?? y}
                       data-entity=${me(t.entity) ?? y}
                       points=${n}
                       fill=${o ? e : l}
                       fill-opacity=${W(a, Lo)}
                       stroke="none"
                       stroke-width="0" />`;
}
function Wc(t, e, i) {
  const n = e !== void 0 && (t.highlight ?? "fill") !== "fill", o = n ? e : t.borderColor ? ut(t.borderColor, "none") : void 0;
  if (o === void 0 || o === "none") return y;
  const r = t.points.map((a) => `${a.x},${a.y}`).join(" "), s = W(
    t.borderWidth,
    n ? nt / 2 : qd
  );
  return !n || i === void 0 ? $`<polygon class="fp-area-border" data-id=${wt(t.id) ?? y}
                        data-entity=${me(t.entity) ?? y}
                        points=${r} fill="none"
                        stroke=${o} stroke-width=${s} />` : $`
    <clipPath id=${i}><polygon points=${r} /></clipPath>
    <polygon class="fp-area-border" data-id=${wt(t.id) ?? y}
             data-entity=${me(t.entity) ?? y}
             points=${r} fill="none" clip-path=${`url(#${i})`}
             stroke=${o} stroke-width=${s * 2} />`;
}
function ki(t, e, i = It) {
  const n = e ?? t.color ?? dl, o = _l(Rt(i, t.type) ?? wl, t.w, t.h, n), r = t.hand === "left" ? " scale(-1 1)" : "";
  return $`<g class=${`fp-furniture fp-furniture-${wt(t.type) ?? "unknown"}`}
                data-id=${wt(t.id) ?? y}
                data-entity=${me(t.entity) ?? y}
                transform="translate(${t.x} ${t.y}) rotate(${t.angle ?? 0})${r}">${o}</g>`;
}
function ko(t, e, i = It) {
  const n = Rt(i, t.type)?.extend;
  if (!n || !t.entity) return t;
  const o = Wt(e), r = n.open === "extended" ? o : 1 - o, s = n.min + (1 - n.min) * r;
  if (s >= 1) return t;
  const a = n.axis === "w" ? t.w : t.h, l = a * (1 - s) / 2, c = n.axis === "w" ? t.hand === "left" ? -l : l : 0, d = n.axis === "h" ? l : 0, h = (t.angle ?? 0) * Math.PI / 180;
  return {
    ...t,
    x: t.x - (c * Math.cos(h) - d * Math.sin(h)),
    y: t.y - (c * Math.sin(h) + d * Math.cos(h)),
    ...n.axis === "w" ? { w: a * s } : { h: a * s }
  };
}
function Bc(t, e, i = It) {
  if (t.hand !== "center" || Rt(i, t.type)?.extend?.axis !== "w")
    return [ko(t, e, i)];
  const n = t.w / 4, o = (t.angle ?? 0) * Math.PI / 180, r = (s) => ({
    ...t,
    x: t.x + s * n * Math.cos(o),
    y: t.y + s * n * Math.sin(o),
    w: t.w / 2,
    // The left half gathers at the left end, the right half mirrored at the right.
    hand: s < 0 ? "right" : "left"
  });
  return [ko(r(-1), e, i), ko(r(1), e, i)];
}
function Nn(t, e, i, n, o, r = 3, s = "fixed") {
  function a(p) {
    return (p % 360 + 360) % 360;
  }
  function l(p, f, u) {
    return Math.max(Math.min(p, u), f);
  }
  const c = st(W(i, Qn), s), d = a(W(n, Jn)), h = l(W(o, to), 0, 360);
  return v`
    <div
      class="ripple ${t ? "active" : ""}"
      style="width:${c};height:${c};--fp-ripple-color:${ut(e, pt)};--fp-ripple-direction:${d};--fp-ripple-width:${h}"
    >
      <span class="dot"></span>
      ${Array.from(
    { length: r },
    (p, f) => v`<span class="ring" style="animation-delay:${(f * 0.6).toFixed(2)}s;"></span>`
  )}
    </div>
  `;
}
function Hn(t, e) {
  if (!e || !t) return null;
  const i = t[e]?.state;
  if (i == null || i === "unavailable" || i === "unknown") return null;
  const n = Number(i);
  return Number.isFinite(n) ? n : null;
}
function Uc(t, e) {
  const i = t.color ?? pt, n = (t.dotSize ?? yr) / 2, o = t.x + t.w / 2, r = t.y + t.h / 2, s = t.angle ?? 0, a = xs(t.xSensor, e.xReading), l = xs(t.ySensor, e.yReading), c = a != null, d = l != null, h = e.xPresent === !1 || e.yPresent === !1, p = t.w / 2, f = t.h / 2, u = e.editing ? $`<rect class="tracker-zone ${h ? "presence-gated" : ""}"
                x=${-p} y=${-f} width=${t.w} height=${t.h}
                fill=${i} fill-opacity="0.08" stroke=${i} stroke-width="1.5"
                stroke-dasharray="6 4" rx="4" pointer-events="none" />` : $``;
  let m;
  if (h)
    m = $``;
  else if (c && d) {
    const b = -p + a * t.w, g = -f + l * t.h, w = `0,${-n} ${n * 0.9},${n * 0.7} ${-n * 0.9},${n * 0.7}`, A = Math.max(n * 3.5, Math.min(t.w, t.h) * 0.45);
    m = $`
      <g class="tracker-marker" style="transform:translate(${b}px, ${g}px);">
        <circle class="tracker-ring" cx="0" cy="0" r="0"
                fill="none" stroke=${i} stroke-width="1.5"
                style="--fp-tracker-ring-max:${A}px;" />
        <circle class="tracker-ring" cx="0" cy="0" r="0"
                fill="none" stroke=${i} stroke-width="1.5"
                style="--fp-tracker-ring-max:${A}px; animation-delay:0.7s;" />
        <polygon class="tracker-dot" points=${w} fill=${i} />
      </g>`;
  } else if (c || d)
    if (c) {
      const b = -p + a * t.w;
      m = $`
        <g class="tracker-line" style="transform:translate(${b}px, 0);">
          <line class="tracker-line-stroke" x1="0" y1=${-f} x2="0" y2=${f}
                stroke=${i} stroke-width="1.5" />
          <line class="tracker-band" x1="0" y1=${-f} x2="0" y2=${f}
                stroke=${i} stroke-width="3" stroke-linecap="round" />
          <line class="tracker-band" x1="0" y1=${-f} x2="0" y2=${f}
                stroke=${i} stroke-width="3" stroke-linecap="round"
                style="animation-delay:0.8s;" />
        </g>`;
    } else {
      const b = -f + l * t.h;
      m = $`
        <g class="tracker-line tracker-line-h" style="transform:translate(0, ${b}px);">
          <line class="tracker-line-stroke" x1=${-p} y1="0" x2=${p} y2="0"
                stroke=${i} stroke-width="1.5" />
          <line class="tracker-band" x1=${-p} y1="0" x2=${p} y2="0"
                stroke=${i} stroke-width="3" stroke-linecap="round" />
          <line class="tracker-band" x1=${-p} y1="0" x2=${p} y2="0"
                stroke=${i} stroke-width="3" stroke-linecap="round"
                style="animation-delay:0.8s;" />
        </g>`;
    }
  else e.editing ? m = $`<circle class="tracker-placeholder" cx="0" cy="0" r=${n}
                          fill=${i} fill-opacity="0.25" />` : m = $``;
  return $`
    <g class="tracker fp-tracker ${e.editing ? "editing" : ""}"
       data-id=${wt(t.id) ?? y}
       transform="translate(${o} ${r}) rotate(${s})">
      ${u}${m}
    </g>`;
}
function fa(t, e, i, n) {
  let o = null, r = n;
  for (const s of i) {
    const a = s.x2 - s.x1, l = s.y2 - s.y1, c = a * a + l * l;
    if (c === 0) continue;
    let d = ((t - s.x1) * a + (e - s.y1) * l) / c;
    d = Math.max(0, Math.min(1, d));
    const h = s.x1 + d * a, p = s.y1 + d * l, f = Math.hypot(t - h, e - p);
    f < r && (r = f, o = { x: h, y: p, angle: Math.atan2(l, a) * 180 / Math.PI });
  }
  return o;
}
class mo {
  static currentFloorEntityIds(e, i) {
    const n = e ? yt(e) : [], o = n.find((l) => l.id === i) ?? n[0];
    if (!o) return [];
    const r = /* @__PURE__ */ new Set(), s = !!e?.ambientDaylight || !!e && Jo(e);
    s && r.add("sun.sun");
    const a = s && e ? Fi(e) : void 0;
    a && r.add(a);
    for (const l of o.openings)
      l.entity && r.add(l.entity), l.secondaryEntity && r.add(l.secondaryEntity), l.shutterEntity && r.add(l.shutterEntity), l.shutterSecondaryEntity && r.add(l.shutterSecondaryEntity);
    for (const l of o.items) {
      l.entity && r.add(l.entity);
      for (const c of ye(l))
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
  static scopeKey(e, i) {
    const n = mo.currentFloorEntityIds(e, i);
    return n.length ? n.join("|") : "none";
  }
}
function Xb(t) {
  const e = Date.now() / 1e3, i = t?.historyReplay?.lookbackSeconds, n = typeof i == "number" && Number.isFinite(i) && i > 0 ? i : 3600;
  return { start: Math.max(0, e - n), end: e };
}
function ma(t, e) {
  const i = Math.max(0, Math.min(t, e)), n = Math.max(0, Math.max(t, e));
  return {
    start: i,
    end: Math.max(i, n)
  };
}
function Zb(t, e) {
  return mo.currentFloorEntityIds(t, e);
}
function Qb(t, e) {
  return mo.scopeKey(t, e);
}
function Jb(t, e, i) {
  const o = Math.max(1, i - e) / 30, r = t?.historyReplay?.defaultSpeed;
  return Math.max(0.25, r ?? o);
}
function t0(t) {
  const e = Date.parse(t);
  return Number.isNaN(e) ? Date.now() / 1e3 : e / 1e3;
}
function ya(t) {
  if (!Number.isFinite(t) || t <= 0) return "";
  const e = new Date(t * 1e3), i = e.getFullYear(), n = `${e.getMonth() + 1}`.padStart(2, "0"), o = `${e.getDate()}`.padStart(2, "0"), r = `${e.getHours()}`.padStart(2, "0"), s = `${e.getMinutes()}`.padStart(2, "0");
  return `${i}-${n}-${o}T${r}:${s}`;
}
function e0(t) {
  const e = Math.min(3, Math.max(-2, t));
  return Number((10 ** e).toPrecision(4));
}
function i0(t, e, i) {
  if (!t) return;
  if (i.has(e))
    return i.get(e);
  const n = yt(t);
  let o;
  for (const r of n) {
    for (const s of r.items ?? [])
      if (s.entity === e)
        return o = s.activeColor ?? s.rippleColor, i.set(e, o), o;
    for (const s of r.openings ?? [])
      if (s.entity === e)
        return o = s.activeColor, i.set(e, o), o;
    for (const s of r.furniture ?? [])
      if (s.entity === e)
        return o = s.activeColor, i.set(e, o), o;
  }
  i.set(e, void 0);
}
function n0(t, e, i, n, o) {
  if (!e) return Ci(t);
  const r = J(i0(e, t.entityId, n)), s = se(t.entityId, t.newState);
  if (o && r) return s ? r : "#ffffff";
  const a = Ci(t);
  return s ? a : "#ffffff";
}
function o0(t, e) {
  if (!Number.isFinite(t)) return "—";
  try {
    return e.format(new Date(t * 1e3));
  } catch {
    return new Date(t * 1e3).toISOString();
  }
}
var r0 = Object.defineProperty, s0 = Object.getOwnPropertyDescriptor, xt = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? s0(e, i) : e, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (o = (n ? s(e, i, o) : s(o)) || o);
  return n && o && r0(e, i, o), o;
};
function a0(t) {
  const e = t.state.playbackController, i = t.state, o = i.enabled || i.startTime > 0 ? void 0 : t.getDefaultWindow(), r = o ? o.start : i.startTime, s = o ? o.end : i.endTime, a = t.formatReplayTime(
    o ? o.end : e.currentTime
  );
  return {
    events: i.historyEvents,
    startTime: o ? o.start : e.startTime,
    endTime: o ? o.end : e.endTime,
    currentTime: o ? o.end : e.currentTime,
    visible: i.historyVisible,
    enabled: i.enabled,
    ready: i.ready,
    playing: e.playing,
    timelineExpanded: i.timelineExpanded,
    logExpanded: i.logExpanded,
    speedExpanded: i.speedExpanded,
    error: i.error,
    rangeWarning: i.rangeWarning,
    panelId: i.panelId,
    replaySpeed: e.speed,
    currentTimeLabel: a,
    startInputValue: ya(r),
    endInputValue: ya(s),
    onToggleVisible: (l) => t.toggleHistoryVisible(l),
    onRangeChange: (l, c) => {
      t.handleRangeChange(l, { target: { value: c } });
    },
    onZoom: (l) => t.zoomWindow(l),
    onJump: (l) => t.jumpReplay(l),
    onStep: (l) => t.stepReplay(l),
    onPlayToggle: () => e.playing ? t.pauseReplay() : t.playReplay(),
    onToggleSpeedPanel: () => t.toggleSpeedPanel(),
    onSpeedSliderInput: (l) => t.setReplaySpeed(e0(l)),
    onSpeedChange: (l) => t.setReplaySpeed(l),
    onToggleTimeline: () => t.toggleTimeline(),
    onToggleLog: () => t.toggleLog(),
    onSeek: (l) => t.seekReplay(l)
  };
}
function l0(t) {
  return v`
    <easy-floorplan-replay-panel
      .events=${t.events}
      .startTime=${t.startTime}
      .endTime=${t.endTime}
      .currentTime=${t.currentTime}
      .visible=${t.visible}
      .enabled=${t.enabled}
      .ready=${t.ready}
      .playing=${t.playing}
      .timelineExpanded=${t.timelineExpanded}
      .logExpanded=${t.logExpanded}
      .speedExpanded=${t.speedExpanded}
      .error=${t.error}
      .rangeWarning=${t.rangeWarning}
      .panelId=${t.panelId}
      .replaySpeed=${t.replaySpeed}
      .currentTimeLabel=${t.currentTimeLabel}
      .startInputValue=${t.startInputValue}
      .endInputValue=${t.endInputValue}
      @toggle-visible=${(e) => t.onToggleVisible(!!(e.detail?.visible ?? !0))}
      @range-change=${(e) => {
    const i = e.detail?.kind ?? "start";
    e.detail?.value && t.onRangeChange(i, e.detail.value);
  }}
      @zoom=${(e) => t.onZoom(e.detail?.direction ?? 1)}
      @jump=${(e) => t.onJump(e.detail?.delta ?? 0)}
      @step=${(e) => t.onStep(e.detail?.direction ?? 1)}
      @play-toggle=${() => t.onPlayToggle()}
      @toggle-speed-panel=${() => t.onToggleSpeedPanel()}
      @speed-slider-input=${(e) => {
    const i = Number(e.detail?.value ?? 0);
    Number.isFinite(i) && t.onSpeedSliderInput(i);
  }}
      @speed-change=${(e) => {
    const i = Number(e.detail?.value ?? 1);
    Number.isFinite(i) && t.onSpeedChange(i);
  }}
      @toggle-timeline=${() => t.onToggleTimeline()}
      @toggle-log=${() => t.onToggleLog()}
      @seek=${(e) => t.onSeek(e.detail?.timestamp ?? t.currentTime)}
    ></easy-floorplan-replay-panel>
  `;
}
let ft = class extends fe {
  constructor() {
    super(...arguments), this.events = [], this.startTime = 0, this.endTime = 0, this.currentTime = 0, this.visible = !1, this.enabled = !1, this.ready = !1, this.playing = !1, this.timelineExpanded = !1, this.logExpanded = !1, this.speedExpanded = !1, this.panelId = "replay-panel", this.replaySpeed = 1, this.currentTimeLabel = "—", this.startInputValue = "", this.endInputValue = "";
  }
  updated(t) {
    super.updated(t), (t.has("events") || t.has("currentTime") || t.has("logExpanded")) && this._logRef && this._syncLogToCurrentEvent();
  }
  _dispatch(t, e) {
    this.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
  }
  _getCurrentEvent() {
    if (!this.events.length) return;
    const t = this.currentTime;
    let e = 0, i = this.events.length - 1, n = -1;
    for (; e <= i; ) {
      const o = e + i >> 1;
      this.events[o].timestamp <= t ? (n = o, e = o + 1) : i = o - 1;
    }
    return n >= 0 ? this.events[n] : void 0;
  }
  _renderEventItem(t, e) {
    const i = t.timestamp <= this.currentTime, n = (typeof t.color == "string" ? t.color : void 0) ?? (typeof t.attributes?.color == "string" ? t.attributes.color : void 0) ?? Ci(t), o = J(n), r = o ? `background:${o}; box-shadow:0 0 0 2px ${o}22;` : y;
    return v`
      <li class="replay-event-item ${i ? "replay-event-passed" : ""} ${e ? "replay-event-current" : ""}" data-timestamp=${t.timestamp}>
        <span class="replay-event-dot" style=${r}></span>
        <span class="replay-event-time">${new Date(t.timestamp * 1e3).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}</span>
        <span class="replay-event-icon"><ha-icon icon="mdi:swap-horizontal"></ha-icon></span>
        <span class="replay-event-entity">${t.entityId}</span>
        <span class="replay-event-change">${t.oldState} → ${t.newState}</span>
      </li>
    `;
  }
  _syncLogToCurrentEvent() {
    if (!this._logRef) return;
    const t = this._logRef.querySelector(".replay-event-item.replay-event-current");
    t && t.scrollIntoView({ block: "nearest", inline: "nearest" });
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
    const t = this._getCurrentEvent();
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
            ${this.error ? v`<span class="replay-error">${this.error}</span>` : y}
            ${this.rangeWarning ? v`<span class="replay-loading">${this.rangeWarning}</span>` : y}
            ${!this.ready && this.enabled && !this.error ? v`<span class="replay-loading">Loading history…</span>` : y}
          </div>
        </div>
        <div class="replay-range">
          <label class="replay-range-field">
            <span>Start</span>
            <input
              type="datetime-local"
              .value=${this.startInputValue}
              @change=${(e) => this._dispatch("range-change", { kind: "start", value: e.target.value })}
            />
          </label>
          <label class="replay-range-field">
            <span>End</span>
            <input
              type="datetime-local"
              .value=${this.endInputValue}
              @change=${(e) => this._dispatch("range-change", { kind: "end", value: e.target.value })}
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
                  @input=${(e) => this._dispatch("speed-slider-input", { value: Number(e.target.value) })}
                />
                <input
                  class="replay-speed"
                  type="number"
                  min="0.01"
                  max="1000"
                  step="0.01"
                  .value=${this.replaySpeed.toString()}
                  @change=${(e) => this._dispatch("speed-change", { value: Number(e.target.value || 1) })}
                />
              </label>
            </div>` : y}
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
              @seek=${(e) => this._dispatch("seek", { timestamp: e.detail.timestamp })}
            ></easy-floorplan-history-timeline>
          </div>
        </div>
        <div class=${`replay-event-log ${this.logExpanded ? "expanded" : "collapsed"}`} role="log" aria-label="Replay event log">
          <button class="replay-log-toggle" @click=${() => this._dispatch("toggle-log")}>
            ${this.logExpanded ? "Hide log" : "Show log"}
          </button>
          ${this.logExpanded ? v`<ul
                class="replay-event-list"
                ${(e) => {
      this._logRef = e instanceof HTMLUListElement ? e : void 0, this._logRef && this.events.length && this._syncLogToCurrentEvent();
    }}
              >${jt(this.events, (e, i) => `${e.timestamp}-${e.entityId}-${e.newState}-${i}`, (e) => this._renderEventItem(e, t?.timestamp === e.timestamp))}</ul>` : y}
          ${!this.logExpanded && !this.events.length ? v`<div class="replay-empty">No history events yet.</div>` : y}
        </div>
      </div>
    `;
  }
};
ft.styles = re`
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
xt([
  at({ attribute: !1 })
], ft.prototype, "events", 2);
xt([
  at({ type: Number })
], ft.prototype, "startTime", 2);
xt([
  at({ type: Number })
], ft.prototype, "endTime", 2);
xt([
  at({ type: Number })
], ft.prototype, "currentTime", 2);
xt([
  at({ type: Boolean })
], ft.prototype, "visible", 2);
xt([
  at({ type: Boolean })
], ft.prototype, "enabled", 2);
xt([
  at({ type: Boolean })
], ft.prototype, "ready", 2);
xt([
  at({ type: Boolean })
], ft.prototype, "playing", 2);
xt([
  at({ type: Boolean })
], ft.prototype, "timelineExpanded", 2);
xt([
  at({ type: Boolean })
], ft.prototype, "logExpanded", 2);
xt([
  at({ type: Boolean })
], ft.prototype, "speedExpanded", 2);
xt([
  at({ type: String })
], ft.prototype, "error", 2);
xt([
  at({ type: String })
], ft.prototype, "rangeWarning", 2);
xt([
  at({ type: String })
], ft.prototype, "panelId", 2);
xt([
  at({ type: Number })
], ft.prototype, "replaySpeed", 2);
xt([
  at({ type: String })
], ft.prototype, "currentTimeLabel", 2);
xt([
  at({ type: String })
], ft.prototype, "startInputValue", 2);
xt([
  at({ type: String })
], ft.prototype, "endInputValue", 2);
ft = xt([
  Gn("easy-floorplan-replay-panel")
], ft);
const Vc = "--fp-color-", qc = 24;
function $t(t) {
  return typeof t != "string" ? "" : t.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
}
function Yc(t) {
  return Vc + $t(t);
}
function ga(t) {
  return `var(${Yc(t)})`;
}
function Di(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set(), i = [];
  for (const n of t) {
    if (!n || typeof n != "object") continue;
    const { name: o, color: r } = n, s = $t(o), a = J(r);
    if (!(!s || !a || e.has(s)) && (e.add(s), i.push({ name: o.trim(), color: a }), i.length >= qc))
      break;
  }
  return i;
}
function Gc(t) {
  return Di(t).map((e) => `${Yc(e.name)}:${e.color};`).join("");
}
function Kc(t) {
  return Di(t).map((e) => `${$t(e.name)}=${e.color}`).join(",");
}
const c0 = /^[Vv][Aa][Rr]\(\s*--fp-color-([\p{L}\p{N}-]+)\s*(?:,((?:[^()]|\([^()]*\))*))?\)$/u;
function Xc(t) {
  return ir(t)?.slug;
}
function ir(t) {
  if (typeof t != "string") return;
  const e = c0.exec(t.trim());
  if (!e) return;
  const i = e[2]?.trim();
  return { slug: e[1], fallback: i || void 0 };
}
function mn(t, e) {
  const i = Xc(t);
  if (!i) return t;
  const n = Di(e).find((o) => $t(o.name) === i);
  return n ? n.color : t;
}
function ba(t, e, i) {
  if (!e) return t;
  const n = (o) => {
    if (typeof o == "string") {
      const r = ir(o);
      if (r?.slug !== e) return o;
      const s = ir(i);
      return r.fallback && s && !s.fallback ? `var(${Vc}${s.slug}, ${r.fallback})` : i;
    }
    return Array.isArray(o) ? o.map(n) : o && typeof o == "object" ? Object.fromEntries(Object.entries(o).map(([r, s]) => [r, n(s)])) : o;
  };
  return n(t);
}
const Be = [
  { name: "sage", light: "#5f9a68", dark: "#9fd8a8" },
  { name: "sky", light: "#3f86c4", dark: "#8ec8f2" },
  { name: "lilac", light: "#8c6cc0", dark: "#c8b0f2" },
  { name: "sand", light: "#b48a48", dark: "#e6c790" },
  { name: "teal", light: "#2f9a90", dark: "#7fdcd0" },
  { name: "rose", light: "#bf6a8a", dark: "#f2aac4" },
  { name: "slate", light: "#6a7c96", dark: "#b6c4da" },
  { name: "olive", light: "#8c9640", dark: "#d0d884" }
], d0 = 0.18, h0 = 8, p0 = 4;
function Vr(t) {
  return t?.roomTints === "auto" ? "auto" : "off";
}
function Zc(t, e) {
  const i = io(e)?.scheme;
  return i || (t?.themes?.darkMode === !0 ? "dark" : "light");
}
function u0(t, e) {
  const i = Be[(t % Be.length + Be.length) % Be.length], n = Be.indexOf(i) + 1;
  return `var(--fp-room-tint-${n}, var(--fp-color-room-tint-${n}, ${i[e]}))`;
}
function f0(t) {
  let e = 2166136261;
  for (let i = 0; i < t.length; i++)
    e ^= t.charCodeAt(i), e = Math.imul(e, 16777619);
  return e >>> 0;
}
function m0(t) {
  return Array.isArray(t) ? t.filter(
    (e) => !!e && Number.isFinite(e.x) && Number.isFinite(e.y)
  ) : [];
}
function y0(t, e, i) {
  let n = !1;
  for (let o = 0, r = t.length - 1; o < t.length; r = o++) {
    const s = t[o], a = t[r];
    s.y > i != a.y > i && e < (a.x - s.x) * (i - s.y) / (a.y - s.y) + s.x && (n = !n);
  }
  return n;
}
function g0(t, e, i, n, o, r) {
  const s = e.x - t.x, a = e.y - t.y, l = Math.hypot(s, a);
  if (l < r) return !1;
  const c = s / l, d = a / l, h = (g) => Math.abs((g.x - t.x) * d - (g.y - t.y) * c);
  if (h(i) > o || h(n) > o) return !1;
  const p = (g) => (g.x - t.x) * c + (g.y - t.y) * d, f = p(i), u = p(n), m = Math.max(0, Math.min(f, u));
  return Math.min(l, Math.max(f, u)) - m >= r;
}
function b0(t, e, i = h0, n = p0) {
  if (t.length < 2 || e.length < 2) return !1;
  const o = (l) => ({
    x0: Math.min(...l.map((c) => c.x)),
    y0: Math.min(...l.map((c) => c.y)),
    x1: Math.max(...l.map((c) => c.x)),
    y1: Math.max(...l.map((c) => c.y))
  }), r = o(t), s = o(e);
  if (r.x0 > s.x1 + i || s.x0 > r.x1 + i || r.y0 > s.y1 + i || s.y0 > r.y1 + i)
    return !1;
  for (let l = 0; l < t.length; l++) {
    const c = t[l], d = t[(l + 1) % t.length];
    for (let h = 0; h < e.length; h++)
      if (g0(c, d, e[h], e[(h + 1) % e.length], i, n)) return !0;
  }
  const a = (l, c) => l.length >= 3 && c.some((d) => y0(l, d.x, d.y) && v0(l, d) > i);
  return a(t, e) || a(e, t);
}
function v0(t, e) {
  let i = 1 / 0;
  for (let n = 0; n < t.length; n++) {
    const o = t[n], r = t[(n + 1) % t.length], s = r.x - o.x, a = r.y - o.y, l = s * s + a * a, c = l ? Math.max(0, Math.min(1, ((e.x - o.x) * s + (e.y - o.y) * a) / l)) : 0;
    i = Math.min(i, Math.hypot(e.x - (o.x + c * s), e.y - (o.y + c * a)));
  }
  return i;
}
function x0(t, e = Be.length) {
  const i = t.map(() => {
  });
  if (e < 1) return i;
  const n = t.map((r, s) => ({
    i: s,
    key: typeof r.id == "string" ? r.id : "",
    pts: m0(r.points),
    // An outdoor zone's default colour counts as the area's own colour: a
    // lawn stays lawn green, and its neighbours need not avoid a tint for it.
    own: typeof r.color == "string" && r.color.trim() !== "" || Dn(r.zoneKind) !== void 0
  })).filter((r) => !r.own);
  n.sort((r, s) => r.key < s.key ? -1 : r.key > s.key ? 1 : r.i - s.i);
  const o = [];
  for (const r of n) {
    const s = new Set(
      o.filter((c) => b0(r.pts, c.pts)).map((c) => c.tint)
    ), a = f0(r.key) % e;
    let l = a;
    for (let c = 0; c < e; c++) {
      const d = (a + c) % e;
      if (!s.has(d)) {
        l = d;
        break;
      }
    }
    i[r.i] = l, o.push({ pts: r.pts, tint: l });
  }
  return i;
}
const va = /* @__PURE__ */ new WeakMap();
function w0(t) {
  let e = va.get(t);
  return e || (e = x0(t), va.set(t, e)), e;
}
function Qc(t, e, i) {
  if (e !== "auto") return t.map(() => {
  });
  const n = w0(t);
  return t.map((o, r) => {
    const s = n[r];
    if (s !== void 0)
      return {
        color: u0(s, i),
        opacity: typeof o.opacity == "number" && Number.isFinite(o.opacity) ? o.opacity : d0
      };
  });
}
function yn(t, e, i, n) {
  if (!(n > 0) || !(t.length > 0)) return [];
  if (gt(t)) return $0(t, e, i, n);
  const o = [], r = t.length / 2, s = t.type === "window" ? n * Er(t) : 0, a = n * Uo, l = (M) => Math.max(0, Math.min(1, W(M, 0))), c = l(e.amount ?? (e.open === !1 ? 0 : 1)), d = e.second ? l(e.second.amount) : c, h = (M, k, z = e.accent) => ut(k ? z : M === 0 ? J(e.inactive) ?? e.color : e.color, pt), p = h(c, e.active), f = e.second ? h(d, e.second.active) : p, u = fo(t), m = t.angle * Math.PI / 180, b = (M, k) => (M *= t.flipH ? -1 : 1, k *= t.flipV ? -1 : 1, i(t.x + M * Math.cos(m) - k * Math.sin(m), t.y + M * Math.sin(m) + k * Math.cos(m))), g = (M, k, z, D, R = p, E = s, C = a, I = u) => {
    C <= E || o.push({ kind: "panel", id: t.id, base: [b(M, k), b(z, D)], z0: E, z1: C, color: R, glazed: I });
  }, w = (M, k, z, D, R, E = p, C = f, I = -1, S = u, _ = 0) => {
    const P = D * Math.PI / 2;
    if (g(M, _, M + z * Math.cos(P), _ + I * z * Math.sin(P), E, s, a, S), k > M) {
      const L = R * Math.PI / 2;
      g(k, _, k - z * Math.cos(L), _ + I * z * Math.sin(L), C, s, a, S);
    }
  };
  o.push({ kind: "opening-hit", id: t.id, base: [b(-r, 0), b(r, 0)], z0: s, z1: a });
  const A = Ut(t) ? void 0 : vt(t);
  if (A === "swing") {
    const M = oe(t) === "double", k = M ? r : t.length * po(t);
    w(-r, M ? r : -r, k, c, d), !M && k < t.length && g(-r + k, 0, r, 0, J(e.color), s, a, !0);
  } else if (A === "fixed")
    g(-r, 0, r, 0, J(e.color));
  else if (A === "roll")
    g(-r, 0, r, 0, p, s + (a - s) * c, a, !1);
  else if (A === "awning") {
    const M = c * Math.PI / 2, k = (a - s) * Math.sin(M), z = a - (a - s) * Math.cos(M), D = b(-r, -k), R = b(r, -k);
    o.push({
      kind: "panel",
      id: t.id,
      base: [D, R],
      z0: z,
      z1: a,
      color: p,
      glazed: u,
      vertices: [
        { ...D, z },
        { ...R, z },
        { ...b(r, 0), z: a },
        { ...b(-r, 0), z: a }
      ]
    });
  } else if (A === "slide") {
    const M = Hi(t), k = r / 2, z = 1.75;
    M === "bypass" ? (g(-r, z, 0, z, J(e.color)), g(-r * c, -z, r - r * c, -z)) : M === "biparting" ? (g(-r - r * c, 0, -r * c, 0), g(r * d, 0, r + r * d, 0, f)) : M === "biparting-bypass" ? (g(-r, z, -k, z, J(e.color)), g(k, z, r, z, J(e.color)), g(-k - k * c, -z, -k * c, -z), g(k * d, -z, k + k * d, -z, f)) : M === "converging" ? (g(-r + k * c, z, k * c, z), g(-k * d, -z, r - k * d, -z, f)) : g(-r + t.length * c, 0, r + t.length * c, 0);
  }
  if (e.shutter) {
    const M = e.shutter, k = l(M.amount), z = M.second ? l(M.second.amount) : k, D = h(k, M.active, M.accent ?? e.accent), R = M.second ? h(z, M.second.active, M.accent ?? e.accent) : D;
    if (M.style === "swing") {
      const E = M.flip ? -1 : 1;
      w(-r, r, r, k, z, D, R, E, !1, E * ((nt + 4) / 2 + 1.5));
    } else
      g(-r, 2, r, 2, D, s + (a - s) * k, a, !1);
  }
  return o;
}
const _0 = Math.PI / 3;
function $0(t, e, i, n) {
  const o = t.length / 2, r = qt(t) / 2;
  if (!(r > 0)) return [];
  const s = (z) => Math.max(0, Math.min(1, W(z, 0))), a = s(e.amount ?? (e.open === !1 ? 0 : 1)), l = (z, D, R = e.accent) => ut(D ? R : z === 0 ? J(e.inactive) ?? e.color : e.color, pt), c = t.angle * Math.PI / 180, d = (z, D) => (z *= t.flipH ? -1 : 1, D *= t.flipV ? -1 : 1, i(t.x + z * Math.cos(c) - D * Math.sin(c), t.y + z * Math.sin(c) + D * Math.cos(c))), h = (z, D) => [d(-o, z), d(o, z), d(o, D), d(-o, D)], p = h(-r, r), f = [];
  if (f.push({
    kind: "opening-hit",
    id: t.id,
    base: p,
    z0: n,
    z1: n,
    vertices: p.map((z) => ({ ...z, z: n }))
  }), e.shutter) {
    const z = s(e.shutter.amount), D = r * 2 * (1 - z);
    if (D > 0) {
      const R = h(-r, -r + D);
      f.push({
        kind: "panel",
        id: t.id,
        base: p,
        z0: n,
        z1: n,
        color: l(z, e.shutter.active, e.shutter.accent ?? e.accent),
        glazed: !1,
        vertices: R.map((E) => ({ ...E, z: n }))
      });
    }
  }
  const u = a * _0, m = r * 2, b = -r + m * Math.cos(u), g = n + m * Math.sin(u), [w, A] = [d(-o, -r), d(o, -r)], [M, k] = [d(o, b), d(-o, b)];
  return f.push({
    kind: "panel",
    id: t.id,
    base: p,
    z0: n,
    z1: g,
    color: l(a, e.active),
    glazed: fo(t),
    vertices: [{ ...w, z: n }, { ...A, z: n }, { ...M, z: g }, { ...k, z: g }]
  }), f;
}
const St = 1e-3;
function yo(t) {
  const e = Math.min(t.x0, t.x1), i = Math.max(t.x0, t.x1), n = Math.min(t.y0, t.y1), o = Math.max(t.y0, t.y1);
  return [
    { x: e, y: n },
    { x: i, y: n },
    { x: i, y: o },
    { x: e, y: o }
  ];
}
function Bt(t) {
  if (t.length !== 4) return !1;
  const e = ge(t);
  return yo({
    x0: e.minX,
    y0: e.minY,
    x1: e.maxX,
    y1: e.maxY
  }).every((i, n) => i.x === t[n].x && i.y === t[n].y);
}
const k0 = 1;
function Gi(t, e = k0) {
  if (!Bt(t)) return !1;
  const i = ge(t);
  return i.maxX - i.minX >= e && i.maxY - i.minY >= e;
}
function xa(t, e, i) {
  const n = t[(e + 2) % 4];
  return n ? yo({ x0: n.x, y0: n.y, x1: i.x, y1: i.y }) : t.map((o) => ({ ...o }));
}
function S0(t, e, i) {
  const n = t.map((p) => ({ ...p })), o = e % 4, r = (e + 1) % 4, s = Math.abs(n[o].y - n[r].y) < St, a = n.map((p, f) => f === o || f === r ? s ? { ...p, y: i.y } : { ...p, x: i.x } : p), l = Math.min(...a.map((p) => p.x)), c = Math.max(...a.map((p) => p.x)), d = Math.min(...a.map((p) => p.y)), h = Math.max(...a.map((p) => p.y));
  return yo({ x0: l, y0: d, x1: c, y1: h });
}
function ge(t) {
  const e = t.map((n) => n.x), i = t.map((n) => n.y);
  return {
    minX: Math.min(...e),
    maxX: Math.max(...e),
    minY: Math.min(...i),
    maxY: Math.max(...i)
  };
}
function So(t, e, i = { dx: 0, dy: 0 }) {
  let n = ge(t);
  for (const o of e) {
    const r = ge(o.points);
    if (!(n.maxX > r.minX && n.minX < r.maxX && n.maxY > r.minY && n.minY < r.maxY)) continue;
    const a = n.maxX - n.minX, l = n.maxY - n.minY;
    i.dx > 0 ? n = { ...n, maxX: Math.min(n.maxX, r.minX) } : i.dx < 0 ? n = { ...n, minX: Math.max(n.minX, r.maxX) } : i.dy > 0 ? n = { ...n, maxY: Math.min(n.maxY, r.minY) } : i.dy < 0 ? n = { ...n, minY: Math.max(n.minY, r.maxY) } : a >= l ? n.minX < r.maxX ? n = { ...n, maxX: r.minX } : n = { ...n, minX: r.maxX } : n.minY < r.maxY ? n = { ...n, maxY: r.minY } : n = { ...n, minY: r.maxY };
  }
  return [
    { x: n.minX, y: n.minY },
    { x: n.maxX, y: n.minY },
    { x: n.maxX, y: n.maxY },
    { x: n.minX, y: n.maxY }
  ];
}
function M0(t, e, i = St) {
  if (!Bt(t) || !Bt(e)) return [];
  const n = ge(t), o = ge(e), r = Math.min(n.maxY, o.maxY) - Math.max(n.minY, o.minY), s = Math.min(n.maxX, o.maxX) - Math.max(n.minX, o.minX), a = [];
  return Math.abs(n.maxX - o.minX) < i && r > i && a.push("right"), Math.abs(n.minX - o.maxX) < i && r > i && a.push("left"), Math.abs(n.maxY - o.minY) < i && s > i && a.push("bottom"), Math.abs(n.minY - o.maxY) < i && s > i && a.push("top"), a;
}
function E0(t, e, i, n) {
  if (!Bt(t) || !Bt(e)) return;
  const o = ge(t), r = ge(e), s = Math.min(o.maxY, r.maxY) - Math.max(o.minY, r.minY), a = Math.min(o.maxX, r.maxX) - Math.max(o.minX, r.minX), l = Math.abs(i.dx) > St, c = Math.abs(i.dy) > St, d = (n === void 0 || n === "right") && Math.abs(o.maxX - r.minX) < St && s > St && l, h = (n === void 0 || n === "left") && Math.abs(o.minX - r.maxX) < St && s > St && l, p = (n === void 0 || n === "bottom") && Math.abs(o.maxY - r.minY) < St && a > St && c, f = (n === void 0 || n === "top") && Math.abs(o.minY - r.maxY) < St && a > St && c;
  if (!d && !h && !p && !f) return;
  const u = t.map((b) => ({ ...b })), m = e.map((b) => ({ ...b }));
  if (d) {
    const b = o.maxX + i.dx;
    u[1] = { x: b, y: u[1].y }, u[2] = { x: b, y: u[2].y }, m[0] = { x: b, y: m[0].y }, m[3] = { x: b, y: m[3].y };
  }
  if (h) {
    const b = o.minX + i.dx;
    u[0] = { x: b, y: u[0].y }, u[3] = { x: b, y: u[3].y }, m[1] = { x: b, y: m[1].y }, m[2] = { x: b, y: m[2].y };
  }
  if (p) {
    const b = o.maxY + i.dy;
    u[2] = { x: u[2].x, y: b }, u[3] = { x: u[3].x, y: b }, m[0] = { x: m[0].x, y: b }, m[1] = { x: m[1].x, y: b };
  }
  if (f) {
    const b = o.minY + i.dy;
    u[0] = { x: u[0].x, y: b }, u[1] = { x: u[1].x, y: b }, m[2] = { x: m[2].x, y: b }, m[3] = { x: m[3].x, y: b };
  }
  return { points: u, other: m };
}
function A0(t) {
  switch (t) {
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
function ii(t, e, i = {}) {
  if (!Bt(e)) return [];
  const [n, o, r, s] = e, a = {
    top: { x1: n.x, y1: n.y, x2: o.x, y2: o.y },
    right: { x1: o.x, y1: o.y, x2: r.x, y2: r.y },
    bottom: { x1: r.x, y1: r.y, x2: s.x, y2: s.y },
    left: { x1: s.x, y1: s.y, x2: n.x, y2: n.y }
  };
  return ee.filter((l) => i[l] === "wall" || i[l] === "divider").map((l) => {
    const c = {
      id: Jc(t, l),
      ...a[l],
      thickness: nt
    };
    return i[l] === "divider" ? { ...c, divider: !0 } : c;
  });
}
function Jc(t, e) {
  return `area-wall-${t}-${e}`;
}
const Ue = 26, T0 = 0.75;
function C0(t, e, i, n = T0) {
  const o = t.find((a) => a.id === e);
  if (!o) return;
  const r = [];
  i !== 2 && r.push({ x: o.x1, y: o.y1, which: 1 }), i !== 1 && r.push({ x: o.x2, y: o.y2, which: 2 });
  const s = [];
  for (const a of t)
    if (a.id !== o.id)
      for (const l of [1, 2]) {
        const c = l === 1 ? a.x1 : a.x2, d = l === 1 ? a.y1 : a.y2, h = r.find((p) => Math.hypot(c - p.x, d - p.y) <= n);
        h && s.push({ id: a.id, end: l, which: h.which, x0: c, y0: d });
      }
  return s.length ? s : void 0;
}
function td(t, e, i, n) {
  let o = null, r = n;
  for (const s of t) {
    const a = Math.hypot(e - s.x, i - s.y);
    a < r && (r = a, o = { x: s.x, y: s.y });
  }
  return o;
}
function wa(t, e, i) {
  const n = i.x2 - i.x1, o = i.y2 - i.y1, r = n * n + o * o, s = r === 0 ? 0 : Math.max(0, Math.min(1, ((t - i.x1) * n + (e - i.y1) * o) / r));
  return Math.hypot(t - (i.x1 + s * n), e - (i.y1 + s * o));
}
const Mo = 0.5;
function I0(t, e, i, n, o, r, s) {
  const a = t.find(
    (g) => wa(e, i, g) <= Mo && wa(n, o, g) <= Mo
  );
  if (!a) return;
  const l = Math.hypot(n - e, o - i);
  if (l === 0) return;
  const c = ((r.x - e) * (o - i) - (r.y - i) * (n - e)) / l;
  if (Math.abs(c) > Mo) return c > 0 ? "left" : "right";
  if (!s) return;
  const d = (o - i) / l, h = -(n - e) / l, p = (e + n) / 2, f = (i + o) / 2, u = Lt(a.thickness) / 2 + nt, m = s(p + d * u, f + h * u), b = s(p - d * u, f - h * u);
  return m === b ? void 0 : m ? "left" : "right";
}
function ed(t, e, i, n) {
  const o = t.flatMap((r) => [
    { x: r.x1, y: r.y1 },
    { x: r.x2, y: r.y2 }
  ]);
  return td(o, e, i, n);
}
function z0(t, e, i, n, o) {
  const r = t.walls.flatMap((a) => [
    { x: a.x1, y: a.y1 },
    { x: a.x2, y: a.y2 }
  ]), s = (t.areas ?? []).flatMap(
    (a) => a.points.filter((l, c) => !(o && o.areaId === a.id && o.vertexIndex === c)).map((l) => ({ x: l.x, y: l.y }))
  );
  return td([...r, ...s], e, i, n);
}
function Eo(t, e, i) {
  const n = t.areas ?? [];
  for (let o = n.length - 1; o >= 0; o--)
    if (ct(n[o].points, e, i)) return n[o];
}
function P0(t, e) {
  if (e <= 0) return [];
  const i = Dt(t);
  if (e === 1) return [i];
  const n = t.map((h) => h.x), o = t.map((h) => h.y), r = Math.min(...n), s = Math.max(...n), a = Math.min(...o), l = Math.max(...o), c = Math.max(s - r, 1), d = Math.max(l - a, 1);
  for (let h = 1; h <= 8; h++) {
    const p = e * h, f = Math.max(1, Math.round(Math.sqrt(p * c / d))), u = Math.max(1, Math.ceil(p / f)), m = c / (f + 1), b = d / (u + 1), g = [];
    for (let w = 1; w <= u; w++)
      for (let A = 1; A <= f; A++) {
        const M = r + A * m, k = a + w * b;
        ct(t, M, k) && g.push({ x: M, y: k });
      }
    if (g.length >= e)
      return Array.from(
        { length: e },
        (w, A) => g[Math.floor(A * g.length / e)]
      );
  }
  return Array.from({ length: e }, (h, p) => {
    const f = p / e * Math.PI * 2, u = Math.min(c, d) * 0.15 * (1 + Math.floor(p / 6));
    return { x: i.x + Math.cos(f) * u, y: i.y + Math.sin(f) * u };
  });
}
function O0(t, e, i, n, o, r, s, a, l = Ue) {
  if (s) return { x: r(n), y: r(o) };
  const c = ed(t, n, o, l);
  if (c) return c;
  const d = n - e, h = o - i, p = Math.tan(a * Math.PI / 180);
  return Math.abs(h) <= Math.abs(d) * p ? { x: r(n), y: i } : Math.abs(d) <= Math.abs(h) * p ? { x: e, y: r(o) } : { x: r(n), y: r(o) };
}
function L0(t, e) {
  const i = Math.min(e.x0, e.x1), n = Math.max(e.x0, e.x1), o = Math.min(e.y0, e.y1), r = Math.max(e.y0, e.y1), s = (l, c) => l >= i && l <= n && c >= o && c <= r, a = [];
  for (const l of t.walls)
    s((l.x1 + l.x2) / 2, (l.y1 + l.y2) / 2) && a.push({ kind: "wall", id: l.id });
  for (const l of t.openings) s(l.x, l.y) && a.push({ kind: "opening", id: l.id });
  for (const l of t.items) s(l.x, l.y) && a.push({ kind: "item", id: l.id });
  for (const l of t.texts) s(l.x, l.y) && a.push({ kind: "text", id: l.id });
  for (const l of t.furniture) s(l.x, l.y) && a.push({ kind: "furniture", id: l.id });
  for (const l of t.trackers ?? [])
    s(l.x + l.w / 2, l.y + l.h / 2) && a.push({ kind: "tracker", id: l.id });
  for (const l of t.areas ?? []) {
    const c = Dt(l.points);
    s(c.x, c.y) && a.push({ kind: "area", id: l.id });
  }
  for (const l of t.roofs ?? []) {
    const c = Dt(l.points);
    s(c.x, c.y) && a.push({ kind: "roof", id: l.id });
  }
  return a;
}
function F0(t, e, i, n) {
  return {
    walls: t.walls.map((o) => {
      const r = n.get(`wall:${o.id}`);
      return r && r.kind === "wall" ? { ...o, x1: r.x1 + e, y1: r.y1 + i, x2: r.x2 + e, y2: r.y2 + i } : o;
    }),
    openings: t.openings.map((o) => {
      const r = n.get(`opening:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + e, y: r.y + i } : o;
    }),
    items: t.items.map((o) => {
      const r = n.get(`item:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + e, y: r.y + i } : o;
    }),
    texts: t.texts.map((o) => {
      const r = n.get(`text:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + e, y: r.y + i } : o;
    }),
    furniture: t.furniture.map((o) => {
      const r = n.get(`furniture:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + e, y: r.y + i } : o;
    }),
    trackers: (t.trackers ?? []).map((o) => {
      const r = n.get(`tracker:${o.id}`);
      return r && r.kind === "pt" ? { ...o, x: r.x + e, y: r.y + i } : o;
    }),
    areas: (t.areas ?? []).map((o) => {
      const r = n.get(`area:${o.id}`);
      return r && r.kind === "polygon" ? { ...o, points: r.points.map((s) => ({ x: s.x + e, y: s.y + i })) } : o;
    }),
    roofs: (t.roofs ?? []).map((o) => {
      const r = n.get(`roof:${o.id}`);
      return r && r.kind === "polygon" ? { ...o, points: r.points.map((s) => ({ x: s.x + e, y: s.y + i })) } : o;
    })
  };
}
const R0 = [
  "item",
  "text",
  "opening",
  "furniture",
  "wall",
  "tracker",
  // Room polygons cover devices and walls, so they pick after specific elements.
  "area",
  // Roof polygons are building-level envelopes that cover multiple rooms or the
  // whole floor, so they pick after areas on first click — but cycling can still
  // reach them.
  "roof"
], ui = {
  wall: 11,
  /** Padding around an item badge / text box so small glyphs stay grabbable. */
  pad: 4
};
function Ki(t, e, i, n, o) {
  const r = -(o || 0) * Math.PI / 180, s = t - i, a = e - n;
  return { x: s * Math.cos(r) - a * Math.sin(r), y: s * Math.sin(r) + a * Math.cos(r) };
}
function D0(t, e, i) {
  const n = i.x2 - i.x1, o = i.y2 - i.y1, r = n * n + o * o;
  if (r === 0) return Math.hypot(t - i.x1, e - i.y1);
  let s = ((t - i.x1) * n + (e - i.y1) * o) / r;
  return s = Math.max(0, Math.min(1, s)), Math.hypot(t - (i.x1 + s * n), e - (i.y1 + s * o));
}
function N0(t, e, i, n) {
  const o = [], r = (s, a, l, c) => o.push({ sel: { kind: s, id: a }, rank: R0.indexOf(s), order: l, locked: !!c });
  return t.items.forEach((s, a) => {
    const l = (s.size ?? n.itemSize) / 2 + ui.pad;
    Math.abs(e - s.x) <= l && Math.abs(i - s.y) <= l && r("item", s.id, a, s.locked);
  }), t.texts.forEach((s, a) => {
    const l = s.size ?? n.textSize, c = l * 0.6 * Math.max(1, Cr(n.hass, s).length) / 2 + ui.pad, d = l / 2 + ui.pad, h = Ki(e, i, s.x, s.y, s.angle ?? 0);
    Math.abs(h.x) <= c && Math.abs(h.y) <= d && r("text", s.id, a, s.locked);
  }), t.openings.forEach((s, a) => {
    const l = gt(s) ? qt(s) / 2 : n.wallThickness / 2, c = Ki(e, i, s.x, s.y, s.angle ?? 0);
    Math.abs(c.x) <= s.length / 2 && Math.abs(c.y) <= l + ui.pad && r("opening", s.id, a, s.locked);
  }), t.furniture.forEach((s, a) => {
    const l = Ki(e, i, s.x, s.y, s.angle ?? 0);
    Math.abs(l.x) <= s.w / 2 && Math.abs(l.y) <= s.h / 2 && r("furniture", s.id, a, s.locked);
  }), t.walls.forEach((s, a) => {
    D0(e, i, s) <= ui.wall && r("wall", s.id, a, s.locked);
  }), (t.trackers ?? []).forEach((s, a) => {
    const l = Ki(e, i, s.x + s.w / 2, s.y + s.h / 2, s.angle ?? 0);
    Math.abs(l.x) <= s.w / 2 && Math.abs(l.y) <= s.h / 2 && r("tracker", s.id, a, s.locked);
  }), (t.roofs ?? []).forEach((s, a) => {
    ct(s.points, e, i) && r("roof", s.id, a, s.locked);
  }), (t.areas ?? []).forEach((s, a) => {
    ct(s.points, e, i) && r("area", s.id, a, s.locked);
  }), o.sort((s, a) => Number(s.locked) - Number(a.locked) || s.rank - a.rank || a.order - s.order).map((s) => s.sel);
}
function qr(t, e) {
  switch (e.kind) {
    case "wall":
      return t.walls.find((i) => i.id === e.id);
    case "opening":
      return t.openings.find((i) => i.id === e.id);
    case "item":
      return t.items.find((i) => i.id === e.id);
    case "text":
      return t.texts.find((i) => i.id === e.id);
    case "furniture":
      return t.furniture.find((i) => i.id === e.id);
    case "tracker":
      return (t.trackers ?? []).find((i) => i.id === e.id);
    case "area":
      return (t.areas ?? []).find((i) => i.id === e.id);
    case "roof":
      return (t.roofs ?? []).find((i) => i.id === e.id);
  }
}
function Xi(t, e) {
  return !!qr(t, e)?.locked;
}
function H0(t, e) {
  return e.filter((i) => {
    const n = qr(t, i);
    return !!n && !n.locked;
  });
}
function j0(t, e, i) {
  if (!t.length) return null;
  if (!i || e.length !== 1) return t[0];
  const n = t.findIndex((o) => o.kind === e[0].kind && o.id === e[0].id);
  return n < 0 ? t[0] : t[(n + 1) % t.length];
}
function _a(t, e, i = 1) {
  return Math.hypot(t.x1 - e.x1, t.y1 - e.y1) <= i && Math.hypot(t.x2 - e.x2, t.y2 - e.y2) <= i || Math.hypot(t.x1 - e.x2, t.y1 - e.y2) <= i && Math.hypot(t.x2 - e.x1, t.y2 - e.y1) <= i;
}
function W0(t, e) {
  if (!t.points || t.points.length < 3) return !0;
  if (!e.length) return !1;
  const i = Dt(t.points);
  if (i && e.some((n) => ct(n, i.x, i.y)))
    return !0;
  if (i) {
    const n = t.points.map((o) => ({
      x: (o.x + i.x) / 2,
      y: (o.y + i.y) / 2
    }));
    if (n.length > 0 && n.every((o) => e.some((r) => ct(r, o.x, o.y))))
      return !0;
  }
  return !1;
}
const gn = (t) => t === "line-art" ? t : "normal", Gt = "#28343e", ue = (t) => String(Math.round(t * 1e3) / 1e3), Zi = (t, e) => `M${ue(t.x)} ${ue(t.y)}L${ue(e.x)} ${ue(e.y)}`;
function id(t, e = "#222222") {
  const i = /* @__PURE__ */ new Map(), n = (r, s) => `${r.kind}:${ue(r.z0)}:${ue(r.z1)}:${ue(s.x)},${ue(s.y)}`;
  for (const r of t)
    if (!(r.kind === "panel" || r.kind === "glass" || r.kind === "opening-hit"))
      for (let s = 0; s < r.base.length; s++) {
        if (r.hiddenEdges?.includes(s)) continue;
        const a = r.base[s], l = r.base[(s + 1) % r.base.length], c = Math.hypot(l.x - a.x, l.y - a.y);
        if (c < 1e-9) continue;
        const d = { x: (l.x - a.x) / c, y: (l.y - a.y) / c };
        for (const h of [a, l]) {
          const p = n(r, h), f = i.get(p) ?? [];
          f.push(d), i.set(p, f);
        }
      }
  const o = /* @__PURE__ */ new Set();
  for (const [r, s] of i) {
    const a = s[0];
    s.some((l) => Math.abs(a.x * l.y - a.y * l.x) > 1e-6) && o.add(r);
  }
  return (r) => B0(r, e, (s) => o.has(n(r, s)));
}
function B0(t, e, i) {
  if (t.kind === "panel" || t.kind === "glass" || t.kind === "opening-hit" || t.base.length < 3) return y;
  const n = t.base.length, o = t.base.reduce((s, a) => ({ x: s.x + a.x / n, y: s.y + a.y / n }), { x: 0, y: 0 }), r = [];
  for (let s = 0; s < n; s++) {
    if (t.hiddenEdges?.includes(s)) continue;
    const a = t.base[s], l = t.base[(s + 1) % n], c = kt(a, t.z1), d = kt(l, t.z1);
    r.push(Zi(c, d));
    let h = l.y - a.y, p = a.x - l.x;
    if (h * (o.x - a.x) + p * (o.y - a.y) > 0 && (h = -h, p = -p), h + p <= 0) continue;
    const f = kt(a, t.z0), u = kt(l, t.z0);
    r.push(Zi(f, u)), (!t.hiddenEdges?.includes((s + n - 1) % n) || i(a)) && r.push(Zi(f, c)), (!t.hiddenEdges?.includes((s + 1) % n) || i(l)) && r.push(Zi(u, d));
  }
  return $`<path class="solid-edges" d=${r.join(" ")} fill="none" stroke=${e}
    stroke-width="1" pointer-events="none" />`;
}
const U0 = re`
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
  .line-art .fp-iso-roof-line { stroke: var(--fp-line-ink); stroke-width: 0.6; opacity: 0.6; }
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
`, Fe = "#ffffff", $a = (t) => ({
  color: Gt,
  accent: Gt,
  open: uo(t)
});
function V0(t, e, i) {
  const n = Math.max(1, W(t.width, Ct)), o = Math.max(1, W(t.height, Ot)), r = [...e.walls, ...e.areas.flatMap((E) => ii(E.id, E.points, E.sideWalls ?? {}))], s = Zt(t.wallHeight), a = s * (e.isOutdoor ? ce : 1), l = {
    ...ei(n, o, i),
    projection: zi(t.view ?? t.projection),
    wallHeight: Vo(a, r),
    padding: 2 + r.reduce((E, C) => Math.max(E, Lt(C.thickness)), 8)
  }, c = qe(l), d = l.projection === "iso" && l.wallHeight > 0, h = Mc(n, o, i), p = (E, C) => Me(E, C, n, o, i), f = $e(t.symbols), u = (E) => ki(E, Gt, f), m = [];
  if (d) {
    m.push(...ln(r.filter((I) => !I.divider).map((I) => {
      const S = p(I.x1, I.y1), _ = p(I.x2, I.y2);
      return {
        ...I,
        x1: S.x,
        y1: S.y,
        x2: _.x,
        y2: _.y,
        thickness: Lt(I.thickness) * (Xt(I) ? Ye : 1)
      };
    }), e.openings.map((I) => ({ ...I, ...p(I.x, I.y), angle: I.angle + i })), s, !1));
    for (const I of e.openings) {
      const S = an(I, e.walls, s);
      m.push(...yn(I, $a(I), p, S));
    }
    const E = s * Bo, C = qo(E, i);
    for (const I of e.furniture) m.push(Ol(
      I,
      p,
      E,
      Fe,
      $`<g transform=${h || y}><g transform="translate(${C.x} ${C.y})">${u(I)}</g></g>`
    ));
  }
  const b = id(m, Gt), g = l.projection === "iso" ? "3d" : "2d", w = `${t.title ? `${t.title} — ` : ""}${e.name} (${g.toUpperCase()})`, A = 20, M = document.createElement("div");
  tl($`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-A} ${-A} ${c.w + A * 2} ${c.h + A * 2}"
      width=${Math.ceil(c.w + A * 2)} height=${Math.ceil(c.h + A * 2)} role="img" aria-labelledby="title description">
    <title id="title">${w}</title>
    <desc id="description">Floorplan line art. Full floor, with static opening positions. Canvas units; not a measured survey.</desc>
    <rect x=${-A} y=${-A} width=${c.w + A * 2} height=${c.h + A * 2} fill=${Fe} />
    <g stroke-linejoin="round" stroke-linecap="round">
      <g transform=${Pl(l) || y}>
        <g transform=${h || y}>
          ${e.areas.map((E) => $`<polygon points=${E.points.map((C) => `${C.x},${C.y}`).join(" ")}
            fill=${Fe} stroke=${Gt} stroke-width="0.6" />`)}
          ${Ur(e.openings, n, o, "wall-gaps")}
          <g mask="url(#wall-gaps)">${r.filter((E) => !d || E.divider).map((E) => $`
            <line x1=${E.x1} y1=${E.y1} x2=${E.x2} y2=${E.y2} stroke=${Gt}
              stroke-width=${E.divider ? 1 : Lt(E.thickness) * (Xt(E) ? Ye : 1)}
              stroke-dasharray=${E.divider ? "5 4" : y} />`)}</g>
          ${d ? y : e.openings.map((E) => jr(E, $a(E)))}
          ${d ? y : e.furniture.map(u)}
        </g>
        ${d ? Ll(m.filter((E) => E.kind !== "opening-hit"), (E, C) => $`<g>${C}${b(E)}</g>`) : y}
      </g>
      <g fill=${Gt} font-family="sans-serif" text-anchor="middle" dominant-baseline="central">
        ${e.areas.filter((E) => E.name && E.showName !== !1).map((E) => {
    const C = Dc(E.points), I = p(C.x, C.y), S = ti(I.x, I.y, l);
    return $`<text x=${S.x} y=${S.y} font-size=${ec(E.labelSize)}
            stroke=${Fe} stroke-width="3" paint-order="stroke">${E.name}</text>`;
  })}
      </g>
    </g>
  </svg>`, M);
  const k = M.querySelector("svg");
  k.querySelectorAll(".fp-iso-shade").forEach((E) => E.remove()), k.querySelectorAll(".fp-iso-face, .fp-iso-panel, .fp-iso-glass").forEach((E) => {
    E.setAttribute("fill", Fe), E.classList.contains("fp-iso-face") || (E.setAttribute("stroke", Gt), E.setAttribute("stroke-width", "1"));
  }), k.querySelectorAll(".fp-furniture [fill]").forEach((E) => {
    E.getAttribute("fill") !== "none" && E.getAttribute("stroke") !== "none" && (E.setAttribute("fill", Fe), E.removeAttribute("fill-opacity"));
  });
  for (const E of k.querySelectorAll("*")) {
    for (const C of [...E.attributes]) C.name.startsWith("data-") && E.removeAttribute(C.name);
    E.style.transform && E.setAttribute("transform", E.style.transform.replace(/deg|px/g, "").replace(/translateX\(([^)]+)\)/g, "translate($1 0)"));
    for (const C of ["fill", "stroke", "stroke-dashoffset"]) {
      const I = E.style.getPropertyValue(C);
      I && E.setAttribute(C, I);
    }
    E.removeAttribute("style");
  }
  const z = document.createTreeWalker(k, NodeFilter.SHOW_COMMENT), D = [];
  for (; z.nextNode(); ) D.push(z.currentNode);
  D.forEach((E) => E.parentNode?.removeChild(E));
  const R = e.name.replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "floor";
  return {
    svg: `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(k)}`,
    filename: `floorplan-${R}-${g}.svg`
  };
}
function ka(t, e, i) {
  const n = V0(t, e, i), o = URL.createObjectURL(new Blob([n.svg], { type: "image/svg+xml;charset=utf-8" })), r = document.createElement("a");
  r.href = o, r.download = n.filename, document.body.append(r);
  try {
    r.click();
  } finally {
    r.remove(), window.setTimeout(() => URL.revokeObjectURL(o), 1e3);
  }
}
const Sa = (t = !1) => $`<svg viewBox="0 0 24 24" aria-hidden="true">
  <g transform=${t ? "translate(24 0) scale(-1 1)" : ""}>
    <path d="M4 10a8 8 0 1 1 1.8 7.1M4 4v6h6" />
  </g></svg>`, q0 = $`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10 12 3l8 7v10h-6v-6h-4v6H4Z" /></svg>`, Y0 = $`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" /></svg>`;
function G0(t) {
  return v`<nav class="view-controls" aria-label="Floorplan display">
    <div class="view-choices">
      <div class="view-segment" role="group" aria-label="View">
        <button type="button" aria-label="2D plan" aria-pressed=${t.view === "2d"}
          @click=${() => t.setView("2d")}>2D</button>
        <button type="button" aria-label="3D isometric" aria-pressed=${t.view === "3d"}
          @click=${() => t.setView("3d")}>3D</button>
      </div>
      <div class="view-segment" role="group" aria-label="Appearance">
        <button type="button" aria-pressed=${t.appearance === "normal"}
          @click=${() => t.setAppearance("normal")}>Normal</button>
        <button type="button" aria-pressed=${t.appearance === "line-art"}
          @click=${() => t.setAppearance("line-art")}>Line art</button>
      </div>
    </div>
    <div class="view-actions">
      <div class="view-rotation" role="group" aria-label="Rotate view">
        <button type="button" aria-label="Rotate left" title="Rotate left 90°"
          @click=${() => t.rotate(-90)}>${Sa()}</button>
        <output aria-live="polite" aria-label="View rotation">${t.rotation}°</output>
        <button type="button" aria-label="Rotate right" title="Rotate right 90°"
          @click=${() => t.rotate(90)}>${Sa(!0)}</button>
      </div>
      <button class="view-reset" type="button" aria-label="Reset view"
        title="Restore the default view and appearance" ?disabled=${!t.canReset} @click=${t.reset}>${q0}</button>
      ${t.exportEnabled ? v`<button class="view-download" type="button" aria-label="Download SVG"
        title="Download a static line-art SVG" @click=${t.download}>${Y0}</button>` : ""}
    </div>
  </nav>`;
}
const K0 = re`
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
`, X0 = 2, nd = 600;
function Ee(t) {
  if (t === !0) return { controls: !0, intervalMs: 0 };
  if (!t || typeof t != "object" || Array.isArray(t)) return;
  const e = t, i = e.controls === void 0 ? !0 : !!e.controls, n = typeof e.interval == "number" || typeof e.interval == "string" ? Number(e.interval) : NaN, o = Number.isFinite(n) && n > 0 ? Math.min(Math.max(n, X0), nd) * 1e3 : 0, r = Array.isArray(e.rooms) ? e.rooms.filter((s) => typeof s == "string" && s !== "") : void 0;
  if (!(!i && o === 0))
    return { controls: i, intervalMs: o, ...r?.length ? { rooms: r } : {} };
}
function Ma(t, e) {
  if (!e || !t?.length) return [];
  const i = new Set(t.map((n) => n.id));
  return e.rooms ? e.rooms.filter((n) => i.has(n)) : t.map((n) => n.id);
}
function Z0(t, e, i) {
  if (!t.length) return;
  const n = e === void 0 ? -1 : t.indexOf(e);
  return n < 0 ? i === 1 ? t[0] : t[t.length - 1] : t[(n + i + t.length) % t.length];
}
const Q0 = 500, J0 = 250;
class tv extends HTMLElement {
  constructor() {
    super(...arguments), this.holdTime = Q0, this.held = !1, this.cancelled = !1;
  }
  connectedCallback() {
    Object.assign(this.style, {
      position: "fixed",
      width: "0",
      height: "0"
    }), ["touchcancel", "mouseout", "mouseup", "touchmove", "mousewheel", "wheel", "scroll"].forEach(
      (e) => {
        document.addEventListener(
          e,
          () => {
            this.cancelled = !0, this.timer && (clearTimeout(this.timer), this.timer = void 0);
          },
          { passive: !0 }
        );
      }
    );
  }
  bind(e, i = {}) {
    e.actionHandler && ev(i, e.actionHandler.options) || (e.actionHandler ? (e.removeEventListener("touchstart", e.actionHandler.start), e.removeEventListener("touchend", e.actionHandler.end), e.removeEventListener("touchcancel", e.actionHandler.end), e.removeEventListener("mousedown", e.actionHandler.start), e.removeEventListener("click", e.actionHandler.end), e.removeEventListener("keydown", e.actionHandler.handleKeyDown)) : e.addEventListener("contextmenu", (n) => {
      n.preventDefault(), n.stopPropagation();
    }), e.actionHandler = { options: i }, !i.disabled && (e.actionHandler.start = () => {
      this.cancelled = !1, this.held = !1, i.hasHold && (this.timer = window.setTimeout(() => {
        this.held = !0;
      }, this.holdTime));
    }, e.actionHandler.end = (n) => {
      if (["touchend", "touchcancel"].includes(n.type) && this.cancelled) {
        this.timer && clearTimeout(this.timer), this.timer = void 0;
        return;
      }
      if ((n.type === "touchend" || n.type === "touchcancel") && (n.cancelable && n.preventDefault(), n.type === "touchcancel")) {
        this.timer && clearTimeout(this.timer), this.timer = void 0;
        return;
      }
      const o = n.target;
      i.hasHold && this.timer && (clearTimeout(this.timer), this.timer = void 0), i.hasHold && this.held ? Qi(o, "hold") : i.hasDoubleClick ? n.type === "click" && n.detail < 2 || !this.dblClickTimeout ? this.dblClickTimeout = window.setTimeout(() => {
        this.dblClickTimeout = void 0, Qi(o, "tap");
      }, J0) : (clearTimeout(this.dblClickTimeout), this.dblClickTimeout = void 0, Qi(o, "double_tap")) : Qi(o, "tap");
    }, e.actionHandler.handleKeyDown = (n) => {
      ["Enter", " "].includes(n.key) && (n.preventDefault(), n.currentTarget.actionHandler.end(n));
    }, e.addEventListener("touchstart", e.actionHandler.start, { passive: !0 }), e.addEventListener("touchend", e.actionHandler.end), e.addEventListener("touchcancel", e.actionHandler.end), e.addEventListener("mousedown", e.actionHandler.start, { passive: !0 }), e.addEventListener("click", e.actionHandler.end), e.addEventListener("keydown", e.actionHandler.handleKeyDown)));
  }
}
function ev(t, e) {
  return t.hasHold === e.hasHold && t.hasDoubleClick === e.hasDoubleClick && t.disabled === e.disabled;
}
function Qi(t, e) {
  t.dispatchEvent(
    new CustomEvent("action", { detail: { action: e }, bubbles: !0, composed: !0 })
  );
}
function iv() {
  const t = document.body, e = t.querySelector("action-handler-easy-floorplan");
  if (e) return e;
  const i = document.createElement("action-handler-easy-floorplan");
  return t.appendChild(i), i;
}
customElements.get("action-handler-easy-floorplan") || customElements.define("action-handler-easy-floorplan", tv);
const nv = (t, e) => {
  iv().bind(t, e);
}, te = Kn(
  class extends Xn {
    update(t, [e]) {
      return nv(t.element, e), Qt;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(t) {
    }
  }
), od = 0.28, ov = 0.8, rv = 1.15;
function bn(t, e) {
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : e;
}
function jn(t, e) {
  return typeof t != "number" || !Number.isFinite(t) ? e : Math.max(0, Math.min(1, t));
}
function rd(t = {}) {
  return {
    strength: jn(t.strength, od),
    depth: Math.max(0.05, Math.min(3, bn(t.depth, ov))),
    spread: Math.max(0.05, Math.min(4, bn(t.spread, rv))),
    openingEps: bn(t.openingEps, zt)
  };
}
function Wn(t, e, i) {
  const n = t.points;
  if (n.length < 3) return !1;
  let o = !1;
  for (let r = 0, s = n.length - 1; r < n.length; s = r++) {
    const a = n[r], l = n[s];
    if (!(a.y > i != l.y > i)) continue;
    const d = (l.x - a.x) * (i - a.y) / (l.y - a.y) + a.x;
    e < d && (o = !o);
  }
  return o;
}
function sv(t, e, i, n) {
  const o = n.x - i.x, r = n.y - i.y, s = o * o + r * r;
  if (s === 0) return Math.hypot(t - i.x, e - i.y);
  let a = ((t - i.x) * o + (e - i.y) * r) / s;
  return a = Math.max(0, Math.min(1, a)), Math.hypot(t - (i.x + a * o), e - (i.y + a * r));
}
function av(t, e) {
  if (t.points.length < 2) return;
  let i;
  for (let n = 0; n < t.points.length; n++) {
    const o = t.points[n], r = t.points[(n + 1) % t.points.length], s = sv(e.x, e.y, o, r);
    (!i || s < i.distance) && (i = { area: t, segmentIndex: n, distance: s });
  }
  return i;
}
function lv(t, e, i = zt) {
  const n = bn(i, zt);
  return e.map((o) => av(o, t)).filter((o) => o !== void 0 && o.distance <= n).sort((o, r) => o.distance - r.distance);
}
function cv(t, e, i, n) {
  const o = t.area.points, r = o[t.segmentIndex], s = o[(t.segmentIndex + 1) % o.length], a = s.x - r.x, l = s.y - r.y, c = Math.hypot(a, l);
  if (!(c > 0)) return;
  const d = { x: -l / c, y: a / c }, h = { x: l / c, y: -a / c }, p = Math.max(1, n + 1), f = Wn(t.area, e + d.x * p, i + d.y * p), u = Wn(t.area, e + h.x * p, i + h.y * p);
  if (f && !u) return d;
  if (u && !f) return h;
  const m = t.area.points.reduce(
    (g, w) => ({ x: g.x + w.x / t.area.points.length, y: g.y + w.y / t.area.points.length }),
    { x: 0, y: 0 }
  ), b = { x: m.x - e, y: m.y - i };
  return d.x * b.x + d.y * b.y >= 0 ? d : h;
}
function sd(t, e, i = {}) {
  const { openingEps: n } = rd(i), o = [];
  for (const r of e) {
    const s = lv(r, t, n);
    if (s.length !== 1) continue;
    const a = s[0], l = cv(a, r.x, r.y, n);
    l && o.push({
      openingId: r.id,
      areaId: a.area.id,
      x: r.x,
      y: r.y,
      inwardX: l.x,
      inwardY: l.y,
      length: Math.max(0, r.length)
    });
  }
  return o;
}
function dv(t, e = 0, i = 1) {
  return t.sunlight === !1 ? 0 : (Rn(t) ? 1 : jn(e, 0)) * jn(i, 1);
}
function hv(t) {
  const e = ri(t);
  if (e === void 0 || e <= Ae) return 0;
  if (e >= Oo) return 1;
  const i = (e - Ae) / (Oo - Ae);
  return i * i * (3 - 2 * i);
}
function pv(t) {
  if (!t.points.length) return 1;
  let e = 1 / 0, i = 1 / 0, n = -1 / 0, o = -1 / 0;
  for (const r of t.points)
    e = Math.min(e, r.x), i = Math.min(i, r.y), n = Math.max(n, r.x), o = Math.max(o, r.y);
  return Math.max(1, n - e, o - i);
}
function ad(t, e, i, n = () => 1, o = {}) {
  const { strength: r, depth: s, spread: a } = rd(o), l = hv(i);
  if (!(l > 0) || !(r > 0)) return [];
  const c = pv(t) * s, d = [];
  for (const h of e) {
    if (h.areaId !== t.id) continue;
    const p = jn(n(h.openingId), 0), f = Math.max(0, Math.min(1, r * l * p));
    if (!(f > 0)) continue;
    const u = -h.inwardY, m = h.inwardX, b = Math.max(1, h.length / 2), g = b + c * a, w = h.x + h.inwardX * c, A = h.y + h.inwardY * c;
    d.push({
      openingId: h.openingId,
      areaId: h.areaId,
      points: [
        { x: h.x - u * b, y: h.y - m * b },
        { x: h.x + u * b, y: h.y + m * b },
        { x: w + u * g, y: A + m * g },
        { x: w - u * g, y: A - m * g }
      ],
      gradientStart: { x: h.x, y: h.y },
      gradientEnd: { x: w, y: A },
      opacity: f
    });
  }
  return d;
}
const uv = 0.5;
function fv(t) {
  const e = uv, i = Math.max(0, Math.min(1, (Math.abs(t) - e) / (1 - e)));
  return 1 - i * i * (3 - 2 * i);
}
const mv = "#f4f8ff", yv = 10, gv = 32;
function nr(t, e, i) {
  return Math.max(e, Math.min(i, t));
}
function Bn(t) {
  return Number.isFinite(t.x) && Number.isFinite(t.y);
}
function vn(t) {
  return t.length < 3 || t.some((e) => !Bn(e)) ? "" : t.map((e) => `${e.x},${e.y}`).join(" ");
}
function fi(t) {
  let e = 2166136261;
  for (let n = 0; n < t.length; n++)
    e ^= t.charCodeAt(n), e = Math.imul(e, 16777619);
  return `${t.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "ambient"}-${(e >>> 0).toString(36)}`;
}
const Re = (t, e, i) => ({ x: t.x + (e.x - t.x) * i, y: t.y + (e.y - t.y) * i });
function bv(t, e, i = gv) {
  if (t.length !== 4 || t.some((u) => !Bn(u))) return [];
  const [n, o, r, s] = t, a = Re(n, o, 0.5), l = Re(s, r, 0.5), c = Math.hypot(l.x - a.x, l.y - a.y);
  if (!(c > 0)) return [];
  const d = { x: (a.x - l.x) / c * e, y: (a.y - l.y) / c * e }, h = Math.max(1, Math.floor(i)), p = Array.from({ length: h }, (u, m) => {
    let b = 0;
    for (let g = 0; g < 16; g++) b += fv((m + (g + 0.5) / 16) / h);
    return b / 16;
  }), f = [];
  for (let u = h; u >= 1; u--) {
    const m = u / h, b = Re(a, n, m), g = Re(a, o, m), w = p[u - 1], A = u === h ? 0 : p[u], M = A >= 1 ? 0 : nr((w - A) / (1 - A), 0, 1);
    M > 0 && f.push({
      points: vn([
        { x: b.x + d.x, y: b.y + d.y },
        b,
        Re(l, s, m),
        Re(l, r, m),
        g,
        { x: g.x + d.x, y: g.y + d.y }
      ]),
      opacity: M
    });
  }
  return f;
}
function vv(t, e, i = {}) {
  const n = vn(t.points);
  if (!n) return null;
  const o = i.idPrefix?.trim() || "fp-ambient", r = fi(`${o}-clip-${t.id}`), s = fi(`${o}-blur-${t.id}`), a = Number.isFinite(i.blur) ? nr(i.blur, 0, 40) : yv, l = i.color?.trim() || mv, c = [];
  for (let d = 0; d < e.length; d++) {
    const h = e[d];
    if (h.areaId !== t.id) continue;
    const p = vn(h.points);
    if (!p || !Bn(h.gradientStart) || !Bn(h.gradientEnd) || !Number.isFinite(h.opacity) || h.opacity <= 0) continue;
    const f = h.clipPoints && vn(h.clipPoints);
    h.clipPoints && !f || c.push({
      openingId: h.openingId,
      points: p,
      gradientId: fi(`${o}-gradient-${t.id}-${h.openingId}-${d}`),
      gradientStart: h.gradientStart,
      gradientEnd: h.gradientEnd,
      opacity: nr(h.opacity, 0, 1),
      clipId: f ? fi(`${o}-wall-${t.id}-${h.openingId}-${d}`) : void 0,
      clipPoints: f || void 0,
      maskId: fi(`${o}-sides-${t.id}-${h.openingId}-${d}`),
      sideBands: bv(h.points, Math.max(1, a * 3))
    });
  }
  return c.length ? { clipId: r, clipPoints: n, filterId: s, blur: a, color: l, patches: c } : null;
}
function Ea(t, e, i = {}) {
  const n = vv(t, e, i);
  return n ? $`
    <g class="fp-ambient-daylight" data-area-id=${t.id} aria-hidden="true" pointer-events="none">
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
    (o) => $`
            ${o.clipPoints ? $`<clipPath id=${o.clipId}>
              <polygon points=${o.clipPoints}></polygon>
            </clipPath>` : y}
            <linearGradient id=${o.gradientId} gradientUnits="userSpaceOnUse"
                            x1=${o.gradientStart.x} y1=${o.gradientStart.y}
                            x2=${o.gradientEnd.x} y2=${o.gradientEnd.y}>
              <stop offset="0%" stop-color=${n.color} stop-opacity="1"></stop>
              <stop offset="35%" stop-color=${n.color} stop-opacity="0.72"></stop>
              <stop offset="72%" stop-color=${n.color} stop-opacity="0.25"></stop>
              <stop offset="100%" stop-color=${n.color} stop-opacity="0"></stop>
            </linearGradient>
            <!-- Sideways fade, blurred like the light so its steps melt. Same
                 region margin as the filter: the mask follows the blurred
                 patch, and a tighter box would cut its soft edge square. -->
            ${o.sideBands.length ? $`<mask id=${o.maskId}
                  x="-25%" y="-25%" width="150%" height="150%">
              <g filter=${n.blur > 0 ? `url(#${n.filterId})` : y}>
                ${o.sideBands.map((r) => $`<polygon points=${r.points}
                  fill="#fff" fill-opacity=${r.opacity}></polygon>`)}
              </g>
            </mask>` : y}
          `
  )}
      </defs>
      <g clip-path=${`url(#${n.clipId})`}>
        ${n.patches.map(
    (o) => $`
            <g clip-path=${o.clipId ? `url(#${o.clipId})` : y}>
            <polygon class="fp-ambient-daylight-patch"
                     data-opening-id=${o.openingId}
                     points=${o.points}
                     fill=${`url(#${o.gradientId})`}
                     opacity=${o.opacity}
                     filter=${n.blur > 0 ? `url(#${n.filterId})` : "none"}
                     mask=${o.sideBands.length ? `url(#${o.maskId})` : y}>
            </polygon>
            </g>
          `
  )}
      </g>
    </g>
  ` : $``;
}
function xv(t) {
  const e = Ml(kr(t.map((o) => ({
    a: { x: o.x1, y: o.y1 },
    b: { x: o.x2, y: o.y2 }
  })), Et), Et), i = [], n = [];
  return e.forEach((o, r) => {
    const s = Ve(o), a = { id: `wall-region-${r}`, points: o };
    s > Et * Et && i.push(a), s < -Et * Et && n.push(a);
  }), { rooms: i, shells: n.filter((o) => !n.some((r) => o !== r && Math.abs(Ve(r.points)) > Math.abs(Ve(o.points)) && Wn(r, o.points[0].x, o.points[0].y))) };
}
function wv(t, e) {
  const i = e.x2 - e.x1, n = e.y2 - e.y1, o = i * i + n * n, r = o ? Math.max(0, Math.min(
    1,
    ((t.x - e.x1) * i + (t.y - e.y1) * n) / o
  )) : 0;
  return { x: e.x1 + r * i, y: e.y1 + r * n };
}
function Un(t, e) {
  let i;
  for (const n of e) {
    if (n.x1 === n.x2 && n.y1 === n.y2) continue;
    const o = wv(t, n), r = Math.hypot(t.x - o.x, t.y - o.y);
    (!i || r < i.distance) && (i = { wall: n, point: o, distance: r });
  }
  return i;
}
function _v(t) {
  const e = [];
  return t.forEach((i, n) => {
    const o = t.filter((r) => r !== i);
    [{ x: i.x1, y: i.y1 }, { x: i.x2, y: i.y2 }].forEach((r, s) => {
      const a = Un(r, o);
      !a || a.distance <= Et || a.distance > zt || e.push({ id: `ambient-join-${n}-${s}`, x1: r.x, y1: r.y, x2: a.point.x, y2: a.point.y });
    });
  }), [...t, ...e];
}
function $v(t, e) {
  let i = [];
  e.forEach((r, s) => {
    if (gt(r) || !(r.length > 0) || (Un(r, t)?.distance ?? 1 / 0) <= Et) return;
    const a = r.angle * Math.PI / 180, l = Math.cos(a) * r.length / 2, c = Math.sin(a) * r.length / 2;
    i.push({ id: `ambient-opening-${s}`, x1: r.x - l, y1: r.y - c, x2: r.x + l, y2: r.y + c });
  });
  const n = (r, s, a) => {
    const l = Un(r, [...t, ...a.filter((c) => c !== s)]);
    return l && l.distance <= zt ? l.point : void 0;
  }, o = (r) => [{ x: r.x1, y: r.y1 }, { x: r.x2, y: r.y2 }];
  for (let r = -1; r !== i.length; ) {
    r = i.length;
    const s = i;
    i = s.filter((a) => o(a).every((l) => n(l, a, s)));
  }
  return [...t, ...i.map((r) => {
    const [s, a] = o(r).map((l) => n(l, r, i));
    return { id: r.id, x1: s.x, y1: s.y, x2: a.x, y2: a.y };
  })];
}
function kv(t, e) {
  const i = t.x2 - t.x1, n = t.y2 - t.y1, o = Math.hypot(i, n);
  return o > 0 && [
    { x: e.x1, y: e.y1 },
    { x: e.x2, y: e.y2 }
  ].every((r) => Math.abs((r.x - t.x1) * n - (r.y - t.y1) * i) / o <= Et);
}
function Sv(t, e) {
  const i = $v(_v(t), e), n = xv(i), o = e.map((l) => {
    if (gt(l)) return;
    const c = Un(l, i);
    return c && c.distance <= zt ? c : void 0;
  }), r = e.map((l, c) => o[c] ? { ...l, ...o[c].point } : l), s = i.map((l) => r.filter((c, d) => o[d] && kv(o[d].wall, l))), a = r.map((l, c) => {
    if (!o[c]) return;
    const [d] = sd(n.shells, [l], { openingEps: Et });
    if (!d) return;
    const h = n.shells.find((u) => u.id === d.areaId), p = n.rooms.filter((u) => Wn(
      u,
      d.x + d.inwardX * 0.01,
      d.y + d.inwardY * 0.01
    )).sort((u, m) => Math.abs(Ve(u.points)) - Math.abs(Ve(m.points)))[0] ?? h, f = `opening-${c}`;
    return { source: { ...d, areaId: f }, room: { ...p, id: f }, envelope: { ...h, id: f } };
  });
  return { walls: i, openings: r, onWalls: s, regions: n, sources: a };
}
const Aa = /* @__PURE__ */ new WeakMap();
function ld(t, e) {
  const i = Aa.get(t);
  if (i?.openings === e) return i.geometry;
  const n = Sv(t, e);
  return Aa.set(t, { openings: e, geometry: n }), n;
}
const Ta = /* @__PURE__ */ new WeakMap();
function Mv(t, e, i) {
  const n = ld(t, e), o = e.map(i), r = Ta.get(n);
  if (r && o.every((l, c) => l[0] === r.spans[c][0] && l[1] === r.spans[c][1])) return r.walls;
  const s = new Map(n.openings.map((l, c) => [l, o[c]])), a = n.walls.flatMap((l, c) => lo([l], n.onWalls[c], (d) => s.get(d)));
  return Ta.set(n, { spans: o, walls: a }), a;
}
const Ca = /* @__PURE__ */ new WeakMap();
function cd(t, e, i) {
  const n = t.x + t.inwardX * 0.01, o = t.y + t.inwardY * 0.01, r = Math.max(...e.points.map((c) => Math.hypot(c.x - n, c.y - o))) + 40;
  let s = Ca.get(i);
  s || (s = /* @__PURE__ */ new WeakMap(), Ca.set(i, s));
  const a = s.get(t), l = a?.radius === r ? a.points : co(n, o, r, i, 1e-3);
  return (!a || a.radius !== r) && s.set(t, { radius: r, points: l }), l ? { ...e, clipPoints: l } : e;
}
function Ev(t, e, i, n, o, r) {
  const { regions: { shells: s }, sources: a } = ld(t, e);
  if (s.length)
    return a.map((l) => {
      if (!l) return;
      const { source: c, room: d, envelope: h } = l, [p] = ad(d, [c], n, o, { strength: r });
      if (p)
        return { area: h, patch: cd(c, p, i) };
    });
}
function Av(t) {
  return t?.ambientDaylight === !0;
}
const Tv = [], Ia = /* @__PURE__ */ new WeakMap();
function Cv(t, e) {
  const i = t.areas.length ? t.areas : Tv, n = Ia.get(e);
  if (n?.input === t.walls && n.areas === i) return n.walls;
  const o = i.flatMap((s) => ii(s.id, s.points, s.sideWalls ?? {})).filter((s) => !s.divider), r = Fr([...t.walls, ...o]);
  return Ia.set(e, { input: t.walls, areas: i, walls: r }), r;
}
function Iv(t) {
  const e = new Set(t.map((n) => n.id)), i = /* @__PURE__ */ new Set();
  return t.map((n, o) => {
    if (!i.has(n.id))
      return i.add(n.id), n;
    let r = `${n.id}#${o}`;
    for (let s = 0; e.has(r); s++) r = `${n.id}#${o}-${s}`;
    return e.add(r), i.add(r), { ...n, id: r };
  });
}
function zv(t, e, i, n, o) {
  if (!Av(e)) return y;
  const r = new Map(t.openings.map((m) => [m.id, m])), s = (m) => {
    const b = r.get(m);
    if (!b) return 0;
    const g = zr(
      b,
      o.amount(b),
      o.secondAmount(b)
    ), w = b.shutterEntity ? Wt(i?.states[b.shutterEntity], b.shutterInvert) : 1;
    return dv(b, g, w);
  }, a = i?.states["sun.sun"]?.attributes?.elevation, l = od * Wr(Qo(Fi(e), i), Eb), c = Cv(t, e), d = Mv(c, t.openings, (m) => m.sunlight === !1 ? [0, 0] : Pr(
    m,
    o.amount(m),
    o.secondAmount(m),
    m.shutterEntity ? Wt(i?.states[m.shutterEntity], m.shutterInvert) : void 0
  )), h = Ev(c, t.openings, d, a, s, l);
  if (h !== void 0) {
    const m = h.map((b) => b ? Ea(b.area, [b.patch], { idPrefix: n }) : y);
    return m.some((b) => b !== y) ? $`${m}` : y;
  }
  const p = Iv(t.areas), f = sd(p, t.openings);
  if (f.length === 0) return y;
  const u = p.map((m) => {
    const b = ad(m, f, a, s, { strength: l }).map((g) => cd(f.find((w) => w.openingId === g.openingId && w.areaId === g.areaId), g, d));
    return b.length ? Ea(m, b, { idPrefix: n }) : y;
  });
  return u.some((m) => m !== y) ? $`${u}` : y;
}
const or = ["below", "right", "left", "above"], mi = {
  wall: 1,
  opening: 1,
  badge: 3,
  label: 3,
  outside: 4
}, Pv = 0.15;
function Ov(t, e, i, n = !1) {
  const o = t.x + t.w / 2, r = t.y + t.h / 2, { w: s, h: a } = e;
  return {
    below: n ? { x: o - s / 2, y: r - a / 2, w: s, h: a } : { x: o - s / 2, y: t.y + t.h + i.below, w: s, h: a },
    right: { x: t.x + t.w + i.side, y: r - a / 2, w: s, h: a },
    left: { x: t.x - i.side - s, y: r - a / 2, w: s, h: a },
    above: { x: o - s / 2, y: t.y - i.below - a, w: s, h: a }
  };
}
function xn(t, e) {
  const i = Math.min(t.x + t.w, e.x + e.w) - Math.max(t.x, e.x), n = Math.min(t.y + t.h, e.y + e.h) - Math.max(t.y, e.y);
  return i > 0 && n > 0 ? i * n : 0;
}
function Lv(t, e) {
  return t.w * t.h - xn(t, e);
}
function Fv(t, e) {
  const i = e.x2 - e.x1, n = e.y2 - e.y1, o = Math.hypot(i, n);
  if (!(o > 0) || !(e.half > 0) || Math.max(e.x1, e.x2) + e.half < t.x || Math.min(e.x1, e.x2) - e.half > t.x + t.w || Math.max(e.y1, e.y2) + e.half < t.y || Math.min(e.y1, e.y2) - e.half > t.y + t.h) return 0;
  const r = -n / o * e.half, s = i / o * e.half;
  let a = [
    { x: e.x1 + r, y: e.y1 + s },
    { x: e.x2 + r, y: e.y2 + s },
    { x: e.x2 - r, y: e.y2 - s },
    { x: e.x1 - r, y: e.y1 - s }
  ];
  const l = [
    (d) => d.x - t.x,
    (d) => t.x + t.w - d.x,
    (d) => d.y - t.y,
    (d) => t.y + t.h - d.y
  ];
  for (const d of l) {
    const h = [];
    for (let p = 0; p < a.length; p++) {
      const f = a[p], u = a[(p + 1) % a.length], m = d(f), b = d(u);
      if (m >= 0 && h.push(f), m >= 0 != b >= 0) {
        const g = m / (m - b);
        h.push({ x: f.x + (u.x - f.x) * g, y: f.y + (u.y - f.y) * g });
      }
    }
    if (a = h, a.length < 3) return 0;
  }
  let c = 0;
  for (let d = 0; d < a.length; d++) {
    const h = a[d], p = a[(d + 1) % a.length];
    c += h.x * p.y - p.x * h.y;
  }
  return Math.abs(c) / 2;
}
function Rv(t, e) {
  let i = 0;
  for (const n of e.walls) i += mi.wall * Fv(t, n);
  for (const n of e.openings) i += mi.opening * xn(t, n);
  for (const n of e.badges) i += mi.badge * xn(t, n);
  for (const n of e.labels) i += mi.label * xn(t, n);
  return e.bounds && (i += mi.outside * Lv(t, e.bounds)), i;
}
function Dv(t, e, i = 0) {
  let n = or[0];
  for (const o of or)
    t[o] < t[n] - 1e-6 && (n = o);
  return e && e !== n && t[n] >= t[e] - i ? e : n;
}
function Nv(t, e, i) {
  const n = /* @__PURE__ */ new Map(), o = [];
  for (const r of t) {
    const s = {
      ...i,
      labels: i.labels.concat(o),
      badges: e.filter((d) => d.key !== r.key).map((d) => d.box)
    }, a = Ov(r.badge, r.label, r.gap, r.centredBelow), l = {};
    for (const d of or) l[d] = Rv(a[d], s);
    const c = Dv(l, r.current, Pv * r.label.w * r.label.h);
    n.set(r.key, c), o.push(a[c]);
  }
  return n;
}
function dd(t) {
  return t.id || `${t.entity ?? ""}@${t.x},${t.y}`;
}
const Kt = (t) => ({ x: t.left, y: t.top, w: t.width, h: t.height });
function hd(t) {
  const e = [], i = [], n = [];
  if (t.items.forEach((r, s) => {
    const a = t.autoKey(r), l = Kt(r.getBoundingClientRect()), c = t.solid(r);
    c && i.push({ key: a ?? `#${s}`, box: Kt(c.getBoundingClientRect()) });
    const d = t.label(r);
    if (!d) return;
    const h = d.getBoundingClientRect();
    if (a === void 0) {
      n.push(Kt(h));
      return;
    }
    const p = d.offsetHeight > 0 ? h.height / d.offsetHeight : 1;
    let f = { below: 2 * p, side: 4 * p };
    if (t.scalePlan) {
      const u = parseFloat(getComputedStyle(d).fontSize) * p;
      u > 0 && (f = { below: 0.17 * u, side: 0.33 * u });
    }
    e.push({
      key: a,
      badge: l,
      label: { w: h.width, h: h.height },
      gap: f,
      centredBelow: t.centredBelow?.(r) ?? !1,
      current: t.current.get(a)
    });
  }), !e.length) return /* @__PURE__ */ new Map();
  for (const r of t.marks) i.push({ key: "", box: Kt(r.getBoundingClientRect()) });
  for (const r of t.names) n.push(Kt(r.getBoundingClientRect()));
  const o = t.openings.map((r) => Kt(r.getBoundingClientRect())).filter((r) => r.w > 0 || r.h > 0);
  return Nv(e, i, { walls: t.walls, openings: o, labels: n, bounds: t.bounds });
}
function Hv(t, e) {
  const i = Math.max(t.x, e.x), n = Math.max(t.y, e.y);
  return {
    x: i,
    y: n,
    w: Math.max(0, Math.min(t.x + t.w, e.x + e.w) - i),
    h: Math.max(0, Math.min(t.y + t.h, e.y + e.h) - n)
  };
}
const ie = class ie {
  constructor(e = {}) {
    this.playing = !1, this._startTime = e.startTime ?? 0, this._endTime = e.endTime ?? Number.MAX_SAFE_INTEGER, this.currentTime = this._startTime, this.speed = this._normalizeSpeed(e.initialSpeed ?? 1);
  }
  get startTime() {
    return this._startTime;
  }
  get endTime() {
    return this._endTime;
  }
  _normalizeSpeed(e) {
    return Number.isFinite(e) ? Math.min(ie._MAX_SPEED, Math.max(ie._MIN_SPEED, e)) : Number.isNaN(e) ? 1 : ie._MAX_SPEED;
  }
  play() {
    this.playing = !0;
  }
  pause() {
    this.playing = !1;
  }
  seek(e) {
    this.currentTime = this._clamp(e);
  }
  rewind(e) {
    this.seek(this.currentTime - e);
  }
  fastForward(e) {
    this.seek(this.currentTime + e);
  }
  setPlaybackSpeed(e) {
    Number.isFinite(e) && (this.speed = Math.min(ie._MAX_SPEED, Math.max(ie._MIN_SPEED, e)));
  }
  tick(e) {
    if (!this.playing) return;
    const i = e / 1e3;
    this.currentTime = this._clamp(this.currentTime + i * this.speed);
  }
  _clamp(e) {
    return Math.min(this._endTime, Math.max(this._startTime, e));
  }
};
ie._MIN_SPEED = 0.01, ie._MAX_SPEED = 1e3;
let Vn = ie, jv = 0;
class Wv {
  constructor(e) {
    this._card = e, this._historyService = new Oh(), this.state = {
      playbackController: new Vn(),
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
      panelId: `fp-replay-panel-${jv++}`
    };
  }
  logReplay(e, i) {
    this._card.getConfig()?.historyReplay?.debug && console.log(e, i ?? {});
  }
  getDefaultWindow() {
    return Xb(this._card.getConfig());
  }
  normalizeWindow(e, i) {
    return ma(e, i);
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
    return Zb(this._card.getConfig(), this._card.getActiveFloorId());
  }
  scopeKey() {
    return Qb(this._card.getConfig(), this._card.getActiveFloorId());
  }
  speedForRange(e, i) {
    return Jb(this._card.getConfig(), e, i);
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
  formatReplayTime(e) {
    return o0(e, new Intl.DateTimeFormat(void 0, {
      dateStyle: "short",
      timeStyle: "medium"
    }));
  }
  handleRangeChange(e, i) {
    const n = i.target, o = t0(n.value);
    e === "start" ? this.state.startTime = o : this.state.endTime = o, this.updateWindow(this.state.startTime, this.state.endTime);
  }
  updateWindow(e, i) {
    const { start: n, end: o } = ma(e, i), r = o - n;
    this.state.rangeWarning = r < 60 ? "Very small replay window may hide expected transitions." : void 0;
    const s = this.state.playbackController.playing;
    this.state.startTime = n, this.state.endTime = o, this.clearHistoryCache(), this.state.playbackController.pause(), this.stopReplayLoop(), this._card.requestUpdate(), !(!this._card.getHass() || !this.state.historyVisible) && this.startReplay({ preserveCurrentTime: !0, keepPlaying: s });
  }
  resetForFloorChange() {
    this.state.historyEvents = [], this.state.enabled = !1, this.state.ready = !1, this.state.error = void 0, this.state.loadRequested = !1, this.state.loadToken += 1, this.clearHistoryCache(), this.stopReplayLoop(), this._card.requestUpdate(), this._card.getHass() && this.state.historyVisible && this.startReplay({ preserveCurrentTime: !0, keepPlaying: this.state.playbackController.playing });
  }
  zoomWindow(e) {
    const i = Math.max(60, this.state.endTime - this.state.startTime), n = this.state.playbackController.currentTime, o = e > 0 ? Math.max(60, i * 0.8) : i * 1.25, r = o / 2, s = Math.max(0, n - r), a = s + o;
    this.updateWindow(s, a);
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
  toggleHistoryVisible(e) {
    const i = e && this._replayOffered();
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
  async startReplay(e = {}) {
    if (!this._card.getHass() || !this._card.getConfig()?.historyReplay) return;
    const i = this.state.startTime || this.getDefaultWindow().start, n = this.state.endTime || this.getDefaultWindow().end, { start: o, end: r } = this.normalizeWindow(i, n);
    this.state.startTime = o, this.state.endTime = r, this.state.enabled = !0, this.state.loadRequested = !0, this.state.error = void 0, this.state.ready = !1;
    const s = e.preserveCurrentTime ? Math.min(r, Math.max(o, this.state.playbackController.currentTime)) : o;
    this.state.playbackController = new Vn({
      startTime: o,
      endTime: r,
      initialSpeed: this.speedForRange(o, r)
    }), this.state.playbackController.seek(s), e.keepPlaying && this.state.playbackController.play();
    const a = ++this.state.loadToken;
    this.logReplay("[easy-floorplan] Starting replay", { start: o, end: r, lookback: r - o }), await this.loadReplayRange(o, r, a), e.keepPlaying && this.state.enabled && this.state.playbackController.playing && this.startReplayLoop(), this._card.requestUpdate();
  }
  async loadReplayRange(e, i, n) {
    try {
      const o = this.scopeKey();
      if (await this._historyService.loadHistory(e, i, { scopeKey: o, hass: this._card.getHass(), watched: this.watchedEntities(), numericSteps: this._card.getConfig()?.historyReplay?.numericSteps }), n !== this.state.loadToken) return;
      const r = new Set(this.watchedEntities()), s = this._historyService.getEvents();
      this.state.historyEvents = s.filter((a) => r.has(a.entityId)).map((a) => ({
        ...a,
        color: n0(a, this._card.getConfig(), this._card.getHass(), this.state.configuredColorCache, this.state.configured)
      })), this.state.ready = !0, this.state.loadRequested = !1, this.state.error = void 0, this.logReplay("[easy-floorplan] Replay history loaded", { eventCount: this.state.historyEvents.length }), this._card.requestUpdate();
    } catch (o) {
      if (n !== this.state.loadToken) return;
      this.state.ready = !1, this.state.loadRequested = !1, this.state.error = o instanceof Error ? o.message : "Unable to load history.", console.error("[easy-floorplan] Replay history loading failed", o);
    }
  }
  seekReplay(e) {
    this.state.playbackController.seek(e), this.logReplay("[easy-floorplan] Replay seek", { timestamp: e }), this._card.requestUpdate();
  }
  jumpReplay(e) {
    this.state.playbackController.seek(this.state.playbackController.currentTime + e), this.logReplay("[easy-floorplan] Replay jump", { seconds: e }), this._card.requestUpdate();
  }
  stepReplay(e) {
    if (!this.state.historyEvents.length) return;
    const i = this.state.playbackController.currentTime, n = 1e-4, o = e > 0 ? this._historyService.getEventAfter(i + n) : this._historyService.getEventBefore(i - n);
    o ? this.state.playbackController.seek(o.timestamp) : this.state.playbackController.seek(e > 0 ? this.state.playbackController.endTime : this.state.playbackController.startTime), this._card.requestUpdate();
  }
  setReplaySpeed(e) {
    this.state.playbackController.setPlaybackSpeed(e), this.logReplay("[easy-floorplan] Replay speed", { speed: e }), this._card.requestUpdate();
  }
  playReplay() {
    if (!this.state.enabled) {
      this.startReplay({ preserveCurrentTime: !0, keepPlaying: !0 });
      return;
    }
    if (!this.state.ready) {
      const e = this.state.startTime || this.state.playbackController.startTime, i = this.state.endTime || this.state.playbackController.endTime;
      this.loadReplayRange(e, i, ++this.state.loadToken);
    }
    this.state.playbackController.currentTime >= this.state.playbackController.endTime && this.state.playbackController.seek(this.state.playbackController.startTime), this.state.playbackController.play(), this.startReplayLoop(), this.logReplay("[easy-floorplan] Replay play", { currentTime: this.state.playbackController.currentTime }), this._card.requestUpdate();
  }
  pauseReplay() {
    this.state.playbackController.pause(), this.stopReplayLoop(), this.logReplay("[easy-floorplan] Replay pause", { currentTime: this.state.playbackController.currentTime }), this._card.requestUpdate();
  }
  startReplayLoop() {
    if (this.state.loopId) return;
    this.state.lastReplayFrame = void 0, this.state.uiLastUpdateFrameMs = 0;
    const e = (i) => {
      if (this.state.playbackController.playing && (this.state.lastReplayFrame === void 0 ? this.state.lastReplayFrame = i : (this.state.playbackController.tick(i - this.state.lastReplayFrame), this.state.lastReplayFrame = i, (this.state.uiLastUpdateFrameMs === 0 || i - this.state.uiLastUpdateFrameMs >= 50) && (this.state.uiLastUpdateFrameMs = i, this._card.requestUpdate())), this.state.playbackController.currentTime >= this.state.playbackController.endTime)) {
        this.pauseReplay();
        return;
      }
      this.state.loopId = window.requestAnimationFrame(e);
    };
    this.state.loopId = window.requestAnimationFrame(e);
  }
  stopReplayLoop() {
    this.state.loopId && (window.cancelAnimationFrame(this.state.loopId), this.state.loopId = void 0), this.state.lastReplayFrame = void 0;
  }
  requestUpdate() {
    this._card.requestUpdate();
  }
}
var Bv = Object.defineProperty, Uv = Object.getOwnPropertyDescriptor, be = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Uv(e, i) : e, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (o = (n ? s(e, i, o) : s(o)) || o);
  return n && o && Bv(e, i, o), o;
};
const za = /* @__PURE__ */ new Map(), yi = 3;
function Pa(t) {
  return t.map((e) => e.id).join("|");
}
let Tt = class extends fe {
  constructor() {
    super(...arguments), this._rotation = new Dh(ks, () => this.requestUpdate("_rotation")), this._focusTimerMs = 0, this._wallMaskId = `fp-wall-mask-${Tt._nextWallMaskId++}`, this._openingTween = new Rh(ks, () => this.requestUpdate()), this._glowIdBase = `fp-glow-${Tt._nextGlowId++}`, this._watchedEntities = /* @__PURE__ */ new Set(), this._nameEntities = /* @__PURE__ */ new Set(), this._autoSides = /* @__PURE__ */ new Map(), this._configSerial = 0, this._autoLayoutBase = "", this._autoLabelSig = [], this._autoLabelsMeasurable = !1, this._summaryHaEntities = /* @__PURE__ */ new Map(), this._renderEntities = /* @__PURE__ */ new Set(), this._replayController = new Wv({
      getConfig: () => this._config,
      getHass: () => this.hass,
      getActiveFloorId: () => this._activeFloorId,
      requestUpdate: () => this.requestUpdate()
    }), this._onOrientation = (t) => {
      this._portrait !== t.matches && this._rotation.finish(), this._portrait = t.matches;
    }, this._onZoomSettled = (t) => {
      t.target === t.currentTarget && (this._autoLayoutKey = void 0, this._syncAutoLabels());
    }, this._onPlanKey = (t) => {
      t.key === "ArrowRight" || t.key === "ArrowDown" ? (t.preventDefault(), this._stepFocus(1)) : t.key === "ArrowLeft" || t.key === "ArrowUp" ? (t.preventDefault(), this._stepFocus(-1)) : t.key === "Escape" && this._zoomedAreaId !== void 0 && (t.preventDefault(), this._zoomedAreaId = void 0, this._restartFocusTimer());
    }, this._onCardActivity = () => {
      this._focusTimer && this._restartFocusTimer();
    }, this._featuresOf = (t) => this.hass?.states[t]?.attributes?.supported_features ?? 0;
  }
  _syncHistoryServiceContext() {
    this._replayController.syncHistoryServiceContext();
  }
  _replayCacheKey() {
    const t = this._config?.historyReplay;
    return JSON.stringify([
      t?.enabled ?? !1,
      t?.lookbackSeconds ?? null,
      t?.defaultSpeed ?? null,
      [...this._watchedEntities].sort()
    ]);
  }
  connectedCallback() {
    if (super.connectedCallback(), this._syncMoonClock(), typeof window > "u" || !window.matchMedia) return;
    const t = window.matchMedia("(orientation: portrait)");
    this._onOrientation(t), this._unsubscribeOrientation = ra(t, this._onOrientation);
    const e = window.matchMedia("(prefers-reduced-motion: reduce)");
    e.matches && this._rotation.finish(), this._unsubscribeMotion = ra(e, (i) => {
      i.matches && this._rotation.finish();
    });
  }
  setConfig(t) {
    if (!t || typeof t != "object") throw new Error("Invalid configuration");
    const e = t;
    for (const o of ["walls", "openings", "items", "texts", "furniture", "trackers", "areas", "floors"])
      if (e[o] != null && !Array.isArray(e[o]))
        throw new Error(`Invalid configuration: "${o}" must be a list`);
    for (const o of ["width", "height", "grid", "rotation", "rotationPortrait", "rotationLandscape", "wallHeight", "wallOpacity"])
      if (e[o] != null && typeof e[o] != "number")
        throw new Error(`Invalid configuration: "${o}" must be a number`);
    il(t);
    const i = this._config;
    (i?.view !== t.view || i?.projection !== t.projection) && (this._rotation.finish(), this._viewOverride = void 0), i?.appearance !== t.appearance && (this._appearanceOverride = void 0), ["rotation", "rotationPortrait", "rotationLandscape"].some((o) => i?.[o] !== t[o]) && this._rotation.jump(0), t.showViewControls || (this._viewOverride = void 0, this._appearanceOverride = void 0, this._rotation.jump(0)), this._config = {
      ...t,
      width: t.width ?? Ct,
      height: t.height ?? Ot,
      walls: t.walls ?? [],
      openings: t.openings ?? [],
      items: t.items ?? [],
      texts: t.texts ?? [],
      furniture: t.furniture ?? []
    }, this._watchedEntities = He(this._config), this._nameEntities = bg(this._config), this._configSerial++, this._summaryDiscoveryInputs = void 0, this._syncSummaryDiscovery(), this._syncMoonClock(), this._syncHistoryServiceContext(), this._replayController.clearConfigColorCache();
    const n = this._replayCacheKey();
    if (n !== this._lastReplayCacheKey && (this._lastReplayCacheKey = n, this._replayController.historyService().clearCache()), this._replayController.syncToConfig(), !this._activeFloorId) {
      const o = yt(this._config), r = za.get(Pa(o));
      r && o.some((s) => s.id === r) && (this._activeFloorId = r);
    }
  }
  _displayConfig() {
    const t = this._config, e = this._appearanceOverride ?? gn(t.appearance);
    return {
      ...t,
      ...this._viewOverride ? { view: this._viewOverride } : {},
      appearance: e,
      // Architectural outlines stay readable at night. Actual light pools and
      // device/room state colours remain live; only environmental effects pause.
      ...e === "line-art" ? { sunlight: !1, sunDimming: !1, ambientDaylight: !1, moonlight: !1 } : {}
    };
  }
  _resetView() {
    this._viewOverride = void 0, this._appearanceOverride = void 0, this._rotation.jump(0), this._zoomedAreaId = void 0;
  }
  /**
   * HA pushes a fresh `hass` on every state change anywhere in the instance —
   * for most updates nothing on this plan moved. Skip those renders entirely.
   */
  shouldUpdate(t) {
    const e = this._syncSummaryDiscovery();
    if (!(t.size === 1 && t.has("hass"))) return !0;
    const i = t.get("hass");
    if (!i || !this.hass || e || Hl(i, this.hass, this._renderEntities) || Ze(i) !== Ze(this.hass)) return !0;
    for (const n of this._nameEntities)
      if (i.states[n] !== this.hass.states[n]) return !0;
    return !1;
  }
  /**
   * Find the entities each summarised floor gets from its linked HA areas and
   * floor (issue #234), and watch them with the rest of the plan. Runs only
   * when the config or one of the HA registries has changed. Returns whether
   * the set of discovered entities changed.
   */
  _syncSummaryDiscovery() {
    const t = this._config, e = this.hass, i = [t, e?.entities, e?.devices, e?.areas], n = this._summaryDiscoveryInputs;
    if (n && i.every((a, l) => a === n[l])) return !1;
    this._summaryDiscoveryInputs = i;
    const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
    if (t && e)
      for (const a of yt(t)) {
        if (!he(a, t.floorSummary)) continue;
        const l = pl(a, e);
        if (l.length) {
          o.set(a.id, l);
          for (const c of l) r.add(c);
        }
      }
    const s = this._renderEntities;
    return this._summaryHaEntities = o, this._renderEntities = r.size ? /* @__PURE__ */ new Set([...this._watchedEntities, ...r]) : this._watchedEntities, s.size !== this._renderEntities.size || [...this._renderEntities].some((a) => !s.has(a));
  }
  /**
   * Carry the skin as an attribute on the host, where `skinPalettes` picks it
   * up (issue #155). It has to be the host and not the template, because the
   * point is to sit *above* the `<ha-card>` a card-mod rule targets — see
   * skins.ts. Only ever a `findSkin` match, so an unrecognised `skin:` puts no
   * attribute on the element at all.
   */
  willUpdate(t) {
    if (t.has("_appearanceOverride") && this._syncMoonClock(), !t.has("_config")) return;
    const e = Mh(this._config?.skin);
    e ? this.setAttribute("data-skin", e) : this.removeAttribute("data-skin");
  }
  updated(t) {
    super.updated(t), this._syncAutoLabels(), (t.has("hass") || t.has("_activeFloorId")) && this._syncHistoryServiceContext();
    const e = Ee(this._config?.roomFocus)?.intervalMs ?? 0;
    e ? (!this._focusTimer || e !== this._focusTimerMs) && this._restartFocusTimer() : this._stopFocusTimer();
  }
  getCardSize() {
    return 6;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Gx), document.createElement("easy-floorplan-card-editor");
  }
  static getStubConfig() {
    return ih();
  }
  /**
   * Sections-view sizing (grid rows ≈ 56px): room for the 5:3 default canvas.
   * An instance method — HA calls it on the card element (getConfigElement /
   * getStubConfig are the static ones, called before any instance exists).
   */
  getGridOptions() {
    return { columns: 12, rows: 8, min_columns: 6, min_rows: 4 };
  }
  /**
   * Place the `labelPosition: auto` labels (see label-placement.ts), when —
   * and only when — something they depend on has changed: the config, the
   * floor, rotation, room zoom, the label texts' lengths, or the card's size
   * (the ResizeObserver clears the key). A hass tick that leaves every auto
   * label the same length reads no layout at all. Measured here, after Lit
   * has written the DOM and before the browser paints, so a label that moves
   * is never seen on its old side; a change asks for exactly one more render.
   *
   * Under the 3D view an auto label stays `below`: the walls stand up there,
   * and the overlay's floor-plane anchors say nothing about where their faces
   * are drawn.
   */
  _syncAutoLabels() {
    if (!this._autoLabelsMeasurable) {
      this._autoLayoutKey = void 0;
      return;
    }
    if (this._autoLabelSig.length === 0) {
      this._autoLayoutKey = void 0, this._autoSides.clear();
      return;
    }
    const t = `${this._autoLayoutBase}|${this._autoLabelSig.join(",")}`;
    if (t === this._autoLayoutKey) return;
    const e = this.renderRoot.querySelector(".plan"), i = e?.querySelector(".items");
    if (!e || !i || !this._config) return;
    !this._autoResize && typeof ResizeObserver < "u" && (this._autoResize = new ResizeObserver(() => {
      this._autoLayoutKey = void 0, this._syncAutoLabels();
    })), this._autoResize && e !== this._autoResizeTarget && (this._autoResize.disconnect(), this._autoResize.observe(e), this._autoResizeTarget = e);
    const n = i.getBoundingClientRect();
    if (!(n.width > 0 && n.height > 0)) return;
    this._autoLayoutKey = t;
    const o = this._displayConfig(), r = oa(o, this._portrait) + this._rotation.value, s = this._activeFloor(o), a = (u, m) => {
      const { p: b, d: g } = this._display(u, m, o, r);
      return { x: n.left + b.x / g.w * n.width, y: n.top + b.y / g.h * n.height, px: n.width / g.w };
    }, l = s.areas.flatMap((u) => ii(u.id, u.points, u.sideWalls ?? {})), c = [...s.walls, ...l].map((u) => {
      const m = a(u.x1, u.y1), b = a(u.x2, u.y2);
      return { x1: m.x, y1: m.y, x2: b.x, y2: b.y, half: Lt(u.thickness) * m.px / 2 };
    }), d = this.renderRoot.querySelector("ha-card"), h = d ? Hv(Kt(e.getBoundingClientRect()), Kt(d.getBoundingClientRect())) : Kt(e.getBoundingClientRect()), p = hd({
      items: [...i.querySelectorAll(":scope > .item")],
      autoKey: (u) => u.dataset.labelAuto,
      solid: (u) => u.querySelector(":scope > span > .badge, :scope > .stack .badge, :scope > .badge-space"),
      label: (u) => u.querySelector(":scope > .label"),
      centredBelow: (u) => !!u.querySelector(":scope > .badge-space"),
      current: this._autoSides,
      marks: [...i.querySelectorAll(":scope > .shutter-mark")],
      names: [...i.querySelectorAll(":scope > .area-label, :scope > .text")],
      openings: [...e.querySelectorAll("svg .fp-opening:not(.fp-opening-skylight)")],
      walls: c,
      bounds: h,
      scalePlan: e.classList.contains("scale-plan")
    });
    let f = !1;
    for (const [u, m] of p)
      this._autoSides.get(u) !== m && (f = !0);
    for (const u of [...this._autoSides.keys()]) p.has(u) || this._autoSides.delete(u);
    if (f) {
      for (const [u, m] of p) this._autoSides.set(u, m);
      this.requestUpdate();
    }
  }
  _isOn(t, e) {
    return se(t.entity, e?.states[t.entity]?.state);
  }
  /** How far open an opening should be drawn (0..1), from its entity (or default). */
  _openingAmount(t, e) {
    const i = t.entity ? e?.states[t.entity] : void 0;
    return Ge(t, i);
  }
  /** Whether an opening wears its accent: drawn open, or a cover still in transit. */
  _openingActive(t, e) {
    const i = t.entity ? e?.states[t.entity] : void 0;
    return Ko(t, i);
  }
  /**
   * The second leaf's own state for an opening with a sensor on each — a
   * two-panel slider (issue #145) or a hinged double (issue #159).
   * `undefined` — no second sensor, or a shape with only one leaf — leaves both
   * on the first entity, so nothing about a single-sensor opening changes.
   */
  _openingSecond(t, e) {
    if (!t.secondaryEntity || !_i(t)) return;
    const i = yc(t), n = e?.states[t.secondaryEntity];
    return { amount: Ge(i, n), active: Ko(i, n) };
  }
  /**
   * The same for a hinged shutter's other panel (issue #159). Read from its
   * own key and its own resolvers — the shutter answers to `shutterInvert` and
   * is drawn from `shutterAmount` / `shutterActive`, not the sash's — and only
   * for a `swing` shutter, since a roll curtain has no second panel to drive.
   */
  _shutterSecond(t, e) {
    if (!t.shutterSecondaryEntity || Se(t) !== "swing") return;
    const i = e?.states[t.shutterSecondaryEntity];
    return {
      amount: Wt(i, t.shutterInvert),
      active: pn(i, t.shutterInvert)
    };
  }
  _itemIcon(t, e) {
    return cn(
      t,
      e?.states[t.entity],
      this.hass?.entities?.[t.entity]?.icon
    );
  }
  /** The floor on show: the chosen one, the configured default, or the first. */
  _activeFloor(t) {
    const e = yt(t);
    return e.find((i) => i.id === this._activeFloorId) ?? e.find((i) => i.id === t.defaultFloor) ?? e[0];
  }
  /**
   * Walk the zoom to the next room (issue #261). The plan-zoom transition
   * animates the move, so the view travels rather than cutting — and under the
   * isometric view it frames the room where it is drawn.
   */
  _stepFocus(t) {
    const e = this._config;
    if (!e) return;
    const i = Ee(e.roomFocus), n = Ma(this._activeFloor(e).areas, i);
    n.length && (this._zoomedAreaId = Z0(n, this._zoomedAreaId, t), this._restartFocusTimer());
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
    const t = Ee(this._config?.roomFocus)?.intervalMs ?? 0;
    !t || !this.isConnected || (this._focusTimerMs = t, this._focusTimer = setTimeout(() => {
      this._focusTimer = void 0, this._stepFocus(1);
    }, t));
  }
  _stopFocusTimer() {
    this._focusTimer && clearTimeout(this._focusTimer), this._focusTimer = void 0;
  }
  _label(t, e) {
    return t.name ?? e?.states[t.entity]?.attributes?.friendly_name ?? t.entity ?? "";
  }
  disconnectedCallback() {
    this._replayController.stopReplayLoop(), this._openingTween.stop(), this._rotation.finish(), this._unsubscribeMotion?.(), this._unsubscribeMotion = void 0, this._stopFocusTimer(), this._unsubscribeOrientation?.(), this._unsubscribeOrientation = void 0, this._autoResize?.disconnect(), this._autoResize = void 0, this._autoResizeTarget = void 0, this._syncMoonClock(), super.disconnectedCallback();
  }
  _syncMoonClock() {
    const t = this.isConnected && !!this._config && Jo(this._displayConfig());
    t && this._moonClock === void 0 ? this._moonClock = setInterval(() => this.requestUpdate(), Cb) : !t && this._moonClock !== void 0 && (clearInterval(this._moonClock), this._moonClock = void 0);
  }
  _handleItemAction(t, e) {
    this.hass && Le(this, this.hass, e, $l(e, t.detail.action));
  }
  /** What a gesture on this opening would do, if anything. */
  _openingPress(t, e) {
    return Dr(t, e, this._featuresOf);
  }
  /**
   * Pressing an opening (issue #74 follow-up). Which entity answers — the
   * window/door or its shutter — is {@link openingActionForGesture}'s call;
   * from here it is the same Lovelace dispatch every device uses.
   */
  _onOpeningAction(t, e) {
    if (!this.hass) return;
    const i = this._openingPress(e, t.detail.action);
    i && Le(this, this.hass, { entity: i.entity }, i.config);
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
  _frame(t, e, i, n) {
    const o = i ?? this._activeFloor(t), r = W(t.width, Ct), s = W(t.height, Ot), a = ei(r, s, e), l = Zt(t.wallHeight), c = yt(t).flatMap((p) => p.walls);
    let d = Vo(l, c), h = 0;
    if (o?.isOutdoor) {
      const p = yt(t), f = p.filter((z) => !z.isOutdoor), u = n ?? this.hass, m = Pe(o, p, u), b = f.map((z) => Pe(z, p, u)), g = b.length ? Math.max(...b) : m, w = b.length ? Math.min(...b) : m, A = Math.max(0, g - m), M = Math.max(0, m - w), k = l * ce * (A + 1);
      d = Vo(k, c), h = l * ce * M;
    }
    return {
      w: a.w,
      h: a.h,
      // A circle enclosing the unrotated rectangle has the same projected
      // bounds at every angle. Reserve it before the first turn, not mid-flight.
      orbitSpan: t.showViewControls ? Math.SQRT2 * Math.hypot(r, s) : void 0,
      projection: zi(t.view ?? t.projection),
      wallHeight: d,
      lowerDepth: h,
      padding: 2 + Math.max(nt, ...c.map((p) => Lt(p.thickness)))
    };
  }
  /**
   * A plan point on the displayed canvas, with that canvas's size — what an
   * overlay anchor's left/top percentages are taken against.
   */
  _display(t, e, i, n) {
    const o = this._frame(i, n), r = Me(t, e, i.width, i.height, n);
    return { p: ti(r.x, r.y, o), d: qe(o) };
  }
  /** A screen-space direction out of the rotated frame, turned by the projection as well. */
  _displayDirection(t, e, i) {
    return sg(t.x, t.y, this._frame(e, i));
  }
  /** Both views read opening paint and travel through this replay-aware source. */
  _openingStyle(t, e) {
    const i = this._openingAmount(t, e), n = t.shutterEntity ? e?.states[t.shutterEntity] : void 0;
    return {
      color: xr,
      // The closed tone (issue #228). Absent, the moving parts stay
      // the wall colour, which is what a closed opening always was —
      // and that is also what an opening whose contact has dropped
      // out falls back to, so a dead sensor does not draw the same
      // emphatic "shut" as a door that really is (issue #162).
      // Guarded on `hass` for the same reason the device path is:
      // before the first states arrive every opening would read as
      // offline and the closed colour would flash off on load.
      inactive: this.hass && Yo(t, t.entity ? e?.states[t.entity]?.state : void 0) ? void 0 : t.inactiveColor,
      open: i > 0,
      amount: i,
      active: this._openingActive(t, e),
      accent: t.activeColor ?? pt,
      // Per-leaf state for a two-sensor biparting slider (issue #145).
      second: this._openingSecond(t, e),
      // External roller shutter layer (issue #74). No entity bound
      // yet → previewed shut, like a static plan.
      shutter: t.shutterEntity ? {
        amount: Wt(n, t.shutterInvert),
        active: pn(n, t.shutterInvert),
        style: Se(t),
        // The shutter's own accent, falling back to the
        // opening's and then to the skin's.
        accent: t.shutterActiveColor ?? t.activeColor ?? pt,
        flip: t.shutterFlipV,
        // Per-panel state for a two-contact hinged shutter
        // (issue #159).
        second: this._shutterSecond(t, e)
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
  _travelling(t, e) {
    const i = (r, s) => this._openingTween.value(`${t.id}:${r}`, s), n = i("leaf", e.amount ?? (e.open === !1 ? 0 : 1)), o = e.shutter;
    return {
      ...e,
      amount: n,
      open: n > 0,
      second: e.second ? { ...e.second, amount: i("leaf2", e.second.amount) } : void 0,
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
  _renderIsoLayer(t, e, i, n, o, r, s, a, l, c, d) {
    this._openingTween.setDuration(
      d && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? bl : 0
    );
    const h = (C, I) => Me(C, I, n.width, n.height, o), p = Zt(n.wallHeight), f = p * ce, u = [];
    if (t.isOutdoor) {
      const C = (F) => this._zoomedAreaId ? F.filter((B) => B.id !== this._zoomedAreaId) : F, I = (F, B) => {
        if (!this._zoomedAreaId) return F;
        const X = B.find((lt) => lt.id === this._zoomedAreaId);
        return F.filter((lt) => {
          if (lt.id === this._zoomedAreaId) return !1;
          if (X && X.points && X.points.length >= 3) {
            const dt = Dt(X.points);
            if (dt && ct(lt.points, dt.x, dt.y)) return !1;
          }
          return !0;
        });
      }, S = yt(n), _ = c ?? this.hass, P = Pe(t, S, _), L = S.filter((F) => !F.isOutdoor), N = /* @__PURE__ */ new Map();
      for (const F of L) {
        const B = Pe(F, S, _), X = N.get(B) ?? [];
        X.push(F), N.set(B, X);
      }
      const U = [];
      for (const F of S)
        if (Pe(F, S, _) >= P) {
          for (const B of F.areas)
            B.points && B.points.length >= 3 && U.push(B.points);
          if (!F.isOutdoor && F.walls.length >= 3 && F.areas.length === 0)
            for (const B of sn(F.walls, []))
              B.length >= 3 && U.push(B);
        }
      for (const [F, B] of Array.from(N.entries()).sort((X, lt) => X[0] - lt[0])) {
        const X = F < P, lt = (F - P) * f, dt = B.flatMap((V) => V.walls), _t = B.flatMap((V) => V.areas), Nt = B.flatMap((V) => V.openings), Jt = X ? _t.filter((V) => !W0(V, U)) : _t;
        if (Jt.length > 0)
          for (const V of Jt) {
            if (!V.points || V.points.length < 3) continue;
            const At = V.points.map((ae) => h(ae.x, ae.y)), Yt = Yi(V, V.entity ? c?.states[V.entity]?.state : void 0) || ut(V.color, Dn(V.zoneKind) ?? "#d6d6d6");
            u.push(di({
              kind: "roof",
              id: `slab_${V.id}`,
              isSlab: !0,
              base: At,
              z0: -6,
              z1: 0,
              color: Yt,
              opacity: V.opacity !== void 0 ? W(V.opacity, 1) : 1
            }, lt));
          }
        else if (dt.length >= 3) {
          const V = sn(dt, []);
          for (let At = 0; At < V.length; At++) {
            const Yt = V[At];
            if (Yt.length < 3) continue;
            const ae = Dt(Yt);
            if (X && ae && U.some((Ui) => ct(Ui, ae.x, ae.y)))
              continue;
            const bd = Yt.map((Ui) => h(Ui.x, Ui.y));
            u.push(di({
              kind: "roof",
              id: `slab_ring_${F}_${At}`,
              isSlab: !0,
              base: bd,
              z0: -6,
              z1: 0,
              color: "#d6d6d6"
            }, lt));
          }
        }
        const Wi = dt.map((V) => {
          const At = h(V.x1, V.y1), Yt = h(V.x2, V.y2);
          return {
            id: V.id,
            kind: V.kind,
            height: V.height,
            x1: At.x,
            y1: At.y,
            x2: Yt.x,
            y2: Yt.y,
            thickness: Lt(V.thickness) * (Xt(V) ? Ye : 1)
          };
        }), Bi = Nt.map((V) => {
          const At = h(V.x, V.y);
          return { x: At.x, y: At.y, length: V.length, angle: V.angle + o, type: V.type, sill: V.sill };
        }), x = ln(Wi, Bi, f, !1, !0);
        u.push(...x.map((V) => di(V, lt)));
        for (const V of Nt) {
          const At = an(V, dt, f), Yt = yn(V, this._travelling(V, this._openingStyle(V, c)), h, At);
          u.push(...Yt.map((ae) => di(ae, lt)));
        }
        const Q = B.flatMap((V) => Vi(V)), bt = I(Q, _t).map((V) => ({
          ...V,
          height: V.height !== void 0 ? V.height * ce : Cn(V.type ?? "gable", f),
          elevation: V.elevation !== void 0 ? V.elevation * ce : void 0
        })), ai = js(bt, h, f);
        u.push(...ai.map((V) => di(V, lt)));
      }
      const H = e.filter((F) => !L.some((B) => B.walls.some((X) => _a(F, X)))), T = H.map((F) => {
        const B = h(F.x1, F.y1), X = h(F.x2, F.y2);
        return {
          id: F.id,
          kind: F.kind,
          height: F.height,
          x1: B.x,
          y1: B.y,
          x2: X.x,
          y2: X.y,
          thickness: Lt(F.thickness) * (Xt(F) ? Ye : 1)
        };
      }), q = t.openings, it = q.map((F) => {
        const B = h(F.x, F.y);
        return { x: B.x, y: B.y, length: F.length, angle: F.angle + o, type: F.type, sill: F.sill };
      });
      u.push(...ln(T, it, f, !1, !0));
      for (const F of q) {
        const B = an(F, H, f);
        u.push(...yn(F, this._travelling(F, this._openingStyle(F, c)), h, B));
      }
      const ot = Vi(t), G = I(ot, t.areas).map((F) => ({
        ...F,
        height: F.height !== void 0 ? F.height * ce : Cn(F.type ?? "gable", f),
        elevation: F.elevation !== void 0 ? F.elevation * ce : void 0
      }));
      u.push(...js(G, h, f));
      for (const F of C(t.areas)) {
        if (!F.points || F.points.length < 3) continue;
        const B = F.points.map((dt) => h(dt.x, dt.y)), X = Yi(F, F.entity ? c?.states[F.entity]?.state : void 0) || ut(F.color, Dn(F.zoneKind) ?? "#d6d6d6"), lt = F.opacity !== void 0 ? W(F.opacity, 1) : 1;
        u.push({
          kind: "roof",
          id: `slab_${F.id}`,
          isSlab: !0,
          base: B,
          z0: -6,
          z1: 0,
          color: X,
          opacity: lt
        });
      }
    } else {
      const C = e.map((S) => {
        const _ = h(S.x1, S.y1), P = h(S.x2, S.y2);
        return {
          id: S.id,
          kind: S.kind,
          height: S.height,
          x1: _.x,
          y1: _.y,
          x2: P.x,
          y2: P.y,
          thickness: Lt(S.thickness) * (Xt(S) ? Ye : 1)
        };
      }), I = i.map((S) => {
        const _ = h(S.x, S.y);
        return { x: _.x, y: _.y, length: S.length, angle: S.angle + o, type: S.type, sill: S.sill };
      });
      u.push(...ln(C, I, p, !1));
      for (const S of i) {
        const _ = an(S, e, p);
        u.push(...yn(S, this._travelling(S, this._openingStyle(S, c)), h, _));
      }
    }
    const m = p * Bo, b = qo(m, o), g = $e(n.symbols);
    for (const C of t.furniture) {
      const I = Rt(g, C.type)?.elevation, S = I ? p * I.to : m, _ = I ? qo(S, o) : b;
      u.push(
        Ol(
          C,
          h,
          S,
          l(C),
          $`<g transform=${s || y}>
                <g transform="translate(${_.x} ${_.y})">${a(C)}</g>
              </g>`,
          I ? p * I.from : 0
        )
      );
    }
    const w = [
      ...t.openings,
      ...yt(n).filter((C) => !C.isOutdoor).flatMap((C) => C.openings)
    ], A = new Map(w.map((C) => [C.id, C])), M = yt(n).flatMap((C) => C.areas), k = yt(n).flatMap((C) => Vi(C)), z = new Map(M.map((C) => [C.id, C])), D = new Map(k.map((C) => [C.id, C])), R = /* @__PURE__ */ new Map();
    for (const C of yt(n))
      for (const I of Vi(C))
        R.set(I.id, C);
    const E = n.appearance === "line-art" ? id(u, Gt) : void 0;
    return Ll(u, (C, I) => {
      if (E && (I = $`${I}${E(C)}`), C.kind === "roof" && C.id && !C.isSlab) {
        let P = z.get(C.id);
        if (!P) {
          const L = D.get(C.id);
          if (L && L.points && L.points.length >= 3) {
            const N = Dt(L.points);
            if (N) {
              const U = R.get(C.id);
              U && (P = U.areas.find((H) => H.points && H.points.length >= 3 && ct(H.points, N.x, N.y))), P || (P = M.find((H) => H.points && H.points.length >= 3 && ct(H.points, N.x, N.y)));
            }
          }
        }
        if (P) {
          const L = Js(P);
          return $`<g class="fp-iso-roof-button"
              role=${L ? "button" : y} tabindex=${L ? "0" : y}
              aria-label=${P.name || P.id}
              @action=${(N) => this._onAreaAction(N, P)}
              .actionHandler=${te({
            hasHold: Pt(je(P, "hold")?.config),
            hasDoubleClick: Pt(je(P, "double_tap")?.config)
          })}>${I}</g>`;
        }
      }
      if (C.kind !== "panel" && C.kind !== "opening-hit") return I;
      const S = A.get(C.id);
      if (!S || !ta(S, this._featuresOf)) return I;
      const _ = C.kind === "opening-hit";
      return $`<g class="fp-iso-opening-button"
          role=${_ ? "button" : y} tabindex=${_ ? "0" : y}
          aria-label=${_ ? S.entity ? c?.states[S.entity]?.attributes?.friendly_name ?? S.entity : S.shutterEntity ?? S.type : y}
          @action=${(P) => this._onOpeningAction(P, S)}
          .actionHandler=${te({
        hasHold: Pt(this._openingPress(S, "hold")?.config),
        hasDoubleClick: Pt(this._openingPress(S, "double_tap")?.config)
      })}>${I}</g>`;
    });
  }
  _renderShutterMark(t, e, i, n, o) {
    const r = t.shutterEntity, s = o?.states[r], a = Wt(s, t.shutterInvert) > 0, l = pn(s, t.shutterInvert), c = xc(t, s, a, this.hass?.entities?.[r]?.icon), d = J(t.shutterActiveColor ?? t.activeColor) ?? pt, h = Hr(t), { p, d: f } = this._display(h.x, h.y, e, i), u = this._displayDirection(Nr(t, i), e, i), m = st(On, n), b = `translate(calc(${u.x} * ${m}), calc(${u.y} * ${m}))`, g = st(Ln, n), w = o?.states[r]?.attributes?.friendly_name ?? r;
    return v`
      <div
        class="shutter-mark ${l ? "on" : "off"}"
        data-entity=${me(r) ?? y}
        style="left:${p.x / f.w * 100}%; top:${p.y / f.h * 100}%;
               width:${g};height:${g};
               transform:translate(-50%,-50%) ${b};--fp-active:${d};"
        title="${w} · ${Pi(o, r)}"
        role="button"
        tabindex="0"
        @action=${() => {
      this.hass && Le(this, this.hass, { entity: r }, { action: "more-info" });
    }}
        .actionHandler=${te({})}
      >
        <ha-icon
          icon=${c}
          style="--mdc-icon-size:${st(Fn, n)};"
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
  _renderOpeningMark(t, e, i, n, o) {
    const r = t.entity, s = o?.states[r], a = this._openingAmount(t, o) > 0, l = this._openingActive(t, o), c = _c(t, s, a, this.hass?.entities?.[r]?.icon), d = J(t.activeColor) ?? pt, h = $c(t), { p, d: f } = this._display(h.x, h.y, e, i), u = this._displayDirection(kc(t, i), e, i), m = st(On, n), b = `translate(calc(${u.x} * ${m}), calc(${u.y} * ${m}))`, g = st(Ln, n), w = o?.states[r]?.attributes?.friendly_name ?? r;
    return v`
      <div
        class="shutter-mark ${l ? "on" : "off"}"
        data-entity=${me(r) ?? y}
        style="left:${p.x / f.w * 100}%; top:${p.y / f.h * 100}%;
               width:${g};height:${g};
               transform:translate(-50%,-50%) ${b};--fp-active:${d};"
        title="${w} · ${Pi(o, r)}"
        role="button"
        tabindex="0"
        @action=${() => {
      this.hass && Le(this, this.hass, { entity: r }, { action: "more-info" });
    }}
        .actionHandler=${te({})}
      >
        <ha-icon
          icon=${c}
          style="--mdc-icon-size:${st(Fn, n)};"
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
  _goToFloor(t, e) {
    const i = this._activeFloorId === e;
    this._activeFloorId = e, za.set(Pa(t), e), this._zoomedAreaId = void 0, !(i || !this.hass || !this._config?.historyReplay?.enabled) && this._replayController.resetForFloorChange();
  }
  /** Tapping a room zooms the plan in to it; tapping the same room again zooms back out. */
  _onAreaClick(t) {
    this._zoomedAreaId = this._zoomedAreaId === t.id ? void 0 : t.id;
  }
  /**
   * A gesture on a room (issue #181): its configured action, or — for a tap
   * with nothing configured — the zoom the room has always done.
   *
   * The fallback is what keeps this backwards compatible. Every plan drawn
   * before areas had actions has three unset gestures, so every tap still
   * zooms and hold and double-tap still do nothing.
   */
  _onAreaAction(t, e) {
    const i = je(e, t.detail.action);
    if (!i) {
      t.detail.action === "tap" && this._onAreaClick(e);
      return;
    }
    this.hass && Le(this, this.hass, { entity: i.entity }, i.config);
  }
  /**
   * A gesture on a piece of furniture (issue #284): its configured action, or —
   * for a tap with nothing configured — the floor change it already did.
   *
   * The same shape as `_onAreaAction`, and for the same reason: every plan
   * drawn before furniture had actions has three unset gestures, so a
   * staircase still changes floor on tap and nothing else answers at all.
   */
  _onFurnitureAction(t, e, i, n) {
    const o = $i(e, t.detail.action);
    if (!o) {
      t.detail.action === "tap" && n && this._goToFloor(i, n);
      return;
    }
    this.hass && Le(this, this.hass, { entity: o.entity }, o.config);
  }
  /**
   * What a piece of furniture answers to, or `undefined` for an inert piece.
   *
   * Shared by the two places its gestures can live: the visible icon, and —
   * with `showIcon: false` (issue #362) — the drawing itself. Both must agree
   * on the name, the gestures and which timers to arm, or hiding the icon
   * would quietly change what a tap does.
   */
  _furnitureControl(t, e, i, n) {
    const o = Kg(t, i, n, e.defaultFloor), r = (g) => {
      const w = $i(t, g);
      return !!w && $r({ entity: w.entity }, w.config);
    }, s = r("tap"), a = r("hold"), l = r("double_tap"), c = !!o && !$i(t, "tap");
    if (!c && !s && !a && !l) return;
    const d = s || c, h = i.find((g) => g.id === o)?.name, p = c ? h ? `Go to ${h}` : "Go to the next floor" : pb(t, this.hass, $e(e.symbols)), f = [d && "Tap", a && "Hold", l && "Double-tap"].filter(Boolean).join(", "), u = c ? i.findIndex((g) => g.id === o) > i.findIndex((g) => g.id === n) ? "mdi:stairs-up" : "mdi:stairs-down" : s ? "mdi:gesture-tap" : a ? "mdi:gesture-tap-hold" : "mdi:gesture-double-tap";
    return { tappable: d, hasHold: a, hasDoubleClick: l, name: p, gestures: f, icon: u, onAction: (g) => this._onFurnitureAction(g, t, i, o), onKeydown: (g) => {
      g.key !== "Enter" && g.key !== " " || (g.preventDefault(), g.stopImmediatePropagation(), d && !g.repeat && this._onFurnitureAction(new CustomEvent("action", { detail: { action: "tap" } }), t, i, o));
    } };
  }
  /**
   * The furniture drawing as its own hit target, for a piece whose icon is
   * hidden (issue #362). A piece with an icon, or with nothing to do, is
   * drawn as-is and passes taps through to the room (#323).
   */
  _furnitureHit(t, e, i, n, o) {
    if (t.showIcon !== !1) return e;
    const r = this._furnitureControl(t, i, n, o);
    return r ? $`<g class="fp-furniture-hit"
        data-id=${wt(t.id) ?? y}
        role=${r.tappable ? "button" : "group"}
        tabindex=${r.tappable ? "0" : y}
        aria-label=${r.name}
        aria-description=${`${r.gestures} actions`}
        @action=${r.onAction}
        @keydown=${r.onKeydown}
        .actionHandler=${te({ hasHold: r.hasHold, hasDoubleClick: r.hasDoubleClick })}>
      <title>${`${r.name} · ${r.gestures}`}</title>
      ${e}
      <rect class="fp-furniture-focus" aria-hidden="true"
          x=${-t.w / 2 - yi} y=${-t.h / 2 - yi}
          width=${t.w + yi * 2} height=${t.h + yi * 2}
          rx=${yi}
          transform="translate(${t.x} ${t.y}) rotate(${t.angle ?? 0})" />
    </g>` : e;
  }
  /** The visible control owns gestures; the furniture drawing always lets room taps through. */
  _renderFurnitureAction(t, e, i, n, o, r) {
    if (t.showIcon === !1) return y;
    const s = this._furnitureControl(t, e, o, r);
    if (!s) return y;
    const a = this._frame(e, i), l = Me(t.x, t.y, e.width, e.height, i), c = ti(l.x, l.y, a, Zt(e.wallHeight) * Bo), d = qe(a), h = st(Gd, n);
    return v`<div
        class="fp-furniture-link"
        data-id=${wt(t.id) ?? y}
        style="left:${c.x / d.w * 100}%;top:${c.y / d.h * 100}%;width:${h};height:${h};"
        title=${`${s.name} · ${s.gestures}`}
        role=${s.tappable ? "button" : "group"}
        tabindex=${s.tappable ? "0" : y}
        aria-label=${s.name}
        aria-description=${`${s.gestures} actions`}
        @action=${s.onAction}
        @keydown=${s.onKeydown}
        .actionHandler=${te({ hasHold: s.hasHold, hasDoubleClick: s.hasDoubleClick })}>
      <ha-icon
        icon=${s.icon}
        aria-hidden="true"
        style="--mdc-icon-size:${st(Kd, n)};"
      ></ha-icon>
    </div>`;
  }
  _renderBadge(t, e, i, n) {
    const o = W(t.size, ne), r = st(o, i), s = t.entity ? n?.states[t.entity] : void 0, a = sc(t, s?.state, s?.attributes), l = Li(t) === "value" ? hc(n, t) : void 0;
    return v`
      <div
        class="badge"
        style="width:${r};height:${r};transform:rotate(${Sc(W(t.angle, 0), e)}deg);"
      >
        ${l ? v`<span
              class="badge-value"
              style="font-size:${st(fc(o, l), i)};"
              >${l}</span
            >` : v`<ha-icon
              class=${a ? `anim-${a}` : ""}
              icon=${this._itemIcon(t, n)}
              style="--mdc-icon-size:${st(cc(o), i)};"
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
  _startInk(t) {
    const e = t.currentTarget, i = e?.querySelector(".press-ink");
    if (!i) return;
    const n = e.getBoundingClientRect();
    i.style.setProperty("--fp-ink-x", `${t.clientX - n.left}px`), i.style.setProperty("--fp-ink-y", `${t.clientY - n.top}px`), i.classList.remove("inking"), i.offsetWidth, i.classList.add("inking");
  }
  _renderItem(t, e, i, n, o) {
    const r = this._isOn(t, o), s = Ql(o, t), a = Lr(t), l = a === "auto" ? dd(t) : void 0, c = l === void 0 ? a : this._autoLabelsMeasurable && this._autoSides.get(l) || "below";
    l !== void 0 && s && this._autoLabelSig.push(`${l}:${s.length}`);
    const d = t.entity ? o?.states[t.entity] : void 0, h = Rr(t, d), p = J(so(t.stateColor, h)), f = tc(t, p), u = !!this.hass && Yo(t, d?.state), m = zg(t, d?.state, o), b = Li(t) !== "none", g = t.display ?? "badge", w = Wl(d), A = J(t.activeColor) ?? w, M = r || u ? void 0 : J(t.inactiveColor), k = t.rippleColor ?? p ?? t.activeColor ?? w ?? pt, z = ul(
      mn(
        p ?? (r ? A : M),
        this._config?.palette
      )
    ), D = t.rippleSize ?? Qn, E = _b(t.rippleDirection ?? Jn, i) * Math.PI / 180, C = this._displayDirection({ x: Math.sin(E), y: -Math.cos(E) }, e, i), I = (Math.atan2(C.x, -C.y) * 180 / Math.PI + 360) % 360, S = t.rippleWidth ?? to, _ = m ? "visibility: hidden; pointer-events: none;" : "";
    let P = y, L = !1;
    if (g === "ripple")
      P = v`<span style="${_}">
        ${Nn(r, k, D, I, S, 3, n)}
      </span>`;
    else if (g === "iconRipple")
      P = v`<div class="stack" style="${_}">
        ${Nn(r, k, D, I, S, 3, n)}
        ${b ? v`<div class="stack-icon">${this._renderBadge(t, i, n, o)}</div>` : y}
      </div>`;
    else if (b)
      P = v`<span style="${_}">
        ${this._renderBadge(t, i, n, o)}
      </span>`;
    else if (s && (c !== "below" || a === "auto")) {
      L = !0;
      const T = st(W(t.size, ne), n);
      P = v`<span
        class="badge-space"
        aria-hidden="true"
        style="width:${T};height:${T};"
      ></span>`;
    }
    const { p: N, d: U } = this._display(t.x, t.y, e, i), H = By(t);
    return v`
      <div
        class="item fp-item ${r ? "on" : "off"} ${u ? "offline" : ""} ${p ? "state-colored" : ""} ${M ? "inactive-colored" : ""} ${H ? "interactive" : ""}"
        data-id=${wt(t.id) ?? y}
        data-entity=${me(t.entity) ?? y}
        data-kind=${wt(t.kind) ?? y}
        data-label-auto=${l ?? y}
        style="left:${N.x / U.w * 100}%; top:${N.y / U.h * 100}%;${p ? `--fp-state:${p};` : ""}${A ? `--fp-active:${A};` : ""}${M ? `--fp-inactive:${M};` : ""}${z ? `--fp-ink:${z};` : ""}"
        title=${this._label(t, o)}
        role=${H ? "button" : y}
        tabindex=${H ? "0" : y}
        @action=${(T) => this._handleItemAction(T, t)}
        .actionHandler=${te({
      hasHold: Pt(t.hold_action),
      hasDoubleClick: Pt(t.double_tap_action),
      // Unbinds the gesture listeners outright, so keyboard activation
      // cannot reach an action that would do nothing.
      disabled: !H
    })}
        @pointerdown=${H && dn(e) === "ripple" ? (T) => this._startInk(T) : y}
      >
        ${P}
        ${H && dn(e) === "ripple" ? v`<span class="press-ink" aria-hidden="true"></span>` : y}
        ${s ? v`<span
              class="label ${P === y ? "inflow" : ""} label-${c} ${L && c === "below" ? "centred" : ""}"
              style="font-size:${st(Jl(t.labelSize), n)};${f ? `color:${f};` : ""}"
              >${s}</span
            >` : y}
      </div>
    `;
  }
  _renderAreaLabel(t, e, i, n) {
    if (!t.name || (t.showName ?? !0) === !1) return y;
    const o = Dc(t.points), { p: r, d: s } = this._display(o.x, o.y, e, i), a = Lg(t.labelSize, n);
    return v`
      <div
        class="area-label"
        style="left:${r.x / s.w * 100}%; top:${r.y / s.h * 100}%;${a}"
      >
        ${t.name}
      </div>
    `;
  }
  _renderText(t, e, i, n) {
    const { p: o, d: r } = this._display(t.x, t.y, e, i);
    return v`
      <div
        class="text fp-text"
        data-id=${wt(t.id) ?? y}
        style="left:${o.x / r.w * 100}%; top:${o.y / r.h * 100}%;
               font-size:${st(W(t.size, vi), n)};
               color:${ut(t.color, fl)};
               transform:translate(-50%,-50%) scale(var(--fp-inv-zoom,1)) rotate(${wb(W(t.angle, 0), i)}deg);"
      >
        ${Cr(this.hass, t)}
      </div>
    `;
  }
  render() {
    if (!this._config) return v`${y}`;
    const t = this._displayConfig(), e = t.appearance === "line-art", i = this._replayController.getRenderState(), n = uh(this.hass, this._renderEntities, this._replayController.historyService(), i.enabled, i.currentTime), o = yt(t), r = this._activeFloor(t), s = Fc(r, Ze(this.hass)), a = oa(t, this._portrait), l = Ke(a + this._rotation.target), c = a + this._rotation.value, d = this._frame(t, c, r, n), h = qe(d), p = Mc(t.width, t.height, c), f = d.projection === "iso";
    this._autoLabelsMeasurable = !f && !this._rotation.running, this._autoLabelSig = [];
    const u = f && d.wallHeight > 0;
    u || this._openingTween.stop();
    const m = Pl(d), b = nt + (f ? d.wallHeight : 0), g = r.furniture.map(
      (x) => Bc(x, x.entity ? n?.states[x.entity] : void 0, $e(t.symbols))
    ), w = g.flat(), A = g.map((x, Q) => x.length === 1 ? x[0] : { ...r.furniture[Q], x: x[0].x, y: x[0].y }), M = (x) => this._furnitureHit(x, ki(
      x,
      Us(x, x.entity ? n?.states[x.entity]?.state : void 0) ?? (e ? Gt : void 0),
      $e(t.symbols)
    ), t, o, r.id), k = (x) => Us(x, x.entity ? n?.states[x.entity]?.state : void 0) ?? J(x.color) ?? dl, z = zn(t.overlayScale), D = z === "plan" ? Pn(t.overlayMinWidth) : void 0, R = t.sunDimming ? $b(
      n?.states["sun.sun"]?.attributes?.elevation,
      W(t.sunBrightnessMin, fr),
      W(t.sunBrightnessMax, Sn)
    ) : Sn;
    let E = r.isOutdoor && r.haFloor ? yt(t).filter((x) => !x.isOutdoor && x.haFloor !== void 0 && String(x.haFloor) === String(r.haFloor)) : [];
    if (r.isOutdoor && E.length === 0) {
      const x = yt(t).filter((bt) => !bt.isOutdoor), Q = x.find((bt) => Pe(bt, yt(t), n) === 0) ?? x[0];
      E = Q ? [Q] : [];
    }
    const C = E.flatMap((x) => x.walls), I = E.flatMap((x) => x.openings), S = r.isOutdoor ? r.walls.filter((x) => !C.some((Q) => _a(x, Q))) : r.walls, _ = r.isOutdoor ? [...r.openings.filter((x) => !I.some((Q) => Q.id === x.id)), ...I] : [...r.openings, ...I], P = r.areas.flatMap((x) => ii(x.id, x.points, x.sideWalls ?? {})), L = [...S, ...C, ...P], N = u ? L.filter((x) => !x.divider) : [], U = u ? L.filter((x) => x.divider) : [], H = Fr(
      P.some((x) => x.divider) ? L.filter((x) => !x.divider) : L
    ), T = t.showDeadSpaces ? sn(H, _) : [], q = Qc(
      r.areas,
      e ? "off" : Vr(t),
      Zc(this.hass, t.skin)
    ), ot = t.sunDimming || r.items.some((x) => x.glow) ? lo(
      H,
      _,
      (x) => (
        // Both leaves, and the travel each style actually has (issue #145):
        // asking `entity` alone left a door whose *second* panel was open
        // still blocking light outright. Glass admits it whole regardless
        // of sash — a closed window is not a hole, but light still gets
        // through it. A shutter rolled down overrides that, same as it
        // does for sunlight.
        Pr(
          x,
          this._openingAmount(x, n),
          this._openingSecond(x, n)?.amount,
          x.shutterEntity ? Wt(n?.states[x.shutterEntity], x.shutterInvert) : void 0
        )
      )
    ) : H, G = {
      // The gap each style actually clears, both leaves included — the same
      // reading the lamps get above, and for the same reason (#145): `entity`
      // alone leaves a door whose *second* panel is open reading as shut, and
      // a converging pair reading as twice as clear as it draws. Glazing and
      // shutters are applied on top of this, inside openingSunFraction.
      openAmount: (x) => zr(
        x,
        this._openingAmount(x, n),
        this._openingSecond(x, n)?.amount
      ),
      // A shutter that is all the way down stops the light, as one does.
      // Undefined where none is bound, so an opening without a shutter is
      // judged on itself alone.
      shutterOpen: (x) => x.shutterEntity ? Wt(n?.states[x.shutterEntity], x.shutterInvert) : void 0,
      // How far a skylight's patch slides from the roof light before it
      // lands. Handed on raw: it is a fraction of the reach, which already
      // carries the light's height, so scaling it here would apply 1/tan
      // twice and pin every patch under its own skylight at noon. Bounded at
      // the sink, in skylightDropFraction.
      drop: t.skylightDrop,
      // Where the light comes in over a balcony's edge rather than through
      // an opening. Kept out of blockingWallSegments, so passed on their own.
      railings: L.filter((x) => Xt(x) && !x.divider)
    }, F = Jo(t) ? zb(
      t,
      i.enabled ? i.currentTime * 1e3 : Date.now(),
      this.hass?.config,
      n?.states["sun.sun"]?.attributes?.elevation,
      Qo(Fi(t), n)
    ) : void 0, B = (x, Q) => {
      if (!F) return y;
      const bt = {
        ...G,
        dir: F.dir,
        strength: F.strength,
        // Shortened as the moon climbs, exactly as the sun's is.
        reach: W(t.sunReach, Ri) * ha(F.altitude),
        light: Q,
        // The night is the shade; a second one would darken it twice.
        shade: null
      };
      return r.isOutdoor ? ua(H, t.width, t.height, x, bt) : pa(H, _, t.width, t.height, x, bt);
    }, X = `${this._glowIdBase}-sundim`, lt = t.sunDimming ? Ag(
      r.items,
      n?.states,
      t.width,
      t.height,
      X,
      ot,
      B(`${this._wallMaskId}-moondim`, "#000")
    ) : y, dt = Ee(t.roomFocus), _t = Ma(r.areas, dt), Nt = r.areas?.find((x) => x.id === this._zoomedAreaId);
    this._autoLayoutBase = `${this._configSerial}|${r.id}|${c}|${z}|${this._zoomedAreaId ?? ""}`;
    const Jt = Nt ? Vb(
      Nt.points,
      t.width,
      t.height,
      c,
      void 0,
      void 0,
      // A room may say how close to go; without one the fit decides,
      // exactly as it always has (issue #222).
      qb(Nt),
      d
    ) : er, Wi = t.compactHeader === !0, Bi = Wi && !!t.title;
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
        .header=${Wi ? y : t.title ?? y}
        style=${Gc(t.palette) || y}
        @pointerdown=${this._onCardActivity}
        @keydown=${this._onCardActivity}
      >
        <div class="card-shell ${this._replayController.isHistoryVisible() ? "replay-visible" : ""}">
          ${this._config.historyReplay?.enabled ? this._renderReplayPanel() : y}
          <div
            class="stage press-${dn(t)} offline-${dc(t)} ${Bi ? "compact-title" : ""}"
            style="aspect-ratio: ${h.w} / ${h.h};"
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
            class="plan ${z === "plan" ? "scale-plan" : ""} ${e ? "line-art" : ""} ${this._rotation.running ? "rotating" : ""}"
            tabindex=${_t.length > 1 ? "0" : y}
            role=${_t.length > 1 ? "group" : y}
            aria-label=${_t.length > 1 ? "Floor plan. Use the arrow keys to move between rooms, Escape to see the whole plan." : y}
            @keydown=${_t.length > 1 ? this._onPlanKey : y}
            style="aspect-ratio: ${h.w} / ${h.h};
                   width: min(100%, calc(100cqh * ${h.w} / ${h.h}));
                   --fp-plan-w: ${h.w};
                   --fp-wall-opacity: ${e ? 1 : zl(t.wallOpacity)};
                   ${D === void 0 ? "" : `--fp-min-w: ${D}px;`}
                   background:${e ? "#fff" : ut(t.background, Ni)};"
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
            @transitionend=${this._onZoomSettled}
            style="transform: translate(${Jt.txPercent}%, ${Jt.tyPercent}%) scale(${Jt.scale});"
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
          ${Po(
      `${t.skin ?? ""}|${Kc(t.palette)}|${t.appearance}`,
      $`<svg viewBox="0 0 ${h.w} ${h.h}" preserveAspectRatio="none">
            <g transform=${m || y}>
            <g transform=${p || y}>
            ${s ? $`<image class="fp-floor-image" href=${s.href} x="0" y="0" width=${t.width} height=${t.height}
                          preserveAspectRatio=${Rc(r.imageFit)}
                          opacity=${r.imageOpacity ?? 1}
                          style=${s.filter ? `filter: ${s.filter}` : y} />` : y}
            ${r.areas?.map((x, Q) => {
        const bt = Js(x);
        return $`<g class="area-tap-target"
                    role=${bt ? "button" : y}
                    tabindex=${bt ? "0" : y}
                    @action=${(ai) => this._onAreaAction(ai, x)}
                    .actionHandler=${te({
          // Only wait out the timers when a gesture can resolve:
          // otherwise every tap on an ordinary room would sit for
          // 500ms before zooming.
          hasHold: Pt(je(x, "hold")?.config),
          hasDoubleClick: Pt(je(x, "double_tap")?.config)
        })}>
                  ${jc(
          e ? {
            ...x,
            color: "#fff",
            opacity: 1,
            activeOpacity: x.activeOpacity ?? x.opacity ?? 0.25
          } : x,
          Yi(x, x.entity ? n?.states[x.entity]?.state : void 0),
          q[Q]
        )}
                </g>`;
      })}
            <!-- Diffuse sky light (PR #204). Reads its opening travel, shutter
                 state and sun elevation through the same replay-aware state
                 source as every other light layer, so a replayed plan shows the
                 daylight of the moment being replayed rather than of now. -->
            ${r.isOutdoor ? y : zv(
        r,
        t,
        n,
        `${this._wallMaskId}-ambient`,
        {
          amount: (x) => this._openingAmount(x, n),
          secondAmount: (x) => this._openingSecond(x, n)?.amount
        }
      )}
            <!-- Dead spaces (issue #88): the regions the walls seal off that no
                 door or window reaches, hatched. Above the room fills, so a
                 region someone has also drawn an area over still reads as
                 unreachable; below everything else, because it describes the
                 floor rather than anything standing on it. -->
            ${T.length ? $`${Nc(`${this._wallMaskId}-dead`)}
                    ${T.map(
        (x) => Hc(x, `${this._wallMaskId}-dead`)
      )}` : y}
            <!-- Light pools (issue #6). Above the room fills but below the
                 furniture and walls, so light reads as cast onto the floor
                 rather than painted over the plan. Isolated as one layer: the
                 pools screen-blend with each other (two lamps brighten where
                 they meet) without screening against the plan beneath, which
                 would wash out on a light theme. -->
            ${Kl(
        w,
        t.width,
        t.height,
        `${this._glowIdBase}-mask`,
        $e(t.symbols)
      )}
            <g class="fp-glows"
               mask=${r.furniture.length ? `url(#${this._glowIdBase}-mask)` : y}>
              ${r.items.map((x, Q) => {
        if (!x.glow) return y;
        const bt = In(x, n?.states[x.entity]);
        return bt ? Bl(x, bt, `${this._glowIdBase}-${Q}`, ot) : y;
      })}
            </g>
            ${u ? y : w.map(M)}
            <!-- Sunlight through the openings. Under the walls on purpose:
                 light lands on the floor, and the walls stay crisp lines over
                 it rather than being tinted by the patches they let in. The
                 sun dimming further down is the whole-sky reading and still
                 has the last word — at night there is nothing to let in. -->
            ${(() => {
        if (!t.sunlight) return y;
        const x = {
          dir: Wb(
            t,
            n?.states["sun.sun"]?.attributes?.azimuth
          ),
          strength: Sb(
            t,
            n?.states["sun.sun"]?.attributes?.elevation
          ),
          // The clouds (issue #201) thin what the sun lights and
          // leave its shade, and a pinned plan ignores them the
          // same way — see sunThroughCloud.
          direct: Mb(t, Qo(Fi(t), n)),
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
          reach: W(t.sunReach, Ri) * (ze(t) ? 1 : ha(n?.states["sun.sun"]?.attributes?.elevation)),
          ...G,
          light: t.sunlightColor ?? fn,
          shade: t.sunShade === !1 ? null : t.sunShadeColor ?? Xe
        };
        return r.isOutdoor ? ua(
          H,
          t.width,
          t.height,
          `${this._wallMaskId}-sun`,
          x
        ) : pa(
          H,
          _,
          t.width,
          t.height,
          `${this._wallMaskId}-sun`,
          x
        );
      })()}
            <!-- Moonlight (issue #201): the same light through the same
                 openings, cool rather than warm, once the sun has set. -->
            ${F ? $`<g class="fp-moonlight">${B(`${this._wallMaskId}-moon`, Ab)}</g>` : y}
            ${Ur(_, t.width, t.height, this._wallMaskId)}
            ${(u ? U : L).map(
        (x) => $`
                <g class="fp-wall-neon"><line x1=${x.x1} y1=${x.y1} x2=${x.x2} y2=${x.y2}
                      class="wall fp-wall ${Xt(x) ? "railing" : ""}"
                      data-id=${wt(x.id) ?? y}
                      mask=${`url(#${this._wallMaskId})`}
                      style=${x.divider ? nc() : ic(x.thickness, x.kind)}
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
        (x, Q) => Wc(
          x,
          Yi(x, x.entity ? n?.states[x.entity]?.state : void 0),
          `${this._wallMaskId}-area-${Q}`
        )
      )}
            </g>
            <!-- LED strips (issue #298), above the flat walls: one snapped
                 onto a wall would be buried under it. Drawn in the isometric
                 view too, on the floor where its pool is — an off strip has
                 no icon of its own to fall back on (review on #372). -->
            ${r.items.map((x) => {
        const Q = x.glow ? Te(x) : void 0;
        return Q ? Gl(Q, In(x, n?.states[x.entity])?.color) : y;
      })}
            ${jt(
        // Keyed by id: switching floors must create fresh DOM nodes.
        // Unkeyed, Lit morphs floor A's openings into floor B's, and the
        // 0.5s leaf/panel transitions animate the leftover state — a
        // window briefly plays a door swing (issue #50).
        u ? [] : _,
        (x, Q) => x.id || Q,
        (x) => {
          const Q = jr(x, this._openingStyle(x, n));
          if (!ta(x, this._featuresOf)) return Q;
          const bt = Xo(x);
          return $`<g class="fp-opening" role="button" tabindex="0"
                    @action=${(ai) => this._onOpeningAction(ai, x)}
                    .actionHandler=${te({
            // Only wait out the hold/double-tap timers when a gesture
            // actually resolves: otherwise every tap on a plain
            // contact sensor would sit for 500ms before answering.
            hasHold: Pt(this._openingPress(x, "hold")?.config),
            hasDoubleClick: Pt(this._openingPress(x, "double_tap")?.config)
          })}>
                  ${Q}
                  <rect class="fp-opening-hit"
                        x=${x.x - bt.width / 2} y=${x.y - bt.height / 2}
                        width=${bt.width} height=${bt.height}
                        transform="rotate(${x.angle} ${x.x} ${x.y})" />
                </g>`;
        }
      )}
            ${jt(
        r.trackers ?? [],
        (x, Q) => x.id || Q,
        (x) => Uc(x, {
          editing: !1,
          xReading: Hn(n?.states, x.xSensor?.entity),
          yReading: Hn(n?.states, x.ySensor?.entity),
          xPresent: An(n?.states, x.xSensor?.presence),
          yPresent: An(n?.states, x.ySensor?.presence)
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
        { ...r, furniture: w },
        N,
        _,
        t,
        c,
        d,
        p,
        M,
        k,
        n,
        // Scrubbing history jumps from state to state on purpose;
        // easing between them would trail the scrubber.
        !i.enabled
      ) : y}
            <g transform=${p || y}>
            ${t.sunDimming ? $`${lt}<rect class="fp-sun-dim"
                            x=${-b} y=${-b}
                            width=${t.width + b * 2}
                            height=${t.height + b * 2}
                            fill="#000"
                            mask=${lt === y ? y : `url(#${X})`}
                            opacity=${1 - R} />` : y}
            </g>
            </g>
          </svg>`
    )}
          <div
            class="items"
            style="--fp-inv-zoom:${Yb(Jt.scale, t.zoomedOverlayScale)};--fp-furniture-inv-zoom:${1 / Jt.scale};"
          >
            ${r.areas?.map((x) => this._renderAreaLabel(x, t, c, z))}
            ${r.texts.map((x) => this._renderText(x, t, c, z))}
            ${jt(
      // Keyed like the openings above: a floor switch must build fresh
      // nodes rather than morph one floor's badges into another's.
      r.openings.filter((x) => bc(x)),
      (x, Q) => `${x.id || Q}-shutter`,
      (x) => this._renderShutterMark(x, t, c, z, n)
    )}
            ${jt(
      r.openings.filter((x) => wc(x)),
      (x, Q) => `${x.id || Q}-opening`,
      (x) => this._renderOpeningMark(x, t, c, z, n)
    )}
            ${jt(
      A,
      (x, Q) => x.id || Q,
      (x) => this._renderFurnitureAction(x, t, c, z, o, r.id)
    )}
            ${jt(
      // No entity filter: devices that exist physically but have no HA
      // entity still deserve their badge (issue #39). Keyed by id so a
      // floor switch builds fresh DOM (see the openings comment).
      // "Only when active" devices drop out here (issue #55), and so do
      // the ones that only show inside their own room (#222) — the
      // editor still draws them, dimmed, so they stay editable.
      r.items.filter(
        (x) => !Xl(
          x,
          x.entity ? n?.states[x.entity]?.state : void 0,
          n
        ) && !Ig(x, Nt)
      ),
      (x, Q) => x.id || Q,
      (x) => this._renderItem(x, t, c, z, n)
    )}
          </div>
          </div>
          ${Jt.scale > 1 ? v`<button
                class="zoom-out"
                title="Zoom out"
                aria-label="Zoom out"
                @click=${() => this._zoomedAreaId = void 0}
              >
                <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
              </button>` : y}
          ${dt?.controls && _t.length > 1 ? v`<div class="room-focus" role="group" aria-label="Move between rooms">
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
              </div>` : y}
          ${Bi ? v`<div class="plan-title">${t.title}</div>` : y}
          <!-- Outside the zoom wrapper on purpose, placed or not (issue #281).
               The buttons are how you change floor, and zoom-to-room can scale
               the plan well past the card: carried along, a switcher placed in
               the hall would leave the viewport the moment you tapped a room at
               the other end, and there would be no way to change floor until
               you zoomed back out. A control you can lose is a worse failure
               than one that overlaps the drawing for as long as a zoom lasts —
               and the position is chosen against the view people spend their
               time in, which is the unzoomed one. -->
          ${o.length > 1 || o.some((x) => he(x, t.floorSummary)) ? this._renderFloorSwitcher(o, r, t, c, n) : y}
        </div>
        </div>
        ${t.showViewControls ? G0({
      view: f ? "3d" : "2d",
      appearance: gn(t.appearance),
      rotation: l,
      canReset: !!(this._viewOverride || this._appearanceOverride || this._rotation.target || this._rotation.running || this._zoomedAreaId),
      exportEnabled: !!t.showExport,
      setView: (x) => {
        this._rotation.finish(), this._viewOverride = x === (zi(this._config.view ?? this._config.projection) === "iso" ? "3d" : "2d") ? void 0 : x;
      },
      setAppearance: (x) => {
        this._appearanceOverride = x === gn(this._config.appearance) ? void 0 : x;
      },
      rotate: (x) => this._rotation.turn(x, f && this.isConnected && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches),
      reset: () => this._resetView(),
      download: () => ka(t, r, l)
    }) : t.showExport ? v`<div class="export-bar">
          <button type="button" title=${`Download line art of ${r.name} as SVG`}
            @click=${() => ka(t, r, l)}>Export SVG</button>
        </div>` : y}
        </div>
      </ha-card>
    `;
  }
  _renderReplayPanel() {
    return l0(a0(this._replayController));
  }
  _renderFloorSwitcher(t, e, i, n = 0, o) {
    const r = gi(i), s = r ? Me(r.x, r.y, W(i.width, Ct), W(i.height, Ot), n) : void 0, a = ei(W(i.width, Ct), W(i.height, Ot), n), l = t.map((c) => {
      const d = he(c, i.floorSummary) ? dh(c, o, i.floorSummary, this._summaryHaEntities.get(c.id) ?? []) : void 0;
      return d?.enabled && d.badgeText ? d : void 0;
    });
    return v`
      <div
        class="floor-switcher ${nl(i)} ${s ? "placed" : ""} ${l.some(Boolean) ? "has-summaries" : ""}"
        part="floor-switcher"
        role="group"
        aria-label="Select floor"
        style=${s ? `left:${s.x / a.w * 100}%; top:${s.y / a.h * 100}%;` : y}
      >
        ${t.map((c, d) => {
      const h = c.id === e.id ? J(c.color) : void 0, p = l[d], f = p?.tooltip || c.name;
      return v`
            <button
              type="button"
              class="floor-button ${c.id === e.id ? "active" : ""} ${p ? "has-summary" : ""}"
              part=${c.id === e.id ? "floor-button floor-button-active" : "floor-button"}
              data-floor-id=${c.id}
              title=${f}
              aria-label=${f}
              aria-pressed=${c.id === e.id ? "true" : "false"}
              style=${h ? `--fp-floor-accent:${h};` : y}
              @click=${() => this._goToFloor(t, c.id)}
            >
              ${p ? v`
                    <span class="floor-button-title">${c.short || c.name}</span>
                    <span class="floor-button-summary">${p.badgeText}</span>
                  ` : c.short || c.name}
            </button>
          `;
    })}
      </div>
    `;
  }
};
Tt._nextWallMaskId = 0;
Tt._nextGlowId = 0;
Tt.styles = [
  ml,
  Eh,
  ol,
  re`
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
    .plan.scale-plan .item > .label.label-above {
      top: auto;
      bottom: calc(100% + 0.17em);
    }
    .plan.scale-plan .item > .label.label-below.centred {
      top: 50%;
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
      /* The visible circle is the whole hit target. Under overlayScale: fixed
         it stays finger-sized, independent of canvas scale, projection and
         room zoom; under plan it scales with the drawing like the badges. */
      box-sizing: border-box;
      /* width, height and the glyph size are inline: they follow overlayScale. */
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
      pointer-events: none;
    }
    /* A piece whose icon is hidden (issue #362): the drawing is the target. */
    .fp-furniture-hit { cursor: pointer; outline: none; }
    .fp-furniture-hit .fp-furniture { pointer-events: auto; }
    /* CSS outline on an SVG <g> is not painted reliably, so keyboard focus
       draws a stroked box around the piece instead: 2 screen pixels at any
       canvas scale. */
    .fp-furniture-focus {
      display: none;
      fill: none;
      stroke: var(--fp-skin-text, var(--primary-text-color, #212121));
      stroke-width: 2;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .fp-furniture-hit:focus-visible .fp-furniture-focus { display: inline; }
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
    .fp-iso-roof .fp-iso-face, polygon.fp-iso-roof {
      fill: var(--fp-iso-color, #8d6e63);
      stroke: rgba(0, 0, 0, 0.28);
      stroke-width: 1.2;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .fp-iso-roof.fp-iso-slab .fp-iso-face,
    .fp-iso-slab .fp-iso-face {
      stroke: none;
    }
    .fp-iso-roof-line {
      stroke: rgba(0, 0, 0, 0.28);
      stroke-width: 1.2;
      stroke-linecap: round;
      pointer-events: none;
    }
    .fp-iso-roof-button {
      cursor: pointer;
    }
    .fp-iso-roof-button .fp-iso-face,
    .fp-iso-roof-button polygon.fp-iso-roof {
      pointer-events: auto;
    }
    .fp-iso-roof-button:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
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
      width: ${En}px;
      height: ${En}px;
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
       replace it — restating scale(${hs}) alone would drop the
       counter-scale along with the translate, and a badge held down at 4x
       zoom would balloon to roughly 4x its resting size instead of shrinking. */
    .press-scale .item.interactive {
      transition: transform ${us}ms cubic-bezier(0.2, 0.8, 0.3, 1);
    }
    .press-scale .item.interactive:active {
      transform: translate(-50%, -50%) scale(calc(var(--fp-inv-zoom, 1) * ${hs}));
      transition-duration: ${ps}ms;
    }

    /* Flash: drop-shadow rather than a box-shadow or a background, so the halo
       follows whatever the device actually draws — the badge's circle, a bare
       ripple ring, the label — instead of a rectangle around it. */
    .press-flash .item.interactive {
      transition: filter ${us}ms ease-out;
    }
    .press-flash .item.interactive:active {
      filter: drop-shadow(0 0 5px var(--fp-skin-accent, var(--primary-color, #03a9f4)));
      transition-duration: ${ps}ms;
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
    /* Over the badge (the fourth side), mirroring below. */
    .item > .label.label-above {
      top: auto;
      bottom: calc(100% + 2px);
    }
    /* An auto label-only device's "below": centred on the empty badge
       footprint, which is the device's point — where an in-flow label-only
       label sits — so measuring it costs no change in what it looks like. */
    .item > .label.label-below.centred {
      top: 50%;
      transform: translate(-50%, -50%);
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
      font-size: ${mr}px;
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
  U0,
  K0
];
be([
  at({ attribute: !1 })
], Tt.prototype, "hass", 2);
be([
  Y()
], Tt.prototype, "_config", 2);
be([
  Y()
], Tt.prototype, "_activeFloorId", 2);
be([
  Y()
], Tt.prototype, "_zoomedAreaId", 2);
be([
  Y()
], Tt.prototype, "_viewOverride", 2);
be([
  Y()
], Tt.prototype, "_appearanceOverride", 2);
be([
  Y()
], Tt.prototype, "_portrait", 2);
Tt = be([
  Gn("easy-floorplan-card")
], Tt);
const Oa = [
  { id: "plan", label: "Plan", hint: "Canvas, floors, background and trace", groups: ["Project", "Floor image", "Trace template", "Floor switcher"] },
  { id: "colors", label: "Style", hint: "Colors, theme and named colors", groups: ["Look", "Named colors"] },
  { id: "view", label: "View", hint: "Display, scale and 3D", groups: ["Display"] },
  { id: "lighting", label: "Lighting", groups: ["Sunlight", "Night dimming"] },
  { id: "devices", label: "Devices", hint: "Device behavior", groups: ["Devices"] },
  { id: "symbols", label: "Symbols", hint: "Symbol library", groups: ["Symbols"] }
], le = { id: "properties", label: "Properties", groups: [] }, Ji = { id: "actions", label: "Actions", groups: ["Behavior"] }, tn = {
  furniture: [le, { id: "sensor", label: "Sensors", hint: "Sensor and state colors", groups: ["What it reads", "Color"] }, Ji],
  opening: [
    le,
    { id: "sensors", label: "Sensors", hint: "Sensors and shutter", groups: ["What it reads", "Shutter"] },
    { id: "appearance", label: "Style", hint: "Style and sunlight", groups: ["Badge", "Color", "Sunlight"] },
    Ji
  ],
  item: [
    le,
    { id: "readings", label: "Readings", groups: ["What it reads"] },
    { id: "appearance", label: "Style", hint: "Labels, badges, colors and effects", groups: ["Label", "Badge", "Color", "Effects"] },
    Ji,
    { id: "visibility", label: "Visibility", groups: ["Visibility"] }
  ],
  area: [le, { id: "sensor", label: "Sensors", hint: "Sensors and room devices", groups: ["What it reads", "Color", "Home Assistant area"] }, Ji],
  roof: [le],
  tracker: [
    le,
    { id: "sensors", label: "Sensors", groups: ["Sensors"] },
    { id: "marker", label: "Marker", groups: ["Marker"] }
  ],
  text: [le],
  wall: [le]
}, Vv = re`
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
  .cfg-group-title { min-height: 0; margin: 0; padding: 0; font-size: 14px; font-weight: 600; letter-spacing: 0; color: var(--editor-ink); }
  .cfg-group-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 28px; margin: 0 0 14px; }
  /* HA's own "Show code editor": a quiet text link at the heading's far end. */
  .cfg-group-head .cfg-group-mode { min-height: 28px; padding: 4px 6px; margin-right: -6px; color: var(--editor-accent); background: transparent; border: 0; border-radius: 6px; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; }
  .cfg-group-head .cfg-group-mode:hover { background: color-mix(in srgb, currentColor 10%, transparent); }
  .action-yaml-error { margin: 6px 0 0; color: var(--error-color, #db4437); }
  .settings-category { position: sticky; top: 43px; z-index: 50; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; margin: 0 0 16px; padding: 6px 0; background: var(--editor-paper); border-bottom: 1px solid var(--editor-line); }
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
`, La = {
  request: (t) => requestAnimationFrame(t),
  cancel: (t) => cancelAnimationFrame(t)
};
class Fa {
  constructor(e, i) {
    this.frames = e, this.deliver = i, this._pending = null, this._hasPending = !1, this._handle = null;
  }
  /** True while a value is queued for delivery. */
  get pending() {
    return this._hasPending;
  }
  /** Queue a value, replacing any still waiting for this frame. */
  push(e) {
    this._pending = e, this._hasPending = !0, this._handle === null && (this._handle = this.frames.request(() => {
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
    const e = this._pending;
    this._pending = null, this._hasPending = !1, this.deliver(e);
  }
}
const Ra = "Apply needs Home Assistant's card editor — use Save instead.", qv = "Save this card once first — it isn't on the dashboard yet.", Yv = 200;
function Gv(t) {
  let e = t;
  for (let i = 0; e && i < Yv; i++) {
    const n = e;
    if (typeof n._params?.saveCardConfig == "function") return n;
    e = e.parentNode ?? e.host ?? null;
  }
  return null;
}
async function Kv(t) {
  const e = Gv(t);
  if (!e) return { ok: !1, error: Ra };
  if (e._params?.isNew) return { ok: !1, error: qv };
  const i = e._cardConfig;
  if (!i || typeof i != "object")
    return { ok: !1, error: Ra };
  try {
    await e._params.saveCardConfig(i);
  } catch (n) {
    return { ok: !1, error: `Could not save — ${n instanceof Error ? n.message : String(n)}` };
  }
  return typeof e._markDirtyStateClean == "function" ? e._markDirtyStateClean() : typeof e._dirty == "boolean" && (e._dirty = !1), { ok: !0 };
}
function Da(t) {
  return "text" in t.selector || "number" in t.selector;
}
function Xv(t, e, i) {
  const n = {};
  for (const o of i)
    e[o.name] !== t[o.name] && (n[o.name] = e[o.name]);
  return n;
}
function Na(t, e) {
  const i = {};
  for (const n of e) {
    if (!(n.name in t)) continue;
    let o = t[n.name];
    if ("text" in n.selector || "icon" in n.selector || "entity" in n.selector || "attribute" in n.selector)
      (o === "" || o == null) && (o = n.required ? "" : void 0);
    else if ("number" in n.selector) {
      const r = typeof o == "string" && o !== "" ? Number(o) : o;
      if (typeof r != "number" || !Number.isFinite(r)) {
        if (n.required) continue;
        o = void 0;
      } else {
        const s = n.selector.number;
        let a = r;
        n.name === "angle" && (a = (r % 360 + 360) % 360, a === 0 && r !== 0 && n.keepFullTurn && (a = 360)), s.min !== void 0 && a < s.min && (a = s.min), s.max !== void 0 && a > s.max && (a = s.max), o = a;
      }
    } else "boolean" in n.selector && (o = !!o);
    i[n.name] = o;
  }
  return i;
}
const si = (t) => t, Ha = ["binary_sensor", "cover", "lock"];
function Ht(t, e) {
  return { fields: e.map((n) => t.fields.find((o) => o.name === n)).filter((n) => !!n), data: t.data, toPatch: t.toPatch };
}
function Zv(t) {
  return t.fields.filter((e) => "ui_action" in e.selector).map((e) => e.name);
}
function Qv(t, e) {
  if (t == null && (t = {}), typeof t != "object" || Array.isArray(t))
    return { error: `Expected ${e.join(", ")} as keys.` };
  const i = t, n = Object.keys(i).filter((r) => !e.includes(r));
  if (n.length)
    return { error: `Only ${e.join(", ")} belong here, not ${n.join(", ")}.` };
  const o = {};
  for (const r of e) {
    const s = i[r];
    if (s == null) {
      o[r] = void 0;
      continue;
    }
    if (typeof s != "object" || Array.isArray(s) || typeof s.action != "string")
      return { error: `${r} needs an "action:" line.` };
    o[r] = s;
  }
  return { patch: o };
}
const ji = (t = !1) => ({
  name: "angle",
  label: "Angle",
  ...t ? { keepFullTurn: t } : {},
  selector: { number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" } }
}), O = (t, e) => ({ value: t, label: e }), tt = (...t) => ({
  select: { mode: "dropdown", options: t }
});
function pd(t = It) {
  return Dy(t);
}
function Jv(t, e = It) {
  return Rt(e, t)?.name ?? t;
}
function tx(t, e = () => 0) {
  const i = vt(t), n = Hi(t), o = _i(t), r = t.type === "skylight", s = Ut(t), a = [
    {
      name: "type",
      label: "Type",
      selector: tt(
        O("door", "Door"),
        O("passage", "Passage (no door)"),
        O("window", "Window"),
        O("skylight", "Skylight")
      )
    }
  ];
  if (!r && !s && a.push({
    name: "motion",
    label: "Motion",
    selector: tt(
      O("swing", "Swing"),
      O("slide", "Slide"),
      // Not "garage / shutter": an external shutter is the Shutter field
      // below, a layer over any opening, and naming it here read as the
      // place to set one up.
      O("roll", "Roll up (garage)"),
      ...t.type === "window" ? [O("fixed", "Fixed (does not open)"), O("awning", "Top-hinged (awning)")] : []
    )
  }), a.push({
    name: "length",
    label: "Length",
    helper: r ? "The roof window's long side" : void 0,
    required: !0,
    selector: { number: { min: 1, mode: "box" } }
  }), r && (a.push({
    name: "width",
    label: "Width",
    helper: "The short side; the patch of sun it lays is this rectangle, moved",
    required: !0,
    selector: { number: { min: 1, mode: "box" } }
  }), a.push({
    name: "ceilingHeight",
    label: "Ceiling height",
    helper: "1 is an ordinary storey; higher throws the patch of sun further across the room",
    selector: { number: { min: 0.2, max: 4, step: 0.1, mode: "slider" } }
  })), t.type === "window" && a.push({
    name: "sill",
    label: "Sill height",
    helper: "Share of the wall height under the glass, in the 3D view — 0 is floor-to-ceiling",
    selector: { number: { min: 0, max: Cl, step: 0.05, mode: "slider" } }
  }), !r && !s && i === "swing") {
    const l = t.type === "door";
    a.push({
      name: "sash",
      label: l ? "Leaves" : "Sashes",
      helper: l ? "Double = two leaves meeting in the middle, hinged at each jamb" : "Single = one full-width sash (issue #73)",
      selector: l ? tt(O("single", "Single (one leaf)"), O("double", "Double (two leaves)")) : tt(O("double", "Double (two leaves)"), O("single", "Single sash"))
    });
  }
  return !s && i === "swing" && oe(t) === "single" && a.push({
    name: "sashSpan",
    label: t.type === "door" ? "Leaf width" : "Sash width",
    helper: t.type === "door" ? "Share of the opening that actually swings — the rest is a fixed panel" : "Share of the opening that actually opens — the rest is fixed glass",
    selector: { number: { min: Nl, max: 1, step: 0.05, mode: "slider" } }
  }), (t.type === "door" || r) && a.push({
    name: "glazed",
    label: "Glazed",
    helper: r ? "On (a roof window): only the blind stops the light. Off (a hatch): the sash does" : "Lets sunlight through even when shut — a patio or French door",
    selector: { boolean: {} }
  }), a.push({
    name: "sunlight",
    label: "Lets sunlight in",
    helper: "Off makes it wall to the sun — for a solid door the plan draws open",
    selector: { boolean: {} }
  }), !s && i === "swing" && oe(t) === "single" && a.push({
    name: "hinge",
    label: "Hinge",
    selector: tt(O("left", "Left"), O("right", "Right"))
  }), !r && !s && i === "swing" && a.push({
    name: "opens",
    label: "Opens",
    selector: tt(O("this", "This side"), O("other", "Other side"))
  }), r && a.push({
    name: "opens",
    label: "Hinged at",
    helper: "Which edge the sash is hung from, and the edge its blind comes down from",
    selector: tt(O("this", "Top edge"), O("other", "Bottom edge"))
  }), !r && !s && i === "slide" && (o || a.push({
    name: "slide",
    label: "Slide",
    selector: tt(O("left", "To left"), O("right", "To right"))
  }), a.push({
    name: "style",
    label: "Style",
    selector: tt(
      O("single", "Single"),
      O("bypass", "Bypass (stack)"),
      O("biparting", "Biparting (into the walls)"),
      O("biparting-bypass", "Biparting (over fixed panels)"),
      O("converging", "Converging (both panels stack in the middle)")
    )
  })), a.push({
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
    helper: r ? "Contact or cover for the sash. A roof window keeps its type whatever the entity's device class says" : s ? "Optional. A passage is always open, so this only badges it and takes its tap actions" : o ? "Contact, cover or lock. Drives the first leaf; type and motion follow its device class" : "Contact, cover or lock — a lock reads unlocked as open. Type and motion follow its device class",
    selector: { entity: { filter: [{ domain: Ha }] } }
  }), o && t.entity && a.push({
    name: "secondaryEntity",
    label: "Second leaf",
    helper: "Its own sensor for the other leaf — leave empty to move both together",
    selector: { entity: { filter: [{ domain: Ha }] } }
  }), a.push({
    name: "shutterEntity",
    label: r ? "Blind" : "Shutter",
    helper: r ? "Blackout blind over the glass — a cover, or a contact sensor. This is what stops the light" : "External shutter over this opening — a cover, or a contact sensor",
    selector: { entity: { filter: [{ domain: ["cover", "binary_sensor"] }] } }
  }), t.shutterEntity && (r || a.push({
    name: "shutterStyle",
    label: "Shutter type",
    helper: "Hinged panels fold back against the wall; roll-up slats disappear upward",
    selector: tt(O("swing", "Hinged (louvered panels)"), O("roll", "Roll-up (slats)"))
  }), !r && Se(t) === "swing" && a.push({
    name: "shutterSide",
    label: "Shutter side",
    helper: "Which side of the wall the panels hang on",
    selector: tt(O("far", "Away from the sash"), O("near", "Same side as the sash"))
  }), !r && Se(t) === "swing" && a.push({
    name: "shutterSecondaryEntity",
    label: "Second shutter panel",
    helper: "Its own contact for the other panel — leave empty to fold both together",
    selector: { entity: { filter: [{ domain: ["binary_sensor", "cover"] }] } }
  }), a.push({
    name: "shutterInvert",
    label: r ? "Invert blind animation" : "Invert shutter animation",
    selector: { boolean: {} }
  })), s || a.push({
    name: "invert",
    label: t.type === "door" ? "Invert door animation" : r ? "Invert skylight animation" : "Invert window animation",
    helper: t.entity ? void 0 : (
      // Only a swing door draws open with no sensor to ask
      // (openingDefaultOpen) — everything else, door, window or roof light,
      // draws shut.
      t.type === "door" && vt(t) === "swing" ? "No sensor bound — draws shut instead of open" : "No sensor bound — draws open instead of shut"
    ),
    selector: { boolean: {} }
  }), a.push(ji()), t.entity && (a.push({
    name: "showIcon",
    label: "Show icon",
    helper: vt(t) === "roll" ? "A raised roll-up leaves only a line — this puts its state beside it, and opens its dialog when tapped" : "Shows this opening's state beside it, and opens its dialog when tapped",
    selector: { boolean: {} }
  }), t.showIcon && a.push({
    name: "icon",
    label: "Icon",
    helper: "Overrides the entity's own icon, which changes with its state",
    selector: { icon: {} }
  })), t.shutterEntity && (a.push({
    name: "showShutterIcon",
    label: "Shutter icon",
    helper: !t.entity && Se(t) === "roll" ? "A raised roll-up leaves only a line — this puts the shutter's state beside it, and opens it when tapped" : "Shows the shutter's state beside the opening, and opens it when tapped",
    selector: { boolean: {} }
  }), (t.showShutterIcon ?? un(t)) && a.push({
    name: "shutterIcon",
    label: "Icon",
    helper: "Overrides the shutter entity's own icon, which changes with its state",
    selector: { icon: {} }
  })), t.entity && t.shutterEntity && a.push({
    name: "tapTarget",
    label: "Tap opens",
    helper: "The other one moves to press-and-hold. Opens the dialog; use Tap action below to move the shutter itself",
    selector: tt(
      O(
        "opening",
        t.type === "door" ? "The door" : r ? "The skylight" : s ? "The passage" : "The window"
      ),
      O("shutter", r ? "The blind" : "The shutter")
    )
  }), (t.entity || t.shutterEntity) && a.push(
    {
      name: "tap_action",
      label: "Tap action",
      selector: {
        ui_action: {
          default_action: Dr(t, "tap", e)?.config.action ?? "none"
        }
      }
    },
    {
      name: "hold_action",
      label: "Hold action",
      // With both bound, holding reaches whichever entity the tap does not.
      // With only one, there is nothing left for hold to open.
      helper: t.entity && t.shutterEntity ? "Opens the entity the tap doesn't" : void 0,
      selector: {
        ui_action: {
          default_action: t.entity && t.shutterEntity ? "more-info" : "none"
        }
      }
    },
    {
      name: "double_tap_action",
      label: "Double-tap action",
      selector: { ui_action: { default_action: "none" } }
    }
  ), {
    fields: a,
    data: {
      type: t.type,
      motion: i,
      length: t.length,
      // The *effective* pair, not the raw ones: a skylight placed without a
      // stated width still has one (SKYLIGHT_WIDTH_RATIO of its length), and
      // a Width box that opened empty on a rectangle plainly drawn on the
      // canvas would be a box claiming the drawing has no width.
      width: qt(t),
      ceilingHeight: Br(t),
      sill: Er(t),
      hinge: t.flipH ? "right" : "left",
      opens: t.flipV ? "other" : "this",
      slide: t.flipH ? "right" : "left",
      style: n,
      sash: oe(t),
      entity: t.entity ?? "",
      secondaryEntity: t.secondaryEntity ?? "",
      glazed: fo(t),
      sunlight: t.sunlight ?? !0,
      shutterEntity: t.shutterEntity ?? "",
      shutterSecondaryEntity: t.shutterSecondaryEntity ?? "",
      shutterStyle: Se(t),
      shutterSide: t.shutterFlipV ? "near" : "far",
      shutterInvert: t.shutterInvert ?? !1,
      showShutterIcon: t.showShutterIcon ?? un(t),
      shutterIcon: t.shutterIcon ?? "",
      showIcon: t.showIcon ?? !1,
      icon: t.icon ?? "",
      tapTarget: t.tapTarget ?? "opening",
      invert: t.invert ?? !1,
      angle: t.angle,
      tap_action: t.tap_action,
      hold_action: t.hold_action,
      double_tap_action: t.double_tap_action
    },
    toPatch(l) {
      const c = {};
      for (const [d, h] of Object.entries(l))
        if (d === "shutterEntity")
          c.shutterEntity = h, h || (c.shutterStyle = void 0, c.shutterFlipV = void 0, c.shutterInvert = void 0, c.shutterActiveColor = void 0, c.shutterSecondaryEntity = void 0, c.tapTarget = void 0, c.showShutterIcon = void 0, c.shutterIcon = void 0);
        else if (d === "sunlight")
          c.sunlight = h ? void 0 : !1;
        else if (d === "glazed")
          c.glazed = t.type === "door" ? h ? !0 : void 0 : r ? h ? void 0 : !1 : void 0;
        else if (d === "width")
          c.width = r && typeof h == "number" && h > 0 ? h : void 0;
        else if (d === "ceilingHeight")
          c.ceilingHeight = r && typeof h == "number" && h !== 1 ? h : void 0;
        else if (d === "entity")
          c.entity = h, h || (c.showIcon = void 0, c.icon = void 0);
        else if (d === "shutterSide") c.shutterFlipV = h === "near" || void 0;
        else if (d === "shutterInvert") c.shutterInvert = h || void 0;
        else if (d === "tapTarget") c.tapTarget = h === "shutter" ? "shutter" : void 0;
        else {
          if (d === "showShutterIcon") continue;
          if (d === "showIcon")
            c.showIcon = h ? !0 : void 0, h || (c.icon = void 0);
          else if (d === "motion") {
            const p = h === "slide" || h === "roll" || h === "fixed" || h === "awning" ? h : void 0;
            c.motion = p, h !== "slide" && (c.sliderStyle = void 0), h !== "swing" && (c.sashSpan = void 0), _i({
              ...t,
              motion: p,
              sliderStyle: h === "slide" ? t.sliderStyle : void 0
            }) || (c.secondaryEntity = void 0);
          } else d === "sill" ? c.sill = t.type === "window" && typeof h == "number" && h !== Tl ? h : void 0 : d === "sashSpan" ? c.sashSpan = typeof h == "number" && h < 1 ? h : void 0 : d === "sash" ? (c.sash = h === Go(t.type) ? void 0 : h, _i({ ...t, sash: h }) || (c.secondaryEntity = void 0), h === "double" && (c.sashSpan = void 0)) : d === "shutterStyle" ? (c.shutterStyle = h, h !== "swing" && (c.shutterSecondaryEntity = void 0)) : d === "hinge" || d === "slide" ? c.flipH = h === "right" || void 0 : d === "opens" ? c.flipV = h === "other" || void 0 : d === "style" ? (c.sliderStyle = h === "single" ? void 0 : h, mc(h) || (c.secondaryEntity = void 0)) : d === "invert" ? c.invert = h || void 0 : d === "type" ? (c.type = h, (h !== "window" || t.type !== "window") && (c.sill = void 0), h === "skylight" ? (c.motion = void 0, c.sliderStyle = void 0, c.sashSpan = void 0, c.sash = void 0, c.secondaryEntity = void 0, c.shutterStyle = void 0, c.shutterFlipV = void 0, c.shutterSecondaryEntity = void 0, c.glazed = void 0) : r && (c.width = void 0, c.ceilingHeight = void 0, c.glazed = void 0, c.motion = void 0, c.sliderStyle = void 0, c.sashSpan = void 0, c.sash = void 0, c.secondaryEntity = void 0, c.shutterStyle = void 0, c.shutterFlipV = void 0, c.shutterSecondaryEntity = void 0), (h === "passage" || s) && (c.motion = void 0, c.sliderStyle = void 0, c.sashSpan = void 0, c.sash = void 0, c.secondaryEntity = void 0, c.glazed = void 0, c.invert = void 0)) : c[d] = h;
        }
      if (!("shutterEntity" in l && !l.shutterEntity)) {
        const d = { entity: "entity" in c ? c.entity : t.entity }, h = un(d);
        if ("showShutterIcon" in l) {
          const p = !!l.showShutterIcon;
          c.showShutterIcon = p === h ? void 0 : p, p || (c.shutterIcon = void 0);
        } else "entity" in c && (t.showShutterIcon === h && (c.showShutterIcon = void 0), t.shutterIcon && !(t.showShutterIcon ?? h) && (c.shutterIcon = void 0));
      }
      return c;
    }
  };
}
function Yr(t, e) {
  return t?.entities.length ? { entity: { include_entities: e && !t.entities.includes(e) ? [...t.entities, e] : t.entities } } : { entity: {} };
}
function Gr(t, e) {
  if (!t?.entities.length) return e;
  const n = `Only entities in ${t.name ? `the ${t.name} area` : "this area"} — turn off “Filter entities” on the area to see all`;
  return e ? `${e}. ${n}` : n;
}
function wn(t) {
  if ((t.display ?? "badge") === "ripple") return "none";
  const e = Li(t);
  if (e !== "icon") return e;
  const i = t.iconAnimation ?? "auto";
  return i === "spin" || i === "pulse" ? i : i === "auto" ? rc(t.entity) ?? "icon" : "icon";
}
function Kr(t) {
  return (t.display ?? "badge") !== "badge";
}
function ud(t, e) {
  const i = {
    badgeContent: t === "value" ? "value" : t === "none" ? "none" : "icon",
    // Touching the badge retires the `showIcon` boolean it replaced (issue
    // #106), so a migrated config carries one setting rather than two that
    // could later be edited into disagreeing. Configs nobody touches keep
    // working through badgeContentOf's fallback.
    showIcon: void 0,
    display: e ? t === "none" ? "ripple" : "iconRipple" : "badge"
  };
  return t !== "value" && t !== "none" && (i.iconAnimation = t === "icon" ? "none" : t), i;
}
function ja(t, e) {
  return {
    fields: [
      {
        name: "entity",
        label: "Entity",
        required: !0,
        helper: Gr(e),
        selector: Yr(e, t.entity)
      },
      {
        name: "attribute",
        label: "Attribute",
        helper: "Show this attribute instead of the state (e.g. current_temperature)",
        selector: { attribute: { entity_id: t.entity } }
      }
    ],
    data: { entity: t.entity ?? "", attribute: t.attribute ?? "" },
    toPatch: si
  };
}
function ex(t) {
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
    data: { name: t.name ?? "", showName: t.showName ?? !1 },
    toPatch: si
  };
}
function ix(t) {
  return {
    fields: [
      {
        name: "showState",
        label: "Show state",
        helper: "Adds this entity's own state to the label line",
        selector: { boolean: {} }
      }
    ],
    data: { showState: t.showState ?? t.kind === "sensor" },
    toPatch: si
  };
}
function nx(t) {
  const e = [
    {
      name: "labelPosition",
      label: "Label position",
      helper: "Beside the badge, a long reading grows one way only. Auto picks the side that stays clear of walls and other labels",
      selector: tt(
        O("below", "Below"),
        O("above", "Above"),
        O("left", "Left"),
        O("right", "Right"),
        O("auto", "Auto")
      )
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
  return t.disableLabelColor && e.push({
    name: "useCustomLabelColor",
    label: "Own color",
    helper: "Override the theme default with a fixed custom color",
    selector: { boolean: {} }
  }), {
    fields: e,
    data: {
      labelPosition: Lr(t),
      labelSize: t.labelSize ?? Zl,
      disableLabelColor: t.disableLabelColor ?? !1,
      useCustomLabelColor: t.useCustomLabelColor ?? !1,
      labelCustomColor: t.labelCustomColor ?? ""
    },
    toPatch: (i) => {
      const n = { ...i }, o = n.disableLabelColor ?? t.disableLabelColor ?? !1, r = n.useCustomLabelColor ?? t.useCustomLabelColor ?? !1;
      return n.labelPosition === "below" && (n.labelPosition = void 0), n.disableLabelColor === !1 && (n.disableLabelColor = void 0), n.useCustomLabelColor === !1 && (n.useCustomLabelColor = void 0), o ? r || (n.labelCustomColor = void 0) : (n.useCustomLabelColor = void 0, n.labelCustomColor = void 0), n.labelCustomColor === "" && (n.labelCustomColor = void 0), n;
    }
  };
}
function Wa(t, e) {
  const i = [
    {
      name: "badgeMode",
      label: "Badge shows",
      helper: "Animations play only while the entity is active. Value puts the reading in the badge, falling back to the icon when there is no number",
      selector: tt(
        O("icon", "Icon, still"),
        O("spin", "Icon, spinning"),
        O("pulse", "Icon, pulsing"),
        O("value", "Value"),
        O("none", "Nothing")
      )
    }
  ], n = ye(t);
  return wn(t) === "value" && n.length && i.push({
    name: "badgeEntity",
    label: "Badge reads",
    helper: "Which of this device's readings the badge shows",
    selector: tt(
      O("primary", e?.primaryLabel || t.entity || "Main entity"),
      ...n.map(
        (o, r) => O(
          String(r),
          e?.readingLabels?.[r] || o.entity || (o.attribute ? `${t.entity || "this device"} · ${o.attribute}` : `Reading ${r + 1}`)
        )
      )
    )
  }), i.push(
    {
      name: "size",
      label: "Size",
      selector: { number: { min: 16, max: 160, step: 2, mode: "slider", unit_of_measurement: "px" } }
    },
    ji(!0)
  ), {
    fields: i,
    data: {
      badgeMode: wn(t),
      // The dropdown's values are strings, so the stored index (or the legacy
      // "secondary") is spelled the same way here; toPatch turns it back into
      // a number. Opens on what the badge is *actually* reading when nothing
      // is chosen, which is the whole point of badgeSource (issue #136).
      badgeEntity: String(pc(t.badgeEntity) ?? e?.source ?? "primary"),
      size: t.size ?? ne,
      angle: t.angle ?? 0
    },
    // "Badge shows" is the editor's spelling of three config keys (issue
    // #127) — expand it back, carrying the ripple state off the item since
    // that control lives in another group now.
    toPatch: (o) => {
      let r = o;
      if ("badgeEntity" in r && typeof r.badgeEntity == "string" && r.badgeEntity !== "primary" && (r = { ...r, badgeEntity: Number(r.badgeEntity) }), !("badgeMode" in r)) return r;
      const { badgeMode: s, ...a } = r;
      return {
        ...a,
        ...ud(s ?? wn(t), Kr(t))
      };
    }
  };
}
function ox(t, e, i) {
  const n = Kr(t), o = ac(t.entity, e), r = wg(i) || !!t.glow;
  if (!o && !r) return;
  const s = Te(t) !== void 0, a = Oi(t) !== void 0, l = [];
  return o && (l.push({
    name: "ripple",
    label: "Ripple",
    // "Detected" rather than "the sensor is on": this is offered to a
    // device_tracker and a person too, and neither of those is a sensor.
    // It stays vague about *what* is detected because a vibration sensor
    // rings for a knock, not for presence (issue #202).
    helper: "Draws a pulsing ring while this device detects something",
    selector: { boolean: {} }
  }), n && (l.push({
    name: "rippleSize",
    label: "Ripple size",
    selector: {
      number: { min: 40, max: 400, step: 4, mode: "slider", unit_of_measurement: "px" }
    }
  }), l.push({
    name: "rippleDirection",
    label: "Ripple direction",
    selector: {
      number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" }
    }
  }), l.push({
    name: "rippleWidth",
    label: "Ripple width",
    selector: {
      number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" }
    }
  }))), r && (l.push({
    name: "glow",
    label: "Cast light",
    helper: "Pools the light's own color onto the plan; overlapping lights mix",
    selector: { boolean: {} }
  }), t.glow && (l.push(
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
  ), s || (l.push({
    name: "glowWidth",
    label: "Beam width",
    helper: "Under 360° lights a cone, for spots and wall washers; drag its tip on the plan to aim it",
    selector: {
      number: { min: ll, max: 360, step: 5, mode: "slider", unit_of_measurement: "°" }
    }
  }), a && l.push({
    name: "glowDirection",
    label: "Beam direction",
    selector: {
      number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" }
    }
  })), s && l.push(
    {
      name: "stripLength",
      label: "Strip length",
      selector: { number: { min: Zn, max: 2e3, step: 1, mode: "box" } }
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
    fields: l,
    data: {
      ripple: n,
      rippleSize: t.rippleSize ?? Qn,
      rippleDirection: t.rippleDirection ?? Jn,
      rippleWidth: t.rippleWidth ?? to,
      glow: t.glow ?? !1,
      glowRadius: t.glowRadius ?? Ai,
      glowColor: t.glowColor ?? "",
      strip: s,
      stripLength: t.stripLength ?? fs,
      stripAngle: t.stripAngle ?? 0,
      stripSide: t.stripSide ?? "auto",
      glowWidth: t.glowWidth ?? 360,
      glowDirection: t.glowDirection ?? 0
    },
    toPatch: (c) => {
      let d = c;
      if ("strip" in d) {
        const { strip: f, ...u } = d;
        d = f ? { ...u, stripLength: s ? t.stripLength : fs } : { ...u, stripLength: void 0, stripAngle: void 0, stripSide: void 0 };
      }
      if (d.stripSide === "auto" && (d = { ...d, stripSide: void 0 }), "glowWidth" in d && !(W(d.glowWidth, 360) < 360) && (d = { ...d, glowWidth: void 0, glowDirection: void 0 }), !("ripple" in d)) return d;
      const { ripple: h, ...p } = d;
      return { ...p, ...ud(wn(t), !!h) };
    }
  };
}
function rx(t) {
  const e = [
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
  if (t.enableHideByEntity) {
    const i = t.hideEntity || t.entity;
    e.push(
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
            options: t.hideMode === "threshold" ? [{ value: "<", label: "<" }, { value: "<=", label: "<=" }, { value: "==", label: "==" }, { value: "!=", label: "!=" }, { value: ">=", label: ">=" }, { value: ">", label: ">" }] : [{ value: "==", label: "==" }, { value: "!=", label: "!=" }]
          }
        }
      }
    ), t.hideMode === "threshold" ? e.push({
      name: "hideThreshold",
      label: "Threshold Value",
      selector: { number: { mode: "box", step: "any" } }
    }) : e.push({
      name: "hideState",
      label: "Hide State",
      helper: t.hideAttribute ? "Enter the exact attribute value that triggers the hide action" : "Select the state that triggers the hide action",
      selector: t.hideAttribute || !i ? { text: {} } : { state: { entity_id: i } }
    }), e.push({
      name: "hideInvert",
      label: "Invert condition",
      helper: "Hide when condition is NOT met",
      selector: { boolean: {} }
    });
  }
  if (e.push({
    name: "enableHideStateByEntity",
    label: "Hide State by condition",
    helper: "Hides only the state text below the icon based on a condition",
    selector: { boolean: {} }
  }), t.enableHideStateByEntity) {
    const i = t.hideStateEntity || t.entity;
    e.push(
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
            options: t.hideStateMode === "threshold" ? [{ value: "<", label: "<" }, { value: "<=", label: "<=" }, { value: "==", label: "==" }, { value: "!=", label: "!=" }, { value: ">=", label: ">=" }, { value: ">", label: ">" }] : [{ value: "==", label: "==" }, { value: "!=", label: "!=" }]
          }
        }
      }
    ), t.hideStateMode === "threshold" ? e.push({
      name: "hideStateThreshold",
      label: "Threshold Value",
      selector: { number: { mode: "box", step: "any" } }
    }) : e.push({
      name: "hideStateMatch",
      label: "Hide State Match",
      helper: t.hideStateAttribute ? "Enter the exact attribute value that triggers hiding the text" : "Select the state that triggers hiding the text",
      selector: t.hideStateAttribute || !i ? { text: {} } : { state: { entity_id: i } }
    }), e.push({
      name: "hideStateInvert",
      label: "Invert condition",
      helper: "Hide text when condition is NOT met",
      selector: { boolean: {} }
    });
  }
  if (e.push({
    name: "enableHideBadgeByEntity",
    label: "Hide Badge by condition",
    helper: "Hides only the badge (icon/bubble) based on a condition",
    selector: { boolean: {} }
  }), t.enableHideBadgeByEntity) {
    const i = t.hideBadgeEntity || t.entity;
    e.push(
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
            options: t.hideBadgeMode === "threshold" ? [{ value: "<", label: "<" }, { value: "<=", label: "<=" }, { value: "==", label: "==" }, { value: "!=", label: "!=" }, { value: ">=", label: ">=" }, { value: ">", label: ">" }] : [{ value: "==", label: "==" }, { value: "!=", label: "!=" }]
          }
        }
      }
    ), t.hideBadgeMode === "threshold" ? e.push({
      name: "hideBadgeThreshold",
      label: "Threshold Value",
      selector: { number: { mode: "box", step: "any" } }
    }) : e.push({
      name: "hideBadgeMatch",
      label: "Hide Badge Match",
      helper: t.hideBadgeAttribute ? "Enter the exact attribute value that triggers hiding the badge" : "Select the state that triggers hiding the badge",
      selector: t.hideBadgeAttribute || !i ? { text: {} } : { state: { entity_id: i } }
    }), e.push({
      name: "hideBadgeInvert",
      label: "Invert condition",
      helper: "Hide badge when condition is NOT met",
      selector: { boolean: {} }
    });
  }
  return {
    fields: e,
    data: {
      showOnlyWhenZoomed: t.showOnlyWhenZoomed ?? !1,
      enableHideByEntity: t.enableHideByEntity ?? !1,
      hideEntity: t.hideEntity ?? "",
      hideAttribute: t.hideAttribute ?? "",
      hideMode: t.hideMode ?? "state",
      hideState: t.hideState ?? "",
      hideOperator: t.hideOperator ?? "==",
      hideThreshold: t.hideThreshold ?? 0,
      hideInvert: t.hideInvert ?? !1,
      enableHideStateByEntity: t.enableHideStateByEntity ?? !1,
      hideStateEntity: t.hideStateEntity ?? "",
      hideStateAttribute: t.hideStateAttribute ?? "",
      hideStateMode: t.hideStateMode ?? "state",
      hideStateMatch: t.hideStateMatch ?? "",
      hideStateOperator: t.hideStateOperator ?? "==",
      hideStateThreshold: t.hideStateThreshold ?? 0,
      hideStateInvert: t.hideStateInvert ?? !1,
      enableHideBadgeByEntity: t.enableHideBadgeByEntity ?? !1,
      hideBadgeEntity: t.hideBadgeEntity ?? "",
      hideBadgeAttribute: t.hideBadgeAttribute ?? "",
      hideBadgeMode: t.hideBadgeMode ?? "state",
      hideBadgeMatch: t.hideBadgeMatch ?? "",
      hideBadgeOperator: t.hideBadgeOperator ?? "==",
      hideBadgeThreshold: t.hideBadgeThreshold ?? 0,
      hideBadgeInvert: t.hideBadgeInvert ?? !1
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
function sx(t) {
  const e = (t.tap_action?.action ?? rn(t.entity).action) === "more-info";
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
        selector: { ui_action: { default_action: rn(t.entity).action } }
      },
      ...e ? [
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
      hideWhenInactive: t.hideWhenInactive ?? !1,
      tap_action: t.tap_action,
      ...e ? { moreInfoEntity: t.tap_action?.entity ?? "" } : {},
      hold_action: t.hold_action,
      double_tap_action: t.double_tap_action
    },
    toPatch: (i) => {
      if (!("moreInfoEntity" in i)) return i;
      const { moreInfoEntity: n, ...o } = i;
      if (!e) return o;
      const r = typeof n == "string" && n ? n : void 0, s = { ...t.tap_action ?? {}, action: "more-info" };
      r ? s.entity = r : delete s.entity;
      const a = s.action === rn(t.entity).action && Object.keys(s).every((l) => l === "action" || s[l] == null);
      return { ...o, tap_action: a ? void 0 : s };
    }
  };
}
function ax(t, e) {
  const i = [
    {
      name: "text",
      label: "Text",
      // Required only while nothing else fills the label. A text with no words
      // and no entity is an invisible element, which is what this guarded
      // against; with a reading bound the words are optional, and demanding
      // them for a label that is only ever a number would be asking for a
      // placeholder to delete.
      required: !t.entity,
      helper: t.entity ? "Shown in front of the reading — leave empty for the value alone" : void 0,
      selector: { text: {} }
    },
    {
      name: "entity",
      label: "Entity",
      helper: Gr(e, "Shows this entity's value, formatted as HA formats it"),
      selector: Yr(e, t.entity)
    }
  ];
  return t.entity && i.push({
    name: "attribute",
    label: "Attribute",
    helper: "Show this attribute instead of the state (e.g. current_temperature)",
    selector: { attribute: { entity_id: t.entity } }
  }), i.push(
    {
      name: "size",
      label: "Size",
      selector: { number: { min: 8, max: 200, mode: "slider", unit_of_measurement: "px" } }
    },
    ji(!0)
  ), {
    fields: i,
    data: {
      text: t.text ?? "",
      entity: t.entity ?? "",
      attribute: t.attribute ?? "",
      size: t.size ?? vi,
      angle: t.angle ?? 0
    },
    toPatch: (n) => "entity" in n && !n.entity ? { ...n, attribute: void 0 } : n
  };
}
function lx(t, e, i = It, n = []) {
  const o = pd(i), r = o.some((l) => l.id === t.type) ? o.map((l) => ({ value: l.id, label: l.name })) : [{ value: t.type, label: `${t.type} (missing)` }, ...o.map((l) => ({ value: l.id, label: l.name }))], s = t.goToFloor && typeof t.goToFloor == "object" && typeof t.goToFloor.floor == "string" ? t.goToFloor.floor : void 0, a = n.map((l) => O(`floor:${l.id}`, `Go to ${l.name} (${l.id})`));
  return s !== void 0 && !n.some((l) => l.id === s) && a.push(O(`floor:${s}`, `Missing floor: ${s}`)), {
    fields: [
      {
        name: "type",
        label: "Type",
        selector: { select: { mode: "dropdown", options: r } }
      },
      // L-shaped sectional only (#40): which side the chaise extends on,
      // facing the sofa from the front. Conditional, in the same shape
      // openingForm uses for its hinge / slide fields.
      ...t.type === "sectional" ? [
        {
          name: "hand",
          label: "Chaise side",
          helper: "Facing the sofa from the front",
          selector: tt(O("right", "right"), O("left", "left"))
        }
      ] : [],
      // A curtain gathers at one end when open (issue #196). The symbol is
      // drawn from its left edge, so mirroring it gathers it at the right.
      ...Rt(i, t.type)?.extend?.axis === "w" ? [
        {
          name: "hand",
          label: "Gathers at",
          helper: "Which end it bunches up at when open. Both ends: a pair that meets in the middle",
          selector: tt(O("right", "left"), O("left", "right"), O("center", "both ends"))
        }
      ] : [],
      { name: "w", label: "Width", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "h", label: "Height", required: !0, selector: { number: { min: 10, mode: "box" } } },
      ji(),
      // Optional entity that makes the drawing live (issue #82) — a soil
      // sensor on a plant, a contact sensor on a cabinet. Last, because most
      // furniture is decoration and never binds anything.
      {
        name: "entity",
        label: "Entity",
        helper: Gr(
          e,
          // An awning or curtain is what the entity is for (issue #196).
          Rt(i, t.type)?.extend ? `The cover that moves it: drawn at its position, full size when fully ${Rt(i, t.type).extend.open === "extended" ? "open" : "closed"}` : "Optional — lets the drawing change color with a sensor"
        ),
        selector: Yr(e, t.entity)
      },
      // Clicking it changes floor (issue #121). Offered on any piece rather
      // than only on the built-in `stairs`, because a plan can draw its own
      // staircase and a rule keyed on one symbol id would leave those out.
      // Empty on everything by default, so it is a row and not a nag.
      {
        name: "goToFloor",
        label: "Go to floor",
        helper: "Tap the icon to change floor. Main uses the default floor, or the first floor",
        selector: tt(
          O("", "Nothing"),
          O("up", "Up one floor"),
          O("down", "Down one floor"),
          O("top", "Top floor"),
          O("bottom", "Bottom floor"),
          O("main", "Main floor"),
          ...a
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
        helper: t.goToFloor ? "Replaces the floor change. Put an action on hold or double-tap to keep both" : void 0,
        selector: { ui_action: { default_action: "none" } }
      },
      { name: "hold_action", label: "Hold action", selector: { ui_action: { default_action: "none" } } },
      {
        name: "double_tap_action",
        label: "Double-tap action",
        selector: { ui_action: { default_action: "none" } }
      },
      // Whether those gestures get a visible icon (issue #362). Only asked
      // once there is something for an icon to stand for: on decorative
      // furniture the toggle would switch nothing.
      ...t.goToFloor || t.tap_action || t.hold_action || t.double_tap_action ? [
        {
          name: "showIcon",
          label: "Action icon",
          helper: "Off: tap the furniture itself instead of the round icon",
          selector: { boolean: {} }
        }
      ] : []
    ],
    data: {
      type: t.type,
      ...t.type === "sectional" || Rt(i, t.type)?.extend?.axis === "w" ? { hand: t.hand ?? "right" } : {},
      w: t.w,
      h: t.h,
      angle: t.angle ?? 0,
      entity: t.entity ?? "",
      goToFloor: s !== void 0 ? `floor:${s}` : typeof t.goToFloor == "string" ? t.goToFloor : "",
      tap_action: t.tap_action,
      hold_action: t.hold_action,
      double_tap_action: t.double_tap_action,
      showIcon: t.showIcon ?? !0
    },
    toPatch: (l) => {
      const c = "showIcon" in l ? { ...l, showIcon: l.showIcon === !1 ? !1 : void 0 } : l;
      if (!("goToFloor" in c)) return c;
      const d = c.goToFloor;
      return {
        ...c,
        goToFloor: typeof d == "string" && d.startsWith("floor:") ? { floor: d.slice(6) } : d || void 0
      };
    }
  };
}
function cx(t) {
  return {
    fields: [
      { name: "w", label: "Width", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "h", label: "Height", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "x", label: "X", required: !0, selector: { number: { mode: "box" } } },
      { name: "y", label: "Y", required: !0, selector: { number: { mode: "box" } } },
      ji(),
      {
        name: "dotSize",
        label: "Dot size",
        selector: { number: { min: 6, max: 80, mode: "slider", unit_of_measurement: "px" } }
      }
    ],
    data: {
      w: t.w,
      h: t.h,
      x: Math.round(t.x),
      y: Math.round(t.y),
      angle: t.angle ?? 0,
      dotSize: t.dotSize ?? yr
    },
    toPatch: si
  };
}
function dx(t, e = []) {
  return {
    fields: [{ name: "name", label: "Name", selector: e.length ? {
      select: {
        options: e.map((n) => ({ value: n, label: n })),
        custom_value: !0,
        mode: "dropdown",
        sort: !1
      }
    } : { text: {} } }],
    data: { name: t.name ?? "" },
    toPatch: si
  };
}
function hx(t) {
  return {
    fields: [
      {
        name: "zoneKind",
        label: "Zone type",
        helper: "Categorizes room vs outdoor zones (lawn, patio, pool, driveway, terrace)",
        selector: tt(
          O("indoor", "Indoor / Room"),
          O("lawn", "Lawn"),
          O("patio", "Patio"),
          O("pool", "Pool"),
          O("terrace", "Terrace"),
          O("driveway", "Driveway"),
          O("garden", "Garden"),
          O("courtyard", "Courtyard")
        )
      },
      { name: "showName", label: "Show name", selector: { boolean: {} } },
      // Only while the name renders — same rule the item form uses for its
      // label size.
      ...t.showName ?? !0 ? [
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
      ...t.tap_action ? [] : [
        {
          name: "fitZoom",
          label: "Fit the room to the card",
          helper: "Off lets you set how close a tap goes",
          selector: { boolean: {} }
        },
        ...t.zoom === void 0 ? [] : [
          {
            name: "zoom",
            label: "Zoom level",
            helper: "How close a tap goes",
            selector: {
              number: {
                min: 1,
                max: al,
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
      ...t.entity ? [
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
          selector: tt(
            O("fill", "Fill"),
            O("border", "Border only"),
            O("both", "Fill and border")
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
      showName: t.showName ?? !0,
      zoneKind: t.zoneKind ?? "indoor",
      labelSize: t.labelSize ?? mr,
      opacity: t.opacity ?? Lo,
      entity: t.entity ?? "",
      activeOpacity: t.activeOpacity ?? t.opacity ?? Lo,
      highlight: t.highlight ?? "fill",
      // "Fit" is the absence of a number, so it gets its own boolean; the
      // slider only appears once that is off, and then always shows a real
      // stored value.
      fitZoom: t.zoom === void 0,
      zoom: t.zoom ?? Fo,
      tap_action: t.tap_action,
      hold_action: t.hold_action,
      double_tap_action: t.double_tap_action
    },
    toPatch: (e) => {
      let i = e;
      if ("zoneKind" in i && (i.zoneKind === "indoor" || !i.zoneKind) && (i = { ...i, zoneKind: void 0 }), "highlight" in i && i.highlight === "fill" && (i = { ...i, highlight: void 0 }), "fitZoom" in i) {
        const { fitZoom: n, ...o } = i;
        i = { ...o, zoom: n ? void 0 : Fo };
      }
      return i;
    }
  };
}
function px(t, e = 60) {
  const i = t.type === "shed", n = t.type === "gable" || t.type === "hip", o = t.type === "flat", r = Cn(t.type ?? "gable", e);
  return {
    fields: [
      {
        name: "type",
        label: "Roof style",
        helper: t.points && t.points.length > 4 && t.type !== "flat" ? "Pitched roofs span their rectangular bounding box; combine intersecting rectangular roofs for complex footprints" : "Roof geometry (rendered in 3D on outdoor floors)",
        selector: tt(
          O("flat", "Flat slab"),
          O("gable", "Gable pitch"),
          O("hip", "Hip roof"),
          O("shed", "Shed (mono-pitch)")
        )
      },
      ...i ? [
        {
          name: "highSide",
          label: "High side",
          helper: "Which side slopes up to the ridge height",
          selector: tt(
            O("top", "Top / North"),
            O("bottom", "Bottom / South"),
            O("right", "Right / East"),
            O("left", "Left / West")
          )
        }
      ] : [],
      ...n ? [
        {
          name: "ridge",
          label: "Ridge orientation",
          helper: "Ridge line direction across the roof",
          selector: tt(
            O("auto", "Auto (longer side)"),
            O("horizontal", "Horizontal (X-axis)"),
            O("vertical", "Vertical (Y-axis)")
          )
        }
      ] : [],
      ...o ? [] : [
        {
          name: "height",
          label: "Ridge height",
          helper: "Ridge height above eaves across footprint bounding box (canvas units)",
          selector: { number: { min: 0, max: 200, step: 5, mode: "slider" } }
        }
      ],
      {
        name: "overhang",
        label: "Overhang / Eaves",
        helper: "Horizontal eaves projection beyond the footprint",
        selector: { number: { min: 0, max: 50, step: 1, mode: "slider" } }
      }
    ],
    data: {
      type: t.type ?? "gable",
      highSide: t.highSide ?? "top",
      ridge: t.ridge ?? "auto",
      height: t.height ?? r,
      overhang: t.overhang ?? 0
    },
    toPatch: (s) => {
      let a = s;
      return "type" in a && (a.type === "flat" ? a = { ...a, highSide: void 0, ridge: void 0 } : a.type !== "shed" && (a = { ...a, highSide: void 0 })), "ridge" in a && (a.ridge === "auto" || !a.ridge) && (a = { ...a, ridge: void 0 }), "overhang" in a && (a.overhang === 0 || a.overhang === void 0) && (a = { ...a, overhang: void 0 }), a;
    }
  };
}
function ux(t) {
  const e = (i, n) => ({
    name: i,
    label: n,
    required: !0,
    selector: { number: { mode: "box" } }
  });
  return {
    fields: [
      e("x1", "Start X"),
      e("y1", "Start Y"),
      e("x2", "End X"),
      e("y2", "End Y"),
      {
        name: "thickness",
        label: "Thickness",
        // Capped at MAX_SKIN_WALL_WIDTH, not a rounder number: past that a
        // wall stops being fully cleared by its own door or window (the
        // doorway mask's cut is sized off the shared WALL_THICKNESS
        // constant, not per-wall — see render.ts's wallThickness).
        selector: {
          number: { min: 2, max: Ti, step: 1, mode: "slider", unit_of_measurement: "px" }
        }
      },
      {
        name: "height",
        label: "Height",
        helper: "Override height for 3D view (leave empty to use default card wall height)",
        selector: {
          number: { min: 0, max: Mr, step: 1, mode: "slider", unit_of_measurement: "px" }
        }
      },
      // Issue #182. A dropdown rather than a switch: a railing is one kind of
      // line that is not a wall, and open-plan dividers are the next one asked
      // about (#288).
      {
        name: "kind",
        label: "Kind",
        helper: (t.kind ?? "wall") === "railing" ? "Drawn thin; lamp light and sunlight carry on over it, and it seals off no dead space" : "A railing is the low edge of a balcony, terrace or gallery",
        selector: tt(O("wall", "Wall"), O("railing", "Railing"))
      }
    ],
    data: {
      x1: Math.round(t.x1),
      y1: Math.round(t.y1),
      x2: Math.round(t.x2),
      y2: Math.round(t.y2),
      thickness: t.thickness ?? nt,
      height: t.height,
      kind: t.kind ?? "wall"
    },
    // Keep the defaults out of the YAML so untouched walls stay terse.
    toPatch: (i) => {
      const n = { ...i };
      return "thickness" in i && i.thickness === nt && (n.thickness = void 0), "height" in i && (i.height === void 0 || i.height === null || typeof i.height != "number") && (n.height = void 0), "kind" in i && (n.kind = i.kind === "railing" ? "railing" : void 0), n;
    }
  };
}
function fx(t) {
  return {
    fields: [
      { name: "title", label: "Title", selector: { text: {} } },
      { name: "width", label: "Canvas width", required: !0, selector: { number: { min: 1, mode: "box" } } },
      { name: "height", label: "Canvas height", required: !0, selector: { number: { min: 1, mode: "box" } } },
      {
        name: "grid",
        label: "Grid size",
        required: !0,
        helper: `Gap between grid lines, in canvas units (canvas is ${t.width}×${t.height}). Smaller = finer grid.`,
        selector: { number: { min: 1, mode: "box" } }
      }
    ],
    data: { title: t.title ?? "", width: t.width, height: t.height, grid: t.grid ?? br },
    toPatch: si
  };
}
function mx(t) {
  return {
    fields: [
      {
        name: "pressEffect",
        label: "Press effect",
        helper: "Feedback when a device is pressed. Only devices that do something respond",
        selector: tt(
          O("scale", "Press in"),
          O("ripple", "Ink ripple"),
          O("flash", "Flash"),
          O("none", "None")
        )
      }
    ],
    data: { pressEffect: dn(t) },
    // The default stays out of the YAML, as the skin's does.
    toPatch: (e) => "pressEffect" in e && e.pressEffect === rl ? { ...e, pressEffect: void 0 } : e
  };
}
function yx(t) {
  const e = t.historyReplay?.enabled ?? !1;
  return {
    fields: [
      {
        name: "historyReplayEnabled",
        label: "Enable history replay",
        helper: "Shows replay controls and loads mapped-entity history from Home Assistant",
        selector: { boolean: {} }
      }
    ],
    data: { historyReplayEnabled: e },
    toPatch: (i) => "historyReplayEnabled" in i ? i.historyReplayEnabled ? {
      historyReplay: {
        enabled: !0,
        lookbackSeconds: t.historyReplay?.lookbackSeconds,
        defaultSpeed: t.historyReplay?.defaultSpeed
      }
    } : { historyReplay: void 0 } : {}
  };
}
function gx(t) {
  const e = io(t.skin) ?? Tn[0];
  return {
    fields: [
      {
        name: "skin",
        label: "Skin",
        helper: e.description,
        selector: tt(...Tn.map((i) => O(i.id, i.label)))
      }
    ],
    // An id we don't ship reads back as Default, matching what it renders as.
    data: { skin: e.id },
    toPatch: (i) => (
      // Default is the absence of a skin, so it stays out of the YAML.
      "skin" in i && i.skin === eo ? { ...i, skin: void 0 } : i
    )
  };
}
function bx(t) {
  return {
    fields: [
      {
        name: "roomTints",
        label: "Room tints",
        helper: "Automatic gives each room without its own color a soft tint, different from its neighbors",
        selector: tt(O("off", "Off"), O("auto", "Automatic"))
      }
    ],
    data: { roomTints: Vr(t) },
    toPatch: (e) => "roomTints" in e && e.roomTints !== "auto" ? { ...e, roomTints: void 0 } : e
  };
}
function vx(t) {
  return {
    fields: [
      {
        name: "view",
        label: "View",
        helper: "3D shows standing walls and openings. Editing stays in 2D",
        selector: tt(O("2d", "2D plan"), O("3d", "3D isometric"))
      },
      {
        name: "appearance",
        label: "Appearance",
        helper: "Line art uses crisp outlines on white while keeping devices and doors live",
        selector: tt(O("normal", "Normal"), O("line-art", "Line art"))
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
      ...zi(t.view ?? t.projection) === "iso" ? [
        {
          name: "wallHeight",
          label: "Wall height",
          helper: "Canvas units. Lower walls reveal more of each room",
          selector: { number: { min: 0, max: Mr, step: 1, mode: "slider" } }
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
        selector: tt(O("0", "0°"), O("90", "90°"), O("180", "180°"), O("270", "270°"))
      },
      // Per-orientation overrides (issue #237). Two dropdowns with a "same as
      // above" default rather than a switch plus two angles: the switch would
      // be a third control whose only job is to say whether the other two
      // count, and "same as above" says that per orientation and for free.
      {
        name: "rotationPortrait",
        label: "…on a portrait screen",
        helper: "Overrides the angle above while the screen is taller than it is wide",
        selector: tt(
          O("", "Same as above"),
          O("0", "0°"),
          O("90", "90°"),
          O("180", "180°"),
          O("270", "270°")
        )
      },
      {
        name: "rotationLandscape",
        label: "…on a landscape screen",
        helper: "Overrides the angle above while the screen is wider than it is tall",
        selector: tt(
          O("", "Same as above"),
          O("0", "0°"),
          O("90", "90°"),
          O("180", "180°"),
          O("270", "270°")
        )
      },
      {
        name: "overlayScale",
        label: "Badge & label size",
        // Canvas units lead because they are what a plan wants and what a new
        // plan is created with; fixed pixels are what an older plan is still
        // laid out in, and the right answer for a card shown bigger than its
        // canvas or a wall tablet that wants a px floor under its text.
        helper: `Canvas units scale badges and labels with the drawing. Fixed pixels keep their size whatever width the card gets — suits a card rendered larger than its ${t.width}-wide canvas, or a wall tablet`,
        selector: tt(O("plan", "Canvas units"), O("fixed", "Fixed pixels"))
      },
      ...zn(t.overlayScale) === "plan" ? [{
        name: "overlayMinWidth",
        label: "Stop shrinking below",
        helper: "Keeps badges and labels sized for at least this plan width. 0 allows normal scaling; larger values can cause overlaps on small cards",
        selector: { number: { min: 0, max: oc, step: 20, mode: "slider", unit_of_measurement: "px" } }
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
      ...t.zoomedOverlayScale === "auto" ? [] : [{
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
        selector: { number: { min: 0, max: nd, step: 1, mode: "box", unit_of_measurement: "s" } }
      },
      {
        name: "offlineStyle",
        label: "Offline devices",
        helper: "How a device is drawn when its entity is unavailable or missing",
        selector: tt(
          O("dim", "Dimmed"),
          O("strike", "Dimmed and crossed out"),
          O("none", "No different")
        )
      }
    ],
    data: {
      view: zi(t.view ?? t.projection) === "iso" ? "3d" : "2d",
      appearance: gn(t.appearance),
      showViewControls: t.showViewControls ?? !1,
      showExport: t.showExport ?? !1,
      wallHeight: Zt(t.wallHeight),
      wallOpacity: zl(t.wallOpacity),
      rotation: String(Ke(t.rotation)),
      // "" is "same as above" — the absence of an override, not an angle.
      // `== null` for the same reason resolvePlanRotation uses it: a key
      // written with no value (`rotationPortrait:`) parses to `null`, and
      // reading that as an angle would show 0° here — then write it into the
      // YAML as a real override the moment this panel is saved, turning a
      // stray empty key into an instruction the plan never had.
      rotationPortrait: t.rotationPortrait == null ? "" : String(Ke(t.rotationPortrait)),
      rotationLandscape: t.rotationLandscape == null ? "" : String(Ke(t.rotationLandscape)),
      overlayScale: zn(t.overlayScale),
      overlayMinWidth: Pn(t.overlayMinWidth) ?? 0,
      compactHeader: t.compactHeader ?? !1,
      zoomedOverlayAuto: t.zoomedOverlayScale === "auto",
      zoomedOverlayScale: typeof t.zoomedOverlayScale == "number" ? t.zoomedOverlayScale : Ro,
      roomFocusControls: Ee(t.roomFocus)?.controls ?? !1,
      roomFocusInterval: (Ee(t.roomFocus)?.intervalMs ?? 0) / 1e3,
      offlineStyle: dc(t)
    },
    toPatch: (e) => {
      let i = e;
      "view" in i && (i = { ...i, projection: void 0 }), "rotation" in i && (i = { ...i, rotation: i.rotation === "0" ? void 0 : Number(i.rotation) });
      for (const n of ["rotationPortrait", "rotationLandscape"])
        n in i && (i = { ...i, [n]: i[n] === "" ? void 0 : Number(i[n]) });
      if ("overlayMinWidth" in i && (i = { ...i, overlayMinWidth: Pn(i.overlayMinWidth) }), "compactHeader" in i && !i.compactHeader && (i = { ...i, compactHeader: void 0 }), "offlineStyle" in i && i.offlineStyle === sl && (i = { ...i, offlineStyle: void 0 }), "zoomedOverlayScale" in i && i.zoomedOverlayScale === Ro && (i = { ...i, zoomedOverlayScale: void 0 }), "zoomedOverlayAuto" in i && (i = {
        ...i,
        zoomedOverlayScale: i.zoomedOverlayAuto ? "auto" : void 0,
        zoomedOverlayAuto: void 0
      }), "roomFocusControls" in i || "roomFocusInterval" in i) {
        const n = Ee(t.roomFocus), o = "roomFocusControls" in i ? !!i.roomFocusControls : n?.controls ?? !1, r = "roomFocusInterval" in i ? Number(i.roomFocusInterval) : (n?.intervalMs ?? 0) / 1e3, s = Number.isFinite(r) && r > 0 ? r : 0, a = n?.rooms;
        i = {
          ...i,
          roomFocus: !o && !s ? void 0 : o && !s && !a?.length ? (
            // The plain case says so plainly.
            !0
          ) : { controls: o, ...s ? { interval: s } : {}, ...a?.length ? { rooms: a } : {} },
          roomFocusControls: void 0,
          roomFocusInterval: void 0
        };
      }
      return i;
    }
  };
}
function xx(t) {
  return {
    fields: [
      {
        name: "showDeadSpaces",
        label: "Mark dead spaces",
        helper: "Hatches any space the walls close off that no door or window opens onto",
        selector: { boolean: {} }
      }
    ],
    data: { showDeadSpaces: t.showDeadSpaces ?? !1 },
    // Off is the default, so it stays out of the YAML until switched on.
    toPatch: (e) => "showDeadSpaces" in e && !e.showDeadSpaces ? { ...e, showDeadSpaces: void 0 } : e
  };
}
function wx(t) {
  const e = [
    {
      name: "sunDimming",
      label: "Follow the sun",
      helper: "Dims the plan at night, using your Home Assistant's own sunrise and sunset",
      selector: { boolean: {} }
    }
  ];
  return t.sunDimming && e.push(
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
    fields: e,
    data: {
      sunDimming: t.sunDimming ?? !1,
      sunBrightnessMin: t.sunBrightnessMin ?? fr,
      sunBrightnessMax: t.sunBrightnessMax ?? Sn
    },
    // Off is the default, so keep the whole feature out of the YAML until it
    // is switched on — including the two sliders it drags along with it.
    toPatch: (i) => "sunDimming" in i && !i.sunDimming ? { ...i, sunDimming: void 0, sunBrightnessMin: void 0, sunBrightnessMax: void 0 } : i
  };
}
function _x(t) {
  const e = [
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
  return t.sunlight && (e.push(
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
  ), typeof t.sunBearing != "number" && e.push({
    name: "moonlight",
    label: "Moonlight",
    helper: "After dark the moon lets in its own cooler light, brighter the fuller it is",
    selector: { boolean: {} }
  }), typeof t.sunBearing == "number" && e.push({
    name: "sunBearing",
    label: "Sun from",
    helper: "Compass bearing of the light: 0 = north, 90 = east, 180 = south",
    selector: {
      number: { min: 0, max: 359, step: 5, mode: "slider", unit_of_measurement: "°" }
    }
  })), (t.ambientDaylight || t.sunlight && typeof t.sunBearing != "number") && e.push({
    name: "cloudCoverEntity",
    label: "Clouds",
    helper: "A weather entity, or a cloud cover sensor in %. Cloud thins the sunlight, and the sky light a little",
    selector: { entity: { filter: [{ domain: ["weather", "sensor"] }] } }
  }), {
    fields: e,
    data: {
      cloudCoverEntity: t.cloudCoverEntity ?? "",
      ambientDaylight: t.ambientDaylight ?? !1,
      sunlight: t.sunlight ?? !1,
      sunShade: t.sunShade ?? !0,
      north: t.north ?? 0,
      sunReach: t.sunReach ?? Ri,
      sunFollows: typeof t.sunBearing != "number",
      moonlight: t.moonlight ?? !1,
      sunBearing: t.sunBearing ?? Zo
    },
    toPatch: (i) => {
      let n = { ...i };
      "ambientDaylight" in n && !n.ambientDaylight && (n = { ...n, ambientDaylight: void 0 });
      const o = "sunlight" in n ? !!n.sunlight : !!t.sunlight, r = "ambientDaylight" in n ? !!n.ambientDaylight : !!t.ambientDaylight, s = "sunFollows" in n ? !!n.sunFollows : typeof t.sunBearing != "number";
      return !r && !(o && s) && (n.cloudCoverEntity = void 0), "sunlight" in n && !n.sunlight ? {
        ...n,
        sunlight: void 0,
        north: void 0,
        sunBearing: void 0,
        sunReach: void 0,
        sunShade: void 0,
        sunlightColor: void 0,
        sunShadeColor: void 0,
        moonlight: void 0
      } : ("sunFollows" in n && (n.sunBearing = n.sunFollows ? void 0 : t.sunBearing ?? Zo, n.sunFollows || (n.moonlight = void 0), delete n.sunFollows), "north" in n && !n.north && (n.north = void 0), "sunReach" in n && n.sunReach === Ri && (n.sunReach = void 0), "sunShade" in n && n.sunShade && (n.sunShade = void 0), "moonlight" in n && !n.moonlight && (n.moonlight = void 0), n);
    }
  };
}
function $x(t) {
  const e = [
    {
      name: "isOutdoor",
      label: "Outdoor courtyard floor",
      helper: "Flags this floor level as an outdoor courtyard area",
      selector: { boolean: {} }
    },
    {
      name: "level",
      label: "Storey level",
      helper: "Vertical level index for 3D stacking (0 for ground floor, 1 for 1st floor, -1 for basement)",
      selector: { number: { step: 1, mode: "box" } }
    },
    { name: "image", label: "Bg image", helper: "/local/floorplan.png or URL", selector: { text: {} } }
  ];
  return (t.image || t.imageDark) && (e.push({
    name: "imageFit",
    label: "Image fit",
    helper: "Per floor, so scans of different resolutions can each fit properly",
    selector: tt(
      O("stretch", "Stretch to canvas (may distort)"),
      O("contain", "Fit inside (keep proportions)"),
      O("cover", "Fill canvas (keep proportions, crop)")
    )
  }), e.push({
    name: "imageOpacity",
    label: "Image opacity",
    selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
  })), (t.image || t.imageDark) && e.push({
    name: "imageDark",
    label: "Dark mode image",
    helper: "Optional. Shown instead while Home Assistant is in dark mode",
    selector: { text: {} }
  }), t.image && !t.imageDark && e.push({
    name: "imageInvertDark",
    label: "Invert in dark mode",
    helper: "Dark lines on white become light lines on black",
    selector: { boolean: {} }
  }), {
    fields: e,
    data: {
      isOutdoor: t.isOutdoor ?? !1,
      level: t.level !== void 0 ? t.level : "",
      image: t.image ?? "",
      imageFit: t.imageFit ?? "stretch",
      imageOpacity: t.imageOpacity ?? 1,
      imageDark: t.imageDark ?? "",
      imageInvertDark: t.imageInvertDark ?? !1
    },
    toPatch: (i) => {
      const n = { ...i };
      return "imageFit" in n && n.imageFit === "stretch" && (n.imageFit = void 0), "imageInvertDark" in n && !n.imageInvertDark && (n.imageInvertDark = void 0), "imageDark" in n && !n.imageDark && (n.imageDark = void 0), "isOutdoor" in n && !n.isOutdoor && (n.isOutdoor = void 0), "level" in n && (n.level === "" || n.level === null || isNaN(Number(n.level)) ? n.level = void 0 : n.level = Number(n.level)), n;
    }
  };
}
const kx = 0.5, Sx = 4096;
function Ba(t, e, i, n) {
  if (!(t > 0) || !(e > 0)) return { x: 0, y: 0, scale: 1 };
  const o = Math.min(i / t, n / e);
  return { x: (i - t * o) / 2, y: (n - e * o) / 2, scale: o };
}
function Mx(t) {
  const e = t.pw * t.scale / 2, i = t.ph * t.scale / 2;
  return `translate(${t.x} ${t.y}) rotate(${t.rotation || 0} ${e} ${i}) scale(${t.scale})`;
}
function fd(t) {
  return { w: t.pw * t.scale, h: t.ph * t.scale };
}
function md(t, e, i) {
  return !(e > 0) || !Number.isFinite(e) ? t : {
    ...t,
    scale: t.scale * e,
    x: i.x + (t.x - i.x) * e,
    y: i.y + (t.y - i.y) * e
  };
}
function Ex(t, e, i, n) {
  const o = Math.hypot(i.x - e.x, i.y - e.y);
  return !(o > 0) || !(n > 0) ? t : md(t, n / o, e);
}
function Ax(t, e) {
  const { w: i, h: n } = fd(t);
  return !(e > 0) || !(i > 0) ? t : md(t, e / i, { x: t.x + i / 2, y: t.y + n / 2 });
}
const Tx = "4.10.38", Ua = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${Tx}/build/`, Cx = "sha384-+0ti2moQlmLN7WZHE2RHIf5lV8hHxhxEalN0il3YZceG26fUPyOkR0hp9daxk1i7", Ix = "sha384-ToeVvShCxKc6CEvhHeMt0Q8A06pSPDbAlngO9nokrDmh914gk/pYd0N7D0a4Lz2o";
async function Va(t, e) {
  const i = await fetch(t, { integrity: e, mode: "cors", credentials: "omit" });
  if (!i.ok) throw new Error(`PDF reader request failed (${i.status}).`);
  return i.text();
}
let Ao = null;
function zx() {
  return Ao ??= (async () => {
    let t, e;
    try {
      const [i, n] = await Promise.all([
        Va(`${Ua}pdf.min.mjs`, Cx),
        Va(`${Ua}pdf.worker.min.mjs`, Ix)
      ]);
      t = URL.createObjectURL(new Blob([i], { type: "text/javascript" })), e = URL.createObjectURL(new Blob([n], { type: "text/javascript" }));
      const o = await import(
        /* @vite-ignore */
        t
      );
      return o.GlobalWorkerOptions.workerSrc = e, o;
    } catch (i) {
      throw e && URL.revokeObjectURL(e), Ao = null, new Error(
        `Could not load and verify the PDF reader. Check the connection and browser policy, or export the page as PNG/JPG and load that instead. (${i instanceof Error ? i.message : String(i)})`
      );
    } finally {
      t && URL.revokeObjectURL(t);
    }
  })(), Ao;
}
function yd(t) {
  return t.type === "application/pdf" || /\.pdf$/i.test(t.name);
}
function Px(t, e) {
  const i = Math.max(t, e);
  return i > 0 ? Sx / i : 1;
}
async function gd(t, e = 1) {
  const n = await (await zx()).getDocument({ data: new Uint8Array(await t.arrayBuffer()), isEvalSupported: !1 }).promise;
  try {
    const o = Math.min(Math.max(1, Math.round(e)), n.numPages), r = await n.getPage(o), s = r.getViewport({ scale: 1 }), a = r.getViewport({ scale: Px(s.width, s.height) }), l = document.createElement("canvas");
    l.width = Math.round(a.width), l.height = Math.round(a.height);
    const c = l.getContext("2d");
    if (!c) throw new Error("This browser cannot draw the PDF (no 2D canvas).");
    await r.render({ canvasContext: c, viewport: a, background: "#ffffff" }).promise, r.cleanup?.();
    const d = await new Promise((h) => l.toBlob(h, "image/png"));
    if (!d) throw new Error("Could not rasterise the PDF page.");
    return {
      src: URL.createObjectURL(d),
      pw: l.width,
      ph: l.height,
      page: o,
      pages: n.numPages
    };
  } finally {
    n.destroy();
  }
}
async function Ox(t) {
  const e = URL.createObjectURL(t), i = new Image();
  i.src = e;
  try {
    await i.decode();
  } catch {
    throw URL.revokeObjectURL(e), new Error("That file is not an image this browser can read. Use a PDF, PNG, JPG or SVG.");
  }
  return { src: e, pw: i.naturalWidth || 1e3, ph: i.naturalHeight || 1e3 };
}
function Lx(t) {
  return yd(t) ? gd(t, 1) : Ox(t);
}
var Fx = Object.defineProperty, Rx = Object.getOwnPropertyDescriptor, K = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Rx(e, i) : e, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (o = (n ? s(e, i, o) : s(o)) || o);
  return n && o && Fx(e, i, o), o;
};
const rr = "easy-floorplan:wall-thickness";
function Dx() {
  try {
    const t = Number(localStorage.getItem(rr));
    return t >= 2 && t <= Ti ? t : void 0;
  } catch {
    return;
  }
}
function Nx(t) {
  try {
    t === void 0 ? localStorage.removeItem(rr) : localStorage.setItem(rr, String(t));
  } catch {
  }
}
const To = 0.3, Hx = (t) => t.label, jx = (t) => t.helper, _e = {
  select: { icon: "mdi:cursor-default", label: "Select" },
  wall: { icon: "mdi:wall", label: "Wall" },
  door: { icon: "mdi:door", label: "Door" },
  // Two jambs and the span between them — which is all a passage is, and the
  // one number it is placed by (issue #309).
  passage: { icon: "mdi:arrow-expand-horizontal", label: "Passage" },
  window: { icon: "mdi:window-closed-variant", label: "Window" },
  // Skylight uses home-roof to distinguish from standard windows.
  skylight: { icon: "mdi:home-roof", label: "Skylight" },
  tracker: { icon: "mdi:crosshairs-gps", label: "Tracker" },
  area: { icon: "mdi:vector-polygon", label: "Area" },
  roof: { icon: "mdi:home-outline", label: "Roof" }
}, qa = [
  "select",
  "wall",
  "door",
  "passage",
  "window",
  "skylight",
  "tracker",
  "area",
  "roof"
], en = (t, e) => ({ x: t * 0.93, y: e * 0.08 }), Co = 4, Wx = 4, Io = 12, Bx = 200, Ux = {
  wall: "mdi:wall",
  opening: "mdi:door",
  item: "mdi:lightbulb-outline",
  text: "mdi:format-text",
  furniture: "mdi:sofa-outline",
  tracker: "mdi:crosshairs-gps",
  area: "mdi:floor-plan",
  roof: "mdi:home-outline"
}, Ya = 35, Vx = 8, qx = 2e3, Yx = 10;
function zo(t) {
  return t.some((e) => {
    const i = e, n = i.tagName?.toLowerCase();
    return n === "input" || n === "textarea" || n === "select" || n === "ha-form" || n === "ha-entity-picker" || n === "ha-icon-picker" || i.isContentEditable === !0;
  });
}
let j = class extends fe {
  constructor() {
    super(...arguments), this._wallMaskId = `fp-edit-wall-mask-${j._nextWallMaskId++}`, this._watchedEntities = /* @__PURE__ */ new Set(), this._tool = "select", this._selection = [], this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaHover = null, this._areaDragStart = null, this._areaDragCurrent = null, this._areaDragTimer = null, this._areaDragMoved = !1, this._freeWalls = !1, this._defaultOpeningLength = 60, this._defaultWallThickness = Dx(), this._defaultSkylightLength = 70, this._defaultSkylightWidth = 44, this._marquee = null, this._history = [], this._future = [], this._zoom = 1, this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "", this._symbolDraft = "", this._symbolError = "", this._paletteError = "", this._projectOpen = !1, this._selectionPage = "properties", this._projectPage = "plan", this._actionYaml = !1, this._actionYamlError = "", this._actionYamlSeen = { key: "", json: "", gen: 0 }, this._mobileInspector = !1, this._previewCollapsed = !1, this._keyboardOpen = !1, this._fullscreen = !1, this._applyState = "idle", this._applyError = "", this._applyResetTimer = null, this._fitToViewport = !0, this._drag = null, this._dragMoves = new Fa(La, (t) => {
      this._drag && this._applyDrag(t);
    }), this._switcherMoves = new Fa(La, (t) => {
      this._switcherDrag && (this._config = {
        ...this._config,
        floorSwitcher: { ...this._config.floorSwitcher, x: t.x, y: t.y }
      });
    }), this._dragDirty = !1, this._pickAnchor = null, this._hideLabels = !1, this._traces = /* @__PURE__ */ new Map(), this._traceMode = null, this._traceCalib = {
      // A door: the editor's default opening, so the likeliest thing to click.
      distance: 60
    }, this._refFloors = /* @__PURE__ */ new Map(), this._traceLoads = /* @__PURE__ */ new Map(), this._traceBusy = !1, this._traceError = "", this._traceDrag = null, this._autoSides = /* @__PURE__ */ new Map(), this._autoLabelSig = [], this._autoLayoutSerial = 0, this._pinchPts = /* @__PURE__ */ new Map(), this._pinch = null, this._gesturePointer = null, this._marqueeAdd = !1, this._clipboard = null, this._onKeyDown = (t) => this._handleKeyDown(t), this._onHostKeyDown = (t) => {
      t.key !== "Escape" || !this._fullscreen || zo(t.composedPath()) && (t.preventDefault(), t.stopPropagation(), this._canvasWrap?.focus({ preventScroll: !0 }));
    }, this._onFocusIn = (t) => {
      this._fullscreen && !t.composedPath().includes(this) && (this._fullscreen = !1), this._syncVisualViewport();
    }, this._syncVisualViewport = () => {
      const t = window.visualViewport, e = t?.scale === 1 ? t.height : window.innerHeight, i = t?.scale === 1 ? t.offsetTop : 0;
      this.style.setProperty("--editor-viewport-height", `${e}px`), this.style.setProperty("--editor-viewport-top", `${i}px`);
      let n = this.shadowRoot?.activeElement ?? null;
      const o = [];
      for (; n; )
        o.push(n), n = n.shadowRoot?.activeElement ?? null;
      this._keyboardOpen = window.innerHeight - e > 120 && zo(o);
    }, this._preventGesture = (t) => t.preventDefault(), this._onWrapPointerDown = (t) => {
      if (t.pointerType !== "touch" || (this._pinchPts.set(t.pointerId, { x: t.clientX, y: t.clientY }), this._pinchPts.size !== 2)) return;
      this._cancelGesture();
      const e = this._canvasWrap, i = e?.getBoundingClientRect(), [n, o] = [...this._pinchPts.values()];
      this._pinch = {
        d0: Math.max(Math.hypot(o.x - n.x, o.y - n.y), 1),
        z0: this._zoom,
        cx: (n.x + o.x) / 2 - (i?.left ?? 0) + (e?.scrollLeft ?? 0),
        cy: (n.y + o.y) / 2 - (i?.top ?? 0) + (e?.scrollTop ?? 0)
      }, t.stopPropagation();
    }, this._onWrapPointerMove = (t) => {
      if (!this._pinch || !this._pinchPts.has(t.pointerId) || (this._pinchPts.set(t.pointerId, { x: t.clientX, y: t.clientY }), this._pinchPts.size < 2)) return;
      t.preventDefault(), t.stopPropagation();
      const [e, i] = [...this._pinchPts.values()], n = this._pinch;
      this._setZoom(n.z0 * (Math.hypot(i.x - e.x, i.y - e.y) / n.d0)), this.updateComplete.then(() => {
        const o = this._canvasWrap;
        if (!o || this._pinch !== n) return;
        const r = o.getBoundingClientRect(), s = this._zoom / n.z0;
        o.scrollLeft = n.cx * s - ((e.x + i.x) / 2 - r.left), o.scrollTop = n.cy * s - ((e.y + i.y) / 2 - r.top);
      });
    }, this._onWrapPointerEnd = (t) => {
      t.pointerType === "touch" && (this._pinchPts.delete(t.pointerId), this._pinchPts.size < 2 && (this._pinch = null));
    }, this._liveEditKey = null, this._onEditorPointerDown = () => {
      this._liveEditKey = null;
    }, this._gridCache = null, this._onInspectorTabKeyDown = async (t) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(t.key)) return;
      t.preventDefault();
      const e = t.key === "Home" ? !1 : t.key === "End" ? !0 : !this._projectOpen;
      this._setInspector(e), await this.updateComplete, this.renderRoot.querySelector(e ? "#project-tab" : "#selection-tab")?.focus();
    }, this._apply = async () => {
      if (this._applyState === "saving") return;
      this._applyResetTimer !== null && clearTimeout(this._applyResetTimer), this._applyState = "saving", this._applyError = "", await this.updateComplete, await new Promise((e) => setTimeout(e, 0));
      const t = await Kv(this);
      if (!t.ok) {
        this._applyState = "idle", this._applyError = t.error;
        return;
      }
      this._applyState = "saved", this._applyResetTimer = setTimeout(() => {
        this._applyResetTimer = null, this._applyState = "idle";
      }, qx);
    }, this._onSwitcherDown = (t) => {
      if (this._tool !== "select" || t.button !== 0 || this._gesturePointer !== null) return;
      t.stopPropagation(), t.preventDefault(), this._canvasWrap?.focus({ preventScroll: !0 });
      const e = t.currentTarget;
      this._switcherDrag = {
        pointerId: t.pointerId,
        handle: e,
        moved: !1,
        at: this._toVirtual(t, !1),
        before: this._config,
        priorFuture: this._future
      }, this._gesturePointer = t.pointerId, this._capturePointer(t, e);
    }, this._onSwitcherMove = (t) => {
      const e = this._switcherDrag;
      if (!e || e.pointerId !== t.pointerId) return;
      if (t.stopPropagation(), t.buttons === 0) {
        this._forgetSwitcherTouch(t), this._cancelGesture();
        return;
      }
      const i = this._toVirtual(t, !1);
      !e.moved && Math.hypot(i.x - e.at.x, i.y - e.at.y) <= Co || (e.moved || (e.priorHistory = this._history, this._pushHistory(), e.moved = !0), this._switcherMoves.push(this._toVirtual(t)));
    }, this._onSwitcherUp = (t) => {
      const e = this._switcherDrag;
      !e || e.pointerId !== t.pointerId || (t.stopPropagation(), this._forgetSwitcherTouch(t), this._releasePointer(t, e.handle), e.moved && this._switcherMoves.push(this._toVirtual(t)), this._switcherMoves.settle(), this._switcherDrag = void 0, this._gesturePointer = null, e.moved && this._emit(this._config));
    }, this._onSwitcherCancel = (t) => {
      const e = this._switcherDrag;
      !e || e.pointerId !== t.pointerId || (t.stopPropagation(), this._forgetSwitcherTouch(t), this._releasePointer(t, e.handle), this._rollBackSwitcherDrag());
    }, this._addSymbol = () => {
      let t;
      try {
        t = JSON.parse(this._symbolDraft);
      } catch (n) {
        this._symbolError = `Not valid JSON — ${n.message}`;
        return;
      }
      const e = [], i = ro(t, void 0, e);
      if (!i) {
        this._symbolError = e[0] ?? "Not a usable symbol.";
        return;
      }
      this._patchConfig({ symbols: { ...this._config.symbols ?? {}, [i.id]: t } }), this._symbolDraft = "", this._symbolError = "";
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._canvasWrap && this._canvasResize?.observe(this._canvasWrap), window.addEventListener("keydown", this._onKeyDown, !0), this.addEventListener("keydown", this._onHostKeyDown), window.addEventListener("focusin", this._onFocusIn), window.visualViewport?.addEventListener("resize", this._syncVisualViewport), window.visualViewport?.addEventListener("scroll", this._syncVisualViewport), window.addEventListener("resize", this._syncVisualViewport), this._syncVisualViewport();
    const t = this.renderRoot;
    t.addEventListener("pointermove", this._onSwitcherMove, !0), t.addEventListener("pointerup", this._onSwitcherUp, !0), t.addEventListener("pointercancel", this._onSwitcherCancel, !0);
  }
  disconnectedCallback() {
    this._numberDraft = void 0, this._canvasResize?.disconnect(), window.removeEventListener("keydown", this._onKeyDown, !0), this.removeEventListener("keydown", this._onHostKeyDown), window.removeEventListener("focusin", this._onFocusIn), window.visualViewport?.removeEventListener("resize", this._syncVisualViewport), window.visualViewport?.removeEventListener("scroll", this._syncVisualViewport), window.removeEventListener("resize", this._syncVisualViewport);
    const t = this.renderRoot;
    t.removeEventListener("pointermove", this._onSwitcherMove, !0), t.removeEventListener("pointerup", this._onSwitcherUp, !0), t.removeEventListener("pointercancel", this._onSwitcherCancel, !0), this._applyResetTimer !== null && clearTimeout(this._applyResetTimer), this._clearAreaDragTimer(), this._areaDragStart = null, this._areaDragCurrent = null, this._areaDragMoved = !1, this._dragMoves.cancel(), this._flushDrag(), this._drag = null, this._traceDrag = null, this._switcherMoves.settle(), this._switcherDrag?.moved && this._emit(this._config), this._switcherDrag = void 0, this._gesturePointer = null, this._resetPinch(), super.disconnectedCallback();
  }
  setConfig(t) {
    il(t);
    const e = { ...eh(t.type || "custom:easy-floorplan-card"), ...t }, i = yt(e).map((n) => structuredClone(n));
    this._config = {
      ...e,
      floors: i,
      walls: [],
      openings: [],
      items: [],
      texts: [],
      furniture: [],
      trackers: []
    }, (!this._activeFloorId || !i.some((n) => n.id === this._activeFloorId)) && (this._activeFloorId = e.defaultFloor && i.some((n) => n.id === e.defaultFloor) ? e.defaultFloor : i[0].id), this._lastEmitted && t !== this._lastEmitted && !No(t, this._lastEmitted) && (this._history = [], this._future = [], this._liveEditKey = null), this._watchedEntities = He(this._config);
  }
  /**
   * HA replaces `hass` on every state change in the instance; the editor's
   * render is expensive (full SVG + panels). Skip ticks that can't change
   * anything we draw. Entity pickers keep the `hass` they last rendered with —
   * acceptable, the registry data they browse changes rarely.
   */
  shouldUpdate(t) {
    if (!(t.size === 1 && t.has("hass"))) return !0;
    const e = t.get("hass");
    if (!e || !this.hass) return !0;
    const i = (n) => n.floors;
    return i(e) !== i(this.hass) || Ze(e) !== Ze(this.hass) ? !0 : Hl(e, this.hass, this._watchedEntities);
  }
  // ---- active floor access -----------------------------------------------
  /**
   * Place the canvas's `labelPosition: auto` labels, as the card does (see its
   * `_syncAutoLabels`): only when the config, floor, zoom or a label's length
   * changed, reads first and one more render if a side moved.
   */
  _syncAutoLabels() {
    if (this._hideLabels || !this._autoLabelSig.length || !this._config) return;
    this._config !== this._autoLayoutConfig && (this._autoLayoutConfig = this._config, this._autoLayoutSerial++);
    const t = `${this._autoLayoutSerial}|${this._activeFloorId}|${this._zoom}|${this._autoLabelSig.join(",")}`;
    if (t === this._autoLayoutKey) return;
    const e = this.renderRoot.querySelector(".stage"), i = e?.querySelector(":scope > .items");
    if (!e || !i) return;
    const n = i.getBoundingClientRect();
    if (!(n.width > 0 && n.height > 0)) return;
    this._autoLayoutKey = t;
    const o = this._config, r = this._floor(), s = n.width / W(o.width, Ct), a = n.height / W(o.height, Ot), l = r.areas.flatMap((p) => ii(p.id, p.points, p.sideWalls ?? {})), c = [...r.walls, ...l].map((p) => ({
      x1: n.left + p.x1 * s,
      y1: n.top + p.y1 * a,
      x2: n.left + p.x2 * s,
      y2: n.top + p.y2 * a,
      half: Lt(p.thickness) * s / 2
    })), d = hd({
      items: [...i.querySelectorAll(":scope > .edit-item")],
      autoKey: (p) => p.dataset.labelAuto,
      solid: (p) => p.querySelector(":scope > .badge, :scope > .stack .badge"),
      label: (p) => p.querySelector(":scope > .ilabel"),
      current: this._autoSides,
      marks: [...i.querySelectorAll(":scope > .shutter-mark")],
      names: [...i.querySelectorAll(":scope > .edit-text")],
      openings: [...e.querySelectorAll("svg .fp-opening:not(.fp-opening-skylight)")],
      walls: c,
      bounds: Kt(e.getBoundingClientRect()),
      scalePlan: e.classList.contains("scale-plan")
    });
    for (const p of [...this._autoSides.keys()]) d.has(p) || this._autoSides.delete(p);
    let h = !1;
    for (const [p, f] of d)
      this._autoSides.get(p) !== f && (this._autoSides.set(p, f), h = !0);
    h && this.requestUpdate();
  }
  _floor() {
    const t = this._config.floors ?? [];
    return t.find((e) => e.id === this._activeFloorId) ?? t[0];
  }
  /**
   * The shipped symbol library with this config's own `symbols:` merged over
   * it (issue #90). Memoized on the config's identity inside `symbolCatalog`,
   * so calling it per cell in the picker costs one lookup.
   */
  _symbols() {
    return $e(this._config.symbols);
  }
  /** Discrete change to the active floor's elements (snapshots for undo). */
  _commitFloor(t) {
    this._commit({ ...this._config, floors: this._patchFloors(t) });
  }
  /** Live change to the active floor's elements (no history snapshot — for dragging). */
  _emitFloor(t) {
    const e = { ...this._config, floors: this._patchFloors(t) };
    if (this._drag) {
      this._config = e, this._watchedEntities = He(e), this._dragDirty = !0;
      return;
    }
    this._emit(e);
  }
  /** Hand the host what a drag accumulated — once, on release. */
  _flushDrag() {
    this._dragDirty && (this._dragDirty = !1, this._emit(this._config));
  }
  _patchFloors(t) {
    const e = this._config.floors ?? [], i = e.find((n) => n.id === this._activeFloorId) ?? e[0];
    return e.map((n) => i && n.id === i.id ? { ...n, ...t } : n);
  }
  firstUpdated() {
    this._ensureHaComponents(), this._canvasWrap && typeof ResizeObserver < "u" && (this._canvasResize = new ResizeObserver(() => {
      const e = this.renderRoot.querySelector(".side"), i = this._mobileInspector && !this._projectOpen && this._primary() && e && this._canvasWrap && e.getBoundingClientRect().top >= this._canvasWrap.getBoundingClientRect().bottom;
      this._fitToViewport && this._gesturePointer === null && !i && this._fitView(), this._autoLayoutKey = void 0, this.updateComplete.then(() => this._syncAutoLabels()), this.updateComplete.then(() => this._keepSelectionInPreview());
    }), this._canvasResize.observe(this._canvasWrap));
    for (const e of [
      "ha-form",
      "ha-entity-picker",
      "ha-entity-attribute-picker",
      "ha-icon-picker",
      "ha-combo-box"
    ])
      customElements.get(e) || customElements.whenDefined(e).then(() => this.requestUpdate());
    const t = this._canvasWrap;
    if (t) {
      t.addEventListener("pointerdown", this._onWrapPointerDown, { capture: !0 }), t.addEventListener("pointermove", this._onWrapPointerMove, { capture: !0 }), t.addEventListener("pointerup", this._onWrapPointerEnd, { capture: !0 }), t.addEventListener("pointercancel", this._onWrapPointerEnd, { capture: !0 });
      for (const e of ["gesturestart", "gesturechange", "gestureend"])
        t.addEventListener(e, this._preventGesture);
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
  willUpdate(t) {
    const e = t.get("_config");
    if (e && this._fitToViewport && (e.width !== this._config.width || e.height !== this._config.height) && this._fitView(), t.has("_selection")) {
      const i = t.get("_selection") ?? [], n = (o) => o.map((r) => `${r.kind}:${r.id}`).join(",");
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
    if (this._syncAutoLabels(), !this._fullscreen) return;
    const t = this._editorEl;
    if (!(!t?.isConnected || typeof t.showPopover != "function") && !t.matches(":popover-open"))
      try {
        t.showPopover();
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
    const t = await window.loadCardHelpers?.();
    if (t) {
      for (const e of [{ type: "button" }, { type: "entities", entities: [] }])
        try {
          await (await t.createCardElement(e))?.constructor?.getConfigElement?.();
        } catch {
        }
      this.requestUpdate();
    }
  }
  get grid() {
    return this._config.grid ?? br;
  }
  /**
   * Resolved placement snap step. `snap` is tri-state in the config: unset
   * means "follow the grid" (the default behaviour), `0` is free placement,
   * any other number is a custom step. See {@link resolveSnap}.
   */
  get _resolvedSnap() {
    return Zd(this._config.snap, this.grid);
  }
  /** Which radio option the panel's "Snap to" control shows as active. */
  get _snapMode() {
    const t = this._config.snap;
    return t == null ? "grid" : t === 0 ? "off" : "custom";
  }
  _setSnapMode(t) {
    if (t === "grid")
      this._patchConfig({ snap: void 0 });
    else if (t === "off")
      this._patchConfig({ snap: 0 });
    else {
      const e = this._config.snap;
      this._patchConfig({
        snap: e && e > 0 ? e : vo(bs, this.grid)
      });
    }
  }
  /** Grid update plus a custom-snap rescale so its percentage of the grid is preserved. */
  _gridPatch(t) {
    const e = { grid: t };
    if (this._snapMode === "custom") {
      const i = vs(this._config.snap, this.grid);
      e.snap = vo(i, t);
    }
    return e;
  }
  _snap(t) {
    const e = this._resolvedSnap;
    return e > 0 ? Math.round(t / e) * e : t;
  }
  _toVirtual(t, e = !0) {
    const n = this._svg.getScreenCTM();
    if (!n) return { x: 0, y: 0 };
    const o = new DOMPoint(t.clientX, t.clientY).matrixTransform(n.inverse());
    return e ? { x: this._snap(o.x), y: this._snap(o.y) } : { x: o.x, y: o.y };
  }
  /**
   * The reference floor's walls, while one is shown under this floor — ids
   * prefixed so they can never collide with this floor's own (a floor added
   * by copying keeps its walls' ids).
   */
  _refWalls() {
    const t = this._refFloor();
    return t ? t.walls.map((e) => ({ ...e, id: `ref:${e.id}` })) : [];
  }
  /**
   * Walls a new point may snap to: this floor's, plus the reference floor's
   * while it is shown — tracing the floor below onto this one means landing
   * exactly on its corners, not a few units off them.
   */
  _snapWalls() {
    const t = this._floor().walls, e = this._refWalls();
    return e.length ? [...t, ...e] : t;
  }
  /** Remember the thickness new walls are drawn at (clamped like the wall form). */
  _setDefaultWallThickness(t) {
    if (!Number.isFinite(t)) return;
    const e = Math.min(Ti, Math.max(2, Math.round(t)));
    this._defaultWallThickness = e === nt ? void 0 : e, Nx(this._defaultWallThickness);
  }
  /** Nearest existing wall endpoint within ENDPOINT_SNAP, or null. */
  _nearestCorner(t, e) {
    return ed(this._snapWalls(), t, e, Ue);
  }
  /** Snap a raw point to a nearby existing wall endpoint, else to the snap step. */
  _snapWallPoint(t, e) {
    return this._nearestCorner(t, e) ?? { x: this._snap(t), y: this._snap(e) };
  }
  /**
   * Snap a raw point for Area drawing/editing: nearby wall corner or another
   * Area's vertex wins (so adjacent rooms can share an exact boundary point),
   * else the grid/snap step. `exclude` drops one vertex from the candidate
   * set — the one currently being dragged, so it can't snap to itself.
   */
  _snapAreaPoint(t, e, i) {
    return z0(
      { walls: this._snapWalls(), areas: this._floor().areas },
      t,
      e,
      Ue,
      i
    ) ?? {
      x: this._snap(t),
      y: this._snap(e)
    };
  }
  /**
   * Like {@link _snapWallPoint}, but ignores endpoints in `moving` (keys
   * `${wallId}:${end}`) — the corner cluster being dragged must not attract
   * itself.
   */
  _snapWallPointExcluding(t, e, i) {
    let n = null, o = Ue;
    for (const r of this._snapWalls())
      for (const s of [1, 2]) {
        if (i.has(`${r.id}:${s}`)) continue;
        const a = s === 1 ? r.x1 : r.x2, l = s === 1 ? r.y1 : r.y2, c = Math.hypot(t - a, e - l);
        c < o && (o = c, n = { x: a, y: l });
      }
    return n ?? { x: this._snap(t), y: this._snap(e) };
  }
  /** See {@link snapWallEnd}: corners win, then axis gravity, then the snap step. */
  _snapWallEnd(t, e, i, n) {
    return O0(
      this._snapWalls(),
      t,
      e,
      i,
      n,
      (o) => this._snap(o),
      this._freeWalls,
      Yx,
      Ue
    );
  }
  _emit(t) {
    this._drag && (this._drag.emitted = !0), this._config = t, this._watchedEntities = He(t);
    const e = { ...t };
    for (const i of ["walls", "openings", "items", "texts", "furniture", "trackers", "areas"])
      e[i]?.length || delete e[i];
    this._lastEmitted = structuredClone(e), this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: e }, bubbles: !0, composed: !0 })
    );
  }
  _pushHistory(t = null) {
    this._history = [...this._history, structuredClone(this._config)].slice(-60), this._future = [], this._liveEditKey = t;
  }
  /** Discrete change: snapshot for undo, then emit. */
  _commit(t) {
    this._pushHistory(), this._emit(t);
  }
  _undo() {
    if (this._liveEditKey = null, !this._history.length) return;
    this._future = [structuredClone(this._config), ...this._future];
    const t = this._history[this._history.length - 1];
    this._history = this._history.slice(0, -1), this._restoreHistory(t);
  }
  _redo() {
    if (this._liveEditKey = null, !this._future.length) return;
    this._history = [...this._history, structuredClone(this._config)];
    const t = this._future[0];
    this._future = this._future.slice(1), this._restoreHistory(t);
  }
  /** Keep property edits in context, but never retain an object removed by undo. */
  _restoreHistory(t) {
    const e = t.floors?.find((i) => i.id === this._activeFloorId);
    this._selection = e ? this._selection.filter((i) => qr(e, i)) : [], this._emit(t);
  }
  // ---- selection ----------------------------------------------------------
  /** The element whose properties show in the panel (the most recent selection). */
  _primary() {
    return this._selection[this._selection.length - 1] ?? null;
  }
  _selectOne(t) {
    this._selection = [t], this._liveEditKey = null;
  }
  _toggleSel(t) {
    this._selection = this._isSel(t.kind, t.id) ? this._selection.filter((e) => !(e.kind === t.kind && e.id === t.id)) : [...this._selection, t], this._liveEditKey = null;
  }
  _clearSel() {
    this._selection = [], this._liveEditKey = null;
  }
  /** Pointer-driven selection: modifier toggles; plain click selects unless already in the set. */
  _selectForPointer(t, e) {
    if (t.shiftKey || t.ctrlKey || t.metaKey) {
      this._toggleSel(e);
      return;
    }
    this._isSel(e.kind, e.id) || this._selectOne(e);
  }
  _idsOfKind(t) {
    return new Set(this._selection.filter((e) => e.kind === t).map((e) => e.id));
  }
  _mergeSel(t, e) {
    const i = [...t];
    for (const n of e) i.some((o) => o.kind === n.kind && o.id === n.id) || i.push(n);
    return i;
  }
  // ---- keyboard nudging ---------------------------------------------------
  _handleKeyDown(t) {
    const e = this.checkVisibility;
    if (e && !e.call(this)) return;
    const i = t.composedPath();
    if (!i.includes(this)) {
      this._fullscreen && t.key === "Escape" && (t.preventDefault(), t.stopPropagation(), this._fullscreen = !1);
      return;
    }
    if (zo(i) || i.some((c) => c instanceof Element && c.getAttribute("role") === "tab") && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(t.key)) return;
    const n = t.ctrlKey || t.metaKey, o = t.key.toLowerCase(), r = !!(this._drag || this._draft || this._draftTracker || this._draftArea || this._marquee || // The switcher's drag is a gesture like any other (issue #281): an undo
    // or a nudge landing mid-drag would interleave with its history snapshot
    // and its eventual emit.
    this._switcherDrag);
    if (t.key === "Backspace" && this._draftArea?.points.length) {
      t.preventDefault();
      const c = this._draftArea.points.slice(0, -1);
      this._draftArea = c.length ? { points: c } : null;
      return;
    }
    if (r && t.key !== "Escape" && !(n && o === "c")) return;
    if (n && o === "c") {
      this._selection.length && (t.preventDefault(), this._copy());
      return;
    }
    if (n && o === "v") {
      this._clipboard && (t.preventDefault(), this._paste());
      return;
    }
    if (n && o === "d") {
      this._selection.length && (t.preventDefault(), this._duplicate());
      return;
    }
    if (n && o === "z") {
      t.preventDefault(), t.shiftKey ? this._redo() : this._undo();
      return;
    }
    if (n && o === "y") {
      t.preventDefault(), this._redo();
      return;
    }
    if (t.key === "Escape") {
      if (this._floorMenuOpen || this._addMenuOpen) {
        t.preventDefault(), t.stopPropagation(), this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "";
        return;
      }
      if (this._traceMode) {
        t.preventDefault(), t.stopPropagation(), this._endTraceMode();
        return;
      }
      this._draft || this._draftTracker || this._draftArea || this._marquee || this._drag || this._switcherDrag ? (t.preventDefault(), t.stopPropagation(), this._cancelGesture()) : this._selection.length ? (t.preventDefault(), t.stopPropagation(), this._clearSel()) : this._fullscreen && (t.preventDefault(), t.stopPropagation(), this._fullscreen = !1);
      return;
    }
    if ((t.key === "Delete" || t.key === "Backspace") && this._selection.length) {
      t.preventDefault(), this._deleteSelected();
      return;
    }
    if (!this._selection.length) return;
    const a = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1]
    }[t.key];
    if (!a) return;
    t.preventDefault();
    const l = t.shiftKey ? this.grid : this._resolvedSnap || 1;
    this._nudge(a[0] * l, a[1] * l);
  }
  _nudge(t, e) {
    if (!this._selection.length) return;
    const i = this._floor();
    if (!H0(i, this._selection).length) return;
    const n = (p) => {
      const f = this._idsOfKind(p);
      for (const u of f) Xi(i, { kind: p, id: u }) && f.delete(u);
      return f;
    }, o = n("wall"), r = n("opening"), s = n("item"), a = n("text"), l = n("furniture"), c = n("tracker"), d = n("area"), h = n("roof");
    this._commitFloor({
      walls: i.walls.map(
        (p) => o.has(p.id) ? { ...p, x1: p.x1 + t, y1: p.y1 + e, x2: p.x2 + t, y2: p.y2 + e } : p
      ),
      openings: i.openings.map((p) => r.has(p.id) ? { ...p, x: p.x + t, y: p.y + e } : p),
      items: i.items.map((p) => s.has(p.id) ? { ...p, x: p.x + t, y: p.y + e } : p),
      texts: i.texts.map((p) => a.has(p.id) ? { ...p, x: p.x + t, y: p.y + e } : p),
      furniture: i.furniture.map(
        (p) => l.has(p.id) ? { ...p, x: p.x + t, y: p.y + e } : p
      ),
      trackers: (i.trackers ?? []).map(
        (p) => c.has(p.id) ? { ...p, x: p.x + t, y: p.y + e } : p
      ),
      areas: (i.areas ?? []).map(
        (p) => d.has(p.id) ? { ...p, points: p.points.map((f) => ({ x: f.x + t, y: f.y + e })) } : p
      ),
      roofs: (i.roofs ?? []).map(
        (p) => h.has(p.id) ? { ...p, points: p.points.map((f) => ({ x: f.x + t, y: f.y + e })) } : p
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
  _capturePointer(t, e = t.target) {
    try {
      e?.setPointerCapture?.(t.pointerId);
    } catch {
    }
  }
  /** Best-effort release; pointerup releases capture implicitly anyway. */
  _releasePointer(t, e = t.target) {
    try {
      e?.releasePointerCapture?.(t.pointerId);
    } catch {
    }
  }
  _onCanvasDown(t) {
    if (t.button !== 0 || this._gesturePointer !== null) return;
    this._canvasWrap?.focus({ preventScroll: !0 });
    const e = this._toVirtual(t, !1);
    if (this._tool === "wall") {
      const i = this._freeWalls ? { x: this._snap(e.x), y: this._snap(e.y) } : this._snapWallPoint(e.x, e.y);
      this._draft = { x1: i.x, y1: i.y, x2: i.x, y2: i.y }, this._gesturePointer = t.pointerId, this._capturePointer(t);
      return;
    }
    if (this._tool === "door" || this._tool === "passage" || this._tool === "window" || this._tool === "skylight") {
      this._addOpening(this._tool, this._snap(e.x), this._snap(e.y));
      return;
    }
    if (this._tool === "tracker") {
      const i = this._snap(e.x), n = this._snap(e.y);
      this._draftTracker = { x0: i, y0: n, x1: i, y1: n }, this._gesturePointer = t.pointerId, this._capturePointer(t);
      return;
    }
    if (this._tool === "area" || this._tool === "roof") {
      const i = this._snapAreaPoint(e.x, e.y);
      if (this._draftArea) {
        this._addAreaPoint(i), this._areaHover = null;
        return;
      }
      this._areaDragStart = { x: i.x, y: i.y }, this._areaDragCurrent = null, this._areaDragMoved = !1, this._gesturePointer = t.pointerId, this._capturePointer(t);
      return;
    }
    this._pickAnchor = null, this._marqueeAdd = t.shiftKey || t.ctrlKey || t.metaKey, this._marquee = { x0: e.x, y0: e.y, x1: e.x, y1: e.y }, this._gesturePointer = t.pointerId, this._capturePointer(t);
  }
  /**
   * Abort any in-progress gesture. A moved drag is rolled back to the exact
   * pre-drag config (restoring wall-snap angle changes too) and its own
   * history snapshot — matched by identity, in case something else pushed in
   * between — is dropped, so a canceled drag leaves no trace in undo.
   */
  _cancelGesture() {
    this._rollBackSwitcherDrag(), this._dragMoves.cancel(), this._dragDirty = !1, this._gesturePointer = null, this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaDragStart = null, this._areaDragCurrent = null, this._clearAreaDragTimer(), this._areaDragMoved = !1, this._marquee = null;
    const t = this._drag;
    this._drag = null, t?.moved && t.snapshot && (this._history = t.priorHistory ?? this._history.filter((e) => e !== t.snapshot), t.emitted ? this._emit(t.snapshot) : (this._config = t.snapshot, this._watchedEntities = He(t.snapshot)), this._future = t.priorFuture ?? []);
  }
  _onPointerCancel(t) {
    this._gesturePointer !== null && t.pointerId !== this._gesturePointer || this._cancelGesture();
  }
  /** True when this event belongs to a pointer other than the gesture's. */
  _foreignPointer(t) {
    return this._gesturePointer !== null && t.pointerId !== this._gesturePointer;
  }
  _onCanvasMove(t) {
    if (!this._foreignPointer(t)) {
      if (t.buttons === 0 && (this._drag || this._draft || this._draftTracker || this._marquee || this._areaDragStart)) {
        this._cancelGesture();
        return;
      }
      if (this._tool === "wall" && this._draft) {
        const e = this._toVirtual(t, !1), i = this._snapWallEnd(this._draft.x1, this._draft.y1, e.x, e.y);
        this._draft = { ...this._draft, x2: i.x, y2: i.y };
        return;
      }
      if (this._tool === "tracker" && this._draftTracker) {
        const e = this._toVirtual(t, !1);
        this._draftTracker = {
          ...this._draftTracker,
          x1: this._snap(e.x),
          y1: this._snap(e.y)
        };
        return;
      }
      if ((this._tool === "area" || this._tool === "roof") && this._areaDragStart) {
        const e = this._toVirtual(t, !1), i = this._areaDragStart, n = { x: e.x, y: e.y };
        if (this._areaDragCurrent = n, this._areaDragMoved) {
          this._updateAreaRectangleDraft(n);
          return;
        }
        !this._areaDragMoved && this._areaDragTimer === null && Math.hypot(n.x - i.x, n.y - i.y) > Co && (this._areaDragTimer = setTimeout(() => {
          this._areaDragTimer = null;
          const o = this._areaDragCurrent;
          if (!this._areaDragStart || !o) return;
          const r = { x: this._snap(o.x), y: this._snap(o.y) };
          r.x === i.x && r.y === i.y || (this._areaDragMoved = !0, this._updateAreaRectangleDraft(o));
        }, Bx));
        return;
      }
      if ((this._tool === "area" || this._tool === "roof") && this._draftArea) {
        const e = this._toVirtual(t, !1);
        this._areaHover = this._snapAreaPoint(e.x, e.y);
        return;
      }
      if (this._marquee) {
        const e = this._toVirtual(t, !1);
        this._marquee = { ...this._marquee, x1: e.x, y1: e.y };
        return;
      }
      this._drag && this._dragMoves.push({ ...this._toVirtual(t, !1), altKey: t.altKey });
    }
  }
  _onCanvasUp(t) {
    if (!this._foreignPointer(t)) {
      if (this._dragMoves.settle(), this._gesturePointer = null, this._tool === "wall" && this._draft) {
        const e = this._draft;
        if (this._draft = null, e.x1 !== e.x2 || e.y1 !== e.y2) {
          const i = this._defaultWallThickness, n = {
            id: ht("wall"),
            ...e,
            // The default stays out of the YAML, like every other default.
            ...i !== void 0 && i !== nt ? { thickness: i } : {}
          };
          this._commitFloor({ walls: [...this._floor().walls, n] }), this._selection = [{ kind: "wall", id: n.id }];
        }
        return;
      }
      if (this._tool === "tracker" && this._draftTracker) {
        const e = this._draftTracker;
        this._draftTracker = null, this._releasePointer(t);
        const i = Math.min(e.x0, e.x1), n = Math.min(e.y0, e.y1), o = Math.abs(e.x1 - e.x0), r = Math.abs(e.y1 - e.y0);
        o >= this.grid / 2 && r >= this.grid / 2 && this._addTracker(i, n, o, r);
        return;
      }
      if ((this._tool === "area" || this._tool === "roof") && this._areaDragStart) {
        const e = this._areaDragStart, i = this._areaDragMoved, n = this._draftArea;
        if (this._clearAreaDragTimer(), this._areaDragStart = null, this._areaDragCurrent = null, this._areaDragMoved = !1, this._releasePointer(t), i && n) {
          const o = Math.abs(n.points[1].x - n.points[0].x), r = Math.abs(n.points[3].y - n.points[0].y);
          if (o > 0 && r > 0)
            if (this._tool === "roof") {
              const s = this._config?.wallHeight ?? 60, a = {
                id: ht("roof"),
                type: "gable",
                points: n.points,
                height: Math.round(s * 0.6)
              };
              this._commitFloor({ roofs: [...this._floor().roofs ?? [], a] }), this._selection = [{ kind: "roof", id: a.id }], this._tool = "select";
            } else {
              const s = So(n.points, this._floor().areas ?? [], { dx: 0, dy: 0 });
              if (!Gi(s) || (this._floor().areas ?? []).some((l) => this._rectAreasOverlap({ id: "draft-area", points: s, showName: !0 }, l))) {
                this._draftArea = null;
                return;
              }
              const a = { id: ht("area"), points: s, showName: !0 };
              this._commitFloor({ areas: [...this._floor().areas ?? [], a] }), this._selection = [{ kind: "area", id: a.id }], this._tool = "select";
            }
          this._draftArea = null;
          return;
        }
        this._addAreaPoint(e);
        return;
      }
      if (this._marquee) {
        const e = this._marquee;
        if (this._marquee = null, this._releasePointer(t), !(Math.hypot(e.x1 - e.x0, e.y1 - e.y0) > 4)) {
          this._marqueeAdd || this._clearSel();
          return;
        }
        const n = this._elementsInRect(e);
        this._selection = this._marqueeAdd ? this._mergeSel(this._selection, n) : n, this._liveEditKey = null;
        return;
      }
      this._drag && (this._drag = null, this._releasePointer(t), this._flushDrag());
    }
  }
  /** All active-floor elements whose center lies inside the marquee rect. */
  _elementsInRect(t) {
    return L0(this._floor(), t);
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
  _resolvePick(t, e) {
    if (t.shiftKey || t.ctrlKey || t.metaKey) return e;
    const i = this._toVirtual(t, !1), n = N0(this._floor(), i.x, i.y, {
      itemSize: ne,
      textSize: vi,
      wallThickness: nt,
      hass: this.hass
    }), o = !!this._pickAnchor && Math.hypot(t.clientX - this._pickAnchor.clientX, t.clientY - this._pickAnchor.clientY) <= Vx;
    return this._pickAnchor = { clientX: t.clientX, clientY: t.clientY }, j0(n, this._selection, o) ?? e;
  }
  _startDrag(t, e, i, n, o, r, s) {
    if (this._tool !== "select" || (t.stopPropagation(), this._gesturePointer !== null)) return;
    this._canvasWrap?.focus({ preventScroll: !0 });
    const a = i != null || n != null || o != null || r != null || !!s, l = a ? e : this._resolvePick(t, e);
    a ? this._selectOne(l) : this._selectForPointer(t, l), !Xi(this._floor(), l) && (this._drag = {
      primary: l,
      start: this._toVirtual(t, !1),
      orig: this._snapshotSelection(),
      endpoint: i,
      areaVertex: n,
      areaEdge: o,
      stripEnd: r,
      spotAim: s
    }, l.kind === "wall" && (this._drag.attached = this._attachedCorners(l.id, i)), r && l.kind === "item" && (this._drag.stripAutoSide = this._floor().items.find((c) => c.id === l.id)?.stripSide === void 0), this._gesturePointer = t.pointerId, this._capturePointer(t));
  }
  /** See {@link attachedCorners}: shared room corners that stretch with this wall. */
  _attachedCorners(t, e) {
    return C0(this._floor().walls, t, e);
  }
  /** Capture the start positions of every selected element on the active floor. */
  _snapshotSelection() {
    const t = this._floor(), e = /* @__PURE__ */ new Map();
    for (const i of this._selection)
      if (!Xi(t, i))
        if (i.kind === "wall") {
          const n = t.walls.find((o) => o.id === i.id);
          n && e.set(`wall:${n.id}`, { kind: "wall", x1: n.x1, y1: n.y1, x2: n.x2, y2: n.y2 });
        } else if (i.kind === "opening") {
          const n = t.openings.find((o) => o.id === i.id);
          n && e.set(`opening:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "item") {
          const n = t.items.find((o) => o.id === i.id);
          n && e.set(`item:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "text") {
          const n = t.texts.find((o) => o.id === i.id);
          n && e.set(`text:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "furniture") {
          const n = t.furniture.find((o) => o.id === i.id);
          n && e.set(`furniture:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "area") {
          const n = (t.areas ?? []).find((o) => o.id === i.id);
          n && e.set(`area:${n.id}`, { kind: "polygon", points: n.points.map((o) => ({ ...o })) });
        } else if (i.kind === "roof") {
          const n = (t.roofs ?? []).find((o) => o.id === i.id);
          n && e.set(`roof:${n.id}`, { kind: "polygon", points: n.points.map((o) => ({ ...o })) });
        } else {
          const n = (t.trackers ?? []).find((o) => o.id === i.id);
          n && e.set(`tracker:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        }
    return e;
  }
  /**
   * Keep full-side-adjacent rectangle rooms synchronized while one side moves.
   *
   * Returns the updated `areas` array plus the ids of rooms that actually
   * coupled to the primary room during this move.
   */
  _coupleRectAreaSharedEdges(t, e, i, n, o) {
    let r = e;
    const s = e, a = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
    for (const d of n) {
      if (d.id === t) continue;
      const h = a.get(d.id) ?? d.points;
      if (d.locked) continue;
      const p = E0(s, h, i, o);
      p && (r = p.points, a.set(d.id, p.other), l.add(d.id));
    }
    return {
      areas: n.map((d) => {
        if (d.id === t) return { ...d, points: r };
        const h = a.get(d.id);
        return h ? { ...d, points: h } : d;
      }),
      coupledIds: l
    };
  }
  _rectAreasOverlap(t, e) {
    const i = t.points.map((s) => s.x), n = t.points.map((s) => s.y), o = e.points.map((s) => s.x), r = e.points.map((s) => s.y);
    return Math.max(...i) > Math.min(...o) && Math.min(...i) < Math.max(...o) && Math.max(...n) > Math.min(...r) && Math.min(...n) < Math.max(...r);
  }
  /**
   * Limit a shared-edge resize against rooms that are not part of the current
   * shared component. A coupled neighbor can encounter a new room after the
   * drag starts, so clamping only the primary room is insufficient.
   */
  _coupledEdgeResize(t, e, i, n, o) {
    const r = this._coupleRectAreaSharedEdges(t, e.points, i, n, o);
    if (!r.coupledIds.size) return { ...r, delta: i };
    const s = /* @__PURE__ */ new Set([t, ...r.coupledIds]), a = n.filter((p) => !s.has(p.id)), l = (p) => p.areas.some(
      (f) => s.has(f.id) && (!Gi(f.points) || a.some((u) => this._rectAreasOverlap(f, u)))
    );
    if (!l(r)) return { ...r, delta: i };
    let c = 0, d = 1;
    for (let p = 0; p < 18; p++) {
      const f = (c + d) / 2, u = { dx: i.dx * f, dy: i.dy * f }, m = this._coupleRectAreaSharedEdges(t, e.points, u, n, o);
      l(m) ? d = f : c = f;
    }
    const h = { dx: i.dx * c, dy: i.dy * c };
    return {
      ...this._coupleRectAreaSharedEdges(t, e.points, h, n, o),
      delta: h
    };
  }
  _applyDrag(t) {
    const e = this._drag;
    if (!e.moved) {
      if (Math.hypot(t.x - e.start.x, t.y - e.start.y) <= Co) return;
      e.moved = !0, e.priorFuture = this._future, e.priorHistory = this._history, this._pushHistory(), e.snapshot = this._history[this._history.length - 1];
    }
    const i = this._floor();
    if (e.primary.kind === "item" && e.stripEnd) {
      const c = i.items.find((m) => m.id === e.primary.id), d = c ? Te(c) : void 0;
      if (!c || !d) return;
      const h = e.stripEnd === 1 ? { x: d.x2, y: d.y2 } : { x: d.x1, y: d.y1 }, p = this._snapWallEnd(h.x, h.y, t.x, t.y);
      if (Math.hypot(p.x - h.x, p.y - h.y) < Zn) return;
      const f = e.stripEnd === 1 ? [p.x, p.y, h.x, h.y] : [h.x, h.y, p.x, p.y], u = Sg(...f);
      if (e.stripAutoSide) {
        const m = e.orig.get(`item:${c.id}`);
        u.stripSide = m?.kind === "pt" ? I0(i.walls, ...f, m, (b, g) => !!Eo(i, b, g)) : void 0;
      }
      this._emitFloor({ items: i.items.map((m) => m.id === c.id ? { ...m, ...u } : m) });
      return;
    }
    if (e.primary.kind === "item" && e.spotAim) {
      const c = i.items.find((f) => f.id === e.primary.id);
      if (!c || Math.hypot(t.x - c.x, t.y - c.y) < 1) return;
      const d = Math.atan2(t.x - c.x, -(t.y - c.y)) * 180 / Math.PI;
      let h = Math.round((d % 360 + 360) % 360);
      const p = Math.round(h / 45) * 45;
      !t.altKey && Math.abs(h - p) <= Wx && (h = p % 360), this._emitFloor({ items: i.items.map((f) => f.id === c.id ? { ...f, glowDirection: h } : f) });
      return;
    }
    if (e.endpoint) {
      const c = t.altKey ? [] : e.attached ?? [], d = /* @__PURE__ */ new Set([
        `${e.primary.id}:${e.endpoint}`,
        ...c.map((f) => `${f.id}:${f.end}`)
      ]), h = this._snapWallPointExcluding(t.x, t.y, d), p = i.walls.map((f) => {
        let u = f;
        f.id === e.primary.id && (u = e.endpoint === 1 ? { ...u, x1: h.x, y1: h.y } : { ...u, x2: h.x, y2: h.y });
        for (const m of c)
          m.id === f.id && (u = m.end === 1 ? { ...u, x1: h.x, y1: h.y } : { ...u, x2: h.x, y2: h.y });
        return u;
      });
      this._emitFloor({ walls: p });
      return;
    }
    if (e.primary.kind === "area" && e.areaVertex != null) {
      const c = e.areaVertex, d = this._snapAreaPoint(t.x, t.y, { areaId: e.primary.id, vertexIndex: c }), h = (i.areas ?? []).find((b) => b.id === e.primary.id);
      let p = Bt(h.points) ? xa(h.points, c, d) : h.points.map((b, g) => g === c ? d : b);
      const f = { dx: d.x - h.points[c].x, dy: d.y - h.points[c].y }, u = Bt(h.points) ? [ee[(c + 3) % 4], ee[c]] : [];
      let m = { areas: i.areas ?? [], coupledIds: /* @__PURE__ */ new Set() };
      for (const b of u) {
        const g = this._coupleRectAreaSharedEdges(e.primary.id, h.points, f, m.areas, b);
        m = {
          areas: g.areas,
          coupledIds: /* @__PURE__ */ new Set([...m.coupledIds, ...g.coupledIds])
        };
      }
      if (Bt(h.points) && !Gi(p)) {
        this._emitFloor({ areas: i.areas ?? [] });
        return;
      }
      this._emitFloor({
        areas: m.areas.map((b) => b.id === e.primary.id ? { ...b, points: p } : b)
      });
      return;
    }
    if (e.primary.kind === "roof" && e.areaVertex != null) {
      const c = e.areaVertex, d = { x: this._snap(t.x), y: this._snap(t.y) }, h = (i.roofs ?? []).find((p) => p.id === e.primary.id);
      if (h) {
        const p = Bt(h.points) ? xa(h.points, c, d) : h.points.map((f, u) => u === c ? d : f);
        this._emitFloor({
          roofs: (i.roofs ?? []).map((f) => f.id === e.primary.id ? { ...f, points: p } : f)
        });
      }
      return;
    }
    if (e.primary.kind === "area" && e.areaEdge != null) {
      const c = e.areaEdge, d = { x: this._snap(t.x), y: this._snap(t.y) }, h = (i.areas ?? []).find((k) => k.id === e.primary.id);
      let p = S0(h.points, c, d);
      const f = h.points[c % 4], u = h.points[(c + 1) % 4], m = Math.abs(f.y - u.y) < St, b = p[c % 4], g = m ? { dx: 0, dy: b.y - f.y } : { dx: b.x - f.x, dy: 0 }, w = this._coupledEdgeResize(
        e.primary.id,
        h,
        g,
        i.areas ?? [],
        ee[c]
      ), A = (w.areas ?? []).filter(
        (k) => k.id !== e.primary.id && !w.coupledIds.has(k.id)
      ), M = w.coupledIds.size ? w.areas.find((k) => k.id === e.primary.id)?.points ?? p : p;
      if (p = So(
        M,
        A,
        w.delta
      ), !Gi(p)) {
        this._emitFloor({ areas: i.areas ?? [] });
        return;
      }
      this._emitFloor({
        areas: w.areas.map((k) => k.id === e.primary.id ? { ...k, points: p } : k)
      });
      return;
    }
    if (this._selection.length === 1 && e.primary.kind === "opening" && !gt(
      i.openings.find((c) => c.id === e.primary.id) ?? { type: "door" }
    )) {
      const c = e.orig.get(`opening:${e.primary.id}`);
      if (c && c.kind === "pt") {
        const d = c.x + (t.x - e.start.x), h = c.y + (t.y - e.start.y), p = fa(d, h, i.walls, Ya), f = i.openings.map(
          (u) => u.id === e.primary.id ? p ? { ...u, x: p.x, y: p.y, angle: p.angle } : { ...u, x: this._snap(d), y: this._snap(h) } : u
        );
        this._emitFloor({ openings: f });
        return;
      }
    }
    const n = e.orig.get(`${e.primary.kind}:${e.primary.id}`);
    if (!n) return;
    const o = n.kind === "wall" ? n.x1 : n.kind === "polygon" ? n.points[0].x : n.x, r = n.kind === "wall" ? n.y1 : n.kind === "polygon" ? n.points[0].y : n.y, s = this._snap(o + (t.x - e.start.x)) - o, a = this._snap(r + (t.y - e.start.y)) - r;
    let l = this._applyDelta(s, a, e.orig);
    if (e.attached?.length && !t.altKey) {
      const c = (l.walls ?? i.walls).map((d) => {
        let h = d;
        for (const p of e.attached)
          p.id !== d.id || e.orig.has(`wall:${p.id}`) || (h = p.end === 1 ? { ...h, x1: p.x0 + s, y1: p.y0 + a } : { ...h, x2: p.x0 + s, y2: p.y0 + a });
        return h;
      });
      l = { ...l, walls: c };
    }
    this._emitFloor(l);
  }
  /** Translate every snapshotted element by (dx, dy). */
  _applyDelta(t, e, i) {
    return F0(this._floor(), t, e, i);
  }
  // ---- overlay drag for items & texts (HTML, not SVG) --------------------
  _onOverlayDown(t, e) {
    if (this._tool !== "select" || (t.stopPropagation(), t.preventDefault(), this._gesturePointer !== null)) return;
    this._canvasWrap?.focus({ preventScroll: !0 });
    const i = this._resolvePick(t, e);
    this._selectForPointer(t, i), this._drag = {
      primary: i,
      start: this._toVirtual(t, !1),
      orig: this._snapshotSelection()
    }, this._gesturePointer = t.pointerId, this._capturePointer(t, t.currentTarget);
  }
  _onOverlayMove(t) {
    if (!this._foreignPointer(t)) {
      if (t.buttons === 0 && this._drag) {
        this._cancelGesture();
        return;
      }
      this._drag && this._dragMoves.push({ ...this._toVirtual(t, !1), altKey: t.altKey });
    }
  }
  _onOverlayUp(t) {
    this._foreignPointer(t) || (this._dragMoves.settle(), this._gesturePointer = null, this._drag && (this._drag = null, this._releasePointer(t, t.currentTarget), this._flushDrag()));
  }
  // ---- element creation / mutation ---------------------------------------
  _addOpening(t, e, i) {
    const n = this._floor(), o = t === "skylight", r = o ? void 0 : fa(e, i, n.walls, Ya), s = {
      id: ht(t),
      type: t,
      x: r?.x ?? e,
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
    this._commitFloor({ openings: [...n.openings, s] }), this._selection = [{ kind: "opening", id: s.id }], this._tool = "select";
  }
  _addItem(t) {
    const e = {
      id: ht("item"),
      entity: "",
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      kind: t,
      showState: t === "sensor",
      showIcon: !0,
      size: ne
    };
    this._commitFloor({ items: [...this._floor().items, e] }), this._selection = [{ kind: "item", id: e.id }], this._tool = "select";
  }
  _addFurniture(t) {
    const e = Ps(t, this._symbols()), i = {
      id: ht("furn"),
      type: t,
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      w: e.w,
      h: e.h,
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
  _addTracker(t, e, i, n) {
    const o = {
      id: ht("tracker"),
      x: t,
      y: e,
      w: i,
      h: n,
      angle: 0,
      dotSize: yr
    };
    this._commitFloor({ trackers: [...this._floor().trackers ?? [], o] }), this._selection = [{ kind: "tracker", id: o.id }], this._tool = "select";
  }
  /** Close the in-progress Area or Roof draft into a committed polygon and select it. */
  _finishArea() {
    if (!(!this._draftArea || this._draftArea.points.length < 3)) {
      if (this._tool === "roof") {
        const t = this._config?.wallHeight ?? 60, e = {
          id: ht("roof"),
          type: "gable",
          points: this._draftArea.points,
          height: Math.round(t * 0.6)
        };
        this._commitFloor({ roofs: [...this._floor().roofs ?? [], e] }), this._selection = [{ kind: "roof", id: e.id }];
      } else {
        const t = { id: ht("area"), points: this._draftArea.points, showName: !0 };
        this._commitFloor({ areas: [...this._floor().areas ?? [], t] }), this._selection = [{ kind: "area", id: t.id }];
      }
      this._draftArea = null, this._areaHover = null, this._tool = "select";
    }
  }
  _clearAreaDragTimer() {
    this._areaDragTimer !== null && (clearTimeout(this._areaDragTimer), this._areaDragTimer = null);
  }
  _roomWallSegments(t) {
    return (t.areas ?? []).flatMap(
      (e) => ii(e.id, e.points, e.sideWalls ?? {}).filter((i) => !i.divider)
    );
  }
  _updateAreaRectangleDraft(t) {
    const e = this._areaDragStart;
    if (!e) return;
    const i = { x: this._snap(t.x), y: this._snap(t.y) }, n = yo({ x0: e.x, y0: e.y, x1: i.x, y1: i.y });
    this._tool === "roof" ? this._draftArea = { points: n } : this._draftArea = {
      points: So(
        n,
        this._floor().areas ?? [],
        { dx: i.x - e.x, dy: i.y - e.y }
      )
    };
  }
  /** Add one polygon vertex, or close the draft when clicking its start. */
  _addAreaPoint(t) {
    if (!this._draftArea) {
      this._draftArea = { points: [t] };
      return;
    }
    const e = this._draftArea.points, i = e[0];
    if (e.length >= 3 && Math.hypot(t.x - i.x, t.y - i.y) <= Ue) {
      this._finishArea();
      return;
    }
    const n = e[e.length - 1];
    (t.x !== n.x || t.y !== n.y) && (this._draftArea = { points: [...e, t] });
  }
  _addText() {
    const t = {
      id: ht("text"),
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      text: "Label",
      size: vi
    };
    this._commitFloor({ texts: [...this._floor().texts, t] }), this._selection = [{ kind: "text", id: t.id }], this._tool = "select";
  }
  _deleteSelected() {
    if (!this._selection.length) return;
    const t = this._floor(), e = this._idsOfKind("wall"), i = this._idsOfKind("opening"), n = this._idsOfKind("item"), o = this._idsOfKind("text"), r = this._idsOfKind("furniture"), s = this._idsOfKind("tracker"), a = this._idsOfKind("area"), l = this._idsOfKind("roof");
    this._commitFloor({
      walls: t.walls.filter((c) => !e.has(c.id)),
      openings: t.openings.filter((c) => !i.has(c.id)),
      items: t.items.filter((c) => !n.has(c.id)),
      texts: t.texts.filter((c) => !o.has(c.id)),
      furniture: t.furniture.filter((c) => !r.has(c.id)),
      trackers: (t.trackers ?? []).filter((c) => !s.has(c.id)),
      areas: (t.areas ?? []).filter((c) => !a.has(c.id)),
      roofs: (t.roofs ?? []).filter((c) => !l.has(c.id))
    }), this._clearSel();
  }
  // ---- clipboard (copy / paste / duplicate) ------------------------------
  _copy() {
    if (!this._selection.length) return;
    const t = this._floor(), e = this._idsOfKind("wall"), i = this._idsOfKind("opening"), n = this._idsOfKind("item"), o = this._idsOfKind("text"), r = this._idsOfKind("furniture"), s = this._idsOfKind("tracker"), a = this._idsOfKind("area"), l = this._idsOfKind("roof");
    this._clipboard = structuredClone({
      walls: t.walls.filter((c) => e.has(c.id)),
      openings: t.openings.filter((c) => i.has(c.id)),
      items: t.items.filter((c) => n.has(c.id)),
      texts: t.texts.filter((c) => o.has(c.id)),
      furniture: t.furniture.filter((c) => r.has(c.id)),
      trackers: (t.trackers ?? []).filter((c) => s.has(c.id)),
      areas: (t.areas ?? []).filter((c) => a.has(c.id)),
      roofs: (t.roofs ?? []).filter((c) => l.has(c.id))
    });
  }
  /** Paste the clipboard onto the active floor, offset by one snap step, with fresh ids. */
  _paste() {
    if (!this._clipboard) return;
    const t = structuredClone(this._clipboard), e = this._resolvedSnap || this.grid, i = this._floor(), n = { locked: void 0 }, o = t.walls.map((p) => ({
      ...p,
      ...n,
      id: ht("wall"),
      x1: p.x1 + e,
      y1: p.y1 + e,
      x2: p.x2 + e,
      y2: p.y2 + e
    })), r = t.openings.map((p) => ({
      ...p,
      ...n,
      id: ht(p.type),
      x: p.x + e,
      y: p.y + e
    })), s = t.items.map((p) => ({
      ...p,
      ...n,
      id: ht("item"),
      x: p.x + e,
      y: p.y + e
    })), a = t.texts.map((p) => ({
      ...p,
      ...n,
      id: ht("text"),
      x: p.x + e,
      y: p.y + e
    })), l = t.furniture.map((p) => ({
      ...p,
      ...n,
      id: ht("furn"),
      x: p.x + e,
      y: p.y + e
    })), c = (t.trackers ?? []).map((p) => ({
      ...p,
      ...n,
      id: ht("tracker"),
      x: p.x + e,
      y: p.y + e
    })), d = (t.areas ?? []).map((p) => ({
      ...p,
      ...n,
      id: ht("area"),
      points: p.points.map((f) => ({ x: f.x + e, y: f.y + e }))
    })), h = (t.roofs ?? []).map((p) => ({
      ...p,
      ...n,
      id: ht("roof"),
      points: p.points.map((f) => ({ x: f.x + e, y: f.y + e }))
    }));
    this._commitFloor({
      walls: [...i.walls, ...o],
      openings: [...i.openings, ...r],
      items: [...i.items, ...s],
      texts: [...i.texts, ...a],
      furniture: [...i.furniture, ...l],
      trackers: [...i.trackers ?? [], ...c],
      areas: [...i.areas ?? [], ...d],
      roofs: [...i.roofs ?? [], ...h]
    }), this._selection = [
      ...o.map((p) => ({ kind: "wall", id: p.id })),
      ...r.map((p) => ({ kind: "opening", id: p.id })),
      ...s.map((p) => ({ kind: "item", id: p.id })),
      ...a.map((p) => ({ kind: "text", id: p.id })),
      ...l.map((p) => ({ kind: "furniture", id: p.id })),
      ...c.map((p) => ({ kind: "tracker", id: p.id })),
      ...d.map((p) => ({ kind: "area", id: p.id })),
      ...h.map((p) => ({ kind: "roof", id: p.id }))
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
  _setLocked(t) {
    if (!this._selection.length) return;
    const e = this._floor(), i = t || void 0, n = (o, r) => {
      const s = this._idsOfKind(r);
      return o.map((a) => s.has(a.id) ? { ...a, locked: i } : a);
    };
    this._commitFloor({
      walls: n(e.walls, "wall"),
      openings: n(e.openings, "opening"),
      items: n(e.items, "item"),
      texts: n(e.texts, "text"),
      furniture: n(e.furniture, "furniture"),
      trackers: n(e.trackers ?? [], "tracker"),
      areas: n(e.areas ?? [], "area"),
      roofs: n(e.roofs ?? [], "roof")
    });
  }
  // ---- floors -------------------------------------------------------------
  /** Add a floor that reuses the current floor's walls (fresh ids) and nothing else. */
  _addFloor() {
    const t = this._floor().walls.map((o) => ({ ...o, id: ht("wall") })), e = (this._config.floors?.length ?? 1) + 1, i = nh(`Floor ${e}`, t), n = [...this._config.floors ?? [], i];
    this._activeFloorId = i.id, this._clearSel(), this._commit({ ...this._config, floors: n });
  }
  _switchFloor(t) {
    t !== this._activeFloorId && (this._activeFloorId = t, this._clearSel(), this._endTraceMode());
  }
  /**
   * Move the active floor one step up/down the list (issue #66) — the safe
   * alternative to reordering floor blocks by hand in YAML. Commits through
   * history, so a mis-move is one Ctrl+Z away.
   */
  _moveFloor(t) {
    const e = sh(this._config.floors ?? [], this._activeFloorId, t);
    e && this._commit({ ...this._config, floors: e });
  }
  _renameFloor(t, e) {
    this._commit({
      ...this._config,
      floors: (this._config.floors ?? []).map((i) => i.id === t ? { ...i, name: e } : i)
    });
  }
  /**
   * Link the active floor to a Home Assistant floor (issue #24). Linking also
   * names the floor after the HA floor — the point of the association — while
   * a later manual rename sticks (we never re-sync silently). Unlinking keeps
   * the current name.
   */
  _linkHaFloor(t) {
    const e = Do(this.hass).find((i) => i.floor_id === t);
    this._commit({
      ...this._config,
      floors: (this._config.floors ?? []).map(
        (i) => i.id === this._activeFloorId ? { ...i, haFloor: e?.floor_id, ...e ? { name: e.name } : {} } : i
      )
    });
  }
  /** HA-floor link row for the floor gear popover; hidden when HA exposes no floors. */
  _renderHaFloorRow(t) {
    const e = Do(this.hass);
    return e.length ? v`
      <div class="pop-row">
        <label>HA floor</label>
        <select
          .value=${t?.haFloor ?? ""}
          @change=${(i) => this._linkHaFloor(i.target.value)}
        >
          <option value="" ?selected=${!t?.haFloor}>(not linked)</option>
          ${e.map(
      (i) => v`<option value=${i.floor_id} ?selected=${t?.haFloor === i.floor_id}>
                ${i.name}
              </option>`
    )}
        </select>
      </div>
    ` : v`${y}`;
  }
  _deleteFloor() {
    const t = this._config.floors ?? [];
    if (t.length <= 1) return;
    const e = t.findIndex((o) => o.id === this._activeFloorId), i = this._activeFloorId;
    this._setTrace(void 0, i), this._endTraceMode(), this._refFloors = new Map([...this._refFloors].filter(([o, r]) => o !== i && r.floorId !== i)), this._traceBusy = this._traceLoads.size > 0;
    const n = t.filter((o) => o.id !== i);
    this._commit({ ...this._config, floors: n }), this._activeFloorId = n[Math.max(0, e - 1)].id, this._clearSel();
  }
  _updateWall(t, e) {
    this._commitFloor({
      walls: this._floor().walls.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateOpening(t, e) {
    this._commitFloor({
      openings: this._floor().openings.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateItem(t, e) {
    this._commitFloor({
      items: this._floor().items.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateText(t, e) {
    this._commitFloor({
      texts: this._floor().texts.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateFurniture(t, e) {
    this._commitFloor({
      furniture: this._floor().furniture.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateTracker(t, e) {
    this._commitFloor({
      trackers: (this._floor().trackers ?? []).map(
        (i) => i.id === t ? { ...i, ...e } : i
      )
    });
  }
  _updateArea(t, e) {
    this._commitFloor({
      areas: (this._floor().areas ?? []).map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateRoof(t, e) {
    this._commitFloor({
      roofs: (this._floor().roofs ?? []).map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _createRoofFromArea(t) {
    const e = this._config?.wallHeight ?? 60, i = {
      id: ht("roof"),
      type: "gable",
      points: t.points.map((n) => ({ ...n })),
      height: Math.round(e * 0.6)
    };
    this._commitFloor({
      roofs: [...this._floor().roofs ?? [], i]
    }), this._selection = [{ kind: "roof", id: i.id }];
  }
  _elementsUnderRoof(t) {
    const e = this._floor(), i = Dt(t.points), n = (e.areas ?? []).filter((a) => {
      const l = Dt(a.points);
      return ct(t.points, l.x, l.y) || a.points.some((c) => ct(t.points, c.x, c.y)) || ct(a.points, i.x, i.y) || t.points.some((c) => ct(a.points, c.x, c.y));
    }), o = (e.items ?? []).filter((a) => ct(t.points, a.x, a.y)), r = (e.furniture ?? []).filter((a) => ct(t.points, a.x, a.y)), s = (e.trackers ?? []).filter(
      (a) => ct(t.points, a.x + a.w / 2, a.y + a.h / 2)
    );
    return { areas: n, items: o, furniture: r, trackers: s };
  }
  _roofsOverArea(t) {
    const e = Dt(t.points);
    return (this._floor().roofs ?? []).filter((i) => {
      const n = Dt(i.points);
      return ct(i.points, e.x, e.y) || t.points.some((o) => ct(i.points, o.x, o.y)) || ct(t.points, n.x, n.y) || i.points.some((o) => ct(t.points, o.x, o.y));
    });
  }
  _roofsOverPoint(t, e) {
    return (this._floor().roofs ?? []).filter((i) => ct(i.points, t, e));
  }
  _renderRoofChips(t, e = "Roof above:") {
    return t.length ? v`
      <div class="related-elements">
        <div class="related-label">${e}</div>
        <div class="related-chips">
          ${t.map(
      (i) => v`
              <button
                class="chip-btn"
                title="Select this roof"
                @click=${() => {
        this._selection = [{ kind: "roof", id: i.id }], this._liveEditKey = null;
      }}
              >
                <ha-icon icon="mdi:home-outline"></ha-icon>
                ${`Roof · ${i.type ? i.type.charAt(0).toUpperCase() + i.type.slice(1) : "Roof"}`}
              </button>
            `
    )}
        </div>
      </div>
    ` : y;
  }
  /** Drop the HA-area link but keep the name the user sees on the plan. */
  _unlinkHaArea(t) {
    this._updateArea(t, { haArea: void 0 });
  }
  /**
   * Status line under the Area's name field. The name doubles as the HA-area
   * link (see {@link areaNamePatch}), so the resulting association would
   * otherwise be invisible: this shows a "Linked" chip whenever `haArea` is
   * set, with an unlink button for the one intent the merged field can't
   * express — keeping the name while dropping the link.
   */
  _renderAreaLinkRow(t, e) {
    const i = t.haArea ? e.find((n) => n.area_id === t.haArea) : void 0;
    return v`
      <div class="row wide area-name-status">
        <label></label>
        ${t.haArea ? v`<span
              class="ha-link-chip"
              title=${`Linked to the Home Assistant area "${i?.name ?? t.haArea}"`}
            >
              <ha-icon icon="mdi:link-variant"></ha-icon>Linked
              <button
                class="unlink"
                title="Keep this name but unlink the Home Assistant area"
                @click=${() => this._unlinkHaArea(t.id)}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </span>` : v`<span class="hint"
              >${e.length ? "Name this room after a Home Assistant area to link it." : "No Home Assistant areas available."}</span
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
    return Di(this._config?.palette);
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
  _renderPalettePicker(t, e) {
    const i = this._palette();
    if (!i.length) return y;
    const n = Xc(t), o = n && i.some((r) => $t(r.name) === n) ? n : void 0;
    return v`
      <select
        class="palette-pick"
        title="Use one of the plan's named colours"
        .value=${o ?? ""}
        @change=${(r) => {
      const s = r.target.value;
      if (!s) {
        o && e(mn(t, i));
        return;
      }
      const a = i.find((l) => $t(l.name) === s);
      a && e(ga(a.name));
    }}
      >
        <option value="" ?selected=${!o}>Custom…</option>
        ${i.map(
      (r) => v`<option
            value=${$t(r.name)}
            ?selected=${$t(r.name) === o}
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
  _swatchValue(t, e) {
    const i = mn(t, this._config?.palette);
    return typeof i == "string" && i ? i : e;
  }
  _renderColorRow(t) {
    return v`
      <div class="row">
        <label title=${t.title ?? y}>${t.label}</label>
        <input
          type="color"
          title=${t.title ?? y}
          .value=${this._swatchValue(t.value, t.swatch)}
          @input=${(e) => t.onLive(e.target.value)}
        />
        <input
          type="text"
          placeholder=${t.placeholder}
          .value=${t.value ?? ""}
          @change=${(e) => t.onCommit(e.target.value || void 0)}
        />
        ${this._renderPalettePicker(t.value, t.onCommit)}
      </div>
    `;
  }
  /**
   * An entity's `supported_features` bitmask, or 0 when it isn't in `hass`.
   * Handed to {@link openingForm} so its Tap field can name the default the
   * live card would take — which for a `cover` depends on whether it can
   * actually open and close.
   */
  _supportedFeatures(t) {
    return this.hass?.states[t]?.attributes?.supported_features ?? 0;
  }
  /**
   * The glyph a device shows when no state rule names one — what a rule's
   * empty icon box falls back to. Resolved exactly as the card resolves it,
   * with the rules removed so a currently-matching rule cannot report itself
   * as the default.
   */
  _itemDefaultIcon(t) {
    const e = t.entity ? this.hass?.states[t.entity] : void 0;
    return cn(
      { ...t, stateColor: void 0 },
      e,
      t.entity ? this.hass?.entities?.[t.entity]?.icon : void 0
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
  _renderItemIconRow(t) {
    const e = "Icon for this device; state rules in Style & effects can override it";
    return v`
      <div class="row wide">
        <label title=${e}>Icon</label>
        ${this._renderIconPicker(t.icon ?? "", (i) => this._updateItem(t.id, { icon: i || void 0 }), {
      // The entity's own glyph, so leaving the box empty is visibly a
      // choice rather than a blank.
      placeholder: this._itemDefaultIcon(t),
      title: e
    })}
      </div>
      ${t.stateColor?.length ? v`<p class="hint rule-note">Shown when no state rule specifies an icon.</p>` : y}
    `;
  }
  /** Flat headings within the selected category; no nested disclosure state. */
  _renderGroup(t, ...e) {
    const i = this._projectOpen ? Oa : tn[this._primary()?.kind ?? "wall"], n = this._projectOpen ? this._projectPage : this._selectionPage;
    if (!i.find((s) => s.id === n)?.groups.includes(t)) return v`${y}`;
    const o = {
      "What it reads": "Sensor readings",
      Behavior: "Tap, hold & double-tap",
      Look: "Plan style",
      Project: "Canvas",
      Display: "View & scale",
      Color: "State colors",
      "Floor image": `Background · ${this._floor().name}`
    }[t] ?? t, r = t === "Behavior" && customElements.get("ha-yaml-editor") ? v`<button type="button" class="cfg-group-mode" aria-pressed=${this._actionYaml}
          @click=${() => {
      this._actionYaml = !this._actionYaml, this._actionYamlError = "";
    }}
        >${this._actionYaml ? "Show visual editor" : "Show code editor"}</button>` : y;
    return v`<section class="cfg-group" data-group=${t}>
      <div class="cfg-group-head"><h3 class="cfg-group-title">${o}</h3>${r}</div>${e}
    </section>`;
  }
  /** Tabs and in-panel shortcuts share draft, scroll and keyboard-focus handling. */
  async _choosePage(t, e = !1) {
    this._numberDraft = void 0, e ? this._projectPage = t : this._selectionPage = t, this.renderRoot.querySelector(".side")?.scrollTo({ top: 0 }), await this.updateComplete, this.renderRoot.querySelector(`#${e ? "project" : "object"}-category-${t}`)?.focus({ preventScroll: !0 });
  }
  _renderPagePicker(t, e) {
    if (t.length < 2) return y;
    const i = e ? this._projectPage : this._selectionPage, n = e ? "project" : "object";
    return v`<div class="settings-category ${t.length === 4 ? "two-columns" : ""}"
      role="tablist" aria-label=${e ? "Project settings" : "Object settings"}
      @keydown=${(o) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(o.key)) return;
      o.preventDefault(), o.stopPropagation();
      const r = t.findIndex((a) => a.id === i), s = o.key === "Home" ? 0 : o.key === "End" ? t.length - 1 : (r + (o.key === "ArrowRight" ? 1 : -1) + t.length) % t.length;
      this._choosePage(t[s].id, e);
    }}>
      ${t.map((o) => v`<button role="tab" id=${`${n}-category-${o.id}`}
        data-page=${o.id} aria-selected=${i === o.id} tabindex=${i === o.id ? 0 : -1}
        aria-controls=${`${n}-settings-page`} title=${o.hint ?? o.label}
        @click=${() => this._choosePage(o.id, e)}>${o.label}</button>`)}
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
  _renderItemReadings(t) {
    const e = ye(t), i = (o) => this._updateItem(t.id, {
      readings: o.length ? o : void 0,
      secondaryEntity: void 0,
      secondaryAttribute: void 0,
      // `badgeEntity: "secondary"` meant index 0, which is where the legacy
      // pair still is — restate it as the index so the old spelling does not
      // outlive the keys it referred to.
      ...t.badgeEntity === "secondary" ? { badgeEntity: 0 } : {}
    }), n = (o, r) => i(e.map((s, a) => a === o ? { ...s, ...r } : s));
    return v`
      <div class="row wide">
        <label title="Further entities and attributes whose readings join this device's label line"
          >Other entities</label
        >
      </div>
      ${e.map(
      (o, r) => v`
          <div class="row wide item-reading">
            ${this._renderEntityPicker(
        o.entity ?? "",
        (s) => n(r, { entity: s || void 0 }),
        void 0,
        // Scoped to the room the device sits in, exactly as its own
        // entity picker is — an extra reading is as likely to come from
        // the same room as the first one.
        this._areaEntitiesAt(t.x, t.y)?.entities
      )}
            ${this._renderAttributePicker(
        o.entity || t.entity,
        o.attribute ?? "",
        (s) => n(r, { attribute: s || void 0 }),
        "Read this attribute instead of the state — with no entity beside it, from this device's own entity"
      )}
            <button
              class="rule-remove"
              aria-label="Remove entity"
              title="Remove this entity"
              @click=${() => i(e.filter((s, a) => a !== r))}
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
        <button @click=${() => i([...e, {}])}>
          <ha-icon icon="mdi:plus"></ha-icon>Add entity
        </button>
      </div>
      ${e.length ? v`<p class="hint rule-note">
            These show whether or not the device's own "Show state" above is on
            — that toggle is about the device's entity, not about these. Use
            each row's own "Show on label" to keep one bound without printing it.
          </p>` : y}
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
  _renderStateColorRules(t, e, i) {
    const n = t ?? [], o = (r, s) => {
      const a = n.map((l, c) => c === r ? { ...l, ...s } : l);
      e(a);
    };
    return v`
      <div class="row wide state-colors">
        <label
          title=${i?.icons ? "Color the badge — and optionally swap its icon — by what the entity reads" : "Color the element by what its entity reads"}
          >${i?.icons ? "Color & icon by state" : "Color by state"}</label
        >
      </div>
      ${n.map((r, s) => {
      const a = typeof r.state == "string" ? "state" : typeof r.above == "number" ? "above" : "else";
      return v`
          <div class="row wide state-color-rule">
            <select
              .value=${a}
              title="When this rule applies"
              @change=${(l) => {
        const c = l.target.value;
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
            ${a === "above" ? v`<input
                  type="number"
                  class="cond"
                  .value=${String(r.above ?? 0)}
                  @change=${(l) => o(s, { above: Number(l.target.value) || 0 })}
                />` : a === "state" ? v`<input
                    type="text"
                    class="cond"
                    placeholder="on"
                    .value=${r.state ?? ""}
                    @change=${(l) => o(s, { state: l.target.value })}
                  />` : v`<span class="cond hint">any other value</span>`}
            <input
              type="color"
              .value=${this._swatchValue(r.color, "#ff0000")}
              @input=${(l) => o(s, { color: l.target.value })}
            />
            <input
              type="text"
              class="rule-color-text"
              placeholder="red"
              .value=${r.color ?? ""}
              @change=${(l) => o(s, { color: l.target.value })}
            />
            ${this._renderPalettePicker(r.color, (l) => o(s, { color: l ?? "" }))}
            ${i?.icons ? (
        // Empty means "keep the device's icon", so the device's icon is
        // the placeholder — the rule shows what leaving it blank gives
        // you, and colour-only rules need no icon at all (issue #127).
        this._renderIconPicker(r.icon ?? "", (l) => o(s, { icon: l || void 0 }), {
          placeholder: i.iconPlaceholder,
          title: "Icon while this rule matches — empty keeps the device's own"
        })
      ) : y}
            <button
              class="rule-remove"
              aria-label="Remove rule"
              title="Remove this rule"
              @click=${() => {
        const l = n.filter((c, d) => d !== s);
        e(l.length ? l : void 0);
      }}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
        `;
    })}
      <div class="row wide state-color-add">
        <button
          @click=${() => e([
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
    const t = this._selection[0], e = this._floor(), i = t.kind === "item" ? e.items.find((o) => o.id === t.id) : t.kind === "furniture" ? e.furniture.find((o) => o.id === t.id) : void 0;
    if (!i) return;
    const n = Eo(e, i.x, i.y);
    if (ds(n))
      return on(this.hass, n.haArea).length ? n.id : void 0;
  }
  _areaEntitiesAt(t, e) {
    const i = Eo(this._floor(), t, e);
    return ds(i) ? { entities: on(this.hass, i.haArea), name: i.name } : void 0;
  }
  /** Every entity in `area`'s linked HA area not already placed as an item on this floor. */
  _pendingAreaEntities(t) {
    if (!t.haArea) return [];
    const e = new Set(this._floor().items.map((i) => i.entity));
    return on(this.hass, t.haArea).filter((i) => !e.has(i));
  }
  /**
   * Add a device for every entity registered to `area`'s linked HA area that
   * isn't already placed as an item on this floor, laid out across the
   * polygon's interior (`layoutPointsInPolygon`) so the new icons spread out
   * instead of stacking on top of each other.
   */
  _addAreaEntities(t) {
    const e = this._pendingAreaEntities(t);
    if (!e.length) return;
    const i = P0(t.points, e.length), n = e.map((o, r) => {
      const s = Qs(o);
      return {
        id: ht("item"),
        entity: o,
        x: Math.round(i[r].x),
        y: Math.round(i[r].y),
        kind: s,
        showState: s === "sensor",
        showIcon: !0,
        size: ne
      };
    });
    this._commitFloor({ items: [...this._floor().items, ...n] }), this._selection = n.map((o) => ({ kind: "item", id: o.id }));
  }
  /** Patch a single field on one of a tracker's sensor sub-objects (X / Y axis). */
  _updateTrackerSensor(t, e, i) {
    const n = (this._floor().trackers ?? []).find((r) => r.id === t);
    if (!n) return;
    if (i === null) {
      this._updateTracker(t, { [e]: void 0 });
      return;
    }
    const o = n[e] ?? { entity: "", min: 0, max: 5 };
    this._updateTracker(t, { [e]: { ...o, ...i } });
  }
  _patchConfig(t) {
    this._commit({ ...this._config, ...t });
  }
  /**
   * Live variants for continuous controls (sliders, color pickers, typing):
   * one undo snapshot per edit burst — keyed by element and fields — then
   * plain emits, instead of a full-config clone per input event.
   */
  _beginLive(t, e, i) {
    const n = `${t}:${e}:${Object.keys(i).sort().join(",")}`;
    this._liveEditKey !== n && this._pushHistory(n);
  }
  _updateOpeningLive(t, e) {
    this._beginLive("opening", t, e), this._emitFloor({
      openings: this._floor().openings.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateItemLive(t, e) {
    this._beginLive("item", t, e), this._emitFloor({
      items: this._floor().items.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateTextLive(t, e) {
    this._beginLive("text", t, e), this._emitFloor({
      texts: this._floor().texts.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateFurnitureLive(t, e) {
    this._beginLive("furniture", t, e), this._emitFloor({
      furniture: this._floor().furniture.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateTrackerLive(t, e) {
    this._beginLive("tracker", t, e), this._emitFloor({
      trackers: (this._floor().trackers ?? []).map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateAreaLive(t, e) {
    this._beginLive("area", t, e), this._emitFloor({
      areas: (this._floor().areas ?? []).map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _updateRoofLive(t, e) {
    this._beginLive("roof", t, e), this._emitFloor({
      roofs: (this._floor().roofs ?? []).map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _patchConfigLive(t) {
    this._beginLive("config", "", t), this._emit({ ...this._config, ...t });
  }
  _updateWallLive(t, e) {
    this._beginLive("wall", t, e), this._emitFloor({
      walls: this._floor().walls.map((i) => i.id === t ? { ...i, ...e } : i)
    });
  }
  _patchFloorLive(t) {
    this._beginLive("floor", this._activeFloorId, t), this._emitFloor(t);
  }
  /** Route a form patch to the right per-kind update helper (commit or burst). */
  _applyElementPatch(t, e, i, n) {
    switch (t) {
      case "opening":
        n ? this._updateOpeningLive(e, i) : this._updateOpening(e, i);
        break;
      case "item":
        n ? this._updateItemLive(e, i) : this._updateItem(e, i);
        break;
      case "text":
        n ? this._updateTextLive(e, i) : this._updateText(e, i);
        break;
      case "furniture":
        n ? this._updateFurnitureLive(e, i) : this._updateFurniture(e, i);
        break;
      case "tracker":
        n ? this._updateTrackerLive(e, i) : this._updateTracker(e, i);
        break;
      case "wall":
        n ? this._updateWallLive(e, i) : this._updateWall(e, i);
        break;
      case "area":
        n ? this._updateAreaLive(e, i) : this._updateArea(e, i);
        break;
      case "roof":
        n ? this._updateRoofLive(e, i) : this._updateRoof(e, i);
        break;
    }
  }
  // ---- rendering ----------------------------------------------------------
  // ---- zoom ----------------------------------------------------------------
  _setZoom(t) {
    this._fitToViewport = !1, this._zoom = Math.min(3, Math.max(0.01, Math.round(t * 100) / 100));
  }
  /** Ctrl/Cmd + wheel zooms the canvas (also catches trackpad pinch); plain wheel scrolls. */
  _onCanvasWheel(t) {
    !t.ctrlKey && !t.metaKey || (t.preventDefault(), this._setZoom(this._zoom - Math.sign(t.deltaY) * 0.1));
  }
  _onCanvasScroll() {
    const t = this._canvasWrap;
    if (!t) return;
    const e = this._canvasScroll;
    this._recordCanvasScroll(t), !(!e || e.left === t.scrollLeft && e.top === t.scrollTop) && e.width === t.clientWidth && e.height === t.clientHeight && (this._fitToViewport = !1);
  }
  _recordCanvasScroll(t) {
    this._canvasScroll = {
      left: t.scrollLeft,
      top: t.scrollTop,
      width: t.clientWidth,
      height: t.clientHeight
    };
  }
  _scrollCanvas(t, e) {
    const i = this._canvasWrap;
    i && (i.scrollTo({ left: t, top: e, behavior: "instant" }), this._recordCanvasScroll(i));
  }
  /** Fit both dimensions, including tall plans in a docked or fullscreen canvas. */
  _fitView() {
    this._fitToViewport = !0;
    const t = this._canvasWrap;
    if (!t?.clientWidth || !t.clientHeight) return;
    const e = t.getBoundingClientRect().width - 2, i = t.clientHeight * this._config.width / (e * this._config.height);
    this._zoom = Math.max(0.01, Math.min(1, Math.floor(i * 100) / 100)), this._scrollCanvas(0, 0);
  }
  /** One-line description of the selected element for the Element header. */
  _selectionSummary(t) {
    const e = this._floor();
    switch (t.kind) {
      case "wall": {
        const i = e.walls.find((n) => n.id === t.id);
        return i ? `Wall · ${Math.round(Math.hypot(i.x2 - i.x1, i.y2 - i.y1))} units` : "Wall";
      }
      case "opening": {
        const i = e.openings.find((o) => o.id === t.id);
        return i ? gt(i) ? `Skylight · ${Math.round(i.length)}×${Math.round(qt(i))}` : `${i.type === "door" ? "Door" : Ut(i) ? "Passage" : "Window"} · ${Math.round(i.length)} units` : "Opening";
      }
      case "item": {
        const i = e.items.find((n) => n.id === t.id);
        return i?.entity ? String(i.name || this.hass?.states[i.entity]?.attributes.friendly_name || i.entity) : "Device";
      }
      case "text": {
        const n = e.texts.find((o) => o.id === t.id)?.text ?? "";
        return n ? `Text · “${n.length > 24 ? `${n.slice(0, 24)}…` : n}”` : "Text";
      }
      case "furniture": {
        const i = e.furniture.find((o) => o.id === t.id);
        if (!i) return "Furniture";
        const n = Jv(i.type, this._symbols());
        return `${n.charAt(0).toUpperCase()}${n.slice(1)} · ${Math.round(i.w)}×${Math.round(i.h)}`;
      }
      case "area": {
        const i = (e.areas ?? []).find((n) => n.id === t.id);
        return i ? `Area · ${i.name || `${i.points.length}-point`}` : "Area";
      }
      case "roof": {
        const i = (e.roofs ?? []).find((o) => o.id === t.id);
        return i ? `Roof · ${i.type ? i.type.charAt(0).toUpperCase() + i.type.slice(1) : "Roof"} (${i.points.length}-pt)` : "Roof";
      }
      default: {
        const i = (e.trackers ?? []).find((n) => n.id === t.id);
        return i ? `Tracker · ${Math.round(i.w)}×${Math.round(i.h)}` : "Tracker";
      }
    }
  }
  _renderGrid() {
    const { width: t, height: e } = this._config, i = this.grid, n = `${t}x${e}x${i}`;
    if (this._gridCache?.key === n) return this._gridCache.lines;
    const o = [];
    for (let r = 0; r <= t; r += i)
      o.push($`<line x1=${r} y1="0" x2=${r} y2=${e} class="grid" />`);
    for (let r = 0; r <= e; r += i)
      o.push($`<line x1="0" y1=${r} x2=${t} y2=${r} class="grid" />`);
    return this._gridCache = { key: n, lines: o }, o;
  }
  // -------------------------------------------------------------------------
  // Trace template — editor-only tracing paper (see editor-trace.ts)
  // -------------------------------------------------------------------------
  /** The active floor's template, if one is loaded. */
  _trace() {
    return this._traces.get(this._activeFloorId);
  }
  /** Replace (or with `undefined`, drop) a floor's template — the active one by default. */
  _setTrace(t, e = this._activeFloorId) {
    t || this._traceLoads.delete(e);
    const i = this._traces.get(e);
    i && i.src !== t?.src && URL.revokeObjectURL(i.src);
    const n = new Map(this._traces);
    t ? n.set(e, t) : n.delete(e), this._traces = n;
  }
  _patchTrace(t) {
    const e = this._trace();
    e && this._setTrace({ ...e, ...t });
  }
  _endTraceMode() {
    this._traceMode = null, this._traceDrag = null, this._traceCalib = { distance: this._traceCalib.distance };
  }
  _startTraceMode(t) {
    if (this._traceMode === t) {
      this._endTraceMode();
      return;
    }
    this._endTraceMode(), this._patchTrace({ visible: !0 }), this._traceMode = t, this._canvasWrap?.focus({ preventScroll: !0 });
  }
  async _loadTrace(t) {
    this._traceBusy = !0, this._traceError = "";
    const e = this._activeFloorId, i = Symbol();
    this._traceLoads.set(e, i);
    try {
      const n = await Lx(t);
      if (this._traceLoads.get(e) !== i) {
        URL.revokeObjectURL(n.src);
        return;
      }
      const o = this._traces.get(e), r = o && o.pw === n.pw && o.ph === n.ph;
      this._setTrace(
        {
          src: n.src,
          name: t.name,
          pw: n.pw,
          ph: n.ph,
          ...r ? { x: o.x, y: o.y, scale: o.scale, rotation: o.rotation } : { ...Ba(n.pw, n.ph, this._config.width, this._config.height), rotation: 0 },
          opacity: o?.opacity ?? kx,
          visible: !0,
          page: n.page,
          pages: n.pages,
          file: yd(t) ? t : void 0
        },
        e
      );
    } catch (n) {
      this._traceLoads.get(e) === i && (this._traceError = n instanceof Error ? n.message : String(n));
    } finally {
      this._traceLoads.get(e) === i && this._traceLoads.delete(e), this._traceBusy = this._traceLoads.size > 0;
    }
  }
  /** Show another page of the loaded PDF, keeping the placement. */
  async _setTracePage(t) {
    const e = this._trace();
    if (!e?.file || t === e.page) return;
    const i = this._activeFloorId, n = Symbol();
    this._traceLoads.set(i, n), this._traceBusy = !0, this._traceError = "";
    try {
      const o = await gd(e.file, t);
      if (this._traceLoads.get(i) !== n || this._traces.get(i)?.src !== e.src) {
        URL.revokeObjectURL(o.src);
        return;
      }
      const r = o.pw === e.pw ? e.scale : e.pw * e.scale / o.pw;
      this._setTrace(
        { ...this._traces.get(i), src: o.src, pw: o.pw, ph: o.ph, page: o.page, scale: r },
        i
      );
    } catch (o) {
      this._traceLoads.get(i) === n && (this._traceError = o instanceof Error ? o.message : String(o));
    } finally {
      this._traceLoads.get(i) === n && this._traceLoads.delete(i), this._traceBusy = this._traceLoads.size > 0;
    }
  }
  /** The floor shown under the active one, if it still exists and isn't itself. */
  _refFloor() {
    const t = this._refFloors.get(this._activeFloorId);
    if (!(!t || t.floorId === this._activeFloorId))
      return (this._config.floors ?? []).find((e) => e.id === t.floorId);
  }
  _setRefFloor(t) {
    const e = new Map(this._refFloors);
    t ? e.set(this._activeFloorId, t) : e.delete(this._activeFloorId), this._refFloors = e;
  }
  /** The reference floor's walls: faint, dashed where they are dividers, never hit. */
  _renderRefFloor() {
    const t = this._refFloor();
    if (!t?.walls.length) return y;
    const e = this._refFloors.get(this._activeFloorId)?.opacity ?? To;
    return $`<g class="ref-floor" opacity=${e} pointer-events="none">
      ${t.walls.map(
      (i) => $`<line x1=${i.x1} y1=${i.y1} x2=${i.x2} y2=${i.y2}
                         class=${i.divider ? "divider" : ""}
                         stroke-width=${i.kind === "railing" ? nt / 3 : i.thickness ?? nt} />`
    )}
    </g>`;
  }
  /** The reference-floor controls, inside the Trace template group. */
  _renderRefFloorControls() {
    const t = (this._config.floors ?? []).filter((n) => n.id !== this._activeFloorId), e = this._refFloors.get(this._activeFloorId), i = this._refFloor();
    return t.length ? v`
      <div class="row">
        <label title="Another floor's walls, shown faintly under this one to trace over">
          Floor under
        </label>
        <select
          @change=${(n) => {
      const o = n.target.value;
      this._setRefFloor(
        o ? { floorId: o, opacity: e?.opacity ?? To } : void 0
      );
    }}
        >
          <option value="" .selected=${!i}>None</option>
          ${t.map(
      (n) => v`<option value=${n.id} .selected=${i?.id === n.id}>${n.name}</option>`
    )}
        </select>
      </div>
      ${i ? v`<div class="row">
            <label>Opacity</label>
            <input
              class="trace-range"
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              .value=${String(e?.opacity ?? To)}
              @input=${(n) => this._setRefFloor({
      floorId: i.id,
      opacity: Number(n.target.value)
    })}
            />
          </div>` : y}
    ` : v`<p class="hint">
        Add a second floor to show one under the other as a tracing reference.
      </p>`;
  }
  /** The template itself, drawn under the grid and everything on the plan. */
  _renderTraceLayer() {
    const t = this._trace();
    return t?.visible ? $`<g class="trace" transform=${Mx(t)} opacity=${t.opacity}
                  pointer-events="none">
      <image href=${t.src} x="0" y="0" width=${t.pw} height=${t.ph}
             preserveAspectRatio="none" />
    </g>` : y;
  }
  /**
   * While moving or calibrating the template: a sheet over the whole canvas
   * that takes the pointer, so a click meant for the template can't select
   * the wall drawn on top of it — plus the calibration points picked so far.
   */
  _renderTraceOverlay() {
    if (!this._traceMode || !this._trace()) return y;
    const { width: t, height: e } = this._config, i = Math.max(t, e) / 160, { a: n, b: o } = this._traceCalib, r = (s, a) => $`
      <g class="trace-mark">
        <circle cx=${s.x} cy=${s.y} r=${i} />
        <line x1=${s.x - i * 2} y1=${s.y} x2=${s.x + i * 2} y2=${s.y} />
        <line x1=${s.x} y1=${s.y - i * 2} x2=${s.x} y2=${s.y + i * 2} />
        <text x=${s.x + i * 1.6} y=${s.y - i * 1.6} font-size=${i * 3}>${a}</text>
      </g>`;
    return $`
      ${n && o ? $`<line class="trace-measure" x1=${n.x} y1=${n.y} x2=${o.x} y2=${o.y} />` : y}
      ${n ? r(n, "A") : y}
      ${o ? r(o, "B") : y}
      <rect class="trace-sheet ${this._traceMode}" x="0" y="0" width=${t} height=${e}
            @pointerdown=${this._onTraceDown}
            @pointermove=${this._onTraceMove}
            @pointerup=${this._onTraceUp}
            @pointercancel=${this._onTraceUp} />`;
  }
  _onTraceDown(t) {
    if (t.stopPropagation(), t.button !== 0 || this._traceDrag) return;
    const e = this._trace();
    if (!e) return;
    const i = this._toVirtual(t, !1);
    if (this._traceMode === "move") {
      this._traceDrag = { pointerId: t.pointerId, start: i, x0: e.x, y0: e.y }, this._capturePointer(t);
      return;
    }
    const { a: n, b: o, distance: r } = this._traceCalib;
    this._traceCalib = n && !o ? { a: n, b: i, distance: r } : { a: i, distance: r };
  }
  _onTraceMove(t) {
    t.stopPropagation();
    const e = this._traceDrag;
    if (!e || t.pointerId !== e.pointerId) return;
    if (t.buttons === 0) {
      this._traceDrag = null;
      return;
    }
    const i = this._toVirtual(t, !1);
    this._patchTrace({ x: e.x0 + i.x - e.start.x, y: e.y0 + i.y - e.start.y });
  }
  _onTraceUp(t) {
    t.stopPropagation(), this._traceDrag?.pointerId === t.pointerId && (this._traceDrag = null, this._releasePointer(t));
  }
  /**
   * What "units" are, said in the parts the editor draws — the scale a plan is
   * calibrated to is the same one every door, window and wall is measured in,
   * so a door clicked on the plan and typed as 60 fits the editor's own door.
   */
  _unitsHint() {
    const t = this._defaultOpeningLength, e = this._defaultWallThickness ?? nt;
    return `Units are the editor's own measure, the same for every part: a door or window is ${t}, a wall ${e} thick, one grid square ${this.grid}. Scale the plan so its doors measure ${t} and new doors, windows and walls fit it.`;
  }
  _applyTraceCalibration() {
    const t = this._trace(), { a: e, b: i, distance: n } = this._traceCalib;
    !t || !e || !i || !(n > 0) || (this._setTrace(Ex(t, e, i, n)), this._endTraceMode());
  }
  /** The context bar while the template owns the canvas. */
  _renderTraceContext() {
    if (this._traceMode === "move")
      return v`
        <span class="ctx-hint">Drag to move the template under the plan.</span>
        <button class="active" @click=${() => this._endTraceMode()}>Done</button>
      `;
    const { a: t, b: e, distance: i } = this._traceCalib;
    if (!t || !e)
      return v`
        <span class="ctx-hint">
          ${t ? "Now click the other end (B)." : `Click one end (A) of a door on the plan — or anything else whose size in units you know. ${this._unitsHint()}`}
        </span>
        <button @click=${() => this._endTraceMode()}>Cancel</button>
      `;
    const n = Math.hypot(e.x - t.x, e.y - t.y);
    return v`
      <span class="ctx-hint">A–B measures ${Math.round(n)} units now. It should be</span>
      <label class="ctx-field">
        <input
          class="num"
          type="number"
          min="1"
          step="1"
          .value=${String(i)}
          title=${this._unitsHint()}
          @input=${(o) => {
      this._traceCalib = {
        ...this._traceCalib,
        distance: Number(o.target.value) || 0
      };
    }}
          @keydown=${(o) => {
      o.key === "Enter" && this._applyTraceCalibration();
    }}
        />
        units
      </label>
      <button class="active" ?disabled=${!(i > 0)} @click=${this._applyTraceCalibration}>
        Apply scale
      </button>
      <button @click=${() => this._endTraceMode()}>Cancel</button>
    `;
  }
  /** The side-panel group: load, place, scale and drop the template. */
  _renderTracePanel() {
    const t = this._trace(), e = v`<input
      class="trace-file"
      type="file"
      accept="application/pdf,.pdf,image/*"
      hidden
      @change=${(r) => {
      const s = r.target, a = s.files?.[0];
      s.value = "", a && this._loadTrace(a);
    }}
    />`, i = (r) => r.currentTarget.parentElement?.querySelector(
      "input.trace-file"
    )?.click(), n = v`${this._traceBusy ? v`<p class="hint">Loading…</p>` : y}${this._traceError ? v`<p class="hint trace-error">${this._traceError}</p>` : y}`;
    if (!t)
      return v`
        <p class="hint">
          Lay a PDF or image of an existing plan under the canvas and draw your walls over
          it. Editor only — it is never saved and the card never shows it.
        </p>
        <div class="row">
          ${e}
          <button ?disabled=${this._traceBusy} @click=${i}>
            <ha-icon icon="mdi:file-upload-outline"></ha-icon> Load PDF or image…
          </button>
        </div>
        ${n} ${this._renderRefFloorControls()}
      `;
    const o = (r, s, a, l = {}) => v`
      <div class="row">
        <label title=${l.title ?? y}>${r}</label>
        <input
          type="number"
          step=${l.step ?? "any"}
          min=${l.min ?? y}
          title=${l.title ?? y}
          .value=${String(Math.round(s * 100) / 100)}
          @change=${(c) => {
      const d = Number(c.target.value);
      Number.isFinite(d) && a(d);
    }}
        />
      </div>
    `;
    return v`
      <div class="row">
        <label>File</label>
        <span class="trace-name" title=${t.name}>${t.name}</span>
      </div>
      ${t.pages && t.pages > 1 ? v`<div class="row">
            <label>Page</label>
            <select
              ?disabled=${this._traceBusy}
              @change=${(r) => void this._setTracePage(Number(r.target.value))}
            >
              ${Array.from(
      { length: t.pages },
      (r, s) => v`<option value=${s + 1} .selected=${s + 1 === t.page}>
                    ${s + 1} of ${t.pages}
                  </option>`
    )}
            </select>
          </div>` : y}
      <div class="row">
        <label>Show</label>
        <input
          type="checkbox"
          .checked=${t.visible}
          @change=${(r) => this._patchTrace({ visible: r.target.checked })}
        />
      </div>
      <div class="row">
        <label>Opacity</label>
        <input
          class="trace-range"
          type="range"
          min="0.05"
          max="1"
          step="0.05"
          .value=${String(t.opacity)}
          @input=${(r) => this._patchTrace({ opacity: Number(r.target.value) })}
        />
      </div>
      <div class="row trace-actions">
        <label>Scale</label>
        <button
          class=${this._traceMode === "calibrate" ? "active" : ""}
          aria-pressed=${this._traceMode === "calibrate"}
          title="Click both ends of something on the plan, then type how many units it should be"
          @click=${() => this._startTraceMode("calibrate")}
        >
          <ha-icon icon="mdi:ruler"></ha-icon> Set by 2 points
        </button>
      </div>
      <p class="hint">${this._unitsHint()}</p>
      ${o(
      "Width",
      fd(t).w,
      (r) => {
        r > 0 && this._setTrace(Ax(t, r));
      },
      {
        title: "The template's width on the canvas, in units (keeps its proportions)",
        min: "1"
      }
    )}
      <div class="row trace-actions">
        <label>Position</label>
        <button
          class=${this._traceMode === "move" ? "active" : ""}
          aria-pressed=${this._traceMode === "move"}
          title="Drag the template on the canvas"
          @click=${() => this._startTraceMode("move")}
        >
          <ha-icon icon="mdi:cursor-move"></ha-icon> Move
        </button>
        <button
          title="Fit the whole template inside the canvas again"
          @click=${() => this._patchTrace({
      ...Ba(t.pw, t.ph, this._config.width, this._config.height),
      rotation: 0
    })}
        >
          Fit
        </button>
      </div>
      ${o("X", t.x, (r) => this._patchTrace({ x: r }))}
      ${o("Y", t.y, (r) => this._patchTrace({ y: r }))}
      ${o("Rotation", t.rotation, (r) => this._patchTrace({ rotation: r }), {
      title: "Degrees clockwise, about the template's centre",
      step: "0.5"
    })}
      <div class="row">
        ${e}
        <button ?disabled=${this._traceBusy} @click=${i}>Replace…</button>
        <button
          title="Remove the template — it is not part of the plan, so nothing else changes"
          @click=${() => {
      this._endTraceMode(), this._setTrace(void 0);
    }}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon> Remove
        </button>
      </div>
      ${n} ${this._renderRefFloorControls()}
      <p class="hint">Editor only — never saved, never shown on the card.</p>
    `;
  }
  _isSel(t, e) {
    return this._selection.some((i) => i.kind === t && i.id === e);
  }
  /**
   * The second toolbar row: shows controls and hints for whatever you're
   * currently doing — options for the active drawing tool, or actions for the
   * current selection. This keeps contextual controls (which come and go) out
   * of the always-present top row.
   */
  _renderContextBar() {
    const t = this._tool;
    let e, i;
    if (this._traceMode)
      e = "Trace", i = this._renderTraceContext();
    else if (t === "wall")
      e = "Wall", i = v`
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
        <label class="ctx-field">
          Thickness
          <input
            class="num"
            type="number"
            min="2"
            max=${Ti}
            step="1"
            .value=${String(this._defaultWallThickness ?? nt)}
            title="Thickness of the next walls you draw; kept until you change it"
            @change=${(n) => {
        const o = n.target;
        this._setDefaultWallThickness(o.valueAsNumber), o.value = String(this._defaultWallThickness ?? nt);
      }}
          />
        </label>
        <span class="ctx-hint">Thickness stays active until you change it, including changes made on a selected wall. Remembered in this browser across plans.</span>
      `;
    else if (t === "tracker")
      e = "Tracker", i = v`
        <span class="ctx-hint"
          >Drag on the canvas to draw the tracked area; bind one or two
          distance sensors in its properties.</span
        >
      `;
    else if (t === "area") {
      e = "Area";
      const n = this._draftArea?.points.length ?? 0;
      i = v`
        <span class="ctx-hint">
          ${n === 0 ? "Click to start a room outline; points snap to nearby corners." : n < 3 ? `${n} point${n === 1 ? "" : "s"} placed — click to add more (3+ to close).` : `${n} points placed — click the first point to close the room, or keep adding.`}
        </span>
      `;
    } else if (t === "roof") {
      e = "Roof";
      const n = this._draftArea?.points.length ?? 0;
      i = v`
        <span class="ctx-hint">
          ${n === 0 ? "Drag a rectangle or click corners to draw a roof footprint." : n < 3 ? `${n} point${n === 1 ? "" : "s"} placed — click to add more (3+ to close).` : `${n} points placed — click the first point to close the roof, or keep adding.`}
        </span>
      `;
    } else if (t === "skylight") {
      e = "Skylight";
      const n = (o, r, s, a) => v`
        <label class="ctx-field">
          ${o}
          <input
            class="num"
            type="number"
            min="1"
            .value=${String(r)}
            title=${s}
            @change=${(l) => {
        a(Math.max(1, Number(l.target.value) || r));
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
    } else if (t === "door" || t === "passage" || t === "window")
      e = _e[t].label, i = v`
        <label class="ctx-field">
          Length
          <input
            class="num"
            type="number"
            min="1"
            .value=${String(this._defaultOpeningLength)}
            title="Default length applied to the next ${t} you place"
            @change=${(n) => {
        this._defaultOpeningLength = Math.max(
          1,
          Number(n.target.value) || this._defaultOpeningLength
        );
      }}
          />
        </label>
        <span class="ctx-hint">Click on a wall to drop a ${t}; it snaps onto the wall.</span>
      `;
    else {
      e = "Select";
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
        <span class="ctx-label">${e}</span>
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
    const t = this._snapMode, e = vs(this._config.snap, this.grid);
    return v`
      <label class="snap-control">Snap
        <select aria-label="Snapping" aria-describedby="snap-hint" .value=${t}
          @change=${(i) => this._setSnapMode(i.target.value)}>
          <option value="grid">Grid</option>
          <option value="off">Off</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      ${t === "custom" ? v`<input
              class="num"
              type="number"
              min="1"
              step="5"
              .value=${String(e)}
              title="Custom snap step, as a percentage of the grid"
              aria-label="Custom snap percentage"
              aria-describedby="snap-hint"
              @change=${(i) => {
      const n = Math.max(
        1,
        Number(i.target.value) || bs
      );
      this._patchConfig({ snap: vo(n, this.grid) });
    }}
            /><span class="ctx-field-label">%</span>` : y}
      <span class="ctx-hint snap-hint" id="snap-hint">${t === "grid" ? `Snapping to the ${this.grid}-unit grid.` : t === "off" ? "Snapping is off." : `Snap = ${e}% of grid (${this._resolvedSnap} units).`}</span>
    `;
  }
  render() {
    if (!this._config) return v`${y}`;
    const t = this._config, e = this._floor(), i = Fc(e, Ze(this.hass));
    this._autoLabelSig = [];
    const n = t.floors ?? [], o = this._roomWallSegments(e), r = Fr([...e.walls, ...o]), s = /* @__PURE__ */ new Map();
    for (const u of e.areas ?? [])
      for (const [m, b] of ee.entries())
        s.set(Jc(u.id, b), { area: u, side: b, edgeIndex: m });
    const a = zn(t.overlayScale), l = a === "plan" ? Pn(t.overlayMinWidth) : void 0, c = this._scopingAreaId(), d = t.showDeadSpaces ? sn(r, e.openings) : [], h = Qc(
      e.areas ?? [],
      Vr(t),
      Zc(this.hass, t.skin)
    ), p = e.items.some((u) => u.glow) ? lo(r, e.openings, (u) => Pr(
      u,
      ((b) => Ge(u, b ? this.hass?.states[b] : void 0))(u.entity),
      u.secondaryEntity && _i(u) ? Ge(
        yc(u),
        this.hass?.states[u.secondaryEntity]
      ) : void 0,
      u.shutterEntity ? Wt(this.hass?.states[u.shutterEntity], u.shutterInvert) : void 0
    )) : r, f = !e.walls.length && !e.openings.length && !e.items.length && !e.texts.length && !e.furniture.length && !(e.trackers ?? []).length && !(e.areas ?? []).length;
    return v`
      <div
        class="editor ${this._fullscreen ? "fullscreen" : ""} ${this._mobileInspector ? "show-inspector" : ""} ${this._previewCollapsed ? "preview-collapsed" : ""} ${this._keyboardOpen ? "keyboard-open" : ""}"
        popover=${this._fullscreen ? "manual" : y}
        @pointerdown=${this._onEditorPointerDown}
      >
        ${this._floorMenuOpen || this._addMenuOpen ? v`<div
              class="pop-backdrop"
              @click=${() => {
      this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "";
    }}
            ></div>` : y}
        <div class="toolbar">
          <div class="editor-brand">
            <ha-icon icon="mdi:floor-plan"></ha-icon>
            <strong>${t.title || "Untitled plan"}</strong>
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
            <ha-icon icon=${_e[this._tool].icon}></ha-icon>
            <select aria-label="Drawing tool" .value=${this._tool}
              @change=${(u) => this._chooseTool(u.target.value)}>
              ${qa.map((u) => v`<option value=${u}>${_e[u].label}</option>`)}
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
            ${this._addMenuOpen ? this._renderAddMenu() : y}
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
          ${this._applyError ? v`<span class="apply-error">${this._applyError}</span>` : y}

        </div>

        <div class="workspace">
          <!-- Tools — modes; exactly one is active at a time -->
          <nav class="tool-rail" aria-label="Drawing tools">
            ${qa.map(
      (u) => v`
                <button
                  class=${this._tool === u ? "active" : ""}
                  aria-pressed=${this._tool === u}
                  title=${_e[u].label}
                  @click=${() => this._chooseTool(u)}
                >
                  <ha-icon icon=${_e[u].icon}></ha-icon><span>${_e[u].label}</span>
                </button>`
    )}
          </nav>
        <div class="canvas-column">
          <div class="canvas-heading">
          <!-- Floor — switch + add inline; rename/delete behind the gear -->
          <span class="floors pop-wrap">
            <ha-icon icon="mdi:layers-outline"></ha-icon><label for="editing-floor">Floor</label>
            <select id="editing-floor" aria-label="Editing floor"
              @change=${(u) => {
      this._switchFloor(u.target.value), this._canvasWrap?.focus({ preventScroll: !0 });
    }}
            >
              ${n.map(
      (u) => v`<option value=${u.id} .selected=${u.id === this._activeFloorId}>${u.name}</option>`
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
                  ${this._renderHaFloorRow(e)}
                  <!-- Reorder (issue #66): the safe alternative to cut-and-
                       pasting floor blocks in YAML, which drops/duplicates
                       ids. Position in this list is the switcher order. -->
                  <div class="pop-row">
                    <label>Order</label>
                    <button
                      aria-label="Move floor up"
                      title="Move this floor up the list"
                      ?disabled=${n.length < 2 || n[0]?.id === this._activeFloorId}
                      @click=${() => this._moveFloor(-1)}
                    >
                      <ha-icon icon="mdi:arrow-up"></ha-icon>
                    </button>
                    <button
                      aria-label="Move floor down"
                      title="Move this floor down the list"
                      ?disabled=${n.length < 2 || n[n.length - 1]?.id === this._activeFloorId}
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
                      .value=${e?.name ?? ""}
                      @change=${(u) => this._renameFloor(this._activeFloorId, u.target.value)}
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
                      .value=${e?.short ?? ""}
                      @change=${(u) => this._commitFloor({
      short: u.target.value.trim() || void 0
    })}
                    />
                  </div>
                  <div class="pop-row">
                    <label>Color</label>
                    <input
                      type="color"
                      title="Accent for this floor's switcher button while active"
                      .value=${e?.color ?? "#03a9f4"}
                      @input=${(u) => this._commitFloor({ color: u.target.value })}
                    />
                    <button
                      aria-label="Clear floor color"
                      title="Back to the theme color"
                      ?disabled=${!e?.color}
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
                      @change=${(u) => this._commit({
      ...this._config,
      defaultFloor: u.target.checked ? this._activeFloorId : void 0
    })}
                    />
                  </div>
                  <!-- Floor Summary Settings (issue #234) -->
                  ${(() => {
      const u = e ? he(e, this._config.floorSummary) : !1;
      return v`
                      <div class="pop-row" style="margin-top: 6px;">
                        <label>Summary enabled</label>
                        <input
                          type="checkbox"
                          title="Show aggregate summary on switcher button"
                          .checked=${u}
                          @change=${(m) => this._commitFloor({
        summary: {
          ...e?.summary,
          enabled: m.target.checked
        }
      })}
                        />
                      </div>
                      ${u ? v`
                            <div class="pop-row">
                              <label>Temp helper</label>
                              ${this._renderEntityPicker(
        e?.summary?.temperatureEntity ?? "",
        (m) => this._commitFloor({
          summary: {
            ...e?.summary,
            temperatureEntity: m || void 0
          }
        }),
        ["sensor", "climate"]
      )}
                            </div>
                            <div class="pop-row">
                              <label>Humidity helper</label>
                              ${this._renderEntityPicker(
        e?.summary?.humidityEntity ?? "",
        (m) => this._commitFloor({
          summary: {
            ...e?.summary,
            humidityEntity: m || void 0
          }
        }),
        ["sensor", "climate"]
      )}
                            </div>
                            <div class="pop-row">
                              <label>Presence helper</label>
                              ${this._renderEntityPicker(
        e?.summary?.presenceEntity ?? "",
        (m) => this._commitFloor({
          summary: {
            ...e?.summary,
            presenceEntity: m || void 0
          }
        }),
        ["binary_sensor", "input_boolean", "person", "device_tracker"]
      )}
                            </div>
                          ` : y}
                    `;
    })()}
                  <button
                    class="danger pop-action"
                    ?disabled=${n.length <= 1}
                    @click=${() => {
      this._deleteFloor(), this._floorMenuOpen = !1;
    }}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon> Delete this floor
                  </button>
                </div>` : y}
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

          <!-- Trace template: show / hide the floor's tracing paper without
               opening its panel. Only there when this floor has one. -->
          ${this._trace() ? v`<button
                class="icon-btn"
                aria-pressed=${!this._trace().visible}
                title=${this._trace().visible ? "Hide the trace template — see the plan on its own" : "Show the trace template under the plan"}
                @click=${() => {
      const u = !this._trace().visible;
      u || this._endTraceMode(), this._patchTrace({ visible: u });
    }}
              >
                <ha-icon
                  icon=${this._trace().visible ? "mdi:layers-outline" : "mdi:layers-off-outline"}
                ></ha-icon>
                Trace
              </button>` : y}


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
          style=${this._fullscreen ? y : `aspect-ratio:${W(t.width, Ct)} / ${W(t.height, Ot)};`}
          @wheel=${this._onCanvasWheel}
          @scroll=${this._onCanvasScroll}
        >
          <!-- The stage doubles as the card's .plan box for overlay sizing: same
               container query, same --fp-u, so a badge measured in canvas units
               previews here at the size a card of this width would draw it
               (issue #192). The editor never rotates the plan, so the canvas
               width is what 100cqw measures against. -->
          <div class="stage ${a === "plan" ? "scale-plan" : ""}"
               style="aspect-ratio: ${W(t.width, Ct)} / ${W(
      t.height,
      Ot
    )}; width:${this._zoom * 100}%;
                   --fp-plan-w: ${W(t.width, Ct)};${l === void 0 ? "" : `--fp-min-w: ${l}px;`}${Sh(
      t.skin
    )}${Gc(t.palette)}">
            <!-- Keyed on the skin and the palette, for the repaint reason
                 documented on the card's SVG (issue #122): a var() inside a
                 presentation attribute does not repaint when the custom
                 property changes, so without this the canvas kept the previous
                 skin's doors and room fills — and, since issue #265, would show
                 a palette colour's old value while you were editing it. -->
            ${Po(
      `${t.skin ?? ""}|${Kc(t.palette)}`,
      $`<svg
              viewBox="0 0 ${t.width} ${t.height}"
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
                width=${t.width}
                height=${t.height}
                fill=${t.background ?? Ni}
              />
              ${i ? $`<image href=${i.href} x="0" y="0" width=${t.width} height=${t.height}
                            preserveAspectRatio=${Rc(e.imageFit)}
                            opacity=${e.imageOpacity ?? 1}
                            style=${i.filter ? `filter: ${i.filter}` : y} />` : y}
              ${this._renderTraceLayer()}
              ${this._renderGrid()}
              ${this._renderRefFloor()}
              ${jt(
        e.areas ?? [],
        (u, m) => u.id || m,
        (u, m) => this._renderAreaSel(u, c, h[m])
      )}
              ${jt(
        e.roofs ?? [],
        (u, m) => u.id || m,
        (u) => this._renderRoofSel(u)
      )}
              <!-- Dead spaces (issue #88), same layer position as the card so
                   what you draw is what you get. Live while you draw: closing
                   the last wall of a shaft hatches it, and dropping a door into
                   it clears the hatching again — which is the fastest way to
                   see that the card agrees with you about what is sealed. -->
              ${d.length ? $`${Nc(`${this._wallMaskId}-dead`)}
                      ${d.map(
        (u) => Hc(u, `${this._wallMaskId}-dead`)
      )}` : y}
              <!-- Light pools (issue #6), same layer position as the card so
                   what you place is what you get. Previewed at full strength
                   with no hass in the editor, so the radius is adjustable
                   without having to turn the real light on. -->
              ${Kl(
        e.furniture,
        t.width,
        t.height,
        `${this._wallMaskId}-glowmask`,
        this._symbols()
      )}
              <g class="fp-glows"
                 mask=${e.furniture.length ? `url(#${this._wallMaskId}-glowmask)` : y}>
                ${e.items.map((u, m) => {
        if (!u.glow) return y;
        const b = Vs(u, this.hass?.states[u.entity]);
        return b ? Bl(u, b, `${this._wallMaskId}-glow-${m}`, p) : y;
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
      e.items.map((u) => {
        if (!u.glow || !this._isSel("item", u.id)) return y;
        const m = W(u.glowRadius, Ai), b = Te(u);
        if (b) return $`<path class="glow-guide" d=${Eg(b, m)} />`;
        const g = Oi(u);
        return g ? $`<polygon class="glow-guide"
                                   points=${Ul(u.x, u.y, m, g.bearing, g.width / 2).map((w) => `${w.x},${w.y}`).join(" ")} />` : $`<circle class="glow-guide" cx=${u.x} cy=${u.y} r=${m} />`;
      })}
              ${e.furniture.map((u) => this._renderFurnitureSel(u))}
              ${Ur(e.openings, t.width, t.height, this._wallMaskId)}
              ${(() => {
        const u = (m, b) => this._renderWall(m, b);
        return [...e.walls, ...o].map((m) => u(m, s.get(m.id)));
      })()}
              <!-- Room outlines, same layer position as the card so what you
                   place is what you get. Only a static borderColor draws here,
                   there being no hass to resolve a live color from — but the
                   clip ids are passed anyway, so wiring a live preview in later
                   cannot silently land on the unclipped path. -->
              <g mask=${`url(#${this._wallMaskId})`}>
                ${(e.areas ?? []).map(
        (u, m) => Wc(u, void 0, `${this._wallMaskId}-area-${m}`)
      )}
              </g>
              ${e.items.map((u) => this._renderStripSel(u))}
              ${e.items.map((u) => this._renderSpotAim(u))}
              ${jt(
        // Keyed by id: switching floors must create fresh DOM. Reused
        // nodes would CSS-transition from the previous floor's opening
        // state — a window briefly plays a door swing (issue #50).
        e.openings,
        (u, m) => u.id || m,
        (u) => this._renderOpeningSel(u)
      )}
              ${jt(
        e.trackers ?? [],
        (u, m) => u.id || m,
        (u) => this._renderTrackerSel(u)
      )}
              ${this._draftTracker ? $`<rect class="tracker-draft"
                              x=${Math.min(this._draftTracker.x0, this._draftTracker.x1)}
                              y=${Math.min(this._draftTracker.y0, this._draftTracker.y1)}
                              width=${Math.abs(this._draftTracker.x1 - this._draftTracker.x0)}
                              height=${Math.abs(this._draftTracker.y1 - this._draftTracker.y0)}
                              rx="4" />` : y}
              ${this._draft ? $`<g class="fp-wall-neon"><line x1=${this._draft.x1} y1=${this._draft.y1}
                              x2=${this._draft.x2} y2=${this._draft.y2}
                              class="wall draft" mask=${`url(#${this._wallMaskId})`}
                              stroke-width=${nt} /></g>` : y}
              ${this._renderAreaDraft()}
              ${this._marquee ? $`<rect x=${Math.min(this._marquee.x0, this._marquee.x1)}
                              y=${Math.min(this._marquee.y0, this._marquee.y1)}
                              width=${Math.abs(this._marquee.x1 - this._marquee.x0)}
                              height=${Math.abs(this._marquee.y1 - this._marquee.y0)}
                              class="marquee" />` : y}
              ${this._renderTraceOverlay()}
            </svg>`
    )}
            <div class="items">
              ${(t.floors ?? []).length > 1 || (t.floors ?? []).some((u) => he(u, t.floorSummary)) ? this._renderSwitcherHandle(t) : y}
              ${e.texts.map((u) => this._renderTextOverlay(u, t, a))}
              ${e.openings.filter((u) => bc(u)).map((u) => this._renderShutterMarkOverlay(u, t, a))}
              ${e.openings.filter((u) => wc(u)).map((u) => this._renderOpeningMarkOverlay(u, t, a))}
              ${e.items.map((u) => this._renderItemOverlay(u, t, a))}
            </div>
          </div>
        </div>
        ${f && !this._draft && !this._draftTracker && !this._draftArea ? v`<div class="empty-hint">
              <div>
                <b>Draw your first room:</b> pick the <b>Wall</b> tool and drag on the canvas.<br />
                Then drop doors, windows and devices onto it.
              </div>
            </div>` : y}
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
            ${this._projectOpen ? y : this._renderElementEdit()}
          </div>
          <div id="project-panel" role="tabpanel" aria-labelledby="project-tab" ?hidden=${!this._projectOpen}>
            ${this._projectOpen ? this._renderPanel() : y}
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
  _renderForm(t, e) {
    const i = this._actionYaml && customElements.get("ha-yaml-editor") ? Zv(t) : [];
    if (i.length) {
      const n = t.fields.filter((o) => !i.includes(o.name) && o.name !== "moreInfoEntity");
      return v`${n.length ? this._renderForm({ ...t, fields: n }, e) : y}
        ${this._renderActionYaml(t, i, e)}`;
    }
    if (customElements.get("ha-form")) {
      const n = this._numberDraft, o = n?.form.isConnected && t.fields.some((r) => r.name === n.name) ? { ...t.data, [n.name]: n.value } : t.data;
      return v`<ha-form
        .hass=${this.hass}
        .data=${o}
        .schema=${t.fields}
        .computeLabel=${Hx}
        .computeHelper=${jx}
        @focusout=${(r) => {
        this._numberDraft?.form === r.currentTarget && (this._numberDraft = void 0, this.requestUpdate());
      }}
        @value-changed=${(r) => {
        r.stopPropagation();
        const s = Xv(o, r.detail.value, t.fields), a = Object.keys(s), l = a.length === 1 ? t.fields.find((f) => f.name === a[0]) : void 0, c = r.currentTarget;
        l && "number" in l.selector && c.matches(":focus-within") && (this._numberDraft = { form: c, name: l.name, value: s[l.name] }, this.requestUpdate());
        const d = Na(s, t.fields), h = Object.keys(d);
        if (!h.length) return;
        const p = h.length === 1 && Da(t.fields.find((f) => f.name === h[0]));
        e(t.toPatch(d), p);
      }}
      ></ha-form>`;
    }
    return v`${t.fields.map((n) => this._renderFallbackField(t, n, e))}
      ${t.fields.some((n) => "ui_action" in n.selector) ? v`<p class="hint action-editor-note">Edit tap, hold and double-tap actions in the Home Assistant editor.</p>` : y}`;
  }
  /** The Behavior group's actions in HA's own YAML editor (issue #314). */
  _renderActionYaml(t, e, i) {
    const n = {};
    for (const l of e) t.data[l] != null && (n[l] = t.data[l]);
    const o = this._primary(), r = o ? `${o.kind}:${o.id}` : "", s = JSON.stringify(n), a = this._actionYamlSeen;
    return (a.key !== r || a.json !== s) && (this._actionYamlSeen = { key: r, json: s, gen: a.gen + 1 }, this._actionYamlError && (this._actionYamlError = "")), v`<div class="action-yaml">
      ${Po(this._actionYamlSeen.gen, v`<ha-yaml-editor
        .hass=${this.hass}
        .defaultValue=${n}
        @value-changed=${(l) => {
      if (l.stopPropagation(), l.detail.isValid === !1) return;
      const c = Qv(l.detail.value, e);
      if ("error" in c) {
        this._actionYamlError = c.error;
        return;
      }
      this._actionYamlError = "";
      const d = {};
      for (const p of e) c.patch[p] !== void 0 && (d[p] = c.patch[p]);
      const h = JSON.stringify(d);
      h !== this._actionYamlSeen.json && (this._actionYamlSeen = { ...this._actionYamlSeen, json: h }, i(t.toPatch(c.patch), !0));
    }}
      ></ha-yaml-editor>`)}
      ${this._actionYamlError ? v`<p class="hint action-yaml-error" role="alert">${this._actionYamlError}</p>` : y}
    </div>`;
  }
  _renderEssentialForm(t, e, i) {
    return v`<div class="essential-fields">
      ${Ht(t, e).fields.map((n) => {
      const o = n.selector.number, r = o ? { ...n, selector: { number: { ...o, mode: "box" } } } : n.name === "goToFloor" ? { ...n, helper: "Tap this object to change floors." } : n, s = o || n.name === "hand";
      return v`<div class=${s ? "essential-field" : "essential-field full"}>
          ${this._renderForm({ ...t, fields: [r] }, i)}
        </div>`;
    })}
    </div>`;
  }
  _applyFallback(t, e, i, n, o) {
    const r = Na({ [e.name]: i }, t.fields);
    e.name in r && o(t.toPatch(r), n && Da(e));
  }
  /** One plain-input row per schema field — the outside-HA / load-failure path. */
  _renderFallbackField(t, e, i) {
    const n = t.data[e.name], o = e.selector;
    if ("select" in o) {
      const r = o.select, s = r.options;
      if (r.custom_value) {
        const a = `sel-${e.name}-${s.length}`;
        return v`<div class="row wide">
          <label for=${`field-${e.name}`}>${e.label}</label>
          <input id=${`field-${e.name}`}
            type="text"
            list=${a}
            .value=${String(n ?? "")}
            @change=${(l) => this._applyFallback(t, e, l.target.value, !1, i)}
          />
          <datalist id=${a}>
            ${s.map((l) => v`<option value=${l.value}></option>`)}
          </datalist>
        </div>`;
      }
      return v`<div class="row">
        <label for=${`field-${e.name}`}>${e.label}</label>
        <select id=${`field-${e.name}`}
          .value=${String(n ?? "")}
          @change=${(a) => this._applyFallback(t, e, a.target.value, !1, i)}
        >
          ${s.map(
        (a) => v`<option value=${a.value} ?selected=${a.value === n}>${a.label}</option>`
      )}
        </select>
      </div>`;
    }
    if ("boolean" in o)
      return v`<div class="row">
        <label for=${`field-${e.name}`}>${e.label}</label>
        <input id=${`field-${e.name}`}
          type="checkbox"
          .checked=${!!n}
          @change=${(r) => this._applyFallback(t, e, r.target.checked, !1, i)}
        />
      </div>`;
    if ("number" in o) {
      const r = o.number, s = r.mode === "slider";
      return v`<div class="row">
        <label for=${`field-${e.name}`}>${e.label}</label>
        ${s ? v`<input aria-label=${e.label}
              type="range"
              min=${r.min ?? 0}
              max=${r.max ?? 100}
              step=${r.step ?? 1}
              .value=${String(n ?? r.min ?? 0)}
              @input=${(a) => this._applyFallback(t, e, Number(a.target.value), !0, i)}
            />` : y}
        <input id=${`field-${e.name}`}
          class="num"
          type="number"
          min=${r.min ?? y}
          max=${r.max ?? y}
          step=${r.step ?? y}
          .value=${String(n ?? "")}
          @change=${(a) => {
        const l = a.target;
        this._applyFallback(
          t,
          e,
          l.value === "" ? void 0 : Number(l.value),
          !1,
          i
        ), l.value = String(t.data[e.name] ?? "");
      }}
        />
      </div>`;
    }
    if ("entity" in o) {
      const r = o.entity;
      return v`<div class="row wide">
        <label for=${`field-${e.name}`}>${e.label}</label>
        ${this._renderEntityPicker(
        String(n ?? ""),
        (s) => this._applyFallback(t, e, s, !1, i),
        r.filter?.[0]?.domain,
        r.include_entities,
        `field-${e.name}`
      )}
      </div>`;
    }
    return "icon" in o ? v`<div class="row wide">
        <label for=${`field-${e.name}`}>${e.label}</label>
        <input id=${`field-${e.name}`}
          type="text"
          placeholder=${o.icon.placeholder ?? "mdi:…"}
          .value=${String(n ?? "")}
          @change=${(r) => this._applyFallback(t, e, r.target.value, !1, i)}
        />
      </div>` : "ui_action" in o ? v`${y}` : v`<div class="row">
      <label for=${`field-${e.name}`}>${e.label}</label>
      <input id=${`field-${e.name}`}
        type="text"
        .value=${String(n ?? "")}
        @input=${(r) => this._applyFallback(t, e, r.target.value, !0, i)}
      />
    </div>`;
  }
  _renderEntityPicker(t, e, i, n, o) {
    return customElements.get("ha-entity-picker") ? v`<ha-entity-picker
        id=${o ?? y}
        .hass=${this.hass}
        .value=${t}
        .includeDomains=${i}
        .includeEntities=${n}
        allow-custom-entity
        @value-changed=${(r) => e(r.detail.value ?? "")}
      ></ha-entity-picker>` : v`<input
      id=${o ?? y}
      type="text"
      placeholder="sensor.example"
      .value=${t}
      @change=${(r) => e(r.target.value)}
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
  _renderAttributePicker(t, e, i, n) {
    return customElements.get("ha-entity-attribute-picker") && t ? v`<ha-entity-attribute-picker
        class="reading-attr"
        .hass=${this.hass}
        .entityId=${t}
        .value=${e}
        allow-custom-value
        title=${n ?? y}
        @value-changed=${(o) => i(o.detail.value ?? "")}
      ></ha-entity-attribute-picker>` : v`<input
      type="text"
      class="reading-attr"
      placeholder="attribute"
      title=${n ?? y}
      .value=${e}
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
  _renderIconPicker(t, e, i) {
    return customElements.get("ha-icon-picker") ? v`<ha-icon-picker
        class="rule-icon"
        .hass=${this.hass}
        .value=${t}
        placeholder=${i?.placeholder ?? "Icon"}
        title=${i?.title ?? y}
        @value-changed=${(n) => e(n.detail.value ?? "")}
      ></ha-icon-picker>` : v`<input
      type="text"
      class="rule-icon"
      placeholder=${i?.placeholder ?? "mdi:blinds"}
      title=${i?.title ?? y}
      .value=${t}
      @change=${(n) => e(n.target.value)}
    />`;
  }
  /** Toggle the full-screen workspace. */
  _toggleFullscreen() {
    this._fullscreen = !this._fullscreen, this._fullscreen && this._canvasWrap && (this._canvasWrap.style.width = "", this._canvasWrap.style.height = ""), this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "";
  }
  _chooseTool(t) {
    this._endTraceMode(), this._tool = t, this._mobileInspector = !1, this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaHover = null, this._areaDragStart = null, this._areaDragCurrent = null, this._clearAreaDragTimer(), this._areaDragMoved = !1;
  }
  _setInspector(t) {
    this._numberDraft = void 0, this._projectOpen = t, this.renderRoot.querySelector(".side")?.scrollTo({ top: 0 });
  }
  async _jumpToInspector(t = !1) {
    this._setInspector(t), this._mobileInspector = !0, await this.updateComplete, this.renderRoot.querySelector(t ? "#project-tab" : "#selection-tab")?.focus({ preventScroll: !0 });
  }
  async _jumpToCanvas() {
    this._mobileInspector = !1, await this.updateComplete, this._canvasWrap?.focus({ preventScroll: !0 });
  }
  /** A smaller preview should pan to the edited object without replacing manual zoom. */
  _keepSelectionInPreview() {
    if (!this._mobileInspector || this._projectOpen || this._gesturePointer !== null) return;
    const t = this.renderRoot.querySelector(".canvas-jump"), e = this.renderRoot.querySelector(".stage .selected"), i = this._canvasWrap;
    if (!t?.getClientRects().length || !i?.clientHeight || !e) return;
    const n = i.getBoundingClientRect(), o = e.getBoundingClientRect(), r = n.left + i.clientWidth, s = n.top + i.clientHeight;
    (o.left < n.left || o.right > r || o.top < n.top || o.bottom > s) && this._scrollCanvas(
      i.scrollLeft + (o.left + o.right - n.left - r) / 2,
      i.scrollTop + (o.top + o.bottom - n.top - s) / 2
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
    const t = () => {
      this._addMenuOpen = !1, this._addQuery = "";
    }, e = this._symbols(), i = pd(e).filter((r) => Ny(r, this._addQuery)), n = !this._addQuery.trim();
    let o = "";
    return v`
      <div class="pop left add-pop">
        <div class="add-shortcuts">
        <button
          class="add-entry"
          @click=${() => {
      this._addItem("generic"), t();
    }}
        >
          <ha-icon icon="mdi:lightbulb-outline"></ha-icon> Device
        </button>
        <button
          class="add-entry"
          @click=${() => {
      this._addText(), t();
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
      const s = n && r.category !== o ? r.category : "";
      return o = r.category, v`${s ? v`<div class="furn-group">${s}</div>` : y}
                  ${this._renderFurnCell(r, t)}`;
    }) : v`<div class="furn-empty">No symbol matches “${this._addQuery}”</div>`}
        </div>
      </div>
    `;
  }
  /** One picker cell: the symbol drawn at its own default size, plus its name. */
  _renderFurnCell(t, e) {
    const { w: i, h: n } = t.size, o = Math.max(i, n) * 0.25 + 6, r = `${-i / 2 - o} ${-n / 2 - o} ${i + o * 2} ${n + o * 2}`;
    return v`
      <button
        class="furn-cell"
        title=${t.name}
        @click=${() => {
      this._addFurniture(t.id), e();
    }}
      >
        <svg viewBox=${r}>
          ${ki(
      { id: "preview", type: t.id, x: 0, y: 0, w: i, h: n },
      void 0,
      this._symbols()
    )}
        </svg>
        <span>${t.name}</span>
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
    const t = this._selection.length, e = this._primary();
    if (t === 0 || !e)
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
    const i = t > 1 ? `${t} elements selected` : this._selectionSummary(e), n = t === 1 && e.kind === "furniture" ? this._floor().furniture.find((a) => a.id === e.id) : void 0, o = t === 1 && e.kind === "item" ? this._floor().items.find((a) => a.id === e.id) : void 0, r = t === 1 && e.kind === "opening" ? this._floor().openings.find((a) => a.id === e.id) : void 0, s = t > 1 ? "mdi:select-group" : o ? cn(o, this.hass?.states[o.entity], this.hass?.entities?.[o.entity]?.icon) : r ? _e[r.type].icon : Ux[e.kind];
    return v`
      <section class="edit-area">
        <div class="edit-head">
          ${n ? (() => {
      const { w: a, h: l } = Ps(n.type, this._symbols()), c = Math.max(a, l) * 0.2 + 6;
      return v`<svg class="selection-symbol" aria-hidden="true" viewBox=${`${-a / 2 - c} ${-l / 2 - c} ${a + 2 * c} ${l + 2 * c}`}>
              ${ki({ ...n, x: 0, y: 0, angle: 0, w: a, h: l }, "currentColor", this._symbols())}
            </svg>`;
    })() : v`<ha-icon icon=${s} aria-hidden="true"></ha-icon>`}
          <span class="edit-title" title=${i}>${i}</span>
          <span class="head-spacer"></span>
          ${(() => {
      const a = this._floor(), l = this._selection.every((c) => Xi(a, c));
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
        ${t > 1 ? v`<p class="hint">
              Edit elements one at a time. Drag any selected element to move the whole group.
            </p>` : v`
              ${this._renderPagePicker(tn[e.kind], !1)}
              ${this._renderAreaScopeHint()}
              <div id="object-settings-page" role=${tn[e.kind].length > 1 ? "tabpanel" : y}
                aria-labelledby=${tn[e.kind].length > 1 ? `object-category-${this._selectionPage}` : y}
                class="rows ${this._selectionPage === "properties" ? "essential-properties" : "category-properties"}">${this._renderSelectionEditor()}</div>`}
      </section>
    `;
  }
  /**
   * The aiming handle of a selected spot (issue #388): a handle at the tip of
   * its cone, on the guide, that turns the cone to follow the pointer.
   */
  _renderSpotAim(t) {
    if (!t.glow || !this._isSel("item", t.id) || t.locked) return y;
    const e = Oi(t);
    if (!e) return y;
    const i = e.bearing * Math.PI / 180, n = Math.sin(i), o = -Math.cos(i), r = this._config, s = (l, c, d) => c > 1e-9 ? (d - Io - l) / c : c < -1e-9 ? (Io - l) / c : 1 / 0, a = Math.max(
      Io,
      Math.min(W(t.glowRadius, Ai), s(t.x, n, r.width), s(t.y, o, r.height))
    );
    return $`<circle class="handle spot-aim" r="7"
                       cx=${t.x + n * a} cy=${t.y + o * a}
                       @pointerdown=${(l) => this._startDrag(l, { kind: "item", id: t.id }, void 0, void 0, void 0, void 0, !0)} />`;
  }
  /**
   * An LED strip's run (issue #298), and — while its device is selected — a
   * handle on each end, dragged like a wall's. The device's own icon still
   * selects and moves it; the run follows because it is centred on the icon.
   */
  _renderStripSel(t) {
    const e = t.glow ? Te(t) : void 0;
    if (!e) return y;
    const i = Vs(t, t.entity ? this.hass?.states[t.entity] : void 0), n = this._isSel("item", t.id) && !t.locked;
    return $`
      ${Gl(e, i?.color)}
      ${n ? $`
              <circle cx=${e.x1} cy=${e.y1} r="7" class="handle"
                      @pointerdown=${(o) => this._startDrag(o, { kind: "item", id: t.id }, void 0, void 0, void 0, 1)} />
              <circle cx=${e.x2} cy=${e.y2} r="7" class="handle"
                      @pointerdown=${(o) => this._startDrag(o, { kind: "item", id: t.id }, void 0, void 0, void 0, 2)} />` : y}`;
  }
  _renderWall(t, e) {
    const i = this._isSel("wall", t.id), n = i && !t.locked, o = e?.side, r = e?.edgeIndex ?? -1, s = !!e && !e.area.locked, a = e?.area.sideWalls?.[o], c = Math.abs(t.y1 - t.y2) < St ? "ns" : "ew", d = t.divider ? nc() : ic(t.thickness, t.kind);
    return $`
      <g>
        <line x1=${t.x1} y1=${t.y1} x2=${t.x2} y2=${t.y2}
              class=${["wall-hit", e ? "side-wall-edge" : "", c].filter(Boolean).join(" ")}
              @pointerdown=${(h) => {
      if (e) {
        this._startDrag(h, { kind: "area", id: e.area.id }, void 0, void 0, r);
        return;
      }
      this._startDrag(h, { kind: "wall", id: t.id });
    }}
              @dblclick=${(h) => {
      e && (h.preventDefault(), h.stopPropagation(), this._toggleRectAreaSide(e.area, r));
    }} />
        <g class="fp-wall-neon"><line x1=${t.x1} y1=${t.y1} x2=${t.x2} y2=${t.y2}
            class="wall ${i ? "selected" : ""} ${Xt(t) ? "railing" : ""} ${e ? "side-wall-edge" : ""} ${c}"
              mask=${`url(#${this._wallMaskId})`}
              style=${d} stroke-linecap="round" /></g>
        ${n ? $`
                <circle cx=${t.x1} cy=${t.y1} r="9" class="handle"
                        @pointerdown=${(h) => this._startDrag(h, { kind: "wall", id: t.id }, 1)} />
                <circle cx=${t.x2} cy=${t.y2} r="9" class="handle"
                        @pointerdown=${(h) => this._startDrag(h, { kind: "wall", id: t.id }, 2)} />` : y}
        ${s ? $`
                <path
                  d=${(() => {
      const h = (t.x1 + t.x2) / 2, p = (t.y1 + t.y2) / 2, f = 7;
      return `M ${h} ${p - f} L ${h + f} ${p} L ${h} ${p + f} L ${h - f} ${p} Z`;
    })()}
                  class=${["area-wall-toggle", a ?? "none"].join(" ")}
                  title=${a ? `Double-click to cycle this ${o} wall: ${a}` : `Double-click to add a wall on the ${o} side`}
                  @dblclick=${(h) => {
      h.preventDefault(), h.stopPropagation(), this._toggleRectAreaSide(e.area, r);
    }} />` : y}
      </g>`;
  }
  _renderOpeningSel(t) {
    const e = this._isSel("opening", t.id), i = e ? "var(--primary-color, #03a9f4)" : xr;
    return $`
      <g class="opening-hit"
         @pointerdown=${(n) => this._startDrag(n, { kind: "opening", id: t.id })}>
        ${jr(t, {
      color: i,
      // The closed colour previews here too (issue #228) — unless this is
      // the selected opening, whose whole symbol goes blue to show that.
      inactive: e ? void 0 : t.inactiveColor,
      open: uo(t),
      // Draw sliding / rolling openings partly open in the editor so the
      // motion is visible — closed, both look like a plain band, which
      // would make the Motion / Slide / Style controls appear inert.
      amount: vt(t) !== "swing" ? 0.55 : void 0,
      // Shutter previewed half-rolled so the layer is visible while
      // configuring, whatever the live state.
      shutter: t.shutterEntity ? { amount: 0.55, style: Se(t), flip: t.shutterFlipV } : void 0
    })}
        ${// A skylight is an outline around empty floor, and the strokes are
    // all there is to grab: without this you can only pick it up by its
    // frame or by a dashed diagonal, which on a large roof light means
    // most of the shape you are looking at does not answer the pointer.
    // The card gives every pressable opening the same target for the
    // same reason (openingHitSize); the wall openings do not need one
    // here because a door's own symbol is barely wider than the target
    // would be.
    gt(t) ? (() => {
      const n = Xo(t);
      return $`<rect class="skylight-hit"
                    x=${t.x - n.width / 2} y=${t.y - n.height / 2}
                    width=${n.width} height=${n.height}
                    transform="rotate(${t.angle} ${t.x} ${t.y})" />`;
    })() : y}
        ${// A passage draws nothing on the card — the gap in the wall is the
    // whole symbol (issue #309) — which here would leave nothing to see
    // and nothing to grab. So the editor alone marks it: the gap itself
    // as the target, and a dashed line across it that turns blue with
    // the selection the way a door's own symbol does.
    Ut(t) ? (() => {
      const n = Xo(t), o = t.length / 2;
      return $`<g transform="translate(${t.x} ${t.y}) rotate(${t.angle})">
                    <rect class="passage-hit"
                        x=${-n.width / 2} y=${-n.height / 2}
                        width=${n.width} height=${n.height} />
                    <line class="passage-mark" x1=${-o} y1="0" x2=${o} y2="0"
                        stroke=${i} stroke-width="1.5" stroke-dasharray="4 3" />
                  </g>`;
    })() : y}
      </g>`;
  }
  /**
   * Render a Tracker in the editor SVG with its zone outline visible (so the
   * user can grab/resize it) plus a hit overlay for drag-to-move and a dashed
   * selection rectangle when active.
   */
  _renderTrackerSel(t) {
    const e = this._isSel("tracker", t.id), i = Hn(this.hass?.states, t.xSensor?.entity), n = Hn(this.hass?.states, t.ySensor?.entity), o = An(this.hass?.states, t.xSensor?.presence), r = An(this.hass?.states, t.ySensor?.presence);
    return $`
      <g class="tracker-hit ${e ? "selected" : ""}"
         @pointerdown=${(s) => this._startDrag(s, { kind: "tracker", id: t.id })}>
        ${Uc(t, {
      editing: !0,
      xReading: i,
      yReading: n,
      xPresent: o,
      yPresent: r
    })}
        <rect x=${t.x} y=${t.y} width=${t.w} height=${t.h}
              transform="rotate(${t.angle ?? 0} ${t.x + t.w / 2} ${t.y + t.h / 2})"
              class="tracker-hit-rect" />
        ${e ? $`<rect x=${t.x - 4} y=${t.y - 4}
                        width=${t.w + 8} height=${t.h + 8}
                        transform="rotate(${t.angle ?? 0} ${t.x + t.w / 2} ${t.y + t.h / 2})"
                        class="tracker-outline" />` : y}
      </g>`;
  }
  _renderFurnitureSel(t) {
    const e = this._isSel("furniture", t.id);
    return $`
      <g class="furn-hit ${e ? "selected" : ""}"
         @pointerdown=${(i) => this._startDrag(i, { kind: "furniture", id: t.id })}>
        ${// A center curtain previews as its pair, at full size: no cover
    // state in the editor, so each half is drawn fully across (#196).
    Bc({ ...t, entity: void 0 }, void 0, this._symbols()).map((i) => ki({ ...i, entity: t.entity }, void 0, this._symbols()))}
        ${e ? $`<rect x=${t.x - t.w / 2 - 4} y=${t.y - t.h / 2 - 4}
                        width=${t.w + 8} height=${t.h + 8}
                        transform="rotate(${t.angle ?? 0} ${t.x} ${t.y})"
                        class="furn-outline" />` : y}
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
    const t = this._scopingAreaId();
    if (!t) return y;
    const e = (this._floor().areas ?? []).find((n) => n.id === t), i = e?.name ? e.name : "this area";
    return v`<p class="hint area-scope-hint">
      <ha-icon icon="mdi:vector-polygon"></ha-icon>
      <span>Only entities in <strong>${i}</strong> are listed.</span>
      <button
        class="link-btn"
        title="Turn off Filter entities for this area — every entity becomes selectable"
        @click=${() => this._updateArea(t, { filterEntities: !1 })}
      >
        Show all
      </button>
    </p>`;
  }
  _toggleRectAreaSide(t, e) {
    if (t.locked) return;
    const i = ee[e % ee.length], n = A0(t.sideWalls?.[i]), o = { ...t.sideWalls ?? {} };
    n === "none" ? delete o[i] : o[i] = n, this._updateArea(t.id, { sideWalls: Object.keys(o).length ? o : void 0 });
  }
  _renderAreaSel(t, e, i) {
    const n = this._isSel("area", t.id), o = t.id === e, r = t.points.map((a) => `${a.x},${a.y}`).join(" "), s = (this._floor().areas ?? []).filter((a) => a.id !== t.id).flatMap((a) => M0(t.points, a.points).map((l) => ({ side: l, otherId: a.id }))).filter(({ otherId: a }) => t.id.localeCompare(a) < 0);
    return $`
      <g class="area-hit ${n ? "selected" : ""} ${o ? "scoping" : ""}">
        ${o ? $`<polygon points=${r} class="area-scoping" />` : y}
        ${jc(t, void 0, i)}
        <polygon points=${r} class="area-hit-shape"
                 @pointerdown=${(a) => this._startDrag(a, { kind: "area", id: t.id })} />
        ${n ? $`<polygon points=${r} class="area-outline" />` : y}
        ${s.map(({ side: a }) => {
      const l = ee.indexOf(a), c = t.points[l], d = t.points[(l + 1) % t.points.length], h = { x: (c.x + d.x) / 2, y: (c.y + d.y) / 2 }, p = 8, f = a === "top" || a === "bottom" ? `M ${h.x - p} ${h.y - p} L ${h.x + p} ${h.y + p} M ${h.x - p} ${h.y + p} L ${h.x + p} ${h.y - p}` : `M ${h.x - p} ${h.y + p} L ${h.x + p} ${h.y - p} M ${h.x - p} ${h.y - p} L ${h.x + p} ${h.y + p}`;
      return $`<path d=${f} class="area-shared-wall" />`;
    })}
        ${// Outline yes, vertex and edge handles no, for a pinned room — same
    // reasoning as the wall's endpoints (issue #191): still visibly
    // selected, with nothing on it that pretends to be draggable.
    n && !t.locked ? [
      ...t.points.map(
        (a, l) => $`
                    <circle cx=${a.x} cy=${a.y} r="7" class="handle"
                            @pointerdown=${(c) => this._startDrag(c, { kind: "area", id: t.id }, void 0, l)} />`
      ),
      ...Bt(t.points) ? [
        ...t.points.map((a, l) => {
          const c = t.points[(l + 1) % t.points.length], h = Math.abs(a.y - c.y) < St ? "ns" : "ew";
          return $`
                          <line
                            x1=${a.x} y1=${a.y} x2=${c.x} y2=${c.y}
                            class=${["area-edge-hit", h].join(" ")}
                            @pointerdown=${(p) => {
            this._startDrag(p, { kind: "area", id: t.id }, void 0, void 0, l);
          }}
                            @dblclick=${(p) => {
            p.preventDefault(), p.stopPropagation(), this._toggleRectAreaSide(t, l);
          }} />`;
        }),
        ...t.points.map((a, l) => {
          const c = t.points[(l + 1) % t.points.length], d = { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 }, h = Math.abs(a.y - c.y) < St, p = ee[l], f = t.sideWalls?.[p];
          return $`
                          <circle
                            cx=${d.x}
                            cy=${d.y}
                            r="5"
                            class=${[
            "handle",
            "area-edge-handle",
            h ? "ns" : "ew",
            f ? "side-wall-toggle" : ""
          ].filter(Boolean).join(" ")}
                            title=${f ? `Double-click to cycle this ${p} wall: ${f}` : `Double-click to add a wall on the ${p} side`}
                            @pointerdown=${(u) => this._startDrag(u, { kind: "area", id: t.id }, void 0, void 0, l)}
                            @dblclick=${(u) => {
            u.preventDefault(), u.stopPropagation(), this._toggleRectAreaSide(t, l);
          }} />`;
        })
      ] : []
    ] : y}
      </g>`;
  }
  _renderRoofSel(t) {
    const e = this._isSel("roof", t.id), i = this._tool === "roof", n = t.points.map((a) => `${a.x},${a.y}`).join(" "), o = ut(t.color, "#8d6e63");
    return $`
      <g class="roof-hit ${e ? "selected" : ""}">
        <polygon points=${n} class="roof-shape" fill=${e || i ? o : "none"} fill-opacity=${e || i ? "0.35" : "0"} stroke=${o} stroke-width="1.5" stroke-dasharray="5,3" />
        <polygon points=${n} class="area-hit-shape"
                 @pointerdown=${(a) => this._startDrag(a, { kind: "roof", id: t.id })} />
        ${e ? $`<polygon points=${n} class="area-outline" />` : y}
        ${e && !t.locked ? t.points.map(
      (a, l) => $`
                  <circle cx=${a.x} cy=${a.y} r="7" class="handle"
                          @pointerdown=${(c) => this._startDrag(c, { kind: "roof", id: t.id }, void 0, l)} />`
    ) : y}
      </g>`;
  }
  /**
  * The in-progress Area draft: committed vertices as dots and straight
  * segments between them. Once 3+ points are down the starting vertex is
  * drawn larger/hollow so it's visually obvious that clicking it closes the
  * polygon (see `_onCanvasDown`).
   */
  _renderAreaDraft() {
    const t = this._draftArea;
    if (!t) return y;
    const e = t.points, i = e.map((s) => `${s.x},${s.y}`).join(" "), n = e[e.length - 1], o = e.length >= 3, r = this._areaHover;
    return $`
      <g class="area-draft">
        ${e.length > 1 ? $`<polyline points=${i} class="area-draft-line" />` : y}
        ${r ? $`<line x1=${n.x} y1=${n.y} x2=${r.x} y2=${r.y}
                        class="area-draft-hover" />` : y}
        ${e.map(
      (s, a) => a === 0 && o ? $`<circle cx=${s.x} cy=${s.y} r="9" class="area-draft-start" />` : $`<circle cx=${s.x} cy=${s.y} r="5" class="area-draft-point" />`
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
  _renderShutterMarkOverlay(t, e, i) {
    const n = t.shutterEntity, o = this.hass?.states[n], r = Wt(o, t.shutterInvert) > 0, s = xc(t, o, r, this.hass?.entities?.[n]?.icon), a = J(t.shutterActiveColor ?? t.activeColor) ?? pt, l = Hr(t), c = Nr(t), d = st(Ln, i), h = st(On, i);
    return v`<div
      class="shutter-mark ${pn(o, t.shutterInvert) ? "on" : "off"}"
      style="left:${l.x / e.width * 100}%; top:${l.y / e.height * 100}%;
             width:${d};height:${d};
             transform:translate(-50%,-50%)
                       translate(calc(${c.x} * ${h}), calc(${c.y} * ${h}));
             --fp-active:${a};"
      title=${`${o?.attributes?.friendly_name ?? n} — shown on the card, tap it there to open the shutter`}
    >
      <ha-icon icon=${s} style="--mdc-icon-size:${st(
      Fn,
      i
    )};"></ha-icon>
    </div>`;
  }
  /**
   * The card's opening badge, previewed (issue #154 follow-up). Same reason as
   * the shutter's preview above: turning **Show icon** on and finding out where
   * the badge lands is the whole point of having a canvas. Inert here too.
   */
  _renderOpeningMarkOverlay(t, e, i) {
    const n = t.entity, o = this.hass?.states[n], r = Ge(t, o) > 0, s = _c(t, o, r, this.hass?.entities?.[n]?.icon), a = J(t.activeColor) ?? pt, l = $c(t), c = kc(t), d = st(Ln, i), h = st(On, i);
    return v`<div
      class="shutter-mark ${Ko(t, o) ? "on" : "off"}"
      style="left:${l.x / e.width * 100}%; top:${l.y / e.height * 100}%;
             width:${d};height:${d};
             transform:translate(-50%,-50%)
                       translate(calc(${c.x} * ${h}), calc(${c.y} * ${h}));
             --fp-active:${a};"
      title=${`${o?.attributes?.friendly_name ?? n} — shown on the card, tap it there to open its dialog`}
    >
      <ha-icon icon=${s} style="--mdc-icon-size:${st(
      Fn,
      i
    )};"></ha-icon>
    </div>`;
  }
  _renderItemOverlay(t, e, i) {
    const n = this._isSel("item", t.id), o = t.entity ? this.hass?.states[t.entity] : void 0, r = cn(t, o, t.entity ? this.hass?.entities?.[t.entity]?.icon : void 0), { text: s, live: a } = Og(this.hass, t), l = W(t.size, ne), c = Li(t) !== "none", d = t.display ?? "badge", h = Rr(t, o), p = J(so(t.stateColor, h)), f = tc(t, p), u = Li(t) === "value" ? hc(this.hass, t) : void 0, m = se(t.entity, o?.state), b = m ? J(t.activeColor) ?? Wl(o) : void 0, g = !!this.hass && Yo(t, o?.state), w = m || g ? void 0 : J(t.inactiveColor), A = ul(
      mn(p ?? b ?? w, this._config?.palette)
    ), M = t.rippleColor ?? p ?? b ?? pt, k = t.rippleSize ?? Qn, z = t.rippleDirection ?? Jn, D = t.rippleWidth ?? to, R = sc(t, o?.state, o?.attributes), E = st(l, i), C = v`<div
      class="badge ${c ? "" : "ghost"} ${p ? "state-colored" : m ? "active-colored" : w ? "inactive-colored" : ""}"
      style="width:${E};height:${E};transform:rotate(${W(t.angle, 0)}deg);${p ? `--fp-state:${p};` : ""}${b ? `--fp-active:${b};` : ""}${w ? `--fp-inactive:${w};` : ""}${A ? `--fp-ink:${A};` : ""}"
    >
      ${u ? v`<span
            class="badge-value"
            style="font-size:${st(fc(l, u), i)};"
            >${u}</span
          >` : v`<ha-icon
            class=${R ? `anim-${R}` : ""}
            icon=${r}
            style="--mdc-icon-size:${st(cc(l), i)};"
          ></ha-icon>`}
    </div>`;
    let I;
    d === "ripple" ? I = Nn(!0, M, k, z, D, 3, i) : d === "iconRipple" ? I = v`<div class="stack">
        ${Nn(!0, M, k, z, D, 3, i)}
        <div class="stack-icon">${C}</div>
      </div>` : I = C;
    const S = Xl(t, o?.state, this.hass), _ = Lr(t), P = _ === "auto" ? dd(t) : void 0, L = P === void 0 ? _ : this._autoSides.get(P) ?? "below";
    return P !== void 0 && !this._hideLabels && this._autoLabelSig.push(`${P}:${s.length}`), v`
      <div
        class="edit-item ${n ? "selected" : ""} ${S ? "card-hidden" : ""}"
        data-label-auto=${P ?? y}
        style="left:${t.x / e.width * 100}%; top:${t.y / e.height * 100}%;"
        @pointerdown=${(N) => this._onOverlayDown(N, { kind: "item", id: t.id })}
        @pointermove=${this._onOverlayMove}
        @pointerup=${this._onOverlayUp}
        @pointercancel=${this._onPointerCancel}
      >
        ${I}
        <!-- The card's own label line when there is one (issue #135), so
             turning Show state on is visible here rather than only after
             leaving the editor; otherwise the dim identification fallback.
             The Labels toolbar toggle hides either on dense plans (issue
             #52), and the size previews the card's labelSize (issue #59). -->
        ${this._hideLabels ? y : v`<span
            class="ilabel ${a ? "live" : ""} ilabel-${L}"
            style="font-size:${st(
      a || t.labelSize != null ? Jl(t.labelSize) : 11,
      i
    )};${a && f ? `color:${f};` : ""}"
            >${s}</span
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
  _renderSwitcherHandle(t) {
    const e = W(t.width, Ct), i = W(t.height, Ot), n = gi(t) ?? en(e, i), o = !!gi(t), r = t.floors ?? [];
    return v`
      <div
        class="switcher-handle floor-switcher ${nl(t)} ${this._switcherDrag ? "dragging" : ""} ${o ? "" : "default"} ${this._tool === "select" ? "" : "passive"}"
        style="left:${n.x / e * 100}%; top:${n.y / i * 100}%;"
        title=${o ? "Drag to move the floor switcher" : "Drag to move the floor switcher off the corner"}
        @pointerdown=${this._onSwitcherDown}
        @lostpointercapture=${this._onSwitcherCancel}
      >
        ${r.map(
      (s) => v`<span class="sh-btn floor-button ${s.id === this._activeFloorId ? "active" : ""}"
            style=${J(s.color) ? `--fp-floor-accent:${J(s.color)};` : y}
            >${s.short || s.name}</span
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
  _forgetSwitcherTouch(t) {
    this._onWrapPointerEnd(t);
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
    const t = this._switcherDrag;
    t && (this._switcherMoves.cancel(), this._switcherDrag = void 0, this._gesturePointer = null, t.moved && (t.priorHistory && (this._history = t.priorHistory), this._config = t.before, this._watchedEntities = He(t.before), this._future = t.priorFuture));
  }
  _renderTextOverlay(t, e, i) {
    const n = this._isSel("text", t.id);
    return v`
      <div
        class="edit-text ${n ? "selected" : ""}"
        style="left:${t.x / e.width * 100}%; top:${t.y / e.height * 100}%;
               font-size:${st(W(t.size, vi), i)};
               color:${ut(t.color, fl)};
               transform:translate(-50%,-50%) rotate(${W(t.angle, 0)}deg);"
        @pointerdown=${(o) => this._onOverlayDown(o, { kind: "text", id: t.id })}
        @pointermove=${this._onOverlayMove}
        @pointerup=${this._onOverlayUp}
        @pointercancel=${this._onPointerCancel}
      >
        ${Cr(this.hass, t) || "…"}
      </div>
    `;
  }
  _renderPanel() {
    return v`
      <section class="panel">
        ${this._renderPagePicker(Oa, !0)}
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
    const t = this._config, e = (n) => this._patchConfig(n), i = vx(t);
    return v`
      <div class="rows panel-body">
        ${this._renderGroup(
      "Project",
      this._renderForm(fx(t), (n, o) => {
        "grid" in n && typeof n.grid == "number" && (n = { ...n, ...this._gridPatch(n.grid) }), o ? this._patchConfigLive(n) : this._patchConfig(n);
      })
    )}
        ${this._renderGroup(
      // The plan's own look: its palette, its paper, and the one drawing
      // convention that is a plan-wide choice rather than an element's.
      "Look",
      this._renderForm(gx(t), e),
      this._renderColorRow({
        label: "Background",
        value: t.background,
        swatch: "#ffffff",
        placeholder: "#ffffff or empty",
        onLive: (n) => this._patchConfigLive({ background: n }),
        onCommit: (n) => this._patchConfig({ background: n })
      }),
      this._renderForm(bx(t), e),
      this._renderForm(xx(t), e)
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
      this._renderForm($x(this._floor()), (n, o) => {
        o ? this._patchFloorLive(n) : this._commitFloor(n);
      })
    )}
        ${this._renderGroup(
      // Beside the floor image because it looks like one, but it is the
      // opposite: tracing paper for the editor, never saved.
      "Trace template",
      this._renderTracePanel()
    )}
        ${this._renderGroup(
      // How the card is framed on the dashboard, as opposed to what is
      // drawn inside it. Set once for a surface and rarely touched again.
      "Display",
      this._renderForm(
        Ht(i, [
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
        e
      )
    )}
        ${this._renderGroup(
      // Light through the openings (issue #177) — where it comes from and
      // what it looks like where it lands.
      "Sunlight",
      this._renderForm(_x(t), e),
      t.sunlight ? v`${this._renderColorRow({
        label: "Sun color",
        title: "Color of the light the openings let in",
        value: t.sunlightColor,
        swatch: "#ffd9a0",
        placeholder: "(warm white)",
        onLive: (n) => this._patchConfigLive({ sunlightColor: n }),
        onCommit: (n) => this._patchConfig({ sunlightColor: n })
      })}
              ${t.sunShade === !1 ? y : this._renderColorRow({
        label: "Shade color",
        title: "Color of everywhere the light does not reach",
        value: t.sunShadeColor,
        swatch: "#000000",
        placeholder: "(black)",
        onLive: (n) => this._patchConfigLive({ sunShadeColor: n }),
        onCommit: (n) => this._patchConfig({ sunShadeColor: n })
      })}` : y
    )}
        ${this._renderGroup(
      // The other half of following the sun, and a separate switch: this
      // one dims the whole plan after dark rather than casting anything.
      "Night dimming",
      this._renderForm(wx(t), e)
    )}
        ${this._renderGroup(
      // How devices look and answer, plan-wide. "Offline devices" lived
      // under display, beside the card's rotation, which is not what it is
      // about.
      "Devices",
      this._renderForm(yx(t), e),
      this._renderForm(Ht(i, ["offlineStyle"]), e),
      this._renderForm(mx(t), e)
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
    const t = this._config.palette ?? [], e = (n) => this._patchConfig({ palette: n.length ? n : void 0 }), i = (n, o, r = !1) => {
      const s = t.map((a, l) => l === n ? { ...a, ...o } : a);
      r ? this._patchConfigLive({ palette: s }) : this._patchConfig({ palette: s });
    };
    return v`
      <div class="row col palette-panel">
        ${t.length ? y : v`<span class="hint"
              >Name a color here and every color field on the plan can point at it.</span
            >`}
        ${t.map(
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
        ${this._paletteError ? v`<div class="symbol-error">${this._paletteError}</div>` : y}
        ${t.length >= qc ? y : v`<div class="row wide state-color-add">
              <button
                @click=${() => {
      this._paletteError = "", e([...t, { name: this._nextPaletteName(t), color: "#ff8800" }]);
    }}
              >
                <ha-icon icon="mdi:plus"></ha-icon>Add color
              </button>
            </div>`}
      </div>
    `;
  }
  /** "Color 1", "Color 2", … — the first number no entry is already using. */
  _nextPaletteName(t) {
    const e = new Set(t.map((i) => $t(i.name)));
    for (let i = 1; ; i++) {
      const n = `Color ${i}`;
      if (!e.has($t(n))) return n;
    }
  }
  /**
   * Takes the input rather than its value so a refused rename can put the old
   * name back. Lit will not do it: the config is unchanged, so the binding sees
   * the same value it last wrote and skips the DOM, leaving the box showing a
   * name the plan does not have.
   */
  _renamePaletteColor(t, e) {
    const i = this._config.palette ?? [], n = i[t];
    if (!n) return;
    const o = e.value.trim(), r = $t(n.name), s = $t(o);
    if (r === s) {
      if (this._paletteError = "", o === (n.name ?? "")) {
        e.value = o;
        return;
      }
      this._patchConfig({ palette: i.map((c, d) => d === t ? { ...c, name: o } : c) });
      return;
    }
    if (s && i.some((c, d) => d !== t && $t(c.name) === s)) {
      this._paletteError = `Another color is already called “${o}”.`, e.value = n.name ?? "";
      return;
    }
    this._paletteError = "";
    const a = i.map((c, d) => d === t ? { ...c, name: o } : c), l = { ...this._config, palette: a };
    this._patchConfig(
      // Same shadowing caveat as delete: if another entry still declares the old
      // slug, its references are none of this rename's business.
      this._slugStillResolves(r, l) ? l : (
        // An empty new name leaves the entry unusable, so its references have
        // nothing to point at — freeze them at the colour, as a delete does.
        ba(l, r, s ? ga(o) : n.color)
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
  _recolorPaletteColor(t, e) {
    const i = this._config.palette ?? [], n = i[t];
    if (!n) return;
    const o = e.value.trim();
    if (!J(o)) {
      this._paletteError = o ? `“${o}” is not a color the card can use.` : "A named color needs a color. Use the remove button to take the name away.", e.value = n.color ?? "";
      return;
    }
    this._paletteError = "", this._patchConfig({ palette: i.map((r, s) => s === t ? { ...r, color: o } : r) });
  }
  _removePaletteColor(t) {
    const e = this._config.palette ?? [], i = e[t];
    if (!i) return;
    this._paletteError = "";
    const n = e.filter((r, s) => s !== t), o = { ...this._config, palette: n.length ? n : void 0 };
    this._patchConfig(
      this._slugStillResolves($t(i.name), o) ? o : ba(o, $t(i.name), i.color)
    );
  }
  /** Whether a slug is still declared by the palette in `config`. */
  _slugStillResolves(t, e) {
    return t ? Di(e.palette).some((i) => $t(i.name) === t) : !1;
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
    const t = gi(this._config), e = this._config.floors ?? [], i = W(this._config.width, Ct), n = W(this._config.height, Ot);
    return v`
      <!-- Appearance only matters once there is a switcher to see; a
           one-floor plan would store a choice with no visible result. -->
      ${e.length > 1 || e.some((o) => he(o, this._config.floorSummary)) ? v`
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
          </div>` : y}
      <div class="row col">
        <label>Position</label>
        ${e.length > 1 || e.some((o) => he(o, this._config.floorSummary)) ? v`<span class="hint"
                >${t ? "Drag it on the canvas, or type the point here." : "In the plan's top-right corner. Drag it on the canvas, or type a point here."}</span
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
                  .value=${t ? String(t.x) : ""}
                  placeholder=${Math.round(en(i, n).x)}
                  @change=${(o) => this._setSwitcherCoord("x", o.target.value)}
                />
                <label aria-hidden="true">Y</label>
                <input
                  type="number"
                  step="any"
                  aria-label="Floor switcher Y, in canvas units"
                  .value=${t ? String(t.y) : ""}
                  placeholder=${Math.round(en(i, n).y)}
                  @change=${(o) => this._setSwitcherCoord("y", o.target.value)}
                />
              </div>
              ${t ? v`<div class="row wide">
                    <button @click=${() => this._patchSwitcher({ x: void 0, y: void 0 })}>
                      Back to the corner
                    </button>
                  </div>` : y}` : v`<span class="hint"
              >A plan with one floor draws no switcher unless floor summary is enabled. Add a second floor or enable floor summary and it appears
              here.</span
            >`}
      </div>
    `;
  }
  /** Update appearance or placement without dropping the other settings. */
  _patchSwitcher(t) {
    const e = this._config.floorSwitcher, n = { ...e && typeof e == "object" && !Array.isArray(e) ? e : {}, ...t };
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
  _setSwitcherCoord(t, e) {
    const i = Number(e);
    if (e.trim() === "" || !Number.isFinite(i)) {
      this._patchSwitcher({ x: void 0, y: void 0 });
      return;
    }
    const n = W(this._config.width, Ct), o = W(this._config.height, Ot), r = gi(this._config) ?? en(n, o);
    this._patchSwitcher({ ...r, [t]: i });
  }
  _renderSymbolsPanel() {
    const t = Object.keys(this._config.symbols ?? {});
    return v`
      <div class="row col symbols-panel">
        ${t.length ? v`<div class="symbol-list">
              ${t.map(
      (e) => v`
                  <span class="symbol-chip">
                    ${e}
                    <button
                      class="chip-x"
                      title=${`Remove ${e}`}
                      @click=${() => this._removeSymbol(e)}
                    >
                      ✕
                    </button>
                  </span>
                `
    )}
            </div>` : y}
        <textarea
          class="symbol-input"
          rows="4"
          spellcheck="false"
          placeholder=${'{ "id": "my-desk", "size": { "w": 120, "h": 60 }, "parts": [ … ] }'}
          .value=${this._symbolDraft}
          @input=${(e) => {
      this._symbolDraft = e.target.value, this._symbolError = "";
    }}
        ></textarea>
        ${this._symbolError ? v`<div class="symbol-error">${this._symbolError}</div>` : y}
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
  _removeSymbol(t) {
    const e = { ...this._config.symbols ?? {} };
    delete e[t], this._patchConfig({ symbols: Object.keys(e).length ? e : void 0 });
  }
  /**
   * Fields for the selected object and settings category. Returns nothing
   * when the selection isn't exactly one element — multi-select and
   * empty-select states are handled by the Element header itself.
   */
  _renderSelectionEditor() {
    const t = this._primary();
    if (!t || this._selection.length !== 1) return v`${y}`;
    if (t.kind === "opening") {
      const e = this._floor().openings.find((s) => s.id === t.id);
      if (!e) return v`${y}`;
      const i = tx(e, (s) => this._supportedFeatures(s)), n = (s, a) => {
        if ("entity" in s) {
          const l = s.entity, c = l ? this.hass?.states[l]?.attributes?.device_class : void 0;
          s = { ...s, ...cb(e, c) };
        }
        this._applyElementPatch("opening", e.id, s, a);
      }, o = this._roofsOverPoint(e.x, e.y);
      if (this._selectionPage === "properties") return v`
        ${this._renderEssentialForm(i, ["length", "width", "angle", "ceilingHeight"], n)}
        ${this._renderEssentialForm(i, j.OPENING_GROUPS[0][1].filter((s) => !["length", "width", "angle", "ceilingHeight"].includes(s)), n)}
        ${this._renderRoofChips(o)}
      `;
      const r = (s, a, ...l) => {
        const c = Ht(i, a);
        return !c.fields.length && !l.some((d) => d && d !== y) ? y : this._renderGroup(s, this._renderForm(c, n), ...l);
      };
      return v`
        ${this._selectionPage === "actions" && !i.fields.some((s) => "ui_action" in s.selector) ? v`<div class="unbound-actions">
              <p class="hint">Connect a sensor or cover to give this opening tap, hold and double-tap actions.</p>
              <button @click=${() => this._choosePage("sensors")}>Choose a sensor</button>
            </div>` : y}
        ${j.OPENING_GROUPS.filter(([s]) => s !== "Shape").map(
        ([s, a]) => s === "Color" ? r(
          s,
          a,
          // Both colours paint the leaf, and a passage has none.
          e.entity && !Ut(e) ? v`${this._renderColorRow({
            label: "Open color",
            title: "Leaf, sash and swing arc while this opening is open",
            value: e.activeColor,
            swatch: "#03a9f4",
            placeholder: "(primary)",
            onLive: (l) => this._updateOpeningLive(e.id, { activeColor: l }),
            onCommit: (l) => this._updateOpening(e.id, { activeColor: l })
          })}
                    ${this._renderColorRow({
            label: "Closed color",
            title: "Leaf, sash and swing arc while it is closed — the jambs stay the wall's color",
            value: e.inactiveColor,
            swatch: "#c62828",
            placeholder: "(wall)",
            onLive: (l) => this._updateOpeningLive(e.id, { inactiveColor: l }),
            onCommit: (l) => this._updateOpening(e.id, { inactiveColor: l })
          })}` : y
        ) : s === "Shutter" ? r(
          s,
          a,
          // The shutter's own accent, so an open shutter over a shut
          // window can read as a separate thing from the sash it
          // covers. Falls back to the opening's, hence the placeholder.
          e.shutterEntity ? this._renderColorRow({
            label: "Shutter color",
            title: "Shutter color while it is open",
            value: e.shutterActiveColor,
            swatch: e.activeColor ?? "#03a9f4",
            placeholder: e.activeColor ? "(active color)" : "(primary)",
            onLive: (l) => this._updateOpeningLive(e.id, { shutterActiveColor: l }),
            onCommit: (l) => this._updateOpening(e.id, { shutterActiveColor: l })
          }) : y
        ) : r(s, a)
      )}
      `;
    }
    if (t.kind === "item") {
      const e = this._floor().items.find((d) => d.id === t.id);
      if (!e) return v`${y}`;
      const i = this._areaEntitiesAt(e.x, e.y), n = e.entity ? this.hass?.states[e.entity]?.attributes?.device_class : void 0, o = (d) => (d ? this.hass?.states[d]?.attributes?.friendly_name : void 0) ?? d, r = {
        source: uc(this.hass, e)?.source ?? "primary",
        primaryLabel: o(e.entity),
        // One label per reading, positionally — the dropdown names each rather
        // than numbering them, and a reading with no entity of its own is read
        // off this device, so that is the name to show for it (issue #180).
        readingLabels: ye(e).map((d) => o(d.entity || e.entity))
      }, s = (d, h) => {
        "entity" in d && typeof d.entity == "string" && (d = { ...d, kind: Qs(d.entity) }), this._applyElementPatch("item", e.id, d, h);
      }, a = this._roofsOverPoint(e.x, e.y);
      if (this._selectionPage === "properties") return v`
        ${this._renderEssentialForm(ja(e, i), ["entity"], s)}
        ${this._renderEssentialForm(ex(e), ["name", "showName"], s)}
        ${this._renderEssentialForm(ix(e), ["showState"], s)}
        ${this._renderEssentialForm(Wa(e), ["size", "angle"], s)}
        ${this._renderItemIconRow(e)}
        ${this._renderRoofChips(a)}
      `;
      const l = e.entity ? this.hass?.states[e.entity] : void 0, c = ox(e, n, l);
      return v`
        ${this._renderGroup(
        "What it reads",
        // Entity, its attribute, whether its own state shows, then every
        // other entity — the order the label prints them in (issue #180).
        this._renderForm(Ht(ja(e, i), ["attribute"]), s),
        this._renderItemReadings(e)
      )}
        ${Pg(e) ? this._renderGroup(
        "Label",
        this._renderForm(nx(e), s),
        e.disableLabelColor && e.useCustomLabelColor ? this._renderColorRow({
          label: "Custom color",
          value: e.labelCustomColor,
          swatch: "#ffffff",
          placeholder: "e.g. #ff0000 or red",
          onLive: (d) => this._updateItemLive(e.id, { labelCustomColor: d }),
          onCommit: (d) => this._updateItem(e.id, { labelCustomColor: d })
        }) : y
      ) : y}
        ${this._renderGroup(
        "Badge",
        this._renderForm(Ht(Wa(e, r), ["badgeMode", "badgeEntity"]), s)
      )}
        ${this._renderGroup(
        "Color",
        e.stateColor?.length ? (
          // Colour by state supersedes the fixed active colour, so showing
          // both invites setting one and seeing the other. Say which one is
          // in charge instead of leaving a dead control on screen.
          v`<p class="hint rule-note">
                Colored by the state rules below — they replace the active and inactive colors.
              </p>`
        ) : v`${this._renderColorRow({
          label: "Active color",
          title: "Badge color while this device is on (issue #79)",
          value: e.activeColor,
          swatch: "#fdd835",
          placeholder: "(theme)",
          onLive: (d) => this._updateItemLive(e.id, { activeColor: d }),
          onCommit: (d) => this._updateItem(e.id, { activeColor: d })
        })}
              ${this._renderColorRow({
          label: "Inactive color",
          title: "Badge color while this device is off — closed, locked or docked, whichever this entity says (issue #228)",
          value: e.inactiveColor,
          swatch: "#c62828",
          placeholder: "(theme)",
          onLive: (d) => this._updateItemLive(e.id, { inactiveColor: d }),
          onCommit: (d) => this._updateItem(e.id, { inactiveColor: d })
        })}`,
        this._renderStateColorRules(
          e.stateColor,
          (d) => this._updateItem(e.id, { stateColor: d }),
          // Only a device draws a glyph, so only a device's rules offer an
          // icon — furniture and areas share this rule shape but paint
          // polygons (issue #106).
          { icons: !0, iconPlaceholder: this._itemDefaultIcon(e) }
        )
      )}
        ${c ? this._renderGroup(
        "Effects",
        this._renderForm(c, s),
        // The ring's colour belongs with the ring, not with the badge's.
        ac(e.entity, n) && Kr(e) ? this._renderColorRow({
          label: "Ripple color",
          value: e.rippleColor,
          swatch: e.activeColor ?? "#03a9f4",
          placeholder: e.activeColor ? "(active color)" : "(primary)",
          onLive: (d) => this._updateItemLive(e.id, { rippleColor: d }),
          onCommit: (d) => this._updateItem(e.id, { rippleColor: d })
        }) : y
      ) : y}
        ${this._renderGroup("Behavior", this._renderForm(sx(e), s))}
        ${this._renderGroup("Visibility", this._renderForm(rx(e), s))}
      `;
    }
    if (t.kind === "text") {
      const e = this._floor().texts.find((i) => i.id === t.id);
      return e ? v`
        ${this._renderEssentialForm(
        ax(e, this._areaEntitiesAt(e.x, e.y)),
        ["text", "entity", "attribute", "size", "angle"],
        (i, n) => this._applyElementPatch("text", e.id, i, n)
      )}
        ${this._renderColorRow({
        label: "Color",
        value: e.color,
        swatch: "#000000",
        placeholder: "(theme default)",
        onLive: (i) => this._updateTextLive(e.id, { color: i }),
        onCommit: (i) => this._updateText(e.id, { color: i })
      })}
      ` : v`${y}`;
    }
    if (t.kind === "furniture") {
      const e = this._floor().furniture.find((r) => r.id === t.id);
      if (!e) return v`${y}`;
      const i = lx(e, this._areaEntitiesAt(e.x, e.y), this._symbols(), yt(this._config)), n = (r, s) => this._applyElementPatch("furniture", e.id, r, s), o = this._roofsOverPoint(e.x, e.y);
      return this._selectionPage === "properties" ? v`
        ${this._renderEssentialForm(i, ["w", "h", "angle", ...e.type === "stairs" ? ["goToFloor"] : [], "hand"], n)}
        ${this._renderColorRow({
        label: "Color",
        value: e.color,
        swatch: "#9e9e9e",
        placeholder: "Default",
        onLive: (r) => this._updateFurnitureLive(e.id, { color: r }),
        onCommit: (r) => this._updateFurniture(e.id, { color: r })
      })}
        <div class="secondary-property">${this._renderEssentialForm(i, ["type"], n)}</div>
        ${this._renderRoofChips(o)}
      ` : v`
        ${j.FURNITURE_GROUPS.filter(([r]) => r !== "Shape").map(
        ([r, s]) => this._renderGroup(r, this._renderForm(Ht(i, s.filter((a) => a !== "goToFloor" || e.type !== "stairs")), n))
      )}
        ${e.entity ? this._renderGroup(
        "Color",
        v`
            ${this._renderColorRow({
          label: "Active color",
          title: "Color while the entity is on",
          value: e.activeColor,
          swatch: "#03a9f4",
          placeholder: "(no change)",
          onLive: (r) => this._updateFurnitureLive(e.id, { activeColor: r }),
          onCommit: (r) => this._updateFurniture(e.id, { activeColor: r })
        })}
            ${this._renderStateColorRules(
          e.stateColor,
          (r) => this._updateFurniture(e.id, { stateColor: r })
        )}
          `
      ) : y}
      `;
    }
    if (t.kind === "area") {
      const e = (this._floor().areas ?? []).find((a) => a.id === t.id);
      if (!e) return v`${y}`;
      const i = hl(this.hass), n = e.haArea ? this._pendingAreaEntities(e) : [], o = hx(e), r = (a, l) => this._applyElementPatch("area", e.id, a, l), s = this._roofsOverArea(e);
      return this._selectionPage === "properties" ? v`
        ${this._renderEssentialForm(dx(e, i.map((a) => a.name)), ["name"], (a, l) => this._applyElementPatch("area", e.id, Qd(a, i), l))}
        ${this._renderAreaLinkRow(e, i)}
        ${this._renderEssentialForm(o, ["zoneKind", "showName", "labelSize", "opacity"], r)}
        ${this._renderColorRow({
        label: "Fill color",
        value: e.color,
        swatch: "#03a9f4",
        placeholder: "Default",
        onLive: (a) => this._updateAreaLive(e.id, { color: a }),
        onCommit: (a) => this._updateArea(e.id, { color: a })
      })}
        ${this._renderRoofChips(s, "Roofs above this room:")}
        <div class="row wide">
          <button class="secondary" @click=${() => this._createRoofFromArea(e)}>
            <ha-icon icon="mdi:home-outline"></ha-icon> Create Roof from Room
          </button>
        </div>
      ` : v`
        ${this._renderGroup(
        "What it reads",
        this._renderForm(Ht(o, ["entity"]), r)
      )}
        ${e.entity ? this._renderGroup(
        "Color",
        this._renderForm(Ht(o, ["highlight", "activeOpacity"]), r),
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
          value: e.activeColor,
          swatch: "#03a9f4",
          placeholder: "(no change)",
          onLive: (a) => this._updateAreaLive(e.id, { activeColor: a }),
          onCommit: (a) => this._updateArea(e.id, { activeColor: a })
        })}
            ${this._renderStateColorRules(
          e.stateColor,
          (a) => this._updateArea(e.id, { stateColor: a })
        )}
          `
      ) : y}
        ${this._renderGroup(
        // What tapping the room does (issue #181). Last, as it is on every
        // other element: the thing it *does*, after everything it *is*.
        "Behavior",
        this._renderForm(
          Ht(o, [
            "fitZoom",
            "zoom",
            "tap_action",
            "hold_action",
            "double_tap_action"
          ]),
          r
        )
      )}
        ${e.haArea ? this._renderGroup(
        // Everything that only exists because this room is linked to a
        // Home Assistant area.
        "Home Assistant area",
        v`<div class="row wide">
                <label>Filter entities</label>
                <input
                  type="checkbox"
                  .checked=${e.filterEntities ?? !0}
                  @change=${(a) => this._updateArea(e.id, {
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
                  @click=${() => this._addAreaEntities(e)}
                >
                  <ha-icon icon="mdi:shape-square-plus"></ha-icon>
                  Add all devices in this HA area${n.length ? ` (${n.length})` : ""}
                </button>
              </div>`
      ) : y}
        <p class="hint">
          Drag inside the fill to move the whole room; drag a vertex handle to reshape it.
        </p>
      `;
    }
    if (t.kind === "roof") {
      const e = (this._floor().roofs ?? []).find((d) => d.id === t.id);
      if (!e) return v`${y}`;
      const i = this._config?.wallHeight ?? 60, n = px(e, i), o = (d, h) => this._applyElementPatch("roof", e.id, d, h), { areas: r, items: s, furniture: a, trackers: l } = this._elementsUnderRoof(e), c = r.length > 0 || s.length > 0 || a.length > 0 || l.length > 0;
      return v`
        <p class="hint" style="margin-top: 0;">
          Roofs are configured in the editor; 3D geometry is not shown on the card yet.
        </p>
        ${this._renderForm(n, o)}
        ${this._renderColorRow({
        label: "Roof color",
        value: e.color,
        swatch: "#8d6e63",
        placeholder: "Default (#8d6e63)",
        onLive: (d) => this._updateRoofLive(e.id, { color: d }),
        onCommit: (d) => this._updateRoof(e.id, { color: d })
      })}
        ${c ? v`
              <div class="related-elements">
                <div class="related-label">Elements under roof:</div>
                ${r.length ? v`
                      <div class="related-chips">
                        ${r.map(
        (d) => v`
                            <button
                              class="chip-btn"
                              title="Select this area"
                              @click=${() => {
          this._selection = [{ kind: "area", id: d.id }], this._liveEditKey = null;
        }}
                            >
                              <ha-icon icon="mdi:floor-plan"></ha-icon>
                              ${d.name || "Area"}
                            </button>
                          `
      )}
                      </div>
                    ` : y}
                ${s.length ? v`
                      <div class="related-chips">
                        ${s.map(
        (d) => v`
                            <button
                              class="chip-btn"
                              title="Select this device"
                              @click=${() => {
          this._selection = [{ kind: "item", id: d.id }], this._liveEditKey = null;
        }}
                            >
                              <ha-icon icon="mdi:lightbulb-outline"></ha-icon>
                              ${d.name || d.entity || "Item"}
                            </button>
                          `
      )}
                      </div>
                    ` : y}
                ${a.length ? v`
                      <div class="related-chips">
                        ${a.map(
        (d) => v`
                            <button
                              class="chip-btn"
                              title="Select this furniture"
                              @click=${() => {
          this._selection = [{ kind: "furniture", id: d.id }], this._liveEditKey = null;
        }}
                            >
                              <ha-icon icon="mdi:sofa-outline"></ha-icon>
                              ${d.type || "Furniture"}
                            </button>
                          `
      )}
                      </div>
                    ` : y}
                ${l.length ? v`
                      <div class="related-chips">
                        ${l.map(
        (d) => v`
                            <button
                              class="chip-btn"
                              title="Select this tracker"
                              @click=${() => {
          this._selection = [{ kind: "tracker", id: d.id }], this._liveEditKey = null;
        }}
                            >
                              <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
                              ${`Tracker (${Math.round(d.w)}×${Math.round(d.h)})`}
                            </button>
                          `
      )}
                      </div>
                    ` : y}
              </div>
            ` : y}
        <p class="hint">
          Drag inside the roof footprint to move it; drag a vertex handle to reshape it.
        </p>
      `;
    }
    if (t.kind === "tracker") {
      const e = (this._floor().trackers ?? []).find((o) => o.id === t.id);
      if (!e) return v`${y}`;
      const i = cx(e), n = (o, r) => this._applyElementPatch("tracker", e.id, o, r);
      return this._selectionPage === "properties" ? v`
        ${this._renderEssentialForm(i, j.TRACKER_GROUPS[0][1], n)}
      ` : v`
        ${this._renderGroup(
        // The two distance sensors that place the marker inside the zone —
        // the thing a tracker actually is, so it gets its own group rather
        // than two unlabelled blocks above the box.
        "Sensors",
        this._renderTrackerSensorRows(e, "xSensor", "X sensor"),
        this._renderTrackerSensorRows(e, "ySensor", "Y sensor")
      )}
        ${this._renderGroup(
        "Marker",
        this._renderForm(Ht(i, j.TRACKER_GROUPS[1][1]), n),
        this._renderColorRow({
          label: "Color",
          value: e.color,
          swatch: "#03a9f4",
          placeholder: "(primary)",
          onLive: (o) => this._updateTrackerLive(e.id, { color: o }),
          onCommit: (o) => this._updateTracker(e.id, { color: o })
        })
      )}
      `;
    }
    if (t.kind === "wall") {
      const e = this._floor().walls.find((n) => n.id === t.id);
      if (!e) return v`${y}`;
      const i = Math.round(Math.hypot(e.x2 - e.x1, e.y2 - e.y1));
      return v`
        ${this._renderEssentialForm(ux(e), ["x1", "y1", "x2", "y2", "thickness", "height", "kind"], (n, o) => {
        this._applyElementPatch("wall", e.id, n, o);
        const r = n.thickness;
        !o && typeof r == "number" && this._setDefaultWallThickness(r);
      })}
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
        const s = e.x2 - e.x1, a = e.y2 - e.y1, l = Math.hypot(s, a), c = l > 0 ? s / l : 1, d = l > 0 ? a / l : 0;
        this._updateWall(e.id, {
          x2: Math.round(e.x1 + c * r),
          y2: Math.round(e.y1 + d * r)
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
    return v`${y}`;
  }
  /**
   * Editor rows for one of a tracker's two sensor mappings (X or Y). Entity
   * picker is always shown; min / max / invert appear once a sensor entity is
   * set so the panel stays compact while empty.
   */
  _renderTrackerSensorRows(t, e, i) {
    const n = t[e];
    return v`
      <div class="row wide">
        <label>${i}</label>
        ${this._renderEntityPicker(
      n?.entity ?? "",
      (o) => {
        o ? this._updateTrackerSensor(t.id, e, { entity: o }) : this._updateTrackerSensor(t.id, e, null);
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
      const r = o.target, s = Number(r.value);
      r.value !== "" && Number.isFinite(s) ? this._updateTrackerSensor(t.id, e, { min: s }) : r.value = String(n.min);
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
      r.value !== "" && Number.isFinite(s) ? this._updateTrackerSensor(t.id, e, { max: s }) : r.value = String(n.max);
    }}
            />
            <label class="inline-check">
              <input
                type="checkbox"
                .checked=${n.invert ?? !1}
                @change=${(o) => this._updateTrackerSensor(t.id, e, {
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
      (o) => this._updateTrackerSensor(t.id, e, {
        presence: o ? { entity: o, invert: n.presence?.invert } : void 0
      }),
      ["binary_sensor", "input_boolean", "device_tracker"]
    )}
            ${n.presence ? v`<label class="inline-check" title="Treat 'off' as detected">
                  <input
                    type="checkbox"
                    .checked=${n.presence.invert ?? !1}
                    @change=${(o) => this._updateTrackerSensor(t.id, e, {
      presence: {
        entity: n.presence.entity,
        invert: o.target.checked || void 0
      }
    })}
                  />
                  invert
                </label>` : y}
          </div>` : y}
    `;
  }
};
j._nextWallMaskId = 0;
j.OPENING_GROUPS = [
  // What it is, and how it is drawn.
  // `width` and `ceilingHeight` are the skylight's two; `openingForm` only
  // offers them for one, so they cost every other opening nothing but a
  // name in this list. `sill` is the same for a window.
  ["Shape", [
    "type",
    "motion",
    "length",
    "width",
    "ceilingHeight",
    "sill",
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
j.FURNITURE_GROUPS = [
  ["Shape", ["type", "hand", "w", "h", "angle"]],
  ["What it reads", ["entity"]],
  // What clicking it does — a staircase that changes floor (issue #121).
  ["Behavior", ["goToFloor", "tap_action", "hold_action", "double_tap_action", "showIcon"]]
];
j.TRACKER_GROUPS = [
  ["Zone", ["w", "h", "x", "y", "angle"]],
  ["Marker", ["dotSize"]]
];
j.styles = [
  ml,
  re`
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
    /* Trace template (editor only). The sheet takes the pointer while the
       template is being moved or calibrated; the marks keep a screen-pixel
       stroke so they stay aimable at any zoom. */
    .ref-floor line {
      stroke: var(--primary-color, #03a9f4);
      stroke-linecap: round;
    }
    .ref-floor line.divider {
      stroke-dasharray: 8 6;
    }
    .trace-sheet {
      fill: transparent;
      pointer-events: all;
    }
    .trace-sheet.move {
      cursor: move;
    }
    .trace-sheet.calibrate {
      cursor: crosshair;
    }
    .trace-mark,
    .trace-measure {
      pointer-events: none;
    }
    .trace-mark circle,
    .trace-mark line,
    .trace-measure {
      fill: none;
      stroke: #e91e63;
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
    }
    .trace-measure {
      stroke-dasharray: 6 4;
    }
    .trace-mark text {
      fill: #e91e63;
      font-weight: 600;
    }
    .trace-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
    }
    .trace-range {
      flex: 1;
      min-width: 0;
    }
    .trace-actions {
      flex-wrap: wrap;
    }
    .trace-error {
      color: var(--error-color, #db4437);
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
    svg.area,
    svg.roof {
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
    .stage.scale-plan .ilabel-above {
      top: auto;
      bottom: calc(100% + 0.17em);
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
      width: ${En}px;
      height: ${En}px;
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
    .area-hit,
    .roof-hit {
      cursor: move;
    }
    .roof-shape {
      pointer-events: none;
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
    .ilabel-above {
      top: auto;
      bottom: calc(100% + 2px);
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
    .related-elements {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .related-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .related-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 14px;
      font-size: 12px;
      background: var(--secondary-background-color, #eceff1);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .chip-btn:hover {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .chip-btn ha-icon {
      --mdc-icon-size: 16px;
    }
  `,
  ol,
  Vv
];
K([
  at({ attribute: !1 })
], j.prototype, "hass", 2);
K([
  Y()
], j.prototype, "_config", 2);
K([
  Y()
], j.prototype, "_tool", 2);
K([
  Y()
], j.prototype, "_selection", 2);
K([
  Y()
], j.prototype, "_activeFloorId", 2);
K([
  Y()
], j.prototype, "_draft", 2);
K([
  Y()
], j.prototype, "_draftTracker", 2);
K([
  Y()
], j.prototype, "_draftArea", 2);
K([
  Y()
], j.prototype, "_areaHover", 2);
K([
  Y()
], j.prototype, "_areaDragStart", 2);
K([
  Y()
], j.prototype, "_areaDragMoved", 2);
K([
  Y()
], j.prototype, "_freeWalls", 2);
K([
  Y()
], j.prototype, "_defaultOpeningLength", 2);
K([
  Y()
], j.prototype, "_defaultWallThickness", 2);
K([
  Y()
], j.prototype, "_defaultSkylightLength", 2);
K([
  Y()
], j.prototype, "_defaultSkylightWidth", 2);
K([
  Y()
], j.prototype, "_marquee", 2);
K([
  Y()
], j.prototype, "_history", 2);
K([
  Y()
], j.prototype, "_future", 2);
K([
  Y()
], j.prototype, "_zoom", 2);
K([
  Y()
], j.prototype, "_floorMenuOpen", 2);
K([
  Y()
], j.prototype, "_addMenuOpen", 2);
K([
  Y()
], j.prototype, "_addQuery", 2);
K([
  Y()
], j.prototype, "_symbolDraft", 2);
K([
  Y()
], j.prototype, "_symbolError", 2);
K([
  Y()
], j.prototype, "_paletteError", 2);
K([
  Y()
], j.prototype, "_switcherDrag", 2);
K([
  Y()
], j.prototype, "_projectOpen", 2);
K([
  Y()
], j.prototype, "_selectionPage", 2);
K([
  Y()
], j.prototype, "_projectPage", 2);
K([
  Y()
], j.prototype, "_actionYaml", 2);
K([
  Y()
], j.prototype, "_actionYamlError", 2);
K([
  Y()
], j.prototype, "_mobileInspector", 2);
K([
  Y()
], j.prototype, "_previewCollapsed", 2);
K([
  Y()
], j.prototype, "_keyboardOpen", 2);
K([
  Y()
], j.prototype, "_fullscreen", 2);
K([
  Y()
], j.prototype, "_applyState", 2);
K([
  Y()
], j.prototype, "_applyError", 2);
K([
  ur(".editor")
], j.prototype, "_editorEl", 2);
K([
  ur("svg")
], j.prototype, "_svg", 2);
K([
  ur(".canvas-wrap")
], j.prototype, "_canvasWrap", 2);
K([
  Y()
], j.prototype, "_fitToViewport", 2);
K([
  Y()
], j.prototype, "_hideLabels", 2);
K([
  Y()
], j.prototype, "_traces", 2);
K([
  Y()
], j.prototype, "_traceMode", 2);
K([
  Y()
], j.prototype, "_traceCalib", 2);
K([
  Y()
], j.prototype, "_refFloors", 2);
K([
  Y()
], j.prototype, "_traceBusy", 2);
K([
  Y()
], j.prototype, "_traceError", 2);
j = K([
  Gn("easy-floorplan-card-editor")
], j);
const Gx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get FloorplanCardEditor() {
    return j;
  }
}, Symbol.toStringTag, { value: "Module" })), Kx = "0.7.2", sr = window;
sr.customCards = sr.customCards || [];
sr.customCards.push({
  type: "easy-floorplan-card",
  name: "Easy Floorplan",
  description: "Draw a floorplan with walls, doors, windows, furniture and text, then place device/light controls with a visual editor.",
  preview: !1,
  documentationURL: "https://github.com/nicosandller/easy-floorplan"
});
console.info(
  `%c EASY-FLOORPLAN %c ${Kx} `,
  "background:#03a9f4;color:#fff",
  "color:#03a9f4"
);
export {
  Tt as FloorplanCard
};
