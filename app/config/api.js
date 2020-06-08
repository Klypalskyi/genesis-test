const axios = require('axios');
const config = require('./index');

exports.GEO_CALC_API = axios.create({
  baseURL: config.get('GOOGLE_MAPS_CALC'),
});