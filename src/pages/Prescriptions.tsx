import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchPrescriptions } from "../store/slices/prescriptionSlice";
import { FileText, Pill, TestTube } from "lucide-react";

const Prescriptions = () => {
  console.log("Prescriptions page rendered"); // Debug log
  const dispatch = useAppDispatch();
  const { prescriptions, loading } = useAppSelector(
    (state) => state.prescriptions
  );

  useEffect(() => {
    console.log("Prescriptions page useEffect"); // Debug log
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
        <p className="mt-2 text-gray-600">
          Manage patient prescriptions and medical tests
        </p>
      </div>

      {/* Simple Test Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Prescription Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Total Prescriptions</h3>
            <p className="text-2xl font-bold text-blue-900">
              {prescriptions.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Total Medicines</h3>
            <p className="text-2xl font-bold text-green-900">
              {prescriptions.reduce((sum, p) => sum + p.medicines.length, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Prescriptions
        </h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading prescriptions...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Prescription #{prescription.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Prescribed by {prescription.prescribedBy}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(prescription.prescribedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Medicines */}
                {prescription.medicines.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Pill className="h-4 w-4 mr-2 text-green-600" />
                      Medicines ({prescription.medicines.length})
                    </h4>
                    <div className="space-y-2">
                      {prescription.medicines.map((medicine) => (
                        <div
                          key={medicine.id}
                          className="bg-green-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {medicine.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {medicine.dosage} • {medicine.frequency}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ${medicine.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tests */}
                {prescription.tests.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <TestTube className="h-4 w-4 mr-2 text-blue-600" />
                      Medical Tests ({prescription.tests.length})
                    </h4>
                    <div className="space-y-2">
                      {prescription.tests.map((test) => (
                        <div
                          key={test.id}
                          className="bg-blue-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {test.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {test.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ${test.price}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                  </div>
                )}

                {/* Notes */}
                {prescription.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Doctor's Notes
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {prescription.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && prescriptions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No prescriptions found
          </h3>
          <p className="text-gray-500">No prescriptions available.</p>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
