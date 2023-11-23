const express = require('express')
const app = express()
const dbConnect = require("./database/index");
const {PORT} = require("./config/index")
app.use(express.json({ limit: "50mb" }));

const labRouter = require("./routes/laboratory");

app.use(labRouter);

dbConnect();

app.listen(PORT , ()=>{
    console.log('server running')
})
