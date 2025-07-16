const axios = require('axios');
const FormData = require('form-data');
const CircuitBreaker = require('opossum');

// ========== ORIGINAL FUNCTION (untuk dibungkus) ==========
async function fetchImageFile(oid) {
    const response = await axios.get(`http://localhost:3003/api/v1/image-file/${oid}/view`);
    return response;
}

// ========== CIRCUIT BREAKER CONFIG ==========
const breakerOptions = {
    timeout: 5000, // maksimal 5 detik tunggu response
    errorThresholdPercentage: 50, // jika 50% request gagal, circuit terbuka
    resetTimeout: 10000 // setelah 10 detik, coba lagi
};

// Bungkus fungsi get image dengan circuit breaker
const breaker = new CircuitBreaker(fetchImageFile, breakerOptions);

// Logging status circuit (opsional, sangat berguna di dev)
breaker.on('open', () => console.warn('[CircuitBreaker] OPEN: image service down'));
breaker.on('halfOpen', () => console.log('[CircuitBreaker] HALF-OPEN: testing image service'));
breaker.on('close', () => console.log('[CircuitBreaker] CLOSED: image service recovered'));

// Fallback jika gagal — misalnya, kembalikan URL gambar default
breaker.fallback((oid) => {
    return {
        data: {
            data: {
                fileUrl: `https://your-cdn.com/images/default.png`,
                fallback: true,
                reason: 'Image service unavailable'
            }
        }
    };
});

// ========== FINAL FUNCTION: Dipakai oleh brand-service ==========
async function getImageFile(oid) {
    return await breaker.fire(oid);
}

// ========== UPLOAD IMAGE (tidak diubah) ==========
async function uploadFileToMicroservice(file) {
    try {
        const form = new FormData();
        form.append('image', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        const response = await axios.post('http://localhost:3003/api/v1/image-file/upload', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        // @ts-ignore
        return response.data;
    } catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
        throw error;
    }
}

// ========== EXPORTS ==========
module.exports = {
    uploadFileToMicroservice,
    getImageFile
};
