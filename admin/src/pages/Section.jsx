import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Section = ({ token }) => {
  const [bannerImage, setBannerImage] = useState(false);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [story, setStory] = useState("");
  const [bannerText, setBannerText] = useState("");

  const [sections, setSections] = useState([]);
  const [isAddSection, setIsAddSection] = useState(false);

  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchSections = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/section/list");
      if (response.data.success) {
        setSections(response.data.sections);
      } else {
        toast.error("Error fetching sections");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!bannerImage) {
      toast.error("Banner image is required");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("tagline", tagline);
      formData.append("story", story);
      formData.append("bannerText", bannerText);

      bannerImage && formData.append("bannerImage", bannerImage);

      const response = await axios.post(
        backendUrl + "/api/section/add-section",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setTagline("");
        setStory("");
        setBannerText("");
        setBannerImage(false);
        setLoading(false);
        setIsAddSection(false);
        fetchSections();
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error adding section");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mx-[30%]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Collections</h2>
        <button
          onClick={() => setIsAddSection(!isAddSection)}
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
        >
          <span className="text-xl">{isAddSection ? "×" : "+"}</span>
          {isAddSection ? "Close" : "Add New"}
        </button>
      </div>

      {/* Add Section Form */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isAddSection ? "max-h-[1000px] opacity-100 mb-10" : "max-h-0 opacity-0"
        }`}
      >
        <form
          onSubmit={handleSectionSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-bold text-gray-700 mb-6">
            Create New Collection
          </h3>
          
          <div className="mb-6">
            <p className="mb-2 font-semibold text-gray-700">Banner Image</p>
            <label
              htmlFor="bannerImage"
              className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition relative overflow-hidden group"
            >
              <img
                className={`w-full h-full object-cover ${!bannerImage ? 'p-12 opacity-50' : ''}`}
                src={
                  !bannerImage
                    ? assets.upload_area // Assuming upload_area is a generic icon, if not available using banner_placeholder
                    : URL.createObjectURL(bannerImage)
                }
                onError={(e) => { e.target.src = assets.banner_placeholder || assets.upload_area }} 
                alt="Banner Preview"
              />
              {!bannerImage && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <p className="font-medium">Click to upload banner</p>
                 </div>
              )}
              
              <input
                onChange={(e) => setBannerImage(e.target.files[0])}
                id="bannerImage"
                type="file"
                hidden
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="mb-2 font-semibold text-gray-700 block">
                Collection Name
              </label>
              <input
                type="text"
                placeholder="e.g. Summer Essentials"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>

            <div>
              <label className="mb-2 font-semibold text-gray-700 block">
                Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. Discover the warmth"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>

            <div>
              <label className="mb-2 font-semibold text-gray-700 block">
                Banner Text
              </label>
              <input
                type="text"
                placeholder="Overlay text for the banner"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>

            <div>
              <label className="mb-2 font-semibold text-gray-700 block">
                Collection Story
              </label>
              <textarea
                placeholder="Tell the story behind this collection..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition resize-none"
              />
            </div>
          </div>

          <button
            className="w-full py-4 mt-8 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Collection"
            )}
          </button>
        </form>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section, index) => (
          <div
            key={index}
            className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 hover:shadow-2xl"
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-gray-200">
               {section.bannerImage && section.bannerImage[0] ? (
                  <img
                    src={section.bannerImage[0].url}
                    alt={section.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    No Image
                  </div>
               )}
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
              <h3 className="text-2xl font-bold mb-1 tracking-wide group-hover:text-red-400 transition-colors">
                {section.name}
              </h3>
              {section.tagline && (
                <p className="text-gray-300 text-sm font-medium mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                  {section.tagline}
                </p>
              )}
              <div className="w-12 h-1 bg-red-600 rounded-full mb-4 transition-all duration-500 w-0 group-hover:w-12" />
              
              {/* Optional: Add edit/delete buttons here if needed later */}
            </div>
          </div>
        ))}
      </div>
      
      {sections.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No collections found.</p>
            <p className="mt-2">Click "Add New" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Section;
