# DEPLOY DEV
 <!-- BUILD CONTAINER  -->
docker-compose -f docker-compose.yml build
<!-- JALANKAN CONTAINER -->
docker-compose -f docker-compose.yml up -d
<!-- CEK STATUS CONTAINER -->
docker ps
<!-- LIAT LOG PM2 di Container audit-api-dev -->
docker logs -f audit-api-dev

# BUILD ULANG KALO ADA KESALAHAN CODE / DOCKER CODE
docker-compose -f docker-compose.yml up -d
# BUILD ULANG KALO ADA KESALAHAN DEPENDENCY (PACKAGE.JSON)
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
# BUILD ULANG KALO ADA KESALAHAN ENV (PACKAGE.JSON)
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d

# CREATE DB 
    docker exec -it audit-db-dev psql -U postgres
    CREATE DATABASE audit_trail_dev;

# MASUK PM2 UNTUK MIGRATION/SEED/RESTART PM2
    docker exec -it audit-api-dev sh
    npx sequelize-cli db:migrate

 


# DEPLOY PROD
docker-compose -f docker-compose.production.yml up -d --build
