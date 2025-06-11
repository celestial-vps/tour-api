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
11. npm install swagger-jsdoc swagger-ui-express
12. npm install dotenv
13. npm i uuidv7
14. npm install multer
15. npm install sharp
npm i express-rate-limit
npm install lodash

# MIGRATION
npm install umzug mysql2
npm install fast-glob
node runMigrations.js migrate up
node runMigrations.js migrate down



POWERSHELL => New-Item -Path .\migrations\20250409-create-users-table.js -ItemType File
npm install --save-dev sequelize-cli
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
