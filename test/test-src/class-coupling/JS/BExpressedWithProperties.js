import { AExpressedWithProperties, CExpressedWithProperties } from './ACExpressedWithProperties.js'

export const BExpressedWithProperties = class {
  ignore = 42
  static b3(){
    AExpressedWithProperties.a3()
    CExpressedWithProperties.c()
    CExpressedWithProperties.c()
  }
  b2 = () => {
    AExpressedWithProperties.a3()
    AExpressedWithProperties.a3()
    const a = new AExpressedWithProperties()
    a.a2()
    a.a2()
  }
  b1 = function (){
    this.aa.a1()
    this.aa.a1()
    this.aa.a2()
  }
  constructor(){
    this.a = new AExpressedWithProperties()
    this.aa = new AExpressedWithProperties()
  }
}
