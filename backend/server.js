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
const allowedOrigins = [
  "https://aesthesia-haven.vercel.app",
  "https://aesthesia-admin.vercel.app",
];
connectDB();
connectCloudinary();

// Response compression
app.use(compression());

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Add caching headers middleware
app.use((req, res, next) => {
  // Cache static assets for 1 year
  if (
    req.path.match(
      /\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$/
    )
  ) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  // Cache API responses for shorter periods
  else if (req.path.startsWith("/api/product")) {
    // Product data cached for 1 hour
    res.setHeader("Cache-Control", "public, max-age=3600");
  } else if (req.path.startsWith("/api/section")) {
    // Section data cached for 12 hours
    res.setHeader("Cache-Control", "public, max-age=43200");
  }
  // No cache for user-specific data
  else {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );
  }

  // Add ETag support
  res.setHeader("ETag", `"${Date.now()}"`);

  next();
});

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
