import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchPrescriptions,
  updateTestStatus,
} from "../store/slices/prescriptionSlice";
import {
  Search,
  Filter,
  FileText,
  Pill,
  TestTube,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { Prescription, Test } from "../types";

const Prescriptions = () => {
  const dispatch = useAppDispatch();
  const { prescriptions, loading } = useAppSelector(
    (state) => state.prescriptions
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch = prescription.prescribedBy
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleTestStatusUpdate = (
    prescriptionId: string,
    testId: string,
    status: Test["status"]
  ) => {
    dispatch(updateTestStatus({ prescriptionId, testId, status }));
  };

  const getTestStatusIcon = (status: Test["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTestStatusColor = (status: Test["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
        <p className="mt-2 text-gray-600">
          Manage patient prescriptions and medical tests
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prescriptions by doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
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
              </div>

              {/* Medicines */}
              {prescription.medicines.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-green-600" />
                    Medicines
                  </h4>
                  <div className="space-y-3">
                    {prescription.medicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="bg-green-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {medicine.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {medicine.dosage} • {medicine.frequency}
                            </p>
                            <p className="text-sm text-gray-600">
                              Duration: {medicine.duration}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {medicine.instructions}
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
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <TestTube className="h-5 w-5 mr-2 text-blue-600" />
                    Medical Tests
                  </h4>
                  <div className="space-y-3">
                    {prescription.tests.map((test) => (
                      <div key={test.id} className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {test.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {test.description}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Preparation: {test.preparation}
                            </p>
                            {test.result && (
                              <p className="text-sm text-gray-600 mt-1">
                                Result: {test.result}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-medium text-gray-900">
                              ${test.price}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              {getTestStatusIcon(test.status)}
                              <span
                                className={`badge ${getTestStatusColor(
                                  test.status
                                )}`}
                              >
                                {test.status}
                              </span>
                            </div>
                            {test.status === "pending" && (
                              <div className="flex space-x-2 mt-2">
                                <button
                                  onClick={() =>
                                    handleTestStatusUpdate(
                                      prescription.id,
                                      test.id,
                                      "completed"
                                    )
                                  }
                                  className="btn-secondary text-xs px-2 py-1"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() =>
                                    handleTestStatusUpdate(
                                      prescription.id,
                                      test.id,
                                      "cancelled"
                                    )
                                  }
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {prescription.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Doctor's Notes
                  </h4>
                  <p className="text-gray-600">{prescription.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && filteredPrescriptions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No prescriptions found
          </h3>
          <p className="text-gray-500">
            No prescriptions match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
