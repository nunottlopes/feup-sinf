var assert = require("assert");
var MongoClient = require("mongodb").MongoClient;
var { url, dbName, config } = require("../config/config.js")["mongodb"];

// Documentation
// https://www.npmjs.com/package/mongodb
// https://mongodb.github.io/node-mongodb-native/3.2/api/

/* ----------- Simple actions ----------- */

function insertDocuments(db, collectionName, data) {
  const collection = db.collection(collectionName);

  // If _id is not defined  in data it will generate one randomly
  // Data needs to be an array
  // data example -> [{ a: 1 }, { a: 2 }, { a: 3 }]

  return collection
    .insertMany(data)
    .then(result => {
      console.log(`Successfully inserted ${result.result.n} items!`);
      return result;
    })
    .catch(err => console.error(`Failed to insert documents: ${err}`));
}

function findDocuments(db, collectionName, query, callback) {
  const collection = db.collection(collectionName);

  // To find all documents query = {}
  // To add a query filter, e.g. query = {'a': 3}
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);
    //console.log("Found the following records");
    //console.log(docs);
    callback(docs);
  });
}

function updateDocument(db, collectionName, query, change) {
  const collection = db.collection(collectionName);

  // query = { a: 2 },  change ={ $set: { b: 1 } } -> Update document where a is 2, set b equal to 1

  return collection
    .updateOne(query, change)
    .then(result => {
      console.log(`Successfully updated ${collectionName}`);
      return result;
    })
    .catch(err => {
      console.error(
        `Failed to update collection ${collectionName}. Errors: ${err}`
      );
    });
}

function removeDocument(db, collectionName, query, callback) {
  const collection = db.collection(collectionName);

  // e.g. query = { a: 3 } -> Deletes documents where a is 3
  collection.deleteOne(query, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log(`Removed the document found with the query ${query}`);
    callback(result);
  });
}

/* ----------- Connection and action ----------- */

function readDocuments(collectionName, query, callback) {
  MongoClient.connect(url, config, function(err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    findDocuments(db, collectionName, query, function(docs) {
      client.close();
      callback(docs);
    });
  });
}

function accountsSum(account,start_date,end_date){
  readDocuments("GeneralLedgerEntries","",(response) => {
    let journals = response[0]
    let credit = 0;
    let debit = 0;
    let startDate = 'start-date' in req.query ? new Date(req.query['start-date']) : null;
    let endDate = 'end-date' in req.query ? new Date(req.query['end-date']) : null;
    let account = req.params.account;
    
    journals.Journal.forEach((journal) => {
      if(journal.Transaction != undefined){
        if(Array.isArray(journal.Transaction)){
          journal.Transaction.forEach((transaction) => {
            let result = processTransaction(transaction,account,startDate,endDate)
            debit+=result.debit;
            credit+=result.credit;
          })
        } else{
            let result = processTransaction(journal.Transaction, account, startDate, endDate);
            credit += result.credit;
            debit += result.debit;
        }
       
      }
    })
  return {credit,debit}
})

}; 


module.exports = {
  insertDocuments,
  findDocuments,
  updateDocument,
  removeDocument,
  readDocuments,
  accountsSum
};
