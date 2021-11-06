const tableName = 'Customers';

module.exports = {
  up: async (queryInterface) => {
    console.log('Migrating database...');

    await queryInterface.sequelize.query(`
  CREATE TABLE IF NOT EXISTS "${tableName}" (
    id varchar(255) PRIMARY KEY,
    calls int NOT NULL,
    "itemId" varchar(255) NOT NULL,
    active boolean NOT NULL
    )
  `);

    console.log('Done migrating database');
  },

  down: async (queryInterface) => {
    console.log('Rolling back database...');

    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS "${tableName}"`);

    console.log('Done rolling back');
  },
};
