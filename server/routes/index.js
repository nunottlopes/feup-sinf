var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const parseSaft = require("../parser/saft").parseSaft;

/* GET home page. */
router.get("/", function(req, res) {
  // Example
  getJasminAPI("/taxesCore/taxTypeCodes/getTaxTypeInfo")
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/parse/saft", function(req, res) {
  console.log("Parsing SAF-T file");
  parseSaft(res);
});


router.get(`/billing`, function(req,res){
   jasmin
   .getJasminAPI("/billing/invoices/")
   .then(resp => {
     res.send(resp);
   })
   .catch(err => {
     res.send(err);
   });
})




/*

  Purchases

*/



module.exports = router;
