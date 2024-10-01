import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from './api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [nameFilter, setNameFilter] = useState(''); // Filter by company name
  const [createdByFilter, setCreatedByFilter] = useState(''); // Filter by user (for admin)
  const [role, setRole] = useState(''); // Store user's role (admin or normal user)
  const [users, setUsers] = useState([]); // To store users for dropdown filter
  const [loading, setLoading] = useState(false); // Loading state for fetching companies

  // For creating a new company
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyAddress, setNewCompanyAddress] = useState('');

  // Fetch user role and companies based on filters
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      // Fetch user details to get their role
      const userResponse = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(userResponse.data.role);

      // Fetch all companies with filters applied
      await fetchCompanies(token);

      // Fetch all users for the "Created By" dropdown (admin only)
      if (userResponse.data.role === 'IT_ADMIN') {
        await fetchUsers(token);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch companies or users.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all companies with filters
  const fetchCompanies = async (token) => {
    try {
      const response = await api.get('/companies', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          companyName: nameFilter, // Apply company name filter
          createdBy: createdByFilter, // Apply created by filter (admin only)
        },
      });
      setCompanies(response.data.companies);
    } catch (error) {
      throw new Error('Failed to fetch companies'); // Throw error for catch block
    }
  };

  // Fetch all users for the "Created By" dropdown
  const fetchUsers = async (token) => {
    try {
      const usersResponse = await api.get('/users/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersResponse.data); // Populate the users dropdown
    } catch (error) {
      throw new Error('Failed to fetch users'); // Throw error for catch block
    }
  };

  // Handle creating a new company
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post(
        '/companies',
        { name: newCompanyName, address: newCompanyAddress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewCompanyName(''); // Clear the input fields
      setNewCompanyAddress('');
      fetchCompanies(token); // Refresh the company list
      toast.success('Company created successfully!');
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Failed to create company.');
    }
  };

  // Handle deleting a company
  const handleDeleteCompany = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompanies(token);
      toast.success('Company deleted successfully!');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company.');
    }
  };

  // Handle approving a company (admin-only functionality)
  const handleApproveCompany = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(
        `/companies/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCompanies(token);
      toast.success('Company approved successfully!');
    } catch (error) {
      console.error('Error approving company:', error);
      toast.error('Failed to approve company.');
    }
  };

  useEffect(() => {
    fetchData(); // Fetch user role and companies on component mount
  }, [nameFilter, createdByFilter]); // Refetch companies when filters are updated

  if (loading) {
    return <div>Loading...</div>; // Show a loading state when fetching data
  }

  return (
    <div>
      <h2>Company Management</h2>

      {/* Form to Create a New Company */}
      <form onSubmit={handleCreateCompany} className='mb-4'>
        <div className='form-group mb-2'>
          <input
            type='text'
            placeholder='Company Name'
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            className='form-control'
            required
          />
        </div>
        <div className='form-group mb-2'>
          <input
            type='text'
            placeholder='Address'
            value={newCompanyAddress}
            onChange={(e) => setNewCompanyAddress(e.target.value)}
            className='form-control'
            required
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Add Company
        </button>
      </form>

      {/* Filter Inputs */}
      <div className='mb-4'>
        <select
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className='form-select mb-2'
        >
          <option value=''>Filter by Company Name</option>
          {companies.map((company) => (
            <option key={company._id} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>

        {role === 'IT_ADMIN' && (
          <select
            value={createdByFilter}
            onChange={(e) => setCreatedByFilter(e.target.value)}
            className='form-select mb-2'
          >
            <option value=''>Filter by Created By</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Table to List Companies */}
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>Company Name</th>
            <th scope='col'>Address</th>
            <th scope='col'>Status</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>{company.address}</td>
              <td>{company.status}</td>
              <td>
                <button
                  onClick={() => handleDeleteCompany(company._id)}
                  className='btn btn-danger btn-sm me-2'
                >
                  Delete
                </button>
                <Link
                  to={`/companies/edit/${company._id}`}
                  className='btn btn-warning btn-sm me-2'
                >
                  Edit
                </Link>
                {role === 'IT_ADMIN' && company.status === 'UNAPPROVED' && (
                  <button
                    onClick={() => handleApproveCompany(company._id)}
                    className='btn btn-success btn-sm'
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyManagement;
