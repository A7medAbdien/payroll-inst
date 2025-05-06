import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface EmployeeStructure {
  employee: string;
  employeeName: string;
  department: string;
  hasStructure: boolean;
  structureId?: string;
  missingComponents: string[];
}

interface SalaryStructureStore {
  structures: EmployeeStructure[];
  loading: boolean;
  error: Error | null;
  fetchStructures: () => Promise<void>;
  updateStructureStatus: (employeeId: string, hasStructure: boolean, structureId?: string) => void;
}

// Mock employee structure data
const mockStructures: EmployeeStructure[] = [
  {
    employee: "EMP001",
    employeeName: "John Doe",
    department: "Finance",
    hasStructure: true,
    structureId: "SS0001",
    missingComponents: []
  },
  {
    employee: "EMP002",
    employeeName: "Jane Smith",
    department: "HR",
    hasStructure: true,
    structureId: "SS0002",
    missingComponents: ["Transportation Allowance"]
  },
  {
    employee: "EMP003",
    employeeName: "Robert Johnson",
    department: "IT",
    hasStructure: false,
    missingComponents: ["Basic", "Housing Allowance"]
  },
  {
    employee: "EMP004",
    employeeName: "Emily Davis",
    department: "Marketing",
    hasStructure: true,
    structureId: "SS0004",
    missingComponents: []
  },
  {
    employee: "EMP005",
    employeeName: "Michael Wilson",
    department: "Operations",
    hasStructure: false,
    missingComponents: ["Income Tax"]
  }
];

export const useSalaryStructureStore = create<SalaryStructureStore>()(
  devtools(
    (set) => ({
      structures: [],
      loading: false,
      error: null,
      fetchStructures: async () => {
        set({ loading: true });
        try {
          // TODO: Implement actual Frappe call here
          // const response = await window.frappe.call({
          //   method: 'hr_bh.api.get_employee_structures'
          // });
          // set({ structures: response.message, loading: false });

          // For demo, use mock data
          setTimeout(() => {
            set({ structures: mockStructures, loading: false });
          }, 800);
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },
      updateStructureStatus: (employeeId, hasStructure, structureId) =>
        set((state) => ({
          structures: state.structures.map((structure) =>
            structure.employee === employeeId
              ? { ...structure, hasStructure, structureId: structureId || structure.structureId }
              : structure
          ),
        })),
    }),
    { name: 'salary-structure-store' }
  )
);