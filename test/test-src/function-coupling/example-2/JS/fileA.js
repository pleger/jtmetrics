import { fun1, fun2, fun3 } from './subdir/fileB.js'

function call1() {
  fun1()
  fun1()
}

const call2 = function () {
  fun2()
  fun2()
}

const call3 = () => {
  fun3()
  fun3()
}