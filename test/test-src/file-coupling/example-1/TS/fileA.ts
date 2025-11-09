import { c } from "./subdir/subsubdir/fileC"

import { createRequire } from "node:module"
// @ts-ignore
const require: Required<any> = createRequire(import.meta.url)
import b = require("./subdir/fileB")

console.log(b)
console.log(c)