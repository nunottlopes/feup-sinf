var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const parseSaft = require("../parser/saft").parseSaft;
const { readDocuments } = require("../mongodb/actions");

/* GET home page. */
router.get("/", function(req, res) {
  // Example
  getJasminAPI("/taxesCore/taxTypeCodes/getTaxTypeInfo")
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/parse/saft", function(req, res) {
  console.log("Parsing SAF-T file");
  parseSaft(res);
});

router.get(`/billing`, function(req, res) {
  jasmin
    .getJasminAPI("/billing/invoices/")
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get(`/accounts`, function(req, res) {
  //res.send("Ok");
  readDocuments("GeneralLedgerEntries", "", response => {
    res.send(JSON.stringify(response[0].Journal));
  });
});

/* server.get('/AccountSum/:account_id', (req, res) => {
  let startDate = 'start-date' in req.query ? new Date(req.query['start-date']) : null;
  let endDate = 'end-date' in req.query ? new Date(req.query['end-date']) : null;
  let account_id_filter = req.params.account_id;

  res.json(accountSumBetweenDates(account_id_filter, startDate, endDate));
}); */

/*

  Purchases

*/

module.exports = router;
