import React, { useEffect } from 'react';
import { useSalaryComponentStore, SalaryComponent } from '@/store/useSalaryComponentStore';

const SalaryComponentsStep: React.FC = () => {
  const { components, loading, error, fetchComponents, updateComponentStatus } = useSalaryComponentStore();

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  // Calculate completion statistics
  const requiredComponents = components.filter(comp => comp.isRequired);
  const missingRequiredComponents = requiredComponents.filter(comp => !comp.exists);
  const completionPercentage = requiredComponents.length > 0
    ? Math.round(((requiredComponents.length - missingRequiredComponents.length) / requiredComponents.length) * 100)
    : 0;

  const handleComponentAction = (component: SalaryComponent) => {
    // In a real implementation, this would open a new window to create/edit the component
    // For demo, we'll simulate the component being created
    if (!component.exists) {
      // Simulate opening ERPNext form
      window.open(`#Form/Salary Component/${component.name}`, '_blank');

      // For demo, update the local state to show it exists now
      setTimeout(() => {
        updateComponentStatus(component.name, true);
      }, 1000);
    } else {
      // Open existing component
      window.open(`#Form/Salary Component/${component.name}`, '_blank');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading salary components...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error loading salary components: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Salary Components Verification</h2>
        <p className="text-gray-600">
          Ensure all required salary components exist in the system. Missing components need to be created before proceeding.
        </p>
      </div>

      {/* Progress summary */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Required Components Completion</h3>
          <span className="text-sm font-medium">
            {requiredComponents.length - missingRequiredComponents.length} of {requiredComponents.length} components exist
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${completionPercentage === 100 ? 'bg-green-600' : 'bg-blue-500'}`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Components list */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 py-3 px-4 text-sm font-medium text-gray-500">
          <div className="col-span-3">Component Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-1 text-center">Required</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        <div className="divide-y divide-gray-200">
          {components.map((component) => (
            <div
              key={component.name}
              className={`grid grid-cols-12 py-3 px-4 ${
                component.isRequired && !component.exists ? 'bg-red-50' : ''
              }`}
            >
              <div className="col-span-3 font-medium">{component.name}</div>
              <div className="col-span-2 capitalize">{component.type}</div>
              <div className="col-span-4 text-gray-600">{component.description}</div>
              <div className="col-span-1 text-center">
                {component.isRequired ? (
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Required
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">Optional</span>
                )}
              </div>
              <div className="col-span-2 text-center">
                <button
                  onClick={() => handleComponentAction(component)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    component.exists
                      ? 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {component.exists ? 'View/Edit' : 'Create'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing components summary */}
      {missingRequiredComponents.length > 0 && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2">Missing Required Components</h3>
          <ul className="list-disc pl-5 text-yellow-700 space-y-1">
            {missingRequiredComponents.map(comp => (
              <li key={comp.name}>
                {comp.name} ({comp.type}) - Click the "Create" button to add this component
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SalaryComponentsStep;