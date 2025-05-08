import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';
import StudentProfile from './pages/student/profile';
import CompanyProfile from './pages/company/Profile';
import InternshipSearch from './pages/student/InternshipSearch';
import InternshipDetails from './pages/shared/InternshipDetails';
import Applications from './pages/student/Applications';
import CreateInternship from './pages/company/CreateInternship';
import ManageInternships from './pages/company/ManageInternships';
import StudentSearch from './pages/company/StudentSearch';
import Messages from './pages/shared/Messages';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<Layout />}>
            {/* Student Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute userType="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/profile" 
              element={
                <ProtectedRoute userType="student">
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/search" 
              element={
                <ProtectedRoute userType="student">
                  <InternshipSearch />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/applications" 
              element={
                <ProtectedRoute userType="student">
                  <Applications />
                </ProtectedRoute>
              } 
            />

            {/* Company Routes */}
            <Route 
              path="/company/dashboard" 
              element={
                <ProtectedRoute userType="company">
                  <CompanyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/profile" 
              element={
                <ProtectedRoute userType="company">
                  <CompanyProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/create-internship" 
              element={
                <ProtectedRoute userType="company">
                  <CreateInternship />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/manage-internships" 
              element={
                <ProtectedRoute userType="company">
                  <ManageInternships />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/student-search" 
              element={
                <ProtectedRoute userType="company">
                  <StudentSearch />
                </ProtectedRoute>
              } 
            />

            {/* Shared Routes */}
            <Route 
              path="/internship/:id" 
              element={<InternshipDetails />} 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;