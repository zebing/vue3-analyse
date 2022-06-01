# methods
methods 初始化发生在生命周期 befofeCreate 之后，created 之前。

[传送门](https://github.com/vuejs/core/blob/3cfe5f9fc8b20e096ace2372bfbe58a2f0f0d5ad/packages/runtime-core/src/componentOptions.ts#L625)
```javascript
if (methods) {
  for (const key in methods) {
    const methodHandler = (methods as MethodOptions)[key]
    if (isFunction(methodHandler)) {
      // In dev mode, we use the `createRenderContext` function to define
      // methods to the proxy target, and those are read-only but
      // reconfigurable, so it needs to be redefined here
      if (__DEV__) {
        Object.defineProperty(ctx, key, {
          value: methodHandler.bind(publicThis),
          configurable: true,
          enumerable: true,
          writable: true
        })
      } else {
        ctx[key] = methodHandler.bind(publicThis)
      }
      if (__DEV__) {
        checkDuplicateProperties!(OptionTypes.METHODS, key)
      }
    } else if (__DEV__) {
      warn(
        `Method "${key}" has type "${typeof methodHandler}" in the component definition. ` +
          `Did you reference the function correctly?`
      )
    }
  }
}
```
可以明显看出，methods 的初始化其实非常简单，而且不需要做任何监控。只需要遍历 methods 把所有的函数类型挂到 ctx (this作用域) 下，然后在组件中通过 this 可以访问到即可。
