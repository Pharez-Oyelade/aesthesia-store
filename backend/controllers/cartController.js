import userModel from "../models/userModel.js";

const CUSTOM_COLOR_OPTION = "Custom Color";
const CUSTOM_COLOR_NOTE_KEY = "customColorNote";

const isCustomColor = (color) =>
  typeof color === "string" &&
  color.trim().toLowerCase() === CUSTOM_COLOR_OPTION.toLowerCase();

const withCustomColorNote = (measurements, color, note = "") => {
  const nextMeasurements = { ...(measurements || {}) };
  const trimmedNote = note.toString().trim();

  if (isCustomColor(color) && trimmedNote) {
    nextMeasurements[CUSTOM_COLOR_NOTE_KEY] = trimmedNote;
  } else if (!isCustomColor(color)) {
    delete nextMeasurements[CUSTOM_COLOR_NOTE_KEY];
  }

  return nextMeasurements;
};

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size, color, measurements, quantity, note } =
      req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    const colorKey = color || "no-color";
    const cartMeasurements = withCustomColorNote(measurements, color, note);
    const mKey = JSON.stringify(cartMeasurements);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        if (cartData[itemId][size][colorKey]) {
          if (cartData[itemId][size][colorKey][mKey]) {
            cartData[itemId][size][colorKey][mKey] += quantity;
          } else {
            cartData[itemId][size][colorKey][mKey] = quantity;
          }
        } else {
          cartData[itemId][size][colorKey] = {
            [mKey]: quantity,
          };
        }
      } else {
        cartData[itemId][size] = {
          [colorKey]: { [mKey]: quantity },
        };
      }
    } else {
      cartData[itemId] = {
        [size]: { [colorKey]: { [mKey]: quantity } },
      };
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Item successfully added to cart",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// update products in user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, color, measurements, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    const colorKey = color || "no-color";
    cartData[itemId][size][colorKey][JSON.stringify(measurements)] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    res.json({
      success: true,
      cartData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addToCart, updateCart, getUserCart };
