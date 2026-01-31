 // Mapping functions
async function toImageFileResponse(imageFile) {
    const response = {
        oid: imageFile._id,
        fileUrl: imageFile.fileUrl,
        fileName: imageFile.fileName,
        createdAt: imageFile.createdAt,
        updatedAt: imageFile.updatedAt
    };
    return response;
}

async function toImageFileResponses(imageFiles) {
    const imageFileResponses = await Promise.all(imageFiles.map(toImageFileResponse));
    return imageFileResponses;
}

// Export everything
module.exports = {
    toImageFileResponse,
    toImageFileResponses
};