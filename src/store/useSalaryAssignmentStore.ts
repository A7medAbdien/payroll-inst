import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SalaryAssignment {
  employee: string;
  employeeName: string;
  department: string;
  hasAssignment: boolean;
  assignmentId?: string;
  fromDate?: string;
  toDate?: string;
  isActive: boolean;
}

interface SalaryAssignmentStore {
  assignments: SalaryAssignment[];
  loading: boolean;
  error: Error | null;
  fetchAssignments: () => Promise<void>;
  updateAssignmentStatus: (employeeId: string, hasAssignment: boolean, assignmentId?: string) => void;
}

// Mock salary assignment data
const mockAssignments: SalaryAssignment[] = [
  {
    employee: "EMP001",
    employeeName: "John Doe",
    department: "Finance",
    hasAssignment: true,
    assignmentId: "SA0001",
    fromDate: "2023-01-01",
    toDate: "2023-12-31",
    isActive: true
  },
  {
    employee: "EMP002",
    employeeName: "Jane Smith",
    department: "HR",
    hasAssignment: true,
    assignmentId: "SA0002",
    fromDate: "2023-01-01",
    toDate: "2023-06-30",
    isActive: false
  },
  {
    employee: "EMP003",
    employeeName: "Robert Johnson",
    department: "IT",
    hasAssignment: false,
    isActive: false
  },
  {
    employee: "EMP004",
    employeeName: "Emily Davis",
    department: "Marketing",
    hasAssignment: true,
    assignmentId: "SA0004",
    fromDate: "2023-01-01",
    toDate: "2023-12-31",
    isActive: true
  },
  {
    employee: "EMP005",
    employeeName: "Michael Wilson",
    department: "Operations",
    hasAssignment: false,
    isActive: false
  }
];

export const useSalaryAssignmentStore = create<SalaryAssignmentStore>()(
  devtools(
    (set) => ({
      assignments: [],
      loading: false,
      error: null,
      fetchAssignments: async () => {
        set({ loading: true });
        try {
          // TODO: Implement actual Frappe call here
          // const response = await window.frappe.call({
          //   method: 'hr_bh.api.get_salary_assignments'
          // });
          // set({ assignments: response.message, loading: false });

          // For demo, use mock data
          setTimeout(() => {
            set({ assignments: mockAssignments, loading: false });
          }, 600);
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },
      updateAssignmentStatus: (employeeId, hasAssignment, assignmentId) =>
        set((state) => ({
          assignments: state.assignments.map((assignment) =>
            assignment.employee === employeeId
              ? {
                  ...assignment,
                  hasAssignment,
                  assignmentId: assignmentId || assignment.assignmentId,
                  isActive: hasAssignment
                }
              : assignment
          ),
        })),
    }),
    { name: 'salary-assignment-store' }
  )
);