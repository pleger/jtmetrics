// Auto-generated file for Service Worker-safe metric loading (no eval/import())
self.__JTMETRICS_METRIC_FACTORIES = self.__JTMETRICS_METRIC_FACTORIES || {}

self.__JTMETRICS_METRIC_FACTORIES["files"] = function () {
const state = {
  name: 'Files on Repository',
  description: 'Collects and records all source files in the repository by their path.',
  result: {},
  id: 'files',
  status: false
}

const visitors = {
  /* Examples:
     /src/file.js
     /src/utils/helper.ts
  */
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}
  }
}

// Clean up state before finishing
function postProcessing (state) {
  delete state.currentFile

  const keys = Object.keys(state.result)
  state.result = keys.filter(k => !/^\d+$/.test(k))

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["functions-per-file"] = function () {
const state = {
  name: 'Functions Per File',
  description: 'Records all named functions in each source file, mapping function names to their AST node',
  result: {},
  id: 'functions-per-file',
  dependencies: ['files'],
  status: false
}

const visitors = {
  // Entry point for each parsed file, load dependency and create functions array for each file
  Program (path) {
    state.currentFile = path.node.filePath
    state.result = state.dependencies.files
    state.result[state.currentFile] = {}
  },

  /* Examples:
     function foo() {}
     async function bar() {}
  */
  FunctionDeclaration (path) {
    if (!path.node.id || !path.node.id.name) return

    const functionName = path.node.id.name

    state.result[state.currentFile][functionName] = path.node
  },

  /* Examples:
     const baz = function() {}
     const qux = async function() {}
  */
  FunctionExpression (path) {
    let functionName = ''

    if (path.parentPath.node.type === 'VariableDeclarator' && path.parentPath.node.id.name) {
      functionName = path.parentPath.node.id.name
    } else return

    state.result[state.currentFile][functionName] = path.node
  },

  /* Examples:
     const add = () => {}
     items.map(item => item.value)
  */
  ArrowFunctionExpression (path) {
    if (!path.parentPath.node.id || !path.parentPath.node.id.name) return

    const functionName = path.parentPath.node.id.name

    state.result[state.currentFile][functionName] = path.node
  }
}

// Clean up state before finishing
function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["function-coupling"] = function () {
const getExt = (filePath) => {
  const fileIndex = filePath.lastIndexOf('/')
  const dotIndex = filePath.lastIndexOf('.')
  if (dotIndex <= fileIndex) return ''
  return filePath.slice(dotIndex).toLowerCase()
}

const state = {
  name: 'Function Coupling',
  description: 'Measures function-level coupling by recording Fan-In and Fan-Out relationships between functions',
  result: {},
  id: 'function-coupling',
  dependencies: ['functions-per-file'],
  status: false
}

const visitors = {
  // Entry point for each parsed file, load dependency and create functions array for each file
  Program (path) {
    state.currentFile = path.node.filePath
    state.result = state.dependencies['functions-per-file']
  },

  /* Examples:
     function foo() {}
     async function bar() {}
  */
  FunctionDeclaration (path) {
    if (!path.node.id || !path.node.id.name) return

    const callerFunction = path.node.id.name

    path.traverse({
      CallExpression (innerPath) {
        if (!innerPath.node.callee.name) {
          return
        }

        const calleeFunction = innerPath.node.callee.name
        let calleeFilePath = ''

        for (const filePath in state.dependencies['functions-per-file']) {
          const functions = state.dependencies['functions-per-file'][filePath]
          for (const functionName in functions) {
            if (calleeFunction === functionName && (getExt(filePath) === getExt(state.currentFile))) {
              calleeFilePath = filePath
            }
          }
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out']) {
          state.result[state.currentFile][callerFunction]['fan-out'] = {}
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]) {
          state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction] = 0
        }

        state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]++

        if (!state.result[calleeFilePath][calleeFunction]['fan-in']) {
          state.result[calleeFilePath][calleeFunction]['fan-in'] = {}
        }

        if (!state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]) {
          state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction] = 0
        }

        state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]++
      }
    })
  },

  /* Examples:
     const baz = function() {}
     const qux = async function() {}
  */
  FunctionExpression (path) {
    let callerFunction = ''

    if (path.parentPath.node.type === 'VariableDeclarator' && path.parentPath.node.id.name) {
      callerFunction = path.parentPath.node.id.name
    } else return

    path.traverse({
      CallExpression (innerPath) {
        if (!innerPath.node.callee.name) {
          return
        }

        const calleeFunction = innerPath.node.callee.name
        let calleeFilePath = ''

        for (const filePath in state.dependencies['functions-per-file']) {
          const functions = state.dependencies['functions-per-file'][filePath]
          for (const functionName in functions) {
            if (calleeFunction === functionName && (getExt(filePath) === getExt(state.currentFile))) {
              calleeFilePath = filePath
            }
          }
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out']) {
          state.result[state.currentFile][callerFunction]['fan-out'] = {}
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]) {
          state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction] = 0
        }

        state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]++

        if (!state.result[calleeFilePath][calleeFunction]['fan-in']) {
          state.result[calleeFilePath][calleeFunction]['fan-in'] = {}
        }

        if (!state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]) {
          state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction] = 0
        }

        state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]++
      }
    })
  },

  /* Examples:
     const add = () => {}
     items.map(item => item.value)
  */
  ArrowFunctionExpression (path) {
    if (!path.parentPath.node.id || !path.parentPath.node.id.name) return

    const callerFunction = path.parentPath.node.id.name

    path.traverse({
      CallExpression (innerPath) {
        if (!innerPath.node.callee.name) {
          return
        }

        const calleeFunction = innerPath.node.callee.name
        let calleeFilePath = ''

        for (const filePath in state.dependencies['functions-per-file']) {
          const functions = state.dependencies['functions-per-file'][filePath]
          for (const functionName in functions) {
            if (calleeFunction === functionName && (getExt(filePath) === getExt(state.currentFile))) {
              calleeFilePath = filePath
            }
          }
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out']) {
          state.result[state.currentFile][callerFunction]['fan-out'] = {}
        }

        if (!state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]) {
          state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction] = 0
        }

        state.result[state.currentFile][callerFunction]['fan-out'][calleeFunction]++

        if (!state.result[calleeFilePath][calleeFunction]['fan-in']) {
          state.result[calleeFilePath][calleeFunction]['fan-in'] = {}
        }

        if (!state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]) {
          state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction] = 0
        }

        state.result[calleeFilePath][calleeFunction]['fan-in'][callerFunction]++
      }
    })
  }
}

