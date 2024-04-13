import esbuild from "rollup-plugin-esbuild"
import replace from "@rollup/plugin-replace"
import { globSync } from "glob"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { readFileSync } from "node:fs"

const esBuildConfig = {
  target: "es6",
}

const BANNER = readFileSync("./src/banner.css", { encoding: "utf8" })

const getPlugins = (esOpts = {}) => {
  return [
    replace({
      preventAssignment: false,
      __theme_version__: `v${process.env.npm_package_version}`,
      __theme_name__: "Level Up Base Theme",
      __theme_website__: "https://levelupthemes.com",
    }),
    esbuild({ ...esBuildConfig, ...esOpts }),
  ]
}

export default [
  // SINGLE FILE: all.js
  {
    input: "src/js/all.ts",
    plugins: getPlugins(),
    output: [
      {
        dir: "dist/js",
        format: "iife",
        sourcemap: true,
      },
    ],
  },
  {
    input: "src/js/all.ts",
    // Minify
    plugins: getPlugins({ minify: true }),
    output: [
      {
        file: "dist/js/all.min.js",
        format: "iife",
        sourcemap: true,
        banner: BANNER,
      },
    ],
  },

  // COMPONENTS
  // From https://rollupjs.org/configuration-options/#input
  // Don't use output.preserveModules since it may have side effects
  {
    input: Object.fromEntries(
      globSync("src/js/components/**/*.ts").map((file) => [
        // This remove `src/` as well as the file extension from each
        // file, so e.g. src/nested/foo.js becomes nested/foo
        path.relative(
          "src",
          file.slice(0, file.length - path.extname(file).length)
        ),
        // This expands the relative paths to absolute paths, so e.g.
        // src/nested/foo becomes /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url)),
      ])
    ),
    plugins: getPlugins(),
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: true,
        banner: BANNER,
      },
    ],
  },
]
