var express = require("express");
var router = express.Router();
const getJasminAPI = require("../config/jasmin").getJasminAPI;
const parseSaft = require("../parser/saft").parseSaft;
const {findDocumentsDB, findSuppliers} = require("../mongodb/actions");

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
     res.send
     res.send(resp);
   })
   .catch(err => {
     res.send(err);
   });
})

router.get(`/accounts`, function(req, res){

  //res.send("Ok");
  findDocumentsDB("GeneralLedgerEntries","",(response) => {
    res.send(JSON.stringify(response[0].Journal)) 
  })
})



/* PURCHASES */
router.get(`/purchases/suppliers`, function(req, res){
  
  findDocumentsDB("MasterFiles","",(response) => {
    let suppliers = response.find((e) => {
      return e._id == 'Suppliers'
    }).Suppliers
    console.log(suppliers)
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
  
  findDocumentsDB("MasterFiles","",(response) => {
    const products = response.find((type) => {
      return type._id == 'Products'
    }).Products;
    const product = products.find((product) => {
      return product.ProductCode == req.params.productCode;
    })
    res.send(product) 
  })


})
/* 
router.get(`/product/:productCode/top-clients2`, function(req, res){
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
router.get(`/product/:productCode/info`, function(req, res){
  let code = req.params.productCode;
  //Top clients
  findDocumentsDB("SourceDocuments","",(response) => {
    let info = {};
    let minimum = Number.MAX_VALUE;
    let name;
    let unitsSold = 0;

    response[0].Invoice.forEach((invoice) => {

      let code = req.params.productCode
      let company = invoice.SourceID;
    
      if(invoice.Line != undefined){
        if(Array.isArray(invoice.Line))
        {
          invoice.Line.forEach( (line) =>{  
            if(line.ProductCode == code){
              if(info[company] != undefined){
                info[company] = {
                  units: info[company].units + 1, 
                  amount: info[company].amount + line.UnitPrice
                }
              } 
              else {
                info[company] = {units:1, amount: line.UnitPrice}
              }  

              if(line.UnitPrice < minimum)
                minimum = line.UnitPrice;
              

              if(name == undefined)
                name = line.ProductDescription

              unitsSold++;
            }
          })

        }else {
          console.log(invoice.Line)
          if(invoice.Line.ProductCode == code){
          
          if(info[company] != undefined){
            info[company] = {
              units: info[company].value + 1,
              amount: info[company].amount + invoice.Line.UnitPrice
            }
          } 
          else {
            info[company] = {units:1, amount: invoice.Line.UnitPrice}
          }

          if(invoice.Line.UnitPrice < minimum)
            minimum = invoice.Line.UnitPrice;

          if(name == undefined)
            name = invoice.Line.ProductDescription
          unitsSold++;
        }}
      }
    })
    res.send({info,minimum,name,unitsSold})
  },code)
})





/* INVENTORY */
router.get(`/inventory/`, function(req, res){
  findDocumentsDB("MasterFiles","",(response) => {
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
