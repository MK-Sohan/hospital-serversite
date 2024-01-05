const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { ObjectId } = require("mongodb");
var cors = require("cors");
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://hospitalProject:kBfJRQkArn0bymDe@hospital.bhantxq.mongodb.net/allmedicen?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client
  .connect()
  .then((result) => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB not connected");
  });

async function run() {
  try {
    await client.connect();

    // ----------- collections -------------------
    // const collection = client.db("allmedicen").collection("medicen");
    const database = client.db("allmedicen");
    const collection = database.collection("medicen");
    const allDoctors = client.db("allDoctors").collection("doctor");
    const allAmbulance = client.db("allambulance").collection("ambulance");
    const noneAcAmbulance = client
      .db("allambulance")
      .collection("noneacambulance");
    const allMedicine = client.db("allmedicine").collection("medicines");
    const cartCollection = client.db("allCartData").collection("cartData");
    const userCollection = client.db("allUsersData").collection("allUsers");

    // ----------- collections end-------------------

    // ----------- apis -------------------
    app.post("/user", async (req, res) => {
      const newuser = req.body;
      console.log("newuser", newuser);
      const result = await collection.insertOne(newuser);
      //   res.send({ result: "successme" });
      res.send(result);
    });

    //  all doctors get api ----------
    app.get("/alldoctors", async (req, res) => {
      const query = {};
      const cursor = allDoctors.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //   doctors detail api ----------
    app.get("/alldoctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // Use 'new' keyword here
      const result = await allDoctors.findOne(query);
      res.send(result);
    });

    app.get("/allAmbulance", async (req, res) => {
      const query = {};
      const cursor = allAmbulance.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/noneacAmbulances", async (req, res) => {
      const query = {};
      const cursor = noneAcAmbulance.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/allmedicine", async (req, res) => {
      const query = {};
      const cursor = allMedicine.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allmedicine/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // Use 'new' keyword here
      const result = await allMedicine.findOne(query);
      res.send(result);
    });
    //  get cart data

    app.get("/cartallproducts", async (req, res) => {
      const query = {};
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/cartallproducts/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // ------- add to cart api --------
    app.put("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const cartProduct = req.body;
      const filter = { _id: id };
      const options = { upsert: true };
      const updateDoc = {
        $set: cartProduct,
      };
      const result = await cartCollection.updateOne(filter, updateDoc, options);
      // const cart = req.body;
      // const result = await cartCollection.insertOne(cart);
      res.send(result);
    });
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    //  user add to the database api

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    app.get("/alluser", async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
    // ----------- apis end-------------------
  } finally {
  }
}
run().catch(console.dir);

//  mongodb code end  here --------------

app.get("/", (req, res) => {
  res.send("taj is the owner of this serverrfor ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
