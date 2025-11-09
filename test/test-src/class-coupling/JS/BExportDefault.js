import AExportDefault from './AExportDefault.js'

export default class {
  b5 = () => {
    AExportDefault.a5()
  }
  b6 = () => {
    this.aaa.a6()
  }
  ignore = 42
  b1 = function (){
    this.a = new AExportDefault()
    this.aa = new AExportDefault()
    this.aa.a1()
    this.aa.a1()
    this.aa.a2()
  }
  b2 = () => {
    const a = new AExportDefault()
    a.a2()
    a.a2()
    AExportDefault.a3()
    AExportDefault.a3()
  }
  constructor(){
    this.aaa = new AExportDefault()
  }
  static b3(){
    AExportDefault.a3()
  }
  static b4(){}
}