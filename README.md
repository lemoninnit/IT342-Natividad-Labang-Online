# ServiLine: Barangay Labangon Service Portal

ServiLine is a digitized service portal designed for the residents and administrators of Barangay Labangon. It enables residents to file reports, request official certificates, make payments via GCash, and view community announcements on both web and mobile platforms.

---

## 🚀 Getting Started

Follow the instructions below to set up and run each part of the system.

### 1. 🖥️ Web Frontend (React + Vite)
The web client handles the resident portal interfaces, landing page, and admin dashboards.

```bash
# Navigate to the web directory
cd web

# Install required dependencies
npm install

# Start the local development server
npm run dev
```
*The web app will run locally on `http://localhost:5173` (or the next available port).*

### 2. ⚙️ Backend Server (Spring Boot)
The backend REST API handles business logic, security, and persistence.

#### Prerequisites
- Java JDK 17 or higher
- Maven 3.x+
- A running PostgreSQL database (e.g. Neon or local instance)

```bash
# Navigate to the backend directory
cd backend

# Run the Spring Boot application using Maven
./mvnw spring-boot:run
```
*The backend API will listen on `http://localhost:8080`.*

### 3. 📱 Mobile Application (Android + Kotlin)
A native Android client for residents on the go.

#### Setting up the API endpoint:
1. Open the project in Android Studio.
2. Locate the API client configuration file:
   `mobile/app/src/main/java/edu/cit/natividad/serviline/api/ApiClient.kt`
3. Update the `SERVER_IP` constant with your machine's local IPv4 address (e.g., `192.168.1.XX`):
   ```kotlin
   private const val SERVER_IP = "192.168.1.25" // Replace with your local IPv4 address
   ```

#### Building the APK:
```bash
# Navigate to the mobile directory
cd mobile

# Compile and package the debug APK
./gradlew assembleDebug
```
*The generated APK will be outputted to `mobile/app/build/outputs/apk/debug/app-debug.apk`.*

---

## ✨ Features
- **Profile Management**: View and update resident profile details securely.
- **Certificate Requests**: Submit requests for Barangay Clearance, Certificate of Indigency, and Residency Certificates.
- **GCash Integration**: Fast and easy mock GCash payment flow.
- **Incident Reporting**: File incident reports and view their real-time validation status.
- **Announcements Feed**: Keep up-to-date with local barangay news.
