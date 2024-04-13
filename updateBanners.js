import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import {glob} from "glob"

const FILE_OPTS = { encoding: "utf8" }
const FILES_GLOB = "dist/css/*.min.css"
const BANNER_FILE = "./src/banner.css"

const banner = await readFile(BANNER_FILE, FILE_OPTS)

async function addBannerToFile(filePath) {
  const content = await readFile(filePath, FILE_OPTS)
  // Trim file contents to remove BOM characters
  await writeFile(filePath, `${banner.trim()}\n${content.trim()}\n`)
  console.log(`Banner added to ${filePath}`)
}

async function addBannerToFiles() {
  const files = await glob(FILES_GLOB)
  for (const file of files) {
    await addBannerToFile(file)
  }
}

addBannerToFiles()
