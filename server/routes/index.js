var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const parseSaft = require("../parser/saft").parseSaft;
const { readDocuments } = require("../mongodb/actions");

router.get("/parse/saft", function(req, res) {
  console.log("Parsing SAF-T file");
  parseSaft(res);
});

module.exports = router;
