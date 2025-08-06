import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchBilling, updateBillingStatus } from '../store/slices/billingSlice';
import type { Billing } from '../types';
import { Search, Filter, CreditCard, DollarSign, Calendar, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const BillingPage = () => {
  const dispatch = useAppDispatch();
  const { billing, loading } = useAppSelector(state => state.billing);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    dispatch(fetchBilling());
  }, [dispatch]);

  const filteredBilling = billing.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || bill.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePaymentUpdate = (billId: string, status: Billing['status'], paidAmount: number) => {
    dispatch(updateBillingStatus({ id: billId, status, paidAmount }));
  };

  const getStatusIcon = (status: Billing['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Billing['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const totalRevenue = billing.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPaid = billing.reduce((sum, bill) => sum + bill.paidAmount, 0);
  const pendingAmount = totalRevenue - totalPaid;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="mt-2 text-gray-600">Manage patient billing and payments</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">${pendingAmount.toLocaleString()}</p>
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
              placeholder="Search bills by patient name..."
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
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Billing List */}
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
          {filteredBilling.map((bill) => (
            <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{bill.patientName}</h3>
                    <p className="text-sm text-gray-500">Bill #{bill.id}</p>
                    <p className="text-sm text-gray-500">{new Date(bill.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(bill.status)}
                    <span className={`badge ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">${bill.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Paid: ${bill.paidAmount.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Bill Items */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-3">Bill Items</h4>
                <div className="space-y-2">
                  {bill.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Payment Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {bill.paidAt && `Paid on ${new Date(bill.paidAt).toLocaleDateString()}`}
                </div>
                <div className="flex space-x-2">
                  {bill.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handlePaymentUpdate(bill.id, 'partial', bill.totalAmount * 0.5)}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        Partial Payment
                      </button>
                      <button
                        onClick={() => handlePaymentUpdate(bill.id, 'paid', bill.totalAmount)}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Mark as Paid
                      </button>
                    </>
                  )}
                  {bill.status === 'partial' && (
                    <button
                      onClick={() => handlePaymentUpdate(bill.id, 'paid', bill.totalAmount)}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Complete Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredBilling.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
          <p className="text-gray-500">No bills match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BillingPage; 