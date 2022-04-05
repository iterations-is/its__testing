const { client } = require('../../utils/axios');
const { v4: uuid } = require('uuid');
const Joi = require('joi');
const { signInAll } = require('../../utils/signUpAll');

const schemaInterpreter = Joi.object().keys({
	id: Joi.string().uuid().required(),
	version: Joi.string()
		.pattern(/^\d+\.\d+\.\d+$/)
		.required(),
	url: Joi.string().required(),
});

const genIntNewReq = () => ({
	name: `its-test-fake-interpreter-${uuid()}`,
	version: '1.0.0',
	url: 'http://localhost/fake-interpreter',
});

describe('MSInterpreters - lifecycle', () => {
	let accessTokenAdmin;
	let interpreter = genIntNewReq();
	let interpreterId;

	// Authorization

	beforeAll(async () => {
		const tokens = await signInAll(true);
		accessTokenAdmin = tokens.accessTokenAdmin;
	});

	// Tests - Other

	it('should create interpreter', async () => {
		const res = await client.post('/interpreters-service/interpreters', interpreter, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});
		expect(res.status).toBe(200);
		expect(res?.data?.code).toBe('INTERPRETER_CREATED');
	});

	it('should update existing interpreter', async () => {
		const res = await client.post('/interpreters-service/interpreters', interpreter, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});
		expect(res.status).toBe(200);
		expect(res?.data?.code).toBe('INTERPRETER_UPDATED');
	});

	it('should find created interpreter', async () => {
		const res = await client.get('/interpreters-service/interpreters', {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});
		expect(res.status).toBe(200);
		const intData = res?.data?.payload?.[interpreter.name];
		expect(intData?.length).toBe(1);
		const val = schemaInterpreter.validate(intData?.[0]);
		expect(val.error).toBe(undefined);
		interpreterId = intData?.[0]?.id;
		expect(intData?.[0]?.version).toBe(interpreter.version);
		expect(intData?.[0]?.url).toBe(interpreter.url);
	});

	it('should delete found interpreter', async () => {
		const res = await client.delete(`/interpreters-service/interpreters/${interpreterId}`, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});
		expect(res.status).toBe(200);
	});

	it('should not find created interpreter', async () => {
		const res = await client.get('/interpreters-service/interpreters', {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});
		expect(res.status).toBe(200);
		const intData = res?.data?.payload?.[interpreter.name];
		expect(intData?.length).toBeUndefined();
	});
});
