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

    // Validation for required fields
    if (!name || !description || !price || !category || !subCategory || !sizes) {
      return res.json({
        success: false,
        message: "All fields are required (name, description, price, category, subCategory, sizes)",
      });
    }

    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item != undefined,
    );

    // Validate at least one image is provided
    if (images.length === 0) {
      return res.json({
        success: false,
        message: "At least one image is required",
      });
    }

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

    // Parse sizes with error handling
    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
    } catch (parseError) {
      return res.json({
        success: false,
        message: "Invalid sizes format. Must be valid JSON array",
      });
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: parsedSizes,
      bestSeller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };
    console.log(productData);

    console.log(imagesUrl);

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
