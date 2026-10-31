// Static localisation check: node scripts/check-i18n.mjs
// Verifies key parity, placeholder parity, no corrupted characters, and no untranslated (English) values in hi/mr.
import { readFileSync } from 'node:fs'
const src = readFileSync(new URL('../lib/i18n.tsx', import.meta.url), 'utf8')
const block = (name) => {
  const start = src.indexOf(`const ${name}`); const open = src.indexOf('{', src.indexOf('=', start)); const close = src.indexOf('\n}', open)
  const out = {}; for (const m of src.slice(open + 1, close).matchAll(/^\s+(\w+): ("(?:[^"\\]|\\.)*"),$/gm)) out[m[1]] = JSON.parse(m[2]); return out
}
const en = block('english'), hi = block('hindi'), mr = block('marathi')
const errors = []
const ph = (s) => (s.match(/\{(\w+)\}/g) || []).sort().join()
// values that legitimately stay Latin/identical in every language (brand, units, technical identifiers, initials, numerals)
const SAME_OK = /^(ArthroFlex|BMI|ROM|OA|ESP32|MPU6050|BLE|\d[\d.,/ %k]*|[A-Z]{2}|\/\d+|Camera \/ MediaPipe Pose|\{risk\} · \{score\}\/100)$/
for (const [name, d] of [['hi', hi], ['mr', mr]]) {
  for (const k of Object.keys(en)) {
    if (!(k in d)) { errors.push(`${name}: missing ${k}`); continue }
    if (d[k].includes('�')) errors.push(`${name}.${k}: corrupted character`)
    if (ph(d[k]) !== ph(en[k])) errors.push(`${name}.${k}: placeholder mismatch`)
    if (!/[ऀ-ॿ]/.test(d[k]) && !SAME_OK.test(d[k])) errors.push(`${name}.${k}: no Devanagari text -> "${d[k]}"`)
    if (d[k] === en[k] && !SAME_OK.test(d[k])) errors.push(`${name}.${k}: identical to English`)
  }
  for (const k of Object.keys(d)) if (!(k in en)) errors.push(`${name}: extra key ${k}`)
}
console.log(`${Object.keys(en).length} keys · hi ${Object.keys(hi).length} · mr ${Object.keys(mr).length}`)
console.log(errors.length ? errors.join('\n') : 'i18n check passed'); process.exit(errors.length ? 1 : 0)
