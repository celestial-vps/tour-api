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