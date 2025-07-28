FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY generate-env-config.sh /usr/share/nginx/html/generate-env-config.sh
RUN chmod +x /usr/share/nginx/html/generate-env-config.sh

EXPOSE 80
ENV PORT=8080
COPY nginx.conf /etc/nginx/nginx.conf

CMD /bin/sh -c "/usr/share/nginx/html/generate-env-config.sh && nginx -g 'daemon off;'"
