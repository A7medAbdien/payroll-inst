import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface PayrollEntry {
  exists: boolean;
  payrollId?: string;
  periodStart?: string;
  periodEnd?: string;
  includedEmployees: number;
  totalEmployees: number;
  employeesIncluded: Array<{
    employee: string;
    employeeName: string;
    included: boolean;
  }>;
}

interface PayrollEntryStore {
  payrollEntry: PayrollEntry | null;
  loading: boolean;
  error: Error | null;
  fetchPayrollEntry: () => Promise<void>;
  updatePayrollStatus: (exists: boolean, payrollId?: string) => void;
  updateEmployeeInclusion: (employeeId: string, included: boolean) => void;
}

// Mock payroll entry data
const mockPayrollEntry: PayrollEntry = {
  exists: true,
  payrollId: "PE0001",
  periodStart: "2023-07-01",
  periodEnd: "2023-07-31",
  includedEmployees: 3,
  totalEmployees: 5,
  employeesIncluded: [
    {
      employee: "EMP001",
      employeeName: "John Doe",
      included: true
    },
    {
      employee: "EMP002",
      employeeName: "Jane Smith",
      included: false
    },
    {
      employee: "EMP003",
      employeeName: "Robert Johnson",
      included: false
    },
    {
      employee: "EMP004",
      employeeName: "Emily Davis",
      included: true
    },
    {
      employee: "EMP005",
      employeeName: "Michael Wilson",
      included: true
    }
  ]
};

export const usePayrollEntryStore = create<PayrollEntryStore>()(
  devtools(
    (set) => ({
      payrollEntry: null,
      loading: false,
      error: null,
      fetchPayrollEntry: async () => {
        set({ loading: true });
        try {
          // TODO: Implement actual Frappe call here
          // const response = await window.frappe.call({
          //   method: 'hr_bh.api.get_payroll_entry'
          // });
          // set({ payrollEntry: response.message, loading: false });

          // For demo, use mock data
          setTimeout(() => {
            set({ payrollEntry: mockPayrollEntry, loading: false });
          }, 900);
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },
      updatePayrollStatus: (exists, payrollId) =>
        set((state) => ({
          payrollEntry: state.payrollEntry
            ? {
                ...state.payrollEntry,
                exists,
                payrollId: payrollId || state.payrollEntry.payrollId
              }
            : null,
        })),
      updateEmployeeInclusion: (employeeId, included) =>
        set((state) => {
          if (!state.payrollEntry) return { payrollEntry: null };

          const updatedEmployees = state.payrollEntry.employeesIncluded.map(emp =>
            emp.employee === employeeId ? { ...emp, included } : emp
          );

          const includedCount = updatedEmployees.filter(emp => emp.included).length;

          return {
            payrollEntry: {
              ...state.payrollEntry,
              employeesIncluded: updatedEmployees,
              includedEmployees: includedCount
            }
          };
        }),
    }),
    { name: 'payroll-entry-store' }
  )
);