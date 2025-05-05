import { User, SalaryStructure, Employee } from '../types';

// Mock data for development mode
const mockData: Record<string, any> = {
  'hr_bh.api.get_current_user_info': {
    name: 'test_user',
    first_name: 'Test',
    full_name: 'Test User',
    user_image: '',
    roles: ['HR Manager', 'System Manager']
  } as User,

  'hr_bh.api.payroll_inst.get_salary_structures': [
    {
      name: 'SS-001',
      salary_structure: 'Standard Salary Structure',
      company: 'Your Company'
    },
    {
      name: 'SS-002',
      salary_structure: 'Executive Salary Structure',
      company: 'Your Company'
    },
    {
      name: 'SS-003',
      salary_structure: 'Contract Salary Structure',
      company: 'Your Company'
    }
  ] as SalaryStructure[],

  'hr_bh.api.payroll_inst.get_employees_for_payroll': [
    {
      name: 'EMP-001',
      employee_name: 'John Doe',
      department: 'Finance',
      designation: 'Financial Analyst'
    },
    {
      name: 'EMP-002',
      employee_name: 'Jane Smith',
      department: 'HR',
      designation: 'HR Specialist'
    },
    {
      name: 'EMP-003',
      employee_name: 'Robert Johnson',
      department: 'IT',
      designation: 'Software Developer'
    },
    {
      name: 'EMP-004',
      employee_name: 'Emily Brown',
      department: 'Marketing',
      designation: 'Marketing Manager'
    }
  ] as Employee[],

  'logout': { message: 'User logged out successfully' }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API request function
export const mockRequest = async (options: {
  url: string;
  method?: string;
  params?: Record<string, any>;
}) => {
  console.log(`[DEV] Mock API call: ${options.url}`, options);

  // Add realistic delay to simulate network request
  await delay(Math.random() * 500 + 300);

  // Extract method name from URL if it's an API method call
  let methodName = options.url;
  if (methodName.startsWith('/api/method/')) {
    methodName = methodName.replace('/api/method/', '');
  }

  // Check if we have mock data for this method
  if (mockData[methodName]) {
    return mockData[methodName];
  }

  // If no mock data exists, throw an error
  throw new Error(`No mock data available for ${methodName}`);
};