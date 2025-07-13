import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, unique: true, match: /^[6-9]\d{9}$/ },
  password: String,
  petName: String, // security question answer
  lastLogin: Date, // ✅ new field to store login time
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = function (pw) {
  return bcrypt.compare(pw, this.password);
};

export default mongoose.models.ClientUser || mongoose.model("ClientUser", userSchema);
