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



module.exports = router;
