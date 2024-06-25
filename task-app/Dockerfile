FROM node:18.19.1
RUN mkdir /home/node/app && chown node:node /home/node/app
RUN mkdir /home/node/app/node_modules && chown node:node /home/node/app/node_modules
WORKDIR  /home/node/app
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --quiet
RUN npm uninstall bcrypt
RUN npm i bcrypt
# RUN npm run build
COPY --chown=node:node . .