var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

// INF_01
router.get(`/:productCode`, function(req, res) {
  // if (!req.isLogged) {
  //   res.status(401).send({ error: "Request unauthorized" });
  //   return;
  // }
  readDocuments("MasterFiles", "", response => {
    const products = response.find(type => {
      return type._id == "Products";
    }).Products;
    const product = products.find(product => {
      return product.ProductCode == req.params.productCode;
    });
    res.send(product);
  });
});

// KPI_01 & TABLE_01 & MinimumUnitPrice
router.get(`/:productCode/info`, function(req, res) {
  // if (!req.isLogged) {
  //   res.status(401).send({ error: "Request unauthorized" });
  //   return;
  // }
  let code = req.params.productCode;
  readDocuments(
    "SourceDocuments",
    "",
    response => {
      let info = {};
      let minimum = Number.MAX_VALUE;
      let name;
      let unitsSold = 0;

      response[0].Invoice.forEach(invoice => {
        let code = req.params.productCode;
        let company = invoice.SourceID;

        if (invoice.Line != undefined) {
          if (Array.isArray(invoice.Line)) {
            invoice.Line.forEach(line => {
              if (line.ProductCode == code) {
                if (info[company] != undefined) {
                  info[company] = {
                    units: info[company].units + 1,
                    amount: info[company].amount + line.UnitPrice
                  };
                } else {
                  info[company] = { units: 1, amount: line.UnitPrice };
                }

                if (line.UnitPrice < minimum) minimum = line.UnitPrice;

                if (name == undefined) name = line.ProductDescription;

                unitsSold++;
              }
            });
          } else {
            if (invoice.Line.ProductCode == code) {
              if (info[company] != undefined) {
                info[company] = {
                  units: info[company].value + 1,
                  amount: info[company].amount + invoice.Line.UnitPrice
                };
              } else {
                info[company] = { units: 1, amount: invoice.Line.UnitPrice };
              }

              if (invoice.Line.UnitPrice < minimum)
                minimum = invoice.Line.UnitPrice;

              if (name == undefined) name = invoice.Line.ProductDescription;
              unitsSold++;
            }
          }
        }
      });
      res.send({ clients: info, minimumUnitPrice: minimum, name, unitsSold });
    },
    code
  );
});

// IMG_01 (remove)

// INF_02 (remove)

module.exports = router;
