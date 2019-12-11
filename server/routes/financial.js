var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

/* FINANCIAL */

//https://moodle.up.pt/pluginfile.php/93952/mod_resource/content/1/PL_Balance_Sheet_specification.pdf

// SHEET_01
router.get(`/balance`, function(req, res) {
  readDocuments("MasterFiles", { _id: "GeneralLedgerAccounts" }, response => {
    if (response.length !== 0) {
      res.send(response[0].Account);
    } else {
      res.status(400).send({ message: "Error getting balance data" });
    }
  });
});

router.get(`/ebit`, function(req, res) {});

router.get(`/ebitda`, function(req, res) {});

router.get(`/revenue`, function(req, res) {});

module.exports = router;
