// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv/config";
// import connectDb from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";
// import userRouter from "./routes/userRoute.js";
// import productRouter from "./routes/productRoute.js";
// import cartRouter from "./routes/cartRouter.js";
// import orderRouter from "./routes/orderRoute.js";

// //App Config
// const app = express();

// const port = process.env.PORT || 4000;

// connectDb();
// connectCloudinary();

// //middlewares
// app.use(express.json());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "https://ecommerce-frontend-five-orpin.vercel.app/",
//     ],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization", "token"],
//   }),
// );

// //api endpoints
// app.use("/api/user", userRouter);
// app.use("/api/product", productRouter);
// app.use("/api/cart", cartRouter);

// //orders endpoint
// app.use("/api/order", orderRouter);

// app.get("/", (req, res) => {
//   res.send("API working");
// });

// // app.listen(port, () => {
// //   console.log("Server started on PORT: " + port);
// // });

// const port_val = Number(process.env.PORT) || 4000;
// if (Number.isNaN(Number(process.env.PORT))) {
//   console.warn("process.env.PORT is not a valid number; falling back to", port_val);
// }
// app.listen(port_val, () => console.log("Server started on PORT: " + port_val));


import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRoute.js";

//App Config
const app = express();

const port = process.env.PORT || 4000;

connectDb();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://ecommerce-frontend-five-orpin.vercel.app",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token", "Accept"],
  }),
);

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

//orders endpoint
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

// app.listen(port, () => {
//   console.log("Server started on PORT: " + port);
// });

const port_val = Number(process.env.PORT) || 4000;
if (Number.isNaN(Number(process.env.PORT))) {
  console.warn(
    "process.env.PORT is not a valid number; falling back to",
    port_val,
  );
}
app.listen(port_val, () => console.log("Server started on PORT: " + port_val));
