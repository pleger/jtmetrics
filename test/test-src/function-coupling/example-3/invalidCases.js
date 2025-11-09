// Invalid cases
function invalid1() {
  (function() {})()
}

const invalid2 = function () {
  (function() {})()
}

const invalid3 = () => {
  (function() {})()
}