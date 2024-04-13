// https://github.com/thgh/rollup-plugin-serve
// For scss see:
// https://stackoverflow.com/questions/64252283/compile-sass-files-with-rollup
// https://www.npmjs.com/package/rollup-plugin-scss

import serve from "rollup-plugin-serve"
import esbuild from "rollup-plugin-esbuild"
import { default as scssPlugin } from "rollup-plugin-scss"
import replace from "@rollup/plugin-replace"
import { readFileSync } from "node:fs"
import * as sass from "sass"

const DEV_DIR = ".dev"
const esBuildConfig = {
  target: "es6",
}

const serveConfig = {
  open: process.env.OPENPAGE === "true",
  openPage: "/src/index.html",
  verbose: true,
  host: "localhost",
  port: 1235,
  https: {
    key: readFileSync(".certs/private.pem"),
    cert: readFileSync(".certs/primary.crt"),
  },
}

const scss = (config) => {
  return scssPlugin({
    ...{
      // Override below
      fileName: "css/styles.css",
      watch: "src/scss",
      sourceMap: true,
      sourceMapContents: true,
      sass,
      // TODO: add support for postcss
      // See https://github.com/twbs/bootstrap/blob/main/package.json
      // processor: postcss,
    },
    ...config,
  })
}

const scssReplace = replace({
  preventAssignment: false,
  delimiters: ["", ""],
  __theme_version__: JSON.stringify(process.env.npm_package_version),
  __theme_name__: JSON.stringify(process.env.npm_package_name),
  "//__USE_DEV__": `@use "dev";`,
})

export default [
  {
    input: "src/js/all.ts",
    plugins: [
      replace({
        preventAssignment: false,
        __theme_version__: `v${process.env.npm_package_version}`,
        __theme_name__: `[LOCALHOST DEV] Level Up Base Theme`,
        __theme_website__: "https://levelupthemes.com",
      }),
      esbuild(esBuildConfig),
      serve(serveConfig),
    ],
    watch: {
      include: "./src/js/**",
    },
    output: [
      {
        dir: `${DEV_DIR}/js`,
        format: "iife",
        sourcemap: true,
      },
    ],
  },
  {
    input: "src/scss/editor.scss",
    plugins: [
      scssReplace,
      scss({
        fileName: "css/editor.css",
      }),
    ],
    output: [
      {
        dir: DEV_DIR,
      },
    ],
  },
  {
    input: "src/scss/live.scss",
    plugins: [
      scssReplace,
      scss({
        fileName: "css/live.css",
      }),
    ],
    output: [
      {
        dir: DEV_DIR,
      },
    ],
  },
]
