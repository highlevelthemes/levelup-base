// Theme default variables are set on :root in defaults.scss
// e.g. --theme-default-primary-color
// Due to mixed browser support for using @property initial values
// when a css value is invalid, this javascript code is needed.
// It sets the theme css variables to the default values if the
// theme variable is invalid.
const themeVariablesDefaults = [
  "theme-primary-color",
  "theme-secondary-color",
  "theme-accent-color",
  "theme-attention-color",
  "theme-text-headline-color",
  "theme-text-content-color",
  "theme-text-link-color",
  "theme-text-dark-bg-color",
  "theme-icon-color",
  "theme-button-primary-text-color",
  "theme-button-primary-bg-color",
  "theme-background-1-color",
  "theme-background-2-color",
  "theme-background-dark-color",
]

const globalVariables = [
  "headlinefont",
  "contentfont",
]

export function setCSSDefaults(): void {
  // Set invalid theme variables to default value
  themeVariablesDefaults.forEach((name) => {
    const themeVar = `--${name}`
    // Check if theme variable is improperly set
    if (
      getComputedStyle(document.documentElement)
        .getPropertyValue(themeVar)
        .trim().length < 2
    ) {
      // Set to default value
      const defaultValue = getComputedStyle(
        document.documentElement
      ).getPropertyValue(`--default-${name}`)
      document.documentElement.style.setProperty(themeVar, defaultValue)
      console.log(`Level Up: ${themeVar} set to default:`, defaultValue)
    }
  })
  // Set global variables if global override is set.
  // e.g. Set --headlinefont to --global-headlinefont if the global is set.
  // Globals act as overrides for GHL or other root variables.
  globalVariables.forEach((name) => {
    const varName = `--global-${name}`
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    // Set the root variable if the global variable is set
    if (value.replace(/["']/g, "").length > 0) {
      document.documentElement.style.setProperty(`--${name}`, value)
      console.log(`Level Up: --${name} set to global value:`, value)
    }
  })
}
