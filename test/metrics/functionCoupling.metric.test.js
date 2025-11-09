import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Functions Coupling Metric', () => {
  const jsFile = path.resolve(__dirname, '../test-src/function-coupling/example-1/JS/functions-coupled.js')
  const tsFile = path.resolve(__dirname, '../test-src/function-coupling/example-1/TS/functions-coupled.ts')

  beforeEach(async () => {
    jest.resetModules()
  })

  it('metricsResults is defined', async () => {
    const codePath = path.resolve(__dirname, '../test-src/function-coupling/example-1')
    const metricsResults = await calculateMetrics({ codePath })
    expect(metricsResults).toBeDefined()
  })

  it('Metric is defined, has correct name, description and status and contains result', async () => {
    const codePath = path.resolve(__dirname, '../test-src/function-coupling/')
    const metricsResults = await calculateMetrics({ codePath })
    expect(metricsResults).toHaveProperty('function-coupling')
    expect(metricsResults['function-coupling']).toHaveProperty('name', 'Function Coupling')
    expect(metricsResults['function-coupling'].description).toBeDefined()
    expect(metricsResults['function-coupling'].description).toContain('Measures function-level coupling by recording Fan-In and Fan-Out relationships between functions')
    expect(metricsResults['function-coupling'].result).toBeDefined()
    expect(metricsResults['function-coupling'].status).toBeTruthy()
    expect(metricsResults['functions-per-file'].currentFile).toBeUndefined()
    expect(metricsResults['functions-per-file'].dependencies).toBeUndefined()
  })

  it('Metric result contains JS src testing file', async () => {
    const codePath = path.resolve(__dirname, '../test-src/function-coupling/example-1')
    const metricsResults = await calculateMetrics({ codePath })
    const functionCouplingResult = metricsResults['function-coupling'].result
    expect(functionCouplingResult[jsFile]).toBeDefined()
  })

  it('Metric result contains TS src testing file', async () => {
    const codePath = path.resolve(__dirname, '../test-src/function-coupling/example-1')
    const metricsResults = await calculateMetrics({ codePath })
    const functionCouplingResult = metricsResults['function-coupling'].result
    expect(functionCouplingResult[tsFile]).toBeDefined()
  })

  it('Should compute the correct metric structure for JS file', async () => {
    const codePath = path.resolve(__dirname, '../test-src/function-coupling/example-1')
    const metricsResults = await calculateMetrics({ codePath })
    const functionCouplingResult = metricsResults['function-coupling'].result

    expect(functionCouplingResult[jsFile]).toEqual({
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
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'add'
                },
                arguments: [
                  {
                    type: 'NumericLiteral',
                    value: 1
                  },
                  {
                    type: 'NumericLiteral',
                    value: 2
                  }
                ]
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
                type: 'StringLiteral',
                value: 'foo'
              }
            }
          ]
        },
        'fan-out': {
          add: 1
        },
        'fan-in': {
          bar: 1
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
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: []
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
                type: 'StringLiteral',
                value: 'bar'
              }
            }
          ]
        },
        'fan-out': {
          foo: 1
        },
        'fan-in': {
          qux: 1
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
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'bar'
                },
                arguments: []
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
                type: 'StringLiteral',
                value: 'qux'
              }
            }
          ]
        },
        'fan-out': {
          bar: 1
        },
        'fan-in': {
          baz: 1
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
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'qux'
                },
                arguments: []
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
                type: 'StringLiteral',
                value: 'baz'
              }
            }
          ]
        },
        'fan-out': {
          qux: 1
        },
        'fan-in': {
          add: 1
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
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'baz'
                },
                arguments: []
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
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
          ]
        },
        'fan-in': {
          foo: 1
        },
        'fan-out': {
          baz: 1
        }
      }
    })
  })

  it('should compute the correct metric structure for TS file', async () => {
    const codePath = path.resolve(__dirname, '../test-src/function-coupling/example-1')
    const metricsResults = await calculateMetrics({ codePath })
    const functionCouplingResult = metricsResults['function-coupling'].result

    expect(functionCouplingResult[tsFile]).toEqual({
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
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'add'
                },
                arguments: [
                  {
                    type: 'NumericLiteral',
                    value: 1
                  },
                  {
                    type: 'NumericLiteral',
                    value: 2
                  }
                ]
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
                type: 'StringLiteral',
                value: 'foo'
              }
            }
          ]
        },
        'fan-out': {
          add: 1
        },
        'fan-in': {
          bar: 1
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
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: []
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
                type: 'StringLiteral',
                value: 'bar'
              }
            }
          ]
        },
        'fan-out': {
          foo: 1
        },
        'fan-in': {
          qux: 1
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
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'bar'
                },
                arguments: []
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
                type: 'StringLiteral',
                value: 'qux'
              }
            }
          ]
        },
        'fan-out': {
          bar: 1
        },
        'fan-in': {
          baz: 1
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
            type: 'TSStringKeyword'
          }
        },
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'qux'
                },
                arguments: []
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
                type: 'StringLiteral',
                value: 'baz'
              }
            }
          ]
        },
        'fan-out': {
          qux: 1
        },
        'fan-in': {
          add: 1
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
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'baz'
                },
                arguments: []
              }
            },
            {
              type: 'ReturnStatement',
              argument: {
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
          ]
        },
        'fan-in': {
          foo: 1
        },
        'fan-out': {
          baz: 1
        }
      }
    })
  })

  it('should compute correct metric for functions across files', async () => {
    const codePath = path.resolve(__dirname, '../test-src/function-coupling/example-2')
    const metricsResults = await calculateMetrics({ codePath })
    const functionCouplingResult = metricsResults['function-coupling'].result

    expect(functionCouplingResult).toEqual({
      [`${codePath}/JS/fileA.js`]: {
        call1: {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'call1'
          },
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun1'
                  },
                  arguments: []
                }
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun1'
                  },
                  arguments: []
                }
              }
            ]
          },
          'fan-out': {
            fun1: 2
          }
        },
        call2: {
          type: 'FunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun2'
                  },
                  arguments: []
                }
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun2'
                  },
                  arguments: []
                }
              }
            ]
          },
          'fan-out': {
            fun2: 2
          }
        },
        call3: {
          type: 'ArrowFunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun3'
                  },
                  arguments: []
                }
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun3'
                  },
                  arguments: []
                }
              }
            ]
          },
          'fan-out': {
            fun3: 2
          }
        }
      },
      [`${codePath}/JS/subdir/fileB.js`]: {
        fun1: {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'fun1'
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
                  type: 'NumericLiteral',
                  value: 1
                }
              }
            ]
          },
          'fan-in': {
            call1: 2
          }
        },
        fun2: {
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
                  type: 'NumericLiteral',
                  value: 2
                }
              }
            ]
          },
          'fan-in': {
            call2: 2
          }
        },
        fun3: {
          type: 'ArrowFunctionExpression',
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
                  type: 'NumericLiteral',
                  value: 3
                }
              }
            ]
          },
          'fan-in': {
            call3: 2
          }
        }
      },
      [`${codePath}/TS/fileA.ts`]: {
        call1: {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'call1'
          },
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
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun1'
                  },
                  arguments: []
                }
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun1'
                  },
                  arguments: []
                }
              }
            ]
          },
          'fan-out': {
            fun1: 2
          }
        },
        call2: {
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
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun2'
                  },
                  arguments: []
                }
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun2'
                  },
                  arguments: []
                }
              }
            ]
          },
          'fan-out': {
            fun2: 2
          }
        },
        call3: {
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
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun3'
                  },
                  arguments: []
                }
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'fun3'
                  },
                  arguments: []
                }
              }
            ]
          },
          'fan-out': {
            fun3: 2
          }
        }
      },
      [`${codePath}/TS/subdir/fileB.ts`]: {
        fun1: {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'fun1'
          },
          generator: false,
          async: false,
          params: [],
          returnType: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
              type: 'TSNumberKeyword'
            }
          },
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'NumericLiteral',
                  value: 1
                }
              }
            ]
          },
          'fan-in': {
            call1: 2
          }
        },
        fun2: {
          type: 'FunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [],
          returnType: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
              type: 'TSNumberKeyword'
            }
          },
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'NumericLiteral',
                  value: 2
                }
              }
            ]
          },
          'fan-in': {
            call2: 2
          }
        },
        fun3: {
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
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ReturnStatement',
                argument: {
                  type: 'NumericLiteral',
                  value: 3
                }
              }
            ]
          },
          'fan-in': {
            call3: 2
          }
        }
      }
    })
  })

  it('Metric result contains correct result with invalid cases', async () => {
    const codePath = path.resolve(__dirname, '../test-src/function-coupling/example-3')
    const metricsResults = await calculateMetrics({ codePath })
    const functionCouplingResult = metricsResults['function-coupling'].result

    expect(functionCouplingResult).toEqual({
      [`${codePath}/invalidCases.js`]: {
        invalid1: {
          type: 'FunctionDeclaration',
          id: {
            type: 'Identifier',
            name: 'invalid1'
          },
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
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
                  arguments: []
                }
              }
            ]
          }
        },
        invalid2: {
          type: 'FunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
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
                  arguments: []
                }
              }
            ]
          }
        },
        invalid3: {
          type: 'ArrowFunctionExpression',
          id: null,
          generator: false,
          async: false,
          params: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
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
                  arguments: []
                }
              }
            ]
          }
        }
      }
    })
  })
})
