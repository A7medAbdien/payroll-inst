import React from 'react';
import { useWizardStore, WizardStep } from '@/store/useWizardStore';

interface SidebarProps {
  steps: WizardStep[];
  currentStep: string;
}

const Sidebar: React.FC<SidebarProps> = ({ steps, currentStep }) => {
  const setCurrentStep = useWizardStore(state => state.setCurrentStep);

  // Icons mapping for each step
  const getIconForStep = (stepId: string) => {
    switch (stepId) {
      case 'salary-components':
        return 'list';
      case 'salary-structure':
        return 'file-text';
      case 'salary-assignment':
        return 'users';
      case 'payroll-entry':
        return 'calendar';
      default:
        return 'check-circle';
    }
  };

  // Status colors
  const getStatusColor = (status: WizardStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <aside className="w-64 bg-[#383838] text-white h-full fixed left-0 top-0 pt-16">
      <div className="py-4 overflow-y-auto">
        <h2 className="text-lg font-semibold px-6 mb-4">Payroll Preparation</h2>

        <ul className="space-y-1">
          {steps.sort((a, b) => a.order - b.order).map((step) => (
            <li key={step.id}>
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center w-full p-3 text-base rounded-lg ${
                  currentStep === step.id
                    ? 'bg-[#4A4A4A] text-white'
                    : 'text-gray-300 hover:bg-[#4A4A4A]'
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 mr-3 rounded-full ${
                  currentStep === step.id ? 'bg-[#007ACC] text-white' : 'bg-gray-700'
                }`}>
                  {step.status === 'completed' ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span>{step.order}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{step.title}</span>
                  <span className={`text-xs ${getStatusColor(step.status)}`}>
                    {step.status === 'completed' ? 'Completed' :
                     step.status === 'in-progress' ? 'In Progress' :
                     step.status === 'error' ? 'Needs Attention' : 'Pending'}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;