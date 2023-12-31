import { mongooseConnect } from '../../lib/mongoose';
import { Client } from '../../models/Client';
import { generateOTP } from '../helper';
import bcrypt from 'bcrypt';

export default async function handle(req, res) {
  if (req.method === 'POST') {
    try {
      await mongooseConnect();

      const { email } = req.body;

      // Check if the user exists in MongoDB
      const userExists = await Client.findOne({ email });

      if (!userExists) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (userExists.otpVerifiedAt !== null) {
        // User OTP is already verified, return an error
        return res.status(400).json({ error: 'OTP is already verified for this user.' });
      }

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
      return res.status(200).json({ success: true, otpCode: otpCode, otpExpiresAt: otpExpirationTime });
    } catch (error) {
      // Handle any errors that occur during the OTP resending process
      console.error('Error during OTP resending:', error);
      return res.status(500).json({ error: 'Something went wrong while resending OTP. Please try again later.' });
    }
  }

  // If the request method is not POST, return a 405 Method Not Allowed response
  res.setHeader('Allow', ['POST']);
  return res.status(405).end('Method Not Allowed');
}