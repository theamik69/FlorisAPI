"use strict";
const fs = require("fs");
const path = require("path");
const { Product } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const filePath = path.join(__dirname, "../data/Products.json");

    let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    data.forEach((element) => {
      element.createdAt = new Date();
      element.updatedAt = new Date();
    });
    await Product.bulkCreate(data);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Products", null);
  },
};
