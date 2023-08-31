require("dotenv").config();
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { createAccessToken } = require("../helpers/jwt.js");

module.exports = {
  signin: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          user: req.body.username,
        },
      });

      if (!user) {
        return res.status(404).send({
          auth: false,
          user: req.body.username,
          accessToken: null,
          message: "Error",
          errors: "User tidak di temukan",
        });
      }

      const passwordIsValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          auth: false,
          user: req.body.username,
          accessToken: null,
          message: "Error",
          errors: "Salah Password!",
        });
      }

      const payload = {
        id: user.id,
      };

      const accessToken = createAccessToken(payload);

      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 2,
        })
        .status(201)
        .json({
          status: "success",
          message: "Login success!",
          token: accessToken,
        });
    } catch (error) {
      res.status(500).send({
        status: false,
        user_name: req.body.username,
        accessToken: null,
        message: "Error",
        errors: error,
      });
    }
  },

  signout: async (req, res) => {
    try {
      res.clearCookie("access_token");
      res.status(200).json({
        status: "success",
        message: "Logout success!",
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Error",
        errors: error,
      });
    }
  },
};
