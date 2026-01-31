async function toMedicationCategoryResponse(category) {
    return {
        oid: category.oid,
        name: category.name, 
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
    };
}

async function toMedicationCategoryResponses(categories) {
    return await Promise.all(categories.map(toMedicationCategoryResponse));
}

module.exports = {
    toMedicationCategoryResponse,
    toMedicationCategoryResponses
};
