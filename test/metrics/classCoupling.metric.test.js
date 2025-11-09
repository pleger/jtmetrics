import path from 'path'
import { calculateMetrics } from '../../src/index.js'
import { fileURLToPath } from 'url'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Class Coupling Metric', function () {
  const codePath = path.resolve(__dirname, '../test-src/class-coupling')
  const jsDir = path.resolve(__dirname, '../test-src/class-coupling/JS/')
  const tsDir = path.resolve(__dirname, '../test-src/class-coupling/TS/')

  beforeEach(() => {
    jest.resetModules()
  })

  it('metricsResults is defined', async () => {
    const metricsResults = await calculateMetrics({ codePath })
    expect(metricsResults).toBeDefined()
  })

  it('Metric is defined, has correct name, description and status and contains result', async () => {
    const metricsResults = await calculateMetrics({ codePath })

    expect(metricsResults).toHaveProperty('class-coupling')
    expect(metricsResults['class-coupling'])
      .toHaveProperty('name', 'Class Coupling')
    expect(metricsResults['class-coupling'].description).toBeDefined()
    expect(metricsResults['class-coupling'].description)
      .toContain('Analyzes each class to identify Fan-Out and Fan-In')
    expect(metricsResults['class-coupling'].result).toBeDefined()
    expect(metricsResults['class-coupling'].status).toBeTruthy()
  })

  it('Metric result contains JS src testing file', async () => {
    const metricsResults = await calculateMetrics({ codePath: jsDir })
    expect(metricsResults['class-coupling'].status).toBeTruthy()

    const results = metricsResults['class-coupling'].result

    expect(results).toEqual(
      {
        [`${jsDir}/ACDeclaredWithMethods.js`]: {
          A: [
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a1'
              },
              computed: false,
              kind: 'method',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'B'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'bb'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'B'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b1'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                B: {
                  _constructor: 1
                }
              },
              'fan-in': {
                B: {
                  b1: 1,
                  _constructor: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a2'
              },
              computed: false,
              kind: 'method',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        init: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'B'
                          },
                          arguments: []
                        }
                      }
                    ],
                    kind: 'const'
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b2'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-in': {
                B: {
                  b2: 2,
                  _constructor: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'bbb'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'B'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bbb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b1'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bbb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bbb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'B'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'B'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-in': {
                B: {
                  b1: 2,
                  b2: 1,
                  _constructor: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'a3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'B'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'C'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'C'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-in': {
                B: {
                  _constructor: 2,
                  b3: 1
                }
              }
            }
          ],
          C: [
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'c'
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
              },
              'fan-in': {
                B: {
                  b3: 2
                },
                BDeclaredWithProperties: {
                  b3: 2
                }
              }
            }
          ]
        },
        [`${jsDir}/ACDeclaredWithProperties.js`]: {
          ADeclaredWithProperties: [
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a1'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b'
                          }
                        },
                        right: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'BDeclaredWithProperties'
                          },
                          arguments: []
                        }
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bb'
                          }
                        },
                        right: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'BDeclaredWithProperties'
                          },
                          arguments: []
                        }
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'bb'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'bb'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'bb'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b2'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-out': {
                BDeclaredWithProperties: {
                  _constructor: 1
                }
              },
              'fan-in': {
                BDeclaredWithProperties: {
                  b1: 2
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a2'
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
                  body: [
                    {
                      type: 'VariableDeclaration',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          init: {
                            type: 'NewExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'BDeclaredWithProperties'
                            },
                            arguments: []
                          }
                        }
                      ],
                      kind: 'const'
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b2'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b2'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'BDeclaredWithProperties'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b3'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'BDeclaredWithProperties'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b3'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-in': {
                BDeclaredWithProperties: {
                  b2: 2,
                  b1: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              'fan-in': {
                BDeclaredWithProperties: {
                  b2: 1,
                  _constructor: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'a3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'BDeclaredWithProperties'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'C'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'C'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-in': {
                BDeclaredWithProperties: {
                  b3: 1,
                  b2: 2
                }
              }
            }
          ],
          C: [
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'c'
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
                name: 'c1'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'a'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'ADeclaredWithProperties'
                        },
                        arguments: []
                      }
                    }
                  }
                ]
              }
            }
          ]
        },
        [`${jsDir}/ACExpressedWithMethods.js`]: {
          AExpressedWithMethods: [
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a1'
              },
              computed: false,
              kind: 'method',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'BExpressedWithMethods'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'bb'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'BExpressedWithMethods'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b1'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                BExpressedWithMethods: {
                  _constructor: 1
                }
              },
              'fan-in': {
                BExpressedWithMethods: {
                  b1: 1,
                  _constructor: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a2'
              },
              computed: false,
              kind: 'method',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        init: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'BExpressedWithMethods'
                          },
                          arguments: []
                        }
                      }
                    ],
                    kind: 'const'
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b2'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-in': {
                BExpressedWithMethods: {
                  b2: 2,
                  _constructor: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'bbb'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'BExpressedWithMethods'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bbb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b1'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bbb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bbb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'BExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'BExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-in': {
                BExpressedWithMethods: {
                  b1: 2,
                  b2: 1,
                  _constructor: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'a3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'BExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'CExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'CExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-in': {
                BExpressedWithMethods: {
                  _constructor: 2,
                  b3: 1
                }
              }
            }
          ],
          CExpressedWithMethods: [
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'c'
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
              },
              'fan-in': {
                BExpressedWithMethods: {
                  b3: 2
                }
              }
            }
          ]
        },
        [`${jsDir}/ACExpressedWithProperties.js`]: {
          AExpressedWithProperties: [
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a1'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b'
                          }
                        },
                        right: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'BExpressedWithProperties'
                          },
                          arguments: []
                        }
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bb'
                          }
                        },
                        right: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'BExpressedWithProperties'
                          },
                          arguments: []
                        }
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'bb'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'bb'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'bb'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b2'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-out': {
                BExpressedWithProperties: {
                  _constructor: 1
                }
              },
              'fan-in': {
                BExpressedWithProperties: {
                  b1: 2
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a2'
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
                  body: [
                    {
                      type: 'VariableDeclaration',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          init: {
                            type: 'NewExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'BExpressedWithProperties'
                            },
                            arguments: []
                          }
                        }
                      ],
                      kind: 'const'
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b2'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b2'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'BExpressedWithProperties'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b3'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'BExpressedWithProperties'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'b3'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-in': {
                BExpressedWithProperties: {
                  b2: 2,
                  b1: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              'fan-in': {
                BExpressedWithProperties: {
                  b2: 1,
                  _constructor: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'a3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'BExpressedWithProperties'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'CExpressedWithProperties'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'CExpressedWithProperties'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-in': {
                BExpressedWithProperties: {
                  b3: 1,
                  b2: 2
                }
              }
            }
          ],
          CExpressedWithProperties: [
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'c'
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
              },
              'fan-in': {
                BExpressedWithProperties: {
                  b3: 2
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'c1'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'a'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'BExpressedWithProperties'
                        },
                        arguments: []
                      }
                    }
                  }
                ]
              }
            }
          ]
        },
        [`${jsDir}/AExportDefault.js`]: {
          AExportDefault: [
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a1'
              },
              computed: false,
              kind: 'method',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'BExportDefault'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'bb'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'BExportDefault'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b1'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                BExportDefault: {
                  _constructor: 3,
                  b1: 1
                }
              },
              'fan-in': {
                BExportDefault: {
                  b1: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a2'
              },
              computed: false,
              kind: 'method',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        init: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'BExportDefault'
                          },
                          arguments: []
                        }
                      }
                    ],
                    kind: 'const'
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b2'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                BExportDefault: {
                  _constructor: 1,
                  b2: 1
                }
              },
              'fan-in': {
                BExportDefault: {
                  b1: 1,
                  b2: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'bbb'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'BExportDefault'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bbb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b1'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bbb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'bbb'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'BExportDefault'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'BExportDefault'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                BExportDefault: {
                  b1: 1,
                  b2: 2,
                  b3: 2
                }
              },
              'fan-in': {
                BExportDefault: {
                  b1: 2,
                  b2: 1,
                  _constructor: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'a3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'BExportDefault'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b3'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                BExportDefault: {
                  b3: 1
                }
              },
              'fan-in': {
                BExportDefault: {
                  b2: 2,
                  b3: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a4'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'BExportDefault'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'b4'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                BExportDefault: {
                  b4: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'a5'
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
              },
              'fan-in': {
                BExportDefault: {
                  b5: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'a6'
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
              },
              'fan-in': {
                BExportDefault: {
                  b6: 1
                }
              }
            }
          ]
        },
        [`${jsDir}/BExportDefault.js`]: {
          BExportDefault: [
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b5'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'AExportDefault'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a5'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-out': {
                AExportDefault: {
                  a5: 1,
                  _constructor: 1
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b6'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aaa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a6'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-out': {
                AExportDefault: {
                  a6: 1
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b1'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a'
                          }
                        },
                        right: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'AExportDefault'
                          },
                          arguments: []
                        }
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'aa'
                          }
                        },
                        right: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'AExportDefault'
                          },
                          arguments: []
                        }
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-in': {
                AExportDefault: {
                  a1: 1,
                  _constructor: 1
                }
              },
              'fan-out': {
                AExportDefault: {
                  _constructor: 2,
                  a1: 2,
                  a2: 1
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b2'
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
                  body: [
                    {
                      type: 'VariableDeclaration',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          init: {
                            type: 'NewExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'AExportDefault'
                            },
                            arguments: []
                          }
                        }
                      ],
                      kind: 'const'
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'AExportDefault'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a3'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'AExportDefault'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a3'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-in': {
                AExportDefault: {
                  a2: 1,
                  _constructor: 2
                }
              },
              'fan-out': {
                AExportDefault: {
                  _constructor: 1,
                  a2: 2,
                  a3: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'aaa'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'AExportDefault'
                        },
                        arguments: []
                      }
                    }
                  }
                ]
              },
              'fan-in': {
                AExportDefault: {
                  a1: 2,
                  a2: 1,
                  _constructor: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'b3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'AExportDefault'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a3'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-in': {
                AExportDefault: {
                  _constructor: 2,
                  a3: 1
                }
              },
              'fan-out': {
                AExportDefault: {
                  a3: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'b4'
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
              },
              'fan-in': {
                AExportDefault: {
                  a4: 1
                }
              }
            }
          ]
        },
        [`${jsDir}/BDeclaredWithMethods.js`]: {
          B: [
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b1'
              },
              computed: false,
              kind: 'method',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'A'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'aa'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'A'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a1'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                A: {
                  _constructor: 3,
                  a1: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b2'
              },
              computed: false,
              kind: 'method',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        init: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'A'
                          },
                          arguments: []
                        }
                      }
                    ],
                    kind: 'const'
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a2'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                A: {
                  _constructor: 1,
                  a2: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'aaa'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'A'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'aaa'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a1'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'aaa'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'aaa'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'A'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'A'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a3'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                A: {
                  a1: 1,
                  a2: 2,
                  a3: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'b3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'A'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'C'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'C'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                A: {
                  a3: 1
                },
                C: {
                  c: 2
                }
              }
            }
          ]
        },
        [`${jsDir}/BDeclaredWithProperties.js`]: {
          BDeclaredWithProperties: [
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'b3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'ADeclaredWithProperties'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'C'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'C'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                ADeclaredWithProperties: {
                  a3: 1,
                  _constructor: 2
                },
                C: {
                  c: 2
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b2'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'ADeclaredWithProperties'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a3'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'ADeclaredWithProperties'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a3'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'VariableDeclaration',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          init: {
                            type: 'NewExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'ADeclaredWithProperties'
                            },
                            arguments: []
                          }
                        }
                      ],
                      kind: 'const'
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-out': {
                ADeclaredWithProperties: {
                  a3: 2,
                  _constructor: 1,
                  a2: 2
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b1'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-out': {
                ADeclaredWithProperties: {
                  a1: 2,
                  a2: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'ADeclaredWithProperties'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'aa'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'ADeclaredWithProperties'
                        },
                        arguments: []
                      }
                    }
                  }
                ]
              }
            }
          ]
        },
        [`${jsDir}/BExpressedWithMethods.js`]: {
          BExpressedWithMethods: [
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b1'
              },
              computed: false,
              kind: 'method',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'AExpressedWithMethods'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'aa'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'AExpressedWithMethods'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a1'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                AExpressedWithMethods: {
                  _constructor: 3,
                  a1: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b2'
              },
              computed: false,
              kind: 'method',
              id: null,
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        init: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'AExpressedWithMethods'
                          },
                          arguments: []
                        }
                      }
                    ],
                    kind: 'const'
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a2'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                AExpressedWithMethods: {
                  _constructor: 1,
                  a2: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'aaa'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'AExpressedWithMethods'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'aaa'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a1'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'aaa'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'aaa'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a2'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'AExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'AExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a3'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                AExpressedWithMethods: {
                  a1: 1,
                  a2: 2,
                  a3: 2
                }
              }
            },
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'b3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'AExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'CExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'CExpressedWithMethods'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                AExpressedWithMethods: {
                  a3: 1
                },
                CExpressedWithMethods: {
                  c: 2
                }
              }
            }
          ]
        },
        [`${jsDir}/BExpressedWithProperties.js`]: {
          BExpressedWithProperties: [
            {
              type: 'ClassMethod',
              static: true,
              key: {
                type: 'Identifier',
                name: 'b3'
              },
              computed: false,
              kind: 'method',
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
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'AExpressedWithProperties'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a3'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'CExpressedWithProperties'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'CExpressedWithProperties'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                AExpressedWithProperties: {
                  a3: 1,
                  _constructor: 2
                },
                CExpressedWithProperties: {
                  c: 2
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b2'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'AExpressedWithProperties'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a3'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'AExpressedWithProperties'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a3'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'VariableDeclaration',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          init: {
                            type: 'NewExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'AExpressedWithProperties'
                            },
                            arguments: []
                          }
                        }
                      ],
                      kind: 'const'
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-out': {
                AExpressedWithProperties: {
                  a3: 2,
                  _constructor: 1,
                  a2: 2
                }
              }
            },
            {
              type: 'ClassProperty',
              static: false,
              key: {
                type: 'Identifier',
                name: 'b1'
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
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a1'
                          }
                        },
                        arguments: []
                      }
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'aa'
                            }
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'a2'
                          }
                        },
                        arguments: []
                      }
                    }
                  ]
                }
              },
              'fan-out': {
                AExpressedWithProperties: {
                  a1: 2,
                  a2: 1
                }
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'AExpressedWithProperties'
                        },
                        arguments: []
                      }
                    }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'aa'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'AExpressedWithProperties'
                        },
                        arguments: []
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    )
  })

  it('Metric result contains TS src testing file', async () => {
    const metricsResults = await calculateMetrics({ codePath: tsDir })
    expect(metricsResults['class-coupling'].status).toBeTruthy()

    const results = metricsResults['class-coupling'].result

    expect(results).toEqual(
      {
        [`${tsDir}/DeclaredClass.ts`]: {
          DeclaredClass: [
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'declaredMethod'
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
              },
              'fan-in': {
                ExpressedClass: {
                  expressedMethod: 2
                }
              }
            }
          ]
        },
        [`${tsDir}/ExpressedClass.ts`]: {
          ExpressedClass: [
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'constructor'
              },
              computed: false,
              kind: 'constructor',
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
                      type: 'AssignmentExpression',
                      operator: '=',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ThisExpression'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'declaredClass'
                        }
                      },
                      right: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'DeclaredClass'
                        },
                        arguments: []
                      }
                    }
                  }
                ]
              }
            },
            {
              type: 'ClassMethod',
              static: false,
              key: {
                type: 'Identifier',
                name: 'expressedMethod'
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
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'MemberExpression',
                          object: {
                            type: 'ThisExpression'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'declaredClass'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'declaredMethod'
                        }
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'VariableDeclaration',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'dClass'
                        },
                        init: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'DeclaredClass'
                          },
                          arguments: []
                        }
                      }
                    ],
                    kind: 'const'
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'dClass'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'declaredMethod'
                        }
                      },
                      arguments: []
                    }
                  }
                ]
              },
              'fan-out': {
                DeclaredClass: {
                  declaredMethod: 2
                }
              }
            }
          ]
        }
      }
    )
  })
})
