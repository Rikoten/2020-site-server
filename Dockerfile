FROM node:alpine AS builder

WORKDIR /root

RUN apk add git

COPY site-repo.conf site-repo.conf
RUN git clone --depth 1 $(cat site-repo.conf) site

RUN npm i -g typescript

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY events.json events.json
COPY firebase.json firebase.json
RUN npm i

COPY src src

RUN tsc

CMD node $(find . -type f -name app.js)
