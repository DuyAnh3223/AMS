#Stage 1: build
# Start with a maven image that includes JDK 21

FROM maven:4.0.0-rc-5-amazoncorretto-21 AS build

#Copy source code and pom.xml file to /app folder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build source code with maven

RUN mvn package -DskipTests

###Stage 2: create image
# Start with Amazone Correto JDK 21
FROM amazoncorretto:21.0.11

# Set working folder to App and copy compiled file from above step
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

#command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]