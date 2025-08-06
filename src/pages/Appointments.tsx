import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchDoctors } from "../store/slices/doctorSlice";
import {
  fetchAppointments,
  createAppointment,
} from "../store/slices/appointmentSlice";
import { fetchPatients } from "../store/slices/patientSlice";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  UserCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Doctor, Appointment, Patient } from "../types";

const Appointments = () => {
  const dispatch = useAppDispatch();
  const { doctors, loading: doctorsLoading } = useAppSelector(
    (state) => state.doctors
  );
  const { appointments, loading: appointmentsLoading } = useAppSelector(
    (state) => state.appointments
  );
  const { patients } = useAppSelector((state) => state.patients);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    description: "",
    patientId: "",
  });
  const [viewMode, setViewMode] = useState<"doctors" | "appointments">(
    "doctors"
  );

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchAppointments());
    dispatch(fetchPatients());
  }, [dispatch]);

  const specializations = [...new Set(doctors.map((d) => d.specialization))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      !selectedSpecialization ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleSubmitBooking = async () => {
    if (
      selectedDoctor &&
      bookingData.date &&
      bookingData.time &&
      bookingData.description &&
      bookingData.patientId
    ) {
      const patient = patients.find((p) => p.id === bookingData.patientId);

      await dispatch(
        createAppointment({
          date: bookingData.date,
          time: bookingData.time,
          description: bookingData.description,
          doctorId: selectedDoctor.id,
          patientId: bookingData.patientId,
        })
      );

      setShowBookingModal(false);
      setBookingData({ date: "", time: "", description: "", patientId: "" });
      setSelectedDoctor(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", text: "Scheduled" },
      confirmed: { color: "bg-green-100 text-green-800", text: "Confirmed" },
      completed: { color: "bg-gray-100 text-gray-800", text: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.scheduled;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-2 text-gray-600">
            {viewMode === "doctors"
              ? "Find and book appointments with our specialists"
              : "View and manage your appointments"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode("doctors")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "doctors"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <UserCheck className="h-4 w-4 inline mr-2" />
            Find Doctors
          </button>
          <button
            onClick={() => setViewMode("appointments")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "appointments"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            My Appointments
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={
                viewMode === "doctors"
                  ? "Search doctors by name or specialization..."
                  : "Search appointments..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {viewMode === "doctors" && (
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === "doctors" ? (
        /* Doctors Grid */
        doctorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-primary-600 font-medium">
                      {doctor.specialization}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {doctor.education}
                    </p>

                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {doctor.rating}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({doctor.totalPatients} patients)
                      </span>
                    </div>

                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>${doctor.consultationFee}/consultation</span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{doctor.availableDays.join(", ")}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {doctor.availableTime.start} -{" "}
                          {doctor.availableTime.end}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookAppointment(doctor)}
                      className="w-full mt-4 btn-primary"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : /* Appointments List */
      appointmentsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-500">
                You haven't booked any appointments yet.
              </p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.doctorName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment.patientName} • {appointment.date} at{" "}
                          {appointment.time}
                        </p>
                        {appointment.symptoms && (
                          <p className="text-sm text-gray-600 mt-1">
                            Symptoms: {appointment.symptoms}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(appointment.status)}
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Book Appointment with {selectedDoctor.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Patient
                </label>
                <select
                  value={bookingData.patientId}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      patientId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.age} years)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <select
                  value={bookingData.time}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description/Symptoms
                </label>
                <textarea
                  value={bookingData.description}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your symptoms or reason for visit..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBooking}
                className="flex-1 btn-primary"
                disabled={
                  !bookingData.patientId ||
                  !bookingData.date ||
                  !bookingData.time ||
                  !bookingData.description
                }
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
