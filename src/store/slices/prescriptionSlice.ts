import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Prescription, Test } from "../../types";

// Mock prescriptions data
const mockPrescriptions: Prescription[] = [
  {
    id: "1",
    appointmentId: "1",
    medicines: [
      {
        id: "1",
        name: "Aspirin",
        dosage: "100mg",
        frequency: "Once daily",
        duration: "7 days",
        instructions: "Take with food",
        price: 15.99,
      },
      {
        id: "2",
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Every 6 hours",
        duration: "5 days",
        instructions: "Take as needed for pain",
        price: 12.5,
      },
    ],
    tests: [
      {
        id: "1",
        name: "Blood Test",
        description: "Complete blood count",
        price: 45.0,
        preparation: "Fasting required for 8 hours",
        status: "pending",
        prescribedBy: "Dr. Sarah Johnson",
        prescribedAt: "2024-01-15T10:00:00Z",
      },
    ],
    notes:
      "Patient shows signs of inflammation. Monitor symptoms and return if condition worsens.",
    prescribedBy: "Dr. Sarah Johnson",
    prescribedAt: "2024-01-15T10:00:00Z",
  },
];

interface PrescriptionState {
  prescriptions: Prescription[];
  loading: boolean;
  error: string | null;
  selectedPrescription: Prescription | null;
}

const initialState: PrescriptionState = {
  prescriptions: [],
  loading: false,
  error: null,
  selectedPrescription: null,
};

export const fetchPrescriptions = createAsyncThunk(
  "prescriptions/fetchPrescriptions",
  async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockPrescriptions;
  }
);

export const createPrescription = createAsyncThunk(
  "prescriptions/createPrescription",
  async (prescription: Omit<Prescription, "id" | "prescribedAt">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newPrescription: Prescription = {
      ...prescription,
      id: Date.now().toString(),
      prescribedAt: new Date().toISOString(),
    };
    return newPrescription;
  }
);

export const updateTestStatus = createAsyncThunk(
  "prescriptions/updateTestStatus",
  async ({
    prescriptionId,
    testId,
    status,
  }: {
    prescriptionId: string;
    testId: string;
    status: Test["status"];
  }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { prescriptionId, testId, status };
  }
);

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    setSelectedPrescription: (
      state,
      action: PayloadAction<Prescription | null>
    ) => {
      state.selectedPrescription = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPrescriptions.fulfilled,
        (state, action: PayloadAction<Prescription[]>) => {
          state.loading = false;
          state.prescriptions = action.payload;
        }
      )
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch prescriptions";
      })
      .addCase(
        createPrescription.fulfilled,
        (state, action: PayloadAction<Prescription>) => {
          state.prescriptions.push(action.payload);
        }
      )
      .addCase(
        updateTestStatus.fulfilled,
        (
          state,
          action: PayloadAction<{
            prescriptionId: string;
            testId: string;
            status: Test["status"];
          }>
        ) => {
          const prescription = state.prescriptions.find(
            (p) => p.id === action.payload.prescriptionId
          );
          if (prescription) {
            const test = prescription.tests.find(
              (t) => t.id === action.payload.testId
            );
            if (test) {
              test.status = action.payload.status;
            }
          }
        }
      );
  },
});

export const { setSelectedPrescription, clearError } =
  prescriptionSlice.actions;
export default prescriptionSlice.reducer;
