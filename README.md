# tour-api


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


