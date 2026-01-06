# Gunakan Node.js official image ringan
FROM node:18-alpine

# Set working directory di container
WORKDIR /usr/src/app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Expose port API
EXPOSE 5001

# Start API
CMD ["npm", "run", "dev"]   
