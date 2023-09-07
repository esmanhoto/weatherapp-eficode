FROM node:18.17.1

WORKDIR /app

ARG ENDPOINT=http://0.0.0.0:9000/api

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
