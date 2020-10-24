FROM node:alpine

WORKDIR /root

RUN apk add git openssh

COPY site-repo.conf site-repo.conf
RUN git clone --depth 1 $(cat site-repo.conf) site

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i --production

COPY src src
COPY tsconfig.json tsconfig.json

CMD npm run start
