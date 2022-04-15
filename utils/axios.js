const axios = require('axios');

const client = axios.create({
	baseURL: process.env.SERVER_URI,
	timeout: 3000,
	validateStatus: () => true,
});

module.exports = {
	client,
};
