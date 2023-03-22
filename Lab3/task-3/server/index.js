const express = require("express");
const cors = require('cors');

const app = express();
app.use(cors());

const port = 3000;

const fruits = ["apple", "banana", "cherry", "orange", "grape"];

app.get("/getFruits", (req, res) => {
  res.json(fruits);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});