var express = require("express");
var router = express.Router();
const jasmin = require("../config/jasmin");
const getJasminAPI = require("../config/jasmin").getJasminAPI;
var request = require("request-promise");

/* GET home page. */
router.get("/", function(req, res) {
  // Example
  getJasminAPI("/taxesCore/taxTypeCodes/getTaxTypeInfo")
    .then(resp => {
      res.send((resp));
    })
    .catch(err => {
      res.send(err);
    });
});

router.get(`/testes`, function(req,res){
   
   jasmin
   .getJasminAPI("/billing/invoices/")
   .then(resp => {
     res.send(resp);
   })
   .catch(err => {
     res.send(err);
   });
  
})

module.exports = router;
