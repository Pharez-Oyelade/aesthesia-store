import { v2 as cloudinary } from "cloudinary";
import sectionModel from "../models/sectionModel.js";

// add a new section
const addSection = async (req, res) => {
  try {
    const { name, story, tagline, bannerText } = req.body;

    // validate name
    if (!name || name.trim() === "") {
      return res.json({ success: false, message: "Section name is required" });
    }

    // validate banner image and upload to Cloudinary
    if (!req.files.bannerImage || !req.files.bannerImage[0]) {
      return res.json({ success: false, message: "Banner image is required" });
    }

    const bannerImage = req.files.bannerImage && req.files.bannerImage[0];

    let bannerImageData = await cloudinary.uploader.upload(bannerImage.path, {
      resource_type: "image",
    });

    const sectionData = {
      name,
      story: story || "",
      tagline: tagline || "",
      bannerText: bannerText || "",
      bannerImage: {
        url: bannerImageData.secure_url,
        public_id: bannerImageData.public_id,
      },
      date: Date.now(),
    };

    const section = new sectionModel(sectionData);
    await section.save();

    res.json({ success: true, message: "New section added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

// list sections
const listSections = async (req, res) => {
  try {
    const sections = await sectionModel.find({});
    res.json({ success: true, sections });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addSection, listSections };
