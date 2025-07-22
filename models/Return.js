import mongoose from 'mongoose';

const returnBillSchema = new mongoose.Schema({
    billNo: { type: Number, required: false, default: null},
  newbillNo:{ type: Number, required: true, unique: true },
  salesperson:{type:String},
  returnperson:{type:String},
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
      returnquantity: Number,
      free:Number,
      hsm: { type: String, required: false, default: "" },
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
  discount: { type: Number , required: false, default: "" },
  gst: { type: Number },
  cgst: { type: Number },
  sgst: { type: Number },
  title: { type: String },
  clientName: { type: String },
  mobile: { type: String },
  branch: { type: String },
  branchName: { type: String },
  address1: { type: String },
  address2: { type: String, required: false, default: "" },
  pinCode: { type: String },
  state: { type: String },
}, { timestamps: true });

export default mongoose.models.Return || mongoose.model('Return', returnBillSchema);
