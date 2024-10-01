import Company from '../models/Company.js';

// Create Company
export const createCompany = async (req, res) => {
  console.log('Request Body:', req.body); // Add this to log the incoming request body
  const { name, address } = req.body;

  if (!name || !address) {
    return res.status(400).json({ message: 'Name and address are required.' });
  }

  const newCompany = new Company({
    name,
    address,
    created_by: req.user.id,
    status: req.user.role === 'IT_ADMIN' ? 'APPROVED' : 'UNAPPROVED',
  });

  try {
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read Company (Get all companies for normal user)
export const getCompanies = async (req, res) => {
  const { role, id } = req.user; // Get role and ID of the logged-in user
  const { createdBy, companyName } = req.query; // Get filter query parameters

  try {
    let query = {};

    // Admin can filter companies; normal users can only see their own
    if (role !== 'IT_ADMIN') {
      query.created_by = id; // Normal users can only see their companies
    }

    // Apply filters if provided
    if (createdBy) {
      query.created_by = createdBy;
    }
    if (companyName) {
      query.name = { $regex: companyName, $options: 'i' }; // Case-insensitive match
    }

    const companies = await Company.find(query);
    res.json({ companies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE COMPANY
export const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if the user is authorized to update the company
    if (
      req.user.role !== 'IT_ADMIN' &&
      company.created_by.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update company fields
    company.name = name || company.name;
    company.address = address || company.address;
    await company.save();

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMPANY
export const deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if the user is authorized to delete the company
    if (
      req.user.role !== 'IT_ADMIN' &&
      company.created_by.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await company.remove();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE COMPANY

export const approveCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Only admins can approve companies
    if (req.user.role !== 'IT_ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    company.status = 'APPROVED';
    await company.save();

    res.json({ message: 'Company approved', company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchCompanies = async () => {
  const token = localStorage.getItem('token');

  try {
    // Get user details
    const userResponse = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRole(userResponse.data.role);

    // Fetch companies (admin will see all, normal users see their own)
    const response = await api.get('/companies', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCompanies(response.data.companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    if (error.response.status === 401) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
    }
  }
};
