# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the application skipping tests to speed up deployment
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/backend-sql-0.0.1-SNAPSHOT.jar app.jar

# Render sets the PORT environment variable automatically
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
