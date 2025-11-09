// Valid FunctionDeclaration
function foo(): string {
    return 'foo';
}

// Valid FunctionExpression
const bar = function (): string {
    return 'bar';
};

// Valid FunctionExpression
const qux = function quxNamed(): string {
    return 'qux';
}

// Valid FunctionExpression
const baz = function (): void {
};

// Valid ArrowFunctionExpression
const add = (a: number, b: number): number => a + b;

// Invalid FunctionDeclaration (no name)
export default function (): string {
    return 'anonymous default';
}

// Invalid FunctionExpression (no name)
(function (): void {
})();

// Invalid ArrowFunctionExpression (no name)
(() => {
})()