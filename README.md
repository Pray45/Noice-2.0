
# Authentication System

The Authentication System is a secure, full-stack user authentication solution built with a modern tech stack including **Node.js**, **Express**, **MongoDB**, **Zod**, **Nodemailer**, **Passport.js**, and a **Next.js** frontend. It supports traditional email-password authentication, OTP verification, and OAuth integration (Google and GitHub).



## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB with Mongoose               |
| Auth      | JWT, Nodemailer, Passport.js        |
| Frontend  | Next.js, React, Tailwind CSS        |
| Validation| Zod                                 |
| Tools     | dotenv, cors, cookie-parser         |



##  API Endpoints

| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| POST   | `/api/auth/register`     | Register new user        |
| POST   | `/api/auth/login`        | Login user               |
| POST   | `/api/auth/send-otp`     | Send OTP to email        |
| POST   | `/api/auth/verify-otp`   | Verify email OTP         |
| GET    | `/api/auth/github`       | GitHub OAuth Login       |
| GET    | `/api/auth/google`       | Google OAuth Login       |
| POST    | `/api/auth/logout`       | Logout and clear token   |




## Setup Instructions

### Prerequisites

- Node.js >= 18.x
- MongoDB (Local or Cloud)
- Gmail for Nodemailer (or any SMTP provider)
- GitHub & Google OAuth credentials

---

### 1. Clone the Repository

```bash
git clone https://github.com/Pray45/Complete-Auth.git
cd server
```

## 2. Setup Environment Variables
### Create .env in /server:

```bash

PORT = 5000

MONGO_URI  = your mongodb uri
JWT_SECRET = your_jwt_secret
EMAIL_USER = your_email@gmail.com
EMAIL_PASS = your_email_app_password
CLIENT_URL = http://localhost:3000

GITHUB_CLIENT_ID = your_github_id
GITHUB_CLIENT_SECRET = your_github_secret

GOOGLE_CLIENT_ID = your_google_id
GOOGLE_CLIENT_SECRET = your_google_secret
```

## 3. Install Dependencies
```bash

cd server
npm install

cd client 
npm install

```

## 4. Run the Project
``` bash
npm start
Frontend

npm run dev
API Endpoints
```
