import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./Routes/user.route.js"; // importing user route
import companyroute from "./Routes/company.route.js"; // importing user route
import jobroute from "./Routes/job.route.js"; //importing job route
import applicationroute from "./Routes/application.route.js"; //importing application route
dotenv.config({});

const app = express(); // creating an express app

// middleware
app.use(express.json()); // so that we can send json data to the server
app.use(express.urlencoded({ extended: true })); //we can send form data to the server
app.use(cookieParser()); // so that we can send cookies to the server

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions)); // so that we can send cookies from the server to the client

// definining port number
const PORT = process.env.PORT || 3000;

// all the api's here !!
app.use("/api/user", userRoute); // using user route
app.use("/api/company", companyroute); // using company route
app.use("/api/job", jobroute); //using job route
app.use("/api/application", applicationroute); //using application route

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
