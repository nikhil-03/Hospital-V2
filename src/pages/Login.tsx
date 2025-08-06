import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { login } from "../store/slices/authSlice";
import { useTheme } from "../contexts/ThemeContext";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("admin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map role to appropriate email
    const roleEmails = {
      admin: "admin@hospital.com",
      doctor: "sarah.johnson@hospital.com",
      patient: "john.doe@email.com",
      lab_technician: "lab.tech@hospital.com",
    };

    const loginEmail =
      roleEmails[selectedRole as keyof typeof roleEmails] || email;

    try {
      await dispatch(
        login({ email: loginEmail, password: "password" })
      ).unwrap();
      navigate("/dashboard");
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const demoCredentials = [
    {
      role: "admin",
      email: "admin@hospital.com",
      description: "Full system access",
    },
    {
      role: "doctor",
      email: "sarah.johnson@hospital.com",
      description: "Patient management & prescriptions",
    },
    {
      role: "patient",
      email: "john.doe@email.com",
      description: "Appointments & medical records",
    },
    {
      role: "lab_technician",
      email: "lab.tech@hospital.com",
      description: "Test management & results",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Hospital Management
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Role (Demo)
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              >
                {demoCredentials.map((cred) => (
                  <option key={cred.role} value={cred.role}>
                    {cred.role.charAt(0).toUpperCase() + cred.role.slice(1)} -{" "}
                    {cred.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-danger-900/20 border border-red-200 dark:border-danger-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-danger-400">
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 dark:bg-primary-900/20 border border-blue-200 dark:border-primary-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 dark:text-primary-400 mb-2">
              Demo Credentials
            </h3>
            <p className="text-xs text-blue-600 dark:text-primary-500">
              Password for all accounts:{" "}
              <code className="bg-blue-100 dark:bg-primary-800 px-1 rounded">
                password
              </code>
            </p>
            <p className="text-xs text-blue-600 dark:text-primary-500 mt-1">
              Select a role above to test different user interfaces
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
