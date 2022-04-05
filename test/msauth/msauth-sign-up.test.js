const { client } = require('../../utils/axios');
const { v4: uuid } = require('uuid');
const jwtDecode = require('jwt-decode');

describe('MSAuth - sign up', () => {
	it('should register account with "user" role', async () => {
		const email = `${uuid().split('').reverse().join('').slice(0, 12)}@iterations.com`;

		const uap = uuid();
		const res = await client.post('/auth-service/signup', {
			email,
			name: 'Test User',
			username: uap,
			password: uap,
		});

		expect(res.status).toBe(201);
		const accessToken = res?.data?.payload?.accessToken;
		expect(accessToken).not.toBeUndefined();
		expect(res?.data?.payload?.refreshToken).not.toBeUndefined();

		const decoded = jwtDecode(accessToken);
		expect(decoded?.payload?.role?.name).toBe('user');
	});
});
