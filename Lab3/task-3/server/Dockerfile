FROM node:14

WORKDIR /app

RUN npm install express
RUN npm install cors

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]