const { client, signInAll } = require('../../../../utils');

describe('MSCommunication – Permissions - read notification', () => {
	let accessTokenAdmin;
	let accessTokenAuthority;
	let accessTokenUser;
	let accessTokenBanned;

	let URL = '/communication-service/notifications/fakeId';
	const access = [
		['admin', true],
		['authority', true],
		['user', true],
		['banned', false],
	];
	const genRequest = (token = null) =>
		client.patch(URL, {}, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

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
		const res = await genRequest();
		expect(res.status).toBe(401);
	});

	it(`should ${access[0][1] ? 'pass' : 'fail'} with admin role`, async () => {
		const res = await genRequest(accessTokenAdmin);
		if (access[0][1]) {
			expect(res.status).not.toBe(403);
		} else {
			expect(res.status).toBe(403);
		}
	});

	it(`should ${access[1][1] ? 'pass' : 'fail'} with authority role`, async () => {
		const res = await genRequest(accessTokenAuthority);
		if (access[1][1]) {
			expect(res.status).not.toBe(403);
		} else {
			expect(res.status).toBe(403);
		}
	});

	it(`should ${access[2][1] ? 'pass' : 'fail'} with user role`, async () => {
		const res = await genRequest(accessTokenUser);
		if (access[2][1]) {
			expect(res.status).not.toBe(403);
		} else {
			expect(res.status).toBe(403);
		}
	});

	it(`should ${access[3][1] ? 'pass' : 'fail'} with banned role`, async () => {
		const res = await genRequest(accessTokenBanned);
		if (access[3][1]) {
			expect(res.status).not.toBe(403);
		} else {
			expect(res.status).toBe(403);
		}
	});
});
