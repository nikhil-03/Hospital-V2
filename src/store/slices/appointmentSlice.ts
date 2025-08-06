import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Appointment } from '../../types';

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    time: '10:00',
    status: 'confirmed',
    symptoms: 'Chest pain and shortness of breath',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    patientName: 'Jane Smith',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-16',
    time: '14:00',
    status: 'scheduled',
    symptoms: 'Headache and dizziness',
    createdAt: '2024-01-11T09:00:00Z',
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '3',
    patientName: 'Mike Johnson',
    doctorName: 'Dr. Emily Rodriguez',
    date: '2024-01-14',
    time: '11:00',
    status: 'completed',
    symptoms: 'Fever and cough',
    diagnosis: 'Common cold',
    createdAt: '2024-01-09T15:00:00Z',
  },
];

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  selectedAppointment: Appointment | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
  selectedAppointment: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockAppointments;
  }
);

interface CreateAppointmentRequest {
  date: string;
  time: string;
  description: string;
  doctorId: string;
  patientId: string;
}

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData: CreateAppointmentRequest) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert API data to Appointment interface
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId: appointmentData.patientId,
      doctorId: appointmentData.doctorId,
      patientName: "Patient Name", // This would come from patient lookup
      doctorName: "Doctor Name", // This would come from doctor lookup
      date: appointmentData.date,
      time: appointmentData.time,
      status: "scheduled",
      symptoms: appointmentData.description,
      createdAt: new Date().toISOString(),
    };
    
    return newAppointment;
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status }: { id: string; status: Appointment['status'] }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return { id, status };
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      })
      .addCase(createAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.appointments.push(action.payload);
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action: PayloadAction<{ id: string; status: Appointment['status'] }>) => {
        const appointment = state.appointments.find(a => a.id === action.payload.id);
        if (appointment) {
          appointment.status = action.payload.status;
        }
      });
  },
});

export const { setSelectedAppointment, clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer; 