import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AppProvider, useAuth } from "./context/AppContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import BookingManagement from "./pages/dashboard/BookingManagement";
import CustomerManagement from "./pages/dashboard/CustomerManagement";
import ServiceManagement from "./pages/dashboard/ServiceManagement";
import InvoiceManagement from "./pages/dashboard/InvoiceManagement";
import StaffManagement from "./pages/dashboard/StaffManagement";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

// Separate component for routes that can use hooks
const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="invoices" element={<InvoiceManagement />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route index element={<Navigate to="bookings" />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
