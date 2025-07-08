import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

// Prevent model overwrite error in dev
export const User = mongoose.models.User || mongoose.model('User', UserSchema)
