const roomRepository = require('../repositories/room.repository');
const mappings = require('../mappings/room.vm');
const messageMaps = require('../mappings/message.vm');
const pool = require('../database/database');
const { uuidv7 } = require("uuidv7");
const { withTransaction } = require("../helper/transaction");
const moment = require('moment');

const create = async (dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const data = {
      oid: uuidv7(),
      roomNumber: dto.roomNumber,
      type: dto.type,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (conn, data) => roomRepository.save(data, { transaction: conn });
    const funcs = [async (conn) => saveFunction(conn, data)];
    const { result, err } = await withTransaction(funcs, connection, data);

    if (err) return { room: null, err };
    const msgData = { value: data.oid, name: `Room ${data.roomNumber}` };
    const room = await messageMaps.toMessageResponse(msgData);
    return { room, err: null };

  } catch (err) {
    return { room: null, err: { httpStatus: 500 } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await roomRepository.findById(oid, connection);
    if (err) return { room: null, err };
    if (!findResult) return { room: null, err: { httpStatus: 404 } };

    findResult.roomNumber = dto.roomNumber ?? findResult.roomNumber;
    findResult.type = dto.type ?? findResult.type;
    findResult.description = dto.description ?? findResult.description;
    findResult.lastModifiedBy = userOid;
    findResult.updatedAt = now;

    const updateFunction = async (conn, data) => roomRepository.update(oid, data, { transaction: conn });
    const funcs = [async (conn) => updateFunction(conn, findResult)];
    const { result, err: errUpdate } = await withTransaction(funcs, connection, findResult);

    if (errUpdate) return { room: null, err: errUpdate };
    const msgData = { value: result.oid, name: `Room ${result.roomNumber}` };
    const room = await messageMaps.toMessageResponse(msgData);
    return { room, err: null };

  } catch (err) {
    return { room: null, err: { httpStatus: 500 } };
  }
};

const deleted = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { result: findResult, err } = await roomRepository.findById(oid, connection);
    if (err) return { room: null, err };
    if (!findResult) return { room: null, err: { httpStatus: 404 } };

    const deleteFunction = async (conn) => roomRepository.deleted(oid, { transaction: conn });
    const funcs = [async (conn) => deleteFunction(conn)];
    const { result, err: errDelete } = await withTransaction(funcs, connection, findResult);

    if (errDelete) return { room: null, err: errDelete };
    const msgData = { value: findResult.oid, name: `Room ${findResult.roomNumber}` };
    const room = await messageMaps.toMessageResponse(msgData);
    return { room, err: null };

  } catch (err) {
    return { room: null, err: { httpStatus: 500 } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await roomRepository.findAll(connection);
    if (err) return { rooms: [], err };
    const rooms = await mappings.toRoomResponses(result);
    return { rooms, err: null };
  } catch (err) {
    return { rooms: [], err: { httpStatus: 500 } };
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await roomRepository.findById(oid, connection);
    if (err) return { room: null, err };
    if (!result) return { room: null, err: { httpStatus: 404 } };
    const room = await mappings.toRoomResponse(result);
    return { room, err: null };
  } catch (err) {
    return { room: null, err: { httpStatus: 500 } };
  }
};

const findPage = async (condition, page, pageSize) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await roomRepository.findCountByCriteria(condition, connection);
    if (errCount) return { rooms: [], count: 0, err: errCount };
    const { result, err } = await roomRepository.findByCriteria(condition, page, pageSize, connection);
    if (err) return { rooms: [], count: 0, err };
    const rooms = await mappings.toRoomResponses(result);
    return { rooms, count, err: null };
  } catch (err) {
    return { rooms: [], count: 0, err: { httpStatus: 500 } };
  }
};

module.exports = {
  create,
  update,
  deleted,
  findAll,
  findById,
  findPage,
};
