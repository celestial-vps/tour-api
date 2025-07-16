const express = require('express');
const request = require('supertest');
const countryRouter = require('../../routes/country.route'); // Sesuaikan path

jest.mock('../../controllers/country.controller', () => ({
  create: jest.fn((req, res) => res.status(200).json({ message: 'create called' })),
  update: jest.fn((req, res) => res.status(200).json({ message: 'update called' })),
  deleted: jest.fn((req, res) => res.status(200).json({ message: 'delete called' })),
  findAll: jest.fn((req, res) => res.status(200).json({ message: 'findAll called' })),
  find: jest.fn((req, res) => res.status(200).json({ message: 'find called' })),
  findById: jest.fn((req, res) => res.status(200).json({ message: 'findById called' })),
}));

jest.mock('../../middleware/role-guard', () => ({
  roleGuard: (role) => (req, res, next) => next(),
}));

jest.mock('../../misc/validation', () => ({
  validateRequest: () => (req, res, next) => next(),
}));

describe('Country Routes', () => {
  let app;
  let server;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/country', countryRouter);
    server = app.listen(0); // port random
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  // Tambahkan timeout untuk tiap test supaya gak timeout 5000 ms
  test('POST /country/create should call controller.create and return 200', async () => {
    const res = await request(server)
      .post('/country/create')
      .send({ countryCode: 'B001', countryName: 'Country Central Asia' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'create called' });
  }, 10000);

  test('PUT /country/:oid should call controller.update and return 200', async () => {
    const res = await request(server)
      .put('/country/123')
      .send({ countryName: 'Updated Country' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'update called' });
  }, 10000);

  test('DELETE /country/delete/:oid should call controller.deleted and return 200', async () => {
    const res = await request(server)
      .delete('/country/delete/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'delete called' });
  }, 10000);

  test('GET /country should call controller.findAll and return 200', async () => {
    const res = await request(server).get('/country');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'findAll called' });
  }, 10000);

  test('POST /country/q should call controller.find and return 200', async () => {
    const res = await request(server)
      .post('/country/q')
      .send({ countryName: '' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'find called' });
  }, 10000);

  test('GET /country/:oid should call controller.findById and return 200', async () => {
    const res = await request(server).get('/country/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'findById called' });
  }, 10000);
});
