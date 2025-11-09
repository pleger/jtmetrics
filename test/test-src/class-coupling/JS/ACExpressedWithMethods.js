import { BExpressedWithMethods } from './BExpressedWithMethods.js'

export const AExpressedWithMethods = class {
  a1(){
    this.b = new BExpressedWithMethods()
    this.bb = new BExpressedWithMethods()
    this.bb.b1()
  }
  a2(){
    const b = new BExpressedWithMethods()
    b.b2()
  }
  constructor(){
    this.bbb = new BExpressedWithMethods()
    this.bbb.b1()
    this.bbb.b2()
    this.bbb.b2()
    BExpressedWithMethods.b3()
    BExpressedWithMethods.b3()
  }
  static a3(){
    BExpressedWithMethods.b3()
    CExpressedWithMethods.c()
    CExpressedWithMethods.c()
  }
}

export const CExpressedWithMethods = class {
  static c(){}
}