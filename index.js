const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@myfirstcluster.agauwwe.mongodb.net/?appName=MyFirstCluster`;

app.get("/", (req, res) => {
  res.send("Message From Server Home");
});

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
    await client.connect();
    const db = client.db("cleanlinessDB");
    const issuesCollection = db.collection("issues");

    // ADD ISSUE API
    app.post("/add-issue", async (req, res) => {
      const newIssue = req.body;
      const result = await issuesCollection.insertOne(newIssue);
      res.send(result);
    });

    // ALL ISSUES API
    app.get("/all-issues", async (req, res) => {
      const cursor = issuesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // LATEST ISSUES API
    app.get("/latest-issues", async (req, res) => {
      const cursor = issuesCollection.find().limit(6).sort({ date: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
