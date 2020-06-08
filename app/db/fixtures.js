const { getRandomInt, getRandomAmount, randomDate, resultReduce } = require('../helpers/utils');
const { getRouteTime } = require('../helpers/getRouteTime');

const restaurants = [
  {
    name: "MacDonalds",
    locationlat: 50.402230, 
    locationlng: 30.653809
  },
  {
    name: "KFC",
    locationlat: 50.418863, 
    locationlng: 30.631931
  },
  {
    name: "Eurasia",
    locationlat: 50.408763, 
    locationlng: 30.625758
  }];

let scouts = [
  {
    name: "John"
  },
  {
    name: "Bill"
  },
  {
    name: "Sam"
  },
  {
    name: "Kyle"
  },
  {
    name: "Mike"
  }];

let clients = [
  {
    name: "Developer A",
    familyname: "Jason",
    locationlat: 50.406633,
    locationlng: 30.622541
  },
  {
    name: "Developer B",
    familyname: "Jason",
    locationlat: 50.409546,
    locationlng: 30.623313
  },
  {
    name: "Developer C",
    familyname: "Jhonson",
    locationlat: 50.402913,
    locationlng: 30.622901
  },
  {
    name: "Developer D",
    familyname: "Aizenberg",
    locationlat: 50.395870,
    locationlng: 30.628913
  },
  {
    name: "Developer E",
    familyname: "Vasilenko",
    locationlat: 50.395001,
    locationlng: 30.632736
  },
  {
    name: "Developer F",
    familyname: "Aizenberg",
    locationlat: 50.392840,
    locationlng: 30.641963
  },
  {
    name: "Developer G",
    familyname: "Koton",
    locationlat: 50.403550,
    locationlng: 30.635719
  },
  {
    name: "Developer H",
    familyname: "Catson",
    locationlat: 50.407366,
    locationlng: 30.638176
  }];

const createFextureOrders = async array => {
  for (let index = 0; index < 100; index++) {
    const { startDate, endDate, duration } = randomDate();
    const clientid = getRandomInt(1, clients.length);
    const scoutid = getRandomInt(1, scouts.length);
    const restid = getRandomInt(1, restaurants.length);
    const rest = restaurants[restid - 1];
    const client = clients[clientid - 1];
    const origin = {
      lat: rest.locationlat,
      lng: rest.locationlng
    };
    const destination = {
      lat: client.locationlat,
      lng: client.locationlng
    };
    const google = await getRouteTime(origin, destination);
    const estimate = (google.duration / 60).toFixed();
    const rate = duration > estimate ? 'slowly' : 'fast';
    const order = {
      clientid: { from: 'clients', where: { id: clientid }},
      scoutid: { from: 'scouts', where: { id: scoutid }},
      restid: { from: 'restaurants', where: { id: restid }},
      amount: getRandomAmount(50, 500),
      startdate: startDate,
      enddate: endDate,
      duration,
      estimate,
      rate
    }
    array.push(order);
  }
  return array;
};

const updateWithAddress = async array =>
  await Promise.all(array.map(async el => {
    const location = {
      lat: el.locationlat,
      lng: el.locationlng
    }
    const { address } = await getRouteTime(location, location)
    return {
      ...el,
      address
    }
  }))

const updateScouts = async (array, newClients, newOrders) =>
  await Promise.all(array.map(async (scout, index) => {
    const scoutId = index + 1;
    const scoutOrders = newOrders.filter(order => order.scoutid.where.id === scoutId);
    const totalcount = scoutOrders.length;
    let totalamount = 0;
    if (totalcount > 0) {
      totalamount = scoutOrders.map(order => parseFloat(order.amount)).reduce((acc, cur) => acc + cur);
      const avgtime = scoutOrders.map(order => order.duration).reduce((acc, cur) => acc + cur) / totalcount;
      const clientArr = resultReduce(scoutOrders.map(order => order.clientid.where.id));
      const favclientId = +Object.keys(clientArr.result.sort((a, b) => clientArr.map.get(b) - clientArr.map.get(a))[0])[0];
      const favlocation = newClients[favclientId - 1].address;
      return {
        ...scout,
        totalcount,
        totalamount: totalamount.toFixed(2),
        avgtime: +avgtime.toFixed(0),
        favlocation        
      }
    } else return {
      ...scout,
      totalcount,
      totalamount
    }
  }));

const orders = [];

module.exports = {
  restaurants,
  scouts,
  clients,
  orders,
  createFextureOrders,
  updateWithAddress,
  updateScouts
}