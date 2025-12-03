import jwt from "jsonwebtoken";

/**
 * Optional authentication middleware
 * Allows requests with or without authentication
 * - If token exists and is valid: sets req.body.userId and req.isGuest = false
 * - If no token or invalid token: sets req.isGuest = true and continues
 * Does not reject requests without tokens (unlike authUser)
 */
const optionalAuth = async (req, res, next) => {
  const token = req.headers.token;

  // No token provided - treat as guest
  if (!token) {
    req.isGuest = true;
    req.body.userId = null;
    return next();
  }

  try {
    // Token exists - verify it
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    req.isGuest = false;
    next();
  } catch (error) {
    // Invalid or expired token - treat as guest
    console.log("Optional auth - invalid token, treating as guest:", error.message);
    req.isGuest = true;
    req.body.userId = null;
    next(); // Continue as guest instead of rejecting
  }
};

export default optionalAuth;

