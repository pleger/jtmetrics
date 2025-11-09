import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Instance Mapper Metric', () => {
  beforeEach(async () => {
    jest.resetModules()
  })

  it('metricsResults is defined', async () => {
    const codePath = path.resolve(__dirname, '../test-src/instance-mapper/')
    const metricsResults = await calculateMetrics({ codePath })
    expect(metricsResults).toBeDefined()
    const instanceMapperResult = metricsResults['instance-mapper']
    expect(instanceMapperResult.status).toBeTruthy()
    expect(instanceMapperResult.currentFile).toBeUndefined()
    expect(instanceMapperResult.dependencies).toBeUndefined()
  })

  it('correct instances to classes mapping for JS files', async () => {
    const codePath = path.resolve(__dirname, '../test-src/instance-mapper/JS')
    const instancesPath = path.resolve(__dirname, '../test-src/instance-mapper/JS/instances.js')
    const defaultClassPath = path.resolve(__dirname, '../test-src/instance-mapper/JS/defaultClass.js')

    const metricsResults = await calculateMetrics({ codePath })
    const instanceMapperResult = metricsResults['instance-mapper']
    expect(instanceMapperResult.status).toBeTruthy()

    expect(instanceMapperResult.result).toStrictEqual(
      {
        [defaultClassPath]: {
          defaultClass: {
            'this.fooDClass': 'AClass',
            constFooDClass: 'AClass',
            letFooCDClass: 'AClass',
            'this.barDClass': 'AClass',
            constBarDClass: 'AClass',
            letBarDClass: 'AClass',
            'this.bazDClass': 'AClass',
            constBazDClass: 'AClass',
            letBazDClass: 'AClass'
          }
        },
        [instancesPath]: {
          AClass: {
            'this.fooBClass': 'BClass',
            constFooBClass: 'BClass',
            letFooBClass: 'BClass',
            'this.barBClass': 'BClass',
            constBarBClass: 'BClass',
            letBarBClass: 'BClass',
            'this.bazBClass': 'BClass',
            constBazBClass: 'BClass',
            letBazBClass: 'BClass'
          },
          BClass: {
            'this.fooCClass': 'CClass',
            constFooCClass: 'CClass',
            letFooCClass: 'CClass',
            'this.barCClass': 'CClass',
            constBarCClass: 'CClass',
            letBarCClass: 'CClass',
            'this.bazCClass': 'CClass',
            constBazCClass: 'CClass',
            letBazCClass: 'CClass'
          },
          CClass: {
            'this.fooDClass': 'DClass',
            constFooDClass: 'DClass',
            letFooCDClass: 'DClass',
            'this.barDClass': 'DClass',
            constBarDClass: 'DClass',
            letBarDClass: 'DClass',
            'this.bazDClass': 'DClass',
            constBazDClass: 'DClass',
            letBazDClass: 'DClass'
          },
          DClass: {
            'this.fooAClass': 'AClass',
            constFooAClass: 'AClass',
            letFooAClass: 'AClass',
            'this.barAClass': 'AClass',
            constBarAClass: 'AClass',
            letBarAClass: 'AClass',
            'this.bazAClass': 'AClass',
            constBazAClass: 'AClass',
            letBazAClass: 'AClass'
          },
          EClass: {
            'this.fooAClass': 'AClass',
            constFooAClass: 'AClass',
            letFooAClass: 'AClass',
            'this.barAClass': 'AClass',
            constBarAClass: 'AClass',
            letBarAClass: 'AClass',
            'this.bazAClass': 'AClass',
            constBazAClass: 'AClass',
            letBazAClass: 'AClass'
          },
          LiteralClassName: {
            'this.fooAClass': 'AClass',
            constFooAClass: 'AClass',
            letFooAClass: 'AClass',
            'this.barAClass': 'AClass',
            constBarAClass: 'AClass',
            letBarAClass: 'AClass',
            'this.bazAClass': 'AClass',
            constBazAClass: 'AClass',
            letBazAClass: 'AClass'
          }
        }
      }
    )
  })

  it('correct instances to classes mapping for TS files', async () => {
    const codePath = path.resolve(__dirname, '../test-src/instance-mapper/TS')
    const instancesPath = path.resolve(__dirname, '../test-src/instance-mapper/TS/instances.ts')
    const defaultClassPath = path.resolve(__dirname, '../test-src/instance-mapper/TS/defaultClass.ts')

    const metricsResults = await calculateMetrics({ codePath })
    const instanceMapperResult = metricsResults['instance-mapper']
    expect(instanceMapperResult.status).toBeTruthy()

    expect(instanceMapperResult.result).toStrictEqual(
      {
        [defaultClassPath]: {
          defaultClass: {
            'this.fooDClass': 'AClass',
            constFooDClass: 'AClass',
            letFooCDClass: 'AClass',
            'this.barDClass': 'AClass',
            constBarDClass: 'AClass',
            letBarDClass: 'AClass',
            'this.bazDClass': 'AClass',
            constBazDClass: 'AClass',
            letBazDClass: 'AClass'
          }
        },
        [instancesPath]: {
          AClass: {
            'this.fooBClass': 'BClass',
            constFooBClass: 'BClass',
            letFooBClass: 'BClass',
            'this.barBClass': 'BClass',
            constBarBClass: 'BClass',
            letBarBClass: 'BClass',
            'this.bazBClass': 'BClass',
            constBazBClass: 'BClass',
            letBazBClass: 'BClass'
          },
          BClass: {
            'this.fooCClass': 'CClass',
            constFooCClass: 'CClass',
            letFooCClass: 'CClass',
            'this.barCClass': 'CClass',
            constBarCClass: 'CClass',
            letBarCClass: 'CClass',
            'this.bazCClass': 'CClass',
            constBazCClass: 'CClass',
            letBazCClass: 'CClass'
          },
          CClass: {
            'this.fooDClass': 'DClass',
            constFooDClass: 'DClass',
            letFooCDClass: 'DClass',
            'this.barDClass': 'DClass',
            constBarDClass: 'DClass',
            letBarDClass: 'DClass',
            'this.bazDClass': 'DClass',
            constBazDClass: 'DClass',
            letBazDClass: 'DClass'
          },
          DClass: {
            'this.fooAClass': 'AClass',
            constFooAClass: 'AClass',
            letFooAClass: 'AClass',
            'this.barAClass': 'AClass',
            constBarAClass: 'AClass',
            letBarAClass: 'AClass',
            'this.bazAClass': 'AClass',
            constBazAClass: 'AClass',
            letBazAClass: 'AClass'
          },
          EClass: {
            'this.fooAClass': 'AClass',
            constFooAClass: 'AClass',
            letFooAClass: 'AClass',
            'this.barAClass': 'AClass',
            constBarAClass: 'AClass',
            letBarAClass: 'AClass',
            'this.bazAClass': 'AClass',
            constBazAClass: 'AClass',
            letBazAClass: 'AClass'
          },
          LiteralClassName: {
            'this.fooAClass': 'AClass',
            constFooAClass: 'AClass',
            letFooAClass: 'AClass',
            'this.barAClass': 'AClass',
            constBarAClass: 'AClass',
            letBarAClass: 'AClass',
            'this.bazAClass': 'AClass',
            constBazAClass: 'AClass',
            letBazAClass: 'AClass'
          }
        }
      }
    )
  })
})
