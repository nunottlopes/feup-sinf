FROM node:8
# set working directory
WORKDIR /app



# install and cache app dependencies

COPY package*.json ./
COPY ./assets ./assets
COPY ./config ./config
COPY ./logs ./logs
COPY ./mongodb ./mongodb
COPY ./parser ./parser
COPY ./routes ./routes
COPY ./store ./store
COPY ./utils ./utils

COPY .env* ./
COPY app.js ./

RUN npm install --silent
RUN npm install -g nodemon --silent

ADD https://github.com/ufoscout/docker-compose-    wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

EXPOSE 3001

# start app
CMD ["npm", "run", "start:dev"]