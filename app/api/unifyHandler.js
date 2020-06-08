const DEFAULT_ERROR_MESSAGE = 'Oops, Error! Something went wrong;(';

const unifyHandler = async request => {
  try {
    const { data } = await request;
    return data;
  } catch (err) {
    if (err.response && err.response.data) {
      err.description = err.response.data.message || DEFAULT_ERROR_MESSAGE;
    }
    throw err;
  }
};
module.exports = unifyHandler;
