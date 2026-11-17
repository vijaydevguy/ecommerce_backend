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

    const isDemo =
      req.headers.isdemo === "true" ||
      req.body.isDemo === "true" ||
      req.body.isDemo === true;

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
      isDemo: Boolean(isDemo),
      expireAt: isDemo ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
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

// list product with search, filter, sort, and pagination
const listProduct = async (req, res) => {
  try {
    // Lazy cleanup: purge any demo products whose 24-hour TTL has expired
    try {
      await productModal.deleteMany({
        expireAt: { $ne: null, $lte: new Date() },
      });
    } catch (cleanupErr) {
      // Non-blocking cleanup fallback
    }

    const {
      page = 1,
      limit = 12,
      search = "",
      category = "",
      subCategory = "",
      sort = "relavent",
      bestseller,
      bestSeller,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    // 1. Search filter: search name, description, category, subCategory
    const searchTrimmed = String(search).trim();
    if (searchTrimmed !== "") {
      const searchRegex = new RegExp(searchTrimmed, "i");
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { subCategory: searchRegex },
      ];
    }

    // 2. Category filter: support single value, array, or comma-separated string
    if (category) {
      const catList = Array.isArray(category)
        ? category
        : String(category).split(",").map((c) => c.trim()).filter(Boolean);
      if (catList.length > 0) {
        filter.category = {
          $in: catList.map((c) => new RegExp(`^${c}$`, "i")),
        };
      }
    }

    // 3. SubCategory filter: support single value, array, or comma-separated string
    const subCatRaw = subCategory || req.query.subcategory;
    if (subCatRaw) {
      const subCatList = Array.isArray(subCatRaw)
        ? subCatRaw
        : String(subCatRaw).split(",").map((sc) => sc.trim()).filter(Boolean);
      if (subCatList.length > 0) {
        filter.subCategory = {
          $in: subCatList.map((sc) => new RegExp(`^${sc}$`, "i")),
        };
      }
    }

    // 4. Bestseller filter
    const isBestseller = bestseller !== undefined ? bestseller : bestSeller;
    if (isBestseller !== undefined) {
      filter.bestSeller = isBestseller === "true" || isBestseller === true;
    }

    // 5. Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && !isNaN(Number(minPrice))) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // 6. Sorting
    let sortOptions = { date: -1 };
    if (sort === "low-high") {
      sortOptions = { price: 1 };
    } else if (sort === "high-low") {
      sortOptions = { price: -1 };
    } else if (sort === "oldest") {
      sortOptions = { date: 1 };
    } else if (sort === "newest" || sort === "relavent") {
      sortOptions = { date: -1 };
    }

    // 7. Total count matching filters
    const totalProducts = await productModal.countDocuments(filter);

    // If client asks for all products explicitly
    if (String(limit).toLowerCase() === "all") {
      const products = await productModal.find(filter).sort(sortOptions);
      return res.json({
        success: true,
        products,
        pagination: {
          totalProducts,
          totalPages: 1,
          currentPage: 1,
          limit: products.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
        totalProducts,
        totalPages: 1,
        currentPage: 1,
        limit: products.length,
      });
    }

    // Standard pagination calculation
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 12);
    const skip = (pageNum - 1) * limitNum;
    const totalPages = Math.ceil(totalProducts / limitNum) || 1;

    const products = await productModal
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.json({
      success: true,
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      totalProducts,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// remove product
const removeProduct = async (req, res) => {
  try {
    const isDemo =
      req.headers.isdemo === "true" ||
      req.body.isDemo === "true" ||
      req.body.isDemo === true;

    if (isDemo) {
      return res.json({
        success: false,
        message: "Product deletion is disabled in Demo Mode",
      });
    }

    const id = req.body.id;
    const product = await productModal.findByIdAndDelete(id);
    res.json({
      success: true,
      message: `Successfully deleted product ${id} ${product?.name || ""}`,
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
