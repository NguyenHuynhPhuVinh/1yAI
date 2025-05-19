# Sử dụng Node.js 16 làm base image
FROM node:16-alpine

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ code nguồn
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng khi container khởi động
CMD ["node", "index.js"] 