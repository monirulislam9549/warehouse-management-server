const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ts9so.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const mobileCollection = client.db('mobileWarehouse').collection('mobile');

        app.get('/mobile', async (req, res) => {
            const query = {};
            const cursor = mobileCollection.find(query);
            const mobiles = await cursor.toArray();
            res.send(mobiles);
        })

        app.get('/mobile/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const mobile = await mobileCollection.findOne(query);
            res.send(mobile);
        })

        app.post('/mobile', async (req, res) => {
            const newMobile = req.body;
            const result = await mobileCollection.insertOne(newMobile);
            res.send(result);
        })

        app.delete('/mobile/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await mobileCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}


run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('anything you can write')
});


app.listen(port, () => {
    console.log('Listening to port', port);
})