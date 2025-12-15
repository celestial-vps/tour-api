async function toMedicalCategoryResponse(category) {
    return {
        oid: category.oid,
        name: category.name,
        description: category.description,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
    };
}

async function toMedicalCategoryResponses(categories) {
    return await Promise.all(categories.map(toMedicalCategoryResponse));
}

module.exports = {
    toMedicalCategoryResponse,
    toMedicalCategoryResponses
};
