import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sanitize from "mongo-sanitize";
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
import productModel from "./models/productModel.js";
// import dns from "node:dns";

import { paystackWebhook } from "./controllers/orderController.js";

const app = express();

// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// If the app is behind a reverse proxy (load balancer), enable trust proxy
// so `req.secure` and `x-forwarded-*` headers are interpreted correctly.
app.set("trust proxy", 1);
const port = process.env.PORT || 4000;

// Normalize allowed origins (strip trailing slash and lowercase) to avoid
// accidental mismatches like a trailing slash on the incoming Origin header.
const baseAllowedOrigins = [
  "https://aesthesia-haven.vercel.app",
  "https://aesthesiahaven.com",
  "https://www.aesthesiahaven.com",
  "https://aesthesia-admin-panel.vercel.app",
];

const devOrigins = ["http://localhost:5173", "http://localhost:5174"];

const allowedOrigins = new Set(
  (process.env.NODE_ENV === "development"
    ? [...baseAllowedOrigins, ...devOrigins]
    : baseAllowedOrigins
  ).map((u) => u.replace(/\/$/, "").toLowerCase()),
);

// Database connections with error handling
try {
  await connectDB();
  await connectCloudinary();
} catch (error) {
  console.error("Failed to connect to services:", error);
  process.exit(1);
}

// ========== SECURITY MIDDLEWARE ==========

// 1. Helmet - Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

// 2. Rate limiting - Prevent brute force and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});

// Apply general rate limiter to all routes
app.use(limiter);

// 3. Compression
app.use(compression());

// 4. CORS with enhanced security
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin) return callback(null, true);

      const normalized = origin.replace(/\/$/, "").toLowerCase();
      if (allowedOrigins.has(normalized)) return callback(null, true);

      // Deny other origins
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    maxAge: 86400, // Cache preflight for 24 hours
    optionsSuccessStatus: 204,
  }),
);

app.post(
  "/api/order/webhook/paystack",
  express.raw({ type: "application/json" }),
  paystackWebhook,
);

// 5. Body parser with size limits (prevent payload attacks)
app.use(
  express.json({
    limit: "10mb", // Adjust based on your needs
    strict: true,
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// Enforce HTTPS in production when behind a proxy/load-balancer that sets
// `x-forwarded-proto`. This redirects plain HTTP to HTTPS.
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    const forwardedProto = req.headers["x-forwarded-proto"];
    const isSecure =
      req.secure || (forwardedProto && forwardedProto === "https");
    if (isSecure) return next();
    // Redirect to the same host + url using https
    const host = req.headers.host;
    if (host) {
      return res.redirect(301, `https://${host}${req.originalUrl}`);
    }
    // Fallback
    return res
      .status(426)
      .send("Please use HTTPS when communicating with this server.");
  });
}

// 7. Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 second timeout
  res.setTimeout(30000);
  next();
});

// 8. Security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.removeHeader("X-Powered-By");
  next();
});

// ========== CACHING STRATEGY ==========
app.use((req, res, next) => {
  if (
    req.path.match(
      /\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$/,
    )
  ) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else if (req.path.startsWith("/api/product")) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );
  } else if (req.path.startsWith("/api/section")) {
    res.setHeader("Cache-Control", "public, max-age=43200");
  } else {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );
  }
  next();
});

