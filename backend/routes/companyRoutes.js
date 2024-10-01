import express from 'express';
import {
  approveCompany,
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from '../controllers/companyController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Company
router.post('/', authenticate, createCompany);

// Get Companies for Normal User
router.get('/', authenticate, getCompanies);

// Update Company
router.put('/:id', authenticate, updateCompany);

// Delete Company
router.delete('/:id', authenticate, deleteCompany);

// Approve Company
router.put(
  '/:id/approve',
  authenticate,
  authorize(['IT_ADMIN']),
  approveCompany
);

export default router;
