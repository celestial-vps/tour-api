// Mapping functions
async function toImageFileResponse(imageFile) {
    const response = {
        oid: imageFile.oid,
        fileUrl: imageFile.fileUrl,
        fileName: imageFile.fileName,
        filePath: imageFile.filePath,
        fileUrl: imageFile.fileUrl,
        fileMime: imageFile.fileMime,
        fileSize: imageFile.fileSize,
        imageWidth: imageFile.imageWidth,
        imageHeight: imageFile.imageHeight,
        storageType: imageFile.storageType,
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
