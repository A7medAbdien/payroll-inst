import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  order: number;
}

interface WizardStore {
  currentStep: string;
  steps: WizardStep[];
  setCurrentStep: (stepId: string) => void;
  updateStepStatus: (stepId: string, status: WizardStep['status']) => void;
}

// Mock initial steps data
const initialSteps: WizardStep[] = [
  {
    id: 'salary-components',
    title: 'Salary Components',
    description: 'Verify all required salary components exist in the system',
    status: 'pending',
    order: 1,
  },
  {
    id: 'salary-structure',
    title: 'Salary Structure',
    description: 'Ensure every employee has their own appropriate active salary structure',
    status: 'pending',
    order: 2,
  },
  {
    id: 'salary-assignment',
    title: 'Salary Assignment',
    description: 'Confirm all employees have active individual salary assignments',
    status: 'pending',
    order: 3,
  },
  {
    id: 'payroll-entry',
    title: 'Payroll Entry',
    description: 'Ensure a payroll entry exists for the current period and includes all employees',
    status: 'pending',
    order: 4,
  },
];

export const useWizardStore = create<WizardStore>()(
  devtools(
    (set) => ({
      currentStep: 'salary-components',
      steps: initialSteps,
      setCurrentStep: (stepId) => set({ currentStep: stepId }),
      updateStepStatus: (stepId, status) =>
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === stepId ? { ...step, status } : step
          ),
        })),
    }),
    { name: 'wizard-store' }
  )
);