import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { getIgnored, isSupported } from '../../src/files/ignoreAndSupport.js'
import { logger } from '../../src/logger/logger.js'
import { LINE_BREAK } from '../../src/constants/constants.js'

describe('ignoreAndSupport.js', () => {
  let tempDir
  let ignoreFilePath

  beforeAll(async () => {
    // Create a temporary directory for isolated testing
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ignore-test-'))

    // Create a subdirectory and files listed in .metricsignore
    const ignoredDir = path.join(tempDir, 'ignore-dir')
    const ignoredFile1 = path.join(tempDir, 'example_file.txt')
    const ignoredFile2 = path.join(tempDir, 'example_ignored.js')

    await fs.mkdir(ignoredDir, { recursive: true })
    await fs.writeFile(path.join(ignoredDir, 'ignore-file'), 'test content')
    await fs.writeFile(ignoredFile1, 'txt file')
    await fs.writeFile(ignoredFile2, 'js file')

    // Create the .metricsignore file
    ignoreFilePath = path.join(tempDir, '.metricsignore')
    await fs.writeFile(
      ignoreFilePath,
      [
        'ignore-dir',
        '',
        'example_file.txt',
        'example_ignored.js'
      ].join(LINE_BREAK)
    )
  })

  afterAll(async () => {
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true })
  })

  describe('getIgnored', () => {
    it('should return absolute paths for ignored files listed in .metricsignore', async () => {
      const ignoredFiles = await getIgnored(ignoreFilePath)

      const expected = [
        path.resolve(tempDir, 'ignore-dir'),
        path.resolve(tempDir, 'example_file.txt'),
        path.resolve(tempDir, 'example_ignored.js')
      ]

      expect(ignoredFiles).toEqual(expected)
    })

    it('should return an empty array if ignoreMetricsFilePath is not provided', async () => {
      const ignoredFiles = await getIgnored(null)
      expect(ignoredFiles).toEqual([])
    })

    it('should log an error and return empty array if file cannot be read', async () => {
      const loggerSpy = jest.spyOn(logger, 'logFileError').mockImplementation(() => {})
      const invalidPath = path.join(tempDir, 'nonexistent.metricsignore')

      const ignoredFiles = await getIgnored(invalidPath)

      expect(loggerSpy).toHaveBeenCalled()
      expect(ignoredFiles).toEqual([])

      loggerSpy.mockRestore()
    })
  })

  describe('isSupported', () => {
    it('should return true for .js and .ts files', () => {
      expect(isSupported('/some/path/file.js')).toBe(true)
      expect(isSupported('/some/path/file.ts')).toBe(true)
    })

    it('should return false for unsupported extensions', () => {
      expect(isSupported('/some/path/file.txt')).toBe(false)
      expect(isSupported('/some/path/file.json')).toBe(false)
    })

    it('should be case-insensitive for extensions', () => {
      expect(isSupported('/some/path/file.JS')).toBe(true)
      expect(isSupported('/some/path/file.TS')).toBe(true)
    })
  })
})
