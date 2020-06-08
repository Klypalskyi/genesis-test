const moment = require('moment');
const db = require('../connect');
const { getRouteTime } = require('../../helpers/getRouteTime');
const config = require('../../config');

exports.select = async tablename => {
  try {
    const { rows } = await db.query(`select * from ${tablename}`);
    return rows;
  } catch (error) {
    throw new Error(error);
  }
};

exports.selectById = async (tablename, id) => {
  try {
    const { rows } = await db.query(`select * from ${tablename} where id=${id}`);
    return rows;
  } catch (error) {
    throw new Error(error);
  }
};

exports.insert = async (tablename, cols, data) => {
  const values = cols.split(', ').map((el, index) => `$${index + 1}`).join(', ');
  try {
    await db.query('BEGIN');
    await db.query(`insert into ${tablename} (${cols}) VALUES (${values})`, data);
    await db.query('COMMIT');
  } catch (error) {
    await db.query('ROLLBACK');
    throw new Error(error);
  }
};

exports.update = async (tablename, cols, id, data) => {
  const updateColumns = cols.split(', ').map((el, index) => `${el}=$${index+1}`).join(', ');
  try {
    await db.query('BEGIN');
    const result = await db.query(`update ${tablename} set ${updateColumns} where id=${id}`, data);
    await db.query('COMMIT');
    return result;
  } catch (error) {
    await db.query('ROLLBACK');
    throw new Error(error);
  }
};

exports.delete = async (tablename, id) => {
  try {
    await db.query('BEGIN');
    const { rowCount } = await db.query(`delete from ${tablename} where id=${id}`);
    await db.query('COMMIT');
    return rowCount;
  } catch (error) {
    await db.query('ROLLBACK');
    throw new Error(error);
  }
};

exports.selectActiveOrders = async tablename => {
  try {
    const { rows } = await db.query(`select * from ${tablename} where enddate is null`);
    return rows;
  } catch (error) {
    throw new Error(error);
  }
}

exports.endOrder = async (orders, clients, scouts, rests, id) => {
  try {
    // NOTE: Get main info about order
    const [order] = await this.selectById(orders, id);
    const { clientid, scoutid, restid, startdate } = order;

    // NOTE Get info about client and restaurant
    const [client] = await this.selectById(clients, clientid);
    const [restaurant] = await this.selectById(rests, restid);

    // NOTE: Calculating time for the order
    const origin = {
      lat: restaurant.locationlat,
      lng: restaurant.locationlng,
    };
    const destination = {
      lat: client.locationlat,
      lng: client.locationlng,
    };
    const google = await getRouteTime(origin, destination);
    const estimate = (google.duration / 60).toFixed();
    const rate = duration > googleMinutes ? 'slowly' : 'fast';
    const startDate = moment(startdate);
    const endDate = moment();
    const duration = moment.duration(endDate.diff(startDate)).asMinutes().toFixed();
    const { orderColumnsClose, scoutColumnsCalc } = config.get("TABLE_COLUMNS");
    const orderData = [endDate.utc(), duration, estimate, rate];

    // NOTE: Update the order
    await this.update(orders, orderColumnsClose, id, orderData);

    // NOTE: Get the statistics for the scout 
    const allScoutOrders = await db.query(`
    select
    	count(*) as totalcount,
     	round((sum(CAST(amount as numeric))), 2) as totalamount,
    	round((avg(duration)), 2) as avgtime
    from orders
    where scoutid = ${scoutid}`);
    const getFavLocation = await db.query(`
    select 
    	address
    from clients cl
    inner join (
    	select
    		clientid
    	from orders
    	where scoutid = ${scoutid}
    	group by clientid
    	order by count(clientid) desc
    	limit 1
    ) ord on cl.id = ord.clientid`);
    const { totalcount, totalamount, avgtime } = allScoutOrders.rows[0];
    const favlocation = getFavLocation.rows[0].address;
    const scoutData = [totalcount, totalamount, avgtime, favlocation];

    // NOTE: Update the scout with statistics
    await this.update(scouts, scoutColumnsCalc, scoutid, scoutData);
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
};
