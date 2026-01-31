async function toDoctorResponse(doctor) {
    const response = {
        oid: doctor.oid,
        userOid: doctor.userOid,
        specializationOid: doctor.specializationOid,
        phone: doctor.phone,
        createdBy: doctor.createdBy,
        createdAt: doctor.createdAt,
        lastModifiedBy: doctor.lastModifiedBy,
        updatedAt: doctor.updatedAt
    };

    if (doctor.specializationOid) {
        response.specialization = {
            oid: doctor.specializationOid,
            specializationName: doctor.specializationName
        };
    }
    return response;
}

async function toDoctorResponses(doctors) {
    return await Promise.all(doctors.map(toDoctorResponse));
}

module.exports = {
    toDoctorResponse,
    toDoctorResponses
};
