# Course Enrollment System

## Overview
The enrollment system now uses a MySQL database to track which courses users have enrolled in, replacing the previous localStorage-only approach.

## Database Structure

### Enrollments Table
```sql
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  course_id VARCHAR(100) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  course_category VARCHAR(100),
  course_level VARCHAR(50),
  course_description TEXT,
  course_thumbnail TEXT,
  course_instructor VARCHAR(255),
  course_lessons INT DEFAULT 0,
  progress INT DEFAULT 0,
  completed_lessons INT DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (user_email, course_id),
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
)
```

## API Endpoints

### 1. Get User's Enrolled Courses
- **Method**: GET
- **Endpoint**: `/api/enrollments?email={userEmail}`
- **Response**: Array of enrolled courses with progress data

### 2. Enroll in a Course
- **Method**: POST
- **Endpoint**: `/api/enrollments`
- **Body**:
```json
{
  "userEmail": "user@example.com",
  "courseId": "course-1",
  "courseTitle": "Complete English Grammar Mastery",
  "courseCategory": "Grammar",
  "courseLevel": "Intermediate",
  "courseDescription": "Master all essential grammar rules...",
  "courseThumbnail": "https://...",
  "courseInstructor": "Dr. Sarah Johnson",
  "courseLessons": 48
}
```
- **Response**: 
  - 201: Successfully enrolled
  - 409: Already enrolled

### 3. Unenroll from a Course
- **Method**: DELETE
- **Endpoint**: `/api/enrollments/{courseId}`
- **Body**:
```json
{
  "email": "user@example.com"
}
```

### 4. Update Course Progress
- **Method**: PUT
- **Endpoint**: `/api/enrollments/{courseId}/progress`
- **Body**:
```json
{
  "email": "user@example.com",
  "progress": 45,
  "completedLessons": 12
}
```

## Frontend Implementation

### HomePage.tsx - Enrollment
When users click "Enroll Now":
1. Checks if user is logged in
2. Sends POST request to `/api/enrollments`
3. Handles duplicate enrollments (409 status)
4. Shows success/error alerts

### App.tsx - Dashboard
The dashboard now:
1. Fetches enrolled courses from database on load
2. Shows loading state while fetching
3. Displays courses with progress bars
4. Provides "Unenroll" button with confirmation
5. Shows empty state when no courses enrolled

## Features

✅ **Database Persistence**: Courses are stored in MySQL, not localStorage
✅ **Duplicate Prevention**: Unique constraint prevents duplicate enrollments
✅ **Cascade Delete**: Enrollments are removed when user deletes account
✅ **Unenroll Functionality**: Users can unenroll from courses
✅ **Progress Tracking**: Each enrollment tracks progress and completed lessons
✅ **Real-time Updates**: Dashboard refreshes after unenroll

## User Flow

1. **Browse Courses**: User views course catalog on homepage
2. **Enroll**: Click "Enroll Now" button
3. **Confirmation**: Alert confirms successful enrollment
4. **Dashboard**: Navigate to dashboard to see enrolled courses
5. **Continue Learning**: Click course to continue learning
6. **Unenroll (Optional)**: Click X button to unenroll with confirmation

## Data Mapping

| Database Column | Frontend Display |
|----------------|------------------|
| course_title | Course card title |
| course_category | Badge above title |
| course_level | Top-right badge |
| course_description | Course description |
| course_thumbnail | Course image |
| course_instructor | Instructor name with avatar |
| progress | Progress bar width |
| completed_lessons | "X/Y lessons" |
| course_lessons | Total lessons count |

## Security Notes

- User email is retrieved from localStorage (myenglish_userEmail)
- All API requests validate user email
- Foreign key constraint ensures data integrity
- Unique constraint prevents duplicate enrollments
