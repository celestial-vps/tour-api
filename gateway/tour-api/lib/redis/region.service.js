const { Country, Province, City, District } = require('../../models');
const subDistrictRepository = require('../../repositories/sub-district.repository');
const redis = require('../../lib/redis/redis');

const TEMP_PREFIX = 'subdistrict_temp';
const FINAL_PREFIX = 'subdistrict';
const BATCH_SIZE = 5000;

async function insertRegionToRedis() {
  // 1. Ambil data region lengkap
  const { result: allRegion, err } = await subDistrictRepository.findAll({
    attributes: ['oid', 'name'],
    include: [
      {
        model: District,
        as: 'district',
        attributes: ['oid', 'districtName'],
        include: [
          {
            model: City,
            as: 'city',
            attributes: ['oid', 'cityName'],
            include: [
              {
                model: Province,
                as: 'province',
                attributes: ['oid', 'provinceName'],
                include: [
                  {
                    model: Country,
                    as: 'country',
                    attributes: ['oid', 'countryName']
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  if (err) {
    console.error('❌ Gagal ambil data subdistrict:', err);
    return;
  }

  console.log(`📦 Meng-cache ${allRegion.length} subdistrict ke Redis (temp)...`);

  // 2. Simpan data ke Redis pakai pipeline + batching
  for (let i = 0; i < allRegion.length; i += BATCH_SIZE) {
    const chunk = allRegion.slice(i, i + BATCH_SIZE);
    const pipeline = redis.multi();

    for (const sub of chunk) {
      const key = `${TEMP_PREFIX}:${sub.oid}`;
      const value = JSON.stringify({
        subdistrictId: sub.oid,
        subdistrictName: sub.name,
        districtId: sub.district?.oid ?? null,
        districtName: sub.district?.districtName ?? null,
        cityId: sub.district?.city?.oid ?? null,
        cityName: sub.district?.city?.cityName ?? null,
        provinceId: sub.district?.city?.province?.oid ?? null,
        provinceName: sub.district?.city?.province?.provinceName ?? null,
        countryId: sub.district?.city?.province?.country?.oid ?? null,
        countryName: sub.district?.city?.province?.country?.countryName ?? null,
      });

      pipeline.set(key, value);
    }

    await pipeline.exec();
  }

  console.log('✅ Data berhasil disimpan sementara di Redis.');

  // 3. Hapus key lama (final)
  const oldKeys = [];
  for await (const key of redis.scanIterator({ MATCH: `${FINAL_PREFIX}:*` })) {
    if (typeof key === 'string') oldKeys.push(key);
  }
  if (oldKeys.length > 0) {
    // Spread array supaya argumen sesuai yang dipakai redis.del(...)
    // @ts-ignore
    await redis.del(...oldKeys);
    console.log(`🗑️ Menghapus ${oldKeys.length} subdistrict lama dari Redis.`);
  }

  // 4. Rename temp key jadi final key dengan pipeline (set + del)
  const tempKeys = [];
  for await (const key of redis.scanIterator({ MATCH: `${TEMP_PREFIX}:*` })) {
    if (typeof key !== 'string') continue;

    // @ts-ignore
    const newKey = key.replace(`${TEMP_PREFIX}:`, `${FINAL_PREFIX}:`);
    const val = await redis.get(key);
    if (val === null) {
      console.warn(`Nilai kosong untuk key ${key}, skip rename`);
      continue;
    }

    const pipeline = redis.multi();
    pipeline.set(newKey, val);
    pipeline.del(key);
    await pipeline.exec();

    tempKeys.push(newKey);
  }

  console.log(`🎉 Redis region update selesai. ${tempKeys.length} data aktif sekarang.`);
}

module.exports = insertRegionToRedis;
