FROM node:latest

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

COPY package*.json ./

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
