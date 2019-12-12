var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

// LIST_01
router.get(`/products`, function(req, res) {
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
              Quantity: parseInt(Quantity),
            };
          }
        });
      }
    });

    res.json(products);
  });
});

// TODO: KP1_01

//https://github.com/literallysofia/feup-sinf/blob/0929544913cdf4b156130c44661a3c87963d54d5/sinf/src/app/inventory/components/assets-in-stock/assets-in-stock.component.ts

// TODO: KPI_02

//https://github.com/literallysofia/feup-sinf/blob/0929544913cdf4b156130c44661a3c87963d54d5/sinf/src/app/inventory/components/merchandise-delay/merchandise-delay.component.ts

module.exports = router;
