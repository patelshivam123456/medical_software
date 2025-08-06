import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  billNo: { type: Number, required: true, unique: true },
  salesperson:{type:String},
  paymenttype:{type:String},
  ordertype:{type:String},
  orderid:{type:String},
  dispatchDate: {
    type: Date,
    default: null  
  },
  tablets: [
    {
      name: String,
      company: String,
      salt: String,
      category: String,
      quantity: Number,
      lessquantity: Number,
      free:Number,
      hsm:String,
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
      strips:Number
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
  email:{type:String},
  accountDetails:{type:String},
  accountNumber:{type:String},
  accountIfscCode:{type:String},
  gstIn:{type:String},
  grandtotal: { type: Number, required: true },

  // ✅ Payment tracking
  amountPaid: { type: Number, default: null },
  paymentDate: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.Bill || mongoose.model('Bill', billSchema);
