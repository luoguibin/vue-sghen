function test0(a) {
    console.log(a)
}

function test1(a) {
    console.log(a)
}

// cd to current file path
// run cmd code: vue build --target lib --name myLib  lib-test.js
// for using: window.myLib, window.myLib.test0
export { test0, test1 }