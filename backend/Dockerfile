FROM openjdk:17-jdk-alpine
ARG JAR_FILE=target/job-track-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} /docker/job-track-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/docker/job-track-0.0.1-SNAPSHOT.jar"]
