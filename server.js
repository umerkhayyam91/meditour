const express = require('express')
const app = express()
const dbConnect = require("./database/index");
const ErrorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const {PORT} = require("./config/index")
app.use(express.json({ limit: "50mb" }));

const labRouter = require("./routes/laboratory");

app.use(labRouter);

dbConnect();
app.use(ErrorHandler)
app.use(auth)

app.listen(PORT , ()=>{
    console.log('server running')
})