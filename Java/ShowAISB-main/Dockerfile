FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew clean bootJar

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
