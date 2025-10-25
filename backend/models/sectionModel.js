import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: false,
  },
  tagline: {
    type: String,
    required: false,
  },
  bannerText: {
    type: String,
    required: false,
  },
  bannerImage: {
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    required: true,
  },
});

const sectionModel = mongoose.model("Section", sectionSchema);

export default sectionModel;
