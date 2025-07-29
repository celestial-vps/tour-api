# tour-api
# base-node-express
1. npm init -y
2. npm install express mssql body-parser   
3. npm install moment lodash
4. npm install express express-validator
5. npm install axios joi
6. npm install nodemailer
7. npm i dotenv
8. npm install express jsonwebtoken mysql2 dotenv (npm update mysql2)
9. npm install --save-dev nodemon -->> first when setup new computer / nodejs
10. npm install jsonwebtoken bcryptjs
11. npm install swagger-jsdoc swagger-ui-express (ini untuk production tapi tidak perlu )
12  npm install --save-dev swagger-jsdoc swagger-ui-express

12. npm install dotenv
13. npm i uuidv7
14. npm install multer
15. npm install sharp
16. npm install express-rate-limit
17. npm install ioredis
18. npm install cross-env --save-dev
19. npm i helmet



npm i express-rate-limit
npm install lodash

# MIGRATION
./scripts/seed.sh
npx sequelize-cli migration:generate --name create-driver
npx sequelize-cli db:migrate

npm install umzug mysql2
npm install fast-glob
node runMigrations.js migrate up
node runMigrations.js migrate down

// CREATE SEED 
npx sequelize-cli seed:generate --name seed-hotels
npx sequelize-cli db:seed:undo --seed name-of-seed-file.js
npx sequelize-cli db:seed --seed name-of-seed-file.js


npx sequelize-cli db:seed --seed 20250618062132-default-user.js
npx sequelize-cli db:seed:undo --seed 20250618062132-default-user.js
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:migrate:undo:all



POWERSHELL => New-Item -Path .\migrations\20250409-create-users-table.js -ItemType File
npm install --save-dev sequelize-cli

// CREATE MIGRATION
npx sequelize-cli migration:generate --name create-conversations
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo

1 run this in db for handle case sensitife in postgree  CREATE EXTENSION IF NOT EXISTS citext;

Note
1. change all atribut to variable


# UNIT TEST
npm install --save-dev node-mocks-http

npm install --save-dev jest
npm install --save-dev supertest
npm install --save-dev sequelize-mock
npm install module-alias --save

npm test
npx jest --watch       # auto-rerun tests on changes
npx jest --coverage    # generate coverage report
start coverage/lcov-report/index.html
npx jest --detectOpenHandles --forceExit

so g
npx jest --clearCache


# SOCKET IO
npm install socket.io


# CHECK BROKER LINK
madge --extensions js,ts --summary ./controllers
madge --extensions js,ts --summary ./routes


# KAFKA
    Download dan install OpenJDK 8+ dari Adoptium atau Oracle
    https://kafka.apache.org/downloads
    JALANKAN INI DI POWERSHELL ATAU CMD 
    C:\kafka\bin\windows\zookeeper-server-start.bat C:\kafka\config\zookeeper.properties
    BUKA PowerShell/CMD BARU 
    C:\kafka\bin\windows\kafka-server-start.bat C:\kafka\config\server.properties

untuk restart 
    .\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
    
npm install kafkajs

JALAN KAN INI DULU SEBELUM RUN 
# Start Zookeeper
.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
# Start Kafka broker
.\bin\windows\kafka-server-start.bat .\config\server.properties

INI UNTUK STOP KAFKA 
CTR + C  aja

ini kalo bikin service nya
.\bin\windows\kafka-server-start.bat .\config\server.properties
.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties


# REDIS
    sudo service redis-server start


# MIGRATION 
 npx sequelize-cli seed:generate --name country-sync-redis



 npx sequelize-cli seed:generate --name geo-seed


  npx sequelize-cli seed:generate --name default-user
    
# SWAGGER
    http://localhost:3000/api/v1/api-docs/



    npm install firebase-admin
