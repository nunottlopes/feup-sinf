var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

// All orders
router.get(`/all-orders`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  // TODO: FILTRAR

  getJasminAPI("/purchases/orders")
    .then(response => {
      let orders = [];
      response = JSON.parse(response);
      for (let i = 0; i < response.length; i++) {
        if (!response[i].isDeleted) {
          let items = [];

          response[i].documentLines.forEach(element => {
            items.push({
              quantity: element.quantity,
              totalAmount: element.lineExtensionAmount.amount,
              warehouse: element.warehouse,
              itemId: element.purchasesItem,
              itemDescription: element.purchasesItemDescription,
              deliveryDate: element.deliveryDate
            });
          });

          orders.push({
            name: response[i].accountingPartyDescription,
            date: response[i].exchangeRateDate,
            orderId: response[i].naturalKey,
            supplierId: response[i].accountingParty,
            payableAmout: response[i].payableAmount.amount,
            items: items
          });
        }
      }
      res.send(orders);
    })
    .catch(err => {
      res.send(err);
    });
});

// TABLE_03 Waiting orders
router.get(`/orders-to-receive`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  // TODO: FILTRAR

  getJasminAPI("/goodsReceipt/processOrders/1/10?company=")
    .then(response => {
      let orders = [];
      response = JSON.parse(response);
      // res.send(response);
      for (let i = 0; i < response.length; i++) {
        if (!response[i].isDeleted) {
          orders.push({
            item: response[i].item,
            itemDescription: response[i].itemDescription,
            quantity: response[i].quantity,
            deliveryDate: response[i].deliveryDate,
            sourceDocKey: response[i].sourceDocKey
          });
        }
      }
      res.send(orders);
    })
    .catch(err => {
      res.send(err);
    });
});

// LINEAR_01 Expenses
router.get(`/expenses`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  let startDate =
    "start-date" in req.query && req.query["start-date"] !== "null"
      ? new Date(req.query["start-date"])
      : null;
  let endDate =
    "end-date" in req.query && req.query["end-date"] !== "null"
      ? new Date(req.query["end-date"])
      : null;

  let expenses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  getJasminAPI("/invoiceReceipt/expenses")
    .then(response => {
      response = JSON.parse(response);

      for (let i = 0; i < response.length; i++) {
        let dueDate = new Date(response[i].dueDate);
        if (
          !response[i].isDeleted &&
          (startDate == null || startDate <= dueDate) &&
          (endDate == null || dueDate <= endDate)
        ) {
          expenses[dueDate.getMonth()] += response[i].payableAmount.amount;
        }
      }
      res.send({ data: expenses, label: "Expenses per Month" });
    })
    .catch(err => {
      res.send(err);
    });
});

// TABLE_02
router.get(`/pendent-bills`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  // TODO: FILTRAR

  getJasminAPI("/invoiceReceipt/invoices")
    .then(response => {
      let bills = [];
      response = JSON.parse(response);
      for (let i = 0; i < response.length; i++) {
        if (!response[i].isDeleted && response[i].documentStatus !== 2) {
          let items = [];

          response[i].documentLines.forEach(element => {
            items.push({
              quantity: element.quantity,
              totalAmount: element.lineExtensionAmount.amount,
              warehouse: element.warehouse,
              itemId: element.purchasesItem,
              itemDescription: element.purchasesItemDescription,
              deliveryDate: element.deliveryDate
            });
          });

          bills.push({
            dueDate: response[i].dueDate,
            amount: response[i].payableAmount.amount,
            entity: response[i].accountingParty,
            supplier: response[i].accountingPartyDescription,
            orderId: response[i].naturalKey,
            items: items
          });
        }
      }
      res.send(bills);
    })
    .catch(err => {
      res.send(err);
    });
});

// TABLE_01
router.get(`/suppliers`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  let startDate =
    "start-date" in req.query && req.query["start-date"] !== "null"
      ? new Date(req.query["start-date"])
      : null;
  let endDate =
    "end-date" in req.query && req.query["end-date"] !== "null"
      ? new Date(req.query["end-date"])
      : null;

  getJasminAPI("/invoiceReceipt/expenses")
    .then(response => {
      response = JSON.parse(response);

      let suppliers = {};

      for (let i = 0; i < response.length; i++) {
        let dueDate = new Date(response[i].dueDate);
        if (
          !response[i].isDeleted &&
          (startDate == null || startDate <= dueDate) &&
          (endDate == null || dueDate <= endDate)
        ) {
          try {
            if (suppliers.hasOwnProperty(response[i].sellerSupplierParty)) {
              suppliers[response[i].sellerSupplierParty].totalExpenses +=
                response[i].payableAmount.amount;
            } else {
              suppliers[response[i].sellerSupplierParty] = {
                name: response[i].sellerSupplierPartyDescription,
                totalExpenses: response[i].payableAmount.amount
              };
            }
          } catch (error) {
            console.log(error);
          }
        }
      }

      suppliers = Object.keys(suppliers)
        .sort((a, b) => suppliers[b].totalExpenses - suppliers[a].totalExpenses)
        .map(elem => ({
          id: elem,
          name: suppliers[elem].name,
          totalExpenses: suppliers[elem].totalExpenses
        }));

      res.send(suppliers);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
