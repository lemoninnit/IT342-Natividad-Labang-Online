# Labang Online - Mobile Application

**Phase 2: Mobile Development** - iOS/Android Application for Barangay Labangon Community Services

## Overview

Labang Online is a mobile application that serves as a digital hub for residents of Barangay Labangon. The mobile app connects to the Phase 1 backend API and provides key features for user registration, authentication, and community engagement.

## Features

### 1. User Registration
- **Purpose**: Allow new residents to create accounts in the system
- **Fields**:
  - First Name (required)
  - Last Name (required)
  - Date of Birth (required)
  - Gender (Male/Female/Other)
  - Street/House Number (required)
  - Purok (required)
  - Phone Number (required, must be valid Philippine format)
  - Email (required, must be unique)
  - Password (required, minimum 8 characters with uppercase and number)
  - Password Confirmation (required)

- **Validation**:
  - All required fields must be filled
  - Email format validation
  - Philippine phone number format (09XXXXXXXXX)
  - Password strength requirements
  - Passwords must match
  - Email and phone uniqueness checked against backend

- **API Integration**: 
  - Endpoint: `POST /api/auth/register`
  - Handles responses: SUCCESS (OK), EMAIL_EXISTS, PHONE_EXISTS

### 2. User Login
- **Purpose**: Authenticate registered users
- **Fields**:
  - Email (required)
  - Password (required)

- **Validation**:
  - Email format validation
  - Password minimum length check
  - Backend authentication validation

- **API Integration**:
  - Endpoint: `POST /api/auth/login`
  - Returns: User object on success, error on failure
  - Handles responses: SUCCESS (OK), INVALID_CREDENTIALS

### 3. Dashboard
- **Purpose**: Post-login screen showing community information
- **Features**:
  - User greeting
  - Logout button
  - Announcements section (placeholder for future implementation)
  - About Labangon section

## Project Structure

```
mobile/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/edu/cit/natividad/labangonline/
│   │   │   │   ├── LabangOnlineApplication.kt       (Main Activity - Entry Point)
│   │   │   │   ├── api/
│   │   │   │   │   ├── ApiClient.kt                  (Retrofit Client Setup)
│   │   │   │   │   ├── AuthApiService.kt             (API Interface)
│   │   │   │   │   └── models/
│   │   │   │   │       └── ApiModels.kt              (Request/Response Models)
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginActivity.kt              (Login Screen)
│   │   │   │   │   └── RegisterActivity.kt           (Registration Screen)
│   │   │   │   └── dashboard/
│   │   │   │       └── DashboardActivity.kt          (Dashboard Screen)
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── activity_main.xml             (Main/Splash Screen)
│   │   │   │   │   ├── activity_login.xml            (Login UI)
│   │   │   │   │   ├── activity_register.xml         (Registration UI)
│   │   │   │   │   └── activity_dashboard.xml        (Dashboard UI)
│   │   │   │   ├── values/
│   │   │   │   │   ├── colors.xml
│   │   │   │   │   ├── dimens.xml
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   └── themes.xml
│   │   │   │   └── xml/
│   │   │   │       ├── backup_rules.xml
│   │   │   │       └── data_extraction_rules.xml
│   │   │   └── AndroidManifest.xml
│   │   └── test/
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── settings.gradle
└── gradle.properties
```

## Technology Stack

### Frontend (Mobile)
- **Language**: Kotlin
- **UI Framework**: Android XML Layouts
- **Material Design**: Material Components Library
- **API Communication**: Retrofit 2 + GSON
- **HTTP Client**: OkHttp 3
- **Async Operations**: Coroutines
- **Minimum SDK**: API 24 (Android 7.0)
- **Target SDK**: API 34 (Android 14)

### Backend Integration
- **Base URL**: `http://10.0.2.2:8080/api/` (emulator localhost mapping)
- **API Version**: RESTful JSON API
- **Authentication**: Email/Password based

## Dependencies

```gradle
// Core AndroidX
androidx.core:core-ktx:1.10.1
androidx.appcompat:appcompat:1.6.1

// UI Components
com.google.android.material:material:1.9.0
androidx.constraintlayout:constraintlayout:2.1.4

// Networking
com.squareup.retrofit2:retrofit:2.9.0
com.squareup.retrofit2:converter-gson:2.9.0
com.squareup.okhttp3:okhttp:4.11.0
com.squareup.okhttp3:logging-interceptor:4.11.0

// Async & Lifecycle
androidx.lifecycle:lifecycle-runtime-ktx:2.6.1
androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.1
org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.1

// Data Storage
androidx.datastore:datastore-preferences:1.0.0
```

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "dob": "1990-01-15",
  "gender": "Male",
  "street": "123 Main St",
  "purok": "1",
  "barangay": "Labangon",
  "city": "Cebu City",
  "province": "Cebu",
  "phone": "09123456789",
  "email": "john@example.com",
  "password": "Password123"
}

