const Redis = require('ioredis');

class GeoCityService {
  constructor() {
    // @ts-ignore
    this.redisClient = new Redis();
    this.redisKey = 'geo:cities';
  }

  /**
   * Insert atau update city di Redis cache
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
   * @returns {Promise<Array<{ id: string, name: string }>>}
   */
  async getCities() {
    try {
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
}

module.exports = GeoCityService;
