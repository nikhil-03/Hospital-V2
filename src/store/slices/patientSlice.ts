import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Patient } from "../../types";

// Mock patients data
const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    age: 35,
    gender: "male",
    bloodGroup: "O+",
    address: "123 Main St, City, State 12345",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+1-555-0124",
      relationship: "Spouse",
    },
    medicalHistory: ["Hypertension", "Diabetes"],
    allergies: ["Penicillin"],
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1-555-0125",
    age: 28,
    gender: "female",
    bloodGroup: "A+",
    address: "456 Oak Ave, City, State 12345",
    emergencyContact: {
      name: "Bob Smith",
      phone: "+1-555-0126",
      relationship: "Father",
    },
    medicalHistory: ["Asthma"],
    allergies: ["Dust", "Pollen"],
    createdAt: "2023-02-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1-555-0127",
    age: 42,
    gender: "male",
    bloodGroup: "B+",
    address: "789 Pine Rd, City, State 12345",
    emergencyContact: {
      name: "Sarah Johnson",
      phone: "+1-555-0128",
      relationship: "Sister",
    },
    medicalHistory: ["Heart Disease"],
    allergies: ["Shellfish"],
    createdAt: "2023-03-10T09:15:00Z",
  },
];

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  selectedPatient: Patient | null;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
  selectedPatient: null,
};

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockPatients;
  }
);

interface AddPatientRequest {
  name: string;
  email: string;
  age: number;
  mobileNo: string;
  adharNo: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  pinCode: number;
  description: string;
  address: string;
}

export const addPatient = createAsyncThunk(
  "patients/addPatient",
  async (patientData: AddPatientRequest) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Convert API data to Patient interface
    const newPatient: Patient = {
      id: Date.now().toString(),
      name: patientData.name,
      email: patientData.email,
      phone: patientData.mobileNo,
      age: patientData.age,
      gender: patientData.gender.toLowerCase() as "male" | "female" | "other",
      bloodGroup: patientData.bloodGroup,
      address: patientData.address,
      emergencyContact: {
        name: "Emergency Contact",
        phone: patientData.mobileNo,
        relationship: "Emergency",
      },
      medicalHistory: [],
      allergies: [],
      createdAt: new Date().toISOString(),
    };
    
    return newPatient;
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPatients.fulfilled,
        (state, action: PayloadAction<Patient[]>) => {
          state.loading = false;
          state.patients = action.payload;
        }
      )
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch patients";
      })
      .addCase(
        addPatient.fulfilled,
        (state, action: PayloadAction<Patient>) => {
          state.patients.push(action.payload);
        }
      );
  },
});

export const { setSelectedPatient, clearError } = patientSlice.actions;
export default patientSlice.reducer;
