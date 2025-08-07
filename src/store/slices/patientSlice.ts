import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Patient } from "../../types";
import axios from "axios";
import { getApis } from "../../api";

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

// Async thunk to fetch all patients from the API
export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(getApis().PATIENTS);
      return response.data;
    } catch (error) {
      dispatch(clearError());
      throw error;
    }
  }
);

// Async thunk to add a new patient
export const addPatient = createAsyncThunk(
  "patients/addPatient",
  async (patientData: Omit<Patient, "id" | "createdAt">, { dispatch }) => {
    try {
      const response = await axios.post(getApis().PATIENTS, patientData);
      return response.data;
    } catch (error) {
      dispatch(clearError());
      throw error;
    }
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
      .addCase(addPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addPatient.fulfilled,
        (state, action: PayloadAction<Patient>) => {
          state.patients.push(action.payload);
          state.loading = false;
        }
      )
      .addCase(addPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add patient";
      });
  },
});

export const { setSelectedPatient, clearError } = patientSlice.actions;
export default patientSlice.reducer;
