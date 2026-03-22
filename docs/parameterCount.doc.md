# Parameter Count Metric

### ID

`parameter-count`

### Name

**Parameter Count**

### Description

Counts declared parameters for each named function in each source file.

### Output Format (example)

```json
{
  "name": "Parameter Count",
  "description": "Counts declared parameters for each named function in each source file",
  "result": {
    "/path/to/file.js": {
      "foo": { "params": 0 },
      "add": { "params": 2 }
    }
  },
  "status": true
}
```

### How it works

1. Depends on `functions-per-file`.
2. For each file, iterates named function nodes from the dependency result.
3. Uses each function node `params` array length to compute parameter count.
4. Produces `{ functionName: { params } }` per file.
5. Removes temporary state and marks completion (`status = true`) in post-processing.