// Clean up state before finishing
function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["function-dependency-summary"] = function () {
function sumValues (obj) {
  return Object.values(obj).reduce((acc, value) => acc + value, 0)
}

const state = {
  name: 'Function Dependency Summary',
  description: 'Aggregates fan-in and fan-out dependency totals for each named function',
  result: {},
  id: 'function-dependency-summary',
  dependencies: ['function-coupling'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}

    const functionCouplingResult = state.dependencies['function-coupling'][state.currentFile] || {}

    for (const [functionName, functionNode] of Object.entries(functionCouplingResult)) {
      const fanInMap = functionNode['fan-in'] || {}
      const fanOutMap = functionNode['fan-out'] || {}
      const fanInCalls = sumValues(fanInMap)
      const fanOutCalls = sumValues(fanOutMap)

      state.result[state.currentFile][functionName] = {
        type: functionNode.type,
        fanInCalls,
        fanOutCalls,
        fanInFunctions: Object.keys(fanInMap).length,
        fanOutFunctions: Object.keys(fanOutMap).length,
        dependencyScore: fanInCalls + fanOutCalls
      }
    }
  }
}

function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["classes-per-file"] = function () {
const state = {
  name: 'Classes Per File',
  description: 'Analyzes each source file to identify and record all top-level classes defined',
  result: {},
  id: 'classes-per-file',
  dependencies: ['files'],
  status: false
}

const visitors = {
  // Entry point for each parsed file, load dependency
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = state.dependencies.files[state.currentFile]
  },

  ClassDeclaration (path) {
    const node = path.node
    const parentPath = path.parentPath

    /* Examples:
       class Calculator {}
       class AdvancedCalculator extends Calculator {}

       parentPath.node.type === 'Program' -> Consider only file block class declarations
       Ignore: (() => { <Class_declaration_here> })();
    */
    if (node.id &&
      node.id.name &&
      parentPath.node.type === 'Program' ||
      parentPath.node.type === 'ExportNamedDeclaration'
    ) {
      /* Ignore:
         class SuperCalculator extends class{} {}
      */
      if (node.superClass &&
        node.superClass.type === 'ClassExpression'
      ) {
        return
      }

      const className = node.id.name
      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
             innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })

      return
    }

    /* Examples:
       export default class {}
       export default class Foo{}
    */
    if (parentPath.node.type === 'ExportDefaultDeclaration') {
      // Classes with default export will be referenced by the name of the file
      const className = path.node.id
        ? path.node.id.name
        : state.currentFile.split('/').pop().replace(/\.(js|ts)$/, '')

      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })
    }
  },

  ClassExpression (path) {
    const node = path.node
    const parentPath = path.parentPath

    /* Examples:
       const Logger = class {}
    */
    if (parentPath.node.type === 'VariableDeclarator' &&
      parentPath.node.id &&
      parentPath.node.id.name
    ) {
      /* Ignore:
         (() => { <Class_expression_here> })();
      */
      if (parentPath.find(p => p.isCallExpression())) {
        return
      }

      /* Ignore:
         class SuperCalculator extends class {}
      */
      if (node.superClass &&
        node.superClass.type === 'ClassExpression'
      ) {
        return
      }

      const className = parentPath.node.id.name
      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })

      return
    }

    /* Examples:
       { ['LiteralClassName']: class {} }
    */
    if (parentPath.node.type === 'ObjectProperty' &&
      parentPath.node.key &&
      parentPath.node.key.type === 'StringLiteral'
    ) {
      const className = parentPath.node.key.value
      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })

      return
    }

    /* Examples:
       { Printer: class {} }
    */
    if (parentPath.node.type === 'ObjectProperty' &&
      parentPath.node.key &&
      parentPath.node.key.type === 'Identifier' &&
      parentPath.node.computed === false
    ) {
      const className = parentPath.node.key.name
      state.result[state.currentFile][className] = []

      path.traverse({
        ClassMethod (innerPath) {
          state.result[state.currentFile][className].push(innerPath.node)
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            state.result[state.currentFile][className].push(innerPath.node)
          }
        }
      })
    }
  }
}

