import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface DashboardMetrics {
  currentPeriod: string;
  totalEmployees: number;
  employeesWithCompleteSetup: number;
  overallCompletion: number;
  lastVerification: string;
}

interface DashboardStore {
  metrics: DashboardMetrics;
  loading: boolean;
  error: Error | null;
  fetchMetrics: () => Promise<void>;
  updateMetrics: (metrics: Partial<DashboardMetrics>) => void;
}

// Mock dashboard metrics
const mockMetrics: DashboardMetrics = {
  currentPeriod: "July 2023",
  totalEmployees: 5,
  employeesWithCompleteSetup: 2,
  overallCompletion: 40, // 40% completion
  lastVerification: "2023-07-15T10:30:00Z"
};

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set) => ({
      metrics: {
        currentPeriod: "",
        totalEmployees: 0,
        employeesWithCompleteSetup: 0,
        overallCompletion: 0,
        lastVerification: ""
      },
      loading: false,
      error: null,
      fetchMetrics: async () => {
        set({ loading: true });
        try {
          // TODO: Implement actual Frappe call here
          // const response = await window.frappe.call({
          //   method: 'hr_bh.api.get_payroll_dashboard_metrics'
          // });
          // set({ metrics: response.message, loading: false });

          // For demo, use mock data
          setTimeout(() => {
            set({ metrics: mockMetrics, loading: false });
          }, 500);
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },
      updateMetrics: (newMetrics) =>
        set((state) => ({
          metrics: { ...state.metrics, ...newMetrics }
        })),
    }),
    { name: 'dashboard-store' }
  )
);