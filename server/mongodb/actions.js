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

function emptyDatabase(callback, saftData, parseAccountingSaft, res) {
  MongoClient.connect(url, config, async function(err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    await db.dropDatabase();

    callback(saftData, parseAccountingSaft, res);
  });
}

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

function accountsSum(account, startDate, endDate, callback) {
  readDocuments("GeneralLedgerEntries", "", response => {
    let journals = response[0];
    let credit = 0;
    let debit = 0;
    // let startDate =
    //   "start-date" in req.query ? new Date(req.query["start-date"]) : null;
    // let endDate =
    //   "end-date" in req.query ? new Date(req.query["end-date"]) : null;
    // let account = req.params.account;

    journals.Journal.forEach(journal => {
      if (journal.Transaction != undefined) {
        if (Array.isArray(journal.Transaction)) {
          journal.Transaction.forEach(transaction => {
            let result = processTransaction(
              transaction,
              account,
              startDate,
              endDate
            );
            debit += result.debit;
            credit += result.credit;
          });
        } else {
          let result = processTransaction(
            journal.Transaction,
            account,
            startDate,
            endDate
          );
          credit += result.credit;
          debit += result.debit;
        }
      }
    });
    callback(null, credit - debit);
    // return { credit, debit };
  });
}

function accountsSumMontlhy(account, startDate, endDate, callback) {
  readDocuments("GeneralLedgerEntries", "", response => {
    let journals = response[0];
    let accountSumMontlhy = {};
    let fiscalYear = 2019;
    if (endDate !== null && endDate !== undefined) {
      fiscalYear = endDate.getFullYear();
    }

    for (let i = 1; i <= 12; i++) {
      let start_date = new Date(fiscalYear + "-" + i + "-01");
      let end_date = new Date(fiscalYear + "-" + i + "-31");

      let credit = 0;
      let debit = 0;

      journals.Journal.forEach(journal => {
        if (journal.Transaction != undefined) {
          if (Array.isArray(journal.Transaction)) {
            journal.Transaction.forEach(transaction => {
              let result = processTransaction(
                transaction,
                account,
                start_date,
                end_date
              );
              debit += result.debit;
              credit += result.credit;
            });
          } else {
            let result = processTransaction(
              journal.Transaction,
              account,
              start_date,
              end_date
            );
            credit += result.credit;
            debit += result.debit;
          }
        }
      });

      accountSumMontlhy[i] = {
        totalCredit: credit,
        totalDebit: debit
      };
    }

    callback(null, accountSumMontlhy);
  });
}

processTransaction = (transaction, account, startDate, endDate) => {
  function processLine(line, type) {
    //Não é fornecedores
    if ((line.AccountID + " ").indexOf(account) != 0) return 0;
    //if((line.AccountID+ " ").indexOf(63) == 0)console.log(line.AccountID, type, line.CreditAmount,line.DebitAmount )
    return type == "credit" ? line.CreditAmount : line.DebitAmount;
  }

  let date = new Date(transaction.TransactionDate);
  if (
    (startDate != null && date < startDate) ||
    (endDate != undefined && date > endDate)
  ) {
    return { credit: 0, debit: 0 };
  }

  let credit = 0;
  let debit = 0;

  let lines = transaction.Lines;

  if (lines.CreditLine) {
    if (Array.isArray(lines.CreditLine)) {
      credit += lines.CreditLine.map(line => {
        return processLine(line, "credit");
      }).reduce((n1, n2) => n1 + n2);
    } else {
      credit += processLine(lines.CreditLine, "credit");
    }
  }

  if (lines.DebitLine) {
    if (Array.isArray(lines.DebitLine)) {
      debit += lines.DebitLine.map(line => {
        return processLine(line, "debit");
      }).reduce((n1, n2) => n1 + n2);
    } else {
      debit += processLine(lines.DebitLine, "debit");
    }
  }
  return { credit, debit };
};

module.exports = {
  insertDocuments,
  findDocuments,
  updateDocument,
  removeDocument,
  readDocuments,
  accountsSum,
  accountsSumMontlhy,
  emptyDatabase
};
