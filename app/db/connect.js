const { Pool } = require('pg');
const config = require('../config');
const migrate = require('./migrations');
const sqlFixtures = require('sql-fixtures');
const fixtures = require('./fixtures');

exports.start = async () => {
  const host = config.get("PG_HOST");
  const user = config.get("PG_USER");
  const password = config.get("PG_PASS");
  const port = config.get("PG_PORT");
  const database = config.get("PG_DB");
  const additional = config.get("PG_CONFIG");
  const dbConfig = { user, password, host, port: parseInt(port), database };
  try {
    await migrate.run({ ...dbConfig });
    this.pool = new Pool({ ...dbConfig, ...additional });
    console.info("Database connected");
    this.createData(dbConfig);
  } catch (error) {
    console.error(`DB Error: ${error.routine || error.message}`)
    this.close();
    process.emit("SIGTERM");
  }
};

exports.close = async () => {
  try {
    const result = await this.pool.end();
    return result;  
  } catch (error) {
    console.error('Database is not connected');
    return new Error('Database is not connected');
  }
}

exports.query = async (q, data) => {
  try {
    const result = await this.pool.query(q, data);
    return result;  
  } catch (error) {
    console.error('Database is not connected');
    return new Error('Database is not connected');
  }
}
exports.createData = async dbConfig => {
  const TABLE_NAMES = config.get("TABLE_NAMES");
  
  try {
    const restTable = await this.query(`SELECT COUNT(*) FROM ${TABLE_NAMES.rests}`);
    const restCount = parseInt(restTable.rows[0].count);
    const scoutsTable = await this.query(`SELECT COUNT(*) FROM ${TABLE_NAMES.scouts}`);
    const scoutsCount = parseInt(scoutsTable.rows[0].count);
    const clientsTable = await this.query(`SELECT COUNT(*) FROM ${TABLE_NAMES.clients}`);
    const clientsCount = parseInt(clientsTable.rows[0].count);
    const ordersTable = await this.query(`SELECT COUNT(*) FROM ${TABLE_NAMES.orders}`);
    const ordersCount = parseInt(ordersTable.rows[0].count);

    let orders;
    let clients;
    if (restCount === 0) {
      const restaurants = await fixtures.updateWithAddress(fixtures.restaurants);
      await sqlFixtures.create({
        client: "pg",
        connection: dbConfig,
      }, {
        restaurants,
      })
      console.info("Restaurants fixtures is inserted");
      await sqlFixtures.destroy();
    }
    if (clientsCount === 0) {
      clients = await fixtures.updateWithAddress(fixtures.clients);
      await sqlFixtures.create({
        client: "pg",
        connection: dbConfig,
      }, {
        clients,
      })
      console.info("Clients fixtures is inserted");
      await sqlFixtures.destroy();
    }
    if (scoutsCount === 0) {
      orders = await fixtures.createFextureOrders(fixtures.orders);
      const scouts = await fixtures.updateScouts(fixtures.scouts, clients, orders);
      await sqlFixtures.create({
        client: "pg",
        connection: dbConfig,
      }, {
        scouts,
      })
      console.info("Scouts fixtures is inserted");
      await sqlFixtures.destroy();
    }
    if (ordersCount === 0) {
      await sqlFixtures.create({
        client: "pg",
        connection: dbConfig,
      }, {
        orders,
      })
      console.info("Orders fixtures is inserted");
      await sqlFixtures.destroy();
    }
	} catch (error) {
    console.error(error.message || error);
	}
};
