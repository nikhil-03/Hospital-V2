import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";
import { useTheme } from "../../contexts/ThemeContext";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileText,
  CreditCard,
  TestTube,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Search,
} from "lucide-react";

const LabTechnicianLayout = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tests", href: "/tests", icon: TestTube },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Reports", href: "/prescriptions", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
              Hospital - Lab
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-2 border-primary-600"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 h-16">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search */}
              <div className="ml-4 flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200">
                <Bell className="h-5 w-5" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
                    }
                    alt={user?.name}
                  />
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user?.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default LabTechnicianLayout;
