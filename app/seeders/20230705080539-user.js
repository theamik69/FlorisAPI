"use strict";

const { nanoid } = require("nanoid");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const user = [
      {
        id: `SuperAdmin-${nanoid(12)}`,
        user: "superAdmin",
        password: await bcrypt.hash("superman", 8),
      },
    ];
    await queryInterface.bulkInsert("Users", user);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users");
  },
};
