// transactionHelper.js
const beginTransaction = async (connection) => {
    await connection.beginTransaction();
  };
  
  const commitTransaction = async (connection) => {
    await connection.commit();
  };
  
  const rollbackTransaction = async (connection) => {
    await connection.rollback();
  };
  
  const releaseConnection = async (connection) => {
    await connection.release();
  };
  
  module.exports = {
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
    releaseConnection
  };
  