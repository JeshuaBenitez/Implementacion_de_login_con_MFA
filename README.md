# OTP-Jeshua — Email-Based OTP Authentication System

## 🧩 Project Description

**OTP-Jeshua** is a complete authentication system that implements **two-step verification (2FA)** using **email-based One-Time Passwords (OTP)**.  
The project consists of two main components:

- **Backend (Spring Boot + PostgreSQL):**  
  Handles user registration, login, OTP generation, validation, and email delivery.

- **Frontend (Vite + React + Tailwind CSS):**  
  Provides a modern user interface for registration, login, and OTP verification.

This project simulates a professional login system where a temporary **6-digit code** is sent to the user’s email for secure authentication.  
It was built as part of a practical exercise for implementing secure login flows in web applications.

---

## ⚙️ Instructions to Run the System

### 🖥 Backend Setup (Spring Boot)

#### Requirements
- Java **21+**
- Maven **3.9+**
- PostgreSQL **14+**

#### Steps

1. **Create the database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE loginmfa;
   \q
