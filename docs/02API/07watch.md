# watch
watch 计算属性主要用在对多个 state 返回一个结果的情况。跟 computed 的区别是，当多个值改变引起一个值改变的时候用 computed，当一个值改变引起多个值改变的时候，用 watch。初始化在生命周期 beforeCreate 之后，created 之前。

[传送门](https://github.com/vuejs/core/blob/3cfe5f9fc8b20e096ace2372bfbe58a2f0f0d5ad/packages/runtime-core/src/componentOptions.ts#L730)
```javascript
if (watchOptions) {
  for (const key in watchOptions) {
    createWatcher(watchOptions[key], ctx, publicThis, key)
  }
}

export function createWatcher(
  raw: ComponentWatchOptionItem,
  ctx: Data,
  publicThis: ComponentPublicInstance,
  key: string
) {
  const getter = key.includes('.')
    ? createPathGetter(publicThis, key)
    : () => (publicThis as any)[key]
  if (isString(raw)) {
    const handler = ctx[raw]
    if (isFunction(handler)) {
      watch(getter, handler as WatchCallback)
    } else if (__DEV__) {
      warn(`Invalid watch handler specified by key "${raw}"`, handler)
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis))
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach(r => createWatcher(r, ctx, publicThis, key))
    } else {
      const handler = isFunction(raw.handler)
        ? raw.handler.bind(publicThis)
        : (ctx[raw.handler] as WatchCallback)
      if (isFunction(handler)) {
        watch(getter, handler, raw)
      } else if (__DEV__) {
        warn(`Invalid watch handler specified by key "${raw.handler}"`, handler)
      }
    }
  } else if (__DEV__) {
    warn(`Invalid watch option: "${key}"`, raw)
  }
}
```
遍历组件 watch 对象，并调用 createWatcher 来初始化。

1. 处理 key 生成 getter。

getter 是一个函数，函数的功能跟 key 的形式有关系。如果是 `a.b.c` 对象形式，则从 ctx 拿到最后一层 c 的值，如 `ctx[a][b][c]`。否则直接从 ctx 拿到 key 的值，如 `ctx[key]`.

2. 处理 raw 并添加响应式。
> watch 会在响应式章节细讲。

* 当 raw 为字符串时，默认该方法在别处定义，比如 methods 中定义。直接从 ctx 上面获取该方法作为 handle，再调用 watch 方法添加响应式。
* 当 raw 为函数时，直接绑定到 ctx 作用域下当作 handle，再调用 watch 方法添加响应式。
* 当 raw 为数组时，调用 createWatcher 来初始化。
* 当 raw 为数组时，将 `raw.handler` 绑定到 ctx 作用域下当作 handle，再调用 watch 方法添加响应式。
