// models/PurchaseReturn.js
import mongoose from 'mongoose';

const purchaseReturnSchema = new mongoose.Schema({
  returnBillNo: { type: Number, required: true, unique: true },
  originalPurchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewPurchase' },
  oldbillNo: { type: Number, default: null },
  salesperson: { type: String },
  paymenttype: { type: String },
  ordertype: { type: String, default: "pending" },
  orderid: { type: String },
  invoiceDate: { type: Date, default: null },
  tablets: [
    {
      name: String,
      company: String,
      salt: String,
      category: String,
      quantity: Number,
      lessquantity: Number,
      free: Number,
      hsm: String,
      packing: String,
      batch: String,
      mg: String,
      expiry: String,
      price: Number,
      rate: Number,
      discount: Number,
      gst: Number,
      sgst: Number,
      cgst: Number,
      total: Number,
      strips: Number,
      mrp: Number,
      mg: String,
    },
  ],
  discount: { type: Number },
  gst: { type: Number },
  cgst: { type: Number },
  sgst: { type: Number },
  title: { type: String },
  clientName: { type: String },
  mobile: { type: String },
  branch: { type: String },
  branchName: { type: String },
  address1: { type: String },
  address2: { type: String },
  pinCode: { type: String },
  state: { type: String },
  grandtotal: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  paymentDate: { type: Date, default: null },
  returnDate: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.models.PurchaseReturn || mongoose.model('PurchaseReturn', purchaseReturnSchema);
