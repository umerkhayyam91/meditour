const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const dbConnect = require("./database/index");
const ErrorHandler = require("./middlewares/errorHandler");
const { PORT } = require("./config/index");
app.use(express.json({ limit: "50mb" }));

const labRouter = require("./routes/laboratory");
const pharmRouter = require("./routes/pharmacy");
const docRouter = require("./routes/doctor");
const hospRouter = require("./routes/hospital");
const ambulanceRouter = require("./routes/ambulance");
const physioRouter = require("./routes/physiotherapist");
const nutritionRouter = require("./routes/nutritionist");
const paramedicRouter = require("./routes/paramedic");
const psychologistRouter = require("./routes/psychologist");
const agencyRouter = require("./routes/travelAgency");
const rentCarRouter = require("./routes/rentCar");
const donationRouter = require("./routes/donation");
const hotelRouter = require("./routes/hotel");
const insuranceRouter = require("./routes/insurance");

app.use(labRouter);
app.use(pharmRouter);
app.use(docRouter);
app.use(hospRouter);
app.use(ambulanceRouter);
app.use(physioRouter);
app.use(nutritionRouter);
app.use(paramedicRouter);
app.use(psychologistRouter);
app.use(agencyRouter);
app.use(rentCarRouter);
app.use(donationRouter);
app.use(hotelRouter);
app.use(insuranceRouter);

dbConnect();
app.use(ErrorHandler);
app.listen(PORT, () => {
  console.log("server running");
});
