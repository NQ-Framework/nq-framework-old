FROM node:12 AS build-env
WORKDIR /usr/src/app
RUN npm install -g @nestjs/cli
COPY [".npmrc", "package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN echo '//npm.pkg.github.com/:_authToken=9758de7c8824d876ac5c70bfdfa920a4de854cab' > .npmrc
RUN echo '@nq-framework:registry=https://npm.pkg.github.com/NQ-Framework' >> .npmrc
RUN npm install
COPY . .
RUN npm run build

FROM node:12-alpine
ENV NODE_ENV production
WORKDIR /app
COPY --from=build-env /usr/src/app/package.json .
COPY --from=build-env /usr/src/app/dist ./dist
RUN echo '//npm.pkg.github.com/:_authToken=9758de7c8824d876ac5c70bfdfa920a4de854cab' > /app/.npmrc
RUN echo '@nq-framework:registry=https://npm.pkg.github.com/NQ-Framework' >> /app/.npmrc
RUN npm install --production --silent && mv node_modules ../
CMD npm run start:prod