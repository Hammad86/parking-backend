import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { BASE_URL } from "./utils/constant.js";
import { AuthRouter } from "./api/routes/auth/authRouter.js";
import connectDB from './config/dbConnection.js';
import cors from "cors";
import fs from "fs";
import fileUpload from "express-fileupload";



dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );
app.use(morgan("dev"));

//Database Connection
connectDB("mongodb+srv://hammad:hammad123@cluster0.uhwo4m3.mongodb.net/test");

// Routes
app.use(`${BASE_URL}`, AuthRouter);

//Server Listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} `);
    
});
