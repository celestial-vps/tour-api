# DEPLOY DEV
 <!-- BUILD CONTAINER  -->
docker-compose -f docker-compose.yml build
<!-- JALANKAN CONTAINER -->
docker-compose -f docker-compose.yml up -d
<!-- CEK STATUS CONTAINER -->
docker ps
<!-- LIAT LOG PM2 di Container pdam-api-dev -->
docker logs -f pdam-api-dev

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
    docker exec -it pdam-db-dev psql -U postgres
    CREATE DATABASE pdamdb_dev;

# MASUK PM2 UNTUK MIGRATION/SEED/RESTART PM2
    docker exec -it pdam-api-dev sh
    pm2 restart all
    pm2 logs  
    npx sequelize-cli db:migrate

# CEK TABLE AND DATA
    \dt
    \l
    \c pdamdb_dev
    \dt
    

    SELECT * FROM pdam_logs;

 


# DEPLOY PROD
docker-compose -f docker-compose.production.yml up -d --build



test API http://localhost:5301/api/v1/test
