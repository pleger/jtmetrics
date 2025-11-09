import { describe, it, expect, beforeEach } from '@jest/globals'
import { logger } from '../../src/logger/logger.js'

describe('ErrorLogger', () => {
  beforeEach(() => {
    // Clear all error arrays before each test to ensure clean state
    logger.fileErrors.length = 0
    logger.parseErrors.length = 0
    logger.metricErrors.length = 0
    logger.traverseErrors.length = 0
  })

  it('should log and retrieve file errors correctly', () => {
    logger.logFileError('File error 1')
    logger.logFileError('File error 2')

    const errors = logger.getFileErrors()
    expect(errors).toEqual(['File error 1', 'File error 2'])

    // Ensure returned array is a copy
    errors.push('another error')
    expect(logger.getFileErrors()).toEqual(['File error 1', 'File error 2'])
  })

  it('should log and retrieve parse errors correctly', () => {
    logger.logParseError('Parse error')
    expect(logger.getParseErrors()).toEqual(['Parse error'])
  })

  it('should log and retrieve metric errors correctly', () => {
    logger.logMetricError('Metric error')
    expect(logger.getMetricErrors()).toEqual(['Metric error'])
  })

  it('should log and retrieve traverse errors correctly', () => {
    logger.logTraverseError('Traverse error')
    expect(logger.getTraverseErrors()).toEqual(['Traverse error'])
  })

  it('should exercise both branches of ErrorLogger.getInstance() without changing exports', () => {
    // Access the class via the exported instance's constructor
    const ErrorLoggerClass = logger.constructor

    // Save original instance so we can restore it after the test
    const originalInstance = ErrorLoggerClass.instance

    try {
      // Force "no instance" to go through the `if` branch on first call
      ErrorLoggerClass.instance = null

      // First call -> should create a new instance (if branch)
      const first = ErrorLoggerClass.getInstance()
      expect(first).toBeDefined()
      expect(first).toBe(ErrorLoggerClass.instance)

      // Second call -> should return the already-created instance (else branch)
      const second = ErrorLoggerClass.getInstance()
      expect(second).toBe(first)
    } finally {
      // Restore original instance to avoid side effects for other tests
      ErrorLoggerClass.instance = originalInstance
    }
  })
})
