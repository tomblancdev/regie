/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = globalThis, wi = dt.ShadowRoot && (dt.ShadyCSS === void 0 || dt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, xi = Symbol(), ln = /* @__PURE__ */ new WeakMap();
let ur = class {
  constructor(t, i, n) {
    if (this._$cssResult$ = !0, n !== xi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (wi && t === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (t = ln.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && ln.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const yt = (e) => new ur(typeof e == "string" ? e : e + "", void 0, xi), ot = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((n, r, o) => n + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new ur(i, e, xi);
}, Uo = (e, t) => {
  if (wi) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const n = document.createElement("style"), r = dt.litNonce;
    r !== void 0 && n.setAttribute("nonce", r), n.textContent = i.cssText, e.appendChild(n);
  }
}, cn = wi ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const n of t.cssRules) i += n.cssText;
  return yt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Bo, defineProperty: Wo, getOwnPropertyDescriptor: qo, getOwnPropertyNames: Go, getOwnPropertySymbols: Ko, getPrototypeOf: Vo } = Object, Ot = globalThis, dn = Ot.trustedTypes, Zo = dn ? dn.emptyScript : "", Xo = Ot.reactiveElementPolyfillSupport, qe = (e, t) => e, bt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Zo : null;
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
} }, $i = (e, t) => !Bo(e, t), hn = { attribute: !0, type: String, converter: bt, reflect: !1, useDefault: !1, hasChanged: $i };
Symbol.metadata ??= Symbol("metadata"), Ot.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Ae = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = hn) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const n = Symbol(), r = this.getPropertyDescriptor(t, n, i);
      r !== void 0 && Wo(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, n) {
    const { get: r, set: o } = qo(this.prototype, t) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: r, set(a) {
      const l = r?.call(this);
      o?.call(this, a), this.requestUpdate(t, l, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? hn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(qe("elementProperties"))) return;
    const t = Vo(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(qe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(qe("properties"))) {
      const i = this.properties, n = [...Go(i), ...Ko(i)];
      for (const r of n) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [n, r] of i) this.elementProperties.set(n, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, n] of this.elementProperties) {
      const r = this._$Eu(i, n);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const r of n) i.unshift(cn(r));
    } else t !== void 0 && i.push(cn(t));
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
    return Uo(t, this.constructor.elementStyles), t;
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
    const n = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, n);
    if (r !== void 0 && n.reflect === !0) {
      const o = (n.converter?.toAttribute !== void 0 ? n.converter : bt).toAttribute(i, n.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const n = this.constructor, r = n._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = n.getPropertyOptions(r), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : bt;
      this._$Em = r;
      const l = a.fromAttribute(i, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, i, n, r = !1, o) {
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[t]), n ??= a.getPropertyOptions(t), !((n.hasChanged ?? $i)(o, i) || n.useDefault && n.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, n)))) return;
      this.C(t, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: n, reflect: r, wrapped: o }, a) {
    n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? i ?? this[t]), o !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [r, o] of n) {
        const { wrapped: a } = o, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
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
Ae.elementStyles = [], Ae.shadowRootOptions = { mode: "open" }, Ae[qe("elementProperties")] = /* @__PURE__ */ new Map(), Ae[qe("finalized")] = /* @__PURE__ */ new Map(), Xo?.({ ReactiveElement: Ae }), (Ot.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ki = globalThis, pn = (e) => e, vt = ki.trustedTypes, un = vt ? vt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, fr = "$lit$", se = `lit$${Math.random().toFixed(9).slice(2)}$`, mr = "?" + se, Yo = `<${mr}>`, xe = document, Ye = () => xe.createComment(""), Qe = (e) => e === null || typeof e != "object" && typeof e != "function", Si = Array.isArray, Qo = (e) => Si(e) || typeof e?.[Symbol.iterator] == "function", Yt = `[ 	
\f\r]`, Ne = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fn = /-->/g, mn = />/g, ge = RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), gn = /'/g, yn = /"/g, gr = /^(?:script|style|textarea|title)$/i, yr = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), g = yr(1), _ = yr(2), ee = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), bn = /* @__PURE__ */ new WeakMap(), _e = xe.createTreeWalker(xe, 129);
function br(e, t) {
  if (!Si(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return un !== void 0 ? un.createHTML(t) : t;
}
const Jo = (e, t) => {
  const i = e.length - 1, n = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = Ne;
  for (let l = 0; l < i; l++) {
    const s = e[l];
    let c, p, d = -1, h = 0;
    for (; h < s.length && (a.lastIndex = h, p = a.exec(s), p !== null); ) h = a.lastIndex, a === Ne ? p[1] === "!--" ? a = fn : p[1] !== void 0 ? a = mn : p[2] !== void 0 ? (gr.test(p[2]) && (r = RegExp("</" + p[2], "g")), a = ge) : p[3] !== void 0 && (a = ge) : a === ge ? p[0] === ">" ? (a = r ?? Ne, d = -1) : p[1] === void 0 ? d = -2 : (d = a.lastIndex - p[2].length, c = p[1], a = p[3] === void 0 ? ge : p[3] === '"' ? yn : gn) : a === yn || a === gn ? a = ge : a === fn || a === mn ? a = Ne : (a = ge, r = void 0);
    const m = a === ge && e[l + 1].startsWith("/>") ? " " : "";
    o += a === Ne ? s + Yo : d >= 0 ? (n.push(c), s.slice(0, d) + fr + s.slice(d) + se + m) : s + se + (d === -2 ? l : m);
  }
  return [br(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class Je {
  constructor({ strings: t, _$litType$: i }, n) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const l = t.length - 1, s = this.parts, [c, p] = Jo(t, i);
    if (this.el = Je.createElement(c, n), _e.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = _e.nextNode()) !== null && s.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(fr)) {
          const h = p[a++], m = r.getAttribute(d).split(se), b = /([.?@])?(.*)/.exec(h);
          s.push({ type: 1, index: o, name: b[2], strings: m, ctor: b[1] === "." ? ta : b[1] === "?" ? ia : b[1] === "@" ? na : Lt }), r.removeAttribute(d);
        } else d.startsWith(se) && (s.push({ type: 6, index: o }), r.removeAttribute(d));
        if (gr.test(r.tagName)) {
          const d = r.textContent.split(se), h = d.length - 1;
          if (h > 0) {
            r.textContent = vt ? vt.emptyScript : "";
            for (let m = 0; m < h; m++) r.append(d[m], Ye()), _e.nextNode(), s.push({ type: 2, index: ++o });
            r.append(d[h], Ye());
          }
        }
      } else if (r.nodeType === 8) if (r.data === mr) s.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(se, d + 1)) !== -1; ) s.push({ type: 7, index: o }), d += se.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const n = xe.createElement("template");
    return n.innerHTML = t, n;
  }
}
function Le(e, t, i = e, n) {
  if (t === ee) return t;
  let r = n !== void 0 ? i._$Co?.[n] : i._$Cl;
  const o = Qe(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, i, n)), n !== void 0 ? (i._$Co ??= [])[n] = r : i._$Cl = r), r !== void 0 && (t = Le(e, r._$AS(e, t.values), r, n)), t;
}
class ea {
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
    const { el: { content: i }, parts: n } = this._$AD, r = (t?.creationScope ?? xe).importNode(i, !0);
    _e.currentNode = r;
    let o = _e.nextNode(), a = 0, l = 0, s = n[0];
    for (; s !== void 0; ) {
      if (a === s.index) {
        let c;
        s.type === 2 ? c = new Re(o, o.nextSibling, this, t) : s.type === 1 ? c = new s.ctor(o, s.name, s.strings, this, t) : s.type === 6 && (c = new ra(o, this, t)), this._$AV.push(c), s = n[++l];
      }
      a !== s?.index && (o = _e.nextNode(), a++);
    }
    return _e.currentNode = xe, r;
  }
  p(t) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, i), i += n.strings.length - 2) : n._$AI(t[i])), i++;
  }
}
class Re {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, n, r) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = Le(this, t, i), Qe(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== ee && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Qo(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && Qe(this._$AH) ? this._$AA.nextSibling.data = t : this.T(xe.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: n } = t, r = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = Je.createElement(br(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const o = new ea(r, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = bn.get(t.strings);
    return i === void 0 && bn.set(t.strings, i = new Je(t)), i;
  }
  k(t) {
    Si(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, r = 0;
    for (const o of t) r === i.length ? i.push(n = new Re(this.O(Ye()), this.O(Ye()), this, this.options)) : n = i[r], n._$AI(o), r++;
    r < i.length && (this._$AR(n && n._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const n = pn(t).nextSibling;
      pn(t).remove(), t = n;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Lt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, n, r, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = o, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = u;
  }
  _$AI(t, i = this, n, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = Le(this, t, i, 0), a = !Qe(t) || t !== this._$AH && t !== ee, a && (this._$AH = t);
    else {
      const l = t;
      let s, c;
      for (t = o[0], s = 0; s < o.length - 1; s++) c = Le(this, l[n + s], i, s), c === ee && (c = this._$AH[s]), a ||= !Qe(c) || c !== this._$AH[s], c === u ? t = u : t !== u && (t += (c ?? "") + o[s + 1]), this._$AH[s] = c;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ta extends Lt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class ia extends Lt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class na extends Lt {
  constructor(t, i, n, r, o) {
    super(t, i, n, r, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = Le(this, t, i, 0) ?? u) === ee) return;
    const n = this._$AH, r = t === u && n !== u || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, o = t !== u && (n === u || r);
    r && this.element.removeEventListener(this.name, this, n), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ra {
  constructor(t, i, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Le(this, t);
  }
}
const oa = { I: Re }, aa = ki.litHtmlPolyfillSupport;
aa?.(Je, Re), (ki.litHtmlVersions ??= []).push("3.3.3");
const sa = (e, t, i) => {
  const n = i?.renderBefore ?? t;
  let r = n._$litPart$;
  if (r === void 0) {
    const o = i?.renderBefore ?? null;
    n._$litPart$ = r = new Re(t.insertBefore(Ye(), o), o, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ei = globalThis;
let de = class extends Ae {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = sa(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ee;
  }
};
de._$litElement$ = !0, de.finalized = !0, Ei.litElementHydrateSupport?.({ LitElement: de });
const la = Ei.litElementPolyfillSupport;
la?.({ LitElement: de });
(Ei.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ca = { attribute: !0, type: String, converter: bt, reflect: !1, hasChanged: $i }, da = (e = ca, t, i) => {
  const { kind: n, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), n === "accessor") {
    const { name: a } = i;
    return { set(l) {
      const s = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(a, s, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, e, l), l;
    } };
  }
  if (n === "setter") {
    const { name: a } = i;
    return function(l) {
      const s = this[a];
      t.call(this, l), this.requestUpdate(a, s, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function P(e) {
  return (t, i) => typeof i == "object" ? da(e, t, i) : ((n, r, o) => {
    const a = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, n), a ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function M(e) {
  return P({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ha = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ai(e, t) {
  return (i, n, r) => {
    const o = (a) => a.renderRoot?.querySelector(e) ?? null;
    return ha(i, n, { get() {
      return o(this);
    } });
  };
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pa = { CHILD: 2 }, Rt = (e) => (...t) => ({ _$litDirective$: e, values: t });
let zt = class {
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
const { I: ua } = oa, vn = (e) => e, _n = () => document.createComment(""), He = (e, t, i) => {
  const n = e._$AA.parentNode, r = t === void 0 ? e._$AB : t._$AA;
  if (i === void 0) {
    const o = n.insertBefore(_n(), r), a = n.insertBefore(_n(), r);
    i = new ua(o, a, e, e.options);
  } else {
    const o = i._$AB.nextSibling, a = i._$AM, l = a !== e;
    if (l) {
      let s;
      i._$AQ?.(e), i._$AM = e, i._$AP !== void 0 && (s = e._$AU) !== a._$AU && i._$AP(s);
    }
    if (o !== r || l) {
      let s = i._$AA;
      for (; s !== o; ) {
        const c = vn(s).nextSibling;
        vn(n).insertBefore(s, r), s = c;
      }
    }
  }
  return i;
}, ye = (e, t, i = e) => (e._$AI(t, i), e), fa = {}, vr = (e, t = fa) => e._$AH = t, ma = (e) => e._$AH, Qt = (e) => {
  e._$AR(), e._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wn = (e, t, i) => {
  const n = /* @__PURE__ */ new Map();
  for (let r = t; r <= i; r++) n.set(e[r], r);
  return n;
}, ie = Rt(class extends zt {
  constructor(e) {
    if (super(e), e.type !== pa.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, i) {
    let n;
    i === void 0 ? i = t : t !== void 0 && (n = t);
    const r = [], o = [];
    let a = 0;
    for (const l of e) r[a] = n ? n(l, a) : a, o[a] = i(l, a), a++;
    return { values: o, keys: r };
  }
  render(e, t, i) {
    return this.dt(e, t, i).values;
  }
  update(e, [t, i, n]) {
    const r = ma(e), { values: o, keys: a } = this.dt(t, i, n);
    if (!Array.isArray(r)) return this.ut = a, o;
    const l = this.ut ??= [], s = [];
    let c, p, d = 0, h = r.length - 1, m = 0, b = o.length - 1;
    for (; d <= h && m <= b; ) if (r[d] === null) d++;
    else if (r[h] === null) h--;
    else if (l[d] === a[m]) s[m] = ye(r[d], o[m]), d++, m++;
    else if (l[h] === a[b]) s[b] = ye(r[h], o[b]), h--, b--;
    else if (l[d] === a[b]) s[b] = ye(r[d], o[b]), He(e, s[b + 1], r[d]), d++, b--;
    else if (l[h] === a[m]) s[m] = ye(r[h], o[m]), He(e, r[d], r[h]), h--, m++;
    else if (c === void 0 && (c = wn(a, m, b), p = wn(l, d, h)), c.has(l[d])) if (c.has(l[h])) {
      const y = p.get(a[m]), v = y !== void 0 ? r[y] : null;
      if (v === null) {
        const w = He(e, r[d]);
        ye(w, o[m]), s[m] = w;
      } else s[m] = ye(v, o[m]), He(e, r[d], v), r[y] = null;
      m++;
    } else Qt(r[h]), h--;
    else Qt(r[d]), d++;
    for (; m <= b; ) {
      const y = He(e, s[b + 1]);
      ye(y, o[m]), s[m++] = y;
    }
    for (; d <= h; ) {
      const y = r[d++];
      y !== null && Qt(y);
    }
    return this.ut = a, vr(e, s), ee;
  }
});
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _r = Rt(class extends zt {
  constructor() {
    super(...arguments), this.key = u;
  }
  render(e, t) {
    return this.key = e, t;
  }
  update(e, [t, i]) {
    return t !== this.key && (vr(e), this.key = t), i;
  }
});
class xn {
  constructor(t) {
    this._hass = t;
  }
  getEntityState(t) {
    return this._hass.states[t];
  }
}
class ga {
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
function ya(e, t, i, n) {
  return e ? i ? new ga(t, new xn(e), n) : new xn(e) : { getEntityState: () => {
  } };
}
function ba(e, t, i, n, r) {
  if (!e) return;
  const o = ya(e, i, n, r), a = {};
  for (const l of t)
    a[l] = o.getEntityState(l);
  return {
    states: a,
    formatEntityState: (l) => e.formatEntityState(l)
  };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const va = {}, $n = Rt(class extends zt {
  constructor() {
    super(...arguments), this.ot = va;
  }
  render(e, t) {
    return t();
  }
  update(e, [t, i]) {
    if (Array.isArray(t)) {
      if (Array.isArray(this.ot) && this.ot.length === t.length && t.every((n, r) => n === this.ot[r])) return ee;
    } else if (this.ot === t) return ee;
    return this.ot = Array.isArray(t) ? Array.from(t) : t, this.render(t, i);
  }
}), _a = /* @__PURE__ */ new Set([
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
]), wa = /^[a-z0-9#%.,/_() +*-]+$/i, xa = /([a-z][a-z0-9-]*)\s*\(/gi;
function R(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  if (!t || !wa.test(t) || t.includes("/*") || t.includes("*/") || !/^[a-z#]/i.test(t)) return;
  let i = 0;
  for (let r = 0; r < t.length; r++) {
    const o = t[r];
    if (o === "(") i++;
    else if (o === ")" && --i < 0) return;
  }
  if (i !== 0) return;
  const n = new RegExp(xa.source, "gi");
  for (let r; r = n.exec(t); )
    if (!_a.has(r[1].toLowerCase())) return;
  return t;
}
function K(e, t) {
  return R(e) ?? t;
}
function C(e, t) {
  if (e == null || typeof e == "string" && e.trim() === "") return t;
  const i = typeof e == "number" ? e : Number(e);
  return Number.isFinite(i) ? i : t;
}
function V(e) {
  if (typeof e != "string") return;
  const t = e.trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return t === "" ? void 0 : t;
}
const $a = {
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
function ka(e) {
  const t = e.trim().toLowerCase(), i = $a[t];
  if (i) return i;
  const n = /^#([0-9a-f]{3,8})$/i.exec(t);
  if (n) {
    const o = n[1];
    return o.length === 3 || o.length === 4 ? [0, 1, 2].map((a) => parseInt(o[a] + o[a], 16)) : o.length === 6 || o.length === 8 ? [0, 2, 4].map((a) => parseInt(o.slice(a, a + 2), 16)) : void 0;
  }
  const r = /^rgba?\(([^)]*)\)$/.exec(t);
  if (r) {
    const o = r[1].split(/[\s,/]+/).filter((l) => l !== "");
    if (o.length < 3) return;
    const a = o.slice(0, 3).map((l) => {
      if (l.endsWith("%")) {
        const s = Number(l.slice(0, -1));
        return Number.isFinite(s) ? s / 100 * 255 : NaN;
      }
      return Number(l);
    });
    return a.some((l) => !Number.isFinite(l)) ? void 0 : a.map((l) => Math.max(0, Math.min(255, l)));
  }
}
function Ti([e, t, i]) {
  const n = (r) => {
    const o = r / 255;
    return o <= 0.03928 ? o / 12.92 : ((o + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * n(e) + 0.7152 * n(t) + 0.0722 * n(i);
}
const Sa = "#212121", Ea = "#ffffff", Aa = Ti([33, 33, 33]), Ta = Ti([255, 255, 255]);
function wr(e) {
  if (typeof e != "string") return;
  const t = ka(e);
  if (!t) return;
  const i = Ti(t), n = (r) => (Math.max(i, r) + 0.05) / (Math.min(i, r) + 0.05);
  return n(Aa) >= n(Ta) ? Sa : Ea;
}
const Ca = /^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/i;
function Ge(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  return Ca.test(t) ? t : void 0;
}
function he(e) {
  if (typeof e != "string") return;
  const t = e.trim().replace(/[^a-zA-Z0-9_.-]/g, "");
  return t === "" ? void 0 : t;
}
const Dt = "default", xr = 10, _t = [
  {
    id: Dt,
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
], Nt = "var(--fp-skin-bg, var(--card-background-color, #fff))", Ci = "var(--fp-skin-wall, var(--primary-text-color))", $r = "var(--fp-skin-text, var(--primary-text-color))", z = "var(--fp-skin-accent, var(--primary-color, #03a9f4))", Jt = "var(--fp-skin-active, var(--state-light-active-color, var(--state-active-color, #fdd835)))", be = "var(--fp-skin-badge-bg, var(--card-background-color, #fff))";
function Mi(e) {
  if (typeof e == "string")
    return _t.find((t) => t.id === e);
}
function Ma(e) {
  const t = Mi(e);
  return t ? Object.entries(t.vars).map(([i, n]) => `${i}:${n};`).join("") : "";
}
function Ia(e) {
  const t = Mi(e);
  return t && t.id !== Dt ? t.id : void 0;
}
const Pa = yt(
  _t.filter((e) => e.id !== Dt).map(
    (e) => `:host([data-skin="${e.id}"]){` + Object.entries(e.vars).map(([t, i]) => `${t}:${i};`).join("") + "}"
  ).join(`
`)
), kr = ot`
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
`, Oa = 6e4, La = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function Sr(e) {
  return La.has(e);
}
function Ii(e) {
  if (e === "") return;
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}
function Er(e) {
  let t = 0;
  for (const i of e)
    if (!Sr(i.newState)) {
      if (Ii(i.newState) === void 0) return !1;
      t++;
    }
  return t > 0;
}
function Fa(e, t, i) {
  const n = e.map((c) => Ii(c.newState)), r = n.filter((c) => c !== void 0);
  if (!r.length) return e;
  const o = (Math.max(...r) - Math.min(...r)) / t;
  if (!(o > 0) && !e.some((c) => Sr(c.newState)))
    return e.length ? [e[0], e[e.length - 1]] : [];
  const a = [e[0]];
  let l = n[0], s = e[0].timestamp;
  for (let c = 1; c < e.length - 1; c++) {
    const p = n[c];
    if (p === void 0) {
      a.push(e[c]), l = void 0, s = e[c].timestamp;
      continue;
    }
    if (l === void 0) {
      a.push(e[c]), l = p, s = e[c].timestamp;
      continue;
    }
    const d = n[c - 1], h = n[c + 1], m = d !== void 0 && h !== void 0 && (p > d && p >= h || p < d && p <= h);
    (Math.abs(p - l) >= o || m && Math.abs(p - l) >= o / 2 || e[c].timestamp - s >= i) && (a.push(e[c]), l = p, s = e[c].timestamp);
  }
  return e.length > 1 && a.push(e[e.length - 1]), a;
}
function Ra(e, t = {}) {
  const i = t.numericSteps ?? 0;
  return !(i > 0) || e.length < 3 || !Er(e) ? e : Fa(e, i, t.maxGapMs ?? Oa);
}
function za(e, t = {}) {
  if (!(t.numericSteps ?? 0) || e.length === 0) return e;
  const i = /* @__PURE__ */ new Map();
  for (const r of e) {
    const o = i.get(r.entityId);
    o ? o.push(r) : i.set(r.entityId, [r]);
  }
  const n = /* @__PURE__ */ new Set();
  for (const r of i.values())
    for (const o of Ra(r, t)) n.add(o);
  return e.filter((r) => n.has(r));
}
function Da(e, t) {
  if (!(t > 2) || e.length <= t || !Er(e)) return e;
  const i = e.map((a) => Ii(a.newState)), n = /* @__PURE__ */ new Set([0, e.length - 1]);
  for (let a = 0; a < e.length; a++)
    i[a] === void 0 && n.add(a);
  const r = [];
  let o;
  for (let a = 0; a < e.length; a++) {
    const l = i[a];
    if (l === void 0) {
      o = void 0;
      continue;
    }
    a > 0 && a < e.length - 1 && o !== void 0 && r.push({ i: a, delta: Math.abs(l - o) }), o = l;
  }
  r.sort((a, l) => l.delta - a.delta);
  for (const { i: a } of r) {
    if (n.size >= t) break;
    n.add(a);
  }
  return e.filter((a, l) => n.has(l));
}
function et(e) {
  const t = typeof e.color == "string" ? R(e.color) : void 0;
  if (t) return t;
  const i = e.attributes?.color, n = typeof i == "string" ? R(i) : void 0;
  if (n) return n;
  const r = String(e.newState ?? "").trim().toLowerCase();
  return e.entityId.startsWith("light.") ? r === "off" ? be : Jt : e.entityId.startsWith("cover.") ? r === "closed" ? be : z : e.entityId.startsWith("sensor.") || e.entityId.startsWith("binary_sensor.") ? r === "off" ? be : z : e.entityId.startsWith("fan.") ? r === "off" ? be : Jt : e.entityId.startsWith("media_player.") ? r === "idle" ? be : Jt : r === "on" || r === "open" || r === "playing" || r === "home" || r === "locked" || r === "unlocked" ? z : be;
}
class Na {
  constructor(t = {}) {
    this._cache = /* @__PURE__ */ new Map(), this._events = [], this._eventsByEntity = /* @__PURE__ */ new Map(), this._maxCacheEntries = 8, this._loadCommitId = 0, this._loader = t.loader ?? (async () => []);
  }
  configure(t = {}) {
    this._context = t;
  }
  async loadHistory(t, i, n = {}) {
    const r = ++this._loadCommitId, o = n.scopeKey ?? "all", a = `${t}:${i}:${o}:${n.numericSteps ?? 0}`;
    if (this._cache.has(a)) {
      if (r === this._loadCommitId) {
        const h = this._cache.get(a);
        this._events = h, this._eventsByEntity = this._groupEventsByEntity(h);
      }
      return;
    }
    const l = n.hass ?? this._context?.hass, s = n.watched ?? this._context?.watched, p = (l && Array.isArray(s) ? await this._loadFromHass(l, t, i, s) : await this._loader(t, i, { ...this._context, ...n, hass: l, watched: s })).slice().sort((h, m) => h.timestamp - m.timestamp).map((h) => ({
      ...h,
      attributes: h.attributes ?? {}
    })), d = za(p, { numericSteps: n.numericSteps });
    if (r === this._loadCommitId) {
      if (this._cache.set(a, d), this._cache.size > this._maxCacheEntries) {
        const h = this._cache.keys().next().value;
        h && this._cache.delete(h);
      }
      this._events = d, this._eventsByEntity = this._groupEventsByEntity(d);
    }
  }
  async loadFromHass(t, i, n, r) {
    return this._loadFromHass(t, i, n, r);
  }
  async _loadFromHass(t, i, n, r) {
    if (!r.length) return [];
    const o = t.callWS, a = t.callApi, l = new Date(i * 1e3).toISOString(), s = new Date(n * 1e3).toISOString(), c = new Set(r), p = {
      type: "history/history_during_period",
      start_time: l,
      end_time: s,
      minimal_response: !1,
      no_attributes: !1,
      significant_changes_only: !1,
      entity_ids: r
    };
    let d;
    if (typeof o == "function")
      try {
        d = await o(p);
      } catch (h) {
        console.warn("[easy-floorplan] Replay WS history query failed", { startTime: l, endTime: s, watchedCount: r.length, error: h });
      }
    if (!d && typeof a == "function")
      try {
        d = await a("GET", `history/period/${encodeURIComponent(l)}`, {
          end_time: s,
          filter_entity_id: r.join(","),
          minimal_response: !1,
          no_attributes: !1,
          significant_changes_only: !1
        });
      } catch (h) {
        console.warn("[easy-floorplan] Replay REST history query failed", { startTime: l, endTime: s, watchedCount: r.length, error: h });
      }
    if (!d)
      throw new Error(`Unable to load history via websocket or REST API (ws:${typeof o == "function" ? "yes" : "no"}, api:${typeof a == "function" ? "yes" : "no"}).`);
    return this._normalizeHistoryPayload(d, i, n, c);
  }
  _normalizeHistoryPayload(t, i, n, r) {
    const o = /* @__PURE__ */ new Map(), a = (h, m) => {
      if (typeof h == "number")
        return Number.isFinite(h) ? h > 1e12 ? h / 1e3 : h : Number.NaN;
      if (typeof h == "string") {
        const b = Number(h);
        if (Number.isFinite(b)) return b > 1e12 ? b / 1e3 : b;
        const y = Date.parse(h) / 1e3;
        return Number.isFinite(y) ? y : Number.NaN;
      }
      return Date.parse(m) / 1e3;
    }, l = (h, m) => {
      for (const b of m) {
        const y = h[b];
        if (y !== void 0) return y;
      }
    }, s = (h, m) => {
      const b = m.filter((y) => !!y && typeof y == "object");
      b.length && o.set(h, b.map((y) => {
        const v = l(y, ["state", "s"]), w = l(y, ["attributes", "a"]), $ = l(y, ["last_updated", "lu"]), f = l(y, ["last_changed", "lc"]);
        return {
          state: typeof v == "string" || typeof v == "number" || typeof v == "boolean" ? String(v) : void 0,
          attributes: w && typeof w == "object" ? w : void 0,
          last_updated: typeof $ == "string" || typeof $ == "number" ? $ : void 0,
          last_changed: typeof f == "string" || typeof f == "number" ? f : void 0
        };
      }));
    };
    if (Array.isArray(t))
      for (const h of t) {
        if (!h || typeof h != "object") continue;
        const m = h, b = typeof m.entity_id == "string" ? m.entity_id : void 0, y = Array.isArray(m.states) ? m.states : Array.isArray(m.history) ? m.history : [];
        b && y.length && s(b, y);
      }
    else if (t && typeof t == "object")
      for (const [h, m] of Object.entries(t)) {
        if (Array.isArray(m) && m.length) {
          s(h, m);
          continue;
        }
        if (m && typeof m == "object") {
          const b = m;
          Array.isArray(b.states) && b.states.length && s(h, b.states);
        }
      }
    if (!o.size)
      throw new Error("History payload contained no parseable state rows.");
    const c = [], p = new Date(n * 1e3).toISOString();
    for (const [h, m] of o.entries())
      if (m.length && r.has(h)) {
        if (m.length === 1) {
          const b = m[0], y = a(b.last_updated ?? b.last_changed, p);
          if (!Number.isFinite(y) || y < i || y > n)
            continue;
          c.push({
            timestamp: y,
            entityId: h,
            oldState: b.state ?? "unknown",
            newState: b.state ?? "unknown",
            attributes: b.attributes ?? {}
          });
          continue;
        }
        for (let b = 1; b < m.length; b += 1) {
          const y = m[b - 1], v = m[b], w = a(y.last_updated ?? y.last_changed, p), $ = a(v.last_updated ?? v.last_changed, p);
          if (!Number.isFinite(w) || !Number.isFinite($) || $ < i || w > n)
            continue;
          const f = y.state !== v.state, k = !this._attributesEqual(y.attributes ?? {}, v.attributes ?? {});
          !f && !k || c.push({
            timestamp: $,
            entityId: h,
            oldState: y.state ?? "unknown",
            newState: v.state ?? "unknown",
            attributes: {
              ...y.attributes ?? {},
              ...v.attributes ?? {}
            }
          });
        }
      }
    return c.sort((h, m) => h.timestamp - m.timestamp);
  }
  _attributesEqual(t, i) {
    if (t === i) return !0;
    if (!t || !i) return !t && !i;
    if (typeof t != typeof i) return !1;
    if (Array.isArray(t) || Array.isArray(i)) {
      if (!Array.isArray(t) || !Array.isArray(i) || t.length !== i.length) return !1;
      for (let l = 0; l < t.length; l += 1)
        if (!this._attributesEqual(t[l], i[l])) return !1;
      return !0;
    }
    if (typeof t != "object") return !1;
    const n = t, r = i, o = Object.keys(n), a = Object.keys(r);
    if (o.length !== a.length) return !1;
    for (const l of o)
      if (!(l in r) || !this._attributesEqual(n[l], r[l])) return !1;
    return !0;
  }
  clearCache() {
    this._loadCommitId += 1, this._cache.clear(), this._events = [], this._eventsByEntity.clear();
  }
  getStateAt(t) {
    const i = /* @__PURE__ */ new Map();
    for (const [n, r] of this._eventsByEntity.entries()) {
      const o = this._findLastEventAtOrBefore(r, t);
      if (o) {
        i.set(n, this._toHassEntity(n, o.newState, o.attributes, o.timestamp));
        continue;
      }
      const a = r[0];
      a && i.set(n, this._toHassEntity(n, a.oldState, a.attributes, 0));
    }
    return i;
  }
  _groupEventsByEntity(t) {
    const i = /* @__PURE__ */ new Map();
    for (const n of t) {
      const r = i.get(n.entityId) ?? [];
      r.push(n), i.set(n.entityId, r);
    }
    for (const n of i.values())
      n.sort((r, o) => r.timestamp - o.timestamp);
    return i;
  }
  _findLastEventAtOrBefore(t, i) {
    let n = 0, r = t.length - 1, o;
    for (; n <= r; ) {
      const a = n + r >> 1, l = t[a];
      l.timestamp <= i ? (o = l, n = a + 1) : r = a - 1;
    }
    return o;
  }
  _toHassEntity(t, i, n, r) {
    const o = Number.isFinite(r) ? r : Date.now() / 1e3;
    return {
      entity_id: t,
      state: i,
      attributes: n ?? {},
      last_changed: new Date(o * 1e3).toISOString(),
      last_updated: new Date(o * 1e3).toISOString(),
      context: { id: "history", parent_id: null, user_id: null }
    };
  }
  getEvents() {
    return this._events.slice();
  }
  getEventBefore(t) {
    if (!this._events.length) return;
    let i = 0, n = this._events.length - 1, r = -1;
    for (; i <= n; ) {
      const o = i + n >> 1;
      this._events[o].timestamp <= t ? (r = o, i = o + 1) : n = o - 1;
    }
    return r >= 0 ? this._events[r] : void 0;
  }
  getEventAfter(t) {
    if (!this._events.length) return;
    let i = 0, n = this._events.length - 1, r = this._events.length;
    for (; i <= n; ) {
      const o = i + n >> 1;
      this._events[o].timestamp >= t ? (r = o, n = o - 1) : i = o + 1;
    }
    return r < this._events.length ? this._events[r] : void 0;
  }
}
var Ha = Object.defineProperty, ja = Object.getOwnPropertyDescriptor, $e = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? ja(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (n ? a(t, i, r) : a(r)) || r);
  return n && r && Ha(t, i, r), r;
};
let Y = class extends de {
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
    const i = et(e), n = `left:${this._getMarkerLeftClamped(e.timestamp, 7)};--stack-offset:${t};--marker-pct:${this._pct(e.timestamp)};`;
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
      e.set(t, Da(i, Y.MAX_MARKERS_PER_LANE));
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
    return ((typeof t.friendly_name == "string" ? t.friendly_name : void 0)?.trim() || e.entityId).replace(/^./, (r) => r.toUpperCase());
  }
  _seekFromClientX(e) {
    const t = this.expanded ? ".timeline-track-overlay" : ".timeline", i = this.shadowRoot?.querySelector(t)?.getBoundingClientRect();
    if (!i) return;
    const n = Math.max(1, this.endTime - this.startTime), r = Math.min(1, Math.max(0, (e - i.left) / i.width)), o = Math.round(this.startTime + r * n);
    this._seek(o);
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
    if (!this._hidden.size) return u;
    const e = this._hidden.size;
    return g`
      <div class="lanes-hidden">
        <span>${e} lane${e === 1 ? "" : "s"} hidden</span>
        <button class="lanes-hidden-show" @click=${() => this._showAllLanes()}>Show all</button>
      </div>
    `;
  }
  _renderExpandedTimeline(e) {
    const t = this._laneSeries(), i = Array.from(t.keys()), n = (this.currentTime - this.startTime) / e * 100;
    return g`
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
        @click=${(r) => this._handleTimelineClick(r)}
        @pointerdown=${(r) => this._handlePointerDown(r)}
        @pointermove=${(r) => this._handlePointerMove(r)}
        @pointerup=${(r) => this._handlePointerUp(r)}
        @pointerleave=${(r) => this._handlePointerUp(r)}
        @keydown=${this._handleKeyDown}
      >
        <div class="timeline-track-overlay" style="grid-row:1 / span ${i.length};" aria-hidden="true">
          <div class="playhead playhead-expanded" style="left:${n}%">
            <span class="playhead-time">${this._formatTimestamp(this.currentTime)}</span>
          </div>
        </div>
        ${$n([this.events, this.startTime, this.endTime, this._hidden], () => i.map((r, o) => {
      const a = t.get(r) ?? [], l = o + 1, s = this._getEntityLabel(a[0]), c = this._hidden.has(r);
      return g`
            <button
              class="lane-label ${c ? "lane-off" : ""}"
              style="grid-row:${l};"
              aria-pressed=${c ? "false" : "true"}
              title=${c ? `Show ${s} on the timeline` : `Hide ${s} from the timeline`}
              @click=${(p) => {
        p.stopPropagation(), this._toggleLane(r);
      }}
            ><span class="lane-dot" aria-hidden="true"></span><span class="lane-name">${s}</span></button>
            <div class="lane lane-track ${c ? "lane-off" : ""}" style="grid-row:${l};">
              ${(c ? [] : a).map((p) => {
        const d = et(p), h = this._getMarkerLeftClamped(p.timestamp, 4);
        return g`
                  <button
                    class="marker"
                    style=${`left:${h};--marker-pct:${this._pct(p.timestamp)};${d ? `background:${d};box-shadow:0 0 0 2px ${d}22;` : ""}`}
                    title=${this._formatEventTitle(p)}
                    @click=${(m) => {
          m.stopPropagation(), this._seek(p.timestamp);
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
      return g`<div class="timeline-empty">No history available.</div>`;
    const e = Math.max(1, this.endTime - this.startTime);
    return this.expanded ? g`${this._renderHiddenNotice()}${this._renderExpandedTimeline(e)}` : g`
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
        ${$n([this.events, this.startTime, this.endTime], () => this._groupEventsByTimestamp().map((t) => g`
          <div
            class="marker-cluster"
            style="left:${this._getMarkerLeftClamped(t.timestamp, 7)};--marker-pct:${this._pct(t.timestamp)};"
            title=${this._formatClusterTitle(t.events)}
            @click=${(i) => {
      i.stopPropagation(), this._seek(t.timestamp);
    }}
          >
            ${t.events.map((i, n) => {
      const r = n === 0 ? "-2px" : n === 1 ? "2px" : n === 2 ? "-4px" : "4px";
      return g`
                <button
                  class="marker"
                  style=${this._markerStyle(i, r)}
                  title=${this._formatEventTitle(i)}
                  @click=${(o) => {
        o.stopPropagation(), this._seek(i.timestamp);
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
Y.MAX_MARKERS_PER_LANE = 150;
Y.styles = ot`
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
    .playhead { position: absolute; top: -2px; width: 2px; height: calc(100% + 4px); background: ${yt(z)}; }
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
      background: ${yt(z)};
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
$e([
  P({ attribute: !1 })
], Y.prototype, "events", 2);
$e([
  P({ type: Number })
], Y.prototype, "startTime", 2);
$e([
  P({ type: Number })
], Y.prototype, "endTime", 2);
$e([
  P({ type: Number })
], Y.prototype, "currentTime", 2);
$e([
  P({ type: Boolean })
], Y.prototype, "expanded", 2);
$e([
  M()
], Y.prototype, "_hidden", 2);
Y = $e([
  Ft("easy-floorplan-history-timeline")
], Y);
function kn(e) {
  return !!e?.haArea && (e.filterEntities ?? !0);
}
const Sn = -6, Ua = 6, Pi = 0.45, wt = 1, Ar = "scale", Tr = "dim", En = 0.92, An = 80, Tn = 260, oi = 0.25, ai = 4, Cr = 10, si = 1, Oi = 14, Ba = 3, Ht = 140, Mr = "var(--fp-skin-glow, #ffd9a0)", Cn = 0.18, xt = 0.6, Mn = 0.5, In = 0.45, Wa = 0.5, Li = 14, we = 34, $t = 34, Ke = 16, jt = 80, Ut = 0, Bt = 360, qa = "var(--fp-skin-furniture, #9e9e9e)", Ie = 1e3, tt = 600, Fi = 20, Pn = 50;
function Ga(e, t) {
  return e ?? t;
}
function On(e, t) {
  return t <= 0 ? 100 : Math.round(e / t * 100);
}
function ei(e, t) {
  return Math.max(1, Math.round(t * e / 100));
}
function Ln(e) {
  const t = e?.floors;
  return !t || typeof t != "object" ? [] : Object.values(t).filter((i) => !!i && typeof i.floor_id == "string" && typeof i.name == "string").sort((i, n) => (i.level ?? 0) - (n.level ?? 0) || i.name.localeCompare(n.name));
}
function Ka(e) {
  const t = e?.areas;
  return !t || typeof t != "object" ? [] : Object.values(t).filter((i) => !!i && typeof i.area_id == "string" && typeof i.name == "string").sort((i, n) => i.name.localeCompare(n.name));
}
function Va(e, t) {
  if (!("name" in e)) return e;
  const i = (e.name ?? "").toString().trim(), n = Za(t, i);
  return { ...e, name: n ? n.name : i || void 0, haArea: n?.area_id };
}
function Za(e, t) {
  const i = (t ?? "").trim();
  if (!i) return;
  const n = e.find((l) => l.name === i);
  if (n) return n;
  const r = i.toLowerCase(), o = e.find((l) => l.name.toLowerCase() === r);
  if (o) return o;
  const a = r.replace(/\s+/g, " ");
  return e.find((l) => l.name.trim().toLowerCase().replace(/\s+/g, " ") === a);
}
function Xa(e, t) {
  const i = e, n = i?.entities?.[t];
  return n ? n.area_id ? n.area_id : (n.device_id ? i?.devices?.[n.device_id] : void 0)?.area_id ?? void 0 : void 0;
}
function ti(e, t) {
  const n = e?.entities;
  return !n || typeof n != "object" ? [] : Object.keys(n).filter((r) => Xa(e, r) === t);
}
function Ya(e) {
  return {
    type: e,
    width: Ie,
    height: tt,
    grid: Fi,
    walls: [],
    openings: [],
    items: [],
    texts: [],
    furniture: [],
    trackers: [],
    areas: []
  };
}
function Qa() {
  return { overlayScale: "plan" };
}
function U(e) {
  return `${e}_${Math.random().toString(36).slice(2, 9)}`;
}
function li(e, t) {
  if (e === t) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return !Array.isArray(e) || !Array.isArray(t) || e.length !== t.length ? !1 : e.every((r, o) => li(r, t[o]));
  if (typeof e != "object" || typeof t != "object" || e === null || t === null) return !1;
  const i = e, n = t;
  for (const r of /* @__PURE__ */ new Set([...Object.keys(i), ...Object.keys(n)]))
    if (!li(i[r], n[r])) return !1;
  return !0;
}
function Ja(e, t = []) {
  return {
    id: U("floor"),
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
function es(e) {
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
function ts(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((i, n) => {
    let r = i.id || `floor_${n + 1}`;
    for (; t.has(r); ) r = `${r}_${n + 1}`;
    return t.add(r), r === i.id ? i : { ...i, id: r };
  });
}
function is(e, t, i) {
  const n = e.findIndex((l) => l.id === t), r = n + i;
  if (n < 0 || r < 0 || r >= e.length) return null;
  const o = [...e], [a] = o.splice(n, 1);
  return o.splice(r, 0, a), o;
}
function Fe(e) {
  return e.floors && e.floors.length ? ts(e.floors.map(es)) : [
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
function kt(e, t) {
  if (!t) return null;
  const i = e?.[t.entity]?.state;
  if (i == null || i === "unavailable" || i === "unknown") return !1;
  const n = i === "on" || i === "open" || i === "home" || i === "detected";
  return t.invert ? !n : n;
}
function Fn(e, t) {
  if (!e || t == null || !Number.isFinite(t)) return null;
  const i = e.max - e.min;
  if (i === 0) return null;
  const n = (t - e.min) / i, r = Math.max(0, Math.min(1, n));
  return e.invert ? 1 - r : r;
}
const ns = "airHandler", rs = "air handler", os = "utility", as = [
  "hvac",
  "ahu",
  "furnace",
  "ventilation"
], ss = {
  w: 60,
  h: 56
}, ls = [
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
], cs = {
  id: ns,
  name: rs,
  category: os,
  keywords: as,
  size: ss,
  parts: ls
}, ds = "bathtub", hs = "bathtub", ps = "bath", us = [
  "bath",
  "tub"
], fs = {
  w: 150,
  h: 76
}, ms = [
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
  id: ds,
  name: hs,
  category: ps,
  keywords: us,
  size: fs,
  parts: ms
}, ys = "bed", bs = "bed", vs = "bedroom", _s = [
  "double",
  "mattress",
  "sleep"
], ws = {
  w: 150,
  h: 200
}, xs = [
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
  id: ys,
  name: bs,
  category: vs,
  keywords: _s,
  size: ws,
  parts: xs
}, ks = "chair", Ss = "chair", Es = "living", As = [
  "seat"
], Ts = {
  w: 44,
  h: 44
}, Cs = [
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
], Ms = {
  id: ks,
  name: Ss,
  category: Es,
  keywords: As,
  size: Ts,
  parts: Cs
}, Is = "desk", Ps = "desk", Os = "living", Ls = [
  "office",
  "workstation"
], Fs = {
  w: 120,
  h: 60
}, Rs = [
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
], zs = {
  id: Is,
  name: Ps,
  category: Os,
  keywords: Ls,
  size: Fs,
  parts: Rs
}, Ds = "dishwasher", Ns = "dishwasher", Hs = "kitchen", js = [
  "dishes"
], Us = {
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
], Ws = {
  id: Ds,
  name: Ns,
  category: Hs,
  keywords: js,
  size: Us,
  parts: Bs
}, qs = "dryer", Gs = "dryer", Ks = "utility", Vs = [
  "tumble dryer",
  "laundry"
], Zs = {
  w: 60,
  h: 62
}, Xs = [
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
], Ys = {
  id: qs,
  name: Gs,
  category: Ks,
  keywords: Vs,
  size: Zs,
  parts: Xs
}, Qs = "fishTank", Js = "fish tank", el = "living", tl = [
  "aquarium",
  "fish",
  "water"
], il = {
  w: 100,
  h: 40
}, nl = [
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
], rl = {
  id: Qs,
  name: Js,
  category: el,
  keywords: tl,
  size: il,
  parts: nl
}, ol = "fridge", al = "fridge", sl = "kitchen", ll = [
  "refrigerator",
  "freezer"
], cl = {
  w: 60,
  h: 64
}, dl = [
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
], hl = {
  id: ol,
  name: al,
  category: sl,
  keywords: ll,
  size: cl,
  parts: dl
}, pl = "hotTub", ul = "hot tub", fl = "bath", ml = [
  "jacuzzi",
  "spa",
  "whirlpool"
], gl = {
  w: 120,
  h: 120
}, yl = [
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
], bl = {
  id: pl,
  name: ul,
  category: fl,
  keywords: ml,
  size: gl,
  parts: yl
}, vl = "piano", _l = "piano", wl = "living", xl = [
  "upright",
  "keyboard",
  "music"
], $l = {
  w: 140,
  h: 60
}, kl = [
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
], Sl = {
  id: vl,
  name: _l,
  category: wl,
  keywords: xl,
  size: $l,
  parts: kl
}, El = "plant", Al = "plant", Tl = "living", Cl = [
  "pot",
  "tree",
  "greenery"
], Ml = {
  w: 44,
  h: 44
}, Il = "ellipse", Pl = [
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
], Ol = {
  id: El,
  name: Al,
  category: Tl,
  keywords: Cl,
  size: Ml,
  footprint: Il,
  parts: Pl
}, Ll = "roundTable", Fl = "round table", Rl = "living", zl = [
  "dining",
  "circular"
], Dl = {
  w: 100,
  h: 100
}, Nl = "ellipse", Hl = [
  {
    ellipse: [
      50,
      50,
      50,
      50
    ],
    role: "body"
  }
], jl = {
  id: Ll,
  name: Fl,
  category: Rl,
  keywords: zl,
  size: Dl,
  footprint: Nl,
  parts: Hl
}, Ul = "rug", Bl = "rug", Wl = "living", ql = [
  "carpet",
  "mat"
], Gl = {
  w: 180,
  h: 120
}, Kl = [
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
], Vl = {
  id: Ul,
  name: Bl,
  category: Wl,
  keywords: ql,
  size: Gl,
  parts: Kl
}, Zl = "sectional", Xl = "sectional (L)", Yl = "living", Ql = [
  "couch",
  "sofa",
  "corner",
  "chaise"
], Jl = {
  w: 230,
  h: 180
}, ec = [
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
], tc = {
  id: Zl,
  name: Xl,
  category: Yl,
  keywords: Ql,
  size: Jl,
  parts: ec
}, ic = "sink", nc = "sink", rc = "kitchen", oc = [
  "basin",
  "tap",
  "faucet"
], ac = {
  w: 64,
  h: 48
}, sc = [
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
], lc = {
  id: ic,
  name: nc,
  category: rc,
  keywords: oc,
  size: ac,
  parts: sc
}, cc = "sofa", dc = "sofa", hc = "living", pc = [
  "couch",
  "settee",
  "seat"
], uc = {
  w: 170,
  h: 72
}, fc = [
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
], mc = {
  id: cc,
  name: dc,
  category: hc,
  keywords: pc,
  size: uc,
  parts: fc
}, gc = "stairs", yc = "stairs", bc = "utility", vc = [
  "steps",
  "staircase"
], _c = {
  w: 90,
  h: 170
}, wc = [
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
], xc = {
  id: gc,
  name: yc,
  category: bc,
  keywords: vc,
  size: _c,
  parts: wc
}, $c = "stove", kc = "stove", Sc = "kitchen", Ec = [
  "cooker",
  "hob",
  "oven",
  "range"
], Ac = {
  w: 64,
  h: 64
}, Tc = [
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
], Cc = {
  id: $c,
  name: kc,
  category: Sc,
  keywords: Ec,
  size: Ac,
  parts: Tc
}, Mc = "table", Ic = "table", Pc = "living", Oc = [
  "dining"
], Lc = {
  w: 120,
  h: 80
}, Fc = [
  {
    rect: [
      0,
      0,
      100,
      100
    ],
    rx: 5
  }
], Rc = {
  id: Mc,
  name: Ic,
  category: Pc,
  keywords: Oc,
  size: Lc,
  parts: Fc
}, zc = "toilet", Dc = "toilet", Nc = "bath", Hc = [
  "wc",
  "loo",
  "lavatory"
], jc = {
  w: 48,
  h: 68
}, Uc = [
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
], Bc = {
  id: zc,
  name: Dc,
  category: Nc,
  keywords: Hc,
  size: jc,
  parts: Uc
}, Wc = "tv", qc = "tv", Gc = "living", Kc = [
  "television",
  "screen",
  "media"
], Vc = {
  w: 110,
  h: 18
}, Zc = [
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
], Xc = {
  id: Wc,
  name: qc,
  category: Gc,
  keywords: Kc,
  size: Vc,
  parts: Zc
}, Yc = "vanity", Qc = "vanity", Jc = "bath", ed = [
  "washbasin",
  "sink",
  "bathroom"
], td = {
  w: 110,
  h: 55
}, id = [
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
], nd = {
  id: Yc,
  name: Qc,
  category: Jc,
  keywords: ed,
  size: td,
  parts: id
}, rd = "wardrobe", od = "wardrobe", ad = "bedroom", sd = [
  "closet",
  "armoire",
  "cupboard"
], ld = {
  w: 120,
  h: 55
}, cd = [
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
], dd = {
  id: rd,
  name: od,
  category: ad,
  keywords: sd,
  size: ld,
  parts: cd
}, hd = "washer", pd = "washer", ud = "utility", fd = [
  "washing machine",
  "laundry"
], md = {
  w: 60,
  h: 62
}, gd = [
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
], yd = {
  id: hd,
  name: pd,
  category: ud,
  keywords: fd,
  size: md,
  parts: gd
}, bd = "waterHeater", vd = "water heater", _d = "utility", wd = [
  "boiler",
  "cylinder",
  "tank"
], xd = {
  w: 52,
  h: 52
}, $d = "ellipse", kd = [
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
], Sd = {
  id: bd,
  name: vd,
  category: _d,
  keywords: wd,
  size: xd,
  footprint: $d,
  parts: kd
}, ci = [
  "living",
  "bedroom",
  "kitchen",
  "bath",
  "utility",
  "other"
], Wt = (e) => Object.assign(/* @__PURE__ */ Object.create(null), e), Ri = (e, t) => typeof t == "string" && Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0, Rn = Wt({
  body: { width: 2, opacity: 1, fillOpacity: 0.12 },
  line: { width: 2, opacity: 1, fillOpacity: 0 },
  thin: { width: 1.5, opacity: 1, fillOpacity: 0 },
  detail: { width: 1.5, opacity: 0.7, fillOpacity: 0 },
  hint: { width: 1, opacity: 0.6, fillOpacity: 0 },
  solid: { width: 0, opacity: 0.7, fillOpacity: 1 }
}), Ed = [0, 0, 100, 100], Ad = 64, Ir = 256, Td = 256, Cd = 0.25, zn = 8, ne = (e) => typeof e == "number" && Number.isFinite(e) ? e : null, Te = (e, t, i) => Math.min(i, Math.max(t, e));
function ce(e, t) {
  if (!Array.isArray(e) || e.length !== t) return null;
  const i = [];
  for (const n of e) {
    const r = ne(n);
    if (r === null) return null;
    i.push(r);
  }
  return i;
}
function Md(e) {
  if (!Array.isArray(e) || e.length < 2 || e.length > Ir) return null;
  const t = [];
  for (const i of e) {
    const n = ce(i, 2);
    if (!n) return null;
    t.push([n[0], n[1]]);
  }
  return t;
}
const Id = Wt({ M: 2, L: 2, Q: 4, C: 6, Z: 0 });
function Pd(e) {
  if (!Array.isArray(e) || !e.length || e.length > Td) return null;
  const t = [];
  for (const i of e) {
    if (!Array.isArray(i) || typeof i[0] != "string") return null;
    const n = i[0].toUpperCase(), r = Ri(Id, n);
    if (r === void 0) return null;
    const o = ce(i.slice(1), r);
    if (!o) return null;
    t.push([n, ...o]);
  }
  return t[0]?.[0] !== "M" ? null : t;
}
function Se(e, t) {
  const i = Ri(Rn, e.role) ? e.role : t, n = Rn[i], r = ne(e.width), o = ne(e.opacity), a = ne(e.fillOpacity), l = Array.isArray(e.dash) ? e.dash.map(ne) : null, s = l && l.length && l.length <= 8 && l.every((c) => c !== null) ? l.map((c) => Te(c, 0, 100)) : void 0;
  return {
    role: i,
    width: r === null ? n.width : i === "solid" ? Te(r, 0, zn) : Te(r, Cd, zn),
    opacity: o === null ? n.opacity : Te(o, 0, 1),
    fillOpacity: a === null ? n.fillOpacity : Te(a, 0, 1),
    dash: s
  };
}
function Dn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, i = t.space === "square" ? "square" : "box";
  if ("line" in t) {
    const n = ce(t.line, 4);
    return n ? { kind: "line", a: [n[0], n[1]], b: [n[2], n[3]], space: i, style: Se(t, "line") } : null;
  }
  if ("rect" in t) {
    const n = ce(t.rect, 4);
    return !n || n[2] < 0 || n[3] < 0 ? null : {
      kind: "rect",
      x: n[0],
      y: n[1],
      w: n[2],
      h: n[3],
      rx: Math.max(0, ne(t.rx) ?? 0),
      space: i,
      style: Se(t, "body")
    };
  }
  if ("circle" in t) {
    const n = ce(t.circle, 3);
    return !n || n[2] < 0 ? null : { kind: "circle", cx: n[0], cy: n[1], r: n[2], space: i, style: Se(t, "line") };
  }
  if ("ellipse" in t) {
    const n = ce(t.ellipse, 4);
    return !n || n[2] < 0 || n[3] < 0 ? null : {
      kind: "ellipse",
      cx: n[0],
      cy: n[1],
      rx: n[2],
      ry: n[3],
      space: i,
      style: Se(t, "line")
    };
  }
  if ("polygon" in t || "polyline" in t) {
    const n = "polygon" in t, r = Md(n ? t.polygon : t.polyline);
    return r ? { kind: "poly", closed: n, pts: r, space: i, style: Se(t, n ? "body" : "line") } : null;
  }
  if ("path" in t) {
    const n = Pd(t.path);
    return n ? { kind: "path", cmds: n, space: i, style: Se(t, "line") } : null;
  }
  return null;
}
function Od(e, t, i) {
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
      return { ...e, pts: e.pts.map(([n, r]) => [n + t, r + i]) };
    case "path":
      return {
        ...e,
        cmds: e.cmds.map((n) => {
          if (n[0] === "Z") return n;
          const r = n.slice(1).map((o, a) => o + (a % 2 === 0 ? t : i));
          return [n[0], ...r];
        })
      };
  }
}
function Ld(e) {
  if (e && typeof e == "object" && "repeat" in e) {
    const i = e, n = ne(i.repeat), r = ce(i.step, 2), o = Dn(i.part);
    if (n === null || !r || !o) return [];
    const a = Te(Math.round(n), 1, Ad);
    return Array.from({ length: a }, (l, s) => Od(o, r[0] * s, r[1] * s));
  }
  const t = Dn(e);
  return t ? [t] : [];
}
function qt(e, t, i) {
  const n = (h) => (i?.push(h), null);
  if (!e || typeof e != "object" || Array.isArray(e))
    return n("A symbol has to be a JSON object.");
  const r = e, o = typeof r.id == "string" && r.id.trim() ? r.id.trim() : t, a = V(o);
  if (!a || a !== o)
    return n('`id` is missing, or uses characters a CSS class cannot: letters, digits, "-" and "_" only.');
  if (!Array.isArray(r.parts)) return n("`parts` has to be an array of shapes.");
  const l = [];
  for (const h of r.parts)
    for (const m of Ld(h)) {
      if (l.length >= Ir) break;
      l.push(m);
    }
  if (!l.length)
    return n(
      "No drawable parts. Each one needs a known shape (line, rect, circle, ellipse, polygon, polyline, path) with the right number of finite numbers."
    );
  const s = r.size && typeof r.size == "object" ? r.size : {}, c = ne(s.w), p = ne(s.h), d = ce(r.viewBox, 4);
  return {
    id: a,
    name: typeof r.name == "string" && r.name.trim() ? r.name.trim().slice(0, 60) : a,
    category: typeof r.category == "string" && ci.includes(r.category) ? r.category : "other",
    keywords: Array.isArray(r.keywords) ? r.keywords.filter((h) => typeof h == "string").slice(0, 12) : [],
    size: { w: c && c > 0 ? c : 60, h: p && p > 0 ? p : 60 },
    viewBox: d && d[2] > 0 && d[3] > 0 ? d : Ed,
    footprint: r.footprint === "ellipse" ? "ellipse" : "rect",
    parts: l
  };
}
const Fd = qt({
  id: "unknown",
  name: "unknown",
  size: { w: 60, h: 60 },
  parts: [{ rect: [0, 0, 100, 100], rx: 6.666667 }]
}), re = (() => {
  const e = /* @__PURE__ */ Object.assign({ "../furniture/airHandler.json": cs, "../furniture/bathtub.json": gs, "../furniture/bed.json": $s, "../furniture/chair.json": Ms, "../furniture/desk.json": zs, "../furniture/dishwasher.json": Ws, "../furniture/dryer.json": Ys, "../furniture/fishTank.json": rl, "../furniture/fridge.json": hl, "../furniture/hotTub.json": bl, "../furniture/piano.json": Sl, "../furniture/plant.json": Ol, "../furniture/roundTable.json": jl, "../furniture/rug.json": Vl, "../furniture/sectional.json": tc, "../furniture/sink.json": lc, "../furniture/sofa.json": mc, "../furniture/stairs.json": xc, "../furniture/stove.json": Cc, "../furniture/table.json": Rc, "../furniture/toilet.json": Bc, "../furniture/tv.json": Xc, "../furniture/vanity.json": nd, "../furniture/wardrobe.json": dd, "../furniture/washer.json": yd, "../furniture/waterHeater.json": Sd }), t = Wt({});
  for (const [i, n] of Object.entries(e)) {
    const r = qt(n, i.split("/").pop()?.replace(/\.json$/, ""));
    r && (t[r.id] = r);
  }
  return t;
})();
function Gt(e, t) {
  return Ri(e, t);
}
let Nn, Hn = re;
function di(e) {
  if (!e || typeof e != "object") return re;
  if (e === Nn) return Hn;
  const t = Wt({});
  Object.assign(t, re);
  for (const [i, n] of Object.entries(e)) {
    const r = qt(n, i);
    r && (t[r.id] = r);
  }
  return Nn = e, Hn = t, t;
}
function Rd(e) {
  const t = (i) => {
    const n = ci.indexOf(i);
    return n < 0 ? ci.length : n;
  };
  return Object.values(e).sort(
    (i, n) => t(i.category) - t(n.category) || i.name.localeCompare(n.name)
  );
}
function zd(e, t) {
  const i = t.trim().toLowerCase();
  return i ? e.id.toLowerCase().includes(i) || e.name.toLowerCase().includes(i) || e.category.includes(i) || e.keywords.some((n) => n.toLowerCase().includes(i)) : !0;
}
function Dd(e, t = re) {
  return Gt(t, e)?.size ?? { w: 60, h: 60 };
}
function jn(e, t, i, n) {
  const [r, o, a, l] = e.viewBox, s = n === "square" ? Math.min(t, i) : t, c = n === "square" ? Math.min(t, i) : i, p = s / a, d = c / l;
  return {
    x: (h) => (h - r) * p - s / 2,
    y: (h) => (h - o) * d - c / 2,
    len: (h) => h * Math.min(p, d),
    sx: (h) => h * p,
    sy: (h) => h * d
  };
}
const N = (e) => Number.isFinite(e) ? e : 0;
function Nd(e, t) {
  const i = e.fillOpacity > 0 ? t : "none", n = e.role === "solid" ? "none" : t;
  return { fill: i, stroke: n, style: e };
}
function Hd(e, t, i) {
  const { fill: n, stroke: r, style: o } = Nd(e.style, i), a = o.opacity < 1 ? o.opacity : u, l = o.dash?.length ? o.dash.join(" ") : u, s = o.fillOpacity > 0 && o.fillOpacity < 1 ? o.fillOpacity : u, c = o.role === "solid" ? u : o.width;
  switch (e.kind) {
    case "line":
      return _`<line x1=${N(t.x(e.a[0]))} y1=${N(t.y(e.a[1]))}
                       x2=${N(t.x(e.b[0]))} y2=${N(t.y(e.b[1]))}
                       fill="none" stroke=${r} stroke-width=${c}
                       stroke-dasharray=${l} opacity=${a} />`;
    case "rect":
      return _`<rect x=${N(t.x(e.x))} y=${N(t.y(e.y))}
                       width=${N(t.sx(e.w))} height=${N(t.sy(e.h))}
                       rx=${e.rx > 0 ? N(t.len(e.rx)) : u}
                       fill=${n} fill-opacity=${s}
                       stroke=${r} stroke-width=${c}
                       stroke-dasharray=${l} opacity=${a} />`;
    case "circle":
      return _`<circle cx=${N(t.x(e.cx))} cy=${N(t.y(e.cy))} r=${N(t.len(e.r))}
                         fill=${n} fill-opacity=${s}
                         stroke=${r} stroke-width=${c} opacity=${a} />`;
    case "ellipse":
      return _`<ellipse cx=${N(t.x(e.cx))} cy=${N(t.y(e.cy))}
                          rx=${N(t.sx(e.rx))} ry=${N(t.sy(e.ry))}
                          fill=${n} fill-opacity=${s}
                          stroke=${r} stroke-width=${c} opacity=${a} />`;
    case "poly": {
      const p = e.pts.map(([d, h]) => `${N(t.x(d))},${N(t.y(h))}`).join(" ");
      return e.closed ? _`<polygon points=${p}
                       fill=${n} fill-opacity=${s}
                       stroke=${r} stroke-width=${c}
                       stroke-linejoin="round" opacity=${a} />` : _`<polyline points=${p} fill="none"
                        stroke=${r} stroke-width=${c}
                        stroke-linejoin="round" opacity=${a} />`;
    }
    case "path": {
      const p = e.cmds.map(
        (d) => d[0] === "Z" ? "Z" : `${d[0]} ${d.slice(1).map((h, m) => m % 2 === 0 ? N(t.x(h)) : N(t.y(h))).join(" ")}`
      ).join(" ");
      return _`<path d=${p}
                       fill=${n} fill-opacity=${s}
                       stroke=${r} stroke-width=${c}
                       stroke-linejoin="round" opacity=${a} />`;
    }
  }
}
function jd(e, t, i, n) {
  const r = jn(e, t, i, "box"), o = jn(e, t, i, "square");
  return e.parts.map((a) => Hd(a, a.space === "square" ? o : r, n));
}
const Ud = /* @__PURE__ */ new Set(["light", "switch", "fan", "input_boolean"]);
function Pr(e) {
  const t = e?.split(".")[0] ?? "";
  return Ud.has(t) ? { action: "toggle" } : { action: "more-info" };
}
function ae(e) {
  return e !== void 0 && e.action !== "none";
}
function Or(e, t) {
  return t === "tap" ? e.tap_action ?? Pr(e.entity) : t === "hold" ? e.hold_action : e.double_tap_action;
}
function Bd(e, t) {
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
      return Lr(t) !== null;
    case "fire-dom-event":
      return !0;
    default:
      return !1;
  }
}
function Wd(e) {
  return ["tap", "hold", "double_tap"].some(
    (t) => Bd(e, Or(e, t))
  );
}
function Lr(e) {
  const t = e.perform_action ?? e.service;
  if (!t || !t.includes(".")) return null;
  const [i, n] = t.split(".", 2);
  return { domain: i, service: n, data: e.data ?? e.service_data, target: e.target };
}
function je(e, t, i, n) {
  if (!(!n || n.action === "none")) {
    if (n.confirmation) {
      const r = typeof n.confirmation == "object" && n.confirmation.text || `Are you sure you want to ${n.action}?`;
      if (!globalThis.confirm?.(r)) return;
    }
    switch (n.action) {
      case "toggle":
        i.entity && t.callService("homeassistant", "toggle", { entity_id: i.entity });
        break;
      case "more-info": {
        const r = n.entity ?? i.entity;
        r && e.dispatchEvent(
          new CustomEvent("hass-more-info", { detail: { entityId: r }, bubbles: !0, composed: !0 })
        );
        break;
      }
      case "navigate":
        if (n.navigation_path) {
          history.pushState(null, "", n.navigation_path);
          const r = new Event("location-changed");
          r.detail = { replace: !1 }, window.dispatchEvent(r);
        }
        break;
      case "url":
        n.url_path && window.open(n.url_path);
        break;
      case "perform-action":
      case "call-service": {
        const r = Lr(n);
        r && t.callService(r.domain, r.service, r.data, r.target);
        break;
      }
      case "fire-dom-event":
        e.dispatchEvent(new CustomEvent("ll-custom", { detail: n, bubbles: !0, composed: !0 }));
        break;
    }
  }
}
const qd = 0.75, St = 8, Gd = 400;
function ii(e, t) {
  return typeof e == "number" && Number.isFinite(e) && e > 0 ? e : t;
}
function Kd(e) {
  let t = 0;
  for (let i = 0, n = e.length - 1; i < e.length; n = i++)
    t += e[n].x * e[i].y - e[i].x * e[n].y;
  return t / 2;
}
function Vd(e, t, i, n) {
  const r = n.x - i.x, o = n.y - i.y, a = r * r + o * o;
  if (a === 0) return Math.hypot(e - i.x, t - i.y);
  let l = ((e - i.x) * r + (t - i.y) * o) / a;
  return l = Math.max(0, Math.min(1, l)), Math.hypot(e - (i.x + l * r), t - (i.y + l * o));
}
function Zd(e, t) {
  const i = [];
  for (let n = 0; n < e.length; n++) {
    const r = e[n], o = r.b.x - r.a.x, a = r.b.y - r.a.y, l = Math.hypot(o, a);
    if (l <= t) continue;
    const s = [0, 1], c = t / l;
    for (let p = 0; p < e.length; p++) {
      if (p === n) continue;
      const d = e[p], h = d.b.x - d.a.x, m = d.b.y - d.a.y, b = o * m - a * h;
      if (Math.abs(b) > 1e-9) {
        const y = ((d.a.x - r.a.x) * m - (d.a.y - r.a.y) * h) / b, v = ((d.a.x - r.a.x) * a - (d.a.y - r.a.y) * o) / b, w = t / Math.max(Math.hypot(h, m), 1e-9);
        y > c && y < 1 - c && v >= -w && v <= 1 + w && s.push(y);
        continue;
      }
      for (const y of [d.a, d.b]) {
        const v = ((y.x - r.a.x) * o + (y.y - r.a.y) * a) / (l * l);
        if (v <= c || v >= 1 - c) continue;
        const w = r.a.x + v * o, $ = r.a.y + v * a;
        Math.hypot(y.x - w, y.y - $) <= t && s.push(v);
      }
    }
    s.sort((p, d) => p - d);
    for (let p = 1; p < s.length; p++) {
      const d = s[p - 1], h = s[p];
      h - d <= c || i.push({
        a: { x: r.a.x + d * o, y: r.a.y + d * a },
        b: { x: r.a.x + h * o, y: r.a.y + h * a }
      });
    }
  }
  return i;
}
function Xd(e, t) {
  const i = [], n = /* @__PURE__ */ new Map(), r = (c) => Math.floor(c / t), o = (c) => {
    const p = r(c.x), d = r(c.y);
    for (let y = -1; y <= 1; y++)
      for (let v = -1; v <= 1; v++)
        for (const w of n.get(`${p + y}:${d + v}`) ?? [])
          if (Math.hypot(i[w].x - c.x, i[w].y - c.y) <= t) return w;
    const h = i.push({ x: c.x, y: c.y }) - 1, m = `${p}:${d}`, b = n.get(m);
    return b ? b.push(h) : n.set(m, [h]), h;
  }, a = /* @__PURE__ */ new Map(), l = (c) => {
    let p = a.get(c);
    return p || a.set(c, p = /* @__PURE__ */ new Set()), p;
  };
  for (const c of e) {
    const p = o(c.a), d = o(c.b);
    p !== d && (l(p).add(d), l(d).add(p));
  }
  const s = i.map(
    (c, p) => [...a.get(p) ?? []].sort(
      (d, h) => Math.atan2(i[d].y - c.y, i[d].x - c.x) - Math.atan2(i[h].y - c.y, i[h].x - c.x)
    )
  );
  return { points: i, neighbors: s };
}
function Yd(e, t) {
  const { points: i, neighbors: n } = Xd(e, t), r = /* @__PURE__ */ new Set(), o = [];
  for (let a = 0; a < i.length; a++)
    for (const l of n[a]) {
      if (r.has(`${a}>${l}`)) continue;
      const s = [];
      let c = a, p = l, d = !1;
      for (let h = 0; h <= i.length * i.length + 4; h++) {
        r.add(`${c}>${p}`), s.push(c);
        const m = n[p], b = m.indexOf(c), y = m[(b - 1 + m.length) % m.length];
        if (c = p, p = y, c === a && p === l) {
          d = !0;
          break;
        }
      }
      d && s.length >= 3 && o.push(s.map((h) => ({ x: i[h].x, y: i[h].y })));
    }
  return o;
}
function Qd(e, t, i) {
  for (let n = 0, r = e.length - 1; n < e.length; r = n++)
    for (const o of t)
      if (Vd(o.x, o.y, e[r], e[n]) <= i) return !0;
  return !1;
}
function Jd(e, t, i = {}) {
  const n = ii(i.weldEps, qd), r = ii(i.openingEps, St), o = ii(i.minArea, Gd);
  if (e.length < 3) return [];
  const a = Zd(
    e.map((s) => ({ a: { x: s.x1, y: s.y1 }, b: { x: s.x2, y: s.y2 } })),
    n
  );
  return Yd(a, n).map((s) => ({ ring: s, area: Kd(s) })).filter((s) => s.area >= o && !Qd(s.ring, t, r)).sort((s, c) => c.area - s.area).map((s) => s.ring);
}
const Un = /* @__PURE__ */ new WeakMap();
function Fr(e, t) {
  const i = Un.get(e);
  if (i && i.openings === t) return i.out;
  const n = Jd(e, t);
  return Un.set(e, { openings: t, out: n }), n;
}
const H = 8, Rr = 0.05, Ve = "—";
function it(e, t) {
  if (!t || !e) return Ve;
  const i = e.states[t];
  return i ? e.formatEntityState(i) : Ve;
}
function zr(e, t, i) {
  if (e.formatEntityState !== t.formatEntityState) return !0;
  for (const n of i)
    if (e.states[n] !== t.states[n]) return !0;
  return !1;
}
function We(e) {
  const t = /* @__PURE__ */ new Set();
  (e.sunDimming || e.sunlight && !Zt(e)) && t.add("sun.sun");
  for (const i of Fe(e)) {
    for (const n of i.openings)
      n.entity && t.add(n.entity), n.shutterEntity && t.add(n.shutterEntity), n.secondaryEntity && t.add(n.secondaryEntity), n.shutterSecondaryEntity && t.add(n.shutterSecondaryEntity);
    for (const n of i.items) {
      n.entity && t.add(n.entity), n.hideEntity && t.add(n.hideEntity), n.hideStateEntity && t.add(n.hideStateEntity), n.hideBadgeEntity && t.add(n.hideBadgeEntity);
      for (const r of ue(n)) r.entity && t.add(r.entity);
    }
    for (const n of i.texts)
      n.entity && t.add(n.entity);
    for (const n of i.furniture)
      n.entity && t.add(n.entity);
    for (const n of i.areas)
      n.entity && t.add(n.entity);
    for (const n of i.trackers)
      for (const r of [n.xSensor, n.ySensor])
        r?.entity && t.add(r.entity), r?.presence?.entity && t.add(r.presence.entity);
  }
  return t;
}
function zi(e, t, i) {
  if (!t || !e) return Ve;
  const n = e.states[t];
  if (!n) return Ve;
  const r = e.formatEntityAttributeValue;
  if (typeof r == "function") return r(n, i);
  const o = n.attributes?.[i];
  return o == null || o === "" ? Ve : String(o);
}
function eh(e, t, i) {
  const n = i.entity || (i.attribute ? t.entity : void 0);
  return n ? i.attribute ? zi(e, n, i.attribute) : it(e, n) : "";
}
function ue(e) {
  return [...e.secondaryEntity || e.secondaryAttribute ? [{ entity: e.secondaryEntity, attribute: e.secondaryAttribute }] : [], ...e.readings ?? []];
}
function th(e, t) {
  return t.attribute ? zi(e, t.entity, t.attribute) : it(e, t.entity);
}
function Di(e, t) {
  if (!t.entity) return t.text ?? "";
  const i = t.attribute ? zi(e, t.entity, t.attribute) : it(e, t.entity);
  return t.text ? `${t.text} ${i}` : i;
}
function Kt(e, t) {
  return Dr(e, t)?.color;
}
function Dr(e, t) {
  if (!e?.length) return;
  const i = typeof t == "number" ? t : Number(t), n = typeof t != "boolean" && t !== "" && t != null && Number.isFinite(i), r = t == null ? "" : String(t).trim().toLowerCase();
  let o, a, l;
  for (const s of e)
    !s || typeof s != "object" || typeof s.color != "string" || (typeof s.state == "string" && s.state !== "" ? o === void 0 && r !== "" && s.state.trim().toLowerCase() === r && (o = s) : typeof s.above == "number" ? n && i > s.above && (!a || s.above > (a.above ?? -1 / 0)) && (a = s) : l === void 0 && (l = s));
  return o ?? a ?? l;
}
function ih(e, t) {
  if (!e.entity) return;
  const i = Kt(e.stateColor, t);
  if (i) return R(i);
  if (e.activeColor && oe(e.entity, t)) return R(e.activeColor);
}
function Bn(e, t) {
  if (!e.entity) return;
  const i = Kt(e.stateColor, t);
  if (i) return R(i);
  if (e.activeColor && oe(e.entity, t)) return R(e.activeColor);
}
function Ni(e, t) {
  if (!t || t.state !== "on") return;
  const i = t.attributes ?? {}, n = i.brightness, r = typeof n == "number" && Number.isFinite(n) ? Math.max(0, Math.min(255, n)) : void 0, o = r === void 0 ? xt : Cn + (xt - Cn) * (r / 255), a = C(e.glowRadius, Ht) * (r === void 0 ? 1 : Mn + (1 - Mn) * (r / 255)), l = i.rgb_color;
  if (Array.isArray(l) && l.length >= 3) {
    const [s, c, p] = l;
    if ([s, c, p].every((d) => typeof d == "number" && Number.isFinite(d))) {
      const d = (m) => Math.max(0, Math.min(255, Math.round(m))), h = R(`rgb(${d(s)}, ${d(c)}, ${d(p)})`);
      if (h) return { color: h, opacity: o, radius: a };
    }
  }
  return { color: K(e.glowColor, Mr), opacity: o, radius: a };
}
function Nr(e) {
  if (!e || e.state !== "on") return;
  const t = e.attributes ?? {}, i = t.rgb_color;
  if (!Array.isArray(i) || i.length < 3) return;
  const [n, r, o] = i;
  if (![n, r, o].every((p) => typeof p == "number" && Number.isFinite(p))) return;
  const a = t.brightness, l = typeof a == "number" && Number.isFinite(a) ? Math.max(0, Math.min(255, a)) : void 0, s = l === void 0 ? 1 : In + (1 - In) * (l / 255), c = (p) => Math.max(0, Math.min(255, Math.round(p * s)));
  return R(`rgb(${c(n)}, ${c(r)}, ${c(o)})`);
}
function nh(e, t) {
  return t ? Ni(e, t) : {
    color: K(e.glowColor, Mr),
    opacity: xt,
    radius: C(e.glowRadius, Ht)
  };
}
function Hi(e, t, i) {
  const n = i.x2 - i.x1, r = i.y2 - i.y1, o = n * n + r * r, a = o === 0 ? 0 : Math.max(0, Math.min(1, ((e - i.x1) * n + (t - i.y1) * r) / o)), l = i.x1 + a * n, s = i.y1 + a * r;
  return Math.hypot(e - l, t - s);
}
function ji(e, t, i, n, r) {
  const o = r.x2 - r.x1, a = r.y2 - r.y1, l = i * a - n * o;
  if (Math.abs(l) < 1e-12) return;
  const s = r.x1 - e, c = r.y1 - t, p = (s * a - c * o) / l, d = (s * n - c * i) / l;
  if (!(p <= 1e-9 || d < 0 || d > 1))
    return p;
}
function rh(e, t, i, n, r) {
  const o = e.x2 - e.x1, a = e.y2 - e.y1, l = [-o, o, -a, a], s = [e.x1 - t, n - e.x1, e.y1 - i, r - e.y1];
  let c = 0, p = 1;
  for (let d = 0; d < 4; d++) {
    if (l[d] === 0) {
      if (s[d] < 0) return;
      continue;
    }
    const h = s[d] / l[d];
    if (l[d] < 0) {
      if (h > p) return;
      h > c && (c = h);
    } else {
      if (h < c) return;
      h < p && (p = h);
    }
  }
  return {
    ...e,
    x1: e.x1 + c * o,
    y1: e.y1 + c * a,
    x2: e.x1 + p * o,
    y2: e.y1 + p * a
  };
}
function Hr(e, t, i) {
  if (W(e) === "fixed") return 0;
  const n = Math.max(0, Math.min(1, t)), r = Math.max(0, Math.min(1, i ?? t));
  if (W(e) === "swing")
    return pe(e) === "double" ? (n + r) / 2 : n * Ki(e);
  switch (Vt(e)) {
    case "biparting":
      return (n + r) / 2;
    case "biparting-bypass":
    case "converging":
      return (n + r) / 4;
    default:
      return n;
  }
}
function jr(e, t, i, n) {
  return n !== void 0 && n <= 0 ? [0, 0] : Ji(e) && W(e) !== "roll" ? [0, 1] : oh(e, t, i);
}
function oh(e, t, i) {
  const n = Hr(e, t, i), r = [(1 - n) / 2, (1 + n) / 2];
  if (Ki(e) < 1) {
    const s = [0, n];
    return e.flipH ? [1 - s[1], 1 - s[0]] : s;
  }
  if (W(e) !== "swing" || pe(e) !== "double") return r;
  const o = Math.max(0, Math.min(1, t)), a = Math.max(0, Math.min(1, i ?? t)), l = [0.5 - o / 2, 0.5 + a / 2];
  return e.flipH ? [1 - l[1], 1 - l[0]] : l;
}
function Ui(e, t, i) {
  const n = [];
  for (const o of t) {
    const a = i(o), l = (c) => Math.max(0, Math.min(1, c)), s = typeof a == "number" ? [(1 - l(a)) / 2, (1 + l(a)) / 2] : [l(Math.min(a[0], a[1])), l(Math.max(a[0], a[1]))];
    s[1] > s[0] && n.push({ o, span: s });
  }
  if (!n.length) return e;
  const r = [];
  for (const o of e) {
    const a = o.x2 - o.x1, l = o.y2 - o.y1, s = a * a + l * l;
    if (s === 0) {
      r.push(o);
      continue;
    }
    const c = Math.sqrt(s), p = [];
    for (const { o: v, span: w } of n) {
      if (Hi(v.x, v.y, o) > St) continue;
      const $ = ((v.x - o.x1) * a + (v.y - o.y1) * l) / s, f = Math.cos(v.angle * Math.PI / 180) * a + Math.sin(v.angle * Math.PI / 180) * l >= 0 ? 1 : -1, k = (G) => f * (G - 0.5) * v.length / c, A = $ + k(w[0]), O = $ + k(w[1]), T = Math.max(0, Math.min(A, O)), q = Math.min(1, Math.max(A, O));
      q > T && p.push([T, q]);
    }
    if (!p.length) {
      r.push(o);
      continue;
    }
    p.sort((v, w) => v[0] - w[0]);
    const d = [p[0]];
    for (const v of p.slice(1)) {
      const w = d[d.length - 1];
      v[0] <= w[1] ? w[1] = Math.max(w[1], v[1]) : d.push(v);
    }
    const h = (v) => ({ x: o.x1 + a * v, y: o.y1 + l * v });
    let m = 0, b = 0;
    const y = (v, w) => {
      if ((w - v) * c < H / 2) return;
      const $ = h(v), f = h(w);
      r.push({ id: `${o.id}#${b++}`, x1: $.x, y1: $.y, x2: f.x, y2: f.y });
    };
    for (const [v, w] of d)
      y(m, v), m = w;
    y(m, 1);
  }
  return r;
}
function Ur(e, t, i, n) {
  const r = n.filter((d) => {
    const h = Hi(e, t, d);
    return h < i && h > H;
  });
  if (!r.length) return;
  const o = i * 1.01, a = [
    { id: "b1", x1: e - o, y1: t - o, x2: e + o, y2: t - o },
    { id: "b2", x1: e + o, y1: t - o, x2: e + o, y2: t + o },
    { id: "b3", x1: e + o, y1: t + o, x2: e - o, y2: t + o },
    { id: "b4", x1: e - o, y1: t + o, x2: e - o, y2: t - o }
  ], l = r.map((d) => rh(d, e - o, t - o, e + o, t + o)).filter((d) => d !== void 0);
  if (!l.length) return;
  const s = [...l, ...a], c = [];
  for (const d of s)
    for (const [h, m] of [
      [d.x1, d.y1],
      [d.x2, d.y2]
    ]) {
      const b = Math.atan2(m - t, h - e);
      for (const y of [b - 1e-4, b, b + 1e-4]) {
        const v = Math.cos(y), w = Math.sin(y);
        let $ = 1 / 0;
        for (const f of s) {
          const k = ji(e, t, v, w, f);
          k !== void 0 && k < $ && ($ = k);
        }
        $ < 1 / 0 && c.push({ x: e + v * $, y: t + w * $, a: y });
      }
    }
  c.sort((d, h) => d.a - h.a);
  const p = (d) => Math.round(d * 100) / 100;
  return c.map(({ x: d, y: h }) => ({ x: p(d), y: p(h) }));
}
function Br(e, t, i, n) {
  const r = t.radius, o = n?.length ? Ur(e.x, e.y, r, n) : void 0, a = `${i}-clip`;
  return _`
    ${o ? _`<clipPath id=${a}>
                <polygon points=${o.map((l) => `${l.x},${l.y}`).join(" ")} />
              </clipPath>` : u}
    <radialGradient id=${i} gradientUnits="userSpaceOnUse"
                    cx=${e.x} cy=${e.y} r=${r}>
      <stop offset="0" stop-color=${t.color} stop-opacity=${t.opacity} />
      <stop offset="1" stop-color=${t.color} stop-opacity="0" />
    </radialGradient>
    <circle class="fp-glow" cx=${e.x} cy=${e.y} r=${r}
            fill=${`url(#${i})`}
            clip-path=${o ? `url(#${a})` : u} />`;
}
function ah(e, t, i, n, r, o) {
  const a = e.map((s) => {
    if (!s.glow) return;
    const c = Ni(s, t?.[s.entity]);
    if (c)
      return {
        // Normalized against the glow's own ceiling, so a full-brightness lamp
        // clears the dim entirely and a dim one clears proportionally.
        strength: Math.max(0, Math.min(1, c.opacity / xt)),
        // Straight off the paint, so the clearing tracks the pool as it shrinks
        // with brightness (issue #123) instead of staying at the configured size.
        radius: c.radius
      };
  });
  if (!a.some((s) => s !== void 0)) return u;
  const l = H;
  return _`
    <defs>
      <mask id=${r} maskUnits="userSpaceOnUse"
            x=${-l} y=${-l} width=${i + l * 2} height=${n + l * 2}>
        <rect x=${-l} y=${-l} width=${i + l * 2} height=${n + l * 2}
              fill="white" />
        ${e.map((s, c) => {
    const p = a[c];
    if (p === void 0) return u;
    const { strength: d, radius: h } = p, m = `${r}-${c}`, b = o?.length ? Ur(s.x, s.y, h, o) : void 0, y = `${m}-clip`;
    return _`
            ${b ? _`<clipPath id=${y}>
                        <polygon points=${b.map((v) => `${v.x},${v.y}`).join(" ")} />
                      </clipPath>` : u}
            <radialGradient id=${m} gradientUnits="userSpaceOnUse"
                            cx=${s.x} cy=${s.y} r=${h}>
              <stop offset="0" stop-color="#000" stop-opacity=${d} />
              <stop offset="1" stop-color="#000" stop-opacity="0" />
            </radialGradient>
            <circle cx=${s.x} cy=${s.y} r=${h} fill=${`url(#${m})`}
                    clip-path=${b ? `url(#${y})` : u} />`;
  })}
      </mask>
    </defs>`;
}
function Wr(e, t, i, n, r = re) {
  const o = H;
  return _`
    <defs>
      <mask id=${n} maskUnits="userSpaceOnUse"
            x=${-o} y=${-o} width=${t + o * 2} height=${i + o * 2}>
        <rect x=${-o} y=${-o} width=${t + o * 2} height=${i + o * 2}
              fill="white" />
        ${e.map((a) => {
    const l = a.angle ? `rotate(${a.angle} ${a.x} ${a.y})` : void 0, s = Gt(r, a.type)?.footprint === "ellipse", c = 1 - Wa;
    return s ? _`<ellipse cx=${a.x} cy=${a.y} rx=${a.w / 2} ry=${a.h / 2}
                           fill="#000" fill-opacity=${c} transform=${l ?? u} />` : _`<rect x=${a.x - a.w / 2} y=${a.y - a.h / 2} width=${a.w} height=${a.h}
                        fill="#000" fill-opacity=${c} transform=${l ?? u} />`;
  })}
      </mask>
    </defs>`;
}
function qr(e, t, i) {
  if (e.enableHideByEntity) {
    const n = e.hideEntity || e.entity;
    let r = t;
    return n && i && i.states[n] && (r = e.hideAttribute ? i.states[n].attributes[e.hideAttribute] : i.states[n].state), Bi(
      r,
      e.hideMode,
      e.hideState,
      e.hideOperator,
      e.hideThreshold,
      e.hideInvert
    );
  }
  return e.hideWhenInactive ? e.entity ? !oe(e.entity, t) : !0 : !1;
}
function sh(e, t, i) {
  if (!e.enableHideBadgeByEntity) return !1;
  let n = t;
  if (i) {
    const r = e.hideBadgeEntity || e.entity;
    r && i.states[r] && (n = e.hideBadgeAttribute && i.states[r].attributes ? String(i.states[r].attributes[e.hideBadgeAttribute]) : i.states[r].state);
  }
  return Bi(
    n,
    e.hideBadgeMode,
    e.hideBadgeMatch,
    // Ensure this property is correctly mapped in your types, or use hideBadgeState
    e.hideBadgeOperator,
    e.hideBadgeThreshold,
    e.hideBadgeInvert
  );
}
const Gr = 12;
function Kr(e, t) {
  const i = [];
  if (t.showName) {
    const r = t.entity ? e?.states[t.entity]?.attributes?.friendly_name : void 0, o = t.name || r || t.entity;
    o && i.push(o);
  }
  let n = !1;
  if (t.enableHideStateByEntity && e) {
    const r = t.hideStateEntity || t.entity;
    let o;
    r && e.states[r] && (o = t.hideStateAttribute && e.states[r].attributes ? e.states[r].attributes[t.hideStateAttribute] : e.states[r].state), n = Bi(
      o,
      t.hideStateMode,
      t.hideStateMatch,
      t.hideStateOperator,
      t.hideStateThreshold,
      t.hideStateInvert
    );
  }
  if (t.entity && (t.showState ?? t.kind === "sensor") && !n && i.push(th(e, t)), !n)
    for (const r of ue(t)) {
      if (r.showState === !1) continue;
      const o = eh(e, t, r);
      o && i.push(o);
    }
  return i.join(" · ");
}
const Wn = /* @__PURE__ */ new Set(["unavailable", "unknown"]);
function Bi(e, t = "state", i, n = "==", r, o = !1) {
  if (e == null || e === "") return !1;
  let a = !1;
  if (t === "threshold") {
    if (r == null) return !1;
    const l = Number(e);
    if (!Number.isFinite(l)) return !1;
    switch (n) {
      case "<":
        a = l < r;
        break;
      case "<=":
        a = l <= r;
        break;
      case "==":
        a = l === r;
        break;
      case "!=":
        a = l !== r;
        break;
      case ">=":
        a = l >= r;
        break;
      case ">":
        a = l > r;
        break;
      default:
        return !1;
    }
  } else {
    if (i == null || String(i).trim() === "") return !1;
    const l = String(e).trim().toLowerCase(), s = String(i).trim().toLowerCase();
    if (Wn.has(l) && !Wn.has(s))
      return !1;
    a = n === "!=" ? l !== s : l === s;
  }
  return o ? !a : a;
}
function lh(e) {
  return e.showName || (e.showState ?? e.kind === "sensor") ? !0 : ue(e).some((t) => t.showState !== !1 && (t.entity || t.attribute));
}
function Wi(e) {
  const t = e.labelPosition;
  return t === "left" || t === "right" ? t : "below";
}
function ch(e, t) {
  const i = Kr(e, t);
  return i ? { text: i, live: !0 } : { text: t.name || t.entity || t.kind, live: !1 };
}
function Vr(e) {
  return Math.min(40, Math.max(8, C(e, Gr)));
}
function Zr(e, t) {
  if (!e.disableLabelColor) return t;
  if (e.useCustomLabelColor)
    return R(e.labelCustomColor) ?? void 0;
}
function dh(e) {
  return Math.min(40, Math.max(8, C(e, Oi)));
}
function hh(e) {
  return Math.min(xr, Math.max(2, C(e, H)));
}
function Xr(e) {
  return e === void 0 ? "" : `stroke-width:${hh(e)};`;
}
function qi(e) {
  return e === "plan" ? "plan" : "fixed";
}
function F(e, t) {
  return t === "plan" ? `calc(${e} * var(--fp-u, 1px))` : `${e}px`;
}
function ph(e, t) {
  return t !== "plan" && e === void 0 ? "" : `font-size:${F(dh(e), t)};`;
}
function qn(e) {
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
const uh = {
  media_player: { on: "mdi:television-play", off: "mdi:television-off" },
  fan: { on: "mdi:fan", off: "mdi:fan-off" },
  lock: { on: "mdi:lock-open-variant", off: "mdi:lock" },
  camera: { on: "mdi:cctv", off: "mdi:cctv-off" },
  humidifier: { on: "mdi:air-humidifier", off: "mdi:air-humidifier-off" },
  vacuum: { on: "mdi:robot-vacuum", off: "mdi:robot-vacuum-variant" }
}, fh = {
  paused: "mdi:television-pause",
  idle: "mdi:television"
}, mh = {
  off: "mdi:power",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  heat_cool: "mdi:sun-snowflake-variant",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan"
}, gh = {
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
}, yh = {
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
}, bh = {
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
}, vh = {
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
function _h(e) {
  return e === "on" || e === "open" || e === "home" || e === "playing";
}
const wh = {
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
function oe(e, t) {
  if (!t || t === "unavailable" || t === "unknown") return !1;
  const i = e?.split(".")[0] ?? "", n = wh[i];
  return n ? n.has(t) : _h(t);
}
const xh = {
  fan: "spin",
  media_player: "pulse",
  vacuum: "pulse"
};
function Yr(e) {
  return xh[e?.split(".")[0] ?? ""];
}
const $h = /* @__PURE__ */ new Set(["idle", "off"]);
function kh(e) {
  const t = e?.hvac_action;
  return typeof t != "string" ? !0 : !$h.has(t);
}
function Qr(e, t, i) {
  const n = e.iconAnimation ?? "auto";
  if (n !== "none" && oe(e.entity, t)) {
    if (e.entity?.split(".")[0] === "climate") {
      if (!kh(i)) return;
      if (t === "fan_only") return "spin";
    }
    return n === "spin" || n === "pulse" ? n : Yr(e.entity);
  }
}
const Sh = /* @__PURE__ */ new Set(["motion", "occupancy", "presence", "vibration"]);
function Jr(e, t) {
  const i = e?.split(".")[0];
  return i === "device_tracker" || i === "person" ? !0 : i === "binary_sensor" && !!t && Sh.has(t);
}
function eo(e, t, i, n) {
  const r = e.split(".")[0];
  if (r === "climate")
    return mh[n ?? ""] ?? (i ? "mdi:thermostat" : "mdi:power");
  if (r === "weather") return gh[n ?? ""] ?? "mdi:weather-cloudy";
  if (r === "media_player" && n) {
    const a = fh[n];
    if (a) return a;
  }
  const o = uh[r];
  if (o) return i ? o.on : o.off;
  if (t) {
    if (r === "binary_sensor") {
      const a = yh[t];
      return a ? i ? a.on : a.off : void 0;
    }
    if (r === "sensor") return bh[t];
    if (r === "cover") {
      const a = vh[t];
      return a ? i ? a.on : a.off : void 0;
    }
  }
}
function Gi(e, t) {
  if (t)
    return e.attribute ? t.attributes?.[e.attribute] : t.state;
}
function hi(e, t, i) {
  const n = Ge(Dr(e.stateColor, Gi(e, t))?.icon);
  if (n) return n;
  const r = Ge(e.icon);
  if (r) return r;
  if (!e.entity) return qn(e.kind);
  if (i) return i;
  const o = t?.attributes?.icon;
  return o || (eo(
    e.entity,
    t?.attributes?.device_class,
    oe(e.entity, t?.state),
    t?.state
  ) ?? qn(e.kind));
}
function to(e) {
  const t = Math.round(e);
  let i = Math.round(t * 0.62);
  return i % 2 !== t % 2 && (i += 1), Math.max(2, i);
}
function nt(e) {
  return e.badgeContent === "icon" || e.badgeContent === "value" || e.badgeContent === "none" ? e.badgeContent : e.showIcon === !1 ? "none" : "icon";
}
function ht(e) {
  const t = e.pressEffect;
  return t === "scale" || t === "ripple" || t === "flash" || t === "none" ? t : Ar;
}
function Eh(e, t, i) {
  if (e.goToFloor !== "up" && e.goToFloor !== "down") return;
  const n = t.findIndex((o) => o.id === i);
  return n < 0 ? void 0 : t[n + (e.goToFloor === "up" ? 1 : -1)]?.id;
}
function io(e) {
  const t = e.offlineStyle;
  return t === "dim" || t === "strike" || t === "none" ? t : Tr;
}
function Ah(e, t) {
  return e.entity ? t === void 0 || ze(t) : !1;
}
const Th = {
  climate: { attribute: "current_temperature", unit: "°" },
  water_heater: { attribute: "current_temperature", unit: "°" },
  humidifier: { attribute: "current_humidity", unit: "%" }
};
function Ue(e) {
  if (e == null || typeof e == "boolean" || typeof e == "string" && e.trim() === "") return;
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? t : void 0;
}
function Ch(e) {
  if (typeof e != "string") return "";
  const t = e.trim();
  return t === "°C" || t === "°F" || t === "K" ? "°" : t === "ppm" || t === "ppb" ? "" : t.length <= 3 ? t : "";
}
function pt(e) {
  return Math.abs(e) < 10 && !Number.isInteger(e) ? e.toFixed(1) : String(Math.round(e));
}
function Mh(e, t) {
  return t === "W" && Math.abs(e) >= 1e3 ? { n: e / 1e3, unit: "kW" } : { n: e, unit: t };
}
function Gn(e, t) {
  const i = Mh(e, Ch(t));
  return pt(i.n) + i.unit;
}
function no(e, t) {
  return oo(e, t)?.text;
}
function ro(e) {
  return e === "primary" ? "primary" : e === "secondary" ? 0 : typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : void 0;
}
function oo(e, t) {
  if (!e || !t.entity) return;
  const i = ue(t), n = () => {
    const l = e.states[t.entity], s = l?.attributes, c = Th[t.entity.split(".")[0]];
    if (t.attribute) {
      const d = Ue(s?.[t.attribute]);
      if (d !== void 0)
        return pt(d) + (t.attribute === c?.attribute ? c.unit : "");
    }
    if (c) {
      const d = Ue(s?.[c.attribute]);
      if (d !== void 0) return pt(d) + c.unit;
    }
    const p = Ue(l?.state);
    return p === void 0 ? void 0 : Gn(p, s?.unit_of_measurement);
  }, r = (l) => {
    const s = i[l];
    if (!s) return;
    const c = s.entity || (s.attribute ? t.entity : void 0);
    if (!c) return;
    const p = e.states[c], d = p?.attributes;
    if (s.attribute) {
      const m = Ue(d?.[s.attribute]);
      return m === void 0 ? void 0 : pt(m);
    }
    const h = Ue(p?.state);
    return h === void 0 ? void 0 : Gn(h, d?.unit_of_measurement);
  }, o = ro(t.badgeEntity);
  if (o === "primary") {
    const l = n();
    return l === void 0 ? void 0 : { text: l, source: "primary" };
  }
  if (typeof o == "number") {
    const l = r(o);
    return l === void 0 ? void 0 : { text: l, source: o };
  }
  const a = n();
  if (a !== void 0) return { text: a, source: "primary" };
  for (let l = 0; l < i.length; l++) {
    const s = r(l);
    if (s !== void 0) return { text: s, source: l };
  }
}
const Ih = { ".": 0.28, "-": 0.38, "°": 0.45, "%": 1, k: 0.58 }, Ph = 0.7, Oh = 0.85;
function Kn(e) {
  let t = 0;
  for (const i of e)
    t += Ih[i] ?? (i >= "0" && i <= "9" ? Ph : Oh);
  return t;
}
function ao(e, t) {
  const i = Math.round(C(e, we)), n = Math.max(0, i - 6), r = Kn(t) > 0 ? n / Kn(t) : i;
  let o = Math.round(Math.min(i * 0.46, r));
  return o % 2 !== i % 2 && (o -= 1), Math.max(6, o);
}
function Vn(e) {
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
function W(e) {
  return e.motion ?? "swing";
}
function Ki(e) {
  if (W(e) !== "swing" || pe(e) !== "single") return 1;
  const t = e.sashSpan;
  return typeof t != "number" || !Number.isFinite(t) ? 1 : Math.max(Rr, Math.min(1, t));
}
function Vi(e) {
  const t = e.type === "door" && W(e) === "swing";
  return e.invert ? !t : t;
}
function Lh(e) {
  return { sx: e.flipH ? -1 : 1, sy: e.flipV ? -1 : 1 };
}
function Vt(e) {
  return W(e) === "slide" ? e.sliderStyle ?? "single" : "single";
}
function so(e) {
  return e === "biparting" || e === "biparting-bypass" || e === "converging";
}
function Ze(e) {
  return W(e) === "swing" ? pe(e) === "double" : so(Vt(e));
}
function lo(e) {
  return { ...e, entity: e.secondaryEntity };
}
function pi(e) {
  return e === "window" ? "double" : "single";
}
function pe(e) {
  return W(e) === "swing" ? e.sash ?? pi(e.type) : pi(e.type);
}
function Pe(e) {
  return e.shutterStyle === "roll" || e.shutterStyle === "swing" ? e.shutterStyle : e.shutterEntity?.split(".")[0] === "binary_sensor" ? "swing" : "roll";
}
function le(e, t = !1) {
  if (!e || ze(e.state)) return 0;
  const i = e.attributes?.current_position;
  if (typeof i == "number" && Number.isFinite(i)) {
    const r = Math.max(0, Math.min(1, i / 100));
    return t ? 1 - r : r;
  }
  const n = e.state === "open" || e.state === "opening" || e.state === "closing" || e.state === "on";
  return (t ? !n : n) ? 1 : 0;
}
function ut(e, t = !1) {
  return !e || ze(e.state) ? !1 : le(e, t) > 0 || e.state === "opening" || e.state === "closing";
}
const Fh = /* @__PURE__ */ new Set(["window", "blind", "shade", "shutter", "curtain", "awning"]), Rh = /* @__PURE__ */ new Set(["blind", "shade", "curtain"]), zh = /* @__PURE__ */ new Set(["garage", "garage_door", "shutter"]);
function Dh(e) {
  const t = e ?? "";
  return {
    type: Fh.has(t) ? "window" : "door",
    motion: zh.has(t) ? "roll" : Rh.has(t) ? "slide" : void 0
  };
}
const Nh = 3;
function Hh(e, t) {
  return e.split(".")[0] === "cover" && t & Nh ? "cover-toggle" : "more-info";
}
function Zi(e, t, i) {
  const n = e.entity || void 0, r = e.shutterEntity || void 0, o = !!(n && r && e.tapTarget === "shutter"), a = o ? r : n ?? r, l = n && r ? o ? n : r : void 0, s = t === "tap" ? e.tap_action : t === "hold" ? e.hold_action : e.double_tap_action;
  if (s) return { entity: s.entity ?? a, config: s };
  if (t === "tap")
    return a ? {
      entity: a,
      config: {
        action: (
          // Pointing the tap at the shutter opens its dialog; it does not
          // drive the motor. Choosing *which* entity answers is not the same
          // as choosing to move hardware on a tap, and that second decision
          // stays where it is explicit — `tap_action: toggle` (issue #47).
          !o && Hh(a, i(a)) === "cover-toggle" ? "toggle" : "more-info"
        )
      }
    } : void 0;
  if (t === "hold" && l) return { entity: l, config: { action: "more-info" } };
}
function ft(e, t) {
  const i = t === "tap" ? e.tap_action : t === "hold" ? e.hold_action : e.double_tap_action;
  if (i)
    return { entity: i.entity ?? e.entity, config: i };
}
function jh(e) {
  return ["tap", "hold", "double_tap"].some(
    (t) => ae(ft(e, t)?.config)
  );
}
function Uh(e, t) {
  return ["tap", "hold", "double_tap"].some(
    (i) => ae(Zi(e, i, t)?.config)
  );
}
function ze(e) {
  return e === "unavailable" || e === "unknown";
}
function Bh(e, t) {
  if (!e.entity || t === void 0) return Vi(e);
  if (Wh(e.entity, t)) return !1;
  const i = qh(e.entity, t);
  return e.invert ? !i : i;
}
function Wh(e, t) {
  return ze(t) ? !0 : e.split(".")[0] === "lock" && t === "jammed";
}
function qh(e, t) {
  return e.split(".")[0] === "lock" ? oe(e, t) : t === "on" || t === "open" || t === "opening" || t === "closing";
}
function Gh(e) {
  return e === "opening" || e === "closing";
}
function Oe(e, t) {
  if (!e.entity || !t) return Vi(e) ? 1 : 0;
  if (ze(t.state)) return 0;
  const i = t.attributes?.current_position;
  if (typeof i == "number" && Number.isFinite(i)) {
    const n = Math.max(0, Math.min(1, i / 100));
    return e.invert ? 1 - n : n;
  }
  return Bh(e, t.state) ? 1 : 0;
}
function ui(e, t) {
  return !e.entity || !t || ze(t.state) ? !1 : Gh(t.state) || Oe(e, t) > 0;
}
function Zn(e, t, i) {
  const n = e / 2, r = 5, o = Math.max(3, Math.round(e / 12)), a = [];
  for (let l = 1; l < o; l++) {
    const s = -n + e * l / o;
    a.push(
      _`<line x1=${s} y1=${-r / 2} x2=${s} y2=${r / 2}
            stroke=${Nt} stroke-width="0.75" />`
    );
  }
  return _`<g class="fp-roll-curtain" style="transform:scaleY(${1 - i});">
      <rect x=${-n} y=${-r / 2} width=${e} height=${r}
            style="fill:${t};" />
      ${a}
    </g>`;
}
function Kh(e, t, i, n, r = 1, o = i, a = n) {
  const l = e / 2, s = 3, c = r * (t / 2 + s / 2), p = (d, h) => {
    const m = [], b = Math.max(2, Math.round(h / 14));
    for (let y = 1; y < b; y++) {
      const v = d + h * y / b;
      m.push(
        _`<line x1=${v} y1=${-s / 2} x2=${v} y2=${s / 2}
              stroke=${Nt} stroke-width="0.75" />`
      );
    }
    return m;
  };
  return _`
      <g transform="translate(${-l} ${c})">
        <g class="fp-door-leaf" style="transform:rotate(${r * 90 * n}deg);">
          <rect x="0" y=${-s / 2} width=${l} height=${s} style="fill:${i};" />
          ${p(0, l)}
        </g>
      </g>
      <g transform="translate(${l} ${c})">
        <g class="fp-leaf-r" style="transform:rotate(${-r * 90 * a}deg);">
          <rect x=${-l} y=${-s / 2} width=${l} height=${s} style="fill:${o};" />
          ${p(-l, l)}
        </g>
      </g>`;
}
const co = 22, Et = 14, At = 22, Tt = 15;
function Xi(e, t = 0) {
  const i = e.flipV ? -1 : 1, n = e.angle * Math.PI / 180, r = { x: -Math.sin(n) * i, y: Math.cos(n) * i };
  return t === 90 ? { x: -r.y, y: r.x } : t === 180 ? { x: -r.x, y: -r.y } : t === 270 ? { x: r.y, y: -r.x } : r;
}
function Yi(e, t = co) {
  const i = (e.flipV ? -1 : 1) * t, n = e.angle * Math.PI / 180;
  return { x: e.x - Math.sin(n) * i, y: e.y + Math.cos(n) * i };
}
function ho(e) {
  return !!(e.entity && e.shutterEntity) && (e.showShutterIcon ?? !0);
}
const Vh = { on: "mdi:window-shutter-open", off: "mdi:window-shutter" }, Xn = {
  door: { on: "mdi:door-open", off: "mdi:door-closed" },
  window: { on: "mdi:window-open", off: "mdi:window-closed" }
};
function po(e, t, i, n, r, o) {
  const a = Ge(t);
  if (a) return a;
  const l = Ge(o);
  if (l) return l;
  const s = Ge(i?.attributes?.icon);
  return s || (eo(e, i?.attributes?.device_class, n) ?? (n ? r.on : r.off));
}
function uo(e, t, i, n) {
  return po(
    e.shutterEntity ?? "",
    e.shutterIcon,
    t,
    i,
    Vh,
    n
  );
}
function fo(e) {
  return !!e.entity && (e.showIcon ?? !1);
}
function mo(e, t, i, n) {
  return po(
    e.entity ?? "",
    e.icon,
    t,
    i,
    Xn[e.type] ?? Xn.door,
    n
  );
}
function go(e) {
  return Yi(e, -co);
}
function yo(e, t = 0) {
  const i = Xi(e, t);
  return { x: -i.x, y: -i.y };
}
function bo(e, t) {
  const { color: i, open: n = !0, active: r = !1, accent: o = z } = t, a = e.length / 2, l = H + 4, s = K(r ? o : i, z), c = Math.max(0, Math.min(1, t.amount ?? (n ? 1 : 0))), p = t.second ? Math.max(0, Math.min(1, t.second.amount)) : c, d = t.second ? K(t.second.active ? o : i, z) : s;
  let h;
  if (W(e) === "swing") {
    const y = pe(e) === "double", v = Ki(e), w = y ? a : e.length * v, $ = Math.PI / 2 * w, f = (A, O, T) => _`<path class="fp-door-arc" d=${A}
              fill="none" stroke-width="1.5" stroke-dasharray=${$}
              style="stroke:${O};stroke-dashoffset:${$ * (1 - T)};" />`, k = e.type === "window" ? _`
        <line x1=${-a} y1=${-l / 2} x2=${-a} y2=${l / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${a} y1=${-l / 2} x2=${a} y2=${l / 2}
              stroke=${i} stroke-width="2" />` : u;
    h = _`
        ${k}
        ${y ? (
      // Two leaves hinged at opposite jambs, meeting in the middle when
      // shut and each tracing its own quarter circle outward.
      _`${f(`M 0 0 A ${a} ${a} 0 0 0 ${-a} ${-a}`, s, c)}${f(
        `M 0 0 A ${a} ${a} 0 0 1 ${a} ${-a}`,
        d,
        p
      )}`
    ) : (
      // Hinged at the −x jamb, so the tip starts `leafW` along the wall
      // and ends `leafW` out from it. At full span that is exactly the
      // arc this drew before `sashSpan` existed.
      f(`M ${-a + w} 0 A ${w} ${w} 0 0 0 ${-a} ${-w}`, s, c)
    )}
        ${// The pane the sash does not cover: fixed glass, drawn in the base
    // colour because it never opens and so is never the active part.
    // Nothing at full span, which is every opening that predates this.
    v < 1 ? _`<line x1=${-a + w} y1="0" x2=${a} y2="0"
              stroke=${i} stroke-width=${e.type === "window" ? 1.5 : 2.5} />` : u}
        <!-- leaf hinged at the left jamb (flipH mirrors it to the right one) -->
        <g transform="translate(${-a} 0)">
          <g class="fp-door-leaf" style="transform:rotate(${-90 * c}deg);">
            <rect x="0" y="-1.25" width=${w} height="2.5" style="fill:${s};" />
          </g>
        </g>
        ${y ? (
      // The other leaf, on its own sensor when it has one (issue #159):
      // a casement pair with a contact per sash draws left-open /
      // right-shut, exactly as a two-sensor slider parts unevenly.
      _`<g transform="translate(${a} 0)">
          <g class="fp-leaf-r" style="transform:rotate(${90 * p}deg);">
            <rect x=${-a} y="-1.25" width=${a} height="2.5" style="fill:${d};" />
          </g>
        </g>`
    ) : u}
      `;
  } else if (W(e) === "fixed") {
    const y = e.type === "window" ? 1.5 : 2.5;
    h = _`
        ${e.type === "window" ? _`
        <line x1=${-a} y1=${-l / 2} x2=${-a} y2=${l / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${a} y1=${-l / 2} x2=${a} y2=${l / 2}
              stroke=${i} stroke-width="2" />` : u}
        <line x1=${-a} y1="0" x2=${a} y2="0"
              stroke=${i} stroke-width=${y} />`;
  } else if (W(e) === "roll")
    h = _`
        <!-- jambs -->
        <line x1=${-a} y1=${-l / 2} x2=${-a} y2=${l / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${a} y1=${-l / 2} x2=${a} y2=${l / 2}
              stroke=${i} stroke-width="2" />
        <!-- Track: stays when the curtain is up so the gap still reads as an
             opening — and wears the accent while the cover is open or moving
             (issue #154). Wide open the curtain has scaled away to nothing, so
             this line is the *only* mark left: drawn in the base colour it read
             exactly like a shut garage, which is the one thing it must not do.
             Full strength when accented, since a 0.6 tint of the accent reads
             as neither colour. -->
        <line x1=${-a} y1="0" x2=${a} y2="0"
              stroke=${s} stroke-width="0.75" opacity=${r ? 1 : 0.6} />
        ${Zn(e.length, s, c)}`;
  else {
    const y = e.type === "window" ? 1.5 : 2.5, v = _`
        <line x1=${-a} y1=${-l / 2} x2=${-a} y2=${l / 2}
              stroke=${i} stroke-width="2" />
        <line x1=${a} y1=${-l / 2} x2=${a} y2=${l / 2}
              stroke=${i} stroke-width="2" />`, w = Vt(e);
    if (w === "bypass") {
      const f = -a * c;
      h = _`
        ${v}
        <!-- tracks -->
        <line x1=${-a} y1=${-1.75} x2=${a} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-a} y1=${1.75} x2=${a} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- fixed panel: left half, front track -->
        <rect x=${-a} y=${1.75 - y / 2} width=${a} height=${y} style="fill:${s};" />
        <!-- moving panel: right half, back track -->
        <g class="fp-slide-panel" style="transform:translateX(${f}px);">
          <rect x="0" y=${-1.75 - y / 2} width=${a} height=${y} style="fill:${s};" />
        </g>`;
    } else if (w === "biparting")
      h = _`
        ${v}
        <!-- track -->
        <line x1=${-a} y1="0" x2=${a} y2="0"
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <g class="fp-slide-panel" style="transform:translateX(${-a * c}px);">
          <rect x=${-a} y=${-y / 2} width=${a} height=${y} style="fill:${s};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${a * p}px);">
          <rect x="0" y=${-y / 2} width=${a} height=${y} style="fill:${d};" />
        </g>`;
    else if (w === "biparting-bypass") {
      const f = a / 2;
      h = _`
        ${v}
        <!-- tracks -->
        <line x1=${-a} y1=${-1.75} x2=${a} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-a} y1=${1.75} x2=${a} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- fixed panels: outer quarters, front track. Never accented, even
             wide open — the accent marks what has moved, and lighting these
             would accent exactly the half that is still glazed shut. -->
        <rect x=${-a} y=${1.75 - y / 2} width=${f} height=${y} fill=${i} />
        <rect x=${a - f} y=${1.75 - y / 2} width=${f} height=${y} fill=${i} />
        <!-- moving panels: inner quarters, back track -->
        <g class="fp-slide-panel" style="transform:translateX(${-f * c}px);">
          <rect x=${-f} y=${-1.75 - y / 2} width=${f} height=${y} style="fill:${s};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${f * p}px);">
          <rect x="0" y=${-1.75 - y / 2} width=${f} height=${y} style="fill:${d};" />
        </g>`;
    } else if (w === "converging") {
      const f = a / 2;
      h = _`
        ${v}
        <!-- tracks -->
        <line x1=${-a} y1=${-1.75} x2=${a} y2=${-1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <line x1=${-a} y1=${1.75} x2=${a} y2=${1.75}
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <!-- both panels move, so both take the accent on their own state:
             front track travels right, back track left, and they meet. -->
        <g class="fp-slide-panel" style="transform:translateX(${f * c}px);">
          <rect x=${-a} y=${1.75 - y / 2} width=${a} height=${y} style="fill:${s};" />
        </g>
        <g class="fp-slide-panel" style="transform:translateX(${-f * p}px);">
          <rect x="0" y=${-1.75 - y / 2} width=${a} height=${y} style="fill:${d};" />
        </g>`;
    } else {
      const $ = e.length * c;
      h = _`
        ${v}
        <!-- track -->
        <line x1=${-a} y1="0" x2=${a} y2="0"
              stroke=${i} stroke-width="0.75" opacity="0.6" />
        <g class="fp-slide-panel" style="transform:translateX(${$}px);">
          <rect x=${-a} y=${-y / 2} width=${e.length} height=${y} style="fill:${s};" />
        </g>`;
    }
  }
  if (t.shutter) {
    const y = K(
      t.shutter.active ? t.shutter.accent ?? o : i,
      z
    ), v = Math.max(0, Math.min(1, t.shutter.amount)), w = t.shutter.second, $ = w ? K(
      w.active ? t.shutter.accent ?? o : i,
      z
    ) : y, f = w ? Math.max(0, Math.min(1, w.amount)) : v;
    h = _`${h}${t.shutter.style === "swing" ? Kh(
      e.length,
      l,
      y,
      v,
      t.shutter.flip ? -1 : 1,
      $,
      f
    ) : Zn(e.length, y, v)}`;
  }
  const { sx: m, sy: b } = Lh(e);
  return _`<g class=${`fp-opening fp-opening-${V(e.type) ?? "unknown"}`}
                data-id=${V(e.id) ?? u}
                data-entity=${he(e.entity) ?? u}
                transform="translate(${e.x} ${e.y}) rotate(${e.angle})">
      <g transform="scale(${m} ${b})">${h}</g>
    </g>`;
}
function Xe(e) {
  if (typeof e != "number" || !Number.isFinite(e)) return 0;
  const t = (e % 360 + 360) % 360;
  return t === 90 || t === 180 || t === 270 ? t : 0;
}
function Zh(e, t) {
  const i = Xe(e.rotation);
  if (t === void 0) return i;
  const n = t ? e.rotationPortrait : e.rotationLandscape;
  return n == null ? i : Xe(n);
}
function Xh(e, t) {
  return typeof e.addEventListener == "function" ? (e.addEventListener("change", t), () => e.removeEventListener?.("change", t)) : typeof e.addListener == "function" ? (e.addListener(t), () => e.removeListener?.(t)) : () => {
  };
}
function ve(e, t, i) {
  return i === 90 || i === 270 ? { w: t, h: e } : { w: e, h: t };
}
function Ce(e, t, i, n, r) {
  switch (r) {
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
function Qh(e, t = Pi, i = wt) {
  const n = Math.min(t, i), r = Math.max(t, i);
  if (!(typeof e == "number" || typeof e == "string" && e.trim() !== "")) return r;
  const a = typeof e == "number" ? e : Number(e);
  if (!Number.isFinite(a)) return r;
  const l = Ua - Sn, s = Math.max(0, Math.min(1, (a - Sn) / l)), c = s * s * (3 - 2 * s);
  return n + (r - n) * c;
}
const fi = 135, Yn = 12;
function Qi(e) {
  if (!(typeof e == "number" || typeof e == "string" && e.trim() !== "")) return;
  const i = typeof e == "number" ? e : Number(e);
  return Number.isFinite(i) ? i : void 0;
}
function Jh(e) {
  const t = Qi(e);
  if (t === void 0) return 1;
  if (t <= 0) return 0;
  if (t >= Yn) return 1;
  const i = t / Yn;
  return i * i * (3 - 2 * i);
}
function ep(e, t = 0) {
  const i = (e + t) * Math.PI / 180;
  return { x: Math.sin(i), y: -Math.cos(i) };
}
function tp(e, t) {
  return Zt(e) ? e.sunBearing : Qi(t) ?? fi;
}
function Zt(e) {
  return typeof e.sunBearing == "number" && Number.isFinite(e.sunBearing);
}
function ip(e, t) {
  return Zt(e) ? 1 : Jh(t);
}
const Ct = 0.34, np = 30, rp = 0.95, op = 0.16, ap = 0.37, mi = "var(--fp-skin-sunlight, #ffd9a0)", gi = "var(--fp-skin-sunshade, #000)";
function sp(e) {
  return Math.max(0.02, Math.min(1.5, C(e, Ct)));
}
function lp(e, t, i, n) {
  let r = n;
  for (const o of i) {
    const a = ji(e.x, e.y, t.x, t.y, o);
    a !== void 0 && a > 1 && a < r && (r = a);
  }
  return r;
}
function cp(e) {
  const t = Qi(e);
  if (t === void 0) return 1;
  const i = (r) => r * Math.PI / 180, n = Math.tan(i(np)) / Math.tan(i(Math.max(1, Math.min(89, t))));
  return Math.max(0.45, Math.min(1.9, n));
}
function dp(e, t, i) {
  return e.sunlight === !1 || i !== void 0 && i <= 0 ? 0 : Ji(e) ? 1 : Math.max(0, Math.min(1, t));
}
function Ji(e) {
  return e.glazed ?? e.type === "window";
}
function vo(e) {
  const t = e.angle * Math.PI / 180, i = Math.cos(t) * e.length / 2, n = Math.sin(t) * e.length / 2;
  return [
    { x: e.x - i, y: e.y - n },
    { x: e.x + i, y: e.y + n }
  ];
}
function en(e, t, i) {
  let n = !1;
  for (let r = 0, o = e.length - 1; r < e.length; o = r++) {
    const a = e[r], l = e[o];
    a.y > i != l.y > i && t < (l.x - a.x) * (i - a.y) / (l.y - a.y) + a.x && (n = !n);
  }
  return n;
}
function hp(e, t, i) {
  for (const n of t) {
    const r = ji(e.x, e.y, -i.x, -i.y, n);
    if (r === void 0) continue;
    if (!(r <= St && Hi(e.x, e.y, n) <= St)) return !1;
  }
  return !0;
}
function pp(e, t) {
  return ep(tp(e, t) + 180, e.north ?? 0);
}
function _o(e, t, i, n) {
  return [
    e,
    t,
    { x: t.x + i.x * n, y: t.y + i.y * n },
    { x: e.x + i.x * n, y: e.y + i.y * n }
  ];
}
function up(e, t, i, n = 1) {
  const [r, o] = vo(e), a = Math.max(0, Math.min(1, n)), l = (r.x + o.x) / 2, s = (r.y + o.y) / 2, c = (p) => ({ x: l + (p.x - l) * a, y: s + (p.y - s) * a });
  return _o(c(r), c(o), t, i);
}
function fp(e, t, i) {
  return _o({ x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 }, t, i);
}
function Qn(e) {
  return e.map((t) => `${t.x},${t.y}`).join(" ");
}
function mp(e, t, i, n, r, o) {
  const { dir: a, openAmount: l, shutterOpen: s, strength: c = 1 } = o, p = {
    light: o.light ?? mi,
    // `?? ` would swallow the explicit null that means "no shade at all".
    shade: o.shade === void 0 ? gi : o.shade
  };
  if (c <= 0) return u;
  const d = Math.min(i, n) * sp(o.reach), h = (S) => dp(S, l(S), s(S)), m = Ui(e, t, h), b = m.map((S) => fp(S, a, d)), y = t.map((S, Q) => {
    if (!(h(S) > 0 && hp(S, e, a))) return;
    const ke = lp(S, a, m, d), [an, sn] = vo(S), No = sn.x - an.x, Ho = sn.y - an.y, jo = Math.abs(No * a.y - Ho * a.x) * h(S) / 2;
    return {
      // The outline runs past the falloff, so the ellipse is what bounds the
      // patch and never the polygon's flat far edge.
      points: Qn(up(S, a, ke + S.length, h(S))),
      cx: S.x,
      cy: S.y,
      along: ke,
      across: Math.max(1, jo * rp),
      angle: Math.atan2(a.y, a.x) * 180 / Math.PI,
      lightId: `${r}-b${Q}`,
      shadeId: `${r}-s${Q}`,
      fadeId: `${r}-f${Q}`
    };
  });
  if (!y.some((S) => S !== void 0)) return u;
  const v = b.map(Qn), w = H, $ = `${r}-shade`, f = `${r}-shadow`, k = -w, A = -w, O = i + w * 2, T = n + w * 2, q = (S, Q = u) => _`<rect x=${k} y=${A} width=${O} height=${T} fill=${S}>${Q}</rect>`, G = (S, Q) => _`<polygon points=${S} fill=${Q} stroke=${Q} stroke-width=${H} />`, X = (S, Q, ke) => _`<radialGradient id=${Q} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"
              gradientTransform=${`translate(${S.cx} ${S.cy}) rotate(${S.angle}) scale(${S.along} ${S.across})`}>
          <stop offset="0" stop-color=${ke} stop-opacity="1" />
          <stop offset="0.45" stop-color=${ke} stop-opacity="0.55" />
          <stop offset="1" stop-color=${ke} stop-opacity="0" />
        </radialGradient>`, me = p.shade === null ? u : _`
      <!-- Where the shade shows: everywhere, minus the patches of light, plus
           back wherever a wall stands in one. The order is the whole logic. -->
      <mask id=${$} maskUnits="userSpaceOnUse" x=${k} y=${A} width=${O} height=${T}>
        ${q("#fff")}
        ${y.map((S) => S ? X(S, S.shadeId, "#000") : u)}
        ${y.map(
    (S) => S ? _`<polygon points=${S.points} fill=${`url(#${S.shadeId})`} />` : u
  )}
        ${v.map((S) => G(S, "#fff"))}
      </mask>`;
  return _`
    <defs>
      ${me}
      <!-- The wall shadows again, for the warm patches themselves. -->
      <mask id=${f} maskUnits="userSpaceOnUse" x=${k} y=${A} width=${O} height=${T}>
        ${q("#fff")}
        ${v.map((S) => G(S, "#000"))}
      </mask>
    </defs>
    <g class="fp-sunlight">
      ${p.shade === null ? u : _`<rect x=${k} y=${A} width=${O} height=${T}
            style=${`fill:${K(p.shade, gi)};`}
            opacity=${op * c} mask=${`url(#${$})`} />`}
      <g mask=${`url(#${f})`} opacity=${ap * c}>
        ${y.map(
    (S) => S ? X(S, S.lightId, K(p.light, mi)) : u
  )}
        ${y.map(
    (S) => S ? _`<polygon class="fp-sunbeam" points=${S.points}
                            fill=${`url(#${S.lightId})`} />` : u
  )}
      </g>
    </g>`;
}
function wo(e) {
  switch (e) {
    case "contain":
      return "xMidYMid meet";
    case "cover":
      return "xMidYMid slice";
    default:
      return "none";
  }
}
function xo(e, t, i, n) {
  const r = H + 4, o = H;
  return _`
    <defs>
      <mask id=${n} maskUnits="userSpaceOnUse"
            x=${-o} y=${-o} width=${t + o * 2} height=${i + o * 2}>
        <rect x=${-o} y=${-o} width=${t + o * 2} height=${i + o * 2}
              fill="white" />
        ${e.map((a) => {
    const l = a.length / 2;
    return _`<rect x=${a.x - l} y=${a.y - r / 2}
                           width=${a.length} height=${r} fill="black"
                           transform="rotate(${a.angle} ${a.x} ${a.y})" />`;
  })}
      </mask>
    </defs>`;
}
function tn(e) {
  if (!e.length) return { x: 0, y: 0 };
  const t = e.reduce((i, n) => ({ x: i.x + n.x, y: i.y + n.y }), { x: 0, y: 0 });
  return { x: t.x / e.length, y: t.y / e.length };
}
const yi = { scale: 1, txPercent: 0, tyPercent: 0 };
function gp(e, t, i, n, r = 0.15, o = ai, a) {
  if (!e.length) return yi;
  const l = e.map((T) => Ce(T.x, T.y, t, i, n)), s = ve(t, i, n), c = l.map((T) => T.x), p = l.map((T) => T.y), d = Math.min(...c), h = Math.max(...c), m = Math.min(...p), b = Math.max(...p), y = Math.max(h - d, b - m) * r, v = Math.max(h - d + y * 2, 1), w = Math.max(b - m + y * 2, 1), $ = Math.max(1, Math.min(o, Math.min(s.w / v, s.h / w))), f = a ?? $;
  if (!Number.isFinite(f)) return yi;
  const k = (d + h) / 2 / s.w, A = (m + b) / 2 / s.h, O = (T) => Math.min(0, Math.max(100 * (1 - f), T));
  return {
    scale: f,
    txPercent: O(50 - f * k * 100),
    tyPercent: O(50 - f * A * 100)
  };
}
function yp(e) {
  const t = e.zoom;
  if (!(typeof t != "number" || !Number.isFinite(t)))
    return Math.max(1, Math.min(Cr, t));
}
function bp(e, t) {
  if (!Number.isFinite(e) || e <= 1) return 1;
  const i = typeof t == "number" && Number.isFinite(t) && t > 0 ? t : si;
  return 1 / e * i;
}
const ni = 12, vp = 1.5, _p = 0.4;
function $o(e) {
  return _`
    <defs>
      <pattern id=${e} width=${ni} height=${ni}
               patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line class="fp-dead-space-line" x1="0" y1="0" x2="0" y2=${ni}
              stroke=${Ci} stroke-width=${vp} />
      </pattern>
    </defs>`;
}
function ko(e, t) {
  const i = e.map((n) => `${n.x},${n.y}`).join(" ");
  return _`<polygon class="fp-dead-space" points=${i}
                      fill=${`url(#${t})`} fill-rule="nonzero"
                      fill-opacity=${_p} stroke="none" />`;
}
function So(e, t) {
  const i = e.points.map((o) => `${o.x},${o.y}`).join(" "), n = t !== void 0 && (e.highlight ?? "fill") !== "border", r = n ? e.activeOpacity ?? e.opacity : e.opacity;
  return _`<polygon class="fp-area" data-id=${V(e.id) ?? u}
                       data-entity=${he(e.entity) ?? u}
                       points=${i}
                       fill=${n ? t : K(e.color, z)}
                       fill-opacity=${C(r, oi)}
                       stroke="none"
                       stroke-width="0" />`;
}
function Eo(e, t, i) {
  const n = t !== void 0 && (e.highlight ?? "fill") !== "fill", r = n ? t : e.borderColor ? K(e.borderColor, "none") : void 0;
  if (r === void 0 || r === "none") return u;
  const o = e.points.map((l) => `${l.x},${l.y}`).join(" "), a = C(
    e.borderWidth,
    n ? H / 2 : Ba
  );
  return !n || i === void 0 ? _`<polygon class="fp-area-border" data-id=${V(e.id) ?? u}
                        data-entity=${he(e.entity) ?? u}
                        points=${o} fill="none"
                        stroke=${r} stroke-width=${a} />` : _`
    <clipPath id=${i}><polygon points=${o} /></clipPath>
    <polygon class="fp-area-border" data-id=${V(e.id) ?? u}
             data-entity=${he(e.entity) ?? u}
             points=${o} fill="none" clip-path=${`url(#${i})`}
             stroke=${r} stroke-width=${a * 2} />`;
}
function bi(e, t, i = re) {
  const n = t ?? e.color ?? qa, r = jd(Gt(i, e.type) ?? Fd, e.w, e.h, n), o = e.hand === "left" ? " scale(-1 1)" : "";
  return _`<g class=${`fp-furniture fp-furniture-${V(e.type) ?? "unknown"}`}
                data-id=${V(e.id) ?? u}
                data-entity=${he(e.entity) ?? u}
                transform="translate(${e.x} ${e.y}) rotate(${e.angle ?? 0})${o}">${r}</g>`;
}
function Mt(e, t, i, n, r, o = 3, a = "fixed") {
  function l(h) {
    return (h % 360 + 360) % 360;
  }
  function s(h, m, b) {
    return Math.max(Math.min(h, b), m);
  }
  const c = F(C(i, jt), a), p = l(C(n, Ut)), d = s(C(r, Bt), 0, 360);
  return g`
    <div
      class="ripple ${e ? "active" : ""}"
      style="width:${c};height:${c};--fp-ripple-color:${K(t, z)};--fp-ripple-direction:${p};--fp-ripple-width:${d}"
    >
      <span class="dot"></span>
      ${Array.from(
    { length: o },
    (h, m) => g`<span class="ring" style="animation-delay:${(m * 0.6).toFixed(2)}s;"></span>`
  )}
    </div>
  `;
}
function It(e, t) {
  if (!t || !e) return null;
  const i = e[t]?.state;
  if (i == null || i === "unavailable" || i === "unknown") return null;
  const n = Number(i);
  return Number.isFinite(n) ? n : null;
}
function Ao(e, t) {
  const i = e.color ?? z, n = (e.dotSize ?? Li) / 2, r = e.x + e.w / 2, o = e.y + e.h / 2, a = e.angle ?? 0, l = Fn(e.xSensor, t.xReading), s = Fn(e.ySensor, t.yReading), c = l != null, p = s != null, d = t.xPresent === !1 || t.yPresent === !1, h = e.w / 2, m = e.h / 2, b = t.editing ? _`<rect class="tracker-zone ${d ? "presence-gated" : ""}"
                x=${-h} y=${-m} width=${e.w} height=${e.h}
                fill=${i} fill-opacity="0.08" stroke=${i} stroke-width="1.5"
                stroke-dasharray="6 4" rx="4" pointer-events="none" />` : _``;
  let y;
  if (d)
    y = _``;
  else if (c && p) {
    const v = -h + l * e.w, w = -m + s * e.h, $ = `0,${-n} ${n * 0.9},${n * 0.7} ${-n * 0.9},${n * 0.7}`, f = Math.max(n * 3.5, Math.min(e.w, e.h) * 0.45);
    y = _`
      <g class="tracker-marker" style="transform:translate(${v}px, ${w}px);">
        <circle class="tracker-ring" cx="0" cy="0" r="0"
                fill="none" stroke=${i} stroke-width="1.5"
                style="--fp-tracker-ring-max:${f}px;" />
        <circle class="tracker-ring" cx="0" cy="0" r="0"
                fill="none" stroke=${i} stroke-width="1.5"
                style="--fp-tracker-ring-max:${f}px; animation-delay:0.7s;" />
        <polygon class="tracker-dot" points=${$} fill=${i} />
      </g>`;
  } else if (c || p)
    if (c) {
      const v = -h + l * e.w;
      y = _`
        <g class="tracker-line" style="transform:translate(${v}px, 0);">
          <line class="tracker-line-stroke" x1="0" y1=${-m} x2="0" y2=${m}
                stroke=${i} stroke-width="1.5" />
          <line class="tracker-band" x1="0" y1=${-m} x2="0" y2=${m}
                stroke=${i} stroke-width="3" stroke-linecap="round" />
          <line class="tracker-band" x1="0" y1=${-m} x2="0" y2=${m}
                stroke=${i} stroke-width="3" stroke-linecap="round"
                style="animation-delay:0.8s;" />
        </g>`;
    } else {
      const v = -m + s * e.h;
      y = _`
        <g class="tracker-line tracker-line-h" style="transform:translate(0, ${v}px);">
          <line class="tracker-line-stroke" x1=${-h} y1="0" x2=${h} y2="0"
                stroke=${i} stroke-width="1.5" />
          <line class="tracker-band" x1=${-h} y1="0" x2=${h} y2="0"
                stroke=${i} stroke-width="3" stroke-linecap="round" />
          <line class="tracker-band" x1=${-h} y1="0" x2=${h} y2="0"
                stroke=${i} stroke-width="3" stroke-linecap="round"
                style="animation-delay:0.8s;" />
        </g>`;
    }
  else t.editing ? y = _`<circle class="tracker-placeholder" cx="0" cy="0" r=${n}
                          fill=${i} fill-opacity="0.25" />` : y = _``;
  return _`
    <g class="tracker fp-tracker ${t.editing ? "editing" : ""}"
       data-id=${V(e.id) ?? u}
       transform="translate(${r} ${o}) rotate(${a})">
      ${b}${y}
    </g>`;
}
function Jn(e, t, i, n) {
  let r = null, o = n;
  for (const a of i) {
    const l = a.x2 - a.x1, s = a.y2 - a.y1, c = l * l + s * s;
    if (c === 0) continue;
    let p = ((e - a.x1) * l + (t - a.y1) * s) / c;
    p = Math.max(0, Math.min(1, p));
    const d = a.x1 + p * l, h = a.y1 + p * s, m = Math.hypot(e - d, t - h);
    m < o && (o = m, r = { x: d, y: h, angle: Math.atan2(s, l) * 180 / Math.PI });
  }
  return r;
}
class Xt {
  static currentFloorEntityIds(t, i) {
    const n = t ? Fe(t) : [], r = n.find((a) => a.id === i) ?? n[0];
    if (!r) return [];
    const o = /* @__PURE__ */ new Set();
    for (const a of r.openings)
      a.entity && o.add(a.entity), a.secondaryEntity && o.add(a.secondaryEntity), a.shutterEntity && o.add(a.shutterEntity), a.shutterSecondaryEntity && o.add(a.shutterSecondaryEntity);
    for (const a of r.items) {
      a.entity && o.add(a.entity);
      for (const l of ue(a))
        l.entity && o.add(l.entity);
    }
    for (const a of r.furniture)
      a.entity && o.add(a.entity);
    for (const a of r.areas)
      a.entity && o.add(a.entity);
    for (const a of r.trackers)
      for (const l of [a.xSensor, a.ySensor])
        l?.entity && o.add(l.entity), l?.presence?.entity && o.add(l.presence.entity);
    return Array.from(o).sort();
  }
  static scopeKey(t, i) {
    const n = Xt.currentFloorEntityIds(t, i);
    return n.length ? n.join("|") : "none";
  }
}
function wp(e) {
  const t = Date.now() / 1e3, i = e?.historyReplay?.lookbackSeconds, n = typeof i == "number" && Number.isFinite(i) && i > 0 ? i : 3600;
  return { start: Math.max(0, t - n), end: t };
}
function er(e, t) {
  const i = Math.max(0, Math.min(e, t)), n = Math.max(0, Math.max(e, t));
  return {
    start: i,
    end: Math.max(i, n)
  };
}
function xp(e, t) {
  return Xt.currentFloorEntityIds(e, t);
}
function $p(e, t) {
  return Xt.scopeKey(e, t);
}
function kp(e, t, i) {
  const r = Math.max(1, i - t) / 30, o = e?.historyReplay?.defaultSpeed;
  return Math.max(0.25, o ?? r);
}
function Sp(e) {
  const t = Date.parse(e);
  return Number.isNaN(t) ? Date.now() / 1e3 : t / 1e3;
}
function tr(e) {
  if (!Number.isFinite(e) || e <= 0) return "";
  const t = new Date(e * 1e3), i = t.getFullYear(), n = `${t.getMonth() + 1}`.padStart(2, "0"), r = `${t.getDate()}`.padStart(2, "0"), o = `${t.getHours()}`.padStart(2, "0"), a = `${t.getMinutes()}`.padStart(2, "0");
  return `${i}-${n}-${r}T${o}:${a}`;
}
function Ep(e) {
  const t = Math.min(3, Math.max(-2, e));
  return Number((10 ** t).toPrecision(4));
}
function Ap(e, t, i) {
  if (!e) return;
  if (i.has(t))
    return i.get(t);
  const n = Fe(e);
  let r;
  for (const o of n) {
    for (const a of o.items ?? [])
      if (a.entity === t)
        return r = a.activeColor ?? a.rippleColor, i.set(t, r), r;
    for (const a of o.openings ?? [])
      if (a.entity === t)
        return r = a.activeColor, i.set(t, r), r;
    for (const a of o.furniture ?? [])
      if (a.entity === t)
        return r = a.activeColor, i.set(t, r), r;
  }
  i.set(t, void 0);
}
function Tp(e, t, i, n, r) {
  if (!t) return et(e);
  const o = R(Ap(t, e.entityId, n)), a = oe(e.entityId, e.newState);
  if (r && o) return a ? o : "#ffffff";
  const l = et(e);
  return a ? l : "#ffffff";
}
function Cp(e, t) {
  if (!Number.isFinite(e)) return "—";
  try {
    return t.format(new Date(e * 1e3));
  } catch {
    return new Date(e * 1e3).toISOString();
  }
}
var Mp = Object.defineProperty, Ip = Object.getOwnPropertyDescriptor, j = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Ip(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (n ? a(t, i, r) : a(r)) || r);
  return n && r && Mp(t, i, r), r;
};
function Pp(e) {
  const t = e.state.playbackController, i = e.state, r = i.enabled || i.startTime > 0 ? void 0 : e.getDefaultWindow(), o = r ? r.start : i.startTime, a = r ? r.end : i.endTime, l = e.formatReplayTime(
    r ? r.end : t.currentTime
  );
  return {
    events: i.historyEvents,
    startTime: r ? r.start : t.startTime,
    endTime: r ? r.end : t.endTime,
    currentTime: r ? r.end : t.currentTime,
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
    currentTimeLabel: l,
    startInputValue: tr(o),
    endInputValue: tr(a),
    onToggleVisible: (s) => e.toggleHistoryVisible(s),
    onRangeChange: (s, c) => {
      e.handleRangeChange(s, { target: { value: c } });
    },
    onZoom: (s) => e.zoomWindow(s),
    onJump: (s) => e.jumpReplay(s),
    onStep: (s) => e.stepReplay(s),
    onPlayToggle: () => t.playing ? e.pauseReplay() : e.playReplay(),
    onToggleSpeedPanel: () => e.toggleSpeedPanel(),
    onSpeedSliderInput: (s) => e.setReplaySpeed(Ep(s)),
    onSpeedChange: (s) => e.setReplaySpeed(s),
    onToggleTimeline: () => e.toggleTimeline(),
    onToggleLog: () => e.toggleLog(),
    onSeek: (s) => e.seekReplay(s)
  };
}
function Op(e) {
  return g`
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
let D = class extends de {
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
      const r = t + i >> 1;
      this.events[r].timestamp <= e ? (n = r, t = r + 1) : i = r - 1;
    }
    return n >= 0 ? this.events[n] : void 0;
  }
  _renderEventItem(e, t) {
    const i = e.timestamp <= this.currentTime, n = (typeof e.color == "string" ? e.color : void 0) ?? (typeof e.attributes?.color == "string" ? e.attributes.color : void 0) ?? et(e), r = R(n), o = r ? `background:${r}; box-shadow:0 0 0 2px ${r}22;` : u;
    return g`
      <li class="replay-event-item ${i ? "replay-event-passed" : ""} ${t ? "replay-event-current" : ""}" data-timestamp=${e.timestamp}>
        <span class="replay-event-dot" style=${o}></span>
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
      return g`
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
    return g`
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
            ${this.error ? g`<span class="replay-error">${this.error}</span>` : u}
            ${this.rangeWarning ? g`<span class="replay-loading">${this.rangeWarning}</span>` : u}
            ${!this.ready && this.enabled && !this.error ? g`<span class="replay-loading">Loading history…</span>` : u}
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
        ${this.speedExpanded ? g`<div class="replay-speed-panel">
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
            </div>` : u}
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
          ${this.logExpanded ? g`<ul
                class="replay-event-list"
                ${(t) => {
      this._logRef = t instanceof HTMLUListElement ? t : void 0, this._logRef && this.events.length && this._syncLogToCurrentEvent();
    }}
              >${ie(this.events, (t, i) => `${t.timestamp}-${t.entityId}-${t.newState}-${i}`, (t) => this._renderEventItem(t, e?.timestamp === t.timestamp))}</ul>` : u}
          ${!this.logExpanded && !this.events.length ? g`<div class="replay-empty">No history events yet.</div>` : u}
        </div>
      </div>
    `;
  }
};
D.styles = ot`
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
j([
  P({ attribute: !1 })
], D.prototype, "events", 2);
j([
  P({ type: Number })
], D.prototype, "startTime", 2);
j([
  P({ type: Number })
], D.prototype, "endTime", 2);
j([
  P({ type: Number })
], D.prototype, "currentTime", 2);
j([
  P({ type: Boolean })
], D.prototype, "visible", 2);
j([
  P({ type: Boolean })
], D.prototype, "enabled", 2);
j([
  P({ type: Boolean })
], D.prototype, "ready", 2);
j([
  P({ type: Boolean })
], D.prototype, "playing", 2);
j([
  P({ type: Boolean })
], D.prototype, "timelineExpanded", 2);
j([
  P({ type: Boolean })
], D.prototype, "logExpanded", 2);
j([
  P({ type: Boolean })
], D.prototype, "speedExpanded", 2);
j([
  P({ type: String })
], D.prototype, "error", 2);
j([
  P({ type: String })
], D.prototype, "rangeWarning", 2);
j([
  P({ type: String })
], D.prototype, "panelId", 2);
j([
  P({ type: Number })
], D.prototype, "replaySpeed", 2);
j([
  P({ type: String })
], D.prototype, "currentTimeLabel", 2);
j([
  P({ type: String })
], D.prototype, "startInputValue", 2);
j([
  P({ type: String })
], D.prototype, "endInputValue", 2);
D = j([
  Ft("easy-floorplan-replay-panel")
], D);
const To = "--fp-color-", Co = 24;
function B(e) {
  return typeof e != "string" ? "" : e.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
}
function Mo(e) {
  return To + B(e);
}
function ir(e) {
  return `var(${Mo(e)})`;
}
function rt(e) {
  if (!Array.isArray(e)) return [];
  const t = /* @__PURE__ */ new Set(), i = [];
  for (const n of e) {
    if (!n || typeof n != "object") continue;
    const { name: r, color: o } = n, a = B(r), l = R(o);
    if (!(!a || !l || t.has(a)) && (t.add(a), i.push({ name: r.trim(), color: l }), i.length >= Co))
      break;
  }
  return i;
}
function Io(e) {
  return rt(e).map((t) => `${Mo(t.name)}:${t.color};`).join("");
}
function Po(e) {
  return rt(e).map((t) => `${B(t.name)}=${t.color}`).join(",");
}
const Lp = /^[Vv][Aa][Rr]\(\s*--fp-color-([\p{L}\p{N}-]+)\s*(?:,((?:[^()]|\([^()]*\))*))?\)$/u;
function Oo(e) {
  return vi(e)?.slug;
}
function vi(e) {
  if (typeof e != "string") return;
  const t = Lp.exec(e.trim());
  if (!t) return;
  const i = t[2]?.trim();
  return { slug: t[1], fallback: i || void 0 };
}
function mt(e, t) {
  const i = Oo(e);
  if (!i) return e;
  const n = rt(t).find((r) => B(r.name) === i);
  return n ? n.color : e;
}
function nr(e, t, i) {
  if (!t) return e;
  const n = (r) => {
    if (typeof r == "string") {
      const o = vi(r);
      if (o?.slug !== t) return r;
      const a = vi(i);
      return o.fallback && a && !a.fallback ? `var(${To}${a.slug}, ${o.fallback})` : i;
    }
    return Array.isArray(r) ? r.map(n) : r && typeof r == "object" ? Object.fromEntries(Object.entries(r).map(([o, a]) => [o, n(a)])) : r;
  };
  return n(e);
}
const Fp = 500, Rp = 250;
class zp extends HTMLElement {
  constructor() {
    super(...arguments), this.holdTime = Fp, this.held = !1, this.cancelled = !1;
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
    t.actionHandler && Dp(i, t.actionHandler.options) || (t.actionHandler ? (t.removeEventListener("touchstart", t.actionHandler.start), t.removeEventListener("touchend", t.actionHandler.end), t.removeEventListener("touchcancel", t.actionHandler.end), t.removeEventListener("mousedown", t.actionHandler.start), t.removeEventListener("click", t.actionHandler.end), t.removeEventListener("keydown", t.actionHandler.handleKeyDown)) : t.addEventListener("contextmenu", (n) => {
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
      const r = n.target;
      i.hasHold && this.timer && (clearTimeout(this.timer), this.timer = void 0), i.hasHold && this.held ? st(r, "hold") : i.hasDoubleClick ? n.type === "click" && n.detail < 2 || !this.dblClickTimeout ? this.dblClickTimeout = window.setTimeout(() => {
        this.dblClickTimeout = void 0, st(r, "tap");
      }, Rp) : (clearTimeout(this.dblClickTimeout), this.dblClickTimeout = void 0, st(r, "double_tap")) : st(r, "tap");
    }, t.actionHandler.handleKeyDown = (n) => {
      ["Enter", " "].includes(n.key) && (n.preventDefault(), n.currentTarget.actionHandler.end(n));
    }, t.addEventListener("touchstart", t.actionHandler.start, { passive: !0 }), t.addEventListener("touchend", t.actionHandler.end), t.addEventListener("touchcancel", t.actionHandler.end), t.addEventListener("mousedown", t.actionHandler.start, { passive: !0 }), t.addEventListener("click", t.actionHandler.end), t.addEventListener("keydown", t.actionHandler.handleKeyDown)));
  }
}
function Dp(e, t) {
  return e.hasHold === t.hasHold && e.hasDoubleClick === t.hasDoubleClick && e.disabled === t.disabled;
}
function st(e, t) {
  e.dispatchEvent(
    new CustomEvent("action", { detail: { action: t }, bubbles: !0, composed: !0 })
  );
}
function Np() {
  const e = document.body, t = e.querySelector("action-handler-easy-floorplan");
  if (t) return t;
  const i = document.createElement("action-handler-easy-floorplan");
  return e.appendChild(i), i;
}
customElements.get("action-handler-easy-floorplan") || customElements.define("action-handler-easy-floorplan", zp);
const Hp = (e, t) => {
  Np().bind(e, t);
}, Ee = Rt(
  class extends zt {
    update(e, [t]) {
      return Hp(e.element, t), ee;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(e) {
    }
  }
), te = class te {
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
    return Number.isFinite(t) ? Math.min(te._MAX_SPEED, Math.max(te._MIN_SPEED, t)) : Number.isNaN(t) ? 1 : te._MAX_SPEED;
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
    Number.isFinite(t) && (this.speed = Math.min(te._MAX_SPEED, Math.max(te._MIN_SPEED, t)));
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
te._MIN_SPEED = 0.01, te._MAX_SPEED = 1e3;
let Pt = te, jp = 0;
class Up {
  constructor(t) {
    this._card = t, this._historyService = new Na(), this.state = {
      playbackController: new Pt(),
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
      panelId: `fp-replay-panel-${jp++}`
    };
  }
  logReplay(t, i) {
    this._card.getConfig()?.historyReplay?.debug && console.log(t, i ?? {});
  }
  getDefaultWindow() {
    return wp(this._card.getConfig());
  }
  normalizeWindow(t, i) {
    return er(t, i);
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
    return xp(this._card.getConfig(), this._card.getActiveFloorId());
  }
  scopeKey() {
    return $p(this._card.getConfig(), this._card.getActiveFloorId());
  }
  speedForRange(t, i) {
    return kp(this._card.getConfig(), t, i);
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
    return Cp(t, new Intl.DateTimeFormat(void 0, {
      dateStyle: "short",
      timeStyle: "medium"
    }));
  }
  handleRangeChange(t, i) {
    const n = i.target, r = Sp(n.value);
    t === "start" ? this.state.startTime = r : this.state.endTime = r, this.updateWindow(this.state.startTime, this.state.endTime);
  }
  updateWindow(t, i) {
    const { start: n, end: r } = er(t, i), o = r - n;
    this.state.rangeWarning = o < 60 ? "Very small replay window may hide expected transitions." : void 0;
    const a = this.state.playbackController.playing;
    this.state.startTime = n, this.state.endTime = r, this.clearHistoryCache(), this.state.playbackController.pause(), this.stopReplayLoop(), this._card.requestUpdate(), !(!this._card.getHass() || !this.state.historyVisible) && this.startReplay({ preserveCurrentTime: !0, keepPlaying: a });
  }
  resetForFloorChange() {
    this.state.historyEvents = [], this.state.enabled = !1, this.state.ready = !1, this.state.error = void 0, this.state.loadRequested = !1, this.state.loadToken += 1, this.clearHistoryCache(), this.stopReplayLoop(), this._card.requestUpdate(), this._card.getHass() && this.state.historyVisible && this.startReplay({ preserveCurrentTime: !0, keepPlaying: this.state.playbackController.playing });
  }
  zoomWindow(t) {
    const i = Math.max(60, this.state.endTime - this.state.startTime), n = this.state.playbackController.currentTime, r = t > 0 ? Math.max(60, i * 0.8) : i * 1.25, o = r / 2, a = Math.max(0, n - o), l = a + r;
    this.updateWindow(a, l);
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
    const i = this.state.startTime || this.getDefaultWindow().start, n = this.state.endTime || this.getDefaultWindow().end, { start: r, end: o } = this.normalizeWindow(i, n);
    this.state.startTime = r, this.state.endTime = o, this.state.enabled = !0, this.state.loadRequested = !0, this.state.error = void 0, this.state.ready = !1;
    const a = t.preserveCurrentTime ? Math.min(o, Math.max(r, this.state.playbackController.currentTime)) : r;
    this.state.playbackController = new Pt({
      startTime: r,
      endTime: o,
      initialSpeed: this.speedForRange(r, o)
    }), this.state.playbackController.seek(a), t.keepPlaying && this.state.playbackController.play();
    const l = ++this.state.loadToken;
    this.logReplay("[easy-floorplan] Starting replay", { start: r, end: o, lookback: o - r }), await this.loadReplayRange(r, o, l), t.keepPlaying && this.state.enabled && this.state.playbackController.playing && this.startReplayLoop(), this._card.requestUpdate();
  }
  async loadReplayRange(t, i, n) {
    try {
      const r = this.scopeKey();
      if (await this._historyService.loadHistory(t, i, { scopeKey: r, hass: this._card.getHass(), watched: this.watchedEntities(), numericSteps: this._card.getConfig()?.historyReplay?.numericSteps }), n !== this.state.loadToken) return;
      const o = new Set(this.watchedEntities()), a = this._historyService.getEvents();
      this.state.historyEvents = a.filter((l) => o.has(l.entityId)).map((l) => ({
        ...l,
        color: Tp(l, this._card.getConfig(), this._card.getHass(), this.state.configuredColorCache, this.state.configured)
      })), this.state.ready = !0, this.state.loadRequested = !1, this.state.error = void 0, this.logReplay("[easy-floorplan] Replay history loaded", { eventCount: this.state.historyEvents.length }), this._card.requestUpdate();
    } catch (r) {
      if (n !== this.state.loadToken) return;
      this.state.ready = !1, this.state.loadRequested = !1, this.state.error = r instanceof Error ? r.message : "Unable to load history.", console.error("[easy-floorplan] Replay history loading failed", r);
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
    const i = this.state.playbackController.currentTime, n = 1e-4, r = t > 0 ? this._historyService.getEventAfter(i + n) : this._historyService.getEventBefore(i - n);
    r ? this.state.playbackController.seek(r.timestamp) : this.state.playbackController.seek(t > 0 ? this.state.playbackController.endTime : this.state.playbackController.startTime), this._card.requestUpdate();
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
var Bp = Object.defineProperty, Wp = Object.getOwnPropertyDescriptor, De = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Wp(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (n ? a(t, i, r) : a(r)) || r);
  return n && r && Bp(t, i, r), r;
};
const rr = /* @__PURE__ */ new Map();
function or(e) {
  return e.map((t) => t.id).join("|");
}
let Z = class extends de {
  constructor() {
    super(...arguments), this._wallMaskId = `fp-wall-mask-${Z._nextWallMaskId++}`, this._glowIdBase = `fp-glow-${Z._nextGlowId++}`, this._watchedEntities = /* @__PURE__ */ new Set(), this._replayController = new Up({
      getConfig: () => this._config,
      getHass: () => this.hass,
      getActiveFloorId: () => this._activeFloorId,
      requestUpdate: () => this.requestUpdate()
    }), this._onOrientation = (e) => {
      this._portrait = e.matches;
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
    if (super.connectedCallback(), typeof window > "u" || !window.matchMedia) return;
    const e = window.matchMedia("(orientation: portrait)");
    this._onOrientation(e), this._unsubscribeOrientation = Xh(e, this._onOrientation);
  }
  setConfig(e) {
    if (!e || typeof e != "object") throw new Error("Invalid configuration");
    const t = e;
    for (const n of ["walls", "openings", "items", "texts", "furniture", "trackers", "areas", "floors"])
      if (t[n] != null && !Array.isArray(t[n]))
        throw new Error(`Invalid configuration: "${n}" must be a list`);
    for (const n of ["width", "height", "grid", "rotation", "rotationPortrait", "rotationLandscape"])
      if (t[n] != null && typeof t[n] != "number")
        throw new Error(`Invalid configuration: "${n}" must be a number`);
    this._config = {
      ...e,
      width: e.width ?? Ie,
      height: e.height ?? tt,
      walls: e.walls ?? [],
      openings: e.openings ?? [],
      items: e.items ?? [],
      texts: e.texts ?? [],
      furniture: e.furniture ?? []
    }, this._watchedEntities = We(this._config), this._syncHistoryServiceContext(), this._replayController.clearConfigColorCache();
    const i = this._replayCacheKey();
    if (i !== this._lastReplayCacheKey && (this._lastReplayCacheKey = i, this._replayController.historyService().clearCache()), this._replayController.syncToConfig(), !this._activeFloorId) {
      const n = Fe(this._config), r = rr.get(or(n));
      r && n.some((o) => o.id === r) && (this._activeFloorId = r);
    }
  }
  /**
   * HA pushes a fresh `hass` on every state change anywhere in the instance —
   * for most updates nothing on this plan moved. Skip those renders entirely.
   */
  shouldUpdate(e) {
    if (!(e.size === 1 && e.has("hass"))) return !0;
    const t = e.get("hass");
    return !t || !this.hass ? !0 : zr(t, this.hass, this._watchedEntities);
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
    const t = Ia(this._config?.skin);
    t ? this.setAttribute("data-skin", t) : this.removeAttribute("data-skin");
  }
  updated(e) {
    super.updated(e), (e.has("hass") || e.has("_activeFloorId")) && this._syncHistoryServiceContext();
  }
  getCardSize() {
    return 6;
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Bu), document.createElement("easy-floorplan-card-editor");
  }
  static getStubConfig() {
    return Qa();
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
    return oe(e.entity, t?.states[e.entity]?.state);
  }
  /** How far open an opening should be drawn (0..1), from its entity (or default). */
  _openingAmount(e, t) {
    const i = e.entity ? t?.states[e.entity] : void 0;
    return Oe(e, i);
  }
  /** Whether an opening wears its accent: drawn open, or a cover still in transit. */
  _openingActive(e, t) {
    const i = e.entity ? t?.states[e.entity] : void 0;
    return ui(e, i);
  }
  /**
   * The second leaf's own state for an opening with a sensor on each — a
   * two-panel slider (issue #145) or a hinged double (issue #159).
   * `undefined` — no second sensor, or a shape with only one leaf — leaves both
   * on the first entity, so nothing about a single-sensor opening changes.
   */
  _openingSecond(e, t) {
    if (!e.secondaryEntity || !Ze(e)) return;
    const i = lo(e), n = t?.states[e.secondaryEntity];
    return { amount: Oe(i, n), active: ui(i, n) };
  }
  /**
   * The same for a hinged shutter's other panel (issue #159). Read from its
   * own key and its own resolvers — the shutter answers to `shutterInvert` and
   * is drawn from `shutterAmount` / `shutterActive`, not the sash's — and only
   * for a `swing` shutter, since a roll curtain has no second panel to drive.
   */
  _shutterSecond(e, t) {
    if (!e.shutterSecondaryEntity || Pe(e) !== "swing") return;
    const i = t?.states[e.shutterSecondaryEntity];
    return {
      amount: le(i, e.shutterInvert),
      active: ut(i, e.shutterInvert)
    };
  }
  _itemIcon(e, t) {
    return hi(
      e,
      t?.states[e.entity],
      this.hass?.entities?.[e.entity]?.icon
    );
  }
  _label(e, t) {
    return e.name ?? t?.states[e.entity]?.attributes?.friendly_name ?? e.entity ?? "";
  }
  disconnectedCallback() {
    this._replayController.stopReplayLoop(), this._unsubscribeOrientation?.(), this._unsubscribeOrientation = void 0, super.disconnectedCallback();
  }
  _handleItemAction(e, t) {
    this.hass && je(this, this.hass, t, Or(t, e.detail.action));
  }
  /** What a gesture on this opening would do, if anything. */
  _openingPress(e, t) {
    return Zi(e, t, this._featuresOf);
  }
  /**
   * Pressing an opening (issue #74 follow-up). Which entity answers — the
   * window/door or its shutter — is {@link openingActionForGesture}'s call;
   * from here it is the same Lovelace dispatch every device uses.
   */
  _onOpeningAction(e, t) {
    if (!this.hass) return;
    const i = this._openingPress(t, e.detail.action);
    i && je(this, this.hass, { entity: i.entity }, i.config);
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
  _renderShutterMark(e, t, i, n, r) {
    const o = e.shutterEntity, a = r?.states[o], l = le(a, e.shutterInvert) > 0, s = ut(a, e.shutterInvert), c = uo(e, a, l, this.hass?.entities?.[o]?.icon), p = R(e.shutterActiveColor ?? e.activeColor) ?? z, d = Yi(e), h = Ce(d.x, d.y, t.width, t.height, i), m = ve(t.width, t.height, i), b = Xi(e, i), y = F(Et, n), v = `translate(calc(${b.x} * ${y}), calc(${b.y} * ${y}))`, w = F(At, n), $ = r?.states[o]?.attributes?.friendly_name ?? o;
    return g`
      <div
        class="shutter-mark ${s ? "on" : "off"}"
        data-entity=${he(o) ?? u}
        style="left:${h.x / m.w * 100}%; top:${h.y / m.h * 100}%;
               width:${w};height:${w};
               transform:translate(-50%,-50%) ${v};--fp-active:${p};"
        title="${$} · ${it(r, o)}"
        role="button"
        tabindex="0"
        @action=${() => {
      this.hass && je(this, this.hass, { entity: o }, { action: "more-info" });
    }}
        .actionHandler=${Ee({})}
      >
        <ha-icon
          icon=${c}
          style="--mdc-icon-size:${F(Tt, n)};"
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
  _renderOpeningMark(e, t, i, n, r) {
    const o = e.entity, a = r?.states[o], l = this._openingAmount(e, r) > 0, s = this._openingActive(e, r), c = mo(e, a, l, this.hass?.entities?.[o]?.icon), p = R(e.activeColor) ?? z, d = go(e), h = Ce(d.x, d.y, t.width, t.height, i), m = ve(t.width, t.height, i), b = yo(e, i), y = F(Et, n), v = `translate(calc(${b.x} * ${y}), calc(${b.y} * ${y}))`, w = F(At, n), $ = r?.states[o]?.attributes?.friendly_name ?? o;
    return g`
      <div
        class="shutter-mark ${s ? "on" : "off"}"
        data-entity=${he(o) ?? u}
        style="left:${h.x / m.w * 100}%; top:${h.y / m.h * 100}%;
               width:${w};height:${w};
               transform:translate(-50%,-50%) ${v};--fp-active:${p};"
        title="${$} · ${it(r, o)}"
        role="button"
        tabindex="0"
        @action=${() => {
      this.hass && je(this, this.hass, { entity: o }, { action: "more-info" });
    }}
        .actionHandler=${Ee({})}
      >
        <ha-icon
          icon=${c}
          style="--mdc-icon-size:${F(Tt, n)};"
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
    this._activeFloorId = t, rr.set(or(e), t), this._zoomedAreaId = void 0, !(i || !this.hass || !this._config?.historyReplay?.enabled) && this._replayController.resetForFloorChange();
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
    const i = ft(t, e.detail.action);
    if (!i) {
      e.detail.action === "tap" && this._onAreaClick(t);
      return;
    }
    this.hass && je(this, this.hass, { entity: i.entity }, i.config);
  }
  _renderBadge(e, t, i) {
    const n = C(e.size, we), r = F(n, t), o = e.entity ? i?.states[e.entity] : void 0, a = Qr(e, o?.state, o?.attributes), l = nt(e) === "value" ? no(i, e) : void 0;
    return g`
      <div
        class="badge"
        style="width:${r};height:${r};transform:rotate(${C(e.angle, 0)}deg);"
      >
        ${l ? g`<span
              class="badge-value"
              style="font-size:${F(ao(n, l), t)};"
              >${l}</span
            >` : g`<ha-icon
              class=${a ? `anim-${a}` : ""}
              icon=${this._itemIcon(e, i)}
              style="--mdc-icon-size:${F(to(n), t)};"
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
  _renderItem(e, t, i, n, r) {
    const o = this._isOn(e, r), a = Kr(r, e), l = e.entity ? r?.states[e.entity] : void 0, s = Gi(e, l), c = R(Kt(e.stateColor, s)), p = Zr(e, c), d = !!this.hass && Ah(e, l?.state), h = sh(e, l?.state, r), m = nt(e) !== "none", b = e.display ?? "badge", y = Nr(l), v = R(e.activeColor) ?? y, w = e.rippleColor ?? c ?? e.activeColor ?? y ?? z, $ = wr(
      mt(c ?? v, this._config?.palette)
    ), f = e.rippleSize ?? jt, k = e.rippleDirection ?? Ut, A = e.rippleWidth ?? Bt, O = h ? "visibility: hidden; pointer-events: none;" : "";
    let T = u;
    b === "ripple" ? T = g`<span style="${O}">
        ${Mt(o, w, f, k, A, 3, n)}
      </span>` : b === "iconRipple" ? T = g`<div class="stack" style="${O}">
        ${Mt(o, w, f, k, A, 3, n)}
        ${m ? g`<div class="stack-icon">${this._renderBadge(e, n, r)}</div>` : u}
      </div>` : m && (T = g`<span style="${O}">
        ${this._renderBadge(e, n, r)}
      </span>`);
    const q = Ce(e.x, e.y, t.width, t.height, i), G = ve(t.width, t.height, i), X = Wd(e);
    return g`
      <div
        class="item fp-item ${o ? "on" : "off"} ${d ? "offline" : ""} ${c ? "state-colored" : ""} ${X ? "interactive" : ""}"
        data-id=${V(e.id) ?? u}
        data-entity=${he(e.entity) ?? u}
        data-kind=${V(e.kind) ?? u}
        style="left:${q.x / G.w * 100}%; top:${q.y / G.h * 100}%;${c ? `--fp-state:${c};` : ""}${v ? `--fp-active:${v};` : ""}${$ ? `--fp-ink:${$};` : ""}"
        title=${this._label(e, r)}
        role=${X ? "button" : u}
        tabindex=${X ? "0" : u}
        @action=${(me) => this._handleItemAction(me, e)}
        .actionHandler=${Ee({
      hasHold: ae(e.hold_action),
      hasDoubleClick: ae(e.double_tap_action),
      // Unbinds the gesture listeners outright, so keyboard activation
      // cannot reach an action that would do nothing.
      disabled: !X
    })}
        @pointerdown=${X && ht(t) === "ripple" ? (me) => this._startInk(me) : u}
      >
        ${T}
        ${X && ht(t) === "ripple" ? g`<span class="press-ink" aria-hidden="true"></span>` : u}
        ${a ? g`<span
              class="label ${T === u ? "inflow" : ""} label-${Wi(e)}"
              style="font-size:${F(Vr(e.labelSize), n)};${p ? `color:${p};` : ""}"
              >${a}</span
            >` : u}
      </div>
    `;
  }
  _renderAreaLabel(e, t, i, n) {
    if (!e.name || (e.showName ?? !0) === !1) return u;
    const r = tn(e.points), o = Ce(r.x, r.y, t.width, t.height, i), a = ve(t.width, t.height, i), l = ph(e.labelSize, n);
    return g`
      <div
        class="area-label"
        style="left:${o.x / a.w * 100}%; top:${o.y / a.h * 100}%;${l}"
      >
        ${e.name}
      </div>
    `;
  }
  _renderText(e, t, i, n) {
    const r = Ce(e.x, e.y, t.width, t.height, i), o = ve(t.width, t.height, i);
    return g`
      <div
        class="text fp-text"
        data-id=${V(e.id) ?? u}
        style="left:${r.x / o.w * 100}%; top:${r.y / o.h * 100}%;
               font-size:${F(C(e.size, Ke), n)};
               color:${K(e.color, $r)};
               transform:translate(-50%,-50%) scale(var(--fp-inv-zoom,1)) rotate(${C(e.angle, 0)}deg);"
      >
        ${Di(this.hass, e)}
      </div>
    `;
  }
  render() {
    if (!this._config) return g`${u}`;
    const e = this._config, t = this._replayController.getRenderState(), i = ba(this.hass, this._watchedEntities, this._replayController.historyService(), t.enabled, t.currentTime), n = Fe(e), r = n.find((f) => f.id === this._activeFloorId) ?? n.find((f) => f.id === e.defaultFloor) ?? n[0], o = Zh(e, this._portrait), a = ve(C(e.width, Ie), C(e.height, tt), o), l = Yh(e.width, e.height, o), s = qi(e.overlayScale), c = e.sunDimming ? Qh(
      i?.states["sun.sun"]?.attributes?.elevation,
      C(e.sunBrightnessMin, Pi),
      C(e.sunBrightnessMax, wt)
    ) : wt, p = e.showDeadSpaces ? Fr(r.walls, r.openings) : [], h = e.sunDimming || r.items.some((f) => f.glow) ? Ui(
      r.walls,
      r.openings,
      (f) => (
        // Both leaves, and the travel each style actually has (issue #145):
        // asking `entity` alone left a door whose *second* panel was open
        // still blocking light outright. Glass admits it whole regardless
        // of sash — a closed window is not a hole, but light still gets
        // through it. A shutter rolled down overrides that, same as it
        // does for sunlight.
        jr(
          f,
          this._openingAmount(f, i),
          this._openingSecond(f, i)?.amount,
          f.shutterEntity ? le(i?.states[f.shutterEntity], f.shutterInvert) : void 0
        )
      )
    ) : r.walls, m = `${this._glowIdBase}-sundim`, b = e.sunDimming ? ah(
      r.items,
      i?.states,
      e.width,
      e.height,
      m,
      h
    ) : u, y = r.areas?.find((f) => f.id === this._zoomedAreaId), v = y ? gp(
      y.points,
      e.width,
      e.height,
      o,
      void 0,
      void 0,
      // A room may say how close to go; without one the fit decides,
      // exactly as it always has (issue #222).
      yp(y)
    ) : yi, w = e.compactHeader === !0, $ = w && !!e.title;
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
      <!-- The palette (issue #265) rides here, above everything that could
           name one of its colours — the floor switcher and the card background
           as well as the plan. Inline rather than on :host like the skin
           tokens, because unlike a skin it is per-config data and there is no
           fixed set of rules to write ahead of time. It declares only
           --fp-color-* names, so a card-mod rule on this element still owns
           every --fp-skin-* token exactly as issue #155 left it. -->
      <ha-card
        .header=${w ? u : e.title ?? u}
        style=${Io(e.palette) || u}
      >
        <div class="card-shell ${this._replayController.isHistoryVisible() ? "replay-visible" : ""}">
          ${this._config.historyReplay?.enabled ? this._renderReplayPanel() : u}
          <div
            class="stage press-${ht(e)} offline-${io(e)} ${$ ? "compact-title" : ""}"
            style="aspect-ratio: ${a.w} / ${a.h};"
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
            style="aspect-ratio: ${a.w} / ${a.h};
                   width: min(100%, calc(100cqh * ${a.w} / ${a.h}));
                   --fp-plan-w: ${a.w};
                   background:${K(e.background, Nt)};"
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
               Only on a skin change; ordinary state updates are untouched.

               Recolouring a palette entry (issue #265) is the same change seen
               from the other end — a custom property moving under a var() in a
               presentation attribute — so it is in this key too. -->
          ${_r(
      `${e.skin ?? ""}|${Po(e.palette)}`,
      _`<svg viewBox="0 0 ${a.w} ${a.h}" preserveAspectRatio="none">
            <g transform=${l || u}>
            ${r.image ? _`<image href=${r.image} x="0" y="0" width=${e.width} height=${e.height}
                          preserveAspectRatio=${wo(r.imageFit)}
                          opacity=${r.imageOpacity ?? 1} />` : u}
            ${r.areas?.map((f) => {
        const k = jh(f);
        return _`<g class="area-tap-target"
                    role=${k ? "button" : u}
                    tabindex=${k ? "0" : u}
                    @action=${(A) => this._onAreaAction(A, f)}
                    .actionHandler=${Ee({
          // Only wait out the timers when a gesture can resolve:
          // otherwise every tap on an ordinary room would sit for
          // 500ms before zooming.
          hasHold: ae(ft(f, "hold")?.config),
          hasDoubleClick: ae(ft(f, "double_tap")?.config)
        })}>
                  ${So(f, Bn(f, f.entity ? i?.states[f.entity]?.state : void 0))}
                </g>`;
      })}
            <!-- Dead spaces (issue #88): the regions the walls seal off that no
                 door or window reaches, hatched. Above the room fills, so a
                 region someone has also drawn an area over still reads as
                 unreachable; below everything else, because it describes the
                 floor rather than anything standing on it. -->
            ${p.length ? _`${$o(`${this._wallMaskId}-dead`)}
                    ${p.map(
        (f) => ko(f, `${this._wallMaskId}-dead`)
      )}` : u}
            <!-- Light pools (issue #6). Above the room fills but below the
                 furniture and walls, so light reads as cast onto the floor
                 rather than painted over the plan. Isolated as one layer: the
                 pools screen-blend with each other (two lamps brighten where
                 they meet) without screening against the plan beneath, which
                 would wash out on a light theme. -->
            ${Wr(
        r.furniture,
        e.width,
        e.height,
        `${this._glowIdBase}-mask`,
        di(e.symbols)
      )}
            <g class="fp-glows"
               mask=${r.furniture.length ? `url(#${this._glowIdBase}-mask)` : u}>
              ${r.items.map((f, k) => {
        if (!f.glow) return u;
        const A = Ni(f, i?.states[f.entity]);
        return A ? Br(f, A, `${this._glowIdBase}-${k}`, h) : u;
      })}
            </g>
            ${r.furniture.map((f) => {
        const k = bi(
          f,
          ih(f, f.entity ? i?.states[f.entity]?.state : void 0),
          di(e.symbols)
        ), A = Eh(f, n, r.id);
        if (!A) return k;
        const O = n.find((T) => T.id === A)?.name;
        return _`<g class="fp-furniture-link" role="button" tabindex="0"
                    @action=${() => this._goToFloor(n, A)}
                    .actionHandler=${Ee({
          // A staircase has one gesture. Saying so keeps a tap from
          // sitting out the hold and double-tap timers before it
          // does anything.
          hasHold: !1,
          hasDoubleClick: !1
        })}>
                  <!-- An SVG tooltip is a <title> child, not a title=
                       attribute: the attribute does nothing here. -->
                  <title>${O ? `Go to ${O}` : "Go to the next floor"}</title>
                  ${k}
                </g>`;
      })}
            <!-- Sunlight through the openings. Under the walls on purpose:
                 light lands on the floor, and the walls stay crisp lines over
                 it rather than being tinted by the patches they let in. The
                 sun dimming further down is the whole-sky reading and still
                 has the last word — at night there is nothing to let in. -->
            ${e.sunlight ? mp(
        r.walls,
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
          dir: pp(
            e,
            i?.states["sun.sun"]?.attributes?.azimuth
          ),
          strength: ip(
            e,
            i?.states["sun.sun"]?.attributes?.elevation
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
          reach: C(e.sunReach, Ct) * (Zt(e) ? 1 : cp(i?.states["sun.sun"]?.attributes?.elevation)),
          // The gap each style actually clears, both leaves
          // included — the same reading the lamps get above, and
          // for the same reason (#145): `entity` alone leaves a
          // door whose *second* panel is open reading as shut,
          // and a converging pair reading as twice as clear as it
          // draws. Glazing and shutters are applied on top of
          // this, inside openingSunFraction.
          openAmount: (f) => Hr(
            f,
            this._openingAmount(f, i),
            this._openingSecond(f, i)?.amount
          ),
          // A shutter that is all the way down stops the light, as
          // one does. Undefined where none is bound, so an opening
          // without a shutter is judged on itself alone.
          shutterOpen: (f) => f.shutterEntity ? le(i?.states[f.shutterEntity], f.shutterInvert) : void 0,
          light: e.sunlightColor ?? mi,
          shade: e.sunShade === !1 ? null : e.sunShadeColor ?? gi
        }
      ) : u}
            ${xo(r.openings, e.width, e.height, this._wallMaskId)}
            ${r.walls.map(
        (f) => _`
                <g class="fp-wall-neon"><line x1=${f.x1} y1=${f.y1} x2=${f.x2} y2=${f.y2}
                      class="wall fp-wall" data-id=${V(f.id) ?? u}
                      mask=${`url(#${this._wallMaskId})`}
                      style=${Xr(f.thickness)} stroke-linecap="round" /></g>`
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
        (f, k) => Eo(
          f,
          Bn(f, f.entity ? i?.states[f.entity]?.state : void 0),
          `${this._wallMaskId}-area-${k}`
        )
      )}
            </g>
            ${ie(
        // Keyed by id: switching floors must create fresh DOM nodes.
        // Unkeyed, Lit morphs floor A's openings into floor B's, and the
        // 0.5s leaf/panel transitions animate the leftover state — a
        // window briefly plays a door swing (issue #50).
        r.openings,
        (f, k) => f.id || k,
        (f) => {
          const k = this._openingAmount(f, i), A = f.shutterEntity ? i?.states[f.shutterEntity] : void 0, O = bo(f, {
            color: Ci,
            open: k > 0,
            amount: k,
            active: this._openingActive(f, i),
            accent: f.activeColor ?? z,
            // Per-leaf state for a two-sensor biparting slider (issue #145).
            second: this._openingSecond(f, i),
            // External roller shutter layer (issue #74). No entity bound
            // yet → previewed shut, like a static plan.
            shutter: f.shutterEntity ? {
              amount: le(A, f.shutterInvert),
              active: ut(A, f.shutterInvert),
              style: Pe(f),
              // The shutter's own accent, falling back to the
              // opening's and then to the skin's.
              accent: f.shutterActiveColor ?? f.activeColor ?? z,
              flip: f.shutterFlipV,
              // Per-panel state for a two-contact hinged shutter
              // (issue #159).
              second: this._shutterSecond(f, i)
            } : void 0
          });
          if (!Uh(f, this._featuresOf)) return O;
          const T = f.length / 2, q = H + 4;
          return _`<g class="fp-opening" role="button" tabindex="0"
                    @action=${(G) => this._onOpeningAction(G, f)}
                    .actionHandler=${Ee({
            // Only wait out the hold/double-tap timers when a gesture
            // actually resolves: otherwise every tap on a plain
            // contact sensor would sit for 500ms before answering.
            hasHold: ae(this._openingPress(f, "hold")?.config),
            hasDoubleClick: ae(this._openingPress(f, "double_tap")?.config)
          })}>
                  ${O}
                  <rect class="fp-opening-hit" x=${f.x - T} y=${f.y - q / 2}
                        width=${f.length} height=${q}
                        transform="rotate(${f.angle} ${f.x} ${f.y})" />
                </g>`;
        }
      )}
            ${ie(
        r.trackers ?? [],
        (f, k) => f.id || k,
        (f) => Ao(f, {
          editing: !1,
          xReading: It(i?.states, f.xSensor?.entity),
          yReading: It(i?.states, f.ySensor?.entity),
          xPresent: kt(i?.states, f.xSensor?.presence),
          yPresent: kt(i?.states, f.ySensor?.presence)
        })
      )}
            <!-- Sun dimming (issue #113). Last inside the rotated group, so it
                 covers the whole plan; the device overlay below is HTML and
                 stays at full brightness, keeping icons and state readable at
                 night. pointer-events:none is not optional — this rect spans
                 the canvas, and without it every tappable opening underneath
                 stops responding (the lesson from #108). -->
            ${e.sunDimming ? _`${b}<rect class="fp-sun-dim"
                            x=${-H} y=${-H}
                            width=${e.width + H * 2}
                            height=${e.height + H * 2}
                            fill="#000"
                            mask=${b === u ? u : `url(#${m})`}
                            opacity=${1 - c} />` : u}
            </g>
          </svg>`
    )}
          <div
            class="items"
            style="--fp-inv-zoom:${bp(v.scale, e.zoomedOverlayScale)};"
          >
            ${r.areas?.map((f) => this._renderAreaLabel(f, e, o, s))}
            ${r.texts.map((f) => this._renderText(f, e, o, s))}
            ${ie(
      // Keyed like the openings above: a floor switch must build fresh
      // nodes rather than morph one floor's badges into another's.
      r.openings.filter((f) => ho(f)),
      (f, k) => `${f.id || k}-shutter`,
      (f) => this._renderShutterMark(f, e, o, s, i)
    )}
            ${ie(
      r.openings.filter((f) => fo(f)),
      (f, k) => `${f.id || k}-opening`,
      (f) => this._renderOpeningMark(f, e, o, s, i)
    )}
            ${ie(
      // No entity filter: devices that exist physically but have no HA
      // entity still deserve their badge (issue #39). Keyed by id so a
      // floor switch builds fresh DOM (see the openings comment).
      // "Only when active" devices drop out here (issue #55) — the
      // editor still draws them, dimmed, so they stay editable.
      r.items.filter(
        (f) => !qr(
          f,
          f.entity ? i?.states[f.entity]?.state : void 0
        )
      ),
      (f, k) => f.id || k,
      (f) => this._renderItem(f, e, o, s, i)
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
              </button>` : u}
          ${$ ? g`<div class="plan-title">${e.title}</div>` : u}
          ${n.length > 1 ? this._renderFloorSwitcher(n, r, w) : u}
        </div>
        </div>
      </ha-card>
    `;
  }
  _renderReplayPanel() {
    return Op(Pp(this._replayController));
  }
  _renderFloorSwitcher(e, t, i = !1) {
    return g`
      <div class="floor-switcher ${i ? "row" : ""}">
        ${e.map((n) => {
      const r = n.id === t.id ? R(n.color) : void 0;
      return g`
            <button
              class=${n.id === t.id ? "active" : ""}
              title=${n.name}
              style=${r ? `background:${r};border-color:${r};` : u}
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
Z._nextWallMaskId = 0;
Z._nextGlowId = 0;
Z.styles = [
  kr,
  Pa,
  ot`
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
      width: ${$t}px;
      height: ${$t}px;
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
       replace it — restating scale(${En}) alone would drop the
       counter-scale along with the translate, and a badge held down at 4x
       zoom would balloon to roughly 4x its resting size instead of shrinking. */
    .press-scale .item.interactive {
      transition: transform ${Tn}ms cubic-bezier(0.2, 0.8, 0.3, 1);
    }
    .press-scale .item.interactive:active {
      transform: translate(-50%, -50%) scale(calc(var(--fp-inv-zoom, 1) * ${En}));
      transition-duration: ${An}ms;
    }

    /* Flash: drop-shadow rather than a box-shadow or a background, so the halo
       follows whatever the device actually draws — the badge's circle, a bare
       ripple ring, the label — instead of a rectangle around it. */
    .press-flash .item.interactive {
      transition: filter ${Tn}ms ease-out;
    }
    .press-flash .item.interactive:active {
      filter: drop-shadow(0 0 5px var(--fp-skin-accent, var(--primary-color, #03a9f4)));
      transition-duration: ${An}ms;
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
      font-size: ${Oi}px;
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
  `
];
De([
  P({ attribute: !1 })
], Z.prototype, "hass", 2);
De([
  M()
], Z.prototype, "_config", 2);
De([
  M()
], Z.prototype, "_activeFloorId", 2);
De([
  M()
], Z.prototype, "_zoomedAreaId", 2);
De([
  M()
], Z.prototype, "_portrait", 2);
Z = De([
  Ft("easy-floorplan-card")
], Z);
const Me = 26, qp = 0.75;
function Gp(e, t, i, n = qp) {
  const r = e.find((l) => l.id === t);
  if (!r) return;
  const o = [];
  i !== 2 && o.push({ x: r.x1, y: r.y1, which: 1 }), i !== 1 && o.push({ x: r.x2, y: r.y2, which: 2 });
  const a = [];
  for (const l of e)
    if (l.id !== r.id)
      for (const s of [1, 2]) {
        const c = s === 1 ? l.x1 : l.x2, p = s === 1 ? l.y1 : l.y2, d = o.find((h) => Math.hypot(c - h.x, p - h.y) <= n);
        d && a.push({ id: l.id, end: s, which: d.which, x0: c, y0: p });
      }
  return a.length ? a : void 0;
}
function Lo(e, t, i, n) {
  let r = null, o = n;
  for (const a of e) {
    const l = Math.hypot(t - a.x, i - a.y);
    l < o && (o = l, r = { x: a.x, y: a.y });
  }
  return r;
}
function Fo(e, t, i, n) {
  const r = e.flatMap((o) => [
    { x: o.x1, y: o.y1 },
    { x: o.x2, y: o.y2 }
  ]);
  return Lo(r, t, i, n);
}
function Kp(e, t, i, n, r) {
  const o = e.walls.flatMap((l) => [
    { x: l.x1, y: l.y1 },
    { x: l.x2, y: l.y2 }
  ]), a = (e.areas ?? []).flatMap(
    (l) => l.points.filter((s, c) => !(r && r.areaId === l.id && r.vertexIndex === c)).map((s) => ({ x: s.x, y: s.y }))
  );
  return Lo([...o, ...a], t, i, n);
}
function ar(e, t, i) {
  const n = e.areas ?? [];
  for (let r = n.length - 1; r >= 0; r--)
    if (en(n[r].points, t, i)) return n[r];
}
function Vp(e, t) {
  if (t <= 0) return [];
  const i = tn(e);
  if (t === 1) return [i];
  const n = e.map((d) => d.x), r = e.map((d) => d.y), o = Math.min(...n), a = Math.max(...n), l = Math.min(...r), s = Math.max(...r), c = Math.max(a - o, 1), p = Math.max(s - l, 1);
  for (let d = 1; d <= 8; d++) {
    const h = t * d, m = Math.max(1, Math.round(Math.sqrt(h * c / p))), b = Math.max(1, Math.ceil(h / m)), y = c / (m + 1), v = p / (b + 1), w = [];
    for (let $ = 1; $ <= b; $++)
      for (let f = 1; f <= m; f++) {
        const k = o + f * y, A = l + $ * v;
        en(e, k, A) && w.push({ x: k, y: A });
      }
    if (w.length >= t)
      return Array.from(
        { length: t },
        ($, f) => w[Math.floor(f * w.length / t)]
      );
  }
  return Array.from({ length: t }, (d, h) => {
    const m = h / t * Math.PI * 2, b = Math.min(c, p) * 0.15 * (1 + Math.floor(h / 6));
    return { x: i.x + Math.cos(m) * b, y: i.y + Math.sin(m) * b };
  });
}
function Zp(e, t, i, n, r, o, a, l, s = Me) {
  if (a) return { x: o(n), y: o(r) };
  const c = Fo(e, n, r, s);
  if (c) return c;
  const p = n - t, d = r - i, h = Math.tan(l * Math.PI / 180);
  return Math.abs(d) <= Math.abs(p) * h ? { x: o(n), y: i } : Math.abs(p) <= Math.abs(d) * h ? { x: t, y: o(r) } : { x: o(n), y: o(r) };
}
function Xp(e, t) {
  const i = Math.min(t.x0, t.x1), n = Math.max(t.x0, t.x1), r = Math.min(t.y0, t.y1), o = Math.max(t.y0, t.y1), a = (s, c) => s >= i && s <= n && c >= r && c <= o, l = [];
  for (const s of e.walls)
    a((s.x1 + s.x2) / 2, (s.y1 + s.y2) / 2) && l.push({ kind: "wall", id: s.id });
  for (const s of e.openings) a(s.x, s.y) && l.push({ kind: "opening", id: s.id });
  for (const s of e.items) a(s.x, s.y) && l.push({ kind: "item", id: s.id });
  for (const s of e.texts) a(s.x, s.y) && l.push({ kind: "text", id: s.id });
  for (const s of e.furniture) a(s.x, s.y) && l.push({ kind: "furniture", id: s.id });
  for (const s of e.trackers ?? [])
    a(s.x + s.w / 2, s.y + s.h / 2) && l.push({ kind: "tracker", id: s.id });
  for (const s of e.areas ?? []) {
    const c = tn(s.points);
    a(c.x, c.y) && l.push({ kind: "area", id: s.id });
  }
  return l;
}
function Yp(e, t, i, n) {
  return {
    walls: e.walls.map((r) => {
      const o = n.get(`wall:${r.id}`);
      return o && o.kind === "wall" ? { ...r, x1: o.x1 + t, y1: o.y1 + i, x2: o.x2 + t, y2: o.y2 + i } : r;
    }),
    openings: e.openings.map((r) => {
      const o = n.get(`opening:${r.id}`);
      return o && o.kind === "pt" ? { ...r, x: o.x + t, y: o.y + i } : r;
    }),
    items: e.items.map((r) => {
      const o = n.get(`item:${r.id}`);
      return o && o.kind === "pt" ? { ...r, x: o.x + t, y: o.y + i } : r;
    }),
    texts: e.texts.map((r) => {
      const o = n.get(`text:${r.id}`);
      return o && o.kind === "pt" ? { ...r, x: o.x + t, y: o.y + i } : r;
    }),
    furniture: e.furniture.map((r) => {
      const o = n.get(`furniture:${r.id}`);
      return o && o.kind === "pt" ? { ...r, x: o.x + t, y: o.y + i } : r;
    }),
    trackers: (e.trackers ?? []).map((r) => {
      const o = n.get(`tracker:${r.id}`);
      return o && o.kind === "pt" ? { ...r, x: o.x + t, y: o.y + i } : r;
    }),
    areas: (e.areas ?? []).map((r) => {
      const o = n.get(`area:${r.id}`);
      return o && o.kind === "polygon" ? { ...r, points: o.points.map((a) => ({ x: a.x + t, y: a.y + i })) } : r;
    })
  };
}
const Qp = [
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
], Be = {
  wall: 11,
  /** Padding around an item badge / text box so small glyphs stay grabbable. */
  pad: 4
};
function lt(e, t, i, n, r) {
  const o = -(r || 0) * Math.PI / 180, a = e - i, l = t - n;
  return { x: a * Math.cos(o) - l * Math.sin(o), y: a * Math.sin(o) + l * Math.cos(o) };
}
function Jp(e, t, i) {
  const n = i.x2 - i.x1, r = i.y2 - i.y1, o = n * n + r * r;
  if (o === 0) return Math.hypot(e - i.x1, t - i.y1);
  let a = ((e - i.x1) * n + (t - i.y1) * r) / o;
  return a = Math.max(0, Math.min(1, a)), Math.hypot(e - (i.x1 + a * n), t - (i.y1 + a * r));
}
function eu(e, t, i, n) {
  const r = [], o = (a, l, s, c) => r.push({ sel: { kind: a, id: l }, rank: Qp.indexOf(a), order: s, locked: !!c });
  return e.items.forEach((a, l) => {
    const s = (a.size ?? n.itemSize) / 2 + Be.pad;
    Math.abs(t - a.x) <= s && Math.abs(i - a.y) <= s && o("item", a.id, l, a.locked);
  }), e.texts.forEach((a, l) => {
    const s = a.size ?? n.textSize, c = s * 0.6 * Math.max(1, Di(n.hass, a).length) / 2 + Be.pad, p = s / 2 + Be.pad, d = lt(t, i, a.x, a.y, a.angle ?? 0);
    Math.abs(d.x) <= c && Math.abs(d.y) <= p && o("text", a.id, l, a.locked);
  }), e.openings.forEach((a, l) => {
    const s = lt(t, i, a.x, a.y, a.angle ?? 0);
    Math.abs(s.x) <= a.length / 2 && Math.abs(s.y) <= n.wallThickness / 2 + Be.pad && o("opening", a.id, l, a.locked);
  }), e.furniture.forEach((a, l) => {
    const s = lt(t, i, a.x, a.y, a.angle ?? 0);
    Math.abs(s.x) <= a.w / 2 && Math.abs(s.y) <= a.h / 2 && o("furniture", a.id, l, a.locked);
  }), e.walls.forEach((a, l) => {
    Jp(t, i, a) <= Be.wall && o("wall", a.id, l, a.locked);
  }), (e.trackers ?? []).forEach((a, l) => {
    const s = lt(t, i, a.x + a.w / 2, a.y + a.h / 2, a.angle ?? 0);
    Math.abs(s.x) <= a.w / 2 && Math.abs(s.y) <= a.h / 2 && o("tracker", a.id, l, a.locked);
  }), (e.areas ?? []).forEach((a, l) => {
    en(a.points, t, i) && o("area", a.id, l, a.locked);
  }), r.sort((a, l) => Number(a.locked) - Number(l.locked) || a.rank - l.rank || l.order - a.order).map((a) => a.sel);
}
function Ro(e, t) {
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
function ct(e, t) {
  return !!Ro(e, t)?.locked;
}
function tu(e, t) {
  return t.filter((i) => {
    const n = Ro(e, i);
    return !!n && !n.locked;
  });
}
function iu(e, t, i) {
  if (!e.length) return null;
  if (!i || t.length !== 1) return e[0];
  const n = e.findIndex((r) => r.kind === t[0].kind && r.id === t[0].id);
  return n < 0 ? e[0] : e[(n + 1) % e.length];
}
const nu = {
  request: (e) => requestAnimationFrame(e),
  cancel: (e) => cancelAnimationFrame(e)
};
class ru {
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
const sr = "Apply needs Home Assistant's card editor — use Save instead.", ou = "Save this card once first — it isn't on the dashboard yet.", au = 200;
function su(e) {
  let t = e;
  for (let i = 0; t && i < au; i++) {
    const n = t;
    if (typeof n._params?.saveCardConfig == "function") return n;
    t = t.parentNode ?? t.host ?? null;
  }
  return null;
}
async function lu(e) {
  const t = su(e);
  if (!t) return { ok: !1, error: sr };
  if (t._params?.isNew) return { ok: !1, error: ou };
  const i = t._cardConfig;
  if (!i || typeof i != "object")
    return { ok: !1, error: sr };
  try {
    await t._params.saveCardConfig(i);
  } catch (n) {
    return { ok: !1, error: `Could not save — ${n instanceof Error ? n.message : String(n)}` };
  }
  return typeof t._markDirtyStateClean == "function" ? t._markDirtyStateClean() : typeof t._dirty == "boolean" && (t._dirty = !1), { ok: !0 };
}
function lr(e) {
  return "text" in e.selector || "number" in e.selector;
}
function cu(e, t, i) {
  const n = {};
  for (const r of i)
    t[r.name] !== e[r.name] && (n[r.name] = t[r.name]);
  return n;
}
function cr(e, t) {
  const i = {};
  for (const n of t) {
    if (!(n.name in e)) continue;
    let r = e[n.name];
    if ("text" in n.selector || "icon" in n.selector || "entity" in n.selector || "attribute" in n.selector)
      (r === "" || r == null) && (r = n.required ? "" : void 0);
    else if ("number" in n.selector) {
      const o = typeof r == "string" && r !== "" ? Number(r) : r;
      if (typeof o != "number" || !Number.isFinite(o)) {
        if (n.required) continue;
        r = void 0;
      } else {
        const a = n.selector.number;
        let l = n.name === "angle" ? (o % 360 + 360) % 360 : o;
        a.min !== void 0 && l < a.min && (l = a.min), a.max !== void 0 && l > a.max && (l = a.max), r = l;
      }
    } else "boolean" in n.selector && (r = !!r);
    i[n.name] = r;
  }
  return i;
}
const fe = (e) => e, dr = ["binary_sensor", "cover", "lock"];
function J(e, t) {
  return { fields: t.map((n) => e.fields.find((r) => r.name === n)).filter((n) => !!n), data: e.data, toPatch: e.toPatch };
}
const at = () => ({
  name: "angle",
  label: "Angle",
  selector: { number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" } }
}), x = (e, t) => ({ value: e, label: t }), L = (...e) => ({
  select: { mode: "dropdown", options: e }
});
function zo(e = re) {
  return Rd(e);
}
function du(e, t = re) {
  return Gt(t, e)?.name ?? e;
}
function hu(e, t = () => 0) {
  const i = W(e), n = Vt(e), r = Ze(e), o = [
    { name: "type", label: "Type", selector: L(x("door", "Door"), x("window", "Window")) },
    {
      name: "motion",
      label: "Motion",
      selector: L(
        x("swing", "Swing"),
        x("slide", "Slide"),
        // Not "garage / shutter": an external shutter is the Shutter field
        // below, a layer over any opening, and naming it here read as the
        // place to set one up.
        x("roll", "Roll up (garage)"),
        ...e.type === "window" ? [x("fixed", "Fixed (does not open)")] : []
      )
    },
    { name: "length", label: "Length", required: !0, selector: { number: { min: 1, mode: "box" } } }
  ];
  if (i === "swing") {
    const a = e.type === "door";
    o.push({
      name: "sash",
      label: a ? "Leaves" : "Sashes",
      helper: a ? "Double = two leaves meeting in the middle, hinged at each jamb" : "Single = one full-width sash (issue #73)",
      selector: a ? L(x("single", "Single (one leaf)"), x("double", "Double (two leaves)")) : L(x("double", "Double (two leaves)"), x("single", "Single sash"))
    });
  }
  return i === "swing" && pe(e) === "single" && o.push({
    name: "sashSpan",
    label: e.type === "door" ? "Leaf width" : "Sash width",
    helper: e.type === "door" ? "Share of the opening that actually swings — the rest is a fixed panel" : "Share of the opening that actually opens — the rest is fixed glass",
    selector: { number: { min: Rr, max: 1, step: 0.05, mode: "slider" } }
  }), e.type === "door" && o.push({
    name: "glazed",
    label: "Glazed",
    helper: "Lets sunlight through even when shut — a patio or French door",
    selector: { boolean: {} }
  }), o.push({
    name: "sunlight",
    label: "Lets sunlight in",
    helper: "Off makes it wall to the sun — for a solid door the plan draws open",
    selector: { boolean: {} }
  }), i === "swing" && pe(e) === "single" && o.push({
    name: "hinge",
    label: "Hinge",
    selector: L(x("left", "Left"), x("right", "Right"))
  }), i === "swing" && o.push({
    name: "opens",
    label: "Opens",
    selector: L(x("this", "This side"), x("other", "Other side"))
  }), i === "slide" && (r || o.push({
    name: "slide",
    label: "Slide",
    selector: L(x("left", "To left"), x("right", "To right"))
  }), o.push({
    name: "style",
    label: "Style",
    selector: L(
      x("single", "Single"),
      x("bypass", "Bypass (stack)"),
      x("biparting", "Biparting (into the walls)"),
      x("biparting-bypass", "Biparting (over fixed panels)"),
      x("converging", "Converging (both panels stack in the middle)")
    )
  })), o.push({
    name: "entity",
    label: "Entity",
    // Says locks are usable, because nothing else would: a lock is neither a
    // contact nor a cover, and its states are `locked` / `unlocked` rather
    // than anything that looks like open/closed (issue #176).
    helper: r ? "Contact, cover or lock. Drives the first leaf; type and motion follow its device class" : "Contact, cover or lock — a lock reads unlocked as open. Type and motion follow its device class",
    selector: { entity: { filter: [{ domain: dr }] } }
  }), r && e.entity && o.push({
    name: "secondaryEntity",
    label: "Second leaf",
    helper: "Its own sensor for the other leaf — leave empty to move both together",
    selector: { entity: { filter: [{ domain: dr }] } }
  }), o.push({
    name: "shutterEntity",
    label: "Shutter",
    helper: "External shutter over this opening — a cover, or a contact sensor",
    selector: { entity: { filter: [{ domain: ["cover", "binary_sensor"] }] } }
  }), e.shutterEntity && (o.push({
    name: "shutterStyle",
    label: "Shutter type",
    helper: "Hinged panels fold back against the wall; roll-up slats disappear upward",
    selector: L(x("swing", "Hinged (louvered panels)"), x("roll", "Roll-up (slats)"))
  }), Pe(e) === "swing" && o.push({
    name: "shutterSide",
    label: "Shutter side",
    helper: "Which side of the wall the panels hang on",
    selector: L(x("far", "Away from the sash"), x("near", "Same side as the sash"))
  }), Pe(e) === "swing" && o.push({
    name: "shutterSecondaryEntity",
    label: "Second shutter panel",
    helper: "Its own contact for the other panel — leave empty to fold both together",
    selector: { entity: { filter: [{ domain: ["binary_sensor", "cover"] }] } }
  }), o.push({
    name: "shutterInvert",
    label: "Invert shutter animation",
    selector: { boolean: {} }
  })), o.push({
    name: "invert",
    label: e.type === "door" ? "Invert door animation" : "Invert window animation",
    helper: e.entity ? void 0 : (
      // Only a swing door draws open with no sensor to ask
      // (openingDefaultOpen) — everything else, door or window, draws shut.
      e.type === "door" && W(e) === "swing" ? "No sensor bound — draws shut instead of open" : "No sensor bound — draws open instead of shut"
    ),
    selector: { boolean: {} }
  }), o.push(at()), e.entity && (o.push({
    name: "showIcon",
    label: "Show icon",
    helper: W(e) === "roll" ? "A raised roll-up leaves only a line — this puts its state beside it, and opens its dialog when tapped" : "Shows this opening's state beside it, and opens its dialog when tapped",
    selector: { boolean: {} }
  }), e.showIcon && o.push({
    name: "icon",
    label: "Icon",
    helper: "Overrides the entity's own icon, which changes with its state",
    selector: { icon: {} }
  })), e.entity && e.shutterEntity && (o.push({
    name: "showShutterIcon",
    label: "Shutter icon",
    helper: "Shows the shutter's state beside the opening, and opens it when tapped",
    selector: { boolean: {} }
  }), (e.showShutterIcon ?? !0) && o.push({
    name: "shutterIcon",
    label: "Icon",
    helper: "Overrides the shutter entity's own icon, which changes with its state",
    selector: { icon: {} }
  }), o.push({
    name: "tapTarget",
    label: "Tap opens",
    helper: "The other one moves to press-and-hold. Opens the dialog; use Tap action below to move the shutter itself",
    selector: L(
      x("opening", e.type === "door" ? "The door" : "The window"),
      x("shutter", "The shutter")
    )
  })), (e.entity || e.shutterEntity) && o.push(
    {
      name: "tap_action",
      label: "Tap action",
      selector: {
        ui_action: {
          default_action: Zi(e, "tap", t)?.config.action ?? "none"
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
    fields: o,
    data: {
      type: e.type,
      motion: i,
      length: e.length,
      hinge: e.flipH ? "right" : "left",
      opens: e.flipV ? "other" : "this",
      slide: e.flipH ? "right" : "left",
      style: n,
      sash: pe(e),
      entity: e.entity ?? "",
      secondaryEntity: e.secondaryEntity ?? "",
      glazed: Ji(e),
      sunlight: e.sunlight ?? !0,
      shutterEntity: e.shutterEntity ?? "",
      shutterSecondaryEntity: e.shutterSecondaryEntity ?? "",
      shutterStyle: Pe(e),
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
    toPatch(a) {
      const l = {};
      for (const [s, c] of Object.entries(a))
        if (s === "shutterEntity")
          l.shutterEntity = c, c || (l.shutterStyle = void 0, l.shutterFlipV = void 0, l.shutterInvert = void 0, l.shutterActiveColor = void 0, l.shutterSecondaryEntity = void 0, l.tapTarget = void 0, l.showShutterIcon = void 0, l.shutterIcon = void 0);
        else if (s === "sunlight")
          l.sunlight = c ? void 0 : !1;
        else if (s === "glazed")
          l.glazed = e.type === "door" && c ? !0 : void 0;
        else if (s === "entity")
          l.entity = c, c || (l.showIcon = void 0, l.icon = void 0);
        else if (s === "shutterSide") l.shutterFlipV = c === "near" || void 0;
        else if (s === "shutterInvert") l.shutterInvert = c || void 0;
        else if (s === "tapTarget") l.tapTarget = c === "shutter" ? "shutter" : void 0;
        else if (s === "showShutterIcon") l.showShutterIcon = c ? void 0 : !1;
        else if (s === "showIcon")
          l.showIcon = c ? !0 : void 0, c || (l.icon = void 0);
        else if (s === "motion") {
          const p = c === "slide" || c === "roll" || c === "fixed" ? c : void 0;
          l.motion = p, c !== "slide" && (l.sliderStyle = void 0), c !== "swing" && (l.sashSpan = void 0), Ze({
            ...e,
            motion: p,
            sliderStyle: c === "slide" ? e.sliderStyle : void 0
          }) || (l.secondaryEntity = void 0);
        } else s === "sashSpan" ? l.sashSpan = typeof c == "number" && c < 1 ? c : void 0 : s === "sash" ? (l.sash = c === pi(e.type) ? void 0 : c, Ze({ ...e, sash: c }) || (l.secondaryEntity = void 0), c === "double" && (l.sashSpan = void 0)) : s === "shutterStyle" ? (l.shutterStyle = c, c !== "swing" && (l.shutterSecondaryEntity = void 0)) : s === "hinge" || s === "slide" ? l.flipH = c === "right" || void 0 : s === "opens" ? l.flipV = c === "other" || void 0 : s === "style" ? (l.sliderStyle = c === "single" ? void 0 : c, so(c) || (l.secondaryEntity = void 0)) : s === "invert" ? l.invert = c || void 0 : l[s] = c;
      return l;
    }
  };
}
function nn(e, t) {
  return e?.entities.length ? { entity: { include_entities: t && !e.entities.includes(t) ? [...e.entities, t] : e.entities } } : { entity: {} };
}
function rn(e, t) {
  if (!e?.entities.length) return t;
  const n = `Only entities in ${e.name ? `the ${e.name} area` : "this area"} — turn off “Filter entities” on the area to see all`;
  return t ? `${t}. ${n}` : n;
}
function gt(e) {
  if ((e.display ?? "badge") === "ripple") return "none";
  const t = nt(e);
  if (t !== "icon") return t;
  const i = e.iconAnimation ?? "auto";
  return i === "spin" || i === "pulse" ? i : i === "auto" ? Yr(e.entity) ?? "icon" : "icon";
}
function on(e) {
  return (e.display ?? "badge") !== "badge";
}
function Do(e, t) {
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
function pu(e, t) {
  return {
    fields: [
      {
        name: "entity",
        label: "Entity",
        required: !0,
        helper: rn(t),
        selector: nn(t, e.entity)
      },
      {
        name: "attribute",
        label: "Attribute",
        helper: "Show this attribute instead of the state (e.g. current_temperature)",
        selector: { attribute: { entity_id: e.entity } }
      }
    ],
    data: { entity: e.entity ?? "", attribute: e.attribute ?? "" },
    toPatch: fe
  };
}
function uu(e) {
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
    toPatch: fe
  };
}
function fu(e) {
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
    toPatch: fe
  };
}
function mu(e) {
  const t = [
    {
      name: "labelPosition",
      label: "Label position",
      helper: "Beside the badge instead of under it — a long reading then grows one way only",
      selector: L(x("below", "Below"), x("left", "Left"), x("right", "Right"))
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
      labelPosition: Wi(e),
      labelSize: e.labelSize ?? Gr,
      disableLabelColor: e.disableLabelColor ?? !1,
      useCustomLabelColor: e.useCustomLabelColor ?? !1,
      labelCustomColor: e.labelCustomColor ?? ""
    },
    toPatch: (i) => {
      const n = { ...i }, r = n.disableLabelColor ?? e.disableLabelColor ?? !1, o = n.useCustomLabelColor ?? e.useCustomLabelColor ?? !1;
      return n.labelPosition === "below" && (n.labelPosition = void 0), n.disableLabelColor === !1 && (n.disableLabelColor = void 0), n.useCustomLabelColor === !1 && (n.useCustomLabelColor = void 0), r ? o || (n.labelCustomColor = void 0) : (n.useCustomLabelColor = void 0, n.labelCustomColor = void 0), n.labelCustomColor === "" && (n.labelCustomColor = void 0), n;
    }
  };
}
function gu(e, t) {
  const i = [
    {
      name: "badgeMode",
      label: "Badge shows",
      helper: "Animations play only while the entity is active. Value puts the reading in the badge, falling back to the icon when there is no number",
      selector: L(
        x("icon", "Icon, still"),
        x("spin", "Icon, spinning"),
        x("pulse", "Icon, pulsing"),
        x("value", "Value"),
        x("none", "Nothing")
      )
    }
  ], n = ue(e);
  return gt(e) === "value" && n.length && i.push({
    name: "badgeEntity",
    label: "Badge reads",
    helper: "Which of this device's readings the badge shows",
    selector: L(
      x("primary", t?.primaryLabel || e.entity || "Main entity"),
      ...n.map(
        (r, o) => x(
          String(o),
          t?.readingLabels?.[o] || r.entity || (r.attribute ? `${e.entity || "this device"} · ${r.attribute}` : `Reading ${o + 1}`)
        )
      )
    )
  }), i.push(
    {
      name: "size",
      label: "Size",
      selector: { number: { min: 16, max: 160, step: 2, mode: "slider", unit_of_measurement: "px" } }
    },
    at()
  ), {
    fields: i,
    data: {
      badgeMode: gt(e),
      // The dropdown's values are strings, so the stored index (or the legacy
      // "secondary") is spelled the same way here; toPatch turns it back into
      // a number. Opens on what the badge is *actually* reading when nothing
      // is chosen, which is the whole point of badgeSource (issue #136).
      badgeEntity: String(ro(e.badgeEntity) ?? t?.source ?? "primary"),
      size: e.size ?? we,
      angle: e.angle ?? 0
    },
    // "Badge shows" is the editor's spelling of three config keys (issue
    // #127) — expand it back, carrying the ripple state off the item since
    // that control lives in another group now.
    toPatch: (r) => {
      let o = r;
      if ("badgeEntity" in o && typeof o.badgeEntity == "string" && o.badgeEntity !== "primary" && (o = { ...o, badgeEntity: Number(o.badgeEntity) }), !("badgeMode" in o)) return o;
      const { badgeMode: a, ...l } = o;
      return {
        ...l,
        ...Do(a ?? gt(e), on(e))
      };
    }
  };
}
function yu(e, t) {
  const i = on(e), n = Jr(e.entity, t), r = e.kind === "light" || e.entity?.startsWith("light.");
  if (!n && !r) return;
  const o = [];
  return n && (o.push({
    name: "ripple",
    label: "Ripple",
    // "Detected" rather than "the sensor is on": this is offered to a
    // device_tracker and a person too, and neither of those is a sensor.
    // It stays vague about *what* is detected because a vibration sensor
    // rings for a knock, not for presence (issue #202).
    helper: "Draws a pulsing ring while this device detects something",
    selector: { boolean: {} }
  }), i && (o.push({
    name: "rippleSize",
    label: "Ripple size",
    selector: {
      number: { min: 40, max: 400, step: 4, mode: "slider", unit_of_measurement: "px" }
    }
  }), o.push({
    name: "rippleDirection",
    label: "Ripple direction",
    selector: {
      number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" }
    }
  }), o.push({
    name: "rippleWidth",
    label: "Ripple width",
    selector: {
      number: { min: 0, max: 360, step: 1, mode: "slider", unit_of_measurement: "°" }
    }
  }))), r && (o.push({
    name: "glow",
    label: "Cast light",
    helper: "Pools the light's own color onto the plan; overlapping lights mix",
    selector: { boolean: {} }
  }), e.glow && o.push(
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
    fields: o,
    data: {
      ripple: i,
      rippleSize: e.rippleSize ?? jt,
      rippleDirection: e.rippleDirection ?? Ut,
      rippleWidth: e.rippleWidth ?? Bt,
      glow: e.glow ?? !1,
      glowRadius: e.glowRadius ?? Ht,
      glowColor: e.glowColor ?? ""
    },
    // "Ripple" is the other half of #127's three-key spelling — same expansion
    // as the badge group's, with the badge mode read off the item.
    toPatch: (a) => {
      if (!("ripple" in a)) return a;
      const { ripple: l, ...s } = a;
      return { ...s, ...Do(gt(e), !!l) };
    }
  };
}
function bu(e) {
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
    toPatch: fe
  };
}
function vu(e) {
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
        selector: { ui_action: { default_action: Pr(e.entity).action } }
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
    toPatch: fe
  };
}
function _u(e, t) {
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
      helper: rn(t, "Shows this entity's value, formatted as HA formats it"),
      selector: nn(t, e.entity)
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
    at()
  ), {
    fields: i,
    data: {
      text: e.text ?? "",
      entity: e.entity ?? "",
      attribute: e.attribute ?? "",
      size: e.size ?? Ke,
      angle: e.angle ?? 0
    },
    toPatch: (n) => "entity" in n && !n.entity ? { ...n, attribute: void 0 } : n
  };
}
function wu(e, t, i = re) {
  const n = zo(i);
  return {
    fields: [
      {
        name: "type",
        label: "Type",
        selector: { select: { mode: "dropdown", options: n.some((o) => o.id === e.type) ? n.map((o) => ({ value: o.id, label: o.name })) : [{ value: e.type, label: `${e.type} (missing)` }, ...n.map((o) => ({ value: o.id, label: o.name }))] } }
      },
      // L-shaped sectional only (#40): which side the chaise extends on,
      // facing the sofa from the front. Conditional, in the same shape
      // openingForm uses for its hinge / slide fields.
      ...e.type === "sectional" ? [
        {
          name: "hand",
          label: "Chaise side",
          helper: "Facing the sofa from the front",
          selector: L(x("right", "right"), x("left", "left"))
        }
      ] : [],
      { name: "w", label: "Width", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "h", label: "Height", required: !0, selector: { number: { min: 10, mode: "box" } } },
      at(),
      // Optional entity that makes the drawing live (issue #82) — a soil
      // sensor on a plant, a contact sensor on a cabinet. Last, because most
      // furniture is decoration and never binds anything.
      {
        name: "entity",
        label: "Entity",
        helper: rn(t, "Optional — lets the drawing change color with a sensor"),
        selector: nn(t, e.entity)
      },
      // Clicking it changes floor (issue #121). Offered on any piece rather
      // than only on the built-in `stairs`, because a plan can draw its own
      // staircase and a rule keyed on one symbol id would leave those out.
      // Empty on everything by default, so it is a row and not a nag.
      {
        name: "goToFloor",
        label: "Go to floor",
        helper: "Clicking this piece changes floor — for a staircase",
        selector: L(x("", "Nothing"), x("up", "Up one floor"), x("down", "Down one floor"))
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
    toPatch: (o) => "goToFloor" in o && !o.goToFloor ? { ...o, goToFloor: void 0 } : o
  };
}
function xu(e) {
  return {
    fields: [
      { name: "w", label: "Width", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "h", label: "Height", required: !0, selector: { number: { min: 10, mode: "box" } } },
      { name: "x", label: "X", required: !0, selector: { number: { mode: "box" } } },
      { name: "y", label: "Y", required: !0, selector: { number: { mode: "box" } } },
      at(),
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
      dotSize: e.dotSize ?? Li
    },
    toPatch: fe
  };
}
function $u(e, t = []) {
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
    toPatch: fe
  };
}
function ku(e) {
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
                max: Cr,
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
          selector: L(
            x("fill", "Fill"),
            x("border", "Border only"),
            x("both", "Fill and border")
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
      labelSize: e.labelSize ?? Oi,
      opacity: e.opacity ?? oi,
      entity: e.entity ?? "",
      activeOpacity: e.activeOpacity ?? e.opacity ?? oi,
      highlight: e.highlight ?? "fill",
      // "Fit" is the absence of a number, so it gets its own boolean; the
      // slider only appears once that is off, and then always shows a real
      // stored value.
      fitZoom: e.zoom === void 0,
      zoom: e.zoom ?? ai,
      tap_action: e.tap_action,
      hold_action: e.hold_action,
      double_tap_action: e.double_tap_action
    },
    toPatch: (t) => {
      let i = t;
      if ("highlight" in i && i.highlight === "fill" && (i = { ...i, highlight: void 0 }), "fitZoom" in i) {
        const { fitZoom: n, ...r } = i;
        i = { ...r, zoom: n ? void 0 : ai };
      }
      return i;
    }
  };
}
function Su(e) {
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
          number: { min: 2, max: xr, step: 1, mode: "slider", unit_of_measurement: "px" }
        }
      }
    ],
    data: {
      x1: Math.round(e.x1),
      y1: Math.round(e.y1),
      x2: Math.round(e.x2),
      y2: Math.round(e.y2),
      thickness: e.thickness ?? H
    },
    // Keep the default out of the YAML so untouched walls stay terse.
    toPatch: (i) => "thickness" in i && i.thickness === H ? { ...i, thickness: void 0 } : i
  };
}
function Eu(e) {
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
    data: { title: e.title ?? "", width: e.width, height: e.height, grid: e.grid ?? Fi },
    toPatch: fe
  };
}
function Au(e) {
  return {
    fields: [
      {
        name: "pressEffect",
        label: "Press effect",
        helper: "Feedback when a device is pressed. Only devices that do something respond",
        selector: L(
          x("scale", "Press in"),
          x("ripple", "Ink ripple"),
          x("flash", "Flash"),
          x("none", "None")
        )
      }
    ],
    data: { pressEffect: ht(e) },
    // The default stays out of the YAML, as the skin's does.
    toPatch: (t) => "pressEffect" in t && t.pressEffect === Ar ? { ...t, pressEffect: void 0 } : t
  };
}
function Tu(e) {
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
function Cu(e) {
  const t = Mi(e.skin) ?? _t[0];
  return {
    fields: [
      {
        name: "skin",
        label: "Skin",
        helper: t.description,
        selector: L(..._t.map((i) => x(i.id, i.label)))
      }
    ],
    // An id we don't ship reads back as Default, matching what it renders as.
    data: { skin: t.id },
    toPatch: (i) => (
      // Default is the absence of a skin, so it stays out of the YAML.
      "skin" in i && i.skin === Dt ? { ...i, skin: void 0 } : i
    )
  };
}
function Mu(e) {
  return {
    fields: [
      {
        name: "rotation",
        label: "Rotate display",
        helper: "Rotates the live card only — editing stays as drawn",
        selector: L(x("0", "0°"), x("90", "90°"), x("180", "180°"), x("270", "270°"))
      },
      // Per-orientation overrides (issue #237). Two dropdowns with a "same as
      // above" default rather than a switch plus two angles: the switch would
      // be a third control whose only job is to say whether the other two
      // count, and "same as above" says that per orientation and for free.
      {
        name: "rotationPortrait",
        label: "…on a portrait screen",
        helper: "Overrides the angle above while the screen is taller than it is wide",
        selector: L(
          x("", "Same as above"),
          x("0", "0°"),
          x("90", "90°"),
          x("180", "180°"),
          x("270", "270°")
        )
      },
      {
        name: "rotationLandscape",
        label: "…on a landscape screen",
        helper: "Overrides the angle above while the screen is wider than it is tall",
        selector: L(
          x("", "Same as above"),
          x("0", "0°"),
          x("90", "90°"),
          x("180", "180°"),
          x("270", "270°")
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
        selector: L(x("plan", "Canvas units"), x("fixed", "Fixed pixels"))
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
        name: "zoomedOverlayScale",
        label: "Zoomed badge size",
        helper: "Badges, labels and text while zoomed in to a room, as a multiple of their size at full plan. 1 keeps them the same",
        selector: { number: { min: 0.5, max: 3, step: 0.1, mode: "slider" } }
      },
      {
        name: "offlineStyle",
        label: "Offline devices",
        helper: "How a device is drawn when its entity is unavailable or missing",
        selector: L(
          x("dim", "Dimmed"),
          x("strike", "Dimmed and crossed out"),
          x("none", "No different")
        )
      }
    ],
    data: {
      rotation: String(Xe(e.rotation)),
      // "" is "same as above" — the absence of an override, not an angle.
      // `== null` for the same reason resolvePlanRotation uses it: a key
      // written with no value (`rotationPortrait:`) parses to `null`, and
      // reading that as an angle would show 0° here — then write it into the
      // YAML as a real override the moment this panel is saved, turning a
      // stray empty key into an instruction the plan never had.
      rotationPortrait: e.rotationPortrait == null ? "" : String(Xe(e.rotationPortrait)),
      rotationLandscape: e.rotationLandscape == null ? "" : String(Xe(e.rotationLandscape)),
      overlayScale: qi(e.overlayScale),
      compactHeader: e.compactHeader ?? !1,
      zoomedOverlayScale: e.zoomedOverlayScale ?? si,
      offlineStyle: io(e)
    },
    toPatch: (t) => {
      let i = t;
      "rotation" in i && (i = { ...i, rotation: i.rotation === "0" ? void 0 : Number(i.rotation) });
      for (const n of ["rotationPortrait", "rotationLandscape"])
        n in i && (i = { ...i, [n]: i[n] === "" ? void 0 : Number(i[n]) });
      return "compactHeader" in i && !i.compactHeader && (i = { ...i, compactHeader: void 0 }), "offlineStyle" in i && i.offlineStyle === Tr && (i = { ...i, offlineStyle: void 0 }), "zoomedOverlayScale" in i && i.zoomedOverlayScale === si && (i = { ...i, zoomedOverlayScale: void 0 }), i;
    }
  };
}
function Iu(e) {
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
function Pu(e) {
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
      sunBrightnessMin: e.sunBrightnessMin ?? Pi,
      sunBrightnessMax: e.sunBrightnessMax ?? wt
    },
    // Off is the default, so keep the whole feature out of the YAML until it
    // is switched on — including the two sliders it drags along with it.
    toPatch: (i) => "sunDimming" in i && !i.sunDimming ? { ...i, sunDimming: void 0, sunBrightnessMin: void 0, sunBrightnessMax: void 0 } : i
  };
}
function Ou(e) {
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
      sunReach: e.sunReach ?? Ct,
      sunFollows: typeof e.sunBearing != "number",
      sunBearing: e.sunBearing ?? fi
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
      } : ("sunFollows" in n && (n.sunBearing = n.sunFollows ? void 0 : e.sunBearing ?? fi, delete n.sunFollows), "north" in n && !n.north && (n.north = void 0), "sunReach" in n && n.sunReach === Ct && (n.sunReach = void 0), "sunShade" in n && n.sunShade && (n.sunShade = void 0), n);
    }
  };
}
function Lu(e) {
  const t = [
    { name: "image", label: "Bg image", helper: "/local/floorplan.png or URL", selector: { text: {} } }
  ];
  return e.image && (t.push({
    name: "imageFit",
    label: "Image fit",
    helper: "Per floor, so scans of different resolutions can each fit properly",
    selector: L(
      x("stretch", "Stretch to canvas (may distort)"),
      x("contain", "Fit inside (keep proportions)"),
      x("cover", "Fill canvas (keep proportions, crop)")
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
var Fu = Object.defineProperty, Ru = Object.getOwnPropertyDescriptor, I = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Ru(t, i) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (n ? a(t, i, r) : a(r)) || r);
  return n && r && Fu(t, i, r), r;
};
const zu = (e) => e.label, Du = (e) => e.helper, ri = {
  select: { icon: "mdi:cursor-default", label: "Select" },
  wall: { icon: "mdi:wall", label: "Wall" },
  door: { icon: "mdi:door", label: "Door" },
  window: { icon: "mdi:window-closed-variant", label: "Window" },
  tracker: { icon: "mdi:crosshairs-gps", label: "Tracker" },
  area: { icon: "mdi:vector-polygon", label: "Area" }
}, Nu = {
  wall: "mdi:wall",
  opening: "mdi:door",
  item: "mdi:lightbulb-outline",
  text: "mdi:format-text",
  furniture: "mdi:sofa-outline",
  tracker: "mdi:crosshairs-gps",
  area: "mdi:floor-plan"
}, hr = 35, Hu = 8, ju = 2e3, Uu = 10;
function pr(e) {
  return e.some((t) => {
    const i = t, n = i.tagName?.toLowerCase();
    return n === "input" || n === "textarea" || n === "select" || n === "ha-form" || n === "ha-entity-picker" || n === "ha-icon-picker" || i.isContentEditable === !0;
  });
}
let E = class extends de {
  constructor() {
    super(...arguments), this._wallMaskId = `fp-edit-wall-mask-${E._nextWallMaskId++}`, this._watchedEntities = /* @__PURE__ */ new Set(), this._tool = "select", this._selection = [], this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaHover = null, this._freeWalls = !1, this._defaultOpeningLength = 60, this._marquee = null, this._history = [], this._future = [], this._zoom = 1, this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "", this._symbolDraft = "", this._symbolError = "", this._paletteError = "", this._projectOpen = !1, this._openGroups = /* @__PURE__ */ new Set(), this._fullscreen = !1, this._applyState = "idle", this._applyError = "", this._applyResetTimer = null, this._drag = null, this._dragMoves = new ru(nu, (e) => {
      this._drag && this._applyDrag(e);
    }), this._dragDirty = !1, this._pickAnchor = null, this._hideLabels = !1, this._pinchPts = /* @__PURE__ */ new Map(), this._pinch = null, this._gesturePointer = null, this._marqueeAdd = !1, this._clipboard = null, this._onKeyDown = (e) => this._handleKeyDown(e), this._onHostKeyDown = (e) => {
      e.key !== "Escape" || !this._fullscreen || pr(e.composedPath()) && (e.preventDefault(), e.stopPropagation(), this._canvasWrap?.focus({ preventScroll: !0 }));
    }, this._onFocusIn = (e) => {
      this._fullscreen && !e.composedPath().includes(this) && (this._fullscreen = !1);
    }, this._preventGesture = (e) => e.preventDefault(), this._onWrapPointerDown = (e) => {
      if (e.pointerType !== "touch" || (this._pinchPts.set(e.pointerId, { x: e.clientX, y: e.clientY }), this._pinchPts.size !== 2)) return;
      this._cancelGesture();
      const t = this._canvasWrap, i = t?.getBoundingClientRect(), [n, r] = [...this._pinchPts.values()];
      this._pinch = {
        d0: Math.max(Math.hypot(r.x - n.x, r.y - n.y), 1),
        z0: this._zoom,
        cx: (n.x + r.x) / 2 - (i?.left ?? 0) + (t?.scrollLeft ?? 0),
        cy: (n.y + r.y) / 2 - (i?.top ?? 0) + (t?.scrollTop ?? 0)
      }, e.stopPropagation();
    }, this._onWrapPointerMove = (e) => {
      if (!this._pinch || !this._pinchPts.has(e.pointerId) || (this._pinchPts.set(e.pointerId, { x: e.clientX, y: e.clientY }), this._pinchPts.size < 2)) return;
      e.preventDefault(), e.stopPropagation();
      const [t, i] = [...this._pinchPts.values()], n = this._pinch;
      this._setZoom(n.z0 * (Math.hypot(i.x - t.x, i.y - t.y) / n.d0)), this.updateComplete.then(() => {
        const r = this._canvasWrap;
        if (!r || this._pinch !== n) return;
        const o = r.getBoundingClientRect(), a = this._zoom / n.z0;
        r.scrollLeft = n.cx * a - ((t.x + i.x) / 2 - o.left), r.scrollTop = n.cy * a - ((t.y + i.y) / 2 - o.top);
      });
    }, this._onWrapPointerEnd = (e) => {
      e.pointerType === "touch" && (this._pinchPts.delete(e.pointerId), this._pinchPts.size < 2 && (this._pinch = null));
    }, this._liveEditKey = null, this._onEditorPointerDown = () => {
      this._liveEditKey = null;
    }, this._gridCache = null, this._apply = async () => {
      if (this._applyState === "saving") return;
      this._applyResetTimer !== null && clearTimeout(this._applyResetTimer), this._applyState = "saving", this._applyError = "", await this.updateComplete, await new Promise((t) => setTimeout(t, 0));
      const e = await lu(this);
      if (!e.ok) {
        this._applyState = "idle", this._applyError = e.error;
        return;
      }
      this._applyState = "saved", this._applyResetTimer = setTimeout(() => {
        this._applyResetTimer = null, this._applyState = "idle";
      }, ju);
    }, this._addSymbol = () => {
      let e;
      try {
        e = JSON.parse(this._symbolDraft);
      } catch (n) {
        this._symbolError = `Not valid JSON — ${n.message}`;
        return;
      }
      const t = [], i = qt(e, void 0, t);
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
    const t = { ...Ya(e.type || "custom:easy-floorplan-card"), ...e }, i = Fe(t).map((n) => structuredClone(n));
    this._config = {
      ...t,
      floors: i,
      walls: [],
      openings: [],
      items: [],
      texts: [],
      furniture: [],
      trackers: []
    }, (!this._activeFloorId || !i.some((n) => n.id === this._activeFloorId)) && (this._activeFloorId = t.defaultFloor && i.some((n) => n.id === t.defaultFloor) ? t.defaultFloor : i[0].id), this._lastEmitted && e !== this._lastEmitted && !li(e, this._lastEmitted) && (this._history = [], this._future = [], this._liveEditKey = null), this._watchedEntities = We(this._config);
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
    return i(t) !== i(this.hass) ? !0 : zr(t, this.hass, this._watchedEntities);
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
    return di(this._config.symbols);
  }
  /** Discrete change to the active floor's elements (snapshots for undo). */
  _commitFloor(e) {
    this._commit({ ...this._config, floors: this._patchFloors(e) });
  }
  /** Live change to the active floor's elements (no history snapshot — for dragging). */
  _emitFloor(e) {
    const t = { ...this._config, floors: this._patchFloors(e) };
    if (this._drag) {
      this._config = t, this._watchedEntities = We(t), this._dragDirty = !0;
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
    return this._config.grid ?? Fi;
  }
  /**
   * Resolved placement snap step. `snap` is tri-state in the config: unset
   * means "follow the grid" (the default behaviour), `0` is free placement,
   * any other number is a custom step. See {@link resolveSnap}.
   */
  get _resolvedSnap() {
    return Ga(this._config.snap, this.grid);
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
        snap: t && t > 0 ? t : ei(Pn, this.grid)
      });
    }
  }
  /** Grid update plus a custom-snap rescale so its percentage of the grid is preserved. */
  _gridPatch(e) {
    const t = { grid: e };
    if (this._snapMode === "custom") {
      const i = On(this._config.snap, this.grid);
      t.snap = ei(i, e);
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
    const r = new DOMPoint(e.clientX, e.clientY).matrixTransform(n.inverse());
    return t ? { x: this._snap(r.x), y: this._snap(r.y) } : { x: r.x, y: r.y };
  }
  /** Nearest existing wall endpoint within ENDPOINT_SNAP, or null. */
  _nearestCorner(e, t) {
    return Fo(this._floor().walls, e, t, Me);
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
    return Kp(this._floor(), e, t, Me, i) ?? {
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
    let n = null, r = Me;
    for (const o of this._floor().walls)
      for (const a of [1, 2]) {
        if (i.has(`${o.id}:${a}`)) continue;
        const l = a === 1 ? o.x1 : o.x2, s = a === 1 ? o.y1 : o.y2, c = Math.hypot(e - l, t - s);
        c < r && (r = c, n = { x: l, y: s });
      }
    return n ?? { x: this._snap(e), y: this._snap(t) };
  }
  /** See {@link snapWallEnd}: corners win, then axis gravity, then the snap step. */
  _snapWallEnd(e, t, i, n) {
    return Zp(
      this._floor().walls,
      e,
      t,
      i,
      n,
      (r) => this._snap(r),
      this._freeWalls,
      Uu,
      Me
    );
  }
  _emit(e) {
    this._drag && (this._drag.emitted = !0), this._config = e, this._watchedEntities = We(e);
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
    for (const n of t) i.some((r) => r.kind === n.kind && r.id === n.id) || i.push(n);
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
    if (pr(i)) return;
    const n = e.ctrlKey || e.metaKey, r = e.key.toLowerCase(), o = !!(this._drag || this._draft || this._draftTracker || this._draftArea || this._marquee);
    if (e.key === "Backspace" && this._draftArea?.points.length) {
      e.preventDefault();
      const c = this._draftArea.points.slice(0, -1);
      this._draftArea = c.length ? { points: c } : null;
      return;
    }
    if (o && e.key !== "Escape" && !(n && r === "c")) return;
    if (n && r === "c") {
      this._selection.length && (e.preventDefault(), this._copy());
      return;
    }
    if (n && r === "v") {
      this._clipboard && (e.preventDefault(), this._paste());
      return;
    }
    if (n && r === "d") {
      this._selection.length && (e.preventDefault(), this._duplicate());
      return;
    }
    if (n && r === "z") {
      e.preventDefault(), e.shiftKey ? this._redo() : this._undo();
      return;
    }
    if (n && r === "y") {
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
    const s = e.shiftKey ? this.grid : this._resolvedSnap || 1;
    this._nudge(l[0] * s, l[1] * s);
  }
  _nudge(e, t) {
    if (!this._selection.length) return;
    const i = this._floor();
    if (!tu(i, this._selection).length) return;
    const n = (d) => {
      const h = this._idsOfKind(d);
      for (const m of h) ct(i, { kind: d, id: m }) && h.delete(m);
      return h;
    }, r = n("wall"), o = n("opening"), a = n("item"), l = n("text"), s = n("furniture"), c = n("tracker"), p = n("area");
    this._commitFloor({
      walls: i.walls.map(
        (d) => r.has(d.id) ? { ...d, x1: d.x1 + e, y1: d.y1 + t, x2: d.x2 + e, y2: d.y2 + t } : d
      ),
      openings: i.openings.map((d) => o.has(d.id) ? { ...d, x: d.x + e, y: d.y + t } : d),
      items: i.items.map((d) => a.has(d.id) ? { ...d, x: d.x + e, y: d.y + t } : d),
      texts: i.texts.map((d) => l.has(d.id) ? { ...d, x: d.x + e, y: d.y + t } : d),
      furniture: i.furniture.map(
        (d) => s.has(d.id) ? { ...d, x: d.x + e, y: d.y + t } : d
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
      const n = this._draftArea.points, r = n[0];
      if (n.length >= 3 && Math.hypot(i.x - r.x, i.y - r.y) <= Me) {
        this._finishArea();
        return;
      }
      const o = n[n.length - 1];
      (i.x !== o.x || i.y !== o.y) && (this._draftArea = { points: [...n, i] });
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
    this._drag = null, e?.moved && e.snapshot && (this._history = this._history.filter((t) => t !== e.snapshot), e.emitted ? this._emit(e.snapshot) : (this._config = e.snapshot, this._watchedEntities = We(e.snapshot)), this._future = e.priorFuture ?? []);
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
          const i = { id: U("wall"), ...t };
          this._commitFloor({ walls: [...this._floor().walls, i] }), this._selection = [{ kind: "wall", id: i.id }];
        }
        return;
      }
      if (this._tool === "tracker" && this._draftTracker) {
        const t = this._draftTracker;
        this._draftTracker = null, this._releasePointer(e);
        const i = Math.min(t.x0, t.x1), n = Math.min(t.y0, t.y1), r = Math.abs(t.x1 - t.x0), o = Math.abs(t.y1 - t.y0);
        r >= this.grid / 2 && o >= this.grid / 2 && this._addTracker(i, n, r, o);
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
    return Xp(this._floor(), e);
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
    const i = this._toVirtual(e, !1), n = eu(this._floor(), i.x, i.y, {
      itemSize: we,
      textSize: Ke,
      wallThickness: H,
      hass: this.hass
    }), r = !!this._pickAnchor && Math.hypot(e.clientX - this._pickAnchor.clientX, e.clientY - this._pickAnchor.clientY) <= Hu;
    return this._pickAnchor = { clientX: e.clientX, clientY: e.clientY }, iu(n, this._selection, r) ?? t;
  }
  _startDrag(e, t, i, n) {
    if (this._tool !== "select" || (e.stopPropagation(), this._gesturePointer !== null)) return;
    this._canvasWrap?.focus({ preventScroll: !0 });
    const r = i != null || n != null, o = r ? t : this._resolvePick(e, t);
    r ? this._selectOne(o) : this._selectForPointer(e, o), !ct(this._floor(), o) && (this._drag = {
      primary: o,
      start: this._toVirtual(e, !1),
      orig: this._snapshotSelection(),
      endpoint: i,
      areaVertex: n
    }, o.kind === "wall" && (this._drag.attached = this._attachedCorners(o.id, i)), this._gesturePointer = e.pointerId, this._capturePointer(e));
  }
  /** See {@link attachedCorners}: shared room corners that stretch with this wall. */
  _attachedCorners(e, t) {
    return Gp(this._floor().walls, e, t);
  }
  /** Capture the start positions of every selected element on the active floor. */
  _snapshotSelection() {
    const e = this._floor(), t = /* @__PURE__ */ new Map();
    for (const i of this._selection)
      if (!ct(e, i))
        if (i.kind === "wall") {
          const n = e.walls.find((r) => r.id === i.id);
          n && t.set(`wall:${n.id}`, { kind: "wall", x1: n.x1, y1: n.y1, x2: n.x2, y2: n.y2 });
        } else if (i.kind === "opening") {
          const n = e.openings.find((r) => r.id === i.id);
          n && t.set(`opening:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "item") {
          const n = e.items.find((r) => r.id === i.id);
          n && t.set(`item:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "text") {
          const n = e.texts.find((r) => r.id === i.id);
          n && t.set(`text:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "furniture") {
          const n = e.furniture.find((r) => r.id === i.id);
          n && t.set(`furniture:${n.id}`, { kind: "pt", x: n.x, y: n.y });
        } else if (i.kind === "area") {
          const n = (e.areas ?? []).find((r) => r.id === i.id);
          n && t.set(`area:${n.id}`, { kind: "polygon", points: n.points.map((r) => ({ ...r })) });
        } else {
          const n = (e.trackers ?? []).find((r) => r.id === i.id);
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
      const c = e.altKey ? [] : t.attached ?? [], p = /* @__PURE__ */ new Set([
        `${t.primary.id}:${t.endpoint}`,
        ...c.map((m) => `${m.id}:${m.end}`)
      ]), d = this._snapWallPointExcluding(e.x, e.y, p), h = i.walls.map((m) => {
        let b = m;
        m.id === t.primary.id && (b = t.endpoint === 1 ? { ...b, x1: d.x, y1: d.y } : { ...b, x2: d.x, y2: d.y });
        for (const y of c)
          y.id === m.id && (b = y.end === 1 ? { ...b, x1: d.x, y1: d.y } : { ...b, x2: d.x, y2: d.y });
        return b;
      });
      this._emitFloor({ walls: h });
      return;
    }
    if (t.primary.kind === "area" && t.areaVertex != null) {
      const c = t.areaVertex, p = this._snapAreaPoint(e.x, e.y, { areaId: t.primary.id, vertexIndex: c }), d = (i.areas ?? []).map(
        (h) => h.id === t.primary.id ? { ...h, points: h.points.map((m, b) => b === c ? p : m) } : h
      );
      this._emitFloor({ areas: d });
      return;
    }
    if (this._selection.length === 1 && t.primary.kind === "opening") {
      const c = t.orig.get(`opening:${t.primary.id}`);
      if (c && c.kind === "pt") {
        const p = c.x + (e.x - t.start.x), d = c.y + (e.y - t.start.y), h = Jn(p, d, i.walls, hr), m = i.openings.map(
          (b) => b.id === t.primary.id ? h ? { ...b, x: h.x, y: h.y, angle: h.angle } : { ...b, x: this._snap(p), y: this._snap(d) } : b
        );
        this._emitFloor({ openings: m });
        return;
      }
    }
    const n = t.orig.get(`${t.primary.kind}:${t.primary.id}`);
    if (!n) return;
    const r = n.kind === "wall" ? n.x1 : n.kind === "polygon" ? n.points[0].x : n.x, o = n.kind === "wall" ? n.y1 : n.kind === "polygon" ? n.points[0].y : n.y, a = this._snap(r + (e.x - t.start.x)) - r, l = this._snap(o + (e.y - t.start.y)) - o;
    let s = this._applyDelta(a, l, t.orig);
    if (t.attached?.length && !e.altKey) {
      const c = (s.walls ?? i.walls).map((p) => {
        let d = p;
        for (const h of t.attached)
          h.id !== p.id || t.orig.has(`wall:${h.id}`) || (d = h.end === 1 ? { ...d, x1: h.x0 + a, y1: h.y0 + l } : { ...d, x2: h.x0 + a, y2: h.y0 + l });
        return d;
      });
      s = { ...s, walls: c };
    }
    this._emitFloor(s);
  }
  /** Translate every snapshotted element by (dx, dy). */
  _applyDelta(e, t, i) {
    return Yp(this._floor(), e, t, i);
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
    const n = this._floor(), r = Jn(t, i, n.walls, hr), o = {
      id: U(e),
      type: e,
      x: r?.x ?? t,
      y: r?.y ?? i,
      // User-editable from the door/window context bar so opening size can be
      // set BEFORE placing (the previous hardcoded 60 forced place-then-resize).
      length: this._defaultOpeningLength,
      angle: r?.angle ?? 0
    };
    this._commitFloor({ openings: [...n.openings, o] }), this._selection = [{ kind: "opening", id: o.id }], this._tool = "select";
  }
  _addItem(e) {
    const t = {
      id: U("item"),
      entity: "",
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      kind: e,
      showState: e === "sensor",
      showIcon: !0,
      size: we
    };
    this._commitFloor({ items: [...this._floor().items, t] }), this._selection = [{ kind: "item", id: t.id }], this._tool = "select";
  }
  _addFurniture(e) {
    const t = Dd(e, this._symbols()), i = {
      id: U("furn"),
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
    const r = {
      id: U("tracker"),
      x: e,
      y: t,
      w: i,
      h: n,
      angle: 0,
      dotSize: Li
    };
    this._commitFloor({ trackers: [...this._floor().trackers ?? [], r] }), this._selection = [{ kind: "tracker", id: r.id }], this._tool = "select";
  }
  /** Close the in-progress Area draft into a committed polygon and select it. */
  _finishArea() {
    if (!this._draftArea || this._draftArea.points.length < 3) return;
    const e = { id: U("area"), points: this._draftArea.points, showName: !0 };
    this._commitFloor({ areas: [...this._floor().areas ?? [], e] }), this._selection = [{ kind: "area", id: e.id }], this._draftArea = null, this._areaHover = null, this._tool = "select";
  }
  _addText() {
    const e = {
      id: U("text"),
      x: this._snap(this._config.width / 2),
      y: this._snap(this._config.height / 2),
      text: "Label",
      size: Ke
    };
    this._commitFloor({ texts: [...this._floor().texts, e] }), this._selection = [{ kind: "text", id: e.id }], this._tool = "select";
  }
  _deleteSelected() {
    if (!this._selection.length) return;
    const e = this._floor(), t = this._idsOfKind("wall"), i = this._idsOfKind("opening"), n = this._idsOfKind("item"), r = this._idsOfKind("text"), o = this._idsOfKind("furniture"), a = this._idsOfKind("tracker"), l = this._idsOfKind("area");
    this._commitFloor({
      walls: e.walls.filter((s) => !t.has(s.id)),
      openings: e.openings.filter((s) => !i.has(s.id)),
      items: e.items.filter((s) => !n.has(s.id)),
      texts: e.texts.filter((s) => !r.has(s.id)),
      furniture: e.furniture.filter((s) => !o.has(s.id)),
      trackers: (e.trackers ?? []).filter((s) => !a.has(s.id)),
      areas: (e.areas ?? []).filter((s) => !l.has(s.id))
    }), this._clearSel();
  }
  // ---- clipboard (copy / paste / duplicate) ------------------------------
  _copy() {
    if (!this._selection.length) return;
    const e = this._floor(), t = this._idsOfKind("wall"), i = this._idsOfKind("opening"), n = this._idsOfKind("item"), r = this._idsOfKind("text"), o = this._idsOfKind("furniture"), a = this._idsOfKind("tracker"), l = this._idsOfKind("area");
    this._clipboard = structuredClone({
      walls: e.walls.filter((s) => t.has(s.id)),
      openings: e.openings.filter((s) => i.has(s.id)),
      items: e.items.filter((s) => n.has(s.id)),
      texts: e.texts.filter((s) => r.has(s.id)),
      furniture: e.furniture.filter((s) => o.has(s.id)),
      trackers: (e.trackers ?? []).filter((s) => a.has(s.id)),
      areas: (e.areas ?? []).filter((s) => l.has(s.id))
    });
  }
  /** Paste the clipboard onto the active floor, offset by one snap step, with fresh ids. */
  _paste() {
    if (!this._clipboard) return;
    const e = structuredClone(this._clipboard), t = this._resolvedSnap || this.grid, i = this._floor(), n = { locked: void 0 }, r = e.walls.map((d) => ({
      ...d,
      ...n,
      id: U("wall"),
      x1: d.x1 + t,
      y1: d.y1 + t,
      x2: d.x2 + t,
      y2: d.y2 + t
    })), o = e.openings.map((d) => ({
      ...d,
      ...n,
      id: U(d.type),
      x: d.x + t,
      y: d.y + t
    })), a = e.items.map((d) => ({
      ...d,
      ...n,
      id: U("item"),
      x: d.x + t,
      y: d.y + t
    })), l = e.texts.map((d) => ({
      ...d,
      ...n,
      id: U("text"),
      x: d.x + t,
      y: d.y + t
    })), s = e.furniture.map((d) => ({
      ...d,
      ...n,
      id: U("furn"),
      x: d.x + t,
      y: d.y + t
    })), c = (e.trackers ?? []).map((d) => ({
      ...d,
      ...n,
      id: U("tracker"),
      x: d.x + t,
      y: d.y + t
    })), p = (e.areas ?? []).map((d) => ({
      ...d,
      ...n,
      id: U("area"),
      points: d.points.map((h) => ({ x: h.x + t, y: h.y + t }))
    }));
    this._commitFloor({
      walls: [...i.walls, ...r],
      openings: [...i.openings, ...o],
      items: [...i.items, ...a],
      texts: [...i.texts, ...l],
      furniture: [...i.furniture, ...s],
      trackers: [...i.trackers ?? [], ...c],
      areas: [...i.areas ?? [], ...p]
    }), this._selection = [
      ...r.map((d) => ({ kind: "wall", id: d.id })),
      ...o.map((d) => ({ kind: "opening", id: d.id })),
      ...a.map((d) => ({ kind: "item", id: d.id })),
      ...l.map((d) => ({ kind: "text", id: d.id })),
      ...s.map((d) => ({ kind: "furniture", id: d.id })),
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
    const t = this._floor(), i = e || void 0, n = (r, o) => {
      const a = this._idsOfKind(o);
      return r.map((l) => a.has(l.id) ? { ...l, locked: i } : l);
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
    const e = this._floor().walls.map((r) => ({ ...r, id: U("wall") })), t = (this._config.floors?.length ?? 1) + 1, i = Ja(`Floor ${t}`, e), n = [...this._config.floors ?? [], i];
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
    const t = is(this._config.floors ?? [], this._activeFloorId, e);
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
    const t = Ln(this.hass).find((i) => i.floor_id === e);
    this._commit({
      ...this._config,
      floors: (this._config.floors ?? []).map(
        (i) => i.id === this._activeFloorId ? { ...i, haFloor: t?.floor_id, ...t ? { name: t.name } : {} } : i
      )
    });
  }
  /** HA-floor link row for the floor gear popover; hidden when HA exposes no floors. */
  _renderHaFloorRow(e) {
    const t = Ln(this.hass);
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
    ` : g`${u}`;
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
  /**
   * The plan's named colours (issue #265), usable and deduped.
   */
  _palette() {
    return rt(this._config?.palette);
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
    if (!i.length) return u;
    const n = Oo(e), r = n && i.some((o) => B(o.name) === n) ? n : void 0;
    return g`
      <select
        class="palette-pick"
        title="Use one of the plan's named colours"
        .value=${r ?? ""}
        @change=${(o) => {
      const a = o.target.value;
      if (!a) {
        r && t(mt(e, i));
        return;
      }
      const l = i.find((s) => B(s.name) === a);
      l && t(ir(l.name));
    }}
      >
        <option value="" ?selected=${!r}>Custom…</option>
        ${i.map(
      (o) => g`<option
            value=${B(o.name)}
            ?selected=${B(o.name) === r}
          >
            ${o.name}
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
    const i = mt(e, this._config?.palette);
    return typeof i == "string" && i ? i : t;
  }
  _renderColorRow(e) {
    return g`
      <div class="row">
        <label title=${e.title ?? u}>${e.label}</label>
        <input
          type="color"
          title=${e.title ?? u}
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
    return hi(
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
      ${e.stateColor?.length ? g`<p class="hint rule-note">Shown while no rule below names an icon of its own.</p>` : u}
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
        ${i ? t : u}
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
    const t = ue(e), i = (r) => this._updateItem(e.id, {
      readings: r.length ? r : void 0,
      secondaryEntity: void 0,
      secondaryAttribute: void 0,
      // `badgeEntity: "secondary"` meant index 0, which is where the legacy
      // pair still is — restate it as the index so the old spelling does not
      // outlive the keys it referred to.
      ...e.badgeEntity === "secondary" ? { badgeEntity: 0 } : {}
    }), n = (r, o) => i(t.map((a, l) => l === r ? { ...a, ...o } : a));
    return g`
      <div class="row wide">
        <label title="Further entities and attributes whose readings join this device's label line"
          >Other entities</label
        >
      </div>
      ${t.map(
      (r, o) => g`
          <div class="row wide item-reading">
            ${this._renderEntityPicker(
        r.entity ?? "",
        (a) => n(o, { entity: a || void 0 }),
        void 0,
        // Scoped to the room the device sits in, exactly as its own
        // entity picker is — an extra reading is as likely to come from
        // the same room as the first one.
        this._areaEntitiesAt(e.x, e.y)?.entities
      )}
            ${this._renderAttributePicker(
        r.entity || e.entity,
        r.attribute ?? "",
        (a) => n(o, { attribute: a || void 0 }),
        "Read this attribute instead of the state — with no entity beside it, from this device's own entity"
      )}
            <button
              class="rule-remove"
              aria-label="Remove entity"
              title="Remove this entity"
              @click=${() => i(t.filter((a, l) => l !== o))}
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
                .checked=${r.showState !== !1}
                @change=${(a) => n(o, {
        // `true` is the default, so it stays out of the YAML.
        showState: a.target.checked ? void 0 : !1
      })}
              />
              Show on label
            </label>
            <span class="hint"
              >${r.showState === !1 ? "Bound but not printed — the badge can still read it." : "Its value joins the label line."}</span
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
          </p>` : u}
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
    const n = e ?? [], r = (o, a) => {
      const l = n.map((s, c) => c === o ? { ...s, ...a } : s);
      t(l);
    };
    return g`
      <div class="row wide state-colors">
        <label
          title=${i?.icons ? "Color the badge — and optionally swap its icon — by what the entity reads" : "Color the element by what its entity reads"}
          >${i?.icons ? "Color & icon by state" : "Color by state"}</label
        >
      </div>
      ${n.map((o, a) => {
      const l = typeof o.state == "string" ? "state" : typeof o.above == "number" ? "above" : "else";
      return g`
          <div class="row wide state-color-rule">
            <select
              .value=${l}
              title="When this rule applies"
              @change=${(s) => {
        const c = s.target.value;
        r(a, {
          above: c === "above" ? o.above ?? 0 : void 0,
          state: c === "state" ? o.state ?? "" : void 0
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
                  .value=${String(o.above ?? 0)}
                  @change=${(s) => r(a, { above: Number(s.target.value) || 0 })}
                />` : l === "state" ? g`<input
                    type="text"
                    class="cond"
                    placeholder="on"
                    .value=${o.state ?? ""}
                    @change=${(s) => r(a, { state: s.target.value })}
                  />` : g`<span class="cond hint">any other value</span>`}
            <input
              type="color"
              .value=${this._swatchValue(o.color, "#ff0000")}
              @input=${(s) => r(a, { color: s.target.value })}
            />
            <input
              type="text"
              class="rule-color-text"
              placeholder="red"
              .value=${o.color ?? ""}
              @change=${(s) => r(a, { color: s.target.value })}
            />
            ${this._renderPalettePicker(o.color, (s) => r(a, { color: s ?? "" }))}
            ${i?.icons ? (
        // Empty means "keep the device's icon", so the device's icon is
        // the placeholder — the rule shows what leaving it blank gives
        // you, and colour-only rules need no icon at all (issue #127).
        this._renderIconPicker(o.icon ?? "", (s) => r(a, { icon: s || void 0 }), {
          placeholder: i.iconPlaceholder,
          title: "Icon while this rule matches — empty keeps the device's own"
        })
      ) : u}
            <button
              class="rule-remove"
              aria-label="Remove rule"
              title="Remove this rule"
              @click=${() => {
        const s = n.filter((c, p) => p !== a);
        t(s.length ? s : void 0);
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
    const e = this._selection[0], t = this._floor(), i = e.kind === "item" ? t.items.find((r) => r.id === e.id) : e.kind === "furniture" ? t.furniture.find((r) => r.id === e.id) : void 0;
    if (!i) return;
    const n = ar(t, i.x, i.y);
    if (kn(n))
      return ti(this.hass, n.haArea).length ? n.id : void 0;
  }
  _areaEntitiesAt(e, t) {
    const i = ar(this._floor(), e, t);
    return kn(i) ? { entities: ti(this.hass, i.haArea), name: i.name } : void 0;
  }
  /** Every entity in `area`'s linked HA area not already placed as an item on this floor. */
  _pendingAreaEntities(e) {
    if (!e.haArea) return [];
    const t = new Set(this._floor().items.map((i) => i.entity));
    return ti(this.hass, e.haArea).filter((i) => !t.has(i));
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
    const i = Vp(e.points, t.length), n = t.map((r, o) => {
      const a = Vn(r);
      return {
        id: U("item"),
        entity: r,
        x: Math.round(i[o].x),
        y: Math.round(i[o].y),
        kind: a,
        showState: a === "sensor",
        showIcon: !0,
        size: we
      };
    });
    this._commitFloor({ items: [...this._floor().items, ...n] }), this._selection = n.map((r) => ({ kind: "item", id: r.id }));
  }
  /** Patch a single field on one of a tracker's sensor sub-objects (X / Y axis). */
  _updateTrackerSensor(e, t, i) {
    const n = (this._floor().trackers ?? []).find((o) => o.id === e);
    if (!n) return;
    if (i === null) {
      this._updateTracker(e, { [t]: void 0 });
      return;
    }
    const r = n[t] ?? { entity: "", min: 0, max: 5 };
    this._updateTracker(e, { [t]: { ...r, ...i } });
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
        const n = t.texts.find((r) => r.id === e.id)?.text ?? "";
        return n ? `Text · “${n.length > 24 ? `${n.slice(0, 24)}…` : n}”` : "Text";
      }
      case "furniture": {
        const i = t.furniture.find((r) => r.id === e.id);
        if (!i) return "Furniture";
        const n = du(i.type, this._symbols());
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
    const r = [];
    for (let o = 0; o <= e; o += i)
      r.push(_`<line x1=${o} y1="0" x2=${o} y2=${t} class="grid" />`);
    for (let o = 0; o <= t; o += i)
      r.push(_`<line x1="0" y1=${o} x2=${e} y2=${o} class="grid" />`);
    return this._gridCache = { key: n, lines: r }, r;
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
    const e = this._snapMode, t = On(this._config.snap, this.grid), i = [
      { id: "grid", label: "On" },
      { id: "off", label: "Off" },
      { id: "custom", label: "Custom" }
    ], n = e === "grid" ? `Snapping to the ${this.grid}-unit grid.` : e === "off" ? "No snapping — free placement." : `Snap = ${t}% of grid (${this._resolvedSnap} units).`;
    return g`
      <span class="ctx-field-label">Snap</span>
      <div class="seg" role="group" aria-label="Snap mode">
        ${i.map(
      (r) => g`
            <button
              class=${e === r.id ? "active" : ""}
              aria-pressed=${e === r.id}
              title=${r.id === "grid" ? "Snap to the grid" : r.id === "off" ? "Free placement" : "Custom step (% of grid)"}
              @click=${() => this._setSnapMode(r.id)}
            >
              ${r.label}
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
              @change=${(r) => {
      const o = Math.max(
        1,
        Number(r.target.value) || Pn
      );
      this._patchConfig({ snap: ei(o, this.grid) });
    }}
            /><span class="ctx-field-label">%</span>` : u}
      <span class="ctx-hint">${n}</span>
    `;
  }
  render() {
    if (!this._config) return g`${u}`;
    const e = this._config, t = this._floor(), i = e.floors ?? [], n = qi(e.overlayScale), r = this._scopingAreaId(), o = e.showDeadSpaces ? Fr(t.walls, t.openings) : [], a = t.items.some((s) => s.glow) ? Ui(t.walls, t.openings, (s) => jr(
      s,
      ((p) => Oe(s, p ? this.hass?.states[p] : void 0))(s.entity),
      s.secondaryEntity && Ze(s) ? Oe(
        lo(s),
        this.hass?.states[s.secondaryEntity]
      ) : void 0,
      s.shutterEntity ? le(this.hass?.states[s.shutterEntity], s.shutterInvert) : void 0
    )) : t.walls, l = !t.walls.length && !t.openings.length && !t.items.length && !t.texts.length && !t.furniture.length && !(t.trackers ?? []).length && !(t.areas ?? []).length;
    return g`
      <div
        class="editor ${this._fullscreen ? "fullscreen" : ""}"
        popover=${this._fullscreen ? "manual" : u}
        @pointerdown=${this._onEditorPointerDown}
      >
        ${this._floorMenuOpen || this._addMenuOpen ? g`<div
              class="pop-backdrop"
              @click=${() => {
      this._floorMenuOpen = !1, this._addMenuOpen = !1, this._addQuery = "";
    }}
            ></div>` : u}
        <div class="toolbar">
          <!-- Tools — modes; exactly one is active at a time -->
          <div class="seg" role="group" aria-label="Tool">
            ${["select", "wall", "door", "window", "tracker", "area"].map(
      (s) => g`
                <button
                  class=${this._tool === s ? "active" : ""}
                  aria-pressed=${this._tool === s}
                  title=${ri[s].label}
                  @click=${() => {
        this._tool = s, this._draft = null, this._draftTracker = null, this._draftArea = null, this._areaHover = null;
      }}
                >
                  <ha-icon icon=${ri[s].icon}></ha-icon>${ri[s].label}
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
          ${this._applyError ? g`<span class="apply-error">${this._applyError}</span>` : u}

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
            ${this._addMenuOpen ? this._renderAddMenu() : u}
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
              @change=${(s) => {
      this._switchFloor(s.target.value), this._canvasWrap?.focus({ preventScroll: !0 });
    }}
            >
              ${i.map(
      (s) => g`<option value=${s.id} .selected=${s.id === this._activeFloorId}>${s.name}</option>`
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
                      @change=${(s) => this._renameFloor(this._activeFloorId, s.target.value)}
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
                      @change=${(s) => this._commitFloor({
      short: s.target.value.trim() || void 0
    })}
                    />
                  </div>
                  <div class="pop-row">
                    <label>Color</label>
                    <input
                      type="color"
                      title="Accent for this floor's switcher button while active"
                      .value=${t?.color ?? "#03a9f4"}
                      @input=${(s) => this._commitFloor({ color: s.target.value })}
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
                      @change=${(s) => this._commit({
      ...this._config,
      defaultFloor: s.target.checked ? this._activeFloorId : void 0
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
                </div>` : u}
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
          style=${this._fullscreen ? u : `aspect-ratio:${C(e.width, Ie)} / ${C(e.height, tt)};`}
          @wheel=${this._onCanvasWheel}
        >
          <!-- The stage doubles as the card's .plan box for overlay sizing: same
               container query, same --fp-u, so a badge measured in canvas units
               previews here at the size a card of this width would draw it
               (issue #192). The editor never rotates the plan, so the canvas
               width is what 100cqw measures against. -->
          <div class="stage ${n === "plan" ? "scale-plan" : ""}"
               style="aspect-ratio: ${C(e.width, Ie)} / ${C(
      e.height,
      tt
    )}; width:${this._zoom * 100}%;
                   --fp-plan-w: ${C(e.width, Ie)};${Ma(
      e.skin
    )}${Io(e.palette)}">
            <!-- Keyed on the skin and the palette, for the repaint reason
                 documented on the card's SVG (issue #122): a var() inside a
                 presentation attribute does not repaint when the custom
                 property changes, so without this the canvas kept the previous
                 skin's doors and room fills — and, since issue #265, would show
                 a palette colour's old value while you were editing it. -->
            ${_r(
      `${e.skin ?? ""}|${Po(e.palette)}`,
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
                fill=${e.background ?? Nt}
              />
              ${t.image ? _`<image href=${t.image} x="0" y="0" width=${e.width} height=${e.height}
                            preserveAspectRatio=${wo(t.imageFit)}
                            opacity=${t.imageOpacity ?? 1} />` : u}
              ${this._renderGrid()}
              ${ie(
        t.areas ?? [],
        (s, c) => s.id || c,
        (s) => this._renderAreaSel(s, r)
      )}
              <!-- Dead spaces (issue #88), same layer position as the card so
                   what you draw is what you get. Live while you draw: closing
                   the last wall of a shaft hatches it, and dropping a door into
                   it clears the hatching again — which is the fastest way to
                   see that the card agrees with you about what is sealed. -->
              ${o.length ? _`${$o(`${this._wallMaskId}-dead`)}
                      ${o.map(
        (s) => ko(s, `${this._wallMaskId}-dead`)
      )}` : u}
              <!-- Light pools (issue #6), same layer position as the card so
                   what you place is what you get. Previewed at full strength
                   with no hass in the editor, so the radius is adjustable
                   without having to turn the real light on. -->
              ${Wr(
        t.furniture,
        e.width,
        e.height,
        `${this._wallMaskId}-glowmask`,
        this._symbols()
      )}
              <g class="fp-glows"
                 mask=${t.furniture.length ? `url(#${this._wallMaskId}-glowmask)` : u}>
                ${t.items.map((s, c) => {
        if (!s.glow) return u;
        const p = nh(s, this.hass?.states[s.entity]);
        return p ? Br(s, p, `${this._wallMaskId}-glow-${c}`, a) : u;
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
        (s) => s.glow && this._isSel("item", s.id) ? _`<circle class="glow-guide" cx=${s.x} cy=${s.y}
                                  r=${C(s.glowRadius, Ht)} />` : u
      )}
              ${t.furniture.map((s) => this._renderFurnitureSel(s))}
              ${xo(t.openings, e.width, e.height, this._wallMaskId)}
              ${t.walls.map((s) => this._renderWall(s))}
              <!-- Room outlines, same layer position as the card so what you
                   place is what you get. Only a static borderColor draws here,
                   there being no hass to resolve a live color from — but the
                   clip ids are passed anyway, so wiring a live preview in later
                   cannot silently land on the unclipped path. -->
              <g mask=${`url(#${this._wallMaskId})`}>
                ${(t.areas ?? []).map(
        (s, c) => Eo(s, void 0, `${this._wallMaskId}-area-${c}`)
      )}
              </g>
              ${ie(
        // Keyed by id: switching floors must create fresh DOM. Reused
        // nodes would CSS-transition from the previous floor's opening
        // state — a window briefly plays a door swing (issue #50).
        t.openings,
        (s, c) => s.id || c,
        (s) => this._renderOpeningSel(s)
      )}
              ${ie(
        t.trackers ?? [],
        (s, c) => s.id || c,
        (s) => this._renderTrackerSel(s)
      )}
              ${this._draftTracker ? _`<rect class="tracker-draft"
                              x=${Math.min(this._draftTracker.x0, this._draftTracker.x1)}
                              y=${Math.min(this._draftTracker.y0, this._draftTracker.y1)}
                              width=${Math.abs(this._draftTracker.x1 - this._draftTracker.x0)}
                              height=${Math.abs(this._draftTracker.y1 - this._draftTracker.y0)}
                              rx="4" />` : u}
              ${this._draft ? _`<g class="fp-wall-neon"><line x1=${this._draft.x1} y1=${this._draft.y1}
                              x2=${this._draft.x2} y2=${this._draft.y2}
                              class="wall draft" mask=${`url(#${this._wallMaskId})`}
                              stroke-width=${H} /></g>` : u}
              ${this._renderAreaDraft()}
              ${this._marquee ? _`<rect x=${Math.min(this._marquee.x0, this._marquee.x1)}
                              y=${Math.min(this._marquee.y0, this._marquee.y1)}
                              width=${Math.abs(this._marquee.x1 - this._marquee.x0)}
                              height=${Math.abs(this._marquee.y1 - this._marquee.y0)}
                              class="marquee" />` : u}
            </svg>`
    )}
            <div class="items">
              ${t.texts.map((s) => this._renderTextOverlay(s, e, n))}
              ${t.openings.filter((s) => ho(s)).map((s) => this._renderShutterMarkOverlay(s, e, n))}
              ${t.openings.filter((s) => fo(s)).map((s) => this._renderOpeningMarkOverlay(s, e, n))}
              ${t.items.map((s) => this._renderItemOverlay(s, e, n))}
            </div>
          </div>
        </div>
        ${l && !this._draft && !this._draftTracker && !this._draftArea ? g`<div class="empty-hint">
              <div>
                <b>Draw your first room:</b> pick the <b>Wall</b> tool and drag on the canvas.<br />
                Then drop doors, windows and devices onto it.
              </div>
            </div>` : u}
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
        .computeLabel=${zu}
        .computeHelper=${Du}
        @value-changed=${(i) => {
      i.stopPropagation();
      const n = cu(e.data, i.detail.value, e.fields), r = cr(n, e.fields), o = Object.keys(r);
      if (!o.length) return;
      const a = o.length === 1 && lr(e.fields.find((l) => l.name === o[0]));
      t(e.toPatch(r), a);
    }}
      ></ha-form>` : g`${e.fields.map((i) => this._renderFallbackField(e, i, t))}`;
  }
  _applyFallback(e, t, i, n, r) {
    const o = cr({ [t.name]: i }, e.fields);
    t.name in o && r(e.toPatch(o), n && lr(t));
  }
  /** One plain-input row per schema field — the outside-HA / load-failure path. */
  _renderFallbackField(e, t, i) {
    const n = e.data[t.name], r = t.selector;
    if ("select" in r) {
      const o = r.select, a = o.options;
      if (o.custom_value) {
        const l = `sel-${t.name}-${a.length}`;
        return g`<div class="row wide">
          <label>${t.label}</label>
          <input
            type="text"
            list=${l}
            .value=${String(n ?? "")}
            @change=${(s) => this._applyFallback(e, t, s.target.value, !1, i)}
          />
          <datalist id=${l}>
            ${a.map((s) => g`<option value=${s.value}></option>`)}
          </datalist>
        </div>`;
      }
      return g`<div class="row">
        <label>${t.label}</label>
        <select
          .value=${String(n ?? "")}
          @change=${(l) => this._applyFallback(e, t, l.target.value, !1, i)}
        >
          ${a.map(
        (l) => g`<option value=${l.value} ?selected=${l.value === n}>${l.label}</option>`
      )}
        </select>
      </div>`;
    }
    if ("boolean" in r)
      return g`<div class="row">
        <label>${t.label}</label>
        <input
          type="checkbox"
          .checked=${!!n}
          @change=${(o) => this._applyFallback(e, t, o.target.checked, !1, i)}
        />
      </div>`;
    if ("number" in r) {
      const o = r.number, a = o.mode === "slider";
      return g`<div class="row">
        <label>${t.label}</label>
        ${a ? g`<input
              type="range"
              min=${o.min ?? 0}
              max=${o.max ?? 100}
              step=${o.step ?? 1}
              .value=${String(n ?? o.min ?? 0)}
              @input=${(l) => this._applyFallback(e, t, Number(l.target.value), !0, i)}
            />` : u}
        <input
          class="num"
          type="number"
          min=${o.min ?? u}
          max=${o.max ?? u}
          step=${o.step ?? u}
          .value=${String(n ?? "")}
          @change=${(l) => {
        const s = l.target;
        this._applyFallback(
          e,
          t,
          s.value === "" ? void 0 : Number(s.value),
          !1,
          i
        ), s.value = String(e.data[t.name] ?? "");
      }}
        />
      </div>`;
    }
    if ("entity" in r) {
      const o = r.entity;
      return g`<div class="row wide">
        <label>${t.label}</label>
        ${this._renderEntityPicker(
        String(n ?? ""),
        (a) => this._applyFallback(e, t, a, !1, i),
        o.filter?.[0]?.domain,
        o.include_entities
      )}
      </div>`;
    }
    return "icon" in r ? g`<div class="row wide">
        <label>${t.label}</label>
        <input
          type="text"
          placeholder=${r.icon.placeholder ?? "mdi:…"}
          .value=${String(n ?? "")}
          @change=${(o) => this._applyFallback(e, t, o.target.value, !1, i)}
        />
      </div>` : "ui_action" in r ? g`${u}` : g`<div class="row">
      <label>${t.label}</label>
      <input
        type="text"
        .value=${String(n ?? "")}
        @input=${(o) => this._applyFallback(e, t, o.target.value, !0, i)}
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
        @value-changed=${(r) => t(r.detail.value ?? "")}
      ></ha-entity-picker>` : g`<input
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
    return customElements.get("ha-entity-attribute-picker") && e ? g`<ha-entity-attribute-picker
        class="reading-attr"
        .hass=${this.hass}
        .entityId=${e}
        .value=${t}
        allow-custom-value
        title=${n ?? u}
        @value-changed=${(r) => i(r.detail.value ?? "")}
      ></ha-entity-attribute-picker>` : g`<input
      type="text"
      class="reading-attr"
      placeholder="attribute"
      title=${n ?? u}
      .value=${t}
      @change=${(r) => i(r.target.value)}
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
        title=${i?.title ?? u}
        @value-changed=${(n) => t(n.detail.value ?? "")}
      ></ha-icon-picker>` : g`<input
      type="text"
      class="rule-icon"
      placeholder=${i?.placeholder ?? "mdi:blinds"}
      title=${i?.title ?? u}
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
    }, t = this._symbols(), i = zo(t).filter((o) => zd(o, this._addQuery)), n = !this._addQuery.trim();
    let r = "";
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
            @input=${(o) => {
      this._addQuery = o.target.value;
    }}
            @keydown=${(o) => {
      o.key === "Escape" && this._addQuery && (o.stopPropagation(), this._addQuery = "");
    }}
          />
        </div>
        <div class="add-furn-scroll">
          ${i.length ? i.map((o) => {
      const a = n && o.category !== r ? o.category : "";
      return r = o.category, g`${a ? g`<div class="furn-group">${a}</div>` : u}
                  ${this._renderFurnCell(o, e)}`;
    }) : g`<div class="furn-empty">No symbol matches “${this._addQuery}”</div>`}
        </div>
      </div>
    `;
  }
  /** One picker cell: the symbol drawn at its own default size, plus its name. */
  _renderFurnCell(e, t) {
    const { w: i, h: n } = e.size, r = Math.max(i, n) * 0.25 + 6, o = `${-i / 2 - r} ${-n / 2 - r} ${i + r * 2} ${n + r * 2}`;
    return g`
      <button
        class="furn-cell"
        title=${e.name}
        @click=${() => {
      this._addFurniture(e.id), t();
    }}
      >
        <svg viewBox=${o}>
          ${bi(
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
    const i = e > 1 ? `${e} elements selected` : this._selectionSummary(t), n = e > 1 ? "mdi:select-group" : Nu[t.kind];
    return g`
      <section class="edit-area">
        <div class="edit-head">
          <ha-icon icon=${n}></ha-icon>
          <span class="edit-title" title=${i}>${i}</span>
          <span class="head-spacer"></span>
          ${(() => {
      const r = this._floor(), o = this._selection.every((a) => ct(r, a));
      return g`<button
              class=${o ? "on" : ""}
              aria-label=${o ? "Unlock" : "Lock in place"}
              aria-pressed=${o ? "true" : "false"}
              title=${o ? "Unlock — let it be dragged again" : "Lock in place — it can still be selected and edited, just not moved"}
              @click=${() => this._setLocked(!o)}
            >
              <ha-icon icon=${o ? "mdi:lock" : "mdi:lock-open-variant-outline"}></ha-icon>
            </button>`;
    })()}
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
    const t = this._isSel("wall", e.id), i = t && !e.locked;
    return _`
      <g>
        <line x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}
              class="wall-hit"
              @pointerdown=${(n) => this._startDrag(n, { kind: "wall", id: e.id })} />
        <g class="fp-wall-neon"><line x1=${e.x1} y1=${e.y1} x2=${e.x2} y2=${e.y2}
              class="wall ${t ? "selected" : ""}"
              mask=${`url(#${this._wallMaskId})`}
              style=${Xr(e.thickness)} stroke-linecap="round" /></g>
        ${i ? _`
                <circle cx=${e.x1} cy=${e.y1} r="9" class="handle"
                        @pointerdown=${(n) => this._startDrag(n, { kind: "wall", id: e.id }, 1)} />
                <circle cx=${e.x2} cy=${e.y2} r="9" class="handle"
                        @pointerdown=${(n) => this._startDrag(n, { kind: "wall", id: e.id }, 2)} />` : u}
      </g>`;
  }
  _renderOpeningSel(e) {
    const t = this._isSel("opening", e.id);
    return _`
      <g class="opening-hit"
         @pointerdown=${(i) => this._startDrag(i, { kind: "opening", id: e.id })}>
        ${bo(e, {
      color: t ? "var(--primary-color, #03a9f4)" : Ci,
      open: Vi(e),
      // Draw sliding / rolling openings partly open in the editor so the
      // motion is visible — closed, both look like a plain band, which
      // would make the Motion / Slide / Style controls appear inert.
      amount: W(e) !== "swing" ? 0.55 : void 0,
      // Shutter previewed half-rolled so the layer is visible while
      // configuring, whatever the live state.
      shutter: e.shutterEntity ? { amount: 0.55, style: Pe(e), flip: e.shutterFlipV } : void 0
    })}
      </g>`;
  }
  /**
   * Render a Tracker in the editor SVG with its zone outline visible (so the
   * user can grab/resize it) plus a hit overlay for drag-to-move and a dashed
   * selection rectangle when active.
   */
  _renderTrackerSel(e) {
    const t = this._isSel("tracker", e.id), i = It(this.hass?.states, e.xSensor?.entity), n = It(this.hass?.states, e.ySensor?.entity), r = kt(this.hass?.states, e.xSensor?.presence), o = kt(this.hass?.states, e.ySensor?.presence);
    return _`
      <g class="tracker-hit ${t ? "selected" : ""}"
         @pointerdown=${(a) => this._startDrag(a, { kind: "tracker", id: e.id })}>
        ${Ao(e, {
      editing: !0,
      xReading: i,
      yReading: n,
      xPresent: r,
      yPresent: o
    })}
        <rect x=${e.x} y=${e.y} width=${e.w} height=${e.h}
              transform="rotate(${e.angle ?? 0} ${e.x + e.w / 2} ${e.y + e.h / 2})"
              class="tracker-hit-rect" />
        ${t ? _`<rect x=${e.x - 4} y=${e.y - 4}
                        width=${e.w + 8} height=${e.h + 8}
                        transform="rotate(${e.angle ?? 0} ${e.x + e.w / 2} ${e.y + e.h / 2})"
                        class="tracker-outline" />` : u}
      </g>`;
  }
  _renderFurnitureSel(e) {
    const t = this._isSel("furniture", e.id);
    return _`
      <g class="furn-hit ${t ? "selected" : ""}"
         @pointerdown=${(i) => this._startDrag(i, { kind: "furniture", id: e.id })}>
        ${bi(e, void 0, this._symbols())}
        ${t ? _`<rect x=${e.x - e.w / 2 - 4} y=${e.y - e.h / 2 - 4}
                        width=${e.w + 8} height=${e.h + 8}
                        transform="rotate(${e.angle ?? 0} ${e.x} ${e.y})"
                        class="furn-outline" />` : u}
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
    if (!e) return u;
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
    const i = this._isSel("area", e.id), n = e.id === t, r = e.points.map((o) => `${o.x},${o.y}`).join(" ");
    return _`
      <g class="area-hit ${i ? "selected" : ""} ${n ? "scoping" : ""}">
        ${n ? _`<polygon points=${r} class="area-scoping" />` : u}
        ${So(e)}
        <polygon points=${r} class="area-hit-shape"
                 @pointerdown=${(o) => this._startDrag(o, { kind: "area", id: e.id })} />
        ${i ? _`<polygon points=${r} class="area-outline" />` : u}
        ${// Outline yes, vertex handles no, for a pinned room — same reasoning
    // as the wall's endpoints (issue #191): still visibly selected, with
    // nothing on it that pretends to be draggable.
    i && !e.locked ? e.points.map(
      (o, a) => _`
                  <circle cx=${o.x} cy=${o.y} r="7" class="handle"
                          @pointerdown=${(l) => this._startDrag(l, { kind: "area", id: e.id }, void 0, a)} />`
    ) : u}
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
    if (!e) return u;
    const t = e.points, i = t.map((a) => `${a.x},${a.y}`).join(" "), n = t[t.length - 1], r = t.length >= 3, o = this._areaHover;
    return _`
      <g class="area-draft">
        ${t.length > 1 ? _`<polyline points=${i} class="area-draft-line" />` : u}
        ${o ? _`<line x1=${n.x} y1=${n.y} x2=${o.x} y2=${o.y}
                        class="area-draft-hover" />` : u}
        ${t.map(
      (a, l) => l === 0 && r ? _`<circle cx=${a.x} cy=${a.y} r="9" class="area-draft-start" />` : _`<circle cx=${a.x} cy=${a.y} r="5" class="area-draft-point" />`
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
    const n = e.shutterEntity, r = this.hass?.states[n], o = le(r, e.shutterInvert) > 0, a = uo(e, r, o, this.hass?.entities?.[n]?.icon), l = R(e.shutterActiveColor ?? e.activeColor) ?? z, s = Yi(e), c = Xi(e), p = F(At, i), d = F(Et, i);
    return g`<div
      class="shutter-mark ${ut(r, e.shutterInvert) ? "on" : "off"}"
      style="left:${s.x / t.width * 100}%; top:${s.y / t.height * 100}%;
             width:${p};height:${p};
             transform:translate(-50%,-50%)
                       translate(calc(${c.x} * ${d}), calc(${c.y} * ${d}));
             --fp-active:${l};"
      title=${`${r?.attributes?.friendly_name ?? n} — shown on the card, tap it there to open the shutter`}
    >
      <ha-icon icon=${a} style="--mdc-icon-size:${F(
      Tt,
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
    const n = e.entity, r = this.hass?.states[n], o = Oe(e, r) > 0, a = mo(e, r, o, this.hass?.entities?.[n]?.icon), l = R(e.activeColor) ?? z, s = go(e), c = yo(e), p = F(At, i), d = F(Et, i);
    return g`<div
      class="shutter-mark ${ui(e, r) ? "on" : "off"}"
      style="left:${s.x / t.width * 100}%; top:${s.y / t.height * 100}%;
             width:${p};height:${p};
             transform:translate(-50%,-50%)
                       translate(calc(${c.x} * ${d}), calc(${c.y} * ${d}));
             --fp-active:${l};"
      title=${`${r?.attributes?.friendly_name ?? n} — shown on the card, tap it there to open its dialog`}
    >
      <ha-icon icon=${a} style="--mdc-icon-size:${F(
      Tt,
      i
    )};"></ha-icon>
    </div>`;
  }
  _renderItemOverlay(e, t, i) {
    const n = this._isSel("item", e.id), r = e.entity ? this.hass?.states[e.entity] : void 0, o = hi(e, r, e.entity ? this.hass?.entities?.[e.entity]?.icon : void 0), { text: a, live: l } = ch(this.hass, e), s = C(e.size, we), c = nt(e) !== "none", p = e.display ?? "badge", d = Gi(e, r), h = R(Kt(e.stateColor, d)), m = Zr(e, h), b = nt(e) === "value" ? no(this.hass, e) : void 0, y = oe(e.entity, r?.state), v = y ? R(e.activeColor) ?? Nr(r) : void 0, w = wr(
      mt(h ?? v, this._config?.palette)
    ), $ = e.rippleColor ?? h ?? v ?? z, f = e.rippleSize ?? jt, k = e.rippleDirection ?? Ut, A = e.rippleWidth ?? Bt, O = Qr(e, r?.state, r?.attributes), T = F(s, i), q = g`<div
      class="badge ${c ? "" : "ghost"} ${h ? "state-colored" : y ? "active-colored" : ""}"
      style="width:${T};height:${T};transform:rotate(${C(e.angle, 0)}deg);${h ? `--fp-state:${h};` : ""}${v ? `--fp-active:${v};` : ""}${w ? `--fp-ink:${w};` : ""}"
    >
      ${b ? g`<span
            class="badge-value"
            style="font-size:${F(ao(s, b), i)};"
            >${b}</span
          >` : g`<ha-icon
            class=${O ? `anim-${O}` : ""}
            icon=${o}
            style="--mdc-icon-size:${F(to(s), i)};"
          ></ha-icon>`}
    </div>`;
    let G;
    p === "ripple" ? G = Mt(!0, $, f, k, A, 3, i) : p === "iconRipple" ? G = g`<div class="stack">
        ${Mt(!0, $, f, k, A, 3, i)}
        <div class="stack-icon">${q}</div>
      </div>` : G = q;
    const X = qr(e, r?.state);
    return g`
      <div
        class="edit-item ${n ? "selected" : ""} ${X ? "card-hidden" : ""}"
        style="left:${e.x / t.width * 100}%; top:${e.y / t.height * 100}%;"
        @pointerdown=${(me) => this._onOverlayDown(me, { kind: "item", id: e.id })}
        @pointermove=${this._onOverlayMove}
        @pointerup=${this._onOverlayUp}
        @pointercancel=${this._onPointerCancel}
      >
        ${G}
        <!-- The card's own label line when there is one (issue #135), so
             turning Show state on is visible here rather than only after
             leaving the editor; otherwise the dim identification fallback.
             The Labels toolbar toggle hides either on dense plans (issue
             #52), and the size previews the card's labelSize (issue #59). -->
        ${this._hideLabels ? u : g`<span
            class="ilabel ${l ? "live" : ""} ilabel-${Wi(e)}"
            style="font-size:${F(
      l || e.labelSize != null ? Vr(e.labelSize) : 11,
      i
    )};${l && m ? `color:${m};` : ""}"
            >${a}</span
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
               font-size:${F(C(e.size, Ke), i)};
               color:${K(e.color, $r)};
               transform:translate(-50%,-50%) rotate(${C(e.angle, 0)}deg);"
        @pointerdown=${(r) => this._onOverlayDown(r, { kind: "text", id: e.id })}
        @pointermove=${this._onOverlayMove}
        @pointerup=${this._onOverlayUp}
        @pointercancel=${this._onPointerCancel}
      >
        ${Di(this.hass, e) || "…"}
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
          ${this._projectOpen ? u : g`<span class="section-summary"
                >${this._config.title || "Untitled"} · ${this._config.width}×${this._config.height}</span
              >`}
        </button>
        ${this._projectOpen ? this._renderPanelBody() : u}
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
    const e = this._config, t = (n) => this._patchConfig(n), i = Mu(e);
    return g`
      <div class="rows panel-body">
        ${this._renderGroup(
      "Project",
      this._renderForm(Eu(e), (n, r) => {
        "grid" in n && typeof n.grid == "number" && (n = { ...n, ...this._gridPatch(n.grid) }), r ? this._patchConfigLive(n) : this._patchConfig(n);
      })
    )}
        ${this._renderGroup(
      // The plan's own look: its palette, its paper, and the one drawing
      // convention that is a plan-wide choice rather than an element's.
      "Look",
      this._renderForm(Cu(e), t),
      this._renderColorRow({
        label: "Background",
        value: e.background,
        swatch: "#ffffff",
        placeholder: "#ffffff or empty",
        onLive: (n) => this._patchConfigLive({ background: n }),
        onCommit: (n) => this._patchConfig({ background: n })
      }),
      this._renderForm(Iu(e), t)
    )}
        ${this._renderGroup(
      // Named colours (issue #265). Its own group rather than a row inside
      // Look: it is a list that grows, and it is the one thing here that
      // other panels reach back into.
      "Named colors",
      this._renderPalettePanel()
    )}
        ${this._renderGroup(
      // Per floor, not per project — but it is the floor's paper, so it
      // belongs beside the plan's own.
      "Floor image",
      this._renderForm(Lu(this._floor()), (n, r) => {
        r ? this._patchFloorLive(n) : this._commitFloor(n);
      })
    )}
        ${this._renderGroup(
      // How the card is framed on the dashboard, as opposed to what is
      // drawn inside it. Set once for a surface and rarely touched again.
      "Display",
      this._renderForm(
        J(i, [
          "rotation",
          "rotationPortrait",
          "rotationLandscape",
          "overlayScale",
          "compactHeader",
          "zoomedOverlayScale"
        ]),
        t
      )
    )}
        ${this._renderGroup(
      // Light through the openings (issue #177) — where it comes from and
      // what it looks like where it lands.
      "Sunlight",
      this._renderForm(Ou(e), t),
      e.sunlight ? g`${this._renderColorRow({
        label: "Sun color",
        title: "Color of the light the openings let in",
        value: e.sunlightColor,
        swatch: "#ffd9a0",
        placeholder: "(warm white)",
        onLive: (n) => this._patchConfigLive({ sunlightColor: n }),
        onCommit: (n) => this._patchConfig({ sunlightColor: n })
      })}
              ${e.sunShade === !1 ? u : this._renderColorRow({
        label: "Shade color",
        title: "Color of everywhere the light does not reach",
        value: e.sunShadeColor,
        swatch: "#000000",
        placeholder: "(black)",
        onLive: (n) => this._patchConfigLive({ sunShadeColor: n }),
        onCommit: (n) => this._patchConfig({ sunShadeColor: n })
      })}` : u
    )}
        ${this._renderGroup(
      // The other half of following the sun, and a separate switch: this
      // one dims the whole plan after dark rather than casting anything.
      "Night dimming",
      this._renderForm(Pu(e), t)
    )}
        ${this._renderGroup(
      // How devices look and answer, plan-wide. "Offline devices" lived
      // under display, beside the card's rotation, which is not what it is
      // about.
      "Devices",
      this._renderForm(Tu(e), t),
      this._renderForm(J(i, ["offlineStyle"]), t),
      this._renderForm(Au(e), t)
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
    const e = this._config.palette ?? [], t = (n) => this._patchConfig({ palette: n.length ? n : void 0 }), i = (n, r, o = !1) => {
      const a = e.map((l, s) => s === n ? { ...l, ...r } : l);
      o ? this._patchConfigLive({ palette: a }) : this._patchConfig({ palette: a });
    };
    return g`
      <div class="row col palette-panel">
        <label>Named colors</label>
        ${e.length ? u : g`<span class="hint"
              >Name a color here and every color field on the plan can point at it.</span
            >`}
        ${e.map(
      (n, r) => g`
            <div class="row wide palette-row">
              <input
                type="text"
                class="palette-name"
                placeholder="Warm"
                .value=${n.name ?? ""}
                @change=${(o) => this._renamePaletteColor(r, o.target)}
              />
              <input
                type="color"
                .value=${this._swatchValue(n.color, "#ff8800")}
                @input=${(o) => i(r, { color: o.target.value }, !0)}
              />
              <input
                type="text"
                class="palette-color"
                placeholder="#ff8800"
                .value=${n.color ?? ""}
                @change=${(o) => this._recolorPaletteColor(r, o.target)}
              />
              <button
                class="rule-remove"
                aria-label="Remove color"
                title="Remove this color; anything using it keeps the color it has now"
                @click=${() => this._removePaletteColor(r)}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>
          `
    )}
        ${this._paletteError ? g`<div class="symbol-error">${this._paletteError}</div>` : u}
        ${e.length >= Co ? u : g`<div class="row wide state-color-add">
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
    const t = new Set(e.map((i) => B(i.name)));
    for (let i = 1; ; i++) {
      const n = `Color ${i}`;
      if (!t.has(B(n))) return n;
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
    const r = t.value.trim(), o = B(n.name), a = B(r);
    if (o === a) {
      if (this._paletteError = "", r === (n.name ?? "")) {
        t.value = r;
        return;
      }
      this._patchConfig({ palette: i.map((c, p) => p === e ? { ...c, name: r } : c) });
      return;
    }
    if (a && i.some((c, p) => p !== e && B(c.name) === a)) {
      this._paletteError = `Another color is already called “${r}”.`, t.value = n.name ?? "";
      return;
    }
    this._paletteError = "";
    const l = i.map((c, p) => p === e ? { ...c, name: r } : c), s = { ...this._config, palette: l };
    this._patchConfig(
      // Same shadowing caveat as delete: if another entry still declares the old
      // slug, its references are none of this rename's business.
      this._slugStillResolves(o, s) ? s : (
        // An empty new name leaves the entry unusable, so its references have
        // nothing to point at — freeze them at the colour, as a delete does.
        nr(s, o, a ? ir(r) : n.color)
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
    const r = t.value.trim();
    if (!R(r)) {
      this._paletteError = r ? `“${r}” is not a color the card can use.` : "A named color needs a color. Use the remove button to take the name away.", t.value = n.color ?? "";
      return;
    }
    this._paletteError = "", this._patchConfig({ palette: i.map((o, a) => a === e ? { ...o, color: r } : o) });
  }
  _removePaletteColor(e) {
    const t = this._config.palette ?? [], i = t[e];
    if (!i) return;
    this._paletteError = "";
    const n = t.filter((o, a) => a !== e), r = { ...this._config, palette: n.length ? n : void 0 };
    this._patchConfig(
      this._slugStillResolves(B(i.name), r) ? r : nr(r, B(i.name), i.color)
    );
  }
  /** Whether a slug is still declared by the palette in `config`. */
  _slugStillResolves(e, t) {
    return e ? rt(t.palette).some((i) => B(i.name) === e) : !1;
  }
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
            </div>` : u}
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
        ${this._symbolError ? g`<div class="symbol-error">${this._symbolError}</div>` : u}
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
    if (!e || this._selection.length !== 1) return g`${u}`;
    if (e.kind === "opening") {
      const t = this._floor().openings.find((o) => o.id === e.id);
      if (!t) return g`${u}`;
      const i = hu(t, (o) => this._supportedFeatures(o)), n = (o, a) => {
        if ("entity" in o) {
          const l = o.entity, s = l ? this.hass?.states[l]?.attributes?.device_class : void 0;
          o = { ...o, ...s ? Dh(s) : {} };
        }
        this._applyElementPatch("opening", t.id, o, a);
      }, r = (o, a, ...l) => {
        const s = J(i, a);
        return !s.fields.length && !l.some((c) => c && c !== u) ? u : this._renderGroup(o, this._renderForm(s, n), ...l);
      };
      return g`
        ${E.OPENING_GROUPS.map(
        ([o, a]) => o === "Color" ? r(
          o,
          a,
          t.entity ? this._renderColorRow({
            label: "Active color",
            value: t.activeColor,
            swatch: "#03a9f4",
            placeholder: "(primary)",
            onLive: (l) => this._updateOpeningLive(t.id, { activeColor: l }),
            onCommit: (l) => this._updateOpening(t.id, { activeColor: l })
          }) : u
        ) : o === "Shutter" ? r(
          o,
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
            onLive: (l) => this._updateOpeningLive(t.id, { shutterActiveColor: l }),
            onCommit: (l) => this._updateOpening(t.id, { shutterActiveColor: l })
          }) : u
        ) : r(o, a)
      )}
      `;
    }
    if (e.kind === "item") {
      const t = this._floor().items.find((s) => s.id === e.id);
      if (!t) return g`${u}`;
      const i = this._areaEntitiesAt(t.x, t.y), n = t.entity ? this.hass?.states[t.entity]?.attributes?.device_class : void 0, r = (s) => (s ? this.hass?.states[s]?.attributes?.friendly_name : void 0) ?? s, o = {
        source: oo(this.hass, t)?.source ?? "primary",
        primaryLabel: r(t.entity),
        // One label per reading, positionally — the dropdown names each rather
        // than numbering them, and a reading with no entity of its own is read
        // off this device, so that is the name to show for it (issue #180).
        readingLabels: ue(t).map((s) => r(s.entity || t.entity))
      }, a = (s, c) => {
        "entity" in s && typeof s.entity == "string" && (s = { ...s, kind: Vn(s.entity) }), this._applyElementPatch("item", t.id, s, c);
      }, l = yu(t, n);
      return g`
        ${this._renderGroup("Identity", this._renderForm(uu(t), a))}
        ${this._renderGroup(
        "What it reads",
        // Entity, its attribute, whether its own state shows, then every
        // other entity — the order the label prints them in (issue #180).
        this._renderForm(pu(t, i), a),
        this._renderForm(fu(t), a),
        this._renderItemReadings(t)
      )}
        ${lh(t) ? this._renderGroup(
        "Label",
        this._renderForm(mu(t), a),
        t.disableLabelColor && t.useCustomLabelColor ? this._renderColorRow({
          label: "Custom color",
          value: t.labelCustomColor,
          swatch: "#ffffff",
          placeholder: "e.g. #ff0000 or red",
          onLive: (s) => this._updateItemLive(t.id, { labelCustomColor: s }),
          onCommit: (s) => this._updateItem(t.id, { labelCustomColor: s })
        }) : u
      ) : u}
        ${this._renderGroup(
        "Badge",
        this._renderForm(gu(t, o), a),
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
          onLive: (s) => this._updateItemLive(t.id, { activeColor: s }),
          onCommit: (s) => this._updateItem(t.id, { activeColor: s })
        }),
        this._renderStateColorRules(
          t.stateColor,
          (s) => this._updateItem(t.id, { stateColor: s }),
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
        Jr(t.entity, n) && on(t) ? this._renderColorRow({
          label: "Ripple color",
          value: t.rippleColor,
          swatch: t.activeColor ?? "#03a9f4",
          placeholder: t.activeColor ? "(active color)" : "(primary)",
          onLive: (s) => this._updateItemLive(t.id, { rippleColor: s }),
          onCommit: (s) => this._updateItem(t.id, { rippleColor: s })
        }) : u
      ) : u}
        ${this._renderGroup("Behaviour", this._renderForm(vu(t), a))}
        ${this._renderGroup("Visibility", this._renderForm(bu(t), a))}
      `;
    }
    if (e.kind === "text") {
      const t = this._floor().texts.find((i) => i.id === e.id);
      return t ? g`
        ${this._renderForm(
        _u(t, this._areaEntitiesAt(t.x, t.y)),
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
      ` : g`${u}`;
    }
    if (e.kind === "furniture") {
      const t = this._floor().furniture.find((r) => r.id === e.id);
      if (!t) return g`${u}`;
      const i = wu(t, this._areaEntitiesAt(t.x, t.y), this._symbols()), n = (r, o) => this._applyElementPatch("furniture", t.id, r, o);
      return g`
        ${E.FURNITURE_GROUPS.map(
        ([r, o]) => this._renderGroup(r, this._renderForm(J(i, o), n))
      )}
        ${this._renderGroup(
        "Color",
        this._renderColorRow({
          label: "Color",
          value: t.color,
          swatch: "#9e9e9e",
          placeholder: "(gray)",
          onLive: (r) => this._updateFurnitureLive(t.id, { color: r }),
          onCommit: (r) => this._updateFurniture(t.id, { color: r })
        }),
        // Without an entity there is nothing to condition a colour on.
        t.entity ? g`
                ${this._renderColorRow({
          label: "Active color",
          title: "Color while the entity is on",
          value: t.activeColor,
          swatch: "#03a9f4",
          placeholder: "(no change)",
          onLive: (r) => this._updateFurnitureLive(t.id, { activeColor: r }),
          onCommit: (r) => this._updateFurniture(t.id, { activeColor: r })
        })}
                ${this._renderStateColorRules(
          t.stateColor,
          (r) => this._updateFurniture(t.id, { stateColor: r })
        )}
              ` : u
      )}
      `;
    }
    if (e.kind === "area") {
      const t = (this._floor().areas ?? []).find((a) => a.id === e.id);
      if (!t) return g`${u}`;
      const i = Ka(this.hass), n = t.haArea ? this._pendingAreaEntities(t) : [], r = ku(t), o = (a, l) => this._applyElementPatch("area", t.id, a, l);
      return g`
        ${this._renderGroup(
        // The name doubles as the HA-area link, so the link status line and
        // the name-related toggles belong with it.
        "Identity",
        this._renderForm(
          $u(t, i.map((a) => a.name)),
          (a, l) => (
            // A name change also decides `haArea` (see areaNamePatch).
            this._applyElementPatch("area", t.id, Va(a, i), l)
          )
        ),
        this._renderAreaLinkRow(t, i),
        this._renderForm(J(r, ["showName", "labelSize"]), o)
      )}
        ${this._renderGroup(
        "What it reads",
        this._renderForm(J(r, ["entity"]), o)
      )}
        ${this._renderGroup(
        "Color",
        this._renderForm(J(r, ["highlight", "opacity", "activeOpacity"]), o),
        this._renderColorRow({
          label: "Color",
          value: t.color,
          swatch: "#03a9f4",
          placeholder: "(primary)",
          onLive: (a) => this._updateAreaLive(t.id, { color: a }),
          onCommit: (a) => this._updateArea(t.id, { color: a })
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
          onLive: (a) => this._updateAreaLive(t.id, { activeColor: a }),
          onCommit: (a) => this._updateArea(t.id, { activeColor: a })
        })}
                ${this._renderStateColorRules(
          t.stateColor,
          (a) => this._updateArea(t.id, { stateColor: a })
        )}
              ` : u
      )}
        ${this._renderGroup(
        // What tapping the room does (issue #181). Last, as it is on every
        // other element: the thing it *does*, after everything it *is*.
        "Behavior",
        this._renderForm(
          J(r, [
            "fitZoom",
            "zoom",
            "tap_action",
            "hold_action",
            "double_tap_action"
          ]),
          o
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
                  @change=${(a) => this._updateArea(t.id, {
          filterEntities: a.target.checked
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
      ) : u}
        <p class="hint">
          Drag inside the fill to move the whole room; drag a vertex handle to reshape it.
        </p>
      `;
    }
    if (e.kind === "tracker") {
      const t = (this._floor().trackers ?? []).find((r) => r.id === e.id);
      if (!t) return g`${u}`;
      const i = xu(t), n = (r, o) => this._applyElementPatch("tracker", t.id, r, o);
      return g`
        ${this._renderGroup(
        "Zone",
        this._renderForm(J(i, E.TRACKER_GROUPS[0][1]), n)
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
        this._renderForm(J(i, E.TRACKER_GROUPS[1][1]), n),
        this._renderColorRow({
          label: "Color",
          value: t.color,
          swatch: "#03a9f4",
          placeholder: "(primary)",
          onLive: (r) => this._updateTrackerLive(t.id, { color: r }),
          onCommit: (r) => this._updateTracker(t.id, { color: r })
        })
      )}
      `;
    }
    if (e.kind === "wall") {
      const t = this._floor().walls.find((n) => n.id === e.id);
      if (!t) return g`${u}`;
      const i = Math.round(Math.hypot(t.x2 - t.x1, t.y2 - t.y1));
      return g`
        ${this._renderForm(
        Su(t),
        (n, r) => this._applyElementPatch("wall", t.id, n, r)
      )}
        <div class="row">
          <label>Length</label>
          <input
            class="num"
            type="number"
            min="1"
            .value=${String(i)}
            @change=${(n) => {
        const r = n.target, o = Number(r.value);
        if (r.value === "" || !(o >= 1)) {
          r.value = String(i);
          return;
        }
        const a = t.x2 - t.x1, l = t.y2 - t.y1, s = Math.hypot(a, l), c = s > 0 ? a / s : 1, p = s > 0 ? l / s : 0;
        this._updateWall(t.id, {
          x2: Math.round(t.x1 + c * o),
          y2: Math.round(t.y1 + p * o)
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
    return g`${u}`;
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
      (r) => {
        r ? this._updateTrackerSensor(e.id, t, { entity: r }) : this._updateTrackerSensor(e.id, t, null);
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
              @change=${(r) => {
      const o = r.target, a = Number(o.value);
      o.value !== "" && Number.isFinite(a) ? this._updateTrackerSensor(e.id, t, { min: a }) : o.value = String(n.min);
    }}
            />
            <input
              class="num"
              type="number"
              step="0.01"
              title="Reading at the far edge"
              .value=${String(n.max)}
              @change=${(r) => {
      const o = r.target, a = Number(o.value);
      o.value !== "" && Number.isFinite(a) ? this._updateTrackerSensor(e.id, t, { max: a }) : o.value = String(n.max);
    }}
            />
            <label class="inline-check">
              <input
                type="checkbox"
                .checked=${n.invert ?? !1}
                @change=${(r) => this._updateTrackerSensor(e.id, t, {
      invert: r.target.checked || void 0
    })}
              />
              invert
            </label>
          </div>
          <div class="row wide">
            <label>${i} presence</label>
            ${this._renderEntityPicker(
      n.presence?.entity ?? "",
      (r) => this._updateTrackerSensor(e.id, t, {
        presence: r ? { entity: r, invert: n.presence?.invert } : void 0
      }),
      ["binary_sensor", "input_boolean", "device_tracker"]
    )}
            ${n.presence ? g`<label class="inline-check" title="Treat 'off' as detected">
                  <input
                    type="checkbox"
                    .checked=${n.presence.invert ?? !1}
                    @change=${(r) => this._updateTrackerSensor(e.id, t, {
      presence: {
        entity: n.presence.entity,
        invert: r.target.checked || void 0
      }
    })}
                  />
                  invert
                </label>` : u}
          </div>` : u}
    `;
  }
};
E._nextWallMaskId = 0;
E.OPENING_GROUPS = [
  // What it is, and how it is drawn.
  ["Shape", ["type", "motion", "length", "sash", "sashSpan", "hinge", "opens", "slide", "style", "angle"]],
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
E.FURNITURE_GROUPS = [
  ["Shape", ["type", "hand", "w", "h", "angle"]],
  ["What it reads", ["entity"]],
  // What clicking it does — a staircase that changes floor (issue #121).
  ["Behavior", ["goToFloor"]]
];
E.TRACKER_GROUPS = [
  ["Zone", ["w", "h", "x", "y", "angle"]],
  ["Marker", ["dotSize"]]
];
E.styles = [
  kr,
  ot`
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
      width: ${$t}px;
      height: ${$t}px;
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
  `
];
I([
  P({ attribute: !1 })
], E.prototype, "hass", 2);
I([
  M()
], E.prototype, "_config", 2);
I([
  M()
], E.prototype, "_tool", 2);
I([
  M()
], E.prototype, "_selection", 2);
I([
  M()
], E.prototype, "_activeFloorId", 2);
I([
  M()
], E.prototype, "_draft", 2);
I([
  M()
], E.prototype, "_draftTracker", 2);
I([
  M()
], E.prototype, "_draftArea", 2);
I([
  M()
], E.prototype, "_areaHover", 2);
I([
  M()
], E.prototype, "_freeWalls", 2);
I([
  M()
], E.prototype, "_defaultOpeningLength", 2);
I([
  M()
], E.prototype, "_marquee", 2);
I([
  M()
], E.prototype, "_history", 2);
I([
  M()
], E.prototype, "_future", 2);
I([
  M()
], E.prototype, "_zoom", 2);
I([
  M()
], E.prototype, "_floorMenuOpen", 2);
I([
  M()
], E.prototype, "_addMenuOpen", 2);
I([
  M()
], E.prototype, "_addQuery", 2);
I([
  M()
], E.prototype, "_symbolDraft", 2);
I([
  M()
], E.prototype, "_symbolError", 2);
I([
  M()
], E.prototype, "_paletteError", 2);
I([
  M()
], E.prototype, "_projectOpen", 2);
I([
  M()
], E.prototype, "_openGroups", 2);
I([
  M()
], E.prototype, "_fullscreen", 2);
I([
  M()
], E.prototype, "_applyState", 2);
I([
  M()
], E.prototype, "_applyError", 2);
I([
  Ai(".editor")
], E.prototype, "_editorEl", 2);
I([
  Ai("svg")
], E.prototype, "_svg", 2);
I([
  Ai(".canvas-wrap")
], E.prototype, "_canvasWrap", 2);
I([
  M()
], E.prototype, "_hideLabels", 2);
E = I([
  Ft("easy-floorplan-card-editor")
], E);
const Bu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get FloorplanCardEditor() {
    return E;
  }
}, Symbol.toStringTag, { value: "Module" })), Wu = "0.7.2", _i = window;
_i.customCards = _i.customCards || [];
_i.customCards.push({
  type: "easy-floorplan-card",
  name: "Easy Floorplan",
  description: "Draw a floorplan with walls, doors, windows, furniture and text, then place device/light controls with a visual editor.",
  preview: !1,
  documentationURL: "https://github.com/nicosandller/easy-floorplan"
});
console.info(
  `%c EASY-FLOORPLAN %c ${Wu} `,
  "background:#03a9f4;color:#fff",
  "color:#03a9f4"
);
export {
  Z as FloorplanCard
};
