const { client } = require('../../utils');
const { v4: uuid } = require('uuid');

describe('MSAuth - password reset', () => {
	it('should receive successful password reset message (valid email)', async () => {
		const email = 'admin@example.com';
		const res = await client.post('/auth-service/reset-password', { email });
		expect(res.status).toBe(200);
	});

	it('should receive successful password reset message (invalid email)', async () => {
		const email = `${uuid().split('').reverse().join('').slice(0, 12)}@iterations.com`;
		const res = await client.post('/auth-service/reset-password', { email });
		expect(res.status).toBe(200);
	});
});
