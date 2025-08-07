import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { switchRole } from "../store/slices/authSlice";

const RoleSwitcher = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleRoleSwitch = (
    role: "admin" | "doctor" | "patient" | "lab_technician"
  ) => {
    dispatch(switchRole(role));
  };

  return (
    <div className="fixed top-12 left-0 z-40 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-r-lg shadow-lg p-4">
      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
        Switch Role (Dev)
      </div>
      <div className="space-y-1">
        <button
          onClick={() => handleRoleSwitch("admin")}
          className={`w-full px-2 py-1 text-xs rounded ${
            user?.role === "admin"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => handleRoleSwitch("doctor")}
          className={`w-full px-2 py-1 text-xs rounded ${
            user?.role === "doctor"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
          }`}
        >
          Doctor
        </button>
        <button
          onClick={() => handleRoleSwitch("patient")}
          className={`w-full px-2 py-1 text-xs rounded ${
            user?.role === "patient"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
          }`}
        >
          Patient
        </button>
        <button
          onClick={() => handleRoleSwitch("lab_technician")}
          className={`w-full px-2 py-1 text-xs rounded ${
            user?.role === "lab_technician"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
          }`}
        >
          Lab Tech
        </button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
