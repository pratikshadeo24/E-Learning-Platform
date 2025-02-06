// client/src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Dashboard from './pages/dashboard/Dashboard';
import CourseList from './pages/courses/CourseList';
import MyCourses from './pages/courses/MyCourses';
import CourseDetail from './pages/courses/CourseDetail';
import ManageCourses from './pages/courses/ManageCourses';
import ManageCourseDetail from './pages/courses/ManageCourseDetail';
import ManageCourseAssignments from './pages/assignments/ManageCourseAssignments';
import ManageCoursePosts from './pages/posts/ManageCoursePosts';
import ManageCourseGrades from './pages/grades/ManageCourseGrades';
import ManageCourseQuizzes from './pages/quizzes/ManageCourseQuizzes';
import CourseAssignments from './pages/assignments/CourseAssignments';
import AssignmentDetail from './pages/assignments/AssignmentDetail';
import PostDetail from './pages/posts/PostDetail';
import GradeDetail from './pages/grades/GradeDetail';
import QuizDetail from './pages/quizzes/QuizDetail';
import CourseGrades from './pages/grades/CourseGrades';
import CoursePosts from './pages/posts/CoursePosts';
import CourseQuizzes from './pages/quizzes/CourseQuizzes';
import AddCourse from './pages/courses/AddCourse';

import QuizList from './pages/quizzes/QuizList';
import CreateQuiz from './pages/quizzes/CreateQuiz';
import QuizAnalytics from './pages/quizzes/QuizAnalytics';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated: Dashboard. Shared Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Student Routes */}
        <Route path="/courses" element={<CourseList />} />         {/* list of all courses? */}
        <Route path="/my-courses" element={<MyCourses />} />       {/* student's enrolled courses */}
        <Route path="/my-courses/:courseId" element={<CourseDetail />} />
        <Route path="/my-courses/:courseId/quizzes" element={<CourseQuizzes />} />
        <Route path="/my-courses/:courseId/quizzes/:quizId" element={<QuizDetail />} />
        <Route path="/my-courses/:courseId/assignments" element={<CourseAssignments />} />
        <Route path="/my-courses/:courseId/grades" element={<CourseGrades />} />
        <Route path="/my-courses/:courseId/posts" element={<CoursePosts />} />
        <Route path="/my-courses/:courseId/posts/:postId" element={<PostDetail />} />
        <Route path="/my-courses/:courseId/assignments/:assignmentId" element={<AssignmentDetail />} />
        <Route path="/my-courses/:courseId/grades/:gradeId" element={<GradeDetail />} />


        <Route path="/quizzes" element={<QuizList />} />

//        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quizzes/:id/analytics" element={<QuizAnalytics />} />

        /*Teacher Routes*/
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
        <Route path="/manage-courses/:courseId" element={<ManageCourseDetail />} />
        <Route path="/manage-courses/:courseId/assignments" element={<ManageCourseAssignments />} />
        <Route path="/manage-courses/:courseId/posts" element={<ManageCoursePosts />} />
        <Route path="/manage-courses/:courseId/grades" element={<ManageCourseGrades />} />
        <Route path="/manage-courses/:courseId/quizzes" element={<ManageCourseQuizzes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
