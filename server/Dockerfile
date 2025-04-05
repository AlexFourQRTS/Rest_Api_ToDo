
FROM node:18

WORKDIR /server

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

CMD ["node", "Server.js"]