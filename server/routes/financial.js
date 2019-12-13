var async = require("async");

var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments, accountsSum } = require("../mongodb/actions");


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
router.get(`/ebit`, function(req, res) {

    let startDate ="start-date" in req.query ? new Date(req.query["start-date"]) : null;
    let endDate = "end-date" in req.query ? new Date(req.query["end-date"]) : null;
    


  async.series(
    {
      earnings: function(callback) {
        accountsSum(7, startDate, endDate, callback);
      },
      expensesCOGS: function(callback) {
        accountsSum(61, startDate, endDate, callback);
      },
      expensesServices: function(callback) {
        accountsSum(62, startDate, endDate, callback);
      },
      expensesPersonnel: function(callback) {
        accountsSum(63, startDate, endDate, callback);
      },
      expensesDepreciationAndAmortization: function(callback) {
        accountsSum(64, startDate, endDate, callback);
      }
    },
    function(err, results) {
      if (err) {
        console.log(err);
        return;
      }

      const ebit = results.earnings - (results.expensesCOGS + results.expensesServices + results.expensesPersonnel + results.expensesDepreciationAndAmortization)
      
      res.send({ebit})
    }
  );
});

// TODO: INFO_02
//https://github.com/literallysofia/feup-sinf/blob/0929544913cdf4b156130c44661a3c87963d54d5/sinf/src/app/financial/components/ebitda/ebitda.component.ts
router.get(`/ebitda`, function(req, res) {

  let startDate ="start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate = "end-date" in req.query ? new Date(req.query["end-date"]) : null;
  


async.series(
  {
    earningsSales: function(callback) {
      accountsSum(71, startDate, endDate, callback);
    },
    earningsServices: function(callback) {
      accountsSum(72, startDate, endDate, callback);
    },
    expensesCOGS: function(callback) {
      accountsSum(61, startDate, endDate, callback);
    },
    expensesServices: function(callback) {
      accountsSum(62, startDate, endDate, callback);
    },
    expensesPersonnel: function(callback) {
      accountsSum(63, startDate, endDate, callback);
    }
  },
  function(err, results) {
    if (err) {
      console.log(err);
      return;
    }

    const ebitda = ((results.earningsSales + results.earningsServices) - (results.expensesCOGS + results.expensesServices + results.expensesPersonnel))
    
    res.send({ebitda})
  }
);

});

// TODO: GRAPH_01
//https://github.com/literallysofia/feup-sinf/blob/0929544913cdf4b156130c44661a3c87963d54d5/sinf/src/app/financial/components/sales-graph/sales-graph.component.ts
router.get(`/revenue`, function(req, res) {});

module.exports = router;
