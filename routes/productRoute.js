import express from "express";

import {
  singleProduct,
  removeProduct,
  listProduct,
  addProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  //this added ai i am not did this
  adminAuth,
  //middle ware to handle images multer
  upload.fields([
    {
      name: "image1",
      maxCount: 1,
    },
    {
      name: "image2",
      maxCount: 1,
    },
    {
      name: "image3",
      maxCount: 1,
    },
    {
      name: "image4",
      maxCount: 1,
    },
  ]),
  addProduct
);

//adminAuth is middle it will check admin pass and email with jwt

productRouter.post("/remove", adminAuth, removeProduct);
productRouter.get("/list",  listProduct);
productRouter.get("/single", singleProduct);

export default productRouter;
