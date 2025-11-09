import traverse from '@babel/traverse'
import { MESSAGES } from '../constants/constants.js'
import { kahnSort } from '../sorting/kahnSort.js'
import { logger } from '../logger/logger.js'

/**
 * Sorts metric objects by dependency order and initializes the result map.
 *
 * @param {Array<Object>} metricObjects - Array of metric definitions.
 * @returns {{ sortedMetrics: Array<Object>, resultMap: Object }}
 * Sorted metrics and an empty result map.
 */
function sortAndInit (metricObjects) {
  const sortedMetrics = kahnSort(metricObjects)
  const resultMap = {}
  return { sortedMetrics, resultMap }
}

/**
 * Resolves dependencies for a single metric by replacing dependency IDs
 * with deep copies of the corresponding metric results.
 *
 * @param {Object} metric - The current metric object.
 * @param {Object} resultMap - Map of metric results by ID.
 */
function resolveDependencies (metric, resultMap) {
  if (!metric.state.dependencies) return

  const deps = metric.state.dependencies
  metric.state.dependencies = {}

  for (const depId of deps) {
    metric.state.dependencies[depId] = structuredClone(resultMap[depId])
  }
}

/**
 * Traverses all ASTs with the given metric's visitors.
 * Logs errors if traversal fails for any AST.
 *
 * @param {Object} metric - Metric containing visitors and state.
 * @param {Array<Object>} ASTs - List of ASTs to traverse.
 */
function traverseASTs (metric, ASTs) {
  const visitorsArray = [metric.visitors]

  for (const visitors of visitorsArray) {
    for (const ast of ASTs) {
      try {
        traverse.default(ast, visitors, null, metric.state)
      } catch (error) {
        logger.logTraverseError(
          `${MESSAGES.ERRORS.ERROR_TRAVERSING_AST} ${metric.state.id} -> ${ast.program.filePath}: ${error}`
        )
      }
    }
  }
}

/**
 * Executes optional post-processing on a metric and stores the final result.
 *
 * @param {Object} metric - Metric to process.
 * @param {Object} resultMap - Map of metric results by ID.
 */
function postProcessAndStore (metric, resultMap) {
  if (metric.postProcessing) {
    metric.postProcessing(metric.state)
  }
  resultMap[metric.state.id] = metric.state.result
}

/**
 * Builds the final output object containing all metrics' results and errors.
 *
 * @param {Array<Object>} sortedMetrics - List of processed metrics.
 * @param {Object} resultMap - Map of metric results by ID.
 * @returns {Object} Object containing all metrics' results and error logs.
 */
function buildFinalResult (sortedMetrics, resultMap) {
  const output = {}

  for (const metric of sortedMetrics) {
    /* istanbul ignore next */
    if (metric.state.ignore && process.env.SKIP_IGNORE !== 'true') continue

    const { id, ...stateWithoutId } = metric.state
    output[id] = stateWithoutId
  }

  // Append logger errors
  output.errors = {
    file: logger.getFileErrors(),
    parse: logger.getParseErrors(),
    metric: logger.getMetricErrors(),
    traverse: logger.getTraverseErrors()
  }
  return output
}

/**
 * Runs all metrics against provided ASTs:
 * - Sorts metrics by dependency order.
 * - Resolves dependencies for each metric.
 * - Traverses ASTs with metric visitors.
 * - Runs post-processing and compiles results.
 *
 * @param {Array<Object>} metricObjects - List of metric definitions.
 * @param {Array<Object>} ASTs - List of parsed ASTs to analyze.
 * @returns {Promise<Object>} Final result object with metrics and error logs.
 */
async function executeMetrics (metricObjects, ASTs) {
  const { sortedMetrics, resultMap } = sortAndInit(metricObjects)

  for (const metric of sortedMetrics) {
    resolveDependencies(metric, resultMap)
    traverseASTs(metric, ASTs)
    resultMap[metric.state.id] = metric.state.result
  }

  for (const metric of sortedMetrics) {
    postProcessAndStore(metric, resultMap)
  }

  return buildFinalResult(sortedMetrics, resultMap)
}

export { executeMetrics }
