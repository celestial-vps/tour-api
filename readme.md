🧩 Daftar Branch + Fungsi
Branch Name	Tujuan	Kapan Dipakai	Contoh Nama Branch
main / production	Source of truth untuk production. Harus selalu stabil.	Saat rilis resmi ke production	main atau production
dev	Tempat integrasi semua fitur sebelum masuk release	Daily development / auto-deploy ke dev env	dev
release/x.y.z	Persiapan rilis ke production (staging, QA testing)	Saat semua fitur di dev siap dites bareng-bareng	release/v1.2.0
feature/	Pengembangan fitur baru	Saat mulai fitur tertentu dari awal	feature/add-user-auth
bugfix/	Perbaikan bug minor yang belum sampai production	Saat fixing bug dari testing di dev/staging	bugfix/fix-payment-currency-issue
hotfix/	Patch mendesak untuk bug di production	Saat perbaikan cepat yang urgent di production	hotfix/fix-token-expired
refactor/	Refactoring internal tanpa ubah fungsionalitas	Optimalisasi, merapikan struktur	refactor/clean-auth-controller
test/	Penambahan atau perbaikan testing	Saat buat unit/integration test	test/add-payment-unit-test
docs/	Perubahan dokumentasi proyek	Saat update README, swagger, API contract, dll	docs/add-payment-api-spec
chore/	Tugas-tugas rutin non-feature/non-bug	Update config, dependency, CI/CD, lint, dll	chore/update-eslint-config
ci/	Perubahan pada file CI/CD workflow	Saat update pipeline, action, docker config, dll	ci/update-deploy-workflow
.pascalToKebab()

# DEPLOY DOCKER DATABASE
docker compose up -d

# DEPLOY DOCKER MICROSERVICE API
cd tour-api
docker compose up -d --build

cd ../news-api
docker compose up -d --build

cd ../hospital-api
docker compose up -d --build


# REBUILD DOCKER
docker compose down
docker compose up -d --build


# TEST CONNECT KE REDIS
PS D:\Startup\Tour\tour-api\gateway\tour-api> docker run -d --name tour-api 
--network tour-network --env-file .env.development -p 5101:5101 tour-api-tour-api
39f27f57516a00ab18d9fa1cfce0dc17a10c52469fccbcf8cec07671a3a8d944

apk update
apk add redis


ping redis-server
redis-cli -h redis-server -p 6379 -a Serverh5n ping

docker logs -f tour-api


docker inspect tour-api
docker inspect redis-server


docker exec -it postgres-db psql -U postgres -d tourdb
\dt
\l


docker exec -it tour-api sh
