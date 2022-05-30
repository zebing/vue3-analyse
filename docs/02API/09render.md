# render

render 是 vue 组件的渲染函数，一般写 template 模版组件的时候不会用到，但是写 jsx 的时候会用到。不管是 template 还是 jsx 经过编译之后都会生成可执行的 render 函数。执行在生命周期 beforeMount 之后，mounted 之前。

如：
```javascript
<template>
  <div>{{hello}}</div>
</template>
```
编译之后
```javascript
import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, _toDisplayString(_ctx.hello), 1 /* TEXT */))
}
```

## 初始化
[传送门](https://github.com/vuejs/core/blob/3cfe5f9fc8b20e096ace2372bfbe58a2f0f0d5ad/packages/runtime-core/src/componentOptions.ts#L804)
```javascript
if (render && instance.render === NOOP) {
  instance.render = render as InternalRenderFunction
}
```
在 template 编译成 render 之后，会在 applyOptions 方法中将 render 方法挂在组件实例上。供渲染的时候使用。

## 调用
在组件 options 初始化完成之后，会调用 setupRenderEffect 方法开始渲染视图。

[传送门](https://github.com/vuejs/core/blob/3538f17a07d586a363cffa00af7cd220aff79710/packages/runtime-core/src/renderer.ts#L1300)
```javascript
const setupRenderEffect: SetupRenderEffectFn = (
  instance,
  initialVNode,
  container,
  anchor,
  parentSuspense,
  isSVG,
  optimized
) => {
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      let vnodeHook: VNodeHook | null | undefined
      const { el, props } = initialVNode
      const { bm, m, parent } = instance
      const isAsyncWrapperVNode = isAsyncWrapper(initialVNode)

      toggleRecurse(instance, false)
      // beforeMount hook
      if (bm) {
        invokeArrayFns(bm)
      }
      // onVnodeBeforeMount
      if (
        !isAsyncWrapperVNode &&
        (vnodeHook = props && props.onVnodeBeforeMount)
      ) {
        invokeVNodeHook(vnodeHook, parent, initialVNode)
      }
      if (
        __COMPAT__ &&
        isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
      ) {
        instance.emit('hook:beforeMount')
      }
      toggleRecurse(instance, true)

      if (el && hydrateNode) {
        // vnode has adopted host node - perform hydration instead of mount.
        const hydrateSubTree = () => {
          if (__DEV__) {
            startMeasure(instance, `render`)
          }
          instance.subTree = renderComponentRoot(instance)
          if (__DEV__) {
            endMeasure(instance, `render`)
          }
          if (__DEV__) {
            startMeasure(instance, `hydrate`)
          }
          hydrateNode!(
            el as Node,
            instance.subTree,
            instance,
            parentSuspense,
            null
          )
          if (__DEV__) {
            endMeasure(instance, `hydrate`)
          }
        }

        if (isAsyncWrapperVNode) {
          ;(initialVNode.type as ComponentOptions).__asyncLoader!().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !instance.isUnmounted && hydrateSubTree()
          )
        } else {
          hydrateSubTree()
        }
      } else {
        if (__DEV__) {
          startMeasure(instance, `render`)
        }
        const subTree = (instance.subTree = renderComponentRoot(instance))
        if (__DEV__) {
          endMeasure(instance, `render`)
        }
        if (__DEV__) {
          startMeasure(instance, `patch`)
        }
        patch(
          null,
          subTree,
          container,
          anchor,
          instance,
          parentSuspense,
          isSVG
        )
        if (__DEV__) {
          endMeasure(instance, `patch`)
        }
        initialVNode.el = subTree.el
      }
      // mounted hook
      if (m) {
        queuePostRenderEffect(m, parentSuspense)
      }
      // onVnodeMounted
      if (
        !isAsyncWrapperVNode &&
        (vnodeHook = props && props.onVnodeMounted)
      ) {
        const scopedInitialVNode = initialVNode
        queuePostRenderEffect(
          () => invokeVNodeHook(vnodeHook!, parent, scopedInitialVNode),
          parentSuspense
        )
      }
      if (
        __COMPAT__ &&
        isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
      ) {
        queuePostRenderEffect(
          () => instance.emit('hook:mounted'),
          parentSuspense
        )
      }

      // activated hook for keep-alive roots.
      // #1742 activated hook must be accessed after first render
      // since the hook may be injected by a child keep-alive
      if (initialVNode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
        instance.a && queuePostRenderEffect(instance.a, parentSuspense)
        if (
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
        ) {
          queuePostRenderEffect(
            () => instance.emit('hook:activated'),
            parentSuspense
          )
        }
      }
      instance.isMounted = true

      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        devtoolsComponentAdded(instance)
      }

      // #2458: deference mount-only object parameters to prevent memleaks
      initialVNode = container = anchor = null as any
    } else {
      // updateComponent
      // This is triggered by mutation of component's own state (next: null)
      // OR parent calling processComponent (next: VNode)
      let { next, bu, u, parent, vnode } = instance
      let originNext = next
      let vnodeHook: VNodeHook | null | undefined
      if (__DEV__) {
        pushWarningContext(next || instance.vnode)
      }

      // Disallow component effect recursion during pre-lifecycle hooks.
      toggleRecurse(instance, false)
      if (next) {
        next.el = vnode.el
        updateComponentPreRender(instance, next, optimized)
      } else {
        next = vnode
      }

      // beforeUpdate hook
      if (bu) {
        invokeArrayFns(bu)
      }
      // onVnodeBeforeUpdate
      if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
        invokeVNodeHook(vnodeHook, parent, next, vnode)
      }
      if (
        __COMPAT__ &&
        isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
      ) {
        instance.emit('hook:beforeUpdate')
      }
      toggleRecurse(instance, true)

      // render
      if (__DEV__) {
        startMeasure(instance, `render`)
      }
      const nextTree = renderComponentRoot(instance)
      if (__DEV__) {
        endMeasure(instance, `render`)
      }
      const prevTree = instance.subTree
      instance.subTree = nextTree

      if (__DEV__) {
        startMeasure(instance, `patch`)
      }
      patch(
        prevTree,
        nextTree,
        // parent may have changed if it's in a teleport
        hostParentNode(prevTree.el!)!,
        // anchor may have changed if it's in a fragment
        getNextHostNode(prevTree),
        instance,
        parentSuspense,
        isSVG
      )
      if (__DEV__) {
        endMeasure(instance, `patch`)
      }
      next.el = nextTree.el
      if (originNext === null) {
        // self-triggered update. In case of HOC, update parent component
        // vnode el. HOC is indicated by parent instance's subTree pointing
        // to child component's vnode
        updateHOCHostEl(instance, nextTree.el)
      }
      // updated hook
      if (u) {
        queuePostRenderEffect(u, parentSuspense)
      }
      // onVnodeUpdated
      if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
        queuePostRenderEffect(
          () => invokeVNodeHook(vnodeHook!, parent, next!, vnode),
          parentSuspense
        )
      }
      if (
        __COMPAT__ &&
        isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
      ) {
        queuePostRenderEffect(
          () => instance.emit('hook:updated'),
          parentSuspense
        )
      }

      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        devtoolsComponentUpdated(instance)
      }

      if (__DEV__) {
        popWarningContext()
      }
    }
  }

  // create reactive effect for rendering
  const effect = (instance.effect = new ReactiveEffect(
    componentUpdateFn,
    () => queueJob(instance.update),
    instance.scope // track it in component's effect scope
  ))

  const update = (instance.update = effect.run.bind(effect) as SchedulerJob)
  update.id = instance.uid
  // allowRecurse
  // #1801, #2043 component render effects should allow recursive updates
  toggleRecurse(instance, true)

  if (__DEV__) {
    effect.onTrack = instance.rtc
      ? e => invokeArrayFns(instance.rtc!, e)
      : void 0
    effect.onTrigger = instance.rtg
      ? e => invokeArrayFns(instance.rtg!, e)
      : void 0
    // @ts-ignore (for scheduler)
    update.ownerInstance = instance
  }

  update()
}
```

这里会传入回调函数 componentUpdateFn 创建 effect。然后执行 `effect.run` 执行 componentUpdateFn 回调，执行 render 方法，触发依赖搜集，得到一棵 dom 树。如果是初次创建，直接 mount，如果是已经创建过，则 diff。
