# Modern Full-Stack Student Management System

A responsive, full-stack **Student Management System** built with **Java Spring Boot 3**, **Spring Security (JWT)**, **Spring Data JPA**, **MySQL / H2 Database**, **HTML5**, **CSS3 (Glassmorphism design)**, **JavaScript (ES6)**, **Bootstrap 5**, and **Chart.js**.

---

## 🌟 Key Features

### 🔐 Authentication & Role Security
- **Role-Based Access Control**: Separate portals for **Admin** (`ROLE_ADMIN`) and **Student** (`ROLE_STUDENT`).
- **JWT Authentication**: Secure stateless token authentication.
- **Forgot Password**: Password reset with temporary security credential generation.
- **Change Password**: Change password functionality for active sessions.

### 🛡️ Admin Dashboard Features
- **Student CRUD**: Add, Update, Delete, Search, and Filter students by Name, USN, Department, Semester, Section, or Course.
- **Photo Upload**: Store and display profile photos for students.
- **Attendance Management**: Mark daily student attendance with percentage calculations.
- **Marks & Grades**: Record Internal, Assignment, Lab, and Final Exam marks with automatic Grade (A+, A, B, etc.) and GPA (4.0 scale) calculations.
- **Dashboard Analytics**:
  - **Total Students, Attendance %, Average GPA, Department counts**
  - **Chart.js Visualizations**: Gender split (Doughnut chart), Department breakdown (Bar chart).
- **Data Export**: Export student tables and reports directly to **Excel (.xlsx)** and **PDF**.
- **Activity Logs**: Track system user actions with timestamps.

### 🎓 Student Dashboard Features
- **Personal Profile**: View & edit personal contact details, guardian details, and address.
- **Digital Student ID Card**: Translucent Glassmorphism ID card with a generated **QR Code**.
- **Attendance Tracker**: View attendance history, present/absent breakdown, and monthly trends.
- **Academic Performance**: Detailed marks summary, calculated total score, grades, and overall GPA.
- **Class Timetable**: Weekly schedule calendar view.
- **Report Card PDF Download**: Export printable academic transcripts to PDF.

---

## 🛠️ Technology Stack

- **Backend**: Java 17+, Spring Boot 3.2.3, Spring MVC, Spring Data JPA, Spring Security, Hibernate ORM, JJWT.
- **Frontend**: HTML5, CSS3 (Glassmorphism design system & Dark/Light mode), JavaScript (ES6), Bootstrap 5.3, Chart.js, QRCode.js, jsPDF, SheetJS (XLSX).
- **Database**: MySQL 8.0+ (Primary) / H2 Embedded Database (Default for zero-setup execution).

---

## 📁 Project Structure

```
student-management-system/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/sms/
│       │   │   ├── StudentManagementSystemApplication.java
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/
│       │   │   ├── dto/
│       │   │   ├── security/
│       │   │   └── config/
│       │   └── resources/
│       │       └── application.yml
├── frontend/
│   ├── index.html               (Login & Landing Page)
│   ├── admin-dashboard.html     (Admin Management Portal)
│   ├── student-dashboard.html   (Student Self-Service Portal)
│   ├── css/
│   │   ├── style.css            (Design System & Glassmorphism)
│   │   └── dashboard.css        (Layout & Components)
│   └── js/
│       ├── config.js            (API Endpoints)
│       ├── auth.js              (Login & Passwords)
│       ├── admin.js             (Admin Controller)
│       ├── student.js           (Student Controller)
│       ├── charts.js            (Chart.js Data Viz)
│       ├── export.js            (PDF & Excel Exporters)
│       └── ui.js                (Theme & Toast Notifications)
└── database/
    ├── schema.sql               (MySQL Schema DDL)
    ├── data.sql                 (Seed Data DML)
    └── backup_restore.sql       (Database Backup & Recovery Guide)
```

---

## 🚀 Getting Started

### 1. Backend Setup & Launch

#### Prerequisites
- Java 17 or higher
- Maven (or use Maven wrapper)

#### Option A: Quick Start (H2 In-Memory Database)
By default, the Spring Boot application is configured to automatically launch with an in-memory **H2 Database** pre-seeded with sample Admin & Student records.

```bash
cd backend
mvn spring-boot:run
```
The REST API will start on `http://localhost:8080/api`.

#### Option B: MySQL Database Setup
1. Create a MySQL database named `student_db`:
   ```sql
   CREATE DATABASE student_db;
   ```
2. Import schema and seed data from `database/schema.sql` and `database/data.sql`:
   ```bash
   mysql -u root -p student_db < database/schema.sql
   mysql -u root -p student_db < database/data.sql
   ```
3. Update `backend/src/main/resources/application.yml` or set environment variables:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/student_db?useSSL=false&serverTimezone=UTC
       username: root
       password: your_mysql_password
       driver-class-name: com.mysql.cj.jdbc.Driver
     jpa:
       database-platform: org.hibernate.dialect.MySQL8Dialect
   ```

---

### 2. Frontend Setup & Access

Since the frontend is built using standard HTML5, CSS3, and JavaScript with CDN dependencies:

1. Open `frontend/index.html` in any standard web browser (Chrome, Edge, Firefox), or serve via VS Code Live Server / static web server:
   ```bash
   npx serve frontend
   ```
2. **Demo Credentials**:
   - **Admin Login**: Username: `admin` | Password: `admin123`
   - **Student Login**: USN: `1CS21001` | Password: `student123`

---

## 📡 REST API Documentation

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Public | Authenticate user & return JWT token |
| `/api/auth/forgot-password` | `POST` | Public | Reset forgotten password |
| `/api/auth/change-password` | `POST` | Auth | Change account password |
| `/api/admin/students` | `GET` | Admin | Get/Search/Filter student records |
| `/api/admin/students` | `POST` | Admin | Register new student record |
| `/api/admin/students/{id}` | `PUT` | Admin | Update student details |
| `/api/admin/students/{id}` | `DELETE` | Admin | Delete student record |
| `/api/admin/students/{id}/photo` | `POST` | Admin | Upload student profile photo |
| `/api/admin/attendance` | `POST` | Admin | Record attendance entry |
| `/api/admin/marks` | `POST` | Admin | Save marks & compute GPA/grade |
| `/api/admin/dashboard/stats` | `GET` | Admin | Get analytics metrics for charts |
| `/api/student/profile` | `GET` | Student | View student profile & ID details |
| `/api/student/profile` | `PUT` | Student | Edit student personal details |
| `/api/student/attendance` | `GET` | Student | View attendance history & summary |
| `/api/student/marks` | `GET` | Student | View marks breakdown & overall GPA |
| `/api/student/timetable` | `GET` | Student | View weekly class schedule |

---

## 📄 License
This project is licensed under the MIT License.
"# StudentManagementSystem" 
