FROM node:10

WORKDIR /sindu/src/app
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 8080
CMD ["node","dist/index.bundle.js"]
