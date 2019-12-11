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

router.get(`/:productCode/top-clients`, function(req, res) {
  let code = req.params.productCode;
  //Top clients
  readDocuments(
    "SourceDocuments",
    "",
    (response, ...params) => {
      let code = params.productCode;
      let topClients = response[0].Invoice.find(invoice => {
        if (invoice.Line != undefined) {
          if (Array.isArray(invoice.Line)) {
            let cenas = invoice.Line.find(line => {
              if (line.ProductCode == code)
                console.log(line.ProductCode == code);
              return line.ProductCode == code;
            });
            if (cenas != undefined) {
              console.log(invoice.ProductCode == code);
              console.log(cenas, code);
            }
            return invoice.ProductCode == code;
          } else {
            return invoice.Line.ProductCode == code;
          }
        } else return false;
      });
      console.log(topClients);
      //console.log(topClients)
      res.send(topClients);
    },
    code
  );
});

module.exports = router;
