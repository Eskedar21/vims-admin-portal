import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import UserManagementEnhanced from "./pages/admin/UserManagementEnhanced";
import CenterList from "./pages/centers/CenterList";
import CentersListEnhanced from "./pages/centers/CentersListEnhanced";
import CenterDetail from "./pages/centers/CenterDetail";
import CenterProfile from "./pages/centers/CenterProfile";
import DeviceRegistry from "./pages/centers/DeviceRegistry";
import CameraRegistry from "./pages/centers/CameraRegistry";
import TeleBirrSetup from "./pages/centers/TeleBirrSetup";
import GeofenceConfiguration from "./pages/centers/GeofenceConfiguration";
import DeviceLocationCompliance from "./pages/centers/DeviceLocationCompliance";
import CameraSettings from "./pages/centers/CameraSettings";
import Configuration from "./pages/configuration/Configuration";
import InspectionDetail from "./pages/inspections/InspectionDetail";
import InspectionViewer from "./pages/inspections/InspectionViewer";
import InspectionOperations from "./pages/operations/InspectionOperations";
import OperationsCommandCenter from "./pages/operations/OperationsCommandCenter";
import IncidentDetail from "./pages/operations/IncidentDetail";
import Governance from "./pages/governance/Governance";
import FeesPayments from "./pages/fees/FeesPayments";
import ReportsAnalytics from "./pages/reports/ReportsAnalytics";
import ReportsAnalyticsEnhanced from "./pages/reports/ReportsAnalyticsEnhanced";
import Security from "./pages/security/Security";
import SecurityEnhanced from "./pages/security/SecurityEnhanced";
import ProtectedRoute from "./components/ProtectedRoute";
import { CentersProvider } from "./context/CentersContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <CentersProvider>
      <NotificationProvider>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/operations" element={<OperationsCommandCenter />} />
                      <Route path="/operations/incidents/:id" element={<IncidentDetail />} />
                      <Route path="/inspection-operations" element={<InspectionOperations />} />
                      <Route path="/inspections/:id" element={<InspectionViewer />} />
                      <Route path="/inspections/:id/legacy" element={<InspectionDetail />} />
                      <Route path="/center-management" element={<CentersListEnhanced />} />
                      <Route path="/center-management/:id" element={<CenterProfile />} />
                      <Route path="/center-management/:id/devices" element={<DeviceRegistry />} />
                      <Route path="/center-management/:id/cameras" element={<CameraRegistry />} />
                      <Route path="/center-management/:id/telebirr" element={<TeleBirrSetup />} />
                      <Route path="/center-management/:id/geofence" element={<GeofenceConfiguration />} />
                      <Route path="/center-management/:id/device-location" element={<DeviceLocationCompliance />} />
                      <Route path="/center-management/:id/camera-settings" element={<CameraSettings />} />
                      <Route path="/center-management/:id/legacy" element={<CenterDetail />} />
                      <Route path="/reports" element={<ReportsAnalyticsEnhanced />} />
                      <Route path="/reports/legacy" element={<ReportsAnalytics />} />
                      <Route path="/configuration/*" element={<Configuration />} />
                      <Route path="/governance/*" element={<Governance />} />
                      <Route path="/fees-payments/*" element={<FeesPayments />} />
                      <Route path="/administration" element={<UserManagementEnhanced />} />
                      <Route path="/administration/legacy" element={<UserManagement />} />
                      <Route path="/security" element={<SecurityEnhanced />} />
                      <Route path="/security/legacy" element={<Security />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </NotificationProvider>
      </CentersProvider>
  );
}

export default App;
