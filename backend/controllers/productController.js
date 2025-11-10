import { v2 as cloudinary } from "cloudinary";

import productModel from "../models/productModel.js";
import sectionModel from "../models/sectionModel.js";
import mongoose from "mongoose";

// add a new product
const addProduct = async (req, res) => {
  try {
    // edit added for sale flow
    const {
      name,
      tagline,
      price,
      description,
      specificDetails,
      story,
      section,
      sizes,
      colors,
      bestseller,
      onSale,
      salePrice,
      preorder,
      weight,
    } = req.body;

    // Validate price
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return res.json({
        success: false,
        message: "Price is required and must be greater than 0",
      });
    }
    // Validate image1
    if (!req.files.image1 || !req.files.image1[0]) {
      return res.json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesData = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      })
    );

    // If section is an ObjectId, look up the section name
    let sectionName = section;
    if (section && mongoose.Types.ObjectId.isValid(section)) {
      const sectionDoc = await sectionModel.findById(section);
      if (sectionDoc && sectionDoc.name) {
        sectionName = sectionDoc.name;
      }
    }

    const productData = {
      name,
      description,
      tagline,
      specificDetails,
      story,
      onSale: onSale === true || onSale === "true" ? true : false,
      salePrice: salePrice ? Number(salePrice) : 0,
      price: Number(price),
      section: sectionName,
      bestseller: bestseller === true || bestseller === "true" ? true : false,
      preorder: preorder === true || preorder === "true" ? true : false,
      sizes: JSON.parse(sizes),
      colors: colors ? JSON.parse(colors) : [],
      image: imagesData,
      weight: Number(weight) || 0,
      date: Date.now(),
    };

    // console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);

    res.json({ success: false, message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      tagline,
      specificDetails,
      price,
      section,
      sizes,
      colors,
      bestseller,
      preorder,
      onSale,
      salePrice,
      soldOut,
      weight,
    } = req.body;

    const updateFields = {
      ...(name && { name }),
      ...(description && { description }),
      ...(specificDetails && { specificDetails }),
      ...(price && { price: Number(price) }),
      ...(section && { section }),
      ...(sizes && { sizes: JSON.parse(sizes) }),
      ...(colors && { colors: JSON.parse(colors) }),
      ...(typeof bestseller !== "undefined" && { bestseller }),
      ...(typeof preorder !== "undefined" && { preorder }),
      ...(typeof soldOut !== "undefined" && { soldOut }),
      ...(typeof onSale !== "undefined" && { onSale }),
      ...(typeof salePrice !== "undefined" && { salePrice: Number(salePrice) }),
      ...(typeof weight !== "undefined" && { weight: Number(weight) }),
    };

    await productModel.findByIdAndUpdate(id, updateFields);

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for listing all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);

    res.json({ success: false, message: error.message });
  }
};

// function for removing a product
const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.image && Array.isArray(product.image)) {
      for (const img of product.image) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await productModel.findByIdAndDelete(req.body.id);
    res.json({
      success: true,
      message: "Product and images removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product details
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);

    res.json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct,
};
