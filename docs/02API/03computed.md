# computed

computed 计算属性主要用在对多个 state 返回一个结果的情况。跟 watch 的区别是，当多个值改变引起一个值改变的时候用 computed，当一个值改变引起多个值改变的时候，用 watch。

[传送门](https://github.com/vuejs/core/blob/3cfe5f9fc8b20e096ace2372bfbe58a2f0f0d5ad/packages/runtime-core/src/componentOptions.ts#L693)
```javascript
if (computedOptions) {
  for (const key in computedOptions) {
    const opt = (computedOptions as ComputedOptions)[key]
    const get = isFunction(opt)
      ? opt.bind(publicThis, publicThis)
      : isFunction(opt.get)
      ? opt.get.bind(publicThis, publicThis)
      : NOOP
    if (__DEV__ && get === NOOP) {
      warn(`Computed property "${key}" has no getter.`)
    }
    const set =
      !isFunction(opt) && isFunction(opt.set)
        ? opt.set.bind(publicThis)
        : __DEV__
        ? () => {
            warn(
              `Write operation failed: computed property "${key}" is readonly.`
            )
          }
        : NOOP
    const c = computed({
      get,
      set
    })
    Object.defineProperty(ctx, key, {
      enumerable: true,
      configurable: true,
      get: () => c.value,
      set: v => (c.value = v)
    })
    if (__DEV__) {
      checkDuplicateProperties!(OptionTypes.COMPUTED, key)
    }
  }
}
```

通过便利 computedOptions （组件中的 computed）对象，对每个属性就行处理。主要有两种情况，一种是函数，一种是 `{ get: Function, set: Function }` 格式的对象。
1. **函数** 将函数直接绑定当前实例响应式对象，并赋值给 get 方法.
2. **对象** 首先判断对象的 get 和 set 方法是否存在，如果存在，绑定到当前实例响应式对象作用域下。

接下来调用 computed 方法进行响应式监控并返回对象 c。
最后调用 Object.defineProperty 方法把当前 key 绑定到 ctx （当前组件 this 作用域）下。

> computed 方法细节会在响应式章节详细介绍。
