import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";

//App Config
const app = express();

const port = process.env.PORT || 4000;

connectDb();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.use("/api/user",userRouter)

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log("Server started on PORT: " + port);
});
