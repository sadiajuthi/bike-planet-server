const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


// connect to database
const { query } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yebql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// main run funtion
async function run() {
    try {
        await client.connect();
        const productCollection = client.db("bikePlanet").collection("product");



        // get all product
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        // Add item by email
        app.get('/myproduct', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const cursor = productCollection.find(query);
            const product = await cursor.toArray();
            res.send(product)
        })

        // get one product by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        //update a product
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateProduct.quantity
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, options)
            res.send(result);
        });



        // Add new Item
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log('add new item', newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result)

        });



        // Delete a item
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);

        });


    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('listening to port', port);
})