# JTMetrics Architecture

This document describes how JTMetrics loads, executes, and returns metric results.

The project is implemented mostly with modules and plain objects rather than a deep class hierarchy. Because of that, the diagrams below are conceptual: they model the main runtime collaborators and the plugin contract used by the engine.

## Overview

JTMetrics follows a staged analysis pipeline:

1. Discover source files.
2. Parse source files into ASTs.
3. Discover and import metric plugins.
4. Order metrics by dependency.
5. Execute each metric over the AST set.
6. Run metric post-processing.
7. Build the final output with metric results and accumulated errors.

At the center of the design is a lightweight plugin model:

- A metric is a module that exports `state`, `visitors`, and optionally `postProcessing`.
- Metrics may depend on results from other metrics through `state.dependencies`.
- The engine resolves those dependencies before executing each metric.

## Main Runtime Elements

- `calculateMetrics`: Public entry point and orchestration facade.
- `FileReader`: Recursively discovers supported source files and applies ignore rules.
- `ASTProcessor`: Parses source files with Babel and annotates ASTs with file metadata.
- `MetricsLoader`: Discovers metric files, dynamically imports them, and validates the plugin contract.
- `MetricsExecutor`: Sorts metrics, injects dependencies, traverses ASTs, runs post-processing, and builds the final result.
- `KahnSort`: Produces a topological execution order based on metric dependencies.
- `resultMap`: Internal registry of intermediate metric results keyed by metric id.
- `logger`: Shared singleton used to accumulate file, parse, metric, and traversal errors.

## Metric Plugin Contract

Each metric behaves like a plugin with this structural contract:

```js
export const state = {
  id: 'metric-id',
  name: 'Metric Name',
  description: 'What the metric computes',
  result: {},
  dependencies: ['other-metric-id'],
  status: false
}

export const visitors = {
  Program(path, state) {
    // collect data
  }
}

export function postProcessing(state) {
  state.status = true
}
```

This is not enforced through classes or interfaces at runtime. Instead, it is validated when the metric module is imported.

## Object Collaboration Diagram

```mermaid
flowchart LR
    U["User"]
    F["calculateMetrics(options)"]
    FR["FileReader"]
    AP["ASTProcessor"]
    ML["MetricsLoader"]
    EX["MetricsExecutor"]
    KS["KahnSort"]
    RM["resultMap"]
    LG["logger"]
    M1["MetricPlugin: files"]
    M2["MetricPlugin: functions-per-file"]
    M3["MetricPlugin: function-coupling"]
    M4["MetricPlugin: class-coupling"]

    U -->|"1. requests analysis"| F
    F -->|"2. getFiles(codePath, ignore)"| FR
    F -->|"3. constructASTs(files)"| AP
    F -->|"4. loadMetricFiles(...)"| ML
    ML -->|"5. import/validate"| M1
    ML -->|"5. import/validate"| M2
    ML -->|"5. import/validate"| M3
    ML -->|"5. import/validate"| M4

    F -->|"6. executeMetrics(metricObjects, ASTs)"| EX
    EX -->|"7. order by dependencies"| KS
    KS -->|"8. sortedMetrics"| EX

    EX -->|"9. resolve dependencies"| RM
    EX -->|"10. traverse ASTs with visitors"| M1
    EX -->|"10. traverse ASTs with visitors"| M2
    EX -->|"10. traverse ASTs with visitors"| M3
    EX -->|"10. traverse ASTs with visitors"| M4

    M1 -->|"11. writes result"| RM
    M2 -->|"11. writes result"| RM
    M3 -->|"11. writes result"| RM
    M4 -->|"11. writes result"| RM

    EX -->|"12. log errors"| LG
    EX -->|"13. buildFinalResult()"| F
    F -->|"14. returns results + errors"| U
```

## Sequence Diagram: Loading and Preparation

```mermaid
sequenceDiagram
    actor U as User
    participant F as calculateMetrics
    participant FR as FileReader
    participant AP as ASTProcessor
    participant ML as MetricsLoader

    U->>F: calculateMetrics(options)
    F->>FR: getFiles(codePath, metricsIgnoreFilePath)
    FR-->>F: codeFiles

    F->>AP: constructASTs(codeFiles)
    AP-->>F: ASTs

    F->>ML: loadMetricFiles(useDefaultMetrics, customMetricsPath, __dirname)
    ML-->>F: metricFiles

    F->>ML: loadMetricObjects(metricFiles)
    loop for each metric file
        ML->>ML: importMetric(file)
        ML->>ML: validate { state, visitors, id }
    end
    ML-->>F: metricObjects
```

## Sequence Diagram: Metric Execution and Result Delivery

```mermaid
sequenceDiagram
    actor U as User
    participant F as calculateMetrics
    participant EX as MetricsExecutor
    participant KS as KahnSort
    participant RM as resultMap
    participant MP as MetricPlugin
    participant LG as logger

    U->>F: continue execution
    F->>EX: executeMetrics(metricObjects, ASTs)

    EX->>KS: kahnSort(metricObjects)
    KS-->>EX: sortedMetrics

    loop for each sorted metric
        EX->>EX: resolveDependencies(metric, resultMap)
        EX->>MP: traverseASTs(metric, ASTs)
        MP-->>EX: updated state.result
        EX->>RM: store resultMap[metric.id] = metric.state.result
    end

    loop post-processing phase
        EX->>MP: postProcessing(metric.state)
        MP-->>EX: finalized state
        EX->>RM: update stored result
    end

    EX->>LG: getFileErrors()
    EX->>LG: getParseErrors()
    EX->>LG: getMetricErrors()
    EX->>LG: getTraverseErrors()

    EX->>EX: buildFinalResult(sortedMetrics, resultMap)
    EX-->>F: final output
    F-->>U: { metricId: result, errors: {...} }
```

## Sequence Diagram: Dependency Resolution Between Metrics

```mermaid
sequenceDiagram
    participant EX as MetricsExecutor
    participant RM as resultMap
    participant M1 as files
    participant M2 as functions-per-file
    participant M3 as function-coupling

    EX->>M1: execute visitors
    M1-->>EX: state.result
    EX->>RM: store files

    EX->>M2: inject dependencies = { files: clone(resultMap.files) }
    EX->>M2: execute visitors
    M2-->>EX: state.result
    EX->>RM: store functions-per-file

    EX->>M3: inject dependencies = { functions-per-file: clone(resultMap["functions-per-file"]) }
    EX->>M3: execute visitors
    M3-->>EX: state.result
    EX->>RM: store function-coupling
```

## Design Notes

- The public API behaves like a facade over the whole analysis pipeline.
- Metrics form a plugin system based on a module contract rather than inheritance.
- AST analysis is implemented with the Visitor pattern through Babel visitors.
- Metric dependencies form a directed acyclic graph that is executed in topological order.
- Results are exchanged through an internal registry (`resultMap`) instead of direct metric-to-metric calls.
- Some metrics are internal helpers. For example, `instance-mapper` can be marked with `ignore: true` so it supports other metrics without appearing in the exported result.

## Relevant Source Files

- `/src/index.js`
- `/src/files/fileReader.js`
- `/src/ast/astProcessor.js`
- `/src/loader/metricsLoader.js`
- `/src/ast/executeMetrics.js`
- `/src/sorting/kahnSort.js`
- `/src/logger/logger.js`
