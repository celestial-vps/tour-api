async function toPrescriptionResponse(prescription) {
    return {
        oid: prescription.oid,
        patientOid: prescription.patientOid,
        doctorOid: prescription.doctorOid,
        medicineOid: prescription.medicineOid,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        duration: prescription.duration,
        notes: prescription.notes,
        createdAt: prescription.createdAt,
        updatedAt: prescription.updatedAt
    };
}

async function toPrescriptionResponses(prescriptions) {
    return await Promise.all(prescriptions.map(toPrescriptionResponse));
}

module.exports = {
    toPrescriptionResponse,
    toPrescriptionResponses
};
