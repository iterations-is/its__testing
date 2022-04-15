const { client, signInAll } = require('../../utils');
const { v4: uuid } = require('uuid');
const Joi = require('joi');

const schemaCategory = Joi.object().keys({
	id: Joi.string().uuid().required(),
	name: Joi.string().required(),
});

describe('MSProjects - category lifecycle', () => {
	let accessTokenAdmin;
	let categoryId;
	const categoryName = `Category ${uuid()}`;
	const categoryName2 = `Category ${uuid()}`;

	// Authorization

	beforeAll(async () => {
		const tokens = await signInAll(true);
		accessTokenAdmin = tokens.accessTokenAdmin;
	});

	it('should have one notification', async () => {
		const res = await client.post(
			'/projects-service/categories',
			{
				name: categoryName,
			},
			{
				headers: { Authorization: `Bearer ${accessTokenAdmin}` },
			},
		);

		expect(res.status).toBe(200);
		categoryId = res.data?.payload?.id;
		expect(categoryId).toBeDefined();
		expect(res.data?.payload?.name).toBe(categoryName);
	});

	it('should have at least one category', async () => {
		const res = await client.get('/projects-service/categories', {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});

		expect(res.status).toBe(200);
		expect(res.data?.payload?.length).toBeGreaterThanOrEqual(1);

		const category = res.data?.payload?.find((c) => c.id === categoryId);

		const val = schemaCategory.validate(category);
		expect(val.error).toBe(undefined);
		expect(category?.name).toBe(categoryName);
	});

	it('should update category', async () => {
		const res = await client.patch(
			`/projects-service/categories/${categoryId}`,
			{
				name: categoryName2,
			},
			{ headers: { Authorization: `Bearer ${accessTokenAdmin}` } },
		);

		expect(res.status).toBe(200);
		const val = schemaCategory.validate(res.data?.payload);
		expect(val.error).toBe(undefined);
		expect(res.data?.payload?.name).toBe(categoryName2);
	});

	it('should delete category', async () => {
		const res = await client.delete(`/projects-service/categories/${categoryId}`, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});

		expect(res.status).toBe(200);
	});
});
