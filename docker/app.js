const express = require('express')
const app = express()
const port = 8228

app.use(require("./server.js"))

app.listen(port, () => {
  console.log(`running dimden mood tracker on port ${port}`)
})