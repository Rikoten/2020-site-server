FROM node:alpine AS builder

WORKDIR /root

RUN apk add git

COPY site-repo.conf site-repo.conf
RUN git clone --depth 1 $(cat site-repo.conf) site

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i

COPY src src
COPY tsconfig.json tsconfig.json

# Ignore TypeScript compile error
RUN npx tsc; exit 0

CMD npm run start
