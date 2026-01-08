import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

// Public & Auth Pages
import LandingPage from './features/public/LandingPage';
import IntroPage from './features/public/IntroPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DocumentsPage from './features/documents/DocumentsPage';
import DocumentDetailPage from './features/documents/DocumentDetailPage';
import ProfilePage from './features/profile/ProfilePage';
import CartPage from './features/cart/CartPage';
import CheckoutPage from './features/cart/CheckoutPage';
import TestTakingPage from './features/tests/TestTakingPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './features/admin/AdminDashboardPage';
import AdminUsersPage from './features/admin/AdminUsersPage';
// Teacher
import TeacherLayout from './layouts/TeacherLayout';
import TeacherDashboardPage from './features/teacher/TeacherDashboardPage';
import TeacherCreateLessonPage from './features/teacher/TeacherCreateLessonPage'; 
import TeacherCoursesPage from './features/teacher/courses/TeacherCoursesPage';
import TeacherCreateCoursePage from './features/teacher/courses/TeacherCreateCoursePage';
import TeacherCourseDetailPage from './features/teacher/courses/TeacherCourseDetailPage';
import TeacherClassesPage from './features/teacher/classes/TeacherClassesPage';
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<IntroPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Feature Routes */}
                <Route path="/documents/free" element={<DocumentsPage type="free" />} />
                <Route path="/documents/paid" element={<DocumentsPage type="paid" />} />
                <Route path="/offline-courses" element={<DocumentsPage type="offline" />} />
                <Route path="/tests" element={<DocumentsPage type="test" />} />
                <Route path="/documents/:id" element={<DocumentDetailPage />} />
                <Route path="/test/:id/take" element={<TestTakingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="*" element={<div className="p-10">Page under construction</div>} />
                </Route>

                {/* Teacher  */}
                <Route path="/teacher" element={<TeacherLayout />}>
                  <Route index element={<TeacherDashboardPage />} />
                  <Route path="classes" element={<TeacherClassesPage />} />
                  <Route path="courses" element={<TeacherCoursesPage />} />
                  <Route path="courses/create" element={<TeacherCreateCoursePage />} />
                  <Route path="courses/:id" element={<TeacherCourseDetailPage />} />

                  <Route path="lessons/create" element={<TeacherCreateLessonPage />} />
                </Route>

              </Routes>
            </BrowserRouter>
          </CartProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;