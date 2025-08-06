import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchPrescriptions, updateTestStatus } from '../store/slices/prescriptionSlice';
import { Search, Filter, TestTube, User, Calendar, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import type { Test } from '../types';

const Tests = () => {
  const dispatch = useAppDispatch();
  const { prescriptions, loading } = useAppSelector(state => state.prescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  // Extract all tests from prescriptions
  const allTests = prescriptions.flatMap(prescription => 
    prescription.tests.map(test => ({
      ...test,
      prescriptionId: prescription.id,
      patientName: 'John Doe', // Mock patient name
    }))
  );

  const filteredTests = allTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || test.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTestStatusUpdate = (prescriptionId: string, testId: string, status: Test['status']) => {
    dispatch(updateTestStatus({ prescriptionId, testId, status }));
  };

  const getStatusIcon = (status: Test['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Test['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const pendingTests = allTests.filter(test => test.status === 'pending');
  const completedTests = allTests.filter(test => test.status === 'completed');
  const cancelledTests = allTests.filter(test => test.status === 'cancelled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Laboratory Tests</h1>
        <p className="mt-2 text-gray-600">Manage and track medical test requests and results</p>
      </div>

      {/* Test Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tests</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTests.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Tests</p>
              <p className="text-2xl font-bold text-gray-900">{completedTests.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled Tests</p>
              <p className="text-2xl font-bold text-gray-900">{cancelledTests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests by name or description..."
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

      {/* Tests List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
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
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <div key={`${test.prescriptionId}-${test.id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TestTube className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-500">{test.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{test.patientName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(test.prescribedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(test.status)}
                    <span className={`badge ${getStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">${test.price}</p>
                </div>
              </div>
              
              {/* Test Details */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Test Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Preparation Required</p>
                    <p className="text-gray-900">{test.preparation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prescribed By</p>
                    <p className="text-gray-900">{test.prescribedBy}</p>
                  </div>
                </div>
                
                {test.result && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-1">Test Result</h5>
                    <p className="text-gray-600">{test.result}</p>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {test.completedAt && `Completed on ${new Date(test.completedAt).toLocaleDateString()}`}
                </div>
                <div className="flex space-x-2">
                  {test.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleTestStatusUpdate(test.prescriptionId, test.id, 'completed')}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        Complete Test
                      </button>
                      <button
                        onClick={() => handleTestStatusUpdate(test.prescriptionId, test.id, 'cancelled')}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg"
                      >
                        Cancel Test
                      </button>
                    </>
                  )}
                  {test.status === 'completed' && (
                    <button className="btn-outline text-sm px-3 py-1">
                      <FileText className="h-4 w-4 mr-1" />
                      View Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredTests.length === 0 && (
        <div className="text-center py-12">
          <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-500">No tests match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Tests; 