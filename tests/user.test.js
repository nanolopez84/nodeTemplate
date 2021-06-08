const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app.js');

// Just a few tests to show

test('Should reject non existent user', async () => {
    const response = await request(app)
        .post('/login')
        .send({
            email:      "john@doe.com",
            password:   "donotexist"
        })
        .expect(401);
});

test('Should login as admin', async () => {
    const response = await request(app)
        .post('/login')
        .send({
            email:      process.env.TEST_ADMIN_USER || "admin@node.com",
            password:   process.env.TEST_ADMIN_PASS || "adminpass"
        })
        .expect(200);
    
    global.token = response.body.token;
});

test('Should create a new user', async () => {
    const response = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${global.token}`)
        .send({
            name: "John Doe",
            email: "john@doe.com",
            password: "newuser"
        })
        .expect(201);

    global.newUserId = response.body._id;
});

test('Should retreive data from the new user', async () => {
    const response = await request(app)
        .get(`/users/${global.newUserId}`)
        .set('Authorization', `Bearer ${global.token}`)
        .send()
        .expect(200);

    expect(response.body.name).toBeDefined();
    expect(response.body.email).toBeDefined();
});

test('Should delete the new user', async () => {
    const response = await request(app)
        .delete(`/users/${global.newUserId}`)
        .set('Authorization', `Bearer ${global.token}`)
        .send()
        .expect(200);
});

test('Should retrieve data about user connected', async () => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${global.token}`)
        .send()
        .expect(200);

    expect(response.body.name).toBeDefined();
    expect(response.body.email).toBeDefined();
});

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // Avoid Jest open handle error
    await mongoose.disconnect();
});