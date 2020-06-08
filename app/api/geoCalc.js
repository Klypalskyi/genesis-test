const { GEO_CALC_API } = require('../config/api');
const unifyHandler = require('./unifyHandler');
const config = require('../config');
const key = config.get("GOOGLE_MAPS_KEY");

exports.getTime = ({ origin, destination }) =>
  unifyHandler(
    GEO_CALC_API.get('', {
      params: {
        origin: `${origin.lat}, ${origin.lng}`,
        destination: `${destination.lat}, ${destination.lng}`,
        mode: 'walking',
        key
      }
    })
  )