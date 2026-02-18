/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, F = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, W = Symbol(), X = /* @__PURE__ */ new WeakMap();
let lt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== W) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = X.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && X.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const _t = (r) => new lt(typeof r == "string" ? r : r + "", void 0, W), ct = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new lt(e, r, W);
}, mt = (r, t) => {
  if (F) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = D.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, Y = F ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return _t(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yt, defineProperty: vt, getOwnPropertyDescriptor: bt, getOwnPropertyNames: At, getOwnPropertySymbols: wt, getPrototypeOf: Ct } = Object, $ = globalThis, Q = $.trustedTypes, Et = Q ? Q.emptyScript : "", I = $.reactiveElementPolyfillSupport, S = (r, t) => r, R = { toAttribute(r, t) {
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
} }, G = (r, t) => !yt(r, t), tt = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: G };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && vt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = bt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const h = i == null ? void 0 : i.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const e = this.properties, s = [...At(e), ...wt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(Y(i));
    } else t !== void 0 && e.push(Y(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return mt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : R).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const h = s.getPropertyOptions(i), a = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((n = h.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? h.converter : R;
      this._$Em = i;
      const c = a.fromAttribute(e, h.type);
      this[i] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, n) {
    var o;
    if (t !== void 0) {
      const h = this.constructor;
      if (i === !1 && (n = this[t]), s ?? (s = h.getPropertyOptions(t)), !((s.hasChanged ?? G)(n, e) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(h._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: h } = o, a = this[n];
        h !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
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
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[S("elementProperties")] = /* @__PURE__ */ new Map(), b[S("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: b }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, et = (r) => r, j = P.trustedTypes, st = j ? j.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, dt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, pt = "?" + g, xt = `<${pt}>`, v = document, O = () => v.createComment(""), M = (r) => r === null || typeof r != "object" && typeof r != "function", q = Array.isArray, St = (r) => q(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", B = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, rt = />/g, _ = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, nt = /"/g, ut = /^(?:script|style|textarea|title)$/i, Pt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), x = Pt(1), w = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), m = v.createTreeWalker(v, 129);
function ft(r, t) {
  if (!q(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Ot = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
  for (let h = 0; h < e; h++) {
    const a = r[h];
    let c, p, d = -1, u = 0;
    for (; u < a.length && (o.lastIndex = u, p = o.exec(a), p !== null); ) u = o.lastIndex, o === E ? p[1] === "!--" ? o = it : p[1] !== void 0 ? o = rt : p[2] !== void 0 ? (ut.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = _) : p[3] !== void 0 && (o = _) : o === _ ? p[0] === ">" ? (o = i ?? E, d = -1) : p[1] === void 0 ? d = -2 : (d = o.lastIndex - p[2].length, c = p[1], o = p[3] === void 0 ? _ : p[3] === '"' ? nt : ot) : o === nt || o === ot ? o = _ : o === it || o === rt ? o = E : (o = _, i = void 0);
    const f = o === _ && r[h + 1].startsWith("/>") ? " " : "";
    n += o === E ? a + xt : d >= 0 ? (s.push(c), a.slice(0, d) + dt + a.slice(d) + g + f) : a + g + (d === -2 ? h : f);
  }
  return [ft(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class U {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const h = t.length - 1, a = this.parts, [c, p] = Ot(t, e);
    if (this.el = U.createElement(c, s), m.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = m.nextNode()) !== null && a.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(dt)) {
          const u = p[o++], f = i.getAttribute(d).split(g), T = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: n, name: T[2], strings: f, ctor: T[1] === "." ? Ut : T[1] === "?" ? Ht : T[1] === "@" ? Nt : z }), i.removeAttribute(d);
        } else d.startsWith(g) && (a.push({ type: 6, index: n }), i.removeAttribute(d));
        if (ut.test(i.tagName)) {
          const d = i.textContent.split(g), u = d.length - 1;
          if (u > 0) {
            i.textContent = j ? j.emptyScript : "";
            for (let f = 0; f < u; f++) i.append(d[f], O()), m.nextNode(), a.push({ type: 2, index: ++n });
            i.append(d[u], O());
          }
        }
      } else if (i.nodeType === 8) if (i.data === pt) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(g, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += g.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function C(r, t, e = r, s) {
  var o, h;
  if (t === w) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = M(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((h = i == null ? void 0 : i._$AO) == null || h.call(i, !1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = C(r, i._$AS(r, t.values), i, s)), t;
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
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? v).importNode(e, !0);
    m.currentNode = i;
    let n = m.nextNode(), o = 0, h = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new k(n, n.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (c = new kt(n, this, t)), this._$AV.push(c), a = s[++h];
      }
      o !== (a == null ? void 0 : a.index) && (n = m.nextNode(), o++);
    }
    return m.currentNode = v, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class k {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    t = C(this, t, e), M(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = U.createElement(ft(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const o = new Mt(i, this), h = o.u(this.options);
      o.p(e), this.T(h), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new k(this.O(O()), this.O(O()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = et(t).nextSibling;
      et(t).remove(), t = i;
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
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = C(this, t, e, 0), o = !M(t) || t !== this._$AH && t !== w, o && (this._$AH = t);
    else {
      const h = t;
      let a, c;
      for (t = n[0], a = 0; a < n.length - 1; a++) c = C(this, h[s + a], e, a), c === w && (c = this._$AH[a]), o || (o = !M(c) || c !== this._$AH[a]), c === l ? t = l : t !== l && (t += (c ?? "") + n[a + 1]), this._$AH[a] = c;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ut extends z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Ht extends z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Nt extends z {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? l) === w) return;
    const s = this._$AH, i = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== l && (s === l || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class kt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const L = P.litHtmlPolyfillSupport;
L == null || L(U, k), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.2");
const Tt = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new k(t.insertBefore(O(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = globalThis;
class A extends b {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Tt(e, this.renderRoot, this.renderOptions);
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
    return w;
  }
}
var ht;
A._$litElement$ = !0, A.finalized = !0, (ht = y.litElementHydrateSupport) == null || ht.call(y, { LitElement: A });
const V = y.litElementPolyfillSupport;
V == null || V({ LitElement: A });
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
const Dt = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: G }, Rt = (r = Dt, t, e) => {
  const { kind: s, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(e.name, r), s === "accessor") {
    const { name: o } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(o, a, r, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, r, h), h;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(h) {
      const a = this[o];
      t.call(this, h), this.requestUpdate(o, a, r, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function K(r) {
  return (t, e) => typeof e == "object" ? Rt(r, t, e) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
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
var jt = Object.defineProperty, zt = Object.getOwnPropertyDescriptor, Z = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? zt(t, e) : t, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = (s ? o(t, e, i) : o(i)) || i);
  return s && i && jt(t, e, i), i;
};
let H = class extends A {
  setConfig(r) {
    this._config = r;
  }
  _getEntity(r) {
    const t = this._config[r];
    return t ? typeof t == "string" ? t : t.entity || "" : "";
  }
  _entityChanged(r, t) {
    if (!this._config || !this.hass)
      return;
    const e = r.detail.value, s = this._config[t];
    let i;
    typeof s == "object" && s !== null ? i = { ...s, entity: e } : i = { entity: e };
    const n = {
      ...this._config,
      [t]: i
    };
    this._FireConfigChanged(n);
  }
  _toggleChanged(r, t) {
    if (!this._config || !this.hass) return;
    const s = r.target.checked;
    if (this._config[t] === s) return;
    const i = {
      ...this._config,
      [t]: s
    };
    this._FireConfigChanged(i);
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
    return !this.hass || !this._config ? l : x`
            <div class="card-config">
                <h3>Entities</h3>
                
                <div class="option">
                    <ha-entity-picker
                        label="Solar Grid/Power (W)"
                        .hass=${this.hass}
                        .value=${this._getEntity("solar")}
                        @value-changed=${(r) => this._entityChanged(r, "solar")}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <div class="option">
                    <ha-entity-picker
                        label="Battery Power (W)"
                        .hass=${this.hass}
                        .value=${this._getEntity("battery")}
                        @value-changed=${(r) => this._entityChanged(r, "battery")}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <div class="option">
                    <ha-entity-picker
                        label="Grid Power (W)"
                        .hass=${this.hass}
                        .value=${this._getEntity("grid")}
                        @value-changed=${(r) => this._entityChanged(r, "grid")}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <div class="option">
                    <ha-entity-picker
                        label="Home Consumption (W)"
                        .hass=${this.hass}
                        .value=${this._getEntity("home")}
                        @value-changed=${(r) => this._entityChanged(r, "home")}
                        allow-custom-entity
                    ></ha-entity-picker>
                </div>

                <h3>Options</h3>
                <div class="row">
                    <ha-switch
                        .checked=${this._config.invert_battery !== !1}
                        @change=${(r) => this._toggleChanged(r, "invert_battery")}
                    ></ha-switch>
                    <span>Invert Battery Logic (Standard: +Charge/-Discharge)</span>
                </div>
                <div class="row">
                    <ha-switch
                        .checked=${this._config.invert_grid !== !1}
                        @change=${(r) => this._toggleChanged(r, "invert_grid")}
                    ></ha-switch>
                    <span>Invert Grid Logic (Standard: +Import/-Export)</span>
                </div>
            </div>
        `;
  }
};
H.styles = ct`
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
], H.prototype, "hass", 2);
Z([
  $t()
], H.prototype, "_config", 2);
H = Z([
  gt("flow-openkairo-card-editor")
], H);
var It = Object.defineProperty, Bt = Object.getOwnPropertyDescriptor, J = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Bt(t, e) : t, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = (s ? o(t, e, i) : o(i)) || i);
  return s && i && It(t, e, i), i;
};
let N = class extends A {
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
  getEntityId(r) {
    if (r)
      return typeof r == "string" ? r : r.entity;
  }
  // Get numeric value from entity
  getValue(r) {
    const t = this.getEntityId(r);
    if (!t || !this.hass.states[t]) return 0;
    const e = parseFloat(this.hass.states[t].state);
    return isNaN(e) ? 0 : e;
  }
  // Calculate flow duration (speed) based on power
  // Higher power = faster animation (lower duration)
  getAnimationDuration(r) {
    if (r <= 0) return 0;
    const t = 0.5, e = 5, i = Math.min(r / 5e3, 1);
    return e - i * (e - t);
  }
  render() {
    if (!this.config || !this.hass) return l;
    const r = this.getValue(this.config.solar);
    let t = this.getValue(this.config.battery);
    this.config.invert_battery && (t *= -1);
    let e = this.getValue(this.config.grid);
    this.config.invert_grid && (e *= -1);
    const s = this.getValue(this.config.home), i = r > 10, n = t > 10, o = t < -10, h = Math.abs(t), a = e > 10, c = e < -10, p = Math.abs(e);
    return x`
      <ha-card>
        <div class="card-content">
          <div class="flow-container">
            
            <!-- Nodes -->
            ${this.renderNode("solar", r, this.config.solar)}
            ${this.renderNode("battery", h, this.config.battery)}
            ${this.renderNode("grid", p, this.config.grid)}
            ${this.renderNode("home", s, this.config.home)}

            <!-- SVG Flows -->
            <svg class="flow-lines" viewBox="0 0 400 300">
               <defs>
                 <linearGradient id="grad-solar" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100%">
                   <stop offset="0%" style="stop-color:${this.getColor(this.config.solar, this.defaults.solar.color)}" />
                   <stop offset="100%" style="stop-color:${this.getColor(this.config.home, this.defaults.home.color)}" />
                 </linearGradient>
               </defs>

               <!-- Solar -> Home (Direct) -->
               ${i ? this.renderFlow(200, 60, 200, 240, r, this.getColor(this.config.solar, this.defaults.solar.color)) : l}

               <!-- Solar -> Battery (Charging) -->
               ${n ? this.renderFlow(200, 60, 80, 150, h, this.getColor(this.config.solar, this.defaults.solar.color)) : l}

               <!-- Battery -> Home (Discharging) -->
               ${o ? this.renderFlow(80, 150, 200, 240, h, this.getColor(this.config.battery, this.defaults.battery.color)) : l}
               
               <!-- Grid -> Home (Import) -->
               ${a ? this.renderFlow(320, 150, 200, 240, p, this.getColor(this.config.grid, this.defaults.grid.color)) : l}

               <!-- Solar -> Grid (Export) - Complex path? Or simple? -->
               ${c && i ? this.renderFlow(200, 60, 320, 150, p, this.getColor(this.config.solar, this.defaults.solar.color)) : l}
            </svg>
          </div>
        </div>
      </ha-card>
    `;
  }
  getColor(r, t) {
    return !r || typeof r == "string" ? t : r.color || t;
  }
  renderNode(r, t, e) {
    const s = this.defaults[r], i = e && typeof e != "string", n = (i ? e.color : void 0) || s.color, o = (i ? e.icon : void 0) || s.icon, h = (i ? e.name : void 0) || s.name, a = t > 5;
    return x`
      <div class="node ${r}" ?active=${a} style="--node-color: ${n}">
        <ha-icon icon="${o}"></ha-icon>
        <div class="info">
          <span class="value">${Math.round(t)} W</span>
          <span class="label">${h}</span>
        </div>
      </div>
    `;
  }
  // Renders a curved line with animated dots
  renderFlow(r, t, e, s, i, n) {
    const o = this.getAnimationDuration(i), h = `path-${r}-${t}-${e}-${s}`, a = n || "#fff", c = `M${r},${t} L${e},${s}`;
    return x`
      <path id="${h}" class="flow-path" d="${c}" stroke="${a}" stroke-opacity="0.3" stroke-width="2" fill="none" />
      <circle r="4" fill="${a}">
        <animateMotion dur="${o}s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#${h}" />
        </animateMotion>
      </circle>
      <!-- Optional: Second dot for heavy flow -->
      ${i > 1e3 ? x`
        <circle r="3" fill="${a}">
          <animateMotion dur="${o}s" begin="${o / 2}s" repeatCount="indefinite" calcMode="linear">
            <mpath href="#${h}" />
          </animateMotion>
        </circle>
      ` : l}
    `;
  }
  // Card Layout Config
  getCardSize() {
    return 6;
  }
};
N.styles = ct`
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
], N.prototype, "hass", 2);
J([
  $t()
], N.prototype, "config", 2);
N = J([
  gt("flow-openkairo-card")
], N);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "flow-openkairo-card",
  name: "Flow OpenKairo Card",
  preview: !0,
  description: "Custom SolarFlow visualization"
});
export {
  N as FlowOpenKairoCard
};
