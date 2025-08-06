import { useState } from "react";
import { useAppDispatch } from "../hooks/redux";
import { addPatient } from "../store/slices/patientSlice";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Calendar,
  Heart,
} from "lucide-react";

interface AddPatientFormData {
  name: string;
  email: string;
  age: number;
  mobileNo: string;
  adharNo: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  pinCode: number;
  description: string;
  address: string;
}

const AddPatientModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<AddPatientFormData>({
    name: "",
    email: "",
    age: 0,
    mobileNo: "",
    adharNo: "",
    gender: "Male",
    bloodGroup: "",
    pinCode: 0,
    description: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AddPatientFormData>>({});

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleInputChange = (field: keyof AddPatientFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AddPatientFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.age <= 0) {
      newErrors.age = "Age must be greater than 0";
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNo.replace(/\D/g, ""))) {
      newErrors.mobileNo = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.adharNo.trim()) {
      newErrors.adharNo = "Aadhar number is required";
    } else if (!/^\d{4}-\d{4}-\d{4}$/.test(formData.adharNo)) {
      newErrors.adharNo = "Please enter Aadhar in format: XXXX-XXXX-XXXX";
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required";
    }

    if (formData.pinCode <= 0) {
      newErrors.pinCode = "Pin code must be greater than 0";
    } else if (formData.pinCode.toString().length !== 6) {
      newErrors.pinCode = "Pin code must be 6 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(addPatient(formData)).unwrap();
      onClose();
      setFormData({
        name: "",
        email: "",
        age: 0,
        mobileNo: "",
        adharNo: "",
        gender: "Male",
        bloodGroup: "",
        pinCode: 0,
        description: "",
        address: "",
      });
    } catch (error) {
      console.error("Failed to add patient:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Patient
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fill in the details to add a new patient
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-dark-600"
                } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                placeholder="Jane Smith"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={formData.age || ""}
                onChange={(e) =>
                  handleInputChange("age", parseInt(e.target.value) || 0)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.age
                    ? "border-red-500"
                    : "border-gray-300 dark:border-dark-600"
                } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                placeholder="35"
                min="1"
                max="120"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-dark-600"
                  } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                  placeholder="jane.smith@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.mobileNo}
                  onChange={(e) =>
                    handleInputChange("mobileNo", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.mobileNo
                      ? "border-red-500"
                      : "border-gray-300 dark:border-dark-600"
                  } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                  placeholder="4445556667"
                />
              </div>
              {errors.mobileNo && (
                <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aadhar Number *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.adharNo}
                  onChange={(e) => handleInputChange("adharNo", e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.adharNo
                      ? "border-red-500"
                      : "border-gray-300 dark:border-dark-600"
                  } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                  placeholder="9012-3456-7890"
                />
              </div>
              {errors.adharNo && (
                <p className="text-red-500 text-sm mt-1">{errors.adharNo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  handleInputChange(
                    "gender",
                    e.target.value as "Male" | "Female" | "Other"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blood Group *
              </label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={formData.bloodGroup}
                  onChange={(e) =>
                    handleInputChange("bloodGroup", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.bloodGroup
                      ? "border-red-500"
                      : "border-gray-300 dark:border-dark-600"
                  } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              {errors.bloodGroup && (
                <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pin Code *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.pinCode || ""}
                  onChange={(e) =>
                    handleInputChange("pinCode", parseInt(e.target.value) || 0)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.pinCode
                      ? "border-red-500"
                      : "border-gray-300 dark:border-dark-600"
                  } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                  placeholder="654321"
                  min="100000"
                  max="999999"
                />
              </div>
              {errors.pinCode && (
                <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.address
                    ? "border-red-500"
                    : "border-gray-300 dark:border-dark-600"
                } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                rows={3}
                placeholder="789 Oak Avenue, Delhi, India"
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-dark-600"
                } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                rows={4}
                placeholder="Brief description about the patient's medical history and requirements..."
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-dark-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span>Add Patient</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
