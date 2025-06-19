const Redis = require('ioredis');

class GeoCacheProvinceService {
    constructor() {
        // @ts-ignore
        this.redisClient = new Redis(); // Sesuaikan konfigurasi jika perlu
        this.redisKey = 'geo:provinces';
    }

    /**
     * Insert atau update province di Redis
     * @param {{ id: string, name: string }} province
     */
    async upsertProvince(province) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const provinces = data ? JSON.parse(data) : [];

            const index = provinces.findIndex(c => c.id === province.id);

            if (index !== -1) {
                provinces[index] = province;
            } else {
                provinces.push(province);
            }

            await this.redisClient.set(this.redisKey, JSON.stringify(provinces));
        } catch (err) {
            console.error('Redis error (upsertProvince):', err);
            throw err;
        }
    }

    /**
     * Get all provinces from Redis
     * @returns {Promise<Array<{ oid: string, provinceName: string }>>}
     */
    async getProvinces() {
        try {
            console.log('Looking up Redis key:', this.redisKey);
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.error('Redis error (getProvinces):', err);
            return [];
        }
    }

    /**
     * Delete a province by ID
     * @param {string} id
     */
    async deleteProvince(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            let provinces = data ? JSON.parse(data) : [];

            provinces = provinces.filter(c => c.id !== id);

            await this.redisClient.set(this.redisKey, JSON.stringify(provinces));
        } catch (err) {
            console.error('Redis error (deleteProvince):', err);
            throw err;
        }
    }

    /**
     * Clear all provinces from Redis
     */
    async clearProvinces() {
        try {
            await this.redisClient.del(this.redisKey);
        } catch (err) {
            console.error('Redis error (clearProvinces):', err);
            throw err;
        }
    }

    async getAllProvinces() {
        try {
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.error('Redis error (getAllProvinces):', err);
            return [];
        }
    }

    async getProvinceById(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const provinces = data ? JSON.parse(data) : [];
            return provinces.find(c => c.id === id) || null;
        } catch (err) {
            console.error('Redis error (getProvinceById):', err);
            return null;
        }
    }

    async searchProvincesByName(name) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const provinces = data ? JSON.parse(data) : [];
            const lowerName = name.toLowerCase();
            return provinces.filter(c => c.provinceName.toLowerCase().includes(lowerName));
        } catch (err) {
            console.error('Redis error (searchProvincesByName):', err);
            return [];
        }
    }
}

module.exports = GeoCacheProvinceService;
