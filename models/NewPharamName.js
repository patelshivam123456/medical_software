// models/Client.js
import mongoose from "mongoose";

const newPharamNameSchema = new mongoose.Schema({
  clientName: String,
  mobile: String,
  branch: String,
  branchName: String,
  address1: String,
  address2: String,
  pinCode: String,
  state: String,
  email:String,
  accountDetails:String,
  accountNumber:String,
  accountIfscCode:String,
  gstIn:String,
});

// Prevent duplicate clientName + mobile
newPharamNameSchema.index({ clientName: 1 }, { unique: true });

export default mongoose.models.NewPharamName || mongoose.model("NewPharamName", newPharamNameSchema);
