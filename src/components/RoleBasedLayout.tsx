import { useAppSelector } from "../hooks/redux";
import AdminLayout from "./layouts/AdminLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";
import LabTechnicianLayout from "./layouts/LabTechnicianLayout";

const RoleBasedLayout = () => {
  console.log("RoleBasedLayout: Rendering"); // Debug log
  const { user } = useAppSelector((state) => state.auth);
  console.log("RoleBasedLayout: user =", user); // Debug log

  // For development, default to admin if no user
  const currentUser = user || { role: "admin" as const };
  console.log("RoleBasedLayout: currentUser =", currentUser); // Debug log

  switch (currentUser.role) {
    case "admin":
      console.log("RoleBasedLayout: Rendering AdminLayout"); // Debug log
      return <AdminLayout />;
    case "doctor":
      console.log("RoleBasedLayout: Rendering DoctorLayout"); // Debug log
      return <DoctorLayout />;
    case "patient":
      console.log("RoleBasedLayout: Rendering PatientLayout"); // Debug log
      return <PatientLayout />;
    case "lab_technician":
      console.log("RoleBasedLayout: Rendering LabTechnicianLayout"); // Debug log
      return <LabTechnicianLayout />;
    default:
      console.log("RoleBasedLayout: Rendering default AdminLayout"); // Debug log
      return <AdminLayout />;
  }
};

export default RoleBasedLayout;
