# Lines Per File Metric

### ID

`lines-per-file`

### Name

**Lines Per File**

### Description

Counts total, non-empty, and blank lines for each analyzed source file.

### Output Format (example)

```json
{
  "name": "Lines Per File",
  "description": "Counts total and non-empty lines for each analyzed source file",
  "result": {
    "/path/to/fileA.js": {
      "total": 31,
      "nonEmpty": 24,
      "blank": 7
    },
    "/path/to/fileB.ts": {
      "total": 34,
      "nonEmpty": 27,
      "blank": 7
    }
  },
  "status": true
}
```

### How it works

1. Depends on `files` to ensure all repository files are part of the metric pipeline.
2. For each file, reads the source content and splits it into physical lines.
3. Counts:
    - `total`: all lines in the file.
    - `nonEmpty`: lines that are not whitespace-only.
    - `blank`: `total - nonEmpty`.
4. Removes temporary state and marks completion (`status = true`) in post-processing.
