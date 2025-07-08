// models/Client.js
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  title: String,
  clientName: String,
  mobile: String,
  branch: String,
  branchName: String,
  address1: String,
  address2: String,
  pinCode: String,
  state: String,
});

export default mongoose.models.Client || mongoose.model("Client", clientSchema);
