const path = require('path');
const nconf = require('nconf');
const dotenv = require('dotenv');

const environment = process.env.NODE_ENV || 'development';

dotenv.config({
  path: path.join(__dirname, 'env', `.env.${environment}`),
});
dotenv.config();

nconf.argv()
  .env()
  .file({ file: './app/config/config.json' });

module.exports = nconf;