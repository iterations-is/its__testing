const { client } = require('../../utils');
const { v4: uuid } = require('uuid');
const Joi = require('joi');

const schemaUser = Joi.object().keys({
	id: Joi.string().uuid().required(),
	name: Joi.string().required(),
	email: Joi.string().required(),
	username: Joi.string().required(),
	password: Joi.string(),
	role: Joi.object().required().keys({
		name: Joi.string().required(),
	}),
	gravatar: Joi.string().uri(),
});

describe('MSUsers - user lifecycle', () => {
	let accessToken;
	const userUuid = uuid();
	const userData = {
		email: `${userUuid}@example.com`,
		name: userUuid,
		username: userUuid,
		password: userUuid,
	};

	let userId;

	it('should create a user', async () => {
		const res = await client.post('/users-service/users', userData, {
			headers: { 'x-its-ms': process.env.INTERNAL_TOKEN },
		});

		expect(res.status).toBe(200);
		const val = schemaUser.validate(res.data?.payload);
		expect(val.error).toBe(undefined);

		userId = res.data?.payload?.id;
	});

	it('should find user by username', async () => {
		const res = await client.post(
			'/users-service/users/search',
			{ username: userData.username },
			{ headers: { 'x-its-ms': process.env.INTERNAL_TOKEN } },
		);

		expect(res.status).toBe(200);
		const val = schemaUser.validate(res.data?.payload);
		expect(val.error).toBe(undefined);
		expect(res.data?.payload?.id).toBe(userId);
		expect(res.data?.payload?.email).toBe(userData.email);
		expect(res.data?.payload?.username).toBe(userData.username);
		expect(res.data?.payload?.name).toBe(userData.name);
	});

	it('should find user by email', async () => {
		const res = await client.post(
			'/users-service/users/search',
			{ email: userData.email },
			{ headers: { 'x-its-ms': process.env.INTERNAL_TOKEN } },
		);

		expect(res.status).toBe(200);
		const val = schemaUser.validate(res.data?.payload);
		expect(val.error).toBe(undefined);
		expect(res.data?.payload?.id).toBe(userId);
		expect(res.data?.payload?.email).toBe(userData.email);
		expect(res.data?.payload?.username).toBe(userData.username);
		expect(res.data?.payload?.name).toBe(userData.name);
	});

	it('should find user by id', async () => {
		const res = await client.post(
			'/users-service/users/search',
			{ id: userId },
			{ headers: { 'x-its-ms': process.env.INTERNAL_TOKEN } },
		);

		expect(res.status).toBe(200);
		const val = schemaUser.validate(res.data?.payload);
		expect(val.error).toBe(undefined);
		expect(res.data?.payload?.id).toBe(userId);
		expect(res.data?.payload?.email).toBe(userData.email);
		expect(res.data?.payload?.username).toBe(userData.username);
		expect(res.data?.payload?.name).toBe(userData.name);
	});

	it('should update password', async () => {
		const res = await client.patch(
			`/users-service/users/${userId}`,
			{
				password: 'password',
			},
			{ headers: { 'x-its-ms': process.env.INTERNAL_TOKEN } },
		);

		expect(res.status).toBe(200);
	});

	it('should sign in into account with updated password', async () => {
		const res = await client.post('/auth-service/signin', {
			username: userData.username,
			password: 'password',
		});

		expect(res.status).toBe(200);
		expect((accessToken = res?.data?.payload?.accessToken)).not.toBeUndefined();
	});

	it('should get self', async () => {
		const res = await client.get('/users-service/users/self', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		expect(res.status).toBe(200);
		const val = schemaUser.validate(res.data?.payload);
		expect(val.error).toBe(undefined);
		expect(res.data?.payload?.id).toBe(userId);
		expect(res.data?.payload?.email).toBe(userData.email);
		expect(res.data?.payload?.username).toBe(userData.username);
		expect(res.data?.payload?.name).toBe(userData.name);
	});

	it('should get user', async () => {
		const res = await client.get(`/users-service/users/${userId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		expect(res.status).toBe(200);
		const val = schemaUser.validate(res.data?.payload);
		expect(val.error).toBe(undefined);
		expect(res.data?.payload?.id).toBe(userId);
		expect(res.data?.payload?.email).toBe(userData.email);
		expect(res.data?.payload?.username).toBe(userData.username);
		expect(res.data?.payload?.name).toBe(userData.name);
	});

	it('should delete user', async () => {
		const res = await client.delete(`/users-service/users/self`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		expect(res.status).toBe(200);
	});
});
