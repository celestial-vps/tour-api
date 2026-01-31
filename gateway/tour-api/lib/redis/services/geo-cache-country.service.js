// const Redis = require('ioredis');
const redis = require('../redis');

class GeoCacheCountryService {
    constructor() {
        // @ts-ignore
        this.redisClient = redis; // Sesuaikan konfigurasi jika perlu
        this.redisKey = 'geo:countries';
    }

    /**
     * Insert atau update country di Redis
     * @param {{ id: string, name: string }} country
     */
    async upsertCountry(country) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const countries = data ? JSON.parse(data.toString()) : [];

            const index = countries.findIndex(c => c.id === country.id);

            if (index !== -1) {
                countries[index] = country;
            } else {
                countries.push(country);
            }

            await this.redisClient.set(this.redisKey, JSON.stringify(countries));
        } catch (err) {
            console.error('Redis error (upsertCountry):', err);
            throw err;
        }
    }

    /**
     * Get all countries from Redis
     * @returns {Promise<Array<{ oid: string, countryName: string }>>}
     */
    async getCountries() {
        try {
            console.log('Looking up Redis key:', this.redisKey);
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data.toString()) : [];
        } catch (err) {
            console.error('Redis error (getCountries):', err);
            return [];
        }
    }

    /**
     * Delete a country by ID
     * @param {string} id
     */
    async deleteCountry(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            let countries = data ? JSON.parse(data.toString()) : [];

            countries = countries.filter(c => c.id !== id);

            await this.redisClient.set(this.redisKey, JSON.stringify(countries));
        } catch (err) {
            console.error('Redis error (deleteCountry):', err);
            throw err;
        }
    }

    /**
     * Clear all countries from Redis
     */
    async clearCountries() {
        try {
            await this.redisClient.del(this.redisKey);
        } catch (err) {
            console.error('Redis error (clearCountries):', err);
            throw err;
        }
    }

    async getAllCountries() {
        try {
            const data = await this.redisClient.get(this.redisKey);
            return data ? JSON.parse(data.toString()) : [];
        } catch (err) {
            console.error('Redis error (getAllCountries):', err);
            return [];
        }
    }

    async getCountryById(id) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const countries = data ? JSON.parse(data.toString()) : [];
            return countries.find(c => c.id === id) || null;
        } catch (err) {
            console.error('Redis error (getCountryById):', err);
            return null;
        }
    }

    async searchCountriesByName(name) {
        try {
            const data = await this.redisClient.get(this.redisKey);
            const countries = data ? JSON.parse(data.toString()) : [];
            const lowerName = name.toLowerCase();
            return countries.filter(c => {
                if (!c || !c.countryName) return false;
                return c.countryName.toLowerCase().includes(lowerName);
            });

        } catch (err) {
            console.error('Redis error (searchCountriesByName):', err);
            return [];
        }
    }
}

module.exports = GeoCacheCountryService;
