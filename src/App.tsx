import { useEffect } from 'react'
import './App.css'
import { useUserStore } from '@/store/useUserStore'
import { useWizardStore } from '@/store/useWizardStore'
import { useDashboardStore } from '@/store/useDashboardStore'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import StatusDashboard from '@/components/StatusDashboard'
import SalaryComponentsStep from '@/components/steps/SalaryComponentsStep'
import SalaryStructureStep from '@/components/steps/SalaryStructureStep'
import SalaryAssignmentStep from '@/components/steps/SalaryAssignmentStep'
import PayrollEntryStep from '@/components/steps/PayrollEntryStep'
import ActionBar from '@/components/ActionBar'

function App() {
  const { user, loading: userLoading, error: userError, fetchUser } = useUserStore()
  const { metrics, fetchMetrics } = useDashboardStore()
  const { currentStep, steps } = useWizardStore()

  useEffect(() => {
    // Fetch user info when component mounts
    fetchUser()

    // Fetch dashboard metrics
    fetchMetrics()
  }, [fetchUser, fetchMetrics])

  const renderStepContent = () => {
    switch (currentStep) {
      case 'salary-components':
        return <SalaryComponentsStep />
      case 'salary-structure':
        return <SalaryStructureStep />
      case 'salary-assignment':
        return <SalaryAssignmentStep />
      case 'payroll-entry':
        return <PayrollEntryStep />
      default:
        return <SalaryComponentsStep />
    }
  }

  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  // Error state
  if (userError) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-lg text-red-600 p-4">
          Error: {userError.message}
        </div>
      </div>
    )
  }

  // User not found state
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-yellow-50">
        <div className="text-lg text-yellow-700 p-4">
          User not found. Please log in.
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => window.location.href = "/login"}
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F1EA]">
      <Header
        user={user}
        onLogout={() => {
          // TODO: Implement logout functionality
          // window.frappe.call('logout').then(() => {
          //   window.location.href = "/login";
          // });
          console.log("Logout clicked")
        }}
      />

      <div className="flex flex-1">
        <Sidebar
          steps={steps}
          currentStep={currentStep}
        />

        <main className="ml-64 flex-1 p-6 flex flex-col">
          <StatusDashboard metrics={metrics} />

          <div className="bg-white rounded-lg shadow-sm p-6 mb-4 flex-1">
            {renderStepContent()}
          </div>

          <ActionBar
            currentStep={currentStep}
            steps={steps}
          />
        </main>
      </div>
    </div>
  )
}

export default App
