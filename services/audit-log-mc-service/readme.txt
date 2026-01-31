# docker compose down

    docker compose up --build

# Hanya run tanpa build ulang (image sudah ada):
    docker compose up
    docker compose down



docker exec -it audit-api sh
     npx sequelize-cli db:migrate

# DOCKER
docker exec -it audit-api sh
    npx sequelize-cli db:migrate
docker exec -it audit-api sh
    npx sequelize-cli db:seed:all

# Rebuild
docker-compose down
docker-compose build audit-api
docker-compose up -d
docker-compose logs -f audit-api

# MASUK DB DOCKER

docker exec -it audit-db sh
psql -U postgres -d tourdb_audit_trail
\l
\dt
