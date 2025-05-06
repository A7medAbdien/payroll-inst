import React, { useEffect } from 'react';
import { useSalaryStructureStore } from '@/store/useSalaryStructureStore';

const SalaryStructureStep: React.FC = () => {
  const { structures, loading, error, fetchStructures } = useSalaryStructureStore();

  useEffect(() => {
    fetchStructures();
  }, [fetchStructures]);

  if (loading) {
    return <div className="flex justify-center py-8">Loading salary structures...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error loading salary structures: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Salary Structure Validation</h2>
        <p className="text-gray-600">
          Ensure every employee has their own appropriate active salary structure.
        </p>
      </div>

      {/* Placeholder content - to be implemented in the next phase */}
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Coming in the next phase</h3>
        <p className="text-blue-600">
          This step will display the status of each employee's salary structure and allow you to create or edit them as needed.
        </p>
      </div>
    </div>
  );
};

export default SalaryStructureStep;