var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
const { insertDocuments, updateDocument } = require("./actions");
var { url, dbName, config } = require("../config/config.js")["mongodb"];

function handleDemoSAFT(saftData, parseAccountingSaft, res) {
  saftData = saftData["AuditFile"];

  MongoClient.connect(url, config, function(err, client) {
    assert.equal(err, null);

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

    return Promise.all([promise1, promise2, promise3]).then(function() {
      console.log("Data from DEMO SAF-T file successfully stored in database");
      parseAccountingSaft(res);
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

function handleAccountingSAFT(saftData, res) {
  saftData = saftData["AuditFile"];

  MongoClient.connect(url, config, function(err, client) {
    assert.equal(err, null);

    const db = client.db(dbName);

    const accounts =
      saftData["MasterFiles"]["GeneralLedgerAccounts"]["Account"];
    let promise1 = updateDocument(
      db,
      "MasterFiles",
      { _id: "GeneralLedgerAccounts" },
      { $push: { Account: accounts } }
    );

    const costumers = saftData["MasterFiles"]["Customer"];
    let promise2 = updateDocument(
      db,
      "MasterFiles",
      { _id: "Customer" },
      { $push: { Customers: costumers } }
    );

    const suppliers = saftData["MasterFiles"]["Supplier"];
    let promise3 = updateDocument(
      db,
      "MasterFiles",
      { _id: "Suppliers" },
      { $push: { Suppliers: suppliers } }
    );

    const taxTableEntries =
      saftData["MasterFiles"]["TaxTable"]["TaxTableEntry"];
    let promise4 = updateDocument(
      db,
      "MasterFiles",
      { _id: "TaxTables" },
      { $push: { TaxTableEntry: taxTableEntries } }
    );

    const journals = saftData["GeneralLedgerEntries"]["Journal"];
    const numberOfEntries = saftData["GeneralLedgerEntries"]["NumberOfEntries"];
    const totalDebit = saftData["GeneralLedgerEntries"]["TotalDebit"];
    const totalCredit = saftData["GeneralLedgerEntries"]["TotalCredit"];
    let promise5 = updateDocument(
      db,
      "GeneralLedgerEntries",
      { _id: "GeneralLedgerEntries" },
      {
        $push: { Journal: journals },
        $inc: {
          NumberOfEntries: numberOfEntries,
          TotalDebit: totalDebit,
          TotalCredit: totalCredit
        }
      }
    );

    Promise.all([promise1, promise2, promise3, promise4, promise5]).then(
      function() {
        console.log(
          "Data from Accounting SAF-T file successfully stored in database"
        );
        res.status(201).send({
          message: "Data from SAF-T files successfully stored in database"
        });
      }
    );
  });
}

module.exports = { handleDemoSAFT, handleAccountingSAFT };
