# Sử dụng Node.js LTS làm base image
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ source code
COPY . .

# Build ứng dụng
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["npm", "start"] 