import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchDoctors } from "../store/slices/doctorSlice";
import { fetchPatients } from "../store/slices/patientSlice";
import { fetchAppointments } from "../store/slices/appointmentSlice";
import { fetchBilling } from "../store/slices/billingSlice";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  console.log("Dashboard: Rendering"); // Debug log
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { doctors } = useAppSelector((state) => state.doctors);
  const { patients } = useAppSelector((state) => state.patients);
  const { appointments } = useAppSelector((state) => state.appointments);
  const { billing } = useAppSelector((state) => state.billing);

  useEffect(() => {
    console.log("Dashboard: useEffect"); // Debug log
    dispatch(fetchDoctors());
    dispatch(fetchPatients());
    dispatch(fetchAppointments());
    dispatch(fetchBilling());
  }, [dispatch]);

  const todayAppointments = appointments.filter(
    (apt) => apt.date === new Date().toISOString().split("T")[0]
  );
  const totalRevenue = billing.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled"
  ).length;
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  ).length;

  const stats = [
    {
      name: "Total Doctors",
      value: doctors.length,
      icon: UserCheck,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "bg-green-500",
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Appointments Today",
      value: todayAppointments.length,
      icon: Calendar,
      color: "bg-purple-500",
      change: "+5%",
      changeType: "positive",
    },
    {
      name: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: "+15%",
      changeType: "positive",
    },
  ];

  const quickStats = [
    {
      name: "Pending Appointments",
      value: pendingAppointments,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      name: "Completed Appointments",
      value: completedAppointments,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      name: "Monthly Revenue",
      value: `$${(totalRevenue * 0.3).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening in your hospital today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    from last month
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat) => (
          <div key={stat.name} className="card card-hover">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Appointments
          </h3>
          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {appointment.patientName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    with {appointment.doctorName} • {appointment.date}
                  </p>
                </div>
                <span
                  className={`badge ${
                    appointment.status === "completed"
                      ? "badge-success"
                      : appointment.status === "cancelled"
                      ? "badge-danger"
                      : "badge-warning"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Doctors */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Doctors
          </h3>
          <div className="space-y-4">
            {doctors.slice(0, 5).map((doctor) => (
              <div key={doctor.id} className="flex items-center space-x-3">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {doctor.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {doctor.specialization} • {doctor.totalPatients} patients
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {doctor.rating}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    /5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
