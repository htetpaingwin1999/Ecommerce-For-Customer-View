import { mongooseConnect } from '../../lib/mongoose';
import { Payment } from '../../models/Payment';

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

//   if (method === 'GET') {
//     if (req.query?.id) {
//       try {
//         const payment = await Payment.findById(req.query.id)
//           .populate('clientID', 'name email') // Populate user information
//           .populate('orderIds', 'orderNumber'); // Populate order information
//         res.json(payment);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch payment details.' });
//       }
//     } else {
//       try {
//         const payments = await Payment.find()
//           .populate('clientID', 'name email')
//           .populate('orderIds', 'orderNumber');
//         res.json(payments);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch payments.' });
//       }
//     }
//   }

  if (method === 'POST') {
    const {
      clientID,
      transactionID,
      orderID,
      paymentMethod,
      status,
      screenshot,
      note,
    } = req.body;
    // res.json(clientID+"-----"+
    //   transactionID+"-------"+
    //   orderID+"--------"+
    //   paymentMethod+"-------"+
    //   status+"------"+
    //   screenshot+"-----------"+
    //   note);
    try {
      const paymentDoc = await Payment.create({
        clientID,
        transactionID,
        orderID,
        paymentMethod,
        status,
        screenshot,
        note,
      });
      res.json(paymentDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create payment.' });
    }
  }

  // Add PUT and DELETE methods as needed
}
