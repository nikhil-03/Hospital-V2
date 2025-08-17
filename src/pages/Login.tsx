import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { login } from "../store/slices/authSlice";
import { useTheme } from "../contexts/ThemeContext";
import { Eye, EyeOff, Mail, Lock, User, Building2 } from "lucide-react";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("admin");

  const roles = [
    {
      id: "admin",
      name: "Admin",
      icon: Building2,
      description: "Hospital Administrator",
    },
    {
      id: "doctor",
      name: "Doctor",
      icon: User,
      description: "Medical Professional",
    },
    {
      id: "patient",
      name: "Patient",
      icon: User,
      description: "Patient Portal",
    },
    {
      id: "lab_technician",
      name: "Lab Technician",
      icon: User,
      description: "Laboratory Staff",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the selected role's email for login
      const roleEmails = {
        admin: "admin@hospital.com",
        doctor: "sarah.johnson@hospital.com",
        patient: "john.doe@email.com",
        lab_technician: "lab.tech@hospital.com",
      };

      const loginEmail =
        roleEmails[selectedRole as keyof typeof roleEmails] || formData.email;

      await dispatch(
        login({ email: loginEmail, password: formData.password })
      ).unwrap();

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: string) => {
    setSelectedRole(role);
    const roleEmails = {
      admin: "admin@hospital.com",
      doctor: "sarah.johnson@hospital.com",
      patient: "john.doe@email.com",
      lab_technician: "lab.tech@hospital.com",
    };
    setFormData({
      email:
        roleEmails[role as keyof typeof roleEmails] || `${role}@hospital.com`,
      password: "password123",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-950 dark:to-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hospital Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to access your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-dark-900 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-dark-800">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      selectedRole === role.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                        : "border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700"
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{role.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Login
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleQuickLogin(role.id)}
                  className="px-3 py-2 text-xs bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Theme Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-800">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                  <span className="text-sm">Switch to Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Signup Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Hospital Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
