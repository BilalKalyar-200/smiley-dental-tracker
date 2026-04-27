//this middleware protects routes that require login
//it checks the JWT token sent in the request header
//every protected route will use this

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  //JWT is sent as: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      //Verify token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Attach the logged-in user to the request object
      //select('-password') means don't include the password field
      req.user = await User.findById(decoded.id).select("-password");

      next(); //Move to the actual route handler
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

//role middleware ... used after protect
//for eg: roleMiddleware('dentist') blocks patients from dentist routes
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not allowed to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, roleMiddleware };
