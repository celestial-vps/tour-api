import { AppDataSource } from '../../db/data-source';
import { UserRolesSeeder } from './user-roles.seed';

async function runSeeders() {
  const dataSource = await AppDataSource.initialize();
  try {
    const userRolesSeeder = new UserRolesSeeder(dataSource);
    await userRolesSeeder.run();
  } catch (err) {
    console.error(err);
  } finally {
    await dataSource.destroy();
  }
}

runSeeders();
