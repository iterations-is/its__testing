const { client } = require('../utils/axios');
const { v4: uuid } = require('uuid');

describe('auth', () => {
	it('should register user', async () => {
		const email = `${uuid().split('').reverse().join('').slice(0, 12)}@iterations.com`;

		const res = await client.post('/auth-service/signup', {
			email,
			name: 'Charlotte',
			username: uuid(),
			password: uuid(),
		});

		expect(res.status).toBe(201);
	});
});
