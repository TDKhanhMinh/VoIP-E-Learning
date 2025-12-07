# File: VOIP E-LEARNING/backend/Dockerfile
# Sử dụng base image Node.js ổn định
FROM node:20-alpine

# Đặt thư mục làm việc bên trong container
WORKDIR /app/backend

# Copy package files và cài đặt dependencies
# Sử dụng /backend/package*.json vì context là ./backend
COPY package*.json ./ 
RUN npm install
# 5. Install PM2 globally
RUN npm install -g pm2
# Copy toàn bộ code còn lại
COPY . .
# 7. Start API + Worker together
CMD ["pm2-runtime", "ecosystem.config.js"]
# Không định nghĩa CMD ở đây, sẽ dùng trong docker-compose.yml