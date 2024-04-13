// Update versions in banner.css and globalCode.html

import { readFile, writeFile, copyFile } from "node:fs/promises"

const BANNER_FILE = "./src/banner.css"
const CODE_FILE = "./globalCode.html"
const VERSION_FILE = "./version"
const FILE_OPTS = { encoding: "utf8" }


async function getPackageVersion() {
  if (process.env.npm_package_version) {
    return `v${process.env.npm_package_version}`
  }
  const data = await readFile("./package.json", FILE_OPTS)
  const version = JSON.parse(data).version
  return `v${version}`
}

// Update dist/version
// The file is used for creating tags in `npm run deploy`
async function updateVersionFile(version) {
  await writeFile(VERSION_FILE, version, { encoding: "utf8" })
  console.log("\x1b[33mUpdated %s file: %s\x1b[0m", VERSION_FILE, version)
}

// Update version line in banner.css
async function updateBanner(version) {
  const banner = await readFile(BANNER_FILE, FILE_OPTS)
  if (banner.length < 100) {
    console.error(`Banner file is invalid:`, BANNER_FILE)
    console.error(banner)
    throw "Invalid banner file"
  }
  const new_banner = banner.replace(/Version: v.*/gi, `Version: ${version}`)
  await writeFile(BANNER_FILE, new_banner, FILE_OPTS)
  // Read back the banner file to ensure it's corrrect
  return await readFile(BANNER_FILE, FILE_OPTS)
}

// Update import versions in globalCode.html
async function updateCode(version) {
  console.log('updating code: version:', version)
  const ver = version.substr(0, 4)
  console.log('ver:', ver)
  const code = await readFile(CODE_FILE, FILE_OPTS)
  const new_code = code.replace(/@v\d\.\d[^\/]*/gi, `@${ver}`)
  await writeFile(CODE_FILE, new_code, FILE_OPTS)
}

const version = await getPackageVersion()
await updateVersionFile(version)
await updateCode(version)
const banner = await updateBanner(version)

console.log("\x1b[32mBanner updated.\x1b[33m \n", banner)
console.log("\x1b[0mVersion:", version)
