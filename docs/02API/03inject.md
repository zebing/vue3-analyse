# inject

inject 也是用的比较多的属性之一，它主要是为了解决 props 需要逐级传递参数的繁琐。初始化在生命周期 beforeCreate 之后，created 之前。

[传送门](https://github.com/vuejs/core/blob/3538f17a07d586a363cffa00af7cd220aff79710/packages/runtime-core/src/componentOptions.ts#L616)
```javascript
if (injectOptions) {
  resolveInjections(
    injectOptions,
    ctx,
    checkDuplicateProperties,
    instance.appContext.config.unwrapInjectedRef
  )
}
```
调用 resolveInjections 方法进行初始化。

[传送门](https://github.com/vuejs/core/blob/3538f17a07d586a363cffa00af7cd220aff79710/packages/runtime-core/src/componentOptions.ts#L823)
```javascript
export function resolveInjections(
  injectOptions: ComponentInjectOptions,
  ctx: any,
  checkDuplicateProperties = NOOP as any,
  unwrapRef = false
) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions)!
  }
  for (const key in injectOptions) {
    const opt = (injectOptions as ObjectInjectOptions)[key]
    let injected: unknown
    if (isObject(opt)) {
      if ('default' in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true /* treat default function as factory */
        )
      } else {
        injected = inject(opt.from || key)
      }
    } else {
      injected = inject(opt)
    }
    if (isRef(injected)) {
      // TODO remove the check in 3.3
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => (injected as Ref).value,
          set: v => ((injected as Ref).value = v)
        })
      } else {
        if (__DEV__) {
          warn(
            `injected property "${key}" is a ref and will be auto-unwrapped ` +
              `and no longer needs \`.value\` in the next minor release. ` +
              `To opt-in to the new behavior now, ` +
              `set \`app.config.unwrapInjectedRef = true\` (this config is ` +
              `temporary and will not be needed in the future.)`
          )
        }
        ctx[key] = injected
      }
    } else {
      ctx[key] = injected
    }
    if (__DEV__) {
      checkDuplicateProperties!(OptionTypes.INJECT, key)
    }
  }
}
```
如果传递的是数组，就调用 normalizeInject 方法格式化成对象模式，然后遍历。如下：
```javascript
// inject
inject: ['key1', 'key2', ...]

// normalize
inject: {
  key1: 'key1',
  key2: 'key2',
  ...
}
```
调用 [inject](https://github.com/vuejs/core/blob/3538f17a07d586a363cffa00af7cd220aff79710/packages/runtime-core/src/apiInject.ts#L41) 方法获取每个 key 对应的值
1. 非 root 节点从 `parent.provides` 返回。
2. root 节点从 `appContext.provides` 返回。

如果值为空，则返回用户提供的默认值。
