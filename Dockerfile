FROM node:10.16.3

LABEL com.blokur.description="The Kindness Project Webapp"
LABEL com.blokur.usage="docker run -d --name the-kindness-project-webapp <IMAGE_NAME>"

WORKDIR /app

COPY . .

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV SENDGRID_API_KEY=${SENDGRID_API_KEY}
ENV MONGO_CONN=${MONGO_CONN}

RUN make build

CMD node ./server/index.js
