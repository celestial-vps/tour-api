// const httpMocks = require('node-mocks-http');
// const countryController = require('../../controllers/country.controller');
// const countryService = require('../../services/country.service');
// const buildResponse = require('../../common/build.response');

// jest.mock('../../services/country.service');
// jest.mock('../../common/build.response');

// describe('Country Controller - create', () => {
//   it('should respond 201 with country data on success', async () => {
//     const req = httpMocks.createRequest({
//       body: { countryCode: 'ID', countryName: 'Indonesia', countryCurrency: 'IDR' },
//       authorization_payload: { userOid: 'some-user-id' },
//     });
//     const res = httpMocks.createResponse();

//     countryService.create.mockResolvedValue({ country: { countryCode: 'ID' }, err: null });
//     buildResponse.responseOk.mockReturnValue({ data: 'ok' });

//     await countryController.create(req, res);

//     expect(res.statusCode).toBe(201);
//     expect(res._getJSONData()).toEqual({ data: 'ok' });
//   });

//   it('should respond 400 when service returns error', async () => {
//     const req = httpMocks.createRequest({ body: {}, authorization_payload: {} });
//     const res = httpMocks.createResponse();

//     countryService.create.mockResolvedValue({ country: null, err: new Error('Invalid input') });
//     buildResponse.responseErrorInserted.mockReturnValue({ error: 'Invalid input' });

//     await countryController.create(req, res);

//     expect(res.statusCode).toBe(400);
//     expect(res._getJSONData()).toEqual({ error: 'Invalid input' });
//   });
// });
