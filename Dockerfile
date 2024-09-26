FROM eclipse-temurin:21-jdk-alpine
ARG JAR_FILE=./api.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]