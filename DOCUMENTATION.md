
# StudySaathi - Technical Documentation

**Version:** 1.0.0  
**Date:** March 2026  
**Author:** [Sirjan Karki]  
**Institution:** Tribhuvan University

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Proposed Solution](#proposed-solution)
4. [System Architecture](#system-architecture)
5. [Technology Stack](#technology-stack)
6. [Features](#features)
7. [Database Schema](#database-schema)
8. [API Documentation](#api-documentation)
9. [User Interface](#user-interface)
10. [Security Features](#security-features)
11. [Installation Guide](#installation-guide)
12. [Future Enhancements](#future-enhancements)

---

## 1. Executive Summary

StudySaathi is a web-based Question and Answer platform specifically designed for Tribhuvan University (TU) students. The platform addresses the unique challenges faced by TU students by providing a curriculum-mapped, faculty-organized space where students can ask questions, share knowledge, and help each other succeed academically.

**Key Statistics:**
- Multi-faculty support (8+ faculties)
- Semester-wise organization (1-8 semesters)
- Real-time collaboration between students
- AI-ready architecture for future enhancements

---

## 2. Problem Statement

### 2.1 Current Challenges

TU students across all faculties face several academic challenges:

1. **Generic Platforms Don't Fit:** Stack Overflow focuses on professional programming, not academic syllabi
2. **Disorganized Social Media:** Facebook groups lack structure, answers get lost in threads
3. **No Curriculum Mapping:** Existing platforms don't understand TU's faculty/semester structure
4. **Fear of Judgment:** Students hesitate to ask "basic" questions publicly
5. **Faculty Isolation:** CSIT students can't easily help BBS students and vice versa

### 2.2 Target Audience

- **Primary:** Tribhuvan University students (All faculties)
- **Secondary:** TU faculty members, teaching assistants
- **Geographic:** Nepal (with potential for expansion)

---

## 3. Proposed Solution

### 3.1 Core Concept

A Stack Overflow-style platform with TU-specific features:

- **Curriculum Integration:** Questions organized by faculty → semester → subject
- **Peer-to-Peer Learning:** Students helping students in their own context
- **Quality Control:** Voting system highlights best answers
- **Gamification:** Reputation points and badges encourage participation
- **Anonymous Option:** Students can ask without fear of judgment

### 3.2 Unique Value Proposition

| Feature | StudySaathi | Stack Overflow | Facebook Groups |
|---------|-------------|----------------|-----------------|
| TU Curriculum Mapped | ✅ | ❌ | ❌ |
| Organized by Semester | ✅ | ❌ | ❌ |
| Multi-Faculty Support | ✅ | ❌ | ❌ |
| Structured Q&A | ✅ | ✅ | ❌ |
| Voting System | ✅ | ✅ | ❌ |
| Anonymous Posting | ✅ | ❌ | ✅ |
| Search & Filter | ✅ | ✅ | ⚠️ |

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌─────────────────┐
│   React SPA     │  ← Frontend (Vite + React)
│  (Port 5173)    │
└────────┬────────┘
         │ HTTP/REST API
         │ (Axios)
         ▼
┌─────────────────┐
│  Django REST    │  ← Backend API
│  Framework      │
│  (Port 8000)    │
└────────┬────────┘
         │ ORM
         ▼
┌─────────────────┐
│   SQLite DB     │  ← Database
└─────────────────┘
```

### 4.2 Application Flow

```
User Registration Flow:
1. User fills signup form → React validates
2. POST /api/auth/signup/ → Django generates OTP
3. OTP sent to email (console in dev)
4. User enters OTP → POST /api/auth/verify-otp/
5. Django creates user + returns JWT token
6. Frontend stores token → User logged in

Question Posting Flow:
1. User fills question form → React validates
2. POST /api/questions/ (with JWT header)
3. Django creates question in DB
4. Returns question object
5. React updates UI

Voting Flow:
1. User clicks upvote → React checks auth
2. POST /api/questions/:id/vote/
3. Django toggles vote in DB
4. Returns updated count
5. React updates UI
```

---

## 5. Technology Stack

### 5.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Library |
| Vite | 5.0.0 | Build Tool |
| React Router | 6.20.0 | Client-side routing |
| Axios | 1.6.0 | HTTP client |
| Tailwind CSS | 3.4.0 | Styling |
| Lucide React | 0.300.0 | Icons |
| React Hot Toast | 2.4.1 | Notifications |

**Why React?**
- Component-based architecture for reusability
- Virtual DOM for performance
- Large ecosystem and community support

**Why Vite?**
- Faster than Create React App
- Hot Module Replacement (HMR)
- Modern build tool

### 5.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.10+ | Programming language |
| Django | 4.2 | Web framework |
| Django REST Framework | 3.14.0 | API framework |
| djangorestframework-simplejwt | 5.3.0 | JWT authentication |
| django-cors-headers | 4.3.0 | CORS handling |
| SQLite | 3 | Database (dev) |

**Why Django?**
- Batteries-included framework
- Built-in admin panel
- ORM for database abstraction
- Security features out-of-the-box

### 5.3 Authentication

- **JWT (JSON Web Tokens)** for stateless authentication
- **Email OTP Verification** for account security
- **Session caching** for OTP temporary storage

---

## 6. Features

### 6.1 User Features

#### Authentication
- Email/Password registration
- OTP email verification (6-digit code)
- JWT-based login
- Profile management

#### Questions
- Create questions with:
  - Title (min 15 characters)
  - Detailed description
  - Faculty selection
  - Semester selection
  - Subject (optional)
  - Tags (up to 5)
  - Anonymous posting option
- Edit own questions
- Delete own questions
- View question details
- Vote on questions (upvote/downvote)

#### Answers
- Post answers to questions
- Vote on answers
- Accept answers (question author only)
- Markdown-style formatting support:
  - **Bold text** with `**text**`
  - Code blocks with ` ```code``` `

#### Search & Discovery
- Full-text search across:
  - Question titles
  - Question content
  - Tags
  - Subjects
- Filter by:
  - Faculty
  - Semester
  - Status (Solved/Unsolved)
- Sort by:
  - Newest
  - Trending (most voted)
  - Unanswered
  - Most voted

#### User Dashboard
- Personal statistics:
  - Questions asked
  - Answers given
  - Upvotes received
  - Reputation score
- My questions list
- Activity history

### 6.2 Admin Features

- Django Admin Panel
- User management
- Content moderation
- Analytics dashboard

---

## 7. Database Schema

### 7.1 User Model


User (AbstractUser)
├── id (PK, AutoField)
├── email (EmailField, unique) ← Username field
├── full_name (CharField, max_length=255)
├── faculty (CharField, choices=FACULTIES)
├── semester (CharField, choices=1-8)
├── bio (TextField, optional)
├── reputation (IntegerField, default=0)
├── is_verified (BooleanField, default=False)
├── is_active (BooleanField, default=True)
├── date_joined (DateTimeField, auto_now_add)
└── last_login (DateTimeField, auto_now)
```

### 7.2 Question Model


Question
├── id (PK, AutoField)
├── title (CharField, max_length=500)
├── content (TextField)
├── author (FK → User, CASCADE)
├── faculty (CharField, choices)
├── semester (CharField, choices)
├── subject (CharField, optional)
├── tags (JSONField, array)
├── is_anonymous (BooleanField, default=False)
├── views (IntegerField, default=0)
├── created_at (DateTimeField, auto_now_add)
└── updated_at (DateTimeField, auto_now)
```

### 7.3 Answer Model


Answer
├── id (PK, AutoField)
├── question (FK → Question, CASCADE)
├── author (FK → User, CASCADE)
├── content (TextField)
├── is_accepted (BooleanField, default=False)
├── is_ai_generated (BooleanField, default=False)
├── created_at (DateTimeField, auto_now_add)
└── updated_at (DateTimeField, auto_now)
```

### 7.4 Vote Model


Vote
├── id (PK, AutoField)
├── user (FK → User, CASCADE)
├── question (FK → Question, optional)
├── answer (FK → Answer, optional)
├── vote_type (CharField: 'upvote' | 'downvote')
└── created_at (DateTimeField, auto_now_add)

Constraints:
- UNIQUE(user, question)
- UNIQUE(user, answer)
```

### 7.5 OTP Model


OTP
├── id (PK, AutoField)
├── email (EmailField)
├── otp (CharField, max_length=6)
├── is_used (BooleanField, default=False)
└── created_at (DateTimeField, auto_now_add)

Validation:
- Valid for 10 minutes
- Single use only
```

### 7.6 Entity Relationship Diagram

```
┌──────────┐         ┌──────────────┐         ┌──────────┐
│   User   │────────>│   Question   │<────────│   Vote   │
│          │ 1     * │              │ *     1 │          │
└────┬─────┘         └──────┬───────┘         └──────────┘
     │                      │
     │ 1                    │ 1
     │                      │
     │ *                    │ *
     │               ┌──────▼───────┐
     └──────────────>│    Answer    │
                     │              │
                     └──────────────┘
```

---

## 8. API Documentation

### 8.1 Authentication Endpoints

#### POST /api/auth/signup/
Register a new user.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "faculty": "CSIT",
  "semester": "4"
}
```

**Response (200):**
```json
{
  "message": "OTP sent to your email",
  "email": "john@example.com",
  "otp": "123456"
}
```

---

#### POST /api/auth/verify-otp/
Verify OTP and create account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "faculty": "CSIT",
    "semester": "4"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJh...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

---

#### POST /api/auth/login/
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "access": "...",
  "refresh": "..."
}
```

---

### 8.2 Question Endpoints

#### GET /api/questions/
List all questions with filters.

**Query Parameters:**
- `search` - Search term
- `faculty` - Filter by faculty
- `semester` - Filter by semester
- `sort` - newest | trending | unanswered | most-voted

**Response (200):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "How to implement Binary Search?",
      "content": "I need help...",
      "author": {
        "id": 1,
        "full_name": "John Doe",
        "faculty": "CSIT"
      },
      "faculty": "CSIT",
      "semester": "4",
      "subject": "Data Structures",
      "tags": ["algorithm", "search"],
      "upvotes": 5,
      "answers_count": 2,
      "views": 45,
      "has_accepted_answer": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### POST /api/questions/
Create a new question (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "How to implement Binary Search?",
  "content": "I need help understanding...",
  "faculty": "CSIT",
  "semester": "4",
  "subject": "Data Structures",
  "tags": ["algorithm", "search"],
  "is_anonymous": false
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "How to implement Binary Search?",
  ...
}
```

---

#### GET /api/questions/:id/
Get question details with answers.

**Response (200):**
```json
{
  "id": 1,
  "title": "...",
  "content": "...",
  "answers": [
    {
      "id": 1,
      "author": {...},
      "content": "Here's how...",
      "upvotes": 3,
      "is_accepted": true,
      "created_at": "..."
    }
  ]
}
```

---

#### POST /api/questions/:id/vote/
Vote on a question.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "vote_type": "upvote"
}
```

**Response (200):**
```json
{
  "message": "Vote added",
  "vote_type": "upvote"
}
```

---

### 8.3 Answer Endpoints

#### POST /api/questions/:id/answers/
Post an answer.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "content": "Here's the solution..."
}
```

**Response (201):**
```json
{
  "id": 1,
  "author": {...},
  "content": "...",
  "upvotes": 0,
  "is_accepted": false
}
```

---

#### POST /api/answers/:id/accept/
Accept an answer (question author only).

**Response (200):**
```json
{
  "message": "Answer accepted"
}
```

---

## 9. User Interface

### 9.1 Design System

**Color Palette:**
- Primary: `#667eea` (Purple)
- Accent: `#764ba2` (Dark Purple), `#4facfe` (Cyan)
- Background: `#0f0f1a` (Dark)
- Text: `#e2e8f0` (Light Gray)
- Cards: Glassmorphism effect with `rgba(255,255,255,0.03)`

**Typography:**
- Font Family: Inter
- Headings: 700-800 weight
- Body: 400-500 weight

**Components:**
- Glassmorphism cards
- Gradient buttons
- Dark-themed inputs with glow on focus
- Badge system for faculties/semesters
- Toast notifications

### 9.2 Key Pages

1. **Landing Page (Guest)**
   - Hero section with CTA
   - Feature showcase
   - Recent questions preview

2. **Home (Logged In)**
   - Personalized feed
   - Quick stats
   - Faculty-specific questions

3. **Questions List**
   - Filter panel
   - Sort tabs
   - Question cards with metadata

4. **Question Detail**
   - Full question with voting
   - Answers list
   - Answer posting form

5. **Ask Question**
   - Multi-step form
   - Tag input
   - Anonymous option

6. **Dashboard**
   - User statistics
   - My questions
   - Activity feed
   - Badges

7. **Profile**
   - Editable profile info
   - Stats overview

---

## 10. Security Features

### 10.1 Authentication Security

- **Password Hashing:** Django's PBKDF2 algorithm
- **JWT Tokens:** Short-lived access tokens (7 days)
- **OTP Verification:** 6-digit codes, 10-minute expiry
- **CORS Protection:** Whitelist specific origins

### 10.2 API Security

- **Token-based Authentication:** Required for write operations
- **Permission Classes:** `IsAuthenticatedOrReadOnly`
- **CSRF Protection:** Enabled for state-changing operations
- **Rate Limiting:** (Future enhancement)

### 10.3 Input Validation

- **Frontend:** React form validation
- **Backend:** Django REST Framework serializers
- **SQL Injection:** Protected by Django ORM
- **XSS:** React's automatic escaping

---

## 11. Installation Guide

### 11.1 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- Git
- Code editor (VS Code recommended)

### 11.2 Backend Setup


# Clone repository
git clone https://github.com/YOUR-USERNAME/studysaathi.git
cd studysaathi/studysaathi-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend now running at `http://localhost:8000`

### 11.3 Frontend Setup


# Open new terminal
cd studysaathi/studysaathi-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend now running at `http://localhost:5173`

### 11.4 Accessing the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin

---

## 12. Future Enhancements

### 12.1 Phase 2 Features

- **AI Answer Generation:** Integration with Google Gemini API
- **Real-time Notifications:** WebSocket for instant updates
- **File Attachments:** Upload images, PDFs, code files
- **Markdown Editor:** Rich text editing with preview
- **Advanced Search:** Elasticsearch integration

### 12.2 Phase 3 Features

- **Mobile App:** React Native version
- **Email Notifications:** Daily digest, answer alerts
- **Gamification:** Levels, achievements, leaderboards
- **Study Groups:** Private groups for specific subjects
- **Live Chat:** Real-time doubt solving

### 12.3 Scalability Plans

- **Database:** Migrate to PostgreSQL
- **Caching:** Redis for session management
- **CDN:** Static asset delivery
- **Load Balancer:** Horizontal scaling
- **Monitoring:** Sentry for error tracking

---

## 13. Conclusion

StudySaathi demonstrates a full-stack web built with modern technologies, addressing real-world educational challenges faced by Tribhuvan University students. The platform combines robust backend architecture with an intuitive frontend, creating a scalable and maintainable solution.

**Key Achievements:**
- ✅ Complete authentication system with OTP verification
- ✅ Full CRUD operations for questions and answers
- ✅ Real-time voting system
- ✅ Advanced search and filtering
- ✅ Responsive, modern UI
- ✅ RESTful API architecture
- ✅ Security best practices implemented

The platform is ready for deployment and can serve as a foundation for building a comprehensive academic support ecosystem for TU students.

---

**Document Version:** 1.0.0  
**Last Updated:** March 2026  
**Author:** Sirjan Karki  

