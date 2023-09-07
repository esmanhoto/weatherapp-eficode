FROM node:18.17.1

WORKDIR /app 

COPY package*.json ./

RUN npm ci 

COPY . .

CMD ["node", "src/index.js"]
