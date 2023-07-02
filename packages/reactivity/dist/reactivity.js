(() => {
  // packages/shared/src/index.ts
  function isObject(o) {
    return o != null && typeof o === "object";
  }

  // packages/reactivity/src/index.ts
  console.log(isObject({ a: 1 }));
})();
//# sourceMappingURL=reactivity.js.map
