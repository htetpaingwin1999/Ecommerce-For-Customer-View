import { mongooseConnect } from '../../lib/mongoose';
import { Client } from '../../models/Client';
import {generateOTP} from "../helper"
import bcrypt from 'bcrypt';
import emailjs from 'emailjs-com';

// Call the function to send the test email
export default async function handle(req, res) {
  if (req.method == 'POST') {

    try {
      await mongooseConnect();

      const { fullName, email, password } = req.body;

      // Check if the user already exists in MongoDB
      const userExists = await Client.findOne({ email });
      //return res.status(200).json({ success: true, otpCode: userExists.otp, otpExpiresAt: userExists.otpExpiresAt });

      if (userExists) {
        // User already exists, return an error response
        if (userExists.otpVerifiedAt !== null) {
              // Generate a new OTP code and update the otp and otpExpiresAt attributes

          const otpCode = generateOTP();
          
          const otpExpirationTime = new Date();
          otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 5);
      
          // Update the user document in the database with the new otpCode and otpExpiresAt
          await Client.findByIdAndUpdate(userExists._id, {
            otp: otpCode,
            otpExpiresAt: otpExpirationTime,
          });
      
          // Return the new OTP code in the response
          return res.status(200).json({ success: true, otpCode: otpCode, otpExpiresAt:otpExpirationTime  });
        }else{
          return res.status(400).json({ error: 'User already exists and otp is also verified in line 38' });

        }
      }

      const otpCode = generateOTP();
      
      // If the control reaches here, it means passwords match and user does not exist, proceed with creating the client account
      // Your code to create the client account in MongoDB goes here

      // Example code to create a new client in MongoDB
      
      const hashedPassword = await bcrypt.hash(password, 10); // Use a salt factor of 10
      
      const otpExpirationTime = new Date();
      otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 5);

      const newClient = new Client({
        fullName,
        email,
        password: hashedPassword,
        otp: otpCode,
        OtpVerifiedAt: null,
        otpExpiresAt: otpExpirationTime,
        remember_token: null
      });
      
      // Call the function to send the test email
     
      // Save the new client to the database
      await newClient.save();

      // Return a success response
      return res.status(200).json({ success: true, otpCode: otpCode, otpExpiresAt: otpExpirationTime });
    } catch (error) {
      // Handle any errors that occur during the database operations or account creation
      console.error('Error during signup in line 74:', error);

      // Return an error response
      return res.status(500).json({ error: 'Something went wrong. Please try again later in line 77' });
    }
  }

  if (req.method == 'PUT') {
    try {
      await mongooseConnect();
      const { email } = req.body;
      // Check if the user exists in MongoDB
      const userExists = await Client.findOne({ email });
      // res.json(userExists);

      if (userExists) {
        // Update the otpVerifiedAt field to the current timestamp
        const OtpVerifiedAt = new Date();
        const fullName = "Hla Hla";
        const updatedUser = await Client.findOneAndUpdate(
          { _id: userExists._id },
          { $set: { fullName, OtpVerifiedAt } }, // Use $set to update specific fields
          { new: true }
        );
      

        return res.status(200).json({ updatedUser});
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      // Handle any errors that occur during the database operations
      console.error('Error during OTP verification:', error);

      // Return an error response
      return res.status(500).json({ error: 'Something went wrong. Please try again later' });
    }
  }
  res.setHeader('Allow', ['POST']);
  return res.status(405).end('Method Not Allowed');
}
