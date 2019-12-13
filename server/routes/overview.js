var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

// TABLE_01
router.get(`/top-products`, function(req, res) {
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

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

    products = Object.keys(products)
      .sort((a, b) => products[b].Quantity - products[a].Quantity)
      .map(elem => ({
        ProductCode: elem,
        ProductDescription: products[elem].ProductDescription,
        UnitPrice: products[elem].UnitPrice,
        Quantity: products[elem].Quantity,
      }));

    res.json(products);
  });
});

// PIE_01
router.get("/top-clients", (req, res) => {
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

  let clients = {};

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
        const customer = invoice.CustomerID;

        let purchased = 0;

        invoice.Line.forEach(line => {
          const { UnitPrice, Quantity } = line;

          purchased += UnitPrice * Quantity;
        });

        if (clients.hasOwnProperty(customer)) {
          clients[customer].totalPurchased += purchased;
          clients[customer].nPurchases++;
        } else {
          clients[customer] = {
            totalPurchased: purchased,
            nPurchases: 1,
          };
        }
      }
    });

    clients = Object.keys(clients)
      .sort((a, b) => clients[b].totalPurchased - clients[a].totalPurchased)
      .map(elem => ({
        client: elem,
        totalPurchased: clients[elem].totalPurchased,
        nPurchases: clients[elem].nPurchases,
      }));

    res.json(clients);
  });
});

// PIE_02
router.get("/top-regions", (req, res) => {
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

  let countries = {};

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
        const country = invoice.ShipTo.Address.Country;

        if (countries.hasOwnProperty(country)) {
          countries[country].quantity++;
          countries[country].netTotal += parseInt(
            invoice.DocumentTotals.NetTotal
          );
        } else {
          countries[country] = {
            quantity: 1,
            netTotal: parseInt(invoice.DocumentTotals.NetTotal),
          };
        }
      }
    });

    countries = Object.keys(countries)
      .sort((a, b) => countries[b].quantity - countries[a].quantity)
      .map(elem => ({
        id: elem,
        value: countries[elem].quantity,
        netTotal: countries[elem].netTotal,
      }));

    res.json(countries);
  });
});

// BAR_01
router.get("/month-sales", (req, res) => {
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

  let monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
      )
        monthly[parseInt(invoice.InvoiceDate.slice(5, 7)) - 1] += parseFloat(
          invoice.DocumentTotals.GrossTotal
        );
    });

    res.json([
      {
        data: monthly,
        label: "Monthly Sales",
      },
    ]);
  });
});

// TODO: LINE_01

module.exports = router;
