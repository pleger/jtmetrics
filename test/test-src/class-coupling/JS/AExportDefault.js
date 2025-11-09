import BExportDefault from './BExportDefault.js'

export default class {
  a1(){
    this.b = new BExportDefault()
    this.bb = new BExportDefault()
    this.bb.b1()
  }
  a2(){
    const b = new BExportDefault()
    b.b2()
  }
  constructor(){
    this.bbb = new BExportDefault()
    this.bbb.b1()
    this.bbb.b2()
    this.bbb.b2()
    BExportDefault.b3()
    BExportDefault.b3()
  }
  static a3(){
    BExportDefault.b3()
  }
  a4(){
    BExportDefault.b4()
  }
  static a5(){}
  a6(){}
}