import React from 'react';
import { Navigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';

export default function AdminProtectedRoute({ children }) {
  const isAuth = adminService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
