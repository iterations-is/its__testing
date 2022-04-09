const { client } = require('../../../../utils');

describe('MSUsers - patch user password', () => {
	it('should fail because of missing internal header', async () => {
		const res = await client.patch('/users-service/users/userid', {});
		expect(res.status).toBe(403);
	});
});
