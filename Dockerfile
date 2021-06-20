FROM node:12.14.1-alpine3.9 as angular
WORKDIR /home/node/app
EXPOSE 4200/tcp
COPY . .
RUN apk add git && \
    npm install -g @angular/cli
RUN npm install

FROM angular as builder
RUN ng build --output-path=dist

FROM nginx as production
WORKDIR /usr/share/nginx/html
EXPOSE 80/tcp
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /usr/share/nginx/html/assets
COPY --from=angular /home/node/app/src/assets/* /usr/share/nginx/html/assets/
COPY --from=builder /home/node/app/dist/* /usr/share/nginx/html/

FROM angular as development
CMD ["npm", "start", "0.0.0.0"]
