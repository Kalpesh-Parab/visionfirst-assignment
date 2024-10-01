import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';

const EditCompany = () => {
  const { id } = useParams(); // Get the company ID from the URL
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get(`/companies/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName(response.data.name);
        setAddress(response.data.address);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompany();
  }, [id]);

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.put(
        `/companies/${id}`,
        { name, address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Company updated successfully!');
      navigate('/companies'); // Redirect back to company list
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  return (
    <div>
      <h2>Edit Company</h2>
      <form onSubmit={handleUpdateCompany}>
        <input
          type='text'
          placeholder='Company Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type='text'
          placeholder='Address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type='submit'>Update Company</button>
      </form>
    </div>
  );
};

export default EditCompany;
