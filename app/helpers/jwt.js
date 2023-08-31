const jwt = require("jsonwebtoken");

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10800s",
  });
};

const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          reject(new Error("Token has expired"));
        } else {
          reject(new Error("Invalid token"));
        }
      } else {
        resolve(decodedToken);
      }
    });
  });
};

module.exports = {
  createAccessToken,
  verifyAccessToken,
};
