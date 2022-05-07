var express = require('express');
var router = express.Router();
const {MongoClient} = require('mongodb');

const url = 'mongodb://admin:bartc28@localhost:27017';
const client = new MongoClient(url);

const dbName = 'posts';

router.use(express.json());

/* GET users listing. */
router.get('/', async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    let docs = await getDocuments();
    res.json(docs);
});

let getDocuments = async () => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('post');

    const findResult = await collection.find({}).toArray();
    return findResult;
}

module.exports = router;