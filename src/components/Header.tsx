import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800">Payroll Institute</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Welcome, <span className="font-medium">{user.first_name || user.name}</span>
        </div>
        <div className="relative group">
          <button
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
            onClick={() => {
              const dropdown = document.getElementById('user-dropdown');
              if (dropdown) {
                dropdown.classList.toggle('hidden');
              }
            }}
          >
            {user.user_image ? (
              <img src={user.user_image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-700 font-medium">{user.first_name?.[0] || user.name[0]}</span>
            )}
          </button>
          <div id="user-dropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden z-10">
            <a href="/app" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;