import React, { useState, useEffect } from 'react';
import { createResource } from '../utils/api';
import { SalaryStructure, Employee } from '../types';

const Dashboard: React.FC = () => {
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data when component mounts
    const fetchSalaryStructures = createResource<SalaryStructure[]>({
      url: 'hr_bh.api.payroll_inst.get_salary_structures',
      auto: true,
      onSuccess: (data) => {
        setSalaryStructures(data);
      },
      onError: (err) => {
        setError(`Error loading salary structures: ${err.message}`);
      }
    });

    const fetchEmployees = createResource<Employee[]>({
      url: 'hr_bh.api.payroll_inst.get_employees_for_payroll',
      auto: true,
      onSuccess: (data) => {
        setEmployees(data);
        setLoading(false);
      },
      onError: (err) => {
        setError(`Error loading employees: ${err.message}`);
        setLoading(false);
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  if (loading) return <div className="flex justify-center p-8">Loading payroll data...</div>;
  if (error) return <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Salary Structures Card */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Active Salary Structures</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Structure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaryStructures.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No salary structures found
                  </td>
                </tr>
              ) : (
                salaryStructures.map((structure) => (
                  <tr key={structure.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{structure.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{structure.salary_structure}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{structure.company}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employees Card */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Employees for Payroll</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.employee_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.designation}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;