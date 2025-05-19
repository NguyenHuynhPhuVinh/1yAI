# Sử dụng node image chính thức
FROM node:20-alpine AS base

# Cài đặt dependencies
FROM base AS deps
WORKDIR /app

# Sao chép package.json
COPY package.json ./

# Cài đặt dependencies
RUN npm install

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Thiết lập biến môi trường cho production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build ứng dụng
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Tạo người dùng non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Sao chép các file cần thiết từ builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Chuyển sang user non-root
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Khởi chạy ứng dụng
CMD ["node", "server.js"]