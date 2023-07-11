'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user = [
      {
        id: 1,
        user: 'ADMIN1',
        password: 'rahasia',
      },
    ];
    await queryInterface.bulkInsert('Users', user);
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users');
  }
};
