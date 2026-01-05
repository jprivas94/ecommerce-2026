# Force rebuild 2
FROM node:20

WORKDIR /app

# 1. Dependencias
COPY package*.json ./
RUN npm install

# 2. Código fuente
COPY . .

# 3. Puerto
EXPOSE 3000

# 4. Start
CMD ["node", "server.js"]