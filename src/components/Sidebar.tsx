import React from 'react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { id: 'salary-structures', label: 'Salary Structures', icon: 'dollar-sign' },
    { id: 'employees', label: 'Employees', icon: 'users' },
    { id: 'payroll-entries', label: 'Payroll Entries', icon: 'file-text' },
    { id: 'salary-slips', label: 'Salary Slips', icon: 'file' },
    { id: 'reports', label: 'Reports', icon: 'bar-chart-2' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-full fixed left-0 top-0 pt-16">
      <div className="py-4 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActivePage(item.id)}
                className={`flex items-center w-full p-2 text-base rounded-lg ${
                  activePage === item.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href={`/assets/hr_bh/payroll-inst/feather-sprite.svg#${item.icon}`} />
                </svg>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;