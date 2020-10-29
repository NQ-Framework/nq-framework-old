FROM node:12 AS build-env
WORKDIR /usr/src/app
RUN npm install -g @nestjs/cli
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
RUN npm run build

FROM node:12-alpine
ENV NODE_ENV production
WORKDIR /app
COPY --from=build-env /usr/src/app/package.json .
COPY --from=build-env /usr/src/app/dist ./dist
RUN npm install --production --silent && mv node_modules ../
CMD npm run start:prod