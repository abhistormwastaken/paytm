const express = require("express");
const mainRouter = require("./routes/index");

const app = express();

// cors and body parser middleware
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);
app.listen(3000)