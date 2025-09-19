# Multi-stage build for a React application.
# Stage 1: Build the React app
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other source files
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the application with a lightweight Nginx image
FROM nginx:stable-alpine

# Copy the build configuration from the host
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the 'build' stage to the Nginx public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80
