import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Billing } from "../../types";

// Mock billing data
const mockBilling: Billing[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Doe",
    appointmentId: "1",
    items: [
      {
        id: "1",
        name: "Consultation - Dr. Sarah Johnson",
        type: "consultation",
        quantity: 1,
        unitPrice: 150.0,
        totalPrice: 150.0,
      },
      {
        id: "2",
        name: "Aspirin 100mg",
        type: "medicine",
        quantity: 1,
        unitPrice: 15.99,
        totalPrice: 15.99,
      },
      {
        id: "3",
        name: "Blood Test",
        type: "test",
        quantity: 1,
        unitPrice: 45.0,
        totalPrice: 45.0,
      },
    ],
    totalAmount: 210.99,
    paidAmount: 210.99,
    status: "paid",
    createdAt: "2024-01-15T10:00:00Z",
    paidAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Jane Smith",
    appointmentId: "2",
    items: [
      {
        id: "4",
        name: "Consultation - Dr. Michael Chen",
        type: "consultation",
        quantity: 1,
        unitPrice: 200.0,
        totalPrice: 200.0,
      },
    ],
    totalAmount: 200.0,
    paidAmount: 0.0,
    status: "pending",
    createdAt: "2024-01-16T14:00:00Z",
  },
];

interface BillingState {
  billing: Billing[];
  loading: boolean;
  error: string | null;
  selectedBilling: Billing | null;
}

const initialState: BillingState = {
  billing: [],
  loading: false,
  error: null,
  selectedBilling: null,
};

export const fetchBilling = createAsyncThunk(
  "billing/fetchBilling",
  async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockBilling;
  }
);

export const createBilling = createAsyncThunk(
  "billing/createBilling",
  async (billing: Omit<Billing, "id" | "createdAt">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newBilling: Billing = {
      ...billing,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    return newBilling;
  }
);

export const updateBillingStatus = createAsyncThunk(
  "billing/updateStatus",
  async ({
    id,
    status,
    paidAmount,
  }: {
    id: string;
    status: Billing["status"];
    paidAmount: number;
  }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { id, status, paidAmount };
  }
);

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setSelectedBilling: (state, action: PayloadAction<Billing | null>) => {
      state.selectedBilling = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBilling.fulfilled,
        (state, action: PayloadAction<Billing[]>) => {
          state.loading = false;
          state.billing = action.payload;
        }
      )
      .addCase(fetchBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch billing";
      })
      .addCase(
        createBilling.fulfilled,
        (state, action: PayloadAction<Billing>) => {
          state.billing.push(action.payload);
        }
      )
      .addCase(
        updateBillingStatus.fulfilled,
        (
          state,
          action: PayloadAction<{
            id: string;
            status: Billing["status"];
            paidAmount: number;
          }>
        ) => {
          const billing = state.billing.find((b) => b.id === action.payload.id);
          if (billing) {
            billing.status = action.payload.status;
            billing.paidAmount = action.payload.paidAmount;
            if (action.payload.status === "paid") {
              billing.paidAt = new Date().toISOString();
            }
          }
        }
      );
  },
});

export const { setSelectedBilling, clearError } = billingSlice.actions;
export default billingSlice.reducer;
