# Stage 1: Build the application
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx and inject runtime env vars
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# เพิ่ม script นี้เพื่อสร้าง config ตอน runtime
# ตรวจสอบว่าไฟล์ generate-env-config.sh อยู่ใน context ของ Docker build (เช่น ใน root project)
COPY generate-env-config.sh /usr/share/nginx/html/generate-env-config.sh
RUN chmod +x /usr/share/nginx/html/generate-env-config.sh

# (สำคัญ) ตรวจสอบว่า index.html ของคุณมีการเรียก <script src="/env-config.js"></script> ใน <head>

EXPOSE 80
ENV PORT=8080
COPY nginx.conf /etc/nginx/nginx.conf


# แก้ CMD ให้รัน script ก่อนเริ่ม Nginx
CMD /bin/sh -c "/usr/share/nginx/html/generate-env-config.sh && nginx -g 'daemon off;'"

# CMD ["/bin/sh", "-c", "/usr/share/nginx/html/generate-env-config.sh && nginx -g 'daemon off;'"]
