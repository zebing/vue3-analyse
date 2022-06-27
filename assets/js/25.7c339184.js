(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{446:function(a,e,t){"use strict";t.r(e);var n=t(62),s=Object(n.a)({},(function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"ref"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ref"}},[a._v("#")]),a._v(" ref")]),a._v(" "),t("p",[a._v("接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个 "),t("code",[a._v(".value")]),a._v(" 属性，指向该内部值。如果将对象分配为 ref 值，则它将被 reactive 函数处理为深层的响应式对象。")]),a._v(" "),t("p",[a._v("示例：")]),a._v(" "),t("div",{staticClass:"language-typescript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-typescript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("const")]),a._v(" count "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("ref")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token builtin"}},[a._v("console")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("log")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("count"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("value"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 0")]),a._v("\n\ncount"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("value"),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("++")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token builtin"}},[a._v("console")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("log")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("count"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("value"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 1")]),a._v("\n")])])]),t("h2",{attrs:{id:"refimpl"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#refimpl"}},[a._v("#")]),a._v(" RefImpl")]),a._v(" "),t("p",[a._v("ref 对象没有调用 proxy 进行监控，而是调用了 RefImpl 类创建的实例。")]),a._v(" "),t("p",[t("a",{attrs:{href:"https://github.com/vuejs/core/blob/25f7a16a6eccbfa8d857977dcf1f23fb36b830b5/packages/reactivity/src/ref.ts#L97",target:"_blank",rel:"noopener noreferrer"}},[a._v("传送门"),t("OutboundLink")],1)]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("export function ref(value?: unknown) {\n  return createRef(value, false)\n}\n\nfunction createRef(rawValue: unknown, shallow: boolean) {\n  if (isRef(rawValue)) {\n    return rawValue\n  }\n  return new RefImpl(rawValue, shallow)\n}\n\nclass RefImpl<T> {\n  private _value: T\n  private _rawValue: T\n\n  public dep?: Dep = undefined\n  public readonly __v_isRef = true\n\n  constructor(value: T, public readonly __v_isShallow: boolean) {\n    this._rawValue = __v_isShallow ? value : toRaw(value)\n    this._value = __v_isShallow ? value : toReactive(value)\n  }\n\n  get value() {\n    trackRefValue(this)\n    return this._value\n  }\n\n  set value(newVal) {\n    newVal = this.__v_isShallow ? newVal : toRaw(newVal)\n    if (hasChanged(newVal, this._rawValue)) {\n      this._rawValue = newVal\n      this._value = this.__v_isShallow ? newVal : toReactive(newVal)\n      triggerRefValue(this, newVal)\n    }\n  }\n}\n")])])]),t("p",[a._v("RefImpl 类只有一个支持 get 和 set 方法的 value 属性。")]),a._v(" "),t("ul",[t("li",[a._v("在获取 value 值时，会触发 get value 方法，然后在 ref 对象上创建一个 dep 数组，进行依赖搜集。")]),a._v(" "),t("li",[a._v("在设置 value 值时，会触发 set value 方法，从而将 dep 中的依赖全部更新")])])])}),[],!1,null,null,null);e.default=s.exports}}]);