var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

// LIST_01
router.get(`/products`, function(req, res) {
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

  let products = {};

  readDocuments("SourceDocuments", { _id: "SalesInvoices" }, resp => {
    const salesInvoices = resp[0]["Invoice"];
    salesInvoices.forEach(invoice => {
      const type = invoice.InvoiceType;
      if (
        !(
          invoice.Line.length &&
          (type == "FT" || type == "FS" || type == "FR" || type == "VD")
        )
      )
        return;

      let invoiceDate = new Date(invoice.InvoiceDate);
      if (
        (startDate == null || startDate <= invoiceDate) &&
        (endDate == null || invoiceDate <= endDate)
      ) {
        invoice.Line.forEach(line => {
          const { ProductCode, UnitPrice, ProductDescription, Quantity } = line;

          if (products.hasOwnProperty(ProductCode)) {
            products[ProductCode].Quantity += parseInt(Quantity);
          } else {
            products[ProductCode] = {
              ProductDescription,
              UnitPrice: parseFloat(UnitPrice),
              Quantity: parseInt(Quantity)
            };
          }
        });
      }
    });

    let productsList = [];

    for (var key in products) {
      productsList.push({
        product_id: key,
        name: products[key].ProductDescription,
        quantity: products[key].Quantity,
        base_price: products[key].UnitPrice
      });
    }

    res.json(productsList);
  });
});

// KP1_01
router.get(`/stock-balance`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  // TODO: FILTRAR

  getJasminAPI("/materialscore/materialsitems")
    .then(response => {
      
      let warehouses = JSON.parse(response)[0]["materialsItemWarehouses"];

      let amount = 0;
      for (let i = 0; i < warehouses.length; i++) {
        amount += warehouses[i].inventoryBalance.amount;
      }
      res.send({ stockTotalBalance: amount });
    })
    .catch(err => {
      console.log(err);
    });
});

// Stock units per warehouse (from erp)
router.get(`/warehouse-units`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  // TODO: FILTRAR

  getJasminAPI("/materialscore/materialsitems")
    .then(response => {
      let warehouses = JSON.parse(response)[0]["materialsItemWarehouses"];

      let data = [];

      for (let i = 0; i < warehouses.length; i++) {
        data.push({
          warehouse: warehouses[i].warehouse,
          warehouseDescription: warehouses[i].warehouseDescription,
          stockBalance: warehouses[i].stockBalance,
          inventoryBalance: warehouses[i].inventoryBalance.amount
        });
      }
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
