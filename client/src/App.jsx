import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import ManageCargo from './pages/ManageCargo';
import Overview from './pages/Overview';
import Tracking from './pages/Tracking';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ShipmentProvider } from './context/ShipmentContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={
            <ProtectedRoute>
              <ShipmentProvider>
                <Layout />
              </ShipmentProvider>
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage" element={<ManageCargo />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
