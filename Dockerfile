# build stage
#FROM node:lts-alpine as build-stage
#WORKDIR /presta-eguarantorship
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run deploy

# production stage
FROM nginx:stable-alpine
COPY ./.nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]