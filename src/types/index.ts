export interface Doctor {
  id?: string;
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

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "male" | "female" | "other";
  bloodGroup: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  price: number;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  price: number;
  preparation: string;
  status: "pending" | "completed" | "cancelled";
  result?: string;
  prescribedBy: string;
  prescribedAt: string;
  completedAt?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  medicines: Medicine[];
  tests: Test[];
  notes: string;
  prescribedBy: string;
  prescribedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  symptoms: string;
  diagnosis?: string;
  prescription?: Prescription;
  createdAt: string;
}

export interface BillingItem {
  id: string;
  name: string;
  type: "consultation" | "medicine" | "test" | "procedure";
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Billing {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  items: BillingItem[];
  totalAmount: number;
  paidAmount: number;
  status: "pending" | "paid" | "partial";
  createdAt: string;
  paidAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "patient" | "lab_technician";
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface HospitalStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalRevenue: number;
  pendingAppointments: number;
  completedAppointments: number;
}
