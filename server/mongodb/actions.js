var assert = require("assert");
var MongoClient = require("mongodb").MongoClient;
var {url, dbName, config} = require("../config/config.js")["mongodb"];

// Documentation
// https://www.npmjs.com/package/mongodb
// https://mongodb.github.io/node-mongodb-native/3.2/api/

/* ----------- Simple actions ----------- */

function insertDocuments(db, collectionName, data, callback) {
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

function updateDocument(db, collectionName, query, change, callback) {
  const collection = db.collection(collectionName);

  // query = { a: 2 },  change ={ $set: { b: 1 } } -> Update document where a is 2, set b equal to 1
  collection.updateOne(query, change, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log(
      `Updated the documents found with the query ${query} to ${change}`
    );
    callback(result);
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
  })
}


// function findDocumentsDB(collectionName,query, callback) {

//   const config = { useUnifiedTopology: true };
//   const dbName = "sinf"
//   MongoClient.connect("mongodb://admin:admin@localhost:27017", config, function(err, client) {
//     assert.equal(null, err);

//     const db = client.db(dbName);

//     const collection = db.collection(collectionName);

//     // To find all documents query = {}
//     // To add a query filter, e.g. query = {'a': 3}
//     collection.find(query).toArray(function(err, docs) {
//       assert.equal(err, null);
//      // console.log("Found the following records");
//      // console.log(docs);
//       callback(docs);
//     });
//   })
// }

// function findSuppliers(callback) {
  
//   const config = { useUnifiedTopology: true };
//   const dbName = "sinf"
//   MongoClient.connect("mongodb://admin:admin@localhost:27017", config, function(err, client) {
//     assert.equal(null, err);

//     const db = client.db(dbName);

//     const collection = db.collection("MasterFiles");
//     const query = `{"_id":"Suppliers"}`
//     // To find all documents query = {}
//     // To add a query filter, e.g. query = {'a': 3}
//     collection.find(query).toArray(function(err, docs) {
//       assert.equal(err, null);
//       //console.log("Found the following records");
//      // console.log(docs);
//       callback(docs);
//     });
//   })
// }

module.exports = {
  insertDocuments,
  findDocuments,
  updateDocument,
  removeDocument,
  readDocuments
  // findDocumentsDB,
  // findSuppliers
};
