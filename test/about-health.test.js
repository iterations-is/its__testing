const { client } = require('../utils/axios');

describe('auth', () => {
	it('should do heathCheck of ms-auth', async () => {
		const res = await client.get('/auth-service/about/health');
		expect(res.data).toBe("");
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-communication', async () => {
		const res = await client.get('/communication-service/about/health');
		expect(res.data).toBe("");
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-interpreters', async () => {
		const res = await client.get('/interpreters-service/about/health');
		expect(res.data).toBe("");
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-monitoring', async () => {
		const res = await client.get('/monitoring-service/about/health');
		expect(res.data).toBe("");
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-projects', async () => {
		const res = await client.get('/projects-service/about/health');
		expect(res.data).toBe("");
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-users', async () => {
		const res = await client.get('/users-service/about/health');
		expect(res.data).toBe("");
		expect(res.status).toBe(200);
	});
});
