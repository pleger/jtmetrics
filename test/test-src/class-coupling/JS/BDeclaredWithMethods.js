import { A, C } from './ACDeclaredWithMethods.js'

export class B {
  b1(){
    this.a = new A()
    this.aa = new A()
    this.a.a1()
  }
  b2(){
    const a = new A()
    a.a2()
    a.a2()
  }
  constructor(){
    this.aaa = new A()
    this.aaa.a1()
    this.aaa.a2()
    this.aaa.a2()
    A.a3()
    A.a3()
  }
  static b3(){
    A.a3()
    C.c()
    C.c()
  }
}
