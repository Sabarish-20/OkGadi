import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Routes_Page from './pages/Routes';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="trips/create" element={<CreateTrip />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route
                path="drivers"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'user']}>
                    <Drivers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="routes"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'user']}>
                    <Routes_Page />
                  </ProtectedRoute>
                }
              />
              <Route path="analytics" element={<Analytics />} />
              <Route path="alerts" element={<Alerts />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
