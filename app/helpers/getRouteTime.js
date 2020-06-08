const { getTime } = require('../api/geoCalc');

exports.getRouteTime = async (origin, destination, next) => {
  try {
    const { routes } = await getTime({ origin, destination });
    const { legs } = routes[0];
    const { duration, end_address } = legs[0];
    return {
      duration: duration.value,
      address: end_address
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
}