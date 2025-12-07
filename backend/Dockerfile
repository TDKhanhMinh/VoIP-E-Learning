# Sử dụng base image Node.js ổn định
FROM node:20-alpine

# Đặt thư mục làm việc bên trong container
WORKDIR /app/backend

# Copy package files và cài đặt dependencies
# Sử dụng /backend/package*.json vì context là ./backend
COPY package*.json ./ 

RUN npm install

# Copy toàn bộ code còn lại
COPY . .

# Run both API + Worker using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
