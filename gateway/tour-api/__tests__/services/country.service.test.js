const countryRepository = require('../../repositories/country.repository');
const messageMaps = require('../../mappings/message.vm');
const countryService = require('../../services/country.service');
const sequelize = require('../../config/sequelize');
const moment = require('moment');

jest.mock('../../repositories/country.repository');
jest.mock('../../mappings/message.vm');
jest.mock('../../config/sequelize'); // Mock sequelize

describe('Country Service', () => {
  const mockData = { countryCode: 'IN', countryName: 'India', countryCurrency: 'INR' };
  const userOid = 'user-123';
  const mockCountry = { oid: '123', countryName: 'India', ...mockData };
  const expectedMsg = { value: '123', name: 'India' };

  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error to suppress the output
    sequelize.transaction.mockResolvedValue(mockTransaction); // Mock transaction
  });

  // **CREATE TESTS**
  describe('create', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockTransaction.commit.mockResolvedValue();
      mockTransaction.rollback.mockResolvedValue();
      sequelize.transaction.mockResolvedValue(mockTransaction);
      jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('should create a new country successfully', async () => {
      countryRepository.save.mockResolvedValue({ result: mockCountry, err: null });
      messageMaps.toMessageResponse.mockResolvedValue(expectedMsg);

      const { country, err } = await countryService.create(mockData, userOid);

      expect(country).toEqual(expectedMsg);
      expect(err).toBeNull();
      expect(countryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          countryCode: mockData.countryCode,
          countryName: mockData.countryName,
          countryCurrency: mockData.countryCurrency
        }),
        expect.objectContaining({ transaction: mockTransaction })
      );
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should handle repository save returning an error', async () => {
      const mockError = { message: 'Duplicate country', status: 400 };
      countryRepository.save.mockResolvedValue({ result: null, err: mockError });

      const { country, err } = await countryService.create(mockData, userOid);

      expect(country).toBeNull();
      expect(err).toEqual(mockError);
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should handle null result after save', async () => {
      countryRepository.save.mockResolvedValue({ result: null, err: null });

      const { country, err } = await countryService.create(mockData, userOid);

      expect(country).toBeNull();
      expect(err).toMatchObject({
        message: 'Internal server error',
        details: 'Transaction Failed',
        status: 500,
      });
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should handle error thrown during save', async () => {
      countryRepository.save.mockRejectedValue(new Error('DB Failure'));

      const { country, err } = await countryService.create(mockData, userOid);

      expect(country).toBeNull();
      expect(err).toMatchObject({
        message: 'Internal server error',
        details: 'DB Failure',
        status: 500,
      });
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Create failed:', expect.any(Error));
    });

    it('should handle transaction failure during create', async () => {
      // Simulate sequelize.transaction() succeeds, but save throws synchronously
      countryRepository.save.mockImplementation(() => {
        throw new Error('Transaction Failed');
      });

      const { country, err } = await countryService.create(mockData, userOid);

      expect(country).toBeNull();
      expect(err).toMatchObject({
        message: 'Internal server error',
        details: 'Transaction Failed',
        status: 500,
      });

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Create failed:', expect.any(Error));
    });

    it('should rollback and return internal error if exception is thrown after transaction starts', async () => {
      // Simulate transaction is successfully started
      sequelize.transaction.mockResolvedValue(mockTransaction);

      // Simulate an unhandled exception thrown inside try block
      countryRepository.save.mockImplementation(() => {
        throw new Error('Unexpected DB crash');
      });

      const { country, err } = await countryService.create(mockData, userOid);

      expect(country).toBeNull();
      expect(err).toEqual({
        message: 'Internal server error',
        details: 'Unexpected DB crash',
        status: 500,
      });

      expect(mockTransaction.rollback).toHaveBeenCalled(); // covers line 54
      expect(console.error).toHaveBeenCalledWith('Create failed:', expect.any(Error));
    });


    it('should catch error and rollback if transaction exists', async () => {
      // Arrange: force an error *after* transaction is created but before save
      sequelize.transaction.mockResolvedValue(mockTransaction);
      const fakeError = new Error('Unexpected failure');
      countryRepository.save.mockImplementation(() => {
        throw fakeError;
      });



      // Act
      const { country, err } = await countryService.create(mockData, userOid);

      // Assert
      expect(country).toBeNull();
      expect(err).toEqual({
        message: 'Internal server error',
        details: 'Unexpected failure',
        status: 500,
      });
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Create failed:', fakeError);
    });

    it('should return error if transaction creation itself fails', async () => {
      const fakeError = new Error('Sequelize init failed');
      sequelize.transaction.mockRejectedValue(fakeError); // <-- simulate failure to create transaction

      const { country, err } = await countryService.create(mockData, userOid);

      expect(country).toBeNull();
      expect(err).toEqual({
        message: 'Internal server error',
        details: 'Sequelize init failed',
        status: 500,
      });

      // Since transaction never started, rollback should NOT be called
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Create failed:', fakeError);
    });
    it('should return internal server error with fallback details if error has no message', async () => {
      // Arrange: force transaction to exist
      sequelize.transaction.mockResolvedValue(mockTransaction);

      // Simulate error with no `message` property
      const fakeError = {};
      countryRepository.save.mockImplementation(() => {
        throw fakeError;
      });

      // Act
      const { country, err } = await countryService.create(mockData, userOid);

      // Assert
      expect(country).toBeNull();
      expect(err).toEqual({
        message: 'Internal server error',
        details: 'Unknown error',
        status: 500,
      });
      expect(console.error).toHaveBeenCalledWith('Create failed:', fakeError);
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });


  });


  // // **UPDATE TESTS**
  // describe('Country Service - Update', () => {
  //   const mockUserOid = 'user-123';
  //   const mockCountryId = '123';
  //   const mockCountry = {
  //     oid: mockCountryId,
  //     countryCode: 'IN',
  //     countryName: 'India',
  //     countryCurrency: 'INR',
  //   };
  //   const updateData = { countryName: 'Updated Country', countryCode: 'UPD' };

  //   let mockTransaction;

  //   beforeEach(() => {
  //     // Clear all mocks before each test
  //     jest.clearAllMocks();

  //     // Mocking transaction object
  //     mockTransaction = {
  //       commit: jest.fn(),
  //       rollback: jest.fn(),
  //     };
  //     sequelize.transaction.mockResolvedValue(mockTransaction);
  //   });

  //   it('should update country successfully', async () => {
  //     // Mock repository methods
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.update.mockResolvedValue({ result: { ...mockCountry, ...updateData }, err: null });
  //     messageMaps.toMessageResponse.mockResolvedValue({ value: mockCountry.oid, name: 'Updated Country' });

  //     // Call the service method
  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, { useTransaction: true });

  //     // Assertions
  //     expect(country).toEqual({ value: mockCountry.oid, name: 'Updated Country' });
  //     expect(err).toBeNull();
  //     expect(countryRepository.findById).toHaveBeenCalledWith(mockCountryId, { transaction: mockTransaction });
  //     expect(countryRepository.update).toHaveBeenCalledWith(mockCountryId, expect.objectContaining(updateData), { transaction: mockTransaction });
  //     expect(mockTransaction.commit).toHaveBeenCalled();
  //   });

  //   it('should handle country not found during update', async () => {
  //     // Mock repository methods to simulate country not found
  //     countryRepository.findById.mockResolvedValue({ result: null, err: null });

  //     // Call the service method
  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, { useTransaction: true });

  //     // Assertions
  //     expect(country).toBeNull();
  //     expect(err).toEqual({ message: 'Country not found', status: 404 });
  //     expect(mockTransaction.rollback).toHaveBeenCalled();
  //   });

  //   it('should handle error during update', async () => {
  //     // Mock repository methods to simulate an error during update
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.update.mockRejectedValue(new Error('Update failed'));

  //     // Call the service method
  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, { useTransaction: true });

  //     // Assertions
  //     expect(country).toBeNull();
  //     expect(err).toEqual({
  //       message: 'Internal server error',
  //       details: 'Update failed',
  //       status: 500,
  //     });
  //     expect(mockTransaction.rollback).toHaveBeenCalled();
  //   });

  //   it('should handle findById returning an error', async () => {
  //     const findError = { message: 'Database error', status: 500 };

  //     countryRepository.findById.mockResolvedValue({ result: null, err: findError });

  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, { useTransaction: true });

  //     expect(country).toBeNull();
  //     expect(err).toEqual(findError);
  //     expect(mockTransaction.rollback).toHaveBeenCalled(); // Ensures line 81 is hit
  //   });

  //   it('should handle update returning an error object (not thrown)', async () => {
  //     const updateError = { message: 'Update conflict', status: 409 };

  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.update.mockResolvedValue({ result: null, err: updateError });

  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, { useTransaction: true });

  //     expect(country).toBeNull();
  //     expect(err).toEqual(updateError);
  //     expect(mockTransaction.rollback).toHaveBeenCalled(); // Ensures line 109 is hit
  //   });


  //   it('should rollback transaction if error occurs during findById', async () => {
  //     // Mock repository methods to simulate an error during findById
  //     countryRepository.findById.mockRejectedValue(new Error('Find operation failed'));

  //     // Call the service method
  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, { useTransaction: true });

  //     // Assertions
  //     expect(country).toBeNull();
  //     expect(err).toEqual({
  //       message: 'Internal server error',
  //       details: 'Find operation failed',
  //       status: 500,
  //     });
  //     expect(mockTransaction.rollback).toHaveBeenCalled();
  //   });

  //   it('should rollback transaction if no transaction is provided and error occurs', async () => {
  //     // Mock repository methods to simulate country found and error during update
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.update.mockRejectedValue(new Error('Update failed'));

  //     // Call the service method with a transaction
  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, { useTransaction: true });

  //     // Assertions
  //     expect(country).toBeNull();
  //     expect(err).toEqual({
  //       message: 'Internal server error',
  //       details: 'Update failed',
  //       status: 500,
  //     });
  //     expect(mockTransaction.rollback).toHaveBeenCalled();
  //   });

  //   it('should create a local transaction when useTransaction is true and no transaction is passed', async () => {
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.update.mockResolvedValue({ result: mockCountry, err: null });
  //     messageMaps.toMessageResponse.mockResolvedValue({ value: mockCountry.oid, name: 'Updated Country' });

  //     await countryService.update(mockCountryId, updateData, mockUserOid, { useTransaction: true });

  //     expect(sequelize.transaction).toHaveBeenCalled(); // ✅ Covers line 75
  //   });

  //   it('calls update to hit line 69', async () => {
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.update.mockResolvedValue({ result: mockCountry, err: null });
  //     messageMaps.toMessageResponse.mockResolvedValue({ value: mockCountry.oid, name: 'Updated Country' });

  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid);

  //     expect(country).toEqual({ value: mockCountry.oid, name: 'Updated Country' });
  //     expect(err).toBeNull();
  //   });

  //   it('should rollback localTransaction if findById returns an error', async () => {
  //     const findError = { message: 'DB failure', status: 500 };

  //     countryRepository.findById.mockResolvedValue({ result: null, err: findError });

  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, {
  //       useTransaction: true,
  //     });

  //     expect(country).toBeNull();
  //     expect(err).toEqual(findError);
  //     expect(mockTransaction.rollback).toHaveBeenCalled(); // hits line 90
  //   });

  //   it('should rollback if findById returns error and localTransaction is used (line 90)', async () => {
  //     const findError = { message: 'Simulated find error', status: 500 };

  //     sequelize.transaction.mockResolvedValue(mockTransaction);
  //     countryRepository.findById.mockResolvedValue({ result: null, err: findError });

  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, {
  //       useTransaction: true // Triggers localTransaction creation
  //       // No transaction passed explicitly
  //     });

  //     expect(sequelize.transaction).toHaveBeenCalled(); // line 75
  //     expect(mockTransaction.rollback).toHaveBeenCalled(); // line 90
  //     expect(country).toBeNull();
  //     expect(err).toEqual(findError);
  //   });


  //   it('should rollback and return error if findById returns an error with localTransaction', async () => {
  //     // Arrange: simulate a Sequelize transaction and find error
  //     const findError = { message: 'Find error', status: 500 };

  //     countryRepository.findById.mockResolvedValue({ result: null, err: findError });

  //     // Act: call update with useTransaction: true (to trigger localTransaction)
  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, {
  //       useTransaction: true,
  //     });

  //     // Assert: ensure rollback and correct return
  //     expect(sequelize.transaction).toHaveBeenCalled(); // ensures localTransaction was created
  //     expect(mockTransaction.rollback).toHaveBeenCalled(); // ensures rollback occurred
  //     expect(country).toBeNull();
  //     expect(err).toEqual(findError); // verifies exact error return
  //   });

  //   it('should rollback and return error if findById returns an error with localTransaction', async () => {
  //     const mockError = { message: 'DB error' };

  //     // Simulate transaction creation
  //     sequelize.transaction.mockResolvedValue(mockTransaction);

  //     // Simulate findById returning an error
  //     countryRepository.findById.mockResolvedValue({ result: null, err: mockError });

  //     const { country, err } = await countryService.update(
  //       mockCountryId,
  //       updateData,
  //       mockUserOid,
  //       { useTransaction: true } // triggers sequelize.transaction
  //     );

  //     expect(mockTransaction.rollback).toHaveBeenCalled(); // ensures line 91
  //     expect(country).toBeNull();
  //     expect(err).toEqual(mockError);
  //   });


  //   it('should rollback local transaction if findById returns an error (line 90)', async () => {
  //     const findError = { message: 'Simulated DB error', status: 500 };

  //     // Ensure this returns an error (to enter `if (findError)` block)
  //     countryRepository.findById.mockResolvedValue({
  //       result: null,
  //       err: findError,
  //     });

  //     // Call update WITHOUT passing a transaction so that localTransaction gets created
  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, {
  //       useTransaction: true, // Force local transaction path
  //     });

  //     // Assertions
  //     expect(country).toBeNull();
  //     expect(err).toEqual(findError);
  //     expect(sequelize.transaction).toHaveBeenCalled(); // Ensures line 75 executes
  //     expect(mockTransaction.rollback).toHaveBeenCalled(); // Ensures line 90 executes
  //   });


  //   it('should rollback localTransaction if findById returns an error (cover line 90)', async () => {
  //     const findError = { message: 'DB failure', status: 500 };

  //     countryRepository.findById.mockResolvedValue({ result: null, err: findError });

  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, {
  //       useTransaction: true, // required to trigger localTransaction
  //       // do NOT pass `transaction`
  //     });

  //     expect(country).toBeNull();
  //     expect(err).toEqual(findError);
  //     expect(mockTransaction.rollback).toHaveBeenCalled(); // ⬅️ This hits line 90
  //   });


  //   it('should start a local transaction if useTransaction is true and no transaction is provided', async () => {
  //     // Ensure sequelize.transaction creates a transaction
  //     sequelize.transaction.mockResolvedValue(mockTransaction);

  //     // Mock successful repo methods
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.update.mockResolvedValue({ result: { ...mockCountry, ...updateData }, err: null });
  //     messageMaps.toMessageResponse.mockResolvedValue({ value: mockCountry.oid, name: 'Updated Country' });

  //     // Do not pass transaction explicitly
  //     const { country, err } = await countryService.update(mockCountryId, updateData, mockUserOid, { useTransaction: true });

  //     expect(country).toEqual({ value: mockCountry.oid, name: 'Updated Country' });
  //     expect(err).toBeNull();

  //     // ✅ Covers line 69
  //     expect(sequelize.transaction).toHaveBeenCalled();

  //     // ✅ Confirms it's used as the transaction
  //     expect(countryRepository.findById).toHaveBeenCalledWith(mockCountryId, { transaction: mockTransaction });
  //     expect(countryRepository.update).toHaveBeenCalledWith(mockCountryId, expect.any(Object), { transaction: mockTransaction });
  //   });

  // });

  // // **DELETE TESTS**
  // describe('deleted', () => {
  //   it('should handle country not found during delete', async () => {
  //     countryRepository.findById.mockResolvedValue({ result: null, err: null });

  //     const { country, err } = await countryService.deleted('123');

  //     expect(country).toBeNull();
  //     expect(err).toMatchObject({
  //       message: 'Data Not Found',
  //       status: 404,
  //     });
  //   });

  //   it('should delete a country successfully', async () => {
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.deleted.mockResolvedValue({ result: mockCountry, err: null });
  //     messageMaps.toMessageResponse.mockResolvedValue(expectedMsg);

  //     const { country, err } = await countryService.deleted('123');

  //     expect(country).toEqual(expectedMsg);
  //     expect(err).toBeNull();
  //     expect(countryRepository.deleted).toHaveBeenCalledWith('123', mockTransaction);
  //     expect(mockTransaction.commit).toHaveBeenCalled();
  //   });

  //   it('should handle error during findById in delete', async () => {
  //     countryRepository.findById.mockRejectedValue(new Error('DB error'));

  //     const { country, err } = await countryService.deleted('123');

  //     expect(country).toBeNull();
  //     expect(err).toMatchObject({
  //       message: 'Internal server error',
  //       details: 'DB error',
  //       status: 500,
  //     });
  //     expect(mockTransaction.rollback).toHaveBeenCalled();
  //   });


  //   it('should handle error during delete', async () => {
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.deleted.mockRejectedValue(new Error('Delete failed'));

  //     const { country, err } = await countryService.deleted('123');

  //     expect(country).toBeNull();
  //     expect(err).toMatchObject({
  //       message: 'Internal server error',
  //       details: 'Delete failed',
  //       status: 500,
  //     });
  //     expect(mockTransaction.rollback).toHaveBeenCalled();
  //   });

  //   it('should handle repository.deleted returning an error object', async () => {
  //     const deleteError = { message: 'Delete conflict', status: 409 };
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });
  //     countryRepository.deleted.mockResolvedValue({ result: null, err: deleteError });

  //     const { country, err } = await countryService.deleted('123');

  //     expect(country).toBeNull();
  //     expect(err).toEqual(deleteError);
  //     expect(mockTransaction.rollback).toHaveBeenCalled(); // Ensures lines 153–154 are covered
  //   });

  // });

  // // **FINDALL TESTS**
  // describe('findAll', () => {
  //   it('should return all countries successfully', async () => {
  //     const mockCountries = [mockCountry];
  //     countryRepository.findAll.mockResolvedValue({ result: mockCountries, err: null });

  //     const { countries, err } = await countryService.findAll();

  //     expect(countries).toEqual(mockCountries);
  //     expect(err).toBeNull();
  //     expect(countryRepository.findAll).toHaveBeenCalled();
  //   });

  //   it('should handle error during findAll', async () => {
  //     countryRepository.findAll.mockRejectedValue(new Error('Database error'));

  //     const { countries, err } = await countryService.findAll();

  //     expect(countries).toEqual([]);
  //     expect(err).toMatchObject({
  //       message: 'Internal server error',
  //       details: 'Database error',
  //       status: 500,
  //     });
  //   });
  // });

  // // **FINDBYID TESTS**
  // describe('findById', () => {
  //   it('should return country by id successfully', async () => {
  //     countryRepository.findById.mockResolvedValue({ result: mockCountry, err: null });

  //     const { country, err } = await countryService.findById('123');

  //     expect(country).toEqual(mockCountry);
  //     expect(err).toBeNull();
  //   });

  //   it('should return error if country not found by id', async () => {
  //     countryRepository.findById.mockResolvedValue({ result: null, err: null });

  //     const { country, err } = await countryService.findById('123');

  //     expect(country).toBeNull(); // FIXED
  //     expect(err).toMatchObject({
  //       message: 'Data Not Found',
  //       status: 404,
  //     });
  //   });

  //   it('should handle error during findById', async () => {
  //     countryRepository.findById.mockRejectedValue(new Error('Database error'));

  //     const { country, err } = await countryService.findById('123');

  //     expect(country).toBeNull(); // FIXED
  //     expect(err).toMatchObject({
  //       message: 'Internal server error',
  //       details: 'Database error',
  //       status: 500,
  //     });
  //   });

  //   it('should handle error object returned from repository.findById', async () => {
  //     const fakeErr = { message: 'Repository failure' };
  //     countryRepository.findById.mockResolvedValue({ result: null, err: fakeErr });

  //     const { country, err } = await countryService.findById('123');

  //     expect(country).toBeNull();
  //     expect(err).toEqual({
  //       message: 'Internal server error',
  //       details: 'Repository failure',
  //       status: 500,
  //     });
  //   });

  // });


  // // **FINDPAGE TESTS**
  // it('should return countries and count on success in findPage', async () => {
  //   const mockCountries = [mockCountry];
  //   countryRepository.findAndCountAll = jest.fn().mockResolvedValue({
  //     countries: mockCountries,
  //     count: 1,
  //     err: null
  //   });

  //   const { countries, count, err } = await countryService.findPage({}, {});

  //   expect(countries).toEqual(mockCountries);
  //   expect(count).toBe(1);
  //   expect(err).toBeNull();
  // });

  // it('should handle error during findPage', async () => {
  //   const filters = {};
  //   const options = { offset: 0, limit: 10 };
  //   countryRepository.findAndCountAll.mockRejectedValue(new Error('Database error'));

  //   const { countries, count, err } = await countryService.findPage(filters, options);

  //   expect(countries).toEqual([]);
  //   expect(count).toBe(0);
  //   expect(err).toMatchObject({
  //     message: 'Internal server error',
  //     details: 'Database error',
  //     status: 500,
  //   });
  // });


});
