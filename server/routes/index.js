var express = require("express");
var router = express.Router();
const parseSaft = require("../parser/saft").parseSaft;

router.get("/parse/saft", function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  console.log("Parsing SAF-T file");
  parseSaft(res);
});

module.exports = router;
