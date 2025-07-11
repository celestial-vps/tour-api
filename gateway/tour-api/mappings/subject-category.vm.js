// Mapping functions
async function toSubjectCategoryResponse(subjectCategory) {  
    const response = {
        oid: subjectCategory.oid,
        categoryName: subjectCategory.categoryName,
        createdBy: subjectCategory.createdBy,
        updatedAt: subjectCategory.updatedAt
    };
    return response;
}

async function toSubjectCategoryResponses(subjectCategories) {
    const SubjectCategoryResponses = await Promise.all(subjectCategories.map(toSubjectCategoryResponse));
    return SubjectCategoryResponses;
}

// Export everything
module.exports = {
    toSubjectCategoryResponse,
    toSubjectCategoryResponses
};
