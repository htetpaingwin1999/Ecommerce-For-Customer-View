import mongoose, { Aggregate, model, models, Schema } from "mongoose";


const OrderSchema = new Schema({
  line_items: Object,
  line_discountbyamount: Object,   //
  clientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  phone: String,
  city: String,
  streetAddress: String,
  note: String,
  paid: Boolean,
  status: {
    type: Number,
    enum: [-1, 0, 1, 2, 3], // -1 cancel, 0 pending (wating list ပြ), 1 order တင်(admin ဘက်မှ confirmed ပြီး), 2 ငွေလွှဲပြီး , 3 ငွေလွှဲအောင်မြင်
    default: 0 // Default value is set to pending (0)
  }}, {
  timestamps: true,
});


export const Orders = models?.Orders || model('Orders', OrderSchema);
