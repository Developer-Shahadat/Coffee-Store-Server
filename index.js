const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middle Ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f3c1ntb.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    // Users Data
    const userCollection = client.db("coffeeDB").collection('users')

    // server a data load
    // Read DB
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // data update
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // Data db a update
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateData = req.body;
      const options = { upsert: true };
      const coffee = {
        $set: {
          name: updateData.name,
          quantity: updateData.quantity,
          supplier: updateData.supplier,
          taste: updateData.taste,
          category: updateData.category,
          details: updateData.details,
          photo: updateData.photo,
        },
      };
      const result = await coffeeCollection.updateOne(query,coffee,options)
      res.send(result);
    });

    // Backend a data jawar jonno
    // Create DB
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // Deleted By DB
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Users Related

    app.get('/users',async(req,res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)

    })
// Backend a user data pathano 
    app.post('/users', async (req,res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    app.patch('/users', async(req,res) => {
      const users = req.body;
      const filter = {email : users.email};
      const updateDoc = {
        $set: {
          lastLoginAt : users.lastLoginAt
        }
      }
      const result = await userCollection.updateOne(filter,updateDoc);
      res.send(result)
    })

    app.delete("/users/:id", async (req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })




    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee Store Server Running");
});

app.listen(port, () => {
  console.log(`Coffee Server Port On : ${port}`);
});
