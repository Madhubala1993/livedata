import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected");
  return client;
}

export const client = await createConnection();

app.get("/", function (req, res) {
  res.send("Hello World 😊😊😊😊");
});

app.get("/status", async function (req, res) {
  const fixValues = await getFixvalues();

  console.log(fixValues);
  res.send(fixValues);
});

app.post("/status", async function (req, res) {
  const data = req.body;

  console.log(data);
  const clearAll = await deletePrevious();
  const result = await addFixvalues(data);
  const fixValues = await getFixvalues();
  res.send(fixValues);
});

app.listen(PORT, () => console.log("App started in ", PORT));

async function getFixvalues() {
  return await client.db("mongo_db").collection("fixvalues").find({}).toArray();
}
async function addFixvalues(data) {
  return await client.db("mongo_db").collection("fixvalues").insertOne(data);
}
async function deletePrevious() {
  return await client.db("mongo_db").collection("fixvalues").deleteMany();
}
