FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8081
ENTRYPOINT ["node", "index.js"]