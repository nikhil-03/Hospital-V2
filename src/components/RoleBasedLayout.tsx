import { useAppSelector } from '../hooks/redux';
import type { User } from '../types';
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import PatientLayout from './layouts/PatientLayout';
import LabTechnicianLayout from './layouts/LabTechnicianLayout';

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

const RoleBasedLayout = ({ children }: RoleBasedLayoutProps) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case 'admin':
      return <AdminLayout>{children}</AdminLayout>;
    case 'doctor':
      return <DoctorLayout>{children}</DoctorLayout>;
    case 'patient':
      return <PatientLayout>{children}</PatientLayout>;
    case 'lab_technician':
      return <LabTechnicianLayout>{children}</LabTechnicianLayout>;
    default:
      return <div>Unknown role</div>;
  }
};

export default RoleBasedLayout; 