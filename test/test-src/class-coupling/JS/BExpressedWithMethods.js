import { AExpressedWithMethods, CExpressedWithMethods } from './ACExpressedWithMethods.js'

export const BExpressedWithMethods = class {
  b1(){
    this.a = new AExpressedWithMethods()
    this.aa = new AExpressedWithMethods()
    this.a.a1()
  }
  b2(){
    const a = new AExpressedWithMethods()
    a.a2()
    a.a2()
  }
  constructor(){
    this.aaa = new AExpressedWithMethods()
    this.aaa.a1()
    this.aaa.a2()
    this.aaa.a2()
    AExpressedWithMethods.a3()
    AExpressedWithMethods.a3()
  }
  static b3(){
    AExpressedWithMethods.a3()
    CExpressedWithMethods.c()
    CExpressedWithMethods.c()
  }
}
