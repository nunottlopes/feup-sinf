var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const parseSaft = require("../parser/saft").parseSaft;
const {readDocuments} = require("../mongodb/actions");

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

router.get(`/accounts`, function(req, res){

  //res.send("Ok");
  readDocuments("GeneralLedgerEntries","",(response) => {
    res.send(JSON.stringify(response[0].Journal)) 
  })
})



/* PURCHASES */
router.get(`/purchases/suppliers`, function(req, res){
  
  readDocuments
  readDocuments("MasterFiles","",(response) => {
    let suppliers = response.find((e) => {
      return e._id == 'Suppliers'
    }).Suppliers
    // console.log(suppliers)
    res.send(suppliers) 
  })
})

//Pode ser paged
router.get(`/purchases/expenses`, function(req, res){
  jasmin
  .getJasminAPI("/invoiceReceipt/expenses")
  .then(resp => {
    res.send(resp);
  })
  .catch(err => {
    res.send(err);
  });
})

router.get(`/purchases/pendent-bills`, function(req, res){

})

router.get(`/purchases/orders-delivery`, function(req, res){
  jasmin
  .getJasminAPI("/shipping/deliveries")
  .then(resp => {
    res.send(resp);
  })
  .catch(err => {
    res.send(err);
  });
})


/* FINANCIAL */


//https://moodle.up.pt/pluginfile.php/93952/mod_resource/content/1/PL_Balance_Sheet_specification.pdf

router.get(`/financial/balance`, function(req, res){

})

router.get(`/financial/ebit`, function(req, res){

})

router.get(`/financial/ebitda`, function(req, res){

})

router.get(`/financial/revenue`, function(req, res){

})

/* PRODUCTS */
router.get(`/product/:productCode`, function(req, res){
  
  readDocuments("MasterFiles","",(response) => {
    const products = response.find((type) => {
      return type._id == 'Products'
    }).Products;
    const product = products.find((product) => {
      return product.ProductCode == req.params.productCode;
    })
    res.send(product) 
  })


})

router.get(`/product/:productCode/top-clients`, function(req, res){
  let code = req.params.productCode;
  //Top clients
  readDocuments("SourceDocuments","",(response, ...params) => {
    let code = params.productCode;
    let topClients = response[0].Invoice.find((invoice) => {
      if(invoice.Line != undefined){
        if(Array.isArray(invoice.Line))
        {
          let cenas = invoice.Line.find( (line) =>{
            if(line.ProductCode == code) console.log(line.ProductCode == code)
            return line.ProductCode == code
          })
          if(cenas != undefined){
            console.log(invoice.ProductCode == code)
            console.log(cenas,code)
          } 
          return invoice.ProductCode == code;
        }else{
          return invoice.Line.ProductCode == code
        }
      }
      else return false
    })
    console.log(topClients)
    //console.log(topClients)
    res.send(topClients)
  },code)
})




/* INVENTORY */
router.get(`/inventory/`, function(req, res){
  readDocuments("MasterFiles","",(response) => {
    let products = response.find((e) => {
      return e._id == 'Products'
    }).products

    res.send(products) 
  })
})




/* server.get('/AccountSum/:account_id', (req, res) => {
  let startDate = 'start-date' in req.query ? new Date(req.query['start-date']) : null;
  let endDate = 'end-date' in req.query ? new Date(req.query['end-date']) : null;
  let account_id_filter = req.params.account_id;

  res.json(accountSumBetweenDates(account_id_filter, startDate, endDate));
}); */



/*

  Purchases

*/



module.exports = router;
