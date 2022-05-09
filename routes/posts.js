var express = require('express');
var router = express.Router();
const {MongoClient} = require('mongodb');
const vars = require("../vars");

const url = 'mongodb://admin:bartc28@localhost:27017';
const client = new MongoClient(url);

const dbName = 'posts';

class Post {
    _id;
    datetime;
    message;
    from;
    ip;

    constructor(obj = {}) {
        Object.assign(this, obj);
    }

    forDb() {
        return {
            message: this.message,
            from: this.from,
            datetime: Math.floor(new Date().getTime() / 1000),
            ip: this.ip,
        }
    }

    serialize() {
        return {
            id: this._id,
            message: this.message,
            from: this.from,
            datetime: this.datetime,
            ip: this.ip
        }
    }

    validate() {
        return [this.message, this.from].every(v => !!v);
    }

}

router.use(express.json());

let sendErr = (resp, msg) => {
    resp.json({
        message: msg,
        success: false
    })
}

/* GET users listing. */
router.get('/', async function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    let docs = await getDocuments() || [];
    if (Array.isArray(docs)) {
        docs = docs.map(d => new Post(d).serialize());
    }
    res.json(docs);
});

router.get('/:id', async function(req, res) {
    await client.connect();
    let id = req.params.id;
    const db = client.db(dbName);
    const collection = db.collection('post');

    const findResult = await collection.find({
        _id: id
    }).sort({
        datetime: -1
    }).toArray();
    res.json(findResult);
})

router.get('/from/:name', async function(req, res) {
    await client.connect();
    let name = req.params.name;
    const db = client.db(dbName);
    const collection = db.collection('post');

    const findResult = await collection.find({
        from: name
    }).sort({
        datetime: -1
    }).toArray();

    res.json(findResult);
})

router.get('/new', function (res, res) {
    res.render('newpost', {title: vars.get('title')});
})

router.post('/', async (req, res) => {

    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let post = new Post(Object.assign({}, req.body, {ip}));
    if (post.validate()) {

        await client.connect();
        var db = client.db(dbName);
        db.collection("post").insertOne(post.forDb(), (err, dbres) => {
            if (err) {
                sendErr(res, 'Could not insert data, db error');
                return;
            }
            res.json({
                message: 'Added successfully',
                success: true,
                db: dbres
            })
            client.close();
        })


    } else {
        sendErr(res, 'Could not insert data invalid')
    }
});

let getDocuments = async () => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('post');

    const findResult = await collection.find({}).sort({
        datetime: -1
    }).toArray();
    return findResult;
}

module.exports = router;
