# Gunakan Node.js official image ringan
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json & package-lock.json untuk install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy semua source code
COPY . .

# Set environment default, bisa di override saat run container
ENV NODE_ENV=production
ENV PORT=5101

# Expose port (dokumentasi)
EXPOSE 5101

# Jalankan aplikasi
# Menggunakan variable environment, fleksibel antara dev & prod
CMD ["sh", "-c", "npm run ${NODE_ENV}"]
