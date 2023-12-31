import mongoose, { Schema, model, models } from "mongoose";

const paymentSchema = new mongoose.Schema({
  clientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  paymentDate: { type: Date, default: Date.now },
  transactionID: { type: String, required: true }, 
  orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders' ,required: true  },
  paymentMethod: {
    type: String,
    enum: ['1', '2', '3', '4', '5', '6'], //cash = 1, kpay = 2, ayapay = 3, wavemoney = 4, cbpay = 5, others = 6
    required: true,
  },
  status: { type: String, enum: ['0', '1'], required: true }, //pending = 0, successful = 1,
  screenshot: { type: String, default: null }, // Can be null if paid by cash
  note: { type: String },
});

export const Payment =  models?.Payment || mongoose.model('Payment', paymentSchema);


