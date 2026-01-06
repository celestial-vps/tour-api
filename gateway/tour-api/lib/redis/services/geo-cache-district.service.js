// const Redis = require('ioredis');
const redis = require('../redis');

class GeoCacheDistrictService {
    constructor() {
        // @ts-ignore
        this.redisClient =   redis; // Sesuaikan konfigurasi jika perlu
        this.redisKey = 'geo:districts';
    }

    /**
     * Insert atau update district di Redis
     * @param {{ id: string, name: string }} district
     */
    async upsertDistrict(district) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const districts = data ? JSON.parse(data.toString()) : [];

            const index = districts.findIndex(c => c.id === district.id);

            if (index !== -1) {
                districts[index] = district;
            } else {
                districts.push(district);
            }

            await this.redisClient.set(this.redisKey, JSON.stringify(districts));
        } catch (err) {
            console.error('Redis error (upsertDistrict):', err);
            throw err;
        }
    }

    /**
     * Get all districts from Redis
     * @returns {Promise<Array<{ oid: string, districtName: string }>>}
     */
    async getDistricts() {
        try {
            console.log('Looking up Redis key:', this.redisKey);
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data.toString()) : [];
        } catch (err) {
            console.error('Redis error (getDistricts):', err);
            return [];
        }
    }

    /**
     * Delete a district by ID
     * @param {string} id
     */
    async deleteDistrict(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            let districts = data ? JSON.parse(data.toString()) : [];

            districts = districts.filter(c => c.id !== id);

            await this.redisClient.set(this.redisKey, JSON.stringify(districts));
        } catch (err) {
            console.error('Redis error (deleteDistrict):', err);
            throw err;
        }
    }

    /**
     * Clear all districts from Redis
     */
    async clearDistricts() {
        try {
            await this.redisClient.del(this.redisKey);
        } catch (err) {
            console.error('Redis error (clearDistricts):', err);
            throw err;
        }
    }

    async getAllDistricts() {
        try {
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data.toString()) : [];
        } catch (err) {
            console.error('Redis error (getAllDistricts):', err);
            return [];
        }
    }

    async getDistrictById(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const districts = data ? JSON.parse(data.toString()) : [];
            return districts.find(c => c.id === id) || null;
        } catch (err) {
            console.error('Redis error (getDistrictById):', err);
            return null;
        }
    }

    async searchDistrictsByName(name) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const districts = data ? JSON.parse(data.toString()) : [];
            const lowerName = name.toLowerCase();
            return districts.filter(c => c.districtName.toLowerCase().includes(lowerName));
        } catch (err) {
            console.error('Redis error (searchDistrictsByName):', err);
            return [];
        }
    }
}

module.exports = GeoCacheDistrictService;
