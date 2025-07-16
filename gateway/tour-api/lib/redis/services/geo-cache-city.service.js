const Redis = require('ioredis');

class GeoCacheCityService {
    constructor() {
        // @ts-ignore
        this.redisClient = new Redis(); // Sesuaikan konfigurasi jika perlu
        this.redisKey = 'geo:cities';
    }

    /**
     * Insert atau update city di Redis
     * @param {{ id: string, name: string }} city
     */
    async upsertCity(city) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const cities = data ? JSON.parse(data) : [];

            const index = cities.findIndex(c => c.id === city.id);

            if (index !== -1) {
                cities[index] = city;
            } else {
                cities.push(city);
            }

            await this.redisClient.set(this.redisKey, JSON.stringify(cities));
        } catch (err) {
            console.error('Redis error (upsertCity):', err);
            throw err;
        }
    }

    /**
     * Get all cities from Redis
     * @returns {Promise<Array<{ oid: string, cityName: string }>>}
     */
    async getCities() {
        try {
            console.log('Looking up Redis key:', this.redisKey);
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.error('Redis error (getCities):', err);
            return [];
        }
    }

    /**
     * Delete a city by ID
     * @param {string} id
     */
    async deleteCity(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            let cities = data ? JSON.parse(data) : [];

            cities = cities.filter(c => c.id !== id);

            await this.redisClient.set(this.redisKey, JSON.stringify(cities));
        } catch (err) {
            console.error('Redis error (deleteCity):', err);
            throw err;
        }
    }

    /**
     * Clear all cities from Redis
     */
    async clearCities() {
        try {
            await this.redisClient.del(this.redisKey);
        } catch (err) {
            console.error('Redis error (clearCities):', err);
            throw err;
        }
    }

    async getAllCities() {
        try {
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data) : [];
        } catch (err) {
            console.error('Redis error (getAllCities):', err);
            return [];
        }
    }

    async getCityById(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const cities = data ? JSON.parse(data) : [];
            return cities.find(c => c.id === id) || null;
        } catch (err) {
            console.error('Redis error (getCityById):', err);
            return null;
        }
    }

    async searchCitiesByName(name) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const cities = data ? JSON.parse(data) : [];
            const lowerName = name.toLowerCase();
            return cities.filter(c => c.cityName.toLowerCase().includes(lowerName));
        } catch (err) {
            console.error('Redis error (searchCitiesByName):', err);
            return [];
        }
    }
}

module.exports = GeoCacheCityService;
