import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import wishlistRouter from "./routes/wishRoute.js";
import mailRouter from "./routes/mailchimpRoute.js";
import compression from "compression";
import sectionRouter from "./routes/sectionRoute.js";

// App configuration
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Response compression
app.use(compression());

// Middleware
app.use(cors());
app.use(express.json());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/mailchimp", mailRouter);
app.use("/api/section", sectionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Preventing Render from sleeping by pinging the server every 14 minutes
setInterval(() => {
  fetch("https://aesthesia-store-backend.onrender.com/")
    .then(() => console.log("Self-ping to prevent sleep"))
    .catch((err) => console.log("Self-ping failed:", err));
}, 14 * 60 * 1000); //14 minutes in milliseconds
