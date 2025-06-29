import userModel from "../models/userModel.js";

// add products to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    let wishData = user.wishData || [];
    if (!Array.isArray(wishData)) wishData = [];

    if (wishData.includes(itemId)) {
      // Remove item
      wishData = wishData.filter((id) => id !== itemId);
      await userModel.findByIdAndUpdate(userId, { wishData });
      return res.json({
        success: true,
        message: "Removed from wishlist",
        wishData,
      });
    } else {
      // Add to wishlist
      wishData.push(itemId);
      await userModel.findByIdAndUpdate(userId, { wishData });
      return res.json({
        success: true,
        message: "Added to wishlist",
        wishData,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update products in wishlist
// const updateWishlist = async (req, res) => {};

// get wishlist data
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, wishData: user.wishData || [] });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToWishlist, getUserWishlist };
