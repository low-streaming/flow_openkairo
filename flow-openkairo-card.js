/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, F = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, W = Symbol(), rt = /* @__PURE__ */ new WeakMap();
let gt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== W) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = rt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && rt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Et = (r) => new gt(typeof r == "string" ? r : r + "", void 0, W), _t = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, s, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[n + 1], r[0]);
  return new gt(e, r, W);
}, xt = (r, t) => {
  if (F) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = D.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, ot = F ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Et(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ct, defineProperty: St, getOwnPropertyDescriptor: Pt, getOwnPropertyNames: Ot, getOwnPropertySymbols: Mt, getPrototypeOf: Ut } = Object, g = globalThis, nt = g.trustedTypes, Ht = nt ? nt.emptyScript : "", B = g.reactiveElementPolyfillSupport, P = (r, t) => r, R = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Ht : null;
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
} }, G = (r, t) => !Ct(r, t), at = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: G };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), g.litPropertyMetadata ?? (g.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = at) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && St(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: n } = Pt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const h = s == null ? void 0 : s.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, h, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? at;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = Ut(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, i = [...Ot(e), ...Mt(e)];
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
      for (const s of i) e.unshift(ot(s));
    } else t !== void 0 && e.push(ot(t));
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
    return xt(t, this.constructor.elementStyles), t;
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
    var n;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : R).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const h = i.getPropertyOptions(s), a = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((n = h.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? h.converter : R;
      this._$Em = s;
      const d = a.fromAttribute(e, h.type);
      this[s] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, n) {
    var o;
    if (t !== void 0) {
      const h = this.constructor;
      if (s === !1 && (n = this[t]), i ?? (i = h.getPropertyOptions(t)), !((i.hasChanged ?? G)(n, e) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(h._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: h } = o, a = this[n];
        h !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[P("elementProperties")] = /* @__PURE__ */ new Map(), A[P("finalized")] = /* @__PURE__ */ new Map(), B == null || B({ ReactiveElement: A }), (g.reactiveElementVersions ?? (g.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis, ht = (r) => r, z = O.trustedTypes, lt = z ? z.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, mt = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, yt = "?" + $, Nt = `<${yt}>`, b = document, M = () => b.createComment(""), U = (r) => r === null || typeof r != "object" && typeof r != "function", q = Array.isArray, kt = (r) => q(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", L = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, dt = />/g, m = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ut = /"/g, vt = /^(?:script|style|textarea|title)$/i, Tt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), S = Tt(1), E = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ft = /* @__PURE__ */ new WeakMap(), y = b.createTreeWalker(b, 129);
function bt(r, t) {
  if (!q(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(t) : t;
}
const Dt = (r, t) => {
  const e = r.length - 1, i = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
  for (let h = 0; h < e; h++) {
    const a = r[h];
    let d, p, l = -1, u = 0;
    for (; u < a.length && (o.lastIndex = u, p = o.exec(a), p !== null); ) u = o.lastIndex, o === C ? p[1] === "!--" ? o = ct : p[1] !== void 0 ? o = dt : p[2] !== void 0 ? (vt.test(p[2]) && (s = RegExp("</" + p[2], "g")), o = m) : p[3] !== void 0 && (o = m) : o === m ? p[0] === ">" ? (o = s ?? C, l = -1) : p[1] === void 0 ? l = -2 : (l = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? m : p[3] === '"' ? ut : pt) : o === ut || o === pt ? o = m : o === ct || o === dt ? o = C : (o = m, s = void 0);
    const f = o === m && r[h + 1].startsWith("/>") ? " " : "";
    n += o === C ? a + Nt : l >= 0 ? (i.push(d), a.slice(0, l) + mt + a.slice(l) + $ + f) : a + $ + (l === -2 ? h : f);
  }
  return [bt(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const h = t.length - 1, a = this.parts, [d, p] = Dt(t, e);
    if (this.el = H.createElement(d, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (s = y.nextNode()) !== null && a.length < h; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const l of s.getAttributeNames()) if (l.endsWith(mt)) {
          const u = p[o++], f = s.getAttribute(l).split($), _ = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: n, name: _[2], strings: f, ctor: _[1] === "." ? zt : _[1] === "?" ? jt : _[1] === "@" ? Bt : j }), s.removeAttribute(l);
        } else l.startsWith($) && (a.push({ type: 6, index: n }), s.removeAttribute(l));
        if (vt.test(s.tagName)) {
          const l = s.textContent.split($), u = l.length - 1;
          if (u > 0) {
            s.textContent = z ? z.emptyScript : "";
            for (let f = 0; f < u; f++) s.append(l[f], M()), y.nextNode(), a.push({ type: 2, index: ++n });
            s.append(l[u], M());
          }
        }
      } else if (s.nodeType === 8) if (s.data === yt) a.push({ type: 2, index: n });
      else {
        let l = -1;
        for (; (l = s.data.indexOf($, l + 1)) !== -1; ) a.push({ type: 7, index: n }), l += $.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = b.createElement("template");
    return i.innerHTML = t, i;
  }
}
function x(r, t, e = r, i) {
  var o, h;
  if (t === E) return t;
  let s = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const n = U(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((h = s == null ? void 0 : s._$AO) == null || h.call(s, !1), n === void 0 ? s = void 0 : (s = new n(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = x(r, s._$AS(r, t.values), s, i)), t;
}
class Rt {
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
    let n = y.nextNode(), o = 0, h = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new T(n, n.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (d = new Lt(n, this, t)), this._$AV.push(d), a = i[++h];
      }
      o !== (a == null ? void 0 : a.index) && (n = y.nextNode(), o++);
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
    t = x(this, t, e), U(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : kt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = H.createElement(bt(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(e);
    else {
      const o = new Rt(s, this), h = o.u(this.options);
      o.p(e), this.T(h), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ft.get(t.strings);
    return e === void 0 && ft.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const n of t) s === e.length ? e.push(i = new T(this.O(M()), this.O(M()), this, this.options)) : i = e[s], i._$AI(n), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = ht(t).nextSibling;
      ht(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(t, e = this, i, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = x(this, t, e, 0), o = !U(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
    else {
      const h = t;
      let a, d;
      for (t = n[0], a = 0; a < n.length - 1; a++) d = x(this, h[i + a], e, a), d === E && (d = this._$AH[a]), o || (o = !U(d) || d !== this._$AH[a]), d === c ? t = c : t !== c && (t += (d ?? "") + n[a + 1]), this._$AH[a] = d;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class zt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class jt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Bt extends j {
  constructor(t, e, i, s, n) {
    super(t, e, i, s, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? c) === E) return;
    const i = this._$AH, s = t === c && i !== c || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== c && (i === c || s);
    s && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Lt {
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
const I = O.litHtmlPolyfillSupport;
I == null || I(H, T), (O.litHtmlVersions ?? (O.litHtmlVersions = [])).push("3.3.2");
const It = (r, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new T(t.insertBefore(M(), n), n, void 0, e ?? {});
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = It(e, this.renderRoot, this.renderOptions);
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
var $t;
w._$litElement$ = !0, w.finalized = !0, ($t = v.litElementHydrateSupport) == null || $t.call(v, { LitElement: w });
const V = v.litElementPolyfillSupport;
V == null || V({ LitElement: w });
(v.litElementVersions ?? (v.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const At = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Vt = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: G }, Ft = (r = Vt, t, e) => {
  const { kind: i, metadata: s } = e;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), i === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(e.name, r), i === "accessor") {
    const { name: o } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(o, a, r, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, r, h), h;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(h) {
      const a = this[o];
      t.call(this, h), this.requestUpdate(o, a, r, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function K(r) {
  return (t, e) => typeof e == "object" ? Ft(r, t, e) : ((i, s, n) => {
    const o = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function wt(r) {
  return K({ ...r, state: !0, attribute: !1 });
}
var Wt = Object.defineProperty, Gt = Object.getOwnPropertyDescriptor, Z = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? Gt(t, e) : t, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (s = (i ? o(t, e, s) : o(s)) || s);
  return i && s && Wt(t, e, s), s;
};
let N = class extends w {
  setConfig(r) {
    this._config = r;
  }
  _entityChanged(r, t) {
    var s;
    if (!this._config || !this.hass)
      return;
    const e = r.detail.value;
    if (((s = this._config[t]) == null ? void 0 : s.entity) === e)
      return;
    const i = {
      ...this._config,
      [t]: {
        ...this._config[t],
        entity: e
      }
    };
    this._FireConfigChanged(i);
  }
  _toggleChanged(r, t) {
    if (!this._config || !this.hass) return;
    const i = r.target.checked;
    if (this._config[t] === i) return;
    const s = {
      ...this._config,
      [t]: i
    };
    this._FireConfigChanged(s);
  }
  _FireConfigChanged(r) {
    this._config = r;
    const t = new CustomEvent("config-changed", {
      detail: { config: r },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(t);
  }
  render() {
    var r, t, e, i;
    return !this.hass || !this._config ? c : S`
            <div class="card-config">
                <h3>Entities</h3>
                
                <div class="option">
                    <ha-entity-picker
                        label="Solar Grid/Power (W)"
                        .hass=${this.hass}
                        .value=${((r = this._config.solar) == null ? void 0 : r.entity) || ""}
                        @value-changed=${(s) => this._entityChanged(s, "solar")}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <div class="option">
                    <ha-entity-picker
                        label="Battery Power (W)"
                        .hass=${this.hass}
                        .value=${((t = this._config.battery) == null ? void 0 : t.entity) || ""}
                        @value-changed=${(s) => this._entityChanged(s, "battery")}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <div class="option">
                    <ha-entity-picker
                        label="Grid Power (W)"
                        .hass=${this.hass}
                        .value=${((e = this._config.grid) == null ? void 0 : e.entity) || ""}
                        @value-changed=${(s) => this._entityChanged(s, "grid")}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <div class="option">
                    <ha-entity-picker
                        label="Home Consumption (W)"
                        .hass=${this.hass}
                        .value=${((i = this._config.home) == null ? void 0 : i.entity) || ""}
                        @value-changed=${(s) => this._entityChanged(s, "home")}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <h3>Options</h3>
                <div class="row">
                    <ha-switch
                        .checked=${this._config.invert_battery !== !1}
                        @change=${(s) => this._toggleChanged(s, "invert_battery")}
                    ></ha-switch>
                    <span>Invert Battery Logic (Standard: +Charge/-Discharge)</span>
                </div>
                <div class="row">
                    <ha-switch
                        .checked=${this._config.invert_grid !== !1}
                        @change=${(s) => this._toggleChanged(s, "invert_grid")}
                    ></ha-switch>
                    <span>Invert Grid Logic (Standard: +Import/-Export)</span>
                </div>
            </div>
        `;
  }
};
N.styles = _t`
        .card-config {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px 0;
        }
        .option {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .row {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    `;
Z([
  K({ attribute: !1 })
], N.prototype, "hass", 2);
Z([
  wt()
], N.prototype, "_config", 2);
N = Z([
  At("flow-openkairo-card-editor")
], N);
var qt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, J = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? Kt(t, e) : t, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (s = (i ? o(t, e, s) : o(s)) || s);
  return i && s && qt(t, e, s), s;
};
let k = class extends w {
  constructor() {
    super(...arguments), this.defaults = {
      solar: { icon: "mdi:solar-power", color: "#ffb74d", name: "Solar" },
      battery: { icon: "mdi:battery-high", color: "#64dd17", name: "Battery" },
      grid: { icon: "mdi:transmission-tower", color: "#29b6f6", name: "Grid" },
      home: { icon: "mdi:home-lightning", color: "#ab47bc", name: "Home" }
    };
  }
  // --- Editor Configuration ---
  static getConfigElement() {
    return document.createElement("flow-openkairo-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:flow-openkairo-card",
      solar: { entity: "", name: "Solar" },
      battery: { entity: "", name: "Battery" },
      grid: { entity: "", name: "Grid" },
      home: { entity: "", name: "Home" },
      invert_battery: !1,
      invert_grid: !1
    };
  }
  setConfig(r) {
    if (!r) throw new Error("Invalid configuration");
    this.config = r;
  }
  // --- Helpers ---
  // Get numeric value from entity
  getValue(r) {
    if (!r || !this.hass.states[r]) return 0;
    const t = parseFloat(this.hass.states[r].state);
    return isNaN(t) ? 0 : t;
  }
  // Calculate flow duration (speed) based on power
  // Higher power = faster animation (lower duration)
  getAnimationDuration(r) {
    if (r <= 0) return 0;
    const t = 0.5, e = 5, s = Math.min(r / 5e3, 1);
    return e - s * (e - t);
  }
  render() {
    var l, u, f, _, X, Y, Q, tt, et, st, it;
    if (!this.config || !this.hass) return c;
    const r = this.getValue((l = this.config.solar) == null ? void 0 : l.entity);
    let t = this.getValue((u = this.config.battery) == null ? void 0 : u.entity);
    this.config.invert_battery && (t *= -1);
    let e = this.getValue((f = this.config.grid) == null ? void 0 : f.entity);
    this.config.invert_grid && (e *= -1);
    const i = this.getValue((_ = this.config.home) == null ? void 0 : _.entity), s = r > 10, n = t > 10, o = t < -10, h = Math.abs(t), a = e > 10, d = e < -10, p = Math.abs(e);
    return S`
      <ha-card>
        <div class="card-content">
          <div class="flow-container">
            
            <!-- Nodes -->
            ${this.renderNode("solar", r, this.config.solar)}
            ${this.renderNode("battery", h, this.config.battery)}
            ${this.renderNode("grid", p, this.config.grid)}
            ${this.renderNode("home", i, this.config.home)}

            <!-- SVG Flows -->
            <svg class="flow-lines" viewBox="0 0 400 300">
               <defs>
                 <linearGradient id="grad-solar" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100%">
                   <stop offset="0%" style="stop-color:${((X = this.config.solar) == null ? void 0 : X.color) || this.defaults.solar.color}" />
                   <stop offset="100%" style="stop-color:${((Y = this.config.home) == null ? void 0 : Y.color) || this.defaults.home.color}" />
                 </linearGradient>
                 <!-- Add other gradients dynamically or use solid colors -->
               </defs>

               <!-- Solar -> Home (Direct) -->
               ${s ? this.renderFlow(200, 60, 200, 240, r, (Q = this.config.solar) == null ? void 0 : Q.color) : c}

               <!-- Solar -> Battery (Charging) -->
               ${n ? this.renderFlow(200, 60, 80, 150, h, (tt = this.config.solar) == null ? void 0 : tt.color) : c}

               <!-- Battery -> Home (Discharging) -->
               ${o ? this.renderFlow(80, 150, 200, 240, h, (et = this.config.battery) == null ? void 0 : et.color) : c}
               
               <!-- Grid -> Home (Import) -->
               ${a ? this.renderFlow(320, 150, 200, 240, p, (st = this.config.grid) == null ? void 0 : st.color) : c}

               <!-- Solar -> Grid (Export) - Complex path? Or simple? -->
               ${d && s ? this.renderFlow(200, 60, 320, 150, p, (it = this.config.solar) == null ? void 0 : it.color) : c}
            </svg>

          </div>
        </div>
      </ha-card>
    `;
  }
  renderNode(r, t, e) {
    const i = this.defaults[r], s = (e == null ? void 0 : e.color) || i.color, n = (e == null ? void 0 : e.icon) || i.icon, o = (e == null ? void 0 : e.name) || i.name, h = t > 5;
    return S`
      <div class="node ${r}" ?active=${h} style="--node-color: ${s}">
        <ha-icon icon="${n}"></ha-icon>
        <div class="info">
          <span class="value">${Math.round(t)} W</span>
          <span class="label">${o}</span>
        </div>
      </div>
    `;
  }
  // Renders a curved line with animated dots
  renderFlow(r, t, e, i, s, n) {
    const o = this.getAnimationDuration(s), h = `path-${r}-${t}-${e}-${i}`, a = n || "#fff", d = `M${r},${t} L${e},${i}`;
    return S`
      <path id="${h}" class="flow-path" d="${d}" stroke="${a}" stroke-opacity="0.3" stroke-width="2" fill="none" />
      <circle r="4" fill="${a}">
        <animateMotion dur="${o}s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#${h}" />
        </animateMotion>
      </circle>
      <!-- Optional: Second dot for heavy flow -->
      ${s > 1e3 ? S`
        <circle r="3" fill="${a}">
          <animateMotion dur="${o}s" begin="${o / 2}s" repeatCount="indefinite" calcMode="linear">
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
k.styles = _t`
    :host {
      display: block;
    }
    ha-card {
      background: var(--ha-card-background, rgba(20, 20, 20, 0.6));
      color: white;
      overflow: visible;
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .card-content {
      padding: 0;
      position: relative;
      height: 320px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .flow-container {
      position: relative;
      width: 400px;
      height: 300px;
      /* background: rgba(0,0,0,0.1); Debug */
    }
    .flow-lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
    
    /* Nodes */
    .node {
      position: absolute;
      width: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: all 0.3s ease;
      text-align: center;
    }
    
    .node ha-icon {
      --mdc-icon-size: 36px;
      color: var(--node-color);
      background: rgba(40,40,40,0.8);
      padding: 12px;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      border: 2px solid var(--node-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .node[active] ha-icon {
      box-shadow: 0 0 20px var(--node-color);
      transform: scale(1.1);
    }

    .info {
      margin-top: 8px;
      background: rgba(0,0,0,0.6);
      padding: 4px 8px;
      border-radius: 8px;
      backdrop-filter: blur(4px);
    }
    .value { font-weight: 700; font-size: 16px; display: block; text-shadow: 0 1px 2px black; }
    .label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; }

    /* Positioning */
    /* Solar Top Center */
    .solar { top: 10px; left: 50%; transform: translateX(-50%); }
    
    /* Battery Left Middle */
    .battery { top: 50%; left: 30px; transform: translateY(-50%); }
    
    /* Grid Right Middle */
    .grid { top: 50%; right: 30px; transform: translateY(-50%); }
    
    /* Home Bottom Center */
    .home { bottom: 20px; left: 50%; transform: translateX(-50%); }

  `;
J([
  K({ attribute: !1 })
], k.prototype, "hass", 2);
J([
  wt()
], k.prototype, "config", 2);
k = J([
  At("flow-openkairo-card")
], k);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "flow-openkairo-card",
  name: "Flow OpenKairo Card",
  preview: !0,
  description: "Custom SolarFlow visualization"
});
export {
  k as FlowOpenKairoCard
};
