FROM node:12

ARG NPM_TOKEN
ARG BROWSER_URL
ARG GA_PROPERTY

RUN mkdir -p /usr/src/opex
WORKDIR /usr/src/opex

COPY . /usr/src/opex
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc
RUN npm install
RUN npm run build

ENV PORT=8085
ENV HOST=0.0.0.0

EXPOSE ${PORT}

CMD [ "npm", "start" ]
