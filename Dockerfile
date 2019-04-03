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
# sudo docker rmi $(docker images -f "dangling=true" -q)


# sudo docker build -t vue-sghen-v1.2.0 .
# sudo docker service update --image vue-sghen-v1.2.0 vue-sghen-service