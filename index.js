const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
// const ObjectId = require("mongodb").ObjectId;
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
