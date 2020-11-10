FROM node:12 AS build-env
WORKDIR /usr/src/app
RUN npm install -g @nestjs/cli
COPY [".npmrc", "package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npx npm-cli-login -u irreal -p 05cf60a5b8928ffa8850db85f5e60854ab896d0a -e milos.s.pfc@gmail.com -r https://npm.pkg.github.com
RUN echo 'registry=https://npm.pkg.github.com/NQ-Framework' > .npmrc
RUN npm install
COPY . .
RUN npm run build

FROM node:12-alpine
ENV NODE_ENV production
WORKDIR /app
COPY --from=build-env /usr/src/app/package.json .
COPY --from=build-env /usr/src/app/dist ./dist
RUN npx npm-cli-login -u irreal -p 05cf60a5b8928ffa8850db85f5e60854ab896d0a -e milos.s.pfc@gmail.com -r https://npm.pkg.github.com
RUN echo 'registry=https://npm.pkg.github.com/NQ-Framework' > /app/.npmrc
RUN npm install --production --silent && mv node_modules ../
CMD npm run start:prod