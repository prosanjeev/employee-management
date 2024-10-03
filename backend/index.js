import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import adminRoute from "./routes/adminRoute.js"
import employeeRoute from "./routes/employeeRoute.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config({})
const app = express();


const PORT = process.env.PORT || 5000;

//middleware
// To resolve __dirname in ES module syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
const corsOption={
    origin:'http://localhost:3000',
    credentials:true
};
app.use(cors(corsOption)); 

//routes
app.use("/api/v1/user", adminRoute)
app.use("/api/v1/employee", employeeRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`server listen at port ${PORT}`)
})