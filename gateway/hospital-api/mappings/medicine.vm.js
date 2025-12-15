async function toMedicineResponse(medicine) {
    return {
        oid: medicine.oid,
        medicationOid: medicine.medicationOid,
        name: medicine.name,
        dosage: medicine.dosage,
        unit: medicine.unit,
        stock: medicine.stock,
        createdBy: medicine.createdBy,
        createdAt: medicine.createdAt,
        lastModifiedBy: medicine.lastModifiedBy,
        updatedAt: medicine.updatedAt
    };
}

async function toMedicineResponses(medicines) {
    return await Promise.all(medicines.map(toMedicineResponse));
}

module.exports = {
    toMedicineResponse,
    toMedicineResponses
};
