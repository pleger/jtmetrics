// Valid ClassDeclaration
class Calculator {
  foo () {}

  bar = () => {}
  baz = function () {}
  dummy = 1
}

// Valid ClassDeclaration
class AdvancedCalculator extends Calculator {
  foo () {}

  bar = () => {}
  baz = function () {}
  dummy = 1
}

// Valid ClassDeclaration (Using identifier Foo as name of the class)
export default class FooClass {
  foo () {}

  bar = () => {}
  baz = function () {}
  dummy = 1
}

// Valid ClassExpression
const Logger = class {
  foo () {}

  bar = () => {}
  baz = function () {}
  dummy = 1
}

// Valid ClassExpression
const myCollection = {
  Printer: class {
    foo () {}

    bar = () => {}
    baz = function () {}
    dummy = 1
  }
}

// Valid ClassExpression
const object = {
  ['LiteralClassName']: class {
    foo () {}

    bar = () => {}
    baz = function () {}
    dummy = 1
  }
}


// Invalid ClassDeclaration
(() => { class NotCounted {} })()

// Invalid ClassDeclaration
class SuperCalculator extends class {} {}

// Invalid ClassExpression
const SuperCalc = class Hello extends class {} {};

// Invalid ClassExpression
(() => { const Ignore = class IgnoredClass extends class {} {} })()

