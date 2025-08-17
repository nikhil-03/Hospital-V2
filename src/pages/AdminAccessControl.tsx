import { useState, useEffect } from "react";
import { useAppSelector } from "../hooks/redux";
import {
  User,
  Shield,
  UserCheck,
  Stethoscope,
  TestTube,
  Building2,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "patient" | "lab_technician";
  avatar?: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastLogin?: string;
  isBlocked: boolean;
}

const AdminAccessControl = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data for users
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@hospital.com",
        role: "admin",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        status: "active",
        createdAt: "2024-01-01",
        lastLogin: "2024-01-15T10:30:00Z",
        isBlocked: false,
      },
      {
        id: "2",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@hospital.com",
        role: "doctor",
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        status: "active",
        createdAt: "2024-01-02",
        lastLogin: "2024-01-15T09:15:00Z",
        isBlocked: false,
      },
      {
        id: "3",
        name: "John Doe",
        email: "john.doe@email.com",
        role: "patient",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        status: "active",
        createdAt: "2024-01-03",
        lastLogin: "2024-01-14T16:45:00Z",
        isBlocked: false,
      },
      {
        id: "4",
        name: "Lisa Chen",
        email: "lab.tech@hospital.com",
        role: "lab_technician",
        avatar:
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
        status: "active",
        createdAt: "2024-01-04",
        lastLogin: "2024-01-15T08:20:00Z",
        isBlocked: false,
      },
      {
        id: "5",
        name: "Dr. Michael Chen",
        email: "michael.chen@hospital.com",
        role: "doctor",
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        status: "pending",
        createdAt: "2024-01-05",
        lastLogin: null,
        isBlocked: true,
      },
      {
        id: "6",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com",
        role: "patient",
        avatar:
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
        status: "inactive",
        createdAt: "2024-01-06",
        lastLogin: "2024-01-10T14:30:00Z",
        isBlocked: true,
      },
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter and search users
  useEffect(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "doctor":
        return <Stethoscope className="h-4 w-4" />;
      case "patient":
        return <UserCheck className="h-4 w-4" />;
      case "lab_technician":
        return <TestTube className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "doctor":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "patient":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "lab_technician":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "inactive":
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const handleBlockUser = async (userId: string, block: boolean) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isBlocked: block } : user
        )
      );

      setShowBlockModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole as any } : user
        )
      );

      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user role:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Access Control
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage user roles and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-900 rounded-lg p-6 border border-gray-200 dark:border-dark-800">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-lg p-6 border border-gray-200 dark:border-dark-800">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-lg p-6 border border-gray-200 dark:border-dark-800">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter((u) => u.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-lg p-6 border border-gray-200 dark:border-dark-800">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Blocked Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter((u) => u.isBlocked).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="lab_technician">Lab Technician</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Users ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-800">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-900 divide-y divide-gray-200 dark:divide-dark-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-dark-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          user.avatar ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                        }
                        alt={user.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                      {user.isBlocked && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          Blocked
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin ? formatDateTime(user.lastLogin) : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                        disabled={user.id === currentUser?.id}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBlockModal(true);
                        }}
                        className={
                          user.isBlocked
                            ? "text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                            : "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        }
                        disabled={user.id === currentUser?.id}
                      >
                        {user.isBlocked ? (
                          <Unlock className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowEditModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white dark:bg-dark-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Edit User Role
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser.name} ({selectedUser.email})
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Role
                    </label>
                    <div className="flex items-center">
                      {getRoleIcon(selectedUser.role)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                          selectedUser.role
                        )}`}
                      >
                        {selectedUser.role.charAt(0).toUpperCase() +
                          selectedUser.role.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Role
                    </label>
                    <select
                      defaultValue={selectedUser.role}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                    >
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                      <option value="patient">Patient</option>
                      <option value="lab_technician">Lab Technician</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-800 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateRole(selectedUser.id, "admin")}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                >
                  {loading ? "Updating..." : "Update Role"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block/Unblock Modal */}
      {showBlockModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowBlockModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white dark:bg-dark-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedUser.isBlocked ? "Unblock User" : "Block User"}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser.name} ({selectedUser.email})
                </p>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedUser.isBlocked
                    ? "Are you sure you want to unblock this user? They will be able to access the system again."
                    : "Are you sure you want to block this user? They will not be able to access the system."}
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-800 flex justify-end space-x-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleBlockUser(selectedUser.id, !selectedUser.isBlocked)
                  }
                  disabled={loading}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 ${
                    selectedUser.isBlocked
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading
                    ? "Processing..."
                    : selectedUser.isBlocked
                    ? "Unblock User"
                    : "Block User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccessControl;
