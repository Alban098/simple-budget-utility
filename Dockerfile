FROM eclipse-temurin:21-jdk-alpine
ARG JAR_FILE=./api/build/libs/api.jar
COPY ${JAR_FILE} app.jar
COPY ./entrypoint.sh entrypoint.sh
RUN apk update
RUN apk add zip  unzip
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]