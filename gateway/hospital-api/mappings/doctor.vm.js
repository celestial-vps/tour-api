async function toDoctorResponse(doctor) {
    return {
        oid: doctor.oid,
        userOid: doctor.userOid,
        specializationOid: doctor.specializationOid,
        phone: doctor.phone,
        createdBy: doctor.createdBy,
        createdAt: doctor.createdAt,
        lastModifiedBy: doctor.lastModifiedBy,
        updatedAt: doctor.updatedAt
    };
}

async function toDoctorResponses(doctors) {
    return await Promise.all(doctors.map(toDoctorResponse));
}

module.exports = {
    toDoctorResponse,
    toDoctorResponses
};
