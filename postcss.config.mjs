import autoprefixer from 'autoprefixer'
import postcssPresetEnv from 'postcss-preset-env'

export default (context) => {
  return {
    plugins: [
      autoprefixer,
      // PostCSS Preset Env targets Stage 2 by default
      // Add browserslist to package.json to change targets
      postcssPresetEnv,
    ],
  }
}
