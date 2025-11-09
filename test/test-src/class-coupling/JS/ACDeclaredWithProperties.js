import { BDeclaredWithProperties } from './BDeclaredWithProperties.js'

export class ADeclaredWithProperties {
  ignore = 42
  a1 = function (){
    this.b = new BDeclaredWithProperties()
    this.bb = new BDeclaredWithProperties()
    this.bb.b1()
    this.bb.b1()
    this.bb.b2()
  }
  a2 = () => {
    const b = new BDeclaredWithProperties()
    b.b2()
    b.b2()
    BDeclaredWithProperties.b3()
    BDeclaredWithProperties.b3()
  }
  constructor(){}
  static a3(){
    BDeclaredWithProperties.b3()
    C.c()
    C.c()
  }
}

export class C {
  static c(){}
  c1 = () => {
    this.a.a2()
  }
  constructor(){
    this.a = new ADeclaredWithProperties()
  }
}