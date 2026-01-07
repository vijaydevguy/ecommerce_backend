import express from "express";

import {
  singleProduct,
  removeProduct,
  listProduct,
  addProduct,
} from "../controllers/productController";

const productRouter = express.Router();

productRouter.post('/add',addProduct);
productRouter.post('/remove',removeProduct);
productRouter.post('/list',listProduct);
productRouter.post('/single',singleProduct);

export default productRouter;

