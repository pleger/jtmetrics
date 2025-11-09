// Valid FunctionDeclaration
function foo () {
  return 'foo'
}

// Valid FunctionExpression
const bar = function () {
  return 'bar'
}

// Valid FunctionExpression
const qux = function quxNamed () {
  return 'qux'
}

// Valid FunctionExpression
const baz = function () {}

// Valid ArrowFunctionExpression
const add = (a, b) => a + b

// Invalid FunctionDeclaration (no name)
export default function () {
  return 'anonymous default'
}

// Invalid FunctionExpression (no name)
(function () {})()

// Invalid ArrowFunctionExpression (no name)
(() => {})