require('dotenv').config()
const express = require("ultimate-express");
const router = require("./server.js");

const app = express();
app.use(router);

app.listen(+process.env.PORT, () => {
    console.log("Mood tracker started at port " + process.env.PORT);
});