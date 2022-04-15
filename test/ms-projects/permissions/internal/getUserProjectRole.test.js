const { client } = require('../../../../utils');

describe('MSProjects - get user project role', () => {
	it('should fail because of missing internal header', async () => {
		const res = await client.get('/projects-service/projects/idProject/users/idUser');
		expect(res.status).toBe(403);
	});
});
