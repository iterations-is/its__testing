const { client } = require('../../../../utils');

describe('MSAuth - internal token verification', () => {
	it('should fail because of missing internal header', async () => {
		const res = await client.post('/auth-service/tokens/verification', {});
		expect(res.status).toBe(403);
	});
});
