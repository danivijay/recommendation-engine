const express = require("express");
const cors = require("cors");
const colors = require("colors");
const router = express.Router();
const connectDB = require('./mongo.js');

connectDB();

const {
    getItems,
    postRecommendations
} = require("./controllers/recommendationSystem");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/items", getItems);
app.post("/recommendations", postRecommendations);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server Running in port ${PORT}`.yellow.bold
  )
);