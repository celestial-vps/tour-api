
npm install mongoose
 
npm install express dotenv
npm install joi
npm install axios
npm install dotenv
npm install swagger-jsdoc --save
npm install swagger-ui-express
npm i express-validation --save
npm install cors
npm install uuid npm install jsonwebtoken bcryptjs npm install multer npm install sharp npm install redis
npm install -g migrate-mongo
migrate-mongo init

npx migrate-mongo create add_users_role_collection
npx migrate-mongo up
npx migrate-mongo down

npx migrate-mongo create seed_user_roles
npx migrate-mongo up
npx migrate-mongo down


http://localhost:5102/api/v1/api-docs/#/


