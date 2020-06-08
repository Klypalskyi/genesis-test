const { createDb, migrate } = require('postgres-migrations');
const config = require('../config');

exports.run = async ({ user, password = '', host, port, database }) => {
  const nodePath = config.get('NODE_PATH');
  const dir = `${nodePath}/../migrations`;
  const dbConfig = { user, password, host, port: parseInt(port), database };
  await createDb(database, { ...dbConfig, defaultDatabase: "postgres", });
  return migrate(dbConfig, dir);
};