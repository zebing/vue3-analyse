# components

components 是组件注册的地方。

## 初始化
components 的初始化非常简单，就是把用户传的 components 选项赋值到组件实例上，供 render 的时候调用。

[传送门](https://github.com/vuejs/core/blob/3538f17a07d586a363cffa00af7cd220aff79710/packages/runtime-core/src/componentOptions.ts#L812)
```typescript
if (components) instance.components = components as any
```
## 调用
### 编译阶段
template
```typescript
<template>
  <div>
    <HelloWorld />
  </div>
</template>
```

编译成 render
```javascript
import { resolveComponent as _resolveComponent, createVNode as _createVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_HelloWorld = _resolveComponent("HelloWorld")

  return (_openBlock(), _createElementBlock("div", null, [
    _createVNode(_component_HelloWorld)
  ]))
}
```

### 执行阶段
执行 render 方法时，首先会调用 resolveComponent 方法从当前组件实例的 components 中拿到 HelloWorld 对象，并调用 createVNode 方法创建 VNode 节点，在 patch 过程中走组件的一系列生命周期。
