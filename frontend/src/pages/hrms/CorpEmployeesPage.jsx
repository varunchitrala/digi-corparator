import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { EmployeeStatusBadge } from '../../components/hrms/EmployeeStatusBadge';
import { Plus } from 'lucide-react';

export const CorpEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: 'Amit',
    last_name: 'Verma',
    email: 'amit.verma@demomunicipal.gov.in',
    mobile: '9822099112',
    employment_type: 'PERMANENT',
    basic_salary: 50000
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/hrms/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/hrms/employees', formData);
      alert(`Employee Registered Successfully! Code: ${res.data.employee_code}`);
      setIsCreateOpen(false);
      fetchEmployees();
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Employee Master Directory..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            MUNICIPAL EMPLOYEE DIRECTORY
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Employee Master Directory</h2>
          <p className="text-xs text-slate-500">Manage municipal officers, staff, designations, postings, and employment status.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Register New Employee
        </Button>
      </div>

      <Table headers={['EMP Code', 'Employee Name', 'Department', 'Designation', 'Joining Date', 'Type', 'Status']}>
        {employees.map((e) => (
          <tr key={e.employee_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{e.employee_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{e.first_name} {e.last_name}</td>
            <td className="px-6 py-4 text-slate-600">{e.department_name || 'Water Works'}</td>
            <td className="px-6 py-4 text-slate-600">{e.designation_name || 'Executive Engineer'}</td>
            <td className="px-6 py-4 text-slate-500">{new Date(e.joining_date).toLocaleDateString()}</td>
            <td className="px-6 py-4 font-mono">{e.employment_type}</td>
            <td className="px-6 py-4">
              <EmployeeStatusBadge status={e.status} />
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register Municipal Employee">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
            <Input label="Last Name" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Official Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input label="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
          </div>
          <Select label="Employment Type" value={formData.employment_type} onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })} options={[
            { value: 'PERMANENT', label: 'Permanent Municipal Staff' },
            { value: 'CONTRACT', label: 'Contractual Staff' },
            { value: 'DAILY_WAGE', label: 'Daily Wage Staff' }
          ]} />
          <Input label="Basic Salary Structure (₹)" type="number" value={formData.basic_salary} onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Employee</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
