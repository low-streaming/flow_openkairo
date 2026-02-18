/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis, G = k.ShadowRoot && (k.ShadyCSS === void 0 || k.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, W = Symbol(), J = /* @__PURE__ */ new WeakMap();
let lt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== W) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (G && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = J.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && J.set(e, t));
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
  if (G) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = k.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, X = G ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return _t(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: vt, defineProperty: yt, getOwnPropertyDescriptor: bt, getOwnPropertyNames: At, getOwnPropertySymbols: wt, getPrototypeOf: xt } = Object, _ = globalThis, Q = _.trustedTypes, Et = Q ? Q.emptyScript : "", z = _.reactiveElementPolyfillSupport, S = (r, t) => r, D = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Et : null;
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
} }, q = (r, t) => !vt(r, t), tt = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: q };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), _.litPropertyMetadata ?? (_.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
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
      s !== void 0 && yt(this.prototype, t, s);
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
    const t = xt(this);
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
      for (const s of i) e.unshift(X(s));
    } else t !== void 0 && e.push(X(t));
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[S("elementProperties")] = /* @__PURE__ */ new Map(), A[S("finalized")] = /* @__PURE__ */ new Map(), z == null || z({ ReactiveElement: A }), (_.reactiveElementVersions ?? (_.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, et = (r) => r, j = P.trustedTypes, it = j ? j.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, dt = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, pt = "?" + $, Ct = `<${pt}>`, b = document, M = () => b.createComment(""), O = (r) => r === null || typeof r != "object" && typeof r != "function", F = Array.isArray, St = (r) => F(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", L = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, st = /-->/g, rt = />/g, m = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, nt = /"/g, ut = /^(?:script|style|textarea|title)$/i, Pt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), u = Pt(1), x = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), v = b.createTreeWalker(b, 129);
function ft(r, t) {
  if (!F(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return it !== void 0 ? it.createHTML(t) : t;
}
const Mt = (r, t) => {
  const e = r.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = C;
  for (let h = 0; h < e; h++) {
    const a = r[h];
    let d, p, c = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, p = n.exec(a), p !== null); ) f = n.lastIndex, n === C ? p[1] === "!--" ? n = st : p[1] !== void 0 ? n = rt : p[2] !== void 0 ? (ut.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = m) : p[3] !== void 0 && (n = m) : n === m ? p[0] === ">" ? (n = s ?? C, c = -1) : p[1] === void 0 ? c = -2 : (c = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? m : p[3] === '"' ? nt : ot) : n === nt || n === ot ? n = m : n === st || n === rt ? n = C : (n = m, s = void 0);
    const g = n === m && r[h + 1].startsWith("/>") ? " " : "";
    o += n === C ? a + Ct : c >= 0 ? (i.push(d), a.slice(0, c) + dt + a.slice(c) + $ + g) : a + $ + (c === -2 ? h : g);
  }
  return [ft(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const h = t.length - 1, a = this.parts, [d, p] = Mt(t, e);
    if (this.el = U.createElement(d, i), v.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = v.nextNode()) !== null && a.length < h; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(dt)) {
          const f = p[n++], g = s.getAttribute(c).split($), R = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: R[2], strings: g, ctor: R[1] === "." ? Ut : R[1] === "?" ? Nt : R[1] === "@" ? Ht : I }), s.removeAttribute(c);
        } else c.startsWith($) && (a.push({ type: 6, index: o }), s.removeAttribute(c));
        if (ut.test(s.tagName)) {
          const c = s.textContent.split($), f = c.length - 1;
          if (f > 0) {
            s.textContent = j ? j.emptyScript : "";
            for (let g = 0; g < f; g++) s.append(c[g], M()), v.nextNode(), a.push({ type: 2, index: ++o });
            s.append(c[f], M());
          }
        }
      } else if (s.nodeType === 8) if (s.data === pt) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf($, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = b.createElement("template");
    return i.innerHTML = t, i;
  }
}
function E(r, t, e = r, i) {
  var n, h;
  if (t === x) return t;
  let s = i !== void 0 ? (n = e._$Co) == null ? void 0 : n[i] : e._$Cl;
  const o = O(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((h = s == null ? void 0 : s._$AO) == null || h.call(s, !1), o === void 0 ? s = void 0 : (s = new o(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = E(r, s._$AS(r, t.values), s, i)), t;
}
class Ot {
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
    v.currentNode = s;
    let o = v.nextNode(), n = 0, h = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new T(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Tt(o, this, t)), this._$AV.push(d), a = i[++h];
      }
      n !== (a == null ? void 0 : a.index) && (o = v.nextNode(), n++);
    }
    return v.currentNode = b, s;
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
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = E(this, t, e), O(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = U.createElement(ft(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(e);
    else {
      const n = new Ot(s, this), h = n.u(this.options);
      n.p(e), this.T(h), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    F(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new T(this.O(M()), this.O(M()), this, this.options)) : i = e[s], i._$AI(o), s++;
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
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = l;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = E(this, t, e, 0), n = !O(t) || t !== this._$AH && t !== x, n && (this._$AH = t);
    else {
      const h = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = E(this, h[i + a], e, a), d === x && (d = this._$AH[a]), n || (n = !O(d) || d !== this._$AH[a]), d === l ? t = l : t !== l && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ut extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Nt extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Ht extends I {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? l) === x) return;
    const i = this._$AH, s = t === l && i !== l || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== l && (i === l || s);
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
    E(this, t);
  }
}
const B = P.litHtmlPolyfillSupport;
B == null || B(U, T), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.2");
const Rt = (r, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new T(t.insertBefore(M(), o), o, void 0, e ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = globalThis;
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
    return x;
  }
}
var ht;
w._$litElement$ = !0, w.finalized = !0, (ht = y.litElementHydrateSupport) == null || ht.call(y, { LitElement: w });
const V = y.litElementPolyfillSupport;
V == null || V({ LitElement: w });
(y.litElementVersions ?? (y.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = (r) => (t, e) => {
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
function K(r) {
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
function $t(r) {
  return K({ ...r, state: !0, attribute: !1 });
}
var jt = Object.defineProperty, It = Object.getOwnPropertyDescriptor, Y = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? It(t, e) : t, o = r.length - 1, n; o >= 0; o--)
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
    return !this.hass || !this._config ? l : u`
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
    return u`
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
    return u`
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
Y([
  K({ attribute: !1 })
], N.prototype, "hass", 2);
Y([
  $t()
], N.prototype, "_config", 2);
N = Y([
  gt("flow-openkairo-card-editor")
], N);
var zt = Object.defineProperty, Lt = Object.getOwnPropertyDescriptor, Z = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? Lt(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (s = (i ? n(t, e, s) : n(s)) || s);
  return i && s && zt(t, e, s), s;
};
let H = class extends w {
  constructor() {
    super(...arguments), this.defaults = {
      solar: { icon: "mdi:solar-power", color: "#ffb300", name: "Produktion" },
      // Amber/Gold
      battery: { icon: "mdi:battery-high", color: "#00e676", name: "Speicher" },
      // Bright Green
      grid: { icon: "mdi:transmission-tower", color: "#2979ff", name: "Netz" },
      // Bright Blue
      home: { icon: "mdi:home-lightning", color: "#d500f9", name: "Verbrauch" }
      // Vivid Purple
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
  // --- Helpers ---
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
    return typeof r == "object" && (r != null && r.color) ? r.color : t;
  }
  _getIcon(r, t) {
    return typeof r == "object" && (r != null && r.icon) ? r.icon : t;
  }
  _getName(r, t) {
    return typeof r == "object" && (r != null && r.name) ? r.name : t;
  }
  // Dynamic easing duration
  _getAnimationDuration(r) {
    return r <= 10 ? 0 : Math.max(0.8, 5 - Math.log10(r + 1) * 1.5);
  }
  render() {
    if (!this.config || !this.hass) return l;
    const r = Math.max(0, this._getValue(this.config.solar)), t = Math.max(0, this._getValue(this.config.home));
    let e = this._getValue(this.config.battery);
    this.config.invert_battery && (e *= -1);
    const i = e > 0 ? e : 0, s = e < 0 ? Math.abs(e) : 0;
    let o = this._getValue(this.config.grid);
    this.config.invert_grid && (o *= -1);
    const n = o > 0 ? o : 0, h = o < 0 ? Math.abs(o) : 0, a = this._getColor(this.config.solar, this.defaults.solar.color), d = this._getColor(this.config.battery, this.defaults.battery.color), p = this._getColor(this.config.grid, this.defaults.grid.color), c = this._getColor(this.config.home, this.defaults.home.color);
    return u`
            <ha-card>
                <div class="card-content">
                    
                    <!-- SVG Layer -->
                    <svg class="flow-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <!-- Static Lines (Background) -->
                        <path d="M200,80 L200,150" class="line-bg" /> <!-- Solar -> Mid -->
                        <path d="M200,150 L80,150" class="line-bg" /> <!-- Mid -> Bat -->
                        <path d="M200,150 L320,150" class="line-bg" /> <!-- Mid -> Grid -->
                        <path d="M200,150 L200,220" class="line-bg" /> <!-- Mid -> Home -->

                        <!-- Active Flows -->
                        
                        <!-- 1. Solar Production (To Middle) -->
                        ${r > 10 ? this._renderPath(200, 80, 200, 150, r, a) : l}

                        <!-- 2. Battery Charge (from Mid) -->
                        ${i > 10 ? this._renderPath(200, 150, 80, 150, i, a) : l}

                        <!-- 3. Battery Discharge (to Mid) -->
                        ${s > 10 ? this._renderPath(80, 150, 200, 150, s, d) : l}

                        <!-- 4. Grid Import (to Mid) -->
                        ${n > 10 ? this._renderPath(320, 150, 200, 150, n, p) : l}

                        <!-- 5. Grid Export (from Mid) -->
                        ${h > 10 ? this._renderPath(200, 150, 320, 150, h, a) : l}

                        <!-- 6. Home Consumption (from Mid) -->
                        ${t > 10 ? this._renderPath(200, 150, 200, 220, t, c) : l}

                    </svg>

                    <!-- Nodes Layer (HTML) -->
                    <div class="nodes-container">
                        <!-- Solar -->
                        <div class="node-wrapper" style="top: 10px; left: 50%; transform: translateX(-50%);">
                            ${this._renderNode("solar", r, this.config.solar, a)}
                        </div>

                        <!-- Battery -->
                        <div class="node-wrapper" style="top: 50%; left: 10px; transform: translateY(-50%);">
                            ${this._renderNode("battery", Math.abs(e), this.config.battery, d)}
                            ${i > 0 ? u`<div class="sub-label">Charge</div>` : l}
                            ${s > 0 ? u`<div class="sub-label">Discharge</div>` : l}
                        </div>

                        <!-- Grid -->
                        <div class="node-wrapper" style="top: 50%; right: 10px; transform: translateY(-50%);">
                            ${this._renderNode("grid", Math.abs(o), this.config.grid, p)}
                            ${n > 0 ? u`<div class="sub-label">Import</div>` : l}
                            ${h > 0 ? u`<div class="sub-label">Export</div>` : l}
                        </div>

                        <!-- Home -->
                        <div class="node-wrapper" style="bottom: 10px; left: 50%; transform: translateX(-50%);">
                            ${this._renderNode("home", t, this.config.home, c)}
                        </div>

                         <!-- Center Hub (Visual Decoration) -->
                        <div class="hub" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
                            <div class="hub-dot"></div>
                        </div>
                    </div>

                </div>
            </ha-card>
        `;
  }
  _renderPath(r, t, e, i, s, o) {
    const n = this._getAnimationDuration(s), h = `p-${r}-${t}-${e}-${i}`, a = `M${r},${t} L${e},${i}`, d = Math.min(6, 2 + s / 2e3);
    return u`
            <path id="${h}" d="${a}" fill="none" stroke="${o}" stroke-width="2" stroke-opacity="0.2" />
            <circle r="${d}" fill="${o}" filter="url(#glow)">
                <animateMotion dur="${n}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                    <mpath href="#${h}" />
                </animateMotion>
            </circle>
        `;
  }
  _renderNode(r, t, e, i) {
    const s = this.defaults[r], o = this._getIcon(e, s.icon), n = this._getName(e, s.name), h = t > 5;
    return u`
            <div class="node" ?active=${h} style="--color: ${i}">
                <div class="icon-circle">
                    <ha-icon icon="${o}"></ha-icon>
                </div>
                <div class="text">
                    <span class="value">${Math.round(t)}<small>W</small></span>
                    <span class="name">${n}</span>
                </div>
            </div>
        `;
  }
  getCardSize() {
    return 8;
  }
};
H.styles = ct`
        :host { --mdc-icon-size: 24px; }
        ha-card {
            background: #111111; /* Fast schwarz */
            color: #eeeeee;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.05); /* Subtiler Rahmen */
            overflow: hidden;
            font-family: 'Roboto', sans-serif;
        }
        .card-content {
            position: relative;
            height: 340px;
            padding: 0;
        }
        .flow-svg {
            position: absolute;
            top: 0; 
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        .line-bg {
            stroke: #333;
            stroke-width: 2;
            fill: none;
        }

        .nodes-container {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 2;
            pointer-events: none; /* Klicks gehen durch */
        }

        .node-wrapper {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 120px;
        }

        .node {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            pointer-events: auto; /* Interaktiv machen falls nötig */
            opacity: 0.6;
            transition: all 0.5s ease;
        }
        .node[active] {
            opacity: 1;
            transform: scale(1.05);
        }

        .icon-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(30,30,30, 0.8);
            border: 2px solid var(--color);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        .node[active] .icon-circle {
            background: rgba(var(--color), 0.1); 
            box-shadow: 0 0 25px var(--color);
            border-width: 3px;
        }

        ha-icon {
            color: var(--color);
            filter: drop-shadow(0 0 2px var(--color));
        }

        .text {
            text-align: center;
            display: flex;
            flex-direction: column;
        }
        .value {
            font-size: 1.4rem;
            font-weight: 700;
            line-height: 1.2;
            color: #fff;
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        }
        .value small {
            font-size: 0.8rem;
            opacity: 0.7;
            font-weight: 400;
            margin-left: 2px;
        }
        .name {
            font-size: 0.85rem;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 2px;
        }

        .hub {
            width: 20px;
            height: 20px;
            background: #222;
            border-radius: 50%;
            border: 2px solid #444;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .hub-dot {
            width: 6px;
            height: 6px;
            background: #666;
            border-radius: 50%;
        }

        .sub-label {
            font-size: 0.7rem;
            color: #888;
            margin-top: 4px;
            text-transform: uppercase;
        }
    `;
Z([
  K({ attribute: !1 })
], H.prototype, "hass", 2);
Z([
  $t()
], H.prototype, "config", 2);
H = Z([
  gt("flow-openkairo-card")
], H);
export {
  H as FlowOpenKairoCard
};
