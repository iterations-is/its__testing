const { client } = require('../../../utils/axios');
const { v4: uuid } = require('uuid');
const { signInAll } = require('../../../utils/signUpAll');

describe('MSInterpreters – Permissions - find interpreter', () => {
	let accessTokenAdmin;
	let accessTokenAuthority;
	let accessTokenUser;
	let accessTokenBanned;

	let URL = '/interpreters-service/interpreters/fakeInterpreterName/fakeInterpreterVersion';

	// Authorization

	beforeAll(async () => {
		const tokens = await signInAll();
		accessTokenAdmin = tokens.accessTokenAdmin;
		accessTokenAuthority = tokens.accessTokenAuthority;
		accessTokenUser = tokens.accessTokenUser;
		accessTokenBanned = tokens.accessTokenBanned;
	});

	// Tests - Permissions

	it('should protect endpoint with authorization', async () => {
		const res = await client.get(URL);
		expect(res.status).toBe(401);
	});

	it('should pass with admin role', async () => {
		const res = await client.get(URL, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});
		expect(res.status).not.toBe(403);
	});

	it('should pass with authority role', async () => {
		const res = await client.get(URL, {
			headers: { Authorization: `Bearer ${accessTokenAuthority}` },
		});
		expect(res.status).not.toBe(403);
	});

	it('should pass with user role', async () => {
		const res = await client.get(URL, {
			headers: { Authorization: `Bearer ${accessTokenUser}` },
		});
		expect(res.status).not.toBe(403);
	});

	it('should fail with banned role', async () => {
		const res = await client.get(URL, {
			headers: { Authorization: `Bearer ${accessTokenBanned}` },
		});
		expect(res.status).toBe(403);
	});
});
