const { client } = require('../../../../utils');

describe('MSUsers - create user', () => {
	it('should fail because of missing internal header', async () => {
		const res = await client.post('/users-service/users', {});
		expect(res.status).toBe(403);
	});
});
