import React from 'react';
import { DashboardMetrics } from '@/store/useDashboardStore';

interface StatusDashboardProps {
  metrics: DashboardMetrics;
}

const StatusDashboard: React.FC<StatusDashboardProps> = ({ metrics }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Payroll Preparation Status</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Current Period */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Current Period</h3>
          <p className="text-2xl font-bold text-blue-900">{metrics.currentPeriod}</p>
        </div>

        {/* Total Employees */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Employees</h3>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalEmployees}</p>
        </div>

        {/* Setup Complete */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-1">Setup Complete</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-green-900 mr-2">
              {metrics.employeesWithCompleteSetup}
            </p>
            <p className="text-sm text-green-700">
              of {metrics.totalEmployees} employees
            </p>
          </div>
        </div>

        {/* Overall Completion */}
        <div className="p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Overall Progress</h3>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div
                className={`h-2.5 rounded-full ${
                  metrics.overallCompletion >= 75 ? 'bg-green-600' :
                  metrics.overallCompletion >= 40 ? 'bg-yellow-400' : 'bg-red-500'
                }`}
                style={{ width: `${metrics.overallCompletion}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-gray-900">{metrics.overallCompletion}%</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last verified: {formatDate(metrics.lastVerification)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusDashboard;