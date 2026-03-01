/**
 * generate-pwa-icons.js
 * Run this script once to create the required PWA icon sizes.
 * 
 * Prerequisites:  npm install -g sharp-cli
 * Usage:          node generate-pwa-icons.js
 * 
 * It takes the SVG at public/vite.svg and creates PNG icons for all needed sizes.
 */

import sharp from 'sharp'
import fs    from 'fs'
import path  from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT    = path.join(__dirname, 'frontend', 'public', 'icons')

fs.mkdirSync(OUTPUT, { recursive: true })

// A simple orange circle with a white fork icon — inline SVG for the PWA icon
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#e8622a"/>
  <text x="256" y="320" font-size="240" text-anchor="middle" fill="white" font-family="sans-serif">🍱</text>
</svg>`

const SIZES = [72, 96, 128, 192, 512]

for (const size of SIZES) {
  await sharp(Buffer.from(ICON_SVG))
    .resize(size, size)
    .png()
    .toFile(path.join(OUTPUT, `icon-${size}.png`))
  console.log(`✅ Generated icon-${size}.png`)
}

console.log('\n✅ All PWA icons generated in frontend/public/icons/')
