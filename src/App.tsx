import { useState, useEffect } from 'react'
import './App.css'
import { createResource } from './utils/api'
import { User } from './types'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'

function App() {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [user, setUser] = useState<User | null>(null);

  const userResource = createResource<User>({
    url: 'hr_bh.api.get_current_user_info',
    auto: true,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: (err) => {
      // Redirect to login if authentication failed
      if (err.message?.includes('not authenticated')) {
        window.location.href = "/login?redirect-to=%2Fhr_bh%2Fpayroll";
      }
    }
  });

  const handleLogout = () => {
    window.frappe.call('logout').then(() => {
      window.location.href = "/login";
    });
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      // Other pages can be added here
      default:
        return <Dashboard />;
    }
  };

  if (userResource.loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (userResource.error) return <div className="flex items-center justify-center h-screen bg-red-50 text-red-700 p-4">Error: {userResource.error.message}</div>;
  if (!user) return <div className="flex items-center justify-center h-screen">User not found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />

      <div className="flex flex-1">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <main className="ml-64 flex-1 p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
