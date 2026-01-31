# Gunakan Node.js resmi yang ringan
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Environment
ENV NODE_ENV=development
ENV PORT=5001

# Copy dependency files
COPY package*.json ./

# Install dependencies + pm2
RUN npm install -g pm2 \
    && npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5101

# Jalankan server: tunggu Kafka, buat topic, start pm2
CMD ["sh", "-c", "pm2-runtime ecosystem.config.js --env development"]
 