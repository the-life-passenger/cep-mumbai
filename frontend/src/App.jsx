import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './components/common/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import MapPage from './pages/MapPage';
import EmergencyPage from './pages/EmergencyPage';
import SurveyPage from './pages/SurveyPage';
import FeedbackPage from './pages/FeedbackPage';
import AboutPage from './pages/AboutPage';
import ProjectDataPage from './pages/ProjectDataPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminSurveysPage from './pages/admin/AdminSurveysPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes wrapped in PublicLayout (Banner + Nav + Footer) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/survey" element={<SurveyPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/project-data" element={<ProjectDataPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Login (Isolated) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/services" element={<AdminServicesPage />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                <Route path="/admin/surveys" element={<AdminSurveysPage />} />
                <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
                <Route path="/admin/content" element={<AdminContentPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
