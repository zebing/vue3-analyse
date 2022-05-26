# data

data 是 Options 组件状态声明的主要方式，该函数返回组件实例的 data 对象，当函数为箭头函数时，不能通过 this 访问组件的实例，但是可以通过该函数的第一个参数访问。

[传送门](https://github.com/vuejs/core/blob/7487d507756e032372d94bb6f362ab7deea747a6/packages/runtime-core/src/componentOptions.ts#L654)
```javascript
if (dataOptions) {
  if (__DEV__ && !isFunction(dataOptions)) {
    warn(
      `The data option must be a function. ` +
        `Plain object usage is no longer supported.`
    )
  }
  const data = dataOptions.call(publicThis, publicThis)
  if (__DEV__ && isPromise(data)) {
    warn(
      `data() returned a Promise - note data() cannot be async; If you ` +
        `intend to perform data fetching before component renders, use ` +
        `async setup() + <Suspense>.`
    )
  }
  if (!isObject(data)) {
    __DEV__ && warn(`data() should return an object.`)
  } else {
    instance.data = reactive(data)
    if (__DEV__) {
      for (const key in data) {
        checkDuplicateProperties!(OptionTypes.DATA, key)
        // expose data on ctx during dev
        if (key[0] !== '$' && key[0] !== '_') {
          Object.defineProperty(ctx, key, {
            configurable: true,
            enumerable: true,
            get: () => data[key],
            set: NOOP
          })
        }
      }
    }
  }
}
```
首先获取组件的 dataOptions 属性，dataOptions 就是我们平时写的 data 函数。然后校验 dataOptions 是否是函数，如果不是函数并且在开发模式下，就提示如下信息：
```javascript
warn(
  `The data option must be a function. ` +
    `Plain object usage is no longer supported.`
)
```
然后通过 call 调用 dataOptions 函数，拿到函数返回的 data 对象。然后校验 data 是否是 Primise 对象，data 不支持 Promise，将会提示以下信息：
```javascript
warn(
      `data() returned a Promise - note data() cannot be async; If you ` +
        `intend to perform data fetching before component renders, use ` +
        `async setup() + <Suspense>.`
    )
```

告诉你可以在 setup 返回 Promise。接下来再校验 data 如果是对象的话，调用 reactive 对 data 进行响应式监控。reactive 的响应式原理将在 [响应式](../03响应式/01reactive.html) 章节详细介绍