Response (SUCCESS):
{
  "status": "OK"
}

Response (EMAIL_EXISTS):
{
  "status": "EMAIL_EXISTS"
}

Response (PHONE_EXISTS):
{
  "status": "PHONE_EXISTS"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "Password123"
}

Response (SUCCESS):
{
  "status": "OK",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "09123456789",
    "role": "resident",
    "active": true,
    "barangay": "Labangon",
    "city": "Cebu City",
    "province": "Cebu"
  }
}

Response (INVALID):
{
  "status": "INVALID_CREDENTIALS"
}
```

## Installation & Build

### Prerequisites
- Android Studio (Iguana 2023.2.1)
- JDK 11+
- Gradle 7.0+
- Android SDK 34

### Build Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/IT342-Lastname-AppName.git
   cd IT342-Lastname-AppName/mobile
   ```

2. **Build the Project**
   ```bash
   ./gradlew clean build
   ```

3. **Run on Emulator**
   ```bash
   ./gradlew installDebug
   ```

4. **Run Selected Tests**
   ```bash
   ./gradlew test
   ```

## Running the Application

### Emulator Configuration
- The app is configured to connect to `http://10.0.2.2:8080/api/`
- This is the special Android emulator address for localhost
- Ensure the backend is running before launching the app

### Usage Flow

1. **Launch App** → Main landing page with Login/Register options
2. **New User** → Click "Create Account" → Fill registration form → Submit
3. **Existing User** → Click "Login" → Enter credentials → Access Dashboard
4. **Dashboard** → View user profile, announcements → Logout button to return to main

## Validation Logic

### Registration Validation
- **Names**: Non-empty, alphanumeric with spaces
- **DOB**: Valid date format, age between 1-120 years
- **Phone**: Matches Philippine format (09XXXXXXXXX or +6391XXXXXXXXX)
- **Email**: Valid email format, must be unique
- **Password**: Min 8 chars, at least 1 uppercase, 1 number
- **Backend checks**: Email and phone uniqueness

### Login Validation
- **Email**: Valid format
- **Password**: Non-empty, minimum length

## Error Handling

The application handles various error scenarios:

1. **Network Errors**: Display user-friendly error messages
2. **API Errors**: 
   - 409 Conflict: Email/Phone already exists
   - 401 Unauthorized: Invalid credentials
3. **Validation Errors**: Real-time field validation with error messages
4. **Timeout Handling**: 30-second connection timeout

## Security Considerations

- Passwords are hashed on backend (BCrypt)
- HTTPS recommended for production (update BASE_URL in ApiClient.kt)
- Input validation on both client and server
- No sensitive data stored in plaintext locally

## Database Schema (Backend References)

### User Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) UNIQUE,
  date_of_birth DATE,
  gender VARCHAR(20),
  street VARCHAR(255),
  purok VARCHAR(100),
  barangay VARCHAR(100),
  city VARCHAR(100),
  province VARCHAR(100),
  role VARCHAR(50) DEFAULT 'resident',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Future Enhancements

- [ ] Announcements Feed Integration
- [ ] Push Notifications
- [ ] User Profile Management
- [ ] Offline Support with Database Caching
- [ ] Biometric Authentication
- [ ] Services/Forms Integration
- [ ] Multi-language Support
- [ ] Web Version Parity

## Testing

### Unit Tests
```bash
./gradlew test
```

### UI Tests
```bash
./gradlew connectedAndroidTest
```

## Troubleshooting

### Common Issues

1. **Cannot connect to backend**
   - Verify backend is running on port 8080
   - Check API endpoint in ApiClient.kt
   - Ensure no firewall blocking connections

2. **Login fails**
   - Verify email/password are correct
   - Check backend logs for authentication errors
   - Ensure user was registered successfully

3. **Build fails**
   - Run `./gradlew clean`
   - Check Java/JDK version (11+ required)
   - Verify Android SDK version compatibility

## Author

**Student**: [Your Name]
**Course**: IT342 - Software Engineering
**Institution**: [Your Institution]
**Date**: Phase 2 - March 2026

## License

This project is part of the academic curriculum and is provided as-is for educational purposes.

## Support

For issues or questions, please refer to the project documentation or contact the instructor.

---

**Note**: This mobile application is designed to work in conjunction with the Phase 1 backend. Ensure the backend is properly deployed and configured before running the mobile app.
