var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

//https://moodle.up.pt/pluginfile.php/93952/mod_resource/content/1/PL_Balance_Sheet_specification.pdf

// SHEET_01
// TODO:

//https://github.com/literallysofia/feup-sinf/blob/0929544913cdf4b156130c44661a3c87963d54d5/sinf/src/app/financial/components/balance-sheet/balance-sheet.component.ts

router.get(`/balance`, function(req, res) {
  readDocuments("MasterFiles", { _id: "GeneralLedgerAccounts" }, response => {
    if (response.length !== 0) {
      res.send(response[0].Account);
    } else {
      res.status(400).send({ message: "Error getting balance data" });
    }
  });
});

// TODO: INFO_01
//https://github.com/literallysofia/feup-sinf/blob/0929544913cdf4b156130c44661a3c87963d54d5/sinf/src/app/financial/components/ebit/ebit.component.ts
router.get(`/ebit`, function(req, res) {});

// TODO: INFO_02
//https://github.com/literallysofia/feup-sinf/blob/0929544913cdf4b156130c44661a3c87963d54d5/sinf/src/app/financial/components/ebitda/ebitda.component.ts
router.get(`/ebitda`, function(req, res) {});

// TODO: GRAPH_01
//https://github.com/literallysofia/feup-sinf/blob/0929544913cdf4b156130c44661a3c87963d54d5/sinf/src/app/financial/components/sales-graph/sales-graph.component.ts
router.get(`/revenue`, function(req, res) {});

module.exports = router;
