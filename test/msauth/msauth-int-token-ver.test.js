const { client } = require('../../utils/axios');
const { v4: uuid } = require('uuid');

describe('MSAuth - internal token verification', () => {
	let accessToken;
	let refreshToken;

	it('should get tokens', async () => {
		const res = await client.post('/auth-service/signin', {
			username: process.env.USER_USER,
			password: process.env.ALL_USERS_PASS,
		});

		expect(res.status).toBe(200);
		expect((accessToken = res?.data?.payload?.accessToken)).not.toBeUndefined();
		expect((refreshToken = res?.data?.payload?.refreshToken)).not.toBeUndefined();
	});

	it('should verify tokens', async () => {
		const res = await client.post(
			'/auth-service/tokens/verification',
			{
				accessToken,
			},
			{
				headers: {
					'x-its-ms': process.env.INTERNAL_TOKEN,
				},
			},
		);

		expect(res.status).toBe(200);
		expect(res?.data?.payload?.tokenType).toBe('access');
	});

	it('should fail token verification because of missing internal header', async () => {
		const res = await client.post('/auth-service/tokens/verification', {
			accessToken,
		});

		expect(res.status).toBe(403);
	});

	it('should fail token verification because of missing token (simulate transitive auth request)', async () => {
		const res = await client.post(
			'/auth-service/tokens/verification',
			{},
			{
				headers: {
					'x-its-ms': process.env.INTERNAL_TOKEN,
				},
			},
		);

		expect(res.status).toBe(401);
	});
});
