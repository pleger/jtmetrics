import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Files On Repository Metric', function () {
  const codePath = path.resolve(__dirname, '../test-src/files/')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metricsResults is defined', () => {
    expect(metricsResults).toBeDefined()
  })

  it('Files on Repository metric is defined, has correct name, description and status and contains result', async () => {
    expect(metricsResults).toHaveProperty('files')
    expect(metricsResults.files).toHaveProperty('name', 'Files on Repository')
    expect(metricsResults.files.description).toBeDefined()
    expect(metricsResults.files.description).toContain('Collects and records all source files in the repository by their path.')
    expect(metricsResults.files.result).toBeDefined()
    expect(metricsResults.files.status).toBeTruthy()
  })

  it('Files on Repository result contains expected length', () => {
    expect(metricsResults.files.result).toBeDefined()
    expect(metricsResults.files.status).toBeTruthy()

    const result = metricsResults.files.result

    expect(result.length).toBe(4)
  })

  it('Files on Repository result contains expected paths', () => {
    expect(metricsResults.files.result).toBeDefined()
    expect(metricsResults.files.status).toBeTruthy()

    const result = metricsResults.files.result

    const expectedPaths = [
      `${codePath}/JS/fileA.js`,
      `${codePath}/JS/subdir/fileB.js`,
      `${codePath}/TS/fileA.ts`,
      `${codePath}/TS/subdir/fileB.ts`
    ]

    expect(result.sort()).toEqual(expectedPaths.sort())
  })
})
