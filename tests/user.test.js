const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app.js');

test('Should login an user', async () => {
    const response = await request(app)
        .post('/login')
        .send({
            email: "juan@mail.com",
            password: "holasas"
        })
        .expect(200);
    
    global.token = response.body.token;
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

afterAll(() => mongoose.disconnect());