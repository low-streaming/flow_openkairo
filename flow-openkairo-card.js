/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis, F = k.ShadowRoot && (k.ShadyCSS === void 0 || k.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, W = Symbol(), X = /* @__PURE__ */ new WeakMap();
let lt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== W) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = X.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && X.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const _t = (r) => new lt(typeof r == "string" ? r : r + "", void 0, W), ct = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, s, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[o + 1], r[0]);
  return new lt(e, r, W);
}, mt = (r, t) => {
  if (F) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = k.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, Y = F ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return _t(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yt, defineProperty: vt, getOwnPropertyDescriptor: bt, getOwnPropertyNames: At, getOwnPropertySymbols: wt, getPrototypeOf: Et } = Object, g = globalThis, Q = g.trustedTypes, xt = Q ? Q.emptyScript : "", I = g.reactiveElementPolyfillSupport, S = (r, t) => r, D = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? xt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, q = (r, t) => !yt(r, t), tt = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: q };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), g.litPropertyMetadata ?? (g.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && vt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = bt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const h = s == null ? void 0 : s.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, h, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const e = this.properties, i = [...At(e), ...wt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(Y(s));
    } else t !== void 0 && e.push(Y(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return mt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var o;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const n = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : D).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const h = i.getPropertyOptions(s), a = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((o = h.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? h.converter : D;
      this._$Em = s;
      const d = a.fromAttribute(e, h.type);
      this[s] = d ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    var n;
    if (t !== void 0) {
      const h = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = h.getPropertyOptions(t)), !((i.hasChanged ?? q)(o, e) || i.useDefault && i.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(h._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, n] of s) {
        const { wrapped: h } = n, a = this[o];
        h !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[S("elementProperties")] = /* @__PURE__ */ new Map(), A[S("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: A }), (g.reactiveElementVersions ?? (g.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, et = (r) => r, j = P.trustedTypes, it = j ? j.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, dt = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, pt = "?" + $, Ct = `<${pt}>`, b = document, O = () => b.createComment(""), M = (r) => r === null || typeof r != "object" && typeof r != "function", K = Array.isArray, St = (r) => K(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", L = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, st = /-->/g, rt = />/g, _ = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, nt = /"/g, ut = /^(?:script|style|textarea|title)$/i, Pt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), m = Pt(1), E = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), y = b.createTreeWalker(b, 129);
function ft(r, t) {
  if (!K(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return it !== void 0 ? it.createHTML(t) : t;
}
const Ot = (r, t) => {
  const e = r.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = C;
  for (let h = 0; h < e; h++) {
    const a = r[h];
    let d, p, l = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, p = n.exec(a), p !== null); ) u = n.lastIndex, n === C ? p[1] === "!--" ? n = st : p[1] !== void 0 ? n = rt : p[2] !== void 0 ? (ut.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = _) : p[3] !== void 0 && (n = _) : n === _ ? p[0] === ">" ? (n = s ?? C, l = -1) : p[1] === void 0 ? l = -2 : (l = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? _ : p[3] === '"' ? nt : ot) : n === nt || n === ot ? n = _ : n === st || n === rt ? n = C : (n = _, s = void 0);
    const f = n === _ && r[h + 1].startsWith("/>") ? " " : "";
    o += n === C ? a + Ct : l >= 0 ? (i.push(d), a.slice(0, l) + dt + a.slice(l) + $ + f) : a + $ + (l === -2 ? h : f);
  }
  return [ft(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const h = t.length - 1, a = this.parts, [d, p] = Ot(t, e);
    if (this.el = U.createElement(d, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = y.nextNode()) !== null && a.length < h; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(dt)) {
          const u = p[n++], f = s.getAttribute(l).split($), R = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: R[2], strings: f, ctor: R[1] === "." ? Ut : R[1] === "?" ? Nt : R[1] === "@" ? Ht : z }), s.removeAttribute(l);
        } else l.startsWith($) && (a.push({ type: 6, index: o }), s.removeAttribute(l));
        if (ut.test(s.tagName)) {
          const l = s.textContent.split($), u = l.length - 1;
          if (u > 0) {
            s.textContent = j ? j.emptyScript : "";
            for (let f = 0; f < u; f++) s.append(l[f], O()), y.nextNode(), a.push({ type: 2, index: ++o });
            s.append(l[u], O());
          }
        }
      } else if (s.nodeType === 8) if (s.data === pt) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = s.data.indexOf($, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = b.createElement("template");
    return i.innerHTML = t, i;
  }
}
function x(r, t, e = r, i) {
  var n, h;
  if (t === E) return t;
  let s = i !== void 0 ? (n = e._$Co) == null ? void 0 : n[i] : e._$Cl;
  const o = M(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((h = s == null ? void 0 : s._$AO) == null || h.call(s, !1), o === void 0 ? s = void 0 : (s = new o(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = x(r, s._$AS(r, t.values), s, i)), t;
}
class Mt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? b).importNode(e, !0);
    y.currentNode = s;
    let o = y.nextNode(), n = 0, h = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new T(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Tt(o, this, t)), this._$AV.push(d), a = i[++h];
      }
      n !== (a == null ? void 0 : a.index) && (o = y.nextNode(), n++);
    }
    return y.currentNode = b, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class T {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = x(this, t, e), M(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = U.createElement(ft(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(e);
    else {
      const n = new Mt(s, this), h = n.u(this.options);
      n.p(e), this.T(h), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new T(this.O(O()), this.O(O()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = et(t).nextSibling;
      et(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = x(this, t, e, 0), n = !M(t) || t !== this._$AH && t !== E, n && (this._$AH = t);
    else {
      const h = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = x(this, h[i + a], e, a), d === E && (d = this._$AH[a]), n || (n = !M(d) || d !== this._$AH[a]), d === c ? t = c : t !== c && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ut extends z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Nt extends z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Ht extends z {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? c) === E) return;
    const i = this._$AH, s = t === c && i !== c || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== c && (i === c || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Tt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const V = P.litHtmlPolyfillSupport;
V == null || V(U, T), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.2");
const Rt = (r, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new T(t.insertBefore(O(), o), o, void 0, e ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v = globalThis;
class w extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Rt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return E;
  }
}
var ht;
w._$litElement$ = !0, w.finalized = !0, (ht = v.litElementHydrateSupport) == null || ht.call(v, { LitElement: w });
const B = v.litElementPolyfillSupport;
B == null || B({ LitElement: w });
(v.litElementVersions ?? (v.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $t = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = { attribute: !0, type: String, converter: D, reflect: !1, hasChanged: q }, Dt = (r = kt, t, e) => {
  const { kind: i, metadata: s } = e;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(e.name, r), i === "accessor") {
    const { name: n } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(n, a, r, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(n, void 0, r, h), h;
    } };
  }
  if (i === "setter") {
    const { name: n } = e;
    return function(h) {
      const a = this[n];
      t.call(this, h), this.requestUpdate(n, a, r, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function G(r) {
  return (t, e) => typeof e == "object" ? Dt(r, t, e) : ((i, s, o) => {
    const n = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function gt(r) {
  return G({ ...r, state: !0, attribute: !1 });
}
var jt = Object.defineProperty, zt = Object.getOwnPropertyDescriptor, Z = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? zt(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (s = (i ? n(t, e, s) : n(s)) || s);
  return i && s && jt(t, e, s), s;
};
let N = class extends w {
  setConfig(r) {
    this._config = r;
  }
  _getEntity(r) {
    if (!this._config || !this._config[r]) return "";
    const t = this._config[r];
    return typeof t == "string" ? t : t.entity || "";
  }
  _valueChanged(r, t) {
    if (!this._config || !this.hass) return;
    const e = r.detail.value, i = this._config[t];
    let s;
    typeof i == "object" && i !== null ? s = { ...i, entity: e } : i === void 0 || typeof i == "string" ? s = e : s = { ...i, entity: e };
    const o = {
      ...this._config,
      [t]: s
    };
    this._fireConfigChanged(o);
  }
  _toggleChanged(r, t) {
    if (!this._config || !this.hass) return;
    const e = r.target.checked;
    if (this._config[t] === e) return;
    const i = {
      ...this._config,
      [t]: e
    };
    this._fireConfigChanged(i);
  }
  _fireConfigChanged(r) {
    this._config = r;
    const t = new CustomEvent("config-changed", {
      detail: { config: r },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(t);
  }
  render() {
    return !this.hass || !this._config ? c : m`
            <div class="card-config">
                <h3>Entities</h3>
                ${this._renderEntityPicker("Solar Power", "solar")}
                ${this._renderEntityPicker("Battery Power", "battery")}
                ${this._renderEntityPicker("Grid Power", "grid")}
                ${this._renderEntityPicker("Home Consumption", "home")}
                
                <h3>Options</h3>
                ${this._renderSwitch("Invert Battery (Active = Charge)", "invert_battery")}
                ${this._renderSwitch("Invert Grid (Active = Import)", "invert_grid")}
            </div>
        `;
  }
  _renderEntityPicker(r, t) {
    return m`
            <div class="option">
                <ha-entity-picker
                    .label=${r}
                    .hass=${this.hass}
                    .value=${this._getEntity(t)}
                    @value-changed=${(e) => this._valueChanged(e, t)}
                    allow-custom-entity
                ></ha-entity-picker>
            </div>
        `;
  }
  _renderSwitch(r, t) {
    return m`
            <div class="row">
                <ha-switch
                    .checked=${this._config[t] === !0}
                    @change=${(e) => this._toggleChanged(e, t)}
                ></ha-switch>
                <span>${r}</span>
            </div>
        `;
  }
};
N.styles = ct`
        .card-config { display: flex; flex-direction: column; gap: 16px; padding: 16px 0; }
        .option { display: flex; flex-direction: column; gap: 8px; }
        .row { display: flex; align-items: center; gap: 12px; }
    `;
Z([
  G({ attribute: !1 })
], N.prototype, "hass", 2);
Z([
  gt()
], N.prototype, "_config", 2);
N = Z([
  $t("flow-openkairo-card-editor")
], N);
var It = Object.defineProperty, Lt = Object.getOwnPropertyDescriptor, J = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? Lt(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (s = (i ? n(t, e, s) : n(s)) || s);
  return i && s && It(t, e, s), s;
};
let H = class extends w {
  constructor() {
    super(...arguments), this.defaults = {
      solar: { icon: "mdi:solar-power", color: "#ffb74d", name: "Solar" },
      battery: { icon: "mdi:battery-high", color: "#64dd17", name: "Battery" },
      grid: { icon: "mdi:transmission-tower", color: "#29b6f6", name: "Grid" },
      home: { icon: "mdi:home-lightning", color: "#ab47bc", name: "Home" }
    };
  }
  static getConfigElement() {
    return document.createElement("flow-openkairo-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:flow-openkairo-card",
      solar: "",
      battery: "",
      grid: "",
      home: "",
      invert_battery: !1,
      invert_grid: !1
    };
  }
  setConfig(r) {
    if (!r) throw new Error("Invalid configuration");
    this.config = r;
  }
  _getEntityId(r) {
    if (r)
      return typeof r == "string" ? r : r.entity;
  }
  _getValue(r) {
    const t = this._getEntityId(r);
    if (!t || !this.hass.states[t]) return 0;
    const e = parseFloat(this.hass.states[t].state);
    return isNaN(e) ? 0 : e;
  }
  _getColor(r, t) {
    return !r || typeof r == "string" ? t : r.color || t;
  }
  _getIcon(r, t) {
    return !r || typeof r == "string" ? t : r.icon || t;
  }
  _getName(r, t) {
    return !r || typeof r == "string" ? t : r.name || t;
  }
  _getAnimationDuration(r) {
    if (r <= 0) return 0;
    const t = 0.5, e = 5, s = Math.min(r / 5e3, 1);
    return e - s * (e - t);
  }
  render() {
    if (!this.config || !this.hass) return c;
    const r = Math.max(0, this._getValue(this.config.solar));
    let t = this._getValue(this.config.battery);
    this.config.invert_battery && (t *= -1);
    const e = t > 10, i = t < -10, s = Math.abs(t);
    let o = this._getValue(this.config.grid);
    this.config.invert_grid && (o *= -1);
    const n = o > 10, h = o < -10, a = Math.abs(o), d = Math.max(0, this._getValue(this.config.home)), p = this._getColor(this.config.solar, this.defaults.solar.color), l = this._getColor(this.config.home, this.defaults.home.color);
    return m`
            <ha-card>
                <div class="card-content">
                    <div class="flow-container">
                        ${this._renderNode("solar", r, this.config.solar)}
                        ${this._renderNode("battery", s, this.config.battery)}
                        ${this._renderNode("grid", a, this.config.grid)}
                        ${this._renderNode("home", d, this.config.home)}
                        
                        <svg class="flow-lines" viewBox="0 0 400 300">
                             <defs>
                                <linearGradient id="grad-solar" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100%">
                                    <stop offset="0%" stop-color="${p}" />
                                    <stop offset="100%" stop-color="${l}" />
                                </linearGradient>
                             </defs>
                             
                             ${r > 10 ? this._renderFlow(200, 60, 200, 240, r, p) : c}
                             ${e ? this._renderFlow(200, 60, 80, 150, s, p) : c}
                             ${i ? this._renderFlow(80, 150, 200, 240, s, this._getColor(this.config.battery, this.defaults.battery.color)) : c}
                             ${n ? this._renderFlow(320, 150, 200, 240, a, this._getColor(this.config.grid, this.defaults.grid.color)) : c}
                             ${h ? this._renderFlow(200, 60, 320, 150, a, p) : c}
                        </svg>
                    </div>
                </div>
            </ha-card>
        `;
  }
  _renderNode(r, t, e) {
    const i = this.defaults[r], s = this._getColor(e, i.color), o = this._getIcon(e, i.icon), n = this._getName(e, i.name), h = t > 5;
    return m`
            <div class="node ${r}" ?active=${h} style="--node-color: ${s}">
                <ha-icon icon="${o}"></ha-icon>
                <div class="info">
                    <span class="value">${Math.round(t)} W</span>
                    <span class="label">${n}</span>
                </div>
            </div>
        `;
  }
  _renderFlow(r, t, e, i, s, o) {
    const n = this._getAnimationDuration(s), h = `path-${r}-${t}-${e}-${i}`, a = o || "#fff", d = `M${r},${t} L${e},${i}`;
    return m`
            <path id="${h}" class="flow-path" d="${d}" stroke="${a}" stroke-opacity="0.3" stroke-width="2" fill="none" />
            <circle r="4" fill="${a}">
                <animateMotion dur="${n}s" repeatCount="indefinite" calcMode="linear">
                    <mpath href="#${h}" />
                </animateMotion>
            </circle>
             ${s > 1e3 ? m`
                <circle r="3" fill="${a}">
                  <animateMotion dur="${n}s" begin="${n / 2}s" repeatCount="indefinite" calcMode="linear">
                    <mpath href="#${h}" />
                  </animateMotion>
                </circle>
              ` : c}
        `;
  }
  // Card Layout Config
  getCardSize() {
    return 6;
  }
};
H.styles = ct`
        :host { display: block; }
        ha-card {
            background: var(--ha-card-background, rgba(20, 20, 20, 0.6));
            color: white;
            overflow: visible;
            border-radius: 16px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.08);
        }
        .card-content { padding: 0; position: relative; height: 320px; display: flex; justify-content: center; align-items: center; }
        .flow-container { position: relative; width: 400px; height: 300px; }
        .flow-lines { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .node { position: absolute; width: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; transition: all 0.3s ease; text-align: center; }
        .node ha-icon { --mdc-icon-size: 36px; color: var(--node-color); background: rgba(40,40,40,0.8); padding: 12px; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3); border: 2px solid var(--node-color); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .node[active] ha-icon { box-shadow: 0 0 20px var(--node-color); transform: scale(1.1); }
        .info { margin-top: 8px; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 8px; backdrop-filter: blur(4px); }
        .value { font-weight: 700; font-size: 16px; display: block; text-shadow: 0 1px 2px black; }
        .label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; }
        .solar { top: 10px; left: 50%; transform: translateX(-50%); }
        .battery { top: 50%; left: 30px; transform: translateY(-50%); }
        .grid { top: 50%; right: 30px; transform: translateY(-50%); }
        .home { bottom: 20px; left: 50%; transform: translateX(-50%); }
    `;
J([
  G({ attribute: !1 })
], H.prototype, "hass", 2);
J([
  gt()
], H.prototype, "config", 2);
H = J([
  $t("flow-openkairo-card")
], H);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "flow-openkairo-card",
  name: "Flow OpenKairo Card",
  preview: !0,
  description: "Custom SolarFlow visualization"
});
export {
  H as FlowOpenKairoCard
};
