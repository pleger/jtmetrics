import { BExpressedWithProperties } from './BExpressedWithProperties.js'

export const AExpressedWithProperties = class {
  ignore = 42
  a1 = function (){
    this.b = new BExpressedWithProperties()
    this.bb = new BExpressedWithProperties()
    this.bb.b1()
    this.bb.b1()
    this.bb.b2()
  }
  a2 = () => {
    const b = new BExpressedWithProperties()
    b.b2()
    b.b2()
    BExpressedWithProperties.b3()
    BExpressedWithProperties.b3()
  }
  constructor(){}
  static a3(){
    BExpressedWithProperties.b3()
    CExpressedWithProperties.c()
    CExpressedWithProperties.c()
  }
}

export const CExpressedWithProperties = class {
  static c(){}
  c1 = () => {
    this.a.a2()
  }
  constructor(){
    this.a = new BExpressedWithProperties()
  }
}