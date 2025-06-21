const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadFileToMicroservice(file) {
    try {
        const form = new FormData();
        form.append('image', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        // @ts-ignore
        const response = await axios.post('http://localhost:3003/api/v1/image-file/upload', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        return response.data;
    } catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
        throw error;
    }
}

async function getImageFile(oid) {
    try {
        // @ts-ignore
        // const response = await axios.get('http://localhost:3003/api/v1/image-file/45c743e5-cc9a-44a5-9402-3faf99966f8f/view', {
        //     responseType: 'stream', // supaya bisa handle file/binary
        // });

        const response = await axios.get(`http://localhost:3003/api/v1/image-file/${oid}/view`);
        return response;

    } catch (error) {
        console.error('Gagal mengunduh file:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = { uploadFileToMicroservice, getImageFile };
