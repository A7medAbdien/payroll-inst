import React from 'react';
import { useWizardStore, WizardStep } from '@/store/useWizardStore';

interface ActionBarProps {
  currentStep: string;
  steps: WizardStep[];
}

const ActionBar: React.FC<ActionBarProps> = ({ currentStep, steps }) => {
  const { setCurrentStep, updateStepStatus } = useWizardStore();

  // Find current step object
  const currentStepObj = steps.find(step => step.id === currentStep);

  // Find previous and next steps based on order
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const currentIndex = sortedSteps.findIndex(step => step.id === currentStep);
  const previousStep = currentIndex > 0 ? sortedSteps[currentIndex - 1] : null;
  const nextStep = currentIndex < sortedSteps.length - 1 ? sortedSteps[currentIndex + 1] : null;

  const handlePrevious = () => {
    if (previousStep) {
      setCurrentStep(previousStep.id);
    }
  };

  const handleNext = () => {
    if (currentStepObj) {
      // Mark current step as completed when moving to next
      updateStepStatus(currentStepObj.id, 'completed');
    }

    if (nextStep) {
      // Mark next step as in-progress
      updateStepStatus(nextStep.id, 'in-progress');
      setCurrentStep(nextStep.id);
    }
  };

  const handleVerify = () => {
    // This would typically trigger a verification process
    // For demo, we'll just mark the step as in-progress
    if (currentStepObj) {
      updateStepStatus(currentStepObj.id, 'in-progress');

      // Simulate verification with a timeout
      setTimeout(() => {
        updateStepStatus(currentStepObj.id, 'completed');
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
      <div>
        {previousStep && (
          <button
            onClick={handlePrevious}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Previous: {previousStep.title}
          </button>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleVerify}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Verify Current Step
        </button>

        {nextStep && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-[#007ACC] text-white rounded-md hover:bg-blue-700"
          >
            Next: {nextStep.title}
          </button>
        )}

        {!nextStep && (
          <button
            onClick={() => alert('Payroll preparation complete!')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Complete Process
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionBar;