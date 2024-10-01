import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['IT_ADMIN', 'IT_USER_NORMAL'],
    default: 'IT_USER_NORMAL', // Set default role
  },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
});

// Remove the required constraint for the role field
userSchema.path('role').required(false);

export default mongoose.model('User', userSchema);
