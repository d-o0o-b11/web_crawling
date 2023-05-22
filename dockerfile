FROM node:18.12.1-alpine

# RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont udev xvfb x11vnc fluxbox dbus  

# RUN apk add --no-cache --virtual .build-deps curl \
#     && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
#     && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
#     && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
#     && apk add --no-cache curl wget \
#     && apk del .build-deps  

# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser 
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true  

WORKDIR /usr/src/web_crawling

COPY package.json yarn.lock nest-cli.json tsconfig.json ./

RUN yarn

COPY . .

# RUN apk add --no-cache udev ttf-freefont chromium

RUN yarn build

CMD [ "node" ,"dist/main"]