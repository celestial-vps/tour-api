const Redis = require('ioredis');

class GeoDistrictService {
  constructor() {
    // @ts-ignore
    this.redisClient = new Redis();
    this.redisKey = 'geo:districts';
  }

  /**
   * Insert atau update district di Redis cache
   * @param {{ id: string, name: string }} district
   */
  async upsertDistrict(district) {
    try {
      const data = await this.redisClient.get(this.redisKey);
      const districts = data ? JSON.parse(data) : [];

      const index = districts.findIndex(d => d.id === district.id);

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
   * @returns {Promise<Array<{ id: string, name: string }>>}
   */
  async getDistricts() {
    try {
      const data = await this.redisClient.get(this.redisKey);
      return data ? JSON.parse(data) : [];
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
      let districts = data ? JSON.parse(data) : [];

      districts = districts.filter(d => d.id !== id);

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
}

module.exports = GeoDistrictService;
