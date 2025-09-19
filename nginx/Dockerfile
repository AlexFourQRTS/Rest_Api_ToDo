# Stage 1: Build React client
FROM node:20-alpine AS build
WORKDIR /app/client

# Install deps
COPY client/package*.json ./
RUN npm ci

# Build
COPY client ./
RUN npm run build

# Stage 2: Nginx to serve build and proxy
FROM nginx:alpine

# Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Static build
COPY --from=build /app/client/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 