# Class Dependency Summary Metric

### ID

`class-dependency-summary`

### Name

**Class Dependency Summary**

### Description

Aggregates fan-in and fan-out dependency totals for each class across all class methods.

### Output Format (example)

```json
{
  "name": "Class Dependency Summary",
  "result": {
    "/path/ExpressedClass.ts": {
      "ExpressedClass": {
        "methods": 2,
        "fanInCalls": 0,
        "fanOutCalls": 4,
        "fanInClasses": 0,
        "fanOutClasses": 1,
        "dependencyScore": 4
      }
    }
  },
  "status": true
}
```

### How it works

1. Depends on `class-coupling`.
2. For each class, iterates method-level `fan-in` and `fan-out` structures.
3. Aggregates call counts and unique classes for incoming and outgoing dependencies.
4. Produces a per-class dependency summary plus a total `dependencyScore`.
