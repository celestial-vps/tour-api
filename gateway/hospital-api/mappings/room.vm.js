async function toRoomResponse(room) {
    const response = {
        oid: room.oid,
        name: room.name,
        departementOid: room.departementOid,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
    };
    if (room.departementOid ) {
        response.departement = {
            oid: room.departementOid,
            departementName: room.departementName
        };
    }
    return response;
}

async function toRoomResponses(rooms) {
    return await Promise.all(rooms.map(toRoomResponse));
}

module.exports = {
    toRoomResponse,
    toRoomResponses
};
