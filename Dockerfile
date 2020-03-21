FROM node:10.16.3

LABEL com.blokur.description="Crispy Broccoli"
LABEL com.blokur.usage="docker run -d --name crispy-broccoli <IMAGE_NAME>"

WORKDIR /crispy-broccoli

COPY . .

ENV PORT=${PORT}

RUN make build

CMD make run
