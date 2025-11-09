// Valid FunctionDeclaration
function foo(): string {
    add(1, 2)
    return 'foo';
}

// Valid FunctionExpression
const bar = function (): string {
    foo()
    return 'bar';
};

// Valid FunctionExpression
const qux = function quxNamed(): string {
    bar()
    return 'qux';
};

// Valid FunctionExpression
const baz = function (): string {
    qux()
    return 'baz'
};

// Valid ArrowFunctionExpression
const add = (a: number, b: number): number => {
    baz();
    return a + b
};

// Invalid FunctionDeclaration (no name)
export default function (): string {
    return 'anonymous default';
}

// Invalid FunctionExpression (no name)
(function (): void {
})();

// Invalid ArrowFunctionExpression (no name)
(() => {
})();