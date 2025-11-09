import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals'
import { executeMetrics } from '../../src/ast/executeMetrics.js'
import { logger } from '../../src/logger/logger.js'
import { MESSAGES } from '../../src/constants/constants.js'

describe('executeMetrics.js', () => {
  let logMetricErrorSpy
  let logTraverseErrorSpy
  const registerFileMetric = {
    state: { id: 'register-file', result: {} },
    visitors: {
      Program (path, state) {
        state.result[path.node.filePath] = {}
      }
    }
  }

  const registerFileMetricWithNonexistentDependencies = {
    state: { id: 'register-file', result: {}, dependencies: ['doesnt-exists'] },
    visitors: {
      Program (path, state) {
        state.result[path.node.filePath] = {}
      }
    },
    postProcessing (state) {
      delete state.dependencies
    }
  }

  const ast = {
    type: 'File',
    errors: [],
    program: {
      type: 'Program',
      sourceType: 'script',
      interpreter: null,
      body: [],
      filePath: '/test/ast/temp_valid.js'
    },
    comments: []
  }

  const failingMetric = {
    state: { id: 'do-something-bad', result: {} },
    visitors: {
      Program (path) {
        path.node.doNotDoThis()
      }
    }
  }

  describe('executeMetrics', () => {
    beforeAll(() => {
      // Spy on logger functions
      logMetricErrorSpy = jest.spyOn(logger, 'logMetricError').mockImplementation(() => {})
      logTraverseErrorSpy = jest.spyOn(logger, 'logTraverseError').mockImplementation(() => {})
    })

    afterAll(() => {
      jest.resetModules()
    })

    it('should process metrics without dependencies and return state results', async () => {
      const result = await executeMetrics([registerFileMetric], [ast])

      expect(result).toHaveProperty('register-file')
      expect(result['register-file'].result).toEqual({ '/test/ast/temp_valid.js': {} })
      expect(result['register-file'].dependencies).toBeUndefined()
    })

    it('should process metrics with dependencies logging dependencies not found and return state results', async () => {
      const result = await executeMetrics([registerFileMetricWithNonexistentDependencies], [ast])

      expect(result).toHaveProperty('register-file')
      expect(result['register-file'].result).toEqual({ '/test/ast/temp_valid.js': {} })

      expect(result['register-file'].dependencies).toBeUndefined()
      expect(logMetricErrorSpy).toHaveBeenCalledWith(
        `Dependency doesnt-exists not found for metric ${registerFileMetricWithNonexistentDependencies.state.id}, deleting from dependencies.`
      )
    })

    it('should log error', async () => {
      const result = await executeMetrics([failingMetric], [ast])

      expect(result).toHaveProperty('do-something-bad')
      expect(result['do-something-bad'].result).toEqual({})

      expect(result['do-something-bad'].dependencies).toBeUndefined()
      expect(logTraverseErrorSpy).toHaveBeenCalledWith(
        `${MESSAGES.ERRORS.ERROR_TRAVERSING_AST} ${failingMetric.state.id} -> ${ast.program.filePath}: TypeError: path.node.doNotDoThis is not a function`
      )
    })
  })
})
