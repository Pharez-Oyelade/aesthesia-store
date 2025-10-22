import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied. No token",
      code: "NO_TOKEN",
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);

    let message = "Invalid token";
    let code = "INVALID_TOKEN";

    if (error.name === "TokenExpiredError") {
      message = "Token expired. Please login again.";
      code = "TOKEN_EXPIRED";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token format.";
      code = "MALFORMED_TOKEN";
    }

    return res.status(401).json({
      success: false,
      message: error.message,
      code,
    });
  }
};

export default authUser;
