// ✅ 1. MOCK country.service BEFORE importing app
jest.mock('../../services/country.service');
const countryService = require('../../services/country.service');

// ✅ 2. MOCK role-guard middleware BEFORE importing app
jest.mock('../../middleware/role-guard', () => ({
    roleGuard: jest.fn((requiredRole) => (req, res, next) => {
        req.authorization_payload = {
            userOid: 'mock-user-oid',
            role: requiredRole
        };
        next();
    })
}));

// ✅ 3. IMPORT app AFTER mocks
const request = require('supertest');
const app = require('../../app');

describe('POST /country/create', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a country successfully with valid data', async () => {
        const validData = {
            countryCode: 'B001',
            countryName: 'Country Central Asia',
            countryCurrency: 'USD'
        };

        countryService.create.mockResolvedValue({
            country: {
                oid: 'mock-oid',
                ...validData
            },
            err: null
        });

        const response = await request(app)
            .post('/api/v1/country/create')
            .set('Authorization', 'Bearer dummy-token')
            .send(validData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('success');
        expect(response.body.data.countryName).toBe('Country Central Asia');
    });

    it('should return 400 if the request data is invalid', async () => {
        const invalidData = {
            countryCode: 'B001' // Missing name and currency
        };

        countryService.create.mockResolvedValue({
            country: null,
            err: new Error('Validation error')
        });

        const response = await request(app)
            .post('/api/v1/country/create')
            .set('Authorization', 'Bearer dummy-token')
            .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation error');
    });
});
