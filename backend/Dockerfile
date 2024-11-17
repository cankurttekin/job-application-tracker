# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package

# Stage 2: Run the application
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar backend.jar

# COPY certificate.p12 certificate.p12

# Expose the port Spring Boot will run on
EXPOSE 8080
# EXPOSE 443

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "backend.jar"]
#ENTRYPOINT ["java", "-jar", "backend.jar", "--server.ssl.enabled=true", "--server.ssl.key-store=certificate.p12", "--server.ssl.key-store-password=${KEY_STORE_PASS}", "--server.ssl.key-store-type=PKCS12", "--server.ssl.key-store-alias=${KEY_STORE_ALIAS}"]

