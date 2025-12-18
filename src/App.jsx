import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import CenterList from "./pages/centers/CenterList";
import CenterDetail from "./pages/centers/CenterDetail";
import Configuration from "./pages/configuration/Configuration";
import SystemHealth from "./pages/monitoring/SystemHealth";
import InspectionDetail from "./pages/inspections/InspectionDetail";
import InspectionOperations from "./pages/operations/InspectionOperations";
import ReportsAnalytics from "./pages/reports/ReportsAnalytics";
import Security from "./pages/security/Security";
import { CentersProvider } from "./context/CentersContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <CentersProvider>
      <NotificationProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/system-monitoring" element={<SystemHealth />} />
            <Route path="/inspection-operations" element={<InspectionOperations />} />
            <Route path="/inspections/:id" element={<InspectionDetail />} />
            <Route path="/center-management" element={<CenterList />} />
            <Route path="/center-management/:id" element={<CenterDetail />} />
            <Route path="/reports" element={<ReportsAnalytics />} />
            <Route path="/configuration/*" element={<Configuration />} />
            <Route path="/administration" element={<UserManagement />} />
            <Route path="/security" element={<Security />} />
          </Routes>
        </MainLayout>
      </NotificationProvider>
    </CentersProvider>
  );
}

export default App;
