import { NestFactory } from '@nestjs/core'; 
import { UserRoleSeeder } from './db/seeds/user-role.seeder';
import { SeedModule } from './db/seeds/seed.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const seeder = app.get(UserRoleSeeder);
  await seeder.seed();

  await app.close();
  process.exit(0);
}

bootstrap();
