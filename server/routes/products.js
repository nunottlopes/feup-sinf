var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const { readDocuments } = require("../mongodb/actions");

/* PRODUCTS */
router.get(`/:productCode`, function(req, res) {
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
/*
router.get(`/:productCode/top-clients2`, function(req, res){
  let code = req.params.productCode;
  //Top clients
  findDocumentsDB("SourceDocuments","",(response) => {

   // res.send(response)
    let topClients = response[0].Invoice.find((invoice) => {
      let code = req.params.productCode
      if(invoice.Line != undefined){
        if(Array.isArray(invoice.Line))
        {
          let invoicesWithTheProduct = invoice.Line.find( (line) =>{
            return line.ProductCode == code
          })
          if(invoicesWithTheProduct != undefined){
            return true;
          }
          return false ;
        }else{
          return invoice.Line.ProductCode == code
        }
      }
      else return false
    })

    res.send(topClients)

  },code)
})
 */

//Como sacar production cost/units in stock?
router.get(`/:productCode/info`, function(req, res) {
  let code = req.params.productCode;
  //Top clients
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
                    amount: info[company].amount + line.UnitPrice,
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
                  amount: info[company].amount + invoice.Line.UnitPrice,
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
      res.send({ info, minimum, name, unitsSold });
    },
    code
  );
});

// KPI_01
router.get("/units-sold/:product", (req, res) => {
  let startDate =
    "start-date" in req.query ? new Date(req.query["start-date"]) : null;
  let endDate =
    "end-date" in req.query ? new Date(req.query["end-date"]) : null;

  let code = req.params.product;
  let units = 0;

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
          const { ProductCode, Quantity } = line;

          if (ProductCode === code) units += parseInt(Quantity);
        });
      }
    });

    res.json(units);
  });
});

// TODO: IMG_01 (prolly delete this)

// TODO: INF_02

// TODO: TABLE_01

module.exports = router;
