import { ADeclaredWithProperties, C } from './ACDeclaredWithProperties.js'

export class BDeclaredWithProperties {
  ignore = 42
  static b3(){
    ADeclaredWithProperties.a3()
    C.c()
    C.c()
  }
  b2 = () => {
    ADeclaredWithProperties.a3()
    ADeclaredWithProperties.a3()
    const a = new ADeclaredWithProperties()
    a.a2()
    a.a2()
  }
  b1 = function (){
    this.aa.a1()
    this.aa.a1()
    this.aa.a2()
  }
  constructor(){
    this.a = new ADeclaredWithProperties()
    this.aa = new ADeclaredWithProperties()
  }
}
