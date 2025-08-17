import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Doctor } from "../../types";
import { getApisEndPoint } from "../../apiConfig";

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
  async (_, thunkAPI) => {
    try {
      const res = await fetch(getApisEndPoint().DOCTORS);

      if (!res.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const response = await res.json();
      console.log("all doctors", response);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
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
  async (doctorData: AddDoctorRequest, thunkAPI) => {
    const newDoctor = {
      name: doctorData.name,
      age: doctorData.age,
      specialization: doctorData.specialization,
      experience: doctorData.experience,
      contactNo: doctorData.contactNo,
      availability: doctorData.availability,
      inTiming: doctorData.inTiming,
      outTiming: doctorData.outTiming,
      email: doctorData.email,
      description: doctorData.description,
      imageURL: "",
    };

    try {
      const response = await fetch(getApisEndPoint().DOCTORS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoctor),
      });

      if (!response.ok) {
        throw new Error(`Failed to add doctor: ${response.statusText}`);
      }

      const savedDoctor = await response.json();

      return savedDoctor; // Return backend response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to add doctor");
    }
  }
);

// {
//   "name": "Dr. Thomas Robinson",
//   "age": 41,
//   "specialization": "Hematology",
//   "experience": 17,
//   "contactNo": "3334445556",
//   "availability": [
//       { "dayOfWeek": "Tuesday" },
//       { "dayOfWeek": "Friday" }
//   ],
//   "inTiming": "10:00:00",
//   "outTiming": "16:00:00",
//   "email": "thomas.robinson@hospital.com",
//   "description": "Hematologist focusing on blood disorders and cancers."
// }

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
