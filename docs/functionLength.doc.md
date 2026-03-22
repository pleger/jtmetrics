# Function Length Metric

### ID

`function-length`

### Name

**Function Length**

### Description

Counts line spans for named functions in each source file.

### Output Format (example)

```json
{
  "name": "Function Length",
  "description": "Counts line spans for named functions in each source file",
  "result": {
    "/path/to/file.js": {
      "foo": { "lines": 3 },
      "bar": { "lines": 1 }
    }
  },
  "status": true
}
```

### How it works

1. Depends on `functions-per-file` to align with named functions detected by the library.
2. For each file, reparses source text with Babel parser options.
3. Detects:
    - `FunctionDeclaration` with an identifier.
    - `FunctionExpression` assigned to a variable.
    - `ArrowFunctionExpression` assigned to a variable.
4. Computes line span from node source slice boundaries.
5. Produces `{ functionName: { lines } }` per file.
6. Removes temporary state and marks completion (`status = true`) in post-processing.
