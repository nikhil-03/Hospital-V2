import { useState, useEffect } from "react";
import { useAppSelector } from "../hooks/redux";
import {
  User,
  Calendar,
  Clock,
  Star,
  Search,
  Eye,
  FileText,
  Pill,
  TestTube,
  CreditCard,
  Activity,
  CalendarDays,
  Clock4,
  CheckCircle,
  XCircle,
  SortAsc,
  SortDesc,
} from "lucide-react";

interface PatientDoctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  education: string;
  image: string;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  consultationFee: number;
  rating: number;
  totalPatients: number;
  status: "active" | "inactive";
}

interface PatientAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  symptoms: string;
  diagnosis?: string;
  prescription?: {
    medicines: Array<{
      id: string;
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }>;
    tests: Array<{
      id: string;
      name: string;
      description: string;
      status: "pending" | "completed" | "cancelled";
    }>;
    notes: string;
  };
}

const PatientDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [doctors, setDoctors] = useState<PatientDoctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<PatientDoctor[]>([]);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] =
    useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "name" | "rating" | "experience" | "consultationFee"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedDoctor, setSelectedDoctor] = useState<PatientDoctor | null>(
    null
  );
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock data for doctors
  useEffect(() => {
    const mockDoctors: PatientDoctor[] = [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        experience: 15,
        education: "MD, Cardiology - Harvard Medical School",
        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableTime: { start: "09:00", end: "17:00" },
        consultationFee: 150,
        rating: 4.8,
        totalPatients: 1250,
        status: "active",
      },
      {
        id: "2",
        name: "Dr. Michael Chen",
        specialization: "Neurology",
        experience: 12,
        education: "MD, Neurology - Stanford University",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableTime: { start: "10:00", end: "18:00" },
        consultationFee: 200,
        rating: 4.9,
        totalPatients: 980,
        status: "active",
      },
      {
        id: "3",
        name: "Dr. Emily Rodriguez",
        specialization: "Dermatology",
        experience: 8,
        education: "MD, Dermatology - Johns Hopkins University",
        image:
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
        availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
        availableTime: { start: "08:00", end: "16:00" },
        consultationFee: 120,
        rating: 4.7,
        totalPatients: 2100,
        status: "active",
      },
    ];

    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  // Mock data for patient appointments
  useEffect(() => {
    const mockAppointments: PatientAppointment[] = [
      {
        id: "1",
        doctorId: "1",
        doctorName: "Dr. Sarah Johnson",
        doctorSpecialization: "Cardiology",
        date: "2024-01-20",
        time: "10:00",
        status: "confirmed",
        symptoms: "Chest pain, shortness of breath",
      },
      {
        id: "2",
        doctorId: "3",
        doctorName: "Dr. Emily Rodriguez",
        doctorSpecialization: "Dermatology",
        date: "2024-01-18",
        time: "14:30",
        status: "completed",
        symptoms: "Skin rash, itching",
        diagnosis: "Contact dermatitis",
        prescription: {
          medicines: [
            {
              id: "m1",
              name: "Hydrocortisone cream",
              dosage: "1%",
              frequency: "Twice daily",
              duration: "7 days",
              instructions: "Apply to affected areas",
            },
          ],
          tests: [],
          notes: "Avoid contact with irritants",
        },
      },
    ];

    setAppointments(mockAppointments);
  }, []);

  // Filter and sort doctors
  useEffect(() => {
    const filtered = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialization =
        specializationFilter === "all" ||
        doctor.specialization === specializationFilter;

      return matchesSearch && matchesSpecialization;
    });

    // Sort doctors
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "experience":
          aValue = a.experience;
          bValue = b.experience;
          break;
        case "consultationFee":
          aValue = a.consultationFee;
          bValue = b.consultationFee;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDoctors(sorted);
  }, [doctors, searchTerm, specializationFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
  };

  const handleBookAppointment = (doctor: PatientDoctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your health and find the right doctor for you
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-900 rounded-lg p-6 border border-gray-200 dark:border-dark-800">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Upcoming Appointments
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  appointments.filter(
                    (a) => a.status === "confirmed" || a.status === "scheduled"
                  ).length
                }
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
                Completed Visits
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {appointments.filter((a) => a.status === "completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-lg p-6 border border-gray-200 dark:border-dark-800">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Medical Records
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                3
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-lg p-6 border border-gray-200 dark:border-dark-800">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Available Doctors
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {doctors.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Find Doctors Section */}
      <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Find Doctors
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Book appointments with our specialized doctors
          </p>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-800">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors or specializations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Specializations</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Dermatology">Dermatology</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "name"
                      | "rating"
                      | "experience"
                      | "consultationFee"
                  )
                }
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="consultationFee">Sort by Fee</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-5 w-5" />
                ) : (
                  <SortDesc className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-gray-50 dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center mt-2">
                      {renderStars(doctor.rating)}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {doctor.rating} ({doctor.totalPatients} patients)
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        {doctor.experience} years experience
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {doctor.availableDays.join(", ")}
                      </div>
                      <div className="flex items-center">
                        <Clock4 className="h-4 w-4 mr-2" />
                        {doctor.availableTime.start} -{" "}
                        {doctor.availableTime.end}
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />$
                        {doctor.consultationFee} consultation
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleBookAppointment(doctor)}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Book Appointment
                      </button>
                      <button className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No doctors found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* My Appointments */}
      <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            My Appointments
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your upcoming and past appointments
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-dark-800">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {appointment.doctorName}
                    </h4>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      {appointment.doctorSpecialization}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Appointment Details
                  </h5>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {appointment.time}
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symptoms
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {appointment.symptoms}
                  </p>
                </div>
              </div>

              {appointment.diagnosis && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Diagnosis
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {appointment.diagnosis}
                  </p>
                </div>
              )}

              {appointment.prescription && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prescription
                  </h5>
                  <div className="space-y-2">
                    {appointment.prescription.medicines.length > 0 && (
                      <div>
                        <h6 className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center">
                          <Pill className="h-3 w-3 mr-1" />
                          Medicines
                        </h6>
                        <div className="ml-4 space-y-1">
                          {appointment.prescription.medicines.map(
                            (medicine, index) => (
                              <div
                                key={index}
                                className="text-xs text-gray-600 dark:text-gray-400"
                              >
                                • {medicine.name} - {medicine.dosage} (
                                {medicine.frequency})
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {appointment.prescription.tests.length > 0 && (
                      <div>
                        <h6 className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center">
                          <TestTube className="h-3 w-3 mr-1" />
                          Tests
                        </h6>
                        <div className="ml-4 space-y-1">
                          {appointment.prescription.tests.map((test, index) => (
                            <div
                              key={index}
                              className="text-xs text-gray-600 dark:text-gray-400"
                            >
                              • {test.name} - {test.status}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </button>
                {appointment.status === "scheduled" && (
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No appointments yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Book your first appointment with one of our doctors
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowBookingModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white dark:bg-dark-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Book Appointment
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedDoctor.name} - {selectedDoctor.specialization}
                </p>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Appointment booking functionality would be implemented here.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-800 flex justify-end space-x-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
