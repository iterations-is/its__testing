const { client, signInAll } = require('../../utils');
const { v4: uuid } = require('uuid');
const Joi = require('joi');

const schemaData = Joi.array().items(
	Joi.object().keys({
		status: Joi.string().valid('fulfilled').required(),
		value: Joi.object()
			.required()
			.keys({
				name: Joi.string().required(),
				status: Joi.number().valid(200),
				data: Joi.object().required().keys({
					name: Joi.string().required(),
					version: Joi.string().required(),
					description: Joi.string().required(),
				}),
			}),
	}),
);

describe('MSMonitoring - statuses', () => {
	// Tests - Other

	it('should create interpreter', async () => {
		const res = await client.get('/monitoring-service/status');
		expect(res.status).toBe(200);
		const val = schemaData.validate(res.data?.data);
		expect(val.error).toBe(undefined);
	});
});
