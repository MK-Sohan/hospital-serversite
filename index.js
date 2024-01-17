const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { ObjectId } = require("mongodb");
var cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@hospital.bhantxq.mongodb.net/allmedicen?retryWrites=true&w=majority`;
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

function varifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ message: "Un authorize access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    // console.log("this is decoded", decoded);
    next();
  });
}

async function run() {
  try {
    // await client.connect();

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
    const blooddonorCollection = client
      .db("allBlooddonor")
      .collection("blooddonor");

    const allOrdersCollection = client
      .db("allcustomerOrders")
      .collection("customerOrders");

    const appointmentCollection = client
      .db("allclientappointments")
      .collection("appointments");

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

    // blood donor api

    app.get("/bloodDonor", async (req, res) => {
      const query = {};
      const cursor = blooddonorCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/addbloodDonor", varifyJwt, async (req, res) => {
      const donor = req.body;
      // console.log("donor", donor);
      const result = await blooddonorCollection.insertOne(donor);
      //   res.send({ result: "successme" });
      res.send(result);
    });
    // delete donor
    app.delete("/donorDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blooddonorCollection.deleteOne(query);
      res.send(result);
    });

    // add doctor api----------
    app.post("/addDoctor", varifyJwt, async (req, res) => {
      const doctor = req.body;
      // console.log("doctor", doctor);
      const result = await allDoctors.insertOne(doctor);
      //   res.send({ result: "successme" });
      res.send(result);
    });
    //  delete doctor api-------

    app.delete("/DoctorDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allDoctors.deleteOne(query);
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

    //  add medicine
    app.post("/addmedicine", varifyJwt, async (req, res) => {
      const medicine = req.body;
      // console.log("newuser", medicine);
      const result = await allMedicine.insertOne(medicine);
      //   res.send({ result: "successme" });
      res.send(result);
    });
    // app.put("/addmedicine/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const medicine = req.body;
    //   const filter = { _id: id };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: medicine,
    //   };
    //   const result = await allMedicine.updateOne(filter, updateDoc, options);
    //   // const cart = req.body;
    //   // const result = await cartCollection.insertOne(cart);
    //   res.send(result);
    // });

    app.delete("/medicineDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allMedicine.deleteOne(query);
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

    app.post("/allcustomerorders", varifyJwt, async (req, res) => {
      const orders = req.body;
      // console.log("orders", orders);
      const result = await allOrdersCollection.insertOne(orders);
      res.send(result);
    });
    app.get("/deliver-all-orders", async (req, res) => {
      const query = {};
      const cursor = allOrdersCollection.find(query);
      // console.log(cursor);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/customerOrderdelete/:id", varifyJwt, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allOrdersCollection.deleteOne(query);
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
      var token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "40d",
      });
      res.send({ result, token });
    });

    // making an user admin api-------------
    app.put("/user/admin/:email", varifyJwt, async (req, res) => {
      const email = req.params.email;
      const requester = req.decoded?.email;
      const requesterAccount = await userCollection.findOne({
        email: requester,
      });
      // console.log(requesterAccount);
      if (requesterAccount?.role === "admin") {
        const filter = { email: email };

        const updateDoc = {
          $set: { role: "admin" },
        };
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
      } else {
        res.status(403).send({ message: "Forbidden Accrss" });
      }
    });
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      // console.log(isAdmin);
      res.send(isAdmin);
    });

    app.get("/alluser", async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    // app.delete("/delete-user/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email };
    //   const result = await userCollection.deleteOne(query);
    //   res.send(result);
    // });
    app.delete("/deleteuser/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // add appointment
    app.post("/addappointment", async (req, res) => {
      const product = req.body;
      const result = await appointmentCollection.insertOne(product);
      res.send(result);
    });
    app.get("/allappointments", async (req, res) => {
      const query = {};
      const cursor = appointmentCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/myappointment/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = appointmentCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/deletemyappointment/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await appointmentCollection.deleteOne(query);
      res.send(result);
    });
    // ----------- apis end-------------------`
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
