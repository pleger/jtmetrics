import { createRequire } from "node:module"
import { c } from './subdir/subsubdir/fileC.js'

const require = createRequire(import.meta.url)
const b = require('./subdir/fileB.cjs')

console.log(b)
console.log(c)
