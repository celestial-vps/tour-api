const {
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  releaseConnection
} = require('./transactionHelper'); // Adjust the path as needed

/**
* Manages a transaction for multiple functions.
* @param {Function[]} funcs - Array of functions to execute within the transaction.
* @param {Object} connection - The database connection.
* @param {...*} args - Arguments to pass to each function.
* @returns {Promise<{ result: *, err: Error }>} - Result and error.
*/
const withTransaction = async (funcs, connection, ...args) => {
  try {
      await beginTransaction(connection); // Start transaction

      for (const func of funcs) {
          const { result, err } = await func(connection, ...args); // Execute each function

          if (err) {
              await rollbackTransaction(connection); // Rollback on error
              return { result: null, err };
          }
      }

      await commitTransaction(connection); // Commit transaction
      return { result: true, err: null }; // Indicate success
  } catch (err) {
      if (connection) {
          try {
              await rollbackTransaction(connection); // Rollback on exception
          } catch (rollbackErr) {
              console.error('Error rolling back transaction:', rollbackErr.message);
          }
      }
      return { result: null, err };
  } finally {
      if (connection) {
          try {
              await releaseConnection(connection); // Release connection
          } catch (releaseErr) {
              console.error('Error releasing connection:', releaseErr.message);
          }
      }
  }
};

module.exports = {
  withTransaction
};
