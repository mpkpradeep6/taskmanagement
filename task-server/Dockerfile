FROM node:18.19.1

WORKDIR /task-server
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
COPY . .
EXPOSE 6868
CMD npm start