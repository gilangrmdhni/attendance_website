// src/components/EmployeeListItem.tsx
import { Employee } from '../store/types/employeeType'; 

interface EmployeeListItemProps {
  employee: Employee;
}

const EmployeeListItem = ({ employee }: EmployeeListItemProps) => {


  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="text-lg font-semibold">{employee.full_name}</h2>
        <p className="text-sm text-gray-500">{employee.position}</p>
      </div>
    </div>
  );
};

export default EmployeeListItem;
