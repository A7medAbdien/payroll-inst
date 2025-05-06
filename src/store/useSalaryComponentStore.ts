import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SalaryComponent {
  name: string;
  type: 'earning' | 'deduction';
  description: string;
  isRequired: boolean;
  exists: boolean;
}

interface SalaryComponentStore {
  components: SalaryComponent[];
  loading: boolean;
  error: Error | null;
  fetchComponents: () => Promise<void>;
  updateComponentStatus: (name: string, exists: boolean) => void;
}

// Mock salary components data
const mockComponents: SalaryComponent[] = [
  {
    name: "Basic",
    type: "earning",
    description: "Basic salary component",
    isRequired: true,
    exists: true
  },
  {
    name: "Housing Allowance",
    type: "earning",
    description: "Monthly housing allowance",
    isRequired: true,
    exists: true
  },
  {
    name: "Transportation Allowance",
    type: "earning",
    description: "Monthly transportation allowance",
    isRequired: true,
    exists: false
  },
  {
    name: "Medical Insurance",
    type: "deduction",
    description: "Medical insurance premium",
    isRequired: true,
    exists: true
  },
  {
    name: "Income Tax",
    type: "deduction",
    description: "Income tax deduction",
    isRequired: true,
    exists: false
  },
  {
    name: "Bonus",
    type: "earning",
    description: "Performance bonus",
    isRequired: false,
    exists: true
  }
];

export const useSalaryComponentStore = create<SalaryComponentStore>()(
  devtools(
    (set) => ({
      components: [],
      loading: false,
      error: null,
      fetchComponents: async () => {
        set({ loading: true });
        try {
          // TODO: Implement actual Frappe call here
          // const response = await window.frappe.call({
          //   method: 'hr_bh.api.get_salary_components'
          // });
          // set({ components: response.message, loading: false });

          // For demo, use mock data
          setTimeout(() => {
            set({ components: mockComponents, loading: false });
          }, 700);
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },
      updateComponentStatus: (name, exists) =>
        set((state) => ({
          components: state.components.map((component) =>
            component.name === name ? { ...component, exists } : component
          ),
        })),
    }),
    { name: 'salary-component-store' }
  )
);