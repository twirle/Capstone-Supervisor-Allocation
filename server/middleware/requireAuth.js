import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const requireAuth = async (req, res, next) => {
  // to verify user authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required." });
  }

  // split token string to get the token
  const token = authorization.split(" ")[1];

  // grab id from token to verify using jsonwebtoken
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    // grab _id from token if verification was success
    req.user = await User.findOne({ _id }).select("_id role");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorised." });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export { requireAuth, checkRole };
