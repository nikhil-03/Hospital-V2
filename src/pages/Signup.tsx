import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { useTheme } from "../contexts/ThemeContext";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Stethoscope,
  UserCheck,
  TestTube,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { addUser } from "../store/APIS/userManagementApis";
const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    role: "patient",
    specialization: "",
    experience: 0,
    education: "",
    licenseNumber: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    department: "",
  });

  const roles = [
    {
      id: "patient",
      name: "Patient",
      icon: UserCheck,
      description: "Register as a patient",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: "doctor",
      name: "Doctor",
      icon: Stethoscope,
      description: "Register as a medical professional",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      id: "lab_technician",
      name: "Lab Technician",
      icon: TestTube,
      description: "Register as laboratory staff",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  const specializations = [
    "Cardiology",
    "Neurology",
    "Dermatology",
    "Orthopedics",
    "Pediatrics",
    "Oncology",
    "Psychiatry",
    "General Medicine",
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.role === "doctor") {
      if (!formData.specialization)
        newErrors.specialization = "Specialization is required";
      if (!formData.experience) newErrors.experience = "Experience is required";
      if (!formData.education) newErrors.education = "Education is required";
      if (!formData.licenseNumber)
        newErrors.licenseNumber = "License number is required";
    }

    if (formData.role === "patient") {
      if (!formData.bloodGroup)
        newErrors.bloodGroup = "Blood group is required";
      if (!formData.emergencyContact?.name)
        newErrors.emergencyName = "Emergency contact name is required";
      if (!formData.emergencyContact?.phone)
        newErrors.emergencyPhone = "Emergency contact phone is required";
    }

    if (formData.role === "lab_technician") {
      if (!formData.department) newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addUser(formData);
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Registration data:", formData);
      navigate("/login", {
        state: {
          message:
            "Registration successful! Please sign in with your new account.",
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-950 dark:to-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join our healthcare platform
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white dark:bg-dark-900 rounded-xl shadow-xl border border-gray-200 dark:border-dark-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                      errors.firstName
                        ? "border-red-500"
                        : "border-gray-300 dark:border-dark-600"
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                      errors.lastName
                        ? "border-red-500"
                        : "border-gray-300 dark:border-dark-600"
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                        errors.phone
                          ? "border-red-500"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                      errors.dateOfBirth
                        ? "border-red-500"
                        : "border-gray-300 dark:border-dark-600"
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Address Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                      errors.address
                        ? "border-red-500"
                        : "border-gray-300 dark:border-dark-600"
                    }`}
                    placeholder="Enter your full address"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                      errors.city
                        ? "border-red-500"
                        : "border-gray-300 dark:border-dark-600"
                    }`}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                      errors.state
                        ? "border-red-500"
                        : "border-gray-300 dark:border-dark-600"
                    }`}
                    placeholder="Enter your state"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                      errors.zipCode
                        ? "border-red-500"
                        : "border-gray-300 dark:border-dark-600"
                    }`}
                    placeholder="Enter ZIP code"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Account Security
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                      placeholder="Create a strong password"
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
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Role Selection
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleInputChange("role", role.id)}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        formData.role === role.id
                          ? `border-primary-500 ${role.bgColor} ${role.color}`
                          : "border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700"
                      }`}
                    >
                      <Icon className="h-8 w-8 mb-2" />
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs mt-1">{role.description}</div>
                    </button>
                  );
                })}
              </div>

              {/* Role-specific fields */}
              {formData.role === "doctor" && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    Doctor Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Specialization *
                      </label>
                      <select
                        value={formData.specialization}
                        onChange={(e) =>
                          handleInputChange("specialization", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                          errors.specialization
                            ? "border-red-500"
                            : "border-gray-300 dark:border-dark-600"
                        }`}
                      >
                        <option value="">Select specialization</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                      {errors.specialization && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.specialization}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Years of Experience *
                      </label>
                      <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) =>
                          handleInputChange(
                            "experience",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                          errors.experience
                            ? "border-red-500"
                            : "border-gray-300 dark:border-dark-600"
                        }`}
                        placeholder="Enter years of experience"
                        min="0"
                      />
                      {errors.experience && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.experience}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Education *
                      </label>
                      <input
                        type="text"
                        value={formData.education}
                        onChange={(e) =>
                          handleInputChange("education", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                          errors.education
                            ? "border-red-500"
                            : "border-gray-300 dark:border-dark-600"
                        }`}
                        placeholder="e.g., MD, MBBS, etc."
                      />
                      {errors.education && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.education}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        License Number *
                      </label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) =>
                          handleInputChange("licenseNumber", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                          errors.licenseNumber
                            ? "border-red-500"
                            : "border-gray-300 dark:border-dark-600"
                        }`}
                        placeholder="Enter license number"
                      />
                      {errors.licenseNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.licenseNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {formData.role === "patient" && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    Patient Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blood Group *
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) =>
                        handleInputChange("bloodGroup", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                        errors.bloodGroup
                          ? "border-red-500"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                    >
                      <option value="">Select blood group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroup && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.bloodGroup}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Emergency Contact
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Name *
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContact?.name}
                          onChange={(e) =>
                            handleEmergencyContactChange("name", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                            errors.emergencyName
                              ? "border-red-500"
                              : "border-gray-300 dark:border-dark-600"
                          }`}
                          placeholder="Emergency contact name"
                        />
                        {errors.emergencyName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.emergencyName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Phone *
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyContact?.phone}
                          onChange={(e) =>
                            handleEmergencyContactChange(
                              "phone",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                            errors.emergencyPhone
                              ? "border-red-500"
                              : "border-gray-300 dark:border-dark-600"
                          }`}
                          placeholder="Emergency contact phone"
                        />
                        {errors.emergencyPhone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.emergencyPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact?.relationship}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            "relationship",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
                        placeholder="e.g., Spouse, Parent, Sibling"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.role === "lab_technician" && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">
                    Lab Technician Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${
                        errors.department
                          ? "border-red-500"
                          : "border-gray-300 dark:border-dark-600"
                      }`}
                      placeholder="e.g., Pathology, Biochemistry, Microbiology"
                    />
                    {errors.department && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700 dark:text-red-400 text-sm">
                    {errors.general}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
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

export default Signup;
