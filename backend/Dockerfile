FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy only the real Spring Boot project folder
COPY demo/demo /app

# Build the project
RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["sh", "-c", "java -jar target/*.jar"]