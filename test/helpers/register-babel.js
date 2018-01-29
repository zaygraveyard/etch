require("regenerator-runtime/runtime")
require('babel-register')({
  plugins: ["transform-async-to-generator"]
})
