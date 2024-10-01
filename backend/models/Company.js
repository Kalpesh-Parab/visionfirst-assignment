import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Company name is required'] },
  address: { type: String, required: [true, 'Company address is required'] },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['APPROVED', 'UNAPPROVED'],
    default: 'UNAPPROVED',
  },
});

export default mongoose.model('Company', companySchema);
