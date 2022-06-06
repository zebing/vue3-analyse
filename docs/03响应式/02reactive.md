# reactive
在组件初始化时，会调用 reactive 方法对 data 进行监控，或者在 setup 中，用户主动调用 reactive 方法初始化组件状态。

## 数据监控
[传送门](https://github.com/vuejs/core/blob/0cf9ae62be21a6180f909e03091f087254ae3e52/packages/reactivity/src/reactive.ts#L89)
```typescript
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}
```

在调用 reactive 时，会先判断 target 是否为只读属性，如果是，就直接返回 target。否则调用 createReactiveObject 创建响应式对象并返回。

[传送门](https://github.com/vuejs/core/blob/0cf9ae62be21a6180f909e03091f087254ae3e52/packages/reactivity/src/reactive.ts#L181)
```typescript
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // target already has corresponding Proxy
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // only a whitelist of value types can be observed.
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```
在 createReactiveObject 方法中，主要调用 Proxy 对 target 进行代理监控，会传入 baseHandlers 对象。

## 依赖搜集
在组件初始化完成之后，接下来会进行视图的渲染，渲染过程中会获取data信息，由于 data 已经被添加 Proxy 代理，当我们访问这个对象属性的时候，就会触发 baseHandlers 对象的 get 方法，继而触发依赖搜集。
