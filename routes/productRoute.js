import express from "express";

import {
  singleProduct,
  removeProduct,
  listProduct,
  addProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
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
productRouter.post("/remove", removeProduct);
productRouter.get("/list", listProduct);
productRouter.get("/single", singleProduct);

export default productRouter;
