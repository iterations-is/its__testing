const { client } = require('../utils/axios');
const Joi = require('joi');

const schemaAbout = Joi.object().keys({
	name: Joi.string().required(),
	version: Joi.string()
		.pattern(/^\d+\.\d+\.\d+.*$/)
		.required(),
	description: Joi.string().required(),
});

describe('auth', () => {
	it('should do heathCheck of ms-auth', async () => {
		const res = await client.get('/auth-service/about');
		const val = schemaAbout.validate(res.data);
		expect(val.error).toBe(undefined);
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-communication', async () => {
		const res = await client.get('/communication-service/about');
		const val = schemaAbout.validate(res.data);
		expect(val.error).toBe(undefined);
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-interpreters', async () => {
		const res = await client.get('/interpreters-service/about');
		const val = schemaAbout.validate(res.data);
		expect(val.error).toBe(undefined);
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-monitoring', async () => {
		const res = await client.get('/monitoring-service/about');
		const val = schemaAbout.validate(res.data);
		expect(val.error).toBe(undefined);
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-projects', async () => {
		const res = await client.get('/projects-service/about');
		const val = schemaAbout.validate(res.data);
		expect(val.error).toBe(undefined);
		expect(res.status).toBe(200);
	});

	it('should do heathCheck of ms-users', async () => {
		const res = await client.get('/users-service/about');
		const val = schemaAbout.validate(res.data);
		expect(val.error).toBe(undefined);
		expect(res.status).toBe(200);
	});
});
