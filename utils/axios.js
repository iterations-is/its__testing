const axios = require('axios');

const client = axios.create({
  baseURL: 'http://192.168.0.146:10000',
  timeout: 5000,
  validateStatus: () => true,
});

module.exports = {
  client
}
