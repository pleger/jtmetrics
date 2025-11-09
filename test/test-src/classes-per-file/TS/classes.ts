// Valid ClassDeclaration
class Calculator {
    foo(): void {
    }

    bar = (): void => {
    }
    baz = function (): void {
    }
    dummy: number = 1
}

// Valid ClassDeclaration
class AdvancedCalculator extends Calculator {
    foo(): void {
    }

    bar = (): void => {
    }
    baz = function (): void {
    }
    dummy: number = 1
}

// Valid ClassDeclaration (Using identifier Foo as name of the class)
export default class FooClass {
    foo(): void {
    }

    bar = (): void => {
    }
    baz = function (): void {
    }
    dummy: number = 1
}

// Valid ClassExpression
const Logger = class {
    foo(): void {
    }

    bar = (): void => {
    }
    baz = function (): void {
    }
    dummy: number = 1
}

// Valid ClassExpression
const myCollection = {
    Printer: class {
        foo(): void {
        }

        bar = (): void => {
        }
        baz = function (): void {
        }
        dummy: number = 1
    }
}

// Valid ClassExpression
const object = {
    ['LiteralClassName']: class {
        foo(): void {
        }

        bar = (): void => {
        }
        baz = function (): void {
        }
        dummy: number = 1
    }
};

// Invalid ClassDeclaration
(() => {
    class NotCounted {
    }
})()

// Invalid ClassDeclaration
class SuperCalculator extends class {
} {
}

// Invalid ClassExpression
const SuperCalc = class Hello extends class {
} {
};

// Invalid ClassExpression
(() => {
    const Ignore = class IgnoredClass extends class {
    } {
    }
})()
