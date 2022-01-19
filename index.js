const express = require("express");
const app = express();
let cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleWire
app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://akash:TboxYrq4GJEG0uZn@cluster0.gribw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("travelDb");
    const serviceCollection = database.collection("services");
    const orderCollection = database.collection("orders");
    //load or get all data from database
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //sigle data loading with id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });
    //insert Booking
    app.post("/orders", async (req, res) => {
      const customerInfo = req.body;
      const result = await orderCollection.insertOne(customerInfo);
      res.json(result);
    });
    //get myBooking
    app.get("/myOrders", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    //delete mybooking
    app.delete("/myOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    //insert new Service
    app.post("/addUser", async (req, res) => {
      const newServiceInfo = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        Duration: req.body.Duration,
        price: req.body.price,
        picture: req.body.picture,
        about: req.body.about,
      };
      const result = await serviceCollection.insertOne(newServiceInfo);
      res.json(result);
    });
    //Update status
    app.put("/updateStatus/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "approved",
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
