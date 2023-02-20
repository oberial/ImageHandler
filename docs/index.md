#虚拟 dom 树
虚拟 dom 就是根据 h 函数生成的节点构成的树
vue 会根据虚拟 dom 生成真实的 dom

当响应式数据受影响后会重新受影响的组件的虚拟 dom，
后面 vue 会比对新旧 dom 根据算法可能会替换整个节点或者调整节点顺序
最后会把更新后的 dom 生成真实 dom
有一些优化
没有响应式的节点，或保存起来 比对时直接跳过或直接使用

有响应式的节点
vue 会针对包含这些节点的父节点做个记录，数据更新时直接更新记录中的节点。
还有批量更新机制。

#vue3-vue2 区别
vue3 挂载全局对象的方式
使用 app.config.globalProperties 可挂载一个全局对象
使用 provide 和 inject