function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["class-coupling"] = function () {
const state = {
  name: 'Class Coupling',
  description: 'Analyzes each class to identify Fan-Out and Fan-In',
  result: {},
  id: 'class-coupling',
  dependencies: ['classes-per-file', 'instance-mapper'],
  status: false
}

const visitors = {
  // Entry point for each parsed file, load dependency
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = state.dependencies['classes-per-file'][state.currentFile]
  },

  ClassDeclaration (path) {
    const node = path.node
    const parentPath = path.parentPath

    /* Examples:
       class Calculator {}
       class AdvancedCalculator extends Calculator {}

       parentPath.node.type === 'Program' -> Consider only file block class declarations
       Ignore: (() => { <Class_declaration_here> })();
    */
    if (node.id &&
      node.id.name &&
      parentPath.node.type === 'Program' ||
      parentPath.node.type === 'ExportNamedDeclaration'
    ) {
      /* Ignore:
         class SuperCalculator extends class{} {}
      */
      if (node.superClass &&
        node.superClass.type === 'ClassExpression'
      ) {
        return
      }

      const callerClass = node.id.name

      path.traverse({
        ClassMethod (innerPath) {
          innerPath.traverse({
            NewExpression (deepPath) {
              /* Example:
              new ClassF();

              Fan-Out to 'constructor' method (renamed _constructor to avoid constructor default property of objects)
              */
              let callerMethod = innerPath.node.key.name

              const calleeClass = deepPath.node.callee.name
              const calleeMethod = '_constructor' // Because we are in NewExpression
              let calleeMethodIndex = 0
              let calleeFilepath = ''
              let found = false

              // Search the callee method position
              for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                // If the target class exists in this file
                if (classes[calleeClass]) {
                  // Check each method node in that class
                  for (const methodNode of classes[calleeClass]) {
                    if (methodNode.kind === 'constructor') {
                      found = true
                      calleeFilepath = filePath
                      break
                    }
                    calleeMethodIndex++
                  }
                  break
                }
              }

              let callerMethodIndex = 0
              for (const methodNode of state.result[state.currentFile][callerClass]) {
                if (callerMethod === 'constructor') {
                  // _constructor to avoid constructor default property of objects
                  callerMethod = '_constructor'
                  break
                }

                const possible = methodNode.key?.name
                if (callerMethod === possible) break
                callerMethodIndex++
              }

              if (found && calleeFilepath) {
                if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                }

                if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                }

                if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                }

                state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                }

                if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                }

                if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                }

                state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
              }
            },

            CallExpression (deepPath) {
              /* Example:
              ClassF.foo()
              myCar.start(); (Constant/Variable instance call)
              */
              if (deepPath.node.callee.type === 'MemberExpression' &&
                deepPath.node.callee.object.type === 'Identifier' &&
                deepPath.node.callee.property.type === 'Identifier'
              ) {
                let callerMethod = innerPath.node.key.name

                let calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][deepPath.node.callee.object.name]

                if (calleeClass === undefined) {
                  calleeClass = deepPath.node.callee.object.name
                }

                const calleeMethod = deepPath.node.callee.property.name

                let found = false
                let calleeMethodIndex = 0
                let calleeFilepath = ''

                for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                  // If the target class exists in this file
                  if (classes[calleeClass]) {
                    // Check each method node in that class
                    for (const methodNode of classes[calleeClass]) {
                      const possibleCalleeMethod = methodNode.key &&
                        methodNode.key.name
                      if (calleeMethod === possibleCalleeMethod) {
                        found = true
                        calleeFilepath = filePath
                        break
                      }
                      calleeMethodIndex++
                    }
                    break
                  }
                }

                let callerMethodIndex = 0

                // Search method node
                for (const methodNode of state.result[state.currentFile][callerClass]) {
                  const possibleCallerMethod = methodNode.key &&
                    methodNode.key.name
                  if (callerMethod === possibleCallerMethod) {
                    break
                  }
                  callerMethodIndex++
                }

                if (callerMethod ===
                  'constructor') callerMethod = '_constructor'

                if (found && calleeFilepath) {
                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                  }

                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                  }

                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                }
              }

              /* Example:
              this.car.start()

              This case counts property instances
              */
              if (deepPath.node.callee.type === 'MemberExpression' &&
                deepPath.node.callee.property.type === 'Identifier' &&
                deepPath.node.callee.object.type === 'MemberExpression' &&
                deepPath.node.callee.object.object.type === 'ThisExpression'
              ) {
                let callerMethod = innerPath.node.key.name

                const calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][`this.${deepPath.node.callee.object.property.name}`]
                const calleeMethod = deepPath.node.callee.property.name

                let count = false
                let calleeMethodIndex = 0
                let calleeFilepath = ''

                for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                  // If the target class exists in this file
                  if (classes[calleeClass]) {
                    // Check each method node in that class
                    for (const methodNode of classes[calleeClass]) {
                      const possibleCalleeMethod = methodNode.key &&
                        methodNode.key.name
                      if (calleeMethod === possibleCalleeMethod) {
                        count = true
                        calleeFilepath = filePath
                        break
                      }
                      calleeMethodIndex++
                    }
                    break
                  }
                }

                let callerMethodIndex = 0

                // Search method node
                for (const methodNode of state.result[state.currentFile][callerClass]) {
                  const possibleCallerMethod = methodNode.key &&
                    methodNode.key.name
                  if (callerMethod === possibleCallerMethod) {
                    break
                  }
                  callerMethodIndex++
                }

                if (callerMethod === 'constructor') callerMethod = '_constructor'

                if (count && calleeFilepath) {
                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                  }

                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                  }

                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                }
              }
            }
          })
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            innerPath.traverse({
              NewExpression (deepPath) {
                /* Example:
                new ClassF();

                Fan-Out to 'constructor' method (renamed _constructor to avoid constructor default property of objects)
                */
                const callerMethod = innerPath.node.key.name

                const calleeClass = deepPath.node.callee.name
                const calleeMethod = '_constructor' // Because we are in a NewExpression
                let calleeMethodIndex = 0
                let calleeFilepath = ''
                let found = false

                // Search the callee method position
                for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                  // If the target class exists in this file
                  if (classes[calleeClass]) {
                    // Check each method node in that class
                    for (const methodNode of classes[calleeClass]) {
                      if (methodNode.kind === 'constructor') {
                        found = true
                        calleeFilepath = filePath
                        break
                      }
                      calleeMethodIndex++
                    }
                    break
                  }
                }

                let callerMethodIndex = 0

                // Search method node
                for (const methodNode of state.result[state.currentFile][callerClass]) {
                  const possibleCallerMethod = methodNode.key && methodNode.key.name
                  if (callerMethod === possibleCallerMethod) {
                    break
                  }
                  callerMethodIndex++
                }

                if (found && calleeFilepath) {
                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                  }

                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                  }

                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                }
              },

              CallExpression (deepPath) {
                /* Example:
                ClassF.foo()
                myCar.start(); (Constant/Variable instance call)
                */
                if (deepPath.node.callee.type === 'MemberExpression' &&
                  deepPath.node.callee.object.type === 'Identifier' &&
                  deepPath.node.callee.property.type === 'Identifier'
                ) {
                  const callerMethod = innerPath.node.key.name

                  let calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][deepPath.node.callee.object.name]

                  if (calleeClass === undefined) {
                    calleeClass = deepPath.node.callee.object.name
                  }

                  const calleeMethod = deepPath.node.callee.property.name

                  let found = false
                  let calleeMethodIndex = 0
                  let calleeFilepath = ''

                  for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                    // If the target class exists in this file
                    if (classes[calleeClass]) {
                      // Check each method node in that class
                      for (const methodNode of classes[calleeClass]) {
                        const possibleCalleeMethod = methodNode.key &&
                          methodNode.key.name
                        if (calleeMethod === possibleCalleeMethod) {
                          found = true
                          calleeFilepath = filePath
                          break
                        }
                        calleeMethodIndex++
                      }
                      break
                    }
                  }

                  let callerMethodIndex = 0

                  // Search method node
                  for (const methodNode of state.result[state.currentFile][callerClass]) {
                    const possibleCallerMethod = methodNode.key &&
                      methodNode.key.name
                    if (callerMethod === possibleCallerMethod) {
                      break
                    }
                    callerMethodIndex++
                  }

                  if (found && calleeFilepath) {
                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                    }

                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                    }

                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                  }
                }

                /* Example:
                this.car.start()

                This case counts property instances
                */
                if (deepPath.node.callee.type === 'MemberExpression' &&
                  deepPath.node.callee.property.type === 'Identifier' &&
                  deepPath.node.callee.object.type === 'MemberExpression' &&
                  deepPath.node.callee.object.object.type === 'ThisExpression'
                ) {
                  const callerMethod = innerPath.node.key.name

                  const calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][`this.${deepPath.node.callee.object.property.name}`]
                  const calleeMethod = deepPath.node.callee.property.name

                  let found = false
                  let calleeMethodIndex = 0
                  let calleeFilepath = ''

                  for (const [filePath, classes] of Object.entries(state.result)) {
                    // If the target class exists in this file
                    if (classes[calleeClass]) {
                      // Check each method node in that class
                      for (const methodNode of classes[calleeClass]) {
                        const possibleCalleeMethod = methodNode.key &&
                          methodNode.key.name
                        if (calleeMethod === possibleCalleeMethod) {
                          found = true
                          calleeFilepath = filePath
                          break
                        }
                        calleeMethodIndex++
                      }
                      break
                    }
                  }

                  let callerMethodIndex = 0

                  // Search method node
                  for (const methodNode of state.result[state.currentFile][callerClass]) {
                    const possibleCallerMethod = methodNode.key && methodNode.key.name
                    if (callerMethod === possibleCallerMethod) {
                      break
                    }
                    callerMethodIndex++
                  }

                  if (found && calleeFilepath) {
                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                    }

                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                    }

                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                  }
                }
              }
            })
          }
        }
      })
    }

    /* Examples:
       export default class {}
       export default class Foo{}
    */
    if (parentPath.node.type === 'ExportDefaultDeclaration') {
      // Classes with default export will be referenced by the name of the file
      const callerClass = path.node.id
        ? path.node.id.name
        : state.currentFile.split('/').pop().replace(/\.(js|ts)$/, '')

      path.traverse({
        ClassMethod (innerPath) {
          innerPath.traverse({
            NewExpression (deepPath) {
              /* Example:
              new ClassF();

              Fan-Out to 'constructor' method (renamed _constructor to avoid constructor default property of objects)
              */
              let callerMethod = innerPath.node.key.name

              const calleeClass = deepPath.node.callee.name
              const calleeMethod = '_constructor' // Because we are in NewExpression
              let calleeMethodIndex = 0
              let calleeFilepath = ''
              let found = false

              // Search the callee method position
              for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                // If the target class exists in this file
                if (classes[calleeClass]) {
                  // Check each method node in that class
                  for (const methodNode of classes[calleeClass]) {
                    if (methodNode.kind === 'constructor') {
                      found = true
                      calleeFilepath = filePath
                      break
                    }
                    calleeMethodIndex++
                  }
                  break
                }
              }

              let callerMethodIndex = 0
              for (const methodNode of state.result[state.currentFile][callerClass]) {
                if (callerMethod === 'constructor') {
                  // _constructor to avoid constructor default property of objects
                  callerMethod = '_constructor'
                  break
                }

                const possible = methodNode.key?.name
                if (callerMethod === possible) break
                callerMethodIndex++
              }

              if (found && calleeFilepath) {
                if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                }

                if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                }

                if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                }

                state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                // TODO: Study this very special case
                if (!state.result[calleeFilepath]) {
                  state.result[calleeFilepath] = state.dependencies['classes-per-file'][calleeFilepath]
                }

                if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                }

                if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                }

                if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                }

                state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
              }
            },

            CallExpression (deepPath) {
              /* Example:
              ClassF.foo()
              myCar.start(); (Constant/Variable instance call)
              */
              if (deepPath.node.callee.type === 'MemberExpression' &&
                deepPath.node.callee.object.type === 'Identifier' &&
                deepPath.node.callee.property.type === 'Identifier'
              ) {
                let callerMethod = innerPath.node.key.name

                let calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][deepPath.node.callee.object.name]

                if (calleeClass === undefined) {
                  calleeClass = deepPath.node.callee.object.name
                }

                const calleeMethod = deepPath.node.callee.property.name

                let found = false
                let calleeMethodIndex = 0
                let calleeFilepath = ''

                for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                  // If the target class exists in this file
                  if (classes[calleeClass]) {
                    // Check each method node in that class
                    for (const methodNode of classes[calleeClass]) {
                      const possibleCalleeMethod = methodNode.key &&
                        methodNode.key.name
                      if (calleeMethod === possibleCalleeMethod) {
                        found = true
                        calleeFilepath = filePath
                        break
                      }
                      calleeMethodIndex++
                    }
                    break
                  }
                }

                let callerMethodIndex = 0

                // Search method node
                for (const methodNode of state.result[state.currentFile][callerClass]) {
                  const possibleCallerMethod = methodNode.key &&
                    methodNode.key.name
                  if (callerMethod === possibleCallerMethod) {
                    break
                  }
                  callerMethodIndex++
                }

                if (callerMethod ===
                  'constructor') callerMethod = '_constructor'

                if (found && calleeFilepath) {
                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                  }

                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                  }

                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                }
              }

              /* Example:
              this.car.start()

              This case counts property instances
              */
              if (deepPath.node.callee.type === 'MemberExpression' &&
                deepPath.node.callee.property.type === 'Identifier' &&
                deepPath.node.callee.object.type === 'MemberExpression' &&
                deepPath.node.callee.object.object.type === 'ThisExpression'
              ) {
                let callerMethod = innerPath.node.key.name

                const calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][`this.${deepPath.node.callee.object.property.name}`]
                const calleeMethod = deepPath.node.callee.property.name

                let count = false
                let calleeMethodIndex = 0
                let calleeFilepath = ''

                for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                  // If the target class exists in this file
                  if (classes[calleeClass]) {
                    // Check each method node in that class
                    for (const methodNode of classes[calleeClass]) {
                      const possibleCalleeMethod = methodNode.key &&
                        methodNode.key.name
                      if (calleeMethod === possibleCalleeMethod) {
                        count = true
                        calleeFilepath = filePath
                        break
                      }
                      calleeMethodIndex++
                    }
                    break
                  }
                }

                let callerMethodIndex = 0

                // Search method node
                for (const methodNode of state.result[state.currentFile][callerClass]) {
                  const possibleCallerMethod = methodNode.key &&
                    methodNode.key.name
                  if (callerMethod === possibleCallerMethod) {
                    break
                  }
                  callerMethodIndex++
                }

                if (callerMethod === 'constructor') callerMethod = '_constructor'

                if (count && calleeFilepath) {
                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                  }

                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                  }

                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                }
              }
            }
          })
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            innerPath.traverse({
              NewExpression (deepPath) {
                /* Example:
                new ClassF();

                Fan-Out to 'constructor' method (renamed _constructor to avoid constructor default property of objects)
                */
                const callerMethod = innerPath.node.key.name

                const calleeClass = deepPath.node.callee.name
                const calleeMethod = '_constructor' // Because we are in a NewExpression
                let calleeMethodIndex = 0
                let calleeFilepath = ''
                let found = false

                // Search the callee method position
                for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                  // If the target class exists in this file
                  if (classes[calleeClass]) {
                    // Check each method node in that class
                    for (const methodNode of classes[calleeClass]) {
                      if (methodNode.kind === 'constructor') {
                        found = true
                        calleeFilepath = filePath
                        break
                      }
                      calleeMethodIndex++
                    }
                    break
                  }
                }

                let callerMethodIndex = 0

                // Search method node
                for (const methodNode of state.result[state.currentFile][callerClass]) {
                  const possibleCallerMethod = methodNode.key && methodNode.key.name
                  if (callerMethod === possibleCallerMethod) {
                    break
                  }
                  callerMethodIndex++
                }

                if (found && calleeFilepath) {
                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                  }

                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                  }

                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                }
              },

              CallExpression (deepPath) {
                /* Example:
                ClassF.foo()
                myCar.start(); (Constant/Variable instance call)
                */
                if (deepPath.node.callee.type === 'MemberExpression' &&
                  deepPath.node.callee.object.type === 'Identifier' &&
                  deepPath.node.callee.property.type === 'Identifier'
                ) {
                  const callerMethod = innerPath.node.key.name

                  let calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][deepPath.node.callee.object.name]

                  if (calleeClass === undefined) {
                    calleeClass = deepPath.node.callee.object.name
                  }

                  const calleeMethod = deepPath.node.callee.property.name

                  let found = false
                  let calleeMethodIndex = 0
                  let calleeFilepath = ''

                  for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                    // If the target class exists in this file
                    if (classes[calleeClass]) {
                      // Check each method node in that class
                      for (const methodNode of classes[calleeClass]) {
                        const possibleCalleeMethod = methodNode.key &&
                          methodNode.key.name
                        if (calleeMethod === possibleCalleeMethod) {
                          found = true
                          calleeFilepath = filePath
                          break
                        }
                        calleeMethodIndex++
                      }
                      break
                    }
                  }

                  let callerMethodIndex = 0

                  // Search method node
                  for (const methodNode of state.result[state.currentFile][callerClass]) {
                    const possibleCallerMethod = methodNode.key &&
                      methodNode.key.name
                    if (callerMethod === possibleCallerMethod) {
                      break
                    }
                    callerMethodIndex++
                  }

                  if (found && calleeFilepath) {
                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                    }

                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                    }

                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                  }
                }

                /* Example:
                this.car.start()

                This case counts property instances
                */
                if (deepPath.node.callee.type === 'MemberExpression' &&
                  deepPath.node.callee.property.type === 'Identifier' &&
                  deepPath.node.callee.object.type === 'MemberExpression' &&
                  deepPath.node.callee.object.object.type === 'ThisExpression'
                ) {
                  const callerMethod = innerPath.node.key.name

                  const calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][`this.${deepPath.node.callee.object.property.name}`]
                  const calleeMethod = deepPath.node.callee.property.name

                  let found = false
                  let calleeMethodIndex = 0
                  let calleeFilepath = ''

                  for (const [filePath, classes] of Object.entries(state.result)) {
                    // If the target class exists in this file
                    if (classes[calleeClass]) {
                      // Check each method node in that class
                      for (const methodNode of classes[calleeClass]) {
                        const possibleCalleeMethod = methodNode.key &&
                          methodNode.key.name
                        if (calleeMethod === possibleCalleeMethod) {
                          found = true
                          calleeFilepath = filePath
                          break
                        }
                        calleeMethodIndex++
                      }
                      break
                    }
                  }

                  let callerMethodIndex = 0

                  // Search method node
                  for (const methodNode of state.result[state.currentFile][callerClass]) {
                    const possibleCallerMethod = methodNode.key && methodNode.key.name
                    if (callerMethod === possibleCallerMethod) {
                      break
                    }
                    callerMethodIndex++
                  }

                  if (found && calleeFilepath) {
                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                    }

                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                    }

                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                  }
                }
              }
            })
          }
        }
      })
    }
  },

  ClassExpression (path) {
    const node = path.node
    const parentPath = path.parentPath

    /* Examples:
       const Logger = class {}
    */
    if (parentPath.node.type === 'VariableDeclarator' &&
      parentPath.node.id &&
      parentPath.node.id.name
    ) {
      /* Ignore:
         (() => { <Class_expression_here> })();
      */
      if (parentPath.find(p => p.isCallExpression())) {
        return
      }

      /* Ignore:
         class SuperCalculator extends class {}
      */
      if (node.superClass &&
        node.superClass.type === 'ClassExpression'
      ) {
        return
      }

      const callerClass = parentPath.node.id.name

      path.traverse({
        ClassMethod (innerPath) {
          innerPath.traverse({
            NewExpression (deepPath) {
              /* Example:
              new ClassF();

              Fan-Out to 'constructor' method (renamed _constructor to avoid constructor default property of objects)
              */
              let callerMethod = innerPath.node.key.name

              const calleeClass = deepPath.node.callee.name
              const calleeMethod = '_constructor' // Because we are in NewExpression
              let calleeMethodIndex = 0
              let calleeFilepath = ''
              let found = false

              // Search the callee method position
              for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                // If the target class exists in this file
                if (classes[calleeClass]) {
                  // Check each method node in that class
                  for (const methodNode of classes[calleeClass]) {
                    if (methodNode.kind === 'constructor') {
                      found = true
                      calleeFilepath = filePath
                      break
                    }
                    calleeMethodIndex++
                  }
                  break
                }
              }

              let callerMethodIndex = 0
              for (const methodNode of state.result[state.currentFile][callerClass]) {
                if (callerMethod === 'constructor') {
                  // _constructor to avoid constructor default property of objects
                  callerMethod = '_constructor'
                  break
                }

                const possible = methodNode.key?.name
                if (callerMethod === possible) break
                callerMethodIndex++
              }

              if (found && calleeFilepath) {
                if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                }

                if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                }

                if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                }

                state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                }

                if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                }

                if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                }

                state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
              }
            },

            CallExpression (deepPath) {
              /* Example:
              ClassF.foo()
              myCar.start(); (Constant/Variable instance call)
              */
              if (deepPath.node.callee.type === 'MemberExpression' &&
                deepPath.node.callee.object.type === 'Identifier' &&
                deepPath.node.callee.property.type === 'Identifier'
              ) {
                let callerMethod = innerPath.node.key.name

                let calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][deepPath.node.callee.object.name]

                if (calleeClass === undefined) {
                  calleeClass = deepPath.node.callee.object.name
                }

                const calleeMethod = deepPath.node.callee.property.name

                let found = false
                let calleeMethodIndex = 0
                let calleeFilepath = ''

                for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                  // If the target class exists in this file
                  if (classes[calleeClass]) {
                    // Check each method node in that class
                    for (const methodNode of classes[calleeClass]) {
                      const possibleCalleeMethod = methodNode.key &&
                        methodNode.key.name
                      if (calleeMethod === possibleCalleeMethod) {
                        found = true
                        calleeFilepath = filePath
                        break
                      }
                      calleeMethodIndex++
                    }
                    break
                  }
                }

                let callerMethodIndex = 0

                // Search method node
                for (const methodNode of state.result[state.currentFile][callerClass]) {
                  const possibleCallerMethod = methodNode.key &&
                    methodNode.key.name
                  if (callerMethod === possibleCallerMethod) {
                    break
                  }
                  callerMethodIndex++
                }

                if (callerMethod ===
                  'constructor') callerMethod = '_constructor'

                if (found && calleeFilepath) {
                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                  }

                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                  }

                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                }
              }

              /* Example:
              this.car.start()

              This case counts property instances
              */
              if (deepPath.node.callee.type === 'MemberExpression' &&
                deepPath.node.callee.property.type === 'Identifier' &&
                deepPath.node.callee.object.type === 'MemberExpression' &&
                deepPath.node.callee.object.object.type === 'ThisExpression'
              ) {
                let callerMethod = innerPath.node.key.name

                const calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][`this.${deepPath.node.callee.object.property.name}`]
                const calleeMethod = deepPath.node.callee.property.name

                let count = false
                let calleeMethodIndex = 0
                let calleeFilepath = ''

                for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                  // If the target class exists in this file
                  if (classes[calleeClass]) {
                    // Check each method node in that class
                    for (const methodNode of classes[calleeClass]) {
                      const possibleCalleeMethod = methodNode.key &&
                        methodNode.key.name
                      if (calleeMethod === possibleCalleeMethod) {
                        count = true
                        calleeFilepath = filePath
                        break
                      }
                      calleeMethodIndex++
                    }
                    break
                  }
                }

                let callerMethodIndex = 0

                // Search method node
                for (const methodNode of state.result[state.currentFile][callerClass]) {
                  const possibleCallerMethod = methodNode.key &&
                    methodNode.key.name
                  if (callerMethod === possibleCallerMethod) {
                    break
                  }
                  callerMethodIndex++
                }

                if (callerMethod === 'constructor') callerMethod = '_constructor'

                if (count && calleeFilepath) {
                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                  }

                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                  }

                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                }
              }
            }
          })
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            innerPath.traverse({
              NewExpression (deepPath) {
                /* Example:
                new ClassF();

                Fan-Out to 'constructor' method (renamed _constructor to avoid constructor default property of objects)
                */
                const callerMethod = innerPath.node.key.name

                const calleeClass = deepPath.node.callee.name
                const calleeMethod = '_constructor' // Because we are in a NewExpression
                let calleeMethodIndex = 0
                let calleeFilepath = ''
                let found = false

                // Search the callee method position
                for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                  // If the target class exists in this file
                  if (classes[calleeClass]) {
                    // Check each method node in that class
                    for (const methodNode of classes[calleeClass]) {
                      if (methodNode.kind === 'constructor') {
                        found = true
                        calleeFilepath = filePath
                        break
                      }
                      calleeMethodIndex++
                    }
                    break
                  }
                }

                let callerMethodIndex = 0

                // Search method node
                for (const methodNode of state.result[state.currentFile][callerClass]) {
                  const possibleCallerMethod = methodNode.key && methodNode.key.name
                  if (callerMethod === possibleCallerMethod) {
                    break
                  }
                  callerMethodIndex++
                }

                if (found && calleeFilepath) {
                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                  }

                  if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                  }

                  state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                  }

                  if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                  }

                  state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                }
              },

              CallExpression (deepPath) {
                /* Example:
                ClassF.foo()
                myCar.start(); (Constant/Variable instance call)
                */
                if (deepPath.node.callee.type === 'MemberExpression' &&
                  deepPath.node.callee.object.type === 'Identifier' &&
                  deepPath.node.callee.property.type === 'Identifier'
                ) {
                  const callerMethod = innerPath.node.key.name

                  let calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][deepPath.node.callee.object.name]

                  if (calleeClass === undefined) {
                    calleeClass = deepPath.node.callee.object.name
                  }

                  const calleeMethod = deepPath.node.callee.property.name

                  let found = false
                  let calleeMethodIndex = 0
                  let calleeFilepath = ''

                  for (const [filePath, classes] of Object.entries(state.dependencies['classes-per-file'])) {
                    // If the target class exists in this file
                    if (classes[calleeClass]) {
                      // Check each method node in that class
                      for (const methodNode of classes[calleeClass]) {
                        const possibleCalleeMethod = methodNode.key &&
                          methodNode.key.name
                        if (calleeMethod === possibleCalleeMethod) {
                          found = true
                          calleeFilepath = filePath
                          break
                        }
                        calleeMethodIndex++
                      }
                      break
                    }
                  }

                  let callerMethodIndex = 0

                  // Search method node
                  for (const methodNode of state.result[state.currentFile][callerClass]) {
                    const possibleCallerMethod = methodNode.key &&
                      methodNode.key.name
                    if (callerMethod === possibleCallerMethod) {
                      break
                    }
                    callerMethodIndex++
                  }

                  if (found && calleeFilepath) {
                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                    }

                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                    }

                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                  }
                }

                /* Example:
                this.car.start()

                This case counts property instances
                */
                if (deepPath.node.callee.type === 'MemberExpression' &&
                  deepPath.node.callee.property.type === 'Identifier' &&
                  deepPath.node.callee.object.type === 'MemberExpression' &&
                  deepPath.node.callee.object.object.type === 'ThisExpression'
                ) {
                  const callerMethod = innerPath.node.key.name

                  const calleeClass = state.dependencies['instance-mapper'][state.currentFile][callerClass][`this.${deepPath.node.callee.object.property.name}`]
                  const calleeMethod = deepPath.node.callee.property.name

                  let found = false
                  let calleeMethodIndex = 0
                  let calleeFilepath = ''

                  for (const [filePath, classes] of Object.entries(state.result)) {
                    // If the target class exists in this file
                    if (classes[calleeClass]) {
                      // Check each method node in that class
                      for (const methodNode of classes[calleeClass]) {
                        const possibleCalleeMethod = methodNode.key &&
                          methodNode.key.name
                        if (calleeMethod === possibleCalleeMethod) {
                          found = true
                          calleeFilepath = filePath
                          break
                        }
                        calleeMethodIndex++
                      }
                      break
                    }
                  }

                  let callerMethodIndex = 0

                  // Search method node
                  for (const methodNode of state.result[state.currentFile][callerClass]) {
                    const possibleCallerMethod = methodNode.key && methodNode.key.name
                    if (callerMethod === possibleCallerMethod) {
                      break
                    }
                    callerMethodIndex++
                  }

                  if (found && calleeFilepath) {
                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out']) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass] = {}
                    }

                    if (!state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]) {
                      state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod] = 0
                    }

                    state.result[state.currentFile][callerClass][callerMethodIndex]['fan-out'][calleeClass][calleeMethod]++

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in']) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass] = {}
                    }

                    if (!state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]) {
                      state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod] = 0
                    }

                    state.result[calleeFilepath][calleeClass][calleeMethodIndex]['fan-in'][callerClass][callerMethod]++
                  }
                }
              }
            })
          }
        }
      })
    }
  }
}

