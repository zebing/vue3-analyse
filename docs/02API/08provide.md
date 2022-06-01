# provide

provide 提供 inject 搭配使用。provide 是 inject 的数据来源。初始化在生命周期 beforeCreate 之后，created 之前。

[传送门](https://github.com/vuejs/core/blob/3538f17a07d586a363cffa00af7cd220aff79710/packages/runtime-core/src/componentOptions.ts#L736)
```javascript
if (provideOptions) {
  const provides = isFunction(provideOptions)
    ? provideOptions.call(publicThis)
    : provideOptions
  Reflect.ownKeys(provides).forEach(key => {
    provide(key, provides[key])
  })
}

export function provide<T>(key: InjectionKey<T> | string | number, value: T) {
  if (!currentInstance) {
    if (__DEV__) {
      warn(`provide() can only be used inside setup().`)
    }
  } else {
    let provides = currentInstance.provides
    // by default an instance inherits its parent's provides object
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.
    const parentProvides =
      currentInstance.parent && currentInstance.parent.provides
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    // TS doesn't allow symbol as index type
    provides[key as string] = value
  }
}
```

如果传入的是函数，就先执行该函数，获取返回的对象。然后先继承父节点的 provides，在遍历传入的值，赋值给 provides。从上往下，逐级继承，供 inject 调用。
