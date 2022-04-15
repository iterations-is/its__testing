const { client } = require('../../utils');
const { v4: uuid } = require('uuid');
const Joi = require('joi');

const schemaNotification = Joi.object().keys({
	id: Joi.string().uuid().required(),
	description: Joi.string().required(),
	isRead: Joi.bool().required(),
	createdAt: Joi.string().required(),
	userId: Joi.string().uuid().required(),
});

describe('MSCommunication - notification lifecycle', () => {
	let accessToken;
	let notificationId;

	it('should register account with', async () => {
		const email = `${uuid().split('').reverse().join('').slice(0, 12)}@iterations.com`;

		const uap = uuid();
		const res = await client.post('/auth-service/signup', {
			email,
			name: 'Test User',
			username: uap,
			password: uap,
		});

		expect(res.status).toBe(201);
		accessToken = res?.data?.payload?.accessToken;
		expect(accessToken).not.toBeUndefined();
	});

	it('should have one notification', async () => {
		const res = await client.get('/communication-service/notifications', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		expect(res.status).toBe(200);
		expect(res.data?.payload?.notifications?.length).toBe(1);

		const firstNotification = res.data?.payload?.notifications?.[0];
		const val = schemaNotification.validate(firstNotification);
		expect(val.error).toBe(undefined);

		expect(firstNotification?.isRead).toBe(false);
		notificationId = firstNotification?.id;
	});

	it('should read notification', async () => {
		const res = await client.patch(
			`/communication-service/notifications/${notificationId}`,
			{},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			},
		);

		expect(res.status).toBe(200);
		expect(res.data?.payload?.isRead).toBe(true);
	});

	it('should unread notification', async () => {
		const res = await client.patch(
			`/communication-service/notifications/${notificationId}`,
			{},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			},
		);

		expect(res.status).toBe(200);
		expect(res.data?.payload?.isRead).toBe(false);
	});

	it('should delete notification', async () => {
		const res = await client.delete(`/communication-service/notifications/${notificationId}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		expect(res.status).toBe(200);
	});
});
