import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  mobile: String,
  otp: String,
  createdAt: { type: Date, expires: "10m", default: Date.now },
});
export default mongoose.models.ClientOtp || mongoose.model("ClientOtp", otpSchema);
