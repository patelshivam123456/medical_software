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

const OrderSchema = new mongoose.Schema({
  products: [
    {
      productId: String,
      name: String,
      company: String,
      salt: String,
      batch: String,
      expiry: String,
      quantity: Number,
    },
  ],
  personalDetails: {
    name: String,
    mobile: String,
    address1: String,
    address2: String,
    pincode: String,
    state: String,
  },
  paymentDetails: PaymentDetailsSchema,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
