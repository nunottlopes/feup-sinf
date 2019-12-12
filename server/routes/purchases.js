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
    readDocuments("GeneralLedgerEntries","",(response) => {
      let journals = response[0]
      let credit = 0;
      let debit = 0;
      let startDate = 'start-date' in req.query ? new Date(req.query['start-date']) : null;
      let endDate = 'end-date' in req.query ? new Date(req.query['end-date']) : null;
      let account = req.params.account;
      
      journals.Journal.forEach((journal) => {
        if(journal.Transaction != undefined){
          if(Array.isArray(journal.Transaction)){
            journal.Transaction.forEach((transaction) => {
              let result = processTransaction(transaction,account,startDate,endDate)
  
              debit+=result.debit;
              credit+=result.credit;
            })
          } else{
              let result = processTransaction(journal.Transaction, account, startDate, endDate);
              credit += result.credit;
              debit += result.debit;
          }
         
        }
      })
    res.send({credit,debit})
  })

});

router.get(`/orders-delivery`, function(req, res) {
  getJasminAPI("/shipping/deliveries")
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});


processTransaction = (transaction,account,startDate,endDate) => {

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
/*   console.log(credit,debit) */
  return {credit,debit }
}

module.exports = router;
