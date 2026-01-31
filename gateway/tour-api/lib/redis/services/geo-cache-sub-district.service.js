// const Redis = require('ioredis');
const redis = require('../redis');
class GeoCacheSubDistrictService {
    constructor() {
        // @ts-ignore
        this.redisClient = redis; // Sesuaikan konfigurasi jika perlu
        this.redisKey = 'geo:subDistricts';
    }

    /**
     * Insert atau update country di Redis
     * @param {{ id: string, name: string }} country
     */
    async upsertSubDistrict(country) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const subDistricts = data ? JSON.parse(data.toString()) : [];

            const index = subDistricts.findIndex(c => c.id === country.id);

            if (index !== -1) {
                subDistricts[index] = country;
            } else {
                subDistricts.push(country);
            }

            await this.redisClient.set(this.redisKey, JSON.stringify(subDistricts));
        } catch (err) {
            console.error('Redis error (upsertSubDistrict):', err);
            throw err;
        }
    }

    /**
     * Get all subDistricts from Redis
     * @returns {Promise<Array<{ oid: string, countryName: string }>>}
     */
    async getSubDistricts() {
        try {
            console.log('Looking up Redis key:', this.redisKey);
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data.toString()) : [];
        } catch (err) {
            console.error('Redis error (getSubDistricts):', err);
            return [];
        }
    }

    /**
     * Delete a country by ID
     * @param {string} id
     */
    async deleteSubDistrict(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            let subDistricts = data ? JSON.parse(data.toString()) : [];

            subDistricts = subDistricts.filter(c => c.id !== id);

            await this.redisClient.set(this.redisKey, JSON.stringify(subDistricts));
        } catch (err) {
            console.error('Redis error (deleteSubDistrict):', err);
            throw err;
        }
    }

    /**
     * Clear all subDistricts from Redis
     */
    async clearSubDistricts() {
        try {
            await this.redisClient.del(this.redisKey);
        } catch (err) {
            console.error('Redis error (clearSubDistricts):', err);
            throw err;
        }
    }

    async getAllSubDistricts() {
        try {
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data.toString()) : [];
        } catch (err) {
            console.error('Redis error (getAllSubDistricts):', err);
            return [];
        }
    }

    async getSubDistrictById(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const subDistricts = data ? JSON.parse(data.toString()) : [];
            return subDistricts.find(c => c.id === id) || null;
        } catch (err) {
            console.error('Redis error (getSubDistrictById):', err);
            return null;
        }
    }

    async searchSubDistrictsByName(name) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const subDistricts = data ? JSON.parse(data.toString()) : [];
            const lowerName = name.toLowerCase();
            return subDistricts.filter(c => c.countryName.toLowerCase().includes(lowerName));
        } catch (err) {
            console.error('Redis error (searchSubDistrictsByName):', err);
            return [];
        }
    }
}

module.exports = GeoCacheSubDistrictService;
