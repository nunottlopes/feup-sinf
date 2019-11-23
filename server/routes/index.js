var express = require("express");
var router = express.Router();
const jasmin = require("../config/jasmin");

/* GET home page. */
router.get("/", function(req, res) {
  // Example
  jasmin
    .getTaxTypeInfo()
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
