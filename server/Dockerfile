
FROM node:18

WORKDIR /server

COPY package.json package-lock.json* ./
RUN npm install
RUN npm install pg

COPY . .

CMD ["node", "Server.js"]