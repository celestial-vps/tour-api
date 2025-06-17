const Redis = require('ioredis');

class GeoProvinceService {
  constructor() {
    // @ts-ignore
    this.redisClient = new Redis(); // Sesuaikan konfigurasi Redis jika perlu
    this.redisKey = 'geo:provinces';
  }

  /**
   * Insert atau update province di Redis cache
   * @param {{ id: string, name: string }} province
   */
  async upsertProvince(province) {
    try {
      const data = await this.redisClient.get(this.redisKey);
      const provinces = data ? JSON.parse(data) : [];

      const index = provinces.findIndex(p => p.id === province.id);

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
   * @returns {Promise<Array<{ id: string, name: string }>>}
   */
  async getProvinces() {
    try {
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

      provinces = provinces.filter(p => p.id !== id);

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
}

module.exports = GeoProvinceService;
