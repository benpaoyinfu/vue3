export let activeEffect = undefined; // 当前正在执行的effect

class ReactiveEffect {
  active = true; // 是否要进行依赖收集
  deps = []; // 收集effect中使用到的属性
  parent = undefined;
  constructor(public fn) {}
  run() {
    if (!this.active) {
      // 不是激活状态
      return this.fn();
    }
    try {
      this.parent = activeEffect; // 当前的effect就是他的父亲
      activeEffect = this; // 设置成正在激活的是当前effect
      return this.fn();
    } finally {
      activeEffect = this.parent; // 执行完毕后还原activeEffect
      this.parent = undefined;
    }
  }
}
export function effect(fn, options?) {
  const _effect = new ReactiveEffect(fn); // 创建响应式effect
  _effect.run(); // 让响应式effect默认执行
}

const targetMap = new WeakMap(); // 记录依赖关系
export function track(target, type, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target); // {对象：map}
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set())); // {对象：{ 属性 :[ dep, dep ]}}
    }
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep); // 让effect记住dep，这样后续可以用于清理
    }
  }
}
