import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

// const MONGO_URL = process.env.MONGO_URL;

// async function createConnection() {
//   const client = new MongoClient(MONGO_URL);
//   await client.connect();
//   console.log("Mongo is connected");
//   return client;
// }

// export const client = await createConnection();

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fixvalues",
});
conn.connect(function (err) {
  if (err) throw err;
  console.log("Connection Successfull...");
});

// app.get("/createDB", (req, res) => {
//   let sql = "CREATE DATABASE fixvalues";
//   conn.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send("Database Created...");
//   });
// });
app.get("/post", (req, res) => {
  var sql =
    "CREATE TABLE fixvalues (id INT  UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,unit VARCHAR(255), x int DEFAULT NULL, y int DEFAULT NULL, width int DEFAULT NULL, height int DEFAULT NULL)";
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  res.send("Post created");
  fixvalues;
});

// app.get("/status", async function (req, res) {
//   const data = req.body;

//   console.log(data);
//   let sql = "INSERT INTO posts SET?";
//   let query = conn.query(sql, data, (err, result) => {
//     if (err) throw err;
//     console.log("data", result);
//     res.send("Post added");
//   });
// });
// app.get("/status1", async function (req, res) {
//   const data = req.body;

//   console.log(data);
//   let sql = "INSERT INTO posts SET?";
//   let query = conn.query(sql, data, (err, result) => {
//     if (err) throw err;
//     console.log("data", result);
//     res.send("Post 2 added");
//   });
// });
// app.get("/getposts", (req, res) => {
//   let sql = "SELECT * FROM fixvalues";
//   let query = conn.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log("result", result);
//     res.send("get all");
//   });
// });
app.get("/delete", (req, res) => {
  let sql = "DROP TABLE posts";
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result", result);
    res.send("delete");
  });
});

app.get("/", function (req, res) {
  res.send("Hello World 😊😊😊😊");
});

app.get("/status", (req, res) => {
  console.log("get alll new");
  let sql = "SELECT * FROM fixvalues";
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result", result);
    res.send(result);
  });
});
app.post("/status", (req, res) => {
  console.log("post allll");
  const data = req.body;
  console.log(data);
  let sql = "DELETE FROM fixvalues";
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result", result);
    // res.send("delete");
  });
  sql =
    "CREATE TABLE posts (id INT  UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT, unit varchar, x int DEFAULT NULL, y int DEFAULT NULL, width int DEFAULT NULL, height int DEFAULT NULL)";
  sql = "INSERT INTO fixvalues SET?";
  query = conn.query(sql, data, (err, result) => {
    if (err) throw err;
    console.log("data", result);
  });
  sql = "SELECT * FROM fixvalues";
  query = conn.query(sql, (err, result) => {
    if (err) throw err;
    console.log("result", result);
    res.send(result);
  });
});

// app.get("/status", async function (req, res) {
//   const fixValues = await getFixvalues();

//   console.log(fixValues);
//   res.send(fixValues);
// });

// app.post("/status", async function (req, res) {
//   const data = req.body;

//   console.log(data);
//   const clearAll = await deletePrevious();
//   const result = await addFixvalues(data);
//   const fixValues = await getFixvalues();
//   res.send(fixValues);
// });

app.listen(PORT, () => console.log("App started in ", PORT));

// async function getFixvalues() {
//   return await client.db("mongo_db").collection("fixvalues").find({}).toArray();
// }
// async function addFixvalues(data) {
//   return await client.db("mongo_db").collection("fixvalues").insertOne(data);
// }
// async function deletePrevious() {
//   return await client.db("mongo_db").collection("fixvalues").deleteMany();
// }
