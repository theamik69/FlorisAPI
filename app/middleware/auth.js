const { User } = require("../models");
const { verifyAccessToken } = require("../helpers/jwt.js");

const authentication = async (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return res.status(401).json({ msg: "Mohon Untuk Login Terlebih Dahulu!!" });
  }
  try {
    const payload = await verifyAccessToken(access_token);
    const result = await User.findOne({
      where: {
        id: payload.id,
      },
    });
    if (!result)
      return res.status(404).json({ msg: "User Tidak Di Temukan .." });
    req.accountId = result.id;
    req.name = result.name;
    req.role = result.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message || "Invalid token" });
  }
};

module.exports = {
  authentication,
};
