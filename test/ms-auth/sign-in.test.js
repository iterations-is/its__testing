const { client } = require('../../utils');

describe('MSAuth - sign in', () => {
	let accessToken;
	let refreshToken;
	it('should sign in into account', async () => {
		const res = await client.post('/auth-service/signin', {
			username: process.env.USER_ADMIN,
			password: process.env.ALL_USERS_PASS,
		});

		expect(res.status).toBe(200);
		expect((accessToken = res?.data?.payload?.accessToken)).not.toBeUndefined();
		expect((refreshToken = res?.data?.payload?.refreshToken)).not.toBeUndefined();
	});

	it('should refresh tokens for the new account', async () => {
		const res = await client.post('/auth-service/refresh', {
			token: refreshToken,
		});

		expect(res.status).toBe(200);
		expect(res?.data?.payload?.accessToken).not.toBeUndefined();
		expect(res?.data?.payload?.refreshToken).not.toBeUndefined();
	});

	it('should fail refresh tokens if the access token is provided', async () => {
		const res = await client.post('/auth-service/refresh', {
			token: accessToken,
		});

		expect(res.status).toBe(403);
	});

	it('should fail refresh tokens if no token is provided', async () => {
		const res = await client.post('/auth-service/refresh', {});

		expect(res.status).toBe(403);
	});
});
