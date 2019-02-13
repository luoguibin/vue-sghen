FROM node as build-stage
MAINTAINER sghen 
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . . 
RUN npm run build

FROM httpd as production-stage
COPY --from=build-stage /app/dist /usr/local/apache2/htdocs
# RUN rm -rf /app
