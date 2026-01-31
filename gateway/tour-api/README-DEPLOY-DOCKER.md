# DEPLOY DEV
 <!-- BUILD CONTAINER  -->
docker-compose -f docker-compose.yml build
<!-- JALANKAN CONTAINER -->
docker-compose -f docker-compose.yml up -d
<!-- CEK STATUS CONTAINER -->
docker ps
<!-- LIAT LOG PM2 di Container tour-api-dev -->
docker logs -f tour-api-dev

# BUILD ULANG DEV
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d




# BUILD ULANG KALO ADA KESALAHAN CODE / DOCKER CODE
docker-compose -f docker-compose.yml up -d
# BUILD ULANG KALO ADA KESALAHAN DEPENDENCY (PACKAGE.JSON)
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
# BUILD ULANG KALO ADA KESALAHAN ENV (PACKAGE.JSON)
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d

# CREATE DB 
    docker exec -it tour-db-dev psql -U postgres
    CREATE DATABASE tourdb_dev;

# MASUK PM2 UNTUK MIGRATION/SEED/RESTART PM2
    docker exec -it tour-api-dev sh
    pm2 restart all
    pm2 logs  
    npx sequelize-cli db:migrate

# CEK TABLE AND DATA
    \dt
    \l
    \c tourdb_dev
    \dt
    

    SELECT * FROM tour_logs;

 


# DEPLOY PROD
docker-compose -f docker-compose.production.yml up -d --build
