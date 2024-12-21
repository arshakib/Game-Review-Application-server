const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.q7sgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const userCollection = client.db("userDatabase").collection("users");
    const reviewCollection = client.db("userDatabase").collection("reviews");
    const watchlistCollection = client
      .db("userDatabase")
      .collection("watchlist");

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          url: req.body?.url,
          title: req.body?.title,
          description: req.body?.description,
          rating: req.body?.rating,
          year: req.body?.year,
          genre: req.body?.genre,
        },
      };
      const result = await reviewCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.get("/limitreviews", async (req, res) => {
      const result = await reviewCollection.find().limit(6).toArray();
      res.send(result);
    });

    app.get("/sortrating", async (req, res) => {
      const result = await reviewCollection
        .find()
        .sort({ rating: 1 })
        .toArray();
      res.send(result);
    });

    app.get("/sortyear", async (req, res) => {
      const result = await reviewCollection.find().sort({ year: -1 }).toArray();
      res.send(result);
    });

    app.get("/filter/:genre", async (req, res) => {
      const genre = req.params.genre;
      const query = {
        genre: genre,
      };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/review/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        userEmail: email,
      };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/watchlist", async (req, res) => {
      const watchlist = req.body;
      console.log(watchlist);
      const result = await watchlistCollection.insertOne(watchlist);
      res.send(result);
    });

    app.get("/watchlist/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        userEmail: email,
      };
      const result = await watchlistCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from server home");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
