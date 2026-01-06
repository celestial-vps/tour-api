FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Set production mode
ENV NODE_ENV=production

# Copy dependency files first (layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Expose application port
EXPOSE 5001

# Start application
CMD ["node", "server.js"]
