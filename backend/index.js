const express = require('express');
const cors = require('cors');
require("dotenv").config();
const routes = require('./routes/route.js');

const app = express()

// middleware
app.use(cors());
app.use(express.json())

app.use("/api",routes)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