// Sanitize incoming data to prevent NoSQL injection and strip $ / . keys
// Uses `mongo-sanitize` which removes keys starting with '$' and dots.
app.use((req, res, next) => {
  // Sanitize incoming values in-place to avoid reassigning read-only properties
  const sanitizeInPlace = (value) => {
    try {
      if (value == null) return;

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] && typeof value[i] === "object")
            sanitizeInPlace(value[i]);
          else value[i] = sanitize(value[i]);
        }
        return;
      }

      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          // Remove dangerous keys rather than renaming them
          if (key.startsWith("$") || key.includes(".")) {
            try {
              delete value[key];
            } catch (e) {
              // if delete fails, set to undefined as a last resort
              try {
                value[key] = undefined;
              } catch (ee) {
                // ignore
              }
            }
            continue;
          }

          const v = value[key];
          if (v && typeof v === "object") {
            sanitizeInPlace(v);
          } else {
            try {
              value[key] = sanitize(v);
            } catch (e) {
              // leave original value if sanitize fails
              value[key] = v;
            }
          }
        }
      }
    } catch (err) {
      // don't throw from sanitization
      console.warn(
        "sanitizeInPlace error:",
        err && err.message ? err.message : err,
      );
    }
  };

  try {
    if (req.body && typeof req.body === "object") sanitizeInPlace(req.body);
    if (req.query && typeof req.query === "object") sanitizeInPlace(req.query);
    if (req.params && typeof req.params === "object")
      sanitizeInPlace(req.params);
  } catch (err) {
    console.warn(
      "Request sanitization failed:",
      err && err.message ? err.message : err,
    );
  }

  next();
});

// ========= OG META ROUTE FOR CRAWLERS =========

// app.get("/og/product/:id", async (req, res) => {
//   try {
//     const product = await productModel.findById(req.params.id).lean();

//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     const ogTitle = product.name;
//     const ogDescription = product.description
//       ? product.description.substring(0, 150) + "..."
//       : `Shop ${product.name} on Aesthesia Haven!`;
//     const ogImage = Array.isArray(product.image)
//       ? product.image[0].url
//       : product.image.url;
//     const url = `https://aesthesiahaven.com/product/${product._id}`;

//     //return minimal HTML OG tags + redirect for real users
//     return res.send(`<!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="utf-8" />
//     <title>${ogTitle}</title>
//     <meta property="og:title" content="${ogTitle}" />
//     <meta property="og:description" content="${ogDescription}" />
//     <meta property="og:image" content="${ogImage}" />
//     <meta property="og:url" content="${url}" />
//     <meta property="og:type" content="product" />
//     <meta name="twitter:card" content="summary_large_image" />
//     <meta name="twitter:title" content="${ogTitle}" />
//     <meta name="twitter:image" content="${ogImage}" />
//   </head>
//   <body></body>
// </html>`);
//   } catch (error) {
//     console.error("OG route error:", error);
//     res.status(500).send("Error");
//   }
// });

// ========== ROUTES ==========
// Apply stricter rate limit to auth routes
app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/mailchimp", mailRouter);
app.use("/api/section", sectionRouter);

// 6. MongoDB injection protection

// app.use((req, res, next) => {
//   req.body = sanitize(req.body);
//   req.query = sanitize(req.query);
//   req.params = sanitize(req.params);
//   next();
// });

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API is running",
    version: "1.0.0",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

// ========== ERROR HANDLING ==========

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error for monitoring
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Don't leak error details in production
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ========== SERVER START ==========
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error("Forcing shutdown after timeout");
    process.exit(1);
  }, 30000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});

// ========== KEEP-ALIVE PING (Improved) ==========
// Better alternative: Use a proper uptime monitoring service like UptimeRobot
if (process.env.ENABLE_SELF_PING === "true") {
  const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
  let pingFailures = 0;
  const MAX_FAILURES = 3;

  setInterval(async () => {
    try {
      const response = await fetch(
        process.env.APP_URL ||
          "https://aesthesia-store-backend.onrender.com/health",
      );

      if (response.ok) {
        pingFailures = 0;
        console.log("Self-ping successful");
      } else {
        pingFailures++;
        console.warn(
          `Self-ping failed with status ${response.status}, failures: ${pingFailures}`,
        );
      }
    } catch (err) {
      pingFailures++;
      console.error(
        `Self-ping failed: ${err.message}, failures: ${pingFailures}`,
      );

      if (pingFailures >= MAX_FAILURES) {
        console.error("Max ping failures reached. Server may need attention.");
        // Optional: Send alert notification here
      }
    }
  }, PING_INTERVAL);
}

export default app;
