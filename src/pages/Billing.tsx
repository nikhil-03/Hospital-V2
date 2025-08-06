import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchBilling } from "../store/slices/billingSlice";
import type { Billing } from "../types";
import { CreditCard } from "lucide-react";

const BillingPage = () => {
  console.log("Billing page rendered"); // Debug log
  const dispatch = useAppDispatch();
  const { billing, loading } = useAppSelector((state) => state.billing);

  useEffect(() => {
    console.log("Billing page useEffect"); // Debug log
    dispatch(fetchBilling());
  }, [dispatch]);

  const filteredBilling = billing;

  const getStatusColor = (status: Billing["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const totalRevenue = billing.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPaid = billing.reduce((sum, bill) => sum + bill.paidAmount, 0);
  const pendingAmount = totalRevenue - totalPaid;

  return (
    <div className="space-y-6">
      {/* Simple Test */}
      <div className="bg-red-100 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-red-800">BILLING PAGE TEST</h1>
        <p className="text-red-600">
          If you can see this, the page is working!
        </p>
        <p className="text-red-600">Loading: {loading ? "Yes" : "No"}</p>
        <p className="text-red-600">Bills count: {billing.length}</p>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="mt-2 text-gray-600">
          Manage patient billing and payments
        </p>
      </div>

      {/* Simple Test Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Billing Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-900">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Total Paid</h3>
            <p className="text-2xl font-bold text-blue-900">
              ${totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium text-red-800">Pending Amount</h3>
            <p className="text-2xl font-bold text-red-900">
              ${pendingAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Billing List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Bills
        </h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading bills...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBilling.map((bill) => (
              <div
                key={bill.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {bill.patientName}
                    </h3>
                    <p className="text-sm text-gray-500">Bill #{bill.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${bill.totalAmount.toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        bill.status
                      )}`}
                    >
                      {bill.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && filteredBilling.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bills found
          </h3>
          <p className="text-gray-500">No bills match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
