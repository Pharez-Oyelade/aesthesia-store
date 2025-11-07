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

const app = express(); // ✅ MUST be first before using middleware
const port = process.env.PORT || 4000;

const allowedOrigins = [
  "https://aesthesia-haven.vercel.app",
  "https://aesthesia-admin-panel.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

connectDB();
connectCloudinary();

// ✅ Compression first
app.use(compression());

// ✅ CORS next
app.use(
  cors({
    origin: (origin, callback) => {
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

// ✅ JSON body parser
app.use(express.json());

// ✅ Caching after JSON parsing
app.use((req, res, next) => {
  if (
    req.path.match(
      /\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$/
    )
  ) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else if (req.path.startsWith("/api/product")) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );
  } else if (req.path.startsWith("/api/section")) {
    res.setHeader("Cache-Control", "public, max-age=43200");
  } else {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );
  }
  next();
});

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/mailchimp", mailRouter);
app.use("/api/section", sectionRouter);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
