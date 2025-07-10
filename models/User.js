// import mongoose from 'mongoose'

// const UserSchema = new mongoose.Schema({
//   mobile: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// })

// // Prevent model overwrite error in dev
// export const User = mongoose.models.User || mongoose.model('User', UserSchema)


import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginType: {
    type: String,
    enum: ['admin', 'sales', 'stockiest'],
    default: 'admin',
  },
}, {
  timestamps: true, // ✅ adds createdAt and updatedAt automatically
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);


