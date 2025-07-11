// Mapping functions
async function toLearningLevelResponse(learningLevel) {  
    const response = {
        oid: learningLevel.oid,
        levelName: learningLevel.levelName,
        type: learningLevel.type,
        createdBy: learningLevel.createdBy,
        updatedAt: learningLevel.updatedAt
    };
    return response;
}

async function toLearningLevelResponses(learningLevels) {
    const LearningLevelResponses = await Promise.all(learningLevels.map(toLearningLevelResponse));
    return LearningLevelResponses;
}

// Export everything
module.exports = {
    toLearningLevelResponse,
    toLearningLevelResponses
};
