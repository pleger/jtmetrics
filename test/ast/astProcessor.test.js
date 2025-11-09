import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals'
import path from 'path'
import { constructASTs } from '../../src/ast/astProcessor.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { FILE_ENCODING, MESSAGES } from '../../src/constants/constants.js'
import { logger } from '../../src/logger/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('astProcessor.js', () => {
  describe('constructASTs', () => {
    const codeContent = 'function foo() { return 42; }'

    const tempDir = path.resolve(__dirname)
    const validFileName = 'temp_valid.js'
    const validFilePath = path.join(tempDir, validFileName)

    const anotherValidFileName = 'another_temp_valid.js'
    const anotherValidFilePath = path.join(tempDir, anotherValidFileName)

    const nonexistentFileName = 'nonexistent.js'
    const nonexistentFilePath = path.join(tempDir, nonexistentFileName)

    const invalidFileName = 'invalid.js'
    const invalidFilePath = path.join(tempDir, invalidFileName)
    const invalidCodeContent = 'func {}'

    const strangeFileName = 'strange.js'
    const strangeFilePath = path.join(tempDir, strangeFileName)
    const strangeCode = '[, name] = [1, 2];'

    beforeAll(() => {
      // Create a temporary valid JS file
      fs.writeFileSync(validFilePath, codeContent, FILE_ENCODING)
      fs.writeFileSync(anotherValidFilePath, codeContent, FILE_ENCODING)
      fs.writeFileSync(invalidFilePath, invalidCodeContent, FILE_ENCODING)
      fs.writeFileSync(strangeFilePath, strangeCode, FILE_ENCODING)
    })

    afterAll(() => {
      // Clean up temporary file
      if (fs.existsSync(validFilePath)) {
        fs.unlinkSync(validFilePath)
      }

      if (fs.existsSync(anotherValidFilePath)) {
        fs.unlinkSync(anotherValidFilePath)
      }

      if (fs.existsSync(invalidFilePath)) {
        fs.unlinkSync(invalidFilePath)
      }

      if (fs.existsSync(strangeFilePath)) {
        fs.unlinkSync(strangeFilePath)
      }
    })

    it('returns [] when input is an empty array', async () => {
      const results = await constructASTs([])
      expect(results).toEqual([])
    })

    it('returns [] when input is an array with an empty object', async () => {
      const results = await constructASTs([{}])
      expect(results).toEqual([])
    })

    it('returns ASTs with filePath and no location properties for an array of valid and invalid/nonexistent files', async () => {
      const results = await constructASTs([
        {
          filePath: validFilePath,
          fileName: validFileName
        },
        {
          filePath: invalidFilePath,
          fileName: invalidFileName
        },
        {
          filePath: anotherValidFilePath,
          fileName: anotherValidFileName
        },
        {
          filePath: nonexistentFilePath,
          fileName: nonexistentFileName
        }
      ])

      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(2)

      const firstAST = results[0]
      // Check that filePath metadata was added
      expect(firstAST.program.filePath).toBe(validFilePath)
      expect(firstAST.loc).toBeUndefined()
      expect(firstAST.program.loc).toBeUndefined()

      const secondAST = results[1]
      // Check that filePath metadata was added
      expect(secondAST.program.filePath).toBe(anotherValidFilePath)
      expect(secondAST.loc).toBeUndefined()
      expect(secondAST.program.loc).toBeUndefined()
    })

    it('should call logger.logFileError when source code cannot be read', async () => {
      const spy = jest.spyOn(logger, 'logFileError').mockImplementation(() => {})

      const results = await constructASTs([{ filePath: nonexistentFilePath }])
      expect(results).toEqual([])
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining(`${MESSAGES.ERRORS.ERROR_READING_SOURCE_CODE} ${nonexistentFilePath}`)
      )

      spy.mockRestore()
    })

    it('should call logger.logParseError when parsing invalid code', async () => {
      const spy = jest.spyOn(logger, 'logParseError').mockImplementation(() => {})

      const results = await constructASTs([{ filePath: invalidFilePath }])
      expect(results).toEqual([])
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining(`${MESSAGES.ERRORS.ERROR_PARSING_FILE} ${invalidFilePath}`)
      )

      spy.mockRestore()
    })

    it('should preserve the order of valid ASTs relative to input files', async () => {
      const files = [
        { filePath: anotherValidFilePath },
        { filePath: nonexistentFilePath },
        { filePath: validFilePath }
      ]
      const results = await constructASTs(files)

      expect(results).toHaveLength(2)

      const anotherValidAST = results[0]
      const validAST = results[1]

      // first valid comes from anotherValidFilePath, second from validFilePath
      expect(anotherValidAST.program.filePath).toBe(anotherValidFilePath)
      expect(validAST.program.filePath).toBe(validFilePath)
    })

    it('should return an empty array when all ASTs are null', async () => {
      const files = [
        { filePath: nonexistentFilePath },
        { filePath: invalidFilePath }
      ]
      const results = await constructASTs(files)
      expect(results).toEqual([])
    })

    it('should cover cleanAST branch with null node from AST', async () => {
      const results = await constructASTs([
        { filePath: strangeFilePath, fileName: strangeFileName }
      ])

      expect(results).toHaveLength(1)
      expect(results[0].program.filePath).toBe(strangeFilePath)
    })
  })
})
