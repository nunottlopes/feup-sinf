var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments, accountsSum } = require("../mongodb/actions");
var async = require("async");

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
              Quantity: parseInt(Quantity)
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
        Quantity: products[elem].Quantity
      }));

    res.json(products);
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
      console.log(invoice);
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
            netTotal: parseInt(invoice.DocumentTotals.NetTotal)
          };
        }
      }
    });

    countries = Object.keys(countries).map(elem => ({
      id: elem,
      value: countries[elem].quantity,
      netTotal: countries[elem].netTotal
    }));

    res.json(countries);
  });
});

// LINE_01
router.get("/daily-volume", (req, res) => {
  let dailySales = {};

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

      if (dailySales.hasOwnProperty(invoice.InvoiceDate)) {
        dailySales[invoice.InvoiceDate].NetTotal += parseFloat(
          invoice.DocumentTotals.NetTotal
        );
      } else {
        let date = new Date(invoice.InvoiceDate);
        let day = date.getDate();
        dailySales[invoice.InvoiceDate] = {
          Day: day,
          Period: parseInt(invoice.Period),
          NetTotal: parseFloat(invoice.DocumentTotals.NetTotal)
        };
      }
    });

    dailySales = Object.keys(dailySales).reduce(
      (r, v, i, a, k = dailySales[v].Period) => (
        (r[k] || (r[k] = [])).push(dailySales[v]), r
      ),
      {}
    );
    res.json(dailySales);
  });
});

// (not profit but instead is total net sales)
router.get("/total-net-sales", (req, res) => {
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

  let totalSales = 0;

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
        totalSales += parseFloat(invoice.DocumentTotals.NetTotal);
    });

    res.json({
      totalNetSales: totalSales
    });
  });
});

// GROSS_TOTAL = NET_TOTAL + TAX_PAYABLE
router.get("/total-gross-sales", (req, res) => {
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

  let totalSales = 0;
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
        totalSales += parseFloat(invoice.DocumentTotals.GrossTotal);
    });

    res.json({
      totalGrossSales: totalSales
    });
  });
});

// LINE_02
router.get("/cumulative-month-gross", (req, res) => {
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

  let cumulative = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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

    cumulative[0] = monthly[0];

    for (let i = 1; i < cumulative.length; i++)
      cumulative[i] = cumulative[i - 1] + monthly[i];

    res.json([
      {
        data: cumulative,
        label: "Cumulative Sales"
      },
      {
        data: monthly,
        label: "Monthly Sales"
      }
    ]);
  });
});

// INF_02
router.get("/profit", async (req, res) => {
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

  async.series(
    {
      account61: function(callback) {
        accountsSum(61, startDate, endDate, callback);
      },
      account71: function(callback) {
        accountsSum(71, startDate, endDate, callback);
      }
    },
    function(err, results) {
      if (err) {
        console.log(err);
        return;
      }

      let costOfGoodsSold = results.account61.debit - results.account61.credit;
      let revenueFromSales = results.account71.credit - results.account71.debit;
      res.json({
        profit: revenueFromSales - costOfGoodsSold,
        revenueFromSales: revenueFromSales,
        costOfGoodsSold: costOfGoodsSold
      });
    }
  );
});

// TODO: PIE_1

// TODO: INF_01

// TODO: BAR_01

module.exports = router;
