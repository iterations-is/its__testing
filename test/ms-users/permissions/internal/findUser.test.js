const { client } = require('../../../../utils');

describe('MSUsers - find user', () => {
	it('should fail because of missing internal header', async () => {
		const res = await client.post('/users-service/users/search', {});
		expect(res.status).toBe(403);
	});
});
