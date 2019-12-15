var async = require("async");
var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const {
  readDocuments,
  accountsSum,
  accountsSumMontlhy
} = require("../mongodb/actions");

// SHEET_01
// TODO:
router.get(`/balance`, function(req, res) {
  // if (!req.isLogged) {
  //   res.status(401).send({ error: "Request unauthorized" });
  //   return;
  // }

  readDocuments("MasterFiles", { _id: "GeneralLedgerAccounts" }, response => {
    if (response.length !== 0) {
      res.send(response[0].Account);
    } else {
      res.status(400).send({ message: "Error getting balance data" });
    }
  });
});

// TODO: INFO_01
router.get(`/ebit`, function(req, res) {
  // if (!req.isLogged) {
  //   res.status(401).send({ error: "Request unauthorized" });
  //   return;
  // }

  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

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
      res.send(results);
      const ebit =
        results.earnings -
        (results.expensesCOGS +
          results.expensesServices +
          results.expensesPersonnel +
          results.expensesDepreciationAndAmortization);

      /* res.send({ebit}) */
    }
  );
});

// TODO: INFO_02
router.get(`/ebitda`, function(req, res) {
  // if (!req.isLogged) {
  //   res.status(401).send({ error: "Request unauthorized" });
  //   return;
  // }
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

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

      const ebitda =
        results.earningsSales +
        results.earningsServices -
        (results.expensesCOGS +
          results.expensesServices +
          results.expensesPersonnel);

      res.send({ ebitda });
    }
  );
});

// TODO: GRAPH_01
router.get(`/revenue`, function(req, res) {
  // if (!req.isLogged) {
  //   res.status(401).send({ error: "Request unauthorized" });
  //   return;
  // }
  let costs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let sales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  async.series(
    {
      account61: function(callback) {
        accountsSumMontlhy(61, callback);
      },
      account71: function(callback) {
        accountsSumMontlhy(71, callback);
      }
    },
    function(err, results) {
      if (err) {
        console.log(err);
        return;
      }
      let costsData = results.account61;
      let salesData = results.account71;

      for (let i = 1; i <= 12; i++) {
        costs[i] = costsData[i].totalDebit;
        sales[i] = salesData[i].totalCredit;
      }

      res.json({
        revenue: { data: sales, label: "Revenue from Sales" },
        cost: { data: costs, label: "Cost of Goods Sold" }
      });
    }
  );
});

module.exports = router;
