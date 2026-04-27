//Generates a JWT token for a user after login or register
//token contains the user's ID .... we use this to identify them later

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // e.g. "30d"
  });
};

module.exports = generateToken;
