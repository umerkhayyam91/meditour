const express = require('express')
const app = express()
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const dbConnect = require("./database/index");
const ErrorHandler = require('./middlewares/errorHandler');
const {PORT} = require("./config/index")
app.use(express.json({ limit: "50mb" }));

const labRouter = require("./routes/laboratory");

app.use(labRouter);

await dbConnect();
app.use(ErrorHandler)
app.listen(PORT , ()=>{
    console.log('server running')
})