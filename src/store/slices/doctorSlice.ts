import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Doctor } from "../../types";

// Mock doctors data
const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    experience: 15,
    education: "MBBS, MD - Cardiology",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
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
    education: "MBBS, MD - Neurology",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
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
    specialization: "Pediatrics",
    experience: 8,
    education: "MBBS, MD - Pediatrics",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableTime: { start: "08:00", end: "16:00" },
    consultationFee: 120,
    rating: 4.7,
    totalPatients: 2100,
    status: "active",
  },
  {
    id: "4",
    name: "Dr. David Kim",
    specialization: "Orthopedics",
    experience: 20,
    education: "MBBS, MS - Orthopedics",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableTime: { start: "09:00", end: "17:00" },
    consultationFee: 180,
    rating: 4.6,
    totalPatients: 890,
    status: "active",
  },
  {
    id: "5",
    name: "Dr. Lisa Wang",
    specialization: "Dermatology",
    experience: 10,
    education: "MBBS, MD - Dermatology",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableTime: { start: "10:00", end: "18:00" },
    consultationFee: 160,
    rating: 4.8,
    totalPatients: 1450,
    status: "active",
  },
];

interface DoctorState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  selectedDoctor: Doctor | null;
}

const initialState: DoctorState = {
  doctors: [],
  loading: false,
  error: null,
  selectedDoctor: null,
};

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockDoctors;
  }
);

interface AddDoctorRequest {
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

export const addDoctor = createAsyncThunk(
  "doctors/addDoctor",
  async (doctorData: AddDoctorRequest) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Convert API data to Doctor interface
    const newDoctor: Doctor = {
      id: Date.now().toString(),
      name: doctorData.name,
      specialization: doctorData.specialization,
      experience: doctorData.experience,
      education: `${doctorData.specialization} Specialist`,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      availableDays: doctorData.availability.map((a) => a.dayOfWeek),
      availableTime: {
        start: doctorData.inTiming,
        end: doctorData.outTiming,
      },
      consultationFee: 150, // Default fee
      rating: 0,
      totalPatients: 0,
      status: "active",
    };

    return newDoctor;
  }
);

const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setSelectedDoctor: (state, action: PayloadAction<Doctor | null>) => {
      state.selectedDoctor = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDoctors.fulfilled,
        (state, action: PayloadAction<Doctor[]>) => {
          state.loading = false;
          state.doctors = action.payload;
        }
      )
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch doctors";
      })
      .addCase(addDoctor.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.doctors.push(action.payload);
      });
  },
});

export const { setSelectedDoctor, clearError } = doctorSlice.actions;
export default doctorSlice.reducer;
