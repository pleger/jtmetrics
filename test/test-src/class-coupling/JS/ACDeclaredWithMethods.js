import { B } from './BDeclaredWithMethods.js'

export class A {
  a1(){
    this.b = new B()
    this.bb = new B()
    this.bb.b1()
  }
  a2(){
    const b = new B()
    b.b2()
  }
  constructor(){
    this.bbb = new B()
    this.bbb.b1()
    this.bbb.b2()
    this.bbb.b2()
    B.b3()
    B.b3()
  }
  static a3(){
    B.b3()
    C.c()
    C.c()
  }
}

export class C {
  static c(){}
}