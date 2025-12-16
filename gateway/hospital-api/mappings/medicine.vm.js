async function toMedicineResponse(medicine) {
    const response = {
        oid: medicine.oid,
        categoryOid : medicine.categoryOid ,
        name: medicine.name,
        dosage: medicine.dosage,
        unit: medicine.unit,
        stock: medicine.stock,
        createdBy: medicine.createdBy,
        createdAt: medicine.createdAt,
        lastModifiedBy: medicine.lastModifiedBy,
        updatedAt: medicine.updatedAt
    };
    if (medicine.categoryOid ) {
        response.category = {
            oid: medicine.categoryOid ,
            categoryName: medicine.categoryName
        };
    }
    return response;
}

async function toMedicineResponses(medicines) {
    return await Promise.all(medicines.map(toMedicineResponse));
}

module.exports = {
    toMedicineResponse,
    toMedicineResponses
};
