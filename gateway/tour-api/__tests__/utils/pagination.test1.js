const { getPagination, getPagingData, paginate } = require('../../misc/pagination');

describe('Pagination Utils', () => {
    describe('getPagination', () => {
        it('should return correct limit and offset for page and size', () => {
            const { limit, offset } = getPagination(2, 5);
            expect(limit).toBe(5);
            expect(offset).toBe(5);
        });

        it('should use default values if page or size is undefined', () => {
            const { limit, offset } = getPagination();
            expect(limit).toBe(10);
            expect(offset).toBe(0);
        });
    });

    describe('getPagingData', () => {
        it('should calculate pagination metadata correctly', () => {
            const data = {
                count: 25,
                rows: Array(10).fill({ name: 'Test Country' })
            };
            const result = getPagingData(data, 2, 10);

            expect(result.pagination.totalItems).toBe(25);
            expect(result.pagination.currentPage).toBe(2);
            expect(result.pagination.totalPages).toBe(3);
            expect(result.items.length).toBe(10);
        });

        it('should handle missing limit and page gracefully', () => {
            const result = getPagingData({ count: 10, rows: [] });
            expect(result.pagination.totalPages).toBe(1);
            expect(result.pagination.currentPage).toBe(1);
        });
    });

    describe('paginate', () => {
        const mockModel = {
            findAndCountAll: jest.fn()
        };

        beforeEach(() => {
            mockModel.findAndCountAll.mockClear();
        });

        it('should apply pagination and sorting', async () => {
            mockModel.findAndCountAll.mockResolvedValue({ count: 1, rows: [] });

            await paginate(mockModel, { name: 'X' }, 1, 10, { sortBy: 'name:asc' });

            expect(mockModel.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
                where: { name: 'X' },
                offset: 0,
                limit: 10,
                order: [['name', 'asc']],
                distinct: true
            }));
        });

        it('should skip pagination if limit is -1', async () => {
            mockModel.findAndCountAll.mockResolvedValue({ count: 2, rows: [] });

            await paginate(mockModel, {}, 1, 10, { limit: -1 });

            expect(mockModel.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
                limit: null,  // was -1 before
                offset: null,
                distinct: true
            }));
        });
    });
});
