FROM amsross/egghead:latest

WORKDIR /code

COPY package-lock.json ./
COPY package.json ./
RUN npm install

COPY ./scrape.js ./
COPY ./index.js ./
