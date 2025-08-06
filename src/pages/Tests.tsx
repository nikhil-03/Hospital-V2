import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchPrescriptions } from "../store/slices/prescriptionSlice";
import { TestTube } from "lucide-react";

const Tests = () => {
  console.log("Tests page rendered"); // Debug log
  const dispatch = useAppDispatch();
  const { prescriptions, loading } = useAppSelector(
    (state) => state.prescriptions
  );

  useEffect(() => {
    console.log("Tests page useEffect"); // Debug log
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  // Extract all tests from prescriptions
  const allTests = prescriptions.flatMap((prescription) =>
    prescription.tests.map((test) => ({
      ...test,
      prescriptionId: prescription.id,
      patientName: "John Doe", // Mock patient name
    }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Laboratory Tests</h1>
        <p className="mt-2 text-gray-600">
          Manage and track medical test requests and results
        </p>
      </div>

      {/* Simple Test Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Test Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-800">Pending Tests</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {allTests.filter((t) => t.status === "pending").length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Completed Tests</h3>
            <p className="text-2xl font-bold text-green-900">
              {allTests.filter((t) => t.status === "completed").length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium text-red-800">Cancelled Tests</h3>
            <p className="text-2xl font-bold text-red-900">
              {allTests.filter((t) => t.status === "cancelled").length}
            </p>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Tests
        </h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading tests...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allTests.map((test) => (
              <div
                key={`${test.prescriptionId}-${test.id}`}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-500">{test.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${test.price}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : test.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && allTests.length === 0 && (
        <div className="text-center py-12">
          <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tests found
          </h3>
          <p className="text-gray-500">No tests available.</p>
        </div>
      )}
    </div>
  );
};

export default Tests;
