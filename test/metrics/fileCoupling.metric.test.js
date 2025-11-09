import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('File Coupling Metric', function () {
  beforeEach(() => {
    jest.resetModules()
  })

  it('metricsResults is defined', async () => {
    const codePath = path.resolve(__dirname, '../test-src/file-coupling/')
    const metricsResults = await calculateMetrics({ codePath })
    expect(metricsResults).toBeDefined()
  })

  it('File Coupling metric is defined, has correct name, description and status and contains result', async () => {
    const codePath = path.resolve(__dirname, '../test-src/file-coupling/')
    const metricsResults = await calculateMetrics({ codePath })
    expect(metricsResults).toHaveProperty('file-coupling')
    expect(metricsResults['file-coupling']).toHaveProperty('name', 'File Coupling')
    expect(metricsResults['file-coupling'].description).toBeDefined()
    expect(metricsResults['file-coupling'].description).toContain('Measures file-level coupling by computing each file’s fan-in (dependent files) and fan-out (dependencies)')
    expect(metricsResults['file-coupling'].result).toBeDefined()
    expect(metricsResults['file-coupling'].status).toBeTruthy()
  })

  it('File Coupling metric return correct result for example-1 dir', async () => {
    const codePath = path.resolve(__dirname, '../test-src/file-coupling/example-1')
    const metricsResults = await calculateMetrics({ codePath })
    expect(metricsResults).toHaveProperty('file-coupling')
    expect(metricsResults['file-coupling'].status).toBeTruthy()

    const fileCouplingResult = metricsResults['file-coupling'].result

    expect(fileCouplingResult).toStrictEqual(
      {
        [`${codePath}/JS/fileA.js`]: {
          fanOut: [
            `${codePath}/JS/subdir/subsubdir/fileC.js`,
            `${codePath}/JS/subdir/fileB.cjs`
          ],
          fanIn: []
        },
        [`${codePath}/JS/subdir/fileB.cjs`]: {
          fanOut: [],
          fanIn: [
            `${codePath}/JS/fileA.js`
          ]
        },
        [`${codePath}/JS/subdir/subsubdir/fileC.js`]: {
          fanOut: [],
          fanIn: [
            `${codePath}/JS/fileA.js`
          ]
        },
        [`${codePath}/TS/fileA.ts`]: {
          fanOut: [
            `${codePath}/TS/subdir/subsubdir/fileC.ts`,
            `${codePath}/TS/subdir/fileB.ts`
          ],
          fanIn: []
        },
        [`${codePath}/TS/subdir/fileB.ts`]: {
          fanOut: [],
          fanIn: [
            `${codePath}/TS/fileA.ts`
          ]
        },
        [`${codePath}/TS/subdir/subsubdir/fileC.ts`]: {
          fanOut: [],
          fanIn: [
            `${codePath}/TS/fileA.ts`
          ]
        }
      }
    )
  })

  it('File Coupling metric return correct result for example-2 dir', async () => {
    const codePath = path.resolve(__dirname, '../test-src/file-coupling/example-2')
    const metricsResults = await calculateMetrics({ codePath })
    expect(metricsResults).toHaveProperty('file-coupling')
    expect(metricsResults['file-coupling'].status).toBeTruthy()

    const fileCouplingResult = metricsResults['file-coupling'].result

    expect(fileCouplingResult).toStrictEqual(
      {
        [`${codePath}/app.ts`]: {
          fanOut: [
            `${codePath}/utils/index.ts`
          ],
          fanIn: []
        },
        [`${codePath}/utils/index.ts`]: {
          fanOut: [],
          fanIn: [
            `${codePath}/app.ts`
          ]
        }
      }
    )
  })

  it('File Coupling metric return correct result for example-3 dir', async () => {
    const codePath = path.resolve(__dirname, '../test-src/file-coupling/example-3')
    const metricsResults = await calculateMetrics({ codePath })
    expect(metricsResults).toHaveProperty('file-coupling')
    expect(metricsResults['file-coupling'].status).toBeTruthy()

    const fileCouplingResult = metricsResults['file-coupling'].result

    expect(fileCouplingResult).toStrictEqual(
      {
        [`${codePath}/JS/badImports.js`]: {
          fanOut: [],
          fanIn: []
        },
        [`${codePath}/TS/badImports.ts`]: {
          fanOut: [],
          fanIn: []
        }
      }
    )
  })
})
