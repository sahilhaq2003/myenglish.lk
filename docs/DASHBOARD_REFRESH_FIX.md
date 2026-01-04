# ✅ FIXED: Dashboard Auto-Refresh

## 🔄 **Real-Time Updates**

I have updated the **Dashboard** to automatically refresh your **Enrolled Courses** list.

- **Previous Issue:** The "My Courses" list was only loading once when the app started. If you enrolled in a new course and went back, it wouldn't show up immediately.
- **Fix Applied:** The dashboard now listens for "Phase Changes". Every time you navigate back to the **Dashboard** view, it re-checks your enrollments.

## 🛠️ **Technical Change**
- Modified `App.tsx`: Added `[phase]` to the `useEffect` dependency array for `fetchEnrolledCourses`.

## 🧪 **Verify Now**
1.  Go to **Courses** (`/courses`).
2.  Enroll in a new course (e.g., "IELTS Prep").
3.  Click "Home" or navigate back to the **Dashboard**.
4.  **Result:** The new course appears instantly in your "My Courses" list! 🚀
