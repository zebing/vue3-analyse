# 介绍

在框架出现之前的年代，我们更新视图的方式是靠 js 获取 dom 节点，然后通过操作 dom 的接口来实现，这种方式既繁琐又不便管理。后来出现了 jQuery 框架，极大的减轻了 dom 操作的工作量，但还是没有解决根本问题。

自从响应式框架出现之后，才改变了这种方式。现在我们基本上不用操作 dom，也不用管数据是怎么渲染到屏幕上的，只需更新组件的 state，就会自动渲染到页面上。这是因为框架的响应式帮我们做了这部分的工作。

先看这个 demo：
```javascript
<template>
  <div @click="changeName">{{state. name}}</div>
</template>

<script setup>
import { reactive } from 'vue'

const state = reactive({
  name: 'name'
})

const changeName = () => {
  state.name = 'new name'
}
</script>
```
在这个例子里面，我们通过调用 reactive 方法生成了一个 state。当我们调用 changeName 方法来更新 `state.name` 属性的时候，视图也跟着更新了。这是因为 reactive 方法里面帮我们做了数据监控，依赖搜集还有派发更新。当数据变化时，自动把变化的内容更新到视图上。
