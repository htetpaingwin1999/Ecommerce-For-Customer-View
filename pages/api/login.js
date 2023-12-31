import { mongooseConnect } from '../../lib/mongoose';
import { Client } from '../../models/Client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  try{  
    if (method === 'POST') {
      const {email, password} = req.body;
      let user = await Client.findOne({ email }).select('+password');

      if (!user) {
        // User does not exist or invalid credentials, return an error response
        return res.status(401).json({ error: 'Authentication failed user does not exists' });
      }
      else{
        //res.json(user.password)
        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          // Password does not match, return an error response
          return res.status(401).json({ error: 'Authentication failed' });
        }

        // If the control reaches here, it means the user exists and the password is correct

        // Generate a JWT token to use as a session token

        const token = jwt.sign({ userId: user._id }, process.env.YOUR_SECRET_KEY, { expiresIn: '1h' });

        const userName = user.fullName;
        const userID = user._id;
        const __v = user.__v;
        // Return the token in the response
        return res.status(200).json({ token, userName, userID, __v });
      }
    }
  } catch (error) {
    // Handle any errors that occur during the database operations or authentication
    // console.error('Error during login:', email);

    // Return an error response
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
}
