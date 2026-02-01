import { v2 as cloudinary } from "cloudinary";
import productModal from "../modals/productModel.js";

// add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item != undefined,
    );

    console.log(
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };
    console.log(productData);

    console.log("images url",imagesUrl);

    // console.log(image1, image2, image3, image4);
    console.log(images);

    const newProduct = new productModal(productData);
    await newProduct.save();

    res.json({ success: true, message: "Successfully added product" });
  } catch (error) {
    console.log("product adding error", error);
    res.json({ success: false, message: error.message });
  }
};

// list product
const listProduct = async (req, res) => {
  // console.log(req.headers);
  try {
    const products = await productModal.find({});
    console.log(products);

    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// remove product
const removeProduct = async (req, res) => {
  try {
    const id = req.body.id;
    const product = await productModal.findByIdAndDelete(id);
    res.json({
      success: true,
      message: `Successfully deleted product ${id} ${product.name}`,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// single product

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModal.findById(productId); // Added await here
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { singleProduct, removeProduct, listProduct, addProduct };
