// Valid FunctionDeclaration
function foo () {
  add(1, 2)
  return 'foo'
}

// Valid FunctionExpression
const bar = function () {
  foo()
  return 'bar'
}

// Valid FunctionExpression
const qux = function quxNamed () {
  bar()
  return 'qux'
}

// Valid FunctionExpression
const baz = function () {
  qux()
  return 'baz'
}

// Valid ArrowFunctionExpression
const add = (a, b) => {
  baz()
  return a + b
}

// Invalid FunctionDeclaration (no name)
export default function () {
  return 'anonymous default'
}

// Invalid FunctionExpression (no name)
(function () {})()

// Invalid ArrowFunctionExpression (no name)
(() => {})