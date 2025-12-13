FROM node:20-alpine

WORKDIR /app/backend

COPY package*.json ./ 
RUN npm install
# 5. Install PM2 globally
RUN npm install -g pm2
COPY . .
CMD ["pm2-runtime", "ecosystem.config.js"]