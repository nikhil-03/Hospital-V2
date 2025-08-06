import { useState } from "react";
import { useAppDispatch } from "../hooks/redux";
import { addDoctor } from "../store/slices/doctorSlice";
import {
  X,
  UserCheck,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

interface AddDoctorFormData {
  name: string;
  age: number;
  specialization: string;
  experience: number;
  contactNo: string;
  availability: { dayOfWeek: string }[];
  inTiming: string;
  outTiming: string;
  email: string;
  description: string;
}

const AddDoctorModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<AddDoctorFormData>({
    name: "",
    age: 0,
    specialization: "",
    experience: 0,
    contactNo: "",
    availability: [],
    inTiming: "",
    outTiming: "",
    email: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AddDoctorFormData>>({});

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const specializations = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Oncology",
    "Psychiatry",
    "Gastroenterology",
    "Endocrinology",
    "Hematology",
    "Radiology",
    "Anesthesiology",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
    "Obstetrics and Gynecology",
    "Ophthalmology",
    "Otolaryngology",
    "Pathology",
    "Physical Medicine and Rehabilitation",
    "Preventive Medicine",
    "Pulmonary Medicine",
    "Rheumatology",
    "Urology",
  ];

  const handleInputChange = (field: keyof AddDoctorFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, { dayOfWeek: day }],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        availability: prev.availability.filter((a) => a.dayOfWeek !== day),
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AddDoctorFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.age <= 0) {
      newErrors.age = "Age must be greater than 0";
    }

    if (!formData.specialization) {
      newErrors.specialization = "Specialization is required";
    }

    if (formData.experience < 0) {
      newErrors.experience = "Experience cannot be negative";
    }

    if (!formData.contactNo.trim()) {
      newErrors.contactNo = "Contact number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.inTiming) {
      newErrors.inTiming = "In timing is required";
    }

    if (!formData.outTiming) {
      newErrors.outTiming = "Out timing is required";
    }

    if (formData.availability.length === 0) {
      newErrors.availability = "Please select at least one available day";
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
      await dispatch(addDoctor(formData)).unwrap();
      onClose();
      setFormData({
        name: "",
        age: 0,
        specialization: "",
        experience: 0,
        contactNo: "",
        availability: [],
        inTiming: "",
        outTiming: "",
        email: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to add doctor:", error);
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
              <UserCheck className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Doctor
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fill in the details to add a new doctor
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
                placeholder="Dr. Thomas Robinson"
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
                placeholder="41"
                min="25"
                max="80"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization *
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  handleInputChange("specialization", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.specialization
                    ? "border-red-500"
                    : "border-gray-300 dark:border-dark-600"
                } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">
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
                value={formData.experience || ""}
                onChange={(e) =>
                  handleInputChange("experience", parseInt(e.target.value) || 0)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.experience
                    ? "border-red-500"
                    : "border-gray-300 dark:border-dark-600"
                } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                placeholder="17"
                min="0"
                max="50"
              />
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.contactNo}
                  onChange={(e) =>
                    handleInputChange("contactNo", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.contactNo
                      ? "border-red-500"
                      : "border-gray-300 dark:border-dark-600"
                  } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                  placeholder="3334445556"
                />
              </div>
              {errors.contactNo && (
                <p className="text-red-500 text-sm mt-1">{errors.contactNo}</p>
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
                  placeholder="thomas.robinson@hospital.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Working Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                In Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.inTiming}
                  onChange={(e) =>
                    handleInputChange("inTiming", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.inTiming
                      ? "border-red-500"
                      : "border-gray-300 dark:border-dark-600"
                  } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                />
              </div>
              {errors.inTiming && (
                <p className="text-red-500 text-sm mt-1">{errors.inTiming}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Out Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.outTiming}
                  onChange={(e) =>
                    handleInputChange("outTiming", e.target.value)
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.outTiming
                      ? "border-red-500"
                      : "border-gray-300 dark:border-dark-600"
                  } bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
                />
              </div>
              {errors.outTiming && (
                <p className="text-red-500 text-sm mt-1">{errors.outTiming}</p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Available Days *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {daysOfWeek.map((day) => (
                <label
                  key={day}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.availability.some(
                      (a) => a.dayOfWeek === day
                    )}
                    onChange={(e) =>
                      handleAvailabilityChange(day, e.target.checked)
                    }
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {day}
                  </span>
                </label>
              ))}
            </div>
            {errors.availability && (
              <p className="text-red-500 text-sm mt-1">{errors.availability}</p>
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
                placeholder="Brief description about the doctor's expertise and focus areas..."
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
                  <UserCheck className="h-4 w-4" />
                  <span>Add Doctor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
