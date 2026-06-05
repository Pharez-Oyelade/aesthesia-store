import { v2 as cloudinary } from "cloudinary";

import productModel from "../models/productModel.js";
import sectionModel from "../models/sectionModel.js";
import mongoose from "mongoose";

const MAX_PRODUCT_IMAGES = 6;
const PRODUCT_IMAGE_FIELDS = Array.from(
  { length: MAX_PRODUCT_IMAGES },
  (_, index) => `image${index + 1}`
);

const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return JSON.parse(value);
};

const parseBooleanField = (value) => value === true || value === "true";

const uploadProductImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

const getProductImagesFromRequest = async (files = {}) => {
  const images = PRODUCT_IMAGE_FIELDS.map((field) => files[field]?.[0]).filter(
    Boolean
  );

  return Promise.all(images.map(uploadProductImage));
};

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
      fitLength,
    } = req.body;

    // Validate price
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return res.json({
        success: false,
        message: "Price is required and must be greater than 0",
      });
    }
    const hasProductImage = PRODUCT_IMAGE_FIELDS.some(
      (field) => req.files?.[field]?.[0]
    );

    if (!hasProductImage) {
      return res.json({
        success: false,
        message: "At least one product image is required",
      });
    }

    let imagesData = await getProductImagesFromRequest(req.files);

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
      sizes: parseArrayField(sizes),
      colors: parseArrayField(colors),
      image: imagesData,
      weight: Number(weight) || 0,
      fitLength: parseArrayField(fitLength),
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
      fitLength,
    } = req.body;

    const product = await productModel.findById(id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const updateFields = {
      ...(name && { name }),
      ...(description && { description }),
      ...(tagline && { tagline }),
      ...(specificDetails && { specificDetails }),
      ...(price && { price: Number(price) }),
      ...(section && { section }),
      ...(sizes && { sizes: parseArrayField(sizes) }),
      ...(colors && { colors: parseArrayField(colors) }),
      ...(typeof bestseller !== "undefined" && {
        bestseller: parseBooleanField(bestseller),
      }),
      ...(typeof preorder !== "undefined" && {
        preorder: parseBooleanField(preorder),
      }),
      ...(typeof soldOut !== "undefined" && {
        soldOut: parseBooleanField(soldOut),
      }),
      ...(typeof onSale !== "undefined" && {
        onSale: parseBooleanField(onSale),
      }),
      ...(typeof salePrice !== "undefined" && { salePrice: Number(salePrice) }),
      ...(typeof weight !== "undefined" && { weight: Number(weight) }),
      ...(fitLength && { fitLength: parseArrayField(fitLength) }),
    };

    const currentImages = Array.isArray(product.image)
      ? product.image.slice(0, MAX_PRODUCT_IMAGES)
      : [];
    const updatedImages = [...currentImages];
    const replacedPublicIds = [];
    let imagesWereUpdated = false;

    for (const [index, field] of PRODUCT_IMAGE_FIELDS.entries()) {
      const file = req.files?.[field]?.[0];
      if (!file) continue;

      const existingImage = updatedImages[index];
      const uploadedImage = await uploadProductImage(file);

      if (existingImage?.public_id) {
        replacedPublicIds.push(existingImage.public_id);
      }

      updatedImages[index] = uploadedImage;
      imagesWereUpdated = true;
    }

    if (imagesWereUpdated) {
      updateFields.image = updatedImages.filter(Boolean).slice(0, MAX_PRODUCT_IMAGES);
    }

    await productModel.findByIdAndUpdate(id, updateFields);

    if (replacedPublicIds.length > 0) {
      await Promise.allSettled(
        replacedPublicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
      );
    }

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
