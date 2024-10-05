FROM openjdk:17-jdk-alpine
LABEL authors="cankurttekin"
COPY target/job-track-0.0.1-SNAPSHOT.jar docker/job-track-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/docker/job-track-0.0.1-SNAPSHOT.jar"]