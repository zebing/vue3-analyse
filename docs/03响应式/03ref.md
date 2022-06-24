# ref
接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个 `.value` 属性，指向该内部值。如果将对象分配为 ref 值，则它将被 reactive 函数处理为深层的响应式对象。

示例：
```typescript
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

## RefImpl
ref 对象没有调用 proxy 进行监控，而是调用了 RefImpl 类创建的实例。

[传送门](https://github.com/vuejs/core/blob/25f7a16a6eccbfa8d857977dcf1f23fb36b830b5/packages/reactivity/src/ref.ts#L97)
```
export function ref(value?: unknown) {
  return createRef(value, false)
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this.__v_isShallow ? newVal : toReactive(newVal)
      triggerRefValue(this, newVal)
    }
  }
}
```

RefImpl 类只有一个支持 get 和 set 方法的 value 属性。
* 在获取 value 值时，会触发 get value 方法，然后在 ref 对象上创建一个 dep 数组，进行依赖搜集。
* 在设置 value 值时，会触发 set value 方法，从而将 dep 中的依赖全部更新
