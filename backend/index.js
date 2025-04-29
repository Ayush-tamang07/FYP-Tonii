const express = require('express');
const cors = require('cors');
require("dotenv").config();
const routes = require('./routes/route.js');
const app = express()
const startReminderScheduler = require('./utils/reminderScheduler.js'); 

// middleware
app.use(cors());
app.use(express.json())

app.use("/api",routes)
// startReminderScheduler();

const PORT = process.env.PORT;

app.listen(PORT);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports = app;