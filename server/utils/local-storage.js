var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./store");

module.exports = localStorage;