function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["class-dependency-summary"] = function () {
function sumValues (obj) {
  return Object.values(obj).reduce((acc, value) => acc + value, 0)
}

function sumNestedValues (nestedObj) {
  return Object.values(nestedObj).reduce((acc, inner) => acc + sumValues(inner), 0)
}

const state = {
  name: 'Class Dependency Summary',
  description: 'Aggregates fan-in and fan-out dependency totals for each class across its methods',
  result: {},
  id: 'class-dependency-summary',
  dependencies: ['class-coupling'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}

    const classCouplingResult = state.dependencies['class-coupling'][state.currentFile] || {}

    for (const [className, methods] of Object.entries(classCouplingResult)) {
      let fanInCalls = 0
      let fanOutCalls = 0
      const fanInClasses = new Set()
      const fanOutClasses = new Set()

      for (const methodNode of methods) {
        const fanInMap = methodNode['fan-in'] || {}
        const fanOutMap = methodNode['fan-out'] || {}

        fanInCalls += sumNestedValues(fanInMap)
        fanOutCalls += sumNestedValues(fanOutMap)

        for (const classId of Object.keys(fanInMap)) fanInClasses.add(classId)
        for (const classId of Object.keys(fanOutMap)) fanOutClasses.add(classId)
      }

      state.result[state.currentFile][className] = {
        methods: methods.length,
        fanInCalls,
        fanOutCalls,
        fanInClasses: fanInClasses.size,
        fanOutClasses: fanOutClasses.size,
        dependencyScore: fanInCalls + fanOutCalls
      }
    }
  }
}

