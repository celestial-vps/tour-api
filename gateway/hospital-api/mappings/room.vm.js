async function toRoomResponse(room) {
    return {
        oid: room.oid,
        name: room.name,
        floor: room.floor,
        type: room.type,
        description: room.description,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
    };
}

async function toRoomResponses(rooms) {
    return await Promise.all(rooms.map(toRoomResponse));
}

module.exports = {
    toRoomResponse,
    toRoomResponses
};
