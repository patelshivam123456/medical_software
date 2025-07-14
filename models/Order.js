import mongoose from 'mongoose';

const PaymentDetailsSchema = new mongoose.Schema({
    
  type: {
    type: String,
    enum: ['cod', 'online'],
    required: true
  },
  transactionId: {
    type: String,
    default: ''
  }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  productId: String,
  name: String,
  company: String,
  salt: String,
  batch: String,
  expiry: String,
  quantity: Number,
  price: Number,         // 💡 Added: price per unit
  total: Number         // 💡 Added: quantity * rate
}, { _id: false });

const PersonalDetailsSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  address1: String,
  address2: String,
  pincode: String,
  state: String,
  registeredMobile: {
    type: String,
    required: true
  },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    registeredMobile: {
      type: String,
      required: true
    }, // ✅ top-level, not inside paymentDetails
  
    products: [ProductSchema],
    personalDetails: PersonalDetailsSchema,
    paymentDetails: PaymentDetailsSchema,
  
    grandTotal: Number,
    cgst: Number,
    sgst: Number,
    finalAmount: Number,
    submitstatus:String,
  
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
