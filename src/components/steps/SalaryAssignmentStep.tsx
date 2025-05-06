import React, { useEffect } from 'react';
import { useSalaryAssignmentStore } from '@/store/useSalaryAssignmentStore';

const SalaryAssignmentStep: React.FC = () => {
  const { assignments, loading, error, fetchAssignments } = useSalaryAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  if (loading) {
    return <div className="flex justify-center py-8">Loading salary assignments...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error loading salary assignments: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Salary Assignment Check</h2>
        <p className="text-gray-600">
          Confirm all employees have active individual salary assignments for the current period.
        </p>
      </div>

      {/* Placeholder content - to be implemented in the next phase */}
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Coming in the next phase</h3>
        <p className="text-blue-600">
          This step will show employee assignment status and allow you to create or update assignments as needed.
        </p>
      </div>
    </div>
  );
};

export default SalaryAssignmentStep;