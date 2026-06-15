FROM node:18-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Render injects the PORT env variable automatically
EXPOSE 8001

# Start the node server
CMD ["node", "index.js"]
