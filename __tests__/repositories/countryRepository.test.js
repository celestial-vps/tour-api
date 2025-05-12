const countryRepo = require('../../repositories/country.repository');

jest.mock('@models/country', () => ({
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    count: jest.fn(),
}));

jest.mock('../../misc/pagination', () => ({
    paginate: jest.fn()
}));

const Country = require('../../models/country');
const { paginate } = require('../../misc/pagination');

describe('Country Repository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should save a new country', async () => {
        Country.create.mockResolvedValue({ countryName: 'TestLand' });
        const { result, err } = await countryRepo.save({ countryName: 'TestLand' });
        expect(result).toBeTruthy();
        expect(err).toBeNull();
    });

    it('should handle error on save', async () => {
        Country.create.mockRejectedValueOnce(new Error('DB Error'));
        const { result, err } = await countryRepo.save({ countryName: 'X' });
        expect(result).toBeNull();
        expect(err).toBeTruthy();
    });

    // it('should handle error when required field is missing in save', async () => {
    //     const { result, err } = await countryRepo.save({});
    //     expect(result).toBeNull();
    //     expect(err).toBeTruthy();
    // });

    it('should update a country', async () => {
        Country.update.mockResolvedValue([1]);
        const { result, err } = await countryRepo.update('id', {});
        expect(result).toEqual([1]);
        expect(err).toBeNull();
    });

    it('should handle error on update', async () => {
        Country.update.mockRejectedValueOnce(new Error('DB Error'));
        const { result, err } = await countryRepo.update('id', {});
        expect(result).toBeNull();
        expect(err).toBeTruthy();
    });

    it('should delete a country (non-zero result)', async () => {
        Country.destroy.mockResolvedValueOnce(1); // ✅ Simulate success
        const { result, err } = await countryRepo.deleted('id');
        expect(result).toBe(1);
        expect(err).toBeNull();
    });

    it('should handle failed delete (zero result)', async () => {
        Country.destroy.mockResolvedValueOnce(0);
        const { result, err } = await countryRepo.deleted('id');
        expect(result).toBeNull();
        expect(err).toHaveProperty('message', 'Failed to delete record');
    });

    it('should handle error on delete', async () => {
        Country.destroy.mockRejectedValueOnce(new Error('DB Error'));
        const { result, err } = await countryRepo.deleted('id');
        expect(result).toBeNull();
        expect(err).toBeTruthy();
    });

    it('should handle unexpected negative result from delete', async () => {
        Country.destroy.mockResolvedValueOnce(-1); // simulate weird Sequelize behavior
        const { result, err } = await countryRepo.deleted('id');
        expect(result).toBe(null); // -1 is treated as failure
        expect(err).toHaveProperty('message', 'Failed to delete record');
    });

    it('should handle error without message in delete', async () => {
        Country.destroy.mockRejectedValueOnce({}); // error with no .message
        const { result, err } = await countryRepo.deleted('id');
        expect(result).toBeNull();
        expect(err).toBe('[object Object]'); // because String({}) === '[object Object]'
    });

    it('should delete a country successfully when result > 0', async () => {
        Country.destroy.mockResolvedValueOnce(1);
        const { result, err } = await countryRepo.deleted('some-id');
        expect(result).toBe(1);
        expect(err).toBe(null);
    });

    it('should handle error when returning all countries', async () => {
        Country.findAll.mockRejectedValueOnce(new Error('FindAll Error'));
        const { result, err } = await countryRepo.findAll();
        expect(result).toBeNull();
        expect(err).toBeTruthy();
        expect(err.message).toBe('FindAll Error');
    });

    it('should return all countries', async () => {
        Country.findAll.mockResolvedValue([{ countryName: 'Spain' }]);
        const { result, err } = await countryRepo.findAll();
        expect(result).toHaveLength(1);
        expect(err).toBeNull();
    });

    it('should return country by id', async () => {
        Country.findByPk.mockResolvedValue({ oid: 'id123', countryName: 'Mexico' });
        const { result, err } = await countryRepo.findById('id123');
        expect(result).toBeTruthy();
        expect(result.countryName).toBe('Mexico');
        expect(err).toBeNull();
    });

    it('should handle error in findById', async () => {
        Country.findByPk.mockRejectedValueOnce(new Error('findByPk error'));
        const { result, err } = await countryRepo.findById('some-id');
        expect(result).toBeNull();
        expect(err).toBeTruthy();
    });

    it('should return results from advanceFlter', async () => {
        Country.findAll.mockResolvedValue([{ countryName: 'India' }]);
        const { result, err } = await countryRepo.advanceFlter();
        expect(result).toHaveLength(1);
        expect(result[0].countryName).toBe('India');
        expect(err).toBeNull();
    });

    it('should handle error in advanceFlter', async () => {
        Country.findAll.mockRejectedValueOnce(new Error('Advanced filter failed'));
        const { result, err } = await countryRepo.advanceFlter();
        expect(result).toBeNull();
        expect(err).toBeTruthy();
    });

    it('should return filtered countries with pagination', async () => {
        Country.findAll.mockResolvedValue([{ countryName: 'Japan' }]);
        const { countries, error } = await countryRepo.findByCriteria({}, 1, 10);
        expect(countries.length).toBeGreaterThan(0);
        expect(error).toBeNull();
    });

    it('should return filtered countries with default pagination', async () => {
        Country.findAll.mockResolvedValue([{ countryName: 'Greece' }]);
        const { countries, error } = await countryRepo.findByCriteria(); // ← using no args
        expect(Country.findAll).toHaveBeenCalledWith({
            where: {},
            limit: 10,
            offset: 0,
            order: [['countryName', 'ASC']],
        });
        expect(countries).toEqual([{ countryName: 'Greece' }]);
        expect(error).toBeNull();
    });



    it('should handle error in findByCriteria', async () => {
        Country.findAll.mockRejectedValueOnce(new Error('Query Error'));
        const { countries, error } = await countryRepo.findByCriteria({}, 1, 10);
        expect(countries).toEqual([]);
        expect(error).toBeTruthy();
    });

    it('should count countries by criteria successfully', async () => {
        Country.count.mockResolvedValue(5);
        const { count, error } = await countryRepo.findCountByCriteria({});
        expect(count).toBe(5);
        expect(error).toBeNull();
    });

    it('should handle error in findCountByCriteria', async () => {
        Country.count.mockRejectedValueOnce(new Error('DB Error'));
        const { count, error } = await countryRepo.findCountByCriteria({});
        expect(count).toBe(0);
        expect(error).toBeTruthy();
        expect(error.message).toBe('DB Error');
    });

    it('should handle error in findCountByCriteria without message', async () => {
        const fakeError = {}; // No message property
        Country.count.mockRejectedValueOnce(fakeError);

        const { count, error } = await countryRepo.findCountByCriteria({});
        expect(count).toBe(0);
        expect(error).toEqual(fakeError);
    });

    it('should call findCountByCriteria with no argument to hit default param', async () => {
        Country.count.mockResolvedValue(5);
        const result = await countryRepo.findCountByCriteria(); // ✅ FIXED HERE
        expect(Country.count).toHaveBeenCalledWith({ where: {} });
        expect(result).toEqual({ count: 5, error: null });
    });

    it('should return paginated and counted countries', async () => {
        paginate.mockResolvedValue({ rows: [{ countryName: 'Italy' }], count: 1 });
        const { countries, count, err } = await countryRepo.findAndCountAll({}, { pageIndex: 1, pageSize: 10 });
        expect(countries).toHaveLength(1);
        expect(count).toBe(1);
        expect(err).toBeNull();
    });

    it('should handle error in findAndCountAll', async () => {
        paginate.mockRejectedValueOnce(new Error('Pagination error'));
        const { countries, count, err } = await countryRepo.findAndCountAll({}, { pageIndex: 1, pageSize: 10 });
        expect(countries).toEqual([]);
        expect(count).toBe(0);
        expect(err).toBeTruthy();
    });
});
