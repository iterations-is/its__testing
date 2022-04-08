const { client, signInAll } = require('../../utils');

describe('MSInterpreters - Validations', () => {
	let accessTokenAdmin;

	// Authorization

	beforeAll(async () => {
		const tokens = await signInAll(true);
		accessTokenAdmin = tokens.accessTokenAdmin;
	});

	// Tests - Validations

	it('should fail creation with validation', async () => {
		const res = await client.post(
			'/interpreters-service/interpreters',
			{},
			{ headers: { Authorization: `Bearer ${accessTokenAdmin}` } },
		);
		expect(res.status).toBe(400);
		expect(res.data?.code).toBe('VALIDATION');
	});
});
