sudo docker build -t vue-sghen:1.3.5 .
sudo docker service update --image vue-sghen:1.3.5 vue-sghen-service

# docker images // 查看所有镜像
sudo docker rmi $(docker images -f "dangling=true" -q) // 删除构建镜像时暂时的临时的空名字镜像

# docker ps    // 查看正在运行的容器
# docker ps -a // 查看所有容器
# docker ps -a -q // 列出所有容器的ID
# docker kill container_id
# docker stop container_id  // 停止正在运行的容器
# docker rm container_id    // 删除容器

# docker service ls // 查看服务
# docker service create --replicas 1 --name service_name -p 8886:80 image_name
# docker service rm service_name // 直接停止并删除服务
# docker service update --publish-add 8080:80 --publish-rm 8088:8000 service_name