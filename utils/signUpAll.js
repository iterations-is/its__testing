const { client } = require('./axios');
module.exports = {
	signInAll: async (onlyAdmin = false) => {
		let accessTokenAdmin;
		let accessTokenAuthority;
		let accessTokenUser;
		let accessTokenBanned;
		let res;

		res = await client.post('/auth-service/signin', {
			username: process.env.USER_ADMIN,
			password: process.env.ALL_USERS_PASS,
		});
		expect((accessTokenAdmin = res?.data?.payload?.accessToken)).not.toBeUndefined();

		if (onlyAdmin) return { accessTokenAdmin };

		res = await client.post('/auth-service/signin', {
			username: process.env.USER_AUTHORITY,
			password: process.env.ALL_USERS_PASS,
		});
		expect((accessTokenAuthority = res?.data?.payload?.accessToken)).not.toBeUndefined();

		res = await client.post('/auth-service/signin', {
			username: process.env.USER_USER,
			password: process.env.ALL_USERS_PASS,
		});
		expect((accessTokenUser = res?.data?.payload?.accessToken)).not.toBeUndefined();

		res = await client.post('/auth-service/signin', {
			username: process.env.USER_BANNED,
			password: process.env.ALL_USERS_PASS,
		});
		expect((accessTokenBanned = res?.data?.payload?.accessToken)).not.toBeUndefined();

		return {
			accessTokenAdmin,
			accessTokenAuthority,
			accessTokenUser,
			accessTokenBanned,
		};
	},
};
