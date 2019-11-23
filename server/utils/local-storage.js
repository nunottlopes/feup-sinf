var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./store");

module.exports = localStorage;

// localStorage.setItem("myFirstKey", "myFirstValue");
// console.log(localStorage.getItem("myFirstKey"));
