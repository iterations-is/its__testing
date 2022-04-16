const { client, signInAll } = require('../../utils');
const { v4: uuid } = require('uuid');
const Joi = require('joi');

const schemaCategory = Joi.object().keys({
	id: Joi.string().uuid().required(),
	name: Joi.string().required(),
});

describe('MSProjects - project lifecycle', () => {
	let accessTokenAdmin;
	let categoryId;
	const categoryName = uuid();
	let projectId;
	let projectResponse;

	// Authorization

	beforeAll(async () => {
		const tokens = await signInAll(true);
		accessTokenAdmin = tokens.accessTokenAdmin;
	});

	it('should create category', async () => {
		const res = await client.post(
			'/projects-service/categories',
			{ name: categoryName },
			{ headers: { Authorization: `Bearer ${accessTokenAdmin}` } },
		);

		expect(res.status).toBe(200);
		categoryId = res.data?.payload?.id;
	});

	it('should create project', async () => {
		expect(categoryId).toBeDefined();

		const projectData = {
			name: 'Project name',
			descriptionPrivate: 'Description private',
			descriptionPublic: 'Description public',
			archived: false,
			searchable: true,
			public: true,
			joinable: true,
			category: categoryId,
			roles: [
				{
					name: 'Developer',
					capacity: 4,
				},
			],
		};

		const res = await client.post('/projects-service/projects', projectData, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});

		expect(res.status).toBe(200);
		const project = res.data?.payload?.project;
		projectId = project?.id;
		expect(project?.name).toBe(projectData.name);
		expect(project?.descriptionPrivate).toBe(projectData.descriptionPrivate);
		expect(project?.descriptionPublic).toBe(projectData.descriptionPublic);
		expect(project?.archived).toBe(projectData.archived);
		expect(project?.searchable).toBe(projectData.searchable);
		expect(project?.public).toBe(projectData.public);
		expect(project?.joinable).toBe(projectData.joinable);
		expect(project?.categoryId).toBe(projectData.category);
	});

	it('should get project', async () => {
		expect(projectId).toBeDefined();

		const res = await client.get(`/projects-service/projects/${projectId}`, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});

		expect(res.status).toBe(200);
		expect(res.data?.payload?.id).toBe(projectId);
		projectResponse = res.data?.payload;
	});

	it('should have Leader role with 1 user', async () => {
		expect(projectResponse).toBeDefined();

		const roleLeader = projectResponse.projectRoles.find((role) => role.name === 'Leader');
		expect(roleLeader).toBeDefined();
		expect(roleLeader?.projectRoleAssignments?.length).toBe(1);
		expect(roleLeader?.capacity).toBe(-1);
		expect(roleLeader?.editable).toBe(false);
	});

	it('should have Visitor role', async () => {
		expect(projectResponse).toBeDefined();

		const roleVisitor = projectResponse.projectRoles.find((role) => role.name === 'Visitor');
		expect(roleVisitor).toBeDefined();
		expect(roleVisitor?.projectRoleAssignments?.length).toBe(0);
		expect(roleVisitor?.capacity).toBe(-1);
		expect(roleVisitor?.editable).toBe(false);
	});

	it('should have Developer role', async () => {
		expect(projectResponse).toBeDefined();

		const roleVisitor = projectResponse.projectRoles.find((role) => role.name === 'Developer');
		expect(roleVisitor).toBeDefined();
		expect(roleVisitor?.projectRoleAssignments?.length).toBe(0);
		expect(roleVisitor?.capacity).toBe(4);
		expect(roleVisitor?.editable).toBe(true);
	});

	it('should find project in self group', async () => {
		expect(projectId).toBeDefined();

		const res = await client.get(`/projects-service/projects/self?page=1&pageSize=20`, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});

		expect(res.status).toBe(200);
		const foundProject = res.data?.payload?.projects?.find((project) => project.id === projectId);
		expect(foundProject?.id).toBe(projectId);
	});

	it('should find project in public group', async () => {
		expect(projectId).toBeDefined();

		const res = await client.get(`/projects-service/projects?page=1&pageSize=20`, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});

		expect(res.status).toBe(200);
		const foundProject = res.data?.payload?.projects?.find((project) => project.id === projectId);
		expect(foundProject?.id).toBe(projectId);
	});

	it('should update project', async () => {
		const res = await client.patch(
			`/projects-service/projects/${projectId}`,
			{ searchable: false },
			{ headers: { Authorization: `Bearer ${accessTokenAdmin}` } },
		);

		expect(res.status).toBe(200);
	});

	it('should not find project in public group', async () => {
		expect(projectId).toBeDefined();

		const res = await client.get(`/projects-service/projects?page=1&pageSize=20`, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});

		expect(res.status).toBe(200);
		const foundProject = res.data?.payload?.projects?.find((project) => project.id === projectId);
		expect(foundProject).toBeUndefined();
	});

	it('should delete project', async () => {
		expect(projectId).toBeDefined();

		const res = await client.delete(`/projects-service/projects/${projectId}`, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});

		expect(res.status).toBe(200);
	});

	it('should not find project in self group', async () => {
		expect(projectId).toBeDefined();

		const res = await client.get(`/projects-service/projects/self?page=1&pageSize=20`, {
			headers: { Authorization: `Bearer ${accessTokenAdmin}` },
		});

		expect(res.status).toBe(200);
		const foundProject = res.data?.payload?.projects?.find((project) => project.id === projectId);
		expect(foundProject).toBeUndefined();
	});
});
