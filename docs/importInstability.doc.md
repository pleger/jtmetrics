# Import Instability Metric

### ID

`import-instability`

### Name

**Import Instability**

### Description

Computes afferent and efferent coupling from file imports and derives instability:

\[
I = \frac{Ce}{Ca + Ce}
\]

Where:
- `Ce` (efferent coupling): number of outgoing dependencies (`fanOut`).
- `Ca` (afferent coupling): number of incoming dependencies (`fanIn`).

### Output Format (example)

```json
{
  "name": "Import Instability",
  "result": {
    "/path/app.ts": { "afferent": 0, "efferent": 1, "instability": 1 },
    "/path/utils/index.ts": { "afferent": 1, "efferent": 0, "instability": 0 }
  },
  "status": true
}
```

### How it works

1. Depends on `file-coupling`.
2. For each file, reads `fanIn` and `fanOut`.
3. Computes `instability` as `Ce / (Ca + Ce)` (or `0` when both are `0`).
