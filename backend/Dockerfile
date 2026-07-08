# ==========================================
# STAGE 1: Build the Maven application
# ==========================================
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app

# Copy Maven wrapper files and pom.xml first to cache dependencies
COPY backend/.mvn/ .mvn
COPY backend/mvnw backend/pom.xml ./
RUN ./mvnw dependency:go-offline -B

# Copy the actual application source code
COPY backend/src ./src

# Build the application, skipping unit tests to speed up deploy
RUN ./mvnw clean package -DskipTests -B

# ==========================================
# STAGE 2: Lightweight JRE Runtime environment
# ==========================================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Run as a non-root system user for production security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy build artifact from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port and define entrypoint
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
