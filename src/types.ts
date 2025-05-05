export interface User {
  name: string;
  first_name: string;
  full_name: string;
  user_image: string;
  roles: string[];
}

export interface SalaryStructure {
  name: string;
  salary_structure: string;
  company: string;
}

export interface Employee {
  name: string;
  employee_name: string;
  department: string;
  designation: string;
}