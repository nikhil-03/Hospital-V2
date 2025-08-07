import { useState, useEffect } from "react";
import { useAppSelector } from "../hooks/redux";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Pill,
  TestTube,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";

interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
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

const DoctorDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    DoctorAppointment[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointment | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "time" | "patientName">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Mock data for doctor's appointments
  useEffect(() => {
    const mockAppointments: DoctorAppointment[] = [
      {
        id: "1",
        patientId: "p1",
        patientName: "John Smith",
        patientEmail: "john.smith@email.com",
        patientPhone: "+1-555-0123",
        patientAge: 35,
        patientGender: "male",
        date: "2024-01-15",
        time: "09:00",
        status: "confirmed",
        symptoms: "Fever, cough, fatigue",
        diagnosis: "Common cold",
        prescription: {
          medicines: [
            {
              id: "m1",
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "Every 6 hours",
              duration: "3 days",
              instructions: "Take with food",
            },
          ],
          tests: [
            {
              id: "t1",
              name: "Blood Test",
              description: "Complete blood count",
              status: "pending",
            },
          ],
          notes: "Rest well and stay hydrated",
        },
      },
      {
        id: "2",
        patientId: "p2",
        patientName: "Sarah Johnson",
        patientEmail: "sarah.j@email.com",
        patientPhone: "+1-555-0124",
        patientAge: 28,
        patientGender: "female",
        date: "2024-01-15",
        time: "10:30",
        status: "scheduled",
        symptoms: "Headache, dizziness",
      },
      {
        id: "3",
        patientId: "p3",
        patientName: "Mike Wilson",
        patientEmail: "mike.w@email.com",
        patientPhone: "+1-555-0125",
        patientAge: 42,
        patientGender: "male",
        date: "2024-01-15",
        time: "14:00",
        status: "completed",
        symptoms: "Chest pain, shortness of breath",
        diagnosis: "Anxiety",
        prescription: {
          medicines: [
            {
              id: "m2",
              name: "Diazepam",
              dosage: "5mg",
              frequency: "As needed",
              duration: "7 days",
              instructions: "Take only when anxious",
            },
          ],
          tests: [],
          notes: "Follow up in 2 weeks",
        },
      },
    ];

    setAppointments(mockAppointments);
    setFilteredAppointments(mockAppointments);
  }, []);

  // Filter and sort appointments
  useEffect(() => {
    let filtered = appointments.filter((appointment) => {
      const matchesSearch =
        appointment.patientName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.symptoms.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort appointments
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date + " " + a.time);
          bValue = new Date(b.date + " " + b.time);
          break;
        case "time":
          aValue = a.time;
          bValue = b.time;
          break;
        case "patientName":
          aValue = a.patientName;
          bValue = b.patientName;
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

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, sortBy, sortOrder]);

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

  const handlePrescriptionAction = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Appointments
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your patient appointments and prescriptions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Welcome, Dr. {user?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-900 rounded-lg p-6 border border-gray-200 dark:border-dark-800">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Today's Appointments
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  filteredAppointments.filter((a) => a.date === "2024-01-15")
                    .length
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
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  filteredAppointments.filter((a) => a.status === "completed")
                    .length
                }
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
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  filteredAppointments.filter(
                    (a) => a.status === "scheduled" || a.status === "confirmed"
                  ).length
                }
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
                Prescriptions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredAppointments.filter((a) => a.prescription).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "time" | "patientName")
              }
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="time">Sort by Time</option>
              <option value="patientName">Sort by Patient</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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

      {/* Appointments List */}
      <div className="bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Appointments ({filteredAppointments.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-dark-800">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {appointment.patientName}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(appointment.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointment.time}
                          </span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {appointment.patientAge} years,{" "}
                            {appointment.patientGender}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Information
                      </h5>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {appointment.patientEmail}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {appointment.patientPhone}
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
                                (medicine) => (
                                  <div
                                    key={medicine.id}
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
                              {appointment.prescription.tests.map((test) => (
                                <div
                                  key={test.id}
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
                </div>

                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  {appointment.prescription ? (
                    <button
                      onClick={() => handlePrescriptionAction(appointment)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Prescription
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePrescriptionAction(appointment)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Prescription
                    </button>
                  )}
                  <button
                    onClick={() => handlePrescriptionAction(appointment)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No appointments found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You don't have any appointments scheduled"}
            </p>
          </div>
        )}
      </div>

      {/* Prescription Modal would go here */}
      {showPrescriptionModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowPrescriptionModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white dark:bg-dark-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedAppointment.prescription ? "Edit" : "Add"}{" "}
                  Prescription
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Patient: {selectedAppointment.patientName}
                </p>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Prescription management functionality would be implemented
                  here.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-800 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200">
                  Save Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
