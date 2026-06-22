Start application
mvn spring-boot:run

Build application
mvn clean package

Docker guideline
Create network:
docker network create da3203-network

Start MySQL in da3203-network
docker run --network da3203-network --name mysqlDA -p 3306:3306 -e MYSQL_ROOT_PASSWORD=3223 -d mysql:oracle

Run your application in da3203-network
docker run --name ams_server --network da3203-network -p 8080:8080 -e DBMS_CONNECTION=jdbc:mysql://mysqlDA:3306/ams_docker_db ams:0.0.1