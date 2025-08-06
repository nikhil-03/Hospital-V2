import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { login } from "./store/slices/authSlice";
import { ThemeProvider } from "./contexts/ThemeContext";
import RoleBasedLayout from "./components/RoleBasedLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Billing from "./pages/Billing";
import Tests from "./pages/Tests";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Auto-login for demo purposes - development mode
  useEffect(() => {
    console.log("App: isAuthenticated =", isAuthenticated);
    if (!isAuthenticated) {
      console.log("App: Dispatching login");
      dispatch(login({ email: "admin@hospital.com", password: "password" }));
    }
  }, [dispatch, isAuthenticated]);

  console.log("App: Rendering with isAuthenticated =", isAuthenticated);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-200">
          {/* Development Mode Indicator */}
          <div className="fixed top-0 left-0 z-50 bg-yellow-500 text-black px-4 py-1 text-xs font-medium">
            🚀 Development Mode - No Auth Required
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<RoleBasedLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/doctors" element={<RoleBasedLayout />}>
              <Route index element={<Doctors />} />
            </Route>
            <Route path="/patients" element={<RoleBasedLayout />}>
              <Route index element={<Patients />} />
            </Route>
            <Route path="/appointments" element={<RoleBasedLayout />}>
              <Route index element={<Appointments />} />
            </Route>
            <Route path="/prescriptions" element={<RoleBasedLayout />}>
              <Route index element={<Prescriptions />} />
            </Route>
            <Route path="/billing" element={<RoleBasedLayout />}>
              <Route index element={<Billing />} />
            </Route>
            <Route path="/tests" element={<RoleBasedLayout />}>
              <Route index element={<Tests />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
