// import React from "react";
// import { assets } from "../assets/assets";
// import { useState } from "react";
// import axios from "axios";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

// const Add = ({ token }) => {
//   const [image1, setImage1] = useState(false);
//   const [image2, setImage2] = useState(false);
//   const [image3, setImage3] = useState(false);
//   const [image4, setImage4] = useState(false);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [section, setSection] = useState("clothes");
//   const [bestseller, setBestseller] = useState(false);
//   const [sizes, setSizes] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();

//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("price", price);
//       formData.append("section", section);
//       formData.append("bestseller", bestseller);
//       formData.append("sizes", JSON.stringify(sizes));

//       image1 && formData.append("image1", image1);
//       image2 && formData.append("image2", image2);
//       image3 && formData.append("image3", image3);
//       image4 && formData.append("image4", image4);

//       const response = await axios.post(
//         backendUrl + "/api/product/add",
//         formData,
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message);
//         setName("");
//         setDescription("");
//         setPrice("");
//         setSection("clothes");
//         setBestseller(false);
//         setSizes([]);
//         setImage1(false);
//         setImage2(false);
//         setImage3(false);
//         setImage4(false);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col w-full items-start gap-3"
//     >
//       <div>
//         <p className="mb-2">Upload Image</p>

//         <div className="flex gap-2">
//           <label htmlFor="image1">
//             <img
//               className="w-20"
//               src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage1(e.target.files[0])}
//               type="file"
//               id="image1"
//               hidden
//             />
//           </label>
//           <label htmlFor="image2">
//             <img
//               className="w-20"
//               src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage2(e.target.files[0])}
//               type="file"
//               id="image2"
//               hidden
//             />
//           </label>
//           <label htmlFor="image3">
//             <img
//               className="w-20"
//               src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage3(e.target.files[0])}
//               type="file"
//               id="image3"
//               hidden
//             />
//           </label>
//           <label htmlFor="image4">
//             <img
//               className="w-20"
//               src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage4(e.target.files[0])}
//               type="file"
//               id="image4"
//               hidden
//             />
//           </label>
//         </div>
//       </div>

//       <div className="w-full">
//         <p className="mb-2">Product name</p>
//         <input
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           className="w-full max-w-[500px] px-3 py-2"
//           type="text"
//           placeholder="enter product name here"
//           required
//         />
//       </div>

//       <div className="w-full">
//         <p className="mb-2">Product description</p>
//         <textarea
//           onChange={(e) => setDescription(e.target.value)}
//           value={description}
//           className="w-full max-w-[500px] px-3 py-2"
//           type="text"
//           placeholder="describe your product here"
//           required
//         />
//       </div>

//       <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
//         <div>
//           <p className="mb-2">Product section</p>
//           <select
//             onChange={(e) => setSection(e.target.value)}
//             value={section}
//             className="w-full px-3 py-2"
//           >
//             <option value="clothing">Clothes</option>
//             <option value="rere-collection">Rere Collection</option>
//             <option value="jewelry">Jewelry</option>
//             <option value="wigs">Wig</option>
//           </select>
//         </div>

//         <div>
//           <p className="mb-2">Product price</p>
//           <input
//             onChange={(e) => setPrice(e.target.value)}
//             value={price}
//             className="w-full px-3 py-2 sm:w-[120px]"
//             type="Number"
//             placeholder="20,000"
//           />
//         </div>
//       </div>

//       <div>
//         <p className="mb-2">Product Sizes</p>
//         <div className="flex gap-3 flex-wrap">
//           <div
//             onClick={() =>
//               setSizes((prev) =>
//                 prev.includes("S")
//                   ? prev.filter((item) => item !== "S")
//                   : [...prev, "S"]
//               )
//             }
//             className="cursor-pointer"
//           >
//             <p
//               className={`${
//                 sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"
//               } px-3 py-1 cursor-pointer`}
//             >
//               S
//             </p>
//           </div>
//           <div
//             onClick={() =>
//               setSizes((prev) =>
//                 prev.includes("M")
//                   ? prev.filter((item) => item !== "M")
//                   : [...prev, "M"]
//               )
//             }
//           >
//             <p
//               className={`${
//                 sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"
//               } px-3 py-1 cursor-pointer`}
//             >
//               M
//             </p>
//           </div>
//           <div
//             onClick={() =>
//               setSizes((prev) =>
//                 prev.includes("L")
//                   ? prev.filter((item) => item !== "L")
//                   : [...prev, "L"]
//               )
//             }
//           >
//             <p
//               className={`${
//                 sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"
//               } px-3 py-1 cursor-pointer`}
//             >
//               L
//             </p>
//           </div>
//           <div
//             onClick={() =>
//               setSizes((prev) =>
//                 prev.includes("XL")
//                   ? prev.filter((item) => item !== "XL")
//                   : [...prev, "XL"]
//               )
//             }
//           >
//             <p
//               className={`${
//                 sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"
//               } px-3 py-1 cursor-pointer`}
//             >
//               XL
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 mt-2">
//         <input
//           onChange={() => setBestseller((prev) => !prev)}
//           checked={bestseller}
//           type="checkbox"
//           id="bestseller"
//         />
//         <label className="cursor-pointer" htmlFor="bestseller">
//           Add to bestseller
//         </label>
//       </div>

//       <button className="w-28 py-3 mt-4 bg-black text-white" type="submit">
//         ADD
//       </button>
//     </form>
//   );
// };

// export default Add;

import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [section, setSection] = useState("clothes");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("section", section);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes.length > 0 ? sizes : []));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully");
        setName("");
        setDescription("");
        setPrice("");
        setSection("clothes");
        setBestseller(false);
        setSizes([]);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl mx-auto flex flex-col gap-6 border border-gray-100"
    >
      <div>
        <p className="mb-2 font-semibold text-gray-700">Upload Image</p>
        <div className="flex flex-wrap gap-3">
          <label htmlFor="image1">
            <img
              className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 cursor-pointer"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 cursor-pointer"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 cursor-pointer"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 cursor-pointer"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>
      <div>
        <label className="mb-2 font-semibold text-gray-700 block">
          Product name
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition"
          type="text"
          placeholder="Enter product name here"
          required
        />
      </div>
      <div>
        <label className="mb-2 font-semibold text-gray-700 block">
          Product description
        </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition"
          placeholder="Describe your product here"
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="mb-2 font-semibold text-gray-700 block">
            Product section
          </label>
          <select
            onChange={(e) => setSection(e.target.value)}
            value={section}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition"
          >
            <option value="clothing">Clothes</option>
            <option value="rere-collection">Rere Collection</option>
            <option value="jewelry">Jewelry</option>
            <option value="wigs">Wig</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-2 font-semibold text-gray-700 block">
            Product price
          </label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition"
            type="number"
            placeholder="20,000"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 font-semibold text-gray-700 block">
          Product Sizes
        </label>
        <div className="flex gap-3 flex-wrap">
          {["S", "M", "L", "XL"].map((sz) => (
            <div
              key={sz}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(sz)
                    ? prev.filter((item) => item !== sz)
                    : [...prev, sz]
                )
              }
              className={`cursor-pointer px-4 py-2 rounded-lg border-2 font-semibold transition ${
                sizes.includes(sz)
                  ? "bg-red-100 border-red-600 text-red-700"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {sz}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
          className="accent-red-700 w-5 h-5"
        />
        <label
          className="cursor-pointer font-medium text-gray-700"
          htmlFor="bestseller"
        >
          Add to bestseller
        </label>
      </div>
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
            Adding...
          </>
        ) : (
          "ADD"
        )}
      </button>
    </form>
  );
};

export default Add;
