var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
const { insertDocuments } = require("./actions");
var {url, dbName, config} = require("../config/config.js")["mongodb"];


// var url = "mongodb://admin:admin@localhost:27017";
// const dbName = "sinf";
// const config = { useUnifiedTopology: true };

function handleAccountingSAFT(saftData, res) {
  saftData = saftData["AuditFile"];

  MongoClient.connect(url, config, function(err, client) {
    
    const db = client.db(dbName);

    const masterFilesData = getMasterFilesData(saftData);
    let promise1 = insertDocuments(db, "MasterFiles", masterFilesData);

    const sourceDocumentsData = getSourceDocumentsData(saftData);
    let promise2 = insertDocuments(db, "SourceDocuments", sourceDocumentsData);

    const generalLedgerEntriesData = getGeneralLedgerEntriesData(saftData);
    let promise3 = insertDocuments(
      db,
      "GeneralLedgerEntries",
      generalLedgerEntriesData
    );

    Promise.all([promise1, promise2, promise3]).then(function() {
      console.log("Data from SAF-T file successfully stored in database");
      res.status(201).send({
        message: "Data from SAF-T file successfully stored in database"
      });
    });
  });
}

function getMasterFilesData(saftData) {
  const masterFiles = saftData["MasterFiles"];
  let generalLedgerAccounts = masterFiles["GeneralLedgerAccounts"];
  generalLedgerAccounts._id = "GeneralLedgerAccounts";

  let costumers = {
    Customers: masterFiles["Customer"],
    _id: "Customers"
  };
  let suppliers = {
    Suppliers: masterFiles["Supplier"],
    _id: "Suppliers"
  };
  let products = {
    Products: masterFiles["Product"],
    _id: "Products"
  };
  let taxTables = {
    TaxTables: masterFiles["TaxTable"],
    _id: "TaxTables"
  };

  return [generalLedgerAccounts, costumers, suppliers, products, taxTables];
}

function getSourceDocumentsData(saftData) {
  let sourceDocuments = saftData["SourceDocuments"];
  let salesInvoices = sourceDocuments["SalesInvoices"];
  salesInvoices._id = "SalesInvoices";

  let movementOfGoods = sourceDocuments["MovementOfGoods"];
  movementOfGoods._id = "MovementOfGoods";

  return [salesInvoices, movementOfGoods];
}

function getGeneralLedgerEntriesData(saftData) {
  let generalLedgerEntries = saftData["GeneralLedgerEntries"];
  generalLedgerEntries._id = "GeneralLedgerEntries";

  return [generalLedgerEntries];
}

module.exports = { handleAccountingSAFT };
