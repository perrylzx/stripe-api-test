const tableName = 'ApiKeys';

module.exports = {
  up: async (queryInterface) => {
    console.log('Migrating database...');

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "${tableName}" (
      "CustomerId" varchar(255) NOT NULL REFERENCES "Customers"(id) ON DELETE CASCADE ON UPDATE CASCADE,
      "apiKey" VARCHAR(255)
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
