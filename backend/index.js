const express = require("express");
const mainRouter = require("./routes/index");

const app = express();

// cors middleware
const cors = require("cors");
app.use(cors());

app.use("/api/v1", mainRouter);