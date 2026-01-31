# Gunakan Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files dulu (biar cache Docker efisien)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Expose port aplikasi
EXPOSE 4000

# Jalankan app
CMD ["npm", "start"]
