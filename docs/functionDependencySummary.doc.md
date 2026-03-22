# Function Dependency Summary Metric

### ID

`function-dependency-summary`

### Name

**Function Dependency Summary**

### Description

Aggregates fan-in and fan-out dependency totals for each named function.

### Output Format (example)

```json
{
  "name": "Function Dependency Summary",
  "result": {
    "/path/functions.js": {
      "foo": {
        "type": "FunctionDeclaration",
        "fanInCalls": 1,
        "fanOutCalls": 2,
        "fanInFunctions": 1,
        "fanOutFunctions": 2,
        "dependencyScore": 3
      }
    }
  },
  "status": true
}
```

### How it works

1. Depends on `function-coupling`.
2. For each function, reads `fan-in` and `fan-out` maps.
3. Computes:
    - total incoming calls (`fanInCalls`)
    - total outgoing calls (`fanOutCalls`)
    - number of unique incoming functions (`fanInFunctions`)
    - number of unique outgoing functions (`fanOutFunctions`)
    - `dependencyScore = fanInCalls + fanOutCalls`
