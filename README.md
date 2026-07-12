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
1. Navigate to the `mobile` directory.
2. Open the `local.properties` file located at `mobile/local.properties` (this file contains local SDK configurations and project properties).
3. Look for the `api.url` property. You can comment/uncomment the desired endpoint using `#`:
   - **Production (Render):**
     ```properties
     api.url=https://serviline-backend.onrender.com/api/
     ```
   - **Local Emulator (Android Studio):** Use the loopback IP `10.0.2.2` which points to your host computer's localhost.
     ```properties
     api.url=http://10.0.2.2:8080/api/
     ```
   - **Local Physical Device (Wi-Fi):** Use your computer's local network IP address (e.g., `http://192.168.1.XX:8080/api/`). Ensure your phone and computer are connected to the same Wi-Fi network.
     ```properties
     api.url=http://192.168.1.41:8080/api/
     ```
4. Clean and rebuild the project in Android Studio (or run `./gradlew clean` then build) so Gradle can regenerate the `BuildConfig` class with the updated URL.

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
