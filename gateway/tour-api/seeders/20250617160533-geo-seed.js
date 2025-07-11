const { v4: uuidv4 } = require("uuid");
const dataHierarchy = require("./data/geo-data-hierarchy");

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const countryData of dataHierarchy) {
      const countryOid = uuidv4();
      console.log(`Inserting country: ${countryData.countryName}`);

      await queryInterface.bulkInsert("countries", [
        {
          oid: countryOid,
          countryName: countryData.countryName,
          countryCode: countryData.countryCode,
          countryCurrency: countryData.countryCurrency,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      for (const provinceData of countryData.provinces) {
        const provinceOid = uuidv4();
        console.log(`  Inserting province: ${provinceData.provinceName}`);

        await queryInterface.bulkInsert("provinces", [
          {
            oid: provinceOid,
            provinceName: provinceData.provinceName,
            countryOid: countryOid,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);

        for (const cityData of provinceData.cities) {
          const cityOid = uuidv4();
          console.log(`    Inserting city: ${cityData.cityName}`);

          await queryInterface.bulkInsert("cities", [
            {
              oid: cityOid,
              cityName: cityData.cityName,
              provinceOid: provinceOid,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]);

          for (const districtData of cityData.districts || []) {
            const districtOid = uuidv4();
            console.log(`      Inserting district: ${districtData.districtName}`);

            await queryInterface.bulkInsert("districts", [
              {
                oid: districtOid,
                districtName: districtData.districtName,
                cityOid: cityOid,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ]);

            if (Array.isArray(districtData.subDistricts) && districtData.subDistricts.length > 0) {
              const subDistricts = districtData.subDistricts.map((sub) => ({
                oid: uuidv4(),
                subDistrictName: sub.subDistrictName,
                postalCode: sub.postalCode ?? "-",
                districtOid: districtOid,
                createdAt: new Date(),
                updatedAt: new Date()
              }));

              console.log(`        Inserting ${subDistricts.length} sub-district(s) for district: ${districtData.districtName}`);
              await queryInterface.bulkInsert("sub_districts", subDistricts);
            }
          }
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    console.log("Undoing geo seed: deleting from sub_districts → countries...");
    await queryInterface.bulkDelete("sub_districts", null, {});
    await queryInterface.bulkDelete("districts", null, {});
    await queryInterface.bulkDelete("cities", null, {});
    await queryInterface.bulkDelete("provinces", null, {});
    await queryInterface.bulkDelete("countries", null, {});
  }
};
