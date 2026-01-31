# DEVELOPMENT
docker compose up --build
docker compose up -d

# PRODUCTION
docker compose -f docker-compose.prod.yml up -d --build
