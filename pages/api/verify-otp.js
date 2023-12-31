// api/verifyOTP.js

import { MongoClient } from 'mongodb';
import firebase from './firebaseConfig';
import { mongooseConnect } from '../../lib/mongoose';
import { Client } from '../../models/Client';

export default async function handler(req, res) {
  const { phoneNumber, otpEntered } = req.body;

  try {
    // Reuse the existing MongoDB connection code
    await mongooseConnect();

    // Retrieve the stored client data from the database
    const collection = Client.collection;
    const storedClient = await collection.findOne({ phoneNumber });

    if (storedClient) {
      // Compare the entered OTP with the stored OTP
      const credential = firebase.auth.PhoneAuthProvider.credential(
        storedClient.verificationId,
        otpEntered
      );

      // Verify the OTP with Firebase
      const userCredential = await firebase.auth().signInWithCredential(credential);

      if (userCredential.user) {
        // OTP verification successful
        res.status(200).json({ message: 'OTP verification successful' });
      } else {
        // Invalid OTP
        res.status(401).json({ error: 'Invalid OTP' });
      }
    } else {
      // Client not found
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
