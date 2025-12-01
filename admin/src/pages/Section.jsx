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
    <div className="mx-[30%]">
      <h2 className="text-2xl font-bold">Collections</h2>
      {/* List  */}
      {sections.map((section, index) => (
        <div key={index} className="">
          <p className="text-lg font-semibold">{section.name}</p>
        </div>
      ))}

      <button
        onClick={() => setIsAddSection(!isAddSection)}
        className="w-full py-3 mt-4 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white rounded-xl font-bold text-lg shadow transition flex items-center justify-center"
      >
        + Add New
      </button>

      {/* Add Section Form */}
      {isAddSection && (
        <form
          onSubmit={handleSectionSubmit}
          className="flex flex-col gap-4 mt-4"
        >
          <div>
            <label
              htmlFor="bannerImage"
              className="block text-gray-700 font-medium mb-2"
            >
              Banner Image
              <img
                className="cursor-pointer"
                src={
                  !bannerImage
                    ? assets.banner_placeholder
                    : URL.createObjectURL(bannerImage)
                }
                alt=""
              />
              <input
                onChange={(e) => setBannerImage(e.target.files[0])}
                id="bannerImage"
                type="file"
                hidden
              />
            </label>
          </div>

          <input
            type="text"
            placeholder="Collection Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="text"
            placeholder="Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <textarea
            placeholder="Collection Story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="text"
            placeholder="Banner Text"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <button
            className="w-full py-3 mt-4 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white rounded-xl font-bold text-lg shadow transition flex items-center justify-center"
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
                Loading...
              </>
            ) : (
              "Create Collection"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default Section;
