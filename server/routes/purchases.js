var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

/* PURCHASES */
router.get(`/suppliers`, function(req, res) {
  getJasminAPI("/purchasesCore/purchasesItems/extension")
    .then(resp => {
      res.send(JSON.parse(resp));
    })
    .catch(err => {
      res.send(err);
    });
});

//Pode ser paged
router.get(`/`, function(req, res) {
  getJasminAPI("/invoiceReceipt/expenses")
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get(`/pendent-bills/:account`, function(req, res) {
  readDocuments("GeneralLedgerEntries", "", response => {
    let journals = response[0];
    let credit = {};
    let debit = {};
    let startDate =
      "start-date" in req.query ? new Date(req.query["start-date"]) : null;
    let endDate =
      "end-date" in req.query ? new Date(req.query["end-date"]) : null;
    let account = req.params.account;
    let topSuppliers = {};
    if (journals.Journal == undefined) return { credit: 0, debit: 0 };
    journals.Journal.forEach(journal => {
      if (journal.Transaction != undefined) {
        if (Array.isArray(journal.Transaction)) {
          journal.Transaction.forEach(transaction => {
            let result = processTransaction(
              transaction,
              account,
              startDate,
              endDate
            );
            if (result.companies != undefined) {
              for (const [company, value] of Object.entries(result.companies)) {
                if (value.debit > 0 || value.credit > 0) {
                  if (topSuppliers[company] == undefined) {
                    topSuppliers[company] = {
                      debit: value.debit,
                      credit: value.credit
                    };
                  } else {
                    topSuppliers[company].debit += value.debit;
                    topSuppliers[company].credit += value.credit;
                  }
                }
              }
            }
          });
        } else {
          let result = processTransaction(
            journal.Transaction,
            account,
            startDate,
            endDate
          );
          if (result.companies != undefined) {
            for (const [company, value] of Object.entries(result.companies)) {
              if (value > 0) {
                if (topSuppliers[company] == undefined) {
                  topSuppliers[company] = {
                    debit: value.debit,
                    credit: value.credit
                  };
                } else {
                  topSuppliers[company].debit += value.debit;
                  topSuppliers[company].credit += value.credit;
                }
              }
            }
          }
        }
      }
    });
    res.send({ topSuppliers, credit, debit, response });
  });
});

router.get(`/orders-delivered`, function(req, res) {
  getJasminAPI("/shipping/deliveries")
    .then(response => {
      let orders = [];
      response = JSON.parse(response);
      for (let i = 0; i < response.length; i++) {
        if (!response[i].isDeleted) {
          orders.push({
            name: response[i].accountingPartyDescription,
            date: response[i].exchangeRateDate,
            id: response[i].naturalKey,
            entity: response[i].accountingParty,
            payableAmout: response[i].payableAmount.amount,
            salesItem: response[i].documentLines[0].item
            // deleted: response[i].isDeleted
          });
        }
      }
      res.send(orders);
    })
    .catch(err => {
      res.send(err);
    });
});

// TODO: REMOVE ORDERS ALREADY DELIVERED
router.get(`/orders-to-deliver`, function(req, res) {
  getJasminAPI("/shipping/shippingRequests")
    .then(response => {
      let orders = [];
      response = JSON.parse(response);
      for (let i = 0; i < response.length; i++) {
        if (!response[i].isDeleted) {
          orders.push(response[i]);
          // orders.push({
          //   name: response[i].accountingPartyDescription,
          //   date: response[i].exchangeRateDate,
          //   id: response[i].naturalKey,
          //   entity: response[i].accountingParty,
          //   payableAmout: response[i].payableAmount.amount
          // });
        }
      }
      res.send(orders);
    })
    .catch(err => {
      res.send(err);
    });
});

processTransaction = (transaction, account, startDate, endDate) => {
  function processLine(line, type) {
    if ((line.AccountID + " ").indexOf(account) != 0) return 0;
    return type == "credit" ? line.CreditAmount : line.DebitAmount;
  }

  let date = new Date(transaction.TransactionDate);
  if (
    (startDate != null && date < startDate) ||
    (endDate != undefined && date > endDate)
  ) {
    return { credit: 0, debit: 0 };
  }

  let credit = 0;
  let debit = 0;

  let lines = transaction.Lines;

  let companies = {};

  if (lines.CreditLine) {
    if (Array.isArray(lines.CreditLine)) {
      lines.CreditLine.forEach(line => {
        let companyCredit = processLine(line, "credit");

        credit += companyCredit;
        if (companies[line.AccountID] == undefined) {
          companies[line.AccountID] = { credit: companyCredit, debit: 0 };
        } else {
          companies[line.AccountID].credit += companyCredit;
        }
      });
    } else {
      let companyCredit = processLine(lines.CreditLine, "credit");

      credit += companyCredit;

      if (companies[lines.CreditLine.AccountID] == undefined) {
        companies[lines.CreditLine.AccountID] = {
          credit: companyCredit,
          debit: 0
        };
      } else {
        companies[lines.CreditLine.AccountID].credit += companyCredit;
      }
    }
  }

  if (lines.DebitLine) {
    if (Array.isArray(lines.DebitLine)) {
      lines.DebitLine.forEach(line => {
        let companyDebit = processLine(line, "debit");

        debit += companyDebit;

        if (companies[line.AccountID] == undefined) {
          companies[line.AccountID] = { debit: companyDebit, credit: 0 };
        } else {
          companies[line.AccountID].debit += companyDebit;
        }
      });
    } else {
      let companyDebit = processLine(lines.DebitLine, "debit");

      debit += companyDebit;

      if (companies[lines.DebitLine.AccountID] == undefined) {
        companies[lines.DebitLine.AccountID] = {
          debit: companyDebit,
          credit: 0
        };
      } else {
        companies[lines.DebitLine.AccountID].debit = companyDebit;
      }
    }
  }
<<<<<<< HEAD
  
  return {credit,debit,companies } 
} */
=======
  /* console.log(companies, lines) */
  return { credit, debit, companies };
};
>>>>>>> 79803e2cae1f49484442f5876138fc5ebc59ade9

/* processTransaction = (transaction,account,startDate,endDate) => {

  function processLine(line,type){
    //Não é fornecedores
    if((line.AccountID + " ").indexOf(account) != 0)
      return 0
    return type == "credit" ? line.CreditAmount : line.DebitAmount;
  }

  let date = new Date(transaction.TransactionDate);

  if((startDate != null && date < startDate) || (endDate != undefined && date > endDate)){
    return {credit:0,debit:0}
  }

  let credit = 0;
  let debit = 0;

  let lines = transaction.Lines;


  if(lines.CreditLine){
    if(Array.isArray(lines.CreditLine)){
      credit+= lines.CreditLine.map(line => {
        return processLine(line,"credit");
      }).reduce((n1,n2) => n1+n2);
    }else{
      credit+=processLine(lines.CreditLine,"credit");
    }
  }

  if(lines.DebitLine){
    if(Array.isArray(lines.DebitLine)){
      debit+= lines.DebitLine.map(line => {
        return processLine(line,"debit");
      }).reduce((n1,n2) => n1+n2);
    }else{
      debit+=processLine(lines.DebitLine,"debit");
    }
  }
  return {credit,debit }
} */

module.exports = router;
