import React, { useEffect } from 'react';
import { usePayrollEntryStore } from '@/store/usePayrollEntryStore';

const PayrollEntryStep: React.FC = () => {
  const { payrollEntry, loading, error, fetchPayrollEntry } = usePayrollEntryStore();

  useEffect(() => {
    fetchPayrollEntry();
  }, [fetchPayrollEntry]);

  if (loading) {
    return <div className="flex justify-center py-8">Loading payroll entry...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error loading payroll entry: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payroll Entry Validation</h2>
        <p className="text-gray-600">
          Ensure a payroll entry exists for the current period and includes all employees with complete setups.
        </p>
      </div>

      {/* Placeholder content - to be implemented in the next phase */}
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Coming in the next phase</h3>
        <p className="text-blue-600">
          This step will show payroll entry status and employee inclusion status, allowing you to create or update the current payroll entry.
        </p>
      </div>
    </div>
  );
};

export default PayrollEntryStep;