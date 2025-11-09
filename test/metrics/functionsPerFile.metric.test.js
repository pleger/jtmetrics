import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { calculateMetrics } from '../../src/index.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Functions Per File Metric', () => {
  const codePath = path.resolve(__dirname, '../test-src/functions-per-file')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metricsResults is defined', () => {
    expect(metricsResults).toBeDefined()
  })

  it('Functions Per File metric is defined, has correct name, description and status and contains result', () => {
    expect(metricsResults).toHaveProperty('functions-per-file')
    expect(metricsResults['functions-per-file']).toHaveProperty('name', 'Functions Per File')
    expect(metricsResults['functions-per-file'].description).toBeDefined()
    expect(metricsResults['functions-per-file'].description).toContain('Records all named functions in each source file, mapping function names to their AST node')
    expect(metricsResults['functions-per-file'].result).toBeDefined()
    expect(metricsResults['functions-per-file'].status).toBeTruthy()
    expect(metricsResults['functions-per-file'].currentFile).toBeUndefined()
    expect(metricsResults['functions-per-file'].dependencies).toBeUndefined()
  })

  it('Functions Per File result contains expected functions', () => {
    expect(metricsResults).toBeDefined()
    expect(metricsResults).toHaveProperty('functions-per-file')
    expect(metricsResults['functions-per-file'].status).toBeTruthy()

    const functionsPerFileResult = metricsResults['functions-per-file'].result

    expect(functionsPerFileResult).toEqual({
      [`${codePath}/JS/functions.js`]: {
        foo: {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'foo'
          },
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'StringLiteral',
                  value: 'foo'
                }
              }
            ]
          }
        },
        bar: {
          type: 'FunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'StringLiteral',
                  value: 'bar'
                }
              }
            ]
          }
        },
        qux: {
          type: 'FunctionExpression',
          id: {
            type: 'Identifier',
            name: 'quxNamed'
          },
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'StringLiteral',
                  value: 'qux'
                }
              }
            ]
          }
        },
        baz: {
          type: 'FunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: []
          }
        },
        add: {
          type: 'ArrowFunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [
            {
              type: 'Identifier',
              name: 'a'
            },
            {
              type: 'Identifier',
              name: 'b'
            }
          ],
          body: {
            type: 'BinaryExpression',
            left: {
              type: 'Identifier',
              name: 'a'
            },
            operator: '+',
            right: {
              type: 'Identifier',
              name: 'b'
            }
          }
        }
      },
      [`${codePath}/TS/functions.ts`]: {
        foo: {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'foo'
          },
          generator: false,
          async: false,
          params: [],
          returnType: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
              type: 'TSStringKeyword'
            }
          },
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'StringLiteral',
                  value: 'foo'
                }
              }
            ]
          }
        },
        bar: {
          type: 'FunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [],
          returnType: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
              type: 'TSStringKeyword'
            }
          },
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'StringLiteral',
                  value: 'bar'
                }
              }
            ]
          }
        },
        qux: {
          type: 'FunctionExpression',
          id: {
            type: 'Identifier',
            name: 'quxNamed'
          },
          generator: false,
          async: false,
          params: [],
          returnType: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
              type: 'TSStringKeyword'
            }
          },
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'StringLiteral',
                  value: 'qux'
                }
              }
            ]
          }
        },
        baz: {
          type: 'FunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [],
          returnType: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
              type: 'TSVoidKeyword'
            }
          },
          body: {
            type: 'BlockStatement',
            body: []
          }
        },
        add: {
          type: 'ArrowFunctionExpression',
          returnType: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
              type: 'TSNumberKeyword'
            }
          },
          id: null,
          generator: false,
          async: false,
          params: [
            {
              type: 'Identifier',
              name: 'a',
              typeAnnotation: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                  type: 'TSNumberKeyword'
                }
              }
            },
            {
              type: 'Identifier',
              name: 'b',
              typeAnnotation: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                  type: 'TSNumberKeyword'
                }
              }
            }
          ],
          body: {
            type: 'BinaryExpression',
            left: {
              type: 'Identifier',
              name: 'a'
            },
            operator: '+',
            right: {
              type: 'Identifier',
              name: 'b'
            }
          }
        }
      }
    })
  })
})
