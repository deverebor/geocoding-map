export const express = require("express");
const cors = require("cors");
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// initialize express
const app = express();

// enable cors
app.use(cors());

// routes
app.use('/api/search/', require('./routes/search/search'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🦥.`);
})