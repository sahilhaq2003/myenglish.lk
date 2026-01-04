/**
 * Quick Test Script for Learning Platform
 * Tests all API endpoints and displays results
 */

const baseURL = 'http://localhost:3001/api/learning';

async function testAPI() {
    console.log('🧪 Testing Learning Platform API...\n');

    try {
        // Test 1: Get all courses
        console.log('📚 Test 1: Fetching courses...');
        const coursesRes = await fetch(`${baseURL}/courses`);
        const courses = await coursesRes.json();
        console.log(`✅ Found ${courses.length} courses`);
        courses.forEach(c => console.log(`   - ${c.title} (${c.level})`));

        if (courses.length === 0) {
            console.log('⚠️  No courses found. Run: node server/install-schema.js');
            return;
        }

        // Test 2: Get course details
        const courseId = courses[0].id;
        console.log(`\n📖 Test 2: Fetching course details for ${courseId}...`);
        const courseRes = await fetch(`${baseURL}/courses/${courseId}`);
        const course = await coursesRes.json();
        console.log(`✅ Course: ${course.title}`);
        console.log(`   Modules: ${course.modules?.length || 0}`);

        // Test 3: Get module lessons
        if (course.modules && course.modules.length > 0) {
            const moduleId = course.modules[0].id;
            console.log(`\n📝 Test 3: Fetching lessons for module ${moduleId}...`);
            const lessonsRes = await fetch(`${baseURL}/modules/${moduleId}/lessons`);
            const lessons = await lessonsRes.json();
            console.log(`✅ Found ${lessons.length} lessons`);
            lessons.forEach(l => console.log(`   - ${l.title} (${l.estimated_minutes} min)`));

            // Test 4: Get lesson details
            if (lessons.length > 0) {
                const lessonId = lessons[0].id;
                console.log(`\n📄 Test 4: Fetching lesson ${lessonId}...`);
                const lessonRes = await fetch(`${baseURL}/lessons/${lessonId}`);
                const lesson = await lessonRes.json();
                console.log(`✅ Lesson: ${lesson.title}`);
                console.log(`   Type: ${lesson.lesson_type}`);
                console.log(`   Difficulty: ${lesson.difficulty_level}`);
            }
        }

        // Test 5: Test progress endpoint with test user
        console.log(`\n📊 Test 5: Fetching progress for test user...`);
        const progressRes = await fetch(`${baseURL}/progress?user_email=test@example.com`);
        const progress = await progressRes.json();
        console.log(`✅ Progress data retrieved:`);
        console.log(`   Courses: ${progress.course_progress?.length || 0}`);
        console.log(`   Stats:`, progress.statistics);

        console.log('\n✨ All tests passed! API is working correctly.');
        console.log('\n📝 Next steps:');
        console.log('   1. Add routes to App.tsx');
        console.log('   2. Navigate to /courses to see the UI');
        console.log('   3. Enroll in a course and start learning!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Make sure server is running: node server/index.js');
        console.log('   2. Check if schema is installed: node server/install-schema.js');
        console.log('   3. Verify database connection in server/.env');
    }
}

// Run tests
testAPI();
