// api/register.js

import { MongoClient } from 'mongodb';
import firebase from './firebaseConfig';
import { mongooseConnect } from '../../lib/mongoose';
import { Client } from '../../models/Client';
import firebaseConfig from './firebaseConfig'; // Import the firebaseConfig object

export default async function handler(req, res) {
  const { name, phoneNumber } = req.body;

  try {
    // Reuse the existing MongoDB connection code
    await mongooseConnect();

    // Check if a client with the same phone number already exists
    const existingClient = await Client.findOne({ phoneNumber });
    res.status(200).json({ message: existingClient });
    if (existingClient) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    // Create a new client document in MongoDB
    const newClient = new Client({
      name,
      phoneNumber,
    });

    // Save the new client document
    await newClient.save();
    res.status(200).json({ message: 'S' });

    // Send OTP to the phone number using Firebase
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, firebaseConfig.recaptchaVerifier);

    // Store the verification ID in the client document
    newClient.verificationId = verificationId;
    await newClient.save();


    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