function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["import-instability"] = function () {
function roundTo4 (value) {
  return Number(value.toFixed(4))
}

function buildCouplingGraph (rawFileCoupling) {
  const graph = {}
  const fanInMap = {}

  for (const [filePath, fanOut] of Object.entries(rawFileCoupling || {})) {
    graph[filePath] = Array.isArray(fanOut)
      ? Array.from(new Set(fanOut.filter(dep => typeof dep === 'string')))
      : []
    fanInMap[filePath] = fanInMap[filePath] || []
  }

  for (const [filePath, fanOut] of Object.entries(graph)) {
    for (const dep of fanOut) {
      if (!graph[dep]) graph[dep] = []
      if (!fanInMap[dep]) fanInMap[dep] = []
      fanInMap[dep].push(filePath)
    }
  }

  for (const filePath of Object.keys(fanInMap)) {
    fanInMap[filePath] = Array.from(new Set(fanInMap[filePath]))
  }

  const result = {}
  for (const filePath of Object.keys(graph)) {
    result[filePath] = {
      fanOut: graph[filePath],
      fanIn: fanInMap[filePath] || []
    }
  }

  return result
}

const state = {
  name: 'Import Instability',
  description: 'Computes afferent and efferent coupling from file imports and derives instability I = Ce / (Ca + Ce)',
  result: {},
  id: 'import-instability',
  dependencies: ['file-coupling'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
  }
}

function postProcessing (state) {
  const fileCouplingGraph = buildCouplingGraph(state.dependencies['file-coupling'])

  for (const [filePath, coupling] of Object.entries(fileCouplingGraph)) {
    const afferent = coupling.fanIn.length
    const efferent = coupling.fanOut.length
    const instability = afferent + efferent === 0
      ? 0
      : roundTo4(efferent / (afferent + efferent))

    state.result[filePath] = {
      afferent,
      efferent,
      instability
    }
  }

  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["dependency-centrality"] = function () {
function roundTo4 (value) {
  return Number(value.toFixed(4))
}

function buildCouplingGraph (rawFileCoupling) {
  const graph = {}
  const fanInMap = {}

  for (const [filePath, fanOut] of Object.entries(rawFileCoupling || {})) {
    graph[filePath] = Array.isArray(fanOut)
      ? Array.from(new Set(fanOut.filter(dep => typeof dep === 'string')))
      : []
    fanInMap[filePath] = fanInMap[filePath] || []
  }

  for (const [filePath, fanOut] of Object.entries(graph)) {
    for (const dep of fanOut) {
      if (!graph[dep]) graph[dep] = []
      if (!fanInMap[dep]) fanInMap[dep] = []
      fanInMap[dep].push(filePath)
    }
  }

  for (const filePath of Object.keys(fanInMap)) {
    fanInMap[filePath] = Array.from(new Set(fanInMap[filePath]))
  }

  const result = {}
  for (const filePath of Object.keys(graph)) {
    result[filePath] = {
      fanOut: graph[filePath],
      fanIn: fanInMap[filePath] || []
    }
  }

  return result
}

const state = {
  name: 'Dependency Centrality',
  description: 'Computes in-degree, out-degree, and degree centrality from the file dependency graph',
  result: {},
  id: 'dependency-centrality',
  dependencies: ['file-coupling'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
  }
}

function postProcessing (state) {
  const fileCouplingResult = buildCouplingGraph(state.dependencies['file-coupling'])
  const totalFiles = Object.keys(fileCouplingResult).length
  const denominator = Math.max(totalFiles - 1, 1)

  for (const [filePath, coupling] of Object.entries(fileCouplingResult)) {
    const inDegree = coupling.fanIn.length
    const outDegree = coupling.fanOut.length

    state.result[filePath] = {
      inDegree,
      outDegree,
      inDegreeCentrality: roundTo4(inDegree / denominator),
      outDegreeCentrality: roundTo4(outDegree / denominator),
      totalDegreeCentrality: roundTo4((inDegree + outDegree) / (2 * denominator))
    }
  }

  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["instance-mapper"] = function () {
const state = {
  name: 'Instance Mapper',
  description: 'Walks through each class method to identify instance accesses (this.prop and local variables) and map them to their constructor types',
  result: {},
  id: 'instance-mapper',
  ignore: true,
  status: false
}

const visitors = {
  // Entry point for each parsed file, load dependency
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}
  },

  ClassDeclaration (path) {
    const node = path.node
    const parentPath = path.parentPath

    /* Examples:
       class Calculator {}
       class AdvancedCalculator extends Calculator {}

       parentPath.node.type === 'Program' -> Consider only file block class declarations
       Ignore: (() => { <Class_declaration_here> })();
    */
    if (node.id &&
      node.id.name &&
      parentPath.node.type === 'Program' ||
      parentPath.node.type === 'ExportNamedDeclaration'
    ) {
      /* Ignore:
         class SuperCalculator extends class{} {}
      */
      if (node.superClass &&
        node.superClass.type === 'ClassExpression'
      ) {
        return
      }

      const className = node.id.name
      state.result[state.currentFile][className] = {}

      path.traverse({
        ClassMethod (innerPath) {
          innerPath.traverse({
            NewExpression (deepPath) {
              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'AssignmentExpression' &&
                deepPath.parentPath.node.left.type === 'MemberExpression' &&
                deepPath.parentPath.node.left.object.type === 'ThisExpression' &&
                deepPath.parentPath.node.left.property.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
              }

              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'VariableDeclarator' &&
                deepPath.parentPath.node.id.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
              }
            }
          })
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            innerPath.traverse({
              NewExpression (deepPath) {
                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'AssignmentExpression' &&
                  deepPath.parentPath.node.left.type === 'MemberExpression' &&
                  deepPath.parentPath.node.left.object.type === 'ThisExpression' &&
                  deepPath.parentPath.node.left.property.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
                }

                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'VariableDeclarator' &&
                  deepPath.parentPath.node.id.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
                }
              }
            })
          }
        }
      })

      return
    }

    /* Examples:
       export default class {}
       export default class Foo{}
    */
    if (parentPath.node.type === 'ExportDefaultDeclaration') {
      // Classes with default export will be referenced by the name of the file
      const className = path.node.id
        ? path.node.id.name
        : state.currentFile.split('/').pop().replace(/\.(js|ts)$/, '')

      state.result[state.currentFile][className] = {}

      path.traverse({
        ClassMethod (innerPath) {
          innerPath.traverse({
            NewExpression (deepPath) {
              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'AssignmentExpression' &&
                deepPath.parentPath.node.left.type === 'MemberExpression' &&
                deepPath.parentPath.node.left.object.type ===
                'ThisExpression' &&
                deepPath.parentPath.node.left.property.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
              }

              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'VariableDeclarator' &&
                deepPath.parentPath.node.id.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
              }
            }
          })
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            innerPath.traverse({
              NewExpression (deepPath) {
                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'AssignmentExpression' &&
                  deepPath.parentPath.node.left.type === 'MemberExpression' &&
                  deepPath.parentPath.node.left.object.type === 'ThisExpression' &&
                  deepPath.parentPath.node.left.property.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
                }

                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'VariableDeclarator' &&
                  deepPath.parentPath.node.id.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
                }
              }
            })
          }
        }
      })
    }
  },

  ClassExpression (path) {
    const node = path.node
    const parentPath = path.parentPath

    /* Examples:
       const Logger = class {}
    */
    if (parentPath.node.type === 'VariableDeclarator' &&
      parentPath.node.id &&
      parentPath.node.id.name
    ) {
      /* Ignore:
         (() => { <Class_expression_here> })();
      */
      if (parentPath.find(p => p.isCallExpression())) {
        return
      }

      /* Ignore:
         class SuperCalculator extends class {}
      */
      if (node.superClass &&
        node.superClass.type === 'ClassExpression'
      ) {
        return
      }

      const className = parentPath.node.id.name
      state.result[state.currentFile][className] = {}

      path.traverse({
        ClassMethod (innerPath) {
          innerPath.traverse({
            NewExpression (deepPath) {
              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'AssignmentExpression' &&
                deepPath.parentPath.node.left.type === 'MemberExpression' &&
                deepPath.parentPath.node.left.object.type === 'ThisExpression' &&
                deepPath.parentPath.node.left.property.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
              }

              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'VariableDeclarator' &&
                deepPath.parentPath.node.id.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
              }
            }
          })
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            innerPath.traverse({
              NewExpression (deepPath) {
                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'AssignmentExpression' &&
                  deepPath.parentPath.node.left.type === 'MemberExpression' &&
                  deepPath.parentPath.node.left.object.type === 'ThisExpression' &&
                  deepPath.parentPath.node.left.property.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
                }

                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'VariableDeclarator' &&
                  deepPath.parentPath.node.id.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
                }
              }
            })
          }
        }
      })

      return
    }

    /* Examples:
       { ['LiteralClassName']: class {} }
    */
    if (parentPath.node.type === 'ObjectProperty' &&
      parentPath.node.key &&
      parentPath.node.key.type === 'StringLiteral'
    ) {
      const className = parentPath.node.key.value
      state.result[state.currentFile][className] = {}

      path.traverse({
        ClassMethod (innerPath) {
          innerPath.traverse({
            NewExpression (deepPath) {
              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'AssignmentExpression' &&
                deepPath.parentPath.node.left.type === 'MemberExpression' &&
                deepPath.parentPath.node.left.object.type === 'ThisExpression' &&
                deepPath.parentPath.node.left.property.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
              }

              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'VariableDeclarator' &&
                deepPath.parentPath.node.id.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
              }
            }
          })
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            innerPath.traverse({
              NewExpression (deepPath) {
                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'AssignmentExpression' &&
                  deepPath.parentPath.node.left.type === 'MemberExpression' &&
                  deepPath.parentPath.node.left.object.type === 'ThisExpression' &&
                  deepPath.parentPath.node.left.property.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
                }

                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'VariableDeclarator' &&
                  deepPath.parentPath.node.id.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
                }
              }
            })
          }
        }
      })

      return
    }

    /* Examples:
       { Printer: class {} }
    */
    if (parentPath.node.type === 'ObjectProperty' &&
      parentPath.node.key &&
      parentPath.node.key.type === 'Identifier' &&
      parentPath.node.computed === false
    ) {
      const className = parentPath.node.key.name
      state.result[state.currentFile][className] = {}

      path.traverse({
        ClassMethod (innerPath) {
          innerPath.traverse({
            NewExpression (deepPath) {
              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'AssignmentExpression' &&
                deepPath.parentPath.node.left.type === 'MemberExpression' &&
                deepPath.parentPath.node.left.object.type === 'ThisExpression' &&
                deepPath.parentPath.node.left.property.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
              }

              if (deepPath.node.callee.type === 'Identifier' &&
                deepPath.parentPath.node.type === 'VariableDeclarator' &&
                deepPath.parentPath.node.id.type === 'Identifier'
              ) {
                state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
              }
            }
          })
        },
        ClassProperty (innerPath) {
          if (innerPath.node.value &&
            (innerPath.node.value.type === 'ArrowFunctionExpression' ||
              innerPath.node.value.type === 'FunctionExpression')
          ) {
            innerPath.traverse({
              NewExpression (deepPath) {
                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'AssignmentExpression' &&
                  deepPath.parentPath.node.left.type === 'MemberExpression' &&
                  deepPath.parentPath.node.left.object.type === 'ThisExpression' &&
                  deepPath.parentPath.node.left.property.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][`this.${deepPath.parentPath.node.left.property.name}`] = deepPath.node.callee.name
                }

                if (deepPath.node.callee.type === 'Identifier' &&
                  deepPath.parentPath.node.type === 'VariableDeclarator' &&
                  deepPath.parentPath.node.id.type === 'Identifier'
                ) {
                  state.result[state.currentFile][className][deepPath.parentPath.node.id.name] = deepPath.node.callee.name
                }
              }
            })
          }
        }
      })
    }
  }
}

function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

self.__JTMETRICS_METRIC_FACTORIES["parameter-count"] = function () {
const state = {
  name: 'Parameter Count',
  description: 'Counts declared parameters for each named function in each source file',
  result: {},
  id: 'parameter-count',
  dependencies: ['functions-per-file'],
  status: false
}

const visitors = {
  Program (path) {
    state.currentFile = path.node.filePath
    state.result[state.currentFile] = {}

    const currentFileFunctions = state.dependencies['functions-per-file'][state.currentFile] || {}

    for (const [functionName, functionNode] of Object.entries(currentFileFunctions)) {
      state.result[state.currentFile][functionName] = {
        params: functionNode.params?.length ?? 0
      }
    }
  }
}

function postProcessing (state) {
  delete state.currentFile
  delete state.dependencies

  state.status = true
}

  return { state, visitors, postProcessing }
}

