# Dependency Centrality Metric

### ID

`dependency-centrality`

### Name

**Dependency Centrality**

### Description

Computes in-degree, out-degree, and degree centrality values for each file in the import dependency graph.

### Output Format (example)

```json
{
  "name": "Dependency Centrality",
  "result": {
    "/path/app.ts": {
      "inDegree": 0,
      "outDegree": 1,
      "inDegreeCentrality": 0,
      "outDegreeCentrality": 1,
      "totalDegreeCentrality": 0.5
    }
  },
  "status": true
}
```

### How it works

1. Depends on `file-coupling`.
2. Builds metrics from each file's `fanIn` and `fanOut`.
3. Uses `N-1` as normalization denominator (`N`: total number of files).
4. Produces:
    - `inDegree`
    - `outDegree`
    - `inDegreeCentrality`
    - `outDegreeCentrality`
    - `totalDegreeCentrality`
