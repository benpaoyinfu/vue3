const { build } = require("esbuild");
const { resolve } = require("path");

const target = "reactivity";

const outfile = resolve(
  // 输出的文件
  __dirname,
  `../packages/${target}/dist/${target}.js`
);

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true,
  sourcemap: true,
  platform: "browser",
  watch: {
    // 监控文件变化
    onRebuild(error) {
      if (!error) console.log(`rebuilt~~~~`);
    },
  },
}).then(() => {
  console.log("watching~~~");
});
