import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { calculateMetrics } from '../../src/index.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Classes Per File Metric', () => {
  const codePath = path.resolve(__dirname, '../test-src/classes-per-file')
  let metricsResults

  beforeEach(async () => {
    jest.resetModules()
    metricsResults = await calculateMetrics({ codePath })
  })

  it('metricsResults is defined', () => {
    expect(metricsResults).toBeDefined()
  })

  it('Classes per File metric is defined, has correct name, description and status and contains result', () => {
    expect(metricsResults).toHaveProperty('classes-per-file')
    expect(metricsResults['classes-per-file']).toHaveProperty('name', 'Classes Per File')
    expect(metricsResults['classes-per-file'].description).toBeDefined()
    expect(metricsResults['classes-per-file'].description).toContain('Analyzes each source file to identify and record all top-level classes defined')
    expect(metricsResults['classes-per-file'].result).toBeDefined()
    expect(metricsResults['classes-per-file'].status).toBeTruthy()
  })

  it('Classes per File metric contains expected classes for classes.js file', () => {
    expect(metricsResults['classes-per-file'].result).toBeDefined()
    expect(metricsResults['classes-per-file'].status).toBeTruthy()

    const classesPath = path.resolve(__dirname, '../test-src/classes-per-file/JS/classes.js')
    const classesResult = metricsResults['classes-per-file'].result[classesPath]

    // Serializing to drop metadata and hidden properties from Babel AST
    const cleanResult = JSON.parse(JSON.stringify(classesResult))

    expect(cleanResult).toStrictEqual(
      {
        Calculator: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
            id: null,
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
              type: 'FunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          }
        ],
        AdvancedCalculator: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
            id: null,
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
              type: 'FunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          }
        ],
        FooClass: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
            id: null,
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
              type: 'FunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          }
        ],
        Logger: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
            id: null,
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
              type: 'FunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          }
        ],
        LiteralClassName: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
            id: null,
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
              type: 'FunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          }
        ],
        Printer: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
            id: null,
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
              type: 'FunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          }
        ]
      }
    )
  })

  it('Classes per File metric contains expected default class from defaultClass.js file', () => {
    expect(metricsResults['classes-per-file'].result).toBeDefined()
    expect(metricsResults['classes-per-file'].status).toBeTruthy()

    const defaultClassPath = path.resolve(__dirname, '../test-src/classes-per-file/JS/defaultClass.js')
    const defaultClassResult = metricsResults['classes-per-file'].result[defaultClassPath]

    // Serializing to drop metadata and hidden properties from Babel AST
    const cleanResult = JSON.parse(JSON.stringify(defaultClassResult))

    expect(cleanResult).toStrictEqual(
      {
        defaultClass: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
            id: null,
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
              type: 'FunctionExpression',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          }
        ]
      }
    )
  })

  it('Classes per File metric contains expected classes for classes.ts file', () => {
    expect(metricsResults['classes-per-file'].result).toBeDefined()
    expect(metricsResults['classes-per-file'].status).toBeTruthy()

    const classesPath = path.resolve(__dirname, '../test-src/classes-per-file/TS/classes.ts')
    const classesResult = metricsResults['classes-per-file'].result[classesPath]

    // Serializing to drop metadata and hidden properties from Babel AST
    const cleanResult = JSON.parse(JSON.stringify(classesResult))

    expect(cleanResult).toStrictEqual(
      {
        Calculator: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
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
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              returnType: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                  type: 'TSVoidKeyword'
                }
              },
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
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
            }
          }
        ],
        AdvancedCalculator: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
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
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              returnType: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                  type: 'TSVoidKeyword'
                }
              },
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
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
            }
          }
        ],
        FooClass: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
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
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              returnType: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                  type: 'TSVoidKeyword'
                }
              },
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
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
            }
          }
        ],
        Logger: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
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
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              returnType: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                  type: 'TSVoidKeyword'
                }
              },
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
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
            }
          }
        ],
        Printer: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
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
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              returnType: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                  type: 'TSVoidKeyword'
                }
              },
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
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
            }
          }
        ],
        LiteralClassName: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
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
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              returnType: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                  type: 'TSVoidKeyword'
                }
              },
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
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
            }
          }
        ]
      }
    )
  })

  it('Classes per File metric contains expected default class from defaultClass.ts file', () => {
    expect(metricsResults['classes-per-file'].result).toBeDefined()
    expect(metricsResults['classes-per-file'].status).toBeTruthy()

    const defaultClassPath = path.resolve(__dirname, '../test-src/classes-per-file/TS/defaultClass.ts')
    const defaultClassResult = metricsResults['classes-per-file'].result[defaultClassPath]

    // Serializing to drop metadata and hidden properties from Babel AST
    const cleanResult = JSON.parse(JSON.stringify(defaultClassResult))

    expect(cleanResult).toStrictEqual(
      {
        defaultClass: [
          {
            type: 'ClassMethod',
            static: false,
            key: {
              type: 'Identifier',
              name: 'foo'
            },
            computed: false,
            kind: 'method',
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
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'bar'
            },
            computed: false,
            value: {
              type: 'ArrowFunctionExpression',
              returnType: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                  type: 'TSVoidKeyword'
                }
              },
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              }
            }
          },
          {
            type: 'ClassProperty',
            static: false,
            key: {
              type: 'Identifier',
              name: 'baz'
            },
            computed: false,
            value: {
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
            }
          }
        ]
      }
    )
  })
})
