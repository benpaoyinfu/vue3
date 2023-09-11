import { isObject } from "@vue/shared";
import { track } from "./effect";
const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}
const reactiveMap = new WeakMap(); // 缓存列表

function createReactiveObject(target: object, isReadonly: boolean) {
  const mutableHandlers: ProxyHandler<object> = {
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        // 在get中增加标识，当获取IS_REACTIVE时返回true
        return true;
      }
      track(target, 'get', key);  // 依赖收集
      // 等会谁来取值就做依赖收集
      const res = Reflect.get(target, key, receiver);
      return res;
    },
    set(target, key, value, receiver) {
      // 等会赋值的时候可以重新触发effect执行
      const result = Reflect.set(target, key, value, receiver);
      return result;
    },
  };

  const proxy = new Proxy(target, mutableHandlers); // 对对象进行代理
  reactiveMap.set(target, proxy);
  return proxy;
}
// 常用的就是reactive方法
export function reactive(target: object) {
  if (!isObject(target)) {
    return target;
  }

  const exisitingProxy = reactiveMap.get(target); // 如果已经代理过则直接返回代理后的对象
  if (exisitingProxy) {
    return exisitingProxy;
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    // 在创建响应式对象时先进行取值，看是否已经是响应式对象
    return target;
  }

  return createReactiveObject(target, false);
}
