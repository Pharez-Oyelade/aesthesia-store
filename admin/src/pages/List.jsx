import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import ArrayInput from "../components/ArrayInput";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null); // product being edited
  const [editFields, setEditFields] = useState({
    name: "",
    description: "",
    price: "",
    section: "",
    sizes: [],
    bestseller: false,
    onSale: false,
    salePrice: "",
    preorder: false,
    soldOut: false,
    weight: "",
    fitLength: [],
    colors: [],
  });
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const FEATURE_EDIT_PRODUCTS = true;

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id: selectedProduct._id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setShowConfirm(false);
    setSelectedProduct(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filtered list based on search
  const filteredList = list.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.section && item.section.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 mx-[25%] sm:mx-[28%] w-full">
        <div className="flex items-center justify-between">
          <p className="mb-4 text-2xl font-bold text-red-700">
            All Products List
          </p>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="bg-red-700 hover:bg-red-800 transition text-white px-6 py-2 rounded-full text-base font-semibold shadow"
          >
            {showSearch ? <IoClose /> : <FaSearch />}
          </button>
        </div>

        {showSearch && (
          <input
            type="text"
            placeholder="Search by name or section..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 px-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-red-200 outline-none transition"
          />
        )}
        <div className="flex flex-col gap-2">
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border-b border-gray-200 bg-gray-50 text-base font-semibold text-gray-700 rounded-t-xl">
            <b>Image</b>
            <b>Name</b>
            <b>Collection</b>
            <b>Price</b>
            <b className="text-center">Action</b>
          </div>
          {filteredList.map((item, index) => (
            <div
              className="grid grid-cols-[1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border-b border-gray-100 text-base bg-white hover:bg-gray-50 transition rounded-xl border-2"
              key={index}
            >
              <img
                className="w-14 h-14 object-cover rounded-lg border"
                src={item.image[0]?.url}
                alt=""
              />
              <p className="font-medium">{item.name}</p>
              <p>{item.section}</p>
              <p className="flex items-center gap-1 font-semibold text-red-700">
                {currency}
                {item.price}
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="text-center text-lg bg-red-100 text-red-700 rounded-full px-4 py-1 font-bold hover:bg-red-200 transition"
                >
                  X
                </button>
                {FEATURE_EDIT_PRODUCTS && (
                  <button
                    onClick={() => {
                      setEditProduct(item);
                      setEditFields({
                        name: item.name || "",
                        description: item.description || "",
                        specificDetails: item.specificDetails || "",
                        price: item.price || "",
                        section: item.section || "",
                        weight: item.weight || "",
                        // store colors as array
                        colors: item.colors || [],
                        sizes: item.sizes || [],
                        // fitLength: item.length || [],
                        fitLength: item.fitLength || [],
                        bestseller: item.bestseller || false,
                        preorder: item.preorder || false,
                        soldOut: item.soldOut || false,
                        onSale: item.onSale || false,
                        salePrice:
                          item.salePrice !== undefined &&
                          item.salePrice !== null
                            ? item.salePrice
                            : "",
                      });
                    }}
                    className="bg-blue-100 text-blue-700 rounded-full px-4 py-1 font-bold hover:bg-blue-200"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 overflow-auto"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl font-bold"
              onClick={() => setEditProduct(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // ensure colors and sizes are sent as JSON strings (backend expects JSON strings)

                  const response = await axios.post(
                    backendUrl + "/api/product/update",
                    {
                      id: editProduct._id,
                      ...editFields,
                      sizes: JSON.stringify(editFields.sizes),
                      colors: JSON.stringify(editFields.colors),
                      // length: JSON.stringify(editFields.length),
                      fitLength: JSON.stringify(editFields.fitLength),
                    },
                    { headers: { token } }
                  );
                  if (response.data.success) {
                    toast.success("Product updated successfully");
                    setEditProduct(null);
                    await fetchList();
                  } else {
                    toast.error(response.data.message);
                  }
                } catch (error) {
                  toast.error(error.message);
                }
              }}
              className="flex flex-col gap-4"
            >
              {/* Example fields */}
              <label className="font-medium">
                Name
                <input
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  value={editFields.name || ""}
                  onChange={(e) =>
                    setEditFields((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </label>
              <div className="flex gap-2">
                <label className="font-medium">
                Price
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  value={editFields.price || ""}
                  min="0"
                  onChange={(e) =>
                    setEditFields((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </label>
                <label className="font-medium">
                Weight(grams)
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  value={editFields.weight || ""}
                  min="0"
                  onChange={(e) =>
                    setEditFields((f) => ({ ...f, weight: e.target.value }))
                  }
                />
              </label>
              </div>
              {/* <label className="font-medium">
                Price
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  value={editFields.price || ""}
                  min="0"
                  onChange={(e) =>
                    setEditFields((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </label> */}
              {/* <label className="font-medium">
                Description
                <textarea
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  value={editFields.description || ""}
                  onChange={(e) =>
                    setEditFields((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                />
              </label> */}
              <label className="font-medium">
                Specific Details
                <textarea
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  value={editFields.specificDetails || ""}
                  onChange={(e) =>
                    setEditFields((f) => ({
                      ...f,
                      specificDetails: e.target.value,
                    }))
                  }
                />
              </label>
             
              <div className="flex flex-col gap-1">
                <span className="font-medium">Sizes</span>
                <ArrayInput
                  value={editFields.sizes}
                  onChange={(newSizes) =>
                    setEditFields((f) => ({ ...f, sizes: newSizes }))
                  }
                  placeholder="Type size (e.g. 18) and press Enter"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium">Fit Length</span>
                <ArrayInput
                  value={editFields.fitLength}
                  onChange={(newLength) =>
                    setEditFields((f) => ({ ...f, fitLength: newLength }))
                  }
                  placeholder="Type length (e.g. Petite) and press Enter"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium">Colors</span>
                <ArrayInput
                  value={editFields.colors}
                  onChange={(newColors) =>
                    setEditFields((f) => ({ ...f, colors: newColors }))
                  }
                  placeholder="Type color (e.g. Red) and press Enter"
                />
              </div>

              <div className="grid grid-cols-2">
                <label className="font-medium">
                  Bestseller
                  <input
                    type="checkbox"
                    className="ml-2 accent-red-600"
                    checked={editFields.bestseller}
                    onChange={(e) =>
                      setEditFields((f) => ({
                        ...f,
                        bestseller: e.target.checked,
                      }))
                    }
                  />
                </label>
                <label className="font-medium">
                  Preorder
                  <input
                    type="checkbox"
                    className="ml-2 accent-red-600"
                    checked={editFields.preorder}
                    onChange={(e) =>
                      setEditFields((f) => ({
                        ...f,
                        preorder: e.target.checked,
                      }))
                    }
                  />
                </label>

                <label htmlFor="" className="font-medium">
                  Sold Out
                  <input
                    type="checkbox"
                    className="ml-2 accent-red-600"
                    checked={editFields.soldOut}
                    onChange={(e) =>
                      setEditFields((f) => ({
                        ...f,
                        soldOut: e.target.checked,
                      }))
                    }
                  />
                </label>
              </div>

              <label className="font-medium">
                On Sale
                <input
                  type="checkbox"
                  className="ml-2 accent-red-600"
                  checked={editFields.onSale}
                  onChange={(e) =>
                    setEditFields((f) => ({ ...f, onSale: e.target.checked }))
                  }
                />
              </label>
              {editFields.onSale && (
                <label className="font-medium">
                  Sale Price
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                    value={
                      editFields.salePrice !== undefined &&
                      editFields.salePrice !== null
                        ? editFields.salePrice
                        : ""
                    }
                    onChange={(e) =>
                      setEditFields((f) => ({
                        ...f,
                        salePrice: e.target.value,
                      }))
                    }
                    placeholder="Sale Price"
                    min={0}
                  />
                </label>
              )}

              {/* more fields?*/}
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded-lg transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg transition"
                  onClick={() => setEditProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center">
            <img
              src={selectedProduct.image[0]?.url}
              alt={selectedProduct.name}
              className="w-20 h-20 object-cover rounded-xl mb-4 border"
            />
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Remove{" "}
              <span className="text-red-700">{selectedProduct.name}</span>?
            </p>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-700 text-white font-bold hover:bg-red-800 transition"
              >
                Yes, Remove
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
