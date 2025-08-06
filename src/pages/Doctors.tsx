import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchDoctors, setSelectedDoctor } from "../store/slices/doctorSlice";
import { createAppointment } from "../store/slices/appointmentSlice";
import AddDoctorModal from "../components/AddDoctorModal";
import {
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Plus,
  UserCheck,
} from "lucide-react";
import type { Doctor } from "../types";

const Doctors = () => {
  console.log("Doctors: Rendering"); // Debug log
  const dispatch = useAppDispatch();
  const { doctors, loading } = useAppSelector((state) => state.doctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    symptoms: "",
  });
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  useEffect(() => {
    console.log("Doctors: useEffect", fetchDoctors()); // Debug log
    dispatch(fetchDoctors());
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

  const handleSubmitBooking = () => {
    if (
      selectedDoctor &&
      bookingData.date &&
      bookingData.time &&
      bookingData.symptoms
    ) {
      dispatch(
        createAppointment({
          patientId: "1", // Mock patient ID
          doctorId: selectedDoctor.id,
          patientName: "John Doe", // Mock patient name
          doctorName: selectedDoctor.name,
          date: bookingData.date,
          time: bookingData.time,
          status: "scheduled",
          symptoms: bookingData.symptoms,
        })
      );
      setShowBookingModal(false);
      setBookingData({ date: "", time: "", symptoms: "" });
      setSelectedDoctor(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="mt-2 text-gray-600">
            Find and book appointments with our specialists
          </p>
        </div>
        <button
          onClick={() => setShowAddDoctorModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
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
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
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
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Book Appointment with {selectedDoctor.name}
            </h3>

            <div className="space-y-4">
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
                  className="input-field"
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
                  className="input-field"
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
                  Symptoms
                </label>
                <textarea
                  value={bookingData.symptoms}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, symptoms: e.target.value })
                  }
                  className="input-field"
                  rows={3}
                  placeholder="Describe your symptoms..."
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
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={showAddDoctorModal}
        onClose={() => setShowAddDoctorModal(false)}
      />
    </div>
  );
};

export default Doctors;
